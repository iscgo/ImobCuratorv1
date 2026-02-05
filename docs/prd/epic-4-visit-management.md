# Epic 4: Visit Management System

**Status:** 📋 Planejado
**Prioridade:** Must Have (MVP - Fase 1)
**Fase:** Q2 2026 - MVP Launch
**Owner:** @dev

---

## Visão Geral

Implementar sistema de agendamento e gestão de visitas a imóveis, permitindo que corretores organizem, acompanhem e registrem feedback de todas as visitas realizadas com seus clientes.

## Objetivos de Negócio

- Aumentar 20% taxa de agendamento de visitas
- Reduzir no-shows com notificações e lembretes
- Centralizar gestão de visitas (substituir Google Calendar/papel)
- Timeline completa de relacionamento com cliente

## User Stories

### Story 4.1: CRUD de Visitas
**Como** corretor
**Quero** criar, visualizar, editar e cancelar visitas
**Para que** eu possa organizar minha agenda de visitas

**Acceptance Criteria:**
- [ ] Criar nova visita com dados obrigatórios:
  - Cliente (dropdown)
  - Imóvel (dropdown ou busca)
  - Data e hora
  - Duração (default: 1h)
- [ ] Campos opcionais: Notas, localização de encontro, contato responsável pelo imóvel
- [ ] Listagem de visitas com filtros:
  - Status (Requested, Confirmed, Completed, Cancelled)
  - Data (hoje, esta semana, este mês, custom range)
  - Cliente
  - Imóvel
- [ ] Visualizar detalhes completos de uma visita
- [ ] Editar visita (reagendar data/hora)
- [ ] Cancelar visita (com motivo opcional)
- [ ] Validação: Não permitir agendar no passado

**Technical Context:**
- Timezone: Europe/Lisbon
- Date handling: date-fns library
- Conflict detection: Avisar se já existe visita no mesmo horário

**Files Affected:**
- `api/src/routes/visits.routes.ts`
- `api/src/controllers/visits.controller.ts`
- `web/src/pages/Visits/VisitList.tsx`
- `web/src/pages/Visits/VisitForm.tsx`

---

### Story 4.2: Visit Status Management
**Como** corretor
**Quero** atualizar o status de cada visita
**Para que** eu acompanhe o progresso do agendamento

**Acceptance Criteria:**
- [ ] Status disponíveis:
  - **Requested:** Visita solicitada (aguardando confirmação do proprietário/imobiliária)
  - **Confirmed:** Visita confirmada
  - **Completed:** Visita realizada
  - **Cancelled:** Visita cancelada
- [ ] Mudança de status via dropdown ou botões de ação
- [ ] Histórico de mudanças registrado na timeline do cliente
- [ ] Badge colorido indicando status atual
- [ ] Notificações (futuro): Cliente recebe email quando status muda

**Status Workflow:**
```
Requested → Confirmed → Completed
     ↓           ↓
  Cancelled  Cancelled
```

**Technical Context:**
- Enum: VisitStatus no Prisma schema
- Validation: Apenas transições válidas permitidas

**Files Affected:**
- `api/prisma/schema.prisma` (enum VisitStatus)
- `web/src/components/visits/VisitStatusBadge.tsx`
- `web/src/components/visits/VisitStatusActions.tsx`

---

### Story 4.3: Visit Timeline & Details
**Como** corretor
**Quero** ver timeline detalhada de cada visita
**Para que** eu tenha contexto completo do processo

**Acceptance Criteria:**
- [ ] Timeline da visita exibe:
  - Visita criada (data/hora)
  - Status mudou (Requested → Confirmed → Completed)
  - Notas adicionadas
  - Feedback do cliente registrado
  - Proposta feita (se aplicável)
- [ ] Cada evento mostra: timestamp, descrição, autor
- [ ] Link rápido para cliente e imóvel relacionados
- [ ] Possibilidade de adicionar eventos manualmente

**Technical Context:**
- Reutilizar tabela client_events (com visit_id foreign key)
- Eventos criados automaticamente via triggers

**Files Affected:**
- `web/src/components/visits/VisitTimeline.tsx`
- `api/src/services/events.service.ts`

---

### Story 4.4: Post-Visit Feedback
**Como** corretor
**Quero** registrar feedback após cada visita
**Para que** eu saiba a opinião do cliente e próximos passos

**Acceptance Criteria:**
- [ ] Após marcar visita como "Completed", modal de feedback abre automaticamente
- [ ] Campos de feedback:
  - Interesse do cliente: Alto, Médio, Baixo
  - Comentários do cliente (texto livre)
  - Próximos passos: Fazer proposta, Continuar buscando, Desistiu
  - Pontos positivos (tags: Localização, Preço, Tamanho, Condições, etc.)
  - Pontos negativos (tags similares)
