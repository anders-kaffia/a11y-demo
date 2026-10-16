import { useEffect, useState } from 'react';

const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

const MoonIcon = () => (
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
    <path fill="currentColor" d="M21 14.5A9 9 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z" />
  </svg>
);

const SunIcon = () => (
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"
    />
  </svg>
);

/**
 * Dark mode follows the system setting by default. The button overrides it, and the choice is
 * remembered in this browser.
 */
export default function ThemeToggle() {
  const chosen = () => document.documentElement.dataset.theme;
  const [dark, setDark] = useState(() => (chosen() ? chosen() === 'dark' : systemQuery.matches));

  // Follow changes in the system setting as long as the user has not chosen with the button
  useEffect(() => {
    const onChange = (e) => {
      if (!chosen()) setDark(e.matches);
    };
    systemQuery.addEventListener('change', onChange);
    return () => systemQuery.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const theme = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage can be blocked; the choice then lasts until the page is reloaded
    }
    setDark(!dark);
  };

  // The label says what will happen when you press the button, and the icon shows the mode you get
  return (
    <button type="button" className="secondary theme-toggle" onClick={toggle}>
      {dark ? <SunIcon /> : <MoonIcon />}
      {dark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
    </button>
  );
}
