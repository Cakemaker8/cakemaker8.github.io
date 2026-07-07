# silksong_extractor.py
# Cakemaker8
# 7 July 2026
#
# This is a tool that can extract sprites, textures, audio, and video from the game Hollow Knight: Silksong
# It runs in the terminal, and saves all extracted files to a folder in the directory where this program is located
# It can also extract sprites from the custom tk2d sprite sheets
#
# Install all dependencies using pip install -r requirements.txt (make sure to use a virtual environment)
# This program has only been tested on Linux Mint 22.3 Cinnamon
# 
# This should not mess with the game files, but run at your own risk; make sure to make backups
# 
# I will probably not work on this again

import UnityPy
from PIL import Image, ImageDraw
import os
import re
import math

UnityPy.config.FALLBACK_UNITY_VERSION = "2022.3.0f1"

def save_unique_image(base_filename):
    name, ext = os.path.splitext(base_filename)
    counter = 1
    filename = base_filename
    while os.path.exists(filename):
        filename = f"{name}_{counter}{ext}"
        counter += 1
    return filename

def parsefile(opttype, env, fileloc):
    for obj in env.objects:
        # if obj.type.name not in objlist: objlist.append(obj.type.name)
        if obj.type.name == opttype and (obj.type.name == "Sprite" or obj.type.name == "Texture2D"):
            data = obj.parse_as_object()
            im = data.image
            foldername = opttype + "_" + fileloc
            if not os.path.exists(foldername): os.mkdir(foldername)
            filename = save_unique_image((foldername + "/" + data.m_Name + ".png"))
            im.save(filename)
        elif obj.type.name == opttype and obj.type.name == "AudioClip":
            data = obj.parse_as_object()
            for name, info in data.samples.items():
                foldername = opttype + "_" + fileloc
                if not os.path.exists(foldername): os.mkdir(foldername)
                filename = save_unique_image(f"{foldername}/{name}")
                with open(filename, "wb") as f:
                    f.write(info)
        # Understand this later, but it actually works
        elif obj.type.name == opttype and obj.type.name == "VideoClip":
            data = obj.parse_as_object()
            resource_name = os.path.basename(data.m_ExternalResources.m_Source)
            bundle = next(iter(env.files.values()))
            resource = bundle.files[resource_name]
            resource.Position = data.m_ExternalResources.m_Offset
            video = resource.read(data.m_ExternalResources.m_Size)
            foldername = opttype + "_" + fileloc
            if not os.path.exists(foldername): os.mkdir(foldername)
            filename = save_unique_image(f"{foldername}/{data.m_Name}.webm")
            with open(filename, "wb") as f:
                f.write(video)

# This is for extracting sprites from the bundles that only export the sprite sheet
# There are lots of unused code in here; it is being left behind since it was used in debugging,
# and this is not very functional
def parsemonobehaviour(env, fileloc):
    texturelookup = {}
    for obj in env.objects:
        if obj.type.name == "Texture2D":
            texturelookup[obj.path_id] = obj.parse_as_object()
    
    for obj in env.objects:
        if obj.type.name == "MonoBehaviour":
            data = obj.parse_as_dict()
            #print("\n", data['spriteDefinitions'][0], "\n", data['spriteDefinitions'][1])
            #debugatlas = {}
            for sprite in data["spriteDefinitions"]:
                texturepath = data["textures"][sprite["materialId"]]["m_PathID"]
                atlas = texturelookup[texturepath].image

                # if texturepath not in debugatlas:
                #     debugatlas[texturepath] = atlas.copy()
                
                # debug = debugatlas[texturepath]
                # draw = ImageDraw.Draw(debug)

                uvs = sprite["uvs"]
                u = [p["x"] for p in uvs]
                v = [p["y"] for p in uvs]
                left = min(u) * atlas.width
                right = max(u) * atlas.width
                top = (1 - max(v)) * atlas.height
                bottom = (1 - min(v)) * atlas.height

                left = math.floor(left)
                right = math.ceil(right)
                top = math.floor(top)
                bottom = math.ceil(bottom)

                # draw.rectangle((left, top, right, bottom), outline="red", width=2)
                # draw.text((left, top), sprite["name"], fill="yellow")

                img = atlas.crop((left, top, right, bottom))

                if sprite["flipped"]:
                    img = img.transpose(Image.Transpose.ROTATE_90)


                foldername = "SPRITE_" + fileloc
                if not os.path.exists(foldername): os.mkdir(foldername)
                filename = save_unique_image((foldername + "/" + sprite["name"] + ".png"))
                img.save(filename)

                # draw = ImageDraw.Draw(atlas)

                # draw.rectangle((left, top, right, bottom), outline="red", width=2)
                #atlas.save("test/atlas.png")
            # for pathid, img in debugatlas.items():
            #     img.save(f"test/{pathid}.png")

