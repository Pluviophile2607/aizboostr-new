import { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ScratchCardProps {
  width?: number;
  height?: number;
  coverColor?: string;
  onComplete?: () => void;
  className?: string;
}

export const ScratchCard = ({ 
  width = 300, 
  height = 100, 
  coverColor = "#CCCCCC", 
  onComplete,
  className 
}: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas state
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add "Scratch Here" text
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#555";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Here!", width / 2, height / 2);

    let isDrawing = false;
    let scratchedPixels = 0;
    const totalPixels = width * height;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2); // Scratch brush size
      ctx.fill();
    };

    const checkRevealProgress = () => {
        if (isRevealed) return;

        // Check progress every few scratches to avoid performance hit
        // Simplified: just assume after some events. 
        // Real pixel checking is expensive.
        // Let's use a simpler heuristic or optimized pixel check.
        // For now, sticking to standard scratching.
        // To properly check percentage:
        // const imageData = ctx.getImageData(0, 0, width, height);
        // ... count alpha 0 pixels ...
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { x, y } = getMousePos(e);
      scratch(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scrolling on touch
      const { x, y } = getMousePos(e);
      scratch(x, y);
    };

    const handleEnd = () => {
      isDrawing = false;
      // Check percent revealed
      if (!isRevealed) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          let transparentPixels = 0;
          for (let i = 3; i < data.length; i += 4) {
              if (data[i] === 0) transparentPixels++;
          }
          const percent = (transparentPixels / totalPixels) * 100;
          if (percent > 40) { // 40% revealed is enough
              setIsRevealed(true);
              if (onComplete) onComplete();
              // Fade out canvas
              if (canvasRef.current) {
                 canvasRef.current.style.opacity = '0';
                 canvasRef.current.style.transition = 'opacity 0.5s ease';
                 setTimeout(() => {
                    if (canvasRef.current) canvasRef.current.style.display = 'none';
                 }, 500);
              }
          }
      }
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [width, height, coverColor, isRevealed, onComplete]);

  return (
    <div 
        ref={containerRef}
        className={cn("relative overflow-hidden rounded-xl select-none mx-auto", className)}
        style={{ width, height }}
    >
      {/* Background (Secret Code) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-yellow-100 to-yellow-200 text-black font-bold text-2xl border-2 border-dashed border-yellow-500">
        ZED10
      </div>
      
      {/* Scratch Layer */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-pointer touch-none"
      />
    </div>
  );
};
