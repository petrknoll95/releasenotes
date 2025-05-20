import React from 'react';
import GuestCard, { Guest } from './guest-card';

interface GuestListProps {
  guests: Guest[];
  title?: string;
}

export default function GuestList({ guests, title = "Episode Guests" }: GuestListProps) {
  // Debug output
  console.log("GuestList component received guests:", guests);
  
  if (!guests || guests.length === 0) {
    console.log("No guests to display");
    return null;
  }

  // No need to modify this component further - it already preserves the order of the guests array
  // The ordering is handled in the API and data fetching logic
  
  return (
    <div className="flex flex-col items-stretch gap-4 w-full h-full">
      <div className="space-y-2">
        {guests.map((guest) => {
          console.log("Rendering guest:", guest);
          return (
            <GuestCard key={guest.id} guest={guest} />
          );
        })}
      </div>
    </div>
  );
} 