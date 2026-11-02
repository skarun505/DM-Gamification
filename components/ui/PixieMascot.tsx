'use client';

import React from 'react';

interface PixieMascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'cheering';
  size?: number;
  className?: string;
}

export function PixieMascot({ mood = 'happy', size = 64, className = '' }: PixieMascotProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
      >
        {/* Glow */}
        <circle cx="60" cy="60" r="54" fill="#EEF2FF" />

        {/* Ears */}
        <path d="M30 46 L42 16 L56 36 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
        <path d="M35 42 L42 24 L50 36 Z" fill="#FED7AA" />
        <path d="M90 46 L78 16 L64 36 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
        <path d="M85 42 L78 24 L70 36 Z" fill="#FED7AA" />

        {/* Head */}
        <circle cx="60" cy="65" r="40" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />

        {/* White face patches */}
        <path
          d="M32 72 C32 88 48 98 60 98 C72 98 88 88 88 72 C88 64 78 56 60 56 C42 56 32 64 32 72 Z"
          fill="#FFFFFF"
        />

        {/* Astronaut Helmet / Goggles band */}
        <path
          d="M24 60 C24 40 40 28 60 28 C80 28 96 40 96 60"
          stroke="#4F46E5"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="24" cy="60" r="4" fill="#F59E0B" />
        <circle cx="96" cy="60" r="4" fill="#F59E0B" />

        {/* Eyes */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <>
            <path d="M44 68 Q50 62 56 68" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M64 68 Q70 62 76 68" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="50" cy="66" r="4.5" fill="#1E1B4B" />
            <circle cx="70" cy="64" r="5.5" fill="#1E1B4B" />
            {/* Thinking eyebrow */}
            <path d="M66 57 L75 55" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="50" cy="67" r="4.5" fill="#1E1B4B" />
            <circle cx="70" cy="67" r="4.5" fill="#1E1B4B" />
          </>
        )}

        {/* Nose */}
        <polygon points="60,74 56,70 64,70" fill="#1E1B4B" />

        {/* Mouth */}
        {mood === 'celebrating' || mood === 'cheering' ? (
          <path d="M53 78 Q60 88 67 78 Z" fill="#F43F5E" stroke="#1E1B4B" strokeWidth="1.5" />
        ) : (
          <path d="M54 78 Q60 83 66 78" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Cheeks */}
        <circle cx="39" cy="74" r="4" fill="#FDA4AF" opacity="0.8" />
        <circle cx="81" cy="74" r="4" fill="#FDA4AF" opacity="0.8" />

        {/* Celebratory stars / rocket sparkle */}
        {mood === 'celebrating' && (
          <>
            <path d="M18 30 L22 34 L18 38 L14 34 Z" fill="#F59E0B" />
            <path d="M102 30 L106 34 L102 38 L98 34 Z" fill="#F59E0B" />
          </>
        )}
      </svg>
    </div>
  );
}
