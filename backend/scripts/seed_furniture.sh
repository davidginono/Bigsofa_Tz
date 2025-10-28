#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${1:-http://localhost:8080}

IMAGES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../sample-data/images && pwd)"

echo "Fetching categories from $BASE_URL..." >&2
CATEGORIES_JSON=$(curl -s "$BASE_URL/api/categories")
if [[ -z "$CATEGORIES_JSON" ]]; then
  echo "Failed to fetch categories. Ensure backend is running and accessible at $BASE_URL" >&2
  exit 1
fi

get_category_id() {
  local name="$1"
  python - <<'PY' "$name" "$CATEGORIES_JSON"
import json
import sys
name = sys.argv[1]
raw = sys.argv[2]
try:
    categories = json.loads(raw)
except json.JSONDecodeError:
    print("", end="")
    sys.exit(0)
for category in categories:
    if category.get("name", "").lower() == name.lower():
        print(category.get("id"))
        sys.exit(0)
print("", end="")
PY
}

upload_item() {
  local category_name="$1"
  local item_name="$2"
  local description="$3"
  local price="$4"
  local image_path="$5"

  if [[ ! -f "$image_path" ]]; then
    echo "Image not found: $image_path -- skipping" >&2
    return
  fi

  local category_id
  category_id=$(get_category_id "$category_name")
  if [[ -z "$category_id" ]]; then
    echo "Category '$category_name' not found. Please create it first." >&2
    return
  fi

  echo "Uploading '$item_name' to category '$category_name' (id=$category_id)..." >&2
  local response
  response=$(curl -s -w "\n%{http_code}" -F "categoryId=$category_id" -F "name=$item_name" -F "description=$description" -F "priceCents=$price" -F "file=@$image_path" "$BASE_URL/api/furniture")
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n1)

  if [[ "$status" != 201 ]]; then
    echo "Failed to upload '$item_name' (HTTP $status): $body" >&2
  else
    echo "Successfully uploaded '$item_name'" >&2
  fi
}

SOFAS=(
  "Sofas|Modern Sectional Sofa|Large modular sectional with soft fabric|549900|$IMAGES_DIR/sofas/sofa-modern.jpg"
  "Sofas|Velvet Accent Sofa|Two-seater velvet sofa|429900|$IMAGES_DIR/sofas/sofa-accent.jpg"
  "Sofas|Luxe Leather Sectional|Top-grain leather sectional for family rooms|629900|$IMAGES_DIR/sofas/sofa-brown-modern.jpg"
  "Sofas|Navy Tufted Sofa|Button-tufted sofa with brass legs|489900|$IMAGES_DIR/sofas/sofa-blue-luxury.jpg"
  "Sofas|Scandinavian Grey Sofa|Low profile sofa with ash wood base|459900|$IMAGES_DIR/sofas/sofa-grey-sectional.jpg"
  "Sofas|Corner Modular Sofa|Fabric modular sofa with chaise|519900|$IMAGES_DIR/sofas/sofa-corner-fabric.jpg"
  "Sofas|Emerald Velvet Loveseat|Compact velvet loveseat for small spaces|389900|$IMAGES_DIR/sofas/sofa-velvet-green.jpg"
  "Sofas|Mid-century Fabric Sofa|Walnut frame mid-century sofa|479900|$IMAGES_DIR/sofas/sofa-midcentury.jpg"
)

CHAIRS=(
  "Chairs|Minimalist Lounge Chair|Sculpted wood lounge chair|189900|$IMAGES_DIR/chairs/chair-modern.jpg"
  "Chairs|Cozy Armchair|Plush armchair with ottoman|159900|$IMAGES_DIR/chairs/chair-armchair.jpg"
  "Chairs|Rattan Accent Chair|Relaxed rattan chair with cushion|129900|$IMAGES_DIR/chairs/chair-rattan.jpg"
  "Chairs|Modern Dining Chair Set|Two-tone dining chairs (set of 2)|219900|$IMAGES_DIR/chairs/chair-modern-white.jpg"
  "Chairs|Executive Office Chair|Ergonomic leather office chair|239900|$IMAGES_DIR/chairs/chair-office-classic.jpg"
  "Chairs|Hanging Egg Chair|Indoor swing chair with stand|199900|$IMAGES_DIR/chairs/chair-rattan-hanging.jpg"
  "Chairs|Vintage Blue Lounge Chair|Velvet lounge chair with gold legs|179900|$IMAGES_DIR/chairs/chair-blue-modern.jpg"
  "Chairs|Handcrafted Wood Chair|Artisan-crafted occasional chair|169900|$IMAGES_DIR/chairs/chair-lorem-1.jpg"
  "Chairs|Industrial Loft Chair|Steel frame loft chair|149900|$IMAGES_DIR/chairs/chair-lorem-2.jpg"
  "Chairs|Coastal Wicker Chair|Coastal-inspired wicker lounge|139900|$IMAGES_DIR/chairs/chair-lorem-3.jpg"
  "Chairs|Armless Slipper Chair|Compact slipper chair|119900|$IMAGES_DIR/chairs/chair-lorem-4.jpg"
  "Chairs|Modern Patio Chair|Weather-resistant patio chair|99900|$IMAGES_DIR/chairs/chair-lorem-5.jpg"
)

TABLES=(
  "Tables|Oak Dining Table|Solid oak table for six|699900|$IMAGES_DIR/tables/table-dining.jpg"
  "Tables|Round Coffee Table|Glass top coffee table|249900|$IMAGES_DIR/tables/table-coffee.jpg"
  "Tables|Industrial Console Table|Metal and wood entryway console|219900|$IMAGES_DIR/tables/table-lorem-1.jpg"
  "Tables|Minimalist Writing Desk|Compact desk for apartments|199900|$IMAGES_DIR/tables/table-lorem-2.jpg"
  "Tables|Live Edge Side Table|Acacia live edge side table|159900|$IMAGES_DIR/tables/table-lorem-3.jpg"
  "Tables|Nested Accent Tables|Set of two nesting tables|189900|$IMAGES_DIR/tables/table-lorem-4.jpg"
  "Tables|Outdoor Dining Table|Teak outdoor dining table|459900|$IMAGES_DIR/tables/table-lorem-5.jpg"
  "Tables|Rustic Farmhouse Table|Farmhouse-inspired harvest table|649900|$IMAGES_DIR/tables/table-lorem-6.jpg"
)

for entry in "${SOFAS[@]}"; do
  IFS='|' read -r category name desc price path <<<"$entry"
  upload_item "$category" "$name" "$desc" "$price" "$path"
done

for entry in "${CHAIRS[@]}"; do
  IFS='|' read -r category name desc price path <<<"$entry"
  upload_item "$category" "$name" "$desc" "$price" "$path"
done

for entry in "${TABLES[@]}"; do
  IFS='|' read -r category name desc price path <<<"$entry"
  upload_item "$category" "$name" "$desc" "$price" "$path"
done

echo "Seeding complete." >&2
