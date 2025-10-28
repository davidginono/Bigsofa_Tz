ALTER TABLE IF EXISTS furniture_item
    ADD COLUMN IF NOT EXISTS image_hash VARCHAR(128);

CREATE UNIQUE INDEX IF NOT EXISTS uk_furniture_item_image_hash
    ON furniture_item (image_hash)
    WHERE image_hash IS NOT NULL;
