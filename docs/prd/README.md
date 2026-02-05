# ImobCurator 3.0 - Product Requirements (Epics)

**Versão:** 1.0
**Data:** 05 Fevereiro 2026
**Status:** 🔄 Em Desenvolvimento

---

## 📋 Estrutura de Epics

Este diretório contém os epics do ImobCurator 3.0, organizados por fase de desenvolvimento. Cada epic agrupa user stories relacionadas que serão implementadas nas iterações do projeto.

Para o **PRD completo** (visão executiva, personas, mercado, etc.), consulte: [`docs/PRD.md`](../PRD.md)

---

## 🎯 Epics do MVP (Fase 1 - Q2 2026)

### Must Have - Core Features

| Epic | Título | Prioridade | Effort | Status |
|------|--------|------------|--------|--------|
| [Epic 1](epic-1-authentication-user-management.md) | **Authentication & User Management** | P0 | 4-6 sem | 🔄 Em Desenvolvimento |
| [Epic 2](epic-2-client-management.md) | **Client Management System** | P0 | 3-4 sem | 🔄 Em Desenvolvimento |
| [Epic 3](epic-3-property-management-ai-search.md) | **Property Management & AI Search** | P0 | 4-5 sem | 🔄 Em Desenvolvimento |
| [Epic 4](epic-4-visit-management.md) | **Visit Management System** | P0 | 2-3 sem | 📋 Planejado |
| [Epic 5](epic-5-dashboard-analytics.md) | **Dashboard & Analytics** | P0 | 3-4 sem | 📋 Planejado |

**Total Estimated Effort (MVP):** 16-22 semanas

---

## 📦 Epics Futuros (Fase 2 & 3)

### Should Have (Fase 2 - Q3 2026)

| Epic | Título | Features Principais |
|------|--------|---------------------|
| Epic 6 | **Communication & Collaboration** | Email templates, WhatsApp integration, Chat interno |
| Epic 7 | **Advanced Search & Alerts** | Filtros avançados, Busca por mapa, Alertas automáticos |
| Epic 8 | **Monetization & Payments** | Stripe integration, Planos Free/Pro, Customer portal |

### Could Have (Fase 3 - Q4 2026)

| Epic | Título | Features Principais |
|------|--------|---------------------|
| Epic 9 | **External Integrations** | Idealista API, Imovirtual API, Google Calendar, Zapier |
| Epic 10 | **Mobile & PWA** | Progressive Web App, Push notifications |
| Epic 11 | **Team Features** | Plano Team, Compartilhamento, Leaderboard de agência |

---

## 🗺️ Roadmap Visual

```
Q2 2026 (MVP Launch)
├─ Epic 1: Authentication ✅
├─ Epic 2: Clients ✅
├─ Epic 3: Properties + AI 🤖
├─ Epic 4: Visits
└─ Epic 5: Dashboard 📊

Q3 2026 (Growth)
├─ Epic 6: Communication 💬
├─ Epic 7: Advanced Search 🔍
└─ Epic 8: Monetization 💰

Q4 2026 (Scale)
├─ Epic 9: Integrations 🔗
├─ Epic 10: Mobile 📱
└─ Epic 11: Team Features 👥
```

---

## 📊 Status dos Epics

### Legenda
- 🔄 **Em Desenvolvimento:** Stories sendo implementadas
- 📋 **Planejado:** Epic pronto para iniciar
- 💡 **Backlog:** Planejamento futuro
- ✅ **Concluído:** Todas stories completas

### Resumo de Progress

| Fase | Epics Totais | Em Dev | Planejados | Completos |
|------|--------------|--------|------------|-----------|
| MVP (Fase 1) | 5 | 3 | 2 | 0 |
| Fase 2 | 3 | 0 | 0 | 0 |
| Fase 3 | 3 | 0 | 0 | 0 |

---

## 🔗 Links Relacionados

- **PRD Completo:** [`docs/PRD.md`](../PRD.md)
- **Arquitetura Técnica:** [`docs/architecture/`](../architecture/)
- **Stories Implementadas:** [`docs/stories/`](../stories/)
- **Roadmap Detalhado:** [`docs/ROADMAP.md`](../ROADMAP.md)

---

## 📝 Como Usar Este Diretório

### Para Product Managers:
1. Consulte cada epic para entender escopo e priorização
2. Use para planejamento de sprints e releases
3. Atualize status conforme stories são completadas

### Para Desenvolvedores:
1. Leia o epic antes de iniciar stories
2. Siga requisitos técnicos e database schemas documentados
3. Consulte acceptance criteria para definition of done

### Para QA:
1. Use acceptance criteria para criar test cases
2. Consulte métricas de sucesso para validação
3. Verifique riscos documentados ao testar

---

## 🎯 Critérios de MVP Ready

O MVP estará pronto para lançamento quando:

- [ ] Todos os 5 epics Must Have estão completos
- [ ] 100 usuários beta testaram (NPS > 30)
- [ ] Zero bugs críticos
- [ ] Performance < 2s page load (p95)
- [ ] 99.5% uptime (2 semanas de staging)
- [ ] 80%+ code coverage
- [ ] Documentação da API completa

**Target MVP Launch:** Final de Q2 2026 (Junho 2026)

---

**Mantido por:** @pm (Morgan)
**Última atualização:** 05 Fevereiro 2026