folderloc = ""
fileloc = ""
while True:
    print("Welcome to the content extractor for Silksong! Please select one of the following options:")
    print("1. Select main directory (must do before running anything else)\n2. Export contents of file\n3. Export contents of directory")
    print("4. Export sprites from atlas\n5. Exit")
    opt = input()
    match opt:
        case '1':
            print("Please type in the directory of the .bundle files you wish to extract:")
            folderloc = input()
            print("Directory: ", folderloc)
            if folderloc[-1] != '/': folderloc += '/'
        case '2':
            print("Please type in the name of the .bundle file you wish to extract:")
            fileloc = input()
            print("File: ", fileloc)
            if fileloc[0] == '/': fileloc = fileloc[1:]
            print("Which content type would you like to save? Options are:\n1. Texture2D\n2. Sprite\n3. AudioClip\n4. VideoClip\nType in the number:")
            optnum = input()
            opttype = ""
            match optnum:
                case '1':
                    opttype = "Texture2D"
                case '2':
                    opttype = "Sprite"
                case '3':
                    opttype = "AudioClip"
                case '4':
                    opttype = "VideoClip"
                case _:
                    print("Not an option, try something different")
            if opttype:
                print("Extracting all: ", opttype)
                env = UnityPy.load(os.path.join(folderloc, fileloc))
                parsefile(opttype, env, fileloc)
                print("Finished")
        case '3':
            print("Which content type would you like to save? Options are:\n1. Texture2D\n2. Sprite\n3. AudioClip\n4. VideoClip\nType in the number:")
            optnum = input()
            opttype = ""
            match optnum:
                case '1':
                    opttype = "Texture2D"
                case '2':
                    opttype = "Sprite"
                case '3':
                    opttype = "AudioClip"
                case '4':
                    opttype = "VideoClip"
                case _:
                    print("Not an option, try something different")
            if opttype:
                print("Extracting all: ", opttype)
                for file in os.listdir(folderloc):
                    if file[-6:] != "bundle":
                        pass
                        # for subfile in os.listdir(os.path.join(mainfold, file)):
                        #     env = UnityPy.load(os.path.join(mainfold, file, subfile))
                        #     parsefile(opttype, env, subfile)
                    elif (file[:15] == "textures_assets" or file[:10] == "herostatic") and opttype == "Sprite":
                        pass
                    elif (file[:5] == "fonts") and opttype == "Texture2D":
                        pass
                    else:
                        env = UnityPy.load(os.path.join(folderloc, file))
                        parsefile(opttype, env, file)
                print("Finished")
        case '4':
            print("Some .bundle files do not export the sprites. In order to see the individual sprites, this option can be used.")
            print("This may not work will all files, but can help gather some of the individual sprites.")
            print("Please type in the name of the .bundle file you wish to extract the sprites from:")
            fileloc = input()
            print("File: ", fileloc)
            if fileloc[0] == '/': fileloc = fileloc[1:]
            env = UnityPy.load(os.path.join(folderloc, fileloc))
            parsemonobehaviour(env, fileloc)
            print("Finished")
        case '5':
            print("Goodbye!")
            break
        case _:
            print("Please try again")
