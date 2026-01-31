/**
 * PROPERTY SEARCH DEMO
 *
 * Componente de demonstração das estratégias de busca de imóveis
 */

import React, { useState } from 'react';
import { propertySearchService, SearchStrategy, PropertySearchCriteria } from '../services/propertySearchService';

const PropertySearchDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [strategy, setStrategy] = useState<SearchStrategy>('REALISTIC_SIMULATION');
  const [criteria, setCriteria] = useState<PropertySearchCriteria>({
    type: 'Apartamento',
    location: 'Lisboa',
    budget: '400000',
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Garagem', 'Elevador', 'Varanda']
  });

  const handleSearch = async () => {
    setLoading(true);
    setProperties([]);

    try {
      const results = await propertySearchService.search(criteria, strategy);
      setProperties(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao buscar imóveis. Veja o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const marketInfo = propertySearchService.getMarketInfo(criteria.location);
  const availableLocations = propertySearchService.getAvailableLocations();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Disclaimer Importante</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-2">
                <strong>Os imóveis apresentados são simulações realistas para demonstração do sistema.</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Dados baseados em preços médios reais de mercado 2026</li>
                <li>Bairros e localizações são reais</li>
                <li>URLs apontam para sites reais mas IDs são gerados</li>
                <li>Para busca de imóveis reais, visite diretamente os portais imobiliários</li>
              </ul>
              <p className="mt-2 font-medium">
                Motivo: APIs públicas de imóveis em Portugal requerem aprovação prévia ou contratos comerciais.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Demo: Busca de Imóveis em Portugal</h1>

      {/* Estratégias */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Estratégia de Busca</h2>
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              value="REALISTIC_SIMULATION"
              checked={strategy === 'REALISTIC_SIMULATION'}
              onChange={(e) => setStrategy(e.target.value as SearchStrategy)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">REALISTIC_SIMULATION (Padrão)</div>
              <div className="text-sm text-gray-600">
                Dados ultra-realistas baseados em preços médios de mercado 2026 por região e bairro.
                Mais rápido e consistente.
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              value="AI_ENHANCED"
              checked={strategy === 'AI_ENHANCED'}
              onChange={(e) => setStrategy(e.target.value as SearchStrategy)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">AI_ENHANCED</div>
              <div className="text-sm text-gray-600">
                Usa GPT-4o com contexto de mercado para gerar dados mais contextualizados.
                Mais lento mas com descrições mais elaboradas.
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              value="DEMO_MODE"
              checked={strategy === 'DEMO_MODE'}
              onChange={(e) => setStrategy(e.target.value as SearchStrategy)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">DEMO_MODE</div>
              <div className="text-sm text-gray-600">
                Dados claramente marcados como [DEMO] em todos os campos.
                Uso para testes e demonstrações.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Critérios de Busca */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Critérios de Busca</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <select
              value={criteria.location}
              onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Imóvel
            </label>
            <select
              value={criteria.type}
              onChange={(e) => setCriteria({ ...criteria, type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Apartamento">Apartamento</option>
              <option value="Moradia">Moradia</option>
              <option value="Terreno">Terreno</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orçamento (€)
            </label>
            <input
              type="number"
              value={criteria.budget}
              onChange={(e) => setCriteria({ ...criteria, budget: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="400000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartos
            </label>
            <input
              type="number"
              value={criteria.bedrooms}
              onChange={(e) => setCriteria({ ...criteria, bedrooms: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Casas de Banho
            </label>
            <input
              type="number"
              value={criteria.bathrooms}
              onChange={(e) => setCriteria({ ...criteria, bathrooms: parseInt(e.target.value) })}
              className="w-full border rounded px-3 py-2"
              min="1"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Buscar Imóveis'}
        </button>
      </div>

      {/* Informações de Mercado */}
      {marketInfo.avgPrices && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Dados de Mercado: {criteria.location}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(marketInfo.avgPrices).map(([neighborhood, price]) => (
              <div key={neighborhood} className="border rounded p-3">
                <div className="font-medium">{neighborhood}</div>
                <div className="text-lg text-blue-600">
                  €{(price as number).toLocaleString('pt-PT')}/m²
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">{marketInfo.disclaimer}</p>
        </div>
      )}

      {/* Resultados */}
      {properties.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Resultados ({properties.length} imóveis)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {properties.map((prop, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{prop.title}</h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{prop.price}</div>
                    <div className="text-sm text-gray-600">{prop.website}</div>
                  </div>
                </div>

                <div className="text-gray-600 mb-2">{prop.location}</div>

                <div className="flex gap-4 text-sm mb-2">
                  <span>🛏️ {prop.bedrooms} quartos</span>
                  <span>🚿 {prop.bathrooms} WC</span>
                  <span>📐 {prop.area}m²</span>
                </div>

                <div className="mb-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Match: {prop.matchScore}%
                  </span>
                  <span className="ml-2 text-sm text-gray-600">{prop.matchReason}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>
                    <div className="font-medium text-green-700">Prós:</div>
                    <ul className="list-disc list-inside">
                      {prop.pros.map((pro: string, i: number) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-orange-700">Contras:</div>
                    <ul className="list-disc list-inside">
                      {prop.cons.map((con: string, i: number) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={prop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver no {prop.website} →
                </a>

                {prop.isSimulated && (
                  <div className="mt-2 text-xs text-gray-500 italic">
                    ⚠️ Imóvel simulado para demonstração
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-gray-600">Buscando imóveis...</div>
        </div>
      )}
    </div>
  );
};

export default PropertySearchDemo;
