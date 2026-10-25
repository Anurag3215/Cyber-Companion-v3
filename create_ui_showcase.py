import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_showcase():
    brain_dir = r"C:\Users\hp\.gemini\antigravity\brain\36529df9-359d-4b9f-865f-314e812f8fd8"
    output_path = os.path.join(brain_dir, "cyber_companion_ui_showcase.png")

    screens = [
        {
            "file": os.path.join(brain_dir, "screen_dashboard_dark.png"),
            "title": "DASHBOARD (CYBER DARK)",
            "subtitle": "3D Defense Score · Orbital Rings · Quick Tools",
            "tag": "HOME TAB",
            "tag_color": (16, 185, 129), # Emerald
        },
        {
            "file": os.path.join(brain_dir, "screen_dashboard_top.png"),
            "title": "DASHBOARD (FROSTED LIGHT)",
            "subtitle": "Apple-Inspired Liquid Glass · Pale Mint Accents",
            "tag": "DUAL THEME",
            "tag_color": (56, 189, 248), # Cyan
        },
        {
            "file": os.path.join(brain_dir, "screen_link_inspected_result.png"),
            "title": "LIVE LINK INSPECTOR",
            "subtitle": "SSRF Guard · RFC1918 Private IP Block · Risk 98/100",
            "tag": "SSRF SHIELD",
            "tag_color": (239, 68, 68), # Coral Red
        },
        {
            "file": os.path.join(brain_dir, "screen_wifi_discovered.png"),
            "title": "WI-FI SECURITY SCANNER",
            "subtitle": "Passive 802.11 Radar · WPA3/WPA2 · PMF Frame Audit",
            "tag": "AIRSPACE RADAR",
            "tag_color": (45, 212, 191), # Teal
        },
        {
            "file": os.path.join(brain_dir, "screen_profile_tab.png"),
            "title": "PROFILE & CLOUD GATEWAY",
            "subtitle": "Zero-Trust Privacy Pledge · Render 24/7 Link",
            "tag": "CLOUD SENTINEL",
            "tag_color": (168, 85, 247), # Purple
        },
    ]

    # Canvas dimensions: 16:9 widescreen
    canvas_w = 3400
    canvas_h = 1900
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (11, 17, 33, 255))
    draw = ImageDraw.Draw(canvas)

    # Ambient radial gradient / glowing orbs on background
    # Emerald glow top-left, Cyan glow bottom-right
    glow_layer = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([-200, -200, 1000, 1000], fill=(16, 185, 129, 35))
    glow_draw.ellipse([canvas_w - 900, canvas_h - 900, canvas_w + 300, canvas_h + 300], fill=(56, 189, 248, 30))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(120))
    canvas.alpha_composite(glow_layer)

    # Fonts
    def get_font(size, bold=False):
        font_names = ["segoeuib.ttf" if bold else "segoeui.ttf", "arialbd.ttf" if bold else "arial.ttf"]
        for fn in font_names:
            try:
                return ImageFont.truetype(os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", fn), size)
            except:
                pass
        return ImageFont.load_default()

    font_title = get_font(64, bold=True)
    font_sub = get_font(28, bold=False)
    font_badge = get_font(22, bold=True)
    font_card_title = get_font(22, bold=True)
    font_card_sub = get_font(17, bold=False)
    font_card_tag = get_font(18, bold=True)
    font_footer = get_font(22, bold=False)

    # --- Header ---
    draw.text((canvas_w // 2, 70), "CYBER COMPANION v3", fill=(248, 250, 252), font=font_title, anchor="mt")
    draw.text((canvas_w // 2, 145), "Intelligent Zero-Trust Threat Defense Sentinel · Apple-Inspired Liquid Glass UI", fill=(52, 211, 153), font=font_sub, anchor="mt")

    # Feature badges pill row
    badges = [
        "100% DETERMINISTIC SCORING",
        "ZERO USER PII IN TELEMETRY",
        "PASSIVE 802.11 RADAR",
        "SSRF GUARD 24/7",
        "RENDER CLOUD GATEWAY",
    ]
    bx = 360
    for b in badges:
        bw = int(draw.textlength(b, font=font_badge)) + 30
        draw.rounded_rectangle([bx, 195, bx + bw, 235], radius=15, fill=(18, 28, 51), outline=(37, 56, 92), width=1)
        draw.text((bx + bw // 2, 215), b, fill=(148, 163, 184), font=font_badge, anchor="mm")
        bx += bw + 20

    # --- 5 Phone Mockups ---
    phone_w = 560
    phone_h = 1244
    total_phones_w = 5 * phone_w
    avail_gap = (canvas_w - total_phones_w) // 6
    top_y = 285

    for idx, sc in enumerate(screens):
        px = avail_gap + idx * (phone_w + avail_gap)
        py = top_y

        # Load screen image
        img = Image.open(sc["file"]).convert("RGBA")
        img_resized = img.resize((phone_w, phone_h), Image.Resampling.LANCZOS)

        # Phone mockup frame with rounded corners
        corner_radius = 42
        mask = Image.new("L", (phone_w, phone_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, phone_w, phone_h], radius=corner_radius, fill=255)

        # Soft drop shadow behind phone
        shadow_margin = 30
        shadow_layer = Image.new("RGBA", (phone_w + shadow_margin * 2, phone_h + shadow_margin * 2), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow_layer)
        shadow_draw.rounded_rectangle([shadow_margin, shadow_margin, phone_w + shadow_margin, phone_h + shadow_margin], radius=corner_radius, fill=(0, 0, 0, 160))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(20))
        canvas.alpha_composite(shadow_layer, (px - shadow_margin, py - shadow_margin + 12))

        # Paste phone screen with rounded mask
        canvas.paste(img_resized, (px, py), mask)

        # Delicate glass frame border around phone
        border_overlay = Image.new("RGBA", (phone_w, phone_h), (0, 0, 0, 0))
        border_draw = ImageDraw.Draw(border_overlay)
        border_draw.rounded_rectangle([0, 0, phone_w - 1, phone_h - 1], radius=corner_radius, outline=(255, 255, 255, 60), width=2)
        canvas.alpha_composite(border_overlay, (px, py))

        # Bottom label card below each phone
        card_y = py + phone_h + 20
        card_h = 145
        draw.rounded_rectangle([px, card_y, px + phone_w, card_y + card_h], radius=18, fill=(18, 28, 51), outline=(37, 56, 92), width=1)

        # Tag pill
        tag_text = sc["tag"]
        tag_w = int(draw.textlength(tag_text, font=font_card_tag)) + 24
        draw.rounded_rectangle([px + 20, card_y + 16, px + 20 + tag_w, card_y + 44], radius=10, fill=(sc["tag_color"][0]//5, sc["tag_color"][1]//5, sc["tag_color"][2]//5), outline=sc["tag_color"], width=1)
        draw.text((px + 20 + tag_w // 2, card_y + 30), tag_text, fill=sc["tag_color"], font=font_card_tag, anchor="mm")

        # Title & Subtitle
        draw.text((px + 20, card_y + 60), sc["title"], fill=(248, 250, 252), font=font_card_title)
        draw.text((px + 20, card_y + 95), sc["subtitle"], fill=(148, 163, 184), font=font_card_sub)

    # --- Footer ---
    draw.line([120, canvas_h - 90, canvas_w - 120, canvas_h - 90], fill=(37, 56, 92), width=1)
    draw.text((140, canvas_h - 55), "CYBER COMPANION v3 · PRODUCTION CLIENT (EXPO SDK 58 / REACT NATIVE 0.88)", fill=(100, 116, 139), font=font_footer, anchor="lm")
    draw.text((canvas_w - 140, canvas_h - 55), "LIVE VERIFIED ON PHYSICAL ANDROID HARDWARE (10BE5D0FFS0007U)", fill=(52, 211, 153), font=font_footer, anchor="rm")

    # Save
    canvas.save(output_path, "PNG", quality=95)
    print(f"Master showcase image saved successfully to: {output_path}")

if __name__ == "__main__":
    create_showcase()
