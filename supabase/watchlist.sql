-- 🎬 MOVIE WATCHLIST TABLE
-- Stores movies that users want to watch later

-- Create the watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    movie_poster_path TEXT,
    movie_release_date DATE,
    movie_overview TEXT,
    movie_genres TEXT[], -- Store genre names as array
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT, -- Optional user notes about why they want to watch it
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5), -- 1=highest, 5=lowest priority
    watched BOOLEAN DEFAULT FALSE, -- Mark as watched when they complete it
    watched_at TIMESTAMP WITH TIME ZONE, -- When they marked it as watched
    
    -- Ensure a user can't add the same movie twice
    UNIQUE(user_id, movie_id)
);

-- Create indexes for better performance
CREATE INDEX idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX idx_watchlist_movie_id ON public.watchlist(movie_id);
CREATE INDEX idx_watchlist_added_at ON public.watchlist(added_at);
CREATE INDEX idx_watchlist_priority ON public.watchlist(priority);
CREATE INDEX idx_watchlist_watched ON public.watchlist(watched);

-- Enable Row Level Security (RLS)
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users can insert into their own watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users can update their own watchlist" ON public.watchlist;
DROP POLICY IF EXISTS "Users can delete from their own watchlist" ON public.watchlist;

-- RLS Policies: Users can only access their own watchlist items
CREATE POLICY "Users can view their own watchlist"
    ON public.watchlist
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlist"
    ON public.watchlist
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist"
    ON public.watchlist
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist"
    ON public.watchlist
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.watchlist TO authenticated;
GRANT ALL ON public.watchlist TO service_role;

-- Create a function to get user's watchlist with stats
CREATE OR REPLACE FUNCTION get_user_watchlist_stats(user_uuid UUID)
RETURNS TABLE (
    total_movies INTEGER,
    unwatched_movies INTEGER,
    watched_movies INTEGER,
    high_priority_movies INTEGER,
    recent_additions INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_movies,
        COUNT(*) FILTER (WHERE NOT watched)::INTEGER as unwatched_movies,
        COUNT(*) FILTER (WHERE watched)::INTEGER as watched_movies,
        COUNT(*) FILTER (WHERE priority <= 2 AND NOT watched)::INTEGER as high_priority_movies,
        COUNT(*) FILTER (WHERE added_at >= NOW() - INTERVAL '7 days')::INTEGER as recent_additions
    FROM public.watchlist 
    WHERE user_id = user_uuid;
END;
$$;

-- Create a function to add movie to watchlist (with duplicate handling)
CREATE OR REPLACE FUNCTION add_to_watchlist(
    p_user_id UUID,
    p_movie_id INTEGER,
    p_movie_title TEXT,
    p_movie_poster_path TEXT DEFAULT NULL,
    p_movie_release_date DATE DEFAULT NULL,
    p_movie_overview TEXT DEFAULT NULL,
    p_movie_genres TEXT[] DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_priority INTEGER DEFAULT 3
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    watchlist_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
BEGIN
    -- Check if movie already exists in user's watchlist
    IF EXISTS (
        SELECT 1 FROM public.watchlist 
        WHERE user_id = p_user_id AND movie_id = p_movie_id
    ) THEN
        RETURN QUERY SELECT FALSE, 'Movie already in watchlist'::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Insert new watchlist item
    INSERT INTO public.watchlist (
        user_id, movie_id, movie_title, movie_poster_path, 
        movie_release_date, movie_overview, movie_genres, 
        notes, priority
    ) VALUES (
        p_user_id, p_movie_id, p_movie_title, p_movie_poster_path,
        p_movie_release_date, p_movie_overview, p_movie_genres,
        p_notes, p_priority
    ) RETURNING id INTO new_id;
    
    RETURN QUERY SELECT TRUE, 'Movie added to watchlist'::TEXT, new_id;
END;
$$;

-- Create a function to mark movie as watched
CREATE OR REPLACE FUNCTION mark_as_watched(
    p_user_id UUID,
    p_movie_id INTEGER,
    p_watched BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.watchlist 
    SET 
        watched = p_watched,
        watched_at = CASE WHEN p_watched THEN NOW() ELSE NULL END
    WHERE user_id = p_user_id AND movie_id = p_movie_id;
    
    IF FOUND THEN
        RETURN QUERY SELECT TRUE, 
            CASE WHEN p_watched THEN 'Marked as watched' ELSE 'Marked as unwatched' END::TEXT;
    ELSE
        RETURN QUERY SELECT FALSE, 'Movie not found in watchlist'::TEXT;
    END IF;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_movie ON public.watchlist(user_id, movie_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_priority_watched ON public.watchlist(priority, watched);
CREATE INDEX IF NOT EXISTS idx_watchlist_added_at_desc ON public.watchlist(added_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.watchlist IS 'Stores movies that users want to watch later';
COMMENT ON COLUMN public.watchlist.user_id IS 'References the user who added the movie';
COMMENT ON COLUMN public.watchlist.movie_id IS 'TMDB movie ID';
COMMENT ON COLUMN public.watchlist.priority IS 'Priority level: 1=highest, 5=lowest';
COMMENT ON COLUMN public.watchlist.watched IS 'Whether the user has watched the movie';
COMMENT ON COLUMN public.watchlist.notes IS 'User notes about why they want to watch it';

-- Sample data for testing (optional - remove if not needed)
-- INSERT INTO public.watchlist (user_id, movie_id, movie_title, movie_poster_path, priority, notes)
-- VALUES 
--     ('your-user-id-here', 550, 'Fight Club', '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 1, 'Classic movie I need to rewatch'),
--     ('your-user-id-here', 13, 'Forrest Gump', '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 2, 'Highly recommended by friends');