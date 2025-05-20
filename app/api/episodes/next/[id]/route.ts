import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: currentEpisodeId } = await params;
    const supabase = await createClient();
    
    // First, get the current episode to find its air date
    const { data: currentEpisode, error: currentEpisodeError } = await supabase
      .from('episodes')
      .select('air_date')
      .eq('id', currentEpisodeId)
      .single();
    
    if (currentEpisodeError || !currentEpisode) {
      return NextResponse.json(
        { error: 'Current episode not found' },
        { status: 404 }
      );
    }
    
    // Find the next episode (earliest episode with a later air date)
    const { data: nextEpisode, error: nextEpisodeError } = await supabase
      .from('episodes')
      .select('id, title, slug')
      .gt('air_date', currentEpisode.air_date)
      .order('air_date', { ascending: true })
      .limit(1)
      .single();
    
    if (nextEpisodeError || !nextEpisode) {
      return NextResponse.json(
        { error: 'No next episode found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(nextEpisode);
  } catch (error) {
    console.error('Error fetching next episode:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 