import React from 'react';
import Image from 'next/image';

export default function VideoLoading() {
  return (
    <div className="w-full h-full aspect-[16/9] bg-[var(--background)] flex items-center justify-center">
      <div className="loading-logo">
        <Image 
          src="/img/releasenotes-logo.svg" 
          alt="Release Notes" 
          width={58} 
          height={121}
          priority
        />
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }

        .loading-logo {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 