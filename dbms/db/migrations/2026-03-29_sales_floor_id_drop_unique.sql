-- Allows multiple sale records per floor for history tracking.
-- Run once on existing databases that already have the unique constraint.
ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_floor_id_key;
