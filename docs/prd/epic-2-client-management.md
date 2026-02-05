# Epic 2: Client Management System

**Status:** 🔄 Em Desenvolvimento
**Prioridade:** Must Have (MVP - Fase 1)
**Fase:** Q2 2026 - MVP Launch
**Owner:** @dev

---

## Visão Geral

Implementar sistema completo de gestão de clientes (leads), permitindo que corretores criem, editem, acompanhem e organizem seus clientes potenciais. Inclui gestão de status, preferências, timeline de atividades e notas privadas.

## Objetivos de Negócio

- Permitir gestão centralizada de todos os clientes
- Reduzir 30% tempo em tarefas administrativas
- Aumentar 15% taxa de fechamento com melhor organização
- Substituir Excel + WhatsApp por solução integrada

## User Stories

### Story 2.1: CRUD de Clientes
**Como** corretor
**Quero** criar, visualizar, editar e deletar clientes
**Para que** eu possa gerenciar minha base de leads

**Acceptance Criteria:**
- [ ] Criar novo cliente com dados obrigatórios (nome, email/telefone)
- [ ] Campos opcionais: telefone secundário, notas, origem do lead
- [ ] Listagem de clientes com paginação (20 por página)
- [ ] Filtros: status, origem, data de criação
- [ ] Busca por nome, email ou telefone
- [ ] Visualizar detalhes completos de um cliente
- [ ] Editar informações do cliente
- [ ] Deletar cliente (soft delete com confirmação)
- [ ] Validação: email único por corretor

**Technical Context:**
- Backend: REST API com Prisma ORM
- Frontend: React + TypeScript + Tailwind
- State management: TanStack Query para cache
- Validação: Zod schemas

**Files Affected:**
- `api/src/routes/clients.routes.ts`
- `api/src/controllers/clients.controller.ts`
- `api/src/services/clients.service.ts`
- `web/src/pages/Clients/ClientList.tsx`
- `web/src/pages/Clients/ClientDetails.tsx`
- `web/src/components/clients/ClientForm.tsx`

---

### Story 2.2: Client Status Management
**Como** corretor
**Quero** definir e atualizar o status de cada cliente
**Para que** eu saiba em que fase do funil cada lead está

**Acceptance Criteria:**
- [ ] Status disponíveis: Searching, Visiting, Offer Made, Closed, Inactive, Archived
- [ ] Status inicial: Searching (default)
- [ ] Dropdown para alterar status facilmente
- [ ] Histórico de mudanças de status (timeline)
- [ ] Badge colorido indicando status atual
- [ ] Filtro na lista por status
- [ ] Contador de clientes por status no dashboard

**Status Definitions:**
- **Searching:** Cliente procurando imóveis ativamente
- **Visiting:** Cliente agendou ou realizou visitas
- **Offer Made:** Cliente fez proposta em imóvel
- **Closed:** Negócio fechado (compra/aluguel concluído)
- **Inactive:** Cliente sem atividade há 30+ dias
- **Archived:** Cliente arquivado (não interessa mais)

**Technical Context:**
- Enum no Prisma: ClientStatus
- Cores dos badges: Configuradas em theme
- Timeline: Tabela de eventos (client_events)

**Files Affected:**
- `api/prisma/schema.prisma` (enum ClientStatus)
- `web/src/components/clients/ClientStatusBadge.tsx`
- `web/src/components/clients/ClientStatusDropdown.tsx`
- `api/src/controllers/clients.controller.ts`

---

### Story 2.3: Client Preferences
**Como** corretor
**Quero** registrar as preferências de busca de cada cliente
**Para que** a IA possa recomendar imóveis relevantes

**Acceptance Criteria:**
- [ ] Campos de preferência:
  - Tipo de imóvel: Apartamento, Moradia, Terreno, Comercial
  - Localização: Cidades/bairros desejados (multi-select)
  - Budget: Faixa de preço (min-max)
  - Quartos: Número mínimo (0-5+)
  - Casas de banho: Número mínimo (0-4+)
  - Amenidades: Garagem, Elevador, Piscina, Jardim, Varanda, etc. (multi-select)
  - Certificado energético: Mínimo aceitável (A+ a G)
  - Observações adicionais: Campo texto livre
- [ ] Preferências editáveis a qualquer momento
- [ ] Histórico de mudanças de preferências
- [ ] Preferências usadas como default na busca de imóveis
- [ ] Indicador visual se preferências não estão preenchidas

**Technical Context:**
- JSON field para amenidades (PostgreSQL JSONB)
- Validação: Budget min < Budget max
- Location: Integração futura com Google Places API

**Files Affected:**
- `api/prisma/schema.prisma` (client_preferences table)
- `web/src/components/clients/ClientPreferencesForm.tsx`
- `api/src/controllers/clients.controller.ts`

---

### Story 2.4: Client Timeline & Activities
**Como** corretor
**Quero** ver uma timeline de todas as atividades relacionadas ao cliente
**Para que** eu tenha contexto completo do relacionamento

**Acceptance Criteria:**
- [ ] Timeline exibe cronologicamente:
  - Cliente criado
  - Status alterado
  - Preferências atualizadas
  - Imóvel curtido/rejeitado
  - Visita agendada/realizada
  - Proposta feita
  - Notas adicionadas
  - Comunicação registrada (futuro)
