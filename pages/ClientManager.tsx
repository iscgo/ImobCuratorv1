import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, MapPin, Wallet, 
  Trash2, CheckCircle, ExternalLink, 
  MessageSquare, Share2, Eye, ThumbsUp, ThumbsDown, X,
  Sparkles, Loader2, Copy, Heart, RefreshCw, Send, AlertTriangle,
  Calendar, Clock, CalendarCheck, CalendarRange, CalendarDays, Ban,
  User, Building2, Megaphone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_CLIENTS, MOCK_PROPERTIES, MOCK_VISITS_LIST, CURRENT_USER } from '../constants';
import { Property, PropertyStatus, Visit, VisitStatus } from '../types';

// Mock Listing Agents for demo purposes (usually would come from Property data)
const MOCK_LISTING_AGENTS: Record<string, { name: string; agency: string; phone: string }> = {
  'p1': { name: 'Sofia Martins', agency: 'Remax Prestige', phone: '910000001' },
  'p2': { name: 'Pedro Alves', agency: 'KW Area', phone: '910000002' },
  'p3': { name: 'Mariana Costa', agency: 'Era Imobiliária', phone: '910000003' },
  'default': { name: 'João Vendedor', agency: 'Imobiliária Privada', phone: '910000000' }
};

export const ClientManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const client = MOCK_CLIENTS.find(c => c.id === id) || MOCK_CLIENTS[0];

  const [clientProperties, setClientProperties] = useState<Property[]>([]);
  
  // AI Message Generation State (Client Re-engagement)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Single Visit Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    propertyId: '',
    date: '',
    time: '',
    notes: ''
  });

  // --- NEW: COORDINATION / CONTACT STATES ---
  const [isCoordinationModalOpen, setIsCoordinationModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [agentMessage, setAgentMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<Record<string, boolean>>({});
  const [isGeneratingAgentMsg, setIsGeneratingAgentMsg] = useState(false);
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);

  useEffect(() => {
    setClientProperties(MOCK_PROPERTIES);
  }, [id]);

  const handleRemoveProperty = (propId: string) => {
    if (confirm("Tem certeza que deseja remover este imóvel da proposta?")) {
      setClientProperties(prev => prev.filter(p => p.id !== propId));
    }
  };

  // Cálculos de Estado
  const favoriteProperties = clientProperties.filter(p => p.status === PropertyStatus.LIKED);
  const discardedProperties = clientProperties.filter(p => p.status === PropertyStatus.DISCARDED);
  const showUpdateProposal = discardedProperties.length > 0 && favoriteProperties.length === 0;

  // Gerar Mensagem Contextual para o WhatsApp (Para o Cliente)
  const getWhatsAppMessage = () => {
    const firstName = client.name.split(' ')[0];
    const favCount = favoriteProperties.length;
    const newCount = clientProperties.filter(p => p.status === PropertyStatus.NEW).length;
    
    let msg = `Olá ${firstName}`;
    
    if (favCount > 0) {
        msg += `, vi que gostou de ${favCount} imóvel(is), incluindo "${favoriteProperties[0].title}". 🏠\n\nPodemos agendar as visitas para esta semana?`;
    } else if (showUpdateProposal) {
        msg += `, notei que as últimas opções não encaixaram bem. 😕\n\nPodemos falar 5 minutos para eu ajustar a pesquisa?`;
    } else if (newCount > 0) {
        msg += `, adicionei ${newCount} novas opções à sua proposta! 🎯\n\nQuando puder, dê uma olhada e diga-me quais prefere.`;
    } else {
        msg += `, como está? Alguma dúvida sobre os imóveis enviados anteriormente?`;
    }
    
    return encodeURIComponent(msg);
  };

  const handleUpdateProposal = async () => {
    setIsMessageModalOpen(true);
    setIsGenerating(true);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let context = `CENÁRIO CRÍTICO (RE-ENGAGEMENT): O cliente descartou ${discardedProperties.length} imóveis e NÃO GOSTOU DE NENHUM até agora.
        Objetivo: Reconhecer humildemente que as opções anteriores não serviram, pedir feedback específico e sugerir uma recalibração da busca ou apresentar algo totalmente diferente (wildcard).`;

        const prompt = `
            Aja como o Ricardo, Buyer Agent. Escreva uma mensagem de WhatsApp para ${client.name}.
            
            Contexto: ${context}
            
            Instruções:
            1. Seja empático: "Percebi que as opções anteriores não eram o que procurava".
            2. Pergunte o que faltou (Preço? Zona? Estilo?).
            3. Sugira uma breve chamada para realinhar a busca.
            4. Tom profissional mas próximo. Sem hashtags. Curto e direto.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        setGeneratedMessage(response.text || "Não foi possível gerar a mensagem.");

    } catch (error) {
        console.error(error);
        setGeneratedMessage("Erro ao conectar com a IA.");
    } finally {
        setIsGenerating(false);
    }
  };

  // --- Generate Message for Specific Listing Agent ---
  const handleGenerateAgentMessage = async (propId: string) => {
      setSelectedPropertyId(propId);
      setIsBroadcastMode(false);
      setIsGeneratingAgentMsg(true);
      setAgentMessage(''); // Clear previous

      const property = clientProperties.find(p => p.id === propId);
      if (!property) return;

      const listingAgent = MOCK_LISTING_AGENTS[propId] || MOCK_LISTING_AGENTS['default'];

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          const prompt = `
            Aja como ${CURRENT_USER.name}, um Consultor Imobiliário (Buyer Agent) da ${CURRENT_USER.agency}.
            
            Tarefa: Escrever uma mensagem de WhatsApp profissional para um colega (Listing Agent) para agendar uma visita.
            
            Dados:
            - Colega: ${listingAgent.name} (${listingAgent.agency})
            - Imóvel: ${property.title} em ${property.location}
            - Cliente Comprador: ${client.name} (Cliente qualificado, orçamento ${client.budget})
            
            Requisitos:
            1. Cumprimente o colega pelo nome.
            2. Identifique o imóvel claramente.
            3. Informe que tem um cliente qualificado interessado.
            4. Pergunte a disponibilidade para visita nesta semana (sugira "próximos dias").
            5. Seja breve, cordial e profissional (parceria 50/50 implícita).
            6. Não use hashtags.
          `;

          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
          });

          setAgentMessage(response.text || "Erro ao gerar mensagem.");

      } catch (error) {
          console.error(error);
          setAgentMessage("Olá colega, gostaria de agendar uma visita a este imóvel. Qual a disponibilidade?");
      } finally {
          setIsGeneratingAgentMsg(false);
      }
  };

  // --- NEW: Handle Broadcast to All Agents ---
  const handleBroadcastMessage = async () => {
      setSelectedPropertyId(null); // Deselect specific items
      setIsBroadcastMode(true);
      setIsGeneratingAgentMsg(true);
      setAgentMessage('');

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          const prompt = `
            Aja como ${CURRENT_USER.name}, um Consultor Imobiliário (Buyer Agent).
            
            Tarefa: Escrever uma mensagem de WhatsApp GENÉRICA (Broadcast) para enviar a vários agentes imobiliários diferentes sobre o mesmo cliente.
            
            Dados do Cliente:
            - Nome: ${client.name}
            - Orçamento: ${client.budget}
            - Zona de Interesse: ${client.locationInterest}
            
            Objetivo:
            Informar os colegas que selecionei os imóveis deles para o meu cliente e gostaria de saber a disponibilidade para visitas nos próximos dias.
            
            Requisitos:
            1. NÃO mencione um imóvel específico (pois será enviado para vários).
            2. Diga "Olá colega, selecionei um imóvel da tua carteira para o meu cliente...".
            3. Mencione que o cliente está qualificado e pronto para visitar.
            4. Pergunte disponibilidade geral para esta semana.
            5. Curto, profissional, sem hashtags.
          `;

          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
          });

          setAgentMessage(response.text || "Erro ao gerar mensagem.");
          
          // Mark ALL visible properties as contacted visually
          const newStatus = { ...contactStatus };
          clientProperties.forEach(p => {
              if (p.status !== PropertyStatus.DISCARDED) {
                  newStatus[p.id] = true;
              }
          });
          setContactStatus(newStatus);

      } catch (error) {
          console.error(error);
          setAgentMessage("Olá colega, tenho um cliente qualificado interessado num dos teus imóveis. Qual a disponibilidade para visitas?");
      } finally {
          setIsGeneratingAgentMsg(false);
      }
  };

  const handleOpenSingleSchedule = (propertyId: string) => {
      setScheduleData(prev => ({ ...prev, propertyId }));
      setIsScheduleModalOpen(true);
  };

  const handleConfirmSingleSchedule = (e: React.FormEvent) => {
      e.preventDefault();
      
      const selectedProp = clientProperties.find(p => p.id === scheduleData.propertyId);
      if (!selectedProp) return;

      const newVisit: Visit = {
          id: `v-${Date.now()}-${Math.random()}`,
          propertyId: selectedProp.id,
          propertyTitle: selectedProp.title,
          propertyImage: selectedProp.imageUrl,
          address: selectedProp.location,
          clientId: client.id,
          clientName: client.name,
          clientAvatar: client.avatar,
          date: scheduleData.date,
          time: scheduleData.time,
          status: VisitStatus.PENDING_CONFIRMATION,
          notes: scheduleData.notes
      };
      MOCK_VISITS_LIST.push(newVisit);

      alert(`Visita registada manualmente no sistema!`);
      setIsScheduleModalOpen(false);
      setScheduleData({ propertyId: '', date: '', time: '', notes: '' });
  };

  const markAsContacted = (propId: string) => {
      setContactStatus(prev => ({ ...prev, [propId]: true }));
  };

  const statusColors = {
    [PropertyStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    [PropertyStatus.LIKED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    [PropertyStatus.DISCARDED]: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    [PropertyStatus.VISIT_REQUESTED]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      
      {/* Header & Client Info */}
      <div className="space-y-6">
        <Link to="/clients" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Voltar para Clientes
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4">
               <img src={client.avatar} alt={client.name} className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 dark:border-slate-700" />
               <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{client.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                     <span className="flex items-center gap-1.5"><Mail size={14} /> {client.email}</span>
                     <span className="flex items-center gap-1.5"><Phone size={14} /> {client.phone}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-700 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
               <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Orçamento</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-gray-300">
                    <Wallet size={16} className="text-indigo-500" />
                    {client.budget}
                  </div>
               </div>
               <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Zona</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-gray-300">
                    <MapPin size={16} className="text-indigo-500" />
                    {client.locationInterest}
                  </div>
               </div>
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
               <a 
                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${showUpdateProposal ? 'bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
               >
                  <MessageSquare size={18} /> WhatsApp
               </a>
               
               {/* BOTÃO CONDICIONAL: Só aparece se o cliente não gostou de nada */}
               {showUpdateProposal && (
                   <button 
                      onClick={handleUpdateProposal}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 animate-pulse"
                   >
                      <RefreshCw size={18} /> Atualizar Proposta
                   </button>
               )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: Property List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="text-indigo-500" size={20} />
                    Imóveis na Proposta ({clientProperties.length})
                </h2>
                
                {/* BOTÃO COORDENAÇÃO (SUBSTITUI O ANTIGO AGENDAMENTO) */}
                <button
                    onClick={() => setIsCoordinationModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 animate-in fade-in"
                >
                    <CalendarCheck size={16} />
                    Coordenação de Visitas
                </button>
            </div>
            
            <div className="space-y-4">
                {clientProperties.map(property => (
                <div key={property.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 relative overflow-hidden group">
                    
                    {/* Status Feedback Indicator */}
                    {property.status === PropertyStatus.LIKED && (
                        <div className="absolute right-0 top-0 p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-bl-xl">
                            <ThumbsUp size={16} />
                        </div>
                    )}
                     {property.status === PropertyStatus.DISCARDED && (
                        <div className="absolute right-0 top-0 p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-bl-xl">
                            <ThumbsDown size={16} />
                        </div>
                    )}

                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-32 flex-shrink-0">
                        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover rounded-xl" />
                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[property.status]}`}>
                            {property.status === PropertyStatus.NEW ? 'Novo Envio' : 
                                property.status === PropertyStatus.LIKED ? 'Favorito' :
                                property.status === PropertyStatus.VISIT_REQUESTED ? 'Visita' : 'Descartado'}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex justify-between items-start pr-8">
                                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">{property.title}</h3>
                            </div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mt-1">{property.currency}{property.price.toLocaleString()}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <span className="flex items-center gap-1"><MapPin size={12}/> {property.location}</span>
                                <span>•</span>
                                <span>{property.bedrooms} Quartos</span>
                                <span>•</span>
                                <span>{property.area} m²</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                            <div className="flex items-center gap-3">
                                <a 
                                    href={property.url || "#"} 
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 transition-colors"
                                >
                                    Ver anúncio <ExternalLink size={10} />
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenSingleSchedule(property.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                                >
                                    <Clock size={14} /> Registar Hora
                                </button>
                                <button 
                                    onClick={() => handleRemoveProperty(property.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                                    title="Remover"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
         </div>

         {/* RIGHT COLUMN: Stats & Highlights */}
         <div className="space-y-6">
            
            {/* WIDGET: Top Favorites */}
            <div className={`rounded-2xl p-6 shadow-lg relative overflow-hidden ${favoriteProperties.length > 0 ? 'bg-gradient-to-b from-indigo-600 to-indigo-800 text-white' : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700'}`}>
                
                {favoriteProperties.length > 0 && (
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                )}
                
                <h3 className={`font-bold text-lg flex items-center gap-2 mb-4 relative z-10 ${favoriteProperties.length > 0 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    <Heart className={`${favoriteProperties.length > 0 ? 'fill-white text-white' : 'text-red-500'}`} size={20} />
                    Top Favoritos
                </h3>

                {favoriteProperties.length === 0 ? (
                    <div className="text-center py-6 relative z-10">
                        {discardedProperties.length > 0 ? (
                            <>
                                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-3">
                                    <AlertTriangle size={24} />
                                </div>
                                <p className="text-sm text-slate-600 dark:text-gray-300 font-medium">Nenhum favorito ainda.</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">O cliente descartou {discardedProperties.length} imóveis. Considere usar o botão "Atualizar Proposta" acima.</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">O cliente ainda não marcou imóveis como favoritos.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 relative z-10">
                        {favoriteProperties.map(fav => (
                            <div key={fav.id} className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex gap-3 items-center">
                                <img src={fav.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-indigo-900" alt="" />
                                <div className="min-w-0">
                                    <p className="font-bold text-sm truncate">{fav.title}</p>
                                    <p className="text-xs text-indigo-200">{fav.currency}{fav.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Feedback Geral</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400 block">{favoriteProperties.length}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Favoritos</span>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <span className="text-2xl font-bold text-red-500 dark:text-red-400 block">
                            {discardedProperties.length}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Descartou</span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl col-span-2 flex justify-between items-center">
                        <div>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 block">
                                {clientProperties.filter(p => p.status === PropertyStatus.NEW).length}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Novos Envios</span>
                        </div>
                        <div className="bg-white dark:bg-slate-700 p-2 rounded-full">
                            <Eye size={16} className="text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

         </div>
      </div>

      {/* Message Generator Modal (Client) */}
      {isMessageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                  <button onClick={() => setIsMessageModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <X size={20} />
                  </button>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Sparkles size={18} className="text-indigo-500" />
                      Assistente de Resgate
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      O cliente rejeitou todas as opções. Use esta mensagem para entender o motivo e reajustar a busca.
                  </p>
                  
                  {isGenerating ? (
                      <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-h-[200px]">
                          <Loader2 className="animate-spin mb-3 text-indigo-600" size={32} />
                          <p className="text-sm font-medium">Analisando rejeições...</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <textarea 
                              className="w-full h-48 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                              value={generatedMessage}
                              onChange={(e) => setGeneratedMessage(e.target.value)}
                          ></textarea>
                          <div className="flex gap-3">
                              <button 
                                  onClick={() => {
                                      navigator.clipboard.writeText(generatedMessage);
                                  }}
                                  className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                              >
                                  <Copy size={16} /> Copiar
                              </button>
                              <a 
                                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatedMessage)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                              >
                                  <Send size={16} /> Enviar no WhatsApp
                              </a>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* SINGLE SCHEDULE VISIT MODAL (Manual Entry) */}
      {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                          <Clock className="text-indigo-500" size={20} />
                          Registar Agendamento (Manual)
                      </h3>
                      <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  <form onSubmit={handleConfirmSingleSchedule} className="space-y-4">
                      <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl mb-2">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Imóvel Selecionado</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                             {clientProperties.find(p => p.id === scheduleData.propertyId)?.title}
                          </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1"><Calendar size={12}/> Data Confirmada</label>
                              <input 
                                  type="date"
                                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-sm"
                                  value={scheduleData.date}
                                  onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                                  required
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1"><Clock size={12}/> Hora</label>
                              <input 
                                  type="time"
                                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-sm"
                                  value={scheduleData.time}
                                  onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                                  required
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Notas</label>
                          <textarea 
                              className="w-full h-24 px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-sm resize-none"
                              value={scheduleData.notes}
                              onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                          />
                      </div>

                      <div className="pt-2 flex gap-3">
                          <button 
                              type="button"
                              onClick={() => setIsScheduleModalOpen(false)}
                              className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                          >
                              Cancelar
                          </button>
                          <button 
                              type="submit"
                              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                          >
                              <CheckCircle size={18} /> Salvar Visita
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- NEW: COORDINATION MODAL (CONTACT LISTING AGENTS) --- */}
      {isCoordinationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                  
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-700 pb-4 flex-shrink-0">
                      <div>
                          <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                              <User className="text-indigo-500" size={24} />
                              Coordenação de Visitas
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Contacte os colegas para agendar as visitas de <strong>{client.name}</strong>.
                          </p>
                      </div>
                      <div className="flex items-center gap-3">
                          <button 
                            onClick={handleBroadcastMessage}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-800"
                          >
                             <Megaphone size={14} /> Contactar Todos
                          </button>
                          <button onClick={() => setIsCoordinationModalOpen(false)} className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                              <X size={20} />
                          </button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden flex-1">
                      
                      {/* Left: Property List */}
                      <div className="overflow-y-auto pr-2 space-y-3">
                          {clientProperties.filter(p => p.status !== PropertyStatus.DISCARDED).map(prop => {
                              const agent = MOCK_LISTING_AGENTS[prop.id] || MOCK_LISTING_AGENTS['default'];
                              const isSelected = selectedPropertyId === prop.id;
                              const isContacted = contactStatus[prop.id];

                              return (
                                  <div 
                                    key={prop.id}
                                    onClick={() => handleGenerateAgentMessage(prop.id)}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex gap-3 relative ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white dark:bg-slate-750'}`}
                                  >
                                      {isContacted && (
                                          <div className="absolute top-2 right-2 text-green-500">
                                              <CheckCircle size={16} />
                                          </div>
                                      )}
                                      <img src={prop.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-200" alt="" />
                                      <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{prop.title}</h4>
                                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                              <Building2 size={12} />
                                              <span>{agent.agency}</span>
                                              <span>•</span>
                                              <span>{agent.name}</span>
                                          </div>
                                          <div className="mt-2 flex items-center gap-2">
                                               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${contactStatus[prop.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                   {contactStatus[prop.id] ? 'Contactado' : 'Pendente'}
                                               </span>
                                          </div>
                                      </div>
                                      <div className="flex items-center">
                                          <button className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                                              <MessageSquare size={16} />
                                          </button>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>

                      {/* Right: Action Area */}
                      <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 flex flex-col">
                          {!selectedPropertyId && !isBroadcastMode ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                                  <MessageSquare size={48} className="mb-4 opacity-20" />
                                  <p>Selecione um imóvel à esquerda para gerar a mensagem de contacto ou use o botão "Contactar Todos".</p>
                              </div>
                          ) : (
                              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                  <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                          {isBroadcastMode ? <Megaphone size={20} /> : <Sparkles size={20} />}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-slate-900 dark:text-white">
                                              {isBroadcastMode ? 'Mensagem de Broadcast (Todos)' : 'Mensagem IA'}
                                          </h4>
                                          <p className="text-xs text-gray-500">
                                              {isBroadcastMode ? 'Copie e envie para a sua lista de contactos.' : `Para: ${MOCK_LISTING_AGENTS[selectedPropertyId!]?.name}`}
                                          </p>
                                      </div>
                                  </div>

                                  {isGeneratingAgentMsg ? (
                                      <div className="flex-1 flex items-center justify-center">
                                          <Loader2 className="animate-spin text-indigo-600" size={32} />
                                      </div>
                                  ) : (
                                      <>
                                          <textarea 
                                              className="flex-1 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl p-4 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
                                              value={agentMessage}
                                              onChange={(e) => setAgentMessage(e.target.value)}
                                          />
                                          
                                          <div className="flex gap-3">
                                              <button 
                                                  onClick={() => navigator.clipboard.writeText(agentMessage)}
                                                  className="px-4 py-3 bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors"
                                              >
                                                  <Copy size={18} />
                                              </button>
                                              
                                              {!isBroadcastMode ? (
                                                  <button 
                                                      onClick={() => {
                                                          const agent = MOCK_LISTING_AGENTS[selectedPropertyId!];
                                                          markAsContacted(selectedPropertyId!);
                                                          window.open(`https://wa.me/${agent.phone}?text=${encodeURIComponent(agentMessage)}`, '_blank');
                                                      }}
                                                      className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                                                  >
                                                      <Send size={18} /> Enviar WhatsApp
                                                  </button>
                                              ) : (
                                                  <div className="flex-1 flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl font-medium text-xs px-2 text-center border border-green-200 dark:border-green-800">
                                                      <CheckCircle size={14} className="mr-1" /> Lista marcada como contactada.
                                                  </div>
                                              )}
                                          </div>
                                          {!isBroadcastMode && (
                                              <p className="text-center text-xs text-gray-400 mt-3">
                                                  Ao enviar, o imóvel será marcado como "Contactado".
                                              </p>
                                          )}
                                      </>
                                  )}
                              </div>
                          )}
                      </div>

                  </div>
              </div>
          </div>
      )}
    </div>
  );
};