"""Turn the Delta Collection price list (Excel) into src/data/products.json.

Run:  python3 scripts/build_products.py
Needs: pip install openpyxl

It cleans prices ("TZS 15,000" -> 15000), fixes typos, maps the 25 category
spellings onto the site's 18 sub-categories, guesses the brand from the name,
and gives every product a free-licence Unsplash photo that suits its type.
"""
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "data-source" / "Delta_Collection_Complete_Price_List.xlsx"
POOLS = json.loads((ROOT / "scripts" / "image-pools.json").read_text())
OUT = ROOT / "src" / "data" / "products.json"

TYPO_FIXES = {
    "Dove C ream Large Size": "Dove Cream Large Size",
    "Rayhaan Nucturno Elixir Perfume": "Rayhaan Nocturno Elixir Perfume",
    "Veet Gold Tumeric Scrub": "Veet Gold Turmeric Scrub",
    "Dissaar Hair Removal Spray": "Disaar Hair Removal Spray",
    "Daiman  Eden Zimaya Perfume": "Daiman Eden Zimaya Perfume",
    "FixDerma/ Fix & Shadow Sunscreen": "FixDerma Shadow Sunscreen",
    "FixDerma/ Fix & Shadow Sunscreen Spray": "FixDerma Shadow Sunscreen Spray",
}

# Raw category (lower-case) -> site sub-category slug
CATEGORY_MAP = {
    "serum": "serums",
    "moisturizer": "moisturizers",
    "face cream": "moisturizers",
    "sunscreen": "sunscreen",
    "face wash": "cleansers-toners",
    "facial cleanser": "cleansers-toners",
    "toner": "cleansers-toners",
    "face mask": "masks-face-scrubs",
    "face scrub": "masks-face-scrubs",
    "skincare treatment": "treatments",
    "body lotion": "body-lotions",
    "lotion": "body-lotions",
    "body cream": "body-lotions",
    "body oil": "body-oils",
    "scrub": "body-scrubs",
    "body scrub": "body-scrubs",
    "shower gel": "shower-gels",
    "soap": "soaps",
    "perfume": "perfumes",
    "body mist": "body-mists",
    "deodorant": "deodorants",
    "hair care": "hair-care",
    "hair removal": "hair-care",
    "lip gloss": "lips",
    "beauty supplement/drink": "beauty-drinks",
}

# Products whose sheet category is wrong, by (fixed) name
CATEGORY_OVERRIDES = {
    "EOS Original Body Lotion – Vanilla Cashmere": "body-lotions",
    "Palmer’s Body Cream OG": "body-lotions",
    "Face Mask with Kojic Acid & Turmeric": "masks-face-scrubs",
    "Arencia Face and Eye Moisturizer": "moisturizers",
    "St. Ives Face Scrub Original": "masks-face-scrubs",
    "Gentle Magic Scrub": "masks-face-scrubs",
}

SUBCATS = [
    # slug, name, group, image pool
    ("serums", "Serums", "face-care", "serum"),
    ("moisturizers", "Moisturizers & Face Creams", "face-care", "moisturizer"),
    ("sunscreen", "Sunscreen", "face-care", "sunscreen"),
    ("cleansers-toners", "Cleansers & Toners", "face-care", "cleanser"),
    ("masks-face-scrubs", "Masks & Face Scrubs", "face-care", "mask"),
    ("treatments", "Treatments & Spot Care", "face-care", "treatment"),
    ("body-lotions", "Body Lotions & Creams", "body-care", "lotion"),
    ("body-oils", "Body Oils", "body-care", "oil"),
    ("body-scrubs", "Body Scrubs", "body-care", "scrub"),
    ("shower-gels", "Shower Gels", "body-care", "shower"),
    ("soaps", "Soaps", "body-care", "soap"),
    ("perfumes", "Perfumes", "fragrance", "perfume"),
    ("body-mists", "Body Mists", "fragrance", "mist"),
    ("deodorants", "Deodorants", "personal-care", "deodorant"),
    ("hair-care", "Hair Care & Removal", "personal-care", "hair"),
    ("lips", "Lips", "personal-care", "lips"),
    ("beauty-drinks", "Beauty Drinks", "wellness", "drink"),
]
SUB = {s[0]: s for s in SUBCATS}

BRANDS = [
    "St. Ives", "Garnier", "Secret", "The Purest Glow", "SK", "Taskeen", "Qissa", "Eclaire",
    "FixDerma", "Derma", "Dot & Key", "Plum", "Simple", "Rayhaan", "Qaed Al Fursan", "Khair",
    "Barcode", "Beauty Milk", "Vaseline", "EOS", "Palmer’s", "Dove", "D&W", "Anua",
    "The Ordinary", "Foxtale", "Mallika", "Lattafa", "Arencia", "Estelin", "Dr Davey", "Disaar",
    "Bramley", "Sadoer", "Plix", "Dalia", "Gentle Magic", "An Abiyedh", "Istree", "Gluta",
    "Mayar", "Egyptian Magic", "Amira", "White Rush", "Seoul 1988", "Dr.Lolo", "Dr Rashel",
    "Veet", "F-Ber", "Dr Teals", "Miracle Glow", "Bondi Sands", "Eucerin", "Daiman",
    "Skin Doctor", "Snail White", "Heibah", "Medicube", "HaruHaru", "Mosouf", "Al Dirgham",
    "Green Tangerine", "Yellow Plus", "Princess", "Asante", "Brazilian", "Teriaq", "Dalal",
    "Angham", "Tretinoin", "Retinol", "88",
]
BRAND_RENAMES = {"Dalal": "Lattafa", "Angham": "Lattafa", "Mayar": "Lattafa", "Teriaq": "Lattafa",
                 "Tretinoin": "", "Retinol": "", "Brazilian": "", "88": "", "Princess": "",
                 "Yellow Plus": "Yellow Plus", "Dr.Lolo": "Dr. Lolo", "Dr Teals": "Dr Teal's"}

