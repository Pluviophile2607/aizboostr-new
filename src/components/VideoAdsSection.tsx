import { useState, useRef, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const videoSlots = [
  { id: 1, title: "AI Automation Demo", videoUrl: "/videos/demo-1.mp4", thumbnailUrl: "/images/thumbnails/demo-1.png" },
  { id: 2, title: "AI Marketing Demo", videoUrl: "/videos/demo-2.mp4", thumbnailUrl: "/images/thumbnails/demo-2.png" },
  { id: 3, title: "Brand Building Demo", videoUrl: "/videos/demo-3.mp4", thumbnailUrl: "/images/thumbnails/demo-3.png" },
];

export function VideoAdsSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null); // Now stores INDEX
  const [isPaused, setIsPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({}); // Key is INDEX
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // Intersection Observer - load videos only when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Load and PLAY all videos when section comes into view
            Object.values(videoRefs.current).forEach((video) => {
              if (video) {
                if (video.preload === 'none') {
                    video.preload = 'metadata';
                    video.load();
                }
                video.muted = true;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Auto-play prevented:", error);
                    });
                }
              }
            });
          } else {
             // Optional: Pause videos when out of view to save resources
             setIsInView(false);
             Object.values(videoRefs.current).forEach((video) => {
                if (video) video.pause();
             });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth infinite loop animation
  useEffect(() => {
    if (isPaused || activeVideo || !isInView) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let scrollPos = container.scrollLeft;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      if (!container) return;
      
      scrollPos += speed;
      const cardWidth = 336; // 320px card + 16px gap
      const singleSetWidth = cardWidth * videoSlots.length;
      
      // Reset to beginning seamlessly when reaching the duplicate set
      if (scrollPos >= singleSetWidth) {
        scrollPos = 0;
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = scrollPos;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, activeVideo, isInView]);

  const scrollLeft = () => {
    setIsPaused(true);
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  const scrollRight = () => {
    setIsPaused(true);
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  const stopAllVideosExcept = (exceptIndex: number | null) => {
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      // With auto-play on scroll, we only pause others when one is HOVERED (exceptIndex is not null)
      // When exceptIndex is null (e.g. initial load or reset), we usually want them running or stopped based on view.
      // But this function is historically used to "stop others".
      // If we hover one, we want others to pause.
      if (video && Number(index) !== exceptIndex) {
        video.pause();
        // We might NOT want to reset currentTime=0 if we want them to resume later? 
        // But for "focus" effect, pausing is good.
      }
    });
  };

  const handleMouseEnter = (index: number, hasVideo: boolean) => {
    if (isTouchDevice) return;
    
    setHoveredVideo(index);
    setIsPaused(true);
    stopAllVideosExcept(index);
    if (hasVideo && videoRefs.current[index]) {
      const video = videoRefs.current[index]!;
      video.muted = false; // Unmute on hover (user interaction)
      // Ensure promise handlng for play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play prevented:", error);
        });
      }
    }
  };

  const handleMouseLeave = (index: number, hasVideo: boolean) => {
    if (isTouchDevice) return;
    
    setHoveredVideo(null);
    setIsPaused(false);
    if (hasVideo && videoRefs.current[index]) {
      const video = videoRefs.current[index]!;
      // Resume playing muted instead of pausing
      video.muted = true; 
      video.play().catch(e => console.log("Resume play failed", e));
    }
  };

  const handleClick = (slotId: number) => {
    // When clicking, we might want to pause the specific card video so the modal takes over?
    // Modal covers everything anyway.
    setActiveVideo(slotId);
  };

  // Duplicate videos for seamless infinite loop
  const displaySlots = [...videoSlots, ...videoSlots, ...videoSlots];

  return (
    <section ref={sectionRef} id="video-ads-section" className="py-20 relative overflow-hidden bg-secondary">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            See What's Possible with
            <span className="text-foreground"> AIZboostr</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our latest campaigns and success stories powered by AI.
          </p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background border-border hover:bg-secondary"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background border-border hover:bg-secondary"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div 
            ref={containerRef}
            className="flex gap-4 overflow-x-hidden pb-6 px-16"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displaySlots.map((slot, index) => (
              <div
                key={`${slot.id}-${index}`}
                className={`flex-shrink-0 w-80 h-[450px] bg-card border border-border rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out group ${
                  hoveredVideo === index ? "scale-105 shadow-2xl ring-2 ring-primary/20 z-10" : "hover:shadow-lg opacity-90 hover:opacity-100"
                }`}
                onMouseEnter={() => handleMouseEnter(index, !!slot.videoUrl)}
                onMouseLeave={() => handleMouseLeave(index, !!slot.videoUrl)}
                onClick={() => handleClick(slot.id)}
              >
                {slot.videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      preload="none"
                      poster={slot.thumbnailUrl}
                    >
                      <source src={slot.videoUrl} type="video/mp4" />
                    </video>
                    {hoveredVideo !== index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                          <Play className="h-8 w-8 text-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-secondary">
                    <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 text-foreground" />
                    </div>
                    <span className="text-muted-foreground font-medium">Video {slot.id}</span>
                    <span className="text-xs text-muted-foreground mt-2">Upload your ad here</span>
                  </div>
                )}
                

              </div>
            ))}
          </div>
        </div>

        {activeVideo && (
          <div 
            className="fixed inset-0 z-50 bg-background flex items-center justify-center p-2 sm:p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div className="w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
              {videoSlots.find(s => s.id === activeVideo)?.videoUrl ? (
                <video
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
                  autoPlay
                  controls
                  playsInline
                >
                  <source src={videoSlots.find(s => s.id === activeVideo)?.videoUrl || ""} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full max-w-md aspect-video bg-card border border-border rounded-2xl flex flex-col items-center justify-center">
                  <Play className="h-16 w-16 text-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video {activeVideo} will play here</p>
                  <p className="text-sm text-muted-foreground mt-2">Upload your video to this slot</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}