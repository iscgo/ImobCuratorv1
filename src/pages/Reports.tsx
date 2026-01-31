import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart, TrendingUp, Users, AlertCircle, CheckCircle,
  XCircle, Calendar, DollarSign, Trophy, ArrowRight, X,
  HelpCircle, Save, MessageSquare, Shield, Zap, Crown, Flame, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReputationLevel } from '../types';
import { getMonthlyStats } from '../utils/reportsData';
import {
  getReputation,
  getLossReasonsPercentage,
  getDealsThisMonth,
  PendingFeedback
} from '../utils/deals';

// --- RANKING CONFIGURATION ---
const RANK_TIERS = [
  {
    id: 'risk',
    name: 'Em Risco',
    minStreak: -99, // Qualquer coisa negativa
    maxStreak: -1,
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    desc: 'Cuidado! Muitas perdas consecutivas.'
  },
  {
    id: 'neutral',
    name: 'Agente Neutro',
    minStreak: 0,
    maxStreak: 0,
    icon: Users,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500',
    desc: 'Comece a fechar negócios para subir.'
  },
  {
    id: 'trusted',
    name: 'Confiável',
    minStreak: 1,
    maxStreak: 2,
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    desc: 'Bom ritmo! Mantenha a consistência.'
  },
  {
    id: 'elite',
    name: 'Elite',
    minStreak: 3,
    maxStreak: 4,
    icon: Trophy,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    desc: 'Excelente performance! Top Producer.'
  },
  {
    id: 'legend',
    name: 'Lenda Imobiliária',
    minStreak: 5,
    maxStreak: 999,
    icon: Crown,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500',
    desc: 'O nível máximo de curadoria e vendas.'
  }
];

