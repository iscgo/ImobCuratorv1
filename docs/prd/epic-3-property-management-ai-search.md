# Epic 3: Property Management & AI-Powered Search

**Status:** 🔄 Em Desenvolvimento
**Prioridade:** Must Have (MVP - Fase 1)
**Fase:** Q2 2026 - MVP Launch
**Owner:** @dev

---

## Visão Geral

Implementar sistema de gestão de imóveis e busca inteligente com IA (Gemini), o diferencial competitivo chave do ImobCurator. Permite que corretores busquem imóveis relevantes para seus clientes usando recomendações personalizadas baseadas em IA.

## Objetivos de Negócio

- Reduzir 50% tempo de busca manual de imóveis
- Match score > 85% (relevância IA vs. feedback corretor)
- 80%+ corretores usam busca IA regularmente
- Diferencial vs. competidores (CRM genéricos)

## User Stories

### Story 3.1: Property Listing & Basic Filters
**Como** corretor
**Quero** visualizar imóveis disponíveis com filtros básicos
**Para que** eu possa encontrar opções para meus clientes

**Acceptance Criteria:**
- [ ] Listagem de imóveis com paginação (20 por página)
- [ ] Cada card de imóvel exibe: foto, preço, localização, quartos, área, tipo
- [ ] Filtros básicos:
  - Tipo: Apartamento, Moradia, Terreno, Comercial
  - Localização: Cidade/distrito (dropdown)
  - Preço: Faixa (min-max)
  - Quartos: Mínimo (0-5+)
  - Área: Faixa (m²)
- [ ] Ordenação: Preço (asc/desc), Área, Data de publicação
- [ ] Busca por texto (endereço, título)
- [ ] Indicador de "Novo" (publicado há < 7 dias)
- [ ] Link para portal original (Idealista, Imovirtual)
- [ ] Responsive: Grid 1 col (mobile), 2 cols (tablet), 3 cols (desktop)

**Technical Context:**
- Dados: Base simulada (seed data com imóveis reais Portugal 2026)
- Futuro: Integração com APIs de portais (quando disponíveis)
- Performance: Índices em location, price, type

**Files Affected:**
- `api/src/routes/properties.routes.ts`
- `api/src/controllers/properties.controller.ts`
- `web/src/pages/Properties/PropertyList.tsx`
- `web/src/components/properties/PropertyCard.tsx`
- `web/src/components/properties/PropertyFilters.tsx`

---

### Story 3.2: AI-Powered Smart Search
**Como** corretor
**Quero** usar IA para encontrar imóveis perfeitos para meu cliente
**Para que** eu economize tempo e aumente taxa de conversão

**Acceptance Criteria:**
- [ ] Botão "Busca Inteligente" na página de imóveis
- [ ] Modal para selecionar cliente e ajustar critérios
- [ ] IA (Gemini) analisa:
  - Preferências do cliente (localização, budget, tipo, amenidades)
  - Histórico de imóveis curtidos/rejeitados pelo cliente
  - Padrões de sucesso de outros corretores (futuro)
- [ ] Retorna 15 imóveis ranqueados por "Match Score" (0-100%)
- [ ] Cada resultado exibe:
  - Match score com badge colorido (>90% verde, 70-89% amarelo, <70% laranja)
  - Razão do match ("Preço ideal para Avenidas Novas", "Localização perfeita")
  - Prós e contras
  - Todas as informações do imóvel
- [ ] Limite de buscas: Free plan (2/mês), Pro plan (ilimitado)
- [ ] Loading state durante busca (5-10 segundos)
- [ ] Feedback: Corretor pode marcar resultado como útil/inútil (treinar IA)
- [ ] Busca salva no histórico do cliente (timeline)

**Match Score Algorithm (MVP):**
```
score = 0
if price in budget range: score += 40
if location matches preferences: score += 30
if bedrooms >= min required: score += 10
if bathrooms >= min required: score += 5
if has required amenities: score += 15
Total max: 100
```

**IA Integration (Gemini):**
- Prompt: "Analise estas preferências: {client_prefs}. Ranqueie estes imóveis: {properties}. Retorne JSON com scores e razões."
- Timeout: 30s
- Fallback: Se IA falhar, usar algoritmo simples de match
- Rate limit: 60 req/min (free tier Gemini)

**Technical Context:**
- Gemini API: google-generative-ai package
- Prompt engineering: Template em `prompts/property-ranking.txt`
- Caching: Resultados em Redis (TTL 1h)
- Queue: Bull para processar buscas assíncronas se load alto

