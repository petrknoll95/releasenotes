import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface Guest {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Query the view that returns either the currently live episode 
    // or the most recent episode by air date
    const { data: episode, error: episodeError } = await supabase
      .from('live_or_latest')
      .select('id, title, slug, yt_video_id, air_date, is_live, sponsor_id')
      .single();
    
    if (episodeError) {
      console.error('Error fetching latest episode:', episodeError);
      return NextResponse.json(
        { error: 'Failed to fetch the latest episode' },
        { status: 500 }
      );
    }
    
    if (!episode) {
      return NextResponse.json(
        { error: 'No episodes found' },
        { status: 404 }
      );
    }

    console.log('Episode found:', episode.id, episode.title);

    // Fetch guests for this episode using the episode_guests join table with order
    const { data: guestsRelation, error: guestsError } = await supabase
      .from('episode_guests')
      .select(`
        guest_id,
        order_position
      `)
      .eq('episode_id', episode.id)
      .order('order_position');

    if (guestsError) {
      console.error('Error fetching guest relations:', guestsError);
      // Don't fail the whole request if guests can't be fetched
    }
    
    console.log('Guest relations found:', guestsRelation);
    
    // Get the ordered guest IDs
    const guestIds = guestsRelation?.map(g => g.guest_id) || [];
    console.log('Guest IDs:', guestIds);
    
    // Only fetch guest details if we have guest IDs
    let guests: Guest[] = [];
    if (guestIds.length > 0) {
      const { data: guestDetails, error: guestDetailsError } = await supabase
        .from('guests')
        .select('id, name, bio, avatar_url, twitter_url, linkedin_url')
        .in('id', guestIds);
        
      if (guestDetailsError) {
        console.error('Error fetching guest details:', guestDetailsError);
      } else if (guestDetails) {
        console.log('Guest details found:', guestDetails);
        
        // Sort guests according to the order in episode_guests
        guests = guestIds.map(id => 
          guestDetails.find(g => g.id === id)
        ).filter(g => g !== undefined) as Guest[];
        
        console.log('Sorted guests:', guests);
      }
    }

    // Fetch sponsor information if the episode has a sponsor_id
    let sponsor = null;
    if (episode.sponsor_id) {
      const { data: sponsorData, error: sponsorError } = await supabase
        .from('sponsors')
        .select('id, name, logo_url, website')
        .eq('id', episode.sponsor_id)
        .single();
        
      if (sponsorError) {
        console.error('Error fetching sponsor:', sponsorError);
      } else {
        sponsor = sponsorData;
      }
    }
    
    // Combine episode with guests and sponsor
    const responseData = {
      ...episode,
      guests: guests,
      sponsor: sponsor
    };
    
    console.log('Final response data:', responseData);
    
    // Implement edge caching as specified in the project plan
    const response = NextResponse.json(responseData);
    response.headers.set('Cache-Control', 's-maxage=15');
    
    return response;
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 