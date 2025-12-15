import { useState, useRef, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

// Placeholder for 10 video slots
const videoSlots = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Ad ${i + 1}`,
  // Placeholder - user will upload their videos
  videoUrl: null,
}));

export function VideoAdsSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 relative overflow-hidden bg-card/50">
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

        {/* Scrolling Video Container */}
        <div className="relative">
          <div 
            ref={containerRef}
            className="flex gap-6 overflow-x-auto pb-6 px-8 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Duplicate for infinite scroll effect */}
            {[...videoSlots, ...videoSlots].map((slot, index) => (
              <div
                key={`${slot.id}-${index}`}
                className="flex-shrink-0 w-80 h-[450px] glass-card rounded-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setActiveVideo(slot.id)}
              >
                {slot.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={slot.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-muted-foreground font-medium">Video {slot.id}</span>
                    <span className="text-xs text-muted-foreground/70 mt-2">Upload your ad here</span>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="font-semibold">{slot.title}</h4>
                    <p className="text-sm text-muted-foreground">Click to play</p>
                  </div>
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
            <div className="max-w-4xl w-full aspect-video glass-card rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Video {activeVideo} will play here</p>
                <p className="text-sm text-muted-foreground/70 mt-2">Upload your video to this slot</p>
              </div>
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
