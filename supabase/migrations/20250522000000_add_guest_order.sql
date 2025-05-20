-- Add order_position column to episode_guests table
ALTER TABLE episode_guests ADD COLUMN order_position INTEGER;

-- Set a default value for existing records (sequential by episode_id and guest_id)
WITH indexed_guests AS (
  SELECT episode_id, guest_id, ROW_NUMBER() OVER (PARTITION BY episode_id ORDER BY guest_id) - 1 as idx
  FROM episode_guests
)
UPDATE episode_guests
SET order_position = indexed_guests.idx
FROM indexed_guests
WHERE episode_guests.episode_id = indexed_guests.episode_id 
  AND episode_guests.guest_id = indexed_guests.guest_id;

-- Make the column required for new records
ALTER TABLE episode_guests ALTER COLUMN order_position SET NOT NULL; 