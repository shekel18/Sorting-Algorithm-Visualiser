
import React, { useState } from 'react';
import { SortingAlgorithm, SortDirection, ArrayDistribution } from '../types';
import { ALGORITHMS, BOGO_SORT_ALGORITHM, MIN_ARRAY_SIZE, MAX_ARRAY_SIZE, MIN_SPEED, MAX_SPEED } from '../constants';

const LightningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);

const StepIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" /></svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
);

const ShortcutHint = ({ children }: { children?: React.ReactNode }) => (
  <span className="hidden lg:inline text-[10px] opacity-60 font-mono ml-1 px-1 rounded bg-black/10">[{children}]</span>
);

interface ControlPanelProps {
  arraySize: number;
  onArraySizeChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  algorithm: SortingAlgorithm;
  onAlgorithmChange: (value: SortingAlgorithm) => void;
  contender: SortingAlgorithm | null;
  onContenderChange: (value: SortingAlgorithm | null) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (value: SortDirection) => void;
  onGenerateArray: (dist: ArrayDistribution) => void;
  onCustomArray: (array: number[]) => void;
  onStartSort: (mode: 'normal' | 'turbo') => void;
  onPauseResume: () => void;
  onStep: () => void;
  onStop: () => void;
  onReset: () => void;
  sortingMode: 'normal' | 'turbo' | null;
  isPaused: boolean;
  isSorted: boolean;
  showBogoSort: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  arraySize, onArraySizeChange, speed, onSpeedChange,
  algorithm, onAlgorithmChange, contender, onContenderChange,
  sortDirection, onSortDirectionChange, onGenerateArray, onCustomArray,
  onStartSort, onPauseResume, onStep, onStop, onReset,
  sortingMode, isPaused, isSorted, showBogoSort
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const isSorting = sortingMode !== null;
  
  const buttonBaseClasses = "px-3 sm:px-4 py-2 rounded-md font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2 touch-manipulation";
  const enabledButtonClasses = "bg-primary text-white hover:opacity-90 shadow-sm hover:shadow-md active:scale-95";
  const disabledButtonClasses = "bg-gray-300 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none";
  
  const handleCustomSubmit = () => {
    const nums = customInputValue.split(/[\s,]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      onCustomArray(nums);
      setIsCustomInputOpen(false);
    }
  };

