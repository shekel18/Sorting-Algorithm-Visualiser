
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Visualizer from './components/Visualizer';
import Toast from './components/Toast';
import AlgorithmInfo from './components/AlgorithmInfo';
import SettingsModal from './components/SettingsModal';
import { AudioEngine } from './services/AudioEngine';
import { getRandomMessage } from './constants/messages';
import { 
  getBubbleSortAnimations, 
  getSelectionSortAnimations, 
  getInsertionSortAnimations, 
  getMergeSortAnimations, 
  getQuickSortAnimations, 
  getHeapSortAnimations, 
  getCountingSortAnimations, 
  getRadixSortAnimations, 
  getBogoSortAnimations 
} from './services/sortingAlgorithms';
import { SortingAlgorithm, AnimationStep, SortDirection, ColorConfig } from './types';
import {
  DEFAULT_ARRAY_SIZE,
  MIN_ARRAY_SIZE,
  MAX_SPEED,
  MIN_SPEED,
  THEME_DEFAULTS,
  FONT_OPTIONS
} from './constants';

const App: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(DEFAULT_ARRAY_SIZE);
  const [speed, setSpeed] = useState<number>(MAX_SPEED / 2);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>(SortingAlgorithm.MergeSort);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [sortingMode, setSortingMode] = useState<'normal' | 'turbo' | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'penguin'>('dark');
  const [showBogoSort, setShowBogoSort] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [colors, setColors] = useState<ColorConfig>(THEME_DEFAULTS[theme]);
  const [fontFamily, setFontFamily] = useState<string>(FONT_OPTIONS[0].value);

  const timeoutRef = useRef<number | null>(null);
  const animationIndexRef = useRef<number>(0);
  const animationsRef = useRef<AnimationStep[]>([]);
  const originalArrayRef = useRef<number[]>([]);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const isAudioInitialized = useRef(false);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
  }, []);

  // Update theme classes and reset colors to defaults when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'penguin');
    root.classList.add(theme);
    setColors(THEME_DEFAULTS[theme]);
  }, [theme]);

  // Apply custom colors and font to CSS variables
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
        setAlgorithm(SortingAlgorithm.MergeSort);
      }
    }
  }, [theme, arraySize, algorithm]);

  const generateArray = useCallback((size: number) => {
    setIsSorted(false);
    setSortedIndices([]);
    
    // Using a linear sequence for a smoother slope
    const minHeight = 40;
    const maxHeight = 450;
    const range = maxHeight - minHeight;
    const step = range / size;
    
    const newArray: number[] = [];
    for (let i = 0; i < size; i++) {
      // Create a perfectly distributed set of values
      newArray.push(minHeight + (i + 1) * step);
    }

    // Fisher-Yates Shuffle to randomize the sequence
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    setArray(newArray);
    originalArrayRef.current = [...newArray];
  }, []);

  useEffect(() => {
    generateArray(arraySize);
  }, [arraySize, generateArray]);

  const clearTimeoutAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  const showCompletionToast = useCallback(() => {
    const message = getRandomMessage(algorithm);
    setToastMessage(message);
  }, [algorithm]);

  const onSortCompletion = useCallback(() => {
      setActiveIndices([]);
      setSwapIndices([]);
      setSortingMode(null);
      setIsSorted(true);
      setSortedIndices(Array.from(Array(array.length).keys()));
      audioEngineRef.current?.playFinalSortSound();
      showCompletionToast();
  }, [array.length, showCompletionToast]);


  const resetArrayAndAnimations = useCallback(() => {
    clearTimeoutAnimation();
    setSortingMode(null);
    setIsPaused(false);
    setIsSorted(false);
    setSortedIndices([]);
    setActiveIndices([]);
    setSwapIndices([]);
    animationIndexRef.current = 0;
    animationsRef.current = [];
    generateArray(arraySize);
  }, [arraySize, generateArray]);

  const prepareForSort = () => {
    setToastMessage(null);
    originalArrayRef.current = [...array];
    const arrayCopy = [...array];
    const isAsc = sortDirection === 'asc';
    
    switch (algorithm) {
      case SortingAlgorithm.BubbleSort: animationsRef.current = getBubbleSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.SelectionSort: animationsRef.current = getSelectionSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.InsertionSort: animationsRef.current = getInsertionSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.MergeSort: animationsRef.current = getMergeSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.QuickSort: animationsRef.current = getQuickSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.HeapSort: animationsRef.current = getHeapSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.CountingSort: animationsRef.current = getCountingSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.RadixSort: animationsRef.current = getRadixSortAnimations(arrayCopy, isAsc); break;
      case SortingAlgorithm.BogoSort: animationsRef.current = getBogoSortAnimations(arrayCopy, isAsc); break;
      default: break;
    }
    animationIndexRef.current = 0;
    setIsPaused(false);
    setIsSorted(false);
    setSortedIndices([]);
    setActiveIndices([]);
    setSwapIndices([]);
  };
  
  const handleStartSort = useCallback((mode: 'normal' | 'turbo') => {
    if (sortingMode || isSorted) return;
    if (!isAudioInitialized.current) {
        isAudioInitialized.current = audioEngineRef.current?.initialize() ?? false;
        audioEngineRef.current?.setVolume(volume);
    }
    prepareForSort();
    setSortingMode(mode);
  }, [sortingMode, isSorted, array, algorithm, sortDirection, volume]);

  const handlePauseResume = useCallback(() => {
    if (sortingMode) {
      setIsPaused(prev => !prev);
    }
  }, [sortingMode]);

  const handleStop = useCallback(() => {
    clearTimeoutAnimation();
    setSortingMode(null);
    setIsPaused(false);
    setIsSorted(false);
    setArray([...originalArrayRef.current]);
    setActiveIndices([]);
    setSwapIndices([]);
    setSortedIndices([]);
    animationIndexRef.current = 0;
    animationsRef.current = [];
  }, []);

  const handleReset = useCallback(() => {
    if (sortingMode) {
      clearTimeoutAnimation();
      animationIndexRef.current = 0;
      setArray([...originalArrayRef.current]);
      setActiveIndices([]);
      setSwapIndices([]);
      setSortedIndices([]);
      setIsPaused(false);
      setIsSorted(false);
      setIsResetting(true);
      // Increased timeout to accommodate staggered animation delay in Visualizer
      setTimeout(() => setIsResetting(false), 700);

      const currentMode = sortingMode;
      setSortingMode(null);
      setTimeout(() => setSortingMode(currentMode), 0);
    } else {
      resetArrayAndAnimations();
    }
  }, [sortingMode, resetArrayAndAnimations]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLSelectElement || activeElement instanceof HTMLTextAreaElement;
      if (isInput) return;
      const key = e.key.toLowerCase();
      if (e.code === 'Space' || key === ' ') {
        e.preventDefault();
        handlePauseResume();
      } else if (e.code === 'KeyR' || key === 'r') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'Enter' || key === 'enter') {
        e.preventDefault();
        handleStartSort('normal');
      } else if (e.code === 'KeyT' || key === 't') {
        e.preventDefault();
        handleStartSort('turbo');
      } else if (e.code === 'Escape' || key === 'escape') {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePauseResume, handleReset, handleStartSort, handleStop]);

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (!isAudioInitialized.current) {
      isAudioInitialized.current = audioEngineRef.current?.initialize() ?? false;
    }
    audioEngineRef.current?.setMuted(newMutedState);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (!isAudioInitialized.current) {
      isAudioInitialized.current = audioEngineRef.current?.initialize() ?? false;
    }
    audioEngineRef.current?.setVolume(newVolume);
  };

  const animate = useCallback(() => {
    if (animationIndexRef.current >= animationsRef.current.length) {
      onSortCompletion();
      return;
    }
    const animation = animationsRef.current[animationIndexRef.current];
    const [type] = animation;
    if (type === 'compare' || type === 'pivot') {
      const [, idx1] = animation;
      setActiveIndices([animation[1], animation[2]]);
      setSwapIndices([]);
      audioEngineRef.current?.playCompareSound(array[idx1], 500);
    } else if (type === 'swap') {
      audioEngineRef.current?.playSwapSound();
      const [, idx1, idx2] = animation;
      setSwapIndices([idx1, idx2]);
      setActiveIndices([]);
      setArray(prevArray => {
        const newArray = [...prevArray];
        [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
        return newArray;
      });
    } else if (type === 'overwrite') {
      const [, idx, newValue] = animation;
      setSwapIndices([idx]);
      setActiveIndices([]);
      audioEngineRef.current?.playCompareSound(newValue, 500);
      setArray(prevArray => {
        const newArray = [...prevArray];
        newArray[idx] = newValue;
        return newArray;
      });
    } else if (type === 'sorted') {
      const [, idx] = animation;
      setSwapIndices([]);
      setActiveIndices([]);
      audioEngineRef.current?.playSortedSound(sortedIndices.length, array.length);
      setSortedIndices(prev => [...prev, idx]);
    }
    animationIndexRef.current++;
    const maxDelay = 2000;
    const minDelay = 1;
    const factor = Math.pow(minDelay / maxDelay, 1 / (MAX_SPEED - MIN_SPEED));
    const scale = maxDelay / Math.pow(factor, MIN_SPEED);
    const animationSpeed = scale * Math.pow(factor, speed);
    timeoutRef.current = window.setTimeout(animate, animationSpeed);
  }, [array, speed, sortedIndices.length, onSortCompletion]);

  const animateTurbo = useCallback(() => {
    if (animationIndexRef.current >= animationsRef.current.length) {
      setActiveIndices([]);
      setSwapIndices([]);
      setSortingMode(null);
      setIsSorted(true);
      setSortedIndices(Array.from(Array(arraySize).keys()));
      audioEngineRef.current?.playFinalSortSound();
      showCompletionToast();
      return;
    }
    const CHUNK_SIZE = Math.max(10, Math.ceil(animationsRef.current.length / 80));
    let lastActive: number[] = [];
    let lastSwapped: number[] = [];
    setArray(currentArray => {
      const newArray = [...currentArray];
      let i = 0;
      while (i < CHUNK_SIZE && animationIndexRef.current < animationsRef.current.length) {
        const animation = animationsRef.current[animationIndexRef.current];
        const [type] = animation;
        if (type === 'compare' || type === 'pivot') {
          const [, idx1, idx2] = animation;
          lastActive = [idx1, idx2];
          lastSwapped = [];
        } else if (type === 'swap') {
          const [, idx1, idx2] = animation;
          [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
          lastSwapped = [idx1, idx2];
          lastActive = [];
        } else if (type === 'overwrite') {
          const [, idx, newValue] = animation;
          newArray[idx] = newValue;
          lastSwapped = [idx];
          lastActive = [];
        }
        animationIndexRef.current++;
        i++;
      }
      return newArray;
    });
    setActiveIndices(lastActive);
    setSwapIndices(lastSwapped);
    timeoutRef.current = window.setTimeout(animateTurbo, 16);
  }, [arraySize, showCompletionToast]);

  useEffect(() => {
    if (sortingMode && !isPaused) {
      if (sortingMode === 'normal') {
        animate();
      } else if (sortingMode === 'turbo') {
        animateTurbo();
      }
    } else {
      clearTimeoutAnimation();
    }
    return clearTimeoutAnimation;
  }, [sortingMode, isPaused, animate, animateTurbo]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header 
        setTheme={setTheme} 
        theme={theme} 
        isMuted={isMuted} 
        onToggleMute={handleToggleMute} 
        volume={volume}
        onVolumeChange={handleVolumeChange}
        onInfoToggle={() => setIsInfoOpen(!isInfoOpen)}
        isInfoOpen={isInfoOpen}
        onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
      />
      <ControlPanel
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        speed={speed}
        onSpeedChange={setSpeed}
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        onGenerateArray={resetArrayAndAnimations}
        onStartSort={handleStartSort}
        onPauseResume={handlePauseResume}
        onStop={handleStop}
        onReset={handleReset}
        sortingMode={sortingMode}
        isPaused={isPaused}
        isSorted={isSorted}
        showBogoSort={showBogoSort}
      />
      <main className="flex-grow flex items-center justify-center p-2 sm:p-4 relative">
        <Visualizer
          array={array}
          activeIndices={activeIndices}
          swapIndices={swapIndices}
          sortedIndices={sortedIndices}
          isResetting={isResetting}
          theme={theme}
          algorithm={algorithm}
        />
        {isInfoOpen && (
          <AlgorithmInfo algorithm={algorithm} onClose={() => setIsInfoOpen(false)} />
        )}
        {isSettingsOpen && (
          <SettingsModal 
            colors={colors} 
            onColorsChange={setColors} 
            fontFamily={fontFamily}
            onFontFamilyChange={setFontFamily}
            theme={theme} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        )}
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
