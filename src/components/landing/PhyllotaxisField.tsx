import React, { useEffect, useRef } from 'react';

interface PhyllotaxisFieldProps {
  className?: string;
  speed?: number;
}

interface Point {
  index: number;
  theta: number;
  radius: number;
  baseSize: number;
  isAccentBlue: boolean;
  isAccentAmber: boolean;
  twinklePhase: number;
}

export const PhyllotaxisField: React.FC<PhyllotaxisFieldProps> = ({
  className = '',
  speed = 0.0008,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    let time = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate ~210 points on Fibonacci phyllotaxis spiral
    const TOTAL_POINTS = 210;
    const GOLDEN_ANGLE = 137.507764 * (Math.PI / 180);
    const points: Point[] = [];

    for (let i = 0; i < TOTAL_POINTS; i++) {
      const isAccentBlue = i % 14 === 3;
      const isAccentAmber = i % 47 === 11;
      points.push({
        index: i,
        theta: i * GOLDEN_ANGLE,
        radius: Math.sqrt(i),
        baseSize: isAccentAmber ? 2.8 : isAccentBlue ? 2.4 : 1.6,
        isAccentBlue,
        isAccentAmber,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Scale factor to keep spiral within view
      const maxRadiusDist = Math.sqrt(TOTAL_POINTS);
      const c = (Math.min(width, height) * 0.44) / maxRadiusDist;

      if (!prefersReducedMotion) {
        rotation += speed;
        time += 0.02;
      }

      // Draw faint center coordinate grid rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.2, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, width * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      // Render phyllotaxis nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const r = p.radius * c;
        const currentTheta = p.theta + rotation;
        const x = centerX + r * Math.cos(currentTheta);
        const y = centerY + r * Math.sin(currentTheta);

        const twinkle = prefersReducedMotion ? 1 : 0.7 + 0.3 * Math.sin(time + p.twinklePhase);
        const size = p.baseSize * twinkle;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);

        if (p.isAccentAmber) {
          ctx.fillStyle = `rgba(232, 145, 60, ${0.85 * twinkle})`;
          ctx.shadowColor = 'rgba(232, 145, 60, 0.5)';
          ctx.shadowBlur = 8;
        } else if (p.isAccentBlue) {
          ctx.fillStyle = `rgba(12, 131, 255, ${0.9 * twinkle})`;
          ctx.shadowColor = 'rgba(12, 131, 255, 0.6)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${0.35 * twinkle})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      // Reset shadow blur
      ctx.shadowBlur = 0;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return (
    <div className={`relative w-full h-full min-h-[360px] flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Precision Center Monospace Reticle */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#0C83FF]/80 animate-ping opacity-30" />
        <div className="absolute text-[9px] font-mono tracking-[0.25em] text-slate-500 uppercase mt-28">
          PHYLLOTAXIS N=210 · GOLDEN RATIO φ
        </div>
      </div>
    </div>
  );
};
