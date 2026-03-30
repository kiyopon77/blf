-- Adds floor_value to floors for existing databases.
ALTER TABLE floors
ADD COLUMN IF NOT EXISTS floor_value NUMERIC(14,2);
