
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SortingAlgorithm } from '../types';
import { ALGORITHM_DESCRIPTIONS } from '../constants/descriptions';

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm;
  onClose?: () => void;
  onSelectAlgorithm?: (alg: SortingAlgorithm) => void;
  highlightedLine?: number;
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

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm, onClose, onSelectAlgorithm, highlightedLine = -1 }) => {
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`fixed inset-x-4 inset-y-20 sm:top-32 sm:right-6 sm:inset-x-auto sm:inset-y-auto p-4 sm:p-5 rounded-2xl bg-surface/98 backdrop-blur-2xl border border-primary/40 shadow-2xl z-50 flex flex-col gap-3 sm:gap-4 transition-all duration-300 ${isResizing ? 'transition-none border-primary/80' : ''}`}
        style={{ width: window.innerWidth < 640 ? 'calc(100% - 32px)' : `${dimensions.width}px`, height: window.innerWidth < 640 ? 'calc(100% - 160px)' : `${dimensions.height}px` }}>
        
        <div className="flex gap-1 p-1 bg-background/50 rounded-xl border border-textSecondary/10 shrink-0">
          <button onClick={() => setView('details')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'details' ? 'bg-primary text-white' : 'text-textSecondary'}`}>
            Implementation
          </button>
          <button onClick={() => setView('compare')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'compare' ? 'bg-primary text-white' : 'text-textSecondary'}`}>
            Performance
          </button>
        </div>

        {view === 'details' ? (
          <div className="flex flex-col gap-3 flex-grow overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-primary text-base truncate">{algorithm}</h3>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${getComplexityColor(details.complexity)}`}>{details.complexity}</span>
            </div>
            
            <div className="grow overflow-hidden flex flex-col gap-2">
              <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Live Trace</span>
                  <button onClick={handleCopy} className="text-[8px] font-bold px-2 py-1 bg-primary/10 text-primary rounded">{copying ? 'Copied!' : 'Copy Code'}</button>
              </div>
              <div className="bg-background dark:bg-black/40 rounded-xl border border-primary/10 grow overflow-auto p-2 font-mono text-[10px] sm:text-[11px] leading-relaxed">
                {details.pythonCode.split('\n').map((line, i) => (
                  <div key={i} className={`flex ${i === highlightedLine ? 'bg-primary/20 text-textPrimary font-black -mx-2 px-2' : ''}`}>
                    <span className="shrink-0 text-right opacity-20 min-w-[2rem] pr-2 mr-2 border-r border-textSecondary/10">{i + 1}</span>
                    <code dangerouslySetInnerHTML={{ __html: highlightPython(line) || ' ' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-grow overflow-hidden">
            <h3 className="font-black text-primary text-base">Big O Reference</h3>
            <div className="overflow-auto border border-textSecondary/10 rounded-xl bg-background/50 text-[10px]">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-textSecondary/10">
                  <tr><th className="p-2">Algorithm</th><th className="p-2">Avg</th><th className="p-2">Space</th></tr>
                </thead>
                <tbody className="divide-y divide-textSecondary/5">
                  {allAlgorithms.map(([name, data]) => (
                    <tr key={name} className={name === algorithm ? 'bg-primary/10' : ''}>
                      <td className="p-2 font-bold">{name}</td>
                      <td className="p-2">{data.complexity}</td>
                      <td className="p-2">{data.spaceComplexity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AlgorithmInfo;
