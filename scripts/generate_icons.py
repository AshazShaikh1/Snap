import os
from PIL import Image

def generate_icons():
    # Base source
    base_image_path = r"C:\Users\gamin\.gemini\antigravity\brain\d427bd0b-5b49-488c-8237-3fe1bf1df433\snap_base_logo_1773000690423.png"
    target_dir = r"C:\Users\gamin\OneDrive\Desktop\snap\assets\images"
    
    if not os.path.exists(target_dir):
        os.makedirs(target_dir, exist_ok=True)
        
    try:
        base_img = Image.open(base_image_path).convert("RGBA")
    except Exception as e:
        print(f"Error loading base image: {e}")
        return

    # 1. Main Icon (1024x1024)
    icon_img = base_img.resize((1024, 1024), Image.Resampling.LANCZOS)
    icon_img.save(os.path.join(target_dir, "icon.png"))
    print("Generated icon.png")
    
    # 2. Splash Icon (Base image is fine, maybe resize to ensure it fits well, e.g., 500x500 within transparent)
    # Splash is background black natively in app.json, so we can just use the icon
    splash_size = 1000
    splash_img = base_img.resize((splash_size, splash_size), Image.Resampling.LANCZOS)
    splash_img.save(os.path.join(target_dir, "splash-icon.png"))
    print("Generated splash-icon.png")
    
    # 3. Android Adaptive Background (1080x1080 solid black)
    background_img = Image.new("RGBA", (1080, 1080), (0, 0, 0, 255))
    background_img.save(os.path.join(target_dir, "android-icon-background.png"))
    print("Generated android-icon-background.png")
    
    # 4. Android Adaptive Foreground (1080x1080, with logo in middle safe zone)
    # Adaptive foreground safe zone is a circle of diameter 72dp out of 108dp.
    # So the logo should be about 66% of the 1080x1080 image to be safe.
    # Let's resize logo to 700x700 and paste in center of a transparent 1080x1080 image
    # Note: We need to strip the black background to make it transparent for the foreground
    
    # Make black transparent
    fg_img = base_img.copy()
    datas = fg_img.getdata()
    new_data = []
    # threshold for black
    for item in datas:
        # if r, g, b are close to 0
        if item[0] < 30 and item[1] < 30 and item[2] < 30:
            new_data.append((0, 0, 0, 0)) # transparent
        else:
            new_data.append(item)
    fg_img.putdata(new_data)
    
    fg_logo_size = 600
    fg_img_resized = fg_img.resize((fg_logo_size, fg_logo_size), Image.Resampling.LANCZOS)
    
    adaptive_fg = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0))
    offset = ((1080 - fg_logo_size) // 2, (1080 - fg_logo_size) // 2)
    adaptive_fg.paste(fg_img_resized, offset, fg_img_resized)
    
    adaptive_fg.save(os.path.join(target_dir, "android-icon-foreground.png"))
    print("Generated android-icon-foreground.png")

if __name__ == "__main__":
    generate_icons()
