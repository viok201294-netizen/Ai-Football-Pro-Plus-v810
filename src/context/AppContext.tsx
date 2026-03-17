import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEFAULT_CFG } from '../utils/analysis';
import { resolveTheme, ACCENTS } from '../utils/theme';

interface AppState {
  tk: string;
  brightness: 'light' | 'dark' | 'auto';
  tab: string;
  sub: string;
  hist: any[];
  ar: any | null;
  cids: number[];
  pin: string;
  form: {
    tA: string;
    tB: string;
    lg: string;
    o1: string;
    o2: string;
    ml: number;
    mh: string;
    hcSide: 'home' | 'away';
    initO1?: string;
    initO2?: string;
    matchTime?: string;
  };
  cfg: any;
  cfgSaved: any;
  autoStart: number;
  autoEnd: number;
  firstTs: number | null;
  firstAnalysisTime: number | null;
  expLock: boolean;
  statsFilter: string | null;
  profile: {
    name: string;
    avatar: string;
    avatarType: string;
    emoji: string;
    _showEP?: boolean;
  };
  lsSlot: number;
  showWelcome: boolean;
  wlcBg: { type: string; imgData: string; gifData: string };
  _wlcMedia: any;
  plWarn: boolean;
  importExportMode: boolean;
  ieSel: number[];
  ieAction: string | null;
  importData: string;
  importPreview: any[];
  pscr: string | null;
  pd: number[];
  pe: string;
  pshk: boolean;
  ppStep: string;
  nd: number[];
  cd: number[];
  pnew: string;
  pold: string;
  devPending: boolean;
  expPd: number[];
  expErr: string;
  expShk: boolean;
  exportMode: boolean;
  exportSel: number[];
  lgShow: boolean;
  histFilter: { lg: string; rec: string; conf: string };
  settAcc: Record<string, boolean>;
  cs: Record<number, boolean>;
  _notesCollapsed: boolean;
  autoChangeAccent: boolean;
  conf: {
    show: boolean;
    title: string;
    msg: string;
    onOk: () => void;
  } | null;
}

const defaultState: AppState = {
  tk: "cyan",
  brightness: "light",
  tab: "home",
  sub: "history",
  hist: [],
  ar: null,
  cids: [],
  pin: "",
  form: { tA: "", tB: "", lg: "", o1: "", o2: "", ml: 2.5, mh: "", hcSide: "home" },
  cfg: DEFAULT_CFG,
  cfgSaved: null,
  autoStart: 6,
  autoEnd: 18,
  firstTs: null,
  firstAnalysisTime: null,
  expLock: false,
  statsFilter: null,
  profile: { name: '', avatar: '', avatarType: 'emoji', emoji: '⚽' },
  lsSlot: 1,
  showWelcome: true,
  wlcBg: { type: 'default', imgData: '', gifData: '' },
  _wlcMedia: null,
  plWarn: false,
  importExportMode: false,
  ieSel: [],
  ieAction: null,
  importData: '',
  importPreview: [],
  pscr: null,
  pd: [],
  pe: "",
  pshk: false,
  ppStep: "idle",
  nd: [],
  cd: [],
  pnew: "",
  pold: "",
  devPending: false,
  expPd: [],
  expErr: "",
  expShk: false,
  exportMode: false,
  exportSel: [],
  lgShow: false,
  histFilter: { lg: '', rec: '', conf: '' },
  settAcc: { bright: false, theme: false, pin: false, dev: false },
  cs: { 1: false, 2: false, 3: false, 4: false, 5: false },
  _notesCollapsed: true,
  autoChangeAccent: false,
  conf: null,
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateState: (updates: Partial<AppState>) => void;
  theme: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      // First, find which slot was last used
      const lastSlot = localStorage.getItem('Ai_analyser_v8_last_slot');
      const slotId = lastSlot ? parseInt(lastSlot) : 1;
      
      const key = slotId === 1 ? 'Ai_analyser_v8.0.1' : slotId === 2 ? 'Ai_analyser_v8.0.1_p2' : 'Ai_analyser_v8.0.1_p3';
      const raw = localStorage.getItem(key) || localStorage.getItem('Ai_analyser_v8.0.1') || localStorage.getItem('Ai_analyser_v7.2');
      
      if (raw) {
        const d = JSON.parse(raw);
        let finalState = { ...defaultState, ...d, showWelcome: true, lsSlot: slotId };
        
        // Auto change accent if enabled
        if (finalState.autoChangeAccent) {
          const keys = Object.keys(ACCENTS);
          const randomKey = keys[Math.floor(Math.random() * keys.length)];
          finalState.tk = randomKey;
        }
        
        return finalState;
      }
    } catch (e) {}
    return defaultState;
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const { tk, brightness, hist, pin, form, autoStart, autoEnd, cfg, cfgSaved, firstTs, firstAnalysisTime, expLock, sub, statsFilter, profile, lsSlot, tab, ar, autoChangeAccent, wlcBg } = state;
    const dataToSave = {
      tk, brightness, hist, pin, form, autoStart, autoEnd, cfg, cfgSaved, firstTs, firstAnalysisTime, expLock, sub, statsFilter, profile, lsSlot, tab: tab === 'loading' ? 'home' : (tab === 'result' && !ar ? 'home' : tab), arTs: ar ? ar.ts : null, autoChangeAccent, wlcBg
    };
    const key = lsSlot === 1 ? 'Ai_analyser_v8.0.1' : lsSlot === 2 ? 'Ai_analyser_v8.0.1_p2' : 'Ai_analyser_v8.0.1_p3';
    
    try {
      localStorage.setItem(key, JSON.stringify(dataToSave));
      localStorage.setItem('Ai_analyser_v8_last_slot', lsSlot.toString());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        // If quota exceeded, try saving without large media
        try {
          const reducedData = { ...dataToSave, wlcBg: { type: 'default', imgData: '', gifData: '' } };
          localStorage.setItem(key, JSON.stringify(reducedData));
        } catch (e2) {}
      }
    }
  }, [state]);

  const theme = resolveTheme(state.brightness, state.tk, state.autoStart, state.autoEnd);

  useEffect(() => {
    document.body.classList.toggle('light-mode', !theme.isDark);
    const root = document.documentElement;
    root.style.setProperty('--ac', theme.ac);
    root.style.setProperty('--a2', theme.a2);
    root.style.setProperty('--gr', theme.gr);
    root.style.setProperty('--rd', theme.rd);
    root.style.setProperty('--or', theme.or);
    root.style.setProperty('--gd', theme.gd);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--c2', theme.c2);
    root.style.setProperty('--txt', theme.txt);
    root.style.setProperty('--mut', theme.mut);
    root.style.setProperty('--brd', theme.brd);
    document.body.style.background = theme.bg;
  }, [theme]);

  return (
    <AppContext.Provider value={{ state, setState, updateState, theme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
