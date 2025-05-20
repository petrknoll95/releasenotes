import Image from 'next/image';
import React, { useState } from 'react';

export interface Guest {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
}

export default function GuestCard({ guest }: { guest: Guest }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 p-4 bg-[var(--background-secondary)] rounded-md">
      <div className="flex-shrink-0">
        {guest.avatar_url && !imageError ? (
          <Image
            src={guest.avatar_url}
            alt={guest.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
        ) : (
          <div className="w-[60px] h-[60px] rounded-full bg-[var(--background-tertiary)] flex items-center justify-center text-xl font-bold">
            {guest.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col items-stretch justify-between gap-2">
        <div className="flex flex-col">
          <h3 className="font-mono font-medium uppercase text-[12px] leading-none text-[var(--text-primary)]">{guest.name}</h3>
          {guest.bio && <p className="font-mono font-medium uppercase text-[12px] leading-none text-[var(--text-secondary)] mt-1">{guest.bio}</p>}
        </div>
        
        <div className="flex gap-1 mt-2">
          {guest.twitter_url && (
            <a
              href={guest.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase text-[var(--text-primary)] text-[11px] bg-[color-mix(in_srgb,#ffffff_10%,transparent)] px-2 py-1 hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)]"
            >
              Twitter
            </a>
          )}
          
          {guest.linkedin_url && (
            <a
              href={guest.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase text-[var(--text-primary)] text-[11px] bg-[color-mix(in_srgb,#ffffff_10%,transparent)] px-2 py-1 hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)]"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 