'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SparklesCore to prevent SSR issues
const SparklesCoreComponent = dynamic(
  () => import('./sparkles').then((mod) => ({ default: mod.SparklesCore })),
  {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%' }} />,
  }
);

type SafeSparklesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export function SafeSparkles(props: SafeSparklesProps) {
  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
      <SparklesCoreComponent {...props} />
    </Suspense>
  );
}

export default SafeSparkles;