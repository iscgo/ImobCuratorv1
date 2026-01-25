import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { THEME } from '../constants';
import { Sparkles, Check, Zap } from 'lucide-react';

export const ParserDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animation sequences driven by scroll
  const rawLinkX = useTransform(scrollYProgress, [0.1, 0.4], [-500, 0]);
  const rawLinkOpacity = useTransform(scrollYProgress, [0.35, 0.4], [1, 0]);
  
  const explosionScale = useTransform(scrollYProgress, [0.4, 0.45, 0.5], [0, 1.5, 0]);
  const explosionOpacity = useTransform(scrollYProgress, [0.4, 0.45, 0.5], [0, 1, 0]);

  const cardScale = useTransform(scrollYProgress, [0.45, 0.6], [0.8, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0.45, 0.5], [0, 1]);
  const cardY = useTransform(scrollYProgress, [0.45, 0.6], [50, 0]);

  return (
    <section ref={containerRef} className="min-h-[150vh] relative bg-[#030305] flex items-center justify-center overflow-hidden py-24">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-4"
            style={{ fontFamily: THEME.fonts.mono }}
          >
            <Zap size={12} />
            <span>LINK PARSER v3.0</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: THEME.fonts.display }}>
            Entropia Reversa
          </h2>
          <p className="text-gray-400" style={{ fontFamily: THEME.fonts.display }}>
            De URL suja para Proposta Premium em 0.4s
          </p>
        </div>

        <div className="h-[400px] flex items-center justify-center relative">
          
          {/* 1. The Raw Link "Comet" */}
          <motion.div 
            style={{ x: rawLinkX, opacity: rawLinkOpacity }}
            className="absolute left-0 md:left-1/4 flex items-center gap-3 px-6 py-3 bg-gray-900/80 border border-gray-700 rounded-lg blur-[1px]"
          >
            <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
              <span className="text-xs text-gray-400">URL</span>
            </div>
            <span className="text-gray-500 font-mono text-sm line-through decoration-red-500/50 truncate max-w-[200px]">
              https://portal-lento.com.br/imovel/99283?utm_source=bad...
            </span>
          </motion.div>

          {/* 2. The Explosion */}
          <motion.div
            style={{ scale: explosionScale, opacity: explosionOpacity }}
            className="absolute z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50" />
              <Sparkles className="text-purple-300 w-16 h-16" />
            </div>
          </motion.div>

          {/* 3. The Clean Card */}
          <motion.div
            style={{ scale: cardScale, opacity: cardOpacity, y: cardY }}
            className="relative z-30 w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20"
          >
            {/* Holographic Header */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white text-xl font-medium leading-tight mb-1" style={{ fontFamily: THEME.fonts.display }}>
                    Cobertura Duplex - Jardins
                  </h3>
                  <p className="text-gray-500 text-sm">Rua Haddock Lobo, São Paulo</p>
                </div>
                <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-xs font-mono">
                  VERIFICADO
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <Stat label="ÁREA" value="240m²" />
                <Stat label="QUARTOS" value="3" />
                <Stat label="VAGAS" value="4" />
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">VALOR DE MERCADO</span>
                  <span className="text-2xl text-white tracking-tight font-mono">R$ 4.2M</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                   <Check size={16} />
                </button>
              </div>
            </div>

            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-[10px] text-gray-600 block mb-1 font-mono tracking-wider">{label}</span>
    <span className="text-white font-mono text-sm">{value}</span>
  </div>
);
