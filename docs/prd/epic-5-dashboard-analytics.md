# Epic 5: Dashboard & Analytics with Gamification

**Status:** 📋 Planejado
**Prioridade:** Must Have (MVP - Fase 1)
**Fase:** Q2 2026 - MVP Launch
**Owner:** @dev

---

## Visão Geral

Implementar dashboard visual com KPIs, gráficos de atividade e sistema de reputação gamificado (Elite, Good, Neutral, Risk) para motivar corretores e dar visibilidade de performance.

## Objetivos de Negócio

- Aumentar engajamento: 3+ sessões/semana por usuário
- Tempo médio por sessão: > 10 min
- Gamificação: 60%+ corretores querem alcançar "Elite"
- Dashboard como ferramenta de venda (screenshots para marketing)

## User Stories

### Story 5.1: Dashboard Home - KPI Cards
**Como** corretor
**Quero** ver meus KPIs principais de forma visual
**Para que** eu acompanhe minha performance rapidamente

**Acceptance Criteria:**
- [ ] Dashboard exibe 6 cards principais (grid 2x3):
  1. **Clientes Ativos:** Contagem (status != Archived)
  2. **Visitas Agendadas:** Próximas 7 dias
  3. **Propostas em Aberto:** Status = Offer Made
  4. **Negócios Fechados:** Status = Closed (mês atual)
  5. **Taxa de Conversão:** (Closed / Total Clientes) × 100%
  6. **Reputação:** Badge (Elite/Good/Neutral/Risk)
- [ ] Cada card exibe:
  - Ícone temático
  - Valor principal (grande, destacado)
  - Comparação com período anterior (+5% ↑, -2% ↓)
  - Link para detalhes (ex: "Ver todos os clientes")
- [ ] Cards responsivos: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- [ ] Loading state (skeleton)
- [ ] Atualização: Real-time ou refresh manual

**Technical Context:**
- Endpoint: GET /api/dashboard/kpis
- Caching: Redis (TTL 5 min)
- Comparação: Período atual vs. período anterior (mesmo número de dias)

**Files Affected:**
- `web/src/pages/Dashboard/DashboardHome.tsx`
- `web/src/components/dashboard/KPICard.tsx`
- `api/src/routes/dashboard.routes.ts`
- `api/src/controllers/dashboard.controller.ts`

---

### Story 5.2: Activity Charts
**Como** corretor
**Quero** visualizar gráficos de minhas atividades ao longo do tempo
**Para que** eu identifique padrões e melhore minha produtividade

**Acceptance Criteria:**
- [ ] Seção "Atividade" no dashboard com 3 gráficos:

  **Gráfico 1: Clientes por Status (Pie Chart)**
  - Exibe distribuição: Searching, Visiting, Offer Made, Closed, Inactive, Archived
  - Cores distintas para cada status
  - Percentual e contagem em cada fatia
  - Legenda

  **Gráfico 2: Visitas por Mês (Bar Chart)**
  - Últimos 6 meses
  - Barras empilhadas: Requested, Confirmed, Completed, Cancelled
  - Eixo Y: Contagem de visitas
  - Eixo X: Meses

  **Gráfico 3: Pipeline de Conversão (Funnel Chart)**
  - Etapas: Clientes Totais → Visitando → Proposta → Fechados
  - Mostra taxa de conversão em cada etapa
  - Identifica gargalos

- [ ] Filtro de período: Últimos 30 dias, 3 meses, 6 meses, 1 ano, Custom
- [ ] Exportar gráfico como imagem (futuro)
- [ ] Responsivo: Gráficos empilhados verticalmente em mobile

**Technical Context:**
- Library: Recharts ou Chart.js
- Cores: Seguir design system (Tailwind colors)
- Performance: Pré-computar dados em job noturno (futuro)

**Files Affected:**
- `web/src/components/dashboard/ClientStatusChart.tsx`
- `web/src/components/dashboard/VisitsPerMonthChart.tsx`
- `web/src/components/dashboard/ConversionFunnelChart.tsx`
- `api/src/services/analytics.service.ts`

