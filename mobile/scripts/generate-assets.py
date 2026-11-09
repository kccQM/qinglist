from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

BLUE_TOP = (130, 152, 255)
BLUE_BOTTOM = (90, 114, 238)
INK = (27, 34, 51)
MUTED = (125, 135, 155)
BG = (244, 246, 251)
WHITE = (255, 255, 255)


def gradient(size, top, bottom):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for y in range(size):
        t = y / max(1, size - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        draw.line([(0, y), (size, y)], fill=color + (255,))
    return img


def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=radius, fill=255
    )
    return mask


def draw_check(draw, points, color=WHITE, width=82):
    draw.line(points, fill=color, width=width, joint="curve")
    radius = width // 2
    for x, y in (points[0], points[-1]):
        draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color)


# Icon-only: gradient square, suitable for launcher masking.
size = 1024
icon = gradient(size, BLUE_TOP, BLUE_BOTTOM).convert("RGBA")
icon.putalpha(rounded_mask(size, 228))
d = ImageDraw.Draw(icon)
# A subtle highlight ring
d.ellipse([130, 130, 894, 894], outline=(255, 255, 255, 30), width=3)
draw_check(d, [(300, 526), (455, 681), (730, 354)], width=86)
icon.save(ASSETS / "icon-only.png")

# Adaptive foreground: transparent check inside safe zone.
foreground = Image.new("RGBA", (size, size), (0, 0, 0, 0))
fd = ImageDraw.Draw(foreground)
draw_check(fd, [(320, 520), (460, 660), (706, 386)], width=80)
foreground.save(ASSETS / "icon-foreground.png")

# Adaptive background.
background = gradient(size, BLUE_TOP, BLUE_BOTTOM)
background.save(ASSETS / "icon-background.png")

# Splash: soft background with logo and wordmark.
splash_size = 2732
splash = Image.new("RGB", (splash_size, splash_size), BG)
sd = ImageDraw.Draw(splash)
# soft decorative rings
sd.ellipse([1680, 250, 2550, 1120], outline=(224, 230, 244), width=3)
sd.ellipse([200, 2320, 740, 2860], outline=(230, 235, 246), width=2)
logo_size = 420
logo = icon.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
lx = (splash_size - logo_size) // 2
ly = 1010
splash.paste(logo, (lx, ly), logo)
font_title = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 150)
font_sub = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 52)
title = "轻清单"
subtitle = "把目标拆成今天"
tw = sd.textbbox((0, 0), title, font=font_title)
sw = sd.textbbox((0, 0), subtitle, font=font_sub)
sd.text(((splash_size - (tw[2] - tw[0])) // 2, 1510), title, font=font_title, fill=INK)
sd.text(((splash_size - (sw[2] - sw[0])) // 2, 1700), subtitle, font=font_sub, fill=MUTED)
splash.save(ASSETS / "splash.png")

print("assets generated")
