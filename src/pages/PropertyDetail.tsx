import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, BedDouble, Bath, Ruler,
  ExternalLink, Share2, Edit2, Trash2, Heart,
  Calendar, CheckCircle, XCircle, Euro, FileText, Tag, Save, ThumbsDown
} from 'lucide-react';
import { getProperties, updateProperty, saveProperties } from '../utils/storage';
import { Property, PropertyStatus } from '../types';

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [currentStatus, setCurrentStatus] = useState<PropertyStatus>(PropertyStatus.NEW);

  useEffect(() => {
    const properties = getProperties();
    const found = properties.find(p => p.id === id);
    if (found) {
      setProperty(found);
      setCurrentStatus(found.status);
      setAgentNote(found.agentNote || '');
    }
  }, [id]);

  // States for Notes Editing
  const [agentNote, setAgentNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSaveNote = () => {
      if (!property) return;
      updateProperty(property.id, { agentNote });
      setProperty({ ...property, agentNote });
      setIsEditing(false);
  };

  const updateStatus = (newStatus: PropertyStatus) => {
      if (!property) return;
      // Toggle logic
      const statusToSet = currentStatus === newStatus ? PropertyStatus.NEW : newStatus;

      setCurrentStatus(statusToSet);
      updateProperty(property.id, { status: statusToSet });
      setProperty({ ...property, status: statusToSet });
  };

  const handleRemoveClick = () => {
      setIsDeleteModalOpen(true);
  };

  const confirmRemove = () => {
      if (!property) return;
      const properties = getProperties();
      const updated = properties.filter(p => p.id !== property.id);
      saveProperties(updated);
      setIsDeleteModalOpen(false);
      navigate('/properties');
  };

  const handleViewOriginal = () => {
      // Use the stored URL if available, otherwise fallback
      const url = property?.url || "https://www.idealista.pt"; 
      window.open(url, '_blank');
  };

  if (!property) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Imóvel não encontrado</h2>
        <Link to="/properties" className="text-indigo-600 hover:underline mt-4 inline-block">
          Voltar para Imóveis
        </Link>
      </div>
    );
  }

  const statusColors = {
    [PropertyStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    [PropertyStatus.LIKED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    [PropertyStatus.DISCARDED]: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    [PropertyStatus.VISIT_REQUESTED]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const statusLabels = {
    [PropertyStatus.NEW]: 'Novo',
    [PropertyStatus.LIKED]: 'Favorito',
    [PropertyStatus.DISCARDED]: 'Não Gostei',
    [PropertyStatus.VISIT_REQUESTED]: 'Visita Solicitada',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
         <Link to="/properties" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} /> Voltar para Portfólio
         </Link>
         <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Share2 size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                <Edit2 size={20} />
            </button>
         </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-sm group">
         <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${statusColors[currentStatus]}`}>
                         {statusLabels[currentStatus]}
                      </span>
                      {property.tags.map(tag => (
                         <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md">
                            {tag}
                         </span>
                      ))}
                   </div>
                   <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 shadow-sm">{property.title}</h1>
                   <div className="flex items-center gap-2 text-gray-300">
                      <MapPin size={18} />
                      {property.location}
                   </div>
                </div>
                <div>
                   <p className="text-white text-3xl md:text-5xl font-bold tracking-tight">
                      {property.currency}{property.price.toLocaleString()}
                   </p>
                </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Main Content (Left) */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 shadow-sm">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600 dark:text-indigo-400">
                     <BedDouble size={24} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{property.bedrooms}</span>
                  <span className="text-xs text-gray-500 uppercase font-medium">Quartos</span>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 shadow-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                     <Bath size={24} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{property.bathrooms}</span>
                  <span className="text-xs text-gray-500 uppercase font-medium">Banheiros</span>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 shadow-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                     <Ruler size={24} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{property.area} <span className="text-sm font-normal">m²</span></span>
                  <span className="text-xs text-gray-500 uppercase font-medium">Área Útil</span>
               </div>
            </div>

            {/* Description / Agent Notes - EDITABLE */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <FileText className="text-indigo-500" size={24} />
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notas do Agente</h2>
                  </div>
                  {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                      >
                          <Edit2 size={14} /> Editar
                      </button>
                  )}
               </div>
               
               {isEditing ? (
                   <div className="space-y-4 animate-in fade-in duration-200">
                       <textarea 
                           className="w-full h-48 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white resize-none leading-relaxed"
                           value={agentNote}
                           onChange={(e) => setAgentNote(e.target.value)}
                           placeholder="Escreva suas observações detalhadas aqui..."
                           autoFocus
                       />
                       <div className="flex justify-end gap-2">
                           <button 
                               onClick={() => {
                                   setAgentNote(property.agentNote || '');
                                   setIsEditing(false);
                               }}
                               className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                           >
                               Cancelar
                           </button>
                           <button 
                               onClick={handleSaveNote}
                               className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                           >
                               <Save size={16} /> Salvar Nota
                           </button>
                       </div>
                   </div>
               ) : (
                   <div 
                       onClick={() => setIsEditing(true)}
                       className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-750 p-4 -ml-4 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700 group relative min-h-[100px]"
                   >
                      <p className="whitespace-pre-wrap">
                         {agentNote || <span className="text-gray-400 italic flex items-center gap-2"><Edit2 size={14} /> Clique aqui para adicionar notas sobre este imóvel...</span>}
                      </p>
                      
                      {/* Hover Hint */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-600 p-1.5 rounded-lg text-gray-400">
                          <Edit2 size={14} />
                      </div>
                   </div>
               )}

               <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                     <Calendar size={16} />
                     Adicionado em 24 Out, 2026
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                     <Tag size={16} />
                     ID: {property.id}
                  </div>
               </div>
            </div>

         </div>

         {/* Sidebar Actions (Right) */}
         <div className="space-y-6">
            
            {/* Primary Actions Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold text-slate-900 dark:text-white mb-4">Ações Rápidas</h3>
               <div className="space-y-3">
                  <button 
                    onClick={handleViewOriginal}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                     <ExternalLink size={18} />
                     Ver Anúncio Original
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                     <button 
                        onClick={() => updateStatus(PropertyStatus.LIKED)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                            currentStatus === PropertyStatus.LIKED 
                            ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300' 
                            : 'border-gray-200 dark:border-slate-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700 dark:hover:bg-green-900/20'
                        }`}
                     >
                        <Heart size={20} className={currentStatus === PropertyStatus.LIKED ? 'fill-current' : ''} />
                        <span className="text-xs font-bold">Favorito</span>
                     </button>
                     <button 
                        onClick={() => updateStatus(PropertyStatus.DISCARDED)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                            currentStatus === PropertyStatus.DISCARDED
                            ? 'bg-pink-100 border-pink-300 text-pink-700 dark:bg-pink-900/40 dark:border-pink-700 dark:text-pink-300' 
                            : 'border-gray-200 dark:border-slate-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 dark:hover:bg-pink-900/20'
                        }`}
                     >
                        <ThumbsDown size={20} />
                        <span className="text-xs font-bold">Não Gostei</span>
                     </button>
                  </div>
                  
                  <button 
                    onClick={handleRemoveClick}
                    className="w-full py-3 mt-2 border border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                  >
                     <Trash2 size={18} />
                     Remover do Portfólio
                  </button>
               </div>
            </div>

            {/* Price Analysis Widget (Placeholder) */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Euro size={100} />
               </div>
               <h3 className="font-bold text-lg mb-1 relative z-10">Análise de Preço</h3>
               <p className="text-indigo-200 text-sm mb-6 relative z-10">Baseado na zona de {property.location}</p>
               
               <div className="flex items-end gap-2 mb-2 relative z-10">
                  <span className="text-3xl font-bold">{(property.price / property.area).toFixed(0)}€</span>
                  <span className="text-sm font-medium opacity-80 mb-1">/ m²</span>
               </div>
               
               <div className="w-full bg-indigo-800/50 rounded-full h-1.5 mb-2 relative z-10">
                  <div className="bg-green-400 h-1.5 rounded-full w-[70%]"></div>
               </div>
               <p className="text-xs text-indigo-200 relative z-10">4% abaixo da média da zona.</p>
            </div>

         </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <Trash2 size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remover Imóvel?</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Esta ação não pode ser desfeita. O imóvel será removido permanentemente do seu portfólio.
                 </p>
                 <div className="flex gap-3 w-full">
                    <button 
                       onClick={() => setIsDeleteModalOpen(false)}
                       className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                       Cancelar
                    </button>
                    <button 
                       onClick={confirmRemove}
                       className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                       Remover
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};