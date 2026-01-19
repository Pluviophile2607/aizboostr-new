import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import zedHero from "@/assets/zed-hero-banner.webp";

export function HeroSection() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/business-plans");
  };
  const handleWatchDemo = () => {
    const videoSection = document.getElementById("video-ads-section");
    if (videoSection) {
      videoSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              <span className="text-sm font-medium text-foreground">AI-Powered Brand Building</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              <span className="block">Build Your</span>
              <span className="block text-foreground">Brand with AIZBOOSTR</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Transform your business with cutting-edge AI automation, marketing solutions, 
              and our exclusive AI Academy. Meet ZED, your guide to the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group" onClick={handleWatchDemo}>
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>


          </div>

          {/* ZED Character */}
          <div className="relative animate-scale-in">
            <img 
              src={zedHero} 
              alt="ZED - AIZboostr Brand Ambassador" 
              className="relative w-full max-w-lg mx-auto animate-float rounded-3xl"
              loading="lazy"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border px-6 py-3 rounded-full shadow-sm">
              <span className="text-sm font-medium text-foreground">Meet ZED 👋</span>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}