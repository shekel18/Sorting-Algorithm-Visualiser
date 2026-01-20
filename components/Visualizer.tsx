
import React, { useMemo } from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR, SWAP_COLOR, PENGUIN_ICON_URI } from '../constants';
import { SortingAlgorithm, SortStats } from '../types';

interface VisualizerProps {
  array: number[];
  activeIndices: number[];
  swapIndices: number[];
  sortedIndices: number[];
  isResetting?: boolean;
  theme: 'light' | 'dark' | 'penguin';
  algorithm: SortingAlgorithm;
  debugVars?: {i?: number, j?: number, pivot?: number, step: number};
  stats: SortStats;
  label: string;
  isContender?: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ 
  array, activeIndices, swapIndices, sortedIndices, 
  isResetting, theme, algorithm, debugVars, stats, label, isContender 
}) => {
  const isBogo = algorithm === SortingAlgorithm.BogoSort;
  const isFinished = sortedIndices.length === array.length && array.length > 0;

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

  const penguinMetrics = useMemo(() => {
    const size = array.length > 75 ? 12 : array.length > 40 ? 20 : 36;
    const margin = array.length > 75 ? 1 : array.length > 40 ? 3 : 6;
    return { size, margin };
  }, [array.length]);

  const verticalScaleFactor = theme === 'penguin' ? 75 : 85;

  return (
    <div className={`w-full h-full min-h-[400px] flex flex-col items-center justify-end relative pb-8 rounded-2xl border transition-all duration-300 ${isContender ? 'bg-black/5 border-primary/20' : 'bg-transparent border-transparent'}`}>
      
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 z-40">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${isContender ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    {label}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-textPrimary truncate">{algorithm}</h3>
            </div>
            {isFinished && (
                <div className="flex items-center gap-1 animate-bounce text-secondary font-black text-[10px] uppercase">
                    🏆 Winner
                </div>
            )}
        </div>

        <div className="flex gap-4 p-2 bg-surface/50 backdrop-blur-md rounded-lg border border-primary/10 shadow-sm w-fit text-[10px] font-mono font-black">
            <div className="flex flex-col">
                <span className="text-textSecondary uppercase tracking-tighter">Compares</span>
                <span className="text-primary">{stats.comparisons.toLocaleString()}</span>
            </div>
            <div className="flex flex-col border-l border-textSecondary/10 pl-4">
                <span className="text-textSecondary uppercase tracking-tighter">Moves</span>
                <span className="text-accent">{(stats.swaps + stats.overwrites).toLocaleString()}</span>
            </div>
        </div>
      </div>
      
      {!isContender && debugVars && debugVars.step > 0 && (
          <div className="absolute bottom-16 right-4 p-2 bg-surface/80 backdrop-blur-md rounded-xl border border-primary/20 shadow-xl z-[45] font-mono text-[10px] min-w-[120px]">
              <div className="text-emerald-500 font-black">i: {debugVars.i}</div>
              <div className="text-rose-500 font-black">j: {debugVars.j}</div>
          </div>
      )}

      <div className="w-full h-full flex justify-center items-end px-4 gap-px">
        {array.map((value, idx) => {
            const barHeightPercent = (value / maxValue) * verticalScaleFactor;
            const barWidth = 100 / array.length;
            
            return (
            <div key={idx} className="bar-wrapper relative" style={{ height: `${barHeightPercent}%`, width: `${barWidth}%`, maxWidth: '40px' }}>
                {theme === 'penguin' && (
                <img src={PENGUIN_ICON_URI} alt="p" className="absolute bottom-full left-1/2 -translate-x-1/2 z-10" style={{ width: `${penguinMetrics.size}px`, height: `${penguinMetrics.size}px`, marginBottom: `${penguinMetrics.margin}px` }} />
                )}
                <div className="array-bar w-full h-full transition-colors duration-150" style={{ backgroundColor: getBarColor(idx), borderRadius: '2px 2px 0 0' }} />
            </div>
            );
        })}
      </div>
    </div>
  );
};

export default Visualizer;
