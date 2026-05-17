#!/usr/bin/env python3
"""
Extracts artwork front matter from the 73 static HTML files
and generates _artworks/*.md files for Jekyll.
"""
import os
import re
import glob

REPO = "/Users/marekkultys/Git Repos/melayerka_art"
OUT  = os.path.join(REPO, "_artworks")

# Series mapping: filename prefix -> series id (must match _data/series.yml)
SERIES = {
    "01": "Dead",
    "02": "Beautiful Painting of War",
    "03": "Grimm Tales",
    "04": "Women of the 19th Century",
    "05": "Feral Children",
    "06": "Mars",
}

# Year map built from by_year.html data
# Key: artwork basename (no extension), value: year (int)
YEAR_MAP = {
    # 2015
    "04_karolina-sobanska-02": 2015,
    "04_anais-aubert-02": 2015,
    "04_juliette-drouet-01": 2015,
    # 2014
    "04_laura-dAbrantes-01": 2014,
    "04_maria-walewska-01": 2014,
    "04_rachel-felix-01": 2014,
    "04_george-sand-03": 2014,
    "04_ewelina-hanska-01": 2014,
    "04_delfina-potocka-02": 2014,
    "04_lola-montez-05": 2014,
    "04_lola-montez-06": 2014,
    "04_anais-aubert-01": 2014,
    "04_apollonie-sabatier-02": 2014,
    "04_laura-dAbrantes-02": 2014,
    "04_painting-02": 2014,
    "06_martian-rock-01": 2014,
    "06_martian-crater-01": 2014,
    "06_martian-rock-02": 2014,
    "06_martian-diptych": 2014,
    "06_martian-diptych-A": 2014,
    "06_martian-diptych-B": 2014,
    # 2013
    "06_mars-01": 2013,
    "06_mars-02": 2013,
    "06_mars-03": 2013,
    # 2012
    "05_genie-wiley-01": 2012,
    "05_genie-wiley-02": 2012,
    "05_genie-wiley-03": 2012,
    "05_genie-wiley-04": 2012,
    "05_ivan-mishukov-01": 2012,
    "05_john-ssebunya-01": 2012,
    "05_kamala-01": 2012,
    "05_memmie-le-blanc-01": 2012,
    "05_peter-wild-boy-01": 2012,
    "05_discovery-of-moses-01": 2012,
    "05_discovery-of-moses-02": 2012,
    "05_untitled-01": 2012,
    "04_delfina-potocka-01": 2012,
    "04_lola-montez-03": 2012,
    "04_aimee-desclee-01": 2012,
    "04_untitled-01": 2012,
    "04_george-sand-02": 2012,
    "04_lola-montez-02": 2012,
    "04_marie-duplessis-01": 2012,
    # 2011
    "04_lola-montez-04": 2011,
    "04_lola-montez-01": 2011,
    "04_apollonie-sabatier-01": 2011,
    "04_karolina-sobanska-01": 2011,
    "04_george-sand-01": 2011,
    "03_allerleirauch": 2011,
    "03_wichtelmaenner": 2011,
    "03_marienkind": 2011,
    # 2010
    "03_machandelboom": 2010,
    "03_gaensemagd": 2010,
    "03_rumpelstilzchen": 2010,
    "03_weisse-schwarze-braut": 2010,
    "03_gelernte-jaeger": 2010,
    "03_trommler": 2010,
    "03_baerenhaeuter": 2010,
    "03_meisterdieb": 2010,
    # 2009 and earlier
    "03_bauer-und-teufel": 2009,
    "01_hunter": 2009,
    "01_lady": 2009,
    "01_rabbits": 2009,
    "01_3deers": 2008,
    "01_3dears": 2008,
    "02_falling": 2008,
    "02_starting": 2008,
    "02_carrier2": 2008,
    "02_airplane": 2007,
    "02_burning": 2007,
    "04_painting-01": 2012,
    "04_painting-03": 2014,
    "04_marie-duplessis-02": 2012,
}