# Keywords that pick a better-fitting photo inside a pool
KEYWORD_IMAGES = {
    "coffee": ("scrub", [0, 1, 2, 3]),
    "sugar": ("scrub", [6, 7, 8]),
    "salt": ("scrub", [7, 8]),
}

DESCRIPTIONS = {
    "serums": "A concentrated face serum for targeted care. Apply a few drops to clean skin before moisturizer.",
    "moisturizers": "Daily face moisturizer to keep skin soft, smooth and hydrated. Use morning and night after cleansing.",
    "sunscreen": "Everyday sun protection for the face. Apply generously as the last step of your morning routine and reapply through the day.",
    "cleansers-toners": "Gentle face care for clean, fresh and balanced skin. Use morning and evening.",
    "masks-face-scrubs": "A treat for your face: use once or twice a week for smoother, brighter-looking skin.",
    "treatments": "Targeted care for specific skin concerns. Patch test first and follow the directions on the pack.",
    "body-lotions": "Rich body care that leaves skin soft and moisturized. Apply after your bath or shower.",
    "body-oils": "Nourishing body oil for a healthy, glowing finish. Massage into damp skin after bathing.",
    "body-scrubs": "Exfoliating body scrub that buffs away dull skin for a smooth, even glow. Use two to three times a week.",
    "shower-gels": "A refreshing shower gel for a clean, cared-for feeling every day.",
    "soaps": "Beauty soap for daily cleansing of face and body.",
    "perfumes": "A fragrance from our perfume collection. Message us on WhatsApp to ask about its scent notes.",
    "body-mists": "A light, fresh body mist to spray on through the day.",
    "deodorants": "Everyday underarm protection that keeps you feeling fresh.",
    "hair-care": "Personal care essentials for smooth hair and skin.",
    "lips": "Glossy, comfortable colour and shine for your lips.",
    "beauty-drinks": "A beauty drink to support your glow from within. Follow the directions on the pack.",
}

RX_NOTE = "Prescription-strength product. Please message us on WhatsApp before ordering."


def slugify(s):
    s = s.lower().replace("’", "").replace("'", "").replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def parse_price(v):
    if isinstance(v, (int, float)):
        return int(v)
    return int(re.sub(r"\D", "", str(v)))


def find_brand(name):
    for b in sorted(BRANDS, key=len, reverse=True):
        if name.lower().startswith(b.lower()):
            return BRAND_RENAMES.get(b, b)
    if "Lattafa" in name:
        return "Lattafa"
    return ""


def main():
    ws = openpyxl.load_workbook(XLSX).active
    rows = [r for r in list(ws.iter_rows(values_only=True))[1:] if r[1]]
    counters = {}
    used_slugs = set()
    products = []
    for no, raw_name, raw_cat, raw_price, _notes in rows:
        name = re.sub(r"\s+", " ", TYPO_FIXES.get(raw_name, raw_name).strip())
        name = TYPO_FIXES.get(name, name)
        sub = CATEGORY_OVERRIDES.get(name) or CATEGORY_MAP[raw_cat.strip().lower()]
        slug_, sub_name, group, pool_name = SUB[sub]
        pool = POOLS[pool_name]

        image_id = None
        for kw, (kpool, idxs) in KEYWORD_IMAGES.items():
            if kw in name.lower() and kpool == pool_name:
                k = counters.get(kw, 0)
                image_id = POOLS[kpool][idxs[k % len(idxs)]]
                counters[kw] = k + 1
                break
        if image_id is None:
            k = counters.get(pool_name, 0)
            image_id = pool[k % len(pool)]
            counters[pool_name] = k + 1

        slug = slugify(name)
        base, n = slug, 2
        while slug in used_slugs:
            slug, n = f"{base}-{n}", n + 1
        used_slugs.add(slug)

        desc = DESCRIPTIONS[sub]
        if name.lower().startswith("tretinoin"):
            desc = RX_NOTE + " " + desc

        products.append({
            "id": int(no),
            "slug": slug,
            "name": name,
            "brand": find_brand(name),
            "category": sub,
            "price": parse_price(raw_price),
            "image": f"https://images.unsplash.com/photo-{image_id}",
            "description": desc,
            "inStock": True,
            "isNew": int(no) > 160,  # the last rows of the sheet are the newest additions
            "tags": [],
        })

    categories = [
        {"slug": s, "name": n, "group": g, "sort": i}
        for i, (s, n, g, _p) in enumerate(SUBCATS)
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"categories": categories, "products": products},
                              ensure_ascii=False, indent=1))
    print(f"Wrote {len(products)} products, {len(categories)} categories -> {OUT}")


if __name__ == "__main__":
    main()
