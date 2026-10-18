import React, { useEffect, useRef, useState } from 'react';
import { Settings2 } from 'lucide-react';

const choices = ['system', 'light', 'dark'];

export default function ThemeSettings() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('automatch-theme');
      return choices.includes(saved) ? saved : 'system';
    } catch { return 'system'; }
  });
  const menu = useRef(null);

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = theme === 'system' ? (system.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };
    apply();
    try { localStorage.setItem('automatch-theme', theme); } catch { /* Still works without storage. */ }
    system.addEventListener('change', apply);
    return () => system.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    const closeOutside = event => {
      if (!menu.current?.contains(event.target)) menu.current?.removeAttribute('open');
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.removeAttribute('open');
        menu.current.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return <details className="theme-settings" ref={menu}>
    <summary aria-label="Settings" title="Settings"><Settings2 size={19} /></summary>
    <div className="settings-popover">
      <h2>Settings</h2>
      <label htmlFor="appearance">Appearance</label>
      <select id="appearance" value={theme} onChange={event => setTheme(event.target.value)}>
        <option value="system">System preference</option>
        <option value="light">Light / day</option>
        <option value="dark">Dark / night</option>
      </select>
      <p>Your preference is saved on this device.</p>
    </div>
  </details>;
}