---

### Story 5.3: Reputation System (Gamification)
**Como** corretor
**Quero** ter uma pontuação de reputação
**Para que** eu me motive a melhorar minha performance

**Acceptance Criteria:**
- [ ] 4 níveis de reputação:
  - **Elite** 🏆 (≥ 80 pontos): Verde
  - **Good** 👍 (50-79 pontos): Azul
  - **Neutral** 😐 (20-49 pontos): Amarelo
  - **Risk** ⚠️ (< 20 pontos): Vermelho
- [ ] Badge de reputação exibido:
  - No dashboard (KPI card)
  - No perfil do corretor
  - Na navbar (ícone pequeno)
- [ ] Cálculo de pontos baseado em:
  - **Clientes ativos:** +2 pontos cada
  - **Visitas realizadas:** +3 pontos cada
  - **Propostas feitas:** +5 pontos cada
  - **Negócios fechados:** +10 pontos cada
  - **Win streak:** +5 pontos a cada 3 negócios consecutivos
  - **Penalidades:** -5 pontos por cliente Inactive > 30 dias
- [ ] Pontuação recalculada: A cada nova atividade
- [ ] Seção "Como Melhorar" no dashboard:
  - Dicas personalizadas baseadas em pontos fracos
  - Ex: "Você tem 5 clientes inativos. Entre em contato para ganhar +10 pontos!"
- [ ] Histórico de pontuação (gráfico de linha - futuro)

**Reputation Formula (MVP):**
```javascript
score = 0;
score += activeClients * 2;
score += completedVisits * 3;
score += offersMade * 5;
score += closedDeals * 10;
score += Math.floor(closedDeals / 3) * 5; // Win streak bonus
score -= inactiveClients * 5;
return Math.max(0, score); // Não pode ser negativo
```

**Technical Context:**
- Campo: reputation_score em users table
- Recálculo: Trigger ou job assíncrono após eventos
- Cache: Redis para evitar recálculo constante

**Files Affected:**
- `api/src/services/reputation.service.ts`
- `web/src/components/dashboard/ReputationBadge.tsx`
- `web/src/components/dashboard/ReputationExplainer.tsx`

---

### Story 5.4: Recent Activity Feed
**Como** corretor
**Quero** ver feed de minhas atividades recentes
**Para que** eu tenha contexto do que fiz recentemente

**Acceptance Criteria:**
- [ ] Seção "Atividade Recente" no dashboard (abaixo dos gráficos)
- [ ] Feed exibe últimas 10 atividades:
  - Cliente adicionado
  - Visita agendada
  - Visita realizada
  - Proposta feita
  - Negócio fechado
  - Busca de imóveis realizada
- [ ] Cada item exibe:
  - Ícone do tipo de atividade
  - Descrição: "Você agendou visita com João Silva"
  - Timestamp relativo: "há 2 horas", "há 3 dias"
  - Link para detalhes (cliente, visita, etc.)
- [ ] Ordenação: Mais recente primeiro
- [ ] "Ver Todas" → Página com feed completo paginado
- [ ] Real-time update (opcional): WebSocket para novas atividades

**Technical Context:**
- Reutilizar tabela client_events
- Adicionar field user_id para filtrar por corretor
- Query: SELECT com ORDER BY created_at DESC LIMIT 10

**Files Affected:**
- `web/src/components/dashboard/RecentActivityFeed.tsx`
- `web/src/components/dashboard/ActivityItem.tsx`

---

### Story 5.5: Quick Actions Panel
**Como** corretor
**Quero** ter atalhos para ações comuns
**Para que** eu acesse funcionalidades principais rapidamente

**Acceptance Criteria:**
- [ ] Painel "Ações Rápidas" no topo do dashboard (abaixo dos KPIs)
- [ ] Botões de ação:
  - ➕ Adicionar Cliente
  - 🔍 Buscar Imóveis
  - 📅 Agendar Visita
  - 📊 Ver Relatórios (futuro)
  - ⚙️ Configurações