- [ ] Cada item mostra: data/hora, tipo de evento, descrição, autor
- [ ] Timeline ordenada: mais recente primeiro
- [ ] Possibilidade de filtrar por tipo de evento
- [ ] Ícones diferentes para cada tipo de evento
- [ ] Link para detalhes (ex: clicar em "Visita agendada" abre detalhes da visita)

**Technical Context:**
- Tabela: client_events
- Eventos criados automaticamente via triggers ou service layer
- Formato: Event sourcing simplificado

**Files Affected:**
- `api/prisma/schema.prisma` (client_events table)
- `web/src/components/clients/ClientTimeline.tsx`
- `web/src/components/clients/TimelineEvent.tsx`
- `api/src/services/events.service.ts`

---

### Story 2.5: Private Notes
**Como** corretor
**Quero** adicionar notas privadas sobre cada cliente
**Para que** eu registre informações importantes e contexto

**Acceptance Criteria:**
- [ ] Seção "Notas" na página do cliente
- [ ] Adicionar nova nota com editor de texto (rich text opcional)
- [ ] Notas ordenadas: mais recente primeiro
- [ ] Cada nota exibe: data/hora, texto, autor (se multi-user no futuro)
- [ ] Editar nota existente
- [ ] Deletar nota (com confirmação)
- [ ] Busca dentro das notas
- [ ] Notas são privadas (não compartilhadas com cliente)
- [ ] Markdown support opcional

**Technical Context:**
- Tabela: client_notes
- Editor: Textarea simples no MVP, rich text em Fase 2
- Markdown: Optional com biblioteca react-markdown

**Files Affected:**
- `api/prisma/schema.prisma` (client_notes table)
- `web/src/components/clients/ClientNotes.tsx`
- `web/src/components/clients/NoteForm.tsx`
- `api/src/routes/clients.routes.ts`

---

## Requisitos Técnicos

### Database Schema (Supabase/PostgreSQL)

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Basic Info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  phone_secondary VARCHAR(20),
  origin VARCHAR(100), -- Como conheceu: Indicação, Instagram, Google, etc.

  -- Status
  status VARCHAR(50) DEFAULT 'Searching',

  -- Preferences (denormalized for quick access)
  property_type VARCHAR(50), -- Apartamento, Moradia, Terreno, Comercial
  location_cities TEXT[], -- Array de cidades
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  bedrooms_min INTEGER,
  bathrooms_min INTEGER,
  amenities JSONB, -- {garage: true, elevator: false, ...}
  energy_cert_min VARCHAR(2), -- A+, A, B, C, D, E, F, G
  notes_preferences TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE client_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  event_type VARCHAR(50) NOT NULL, -- created, status_changed, preferences_updated, etc.
  event_data JSONB, -- Detalhes do evento
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  content TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_last_activity ON clients(last_activity_at);
CREATE INDEX idx_client_events_client_id ON client_events(client_id);
CREATE INDEX idx_client_notes_client_id ON client_notes(client_id);
```

### API Endpoints

```
GET    /api/clients                - List all clients (with filters, pagination)
POST   /api/clients                - Create new client
GET    /api/clients/:id            - Get client details
PATCH  /api/clients/:id            - Update client
DELETE /api/clients/:id            - Delete client (soft delete)

PATCH  /api/clients/:id/status     - Update client status
PATCH  /api/clients/:id/preferences - Update client preferences

GET    /api/clients/:id/timeline   - Get client timeline events
POST   /api/clients/:id/events     - Create manual event (optional)

GET    /api/clients/:id/notes      - Get all notes for client
POST   /api/clients/:id/notes      - Create new note
PATCH  /api/clients/:id/notes/:noteId - Update note
DELETE /api/clients/:id/notes/:noteId - Delete note
```

---

## Métricas de Sucesso

- **Tempo para adicionar cliente:** < 30 segundos
- **Taxa de preenchimento de preferências:** > 80%
- **Clientes por corretor ativo:** 15-20 (target)
- **Tempo economizado vs Excel:** 30% redução
- **Uso de notas:** > 60% corretores adicionam notas regularmente

---

## Dependências

- Epic 1 (Authentication) - BLOQUEANTE
- Supabase (PostgreSQL)
- Frontend framework (React + TanStack Query)

---

## Riscos & Mitigação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Complexidade de filtros** | Média | Implementar filtros básicos primeiro, avançados em Fase 2 |
| **Performance com muitos clientes** | Média | Paginação + indexes + cache com TanStack Query |
| **Data loss** | Baixa | Soft deletes, backups automáticos |

---

## Definition of Done

- [ ] Todas as stories implementadas
- [ ] CRUD completo funcionando
- [ ] Testes unitários > 80% coverage
- [ ] Testes E2E para fluxo principal
- [ ] Performance < 500ms (p95) para listagem
- [ ] Mobile responsivo
- [ ] Documentação da API

---

**Epic Owner:** @dev
**Estimated Effort:** 3-4 semanas
**Priority:** P0 (Blocker para MVP)
