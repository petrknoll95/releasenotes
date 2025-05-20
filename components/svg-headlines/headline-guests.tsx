import React from 'react';

interface HeadlineGuestsProps {
    fill: string;
    className?: string;
}

export default function HeadlineGuests({ fill, className }: HeadlineGuestsProps) {
    return (
        <div className={className}>
            <svg viewBox="0 0 227 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
<path d="M25.6797 25.6797V23.0302H12.8398V12.8398H35.87V36H0V-0.000201225L35.87 -0.000244141V10.1904H10.1903V25.6797H25.6797Z" fill={fill}/>
<path d="M63.7897 25.6797V-0.000201225L73.98 -0.000244141V36H38.11V-0.000244141L48.3003 -0.000201225V25.6797H63.7897Z" fill={fill}/>
<path d="M112.09 25.6797V36H76.22V-0.000244141H112.09V10.1904H86.4103V12.8398H112.09V23.0302H86.4103V25.6797H112.09Z" fill={fill}/>
<path d="M140.01 25.6797V23.0302H114.33V-0.000244141H150.2V10.1904H124.52V12.8398H150.2V36H114.33V25.6797H140.01Z" fill={fill}/>
<path d="M175.47 36H165.28V10.1904H152.44V-0.000201225H188.31V10.1904H175.47V36Z" fill={fill}/>
<path d="M216.23 25.6796V23.0301H190.55V-0.000201225H226.42V10.1903H200.74V12.8398H226.42V36H190.55V25.6796H216.23Z" fill={fill}/>
            </svg>
        </div>
    )
}