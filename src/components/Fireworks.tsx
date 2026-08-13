import React, { useEffect, useRef } from 'react';

interface FireworksProps {
  active: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

const FIREWORK_COLORS = [
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
  '#F97316', // Orange
  '#EF4444', // Red
  '#FACC15', // Yellow
];

export const Fireworks: React.FC<FireworksProps> = ({
  active,
  onComplete,
  durationMs = 2200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Helper to spawn a burst at (x, y)
    const createBurst = (x: number, y: number, particleCount = 45) => {
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 8 + 3;
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.015,
          gravity: 0.15,
        });
      }
    };

    // Schedule multiple bursts across the screen
    const width = window.innerWidth;
    const height = window.innerHeight;

    createBurst(width * 0.5, height * 0.3, 50); // Center top
    const t1 = setTimeout(() => createBurst(width * 0.25, height * 0.4, 40), 200); // Left
    const t2 = setTimeout(() => createBurst(width * 0.75, height * 0.35, 40), 400); // Right
    const t3 = setTimeout(() => createBurst(width * 0.4, height * 0.25, 45), 600); // Center high
    const t4 = setTimeout(() => createBurst(width * 0.6, height * 0.45, 45), 800); // Center low

    let startTime = performance.now();

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98; // Drag
        p.alpha = Math.max(0, p.alpha - p.decay);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Keep only alive particles
      particles = particles.filter((p) => p.alpha > 0);

      if (elapsed < durationMs || particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete?.();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const endTimer = setTimeout(() => {
      onComplete?.();
    }, durationMs + 400);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(endTimer);
    };
  }, [active, durationMs, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
