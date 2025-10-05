


import { useEffect, useState, useCallback } from 'react';
import { InvoiceTracker } from './components/InvoiceTracker';
import Aurora from './components/ui/aurora';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Callback to update dark mode from child
  const handleThemeChange = useCallback((dark: boolean) => {
    setIsDarkMode(dark);
  }, []);

  // Compute aurora colors on theme change
  const getAuroraColors = () => [
    getComputedStyle(document.documentElement).getPropertyValue('--aurora1').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--aurora2').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--aurora3').trim(),
  ];
  const [auroraColors, setAuroraColors] = useState(getAuroraColors());

  useEffect(() => {
    setAuroraColors(getAuroraColors());
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Aurora
        colorStops={auroraColors}
        blend={0.8}
        amplitude={1.0}
        speed={0.5}
      />
      <InvoiceTracker onThemeChange={handleThemeChange} />
    </div>
  );
}

export default App
