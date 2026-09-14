# Classical (non-AI) background removal for flat-lay clothing photos.
# Samples the four corners of each photo to estimate the background color,
# then makes any pixel close to that color transparent. Works well when
# the background is roughly uniform, even if it's not pure white.
#
# Usage:
#   pip install pillow --break-system-packages
#   python remove_bg.py
#
# Adjust TOLERANCE below if results look wrong: too LOW leaves background
# showing, too HIGH starts eating into the garment itself.

from PIL import Image
import os

FOLDER = "../bg_removal"   # adjust to wherever your JPGs live
TOLERANCE = 30                # try 15-50 depending on your lighting

def remove_background(input_path, output_path, tolerance=TOLERANCE):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    corners = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
    ]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            distance = ((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2) ** 0.5
            if distance < tolerance:
                pixels[x, y] = (r, g, b, 0)

    img.save(output_path, "PNG")


if __name__ == "__main__":
    for filename in os.listdir(FOLDER):
        if filename.lower().endswith((".jpg", ".jpeg", ".webp")):
            input_path = os.path.join(FOLDER, filename)
            output_path = os.path.join(FOLDER, filename.rsplit(".", 1)[0] + ".png")
            remove_background(input_path, output_path)
            print(f"{filename} -> {output_path}")