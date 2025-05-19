"use client"

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-[8px]">
      <div className="flex-1 bg-[var(--background)] p-6 flex items-center">
        <input
          type="email"
          placeholder="GIVE US YOUR EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent outline-none font-mono text-[var(--text-primary)] text-sm placeholder:text-[var(--text-primary)]"
          required
        />
      </div>
      <button 
        type="submit" 
        className="bg-[var(--background-tertiary)] hover:bg-[var(--border-secondary)] transition-colors duration-200 px-6 py-4 flex items-center justify-center"
      >
        <span className="font-mono text-[var(--text-primary)] text-sm flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1V6M6 6V11M6 6H11M6 6H1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          SUBSCRIBE
        </span>
      </button>
    </form>
  );
} 