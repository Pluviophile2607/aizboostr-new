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
  }, []);

  const handleVideoEnd = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-background"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default IntroVideo;
