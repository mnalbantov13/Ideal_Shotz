import os
from PIL import Image

def compress_image_to_target(input_path, output_path, target_kb=500, max_dim=2048):
    # Open the image
    img = Image.open(input_path)
    # Resize proportionally
    if img.size[0]<img.size[1]: #Vertical image   
        w_percent = max_dim / float(img.size[0])
        h_size = int(img.size[1] * w_percent)
        img_resized = img.resize((max_dim, h_size), Image.LANCZOS)
    else: #Horizontal image
        h_percent = max_dim / float(img.size[1])
        w_size = int(img.size[0] * h_percent)
        img_resized = img.resize((w_size, max_dim), Image.LANCZOS)

    # Start with high quality and decrease if needed
    quality = 85
    step = 5  # decrease by 5 each iteration
    while quality > 10:
        img_resized.save(
            output_path,
            format="WEBP",
            optimize=True,
            quality=quality,
            method=6,
            lossless=False
        )
        size_kb = os.path.getsize(output_path) / 1024
        if size_kb <= target_kb:
            break
        quality -= step

    print(f"Saved {output_path} at quality={quality}, size={size_kb:.1f} KB")

# Example usage
input_image = "1.jpg"
output_image = "images/Album/Astro.webp"

compress_image_to_target(input_image, output_image, target_kb=350, max_dim=2048)
