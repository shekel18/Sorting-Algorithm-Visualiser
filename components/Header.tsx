
import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  setTheme: (theme: 'light' | 'dark' | 'penguin') => void;
  theme: 'light' | 'dark' | 'penguin';
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  onInfoToggle: () => void;
  isInfoOpen: boolean;
  onSettingsToggle: () => void;
}

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary w-6 h-6 sm:w-8 sm:h-8">
    <rect x="3" y="14" width="4" height="6" rx="1" fill="currentColor" opacity="0.4" />
    <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="17" y="4" width="4" height="16" rx="1" fill="currentColor" />
  </svg>
);

const SpeakerIcon = ({ muted }: { muted: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {muted ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l4-4m0 4l-4-4" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6V4m0 16v-2m4.95-12.05l1.414-1.414M2.636 19.364l1.414-1.414M19.364 2.636l-1.414 1.414M4.05 19.364l-1.414-1.414M12 20a8 8 0 100-16 8 8 0 000 16z" />
    )}
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ setTheme, theme, isMuted, onToggleMute, volume, onVolumeChange, onInfoToggle, isInfoOpen, onSettingsToggle }) => {
  const [localVolume, setLocalVolume] = useState(volume);
  const smoothedVolumeRef = useRef(volume);
  const volumePercent = Math.round(localVolume * 100);

  useEffect(() => {
    setLocalVolume(volume);
    smoothedVolumeRef.current = volume;
  }, []);

  useEffect(() => {
    let animationFrame: number;
    const updateVolume = () => {
      const target = localVolume;
      const current = smoothedVolumeRef.current;
      const diff = target - current;
      if (Math.abs(diff) > 0.001) {
        smoothedVolumeRef.current = current + diff * 0.12;
        onVolumeChange(smoothedVolumeRef.current);
        animationFrame = requestAnimationFrame(updateVolume);
      } else if (current !== target) {
        smoothedVolumeRef.current = target;
        onVolumeChange(target);
      }
    };
    animationFrame = requestAnimationFrame(updateVolume);
    return () => cancelAnimationFrame(animationFrame);
  }, [localVolume, onVolumeChange]);

  return (
    <header className="bg-surface shadow-md p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center relative transition-colors duration-300 gap-3 sm:gap-4 z-50">
      <div className="flex w-full items-center justify-between sm:justify-start gap-3 flex-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <LogoIcon />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-primary tracking-tight sm:tracking-wider whitespace-nowrap drop-shadow-sm">
            <span className="hidden sm:inline">Sorting Algorithm Visualizer</span>
            <span className="sm:hidden">Sort Visualizer</span>
          </h1>
        </div>
        
        <div className="flex sm:hidden gap-2">
          <button 
            onClick={onSettingsToggle} 
            className="p-2 rounded-lg bg-background/40 border border-textSecondary/20 text-textSecondary hover:text-primary transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
          <button 
            onClick={onInfoToggle} 
            className={`p-2 rounded-lg transition-colors border ${isInfoOpen ? 'bg-primary text-white border-primary' : 'bg-background/40 border-textSecondary/20 text-textSecondary'}`}
            aria-label="Algorithm Information"
          >
            <InfoIcon />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 sm:flex-1 justify-end w-full sm:w-auto overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-background/40 border border-textSecondary/20 hover:border-primary/40 transition-all duration-300">
          <button 
            onClick={onToggleMute} 
            className="text-textSecondary hover:text-primary transition-colors p-1"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <SpeakerIcon muted={isMuted} />
          </button>
          
          <div className="flex items-center gap-2 h-6">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={localVolume}
              onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-24 lg:w-32 cursor-pointer"
              aria-label="Volume"
            />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-textSecondary min-w-[3ch] text-right">
              {isMuted ? '0' : volumePercent}%
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'penguin')}
            className="bg-background border border-textSecondary/50 rounded-md py-1 px-2 sm:px-3 text-textPrimary focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-300 text-xs sm:text-sm cursor-pointer hover:border-primary font-medium"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="penguin">Penguin</option>
          </select>
        </div>

        <div className="hidden sm:flex gap-2">
          <button 
            onClick={onSettingsToggle} 
            className="p-2 rounded-lg bg-background/40 border border-textSecondary/20 text-textSecondary hover:border-primary/40 hover:text-primary transition-colors"
            aria-label="Visual Settings"
            title="Visual Settings"
          >
            <SettingsIcon />
          </button>
          <button 
            onClick={onInfoToggle} 
            className={`flex items-center justify-center p-2 rounded-lg transition-colors border ${isInfoOpen ? 'bg-primary text-white border-primary' : 'bg-background/40 border-textSecondary/20 text-textSecondary hover:border-primary/40 hover:text-primary'}`}
            aria-label="Algorithm Information"
            title="Information & Code"
          >
            <InfoIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