  return (
    <div className="bg-surface p-3 sm:p-4 shadow-lg border-b border-textSecondary/10 transition-colors duration-300 z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onGenerateArray('random')}
                    disabled={isSorting}
                    className={`${buttonBaseClasses} h-10 ${isSorting ? disabledButtonClasses : 'bg-indigo-600 dark:bg-indigo-500 text-white'}`}
                >
                    <RefreshIcon />
                    <span className="hidden sm:inline">Shuffle</span>
                </button>
                
                <div className="flex bg-background/50 p-1 rounded-lg border border-textSecondary/20">
                    {(['nearly-sorted', 'reversed', 'few-unique'] as ArrayDistribution[]).map(dist => (
                        <button
                            key={dist}
                            onClick={() => onGenerateArray(dist)}
                            disabled={isSorting}
                            className={`p-1.5 px-3 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${isSorting ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary/10 text-textSecondary hover:text-primary'}`}
                            title={dist.replace('-', ' ')}
                        >
                            {dist.charAt(0)}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsCustomInputOpen(!isCustomInputOpen)}
                    disabled={isSorting}
                    className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg ${isSorting ? disabledButtonClasses : 'bg-background/50 border border-textSecondary/20 text-textSecondary hover:border-primary/40 hover:text-primary'}`}
                >
                    <EditIcon />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-primary/20">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Contender</span>
                    <select
                        value={contender || ""}
                        onChange={(e) => onContenderChange(e.target.value ? e.target.value as SortingAlgorithm : null)}
                        disabled={isSorting}
                        className="bg-transparent border-none focus:ring-0 text-xs font-bold text-textPrimary cursor-pointer"
                    >
                        <option value="">Off</option>
                        {ALGORITHMS.map(alg => (
                            <option key={alg.value} value={alg.value} disabled={alg.value === algorithm}>{alg.label}</option>
                        ))}
                    </select>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="md:hidden p-2 bg-background/50 rounded-lg border border-textSecondary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>

        {isCustomInputOpen && !isSorting && (
            <div className="flex flex-col sm:flex-row gap-2 animate-in slide-in-from-top duration-200">
                <input 
                    type="text" 
                    placeholder="E.g. 10, 45, 23, 89, 4" 
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    className="flex-grow bg-background border border-primary/40 rounded-lg px-4 h-11 focus:ring-2 focus:ring-primary focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                />
                <button onClick={handleCustomSubmit} className="bg-primary text-white px-6 h-11 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all">Apply</button>
            </div>
        )}

        <div className={`${isExpanded ? 'grid' : 'hidden md:grid'} grid-cols-2 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300`}>
          <div className="flex flex-col text-xs sm:text-sm">
            <label htmlFor="algorithm" className="mb-1 text-textSecondary font-semibold">Primary Algorithm</label>
            <select
              id="algorithm"
              value={algorithm}
              onChange={(e) => onAlgorithmChange(e.target.value as SortingAlgorithm)}
              disabled={isSorting}
              className="bg-background border border-textSecondary/30 rounded-md h-10 sm:h-11 px-2 focus:ring-2 focus:ring-primary focus:border-primary text-textPrimary disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {ALGORITHMS.map((alg) => (
                <option key={alg.value} value={alg.value}>{alg.label}</option>
              ))}
              {showBogoSort && (
                <option value={BOGO_SORT_ALGORITHM.value}>{BOGO_SORT_ALGORITHM.label} 🐧</option>
              )}
            </select>
          </div>

          <div className="flex flex-col text-xs sm:text-sm">
            <label htmlFor="order" className="mb-1 text-textSecondary font-semibold">Sort Order</label>
            <select
              id="order"
              value={sortDirection}
              onChange={(e) => onSortDirectionChange(e.target.value as SortDirection)}
              disabled={isSorting}
              className="bg-background border border-textSecondary/30 rounded-md h-10 sm:h-11 px-2 focus:ring-2 focus:ring-primary focus:border-primary text-textPrimary disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              <option value="asc">Ascending ↑</option>
              <option value="desc">Descending ↓</option>
            </select>
          </div>

          <div className="flex flex-col text-xs sm:text-sm">
            <div className="flex justify-between mb-1">
              <label htmlFor="size" className="text-textSecondary font-semibold">Array Size</label>
              <span className="text-primary font-bold">{arraySize}</span>
            </div>
            <input
              type="range" id="size" min={MIN_ARRAY_SIZE} max={MAX_ARRAY_SIZE} value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))} disabled={isSorting}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex flex-col text-xs sm:text-sm">
            <div className="flex justify-between mb-1">
              <label htmlFor="speed" className="text-textSecondary font-semibold">Visual Speed</label>
              <span className="text-primary font-bold">{speed}</span>
            </div>
            <input
              type="range" id="speed" min={MIN_SPEED} max={MAX_SPEED} value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2 border-t border-textSecondary/5">
          {!isSorting ? (
            <div className="flex gap-3 sm:gap-4 w-full justify-center">
              <button
                onClick={() => onStartSort('normal')} disabled={isSorted}
                className={`${buttonBaseClasses} flex-1 md:flex-none md:min-w-[150px] h-11 sm:h-12 sm:text-lg ${isSorted ? disabledButtonClasses : enabledButtonClasses}`}
              >
                <PlayIcon />
                <span>Start <ShortcutHint>Enter</ShortcutHint></span>
              </button>
              <button
                onClick={() => onStartSort('turbo')} disabled={isSorted}
                className={`${buttonBaseClasses} flex-1 md:flex-none md:min-w-[150px] h-11 sm:h-12 sm:text-lg ${isSorted ? disabledButtonClasses : 'bg-secondary text-white shadow-md active:scale-95'}`}
              >
                <LightningIcon />
                <span>Turbo <ShortcutHint>T</ShortcutHint></span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center w-full">
              <button
                onClick={onPauseResume}
                className={`${buttonBaseClasses} flex-1 sm:flex-none sm:min-w-[110px] h-10 sm:h-11 bg-yellow-500 text-white shadow-md active:scale-95`}
              >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              {isPaused && sortingMode === 'normal' && (
                  <button onClick={onStep} className={`${buttonBaseClasses} flex-1 sm:flex-none sm:min-w-[110px] h-10 sm:h-11 bg-emerald-500 text-white shadow-md active:scale-95`}>
                    <StepIcon />
                    <span>Step</span>
                  </button>
              )}

              <button onClick={onStop} className={`${buttonBaseClasses} flex-1 sm:flex-none sm:min-w-[110px] h-10 sm:h-11 bg-red-500 text-white shadow-md active:scale-95`}>
                <StopIcon />
                <span>Stop</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
