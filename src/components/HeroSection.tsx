import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import zedHero from "@/assets/zed-hero-banner.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary">AI-Powered Brand Building</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">Build Your</span>
              <span className="block glow-text text-primary">Brand with AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Transform your business with cutting-edge AI automation, marketing solutions, 
              and our exclusive AI Academy. Meet ZED, your guide to the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Clients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">AI Solutions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* ZED Character */}
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-3xl" />
            <img 
              src={zedHero} 
              alt="ZED - AIZboostr Brand Ambassador" 
              className="relative w-full max-w-lg mx-auto animate-float rounded-3xl"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-card px-6 py-3 rounded-full">
              <span className="text-sm font-medium">Meet ZED 👋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Mouse on desktop, finger on mobile */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        {/* Mouse indicator - hidden on mobile */}
        <div className="hidden sm:flex w-6 h-10 rounded-full border-2 border-muted-foreground/30 items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
        {/* Finger/touch indicator - visible only on mobile */}
        <div className="flex sm:hidden flex-col items-center">
          <div className="relative w-8 h-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full bg-muted-foreground/20 border-2 border-muted-foreground/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full bg-primary/30 animate-[swipe_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
