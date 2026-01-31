import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, TrendingUp, Bell, Copy, CheckCircle, ExternalLink, MoreVertical, ArrowUpRight, MessageSquare, X, Mail, Phone } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { Link } from 'react-router-dom';
import { Client, Visit, Activity, VisitStatus } from '../types';
import { getHottestLead, trackClientView } from '../utils/tracking';
import { getClients, getVisits, getActivities } from '../utils/storage';

export const Dashboard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // States for Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Load data on mount
  useEffect(() => {
    setClients(getClients());
    setVisits(getVisits());
    setActivities(getActivities());
  }, []);

  // Calcular métricas dinâmicas
  const pendingVisitsToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return visits.filter(visit =>
      visit.date === today &&
      (visit.status === VisitStatus.PENDING_CONFIRMATION || visit.status === VisitStatus.REQUESTED)
    ).length;
  }, [visits]);

  const hottestLead = useMemo(() => getHottestLead(), []);

  const handleCopyLink = () => {
    // Add protocol to ensure it's a valid link when pasted
    navigator.clipboard.writeText(`https://${CURRENT_USER.micrositeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openContactModal = (client: Client) => {
    setSelectedClient(client);
    setContactModalOpen(true);
  };

  const handleContactAction = (type: 'whatsapp' | 'email') => {
    if (!selectedClient) return;

    if (type === 'whatsapp') {
        const phone = selectedClient.phone.replace(/[^0-9]/g, '');
        const text = encodeURIComponent(`Olá ${selectedClient.name.split(' ')[0]}, como está a busca pelo imóvel?`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } else {
        const subject = encodeURIComponent("Atualização - ImobCurator");
        const body = encodeURIComponent(`Olá ${selectedClient.name},\n\nEspero que esteja tudo bem.\n\n...`);
        window.location.href = `mailto:${selectedClient.email}?subject=${subject}&body=${body}`;
    }
    setContactModalOpen(false);
    setSelectedClient(null);
  };

  // Função de teste removida - fluxo real será: Nova Proposta → Clientes → Like/Dislike → Agendar → Visitas → Venda

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bom dia, {CURRENT_USER.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Aqui está o resumo da sua atividade hoje.</p>
        </div>

        <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800">
                <Calendar size={16} />
                <span>24 Out, 2026</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Visits Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                    {pendingVisitsToday > 0 && (
                      <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                          Urgente
                      </div>
                    )}
                    <div className="w-12 h-12 bg-orange-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-orange-500 mb-4">
                        <Bell size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {pendingVisitsToday} {pendingVisitsToday === 1 ? 'Visita' : 'Visitas'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {pendingVisitsToday > 0 ? 'Pendentes de confirmação hoje' : 'Nenhuma visita pendente hoje'}
                    </p>
                    <Link to="/visits" className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></Link>
                </div>

                {/* Hot Lead Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:border-green-200 dark:hover:border-green-800 transition-colors">
                     {hottestLead && (
                       <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                          Lead Quente
                       </div>
                     )}
                    <div className="w-12 h-12 bg-green-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-green-500 mb-4">
                        <TrendingUp size={24} />
                    </div>
                    {hottestLead ? (
                      <>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{hottestLead.clientName}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Viu a proposta <span className="font-bold text-slate-900 dark:text-white">{hottestLead.viewCount}x</span> recentemente
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">-</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum lead quente no momento</p>
                      </>
                    )}
                     <Link to="/clients" className="absolute bottom-0 left-0 w-full h-1 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></Link>
                </div>
            </div>

            {/* Active Clients Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Clientes Ativos</h3>
                    <Link to="/clients" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Ver Todos</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-750 text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nome</th>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold">Última Atividade</th>
                                <th className="px-6 py-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                                                {client.unreadCount && client.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
                                                        {client.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Orçamento: {client.budget}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${client.status === 'Visiting' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 
                                              client.status === 'Offer Made' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                              client.status === 'Searching' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                            {client.status === 'Visiting' ? 'Visitas Agendadas' :
                                             client.status === 'Offer Made' ? 'Proposta Enviada' :
                                             client.status === 'Searching' ? 'Em Busca' : client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{client.lastActivity}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openContactModal(client)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="Contactar Cliente"
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                            <Link 
                                                to={`/clients/${client.id}`}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                            >
                                                Gerir <ArrowUpRight size={14} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
            {/* Microsite Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                        </span>
                        <ExternalLink size={18} className="opacity-70 hover:opacity-100 cursor-pointer" />
                    </div>
                    
                    <p className="text-indigo-100 text-sm mb-1">Meu Microsite</p>
                    <h3 className="text-xl font-bold mb-6 break-all">{CURRENT_USER.micrositeUrl}</h3>
                    
                    <button 
                        onClick={handleCopyLink}
                        className="w-full bg-white text-indigo-600 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        {copied ? 'Copiado!' : 'Copiar Link'}
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 h-full">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Atividade Recente</h3>
                <div className="space-y-6">
                    {activities.map(activity => (
                        <div key={activity.id} className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center 
                                ${activity.type === 'inquiry' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                  activity.type === 'visit' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                {activity.type === 'inquiry' ? <Bell size={18} /> : 
                                 activity.type === 'visit' ? <Calendar size={18} /> : 
                                 <CheckCircle size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{activity.description}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setContactModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                        <img src={selectedClient.avatar} alt={selectedClient.name} className="w-full h-full rounded-full object-cover border-4 border-gray-100 dark:border-slate-700" />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedClient.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escolha como deseja contactar</p>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => handleContactAction('whatsapp')}
                        className="w-full py-3 px-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors border border-green-200 dark:border-green-800"
                    >
                        <MessageSquare size={20} />
                        WhatsApp
                    </button>
                    <button 
                        onClick={() => handleContactAction('email')}
                        className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors border border-blue-200 dark:border-blue-800"
                    >
                        <Mail size={20} />
                        Email
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};