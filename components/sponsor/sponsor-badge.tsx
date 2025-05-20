import Image from 'next/image';
import React, { useState } from 'react';

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
}

export default function SponsorBadge({ sponsor }: { sponsor: Sponsor }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const content = (
    <div className="p-4 relative bg-[var(--background-secondary)] grid grid-cols-1 w-full h-full">
      <div className="flex items-center justify-center flex-grow p-4 min-h-[160px] md:min-h-auto">
        {sponsor.logo_url && !imageError ? (
          <Image
            src={sponsor.logo_url}
            alt={sponsor.name}
            width={240}
            height={240}
            className="object-contain max-h-32"
            onError={handleImageError}
          />
        ) : (
          <div className="font-mono font-medium uppercase text-[14px] leading-none text-[var(--text-primary)]">
            {sponsor.name}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 p-4 font-mono font-medium uppercase text-[12px] leading-none text-[var(--text-secondary)]">
        {sponsor.name}
      </div>
    </div>
  );

  if (sponsor.website) {
    return (
      <a 
        href={sponsor.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full hover:opacity-90 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
} 