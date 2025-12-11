'use client';

import React from 'react';
import { SlateLayout } from '@/wis2l/Slate/SlateLayout';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

export default function SlatePage() {
  return (
    <ThemeProvider>
      <SlateLayout />
    </ThemeProvider>
  );
}

