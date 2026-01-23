import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import zedAvatar from "/videos/zed-avtar.webm";

export function HeroSection() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => console.log("Video autoplay failed:", error));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const handleGetStarted = () => {
    console.log("Navigating to business plans");
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
          {/* Content - Left on desktop, top on mobile */}
          <div className="text-center lg:text-left space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              <span className="text-sm font-medium text-foreground">AI-Powered Brand Building</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Build Your<br />
              Brand with<br />
              <span className="text-foreground">AIZBOOSTR</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Transform your business with cutting-edge AI automation, marketing solutions. Meet ZED, your guide to the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="xl" 
                className="group bg-white text-black hover:bg-gray-200 font-bold rounded-full" 
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group" onClick={handleWatchDemo}>
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* ZED Character - Right on desktop, below on mobile */}
          <div className="relative animate-scale-in flex justify-center lg:justify-center">
            {/* Constrained Wrapper for relative positioning over video */}
            <div className="relative" style={{ width: '340px', height: '604px' }}>
              <video 
                ref={videoRef}
                src={zedAvatar} 
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-full rounded-3xl object-cover shadow-2xl"
              />
              
              {/* Mute Toggle Button */}
              <button 
                onClick={toggleMute}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors z-20"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {/* Floating badge - Centered Bottom */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border px-6 py-3 rounded-full shadow-lg whitespace-nowrap">
                <span className="text-sm font-medium text-foreground">Meet ZED 👋</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}