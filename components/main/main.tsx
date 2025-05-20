import React from 'react';
import EpisodeVideo from '@/components/video/episode-video';

export default function Main() {
    return (
        <div className="order-1 lg:order-2 flex-grow w-full lg:w-3/5 lg:h-screen flex flex-col items-stretch">
                <EpisodeVideo />
        </div>
    )
}