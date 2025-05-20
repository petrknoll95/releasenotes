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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const episodeId = params.id;
    const supabase = await createClient();
    
    // Fetch the specific episode by ID
    const { data: episode, error: episodeError } = await supabase
      .from('episodes')
      .select('id, title, slug, yt_video_id, air_date, is_live, sponsor_id')
      .eq('id', episodeId)
      .single();
    
    if (episodeError) {
      console.error('Error fetching episode:', episodeError);
      return NextResponse.json(
        { error: 'Failed to fetch the episode' },
        { status: 500 }
      );
    }
    
    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    // Fetch guests for this episode with order
    const { data: guestsRelation, error: guestsError } = await supabase
      .from('episode_guests')
      .select(`
        guest_id,
        order_position
      `)
      .eq('episode_id', episodeId)
      .order('order_position');

    if (guestsError) {
      console.error('Error fetching guest relations:', guestsError);
    }
    
    // Get the ordered guest IDs
    const guestIds = guestsRelation?.map(g => g.guest_id) || [];
    
    // Fetch guest details
    let guests: Guest[] = [];
    if (guestIds.length > 0) {
      const { data: guestDetails, error: guestDetailsError } = await supabase
        .from('guests')
        .select('id, name, bio, avatar_url, twitter_url, linkedin_url')
        .in('id', guestIds);
        
      if (guestDetailsError) {
        console.error('Error fetching guest details:', guestDetailsError);
      } else if (guestDetails) {
        // Sort guests according to the order
        guests = guestIds.map(id => 
          guestDetails.find(g => g.id === id)
        ).filter(g => g !== undefined) as Guest[];
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
    
    // Implement edge caching
    const response = NextResponse.json(responseData);
    response.headers.set('Cache-Control', 's-maxage=300'); // 5 minute cache
    
    return response;
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 