# Quick Start: Property Search Service

## 🚀 Uso Imediato

### 1. Importar o Serviço

```typescript
import { propertySearchService } from './services/propertySearchService';
```

### 2. Buscar Imóveis

```typescript
const properties = await propertySearchService.search(
  {
    type: 'Apartamento',        // 'Apartamento' | 'Moradia' | 'Terreno'
    location: 'Lisboa',         // Cidade
    budget: '400000',           // Orçamento em EUR
    bedrooms: 3,                // Número de quartos
    bathrooms: 2,               // Número de casas de banho
    amenities: ['Garagem', 'Elevador', 'Varanda']
  },
  'REALISTIC_SIMULATION'        // Estratégia (opcional)
);

console.log(`Encontrados ${properties.length} imóveis`);
```

### 3. Estratégias Disponíveis

```typescript
// Opção 1: REALISTIC_SIMULATION (Padrão - Recomendado)
// - Mais rápido
// - Baseado em dados reais de mercado 2026
// - Sem custo de API
const realistic = await propertySearchService.search(criteria, 'REALISTIC_SIMULATION');

// Opção 2: AI_ENHANCED
// - Usa GPT-4o
// - Descrições mais elaboradas
// - Requer API key
const aiEnhanced = await propertySearchService.search(criteria, 'AI_ENHANCED');

// Opção 3: DEMO_MODE
// - Marcado como [DEMO]
// - Para testes/apresentações
const demo = await propertySearchService.search(criteria, 'DEMO_MODE');
```

## 📊 Dados de Mercado

### Cidades Disponíveis

```typescript
const locations = propertySearchService.getAvailableLocations();
// ['Lisboa', 'Porto', 'Cascais', 'Lagos', 'Algarve', 'Braga', 'Coimbra']
```

### Informações de Mercado

```typescript
const marketInfo = propertySearchService.getMarketInfo('Lisboa');

console.log(marketInfo.avgPrices);
// {
//   'Alcântara': 5200,
//   'Belém': 5500,
//   'Alvalade': 4800,
//   ...
// }
```

### Verificar Disponibilidade

```typescript
if (propertySearchService.hasMarketData('Lisboa')) {
  console.log('Dados disponíveis!');
}
```

## 🎨 Componente Demo

Use o componente de demonstração para testar:

```tsx
import PropertySearchDemo from './components/PropertySearchDemo';

function App() {
  return <PropertySearchDemo />;
}
```

## 🧪 Executar Testes

```bash
# Teste completo
npx tsx test-property-search.ts

# Ou adicione ao package.json:
# "test:search": "tsx test-property-search.ts"
npm run test:search
```

## ⚠️ Importante

**TODOS os imóveis são simulações realistas** baseadas em dados de mercado 2026.

- ✅ Preços realistas por m²
- ✅ Bairros reais
- ✅ URLs válidas (mas IDs gerados)
- ✅ Disclaimer claro em todos os pontos

Para imóveis REAIS, visite:
- https://www.idealista.pt
- https://www.imovirtual.com
- https://www.remax.pt
- https://www.era.pt

## 📚 Documentação Completa

Veja `PROPERTY_SEARCH_SOLUTION.md` para:
- Análise completa de APIs
- Limitações técnicas e legais
- Roadmap futuro
- Referências

## 💡 Exemplo Completo

```typescript
import { propertySearchService } from './services/propertySearchService';

async function buscarImoveis() {
  try {
    // Critérios de busca
    const criteria = {
      type: 'Apartamento',
      location: 'Lisboa',
      budget: '400000',
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['Garagem', 'Elevador', 'Varanda']
    };

    // Buscar com estratégia padrão
    console.log('🔍 Buscando imóveis...');
    const properties = await propertySearchService.search(
      criteria,
      'REALISTIC_SIMULATION'
    );

    // Processar resultados
    console.log(`✅ Encontrados ${properties.length} imóveis`);

    properties.forEach((prop, index) => {
      console.log(`\n${index + 1}. ${prop.title}`);
      console.log(`   ${prop.price} | ${prop.location}`);
      console.log(`   Match: ${prop.matchScore}% - ${prop.matchReason}`);
      console.log(`   ${prop.url}`);
    });

    // Filtrar por match score
    const topMatches = properties.filter(p => p.matchScore >= 85);
    console.log(`\n🎯 Top matches: ${topMatches.length}`);

    // Análise de preços
    const prices = properties.map(p =>
      parseInt(p.price.replace(/[^0-9]/g, ''))
    );
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    console.log(`💰 Preço médio: €${Math.round(avgPrice).toLocaleString('pt-PT')}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

buscarImoveis();
```

## 🔧 Troubleshooting

### API key não encontrada (AI_ENHANCED)
```bash
# Crie arquivo .env
echo "VITE_OPENAI_API_KEY=sk-..." > .env
```

### Localização não tem dados
```typescript
const hasData = propertySearchService.hasMarketData('MinhaLocalização');
if (!hasData) {
  console.log('Use uma das localizações disponíveis');
  console.log(propertySearchService.getAvailableLocations());
}
```

### Adicionar nova cidade
Edite `propertySearchService.ts` → `MARKET_DATA_2026.avgPricePerM2`:

```typescript
'MinhaLocalização': {
  'Bairro1': 3500,  // EUR/m²
  'Bairro2': 4000,
  // ...
}
```

## ✅ Status

- ✅ REALISTIC_SIMULATION: Implementado e testado
- ✅ AI_ENHANCED: Implementado e testado
- ✅ DEMO_MODE: Implementado e testado
- ✅ Market Data: 7 cidades, 40+ bairros
- ✅ Testes automatizados: Passando
- ✅ Documentação: Completa

**Pronto para produção!** 🚀
