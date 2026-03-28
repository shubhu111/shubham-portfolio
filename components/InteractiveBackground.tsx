"use client";

import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray: Particle[] = [];
    let mouse = { x: -100, y: -100 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX; // Swapped to clientX for better absolute tracking
      mouse.y = e.clientY;
      for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle(mouse.x, mouse.y));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;

      constructor(x: number, y: number) {
        this.x = x + (Math.random() * 20 - 10);
        this.y = y + (Math.random() * 20 - 10);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 100; 
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1.5; 
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(0, 240, 255, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function handleParticles() {
      if (!ctx || !canvas) return;
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${particlesArray[i].life / 500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }

        if (particlesArray[i].life <= 0) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Animated Gradient Mesh (Removed solid bg-neuralBase so video shows through) */}
      <div className="fixed inset-0 z-[0] w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-electricBlue/10 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Particle Canvas (Moved to z-[1] to sit on top of the z-[-1] video) */}
      <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none" />
    </>
  );
}