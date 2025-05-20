"use client"

import React, { useState } from 'react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1V6M6 6V11M6 6H11M6 6H1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const LoadingSpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-[var(--text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSubscribed(false); // Reset subscription status on new attempt

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
        // setMessage('Success! Welcome to the club, you magnificent bastard!'); // Old message
        setEmail(''); // Clear email on success
        setIsSubscribed(true); // Set subscribed state
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
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full gap-[8px] items-center">
      {!isSubscribed ? (
        <div className="flex-1 bg-[var(--background)] p-6 flex items-center h-[56px]"> {/* Ensure consistent height */} 
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
      ) : (
        <div className="flex-1 flex items-center h-[56px]"> {/* Ensure consistent height */} 
          <p className="font-mono text-green-500 text-sm">You have subscribed!</p>
        </div>
      )}
      <button 
        type="submit" 
        className="bg-[var(--background-tertiary)] hover:bg-[var(--border-secondary)] transition-colors duration-200 px-6 py-4 h-[56px] flex items-center justify-center min-w-[150px] md:min-w-[180px]"
        disabled={loading || isSubscribed} // Disable if loading or already subscribed
      >
        <span className="font-mono text-[var(--text-primary)] text-sm flex items-center gap-2">
          {loading ? (
            <>
              <LoadingSpinnerIcon />
              SUBSCRIBING...
            </>
          ) : isSubscribed ? (
            <>
              <CheckIcon />
              SUBSCRIBED
            </>
          ) : (
            <>
              <PlusIcon />
              SUBSCRIBE
            </>
          )}
        </span>
      </button>
      {/* General error message display, separate from the "You have subscribed" message */}
      {message && !isSubscribed && <p className={`w-full p-2 mt-2 text-sm text-red-500 md:absolute md:bottom-[-30px] md:left-0`}>{message}</p>}
    </form>
  );
} 