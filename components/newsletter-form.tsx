"use client"

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Success! Welcome to the club, you magnificent bastard!');
        setEmail(''); // Clear email on success
      } else {
        setMessage(result.error || 'Damn it! Something went wrong. Try again?');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Shit! A network error. Check your connection or curse the internet gods.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full gap-[8px]">
      <div className="flex-1 bg-[var(--background)] p-6 flex items-center">
        <input
          type="email"
          placeholder="GIVE US YOUR EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent outline-none font-mono text-[var(--text-primary)] text-sm placeholder:text-[var(--text-primary)]"
          required
          disabled={loading}
        />
      </div>
      <button 
        type="submit" 
        className="bg-[var(--background-tertiary)] hover:bg-[var(--border-secondary)] transition-colors duration-200 px-6 py-4 flex items-center justify-center"
        disabled={loading}
      >
        <span className="font-mono text-[var(--text-primary)] text-sm flex items-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              SUBSCRIBING...
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1V6M6 6V11M6 6H11M6 6H1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              SUBSCRIBE
            </>
          )}
        </span>
      </button>
      {message && <p className={`w-full p-2 mt-2 text-sm ${message.startsWith('Success!') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
    </form>
  );
} 