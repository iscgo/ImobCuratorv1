import OpenAI from 'openai';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ VITE_OPENAI_API_KEY não está configurada em .env');
}

const client = new OpenAI({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true // Required for client-side usage
});

interface AIServiceOptions {
  model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo';
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export const aiService = {
  /**
   * Generate content using OpenAI
   * Use gpt-4o for complex tasks, gpt-4o-mini for simple messages
   */
  async generateContent(
    prompt: string,
    options: AIServiceOptions = {}
  ): Promise<string> {
    const {
      model = 'gpt-4o-mini',
      temperature = 0.7,
      maxTokens = 2000,
      responseFormat = 'text'
    } = options;

    try {
      console.log(`📤 Enviando requisição para ${model}...`);

      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens,
        ...(responseFormat === 'json' && {
          response_format: { type: 'json_object' }
        })
      });

      const content = response.choices[0]?.message?.content || '';
      console.log(`📥 Resposta recebida (${content.length} chars):`, content.substring(0, 200));

      return content;
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      throw error;
    }
  },

  /**
   * Search for properties - generates realistic local data
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
      console.log('🔍 Gerando imóveis para:', criteria);

      const basePrice = parseInt(criteria.budget || '300000');
      const properties = this.generateProperties(criteria, basePrice);

      console.log('✅ Gerados', properties.length, 'imóveis');
      return properties;
    } catch (error) {
      console.error('❌ Erro ao gerar imóveis:', error);
      return [];
    }
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
      reengagement: 'Client discarded properties - be empathetic, ask for feedback, suggest recalibration',
      followup: 'Follow up on properties client is interested in',
      proposal: 'Present new properties that match criteria',
      scheduling: 'Suggest scheduling property viewings'
    };

    const prompt = `
You are a professional real estate agent. Generate a WhatsApp message to ${clientName}.

PURPOSE: ${purposeGuide[purpose]}
CONTEXT: ${context}

REQUIREMENTS:
- Tone: Professional but warm and approachable
- Length: 2-3 sentences max
- NO hashtags, emojis, or unnecessary formatting
- Direct and action-oriented
- In Portuguese (pt-PT)
- Personal touch based on client history

Generate ONLY the message text, nothing else.
`;

    return this.generateContent(prompt, {
      model: 'gpt-4o-mini',
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
You are a professional real estate consultant. Write a WhatsApp message to a colleague (listing agent).

CONTEXT:
- You: ${yourName} from ${yourAgency}
- Colleague: ${agentName} from ${agencyName}
- Property: ${propertyTitle} in ${propertyLocation}
- Buyer Client: ${clientName} (Budget: ${clientBudget}, qualified buyer)

REQUIREMENTS:
- Professional and collaborative tone
- Request property viewing appointment
- Mention client qualifications
- Suggest available times
- Keep it concise and courteous
- In Portuguese (pt-PT)
- NO hashtags or emojis

Generate ONLY the message, nothing else.
`;

    return this.generateContent(prompt, {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 300
    });
  },

  /**
   * Extract property details from URL using AI analysis
   */
  async extractPropertyDetails(url: string): Promise<any> {
    const prompt = `
Analyze this real estate listing URL and extract property details.

URL: ${url}

TASK: Based on the URL structure and common patterns, predict the property information.

RESPONSE (JSON only):
{
  "title": "Property title or name",
  "price": 450000,
  "location": "City/District",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 150,
  "imageUrl": "https://picsum.photos/800/600?random"
}

Return ONLY valid JSON.
`;

    const response = await this.generateContent(prompt, {
      model: 'gpt-4o-mini',
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