- [ ] Cada botão abre modal ou navega para página relevante
- [ ] Destaque visual: Botões grandes, coloridos, com ícones
- [ ] Responsivo: 2 cols (mobile), 5 cols (desktop)

**Technical Context:**
- Links: React Router para navegação
- Modals: Para ações inline (ex: Adicionar Cliente)

**Files Affected:**
- `web/src/components/dashboard/QuickActionsPanel.tsx`

---

## Requisitos Técnicos

### Database Schema Updates

```sql
-- Add reputation_score to users table
ALTER TABLE users ADD COLUMN reputation_score INTEGER DEFAULT 0;

-- Create analytics cache table (opcional, para performance)
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value JSONB NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, metric_name, period_start, period_end)
);

CREATE INDEX idx_analytics_cache_user_metric ON analytics_cache(user_id, metric_name);
```

### API Endpoints

```
GET    /api/dashboard/kpis             - Get all KPI cards data
GET    /api/dashboard/charts           - Get all chart data
  Query: ?period=30d|3m|6m|1y
GET    /api/dashboard/reputation       - Get reputation details
GET    /api/dashboard/recent-activity  - Get recent activity feed
  Query: ?limit=10

GET    /api/analytics/clients-by-status     - Pie chart data
GET    /api/analytics/visits-per-month      - Bar chart data
GET    /api/analytics/conversion-funnel     - Funnel chart data
```

### Reputation Calculation Service

```javascript
// api/src/services/reputation.service.ts
export async function calculateReputationScore(userId: string): Promise<number> {
  const stats = await db.query(`
    SELECT
      COUNT(*) FILTER (WHERE status NOT IN ('Archived', 'Inactive')) as active_clients,
      COUNT(*) FILTER (WHERE status = 'Inactive') as inactive_clients
    FROM clients WHERE user_id = $1
  `, [userId]);

  const visits = await db.query(`
    SELECT COUNT(*) FROM visits WHERE user_id = $1 AND status = 'Completed'
  `, [userId]);

  const offers = await db.query(`
    SELECT COUNT(*) FROM clients WHERE user_id = $1 AND status = 'Offer Made'
  `, [userId]);

  const closed = await db.query(`
    SELECT COUNT(*) FROM clients WHERE user_id = $1 AND status = 'Closed'
  `, [userId]);

  let score = 0;
  score += stats.active_clients * 2;
  score += visits.count * 3;
  score += offers.count * 5;
  score += closed.count * 10;
  score += Math.floor(closed.count / 3) * 5; // Win streak
  score -= stats.inactive_clients * 5;

  return Math.max(0, score);
}
```

---

## Métricas de Sucesso

- **Dashboard usage:** > 90% usuários ativos visitam dashboard diariamente
- **Engajamento:** 3+ sessões/semana (motivado por gamificação)
- **Reputação:** 40%+ corretores atingem "Good" ou "Elite" em 30 dias
- **Quick actions:** 60%+ ações iniciadas via dashboard

---

## Dependências

- Epic 1, 2, 3, 4 - BLOQUEANTES (dados para KPIs)
- Charting library (Recharts)
- Real-time (opcional): WebSocket/Server-Sent Events

---

## Riscos & Mitigação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Performance com cálculos complexos** | Média | Cache em Redis, pré-computar métricas |
| **Gamificação não engaja** | Média | A/B test de fórmulas, feedback de beta users |
| **Dados imprecisos** | Baixa | Testes automatizados para cálculos |

---

## Definition of Done

- [ ] KPI cards funcionando com dados reais
- [ ] 3 gráficos implementados e responsivos
- [ ] Sistema de reputação calculando corretamente
- [ ] Recent activity feed funcionando
- [ ] Quick actions navegando corretamente
- [ ] Testes unitários para cálculo de reputação
- [ ] Performance < 1s para carregar dashboard completo

---

**Epic Owner:** @dev
**Estimated Effort:** 3-4 semanas
**Priority:** P0 (Blocker para MVP)
