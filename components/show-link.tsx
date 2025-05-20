import React from 'react';
import { Icons } from '@/components/icons/icons';

type IconType = keyof typeof Icons;

interface ShowLinkProps {
    icon: IconType;
    fill: string;
    href: string;
    status: 'active' | 'inactive';
}

export default function ShowLink({ icon, fill, href, status }: ShowLinkProps) {
    const IconComponent = Icons[icon];

    if (status === 'active') {
        return (
            <a href={href} className="w-full aspect-square flex items-center justify-center transition-all duration-200 hover:p-1">
                <div className="relative w-full h-full flex items-center justify-center bg-[#C3C3C3]">
                    <IconComponent fill="#191919" className="w-8 h-8" />
                    <div className="absolute top-0 right-0 p-2 flex items-center justify-center">
                        <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0.287109V4.28711M4 4.28711V8.28711M4 4.28711H8M4 4.28711H0" stroke="#191919" />
                        </svg>
                    </div>
                </div>
            </a>
        );
    }

    return (
        <div className="w-full aspect-square flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center shadow-[inset_0_0_0_1px_var(--border-secondary)]">
                <IconComponent fill="#909090" className="w-8 h-8" />
                <div className="absolute top-0 right-0 p-2 flex items-center justify-center">
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 0.287109V4.28711M4 4.28711V8.28711M4 4.28711H8M4 4.28711H0" stroke="#282828" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 p-[4px] flex items-center justify-center bg-[var(--background-tertiary)]">
                    <span className="text-[var(--text-secondary)] font-mono text-[10px] font-medium leading-[8px] uppercase">
                        <span>
                            Coming soon
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

