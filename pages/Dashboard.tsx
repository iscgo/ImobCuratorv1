import React from 'react';
import { THEME } from '../constants';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, Users, Calendar, Award, Zap, Building2, PieChart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  user: UserProfile;
  onNavigate?: (page: string) => void; // Added onNavigate prop
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const { t } = useLanguage();

  const handleNav = (page: string) => {
    if (onNavigate) onNavigate(page);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
       <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: THEME.fonts.display }}>
                {t('welcome')}, {user.name.split(' ')[0]}
            </h1>
            <p className="text-gray-400">Estado do Sistema: <span className="text-green-500 font-mono">OPERACIONAL</span></p>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-full">
            <Award className="text-purple-400" size={16} />
            <span className="text-sm text-purple-200 font-medium">Reputação: {user.reputation}</span>
         </div>
       </div>

       {/* Quick Tools Grid (Command Center) - NEW SECTION */}
       <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Central de Comando</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNav('import')}
                className="group relative h-40 bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-2xl p-6 text-left overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-purple-400 -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white mb-2 shadow-lg shadow-purple-500/30">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">Nova Proposta IA</h4>
                        <p className="text-xs text-purple-300">Buscar imóveis e gerar match</p>
                    </div>
                </div>
            </motion.button>

            <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNav('visits')}
                className="group relative h-40 bg-[#0A0A0C] border border-white/10 hover:border-orange-500/30 rounded-2xl p-6 text-left overflow-hidden"
            >
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 mb-2">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">Agenda de Visitas</h4>
                        <p className="text-xs text-gray-400">Ver próximos agendamentos</p>
                    </div>
                </div>
            </motion.button>

            <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNav('properties')}
                className="group relative h-40 bg-[#0A0A0C] border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 text-left overflow-hidden"
            >
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">Gestão de Carteira</h4>
                        <p className="text-xs text-gray-400">12 Imóveis ativos</p>
                    </div>
                </div>
            </motion.button>
       </div>

       {/* KPI Grid */}
       <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Métricas de Performance</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard icon={Users} label="Clientes Ativos" value="12" trend="+2 essa semana" color="purple" />
          <KPICard icon={TrendingUp} label="Vendas (Mês)" value="€ 24.5k" trend="+15% vs mês anterior" color="green" />
          <KPICard icon={Calendar} label="Visitas Hoje" value="2" trend="Próxima às 14h" color="orange" />
          <KPICard icon={PieChart} label="Conversão" value="18%" trend="+2% média" color="blue" />
       </div>

       {/* Recent Activity Area */}
       <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0A0A0C] border border-white/10 rounded-2xl p-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: THEME.fonts.display }}>Funil de Vendas</h3>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 px-2 py-1 outline-none">
                    <option>Este Mês</option>
                    <option>Últimos 3 Meses</option>
                </select>
             </div>
             
             {/* Visual Funnel Representation */}
             <div className="space-y-4">
                <FunnelBar label="Leads" count={45} color="bg-gray-700" width="100%" />
                <FunnelBar label="Qualificados" count={28} color="bg-purple-900" width="75%" />
                <FunnelBar label="Em Visita" count={12} color="bg-purple-600" width="45%" />
                <FunnelBar label="Propostas" count={5} color="bg-purple-400" width="25%" />
                <FunnelBar label="Fechados" count={2} color="bg-green-500" width="10%" />
             </div>
          </div>

          <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6">
             <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: THEME.fonts.display }}>Feed ao Vivo</h3>
             <ul className="space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/10" />

                <li className="flex gap-4 relative">
                   <div className="w-5 h-5 rounded-full bg-green-500 border-4 border-[#0A0A0C] flex-shrink-0 z-10" />
                   <div>
                       <p className="text-sm text-gray-300"><span className="font-bold text-white">João Silva</span> gostou do imóvel #299</p>
                       <span className="text-xs text-gray-600">Há 10 min</span>
                   </div>
                </li>
                <li className="flex gap-4 relative">
                   <div className="w-5 h-5 rounded-full bg-blue-500 border-4 border-[#0A0A0C] flex-shrink-0 z-10" />
                   <div>
                       <p className="text-sm text-gray-300">Nova proposta enviada para <span className="font-bold text-white">Ana</span></p>
                       <span className="text-xs text-gray-600">Há 2 horas</span>
                   </div>
                </li>
                <li className="flex gap-4 relative">
                   <div className="w-5 h-5 rounded-full bg-purple-500 border-4 border-[#0A0A0C] flex-shrink-0 z-10" />
                   <div>
                       <p className="text-sm text-gray-300">Visita concluída: <span className="font-bold text-white">R. Augusta</span></p>
                       <span className="text-xs text-gray-600">Ontem</span>
                   </div>
                </li>
             </ul>
          </div>
       </div>
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, trend, color }: any) => {
    const colors: any = {
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: THEME.fonts.display }}>{value}</h3>
            <p className={`text-xs ${color === 'green' || color === 'yellow' ? 'text-green-500' : 'text-gray-400'}`}>{trend}</p>
        </div>
    )
}

const FunnelBar = ({ label, count, color, width }: any) => (
    <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 w-20">{label}</span>
        <div className="flex-1 bg-white/5 h-8 rounded-lg overflow-hidden relative">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: width }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${color} opacity-80`} 
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white shadow-black drop-shadow-md">{count}</span>
        </div>
    </div>
);