import React from 'react';

export default function Main() {
    return (
        <div className="flex-grow w-full lg:w-3/5 md:min-h-screen flex flex-col items-stretch">
            <div className="p-6 border-b border-[var(--border-secondary)]"></div>
            <div className="p-6 border-b border-[var(--border-secondary)]">
                <div className="w-full aspect-[16/9]"></div>
            </div>
            <div className="p-6"></div>
        </div>
    )
}