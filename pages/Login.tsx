import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';
import { ArrowRight, Check, X, Layout, MessageSquare, Database, FileSpreadsheet } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'landing' | 'onboarding' | 'auth'>('landing');
  const [onboardingData, setOnboardingData] = useState({
    isAgent: null as boolean | null,
    affiliation: '',
    role: ''
  });

  // Canvas Refs for Particles
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Open laptop
    setTimeout(() => setIsOpen(true), 500);

    // Particle System Logic
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let mouse = { x: -1000, y: -1000 }; // Mouse off-screen initially

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen size
      const particleCount = window.innerWidth < 768 ? 60 : 180;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2,
          color: Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.15)',
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        // Basic Movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse Interaction (Magnetism)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const connectDistance = 150;

        if (dist < connectDistance) {
            // Draw line to mouse
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 * (1 - dist / connectDistance)})`; // Fade out
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Slight attraction to mouse
            p.x += dx * 0.02;
            p.y += dy * 0.02;
        }

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect particles to nearby particles (Constellation effect)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          
          if (pDist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - pDist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleStart = () => setStep('onboarding');

  const handleOnboardingAnswer = (key: string, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
    if (key === 'isAgent' && value === false) {
      alert("Esta plataforma é otimizada para profissionais, mas você pode explorar.");
      setStep('auth');
    }
  };

  const finalizeOnboarding = () => {
    setStep('auth');
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  if (step === 'onboarding') {
    return (
        <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Particles for Onboarding too */}
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: THEME.fonts.display }}>Configuração Inicial</h2>
                    <p className="text-gray-400 text-sm">Vamos personalizar sua experiência.</p>
                </div>

                {onboardingData.isAgent === null ? (
                    <div className="space-y-4">
                        <p className="text-white text-center mb-4">Você trabalha no ramo imobiliário?</p>
                        <div className="flex gap-4">
                            <button onClick={() => handleOnboardingAnswer('isAgent', true)} className="flex-1 p-4 bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors text-white font-bold">Sim</button>
                            <button onClick={() => handleOnboardingAnswer('isAgent', false)} className="flex-1 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-gray-300">Não</button>
                        </div>
                    </div>
                ) : !onboardingData.affiliation ? (
                    <div className="space-y-3">
                        <p className="text-white text-center mb-4">Qual é a sua afiliação?</p>
                        {['Remax', 'KW', 'Century 21', 'Era', 'Independente', 'Agência Privada'].map(opt => (
                            <button 
                                key={opt}
                                onClick={() => setOnboardingData(prev => ({ ...prev, affiliation: opt }))}
                                className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-300 transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-white text-center mb-4">Qual o seu cargo principal?</p>
                        {['Consultor Imobiliário', 'Broker / Gerente', 'Assistente', 'Investidor'].map(opt => (
                            <button 
                                key={opt}
                                onClick={finalizeOnboarding}
                                className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-300 transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
  }

  if (step === 'auth') {
      return (
        <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Particles for Auth too */}
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-sm w-full bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: THEME.fonts.display }}>Login</h1>
                    <p className="text-gray-500 text-sm">Acesse o protocolo ImobCurator</p>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Email</label>
                        <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Senha</label>
                        <input type="password" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Entrar na Matrix
                    </button>
                </form>
            </motion.div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white overflow-x-hidden relative">
      
      {/* Canvas Layer - Fixed to stay in background during scroll */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col items-center pt-20 px-4 z-10">
        
        {/* Background Glow (Static fallback) */}
        <div className="absolute inset-0 z-[-1]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-bold leading-tight mb-6" 
                style={{ fontFamily: THEME.fonts.display }}
            >
                Domine a Arte da Compra.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Automatize o Resto.
                </span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            >
                O sistema operacional definitivo para consultores que cansaram de planilhas e querem fechar negócios.
            </motion.p>
            <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center gap-2 mx-auto"
            >
                Começar Grátis <ArrowRight size={20} />
            </motion.button>
        </div>

        {/* 3D Laptop Animation */}
        <div className="relative z-10 perspective-1000 w-full max-w-4xl mx-auto h-[400px] md:h-[600px] flex justify-center">
            <div className={`relative w-[300px] md:w-[600px] h-[200px] md:h-[400px] transition-transform duration-1000 preserve-3d ${isOpen ? 'laptop-open' : 'laptop-closed'}`}>
                {/* Base */}
                <div className="absolute bottom-0 w-full h-[12px] md:h-[20px] bg-gray-800 rounded-b-xl shadow-2xl transform rotateX(90deg) translateZ(10px)"></div>
                <div className="absolute bottom-0 w-full h-full bg-[#1a1a1a] rounded-xl transform rotateX(90deg) origin-bottom flex items-center justify-center">
                    {/* Keyboard hint */}
                    <div className="w-[90%] h-[60%] grid grid-cols-10 gap-1 opacity-30">
                        {[...Array(40)].map((_, i) => <div key={i} className="bg-gray-600 rounded-sm" />)}
                    </div>
                </div>

                {/* Lid (Screen) */}
                <div className="absolute bottom-0 w-full h-full laptop-lid origin-bottom bg-gray-800 rounded-t-xl p-1 md:p-2 shadow-2xl border-t border-white/10">
                    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative border border-white/5">
                        {/* Fake Screen Content */}
                        <div className="absolute inset-0 bg-[#030305] flex flex-col p-4">
                            <div className="flex gap-4 h-full">
                                <div className="w-16 bg-white/5 rounded-lg h-full animate-pulse" />
                                <div className="flex-1 space-y-4">
                                    <div className="h-32 bg-purple-500/10 rounded-lg border border-purple-500/20 flex items-center justify-center">
                                        <span className="text-purple-400 font-mono text-xs">AI MATCHING...</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-20 bg-white/5 rounded-lg" />
                                        <div className="h-20 bg-white/5 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Screen Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                    </div>
                    {/* Apple/Logo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 rounded-full blur-sm transform translateZ(-1px)" />
                </div>
            </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-black/50 border-t border-white/5 relative z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Before: Chaos */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-8 text-center" style={{ fontFamily: THEME.fonts.display }}>O Jeito Antigo (Caos)</h3>
                    <div className="relative h-[300px] w-full">
                        <motion.div 
                            animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-0 left-10 p-4 bg-green-900/80 rounded-lg border border-green-500/30 text-xs font-mono w-48 shadow-lg"
                        >
                            <FileSpreadsheet className="mb-2 text-green-400" />
                            Leads_Final_v2_DEFINITIVO.xlsx
                        </motion.div>
                        <motion.div 
                            animate={{ rotate: [5, -5, 5], y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                            className="absolute top-20 right-10 p-4 bg-gray-800 rounded-lg border border-gray-600 text-xs w-56 shadow-lg z-10"
                        >
                            <MessageSquare className="mb-2 text-blue-400" />
                            Cliente: "Aquele apartamento ainda tá disponível?"
                            <br/><span className="text-red-400">Você: "Qual deles? Me perdi."</span>
                        </motion.div>
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-yellow-900/80 rounded-lg border border-yellow-500/30 text-xs w-64 text-center shadow-lg"
                        >
                            <Database className="mx-auto mb-2 text-yellow-400" />
                            Notas soltas no bloco de notas, guardanapos e WhatsApp.
                        </motion.div>
                    </div>
                </div>

                {/* After: Order */}
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full" />
                    <h3 className="text-2xl font-bold text-white mb-8 text-center" style={{ fontFamily: THEME.fonts.display }}>ImobCurator (Ordem)</h3>
                    <div className="bg-[#0A0A0C] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Layout size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Dashboard Centralizado</h4>
                                <p className="text-xs text-gray-500">Tudo em um só lugar.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-green-500">
                                <span className="text-sm text-gray-300">Visita: João Silva</span>
                                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">14:00</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-2 border-purple-500">
                                <span className="text-sm text-gray-300">Proposta: Apto Jardins</span>
                                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">98% Match</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

    </div>
  );
};