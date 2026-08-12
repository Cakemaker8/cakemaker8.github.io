# imagesplit.py
# Cakemaker8
# 11 August 2026
#
# Details are on the website, will need pandas, os, shutil (usually need to do pip install pandas)

import pandas as pd
import os
import shutil

data = pd.read_csv("publixtracker.csv")
df = pd.DataFrame(data)

for img in df["img"]:
    # Makes sure the image actually exists
    if pd.notna(img):
        # If it ends in jpg
        if os.path.exists(os.path.join("BOGO Deals_ Weekly Ad _ Publix Super Markets_files", img[:-4]+"jpg")):
            shutil.copyfile(os.path.join("BOGO Deals_ Weekly Ad _ Publix Super Markets_files", img[:-4]+"jpg"), os.path.join("images", img[:-4]+"avif"))
        # If it ends in avif
        if os.path.exists(os.path.join("BOGO Deals_ Weekly Ad _ Publix Super Markets_files", img[:-4]+"avif")):
            shutil.copyfile(os.path.join("BOGO Deals_ Weekly Ad _ Publix Super Markets_files", img[:-4]+"avif"), os.path.join("images", img[:-4]+"avif"))
        # If it ends in webp
        if os.path.exists(os.path.join("BOGO Deals_ Weekly Ad _ Publix Super Markets_files", img[:-4]+"webp")):
            shutil.copyfile(os.path.join("BOGO Deals_ Weekly Ad _ Publix Super Markets_files", img[:-4]+"webp"), os.path.join("images", img[:-4]+"avif"))
