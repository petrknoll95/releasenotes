'use client';

import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import GuestList from '@/components/guests/guest-list';
import { Guest } from '@/components/guests/guest-card';
import SponsorBadge, { Sponsor } from '@/components/sponsor/sponsor-badge';
import HeadlineGuests from '@/components/svg-headlines/headline-guests';
import HeadlineSponsor from '@/components/svg-headlines/headline-sponsor';
import Logo from '@/components/logo/logo';
import VideoLoading from './video-loading';

interface Episode {
  id: string;
  title: string;
  yt_video_id: string;
  is_live: boolean;
  air_date: string;
  guests?: Guest[];
  sponsor?: Sponsor;
}

type TransitionState = 'visible' | 'fading-out' | 'fading-in';

export default function EpisodeVideo() {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLatestEpisode, setIsLatestEpisode] = useState(true);
  const [hasPreviousEpisode, setHasPreviousEpisode] = useState(false);
  const [hasNextEpisode, setHasNextEpisode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitionState, setTransitionState] = useState<TransitionState>('visible');
  const [pendingEpisodeId, setPendingEpisodeId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Fetch the latest episode on initial load
  useEffect(() => {
    fetchLatestEpisode();
  }, []);

  // Handle transition state changes
  useEffect(() => {
    if (transitionState === 'fading-out') {
      // When fade-out is complete, load the new episode
      const timer = setTimeout(() => {
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        } else if (pendingEpisodeId) {
          fetchEpisodeById(pendingEpisodeId);
          setPendingEpisodeId(null);
        }
        setTransitionState('fading-in');
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    } else if (transitionState === 'fading-in') {
      // When fade-in is complete, set to visible
      const timer = setTimeout(() => {
        setTransitionState('visible');
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [transitionState, pendingEpisodeId, pendingAction]);

  // Function to fetch the latest episode
  async function fetchLatestEpisode() {
    try {
      setLoading(true);
      const response = await fetch('/api/latest-episode');
      if (!response.ok) {
        throw new Error('Failed to fetch latest episode');
      }

      const data = await response.json();
      setEpisode(data);
      setIsLatestEpisode(true);
      
      // Check if there are previous episodes
      const hasEarlier = await checkEarlierEpisodes(data.id);
      setHasPreviousEpisode(hasEarlier);
      setHasNextEpisode(false);
    } catch (err) {
      console.error('Error fetching latest episode:', err);
      setError('Could not load the latest episode');
    } finally {
      setLoading(false);
    }
  }

  // Function to fetch a specific episode by ID
  async function fetchEpisodeById(id: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/episodes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch episode');
      }

      const data = await response.json();
      setEpisode(data);
      
      // Check if this is the latest episode
      const latestResponse = await fetch('/api/latest-episode');
      if (latestResponse.ok) {
        const latestData = await latestResponse.json();
        setIsLatestEpisode(data.id === latestData.id);
      }

      // Check for adjacent episodes
      const [hasEarlier, hasLater] = await Promise.all([
        checkEarlierEpisodes(id),
        checkLaterEpisodes(id)
      ]);
      
      setHasPreviousEpisode(hasEarlier);
      setHasNextEpisode(hasLater);
    } catch (err) {
      console.error('Error fetching episode:', err);
      setError('Could not load the episode');
    } finally {
      setLoading(false);
    }
  }

  // Helper functions to check for adjacent episodes
  async function checkEarlierEpisodes(currentId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/episodes/previous/${currentId}`);
      return response.ok && response.status !== 404;
    } catch {
      return false;
    }
  }

  async function checkLaterEpisodes(currentId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/episodes/next/${currentId}`);
      return response.ok && response.status !== 404;
    } catch {
      return false;
    }
  }

  // Navigation functions with transitions
  async function goToPreviousEpisode() {
    if (!episode || !hasPreviousEpisode || transitionState !== 'visible') return;
    
    try {
      const response = await fetch(`/api/episodes/previous/${episode.id}`);
      if (response.ok) {
        const data = await response.json();
        // Start transition
        setTransitionState('fading-out');
        setPendingEpisodeId(data.id);
      }
    } catch (err) {
      console.error('Error navigating to previous episode:', err);
    }
  }

  async function goToNextEpisode() {
    if (!episode || !hasNextEpisode || transitionState !== 'visible') return;
    
    try {
      const response = await fetch(`/api/episodes/next/${episode.id}`);
      if (response.ok) {
        const data = await response.json();
        // Start transition
        setTransitionState('fading-out');
        setPendingEpisodeId(data.id);
      }
    } catch (err) {
      console.error('Error navigating to next episode:', err);
    }
  }

  // Go to latest with transition
  function goToLatestEpisode() {
    if (transitionState !== 'visible') return;
    
    setTransitionState('fading-out');
    setPendingAction(() => fetchLatestEpisode);
  }

  if (loading) {
    return <VideoLoading />;
  }

  if (error || !episode) {
    return (
      <div className="w-full aspect-[16/9] bg-[var(--background-secondary)] flex items-center justify-center">
        <div className="text-[var(--foreground-secondary)]">{error || 'No episode available'}</div>
      </div>
    );
  }

  // Debug output
  console.log('Rendering episode:', episode);
  console.log('Has guests:', !!episode.guests);
  console.log('Guest count:', episode.guests?.length);

  return (
    <div 
      className={`flex flex-col items-stretch min-h-full episode-container ${transitionState}`}
    >
      <div className="flex lg:hidden flex-col gap-6 p-3 md:p-4 lg:p-5 xl:p-6 border-b border-[var(--border-secondary)]">
        <Logo fill="#DDDDDD" />
      </div>
      
      <div className="w-full p-3 md:p-4 lg:p-5 xl:p-6 border-b border-[var(--border-secondary)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <span 
              className={`
                text-white px-1 py-1 text-[12px] leading-[12px] font-mono font-medium uppercase inline-block
                ${episode.is_live ? 'bg-red-600 animate-flash' : 'bg-gray-600'}
              `}
            >
              {episode.is_live ? 'LIVE' : 'RECENT EPISODE'}
            </span>
            <h2 className="min-w-[0px] font-mono font-medium uppercase text-[12px] leading-none text-[var(--text-primary)] truncate grow">{episode.title}</h2>
            <div className="font-mono font-medium uppercase text-[12px] leading-none text-[var(--text-secondary)] shrink-0">
              {new Date(episode.air_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          {/* Episode Navigation */}
          <div className="flex items-center space-x-2 justify-between">
            <div className="flex flex-row items-center gap-[4px] justify-between w-full">
            <button 
              onClick={goToPreviousEpisode}
              disabled={!hasPreviousEpisode || transitionState !== 'visible'}
              className={`w-[32px] h-[32px] flex items-center justify-center ${hasPreviousEpisode && transitionState === 'visible' ? 'text-[var(--text-primary)] bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)]' : 'text-[var(--text-secondary)] cursor-not-allowed'} rounded`}
              aria-label="Previous episode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {!isLatestEpisode && (
              <button 
                onClick={goToLatestEpisode}
                disabled={transitionState !== 'visible'}
                className={`px-3 h-[32px] bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] font-mono uppercase text-[12px] rounded ${transitionState !== 'visible' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Go to latest
              </button>
            )}
            
            <button 
              onClick={goToNextEpisode}
              disabled={!hasNextEpisode || transitionState !== 'visible'}
              className={`w-[32px] h-[32px] flex items-center justify-center ${hasNextEpisode && transitionState === 'visible' ? 'text-[var(--text-primary)] bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)]' : 'text-[var(--text-secondary)] cursor-not-allowed'} rounded`}
              aria-label="Next episode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:flex-grow p-3 md:p-4 lg:p-5 xl:p-6 border-b border-[var(--border-secondary)]">
        <div className="w-full aspect-[16/9] h-full lg:aspect-auto relative">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${episode.yt_video_id}`}
            width="100%"
            height="100%"
            controls
            playing={false}
            light={false}
            config={{
              playerVars: {
                showinfo: 1,
                rel: 0
              }
            }}
          />
        </div>
      </div>

      {/* Display guests if available */}
      <div className="grid lg:grid-cols-2">
        {/* Guest list */}
        {episode.guests && episode.guests.length > 0 && (
          <div className="flex flex-col items-stretch gap-4 gap-y-[8px] p-3 md:p-4 lg:p-5 xl:p-6">
            <HeadlineGuests fill="#282828" className="flex flex-col w-full items-start lg:h-[48px]" />
            <GuestList guests={episode.guests} />
          </div>
        )}
        
        {/* Sponsor Slot */}
        <div className="flex flex-col items-stretch gap-4 gap-y-[8px] p-3 md:p-4 lg:p-5 xl:p-6 lg:border-l border-[var(--border-secondary)]">
          <HeadlineSponsor fill="#282828" className="flex flex-col w-full items-start lg:h-[48px]" />
          {episode.sponsor && (
            <SponsorBadge sponsor={episode.sponsor} />
          )}
        </div>
      </div>

      {/* CSS for transitions */}
      <style jsx global>{`
        .episode-container {
          transition: opacity 300ms ease-in-out;
        }
        
        .episode-container.fading-out {
          opacity: 0;
        }
        
        .episode-container.fading-in {
          opacity: 0;
          animation: fadeIn 300ms ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 