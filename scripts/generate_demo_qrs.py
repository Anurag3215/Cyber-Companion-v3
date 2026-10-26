import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

artifact_dir = r"C:\Users\hp\.gemini\antigravity\brain\36529df9-359d-4b9f-865f-314e812f8fd8"
mobile_assets_dir = r"d:\cyber-companion-v3\apps\mobile\assets\demo-qrs"
os.makedirs(mobile_assets_dir, exist_ok=True)
os.makedirs(artifact_dir, exist_ok=True)

test_qrs = [
    {
        "id": "parking_quishing",
        "title": "1. Quishing Parking Meter Fraud",
        "subtitle": "Physical Sticker Replacement Vector",
        "payload": "http://city-parking-pay.quick-bill.info/pay?meter=982",
        "threat": "CRITICAL THREAT: Quishing & Credit Card Theft",
        "category": "QUISHING FRAUD",
        "color": "#EF4444",
        "rgb": (239, 68, 68)
    },
    {
        "id": "malware_apk",
        "title": "2. Android Malware APK Drive-By",
        "subtitle": "Fake Mandatory System Update",
        "payload": "http://update-android-security.com/system-patch.apk",
        "threat": "CRITICAL THREAT: Untrusted APK Sideloading",
        "category": "MALICIOUS APK",
        "color": "#EF4444",
        "rgb": (239, 68, 68)
    },
    {
        "id": "rogue_wifi",
        "title": "3. Rogue Wi-Fi Auto-Connect Trap",
        "subtitle": "Evil Twin Airspace Fake Hotspot",
        "payload": "WIFI:S:Free_Airport_VIP_WiFi;T:nopass;;",
        "threat": "HIGH RISK: Unencrypted MITM Airspace Eavesdropping",
        "category": "ROGUE WI-FI",
        "color": "#F59E0B",
        "rgb": (245, 158, 11)
    },
    {
        "id": "banking_phish",
        "title": "4. Banking Phishing Harvester",
        "subtitle": "Financial Portal Deceptive Lookalike",
        "payload": "http://secure-login.chase-verify-billing.com/auth",
        "threat": "CRITICAL THREAT: Plain HTTP Banking Phish",
        "category": "PHISHING PORTAL",
        "color": "#EF4444",
        "rgb": (239, 68, 68)
    },
    {
        "id": "safe_portal",
        "title": "5. Legitimate Corporate Service",
        "subtitle": "EV TLS 1.3 Certified Cloud Portal",
        "payload": "https://legitimate-service.com/portal",
        "threat": "SAFE: Verified Domain & TLS 1.3 Certificate",
        "category": "VERIFIED SECURE",
        "color": "#10B981",
        "rgb": (16, 185, 129)
    }
]

# Generate individual QR images with high resolution
for item in test_qrs:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=3,
    )
    qr.add_data(item["payload"])
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    
    path_mobile = os.path.join(mobile_assets_dir, f"demo_qr_{item['id']}.png")
    img.save(path_mobile)
    
    path_artifact = os.path.join(artifact_dir, f"demo_qr_{item['id']}.png")
    img.save(path_artifact)

print("Individual QR images generated successfully.")

# Now create a master Presentation Deck Card Image (1400 x 1850 px)
# with cyber dark background, glass cards, scannable QR codes, and clear labels
width = 1400
height = 2050
bg_color = (7, 13, 24)       # Deep cyber dark #070D18
card_bg = (14, 27, 56)       # Dark glass blue #0E1B38
border_color = (56, 189, 248) # Cyan accent
text_white = (255, 255, 255)
text_cyan = (56, 189, 248)
text_gray = (148, 163, 184)
text_light = (203, 213, 225)

deck = Image.new("RGB", (width, height), bg_color)
draw = ImageDraw.Draw(deck)

# Try to use standard truetype font or fallback to default
try:
    font_large_title = ImageFont.truetype("arial.ttf", 46)
    font_title = ImageFont.truetype("arial.ttf", 30)
    font_sub = ImageFont.truetype("arial.ttf", 22)
    font_badge = ImageFont.truetype("arialbd.ttf", 20)
    font_code = ImageFont.truetype("consola.ttf", 20)
    font_desc = ImageFont.truetype("arial.ttf", 19)
