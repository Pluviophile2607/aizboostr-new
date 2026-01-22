import { useEffect, useRef } from "react";

interface IntroVideoProps {
  onComplete: () => void;
}

const IntroVideo = ({ onComplete }: IntroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }

    // Auto-complete after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center cursor-pointer"
      onClick={handleSkip}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-background pointer-events-none"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>
      
      {/* Skip hint */}
      <div className="absolute bottom-8 right-8 text-muted-foreground text-sm animate-fade-in">
        <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
          Tap anywhere to skip
        </span>
      </div>
    </div>
  );
};

export default IntroVideo;
