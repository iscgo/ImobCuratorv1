# Exemplo de Integração: Property Search Service

## 📝 Cenário Real: Busca de Imóveis para Cliente

Este guia mostra como integrar o `propertySearchService` em uma página real do sistema.

---

## 1. Página de Busca de Imóveis para Cliente

### Código Completo

```typescript
// src/pages/PropertySearchPage.tsx
import React, { useState } from 'react';
import { Search, Loader, AlertCircle, Home, MapPin, Euro } from 'lucide-react';
import { propertySearchService, Property } from '../services/propertySearchService';
import { Client } from '../types';

interface PropertySearchPageProps {
  client: Client; // Cliente atual
}

export const PropertySearchPage: React.FC<PropertySearchPageProps> = ({ client }) => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Preenche critérios baseado no perfil do cliente
  const [criteria, setCriteria] = useState({
    type: client.preferences?.propertyType || 'Apartamento',
    location: client.locationInterest || 'Lisboa',
    budget: client.budget?.replace(/[^0-9]/g, '') || '400000',
    bedrooms: client.preferences?.bedrooms || 3,
    bathrooms: client.preferences?.bathrooms || 2,
    amenities: client.preferences?.amenities || ['Garagem', 'Elevador']
  });

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setProperties([]);

    try {
      console.log('🔍 Iniciando busca para cliente:', client.name);

      const results = await propertySearchService.search(
        criteria,
        'REALISTIC_SIMULATION' // Ou 'AI_ENHANCED' se quiser mais contexto
      );

      setProperties(results);

      // Analytics/Tracking (opcional)
      console.log(`✅ ${results.length} imóveis encontrados para ${client.name}`);

    } catch (err) {
      console.error('❌ Erro na busca:', err);
      setError('Erro ao buscar imóveis. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Salvar imóvel favorito do cliente
  const handleSaveFavorite = async (property: Property) => {
    console.log('💾 Salvando imóvel favorito:', property.title);
    // Aqui você integraria com seu sistema de storage
    // saveClientFavorite(client.id, property);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* Cabeçalho */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={client.avatar}
            alt={client.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Busca de Imóveis: {client.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {client.locationInterest} • {client.budget}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold">Dados de Demonstração</p>
              <p>Os imóveis apresentados são simulações realistas baseadas em dados de mercado 2026.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Busca */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Critérios de Busca</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Localização</label>
            <select
              value={criteria.location}
              onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
            >
              {propertySearchService.getAvailableLocations().map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select
              value={criteria.type}
              onChange={(e) => setCriteria({ ...criteria, type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
            >
              <option value="Apartamento">Apartamento</option>
              <option value="Moradia">Moradia</option>
              <option value="Terreno">Terreno</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Orçamento</label>
            <input
              type="number"
              value={criteria.budget}
              onChange={(e) => setCriteria({ ...criteria, budget: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
              placeholder="400000"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Buscando...
            </>
          ) : (
            <>
              <Search size={20} />
              Buscar Imóveis
            </>
          )}
        </button>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Resultados */}
      {properties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {properties.length} Imóveis Encontrados
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {properties.map((property, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagem placeholder */}
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Home size={48} className="text-white/50" />
                </div>

                <div className="p-5 space-y-3">
                  {/* Título e Preço */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">
                        {property.price}
                      </div>
                      <div className="text-xs text-gray-500">{property.website}</div>
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={16} />
                    {property.location}
                  </div>

                  {/* Características */}
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>🛏️ {property.bedrooms} quartos</span>
                    <span>🚿 {property.bathrooms} WC</span>
                    <span>📐 {property.area}m²</span>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${property.matchScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {property.matchScore}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {property.matchReason}
                  </p>

                  {/* Prós e Contras */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="font-semibold text-green-700 mb-1">Prós</div>
                      <ul className="space-y-1">
                        {property.pros.slice(0, 2).map((pro, i) => (
                          <li key={i} className="text-gray-600">✓ {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-700 mb-1">Contras</div>
                      <ul className="space-y-1">
                        {property.cons.slice(0, 2).map((con, i) => (
                          <li key={i} className="text-gray-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSaveFavorite(property)}
                      className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      Salvar
                    </button>
                    <a
                      href={property.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-200 text-center transition-colors"
                    >
                      Ver Detalhes
                    </a>
                  </div>

                  {property.isSimulated && (
                    <div className="text-xs text-gray-400 italic pt-2 border-t border-gray-100 dark:border-slate-700">
                      ⚠️ Imóvel simulado para demonstração
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySearchPage;
```

