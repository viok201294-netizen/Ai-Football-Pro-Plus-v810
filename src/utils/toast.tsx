import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  return <div id="toast-container" style={{ position: 'fixed', top: '72px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}></div>;
};

export const toast = (m: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const bg = type === 'success' ? 'rgba(0,50,28,0.97)' : type === 'error' ? 'rgba(60,8,16,0.97)' : type === 'warn' ? 'rgba(52,40,0,0.97)' : 'rgba(12,24,52,0.97)';
  const border = type === 'success' ? 'rgba(0,230,118,0.6)' : type === 'error' ? 'rgba(255,50,70,0.6)' : type === 'warn' ? 'rgba(255,200,0,0.5)' : 'rgba(0,229,255,0.5)';
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '💬';

  const el = document.createElement('div');
  el.style.cssText = 'min-width:180px;max-width:320px;font-family:Rajdhani,sans-serif;will-change:transform,opacity;animation:toastIn 0.24s cubic-bezier(.34,1.36,.64,1) both;';
  el.innerHTML = `
    <div style="background:${bg};border:1px solid ${border};border-radius:16px;padding:10px 16px 0;box-shadow:0 8px 32px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.04);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:15px;flex-shrink:0">${icon}</span>
        <span style="font-size:12px;font-weight:700;color:#fff;letter-spacing:0.4px;line-height:1.3;flex:1">${m}</span>
      </div>
      <div style="height:3px;border-radius:2px;background:rgba(255,255,255,0.1);overflow:hidden;margin:0 -1px">
        <div style="height:100%;background:${border};border-radius:2px;animation:toastProgress 2.4s linear forwards"></div>
      </div>
    </div>
  `;
  
  container.appendChild(el);
  
  if (navigator.vibrate) {
    if (type === 'success') navigator.vibrate([28, 12, 28]);
    else if (type === 'error') navigator.vibrate([60, 20, 60]);
    else if (type === 'warn') navigator.vibrate([40]);
  }

  setTimeout(() => {
    el.style.animation = 'toastOut 0.22s ease forwards';
    setTimeout(() => el.remove(), 220);
  }, 2400);
};

export const haptic = (type: 'success' | 'error' | 'warn' | 'tap' | 'heavy' | 'soft' | 'default') => {
  if (!navigator.vibrate) return;
  switch (type) {
    case 'success': navigator.vibrate([28, 12, 28]); break;
    case 'error': navigator.vibrate([60, 20, 60]); break;
    case 'warn': navigator.vibrate([40]); break;
    case 'tap': navigator.vibrate(8); break;
    case 'heavy': navigator.vibrate([80, 30, 80, 30, 80]); break;
    case 'soft': navigator.vibrate(14); break;
    default: navigator.vibrate(20);
  }
};
