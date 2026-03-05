import { cn } from '@/lib/utils';
import React from 'react';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const isHorizontal = direction === 'horizontal';

  const animationStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: `${gap}px`,
    width: isHorizontal ? 'max-content' : undefined,
    height: !isHorizontal ? 'max-content' : undefined,
    animationName: isHorizontal ? 'infiniteSliderX' : 'infiniteSliderY',
    animationDuration: `${duration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: reverse ? 'reverse' : 'normal',
    willChange: 'transform',
  };

  const hoverStyle = durationOnHover
    ? `
      .infinite-slider-track:hover {
        animation-duration: ${durationOnHover}s !important;
      }
    `
    : '';

  return (
    <div className={cn('overflow-hidden', className)}>
      <style>{`
        @keyframes infiniteSliderX {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes infiniteSliderY {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        ${hoverStyle}
      `}</style>
      <div className="infinite-slider-track" style={animationStyle}>
        {children}
        {children}
      </div>
    </div>
  );
}
