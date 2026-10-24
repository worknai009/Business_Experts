'use client';
import React, { useState, createContext, useContext, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const ImageComparisonContext = createContext(undefined);

const DEFAULT_SPRING_OPTIONS = {
  bounce: 0,
  duration: 0.15,
};

export function ImageComparison({
  children,
  className,
  enableHover = false,
  springOptions = DEFAULT_SPRING_OPTIONS,
  initialPosition = 50,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const motionValue = useMotionValue(initialPosition);
  const motionSliderPosition = useSpring(motionValue, springOptions);
  const [sliderPosition, setSliderPosition] = useState(initialPosition);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    motionValue.set(percentage);
    setSliderPosition(percentage);
  }, [motionValue]);

  const handlePointerDown = (event) => {
    if (enableHover) return;
    setIsDragging(true);
    updatePosition(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging && !enableHover) return;
    updatePosition(event.clientX);
  };

  const handlePointerUp = (event) => {
    if (enableHover) return;
    setIsDragging(false);
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch (e) {}
  };

  const handleKeyDown = (event) => {
    let newPos = sliderPosition;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      newPos = Math.max(0, sliderPosition - 5);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      newPos = Math.min(100, sliderPosition + 5);
    } else if (event.key === 'Home') {
      newPos = 0;
    } else if (event.key === 'End') {
      newPos = 100;
    } else {
      return;
    }
    event.preventDefault();
    motionValue.set(newPos);
    setSliderPosition(newPos);
  };

  return (
    <ImageComparisonContext.Provider
      value={{ sliderPosition, setSliderPosition, motionSliderPosition, handleKeyDown }}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative select-none overflow-hidden touch-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
          enableHover ? 'cursor-ew-resize' : 'cursor-grab active:cursor-grabbing',
          className
        )}
        tabIndex={0}
        role="slider"
        aria-label="Image comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          if (!isDragging && enableHover) return;
        }}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}

export function ImageComparisonImage({
  className,
  alt,
  src,
  position,
}) {
  const context = useContext(ImageComparisonContext);
  if (!context) return null;
  const { motionSliderPosition } = context;

  const leftClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 0 0 ${value}%)`
  );
  const rightClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 ${100 - value}% 0 0)`
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      className={cn('absolute inset-0 h-full w-full object-cover pointer-events-none select-none', className)}
      style={{
        clipPath: position === 'left' ? leftClipPath : rightClipPath,
      }}
    />
  );
}

export function ImageComparisonSlider({
  className,
  children,
}) {
  const context = useContext(ImageComparisonContext);
  if (!context) return null;
  const { motionSliderPosition } = context;

  const left = useTransform(motionSliderPosition, (value) => `${value}%`);

  return (
    <motion.div
      className={cn(
        'absolute bottom-0 top-0 w-0.5 pointer-events-none z-20 flex items-center justify-center -translate-x-1/2',
        className
      )}
      style={{ left }}
    >
      {children || (
        <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl shadow-emerald-600/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 17 3 12 8 7" />
            <polyline points="16 7 21 12 16 17" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export default ImageComparison;
