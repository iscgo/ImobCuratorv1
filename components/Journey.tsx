import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';
import { User, MessageSquare, Key, Eye } from 'lucide-react';

const EVENTS = [
  { icon: Eye, title: 'Ana abriu o link', time: '10:42', color: 'text-green-400' },
  { icon: MessageSquare, title: 'Ana amou a cozinha', time: '10:45', sub: 'Chat iniciado', color: 'text-blue-400' },
  { icon: Key, title: 'Visita Solicitada', time: '11:20', sub: 'Sincronizado com Agenda', color: 'text-orange-400' },
];

export const Journey: React.FC = () => {
  return (
    <section className="py-32 bg-[#030305] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: THEME.fonts.display }}>
            Ritmo do Negócio
          </h2>
          <p className="text-gray-400 font-mono text-sm">
            MONITORAMENTO EM TEMPO REAL
          </p>
        </div>

        <div className="relative">
          {/* Vertical Glowing Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-800 -translate-x-1/2">
            <motion.div 
              animate={{ height: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-full bg-gradient-to-b from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)]"
            />
          </div>

          <div className="space-y-12">
            {EVENTS.map((evt, idx) => (
              <JourneyNode key={idx} event={evt} index={idx} isLeft={idx % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const JourneyNode: React.FC<{ event: any; index: number; isLeft: boolean }> = ({ event, index, isLeft }) => {
  const Icon = event.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      {/* Spacer for desktop alignment */}
      <div className="hidden md:block flex-1" />

      {/* The Node */}
      <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center ml-0 md:mx-auto">
        <div className="absolute inset-0 bg-[#030305] rounded-full border border-gray-800" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 20px rgba(168,85,247,0.3)", "0 0 0px rgba(0,0,0,0)"] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          className="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center border border-white/5"
        >
          <Icon size={20} className={event.color} />
        </motion.div>
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'text-left md:text-right' : 'text-left'}`}>
        <div className="inline-block p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
           <div className="flex items-center gap-3 mb-1 justify-start md:justify-end">
             <span className="font-mono text-xs text-gray-500">{event.time}</span>
             <h3 className="text-white font-medium" style={{ fontFamily: THEME.fonts.display }}>{event.title}</h3>
           </div>
           {event.sub && (
             <p className={`text-xs ${event.color} font-mono mt-1`}>
               {`> ${event.sub}`}
             </p>
           )}
        </div>
      </div>
    </motion.div>
  );
};
