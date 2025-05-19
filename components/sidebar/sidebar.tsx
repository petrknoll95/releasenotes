import React from 'react';
import { Icons } from '@/components/icons/icons';
import Logo from '@/components/logo/logo';
import ShowLink from '@/components/show-link';
import NewsletterForm from '@/components/newsletter-form';

export default function Sidebar() {
    return (
        <div className="w-full md:h-screen bg-[var(--background-secondary)] overflow-y-auto border-r border-[var(--border-secondary)]">
            <div className="flex flex-col gap-6 p-6 border-b border-[var(--border-secondary)]">
                <div className="flex items-center justify-between gap-2 font-mono text-[14px] font-medium leading-[10px] uppercase">
                    <span>releasenotes.live</span>
                    <span>releasenotes.live</span>
                </div>
                <Logo fill="#DDDDDD" />
            </div>
            <div className="flex flex-col gap-6 p-6 border-b border-[var(--border-secondary)]">
                <img src="/img/headline-subscribe.svg" alt="subscribe" className="w-full" />
                <div className="flex flex-col gap-0 font-mono text-[12px] font-medium leading-[16px] uppercase">
                    <span className="text-[var(--text-primary)]">Don't miss an episode</span>
                    <span className="text-[var(--text-secondary)]">We go live twice a week on Tuesdays and Fridays at 1pm PST</span>
                </div>
                <div className="grid grid-cols-[repeat(4,1fr)] gap-[8px]">
                    <ShowLink icon="IconYt" fill="#DDDDDD" href="#" status="active" />
                    <ShowLink icon="IconX" fill="#DDDDDD" href="#" status="active" />
                    <ShowLink icon="IconSpotify" fill="#DDDDDD" href="#" status="inactive" />
                    <ShowLink icon="IconApplePodcasts" fill="#DDDDDD" href="#" status="inactive" />
                </div>
            </div>
            <div className="flex flex-col gap-6 p-6 border-b border-[var(--border-secondary)]">
                <div className="flex flex-col gap-0 font-mono text-[12px] font-medium leading-[16px] uppercase">
                    <span className="text-[var(--text-primary)]">Weekly newsletter</span>
                    <span className="text-[var(--text-secondary)]">Subscribe for weekly updates and insights from our live shows</span>
                </div>
                <NewsletterForm />
            </div>
            <div className="flex flex-col gap-6 p-6 border-b border-[var(--border-secondary)]">
                <img src="/img/headline-hosts.svg" alt="hosts" className="w-full" />
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-[1fr_fit-content(40%)] gap-[8px]">
                        <div className="grid grid-cols-[1fr_2fr] bg-[var(--background-tertiary)]">
                        </div>
                        <div className="grid grid-rows-[repeat(3,1fr)] gap-[8px]">
                            <a href="#" className="w-24 h-24 flex items-center justify-center transition-all duration-200 hover:p-1">
                                <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)]">
                                    <Icons.IconX fill="#DDDDDD" />
                                </div>
                            </a>
                            <a href="#" className="w-24 h-24 flex items-center justify-center transition-all duration-200 hover:p-1">
                                <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)]">
                                    <Icons.IconYt fill="#DDDDDD" />
                                </div>
                            </a>
                            <a href="#" className="w-24 h-24 flex items-center justify-center transition-all duration-200 hover:p-1">
                                <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)]">
                                    <Icons.IconLi fill="#DDDDDD" />
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between text-[var(--text-secondary)] font-mono text-[12px] font-medium leading-[12px] uppercase">
                        <span className="flex flex-row items-center gap-[8px]">
                            <span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 6.11775L6 2M6 2L2 6.11775M6 2V10" stroke="#5E5E5E" />
                                </svg>
                            </span>
                            <span>He is actually unhinged</span>
                        </span>
                        <span className="flex flex-row items-center gap-[8px]">
                            <span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 5.88225L6 10M6 10L2 5.88225M6 10V2" stroke="#5E5E5E" />
                                </svg>
                            </span>
                            <span>He is not actually negative</span>
                        </span>
                    </div>
                    <div className="grid grid-cols-[fit-content(40%)_1fr] gap-[8px]">
                        <div className="grid grid-rows-[repeat(3,1fr)] gap-[8px]">
                            <a href="#" className="w-24 h-24 flex items-center justify-center transition-all duration-200 hover:p-1">
                                <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)]">
                                    <Icons.IconX fill="#DDDDDD" />
                                </div>
                            </a>
                            <a href="#" className="w-24 h-24 flex items-center justify-center transition-all duration-200 hover:p-1">
                                <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)]">
                                    <Icons.IconYt fill="#DDDDDD" />
                                </div>
                            </a>
                            <a href="#" className="w-24 h-24 flex items-center justify-center transition-all duration-200 hover:p-1">
                                <div className="w-full h-full flex items-center justify-center bg-[var(--background-tertiary)]">
                                    <Icons.IconLi fill="#DDDDDD" />
                                </div>
                            </a>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] bg-[var(--background-tertiary)]">
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-stretch gap-6 p-6">
                <Logo fill="#0F0F0F" />
                <div className="flex items-center justify-between gap-2 font-mono text-[12px] leading-[12px] font-medium uppercase text-[var(--text-secondary)]">
                    <span>Copyright © 2025 releasenotes.live</span>
                    <span>All rights reserved</span>
                </div>
            </div>
        </div>
    );
}