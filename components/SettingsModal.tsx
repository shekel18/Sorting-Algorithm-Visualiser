
import React from 'react';
import { ColorConfig } from '../types';
import { THEME_DEFAULTS, COLOR_PRESETS, FONT_OPTIONS } from '../constants';

interface SettingsModalProps {
  colors: ColorConfig;
  onColorsChange: (newColors: ColorConfig) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  onClose: () => void;
  theme: 'light' | 'dark' | 'penguin';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  colors, 
  onColorsChange, 
  fontFamily, 
  onFontFamilyChange, 
  onClose, 
  theme 
}) => {
  const handleColorChange = (key: keyof ColorConfig, value: string) => {
    onColorsChange({ ...colors, [key]: value });
  };

  const handleReset = () => {
    onColorsChange(THEME_DEFAULTS[theme]);
    onFontFamilyChange(FONT_OPTIONS[0].value);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-surface p-5 sm:p-7 rounded-2xl border border-primary/30 shadow-2xl z-[70] animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Visual Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-textSecondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* Typography Section */}
          <section className="space-y-3">
            <div>
              <label className="text-sm sm:text-base font-black text-textPrimary tracking-tight uppercase">Typography</label>
              <p className="text-[10px] sm:text-xs text-textSecondary leading-none mt-0.5">Select a font that suits your style</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => onFontFamilyChange(font.value)}
                  className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all text-center ${
                    fontFamily === font.value 
                      ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                      : 'border-textSecondary/10 hover:border-textSecondary/30 text-textSecondary'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </section>

          {/* Colors Section */}
          <div className="space-y-6 pt-2 border-t border-textSecondary/5">
            {[
              { label: 'Base Bar Color', key: 'primary' as const, desc: 'Default color for array elements' },
              { label: 'Compare Color', key: 'accent' as const, desc: 'Used for active/compared elements' },
              { label: 'Swap Color', key: 'swap' as const, desc: 'Highlights elements being moved' },
              { label: 'Sorted Color', key: 'secondary' as const, desc: 'Marks elements in final positions' },
            ].map(({ label, key, desc }) => (
              <div key={key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm sm:text-base font-black text-textPrimary tracking-tight">{label}</label>
                    <p className="text-[10px] sm:text-xs text-textSecondary leading-none mt-0.5">{desc}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={colors[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-textSecondary/10 bg-transparent p-0 overflow-hidden"
                    />
                    <input 
                      type="text" 
                      value={colors[key].toUpperCase()}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-20 text-[10px] sm:text-xs font-mono font-bold bg-background border border-textSecondary/20 rounded-md px-2 py-2 uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Swatch Palette */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = colors[key].toLowerCase() === preset.toLowerCase();
                    return (
                      <button
                        key={preset}
                        onClick={() => handleColorChange(key, preset)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-90 ${
                          isSelected 
                            ? 'border-primary shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-110' 
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: preset }}
                        title={preset}
                      >
                        {isSelected && (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-textSecondary/10 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleReset}
            className="flex-1 px-4 py-3 rounded-xl bg-background text-textPrimary border border-textSecondary/20 text-xs sm:text-sm font-bold hover:bg-black/5 transition-all active:scale-95"
          >
            Reset to Defaults
          </button>
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
