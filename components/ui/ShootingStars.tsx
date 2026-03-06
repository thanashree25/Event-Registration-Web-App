"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  maxOpacity: number;
  age: number;
  lifespan: number;
}

interface ShootingStarsProps {
  /** Number of ambient stars */
  count?: number;
  /** Glow colour – RGB string e.g. "180,140,255" */
  color?: string;
  className?: string;
}

// ─── Fixed direction: all stars shoot the same way ──────────────────
const DIRECTION = (220 * Math.PI) / 180;
const DIR_COS = Math.cos(DIRECTION);
const DIR_SIN = Math.sin(DIRECTION);

// ─── Component ──────────────────────────────────────────────────────
export default function ShootingStars({
  count = 20,
  color = "255,230,230",
  className = "",
}: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  const spawnAmbient = useCallback((): Star => {
    const w = window.innerWidth;
    return {
      x: Math.random() * w * 1.4 - w * 0.2,
      y: -30 - Math.random() * 150,
      len: 60 + Math.random() * 110,
      speed: 2 + Math.random() * 3,
      opacity: 0,
      maxOpacity: 0.35 + Math.random() * 0.4,
      age: 0,
      lifespan: 120 + Math.random() * 180,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // ── Resize ──────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    starsRef.current = Array.from({ length: count }, spawnAmbient);
    window.addEventListener("resize", resize);

    // ── Draw loop ───────────────────────────────────────────────
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const alive: Star[] = [];

      for (const s of starsRef.current) {
        s.age++;

        const fadeIn = Math.min(s.age / 15, 1);
        const fadeOut = Math.max((s.lifespan - s.age) / 30, 0);
        s.opacity = s.maxOpacity * fadeIn * fadeOut;

        s.x += DIR_COS * s.speed;
        s.y -= DIR_SIN * s.speed;

        if (s.age > s.lifespan || s.x < -200 || s.x > w + 200 || s.y > h + 200) {
          continue;
        }
        alive.push(s);

        const tailX = s.x - DIR_COS * s.len;
        const tailY = s.y + DIR_SIN * s.len;

        // ── Soft glow layer (thin, blurred) ─────────────────────
        const glowGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        glowGrad.addColorStop(0, `rgba(${color},${s.opacity * 0.35})`);
        glowGrad.addColorStop(1, `rgba(${color},0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // ── Sharp core streak ───────────────────────────────────
        const coreGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        coreGrad.addColorStop(0, `rgba(255,255,255,${s.opacity * 0.9})`);
        coreGrad.addColorStop(0.4, `rgba(${color},${s.opacity * 0.7})`);
        coreGrad.addColorStop(1, `rgba(${color},0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = 0.8;
        ctx.lineCap = "round";
        ctx.stroke();

        // ── Tiny bright head dot ────────────────────────────────
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(s.opacity + 0.2, 0.9)})`;
        ctx.shadowColor = `rgba(${color},${s.opacity * 0.8})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      while (alive.length < count) {
        alive.push(spawnAmbient());
      }
      starsRef.current = alive;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [count, color, spawnAmbient]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
