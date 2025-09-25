-- Test script for movie reviews database
-- Run this in your Supabase SQL Editor to test the setup

-- 1. Check if you're authenticated (should return your user ID and role)
SELECT 
    auth.uid() as user_id,
    auth.role() as user_role;

-- 2. Test inserting a review (this should work if you're authenticated)
-- Replace the values with actual movie data
INSERT INTO public.reviews (
    movie_id,
    movie_title,
    movie_poster_path,
    movie_release_date,
    rating,
    review_text,
    is_spoiler
) VALUES (
    550,
    'Fight Club',
    '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    '1999-10-15',
    5,
    'Test review - this is an amazing movie!',
    false
);

-- 3. Check if the review was inserted with the correct user_id
SELECT * FROM public.reviews WHERE movie_id = 550;

-- 4. Test the movie stats view
SELECT * FROM public.movie_review_stats WHERE movie_id = 550;

-- 5. Clean up the test data (uncomment to remove)
-- DELETE FROM public.reviews WHERE movie_id = 550 AND review_text LIKE 'Test review%';