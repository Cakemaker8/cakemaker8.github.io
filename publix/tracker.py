# tracker.py
# Cakemaker8
# 11 August 2026
#
# Details are on the website, will need bs4, json, and pandas (usually need to do pip install bs4 pandas)


from bs4 import BeautifulSoup
import json
import pandas as pd

# Load new Publix page
with open("BOGO Deals_ Weekly Ad _ Publix Super Markets.html") as fp:
    soup = BeautifulSoup(fp)

# Load previous csv file to append to it or change the values within
data = pd.read_csv("publixtracker.csv")
df = pd.DataFrame(data)

print(df)

# The BOGOs are listed in a certain div, under lists
bogoSection = soup.find("div", id="bogo-grid")
bogo = bogoSection.find_all("li")
# Goes through the BOGOs
for items in bogo:
    # Gets the name, date, price, and picture path
    itemName = items.find("span", class_="p-text paragraph-md normal context--default color--null line-clamp title")
    itemDate = items.find("span", class_="valid-dates p-text paragraph-xxs normal context--default color--null line-clamp")
    itemPrice = items.find("span", class_="additional-info p-text paragraph-xs strong context--default color--null line-clamp")
    itemPic = items.find("div", class_="aspect-ratio-content")

    # Changes the picture path so that it is just the image.avif
    actualPic = itemPic.find("img").get("src")
    actualPic = actualPic.split("/")[-1]
    actualPic = actualPic.replace("jpg", "avif")
    actualPic = actualPic.replace("webp", "avif")
    if "no-image" in actualPic:
        actualPic = "img.avif"

    # As long as the name exists
    if itemName is not None:
        # If it is in the list
        if df['name'].eq(itemName.get_text(strip=True)).any():
            # If a price exists for the item, add it to the previous price and save it
            if itemPrice is not None:
                price = str(df.loc[df["name"].eq(itemName.get_text(strip=True)), "prices"].iloc[0])
                price = price+", "+itemPrice.get_text(strip=True)
                df.loc[df["name"].eq(itemName.get_text(strip=True)), "prices"] = price
            # If a date exists for the item, add it to the previous price and save it
            if itemDate is not None:
                date = str(df.loc[df["name"].eq(itemName.get_text(strip=True)), "dates"].iloc[0])
                date = date+", "+itemDate.get_text(strip=True)
                df.loc[df["name"].eq(itemName.get_text(strip=True)), "dates"] = date
        # If it does not exist in the list
        else:
            price = None
            date = None
            # Sets the price if there is one
            if itemPrice is not None:
                price = itemPrice.get_text(strip=True)
            # Sets the date if there is one
            if itemDate is not None:
                date = itemDate.get_text(strip=True)
            # Makes a new df, and appends it to the end of the list
            newDF = pd.DataFrame({"name":[itemName.get_text(strip=True)],"dates":[date],"prices":[price],"img":[actualPic]})
            df = pd.concat([df, newDF], ignore_index=True)

print(df)

# Saves as both csv and json
df.to_csv("publixtracker.csv", index=False)
df.to_json("publixtracker.json", orient='records', indent=4)