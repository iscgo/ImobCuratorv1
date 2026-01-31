import React, { useState, useEffect } from 'react';
import {
  Plus, Filter, Search, MapPin, BedDouble, Bath, Ruler,
  ExternalLink, Trash2, MoreVertical, X, Check, Home, Link as LinkIcon, Image, Sparkles, Loader2, ArrowDown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import aiService from '../services/aiService';
import { getProperties, saveProperties, deleteProperty as deletePropertyStorage } from '../utils/storage';
import { Property, PropertyStatus } from '../types';

export const Properties: React.FC = () => {
  const location = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // AI Extraction States (desabilitado por enquanto - requer API key)
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionUrl, setExtractionUrl] = useState('');

  // Load properties on mount and when location changes
  useEffect(() => {
     setProperties(getProperties());
  }, [location]);

  // Estado para o formulário de novo imóvel
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: '',
    location: '',
    price: 0,
    bedrooms: 2,
    bathrooms: 1,
    area: 0,
    status: PropertyStatus.NEW,
    url: '', // Link do anúncio
    imageUrl: '', // Link da imagem
    tags: []
  });

  // Filter Logic
  const filteredProperties = properties.filter(prop => {
    const matchesStatus = filterStatus === 'ALL' || prop.status === filterStatus;
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort Logic: LIKED first, then others
  const sortedProperties = [...filteredProperties].sort((a, b) => {
      // If A is Liked and B is not, A comes first (-1)
      if (a.status === PropertyStatus.LIKED && b.status !== PropertyStatus.LIKED) return -1;
      // If B is Liked and A is not, B comes first (1)
      if (b.status === PropertyStatus.LIKED && a.status !== PropertyStatus.LIKED) return 1;
      // Otherwise keep original order
      return 0;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem a certeza que deseja remover este imóvel do portfólio?')) {
      const updatedList = properties.filter(p => p.id !== id);
      setProperties(updatedList);
      saveProperties(updatedList);
    }
  };

  const handleSmartExtract = async () => {
    if (!extractionUrl) return;
    setIsExtracting(true);

    try {
        const data = await aiService.extractPropertyDetails(extractionUrl);

        if (data) {
            setNewProperty({
                ...newProperty,
                url: extractionUrl,
                title: data.title || "Imóvel Importado",
                location: data.location || "Lisboa",
                price: data.price || 0,
                bedrooms: data.bedrooms || 2,
                bathrooms: data.bathrooms || 1,
                area: data.area || 0,
                imageUrl: data.imageUrl || "https://picsum.photos/id/10/800/600"
            });
        }

    } catch (error) {
        console.error("Extraction error:", error);
        alert("Erro ao extrair dados. Por favor, preencha os dados manualmente.");
    } finally {
        setIsExtracting(false);
    }
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `p${Date.now()}`;
    const property: Property = {
      id,
      currency: '€',
      tags: [`T${newProperty.bedrooms}`, 'Manual'],
      ...newProperty as Property,
      // Se não houver imagem inserida, usa uma aleatória
      imageUrl: newProperty.imageUrl || 'https://picsum.photos/id/10/800/600'
    };
    
    // Add to properties and save
    const newStats = [property, ...properties];
    setProperties(newStats);
    saveProperties(newStats);

    setIsAddModalOpen(false);
    // Reset form
    setNewProperty({
        title: '',
        location: '',
        price: 0,
        bedrooms: 2,
        bathrooms: 1,
        area: 0,
        status: PropertyStatus.NEW,
        url: '',
        imageUrl: '',
        tags: []
    });
    setExtractionUrl('');
  };

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
    [PropertyStatus.VISIT_REQUESTED]: 'Visita',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Home className="text-indigo-500" />
            Gestão de Imóveis
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie todo o seu portfólio de curadoria em um só lugar.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Adicionar Manualmente
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'ALL' 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            Todos
          </button>
          {/* Fix: Iterate over enum values to match state type */}
          {(Object.values(PropertyStatus) as PropertyStatus[]).map(status => (
             <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-slate-750 dark:text-gray-400 dark:hover:bg-slate-700'
                }`}
              >
                {statusLabels[status]}
              </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por título ou zona..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Grid de Imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Empty State Add Card - PRIMARY TRIGGER */}
        <button 
           onClick={() => setIsAddModalOpen(true)}
           className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[350px] hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all group relative overflow-hidden"
        >
           <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-900/30 transition-colors z-10">
              <Plus size={32} />
           </div>
           <p className="font-medium text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 z-10">Adicionar Imóvel</p>
           {/* Visual hint for Smart Import */}
           <div className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Sparkles size={10} /> Auto
           </div>
        </button>

        {sortedProperties.map(property => (
          <div key={property.id} className={`group bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 ${property.status === PropertyStatus.LIKED ? 'border-green-400 dark:border-green-600 ring-1 ring-green-400 dark:ring-green-600' : 'border-gray-100 dark:border-slate-700'}`}>
            {/* Image & Badges */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${statusColors[property.status]}`}>
                    {statusLabels[property.status]}
                 </span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button 
                    onClick={() => handleDelete(property.id)}
                    className="p-2 bg-white/90 dark:bg-slate-900/90 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                 <p className="text-white font-bold text-lg">{property.currency}{property.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate" title={property.title}>{property.title}</h3>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                <MapPin size={14} />
                <span className="truncate">{property.location}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 dark:border-slate-700">
                <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <BedDouble size={14} /> Quartos
                   </div>
                   <span className="font-semibold text-slate-700 dark:text-gray-300">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-100 dark:border-slate-700">
                   <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Bath size={14} /> WC
                   </div>
                   <span className="font-semibold text-slate-700 dark:text-gray-300">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center border-l border-gray-100 dark:border-slate-700">
                   <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Ruler size={14} /> Área
                   </div>
                   <span className="font-semibold text-slate-700 dark:text-gray-300">{property.area} m²</span>
                </div>
              </div>

              <Link 
                to={`/properties/${property.id}`}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-xl transition-colors"
              >
                <ExternalLink size={16} />
                Ver Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Adicionar Imóvel (ENHANCED) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
             
             {/* Header Modal */}
             <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-750 sticky top-0 z-10">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Adicionar Imóvel</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                   <X size={20} />
                </button>
             </div>

             <div className="p-6 space-y-6">
                
                {/* --- SMART IMPORT SECTION --- */}
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                         <Sparkles size={16} />
                      </div>
                      <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-100">Importação Inteligente</h4>
                   </div>
                   
                   <div className="flex gap-2">
                      <input 
                         type="url" 
                         value={extractionUrl}
                         onChange={(e) => setExtractionUrl(e.target.value)}
                         placeholder="Cole o link do Idealista, Imovirtual..."
                         className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button 
                         onClick={handleSmartExtract}
                         disabled={!extractionUrl || isExtracting}
                         className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                         {isExtracting ? <Loader2 size={16} className="animate-spin" /> : <ArrowDown size={16} />}
                         {isExtracting ? 'Extraindo...' : 'Preencher'}
                      </button>
                   </div>
                   <p className="text-[10px] text-indigo-400 mt-2">
                      A IA irá ler o link e preencher os dados e a imagem real automaticamente.
                   </p>
                </div>

                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                   </div>
                   <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">Ou preencha manualmente</span>
                   </div>
                </div>

                {/* Form */}
                <form onSubmit={handleAddProperty} className="space-y-4">
                    <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Título do Anúncio</label>
                       <input 
                          required
                          type="text" 
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Ex: Apartamento T2 no Chiado"
                          value={newProperty.title}
                          onChange={e => setNewProperty({...newProperty, title: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Preço (€)</label>
                          <input 
                              required
                              type="number" 
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newProperty.price || ''}
                              onChange={e => setNewProperty({...newProperty, price: Number(e.target.value)})}
                           />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Área (m²)</label>
                          <input 
                              required
                              type="number" 
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newProperty.area || ''}
                              onChange={e => setNewProperty({...newProperty, area: Number(e.target.value)})}
                           />
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Localização</label>
                       <input 
                          required
                          type="text" 
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Ex: Lisboa, Portugal"
                          value={newProperty.location}
                          onChange={e => setNewProperty({...newProperty, location: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Quartos</label>
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-2 rounded-lg border border-gray-200 dark:border-slate-600">
                             <button type="button" onClick={() => setNewProperty(p => ({...p, bedrooms: Math.max(0, (p.bedrooms || 0) - 1)}))} className="w-8 h-8 rounded bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100">-</button>
                             <span className="flex-1 text-center font-bold">{newProperty.bedrooms}</span>
                             <button type="button" onClick={() => setNewProperty(p => ({...p, bedrooms: (p.bedrooms || 0) + 1}))} className="w-8 h-8 rounded bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100">+</button>
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Banheiros</label>
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-2 rounded-lg border border-gray-200 dark:border-slate-600">
                             <button type="button" onClick={() => setNewProperty(p => ({...p, bathrooms: Math.max(0, (p.bathrooms || 0) - 1)}))} className="w-8 h-8 rounded bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100">-</button>
                             <span className="flex-1 text-center font-bold">{newProperty.bathrooms}</span>
                             <button type="button" onClick={() => setNewProperty(p => ({...p, bathrooms: (p.bathrooms || 0) + 1}))} className="w-8 h-8 rounded bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100">+</button>
                          </div>
                       </div>
                    </div>

                    {/* Hidden/Advanced Fields (URL/Image) filled by AI but editable */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase flex items-center gap-1"><LinkIcon size={10} /> URL Original</label>
                           <input 
                              type="text" 
                              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-xs"
                              value={newProperty.url || ''}
                              onChange={e => setNewProperty({...newProperty, url: e.target.value})}
                              placeholder="Preenchido automaticamente"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase flex items-center gap-1"><Image size={10} /> URL Imagem</label>
                           <input 
                              type="text" 
                              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-xs"
                              value={newProperty.imageUrl || ''}
                              onChange={e => setNewProperty({...newProperty, imageUrl: e.target.value})}
                              placeholder="Preenchido automaticamente"
                           />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-800 pb-2">
                       <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                          Cancelar
                       </button>
                       <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                          <Check size={18} /> Salvar Imóvel
                       </button>
                    </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};