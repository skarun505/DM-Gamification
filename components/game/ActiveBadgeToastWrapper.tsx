'use client';

import React from 'react';
import { useGame } from './GameContext';
import { BadgeToast } from './BadgeToast';

export function ActiveBadgeToastWrapper() {
  const { activeBadgeToast, closeBadgeToast } = useGame();
  return <BadgeToast badge={activeBadgeToast} onClose={closeBadgeToast} />;
}

