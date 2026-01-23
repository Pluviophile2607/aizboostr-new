import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const videoSlots = [
  { id: 1, title: "AI Automation Demo", videoUrl: "https://ik.imagekit.io/pluviophile/New%20Folder/videos/demo-1.webm", thumbnailUrl: "/images/thumbnails/demo-1.png" },
  { id: 2, title: "AI Marketing Demo", videoUrl: "https://ik.imagekit.io/pluviophile/New%20Folder/videos/demo-2.webm", thumbnailUrl: "/images/thumbnails/demo-2.png" },
  { id: 3, title: "Brand Building Demo", videoUrl: "https://ik.imagekit.io/pluviophile/New%20Folder/videos/demo-3.webm", thumbnailUrl: "/images/thumbnails/demo-3.png" },
  { id: 4, title: "Content Creation Demo", videoUrl: "https://ik.imagekit.io/pluviophile/New%20Folder/videos/demo-4.webm", thumbnailUrl: "/images/thumbnails/demo-4.png" },
  { id: 5, title: "Social Media Demo", videoUrl: "https://ik.imagekit.io/pluviophile/New%20Folder/videos/demo-5.webm", thumbnailUrl: "/images/thumbnails/demo-5.png" },
  { id: 6, title: "Growth Strategy Demo", videoUrl: "https://ik.imagekit.io/pluviophile/New%20Folder/videos/demo-6.webm", thumbnailUrl: "/images/thumbnails/demo-6.png" },
];

export function VideoAdsSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  
  // Embla Carousel with AutoScroll plugin
  // speed: 1.5 pixels per frame approximately for smooth slow scroll
  // stopOnInteraction: false keeps it moving after touch (optional, user might want it to stop)
  // For "infinite easy-in", auto-scroll handles the continuous loop
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [
        AutoScroll({ 
            speed: 1, 
            stopOnInteraction: false,
            stopOnMouseEnter: true, 
            playOnInit: true 
        })
    ]
  );

  const handleClick = (slotId: number) => {
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

        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-4 px-4">
            {videoSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex-shrink-0 w-64 sm:w-80 h-[380px] sm:h-[450px] relative group cursor-pointer"
                onClick={() => handleClick(slot.id)}
              >
                <div className="w-full h-full bg-card border border-border rounded-3xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl relative">
                  {/* Thumbnail / Video Preview */}
                  {slot.videoUrl ? (
                    <>
                      <video
                        src={slot.videoUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        // Allow auto-play on hover simply via CSS/JS logic if desired, 
                        // but simpler is just a nice thumb with play button
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50">
                        <Play className="h-12 w-12 text-muted-foreground mb-4" />
                        <span className="text-sm font-medium text-foreground">{slot.title}</span>
                    </div>
                  )}
                  
                  {/* Title overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="font-bold text-lg">{slot.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Video Player */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setActiveVideo(null)}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/10">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setActiveVideo(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {videoSlots.find(s => s.id === activeVideo)?.videoUrl ? (
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  playsInline
                >
                  <source src={videoSlots.find(s => s.id === activeVideo)?.videoUrl || ""} type="video/webm" />
                </video>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                    <p>Video source not found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}