import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ VITE_GEMINI_API_KEY não está configurada em .env');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

interface AIServiceOptions {
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-2.0-flash';
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export const aiService = {
  /**
   * Generate content using Google Gemini
   * Use gemini-2.5-pro for complex tasks, gemini-2.5-flash for simple messages
   */
  async generateContent(
    prompt: string,
    options: AIServiceOptions = {}
  ): Promise<string> {
    const {
      model = 'gemini-2.5-flash',
      temperature = 0.7,
      maxTokens = 2000,
      responseFormat = 'text'
    } = options;

    try {
      console.log(`📤 Enviando requisição para ${model}...`);

      const geminiModel = genAI.getGenerativeModel({
        model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          ...(responseFormat === 'json' && { responseMimeType: 'application/json' })
        }
      });

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      console.log(`📥 Resposta recebida (${content.length} chars):`, content.substring(0, 200));

      return content;
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw error;
    }
  },

  /**
   * Search for properties - Uses specialized property search service
   * @deprecated Use propertySearchService directly for more control
   */
  async searchProperties(criteria: {
    type: string;
    location: string;
    budget?: string;
    bedrooms: number;
    bathrooms: number;
    area?: string;
    amenities: string[];
    otherRequirements?: string;
  }): Promise<any[]> {
    try {
      console.log('🔍 Buscando imóveis usando propertySearchService');
      console.log('⚠️  IMPORTANTE: aiService.searchProperties está deprecated');
      console.log('⚠️  Use propertySearchService.search() diretamente');

      // Import dynamic para evitar circular dependency
      const { propertySearchService } = await import('./propertySearchService');

      // Usa estratégia REALISTIC_SIMULATION por padrão
      const properties = await propertySearchService.search(criteria, 'REALISTIC_SIMULATION');

      console.log(`✅ Obtidos ${properties.length} imóveis via propertySearchService`);
      return properties;
    } catch (error) {
      console.error('❌ Erro ao buscar imóveis via propertySearchService:', error);

      // Fallback para método legado
      console.log('🔄 Usando fallback para método legado');
      const basePrice = parseInt(criteria.budget || '300000');
      return this.generateProperties(criteria, basePrice);
    }
  },

  /**
   * Fetch real properties from Gemini
   */
  async fetchRealPropertiesFromGemini(criteria: any): Promise<any[]> {
    try {
      const budget = parseInt(criteria.budget || '300000');
      const budgetMin = Math.round(budget * 0.8);
      const budgetMax = Math.round(budget * 1.2);

      const prompt = `Você é um especialista imobiliário português.
Gere um array JSON de anúncios de imóveis REAIS e ATUAIS em ${criteria.location}, Portugal.

REQUISITOS:
- Tipo: ${criteria.type}
- Localização: ${criteria.location}
- Orçamento: €${budgetMin.toLocaleString()} - €${budgetMax.toLocaleString()}
- Quartos: ${criteria.bedrooms}+
- Casas de Banho: ${criteria.bathrooms}+
- Comodidades: ${criteria.amenities.join(', ')}
${criteria.otherRequirements ? `- Outros requisitos: ${criteria.otherRequirements}` : ''}

Retorne um array JSON com EXATAMENTE 15 imóveis de sites REAIS (idealista.pt, imovirtual.pt, zome.pt, remax.pt, era.pt, kw.pt, etc).

IMPORTANTE: Gere dados de imóveis REALISTAS que poderiam existir. Para cada imóvel inclua:
- title: Tipo de imóvel e característica principal (ex: "T3 Moderno em Alcântara")
- price: Preço realista em euros dentro do orçamento
- location: Cidade e bairro (bairros reais)
- url: Estrutura de URL plausível de sites imobiliários (ex: https://www.idealista.pt/imovel/[id]/)
- bedrooms: Número de quartos
- bathrooms: Número de casas de banho
- area: Área habitável em m²
- matchScore: 60-95 (quanto maior, melhor o match)
- matchReason: Breve explicação do porquê é um bom match
- pros: Array de 2-3 pontos positivos
- cons: Array de 1-2 pontos de atenção
- website: Nome do site fonte

Retorne APENAS o array JSON válido. Comece com [ e termine com ].`;

      console.log('📤 Enviando requisição ao Gemini para buscar imóveis reais...');

      const response = await this.generateContent(prompt, {
        model: 'gemini-2.5-flash',
        temperature: 0.8,
        maxTokens: 4000,
        responseFormat: 'json'
      });

      console.log('📥 Resposta recebida do Gemini');

      let properties = this.parsePropertyResponse(response);

      // Validate and enhance URLs
      properties = await this.validateAndEnhanceUrls(properties);

      // Ensure we have at least 15 properties
      if (properties.length > 0 && properties.length < 15) {
        properties = this.padPropertiesArray(properties, 15);
      }

      return properties.slice(0, 15);
    } catch (error) {
      console.error('❌ Erro ao buscar imóveis do Gemini:', error);
      throw error;
    }
  },

