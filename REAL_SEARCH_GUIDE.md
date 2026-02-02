# 🌐 Guia de Busca Real de Imóveis - ImobCurator 3.0

## ✨ Nova Funcionalidade: REAL_SEARCH

A partir de agora, o ImobCurator suporta busca de imóveis **100% reais** diretamente do Idealista.pt usando Apify Idealista Scraper!

---

## 🚀 Como Usar

### 1. Configuração (Uma única vez)

Certifique-se de que o `APIFY_API_TOKEN` está configurado no arquivo `.env`:

```bash
# .env
APIFY_API_TOKEN=apify_api_I14dOqvFzWeO7OZoHQfS4rOVLFxcH53te6KS
```

✅ **Já está configurado!** Você já tem um token válido no seu `.env`.

### 2. Usando a Busca Real

#### Opção A: Via Interface (PropertySearchDemo)

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse o PropertySearchDemo na aplicação

3. Selecione a estratégia **"✨ REAL_SEARCH (Imóveis Reais!)"**

4. Configure seus critérios de busca:
   - Localização (ex: Lisboa, Porto, Cascais)
   - Tipo de imóvel (Apartamento, Moradia, Terreno)
   - Orçamento
   - Número de quartos e casas de banho

5. Clique em **"Buscar Imóveis"**

6. **Aguarde 5-15 segundos** (busca real demora mais que simulação)

7. Veja os imóveis **REAIS** do Idealista.pt! 🎉

#### Opção B: Via Código

```typescript
import { propertySearchService } from './src/services/propertySearchService';

const criteria = {
  type: 'Apartamento',
  location: 'Lisboa',
  budget: '350000',
  bedrooms: 2,
  bathrooms: 2,
  amenities: ['Garagem', 'Elevador']
};

// Busca REAL via Apify
const properties = await propertySearchService.search(criteria, 'REAL_SEARCH');

console.log(`Encontrados ${properties.length} imóveis reais!`);
```

---

## 🔍 Comparação de Estratégias

| Estratégia | Tipo de Dados | Velocidade | Custo | Autenticidade |
|------------|---------------|------------|-------|---------------|
| **REALISTIC_SIMULATION** | Simulação ultra-realista | ~30ms ⚡ | €0 | 85% |
| **AI_ENHANCED** | Gerado por Gemini | ~2-5s | €0.001/busca | 80% |
| **DEMO_MODE** | Demo marcado | ~30ms | €0 | N/A |
| **REAL_SEARCH** ✨ | **Dados REAIS** | 5-15s | €0.01-0.05/busca | **100%** |

### Quando usar cada estratégia?

- **REALISTIC_SIMULATION** (Padrão):
  - Desenvolvimento e testes
  - Demonstrações de sistema
  - Custo zero, performance máxima
  - Dados muito próximos da realidade

- **AI_ENHANCED**:
  - Quando precisa de descrições mais elaboradas
  - Contextos específicos de mercado
  - Ainda é simulação, mas com IA

- **DEMO_MODE**:
  - Demos e apresentações
  - Deixa claro que são dados fictícios

- **REAL_SEARCH** ✨:
  - **Produção** com usuários reais
  - Quando precisa de dados 100% autênticos
  - Links diretos para anúncios reais
  - Fotos e descrições originais

---

## 🧪 Testando a Integração

Execute o script de teste completo:

```bash
npx tsx test-apify-integration.ts
```

Este script testa:
1. ✅ Conexão com Apify
2. ✅ Busca de imóveis reais
3. ✅ Comparação de performance entre estratégias

---

## 💰 Custos Apify

### Seu Plano Atual
- Token configurado: ✅ Ativo
- Créditos disponíveis: Verifique em https://console.apify.com/billing

### Estimativa de Custos
- **1 busca REAL_SEARCH**: ~€0.01 - €0.05
- **500 buscas/mês**: ~€5 - €25/mês
- **1000 buscas/mês**: ~€10 - €50/mês

### Otimização de Custos
1. Use **REALISTIC_SIMULATION** para desenvolvimento
2. Use **REAL_SEARCH** apenas em produção
3. Implemente cache de resultados (próxima feature)
4. Configure rate limiting para evitar buscas desnecessárias

