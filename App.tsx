
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Visualizer from './components/Visualizer';
import Toast from './components/Toast';
import AlgorithmInfo from './components/AlgorithmInfo';
import SettingsModal from './components/SettingsModal';
import { AudioEngine } from './services/AudioEngine';
import { getRandomMessage } from './constants/messages';
import { ALGORITHM_DESCRIPTIONS } from './constants/descriptions';
import { 
  getBubbleSortAnimations, 
  getSelectionSortAnimations, 
  getInsertionSortAnimations, 
  getMergeSortAnimations, 
  getQuickSortAnimations, 
  getHeapSortAnimations, 
  getCountingSortAnimations, 
  getRadixSortAnimations, 
  getBogoSortAnimations,
  getTimsortAnimations
} from './services/sortingAlgorithms';
import { SortingAlgorithm, AnimationStep, SortDirection, ColorConfig, ArrayDistribution, SortStats } from './types';
import {
  DEFAULT_ARRAY_SIZE,
  MIN_ARRAY_SIZE,
  MAX_ARRAY_SIZE,
  MAX_SPEED,
  MIN_SPEED,
  THEME_DEFAULTS,
  FONT_OPTIONS
} from './constants';

const App: React.FC = () => {
  // Main State
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(DEFAULT_ARRAY_SIZE);
  const [speed, setSpeed] = useState<number>(MAX_SPEED / 2);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(SortingAlgorithm.Timsort);
  const [contender, setContender] = useState<SortingAlgorithm | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [sortingMode, setSortingMode] = useState<'normal' | 'turbo' | null>(null);
  
  // Duel State
  const [contenderArray, setContenderArray] = useState<number[]>([]);
  const [contenderActiveIndices, setContenderActiveIndices] = useState<number[]>([]);
  const [contenderSwapIndices, setContenderSwapIndices] = useState<number[]>([]);
  const [contenderSortedIndices, setContenderSortedIndices] = useState<number[]>([]);
  const [contenderStats, setContenderStats] = useState<SortStats>({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
  const [contenderIsSorted, setContenderIsSorted] = useState<boolean>(false);
  
  // Playback State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [stats, setStats] = useState<SortStats>({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
  
  // Global App State
  const [theme, setTheme] = useState<'light' | 'dark' | 'penguin'>('dark');
  const [showBogoSort, setShowBogoSort] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [colors, setColors] = useState<ColorConfig>(THEME_DEFAULTS[theme]);
  const [fontFamily, setFontFamily] = useState<string>(FONT_OPTIONS[0].value);
  
  // Debug & Line Tracking
  const [currentLine, setCurrentLine] = useState<number>(-1);
  const [debugVars, setDebugVars] = useState<{i?: number, j?: number, pivot?: number, step: number}>({step: 0});

  // Refs for animation control
  const timeoutRef = useRef<number | null>(null);
  const contenderTimeoutRef = useRef<number | null>(null);
  const animationIndexRef = useRef<number>(0);
  const contenderIndexRef = useRef<number>(0);
  const animationsRef = useRef<AnimationStep[]>([]);
  const contenderAnimationsRef = useRef<AnimationStep[]>([]);
  const originalArrayRef = useRef<number[]>([]);
  const currentArrayRef = useRef<number[]>([]);
  const currentContenderArrayRef = useRef<number[]>([]);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const isAudioInitialized = useRef(false);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'penguin');
    root.classList.add(theme);
    setColors(THEME_DEFAULTS[theme]);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-swap', colors.swap);
    root.style.setProperty('--font-main', fontFamily);
  }, [colors, fontFamily]);
  
  useEffect(() => {
    if (theme === 'penguin' && arraySize === MIN_ARRAY_SIZE) {
      setShowBogoSort(true);
    } else {
      setShowBogoSort(false);
      if (algorithm === SortingAlgorithm.BogoSort) {
        setAlgorithm(SortingAlgorithm.Timsort);
      }
    }
  }, [theme, arraySize, algorithm]);

  const generateArray = useCallback((size: number, distribution: ArrayDistribution = 'random', customArray?: number[]) => {
    setIsSorted(false);
    setContenderIsSorted(false);
    setSortedIndices([]);
    setContenderSortedIndices([]);
    setCurrentLine(-1);
    setStats({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
    setContenderStats({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
    setDebugVars({step: 0});
    
    let newArray: number[] = [];
    if (customArray) {
      newArray = [...customArray];
    } else {
      const minHeight = 40;
      const maxHeight = 450;
      const range = maxHeight - minHeight;
      const step = range / size;
      for (let i = 0; i < size; i++) newArray.push(minHeight + (i + 1) * step);

      if (distribution === 'random') {
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
      } else if (distribution === 'reversed') {
        newArray.reverse();
      } else if (distribution === 'nearly-sorted') {
        for (let i = 0; i < size / 10; i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
        }
      } else if (distribution === 'few-unique') {
        const uniqueValues = [minHeight + range * 0.2, minHeight + range * 0.5, minHeight + range * 0.8];
        newArray = newArray.map(() => uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
      }
    }

    setArray(newArray);
    currentArrayRef.current = [...newArray];
    setContenderArray([...newArray]);
    currentContenderArrayRef.current = [...newArray];
    originalArrayRef.current = [...newArray];
    if (customArray) setArraySize(customArray.length);
  }, []);

  useEffect(() => {
    generateArray(arraySize);
  }, [arraySize, generateArray]);

  const clearTimeoutAnimation = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (contenderTimeoutRef.current) window.clearTimeout(contenderTimeoutRef.current);
    timeoutRef.current = null;
    contenderTimeoutRef.current = null;
  };
  
  const showCompletionToast = useCallback(() => {
    const message = getRandomMessage(algorithm);
    setToastMessage(message);
  }, [algorithm]);

  const onSortCompletion = useCallback((isContender: boolean = false) => {
      if (!isContender) {
          setActiveIndices([]);
          setSwapIndices([]);
          setIsSorted(true);
          setCurrentLine(-1);
          setSortedIndices(Array.from(Array(currentArrayRef.current.length).keys()));
          audioEngineRef.current?.playFinalSortSound();
          if (!contender) setSortingMode(null);
          showCompletionToast();
      } else {
          setContenderActiveIndices([]);
          setContenderSwapIndices([]);
          setContenderIsSorted(true);
          setContenderSortedIndices(Array.from(Array(currentContenderArrayRef.current.length).keys()));
      }
  }, [contender, showCompletionToast]);

  const handleStop = useCallback(() => {
    clearTimeoutAnimation();
    setSortingMode(null);
    setIsPaused(false);
    setIsSorted(false);
    setContenderIsSorted(false);
    setCurrentLine(-1);
    const restored = [...originalArrayRef.current];
    setArray(restored);
    currentArrayRef.current = [...restored];
    setContenderArray(restored);
    currentContenderArrayRef.current = [...restored];
    setActiveIndices([]);
    setSwapIndices([]);
    setSortedIndices([]);
    setContenderActiveIndices([]);
    setContenderSwapIndices([]);
    setContenderSortedIndices([]);
    setStats({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
    setContenderStats({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
    animationIndexRef.current = 0;
    contenderIndexRef.current = 0;
  }, []);

  const getAnimationsFor = (alg: SortingAlgorithm, arr: number[]) => {
    const arrayCopy = [...arr];
    const isAsc = sortDirection === 'asc';
    switch (alg) {
      case SortingAlgorithm.BubbleSort: return getBubbleSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.SelectionSort: return getSelectionSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.InsertionSort: return getInsertionSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.MergeSort: return getMergeSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.QuickSort: return getQuickSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.HeapSort: return getHeapSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.CountingSort: return getCountingSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.RadixSort: return getRadixSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.BogoSort: return getBogoSortAnimations(arrayCopy, isAsc);
      case SortingAlgorithm.Timsort: return getTimsortAnimations(arrayCopy, isAsc);
      default: return [];
    }
  };

  const prepareForSort = () => {
    setToastMessage(null);
    animationsRef.current = getAnimationsFor(algorithm, currentArrayRef.current);
    if (contender) contenderAnimationsRef.current = getAnimationsFor(contender, currentArrayRef.current);
    animationIndexRef.current = 0;
    contenderIndexRef.current = 0;
    setIsPaused(false);
    setIsSorted(false);
    setContenderIsSorted(false);
    setSortedIndices([]);
    setContenderSortedIndices([]);
    setActiveIndices([]);
    setSwapIndices([]);
    setContenderActiveIndices([]);
    setContenderSwapIndices([]);
    setStats({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
    setContenderStats({comparisons: 0, swaps: 0, overwrites: 0, steps: 0});
    setDebugVars({step: 0});
  };
  
  const handleStartSort = useCallback((mode: 'normal' | 'turbo') => {
    if (sortingMode || isSorted) return;
    if (!isAudioInitialized.current) {
        isAudioInitialized.current = audioEngineRef.current?.initialize() ?? false;
        audioEngineRef.current?.setVolume(volume);
        audioEngineRef.current?.setMuted(isMuted);
    }
    prepareForSort();
    setSortingMode(mode);
  }, [sortingMode, isSorted, algorithm, contender, sortDirection, volume, isMuted]);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      audioEngineRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    audioEngineRef.current?.setVolume(newVolume);
  }, []);

  const handleStep = useCallback(() => {
    if (sortingMode === 'normal' && isPaused) {
      performStep(false);
      if (contender) performStep(true);
    }
  }, [sortingMode, isPaused, contender]);

  const performStep = (isContender: boolean) => {
    const indexRef = isContender ? contenderIndexRef : animationIndexRef;
    const animations = isContender ? contenderAnimationsRef.current : animationsRef.current;
    if (indexRef.current >= animations.length) {
      onSortCompletion(isContender);
      return;
    }
    const animation = animations[indexRef.current];
    const [type] = animation;

    if (!isContender) {
      const map = ALGORITHM_DESCRIPTIONS[algorithm]?.lineMap;
      if (map && map[type] !== undefined) setCurrentLine(map[type]);
      setDebugVars(prev => ({...prev, step: prev.step + 1}));
    }

    if (type === 'compare' || type === 'pivot') {
      const [, idx1, idx2] = animation;
      if (isContender) {
        setContenderStats(prev => ({...prev, comparisons: prev.comparisons + 1, steps: prev.steps + 1}));
        setContenderActiveIndices([idx1, idx2]);
        setContenderSwapIndices([]);
      } else {
        setStats(prev => ({...prev, comparisons: prev.comparisons + 1, steps: prev.steps + 1}));
        setActiveIndices([idx1, idx2]);
        setSwapIndices([]);
        setDebugVars(prev => ({...prev, i: idx1, j: idx2, pivot: type === 'pivot' ? idx1 : prev.pivot}));
        const val = currentArrayRef.current[idx1] || 250;
        audioEngineRef.current?.playCompareSound(val, 500);
      }
    } else if (type === 'swap') {
      const [, idx1, idx2] = animation;
      if (isContender) {
        setContenderStats(prev => ({...prev, swaps: prev.swaps + 1, steps: prev.steps + 1}));
        setContenderSwapIndices([idx1, idx2]);
        setContenderActiveIndices([]);
        const next = [...currentContenderArrayRef.current];
        [next[idx1], next[idx2]] = [next[idx2], next[idx1]];
        currentContenderArrayRef.current = next;
        setContenderArray(next);
      } else {
        setStats(prev => ({...prev, swaps: prev.swaps + 1, steps: prev.steps + 1}));
        setSwapIndices([idx1, idx2]);
        setActiveIndices([]);
        const next = [...currentArrayRef.current];
        [next[idx1], next[idx2]] = [next[idx2], next[idx1]];
        currentArrayRef.current = next;
        setArray(next);
        audioEngineRef.current?.playSwapSound();
      }
    } else if (type === 'overwrite') {
      const [, idx, newValue] = animation;
      if (isContender) {
        setContenderStats(prev => ({...prev, overwrites: prev.overwrites + 1, steps: prev.steps + 1}));
        setContenderSwapIndices([idx]);
        setContenderActiveIndices([]);
        const next = [...currentContenderArrayRef.current];
        next[idx] = newValue;
        currentContenderArrayRef.current = next;
        setContenderArray(next);
      } else {
        setStats(prev => ({...prev, overwrites: prev.overwrites + 1, steps: prev.steps + 1}));
        setSwapIndices([idx]);
        setActiveIndices([]);
        const next = [...currentArrayRef.current];
        next[idx] = newValue;
        currentArrayRef.current = next;
        setArray(next);
        audioEngineRef.current?.playCompareSound(newValue, 500);
      }
    } else if (type === 'sorted') {
      const [, idx] = animation;
      if (isContender) {
        setContenderActiveIndices([]);
        setContenderSortedIndices(prev => [...prev, idx]);
      } else {
        setActiveIndices([]);
        setSortedIndices(prev => [...prev, idx]);
        audioEngineRef.current?.playSortedSound(sortedIndices.length, currentArrayRef.current.length);
      }
    }
    indexRef.current++;
  };

  const animate = useCallback(() => {
    performStep(false);
    if (sortingMode === 'normal' && !isPaused && animationIndexRef.current < animationsRef.current.length) {
      const factor = Math.pow(1 / 2000, 1 / (MAX_SPEED - MIN_SPEED));
      const scale = 2000 / Math.pow(factor, MIN_SPEED);
      const animationSpeed = scale * Math.pow(factor, speed);
      timeoutRef.current = window.setTimeout(animate, animationSpeed);
    } else if (animationIndexRef.current >= animationsRef.current.length) {
      onSortCompletion(false);
    }
  }, [speed, sortingMode, isPaused, onSortCompletion]);

  const animateContender = useCallback(() => {
    performStep(true);
    if (sortingMode === 'normal' && !isPaused && contenderIndexRef.current < contenderAnimationsRef.current.length) {
      const factor = Math.pow(1 / 2000, 1 / (MAX_SPEED - MIN_SPEED));
      const scale = 2000 / Math.pow(factor, MIN_SPEED);
      const animationSpeed = scale * Math.pow(factor, speed);
      contenderTimeoutRef.current = window.setTimeout(animateContender, animationSpeed);
    } else if (contenderIndexRef.current >= contenderAnimationsRef.current.length) {
      onSortCompletion(true);
    }
  }, [speed, sortingMode, isPaused, onSortCompletion]);

  useEffect(() => {
    if (sortingMode === 'normal' && !isPaused) {
      animate();
      if (contender) animateContender();
    } else {
      clearTimeoutAnimation();
    }
    return clearTimeoutAnimation;
  }, [sortingMode, isPaused, animate, animateContender, contender]);

  useEffect(() => {
    if (sortingMode === 'turbo' && !isPaused) {
        const turboInterval = setInterval(() => {
            for(let i=0; i < 20; i++) {
                if (animationIndexRef.current < animationsRef.current.length) performStep(false);
                if (contender && contenderIndexRef.current < contenderAnimationsRef.current.length) performStep(true);
            }
            if (animationIndexRef.current >= animationsRef.current.length && (!contender || contenderIndexRef.current >= contenderAnimationsRef.current.length)) {
                clearInterval(turboInterval);
                setSortingMode(null);
            }
        }, 16);
        return () => clearInterval(turboInterval);
    }
  }, [sortingMode, isPaused, contender]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'Enter') { if (!sortingMode) handleStartSort('normal'); }
      else if (e.key === ' ') { e.preventDefault(); if (sortingMode) setIsPaused(p => !p); }
      else if (e.key === 'Escape') { if (sortingMode) handleStop(); }
      else if (e.key === 't' || e.key === 'T') { if (!sortingMode) handleStartSort('turbo'); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sortingMode, handleStartSort, handleStop]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header 
        setTheme={setTheme} theme={theme} isMuted={isMuted} onToggleMute={handleToggleMute} volume={volume}
        onVolumeChange={handleVolumeChange} onInfoToggle={() => setIsInfoOpen(!isInfoOpen)}
        isInfoOpen={isInfoOpen} onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
      />
      <ControlPanel
        arraySize={arraySize} onArraySizeChange={setArraySize} speed={speed} onSpeedChange={setSpeed}
        algorithm={algorithm} onAlgorithmChange={setAlgorithm} contender={contender} onContenderChange={setContender}
        sortDirection={sortDirection} onSortDirectionChange={setSortDirection}
        // Fix: Changed from (dist) => generateArray(arraySize, dist) to a 0-argument function to match ControlPanelProps
        onGenerateArray={() => generateArray(arraySize)}
        onStartSort={handleStartSort} onPauseResume={() => setIsPaused(!isPaused)}
        onStep={handleStep} onStop={handleStop} onReset={() => { handleStop(); handleStartSort(sortingMode || 'normal'); }}
        sortingMode={sortingMode} isPaused={isPaused} isSorted={isSorted} showBogoSort={showBogoSort}
      />
      <main className="flex-grow flex flex-col lg:flex-row items-stretch justify-center p-2 sm:p-4 gap-4 relative">
        <div className={`flex-grow flex flex-col items-center justify-center relative transition-all duration-500 ${contender ? 'lg:flex-row gap-4' : ''}`}>
          <div className={`relative transition-all duration-500 h-full w-full ${contender ? 'lg:w-1/2' : 'w-full'}`}>
            <Visualizer
              array={array} activeIndices={activeIndices} swapIndices={swapIndices} sortedIndices={sortedIndices}
              theme={theme} algorithm={algorithm} debugVars={debugVars} stats={stats} label="Primary"
            />
          </div>
          {contender && (
            <div className="relative h-full w-full lg:w-1/2 animate-in slide-in-from-right-10 duration-500">
               <Visualizer
                array={contenderArray} activeIndices={contenderActiveIndices} swapIndices={contenderSwapIndices} sortedIndices={contenderSortedIndices}
                theme={theme} algorithm={contender} stats={contenderStats} label="Contender" isContender
              />
            </div>
          )}
        </div>
        {isInfoOpen && (
          <AlgorithmInfo algorithm={algorithm} onClose={() => setIsInfoOpen(false)} highlightedLine={currentLine} />
        )}
        {isSettingsOpen && (
          <SettingsModal colors={colors} onColorsChange={setColors} fontFamily={fontFamily} onFontFamilyChange={setFontFamily} theme={theme} onClose={() => setIsSettingsOpen(false)} />
        )}
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
