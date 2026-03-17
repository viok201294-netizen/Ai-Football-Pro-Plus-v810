import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

const items = [
  { id: 'home', ic: '🏠', lb: 'Trang Chủ' },
  { id: 'analyze', ic: '⚡', lb: 'Nhập' },
  { id: 'result', ic: '📊', lb: 'Kết Quả', badgeKey: 'ar' },
  { id: 'history', ic: '🗂', lb: 'Lịch Sử', badgeKey: 'hist' },
  { id: 'settings', ic: '⚙️', lb: 'Cài Đặt' },
];

const TAB_ORDER: Record<string, number> = { home: 0, analyze: 1, result: 2, history: 3, settings: 4, dev: 5 };

export const BottomNav: React.FC = () => {
  const { state, updateState, theme } = useAppContext();

  const navTo = (id: string) => {
    if (id === 'result' && !state.ar) return;
    const prev = TAB_ORDER[state.tab] ?? 0;
    const next = TAB_ORDER[id] ?? 0;
    updateState({ tab: id, lgShow: false });
    document.getElementById('page-wrap')?.scrollTo(0, 0);
  };

  return (
    <div id="nav" style={{
      position: 'sticky', bottom: 0, zIndex: 50, display: 'flex',
      borderTop: `1px solid ${theme.brd}`,
      background: `${theme.bg}f2`,
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      padding: 'clamp(6px, 1.5vh, 10px) 0 calc(clamp(6px, 1.5vh, 10px) + env(safe-area-inset-bottom))', flexShrink: 0
    }}>
      {items.map(n => {
        const isActive = state.tab === n.id;
        const isDisabled = n.id === 'result' && !state.ar;
        
        let badgeCount: string | number = 0;
        if (n.badgeKey === 'ar') {
          // Only show result badge if there is a result AND we are not currently viewing it
          badgeCount = (state.ar && !isActive) ? 1 : 0;
        } else if (n.badgeKey === 'hist') {
          const count = state.hist.length;
          badgeCount = count > 99 ? '99+' : count;
        }

        return (
          <button key={n.id} className="ni" onClick={() => navTo(n.id)}
            style={{
              color: isActive ? theme.ac : theme.mut,
              background: isActive ? `${theme.ac}14` : 'transparent',
              opacity: isDisabled ? 0.32 : 1
            }}>
            <span className="ni-icon">{n.ic}</span>
            <span className="ni-lbl">{n.lb}</span>
            {badgeCount !== 0 && (
              <div className="nbadge" style={{ 
                background: n.badgeKey === 'ar' ? theme.ac : theme.a2,
                // If it's just a "1" for result, maybe make it a dot? 
                // No, let's keep it as a number but styled well.
              }}>
                {badgeCount}
              </div>
            )}
            {isActive && (
              <motion.div 
                layoutId="active-nav-dot"
                className="ni-active-dot" 
                style={{ 
                  position: 'absolute', 
                  bottom: '2px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: theme.ac 
                }} 
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
