import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, CheckCircle, Navigation,
  Copy, Share2, MoreHorizontal, MoreVertical, User, FileText,
  X, ChevronRight, Search, Download, Send, Printer, MessageSquare,
  Map, Car, Compass, Edit2, CalendarClock, XCircle, Trash2, Save, AlertCircle, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVisits, saveVisits, getClients } from '../utils/storage';
import { CURRENT_USER } from '../constants';
import { Visit, VisitStatus, Client } from '../types';

export const Visits: React.FC = () => {
  // --- DATA STATE ---
  const [visits, setVisits] = useState<Visit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setVisits(getVisits());
    setClients(getClients());
  }, []);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- PDF & WHATSAPP STATES ---
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [modalType, setModalType] = useState<'PDF' | 'WHATSAPP'>('PDF');
  const [pdfStep, setPdfStep] = useState<'SELECT' | 'PREVIEW'>('SELECT');
  const [selectedClientForPdf, setSelectedClientForPdf] = useState<Client | null>(null);

  // --- MAP NAVIGATION STATES ---
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedVisitForMap, setSelectedVisitForMap] = useState<Visit | null>(null);

  // --- MENU & ACTION STATES ---
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // States for Edit/Reschedule Modals
  const [actionModal, setActionModal] = useState<{ 
    isOpen: boolean; 
    type: 'EDIT' | 'RESCHEDULE' | null; 
    visitId: string | null 
  }>({ isOpen: false, type: null, visitId: null });

  // State for Cancel Confirmation Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [visitIdToCancel, setVisitIdToCancel] = useState<string | null>(null);
  
  // Temporary state for the forms inside modals
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  // 1. Agrupar visitas por Data (Usando o state 'visits' em vez do Mock direto)
  const groupedVisits = visits.reduce((acc, visit) => {
    // Se estiver cancelada, podemos optar por mostrar ou não. Aqui mostramos.
    if (!acc[visit.date]) {
      acc[visit.date] = [];
    }
    acc[visit.date].push(visit);
    return acc;
  }, {} as Record<string, Visit[]>);

  // 2. Ordenar as datas
  const sortedDates = Object.keys(groupedVisits).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Função auxiliar para ordenar visitas por hora dentro do dia
  const sortVisitsByTime = (visits: Visit[]) => {
    return visits.sort((a, b) => a.time.localeCompare(b.time));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';
    
    // Capitalize first letter
    const label = date.toLocaleDateString('pt-PT', options);
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case VisitStatus.CONFIRMED:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wide">Confirmada</span>;
      case VisitStatus.PENDING_CONFIRMATION:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 uppercase tracking-wide">Pendente</span>;
      case VisitStatus.CANCELLED:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wide">Cancelada</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400 uppercase tracking-wide">{status}</span>;
    }
  };

  // --- ACTIONS LOGIC ---
  const handleNavigationClick = (visit: Visit) => {
    setSelectedVisitForMap(visit);
    setShowMapModal(true);
  };

  const openMap = (service: 'google' | 'waze' | 'apple') => {
    if (!selectedVisitForMap) return;
    const query = encodeURIComponent(selectedVisitForMap.address);
    let url = '';

    switch(service) {
        case 'google':
            url = `https://www.google.com/maps/search/?api=1&query=${query}`;
            break;
        case 'waze':
            url = `https://waze.com/ul?q=${query}`;
            break;
        case 'apple':
            url = `http://maps.apple.com/?q=${query}`;
            break;
    }
    window.open(url, '_blank');
    setShowMapModal(false);
  };

  // --- MENU ACTIONS HANDLERS ---
  
  const handleMenuClick = (action: 'edit' | 'reschedule' | 'cancel', visitId: string) => {
      setActiveMenuId(null); // Close menu
      const visit = visits.find(v => v.id === visitId);
      if (!visit) return;

      if (action === 'cancel') {
          // Open Confirmation Modal instead of immediate action
          setVisitIdToCancel(visitId);
          setCancelModalOpen(true);
      } 
      else if (action === 'reschedule') {
          setFormData({
              date: visit.date,
              time: visit.time,
              notes: visit.notes || ''
          });
          setActionModal({ isOpen: true, type: 'RESCHEDULE', visitId });
      } 
      else if (action === 'edit') {
           setFormData({
              date: visit.date,
              time: visit.time,
              notes: visit.notes || ''
          });
          setActionModal({ isOpen: true, type: 'EDIT', visitId });
      }
  };

  const confirmCancellation = () => {
      if (visitIdToCancel) {
          const updated = visits.map(v =>
              v.id === visitIdToCancel ? { ...v, status: VisitStatus.CANCELLED } : v
          );
          setVisits(updated);
          saveVisits(updated);
          setCancelModalOpen(false);
          setVisitIdToCancel(null);
      }
  };

  const saveAction = () => {
      if (!actionModal.visitId) return;

      let updated = visits;

      if (actionModal.type === 'RESCHEDULE') {
          updated = visits.map(v =>
              v.id === actionModal.visitId
                  ? { ...v, date: formData.date, time: formData.time, status: VisitStatus.PENDING_CONFIRMATION }
                  : v
          );
      }
      else if (actionModal.type === 'EDIT') {
          updated = visits.map(v =>
              v.id === actionModal.visitId
                  ? { ...v, notes: formData.notes }
                  : v
          );
      }

      setVisits(updated);
      saveVisits(updated);
      setActionModal({ isOpen: false, type: null, visitId: null });
  };

  // --- PDF & WHATSAPP LOGIC ---
  const clientsWithVisitsIds = [...new Set(visits.map(v => v.clientId))];
  const eligiblePdfClients = clients.filter(c => clientsWithVisitsIds.includes(c.id));

  const handleOpenModal = (type: 'PDF' | 'WHATSAPP') => {
    setModalType(type);
    setPdfStep('SELECT');
    setSelectedClientForPdf(null);
    setShowPdfModal(true);
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClientForPdf(client);
    setPdfStep('PREVIEW');
  };

  const clientVisitsForPdf = selectedClientForPdf 
    ? visits.filter(v => v.clientId === selectedClientForPdf.id && v.status !== VisitStatus.CANCELLED).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const handleWhatsAppShare = (text?: string) => {
    if (!selectedClientForPdf) return;
    const message = text || `Olá ${selectedClientForPdf.name}, segue a sua agenda de visitas atualizada em PDF.`;
    window.open(`https://wa.me/${selectedClientForPdf.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const generateWhatsAppText = () => {
    if (!selectedClientForPdf) return '';
    let text = `👋 Olá *${selectedClientForPdf.name}*!\n\nAqui está a sua agenda de visitas atualizada:\n\n`;
    if (clientVisitsForPdf.length === 0) return text + "Nenhuma visita agendada no momento.";

    const visitsByDay: Record<string, Visit[]> = {};
    clientVisitsForPdf.forEach(v => {
        if(!visitsByDay[v.date]) visitsByDay[v.date] = [];
        visitsByDay[v.date].push(v);
    });

    Object.keys(visitsByDay).sort().forEach(date => {
        const dayLabel = new Date(date).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
        const capitalizedDay = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);
        text += `📅 *${capitalizedDay}*\n`;
        text += `------------------\n`;
        visitsByDay[date].sort((a,b) => a.time.localeCompare(b.time)).forEach(v => {
            text += `⏰ *${v.time}* - ${v.propertyTitle}\n`;
            text += `📍 ${v.address}\n`;
            if (v.notes) text += `📝 Obs: ${v.notes}\n`;
            text += `\n`;
        });
    });
    text += `Qualquer dúvida, estou à disposição! 🤝\n${CURRENT_USER.name} | ImobCurator`;
    return text;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32">
      
      {/* Click Outside Handler for Menu */}
      {activeMenuId && (
        <div 
            className="fixed inset-0 z-20 cursor-default" 
            onClick={() => setActiveMenuId(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-indigo-500" />
            Agenda de Visitas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {visits.filter(v => v.status !== VisitStatus.CANCELLED).length} visitas ativas agendadas.
          </p>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={() => handleOpenModal('PDF')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
             >
                <Share2 size={16} />
                Enviar Agenda (PDF)
             </button>
             <button 
                onClick={() => handleOpenModal('WHATSAPP')}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
             >
                <MessageSquare size={16} />
                Copiar p/ WhatsApp
             </button>
        </div>
      </div>

      {/* Lista Agrupada */}
      <div className="space-y-10">
        
        {sortedDates.map((date) => (
          <div key={date} className="animate-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex items-center gap-4 mb-4 sticky top-0 bg-gray-50 dark:bg-slate-900 z-10 py-2">
               <div className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm shadow-md">
                  {getDayLabel(date)}
               </div>
               <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1"></div>
            </div>

            <div className="space-y-4">
              {sortVisitsByTime(groupedVisits[date]).map((visit) => (
                <div 
                  key={visit.id} 
                  className={`flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group relative ${visit.status === VisitStatus.CANCELLED ? 'opacity-60 grayscale-[0.5]' : ''}`}
                >
                  
                  {/* Coluna da Hora (Esquerda) */}
                  <div className={`md:w-24 bg-gray-50 dark:bg-slate-750 flex flex-row md:flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700 gap-2 md:gap-0 rounded-t-xl md:rounded-l-xl md:rounded-tr-none ${visit.status === VisitStatus.CANCELLED ? 'line-through text-gray-400' : ''}`}>
                    <Clock size={18} className="text-indigo-500 mb-0 md:mb-1" />
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{visit.time}</span>
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                     
                     <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                           <img src={visit.propertyImage} className="w-16 h-16 rounded-lg object-cover bg-gray-200 hidden sm:block" alt="Imóvel" />
                           
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 {getStatusBadge(visit.status)}
                                 <span className="text-xs text-gray-400 font-mono">#{visit.id.slice(-4)}</span>
                              </div>
                              <h3 className={`font-bold text-slate-900 dark:text-white text-lg leading-tight ${visit.status === VisitStatus.CANCELLED ? 'line-through text-gray-500' : ''}`}>{visit.propertyTitle}</h3>
                              
                              <div className="flex items-center gap-2 mt-1 group/addr cursor-pointer" onClick={() => copyToClipboard(visit.address, visit.id)}>
                                 <MapPin size={14} className="text-gray-400 group-hover/addr:text-indigo-500" />
                                 <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/addr:text-indigo-500 transition-colors truncate max-w-[250px] sm:max-w-none">
                                    {visit.address}
                                 </span>
                                 {copiedId === visit.id ? (
                                    <span className="text-[10px] text-green-500 font-bold animate-in fade-in">Copiado!</span>
                                 ) : (
                                    <Copy size={12} className="opacity-0 group-hover/addr:opacity-100 text-gray-400" />
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Botão Menu (3 Pontos) */}
                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === visit.id ? null : visit.id);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${activeMenuId === visit.id ? 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <MoreVertical size={20} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === visit.id && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-30 animate-in zoom-in-95 duration-100 overflow-hidden">
                                    <div className="p-1">
                                        <button 
                                            onClick={() => handleMenuClick('edit', visit.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                                        >
                                            <Edit2 size={16} className="text-blue-500" /> Editar
                                        </button>
                                        <button 
                                            onClick={() => handleMenuClick('reschedule', visit.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                                        >
                                            <CalendarClock size={16} className="text-orange-500" /> Reagendar
                                        </button>
                                        <div className="my-1 border-t border-gray-100 dark:border-slate-700"></div>
                                        <button 
                                            onClick={() => handleMenuClick('cancel', visit.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                                        >
                                            <XCircle size={16} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700 gap-3">
                        <Link to={`/clients/${visit.clientId}`} className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 px-2 py-1 -ml-2 rounded-lg transition-colors">
                           <img src={visit.clientAvatar} className="w-6 h-6 rounded-full border border-gray-200" alt="Cliente" />
                           <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                              {visit.clientName}
                           </span>
                        </Link>

                        {visit.notes && (
                           <div className="text-xs text-gray-500 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded border border-yellow-100 dark:border-yellow-900/20 max-w-full sm:max-w-[200px] truncate">
                              📝 {visit.notes}
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Coluna de Ações (Direita/Bottom) */}
                  <div className="md:w-16 bg-gray-50 dark:bg-slate-750 flex flex-row md:flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-700 gap-2 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
                     <button 
                        title="Navegar" 
                        onClick={() => handleNavigationClick(visit)}
                        className="w-full md:w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                     >
                        <Navigation size={18} />
                     </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
        
        {sortedDates.length === 0 && (
           <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma visita agendada.</p>
           </div>
        )}
      </div>

      {/* --- MODAL CANCEL CONFIRMATION --- */}
      {cancelModalOpen && visitIdToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-4 border-4 border-red-50 dark:border-slate-700">
                    <AlertTriangle size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cancelar Visita?</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Tem a certeza que deseja cancelar esta visita? O estado será alterado para "Cancelada" mas o histórico será mantido.
                 </p>
                 <div className="flex gap-3 w-full">
                    <button 
                       onClick={() => setCancelModalOpen(false)}
                       className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                       Manter
                    </button>
                    <button 
                       onClick={confirmCancellation}
                       className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                       Sim, Cancelar
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL MAP SELECTION --- */}
      {showMapModal && selectedVisitForMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="p-4 bg-gray-50 dark:bg-slate-750 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Navigation size={18} className="text-blue-500" />
                    Navegar para...
                 </h3>
                 <button onClick={() => setShowMapModal(false)} className="text-gray-400 hover:text-slate-900 dark:hover:text-white">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-6">
                 <div className="mb-6 text-center">
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedVisitForMap.propertyTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                       <MapPin size={12} /> {selectedVisitForMap.address}
                    </p>
                 </div>

                 <div className="space-y-3">
                    <button 
                       onClick={() => openMap('google')}
                       className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all group"
                    >
                       <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-sm text-red-500 group-hover:scale-110 transition-transform">
                          <Map size={20} />
                       </div>
                       <div className="text-left">
                          <p className="font-bold text-slate-900 dark:text-white">Google Maps</p>
                          <p className="text-xs text-gray-500">Recomendado</p>
                       </div>
                       <ChevronRight className="ml-auto text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white" size={18} />
                    </button>

                    <button 
                       onClick={() => openMap('waze')}
                       className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all group"
                    >
                       <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                          <Car size={20} />
                       </div>
                       <div className="text-left">
                          <p className="font-bold text-slate-900 dark:text-white">Waze</p>
                          <p className="text-xs text-gray-500">Alertas de trânsito</p>
                       </div>
                       <ChevronRight className="ml-auto text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white" size={18} />
                    </button>

                    <button 
                       onClick={() => openMap('apple')}
                       className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all group"
                    >
                       <div className="w-10 h-10 bg-gray-100 dark:bg-slate-600 rounded-full flex items-center justify-center shadow-sm text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
                          <Compass size={20} />
                       </div>
                       <div className="text-left">
                          <p className="font-bold text-slate-900 dark:text-white">Apple Maps</p>
                          <p className="text-xs text-gray-500">iOS padrão</p>
                       </div>
                       <ChevronRight className="ml-auto text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white" size={18} />
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* --- MODAL EDIT / RESCHEDULE --- */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="p-4 bg-gray-50 dark:bg-slate-750 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {actionModal.type === 'RESCHEDULE' ? (
                        <>
                            <CalendarClock size={20} className="text-orange-500" />
                            Reagendar Visita
                        </>
                    ) : (
                        <>
                            <Edit2 size={20} className="text-blue-500" />
                            Editar Detalhes
                        </>
                    )}
                 </h3>
                 <button onClick={() => setActionModal({ ...actionModal, isOpen: false })} className="text-gray-400 hover:text-slate-900 dark:hover:text-white">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-6 space-y-4">
                 {actionModal.type === 'RESCHEDULE' && (
                     <>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl flex items-start gap-3">
                           <AlertCircle size={18} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                           <p className="text-xs text-orange-800 dark:text-orange-300">
                              Atenção: Ao reagendar, o status voltará para "Pendente" até confirmação.
                           </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nova Data</label>
                            <input 
                                type="date"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nova Hora</label>
                            <input 
                                type="time"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                            />
                        </div>
                     </>
                 )}

                 {actionModal.type === 'EDIT' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notas da Visita</label>
                        <textarea
                            className="w-full h-32 px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
                            placeholder="Adicione notas sobre o cliente ou imóvel..."
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        ></textarea>
                    </div>
                 )}

                 <div className="pt-2 flex gap-3">
                    <button 
                       onClick={() => setActionModal({ ...actionModal, isOpen: false })}
                       className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                       Cancelar
                    </button>
                    <button 
                       onClick={saveAction}
                       className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                       <Save size={18} /> Salvar
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* --- MODAL PDF / WHATSAPP --- */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${pdfStep === 'PREVIEW' ? 'max-w-2xl' : 'max-w-md'} flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}>
              
              {/* Header Modal */}
              <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-750 rounded-t-2xl">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    {pdfStep === 'SELECT' ? <User size={20} className="text-indigo-500" /> : 
                     modalType === 'PDF' ? <FileText size={20} className="text-indigo-500" /> : <MessageSquare size={20} className="text-green-500" />}
                    
                    {pdfStep === 'SELECT' ? 'Selecionar Cliente' : 
                     modalType === 'PDF' ? 'Visualizar Agenda' : 'Copiar para WhatsApp'}
                 </h3>
                 <button onClick={() => setShowPdfModal(false)} className="text-gray-400 hover:text-slate-900 dark:hover:text-white">
                    <X size={20} />
                 </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                 
                 {/* STEP 1: Select Client */}
                 {pdfStep === 'SELECT' && (
                    <div className="space-y-4">
                       <p className="text-sm text-gray-500 dark:text-gray-400">
                          Selecione um cliente para gerar a agenda. Apenas clientes com visitas agendadas aparecem aqui.
                       </p>
                       <div className="space-y-2">
                          {eligiblePdfClients.map(client => (
                             <button 
                                key={client.id}
                                onClick={() => handleSelectClient(client)}
                                className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
                             >
                                <img src={client.avatar} className="w-10 h-10 rounded-full" alt={client.name} />
                                <div className="text-left flex-1">
                                   <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{client.name}</p>
                                   <p className="text-xs text-gray-500">{client.email}</p>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-indigo-500" />
                             </button>
                          ))}
                          {eligiblePdfClients.length === 0 && (
                             <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                                Nenhum cliente com visitas encontrado.
                             </div>
                          )}
                       </div>
                    </div>
                 )}

                 {/* STEP 2: Preview (PDF or WhatsApp) */}
                 {pdfStep === 'PREVIEW' && selectedClientForPdf && (
                    <div className="space-y-6">
                       
                       {/* MODE: PDF PREVIEW */}
                       {modalType === 'PDF' && (
                         <>
                           <div className="relative bg-white text-slate-900 border border-gray-200 shadow-xl mx-auto rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                              
                              {/* Botão Flutuante WHATSAPP (Direita Superior do PDF) */}
                              <div className="absolute top-5 right-5 z-20">
                                 <button 
                                    onClick={() => handleWhatsAppShare()}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all font-bold text-sm"
                                 >
                                    <Send size={16} />
                                    Enviar PDF (WhatsApp)
                                 </button>
                              </div>

                              {/* PDF Content */}
                              <div className="p-8 space-y-6">
                                 <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                                    <div>
                                       <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">Agenda de Visitas</h2>
                                       <p className="text-sm text-slate-500 mt-1">Preparado para: <span className="font-bold text-slate-900">{selectedClientForPdf.name}</span></p>
                                    </div>
                                    <div className="text-right">
                                       <p className="font-bold text-slate-900">ImobCurator</p>
                                       <p className="text-xs text-slate-500">{CURRENT_USER.name}</p>
                                       <p className="text-xs text-slate-500">{new Date().toLocaleDateString('pt-PT')}</p>
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    {clientVisitsForPdf.length > 0 ? (
                                       clientVisitsForPdf.map((visit, index) => (
                                          <div key={index} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0">
                                             <div className="w-16 text-center pt-1">
                                                <span className="block text-xs font-bold uppercase text-slate-400">{new Date(visit.date).toLocaleDateString('pt-PT', { weekday: 'short' })}</span>
                                                <span className="block text-xl font-black text-slate-800">{new Date(visit.date).getDate()}</span>
                                                <span className="block text-xs bg-slate-100 rounded px-1 mt-1 text-slate-600">{visit.time}</span>
                                             </div>
                                             <div className="flex-1">
                                                <h4 className="font-bold text-lg text-slate-900">{visit.propertyTitle}</h4>
                                                <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                                                   <MapPin size={12} /> {visit.address}
                                                </p>
                                                {visit.notes && <p className="text-xs italic text-slate-400 mt-1">Obs: {visit.notes}</p>}
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <div className="text-center py-10 text-slate-400 italic">
                                          Nenhuma visita agendada encontrada para este cliente.
                                       </div>
                                    )}
                                 </div>
                                 <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                                    <p className="text-xs text-slate-400">Gerado via ImobCurator. Para dúvidas contacte: {CURRENT_USER.phone}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-3 justify-end">
                              <button 
                                 onClick={() => setPdfStep('SELECT')} 
                                 className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                              >
                                 Voltar
                              </button>
                              <button 
                                 onClick={() => window.print()}
                                 className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:opacity-90"
                              >
                                 <Printer size={16} /> Imprimir / Baixar
                              </button>
                           </div>
                         </>
                       )}

                       {/* MODE: WHATSAPP TEXT PREVIEW */}
                       {modalType === 'WHATSAPP' && (
                         <>
                            <div className="bg-green-50 dark:bg-slate-900 border border-green-100 dark:border-green-900/30 rounded-xl p-4">
                                <label className="block text-xs font-bold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">
                                   Pré-visualização da Mensagem
                                </label>
                                <textarea 
                                   readOnly
                                   className="w-full h-64 bg-white dark:bg-slate-800 p-4 rounded-lg text-sm text-slate-800 dark:text-gray-200 font-mono leading-relaxed outline-none border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 resize-none"
                                   value={generateWhatsAppText()}
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                              <button 
                                 onClick={() => setPdfStep('SELECT')} 
                                 className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                              >
                                 Voltar
                              </button>
                              <button 
                                 onClick={() => {
                                    navigator.clipboard.writeText(generateWhatsAppText());
                                    alert('Texto copiado para a área de transferência!');
                                 }}
                                 className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                              >
                                 <Copy size={16} /> Copiar Texto
                              </button>
                              <button 
                                 onClick={() => handleWhatsAppShare(generateWhatsAppText())}
                                 className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-colors"
                              >
                                 <Send size={16} /> Abrir WhatsApp
                              </button>
                           </div>
                         </>
                       )}

                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};