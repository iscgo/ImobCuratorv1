import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Plus, Phone, Mail,
  Clock, AlertCircle, CheckCircle, MoreHorizontal,
  MapPin, Wallet, ArrowUpRight, MessageSquare, X
} from 'lucide-react';
import { getClients } from '../utils/storage';
import { Client } from '../types';
import { Link } from 'react-router-dom';

type ClientFilter = 'ALL' | 'IN_PROGRESS' | 'PROPOSAL_SENT' | 'ACCEPTED' | 'ATTENTION';

export const ClientPortal: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState<ClientFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setClients(getClients());
  }, []);

  // States for Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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

  // Lógica de filtro avançada
  const filteredClients = clients.filter(client => {
    // Texto search
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status Filter
    switch (filter) {
      case 'IN_PROGRESS':
        return client.status === 'Searching' || client.status === 'Visiting';
      case 'PROPOSAL_SENT':
        return client.proposalSent && client.status !== 'Closed';
      case 'ACCEPTED':
        return client.status === 'Offer Made' || client.status === 'Closed';
      case 'ATTENTION':
        return client.attentionNeeded;
      default:
        return true;
    }
  });

  // Estatísticas Rápidas
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'Searching' || c.status === 'Visiting').length,
    attention: clients.filter(c => c.attentionNeeded).length,
    closed: clients.filter(c => c.status === 'Closed').length
  };

  const StatusBadge = ({ status, attention }: { status: string, attention?: boolean }) => {
    if (attention) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900">
          <AlertCircle size={12} />
          Atenção Necessária
        </span>
      );
    }

    switch (status) {
      case 'Searching':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Em Busca</span>;
      case 'Visiting':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Visitas Agendadas</span>;
      case 'Offer Made':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Proposta Enviada</span>;
      case 'Closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Fechado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inativo</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="text-indigo-500" />
              Carteira de Clientes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie leads, propostas e fechamentos em um só lugar.</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Total Clientes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Em Andamento</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats.active}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Propostas Aceitas</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.closed}</p>
          </div>
          <div className={`p-4 rounded-xl border shadow-sm transition-colors ${stats.attention > 0 ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-white dark:bg-slate-800 border-gray-100'}`}>
            <p className={`text-xs uppercase font-bold ${stats.attention > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>Em Atraso / Atenção</p>
            <p className={`text-2xl font-bold mt-1 ${stats.attention > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900'}`}>{stats.attention}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-slate-750 dark:text-gray-400'}`}
          >
            Em Andamento
          </button>
          <button 
            onClick={() => setFilter('ACCEPTED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ACCEPTED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-slate-750 dark:text-gray-400'}`}
          >
            Propostas Aceitas
          </button>
          <button 
            onClick={() => setFilter('ATTENTION')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${filter === 'ATTENTION' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-slate-750 dark:text-gray-400'}`}
          >
            <AlertCircle size={14} /> Em Atraso
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
            <Users size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum cliente encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou sua busca.</p>
          </div>
        ) : (
          filteredClients.map(client => (
            <div key={client.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4 flex-1">
                <img src={client.avatar} alt={client.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-slate-600" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{client.name}</h3>
                    {client.unreadCount ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{client.unreadCount}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {client.email}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5"><Phone size={14} /> {client.phone}</span>
                  </div>
                </div>
              </div>

              {/* Preferences & Stats */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 flex-1 border-l-0 lg:border-l border-gray-100 dark:border-slate-700 lg:pl-8">
                 <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Orçamento</span>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-gray-300">
                      <Wallet size={16} className="text-indigo-500" />
                      {client.budget}
                    </div>
                 </div>
                 <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Interesse</span>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-gray-300">
                      <MapPin size={16} className="text-indigo-500" />
                      {client.locationInterest}
                    </div>
                 </div>
                 <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Última Ativ.</span>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock size={16} />
                      {client.lastActivity}
                    </div>
                 </div>
              </div>

              {/* Actions & Status */}
              <div className="flex flex-col items-end gap-3 min-w-[140px]">
                 <StatusBadge status={client.status} attention={client.attentionNeeded} />
                 
                 <div className="flex items-center gap-2 mt-2">
                    <button 
                        onClick={() => openContactModal(client)}
                        title="Contactar" 
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                       <MessageSquare size={18} />
                    </button>
                    <Link 
                      to={`/clients/${client.id}`}
                      title="Ver Perfil" 
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
                    >
                       Gerir <ArrowUpRight size={16} />
                    </Link>
                 </div>
              </div>

            </div>
          ))
        )}
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