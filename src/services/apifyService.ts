/**
 * APIFY SERVICE - Real Property Search Integration
 *
 * Integra com Apify Idealista Scraper para buscar imóveis REAIS do Idealista.pt
 *
 * Apify Actors Disponíveis:
 * - dz_omar/idealista-scraper-api: Scraper oficial do Idealista.pt
 * - Website Content Crawler: Crawler genérico
 * - Web Scraper: Scraper configurável
 *
 * Documentação: https://apify.com/dz_omar/idealista-scraper-api
 */

// Get API token from environment
const APIFY_API_TOKEN = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.APIFY_API_TOKEN
  : process.env.APIFY_API_TOKEN;

const APIFY_BASE_URL = 'https://api.apify.com/v2';
const IDEALISTA_SCRAPER_ID = 'dz_omar/idealista-scraper-api';

export interface ApifyPropertySearchParams {
  location: string;
  propertyType?: 'homes' | 'offices' | 'premises' | 'garages' | 'land';
  operation?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  minSize?: number;
  maxSize?: number;
  maxResults?: number;
}

export interface ApifyProperty {
  title: string;
  price: string;
  location: string;
  url: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  description?: string;
  features?: string[];
  images?: string[];
  agent?: string;
  source: string;
}

/**
 * Converte critérios do ImobCurator para formato Apify Idealista
 */
function convertCriteriaToApify(criteria: any): ApifyPropertySearchParams {
  const budget = parseInt(criteria.budget || '300000');

  // Mapeia tipo de imóvel para formato Idealista
  const propertyTypeMap: Record<string, 'homes' | 'offices' | 'premises' | 'garages' | 'land'> = {
    'Apartamento': 'homes',
    'Moradia': 'homes',
    'Terreno': 'land',
    'Escritório': 'offices',
    'Loja': 'premises',
    'Garagem': 'garages'
  };

  return {
    location: criteria.location.toLowerCase(),
    propertyType: propertyTypeMap[criteria.type] || 'homes',
    operation: 'sale',
    minPrice: Math.round(budget * 0.7),
    maxPrice: Math.round(budget * 1.3),
    minRooms: criteria.bedrooms || 1,
    maxRooms: criteria.bedrooms ? criteria.bedrooms + 2 : undefined,
    minSize: criteria.area ? parseInt(criteria.area) - 20 : undefined,
    maxSize: criteria.area ? parseInt(criteria.area) + 50 : undefined,
    maxResults: 15
  };
}

/**
 * Normaliza dados do Apify para formato do ImobCurator
 */
function normalizeApifyProperty(apifyProp: any, criteria: any): any {
  const budget = parseInt(criteria.budget || '300000');
  const price = apifyProp.price || apifyProp.priceInfo?.price || 0;

  // Calcula match score baseado no preço
  const priceDiff = Math.abs(price - budget) / budget;
  const matchScore = Math.max(65, Math.min(95, 95 - priceDiff * 30));

  // Extrai features/amenities
  const features = apifyProp.features || apifyProp.characteristics || [];
  const pros = features.slice(0, 3).map((f: any) => typeof f === 'string' ? f : f.name || f.label);

  // Gera contras baseado em ausências comuns
  const cons: string[] = [];
  if (!features.some((f: any) => String(f).toLowerCase().includes('garage'))) {
    cons.push('Sem garagem mencionada');
  }
  if (!features.some((f: any) => String(f).toLowerCase().includes('eleva'))) {
    cons.push('Verificar disponibilidade de elevador');
  }
  if (cons.length === 0) cons.push('Verificar detalhes no anúncio');

  return {
    title: apifyProp.title || apifyProp.propertyTitle || 'Imóvel',
    price: typeof price === 'number' ? `€${price.toLocaleString('pt-PT')}` : price,
    location: apifyProp.location || apifyProp.address || criteria.location,
    url: apifyProp.url || apifyProp.link || '',
    bedrooms: apifyProp.rooms || apifyProp.bedrooms || criteria.bedrooms,
    bathrooms: apifyProp.bathrooms || apifyProp.baths || criteria.bathrooms,
    area: apifyProp.size || apifyProp.area || apifyProp.surface || 0,
    matchScore: Math.round(matchScore),
    matchReason: generateMatchReason(price, budget, apifyProp.location),
    pros: pros.length > 0 ? pros : ['Imóvel real do Idealista.pt'],
    cons,
    website: 'idealista.pt',
    description: apifyProp.description || '',
    images: apifyProp.images || apifyProp.photos || [],
    isSimulated: false // ✅ Dados REAIS!
  };
}

/**
 * Gera razão de match
 */
function generateMatchReason(price: number, budget: number, location: string): string {
  const priceDiff = Math.abs(price - budget) / budget;

  if (priceDiff < 0.05) return 'Preço ideal, excelente oportunidade';
  if (priceDiff < 0.15) return 'Muito bom custo-benefício';
  if (priceDiff < 0.25) return `Bom match em ${location}`;
  if (price < budget) return 'Preço abaixo do orçamento';
  return 'Alternativa interessante';
}

/**
 * Serviço principal do Apify
 */
