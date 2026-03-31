"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 168; // Based on the actual files available

export default function CarDeconstruction() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preloading images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    // Ensure we are in browser
    if (typeof window === "undefined") return;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = `/sequence/frame_${i}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white">
        <div className="relative w-24 h-24 mb-6">
          <svg className="animate-spin w-full h-full text-white/20" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs tracking-widest font-mono text-red-600">
            {loadingProgress}%
          </div>
        </div>
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/60">Loading Assets</h2>
      </div>
    );
  }

  return <ScrollExperience images={images} />;
}

function ScrollExperience({ images }: { images: HTMLImageElement[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Framer Motion Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Canvas drawing effect
  useEffect(() => {
    if (images.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // High DPI Canvas Setup
    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;

      // Handle Resize / Fit "Contain"
      const windowRatio = window.innerWidth / window.innerHeight;
      const imgRatio = img.width / img.height;

      let drawWidth = window.innerWidth;
      let drawHeight = window.innerHeight;

      if (windowRatio > imgRatio) {
        drawHeight = window.innerHeight;
        drawWidth = img.width * (window.innerHeight / img.height);
      } else {
        drawWidth = window.innerWidth;
        drawHeight = img.height * (window.innerWidth / img.width);
      }

      // Clear the canvas and draw
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      renderFrame(Math.floor(smoothProgress.get() * (TOTAL_FRAMES - 1)));
    };

    handleResize(); // Initial setup
    window.addEventListener("resize", handleResize);

    const unsubscribe = smoothProgress.on("change", (latest) => {
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(latest * TOTAL_FRAMES)
      );
      renderFrame(frameIndex);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [images, smoothProgress]);

  // Transform values for Text Overlays (Beats)
  // Mapping approach: [start, start + 0.1, end - 0.1, end] -> [0, 1, 1, 0]

  // Beat A: 0 - 20%
  const beatAOpacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.15, 0.2],
    [1, 1, 1, 0] // starts visible
  );
  const beatAY = useTransform(
    smoothProgress,
    [0, 0.05, 0.15, 0.2],
    [0, 0, 0, -30]
  );

  // Beat B: 25 - 45%
  const beatBOpacity = useTransform(
    smoothProgress,
    [0.2, 0.25, 0.4, 0.45],
    [0, 1, 1, 0]
  );
  const beatBY = useTransform(
    smoothProgress,
    [0.2, 0.25, 0.4, 0.45],
    [30, 0, 0, -30]
  );

  // Beat C: 50 - 75%
  const beatCOpacity = useTransform(
    smoothProgress,
    [0.45, 0.5, 0.7, 0.75],
    [0, 1, 1, 0]
  );
  const beatCY = useTransform(
    smoothProgress,
    [0.45, 0.5, 0.7, 0.75],
    [30, 0, 0, -30]
  );

  // Beat D: 80 - 100%
  const beatDOpacity = useTransform(
    smoothProgress,
    [0.75, 0.8, 0.95, 1],
    [0, 1, 1, 1] // stays visible at the end
  );
  const beatDY = useTransform(
    smoothProgress,
    [0.75, 0.8, 0.95, 1],
    [30, 0, 0, 0]
  );

  // "Scroll to Explore" indicator
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.05],
    [1, 0]
  );

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
        />

        {/* Text Overlays - Pointer events none so scroll isn't blocked over the canvas */}
        
        {/* Beat A */}
        <motion.div
          style={{ opacity: beatAOpacity, y: beatAY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white/90 mb-4">
            RAW PERFORMANCE.<br />
            <span className="text-red-600">UNLEASHED.</span>
          </h1>
          <p className="max-w-xl text-lg md:text-2xl text-white/60 font-light">
            Witness the 670 HP flat-plane crank V8 beast pulled apart.
          </p>
        </motion.div>

        {/* Beat B */}
        <motion.div
          style={{ opacity: beatBOpacity, y: beatBY }}
          className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white/90 mb-6 border-l-4 border-red-600 pl-6">
            THE NERVE<br />CENTER
          </h2>
          <p className="max-w-md text-lg md:text-xl text-white/60 font-light">
            The body lifts away, exposing the complex digital wiring, computer modules, and raw chassis.
          </p>
        </motion.div>

        {/* Beat C */}
        <motion.div
          style={{ opacity: beatCOpacity, y: beatCY }}
          className="absolute inset-0 flex flex-col items-end justify-center text-right px-8 md:px-24"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white/90 mb-6">
            ORGANS OF<br />THE <span className="text-red-600">BEAST</span>
          </h2>
          <p className="max-w-md text-lg md:text-xl text-white/60 font-light">
            Watch the flat-plane V8 engine block, red manifold, and flaming exhausts float in pure suspended animation.
          </p>
        </motion.div>

        {/* Beat D */}
        <motion.div
          style={{ opacity: beatDOpacity, y: beatDY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-auto"
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-tight text-white/90 mb-8">
            ENGINEERED<br />MASTERPIECE
          </h2>
          <p className="max-w-xl text-lg md:text-xl text-white/60 font-light mb-12">
            Experience the ultimate treat for car lovers.
          </p>
          <button className="px-10 py-4 border border-white/20 uppercase tracking-widest text-sm text-white/90 hover:bg-white hover:text-black transition-colors duration-500 rounded backdrop-blur-sm pointer-events-auto">
            Explore Specs
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <span className="uppercase tracking-widest text-xs text-white/40">
            Scroll to Explore
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
}
