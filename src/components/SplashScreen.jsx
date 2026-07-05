import React, { useState, useEffect } from 'react';
import lightSplash from '../assets/lightmode.png';
import darkSplash from '../assets/darkmode.png';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial color scheme
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchMedia.matches);

    // Listener for theme changes
    const handler = (e) => setIsDarkMode(e.matches);
    matchMedia.addEventListener('change', handler);

    // Timer for 1.5 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 300); // 300ms fade out transition
    }, 1500);

    return () => {
      clearTimeout(timer);
      matchMedia.removeEventListener('change', handler);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: isDarkMode ? '#1c1c1d' : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isFading ? 0 : 1,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <img 
        src={isDarkMode ? darkSplash : lightSplash} 
        alt="Splash Screen" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};

export default SplashScreen;
