
import React, { useMemo } from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR, SWAP_COLOR, PENGUIN_ICON_URI } from '../constants';
import { SortingAlgorithm } from '../types';

interface VisualizerProps {
  array: number[];
  activeIndices: number[];
  swapIndices: number[];
  sortedIndices: number[];
  isResetting?: boolean;
  theme: 'light' | 'dark' | 'penguin';
  algorithm: SortingAlgorithm;
}

const Visualizer: React.FC<VisualizerProps> = ({ array, activeIndices, swapIndices, sortedIndices, isResetting, theme, algorithm }) => {
  const isBogo = algorithm === SortingAlgorithm.BogoSort;

  const maxValue = useMemo(() => {
    return array.length > 0 ? Math.max(...array) : 1;
  }, [array]);

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return SECONDARY_COLOR;
    if (swapIndices.includes(index)) return SWAP_COLOR;
    if (activeIndices.includes(index)) return ACCENT_COLOR;
    if (isBogo) {
      const isOutOfOrder = (index > 0 && array[index] < array[index - 1]) || 
                         (index < array.length - 1 && array[index] > array[index + 1]);
      if (isOutOfOrder && !sortedIndices.includes(index)) return theme === 'penguin' ? '#FF4500' : '#EF4444';
    }
    return PRIMARY_COLOR;
  };

  const arrayContainerWidth = 92; // vw, slightly wider on mobile
  const gapBetweenBars = array.length > 50 ? 0.05 : 0.1; // vw
  const totalGaps = (array.length - 1) * gapBetweenBars;
  const barWidth = (arrayContainerWidth - totalGaps) / array.length;
  
  const penguinMetrics = useMemo(() => {
    const size = array.length > 75 ? 12 : array.length > 40 ? 20 : 36;
    const margin = array.length > 75 ? 1 : array.length > 40 ? 3 : 6;
    const shadowSize = array.length > 75 ? 3 : array.length > 40 ? 6 : 10;
    return { size, margin, shadowSize };
  }, [array.length]);

  const verticalScaleFactor = theme === 'penguin' ? 82 : 92;

  return (
    <div className="w-full h-[55vh] sm:h-[65vh] flex justify-center items-end px-1" style={{gap: `${gapBetweenBars}vw`}}>
      {array.map((value, idx) => {
        const isActive = activeIndices.includes(idx);
        const isSwapping = swapIndices.includes(idx);
        const isOutOfOrder = isBogo && !sortedIndices.includes(idx) && (
          (idx > 0 && array[idx] < array[idx - 1]) || 
          (idx < array.length - 1 && array[idx] > array[idx + 1])
        );
        
        const barHeightPercent = (value / maxValue) * verticalScaleFactor;
        
        let animationClass = '';
        if (isResetting) animationClass = 'animate-reset z-10';
        else if (isActive) animationClass = (isBogo ? 'animate-shake' : '') + ' z-30';
        else if (isSwapping) animationClass = 'scale-110 shadow-2xl z-50';
        else if (isOutOfOrder) animationClass = 'animate-wobble z-20';

        // Calculate staggered delay for reset wave
        const staggerDelay = isResetting ? `${idx * 4}ms` : '0ms';

        return (
          <div
            key={idx}
            className={`bar-wrapper relative transition-all duration-150 ease-out ${animationClass}`}
            style={{
              height: `${barHeightPercent}%`,
              width: `${barWidth}vw`,
              transitionProperty: isBogo ? 'transform, box-shadow' : 'height, transform, box-shadow',
              animationDelay: staggerDelay
            }}
          >
            {theme === 'penguin' && (
              <img
                src={PENGUIN_ICON_URI}
                alt="penguin"
                className={`absolute bottom-full left-1/2 -translate-x-1/2 z-10 ${(isOutOfOrder || isSwapping) ? 'brightness-125 contrast-150' : ''}`}
                style={{
                  width: `${penguinMetrics.size}px`,
                  height: `${penguinMetrics.size}px`,
                  marginBottom: `${penguinMetrics.margin}px`,
                  filter: (isOutOfOrder || isSwapping) 
                    ? `drop-shadow(0 0 ${penguinMetrics.shadowSize}px rgba(255, 69, 0, 0.8))` 
                    : 'none',
                  transition: 'all 0.2s ease',
                  animationDelay: staggerDelay
                }}
              />
            )}
            <div
              className={`array-bar w-full h-full shimmer-container ${
                isOutOfOrder 
                  ? 'ring-1 sm:ring-2 ring-accent ring-opacity-100 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                  : isSwapping ? 'ring-1 ring-white/40' : ''
              }`}
              style={{
                backgroundColor: getBarColor(idx),
                transition: 'background-color 0.1s ease-in-out, transform 0.2s ease-in-out',
                borderRadius: (isBogo && (isOutOfOrder || isSwapping)) ? '2px 2px 0 0' : '0'
              }}
            >
              {(isBogo && isSwapping) && <div className="shimmer-overlay opacity-70" />}
              {(isBogo && isActive) && <div className="shimmer-overlay opacity-30" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Visualizer;
