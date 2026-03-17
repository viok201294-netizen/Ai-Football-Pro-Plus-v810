import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './utils/toast';
import { Overlays } from './components/Overlays';

import { HomeTab } from './tabs/HomeTab';
import { AnalyzeTab } from './tabs/AnalyzeTab';
import { ResultTab } from './tabs/ResultTab';
import { HistoryTab } from './tabs/HistoryTab';
import { SettingsTab } from './tabs/SettingsTab';
import { DevTab } from './tabs/DevTab';
import { LoadingTab } from './tabs/LoadingTab';

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  const renderTab = () => {
    switch (state.tab) {
      case 'home': return <HomeTab key="home" />;
      case 'analyze': return <AnalyzeTab key="analyze" />;
      case 'result': return <ResultTab key="result" />;
      case 'history': return <HistoryTab key="history" />;
      case 'settings': return <SettingsTab key="settings" />;
      case 'dev': return <DevTab key="dev" />;
      case 'loading': return <LoadingTab key="loading" />;
      default: return <HomeTab key="home" />;
    }
  };

  return (
    <>
      <div id="gbg"></div>
      <Header />
      <div id="page-wrap">
        <div id="pc" style={{ padding: '0 clamp(14px, 4vw, 24px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <BottomNav />
      <Overlays />
      <ToastContainer />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
