interface AppIconProps {
  isDark?: boolean
}

export function AppIcon({ isDark = false }: AppIconProps) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" 
         className="mx-auto transition-transform duration-300 hover:scale-110 cursor-default drop-shadow-lg">
      {/* Gradient definition */}
      <defs>
        <linearGradient id="violetBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(270 85% 60%)" className="light-mode-stop" />
          <stop offset="100%" stopColor="hsl(240 85% 65%)" className="light-mode-stop" />
        </linearGradient>
        <linearGradient id="violetBlueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(270 85% 70%)" />
          <stop offset="100%" stopColor="hsl(240 85% 75%)" />
        </linearGradient>
      </defs>
      {/* Document background */}
      <rect x="12" y="4" width="32" height="44" rx="4" 
            fill={`url(#${isDark ? 'violetBlueGradientDark' : 'violetBlueGradient'})`} 
            stroke={isDark ? "hsl(270 85% 70%)" : "hsl(270 85% 55%)"} strokeWidth="2"/>
      
      {/* Document fold corner */}
      <path d="M36 4L44 12V8C44 5.79086 42.2091 4 40 4H36Z" 
            fill={isDark ? "hsl(270 85% 70%)" : "hsl(270 85% 55%)"}/>
      <path d="M36 4V12H44" 
            stroke={isDark ? "hsl(270 85% 70%)" : "hsl(270 85% 55%)"} strokeWidth="2" fill="none"/>
      
      {/* Document lines (representing text) */}
      <rect x="18" y="18" width="16" height="2" rx="1" fill="white" opacity="0.8"/>
      <rect x="18" y="22" width="12" height="2" rx="1" fill="white" opacity="0.8"/>
      <rect x="18" y="26" width="14" height="2" rx="1" fill="white" opacity="0.8"/>
      <rect x="18" y="30" width="10" height="2" rx="1" fill="white" opacity="0.8"/>
      
      {/* Euro symbol circle background */}
      <circle cx="28" cy="40" r="9" fill="hsl(45 100% 95%)" stroke="hsl(45 90% 60%)" strokeWidth="2.5"/>
      
      {/* Euro symbol - larger and more detailed */}
      <path d="M24 34C25.5 33 27 32.5 28.5 32.5C30.5 32.5 32.2 33.5 33.5 35M24 46C25.5 47 27 47.5 28.5 47.5C30.5 47.5 32.2 46.5 33.5 45M21 38H34M21 42H34" 
            stroke="hsl(45 90% 50%)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      
      {/* Additional detail: small lines for invoice items */}
      <rect x="18" y="34" width="4" height="1" rx="0.5" fill="white" opacity="0.6"/>
      <rect x="18" y="36" width="6" height="1" rx="0.5" fill="white" opacity="0.6"/>
      
      {/* Shadow */}
      <ellipse cx="28" cy="56" rx="16" ry="4" fill="#000000" opacity="0.1"/>
    </svg>
  )
}