**Files Affected:**
- `api/src/services/ai-search.service.ts`
- `api/src/services/gemini.service.ts`
- `web/src/components/properties/SmartSearchModal.tsx`
- `web/src/components/properties/MatchScoreBadge.tsx`
- `api/src/prompts/property-ranking.txt`

---

### Story 3.3: Property Status Management
**Como** corretor
**Quero** marcar status de cada imóvel para cada cliente
**Para que** eu saiba quais já enviei, quais tiveram interesse, etc.

**Acceptance Criteria:**
- [ ] Status por par (client_id, property_id): New, Liked, Discarded, Visit Requested, Visited
- [ ] Badge de status no card do imóvel (quando visualizado no contexto de um cliente)
- [ ] Botões de ação rápida:
  - ❤️ Curtir (muda para Liked)
  - ❌ Descartar (muda para Discarded)
  - 📅 Agendar Visita (muda para Visit Requested e abre modal de agendamento)
- [ ] Filtro na lista: "Apenas Curtidos", "Apenas Novos", etc.
- [ ] Histórico: Mudanças de status registradas na timeline do cliente
- [ ] Contador: Dashboard exibe "5 imóveis curtidos", "3 visitas agendadas", etc.

**Technical Context:**
- Tabela: client_properties (relacionamento many-to-many)
- Campos: client_id, property_id, status, notes, created_at, updated_at

**Files Affected:**
- `api/prisma/schema.prisma` (client_properties table)
- `web/src/components/properties/PropertyActions.tsx`
- `api/src/routes/clients.routes.ts` (GET /clients/:id/properties)

---

### Story 3.4: Property Image Gallery
**Como** corretor
**Quero** ver galeria de fotos de cada imóvel
**Para que** eu possa avaliar visualmente e mostrar ao cliente

**Acceptance Criteria:**
- [ ] Clicar em card abre modal/página de detalhes
- [ ] Galeria de imagens com lightbox
- [ ] Navegação: Setas esquerda/direita, thumbnails
- [ ] Zoom na imagem
- [ ] Contador: "Foto 3 de 12"
- [ ] Se sem fotos: Placeholder "Sem imagens disponíveis"
- [ ] Lazy loading de imagens
- [ ] Otimização: Responsive images (srcset)

**Technical Context:**
- MVP: URLs de imagens seed data (Unsplash placeholders)
- Futuro: Upload manual de imagens pelo corretor
- Library: react-image-gallery ou similar

**Files Affected:**
- `web/src/pages/Properties/PropertyDetails.tsx`
- `web/src/components/properties/PropertyGallery.tsx`

---

### Story 3.5: Property Details & External Links
**Como** corretor
**Quero** ver todos os detalhes de um imóvel e acessar o anúncio original
**Para que** eu tenha informações completas

**Acceptance Criteria:**
- [ ] Página/modal de detalhes exibe:
  - Galeria de fotos
  - Preço destacado
  - Localização (endereço completo, cidade, distrito)
  - Características: Tipo, Quartos, Casas de banho, Área (m²), Ano de construção
  - Amenidades: Garagem, Elevador, Piscina, Jardim, Varanda, Ar condicionado, etc.
  - Certificado energético
  - Descrição completa
  - Link para portal original (botão CTA: "Ver no Idealista")
- [ ] Metadados: ID do imóvel, fonte (portal), data de publicação
- [ ] Botões de ação: Curtir, Descartar, Agendar Visita
- [ ] Compartilhar: Copiar link, WhatsApp (futuro)
- [ ] Responsivo: Layout otimizado para mobile

**Technical Context:**
- Source tracking: Campo `source` (idealista, imovirtual, manual)
- External links: Abrir em nova aba
- SEO: Meta tags para compartilhamento

**Files Affected:**
- `web/src/pages/Properties/PropertyDetails.tsx`
- `web/src/components/properties/PropertyInfo.tsx`
- `web/src/components/properties/PropertyAmenities.tsx`

---

## Requisitos Técnicos

