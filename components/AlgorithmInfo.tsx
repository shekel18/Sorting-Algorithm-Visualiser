
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SortingAlgorithm } from '../types';
import { ALGORITHM_DESCRIPTIONS } from '../constants/descriptions';

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm;
  onClose?: () => void;
  onSelectAlgorithm?: (alg: SortingAlgorithm) => void;
}

const COMPLEXITY_WEIGHTS: Record<string, number> = {
  "O(n + k)": 15,
  "O(nk)": 25,
  "O(n log n)": 45,
  "O(n²)": 70,
  "O((n+1)!)": 100,
};

const getComplexityColor = (complexity: string) => {
  if (complexity.includes('log n') || complexity.includes('n + k')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  if (complexity === 'O(n²)' || complexity === 'O(nk)') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
};

const highlightPython = (code: string) => {
  const tokens = [
    { name: 'comment', regex: /#.*$/m, class: 'text-slate-500/70 italic' },
    { name: 'string', regex: /(['"])(?:(?!\1|\\).|\\.)*\1/, class: 'text-emerald-600 dark:text-emerald-300' },
    { name: 'keyword', regex: /\b(def|for|in|if|else|elif|while|return|import|as|from|with|try|except|finally|None|True|False|break|continue|pass|all|any|is|not|and|or|lambda)\b/, class: 'text-fuchsia-600 dark:text-fuchsia-400 font-bold' },
    { name: 'builtin', regex: /\b(range|len|reversed|print|max|min|list|dict|set|tuple|int|float|str|abs|sorted|enumerate|zip|sum|map|filter)\b/, class: 'text-sky-600 dark:text-sky-300 font-semibold' },
    { name: 'number', regex: /\b\d+(\.\d+)?\b/, class: 'text-amber-600 dark:text-amber-400' },
  ];
  const masterRegex = new RegExp(tokens.map(t => `(${t.regex.source})`).join('|'), 'g');
  return code.replace(masterRegex, (match, ...args) => {
    for (let i = 0; i < tokens.length; i++) {
      if (args[i] !== undefined) return `<span class="${tokens[i].class}">${match}</span>`;
    }
    return match;
  });
};

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm, onClose, onSelectAlgorithm }) => {
  const [view, setView] = useState<'details' | 'compare'>('details');
  const [copying, setCopying] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 380, height: 580 });
  const [isResizing, setIsResizing] = useState(false);
  const details = ALGORITHM_DESCRIPTIONS[algorithm];
  
  const allAlgorithms = Object.entries(ALGORITHM_DESCRIPTIONS).sort((a, b) => {
    const weightA = COMPLEXITY_WEIGHTS[a[1].complexity] || 50;
    const weightB = COMPLEXITY_WEIGHTS[b[1].complexity] || 50;
    return weightA - weightB;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(details.pythonCode);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const maxWidth = window.innerWidth - 60;
      const maxHeight = window.innerHeight - 150;
      const cardRight = window.innerWidth - 24; 
      const cardTop = 112; 
      const newWidth = Math.min(Math.max(340, cardRight - e.clientX), maxWidth);
      const newHeight = Math.min(Math.max(400, e.clientY - cardTop), maxHeight);
      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div 
        className={`fixed inset-x-4 inset-y-20 sm:top-32 sm:right-6 sm:inset-x-auto sm:inset-y-auto p-4 sm:p-5 rounded-2xl bg-surface/98 backdrop-blur-2xl border border-primary/40 shadow-2xl z-50 flex flex-col gap-3 sm:gap-4 transition-all duration-300 ${isResizing ? 'transition-none border-primary/80' : ''}`}
        style={{ 
          width: window.innerWidth < 640 ? 'calc(100% - 32px)' : `${dimensions.width}px`, 
          height: window.innerWidth < 640 ? 'calc(100% - 160px)' : `${dimensions.height}px` 
        }}
      >
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface border border-primary shadow-lg flex items-center justify-center text-primary z-[60] sm:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div 
          onMouseDown={startResizing}
          className="absolute bottom-0 left-0 w-8 h-8 cursor-sw-resize hidden sm:flex items-center justify-center group z-50"
        >
          <div className="w-2 h-2 bg-primary/40 rounded-full transition-all group-hover:scale-150 group-hover:bg-primary shadow-sm" />
        </div>

        {/* Tab Header */}
        <div className="flex gap-1 p-1 bg-background/50 rounded-xl border border-textSecondary/10 shrink-0">
          <button
            onClick={() => setView('details')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              view === 'details' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Algorithm Info
          </button>
          <button
            onClick={() => setView('compare')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              view === 'compare' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Performance Compare
          </button>
        </div>

        {view === 'details' ? (
          <div className="flex flex-col gap-3 sm:gap-4 flex-grow overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-primary text-base sm:text-xl truncate pr-2" title={algorithm}>
                  {algorithm}
                </h3>
                <span className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded border uppercase tracking-tighter shrink-0 ${getComplexityColor(details.complexity)}`}>
                  {details.complexity}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-textSecondary leading-relaxed line-clamp-2">
                {details.description}
              </p>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-textSecondary/10 shrink-0">
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <h4 className="text-[9px] sm:text-[10px] font-black text-textPrimary/60 uppercase tracking-widest">Efficiency Chart</h4>
              </div>
              <div className="relative h-16 sm:h-20 px-1 bg-background/50 dark:bg-black/30 rounded-xl flex items-end justify-between gap-1 border border-textSecondary/5">
                {allAlgorithms.map(([name, data]) => {
                  const isCurrent = name === algorithm;
                  const weight = COMPLEXITY_WEIGHTS[data.complexity] || 50;
                  const height = Math.max(weight, 15);
                  return (
                    <div key={name} className="group relative flex-1 flex flex-col items-center h-full justify-end">
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col z-[60] pointer-events-none w-max max-w-[200px]">
                        <div className="bg-slate-900 text-white p-2 sm:p-3 rounded-xl shadow-2xl border border-white/10 text-[9px] sm:text-[10px] leading-tight space-y-2">
                          <div className="font-black border-b border-white/10 pb-1.5 mb-1 text-xs text-primary flex items-center justify-between gap-2">
                            <span>{name}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-white/50 uppercase text-[8px]">Average</span>
                              <span className="font-mono font-black text-primary">{data.complexity}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-white/50 uppercase text-[8px]">Worst</span>
                              <span className="font-mono font-black text-accent">{data.worstCase}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`w-full rounded-t-sm sm:rounded-t-md transition-all duration-200 cursor-pointer ${
                          isCurrent ? 'bg-primary shadow-[0_0_12px_rgba(99,102,241,0.6)] z-10' : 'bg-textSecondary/30 opacity-40 hover:opacity-100'
                        }`}
                        style={{ height: `${height}%` }}
                        onClick={() => onSelectAlgorithm?.(name as SortingAlgorithm)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-textSecondary/10 flex flex-col gap-2 grow overflow-hidden">
              <div className="flex items-center justify-between shrink-0">
                <h4 className="text-[9px] sm:text-[10px] font-black text-textPrimary/60 uppercase tracking-widest">Python Implementation</h4>
                <button 
                  onClick={handleCopy}
                  className={`text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-1 rounded transition-all ${
                    copying ? 'bg-secondary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {copying ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="relative group bg-background dark:bg-black/40 rounded-xl border border-primary/10 overflow-hidden shadow-inner grow flex flex-col">
                <div className="overflow-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex-grow p-0 pt-4 sm:pt-6">
                  <div className="min-w-full text-[10px] sm:text-[11px] font-mono leading-relaxed py-2">
                    {highlightPython(details.pythonCode).split('\n').map((line, i) => (
                      <div key={i} className="flex hover:bg-primary/5">
                        <span className="shrink-0 text-right text-textSecondary/20 select-none min-w-[2.5rem] sm:min-w-[3.5rem] pr-2 sm:pr-3 mr-2 sm:mr-3 border-r border-textSecondary/10 text-[8px] sm:text-[10px]">
                          {i + 1}
                        </span>
                        <code className="block whitespace-pre pr-4" dangerouslySetInnerHTML={{ __html: line || ' ' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-grow overflow-hidden animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="flex flex-col gap-1 shrink-0">
              <h3 className="font-black text-primary text-base sm:text-xl truncate">Performance Comparison</h3>
              <p className="text-[11px] sm:text-xs text-textSecondary leading-relaxed">
                Compare the theoretical speed and efficiency of all available algorithms.
              </p>
            </div>
            
            <div className="flex-grow overflow-auto border border-textSecondary/10 rounded-xl bg-background/50">
              <table className="w-full text-left text-[10px] sm:text-xs">
                <thead className="sticky top-0 bg-surface border-b border-textSecondary/10 z-10">
                  <tr>
                    <th className="p-2 sm:p-3 font-black text-textPrimary/50 uppercase tracking-widest">Algorithm</th>
                    <th className="p-2 sm:p-3 font-black text-textPrimary/50 uppercase tracking-widest text-center">Avg Time</th>
                    <th className="p-2 sm:p-3 font-black text-textPrimary/50 uppercase tracking-widest text-center">Worst Case</th>
                    <th className="p-2 sm:p-3 font-black text-textPrimary/50 uppercase tracking-widest text-center">Space</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-textSecondary/5">
                  {allAlgorithms.map(([name, data]) => (
                    <tr 
                      key={name} 
                      className={`hover:bg-primary/5 transition-colors cursor-pointer group ${name === algorithm ? 'bg-primary/10' : ''}`}
                      onClick={() => onSelectAlgorithm?.(name as SortingAlgorithm)}
                    >
                      <td className="p-2 sm:p-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${name === algorithm ? 'bg-primary' : 'bg-textSecondary/20'}`} />
                          <span className={`font-bold ${name === algorithm ? 'text-primary' : 'text-textPrimary'}`}>{name}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] sm:text-[10px] border ${getComplexityColor(data.complexity)}`}>
                          {data.complexity}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] sm:text-[10px] border ${getComplexityColor(data.worstCase)}`}>
                          {data.worstCase}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-center">
                        <span className="text-textSecondary font-mono">{data.spaceComplexity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl flex items-start gap-3 shrink-0">
              <div className="p-1.5 bg-primary/20 rounded-lg text-primary shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-[11px] text-textPrimary/80 leading-relaxed italic">
                Efficiency decreases from top to bottom. Linearithmic sorts (like Merge & Quick) are generally the gold standard for large datasets.
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-2 sm:pt-3 border-t border-textSecondary/10 grid grid-cols-2 gap-2 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-textSecondary uppercase font-bold tracking-widest text-[7px] sm:text-[8px]">Worst Case</span>
            <code className="text-accent font-mono font-black bg-accent/10 px-1 py-0.5 rounded text-[9px] sm:text-[10px] w-fit">{details.worstCase}</code>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-textSecondary uppercase font-bold tracking-widest text-[7px] sm:text-[8px]">Space</span>
            <code className="text-secondary font-mono font-black bg-secondary/10 px-1 py-0.5 rounded text-[9px] sm:text-[10px] w-fit">{details.spaceComplexity}</code>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlgorithmInfo;
