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
    
    // Find the previous episode (most recent episode with an earlier air date)
    const { data: previousEpisode, error: previousEpisodeError } = await supabase
      .from('episodes')
      .select('id, title, slug')
      .lt('air_date', currentEpisode.air_date)
      .order('air_date', { ascending: false })
      .limit(1)
      .single();
    
    if (previousEpisodeError || !previousEpisode) {
      return NextResponse.json(
        { error: 'No previous episode found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(previousEpisode);
  } catch (error) {
    console.error('Error fetching previous episode:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 