### Database Schema (Supabase/PostgreSQL)

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50) NOT NULL, -- Apartamento, Moradia, Terreno, Comercial
  price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Location
  address VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  country VARCHAR(2) DEFAULT 'PT',
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Characteristics
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm DECIMAL(10, 2),
  lot_size_sqm DECIMAL(10, 2),
  year_built INTEGER,
  energy_cert VARCHAR(2), -- A+, A, B, C, D, E, F, G

  -- Amenities (JSONB for flexibility)
  amenities JSONB, -- {garage: true, elevator: true, pool: false, ...}

  -- Images
  images JSONB, -- [{url: "...", caption: "..."}, ...]
  main_image_url TEXT,

  -- Source
  source VARCHAR(50) NOT NULL, -- idealista, imovirtual, manual, seed
  external_url TEXT,
  external_id VARCHAR(255),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP DEFAULT NOW(),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  status VARCHAR(50) DEFAULT 'New', -- New, Liked, Discarded, Visit Requested, Visited
  match_score INTEGER, -- 0-100 (from AI)
  match_reason TEXT, -- Explicação do match
  notes TEXT, -- Notas privadas do corretor sobre este imóvel para este cliente

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(client_id, property_id)
);

CREATE TABLE property_search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  search_type VARCHAR(50) NOT NULL, -- basic, ai_powered
  filters JSONB, -- Filtros usados
  results_count INTEGER,
  ai_processing_time_ms INTEGER,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_published ON properties(published_at);
CREATE INDEX idx_client_properties_client ON client_properties(client_id);
CREATE INDEX idx_client_properties_status ON client_properties(status);
```

### API Endpoints

```
GET    /api/properties                    - List properties (filters, pagination)
GET    /api/properties/:id                - Get property details
POST   /api/properties                    - Create property (manual entry)
PATCH  /api/properties/:id                - Update property
DELETE /api/properties/:id                - Delete property

POST   /api/properties/search             - Basic search with filters
POST   /api/properties/search/ai          - AI-powered smart search
  Body: { client_id, filters (optional) }
  Returns: { properties: [...], match_scores: [...] }

GET    /api/clients/:id/properties        - Get properties for client (with status)
POST   /api/clients/:id/properties/:propId/status - Update property status for client
POST   /api/clients/:id/properties/:propId/notes  - Add notes about property for client
```

### Gemini AI Integration

**API Configuration:**
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

**Prompt Template:**
```
Você é um assistente especializado em imóveis. Analise as preferências do cliente e ranqueie os imóveis disponíveis.

PREFERÊNCIAS DO CLIENTE:
- Tipo: {property_type}
- Localização: {location}
- Budget: €{budget_min} - €{budget_max}
- Quartos: Mínimo {bedrooms}
- Amenidades desejadas: {amenities}

IMÓVEIS DISPONÍVEIS:
{properties_json}

TAREFA:
1. Calcule um match score (0-100) para cada imóvel
2. Explique a razão do score em português
3. Liste prós e contras
4. Retorne JSON no formato:
[
  {
    "property_id": "uuid",
    "match_score": 95,
    "match_reason": "Localização perfeita e preço ideal",
    "pros": ["Preço abaixo do budget", "Localização central"],
    "cons": ["Sem garagem"]
  }
]

Seja objetivo e útil. Foque em critérios práticos.
```

---

## Métricas de Sucesso

- **Uso de busca IA:** > 80% usuários ativos usam regularmente
- **Match score accuracy:** > 85% (baseado em feedback de corretores)
- **Tempo de busca:** < 10s para retornar 15 resultados
- **Taxa de conversão:** Imóveis curtidos → visitas agendadas > 40%
- **Limit conversão Free→Pro:** 60% upgrades por limite de buscas

---

## Dependências

- Epic 1 (Authentication) - BLOQUEANTE
- Epic 2 (Client Management) - BLOQUEANTE (preferências de clientes)
- Gemini API key (já configurado)
- Seed data com imóveis (Portugal 2026)

---

## Riscos & Mitigação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Gemini rate limits** | Alta | Queue de buscas, cache, fallback para algoritmo simples |
| **IA retorna resultados ruins** | Média | Prompt engineering iterativo, feedback loop de corretores |
| **Dados de imóveis desatualizados** | Alta (MVP) | Disclaimer "dados simulados", integração real em Fase 2 |
| **Performance com muitos imóveis** | Média | Índices, paginação, lazy loading |

---

## Definition of Done

- [ ] Listagem e filtros básicos funcionando
- [ ] Busca IA retornando resultados relevantes (validado com 5 corretores)
- [ ] Status management funcionando
- [ ] Galeria de imagens responsiva
- [ ] Performance < 10s para busca IA (p95)
- [ ] Testes E2E para fluxo completo
- [ ] Documentação da API
- [ ] Gemini usage monitorado (não exceder rate limits)

---

**Epic Owner:** @dev + @architect (IA integration)
**Estimated Effort:** 4-5 semanas
**Priority:** P0 (Blocker para MVP - Core diferencial)
