import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';

interface HeroProps {
  onScrollDown: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollDown }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 400 : 1200;
      
      // Calculate grid positions for "Order" state
      const cols = Math.floor(Math.sqrt(particleCount * (window.innerWidth / window.innerHeight)));
      const rows = Math.ceil(particleCount / cols);
      const gapX = (window.innerWidth * 0.6) / cols;
      const gapY = (window.innerHeight * 0.6) / rows;
      const startX = (window.innerWidth - gapX * cols) / 2;
      const startY = (window.innerHeight - gapY * rows) / 2;

      for (let i = 0; i < particleCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          targetX: startX + col * gapX,
          targetY: startY + row * gapY,
          size: Math.random() < 0.1 ? 2 : 1, // Occasional larger data points
          color: Math.random() < 0.05 ? THEME.colors.neonPurple : '#333',
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines faintly in the background if hovering
      if (isHovering) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        // Simple grid drawing logic could go here, omitting for performance in this demo
      }

      particles.forEach((p) => {
        // Distance to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interaction Logic
        // If mouse is close (Magnetic Ring), particles are sucked into order
        // If mouse is far, they drift in entropy
        
        const isMagnetic = dist < 300; 

        if (isMagnetic) {
          // Move towards target (Order)
          p.x += (p.targetX - p.x) * 0.1;
          p.y += (p.targetY - p.y) * 0.1;
          
          // Add a little jitter for "energy"
          p.x += (Math.random() - 0.5) * 0.5;
          p.y += (Math.random() - 0.5) * 0.5;
          
          ctx.fillStyle = p.color === '#333' ? '#666' : THEME.colors.neonPurple;
        } else {
          // Chaos (Entropy)
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off edges
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.fillStyle = p.color;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#030305] cursor-none">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      
      {/* Magnetic Cursor Follower */}
      <CursorFollower />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center pointer-events-none px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="backdrop-blur-sm bg-black/10 p-8 rounded-2xl border border-white/5"
        >
          <h1 
            className="text-4xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6"
            style={{ fontFamily: THEME.fonts.display }}
          >
            O MERCADO É CAOS.<br />
            <span className="text-white">VOCÊ É A CURADORIA.</span>
          </h1>
          <h2 
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            style={{ fontFamily: THEME.fonts.display }}
          >
            O primeiro Sistema Operacional para Buyer Agents que não têm tempo a perder.
          </h2>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <motion.button
          onClick={onScrollDown}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
          style={{ fontFamily: THEME.fonts.mono }}
        >
          Scroll to Initialize
        </motion.button>
      </div>
    </section>
  );
};

const CursorFollower = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 32}px, ${e.clientY - 32}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-50 rounded-full border border-purple-500/50 mix-blend-screen hidden md:flex items-center justify-center backdrop-blur-[1px]"
      style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}
    >
      <div className="w-1 h-1 bg-white rounded-full" />
    </div>
  );
};
