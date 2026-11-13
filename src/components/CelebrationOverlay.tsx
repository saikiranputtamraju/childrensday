import { useEffect, useRef } from 'react';

interface CelebrationOverlayProps {
  active: boolean;
}

interface CelebrationItem {
  kind: 'balloon' | 'confetti';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  swayOffset: number;
}

const COLORS = ['#F472B6', '#38BDF8', '#FBBF24', '#A78BFA', '#34D399', '#FB7185'];

export default function CelebrationOverlay({ active }: CelebrationOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Lightweight celebration pool: 10 floating balloons + 28 falling confetti pieces
    const items: CelebrationItem[] = [
      ...Array.from({ length: 10 }, (_, idx) => ({
        kind: 'balloon' as const,
        x: Math.random() * canvas.width,
        y: canvas.height + 60 + idx * 70,
        vx: 0,
        vy: -(1.1 + Math.random() * 0.9),
        size: 20 + Math.random() * 10,
        color: COLORS[idx % COLORS.length],
        rotation: 0,
        vRot: 0,
        swayOffset: Math.random() * Math.PI * 2,
      })),
      ...Array.from({ length: 28 }, (_, idx) => ({
        kind: 'confetti' as const,
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.4 + Math.random() * 1.4,
        size: 6 + Math.random() * 5,
        color: COLORS[idx % COLORS.length],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        swayOffset: Math.random() * Math.PI * 2,
      })),
    ];

    let t = 0;
    let rafId = 0;

    const tick = () => {
      t += 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const item of items) {
        if (item.kind === 'balloon') {
          item.y += item.vy;
          const swayX = item.x + Math.sin(t + item.swayOffset) * 18;
          if (item.y < -120) {
            item.y = canvas.height + 90;
            item.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.globalAlpha = 0.78;
          ctx.translate(swayX, item.y);

          // Balloon string
          ctx.beginPath();
          ctx.moveTo(0, item.size * 1.25);
          ctx.quadraticCurveTo(-5, item.size * 1.9, 3, item.size * 2.5);
          ctx.strokeStyle = 'rgba(100,116,139,0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Balloon body
          ctx.beginPath();
          ctx.ellipse(0, 0, item.size, item.size * 1.22, 0, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.fill();

          // Highlight
          ctx.beginPath();
          ctx.ellipse(-item.size * 0.32, -item.size * 0.3, item.size * 0.2, item.size * 0.32, -0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fill();
          ctx.restore();
        } else {
          item.y += item.vy;
          item.x += item.vx + Math.sin(t + item.swayOffset) * 0.4;
          item.rotation += item.vRot;

          if (item.y > canvas.height + 20) {
            item.y = -20;
            item.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rotation);
          ctx.fillStyle = item.color;
          ctx.fillRect(-item.size / 2, -item.size / 3, item.size, item.size * 0.6);
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20"
    />
  );
}
