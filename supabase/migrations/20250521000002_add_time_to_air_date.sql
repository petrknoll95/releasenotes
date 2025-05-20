-- Add start_time column to episodes table
ALTER TABLE public.episodes 
ADD COLUMN IF NOT EXISTS start_time TIME;

-- Update the live_or_latest view to include the new column
CREATE OR REPLACE VIEW public.live_or_latest AS
SELECT *
FROM public.episodes
ORDER BY is_live DESC, air_date DESC NULLS LAST
LIMIT 1;

-- Create a function to check if an episode is currently live
-- This considers both is_live flag and the current time vs start_time
CREATE OR REPLACE FUNCTION public.is_episode_live(ep public.episodes)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN 
    ep.is_live = true AND 
    ep.air_date = CURRENT_DATE AND
    (
      ep.start_time IS NULL OR 
      (ep.start_time <= CURRENT_TIME AND ep.start_time + interval '2 hours' > CURRENT_TIME)
    );
END;
$$ LANGUAGE plpgsql; 