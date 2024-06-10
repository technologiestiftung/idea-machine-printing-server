UPDATE storage.buckets
SET public = true
WHERE id = 'illustrations' AND name = 'illustrations' AND public = false;

UPDATE storage.buckets
SET public = true
WHERE id = 'postcards' AND name = 'postcards' AND public = false;
