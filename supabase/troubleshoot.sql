-- Troubleshooting script for movie reviews database
-- Run this in your Supabase SQL editor if you're experiencing issues

-- 1. Check if the reviews table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'reviews'
ORDER BY 
    ordinal_position;

-- 2. Check if RLS is enabled on the reviews table
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM 
    pg_tables 
WHERE 
    tablename = 'reviews';

-- 3. Check existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies 
WHERE 
    tablename = 'reviews';

-- 4. Check if the movie_review_stats view exists
SELECT 
    table_name, 
    view_definition
FROM 
    information_schema.views 
WHERE 
    table_schema = 'public' 
    AND table_name = 'movie_review_stats';

-- 5. Test basic permissions (run this as an authenticated user)
-- This should show the current user's auth info
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 6. Check if there are any reviews in the table
SELECT COUNT(*) as total_reviews FROM public.reviews;

-- 7. If you need to completely reset the reviews system, uncomment and run:
/*
-- Drop everything and recreate
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP VIEW IF EXISTS public.movie_review_stats;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Then re-run the main reviews.sql file
*/