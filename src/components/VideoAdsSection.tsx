import { useState, useRef, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  useEffect(() => {
    if (isPaused || activeVideo || isDragging) return;
    
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 5) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          containerRef.current.scrollBy({ left: 2, behavior: "auto" });
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, activeVideo, isDragging]);

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
    setTimeout(() => setIsPaused(false), 2000);
  };

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

  const stopAllVideosExcept = (exceptId: number | null) => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video && Number(id) !== exceptId) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const handleMouseEnter = (slotId: number, hasVideo: boolean) => {
    if (isTouchDevice || isDragging) return;
    
    setHoveredVideo(slotId);
    setIsPaused(true);
    stopAllVideosExcept(slotId);
    if (hasVideo && videoRefs.current[slotId]) {
      videoRefs.current[slotId]!.play();
    }
  };

  const handleMouseLeave = (slotId: number, hasVideo: boolean) => {
    if (isTouchDevice) return;
    
    setHoveredVideo(null);
    setIsPaused(false);
    if (hasVideo && videoRefs.current[slotId]) {
      videoRefs.current[slotId]!.pause();
      videoRefs.current[slotId]!.currentTime = 0;
    }
  };

  const handleClick = (slotId: number, hasVideo: boolean) => {
    if (hasDragged) return;
    stopAllVideosExcept(null);
    setActiveVideo(slotId);
  };

  return (
    <section id="video-ads-section" className="py-20 relative overflow-hidden bg-secondary">
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
                className={`flex-shrink-0 w-80 h-[450px] bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  hoveredVideo === slot.id ? "scale-105 shadow-xl z-10" : ""
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
                
                <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-4">
                  <h4 className="font-semibold text-foreground">{slot.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {slot.videoUrl ? "Hover to play" : "Click to preview"}
                  </p>
                </div>
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}