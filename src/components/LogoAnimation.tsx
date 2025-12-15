import { useEffect, useRef } from "react";
import logo from "@/assets/aizboostr-logo.png";

export function LogoAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const progress = 1 - (rect.top / viewportHeight);
        container.style.setProperty('--scroll-progress', String(Math.min(Math.max(progress, 0), 1)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powered by Innovation
          </h2>
          <p className="text-muted-foreground">
            The AI-driven future of brand building starts here.
          </p>
        </div>

        {/* Animated Logo */}
        <div className="relative inline-block">
          {/* Glow rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full border border-primary/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 rounded-full border border-primary/10 animate-ping opacity-10" style={{ animationDuration: '4s' }} />
          </div>
          
          {/* Logo */}
          <div className="relative">
            <img 
              src={logo} 
              alt="AIZboostr Logo" 
              className="w-64 h-64 object-contain mx-auto animate-logo-spin animate-pulse-glow"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.5))'
              }}
            />
          </div>

          {/* Orbiting particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 relative animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/70 rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/50 rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-16 space-y-4">
          <h3 className="text-4xl sm:text-5xl font-bold glow-text text-primary">
            AIZboostr
          </h3>
          <p className="text-xl text-muted-foreground">
            AI Powered Brand Building Brand
          </p>
        </div>

        {/* Circuit lines decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path 
                  d="M0 50 L30 50 L40 40 L60 40 L70 50 L100 50 M50 0 L50 30 L40 40 M50 100 L50 70 L60 60" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
