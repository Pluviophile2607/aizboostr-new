import { useState, useRef, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Video slots with the 3 uploaded videos first
const videoSlots = [
  { id: 1, title: "Demo 1", videoUrl: "/videos/demo-1.mp4" },
  { id: 2, title: "Demo 2", videoUrl: "/videos/demo-2.mp4" },
  { id: 3, title: "Demo 3", videoUrl: "/videos/demo-3.mp4" },
  { id: 4, title: "Ad 4", videoUrl: null },
  { id: 5, title: "Ad 5", videoUrl: null },
  { id: 6, title: "Ad 6", videoUrl: null },
  { id: 7, title: "Ad 7", videoUrl: null },
  { id: 8, title: "Ad 8", videoUrl: null },
  { id: 9, title: "Ad 9", videoUrl: null },
  { id: 10, title: "Ad 10", videoUrl: null },
];

export function VideoAdsSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || activeVideo || isDragging) return;
    
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        // If we've scrolled to the end, reset to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          containerRef.current.scrollBy({ left: 2, behavior: "auto" });
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, activeVideo, isDragging]);

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setDragStartX(e.pageX);
    setScrollStartX(containerRef.current.scrollLeft);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const deltaX = e.pageX - dragStartX;
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollStartX - deltaX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Keep paused longer after manual interaction to allow free scrolling
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setDragStartX(e.touches[0].pageX);
    setScrollStartX(containerRef.current.scrollLeft);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const deltaX = e.touches[0].pageX - dragStartX;
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollStartX - deltaX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 2000);
  };

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

  // Stop all videos except the one being hovered
  const stopAllVideosExcept = (exceptId: number | null) => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video && Number(id) !== exceptId) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const handleMouseEnter = (slotId: number, hasVideo: boolean) => {
    // Skip hover behavior on touch devices to prevent double playback
    if (isTouchDevice || isDragging) return;
    
    setHoveredVideo(slotId);
    setIsPaused(true);
    stopAllVideosExcept(slotId);
    if (hasVideo && videoRefs.current[slotId]) {
      videoRefs.current[slotId]!.play();
    }
  };

  const handleMouseLeave = (slotId: number, hasVideo: boolean) => {
    // Skip hover behavior on touch devices
    if (isTouchDevice) return;
    
    setHoveredVideo(null);
    setIsPaused(false);
    if (hasVideo && videoRefs.current[slotId]) {
      videoRefs.current[slotId]!.pause();
      videoRefs.current[slotId]!.currentTime = 0;
    }
  };

  const handleClick = (slotId: number, hasVideo: boolean) => {
    // Prevent click if user was dragging
    if (hasDragged) return;
    // Stop any playing preview videos before opening modal
    stopAllVideosExcept(null);
    setActiveVideo(slotId);
  };

  return (
    <section id="video-ads-section" className="py-20 relative overflow-hidden bg-card/50">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See What's Possible with
            <span className="text-primary glow-text"> AIZboostr</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our latest campaigns and success stories powered by AI.
          </p>
        </div>

        {/* Scrolling Video Container with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div 
            ref={containerRef}
            className={`flex gap-6 overflow-x-auto pb-6 px-16 scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {videoSlots.map((slot) => (
              <div
                key={slot.id}
                className={`flex-shrink-0 w-80 h-[450px] glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  hoveredVideo === slot.id ? "scale-105 shadow-2xl z-10" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(slot.id, !!slot.videoUrl)}
                onMouseLeave={() => handleMouseLeave(slot.id, !!slot.videoUrl)}
                onClick={() => handleClick(slot.id, !!slot.videoUrl)}
              >
                {slot.videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => (videoRefs.current[slot.id] = el)}
                      className="w-full h-full object-cover"
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src={slot.videoUrl} type="video/mp4" />
                    </video>
                    {hoveredVideo !== slot.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <Play className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-muted-foreground font-medium">Video {slot.id}</span>
                    <span className="text-xs text-muted-foreground/70 mt-2">Upload your ad here</span>
                  </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-4">
                  <h4 className="font-semibold">{slot.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {slot.videoUrl ? "Hover to play" : "Click to preview"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <div 
            className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div className="max-w-4xl w-full aspect-video glass-card rounded-2xl overflow-hidden">
              {videoSlots.find(s => s.id === activeVideo)?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  playsInline
                >
                  <source src={videoSlots.find(s => s.id === activeVideo)?.videoUrl || ""} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Video {activeVideo} will play here</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">Upload your video to this slot</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