---

## 2. Integração com ClientManager

### Adicionar Botão de Busca

```typescript
// Em ClientManager.tsx ou página de gestão do cliente

import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientCard = ({ client }: { client: Client }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* ... informações do cliente ... */}

      <button
        onClick={() => navigate(`/clients/${client.id}/search-properties`)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Search size={16} />
        Buscar Imóveis
      </button>
    </div>
  );
};
```

---

## 3. Hook Personalizado para Busca

### usePr opertySearch.ts

```typescript
// src/hooks/usePropertySearch.ts
import { useState, useCallback } from 'react';
import { propertySearchService, Property, PropertySearchCriteria, SearchStrategy } from '../services/propertySearchService';

export const usePropertySearch = () => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    criteria: PropertySearchCriteria,
    strategy: SearchStrategy = 'REALISTIC_SIMULATION'
  ) => {
    setLoading(true);
    setError(null);
    setProperties([]);

    try {
      const results = await propertySearchService.search(criteria, strategy);
      setProperties(results);
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar imóveis';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProperties([]);
    setError(null);
  }, []);

  return {
    properties,
    loading,
    error,
    search,
    reset
  };
};
```

### Uso do Hook

```typescript
import { usePropertySearch } from '../hooks/usePropertySearch';

const MyComponent = () => {
  const { properties, loading, error, search } = usePropertySearch();

  const handleSearch = async () => {
    await search({
      type: 'Apartamento',
      location: 'Lisboa',
      budget: '400000',
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Garagem']
    });
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && <div className="error">{error}</div>}

      {properties.map(prop => (
        <PropertyCard key={prop.url} property={prop} />
      ))}
    </div>
  );
};
```

---

## 4. Componente Reutilizável: PropertyCard

```typescript
// src/components/PropertyCard.tsx
import React from 'react';
import { MapPin, Home } from 'lucide-react';
import { Property } from '../services/propertySearchService';

interface PropertyCardProps {
  property: Property;
  onSave?: (property: Property) => void;
  onView?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSave,
  onView
}) => {
  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem */}
      <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <Home size={48} className="text-white/50" />
      </div>

      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-2">
            {property.title}
          </h3>
          <div className="text-xl font-bold text-indigo-600 whitespace-nowrap ml-2">
            {property.price}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>🛏️ {property.bedrooms}</span>
          <span>🚿 {property.bathrooms}</span>
          <span>📐 {property.area}m²</span>
        </div>

        {/* Match Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Match Score</span>
            <span className="text-sm font-semibold text-green-600">
              {property.matchScore}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${property.matchScore}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onSave && (
            <button
              onClick={() => onSave(property)}
              className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-100"
            >
              Salvar
            </button>
          )}
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 text-center"
            onClick={() => onView?.(property)}
          >
            Ver Detalhes
          </a>
        </div>

        {/* Disclaimer */}
        {property.isSimulated && (
          <div className="text-xs text-gray-400 italic pt-2 border-t">
            ⚠️ Imóvel simulado para demonstração
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 5. Contexto Global (Opcional)

### PropertySearchContext.tsx

```typescript
// src/contexts/PropertySearchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property, PropertySearchCriteria } from '../services/propertySearchService';