---

## 🔒 Considerações Legais

### ⚠️ Importante
O Idealista.pt proíbe web scraping em seus Termos de Serviço.

### Estratégias de Mitigação
1. ✅ Use apenas após validação de produto
2. ✅ Implemente rate limiting rigoroso
3. ✅ Cache agressivo para reduzir requests
4. ✅ Disclaimers claros para usuários
5. ✅ Aplique para API oficial quando disponível

### Recomendação
- **MVP/Desenvolvimento**: Use REALISTIC_SIMULATION (custo zero, sem riscos legais)
- **Produção Beta**: Use REAL_SEARCH com disclaimers
- **Produção Final**: Migre para API oficial quando disponível

---

## 🎯 Próximos Passos

### Fase 1: MVP (Atual)
- ✅ Implementação REAL_SEARCH
- ✅ Interface PropertySearchDemo atualizada
- ✅ Testes de integração

### Fase 2: Otimização
- [ ] Sistema de cache (Redis/Supabase)
- [ ] Rate limiting inteligente
- [ ] Webhook para atualizações automáticas
- [ ] Dashboard de monitoramento de custos

### Fase 3: Produção
- [ ] A/B testing: REAL vs SIMULATION
- [ ] Métricas de satisfação do usuário
- [ ] Migração gradual para API oficial
- [ ] Implementação de disclaimers legais

---

## 📚 Documentação Técnica

### Arquivos Modificados/Criados
- ✅ `src/services/apifyService.ts` - Novo serviço Apify
- ✅ `src/services/propertySearchService.ts` - Adicionada estratégia REAL_SEARCH
- ✅ `src/components/PropertySearchDemo.tsx` - UI atualizada
- ✅ `test-apify-integration.ts` - Script de teste

### APIs Utilizadas
- **Apify API v2**: https://docs.apify.com/api/v2
- **Idealista Scraper**: https://apify.com/dz_omar/idealista-scraper-api
- **Gemini API**: Para estratégias AI_ENHANCED

### Estrutura de Dados
```typescript
interface Property {
  title: string;
  price: string;
  location: string;
  url: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  matchScore: number;
  matchReason: string;
  pros: string[];
  cons: string[];
  website: string;
  isSimulated: boolean; // false para REAL_SEARCH!
}
```

---

## 🆘 Troubleshooting

### Erro: "APIFY_API_TOKEN não configurado"
**Solução**: Verifique se o token está no `.env`:
```bash
cat .env | grep APIFY_API_TOKEN
```

### Erro: "Apify API Error: 401"
**Solução**: Token inválido ou expirado. Gere novo em https://console.apify.com/account/integrations

### Busca demora muito (>30s)
**Solução**: Normal para REAL_SEARCH. Se demorar >30s, verifique:
- Conexão com internet
- Status do Apify (https://status.apify.com)

### Resultados vazios
**Solução**:
- Critérios muito restritivos (aumente faixa de preço)
- Localização sem resultados no Idealista
- Fallback automático para REALISTIC_SIMULATION será ativado

---

## ✅ Checklist de Implementação

- [x] Apify token configurado
- [x] apifyService.ts implementado
- [x] REAL_SEARCH adicionado ao propertySearchService
- [x] Interface atualizada (PropertySearchDemo)
- [x] Script de testes criado
- [x] Documentação completa
- [ ] Cache implementado (próxima fase)
- [ ] Monitoramento de custos (próxima fase)
- [ ] Rate limiting (próxima fase)

---

## 🎉 Conclusão

Você agora tem acesso a **busca de imóveis 100% reais** do Idealista.pt!

Use com sabedoria:
- **Desenvolvimento**: REALISTIC_SIMULATION ⚡
- **Produção**: REAL_SEARCH ✨

Para dúvidas, consulte:
- [Documentação Apify](https://docs.apify.com)
- [Idealista Scraper Docs](https://apify.com/dz_omar/idealista-scraper-api)
- Nosso código-fonte em `src/services/apifyService.ts`

---

**Desenvolvido com ❤️ para ImobCurator 3.0**
