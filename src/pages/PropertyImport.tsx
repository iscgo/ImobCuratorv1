import React, { useState } from 'react';
import {
  Search, User, Phone, MapPin, Home,
  ArrowRight, Sparkles, ExternalLink, ChevronLeft,
  CheckCircle, AlertCircle, Loader2,
  BedDouble, Bath, Ruler, Trees, Flame, Car,
  ChevronRight, Euro, Filter, MessageSquare, RefreshCw, PlusCircle, Mail, Lock, Crown
} from 'lucide-react';
import aiService from '../services/aiService';
import { CURRENT_USER } from '../constants';
import { Property, PropertyStatus, Client } from '../types';
import { getClients, addClient, addProperty } from '../utils/storage';

interface PropertyMatch {
  title: string;
  price: string;
  location: string;
  url: string;
  matchScore: number;
  matchReason: string;
  pros: string[];
  cons: string[];
}

// Interface para o formulário de busca
interface SearchCriteria {
  type: 'Apartamento' | 'Moradia' | 'Terreno' | 'Outro';
  budgetMax: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaMin: string;
  hasGarden: boolean;
  hasHeating: boolean;
  hasGarage: boolean;
  hasPool: boolean;
  otherRequirements: string;
}

export const PropertyImport: React.FC = () => {
  // Estado do Cliente
  const [clientDetails, setClientDetails] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PropertyMatch[]>([]);
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [excludedUrls, setExcludedUrls] = useState<string[]>([]); // Para evitar duplicados na nova pesquisa
  const [addedProperties, setAddedProperties] = useState<Set<string>>(new Set());
  
  // Paywall State
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Estado do Wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    type: 'Apartamento',
    budgetMax: '',
    location: '',
    bedrooms: 2,
    bathrooms: 1,
    areaMin: '',
    hasGarden: false,
    hasHeating: false,
    hasGarage: false,
    hasPool: false,
    otherRequirements: ''
  });

  const updateCriteria = (field: keyof SearchCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleUpgrade = () => {
      const confirm = window.confirm("Confirmar assinatura do Plano Pro (Ilimitado)?\n\nIsso liberará o acesso imediatamente.");
      if (confirm) {
          CURRENT_USER.plan = 'Pro';
          CURRENT_USER.maxSearches = Infinity;
          setShowPaywall(false);
          // Forçar re-render ou feedback visual
          alert("Plano Pro ativado! Pode continuar suas buscas.");
      }
  };

  const handleSearch = async (append: boolean = false) => {
    // PAYWALL CHECK
    if (CURRENT_USER.plan === 'Free' && CURRENT_USER.searchesUsed >= CURRENT_USER.maxSearches) {
        setShowPaywall(true);
        return;
    }

    if (!clientDetails.name) {
        alert("Por favor, insira o nome do cliente.");
        return;
    }
    
    // Increment usage
    CURRENT_USER.searchesUsed++;

    setIsSearching(true);
    setSearchStatus(append ? 'Filtrando novas oportunidades ativas...' : 'Varrendo o mercado por imóveis disponíveis...');
    
    // Se não for append (nova busca do zero), limpa resultados anteriores
    if (!append) {
        setSearchResults([]);
        setExcludedUrls([]);
        setAddedProperties(new Set());
    }

    try {
      const amenities = [];
      if (criteria.hasGarden) amenities.push("Jardim ou Terraço");
      if (criteria.hasHeating) amenities.push("Aquecimento Central ou Ar Condicionado");
      if (criteria.hasGarage) amenities.push("Garagem ou Estacionamento");
      if (criteria.hasPool) amenities.push("Piscina");

      // Call OpenAI-powered search service
      const results = await aiService.searchProperties({
        type: criteria.type,
        location: criteria.location,
        budget: criteria.budgetMax,
        bedrooms: criteria.bedrooms,
        bathrooms: criteria.bathrooms,
        area: criteria.areaMin,
        amenities,
        otherRequirements: criteria.otherRequirements
      });

      if (results && results.length > 0) {
        // Filter out excluded URLs
        const validMatches = results.filter(m => !excludedUrls.includes(m.url));

        // Update exclusion list for next search
        const newUrls = validMatches.map(m => m.url);
        setExcludedUrls(prev => [...prev, ...newUrls]);

        if (append) {
          setSearchResults(prev => [...prev, ...validMatches]);
        } else {
          setSearchResults(validMatches.sort((a, b) => b.matchScore - a.matchScore));
        }
      } else {
        setSearchStatus('Não foram encontrados imóveis ativos com estes critérios. Tente ampliar a zona ou o orçamento.');
      }

    } catch (error) {
      console.error("Erro na busca:", error);
      setSearchStatus('Erro de conexão com a IA. Verifique a chave de API e tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToPortfolio = (match: PropertyMatch) => {
    // 1. Garantir que o Cliente Existe no storage
    const clients = getClients();
    let targetClient = clients.find(c => c.name.toLowerCase() === clientDetails.name.toLowerCase());

    if (!targetClient) {
        // Criar novo cliente
        targetClient = {
            id: `c-gen-${Date.now()}`,
            name: clientDetails.name,
            phone: clientDetails.phone || 'N/A',
            email: clientDetails.email || 'cliente@exemplo.com',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientDetails.name)}&background=random&color=fff`,
            locationInterest: criteria.location || 'Vários',
            budget: criteria.budgetMax ? `€${parseInt(criteria.budgetMax).toLocaleString()}` : 'Não definido',
            status: 'Offer Made',
            lastActivity: 'Agora mesmo',
            unreadCount: 0,
            proposalSent: true,
            attentionNeeded: false
        };
        addClient(targetClient);
    } else {
        // Atualizar cliente existente
        targetClient.lastActivity = 'Agora mesmo';
        targetClient.status = 'Offer Made';
        targetClient.proposalSent = true;
        if (!targetClient.email || targetClient.email.includes('exemplo')) {
            targetClient.email = clientDetails.email || targetClient.email;
        }
        // Salvar atualização
        const { updateClient } = require('../utils/storage');
        updateClient(targetClient.id, targetClient);
    }

    // 2. Parse Price string to number
    const priceNumber = parseInt(match.price.replace(/[^0-9]/g, '')) || 0;

    // 3. Create Property Object
    const newProperty: Property = {
        id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: match.title,
        location: match.location,
        price: priceNumber,
        currency: '€',
        bedrooms: criteria.bedrooms,
        bathrooms: criteria.bathrooms,
        area: parseInt(criteria.areaMin) || 0,
        imageUrl: `https://picsum.photos/seed/${match.title.length}/800/600`,
        url: match.url,
        tags: [`Score: ${match.matchScore}`, 'Curadoria IA'],
        status: PropertyStatus.NEW,
        agentNote: `Match IA: ${match.matchReason}\n\nPrós: ${match.pros.join(', ')}\nContras: ${match.cons.join(', ')}`
    };

    // 4. Add to storage
    addProperty(newProperty);

    // 5. Update UI State
    setAddedProperties(prev => new Set(prev).add(match.url));

    console.log(`Cliente ${targetClient.name} salvo/atualizado com sucesso.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-3 mb-2">
         <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={20} />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nova Proposta</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Preencha os dados do cliente e critérios para gerar opções. 
                {CURRENT_USER.plan === 'Free' && (
                    <span className="ml-2 text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                        {CURRENT_USER.maxSearches - CURRENT_USER.searchesUsed} pesquisas restantes
                    </span>
                )}
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Client Info & Wizard */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. DADOS DO CLIENTE */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 animate-in slide-in-from-left-4 duration-500">
             <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <User size={18} className="text-indigo-500" />
                Dados do Cliente
             </h3>
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1.5">Nome do Cliente</label>
                   <input 
                      type="text" 
                      placeholder="Ex: João Silva"
                      value={clientDetails.name}
                      onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                
                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1.5">Email (Opcional)</label>
                   <div className="relative">
                      <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                      <input 
                          type="email" 
                          placeholder="cliente@email.com"
                          value={clientDetails.email}
                          onChange={(e) => setClientDetails({...clientDetails, email: e.target.value})}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1.5">WhatsApp / Telefone</label>
                   <div className="relative">
                      <Phone size={16} className="absolute left-3 top-2.5 text-gray-400" />
                      <input 
                          type="tel" 
                          placeholder="+351 912 345 678"
                          value={clientDetails.phone}
                          onChange={(e) => setClientDetails({...clientDetails, phone: e.target.value})}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* 2. WIZARD DE CRITÉRIOS */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden sticky top-6">
            
            {/* Header do Wizard */}
            <div className="bg-slate-900 text-white p-6">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="font-bold text-sm">Critérios do Imóvel</h2>
                 <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Passo {currentStep}/4</span>
               </div>
               {/* Progress Bar */}
               <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step} 
                      className={`h-1 flex-1 rounded-full transition-colors ${step <= currentStep ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    />
                  ))}
               </div>
            </div>

            {/* Steps Content */}
            <div className="p-6 space-y-6">
              
              {/* STEP 1: Tipo e Orçamento */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Home size={18} className="text-indigo-500" />
                     O que procuram?
                   </h3>
                   
                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipo de Imóvel</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Apartamento', 'Moradia', 'Terreno', 'Outro'].map(type => (
                           <button
                             key={type}
                             onClick={() => updateCriteria('type', type)}
                             className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                               criteria.type === type 
                               ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300' 
                               : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                             }`}
                           >
                             {type}
                           </button>
                        ))}
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Orçamento Máximo (€)</label>
                      <div className="relative">
                        <Euro size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input 
                           type="number"
                           value={criteria.budgetMax}
                           onChange={(e) => updateCriteria('budgetMax', e.target.value)}
                           className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                           placeholder="Ex: 500000"
                        />
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: Localização e Tamanho */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <MapPin size={18} className="text-indigo-500" />
                     Onde e qual tamanho?
                   </h3>

                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Localização Desejada</label>
                      <input 
                           type="text"
                           value={criteria.location}
                           onChange={(e) => updateCriteria('location', e.target.value)}
                           className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                           placeholder="Ex: Lisboa, Avenidas Novas"
                        />
                   </div>

                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Área Mínima (m²)</label>
                      <div className="relative">
                        <Ruler size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input 
                           type="number"
                           value={criteria.areaMin}
                           onChange={(e) => updateCriteria('areaMin', e.target.value)}
                           className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                           placeholder="Ex: 90"
                        />
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 3: Quartos e WC */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <BedDouble size={18} className="text-indigo-500" />
                     Configuração
                   </h3>

                   <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-750 rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-sm">
                            <BedDouble size={16} />
                         </div>
                         <span className="font-medium text-sm">Quartos</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => updateCriteria('bedrooms', Math.max(0, criteria.bedrooms - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 flex items-center justify-center font-bold">-</button>
                         <span className="w-4 text-center font-bold">{criteria.bedrooms}</span>
                         <button onClick={() => updateCriteria('bedrooms', criteria.bedrooms + 1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 flex items-center justify-center font-bold">+</button>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-750 rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-sm">
                            <Bath size={16} />
                         </div>
                         <span className="font-medium text-sm">Casas de Banho</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => updateCriteria('bathrooms', Math.max(0, criteria.bathrooms - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 flex items-center justify-center font-bold">-</button>
                         <span className="w-4 text-center font-bold">{criteria.bathrooms}</span>
                         <button onClick={() => updateCriteria('bathrooms', criteria.bathrooms + 1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 hover:bg-gray-100 flex items-center justify-center font-bold">+</button>
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 4: Extras e Finalizar */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Filter size={18} className="text-indigo-500" />
                     Filtros e Extras
                   </h3>

                   <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-750 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <input type="checkbox" checked={criteria.hasGarden} onChange={(e) => updateCriteria('hasGarden', e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <div className="flex items-center gap-2 text-sm"><Trees size={16} /> Jardim / Terraço</div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-750 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <input type="checkbox" checked={criteria.hasHeating} onChange={(e) => updateCriteria('hasHeating', e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <div className="flex items-center gap-2 text-sm"><Flame size={16} /> Aquecimento / AC</div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-750 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <input type="checkbox" checked={criteria.hasGarage} onChange={(e) => updateCriteria('hasGarage', e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <div className="flex items-center gap-2 text-sm"><Car size={16} /> Garagem / Estacionamento</div>
                      </label>
                       <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-750 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <input type="checkbox" checked={criteria.hasPool} onChange={(e) => updateCriteria('hasPool', e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <div className="flex items-center gap-2 text-sm text-blue-500 font-medium">Piscina</div>
                      </label>
                   </div>

                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Outro (Opcional)</label>
                      <textarea 
                         value={criteria.otherRequirements}
                         onChange={(e) => updateCriteria('otherRequirements', e.target.value)}
                         className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                         placeholder="Ex: Vista rio, renovado, prédio com elevador..."
                      />
                   </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(curr => curr - 1)}
                    className="flex-1 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button 
                    onClick={() => setCurrentStep(curr => curr + 1)}
                    className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Próximo <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSearch(false)}
                    disabled={isSearching}
                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                    Buscar Imóveis
                  </button>
                )}
              </div>
              
              {isSearching && (
                 <p className="text-center text-xs text-indigo-500 mt-2 animate-pulse font-medium">{searchStatus}</p>
              )}

            </div>
          </div>
        </div>

        {/* RESULTS COLUMN (Right) */}
        <div className="lg:col-span-8 space-y-6">
          {!isSearching && searchResults.length === 0 && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="opacity-40" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-gray-300">Assistente de Curadoria</h3>
              <p className="max-w-md mt-3 text-sm leading-relaxed">
                Preencha os dados do cliente e os critérios de busca na esquerda. 
                A IA irá varrer a web (Idealista, Imovirtual, Casa Sapo, SuperCasa, etc.) para encontrar as melhores oportunidades.
              </p>
            </div>
          )}

          {searchResults.map((property, index) => {
            const isAdded = addedProperties.has(property.url);
            
            return (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Score Circle - Fixed Layout */}
                  <div className="flex flex-col items-center justify-start flex-shrink-0 pt-1">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-slate-700" />
                        
                        {/* Progress Circle with Glow */}
                        <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                          strokeDasharray={226} 
                          strokeDashoffset={226 - (226 * property.matchScore) / 100}
                          strokeLinecap="round"
                          className={`${
                            property.matchScore >= 80 ? 'text-green-500 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 
                            property.matchScore >= 60 ? 'text-yellow-500 drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]' : 
                            'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                          } transition-all duration-1000 ease-out`} 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-xl font-bold ${
                              property.matchScore >= 80 ? 'text-green-600 dark:text-green-400' : 
                              property.matchScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                              'text-red-600 dark:text-red-400'
                          }`}>
                              {property.matchScore}%
                          </span>
                          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mt-0.5">Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{property.title}</h3>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap ml-4">{property.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        <MapPin size={14} />
                        {property.location}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-750 p-4 rounded-xl border-l-4 border-indigo-500">
                      <p className="text-sm text-slate-700 dark:text-gray-300 italic">"{property.matchReason}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1 mb-2">
                          <CheckCircle size={14} /> Pontos Fortes
                        </span>
                        <ul className="space-y-1 pl-1">
                          {property.pros.map((pro, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {property.cons.length > 0 && (
                        <div>
                          <span className="font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 mb-2">
                            <AlertCircle size={14} /> Atenção
                          </span>
                          <ul className="space-y-1 pl-1">
                            {property.cons.map((con, i) => (
                              <li key={i} className="text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2"></span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex gap-3">
                      <a 
                        href={property.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={16} />
                        Ver Anúncio
                      </a>
                      <button 
                        onClick={() => handleAddToPortfolio(property)}
                        disabled={isAdded}
                        className={`flex-1 border py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2
                          ${isAdded 
                            ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                            : 'border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                          }`}
                      >
                        {isAdded ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
                        {isAdded ? 'Adicionado' : 'Adicionar à Proposta'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Search Again / Append Button */}
          {searchResults.length > 0 && (
            <div className="flex justify-center pt-8 pb-12">
               <button 
                  onClick={() => handleSearch(true)}
                  disabled={isSearching}
                  className="bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-slate-750 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
               >
                  {isSearching ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
                  Pesquisar Mais Opções (Diferentes)
               </button>
            </div>
          )}

        </div>
      </div>

      {/* --- PAYWALL MODAL --- */}
      {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative grid grid-cols-1 md:grid-cols-2">
                  <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white md:text-gray-500 transition-colors">
                      <ChevronLeft size={24} />
                  </button>

                  {/* Left Side: Marketing */}
                  <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-lg">
                              <Crown size={32} className="text-yellow-300" />
                          </div>
                          <h2 className="text-4xl font-bold mb-4">Limite Atingido</h2>
                          <p className="text-indigo-100 text-lg leading-relaxed">
                              Você usou suas 2 pesquisas gratuitas. Para continuar descobrindo as melhores oportunidades do mercado, faça o upgrade para o Pro.
                          </p>
                      </div>
                      <div className="space-y-4 relative z-10 mt-8">
                          <div className="flex items-center gap-3">
                              <CheckCircle className="text-green-400" />
                              <span className="font-medium">Pesquisas Ilimitadas</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <CheckCircle className="text-green-400" />
                              <span className="font-medium">Acesso a leads exclusivos</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <CheckCircle className="text-green-400" />
                              <span className="font-medium">Microsite Premium</span>
                          </div>
                      </div>
                  </div>

                  {/* Right Side: Plans */}
                  <div className="p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Escolha seu Plano</h3>
                      
                      <div className="space-y-4">
                          {/* Free Plan (Disabled) */}
                          <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 opacity-60 flex justify-between items-center">
                              <div>
                                  <p className="font-bold text-slate-900 dark:text-white">Starter (Gratuito)</p>
                                  <p className="text-xs text-gray-500">2 pesquisas / mês</p>
                              </div>
                              <span className="text-sm font-medium text-gray-400">Atual</span>
                          </div>

                          {/* Pro Plan (Active) */}
                          <div className="border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-6 relative shadow-lg transform scale-105 transition-transform">
                              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                  Recomendado
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                  <p className="font-bold text-indigo-900 dark:text-indigo-300 text-lg">ImobCurator Pro</p>
                                  <p className="font-bold text-2xl text-slate-900 dark:text-white">€9.99<span className="text-sm font-normal text-gray-500">/mês</span></p>
                              </div>
                              <ul className="space-y-2 mb-6">
                                  <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Pesquisas Ilimitadas com IA</li>
                                  <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Gestão de Visitas Avançada</li>
                                  <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Suporte Prioritário</li>
                              </ul>
                              <button 
                                  onClick={handleUpgrade}
                                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                              >
                                  <Lock size={16} /> Desbloquear Agora
                              </button>
                          </div>
                      </div>
                      
                      <p className="text-center text-xs text-gray-400 mt-6">
                          Pagamento seguro. Cancele a qualquer momento.
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};