interface PropertySearchContextType {
  recentSearches: PropertySearchCriteria[];
  savedProperties: Property[];
  addRecentSearch: (criteria: PropertySearchCriteria) => void;
  saveProperty: (property: Property) => void;
  removeSavedProperty: (url: string) => void;
}

const PropertySearchContext = createContext<PropertySearchContextType | undefined>(undefined);

export const PropertySearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState<PropertySearchCriteria[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  const addRecentSearch = (criteria: PropertySearchCriteria) => {
    setRecentSearches(prev => [criteria, ...prev.slice(0, 9)]);
  };

  const saveProperty = (property: Property) => {
    setSavedProperties(prev => {
      if (prev.some(p => p.url === property.url)) return prev;
      return [property, ...prev];
    });
  };

  const removeSavedProperty = (url: string) => {
    setSavedProperties(prev => prev.filter(p => p.url !== url));
  };

  return (
    <PropertySearchContext.Provider
      value={{
        recentSearches,
        savedProperties,
        addRecentSearch,
        saveProperty,
        removeSavedProperty
      }}
    >
      {children}
    </PropertySearchContext.Provider>
  );
};

export const usePropertySearchContext = () => {
  const context = useContext(PropertySearchContext);
  if (!context) {
    throw new Error('usePropertySearchContext must be used within PropertySearchProvider');
  }
  return context;
};
```

---

## 6. Roteamento

### App.tsx

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PropertySearchProvider } from './contexts/PropertySearchContext';
import PropertySearchPage from './pages/PropertySearchPage';
import ClientPortal from './pages/ClientPortal';

function App() {
  return (
    <BrowserRouter>
      <PropertySearchProvider>
        <Routes>
          <Route path="/clients" element={<ClientPortal />} />
          <Route path="/clients/:id/search-properties" element={<PropertySearchPage />} />
          {/* ... outras rotas ... */}
        </Routes>
      </PropertySearchProvider>
    </BrowserRouter>
  );
}
```

---

## 7. Testes

### PropertySearchPage.test.tsx

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertySearchPage } from './PropertySearchPage';
import { propertySearchService } from '../services/propertySearchService';

jest.mock('../services/propertySearchService');

describe('PropertySearchPage', () => {
  const mockClient = {
    id: '1',
    name: 'João Silva',
    locationInterest: 'Lisboa',
    budget: '€400.000',
    avatar: '/avatar.jpg'
  };

  it('should render search form', () => {
    render(<PropertySearchPage client={mockClient} />);
    expect(screen.getByText(/Buscar Imóveis/i)).toBeInTheDocument();
  });

  it('should perform search and display results', async () => {
    const mockProperties = [
      {
        title: 'T3 em Alcântara',
        price: '€400.000',
        location: 'Lisboa, Alcântara',
        matchScore: 90
      }
    ];

    (propertySearchService.search as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertySearchPage client={mockClient} />);

    fireEvent.click(screen.getByText(/Buscar Imóveis/i));

    await waitFor(() => {
      expect(screen.getByText('T3 em Alcântara')).toBeInTheDocument();
    });
  });
});
```

---

## ✅ Checklist de Integração

- [ ] Instalar dependências
- [ ] Importar `propertySearchService`
- [ ] Criar componente de busca
- [ ] Adicionar disclaimer de simulação
- [ ] Testar com diferentes estratégias
- [ ] Implementar salvamento de favoritos
- [ ] Adicionar analytics/tracking
- [ ] Criar testes unitários
- [ ] Documentar uso interno
- [ ] Deploy

---

## 🎯 Próximos Passos

1. **Integrar com Backend** (quando APIs reais estiverem disponíveis)
2. **Cache de Resultados** para melhor performance
3. **Filtros Avançados** (preço/m², ano construção, etc)
4. **Comparação de Imóveis** lado a lado
5. **Notificações** de novos imóveis

---

**Nota**: Este é um exemplo completo de integração. Ajuste conforme sua arquitetura específica.
