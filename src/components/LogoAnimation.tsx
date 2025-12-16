import { useEffect, useRef } from "react";
import zedHero from "@/assets/zed-hero-banner.png";

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
            ZED in Action
          </h2>
          <p className="text-muted-foreground">
            Your AI-powered brand ambassador doing what he does best!
          </p>
        </div>

        {/* ZED Stunt Animation */}
        <div className="relative inline-block">
          {/* Energy burst rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full border-2 border-primary/30 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 rounded-full border border-primary/20 animate-ping opacity-10" style={{ animationDuration: '3s' }} />
          </div>
          
          {/* ZED doing backflip */}
          <div className="relative">
            <img 
              src={zedHero} 
              alt="ZED doing stunts" 
              className="w-64 h-64 object-contain mx-auto animate-zed-flip"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.5))'
              }}
            />
          </div>

          {/* Action sparkles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 relative">
              {/* Sparkle particles */}
              <div className="absolute top-4 left-1/4 w-2 h-2 bg-primary rounded-full animate-sparkle" style={{ animationDelay: '0s' }} />
              <div className="absolute top-8 right-1/4 w-3 h-3 bg-primary/80 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
              <div className="absolute bottom-8 left-1/3 w-2 h-2 bg-primary/60 rounded-full animate-sparkle" style={{ animationDelay: '0.6s' }} />
              <div className="absolute bottom-4 right-1/3 w-2 h-2 bg-primary rounded-full animate-sparkle" style={{ animationDelay: '0.9s' }} />
              <div className="absolute top-1/3 left-4 w-3 h-3 bg-primary/70 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }} />
              <div className="absolute top-1/3 right-4 w-2 h-2 bg-primary/90 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Motion trail effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 relative">
              <div className="absolute inset-0 opacity-20 animate-zed-trail-1">
                <img src={zedHero} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="absolute inset-0 opacity-10 animate-zed-trail-2">
                <img src={zedHero} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-16 space-y-4">
          <h3 className="text-4xl sm:text-5xl font-bold glow-text text-primary">
            AIZboostr
          </h3>
          <p className="text-xl text-muted-foreground">
            AI Powered Brand Building
          </p>
        </div>

        {/* Energy lines decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="energy-lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path 
                  d="M0 50 L30 50 L40 40 L60 40 L70 50 L100 50 M50 0 L50 30 L40 40 M50 100 L50 70 L60 60" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#energy-lines)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