// --- CONFETTI & CUBE COMPONENT ---
const SuccessCelebration: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
           p.y = -20;
           p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* 3D CUBE CSS */}
        <div className="cube-container mb-12">
          <div className="cube">
            <div className="face front flex items-center justify-center bg-indigo-600/90 border-2 border-indigo-400 text-white font-bold text-4xl">🎉</div>
            <div className="face back flex items-center justify-center bg-indigo-600/90 border-2 border-indigo-400 text-white font-bold text-4xl">💰</div>
            <div className="face right flex items-center justify-center bg-blue-600/90 border-2 border-blue-400 text-white font-bold text-4xl">🏠</div>
            <div className="face left flex items-center justify-center bg-blue-600/90 border-2 border-blue-400 text-white font-bold text-4xl">🤝</div>
            <div className="face top flex items-center justify-center bg-green-500/90 border-2 border-green-400 text-white font-bold text-4xl">✨</div>
            <div className="face bottom flex items-center justify-center bg-green-500/90 border-2 border-green-400 text-white font-bold text-4xl">🚀</div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-white mb-2 text-center drop-shadow-lg animate-bounce">Parabéns!</h2>
        <p className="text-xl text-indigo-100 mb-8 text-center max-w-md">Mais uma venda fechada e mais um cliente feliz. Bom trabalho!</p>
        
        <button 
          onClick={onClose}
          className="px-8 py-3 bg-white text-indigo-700 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
        >
          Continuar
        </button>
      </div>

      <style>{`
        .cube-container {
          width: 120px;
          height: 120px;
          perspective: 1000px;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: spin 5s infinite linear;
        }
        .face {
          position: absolute;
          width: 120px;
          height: 120px;
          font-size: 40px;
        }
        .front  { transform: rotateY(0deg) translateZ(60px); }
        .back   { transform: rotateY(180deg) translateZ(60px); }
        .right  { transform: rotateY(90deg) translateZ(60px); }
        .left   { transform: rotateY(-90deg) translateZ(60px); }
        .top    { transform: rotateX(90deg) translateZ(60px); }
        .bottom { transform: rotateX(-90deg) translateZ(60px); }

        @keyframes spin {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
};

export const Reports: React.FC = () => {
  const [stats, setStats] = useState(getMonthlyStats());

  // Estados de Reputação & Ranking
  const [reputationState, setReputationState] = useState(getReputation());
  const [showRankingModal, setShowRankingModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStats(getMonthlyStats());
    setReputationState(getReputation());
  };

  const updateReputationState = () => {
    setReputationState(getReputation());
  };

  // Lógica para determinar o rank atual baseado no streak
  const getCurrentRank = () => {
      const streak = reputationState.winStreak > 0 ? reputationState.winStreak : -reputationState.lossStreak;
      
      return RANK_TIERS.find(rank => streak >= rank.minStreak && streak <= rank.maxStreak) || RANK_TIERS[4]; // Default to Legend if exceeded
  };

  const currentRank = getCurrentRank();

  // Calcula progresso para o próximo nível
  const getNextRankProgress = () => {
      const currentStreak = reputationState.winStreak;
      
      if (reputationState.lossStreak > 0) return 0; // Se está perdendo, progresso é 0 para subir

      // Encontrar próximo rank
      const nextRankIndex = RANK_TIERS.findIndex(r => r.id === currentRank.id) + 1;
      if (nextRankIndex >= RANK_TIERS.length) return 100; // Já é lenda

      const nextRank = RANK_TIERS[nextRankIndex];
      const prevRankMax = RANK_TIERS[nextRankIndex - 1].maxStreak;
      
      // Calculo simples: Quantas vendas faltam para o minimo do proximo
      const needed = nextRank.minStreak - currentStreak;
      const totalGap = nextRank.minStreak - prevRankMax; // ex: Elite(3) - Trusted(2) = 1
      
      // Se needed <= 0, já subiu. 
      // Para simplificar a barra visual baseada em wins absolutos:
      const percentage = (currentStreak / nextRank.minStreak) * 100;
      return Math.min(percentage, 100);
  };


  // Funções de feedback removidas - serão implementadas com backend real

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header & Reputation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="text-indigo-500" />
            Relatórios de Desempenho
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Análise mensal de conversão e gestão de oportunidades.
          </p>
        </div>
        
        {/* REPUTATION WIDGET (Clickable) */}
        <div 
          onClick={() => setShowRankingModal(true)}
          className={`cursor-pointer group flex items-center gap-4 px-6 py-3 rounded-2xl border ${currentRank.bg.replace('/10', '/30')} ${currentRank.border} bg-opacity-50 hover:scale-105 transition-transform duration-200`}
        >
             <div className={`p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm ${currentRank.color}`}>
                 <currentRank.icon size={24} />
             </div>
             <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank Atual</p>
                 <p className={`text-xl font-bold ${currentRank.color}`}>{currentRank.name}</p>
                 
                 {/* Streak Bar */}
                 <div className="flex gap-1 mt-1.5">
                    {reputationState.winStreak > 0 ? (
                        Array.from({length: Math.min(4, reputationState.winStreak)}).map((_, i) => (
                             <div key={i} className="w-6 h-1.5 rounded-full bg-green-50 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                        ))
                    ) : reputationState.lossStreak > 0 ? (
                        Array.from({length: Math.min(5, reputationState.lossStreak)}).map((_, i) => (
                             <div key={i} className="w-6 h-1.5 rounded-full bg-red-500"></div>
                        ))
                    ) : (
                        <div className="w-6 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600"></div>
                    )}
                 </div>
             </div>
             <div className="pl-4 border-l border-gray-200 dark:border-slate-700/50 hidden sm:block">
                 <div className="text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block group-hover:text-indigo-400 transition-colors">Ver Ranking</span>
                    <span className="text-lg font-mono font-bold text-slate-800 dark:text-white">
                        {reputationState.winStreak > 0 ? `+${reputationState.winStreak}` : reputationState.lossStreak > 0 ? `-${reputationState.lossStreak}` : '0'}
                    </span>
                 </div>
             </div>
        </div>
      </div>

      {/* FEEDBACK LOOP SECTION - Removido, será implementado com backend */}

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                <Users size={24} />
             </div>
             <span className="text-xs font-medium text-gray-400 uppercase">{stats.month}</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.salesClosed}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Clientes ajudados</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                <Trophy size={24} />
             </div>
             {stats.salesClosed > 0 && stats.conversionRate > 0 && (
               <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                 {stats.conversionRate}%
               </span>
             )}
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.salesClosed}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vendas Fechadas (Sucesso)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500 dark:text-red-400">
                <XCircle size={24} />
             </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.salesLost}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Não Vendeu / Descartado</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                <DollarSign size={24} />
             </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">€{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comissão Estimada</p>
        </div>
      </div>

      {/* DETAILED BREAKDOWN (Funnel etc) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Funil de Conversão</h3>
            {stats.totalClients > 0 ? (
              <div className="space-y-6">
                  <div className="relative">
                     <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-700 dark:text-gray-300">Clientes Ativos</span>
                        <span className="text-slate-900 dark:text-white">{stats.totalClients}</span>
                     </div>
                     <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                     </div>
                  </div>
                  <div className="relative">
                     <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-700 dark:text-gray-300">Em Negociação</span>
                        <span className="text-slate-900 dark:text-white">{stats.inProgress}</span>
                     </div>
                     <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: stats.inProgress > 0
                              ? `${Math.max(5, (stats.inProgress / stats.totalClients) * 100)}%`
                              : '0%'
                          }}
                        ></div>
                     </div>
                  </div>
                  <div className="relative">
                     <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-700 dark:text-gray-300">Vendas Fechadas</span>
                        <span className="text-slate-900 dark:text-white">{stats.salesClosed}</span>
                     </div>
                     <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: stats.salesClosed > 0
                              ? `${Math.max(5, (stats.salesClosed / stats.totalClients) * 100)}%`
                              : '0%'
                          }}
                        ></div>
                     </div>
                  </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Sem clientes ativos ainda. Adicione clientes para ver o funil.
                </p>
              </div>
            )}
         </div>

         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Motivos de Não-Venda</h3>
            {(() => {
              const lossReasons = getLossReasonsPercentage(getDealsThisMonth());
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-gray-500', 'bg-yellow-500', 'bg-blue-500'];

              return lossReasons.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {lossReasons.slice(0, 5).map((item, index) => (
                      <div key={item.reason} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${colors[index % colors.length]}`}></span>
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{item.reason}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Dica da IA</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {lossReasons[0] ? `"Baseado nos dados de ${stats.month}, ${lossReasons[0].percentage}% das perdas devem-se a: ${lossReasons[0].reason}."` : "Sem dados de perdas ainda."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Sem dados de não-vendas ainda. Continue trabalhando!
                  </p>
                </div>
              );
            })()}
         </div>
      </div>

      {/* --- MODAL DE RANKING (GAME STYLE) --- */}
      {showRankingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative animate-in zoom-in-95 duration-300">
              
              <button 
                onClick={() => setShowRankingModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Background Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] opacity-30 ${currentRank.bg.replace('/10', '')}`}></div>
                 <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600 blur-[100px] opacity-20"></div>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12">
                 
                 {/* Left Panel: Current Status */}
                 <div className="md:col-span-4 bg-slate-800/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700">
                    <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Modo Classificatório</h2>
                    
                    <div className="relative mb-6 group">
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000 ${currentRank.bg.replace('/10', '')}`}></div>
                        <div className={`w-32 h-32 rounded-full border-4 ${currentRank.border} bg-slate-900 flex items-center justify-center relative shadow-2xl`}>
                            <currentRank.icon size={56} className={currentRank.color} />
                        </div>
                        {/* Streak Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-white shadow-lg">
                           {reputationState.winStreak > 0 ? `+${reputationState.winStreak}` : Math.abs(reputationState.lossStreak)}
                        </div>
                    </div>

                    <h3 className={`text-2xl font-black uppercase text-center mb-2 ${currentRank.color} drop-shadow-md`}>
                       {currentRank.name}
                    </h3>
                    <p className="text-slate-400 text-center text-sm mb-8 px-4">{currentRank.desc}</p>

                    {/* Next Rank Progress */}
                    <div className="w-full space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                          <span>Progresso</span>
                          <span>{getNextRankProgress().toFixed(0)}%</span>
                       </div>
                       <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                          <div 
                             className={`h-full transition-all duration-1000 ease-out ${currentRank.bg.replace('/10', '')}`} 
                             style={{ width: `${getNextRankProgress()}%` }}
                          ></div>
                       </div>
                       <p className="text-center text-[10px] text-slate-500 mt-2">
                          Venda imóveis consecutivamente para subir.
                       </p>
                    </div>

                    <button 
                      onClick={() => setShowRankingModal(false)}
                      className="mt-8 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="rotate-180" size={16} /> Voltar
                    </button>
                 </div>

                 {/* Right Panel: All Tiers Grid */}
                 <div className="md:col-span-8 p-8 bg-slate-900">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-white font-bold text-lg flex items-center gap-2">
                          <Target className="text-indigo-500" />
                          Ranking Imobiliário
                       </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                       {RANK_TIERS.map((tier) => {
                          const isCurrent = tier.id === currentRank.id;
                          const isLocked = !isCurrent && ((reputationState.winStreak < tier.minStreak && tier.minStreak > 0) || (reputationState.lossStreak > Math.abs(tier.maxStreak) && tier.minStreak < 0));
                          
                          return (
                             <div 
                                key={tier.id}
                                className={`
                                   relative p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300
                                   ${isCurrent 
                                      ? `bg-slate-800 ${tier.border} shadow-lg scale-105 z-10` 
                                      : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                                   }
                                `}
                             >
                                {isCurrent && (
                                   <div className="absolute -top-3 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold uppercase rounded-full shadow-md">
                                      Atual
                                   </div>
                                )}
                                
                                <tier.icon size={24} className={tier.color} />
                                
                                <div className="text-center">
                                   <p className={`text-sm font-bold uppercase ${tier.color}`}>{tier.name}</p>
                                   <p className="text-[10px] text-slate-500 mt-1">
                                      {tier.minStreak >= 5 ? '5+ Wins' : 
                                       tier.minStreak >= 3 ? '3+ Wins' :
                                       tier.minStreak >= 1 ? '1-2 Wins' :
                                       tier.maxStreak < 0 ? 'Loss Streak' : 'Neutro'}
                                   </p>
                                </div>
                             </div>
                          );
                       })}
                    </div>

                    <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl flex gap-4 items-start">
                        <Flame className="text-indigo-400 flex-shrink-0" size={20} />
                        <div>
                           <h4 className="text-indigo-300 font-bold text-sm mb-1">Boost de Lenda</h4>
                           <p className="text-slate-400 text-xs leading-relaxed">
                              Ao atingir o nível <strong>Lenda Imobiliária</strong>, você desbloqueia o acesso antecipado a leads exclusivos e destaque premium no portal do cliente.
                           </p>
                        </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}

      {/* MODAL de feedback removido - será implementado com backend */}
    </div>
  );
};