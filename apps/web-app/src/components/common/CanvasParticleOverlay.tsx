import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    alpha: number;
    scaleY: number;
    scaleSpeed: number;
    delay: number;
}

declare global {
    interface Window {
        triggerCoinBurst: (x: number, y: number) => void;
    }
}

export const CanvasParticleOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Core animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const particles = particlesRef.current;

            // Target coordinates (generic top-right balance widget position)
            const targetX = window.innerWidth - 180;
            const targetY = 32;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                if (p.delay > 0) {
                    p.delay -= 1;
                    continue;
                }

                // Physics logic: Bouncing explosion then attraction to target
                if (p.y < targetY + 100 && p.x > targetX - 200) {
                    // Pull strongly to the target wallet/balance card
                    const dx = targetX - p.x;
                    const dy = targetY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 15) {
                        particles.splice(i, 1);
                        continue;
                    }

                    p.vx += (dx / dist) * 1.5;
                    p.vy += (dy / dist) * 1.5;
                    p.vx *= 0.85;
                    p.vy *= 0.85;
                } else {
                    // Initial explosion + gravity
                    p.vy += 0.25; // gravity
                    p.vx *= 0.98; // air resistance
                    p.vy *= 0.98;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Coin spinning effect
                p.rotation += p.rotationSpeed;
                p.scaleY += p.scaleSpeed;
                if (p.scaleY > 1 || p.scaleY < -1) {
                    p.scaleSpeed = -p.scaleSpeed;
                }

                // Draw Coin
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.scale(1, Math.abs(p.scaleY));

                // Shadow glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';

                // Draw Outer Gold Ring
                const gradOuter = ctx.createRadialGradient(0, 0, p.size * 0.3, 0, 0, p.size);
                gradOuter.addColorStop(0, '#fef08a'); // yellow-200
                gradOuter.addColorStop(0.4, '#eab308'); // yellow-500
                gradOuter.addColorStop(1, '#a16207'); // yellow-700

                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fillStyle = gradOuter;
                ctx.fill();

                // Inner Ring
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
                ctx.strokeStyle = '#ca8a04'; // yellow-600
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw Dollar Sign ($) in the center
                ctx.fillStyle = '#854d0e'; // yellow-800
                ctx.font = `bold ${p.size * 1.1}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 0, 0.5);

                ctx.restore();
            }

            if (particles.length > 0) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = null;
            }
        };

        // Register global trigger function
        window.triggerCoinBurst = (x: number, y: number) => {
            const particleCount = 18;
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 4 + Math.random() * 8;
                particlesRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2, // burst slightly upwards
                    size: 8 + Math.random() * 6,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: -0.15 + Math.random() * 0.3,
                    alpha: 1,
                    scaleY: -1 + Math.random() * 2,
                    scaleSpeed: -0.1 + Math.random() * 0.2,
                    delay: Math.floor(Math.random() * 4), // staggered spawn
                });
            }

            // Start animation loop if not running
            if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50 w-full h-full"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};
