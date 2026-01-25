import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart, TrendingUp, Users, AlertCircle, CheckCircle, 
  XCircle, Calendar, DollarSign, Trophy, ArrowRight, X,
  HelpCircle, Save, MessageSquare, Shield, Zap, Crown, Flame, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CURRENT_USER } from '../constants';
import { ReputationLevel } from '../types';

// --- MOCK DATA FOR REPORTS ---
const MONTHLY_STATS = {
  month: "Outubro 2026",
  totalClients: 12,
  salesClosed: 3,
  salesLost: 2,
  inProgress: 7,
  totalRevenue: 45000, // Comissão
  conversionRate: 60 // % das fechadas vs perdidas
};

const PENDING_FEEDBACK_ITEMS = [
  {
    id: "v-102",
    client: "Ana Silva",
    property: "Apartamento Chiado Premium",
    date: "23 Out, 2026", // Passado
    avatar: "https://picsum.photos/id/65/100/100",
    price: "€450.000"
  },
  {
    id: "v-105",
    client: "Carlos Mendes",
    property: "Terreno Sintra",
    date: "20 Out, 2026", // Passado
    avatar: "https://picsum.photos/id/55/100/100",
    price: "€120.000"
  }
];

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
  const [pendingItems, setPendingItems] = useState(PENDING_FEEDBACK_ITEMS);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stats, setStats] = useState(MONTHLY_STATS);

  // Estados de Reputação & Ranking
  const [reputationState, setReputationState] = useState({
      wins: CURRENT_USER.reputation.winStreak,
      losses: CURRENT_USER.reputation.lossStreak
  });
  const [showRankingModal, setShowRankingModal] = useState(false);

  // Estados para o Modal de Perda (Loss Feedback)
  const [lossModalOpen, setLossModalOpen] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState<typeof PENDING_FEEDBACK_ITEMS[0] | null>(null);
  const [lossReason, setLossReason] = useState("");
  const [reflectionNote, setReflectionNote] = useState("");

  const updateReputation = (isWin: boolean) => {
      setReputationState(prev => {
          if (isWin) {
              return { wins: prev.wins + 1, losses: 0 };
          } else {
              return { wins: 0, losses: prev.losses + 1 };
          }
      });
  };

  // Lógica para determinar o rank atual baseado no streak
  const getCurrentRank = () => {
      const streak = reputationState.wins > 0 ? reputationState.wins : -reputationState.losses;
      
      return RANK_TIERS.find(rank => streak >= rank.minStreak && streak <= rank.maxStreak) || RANK_TIERS[4]; // Default to Legend if exceeded
  };

  const currentRank = getCurrentRank();

  // Calcula progresso para o próximo nível
  const getNextRankProgress = () => {
      const currentStreak = reputationState.wins;
      
      if (reputationState.losses > 0) return 0; // Se está perdendo, progresso é 0 para subir

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


  const handleSaleSuccess = (id: string) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setShowCelebration(true);
    setStats(prev => ({
      ...prev,
      salesClosed: prev.salesClosed + 1,
      totalRevenue: prev.totalRevenue + 15000
    }));
    updateReputation(true);
  };

  const handleLossClick = (item: typeof PENDING_FEEDBACK_ITEMS[0]) => {
    setSelectedLostItem(item);
    setLossModalOpen(true);
    setLossReason("");
    setReflectionNote("");
  };

  const submitLossFeedback = () => {
    if (!selectedLostItem) return;
    setPendingItems(prev => prev.filter(item => item.id !== selectedLostItem.id));
    setStats(prev => ({ ...prev, salesLost: prev.salesLost + 1 }));
    updateReputation(false);
    setLossModalOpen(false);
    setSelectedLostItem(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      {showCelebration && <SuccessCelebration onClose={() => setShowCelebration(false)} />}

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
                    {reputationState.wins > 0 ? (
                        Array.from({length: Math.min(4, reputationState.wins)}).map((_, i) => (
                             <div key={i} className="w-6 h-1.5 rounded-full bg-green-50 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                        ))
                    ) : reputationState.losses > 0 ? (
                        Array.from({length: Math.min(5, reputationState.losses)}).map((_, i) => (
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
                        {reputationState.wins > 0 ? `+${reputationState.wins}` : reputationState.losses > 0 ? `-${reputationState.losses}` : '0'}
                    </span>
                 </div>
             </div>
        </div>
      </div>

      {/* FEEDBACK LOOP SECTION */}
      {pendingItems.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Confirmação de Resultados Pendente</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A data prevista destas visitas/propostas já passou. Qual foi o resultado?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingItems.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img src={item.avatar} alt={item.client} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.client}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.property} • {item.date}</p>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{item.price}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                   <button 
                      onClick={() => handleLossClick(item)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                   >
                      <XCircle size={16} /> Não Vendi
                   </button>
                   <button 
                      onClick={() => handleSaleSuccess(item.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                   >
                      <CheckCircle size={16} /> Vendi!
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                <Users size={24} />
             </div>
             <span className="text-xs font-medium text-gray-400 uppercase">Este Mês</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalClients}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Clientes ajudados</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                <Trophy size={24} />
             </div>
             <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span>
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
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                   </div>
                </div>
                <div className="relative">
                   <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-slate-700 dark:text-gray-300">Vendas Fechadas</span>
                      <span className="text-slate-900 dark:text-white">{stats.salesClosed}</span>
                   </div>
                   <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                   </div>
                </div>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Motivos de Não-Venda</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Preço Alto</span>
                   </div>
                   <span className="text-sm font-bold text-slate-900 dark:text-white">40%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Localização</span>
                   </div>
                   <span className="text-sm font-bold text-slate-900 dark:text-white">35%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Estado do Imóvel</span>
                   </div>
                   <span className="text-sm font-bold text-slate-900 dark:text-white">25%</span>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
               <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Dica da IA</h4>
               <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  "Baseado nos dados de Outubro, 40% das perdas devem-se ao Preço."
               </p>
            </div>
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
                           {reputationState.wins > 0 ? `+${reputationState.wins}` : Math.abs(reputationState.losses)}
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
                          const isLocked = !isCurrent && ((reputationState.wins < tier.minStreak && tier.minStreak > 0) || (reputationState.losses > Math.abs(tier.maxStreak) && tier.minStreak < 0));
                          
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

      {/* MODAL: Questionário de Venda Perdida */}
      {lossModalOpen && selectedLostItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
             
             <button 
                onClick={() => setLossModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
             >
                <X size={20} />
             </button>

             <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                      <HelpCircle size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aprendizagem da Perda</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                   Entender o motivo ajuda a IA a sugerir melhores imóveis no futuro.
                </p>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Qual o motivo principal?</label>
                   <div className="grid grid-cols-2 gap-2">
                      {['Preço muito alto', 'Localização Ruim', 'Estado do Imóvel', 'Cliente Desistiu', 'Comprou Outro', 'Outro'].map(reason => (
                         <button
                            key={reason}
                            onClick={() => setLossReason(reason)}
                            className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                               lossReason === reason
                               ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-300' 
                               : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-750'
                            }`}
                         >
                            {reason}
                         </button>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                      O que poderia ter feito de diferente?
                   </label>
                   <textarea
                      value={reflectionNote}
                      onChange={(e) => setReflectionNote(e.target.value)}
                      placeholder="Ex: Deveria ter negociado o preço antes da visita... ou Deveria ter qualificado melhor o cliente..."
                      className="w-full h-24 p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                   />
                </div>

                <div className="flex gap-3 pt-4">
                   <button 
                      onClick={() => setLossModalOpen(false)}
                      className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                   >
                      Cancelar
                   </button>
                   <button 
                      onClick={submitLossFeedback}
                      disabled={!lossReason}
                      className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Save size={18} /> Confirmar
                   </button>
                </div>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};