import React from 'react';
import { Icons } from '../icons/icons';

interface HostProfileProps {
    firstName: string;
    lastName: string;
    image: string;
    description: string;
    linkX: {
        href: string;
    }[];
    linkYt: {
        href: string;
    }[];
    linkLi: {
        href: string;
    }[];
    layoutOuter: 'md:grid-cols-[1fr_80px]' | 'md:grid-cols-[80px_1fr]';
}

export default function HostProfile({ firstName, lastName, image, description, linkX, linkYt, linkLi, layoutOuter = 'md:grid-cols-[1fr_80px]' }: HostProfileProps) {
    const isReversed = layoutOuter === 'md:grid-cols-[80px_1fr]';

    return (
        <div className={`grid grid-cols-1 gap-[8px] ${layoutOuter}`}>
            <div className={`grid relative grid-cols-1fr bg-[#2D2D2D] text-[var(--text-primary)] ${isReversed ? 'md:order-2' : 'md:order-1'}`}>
                <div className="grid lg:grid-cols-[1fr_2fr]">
                    <div className="w-full h-full flex items-center justify-center">
                        <img src={image} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full flex flex-col gap-4 items-start justify-between px-4 pt-6 pb-12 md:px-5 md:py-6 xl:px-6 xl:py-8">
                        <span className="font-inter text-3xl font-bold leading-[0.875] uppercase tracking-[-0.05em]">{firstName}<br />{lastName}</span>
                        <span className="font-mono text-[14px] font-medium leading-[14px] uppercase text-balance">{description}</span>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute p-[16px] top-0 left-0 w-full h-full flex flex-col items-stretch justify-between">
                    <div className="w-full flex flex-row items-center justify-between">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0.287109V4.28711M4 4.28711V8.28711M4 4.28711H8M4 4.28711H0" stroke="currentColor" />
                        </svg>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0.287109V4.28711M4 4.28711V8.28711M4 4.28711H8M4 4.28711H0" stroke="currentColor" />
                        </svg>
                    </div>
                    <div className="w-full flex flex-row items-center justify-between">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0.287109V4.28711M4 4.28711V8.28711M4 4.28711H8M4 4.28711H0" stroke="currentColor" />
                        </svg>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0.287109V4.28711M4 4.28711V8.28711M4 4.28711H8M4 4.28711H0" stroke="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-[repeat(3,1fr)] md:grid-cols-1 md:grid-rows-[repeat(3,1fr)] gap-[8px] ${isReversed ? 'md:order-1' : 'md:order-2'}`}>
                {linkX.map((link, index) => (
                    <a key={`x-${index}-${link.href}`} href={link.href} className="w-full h-full aspect-square flex items-center justify-center transition-all duration-200 lg:hover:p-1">
                        <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)] p-2">
                        <Icons.IconX fill="#DDDDDD" />
                    </div>
                </a>
                ))}
                {linkYt.map((link, index) => (
                    <a key={`yt-${index}-${link.href}`} href={link.href} className="w-full h-full aspect-square flex items-center justify-center transition-all duration-200 lg:hover:p-1">
                        <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)] p-2">
                            <Icons.IconYt fill="#DDDDDD" />
                        </div>
                </a>
                ))}
                {linkLi.map((link, index) => (
                    <a key={`li-${index}-${link.href}`} href={link.href} className="w-full h-full aspect-square flex items-center justify-center transition-all duration-200 lg:hover:p-1">
                        <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)] p-2">
                            <Icons.IconLi fill="#DDDDDD" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}