export const apifyService = {
  /**
   * Verifica se o token Apify está configurado
   */
  isConfigured(): boolean {
    return !!APIFY_API_TOKEN;
  },

  /**
   * Busca imóveis REAIS usando Apify Idealista Scraper
   */
  async searchProperties(criteria: any): Promise<any[]> {
    if (!APIFY_API_TOKEN) {
      throw new Error('APIFY_API_TOKEN não configurado em .env');
    }

    console.log('🔍 APIFY: Iniciando busca REAL no Idealista.pt');
    console.log('📍 Critérios:', criteria);

    const apifyParams = convertCriteriaToApify(criteria);
    console.log('🎯 Parâmetros Apify:', apifyParams);

    try {
      // Inicia o Actor Apify
      const runUrl = `${APIFY_BASE_URL}/acts/${IDEALISTA_SCRAPER_ID}/runs?token=${APIFY_API_TOKEN}`;

      console.log('🚀 Iniciando Apify Actor...');

      const runResponse = await fetch(runUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startUrls: [{
            url: this.buildIdealistaUrl(apifyParams)
          }],
          maxItems: apifyParams.maxResults || 15,
          proxyConfiguration: {
            useApifyProxy: true
          }
        })
      });

      if (!runResponse.ok) {
        throw new Error(`Apify API Error: ${runResponse.status} ${runResponse.statusText}`);
      }

      const runData = await runResponse.json();
      const runId = runData.data.id;

      console.log(`⏳ Actor iniciado (Run ID: ${runId}). Aguardando resultados...`);

      // Aguarda conclusão do run (polling)
      const results = await this.waitForResults(runId);

      console.log(`✅ Apify retornou ${results.length} imóveis reais`);

      // Normaliza resultados para formato do ImobCurator
      const normalizedProperties = results
        .map(prop => normalizeApifyProperty(prop, criteria))
        .filter(prop => prop.url); // Remove sem URL

      // Ordena por match score
      normalizedProperties.sort((a, b) => b.matchScore - a.matchScore);

      console.log(`📊 ${normalizedProperties.length} imóveis processados e normalizados`);

      return normalizedProperties;
    } catch (error) {
      console.error('❌ Erro ao buscar imóveis no Apify:', error);
      throw error;
    }
  },

  /**
   * Constrói URL do Idealista baseado nos parâmetros
   */
  buildIdealistaUrl(params: ApifyPropertySearchParams): string {
    const baseUrl = 'https://www.idealista.pt';
    const operation = params.operation === 'rent' ? 'arrendar' : 'comprar';
    const propertyType = params.propertyType || 'homes';

    // Normaliza localização para formato URL
    const location = params.location
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-');

    let url = `${baseUrl}/${operation}-${propertyType}/${location}/`;

    // Adiciona parâmetros de filtro
    const queryParams: string[] = [];

    if (params.minPrice) queryParams.push(`precioDesde=${params.minPrice}`);
    if (params.maxPrice) queryParams.push(`precioHasta=${params.maxPrice}`);
    if (params.minRooms) queryParams.push(`habitacionesDesde=${params.minRooms}`);
    if (params.maxRooms) queryParams.push(`habitacionesHasta=${params.maxRooms}`);
    if (params.minSize) queryParams.push(`superficieDesde=${params.minSize}`);
    if (params.maxSize) queryParams.push(`superficieHasta=${params.maxSize}`);

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    console.log('🔗 URL Idealista gerada:', url);
    return url;
  },

  /**
   * Aguarda conclusão do run Apify e retorna resultados
   */
  async waitForResults(runId: string, maxAttempts = 30): Promise<any[]> {
    const pollInterval = 2000; // 2 segundos

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusUrl = `${APIFY_BASE_URL}/actor-runs/${runId}?token=${APIFY_API_TOKEN}`;
      const statusResponse = await fetch(statusUrl);

      if (!statusResponse.ok) {
        throw new Error(`Failed to check run status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();
      const status = statusData.data.status;

      console.log(`⏳ Status do run: ${status} (tentativa ${attempt + 1}/${maxAttempts})`);

      if (status === 'SUCCEEDED') {
        // Busca resultados do dataset
        const datasetId = statusData.data.defaultDatasetId;
        const itemsUrl = `${APIFY_BASE_URL}/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`;

        const itemsResponse = await fetch(itemsUrl);
        if (!itemsResponse.ok) {
          throw new Error(`Failed to fetch results: ${itemsResponse.statusText}`);
        }

        const items = await itemsResponse.json();
        return items;
      }

      if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        throw new Error(`Actor run ${status.toLowerCase()}`);
      }
    }

    throw new Error('Timeout waiting for Apify results');
  },

  /**
   * Testa conexão com Apify
   */
  async testConnection(): Promise<boolean> {
    if (!APIFY_API_TOKEN) {
      console.error('❌ APIFY_API_TOKEN não configurado');
      return false;
    }

    try {
      const url = `${APIFY_BASE_URL}/acts/${IDEALISTA_SCRAPER_ID}?token=${APIFY_API_TOKEN}`;
      const response = await fetch(url);

      if (response.ok) {
        console.log('✅ Conexão com Apify OK');
        return true;
      } else {
        console.error('❌ Erro ao conectar com Apify:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao testar conexão Apify:', error);
      return false;
    }
  }
};

export default apifyService;