- [ ] Feedback opcional (pode pular)
- [ ] Feedback editável posteriormente
- [ ] Feedback registrado na timeline do cliente

**IA Learning (Futuro):**
- Feedback usado para melhorar recomendações da IA
- Padrões: "Cliente sempre rejeita imóveis sem garagem"

**Technical Context:**
- Tabela: visit_feedback
- Campos: visit_id, interest_level, client_comments, next_steps, tags_positive, tags_negative

**Files Affected:**
- `web/src/components/visits/VisitFeedbackModal.tsx`
- `api/prisma/schema.prisma` (visit_feedback table)

---

### Story 4.5: Visit Calendar View
**Como** corretor
**Quero** ver minhas visitas em formato de calendário
**Para que** eu visualize minha agenda de forma intuitiva

**Acceptance Criteria:**
- [ ] Vista de calendário mensal com visitas marcadas
- [ ] Cada visita exibe: horário, cliente, imóvel (resumido)
- [ ] Cores por status: Confirmed (verde), Requested (amarelo), Cancelled (vermelho)
- [ ] Navegação: Mês anterior/próximo, "Hoje"
- [ ] Clicar em visita abre detalhes
- [ ] Clicar em dia vazio permite criar nova visita
- [ ] Vista alternativa: Lista (já implementada em 4.1)
- [ ] Toggle entre Calendar View e List View
- [ ] Mobile: Lista por padrão, Calendar opcional

**Technical Context:**
- Library: react-big-calendar ou similar
- Responsive: Mobile exibe lista, desktop permite toggle

**Files Affected:**
- `web/src/pages/Visits/VisitCalendar.tsx`
- `web/src/components/visits/CalendarEvent.tsx`

---

## Requisitos Técnicos

### Database Schema (Supabase/PostgreSQL)

```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Schedule
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,

  -- Status
  status VARCHAR(50) DEFAULT 'Requested', -- Requested, Confirmed, Completed, Cancelled

  -- Details
  meeting_location VARCHAR(255), -- Onde se encontrar
  property_contact VARCHAR(255), -- Contato do responsável pelo imóvel
  notes TEXT,
  cancellation_reason TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

CREATE TABLE visit_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL UNIQUE REFERENCES visits(id) ON DELETE CASCADE,

  -- Feedback
  interest_level VARCHAR(20), -- High, Medium, Low
  client_comments TEXT,
  next_steps VARCHAR(50), -- MakeOffer, ContinueSearching, Gave Up

  -- Tags
  tags_positive TEXT[], -- ["location", "price", "size", ...]
  tags_negative TEXT[], -- ["noGarage", "oldBuilding", ...]

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_client_id ON visits(client_id);
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_scheduled_date ON visits(scheduled_date);
CREATE INDEX idx_visits_status ON visits(status);
```

### API Endpoints

```
GET    /api/visits                    - List all visits (filters, pagination)
POST   /api/visits                    - Create new visit
GET    /api/visits/:id                - Get visit details
PATCH  /api/visits/:id                - Update visit
DELETE /api/visits/:id                - Cancel visit

PATCH  /api/visits/:id/status         - Update visit status
GET    /api/visits/:id/timeline       - Get visit timeline

POST   /api/visits/:id/feedback       - Add feedback after visit
PATCH  /api/visits/:id/feedback       - Update feedback
GET    /api/visits/:id/feedback       - Get feedback

GET    /api/visits/calendar           - Get visits for calendar view
  Query: ?year=2026&month=5
```

---

## Métricas de Sucesso

- **Taxa de agendamento:** +20% vs. baseline
- **Uso de feedback:** > 70% visitas completadas têm feedback
- **No-show rate:** < 10% (com notificações em Fase 2)
- **Conversão visita → proposta:** > 30%

---

## Dependências

- Epic 1 (Authentication) - BLOQUEANTE
- Epic 2 (Client Management) - BLOQUEANTE
- Epic 3 (Property Management) - BLOQUEANTE

---

## Riscos & Mitigação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Conflitos de horário** | Média | Detecção automática + avisos |
| **Baixa adoção do feedback** | Alta | Modal automático + gamificação (futuro) |
| **Integração com calendário externo** | N/A (Fase 2) | MVP: Apenas interno, Google Calendar em Fase 2 |

---

## Definition of Done

- [ ] CRUD completo de visitas
- [ ] Calendar view responsivo
- [ ] Feedback pós-visita funcionando
- [ ] Timeline integrada com cliente
- [ ] Testes E2E para fluxo completo
- [ ] Performance < 500ms para listagem

---

**Epic Owner:** @dev
**Estimated Effort:** 2-3 semanas
**Priority:** P0 (Blocker para MVP)