except Exception:
    font_large_title = font_title = font_sub = font_badge = font_code = font_desc = ImageFont.load_default()

# Header
draw.rectangle([0, 0, width, 180], fill=(11, 21, 40))
draw.line([(0, 180), (width, 180)], fill=border_color, width=2)

draw.text((60, 35), "CYBER COMPANION v3 — LIVE CLIENT TEST VECTORS", fill=text_cyan, font=font_large_title)
draw.text((60, 95), "Scan these QR codes using the Cyber Companion app to demonstrate live real-time threat detection", fill=text_light, font=font_sub)
draw.text((60, 130), "Zero False Positives * Deterministic Security Engine * Instant Threat Verdicts", fill=text_gray, font=font_desc)

# Render each test card
card_top = 210
card_height = 340
spacing = 25

for i, item in enumerate(test_qrs):
    y = card_top + i * (card_height + spacing)
    
    # Draw card background
    draw.rounded_rectangle(
        [50, y, width - 50, y + card_height],
        radius=20,
        fill=card_bg,
        outline=item["rgb"],
        width=2
    )
    
    # Load QR code image and resize to 260x260
    qr_path = os.path.join(artifact_dir, f"demo_qr_{item['id']}.png")
    qr_img = Image.open(qr_path).resize((260, 260), Image.Resampling.LANCZOS)
    
    # Paste QR code onto card with white border
    qr_x = 80
    qr_y = y + 40
    draw.rounded_rectangle([qr_x - 6, qr_y - 6, qr_x + 266, qr_y + 266], radius=12, fill=(255, 255, 255))
    deck.paste(qr_img, (qr_x, qr_y))
    
    # Text details on right side
    tx = 380
    ty = y + 35
    
    # Category Pill
    pill_text = f"  {item['category']}  "
    draw.rounded_rectangle([tx, ty, tx + 220, ty + 32], radius=10, fill=item["rgb"])
    draw.text((tx + 12, ty + 5), item["category"], fill=(255, 255, 255), font=font_badge)
    
    # Card Title
    draw.text((tx, ty + 46), item["title"], fill=text_white, font=font_title)
    draw.text((tx, ty + 88), item["subtitle"], fill=text_gray, font=font_sub)
    
    # Payload Box
    pay_box_y = ty + 125
    draw.rounded_rectangle([tx, pay_box_y, width - 80, pay_box_y + 55], radius=10, fill=(7, 13, 24), outline=(40, 70, 120), width=1)
    draw.text((tx + 16, pay_box_y + 16), item["payload"], fill=text_cyan, font=font_code)
    
    # Expected Threat Verdict
    draw.text((tx, ty + 195), "SYSTEM VERDICT:", fill=text_gray, font=font_desc)
    draw.text((tx + 165, ty + 193), item["threat"], fill=item["rgb"], font=font_sub)
    
    # Security note
    if "SAFE" in item["category"]:
        note = "Verified Safe: Clean reputation, TLS 1.3 encrypted, authentic trust anchor."
    elif "APK" in item["category"]:
        note = "Detected: Suspicious binary payload (.apk). Device sideloading danger flagged."
    elif "QUISHING" in item["category"]:
        note = "Detected: Insecure HTTP, unverified parking subdomain, credential harvesting."
    elif "WI-FI" in item["category"]:
        note = "Detected: Unencrypted airspace beacon (nopass). MITM & Evil Twin vulnerability."
    else:
        note = "Detected: Banking credential phishing lookalike with deceptive path & insecure scheme."
    draw.text((tx, ty + 235), note, fill=text_light, font=font_desc)

deck_path_artifact = os.path.join(artifact_dir, "client_demo_qr_threat_deck.png")
deck_path_mobile = os.path.join(mobile_assets_dir, "client_demo_qr_threat_deck.png")
deck.save(deck_path_artifact, quality=95)
deck.save(deck_path_mobile, quality=95)

print("Master Client Demo Threat Deck Image generated successfully at:")
print(deck_path_artifact)