def parse_html(path):
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    basename = os.path.splitext(os.path.basename(path))[0]
    prefix   = basename.split("_")[0]
    series   = SERIES.get(prefix, "Unknown")

    # Dark default: uses foundation-dark.css
    dark_default = "foundation-dark.css" in html

    # Image src from <section class="painting"><img src="...">
    img_match = re.search(r'<section class="painting"><img src="images/([^"]+)"', html)
    image_light = img_match.group(1) if img_match else ""

    # Dark image: same name with _dark suffix before extension
    if image_light:
        dark_candidate = re.sub(r'(\.[^.]+)$', r'_dark\1', image_light)
        dark_path = os.path.join(REPO, "images", dark_candidate)
        image_dark = dark_candidate if os.path.exists(dark_path) else ""
    else:
        image_dark = ""

    # Thumbnail: replace _L_ with _S_ in image name
    image_thumb = re.sub(r'_L_', '_S_', image_light) if image_light else ""
    # Some thumbs have different names; fall back gracefully
    thumb_path = os.path.join(REPO, "images", image_thumb)
    if not os.path.exists(thumb_path):
        image_thumb = image_light  # fall back to large

    # Title and description from the .year div
    # Pattern: <div class="cell year">TITLE\n<p class="description ...">DESC</p>
    year_div = re.search(
        r'<div class="cell year">(.*?)</div>',
        html, re.DOTALL
    )
    title = ""
    dimensions = ""
    medium = ""
    if year_div:
        year_content = year_div.group(1)
        # Title is text before the <p>
        title_match = re.match(r'\s*"?([^"<\n]+)"?\s*', year_content.split("<p")[0])
        if title_match:
            title = title_match.group(1).strip().strip('"').strip()
        # Description: extract from <p class="description ...">...</p>
        desc_match = re.search(r'<p class="description[^"]*">(.*?)</p>', year_content, re.DOTALL)
        if desc_match:
            desc = desc_match.group(1)
            desc = re.sub(r'<[^>]+>', '', desc)  # strip HTML tags
            desc = desc.replace('&times;', '×').replace('&ndash;', '–').strip()
            # Typical format: "150×150cm, oil on linen (2008)"
            # or: "150×100 cm, acrylic and phosphorescent powder on linen (2013)"
            desc_clean = re.sub(r'\s+', ' ', desc)
            # Split off the year in parentheses at end
            year_in_desc = re.search(r'\((\d{4})\)\s*$', desc_clean)
            if year_in_desc:
                rest = desc_clean[:year_in_desc.start()].strip().rstrip(',').strip()
                # Split dimensions from medium at first comma
                comma = rest.find(',')
                if comma != -1:
                    dimensions = rest[:comma].strip()
                    medium = rest[comma+1:].strip()
                else:
                    dimensions = rest
                    medium = ""

    year = YEAR_MAP.get(basename, 0)

    return {
        "basename": basename,
        "series": series,
        "dark_default": dark_default,
        "image_light": image_light,
        "image_dark": image_dark,
        "image_thumb": image_thumb,
        "title": title,
        "dimensions": dimensions,
        "medium": medium,
        "year": year,
    }

def write_md(data):
    basename = data["basename"]
    out_path = os.path.join(OUT, basename + ".md")

    lines = ["---"]
    lines.append(f'title: "{data["title"]}"')
    lines.append(f'year: {data["year"]}')
    lines.append(f'dimensions: "{data["dimensions"]}"')
    lines.append(f'medium: "{data["medium"]}"')
    lines.append(f'series: "{data["series"]}"')
    lines.append(f'image_light: "{data["image_light"]}"')
    if data["image_dark"]:
        lines.append(f'image_dark: "{data["image_dark"]}"')
    lines.append(f'image_thumb: "{data["image_thumb"]}"')
    if data["dark_default"]:
        lines.append("dark_default: true")
    lines.append("---")
    lines.append("")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    return out_path

def main():
    # Artwork files are those matching NN_*.html at root level
    pattern = os.path.join(REPO, "[0-9][0-9]_*.html")
    files = sorted(glob.glob(pattern))

    print(f"Found {len(files)} artwork HTML files")
    missing_years = []

    for path in files:
        data = parse_html(path)
        if data["year"] == 0:
            missing_years.append(data["basename"])
        out = write_md(data)
        print(f"  {data['basename']:40s} year={data['year']}  dark={data['dark_default']}  img={data['image_light']}")

    if missing_years:
        print(f"\nWARNING: Missing year for: {missing_years}")
    else:
        print("\nAll years resolved.")

if __name__ == "__main__":
    main()