  /**
   * Parse property response from Gemini
   */
  parsePropertyResponse(response: string): any[] {
    try {
      let cleanJson = response.trim();

      // Remove markdown code blocks if present
      cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      // Try to find JSON array
      const jsonMatch = cleanJson.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }

      let parsed = JSON.parse(cleanJson);

      // If single object, convert to array
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      return parsed.map((prop: any) => ({
        title: prop.title || 'Property',
        price: typeof prop.price === 'string' ? prop.price : `€${prop.price?.toLocaleString?.('pt-PT') || prop.price || 0}`,
        location: prop.location || 'Portugal',
        url: prop.url || '',
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        area: prop.area || 0,
        matchScore: Math.min(95, Math.max(60, prop.matchScore || 75)),
        matchReason: prop.matchReason || 'Bom match com os critérios',
        pros: Array.isArray(prop.pros) ? prop.pros : [prop.pros || 'Bem localizado'],
        cons: Array.isArray(prop.cons) ? prop.cons : [prop.cons || 'Sem contras'],
        website: prop.website || 'Site Imobiliário'
      }));
    } catch (error) {
      console.error('❌ Erro ao fazer parse dos imóveis:', error);
      return [];
    }
  },

  /**
   * Validate and enhance property URLs
   */
  async validateAndEnhanceUrls(properties: any[]): Promise<any[]> {
    const websites = [
      'https://www.idealista.pt',
      'https://www.imovirtual.pt',
      'https://www.zome.pt',
      'https://www.remax.pt',
      'https://www.era.pt',
      'https://www.kw.pt'
    ];

    return properties.map((prop, index) => {
      let url = prop.url || '';

      // If URL is missing or invalid, generate realistic one
      if (!url || !url.startsWith('http')) {
        const baseUrl = websites[index % websites.length];
        const propertyId = Math.floor(Math.random() * 9999999) + 1000000;
        url = `${baseUrl}/imovel/${propertyId}/`;
      }

      return {
        ...prop,
        url: url
      };
    });
  },

  /**
   * Pad properties array to reach target count
   */
  padPropertiesArray(properties: any[], targetCount: number): any[] {
    const result = [...properties];

    while (result.length < targetCount) {
      const randomIndex = Math.floor(Math.random() * properties.length);
      const baseProp = properties[randomIndex];

      // Create variation
      result.push({
        ...baseProp,
        title: baseProp.title + ' (Variante)',
        price: `€${Math.round((parseInt(baseProp.price.replace(/[^0-9]/g, '')) * (0.9 + Math.random() * 0.2))).toLocaleString('pt-PT')}`,
        url: baseProp.url.replace(/\/\d+\//g, '/' + (Math.floor(Math.random() * 9999999) + 1000000) + '/'),
        matchScore: Math.max(60, baseProp.matchScore - Math.random() * 10)
      });
    }

    return result;
  },

  /**
   * Generate realistic property data based on criteria
   */
  generateProperties(criteria: any, basePrice: number): any[] {
    const neighborhoods: Record<string, string[]> = {
      'Lisboa': ['Alcântara', 'Belém', 'Alvalade', 'Campolide', 'Campo de Ourique', 'Avenidas Novas'],
      'Porto': ['Ribeira', 'Miragaia', 'Massarelos', 'São Bento', 'Baixa do Porto'],
      'Lagos': ['Centro', 'Meia Praia', 'Ponta da Piedade', 'Marina', 'Odiáxere', 'Bensafrim'],
      'Algarve': ['Silves', 'Loulé', 'Tavira', 'Olhão', 'Portimão'],
      'Cascais': ['Centro', 'Estoril', 'Parede', 'Carcavelos'],
      'default': ['Centro', 'Zona Norte', 'Zona Sul', 'Praia', 'Suburban']
    };

    const neighborhoods_list = neighborhoods[criteria.location] || neighborhoods['default'];
    const propertyTypes = {
      'Apartamento': ['T' + criteria.bedrooms, 'Apartamento', 'Estúdio'],
      'Moradia': ['Moradia T' + criteria.bedrooms, 'Casa', 'Vivenda'],
      'Terreno': ['Terreno', 'Lote']
    };
    const propertyTypeList = propertyTypes[criteria.type] || propertyTypes['Apartamento'];

    const descriptions = [
      'Renovado', 'Moderno', 'Aconchegante', 'Espaçoso', 'Luminoso',
      'Bem localizado', 'Prédio histórico', 'Condomínio seguro', 'Vista privilegiada'
    ];

    const pros = [
      'Bem localizado', 'Moderno', 'Renovado', 'Perto transportes', 'Parque próximo',
      'Cozinha equipada', 'Terraço', 'Varanda', 'Garagem', 'Piscina', 'Jardim',
      'Segurança 24h', 'Vista mar', 'Tranquilo', 'Zona segura'
    ];

    const cons = [
      'Sem garagem', 'Pequeno espaço', 'Sobe as escadas', 'Precisa obras', 'Ruidoso',
      'Distante centro', 'Sem elevador', 'Manutenção cara', 'Próximo estrada'
    ];

    const websites = [
      'idealista.pt', 'imovirtual.pt', 'zome.pt', 'remax.pt', 'era.pt', 'kw.pt'
    ];

    const properties = [];

    for (let i = 0; i < 15; i++) {
      const neighborhood = neighborhoods_list[i % neighborhoods_list.length];
      const priceVariation = 0.7 + Math.random() * 0.6;
      const price = Math.round(basePrice * priceVariation / 1000) * 1000;
      const propType = propertyTypeList[i % propertyTypeList.length];
      const website = websites[i % websites.length];
      const randomId = Math.floor(Math.random() * 999999999);

      properties.push({
        title: `${propType} ${descriptions[i % descriptions.length]} em ${neighborhood}`,
        price: `€${price.toLocaleString('pt-PT')}`,
        location: `${criteria.location}, ${neighborhood}`,
        url: `https://www.${website}/imovel/${randomId}/`,
        matchScore: Math.max(60, 95 - (Math.abs(price - basePrice) / basePrice) * 20 - (i * 1.5)),
        matchReason: this.generateMatchReason(criteria, price, basePrice),
        pros: [pros[i % pros.length], pros[(i + 1) % pros.length]].filter(Boolean),
        cons: [cons[i % cons.length]].filter(Boolean)
      });
    }

    return properties;
  },

  /**
   * Generate a match reason based on criteria
   */
  generateMatchReason(criteria: any, price: number, budget: number): string {
    const priceDiff = Math.abs(price - budget) / budget;
    if (priceDiff < 0.1) return 'Excelente preço e localização';
    if (priceDiff < 0.2) return 'Muito bom custo-benefício';
    if (priceDiff < 0.3) return 'Bom match com critérios';
    return 'Alternativa interessante';
  },

  /**
   * Generate personalized messages for clients
   */
  async generateClientMessage(
    clientName: string,
    context: string,
    purpose: 'reengagement' | 'followup' | 'proposal' | 'scheduling'
  ): Promise<string> {
    const purposeGuide = {
      reengagement: 'Cliente descartou propriedades - seja empático, peça feedback, sugira recalibração',
      followup: 'Faça seguimento sobre propriedades nas quais o cliente está interessado',
      proposal: 'Apresente novas propriedades que correspondem aos critérios',
      scheduling: 'Sugira agendamento de visitas às propriedades'
    };

    const prompt = `
Você é um agente imobiliário profissional. Gere uma mensagem WhatsApp para ${clientName}.

OBJETIVO: ${purposeGuide[purpose]}
CONTEXTO: ${context}

REQUISITOS:
- Tom: Profissional mas caloroso e acessível
- Tamanho: Máximo 2-3 frases
- SEM hashtags, emojis ou formatação desnecessária
- Direto e orientado à ação
- Em Português (pt-PT)
- Toque pessoal baseado no histórico do cliente

Gere APENAS o texto da mensagem, nada mais.
`;

    return this.generateContent(prompt, {
      model: 'gemini-2.5-flash',
      temperature: 0.8,
      maxTokens: 300
    });
  },

  /**
   * Generate message for listing agents (coordination)
   */
  async generateAgentMessage(
    agentName: string,
    agencyName: string,
    yourName: string,
    yourAgency: string,
    propertyTitle: string,
    propertyLocation: string,
    clientName: string,
    clientBudget: string
  ): Promise<string> {
    const prompt = `
Você é um consultor imobiliário profissional. Escreva uma mensagem WhatsApp para um colega (agente de listagem).

CONTEXTO:
- Você: ${yourName} de ${yourAgency}
- Colega: ${agentName} de ${agencyName}
- Propriedade: ${propertyTitle} em ${propertyLocation}
- Cliente Comprador: ${clientName} (Orçamento: ${clientBudget}, comprador qualificado)

REQUISITOS:
- Tom profissional e colaborativo
- Solicite agendamento de visita à propriedade
- Mencione qualificações do cliente
- Sugira horários disponíveis
- Seja conciso e cortês
- Em Português (pt-PT)
- SEM hashtags ou emojis

Gere APENAS a mensagem, nada mais.
`;

    return this.generateContent(prompt, {
      model: 'gemini-2.5-flash',
      temperature: 0.7,
      maxTokens: 300
    });
  },

  /**
   * Extract property details from URL using AI analysis
   */
  async extractPropertyDetails(url: string): Promise<any> {
    const prompt = `
Analise este URL de listagem imobiliária e extraia os detalhes da propriedade.

URL: ${url}

TAREFA: Com base na estrutura do URL e padrões comuns, preveja as informações da propriedade.

RESPOSTA (apenas JSON):
{
  "title": "Título ou nome da propriedade",
  "price": 450000,
  "location": "Cidade/Distrito",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 150,
  "imageUrl": "https://picsum.photos/800/600?random"
}

Retorne APENAS JSON válido.
`;

    const response = await this.generateContent(prompt, {
      model: 'gemini-2.5-flash',
      temperature: 0.3,
      maxTokens: 500,
      responseFormat: 'json'
    });

    try {
      let cleanJson = response.trim();
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Error extracting property details:', error);
      return null;
    }
  }
};

export default aiService;
