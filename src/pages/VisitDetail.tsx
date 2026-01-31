import React from 'react';
import { MOCK_VISIT } from '../constants';
import { VisitStatus } from '../types';
import { CheckCircle, Clock, MapPin, DollarSign, User, CalendarCheck, MessageSquare, Mail, Phone, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VisitDetail: React.FC = () => {
  const visit = MOCK_VISIT;

  const getStatusColor = (status: VisitStatus) => {
    switch (status) {
        case VisitStatus.REQUESTED: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
        case VisitStatus.PENDING_CONFIRMATION: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
        case VisitStatus.CONFIRMED: return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
        case VisitStatus.COMPLETED: return 'text-green-600 bg-green-100 dark:bg-green-900/30';
        default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusLabel = (status: VisitStatus) => {
      switch (status) {
          case VisitStatus.REQUESTED: return 'Solicitada';
          case VisitStatus.PENDING_CONFIRMATION: return 'Pendente';
          case VisitStatus.CONFIRMED: return 'Confirmada';
          case VisitStatus.COMPLETED: return 'Concluída';
          default: return status;
      }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/visits" className="hover:text-indigo-600">Visitas</Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 dark:text-white">Ativa</span>
        <ChevronRight size={14} />
        <span>#{visit.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Visita #{visit.id}</h1>
            <p className="text-gray-500 dark:text-gray-400">Gerir detalhes e estado da visita</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusColor(visit.status)}`}>
            <Clock size={18} />
            {getStatusLabel(visit.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Col */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Property Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-6">
                <img src="https://picsum.photos/id/15/200/200" alt="Property" className="w-full md:w-48 h-48 object-cover rounded-xl" />
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{visit.propertyTitle}</h2>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                                <MapPin size={16} />
                                {visit.address}
                            </div>
                        </div>
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{visit.price}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-slate-750 p-3 rounded-lg">
                            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase mb-1">Referência</span>
                            <span className="font-mono text-slate-900 dark:text-white">{visit.ref}</span>
                        </div>
                         <div className="bg-gray-50 dark:bg-slate-750 p-3 rounded-lg">
                            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase mb-1">Agente Listing</span>
                            <span className="text-slate-900 dark:text-white">{visit.listingAgent}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors dark:text-white">
                            Ver Anúncio
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors dark:text-white">
                            <User size={16} />
                            Perfil Cliente
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-8">Progresso</h3>
                <div className="relative flex items-center justify-between">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: '35%' }}></div>

                    {/* Steps */}
                    {visit.timeline.map((step, index) => (
                        <div key={index} className="flex flex-col items-center gap-3 bg-white dark:bg-slate-800 px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300
                                ${step.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 
                                  step.status === visit.status ? 'bg-white dark:bg-slate-800 border-indigo-600 text-indigo-600 animate-pulse' : 
                                  'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-300'}`}>
                                {step.completed ? <CheckCircle size={18} /> : 
                                 step.status === VisitStatus.PENDING_CONFIRMATION ? <Clock size={18} /> :
                                 step.status === VisitStatus.CONFIRMED ? <CalendarCheck size={18} /> :
                                 <div className="w-2 h-2 bg-current rounded-full"></div>}
                            </div>
                            <span className={`text-xs font-medium text-center max-w-[80px] ${step.status === visit.status ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                                {getStatusLabel(step.status)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity History */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Histórico</h3>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Ver Tudo</button>
                </div>
                
                <div className="space-y-8 pl-4 border-l-2 border-gray-100 dark:border-slate-700 ml-3">
                    {/* Item 1 - Current Action */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30 flex items-center justify-center border-4 border-white dark:border-slate-800">
                            <Clock size={14} />
                        </div>
                        <div className="flex justify-between mb-1">
                             <h4 className="font-semibold text-slate-900 dark:text-white">Aguardando resposta (Alerta Ativo)</h4>
                             <span className="text-xs text-gray-400">Agora</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">24h desde o último contacto. Lembrete automático agendado.</p>
                        <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded font-medium border border-red-100 dark:border-red-900/30">
                            <Clock size={12} /> 24H SEM RESPOSTA
                        </span>
                    </div>

                    {/* Item 2 */}
                    <div className="relative pl-6 opacity-70">
                        <div className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 flex items-center justify-center border-4 border-white dark:border-slate-800">
                            <Mail size={14} />
                        </div>
                        <div className="flex justify-between mb-1">
                             <h4 className="font-semibold text-slate-900 dark:text-white">Contactado agente vendedor</h4>
                             <span className="text-xs text-gray-400">10:15</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enviado pedido de visita inicial via sistema.</p>
                    </div>

                    {/* Item 3 */}
                    <div className="relative pl-6 opacity-50">
                        <div className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400 flex items-center justify-center border-4 border-white dark:border-slate-800">
                            <CheckCircle size={14} />
                        </div>
                        <div className="flex justify-between mb-1">
                             <h4 className="font-semibold text-slate-900 dark:text-white">Pedido recebido</h4>
                             <span className="text-xs text-gray-400">10:00</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ticket de visita gerado automaticamente pelo sistema.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar - Right Col */}
        <div className="space-y-6">
            {/* Quick Actions */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Ações Rápidas</h3>
                 <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20">
                        <CheckCircle size={18} />
                        Confirmar Data
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-750 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-gray-300 font-medium transition-colors border border-transparent dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <Mail size={18} />
                            Enviar Email Follow-up
                        </div>
                        <ArrowRight size={16} />
                    </button>
                     <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-750 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-gray-300 font-medium transition-colors border border-transparent dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} />
                            Gerar WhatsApp
                        </div>
                        <ArrowRight size={16} />
                    </button>
                    <button className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-medium transition-colors border border-red-200 dark:border-red-900/30 mt-4">
                        Cancelar Pedido
                    </button>
                 </div>
             </div>

             {/* Agent Notes */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Notas Privadas</h3>
                    <span className="text-[10px] font-bold bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded uppercase">Privado</span>
                 </div>
                 <textarea 
                    className="w-full h-32 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                    placeholder="Digite notas internas aqui... ex: 'Agente mencionou que as chaves estão na portaria'"
                 ></textarea>
                 <p className="text-xs text-gray-400 mt-2 text-right">Editado agora mesmo</p>
             </div>

             {/* Contact Card */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Agent" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">Sarah Jenkins</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Agente Listing • Century Props</p>
                    </div>
                </div>
                <button className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                    <Phone size={18} />
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};