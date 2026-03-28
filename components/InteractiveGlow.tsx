"use client";

import { useEffect, useRef } from "react";

export default function InteractiveGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        // We use transform for hardware-accelerated, 60fps movement
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    // Attach to the window so it tracks perfectly no matter what z-index you hover over
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      <div
        ref={glowRef}
        // -top and -left center the glow exactly on the tip of the cursor
        className="absolute -top-[200px] -left-[200px] w-[400px] h-[400px] bg-[#00f0ff] opacity-15 rounded-full blur-[100px]"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}