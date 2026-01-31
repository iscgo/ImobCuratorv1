# Integração Apify - Idealista Scraper API

**Data:** 31 Janeiro 2026
**Status:** ✅ Configurado e Pronto para Uso

---

## 🎯 O Que Foi Integrado

Servidor MCP do Apify com acesso a:
- ✅ **Idealista Scraper API** - Buscar imóveis reais do Idealista.pt
- ✅ **Website Content Crawler** - Crawler genérico
- ✅ **Web Scraper** - Scraper configurável
- ✅ **Web Images Scraper** - Scraper de imagens

---

## 🔧 Configuração Atual

### Variáveis de Ambiente (.env)

```bash
# Token já configurado
APIFY_API_TOKEN=apify_api_I14dOqvFzWeO7OZoHQfS4rOVLFxcH53te6KS
```

### Servidor MCP

Configurado automaticamente em `~/.claude.json` para este projeto.

Para verificar: Reinicie o Claude Code e peça para listar tools MCP disponíveis.

---

## 🚀 Próximos Passos

### Fase 1: Testar Idealista Scraper (Esta Semana)

Você pode testar agora mesmo:

```
Use o Apify para buscar 5 apartamentos T2 em Lisboa até €350.000 do Idealista
```

### Fase 2: Integrar com Backend (Semanas 10-12 do Roadmap)

Quando implementar o backend, criar endpoint:

```typescript
// backend/src/api/apify.routes.ts
POST /api/v1/properties/search-real

// Usa Apify Idealista Scraper
// Retorna dados reais ao invés de simulação
```

### Fase 3: Atualizar Frontend (Semanas 10-12)

Adicionar estratégia `REAL_API` em `propertySearchService.ts`:

```typescript
const properties = await propertySearchService.search(
  criteria,
  'REAL_API'  // ← Nova opção usando Idealista real
);
```

---

## 💡 Decisão Estratégica

### MVP (Q2 2026): Manter Simulação

**Por quê?**
- ✅ Custo zero
- ✅ Performance excelente (30ms vs 5-15s)
- ✅ Sem riscos legais
- ✅ Suficiente para validar produto

### Pós-MVP (Q3 2026): Migrar para Idealista Real

**Quando?**
- ✅ Se usuários validarem valor do produto
- ✅ Se budget permitir (~€37/mês para 500 usuários)
- ✅ Com backend proxy + caching implementado
- ✅ Com disclaimers legais adequados

---

## ⚠️ Considerações Legais

**Importante:** Idealista.pt proíbe scraping em seus ToS.

**Mitigação:**
1. Usar apenas após validação de produto (não no MVP)
2. Rate limiting estrito
3. Caching agressivo (reduzir requests)
4. Disclaimers claros para usuários
5. Aplicar para API oficial (se/quando disponível)

**Alternativa Segura:** Manter simulação até obter API oficial.

---

## 📊 Comparação Rápida

| Aspecto | Simulação (Atual) | Idealista Real |
|---------|-------------------|----------------|
| Dados | Baseado em preços reais 2026 | Anúncios reais |
| Performance | 30ms | 5-15s |
| Custo | €0 | ~€37/mês |
| Legalidade | ✅ Totalmente legal | ⚠️ Zona cinzenta |

**Recomendação:** Começar com simulação, migrar só se necessário.

---

## 📚 Documentação Completa

Para detalhes de implementação, consulte:
- [Roadmap](./ROADMAP.md) - Fase 3: Integração Apify
- [Arquitetura](./architecture.md) - Seção de Integrações Externas
- [Apify Idealista Scraper](https://apify.com/dz_omar/idealista-scraper-api)

---

**✅ Status:** Configuração completa, pronto para usar quando necessário!
