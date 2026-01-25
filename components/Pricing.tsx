import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { THEME, PRICING_TIERS } from '../constants';
import { ChevronRight, Unlock } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <section className="py-32 bg-[#030305] relative overflow-hidden flex flex-col items-center">
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
       
       <div className="mb-20 text-center">
         <h2 className="text-4xl text-white font-bold mb-4" style={{ fontFamily: THEME.fonts.display }}>Acesso ao Protocolo</h2>
         <p className="text-gray-500">Escolha sua licença de operação.</p>
       </div>

       <div className="flex flex-col md:flex-row gap-8 perspective-1000 mb-24 px-4">
         {PRICING_TIERS.map((tier, idx) => (
           <PricingCard key={idx} tier={tier} />
         ))}
       </div>

       <SlideToUnlock />
    </section>
  );
};

const PricingCard: React.FC<{ tier: any }> = ({ tier }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isPro = tier.type === 'pro';

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-[300px] h-[420px] rounded-2xl p-[1px] cursor-pointer group transition-all duration-300 ${isPro ? 'shadow-[0_0_50px_-12px_rgba(251,191,36,0.2)]' : ''}`}
    >
        {/* Border Gradient */}
        <div className={`absolute inset-0 rounded-2xl ${isPro ? 'bg-gradient-to-br from-yellow-600 via-transparent to-yellow-600' : 'bg-gradient-to-br from-gray-500 via-transparent to-gray-500'} opacity-50`} />

        {/* Card Content */}
        <div className={`relative h-full rounded-2xl p-8 flex flex-col ${isPro ? 'bg-gradient-to-b from-[#1a1500] to-black' : 'bg-gradient-to-b from-[#111] to-black'}`}>
            
            {/* Metallic Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

            <div className="flex justify-between items-start mb-8">
                <span className={`text-xs font-mono tracking-widest ${isPro ? 'text-yellow-500' : 'text-gray-400'}`}>
                    {tier.type.toUpperCase()}
                </span>
                {isPro && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
            </div>

            <h3 className="text-3xl text-white font-bold mb-2" style={{ fontFamily: THEME.fonts.display }}>{tier.name}</h3>
            <div className="text-2xl text-gray-400 font-mono mb-8">{tier.price}<span className="text-xs text-gray-600">/mês</span></div>

            <ul className="space-y-4 flex-1">
                {tier.features.map((f: string, i: number) => (
                    <li key={i} className="text-sm text-gray-300 font-mono flex items-center gap-2">
                        <span className={`w-1 h-1 rounded-full ${isPro ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                        {f}
                    </li>
                ))}
            </ul>
            
            <div className={`w-full h-1 rounded-full mt-auto ${isPro ? 'bg-yellow-500/20' : 'bg-gray-800'}`}>
                <div className={`h-full rounded-full w-1/3 ${isPro ? 'bg-yellow-500' : 'bg-gray-500'}`} />
            </div>
        </div>
    </motion.div>
  );
};

const SlideToUnlock: React.FC = () => {
    const [unlocked, setUnlocked] = useState(false);
    const x = useMotionValue(0);
    const maxDrag = 250;
    const threshold = 220;
    
    // transform background opacity based on drag
    const bgOpacity = useTransform(x, [0, maxDrag], [0.1, 1]);
    const textOpacity = useTransform(x, [0, maxDrag/2], [1, 0]);

    const handleDragEnd = () => {
        if (x.get() > threshold) {
            setUnlocked(true);
            setTimeout(() => {
                // Simulate login redirect
                window.location.reload(); 
            }, 800);
        } else {
            // Animate back handled by dragSnapToOrigin automatically if constraints set?
            // Actually framer motion `dragConstraints` usually snaps back if we don't modify state.
        }
    };

    if (unlocked) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 100 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 bg-white flex items-center justify-center"
            >
            </motion.div>
        )
    }

    return (
        <div className="relative w-[300px] h-16 rounded-full bg-gray-900 border border-white/10 overflow-hidden flex items-center p-1">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-900/50" 
                style={{ opacity: bgOpacity }} 
            />
            
            <motion.div 
                style={{ opacity: textOpacity }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <span className="text-gray-500 text-xs font-mono tracking-[0.2em] animate-pulse">
                    DESLIZE PARA INICIAR
                </span>
            </motion.div>

            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.1}
                dragSnapToOrigin
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-grab active:cursor-grabbing"
            >
                <ChevronRight className="text-black" />
            </motion.div>
        </div>
    )
}
