-- Movie Reviews Database Schema
-- This file contains the complete SQL schema for the movie reviews system
-- Run this in your Supabase SQL editor to set up the database

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reviews;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.reviews;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.reviews;

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.movie_review_stats;

-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL, -- TMDB movie ID
  movie_title TEXT NOT NULL, -- Store movie title for easier queries
  movie_poster_path TEXT, -- Store poster path for display
  movie_release_date DATE, -- Store release date for sorting/filtering
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  is_spoiler BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Ensure one review per user per movie
  UNIQUE(user_id, movie_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_movie_id_idx ON public.reviews(movie_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews(created_at);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set user_id if it's not already provided and we have an authenticated user
    IF NEW.user_id IS NULL THEN
        NEW.user_id = auth.uid();
    END IF;
    
    -- Ensure we have a valid user_id
    IF NEW.user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to create a review';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically set user_id on insert
DROP TRIGGER IF EXISTS set_user_id_on_reviews ON public.reviews;
CREATE TRIGGER set_user_id_on_reviews
    BEFORE INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies with proper authentication checks
-- Policy for viewing reviews - anyone can view all reviews
CREATE POLICY "Enable read access for all users" ON public.reviews
  FOR SELECT USING (true);

-- Policy for inserting reviews - only authenticated users can insert reviews
-- The user_id will be automatically set by the trigger
CREATE POLICY "Enable insert for authenticated users only" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating reviews - users can only update their own reviews
CREATE POLICY "Enable update for users based on user_id" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting reviews - users can only delete their own reviews
CREATE POLICY "Enable delete for users based on user_id" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create a view for review statistics per movie
CREATE OR REPLACE VIEW public.movie_review_stats AS
SELECT 
  movie_id,
  movie_title,
  COUNT(*) as total_reviews,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
  COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
  COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
  COUNT(*) FILTER (WHERE rating = 1) as one_star_count
FROM public.reviews
GROUP BY movie_id, movie_title;

-- Enable RLS on the view as well
ALTER VIEW public.movie_review_stats SET (security_barrier = true);

-- Grant permissions to authenticated and anon users
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.reviews TO authenticated;
GRANT UPDATE ON public.reviews TO authenticated;
GRANT DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.movie_review_stats TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant sequence permissions if needed
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Sample data (optional - remove if not needed)
-- INSERT INTO public.reviews (user_id, movie_id, movie_title, rating, review_text) 
-- VALUES 
--   ('your-test-user-id', 550, 'Fight Club', 5, 'An absolute masterpiece! The storytelling is incredible.'),
--   ('your-test-user-id', 13, 'Forrest Gump', 4, 'Heartwarming story with great performances.');

COMMENT ON TABLE public.reviews IS 'Store movie reviews from users';
COMMENT ON COLUMN public.reviews.movie_id IS 'TMDB movie ID for linking to external movie data';
COMMENT ON COLUMN public.reviews.rating IS 'User rating from 1-5 stars';
COMMENT ON COLUMN public.reviews.is_spoiler IS 'Flag to indicate if review contains spoilers';