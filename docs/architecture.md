# ImobCurator 3.0 - Documento de Arquitetura

**Versão:** 1.0
**Data:** 31 Janeiro 2026
**Status:** 🔄 Em Desenvolvimento
**Arquiteto:** @architect (Aria)

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Análise do Estado Atual](#análise-do-estado-atual)
3. [Arquitetura Alvo](#arquitetura-alvo)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Arquitetura de Componentes](#arquitetura-de-componentes)
6. [Modelo de Dados](#modelo-de-dados)
7. [Arquitetura de Segurança](#arquitetura-de-segurança)
8. [Estratégia de Deployment](#estratégia-de-deployment)
9. [Integrações Externas](#integrações-externas)
10. [Roadmap Técnico](#roadmap-técnico)

---

## 🎯 Visão Geral do Sistema

### O Que é ImobCurator?

**ImobCurator** é um sistema CRM especializado para corretores imobiliários em Portugal, com foco em:

- 🏠 **Gestão de Propriedades** - Catálogo e busca inteligente de imóveis
- 👥 **Gestão de Clientes** - CRM completo com histórico e preferências
- 📅 **Agendamento de Visitas** - Sistema de scheduling com timeline
- 📊 **Analytics & Relatórios** - Métricas de desempenho e reputação
- 🤖 **IA Assistida** - Integração com Gemini AI para recomendações

### Diferenciais

1. **Sistema de Reputação** - Gamificação para corretores (Elite, Good, Neutral, Risk)
2. **Busca Inteligente** - AI-powered com dados de mercado real 2026
3. **Multi-idioma** - Suporte para PT-PT, PT-BR, EN, FR
4. **Freemium Model** - Planos Free (2 buscas) e Pro (ilimitado)

---

## 🔍 Análise do Estado Atual

### ✅ O Que Já Existe

#### Frontend (React + TypeScript)

| Componente | Status | Descrição |
|------------|--------|-----------|
| **App.tsx** | ✅ Completo | Estrutura principal com routing |
| **Dashboard** | ✅ Completo | Visão geral com métricas |
| **ClientPortal** | ✅ Completo | Portal de clientes |
| **ClientManager** | ✅ Completo | Gestão individual de cliente |
| **Properties** | ✅ Completo | Listagem de propriedades |
| **PropertyDetail** | ✅ Completo | Detalhes de propriedade |
| **PropertyImport** | ✅ Completo | Importação de imóveis |
| **Visits** | ✅ Completo | Agendamento de visitas |
| **VisitDetail** | ✅ Completo | Detalhes de visita |
| **Reports** | ✅ Completo | Analytics e relatórios |
| **Settings** | ✅ Completo | Configurações de usuário |
| **Login** | ⚠️ Mock | Autenticação em memória |

#### Serviços

| Serviço | Status | Descrição |
|---------|--------|-----------|
| **propertySearchService** | ✅ Completo | Busca simulada com dados reais |
| **aiService** | ✅ Completo | Integração Gemini AI |
| **storage** | ⚠️ LocalStorage | Persistência temporária |
| **tracking** | ✅ Completo | Analytics básico |

#### Features Implementadas

- ✅ Interface responsiva (Mobile-first)
- ✅ Dark mode
- ✅ Multi-idioma (i18n)
- ✅ Sistema de notificações
- ✅ Timeline de atividades
- ✅ Sistema de reputação
- ✅ Busca de imóveis (simulada)
- ✅ Gestão de clientes
- ✅ Agendamento de visitas
- ✅ Dashboard com KPIs

### ❌ Gaps Críticos

#### Backend

- ❌ **API REST não existe** - Sem backend implementado
- ❌ **Banco de dados** - Sem persistência real
- ❌ **Autenticação** - Mock em memória, sem JWT/sessions
- ❌ **Autorização** - Sem RBAC ou permissões

#### Infraestrutura

- ❌ **Deployment** - Sem CI/CD configurado
- ❌ **Ambiente de produção** - Sem servidor
- ❌ **Monitoramento** - Sem logs ou métricas
- ❌ **Backup** - Sem estratégia de backup

#### Integrações

- ❌ **APIs de imóveis** - Usando simulação (Idealista, Imovirtual indisponíveis)
- ❌ **Sistema de pagamentos** - Planos Free/Pro sem Stripe/PayPal
- ❌ **Email/SMS** - Sem notificações reais
- ❌ **Cloud storage** - Sem upload de imagens real

#### Segurança

- ❌ **HTTPS** - Sem SSL
- ❌ **CORS** - Não configurado
- ❌ **Rate limiting** - Sem proteção DDoS
- ❌ **Validação de dados** - Validação apenas frontend
- ❌ **GDPR compliance** - Sem política de privacidade implementada

---

## 🏗️ Arquitetura Alvo

### Visão de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React App (Vite + TypeScript)                      │  │
│  │   • Components (Dashboard, CRM, Properties)          │  │
│  │   • State Management (React Context + hooks)         │  │
│  │   • Routing (React Router)                           │  │
│  │   • AI Integration (Gemini AI)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Node.js + Express (ou Fastify)                     │  │
│  │   • REST API endpoints                               │  │
│  │   • JWT Authentication                               │  │
│  │   • Business Logic                                   │  │
│  │   • Validation & Error Handling                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL/ORM
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   PostgreSQL   │  │   Redis        │  │   S3/Blob    │  │
│  │   (Primary DB) │  │   (Cache)      │  │   (Images)   │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ APIs
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  • Gemini AI (Recomendações)                                │
│  • Stripe (Pagamentos)                                       │
│  • SendGrid/Mailgun (Email)                                  │
│  • Twilio (SMS - opcional)                                   │
│  • Property APIs (Idealista - quando disponível)             │
└─────────────────────────────────────────────────────────────┘
```

### Padrões Arquiteturais

1. **Three-Tier Architecture**
   - Presentation → API → Data
   - Separação clara de responsabilidades

2. **RESTful API Design**
   - Recursos: `/api/v1/properties`, `/api/v1/clients`, etc.
   - Verbos HTTP semânticos
   - Versionamento de API

3. **Repository Pattern**
   - Abstração da camada de dados
   - Facilita testes e mudanças de DB

4. **Service Layer**
   - Lógica de negócio isolada
   - Reutilizável entre controllers

---

## 🛠️ Stack Tecnológico

### Frontend (Existente)

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.2.3 | UI Framework |
| **TypeScript** | 5.8.2 | Type safety |
| **Vite** | 6.2.0 | Build tool |
| **React Router** | 7.13.0 | Routing |
| **Lucide React** | 0.563.0 | Icons |
| **Tailwind CSS** | - | Styling (assumido) |

### Backend (Proposto)

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 20+ LTS | Runtime |
| **Express** ou **Fastify** | Latest | API Framework |
| **TypeScript** | 5.8+ | Type safety |
| **Prisma** | Latest | ORM |
| **Zod** | Latest | Validation |
| **JWT** | Latest | Authentication |

### Banco de Dados (Proposto)

| Tecnologia | Propósito |
|------------|-----------|
| **PostgreSQL** | Primary database |
| **Redis** | Cache + sessions |
| **S3/Azure Blob** | Image storage |

### DevOps & Infraestrutura (Proposto)

| Tecnologia | Propósito |
|------------|-----------|
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD |
| **Railway/Vercel** | Hosting (frontend) |
| **Railway/Render** | Hosting (backend) |
| **Supabase** | Alternative (BaaS) |

### Integrações (Proposto)

| Serviço | Propósito |
|---------|-----------|
| **Gemini AI** | Já integrado (recomendações) |
| **Stripe** | Pagamentos (Free/Pro) |
| **SendGrid** | Emails transacionais |
| **Twilio** | SMS (opcional) |
| **Cloudinary** | Image optimization |

---

## 🧩 Arquitetura de Componentes

### Frontend Architecture

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── PropertySearchDemo.tsx
│   └── shared/         # Componentes genéricos
├── pages/              # Páginas/rotas
│   ├── Dashboard.tsx
│   ├── ClientPortal.tsx
│   ├── Properties.tsx
│   └── ...
├── services/           # Lógica de negócio
│   ├── aiService.ts
│   ├── propertySearchService.ts
│   └── api/            # [NOVO] Cliente API
│       ├── client.ts
│       ├── auth.ts
│       ├── properties.ts
│       ├── clients.ts
│       └── visits.ts
├── contexts/           # Estado global
│   ├── LanguageContext.tsx
│   └── AuthContext.tsx # [NOVO]
├── hooks/              # Custom hooks
│   └── useAuth.ts      # [NOVO]
├── types/              # TypeScript types
│   ├── types.ts
│   └── api.ts          # [NOVO]
├── utils/              # Utilitários
│   ├── storage.ts
│   ├── tracking.ts
│   └── validation.ts   # [NOVO]
└── constants.ts
```

### Backend Architecture (Proposta)

```
backend/
├── src/
│   ├── api/            # API routes
│   │   ├── auth.routes.ts
│   │   ├── properties.routes.ts
│   │   ├── clients.routes.ts
│   │   └── visits.routes.ts
│   ├── controllers/    # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── properties.controller.ts
│   │   └── ...
│   ├── services/       # Business logic
│   │   ├── auth.service.ts
│   │   ├── property.service.ts
│   │   └── ai.service.ts
│   ├── repositories/   # Data access
│   │   ├── user.repository.ts
│   │   ├── property.repository.ts
│   │   └── ...
│   ├── middleware/     # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/         # Prisma models
│   │   └── schema.prisma
│   ├── utils/          # Utilities
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   └── logger.ts
│   ├── config/         # Configuration
│   │   └── index.ts
│   └── index.ts        # App entry point
├── tests/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 💾 Modelo de Dados

### Entidades Principais

#### User (Corretor)

```typescript
interface User {
  id: string;              // UUID
  email: string;           // Unique
  passwordHash: string;
  name: string;
  role: string;
  agency: Agency;
  licenseNumber?: string;
  phone: string;
  avatar?: string;
  micrositeUrl: string;
  plan: 'Free' | 'Pro';
  searchesUsed: number;
  maxSearches: number;
  reputation: {
    level: ReputationLevel;
    winStreak: number;
    lossStreak: number;
  };
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Client

```typescript
interface Client {
  id: string;
  userId: string;          // FK -> User
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  locationInterest: string;
  budget: string;
  status: ClientStatus;
  lastActivity: Date;
  archivedDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  properties: Property[];
  visits: Visit[];
  activities: Activity[];
}
```

#### Property

```typescript
interface Property {
  id: string;
  userId: string;          // FK -> User (corretor)
  title: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  images: string[];        // URLs adicionais
  url?: string;            // Link original
  tags: string[];
  status: PropertyStatus;
  agentNote?: string;
  source: 'manual' | 'import' | 'api';
  isSimulated: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  visits: Visit[];
  clients: ClientProperty[]; // Many-to-many
}
```

#### Visit

```typescript
interface Visit {
  id: string;
  propertyId: string;      // FK -> Property
  clientId: string;        // FK -> Client
  userId: string;          // FK -> User (corretor)
  date: Date;
  time: string;
  status: VisitStatus;
  notes?: string;
  timeline: VisitTimeline[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Activity

```typescript
interface Activity {
  id: string;
  userId: string;          // FK -> User
  clientId?: string;       // FK -> Client (opcional)
  type: ActivityType;
  title: string;
  description: string;
  isUrgent: boolean;
  createdAt: Date;
}
```

### Schema Prisma (Proposta)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String
  role          String
  agency        Agency
  licenseNumber String?
  phone         String
  avatar        String?
  micrositeUrl  String
  plan          Plan     @default(FREE)
  searchesUsed  Int      @default(0)
  maxSearches   Int      @default(2)

  // JSON fields
  reputation    Json
  settings      Json

  // Relations
  clients       Client[]
  properties    Property[]
  visits        Visit[]
  activities    Activity[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("users")
}

model Client {
  id              String       @id @default(uuid())
  userId          String
  name            String
  email           String
  phone           String
  avatar          String?
  locationInterest String
  budget          String
  status          ClientStatus @default(SEARCHING)
  lastActivity    DateTime     @default(now())
  archivedDate    DateTime?

  // Relations
  user            User         @relation(fields: [userId], references: [id])
  visits          Visit[]
  properties      ClientProperty[]
  activities      Activity[]

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@map("clients")
}

model Property {
  id          String         @id @default(uuid())
  userId      String
  title       String
  location    String
  price       Decimal
  currency    String         @default("EUR")
  bedrooms    Int
  bathrooms   Int
  area        Int
  imageUrl    String
  images      String[]
  url         String?
  tags        String[]
  status      PropertyStatus @default(NEW)
  agentNote   String?
  source      PropertySource @default(MANUAL)
  isSimulated Boolean        @default(false)

  // Relations
  user        User           @relation(fields: [userId], references: [id])
  visits      Visit[]
  clients     ClientProperty[]

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@map("properties")
}

model Visit {
  id         String      @id @default(uuid())
  propertyId String
  clientId   String
  userId     String
  date       DateTime
  time       String
  status     VisitStatus @default(REQUESTED)
  notes      String?
  timeline   Json[]

  // Relations
  property   Property    @relation(fields: [propertyId], references: [id])
  client     Client      @relation(fields: [clientId], references: [id])
  user       User        @relation(fields: [userId], references: [id])

  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@map("visits")
}

model ClientProperty {
  clientId   String
  propertyId String

  client     Client   @relation(fields: [clientId], references: [id])
  property   Property @relation(fields: [propertyId], references: [id])

  @@id([clientId, propertyId])
  @@map("client_properties")
}

model Activity {
  id          String       @id @default(uuid())
  userId      String
  clientId    String?
  type        ActivityType
  title       String
  description String
  isUrgent    Boolean      @default(false)

  // Relations
  user        User         @relation(fields: [userId], references: [id])
  client      Client?      @relation(fields: [clientId], references: [id])

  createdAt   DateTime     @default(now())

  @@map("activities")
}

enum Agency {
  INDEPENDENT
  REMAX
  KW
  ERA
  CENTURY21
  PRIVATE
  OTHER
}

enum Plan {
  FREE
  PRO
}

enum ClientStatus {
  SEARCHING
  VISITING
  OFFER_MADE
  CLOSED
  INACTIVE
  ARCHIVED
}

enum PropertyStatus {
  NEW
  LIKED
  DISCARDED
  VISIT_REQUESTED
}

enum PropertySource {
  MANUAL
  IMPORT
  API
}

enum VisitStatus {
  REQUESTED
  PENDING_CONFIRMATION
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum ActivityType {
  INQUIRY
  VISIT
  CONTRACT
  SYSTEM
}

enum ReputationLevel {
  ELITE
  GOOD
  NEUTRAL
  RISK
}
```

---

## 🔒 Arquitetura de Segurança

### Autenticação

**Estratégia:** JWT (JSON Web Tokens)

```typescript
// Flow de autenticação
POST /api/v1/auth/register
  ← { email, password, name, ... }
  → { user, accessToken, refreshToken }

POST /api/v1/auth/login
  ← { email, password }
  → { user, accessToken, refreshToken }

POST /api/v1/auth/refresh
  ← { refreshToken }
  → { accessToken }

POST /api/v1/auth/logout
  ← { refreshToken }
  → { success: true }
```

**Tokens:**
- **Access Token:** 15 minutos, armazenado em memória
- **Refresh Token:** 7 dias, armazenado em httpOnly cookie

### Autorização

**Estratégia:** RBAC (Role-Based Access Control)

**Roles:**
- `agent` - Corretor padrão
- `admin` - Administrador da agência
- `superadmin` - Administrador do sistema

**Permissions:**
```typescript
const permissions = {
  agent: [
    'clients:read', 'clients:write',
    'properties:read', 'properties:write',
    'visits:read', 'visits:write',
    'reports:read:own'
  ],
  admin: [
    ...agentPermissions,
    'users:read', 'users:write',
    'reports:read:all',
    'settings:write'
  ],
  superadmin: ['*']
};
```

### Validação de Dados

**Camadas de validação:**

1. **Frontend:** Zod schemas (feedback imediato)
2. **Backend:** Zod + Express middleware (segurança)
3. **Database:** Prisma constraints (integridade)

```typescript
// Exemplo: validação de criação de cliente
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{9}$/),
  budget: z.string().regex(/^\d+$/),
  locationInterest: z.string().min(2)
});

// Uso em middleware
app.post('/api/v1/clients',
  validate(createClientSchema),
  clientController.create
);
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Geral
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // 100 requests
});

// Auth endpoints (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 tentativas de login
});

app.use('/api/v1', limiter);
app.use('/api/v1/auth', authLimiter);
```

### CORS

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### HTTPS & SSL

- **Produção:** Obrigatório SSL/TLS
- **Dev:** Opcional (localhost)
- **Provider:** Let's Encrypt (gratuito) ou Railway/Vercel automático

### GDPR Compliance

**Requisitos:**

1. **Consentimento:** Cookie banner + opt-in explícito
2. **Direito ao esquecimento:** Endpoint DELETE /api/v1/users/me
3. **Portabilidade:** Endpoint GET /api/v1/users/me/export
4. **Privacidade:** Hash de senhas (bcrypt), criptografia de dados sensíveis
5. **Logs:** Auditoria de acesso a dados pessoais

---

## 🚀 Estratégia de Deployment

### Ambientes

| Ambiente | URL | Deploy | Propósito |
|----------|-----|--------|-----------|
| **Development** | localhost:5173 | Manual | Desenvolvimento local |
| **Staging** | staging.imobcurator.com | Auto (main branch) | Testes |
| **Production** | app.imobcurator.com | Manual (tags) | Produção |

### Infraestrutura Proposta

#### Opção 1: Infraestrutura Separada

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  • Vercel ou Netlify                                │
│  • Deploy automático de main                        │
│  • CDN global                                        │
│  • SSL automático                                    │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                    BACKEND API                       │
│  • Railway ou Render                                │
│  • Node.js + Express                                 │
│  • Auto-scaling                                      │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                    DATABASE                          │
│  • PostgreSQL (Railway/Supabase)                    │
│  • Redis (Upstash)                                   │
└─────────────────────────────────────────────────────┘
```

**Custo estimado:** €25-50/mês (staging + prod)

#### Opção 2: Supabase (BaaS - Backend as a Service)

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  • Vercel                                           │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                   SUPABASE                           │
│  • PostgreSQL (incluído)                            │
│  • Auth (incluído)                                   │
│  • Storage (incluído)                                │
│  • Edge Functions (serverless)                       │
│  • Realtime (WebSockets)                            │
└─────────────────────────────────────────────────────┘
```

**Custo estimado:** €0-25/mês (Free tier + Pro se necessário)

**✅ Recomendação:** Opção 2 (Supabase) para MVP, migrar para Opção 1 se necessário escalar.

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

### Monitoramento

**Logs:**
- **Frontend:** Vercel Analytics
- **Backend:** Winston + Railway logs
- **Errors:** Sentry

**Métricas:**
- **Uptime:** UptimeRobot (gratuito)
- **Performance:** Vercel Analytics + Railway metrics
- **Business:** Mixpanel ou PostHog

---

## 🔗 Integrações Externas

### 1. Gemini AI (Já Integrado)

**Propósito:** Recomendações inteligentes de imóveis

**Status:** ✅ Implementado

**Endpoints usados:**
- `generateContent()` - Busca e recomendações

**API Key:** `GEMINI_API_KEY` em `.env`

### 2. APIs de Imóveis (Futuro)

**Status:** ❌ Não disponíveis (usando simulação)

**Opções investigadas:**
- ✅ **Idealista.pt** - Requer aprovação
- ✅ **CASAFARI** - Comercial (€€€)
- ✅ **Propertium.io** - Trial 14 dias

**Ação:** Manter simulação até obter acesso

### 3. Stripe (Pagamentos)

**Propósito:** Planos Free → Pro

**Status:** ❌ A implementar

**Features necessárias:**
- Checkout sessions
- Customer portal
- Webhooks (subscription updates)

**Endpoints:**
```
POST /api/v1/billing/create-checkout-session
POST /api/v1/billing/create-portal-session
POST /api/v1/webhooks/stripe
```

### 4. SendGrid (Email)

**Propósito:** Emails transacionais

**Status:** ❌ A implementar

**Templates:**
- Confirmação de cadastro
- Reset de senha
- Notificação de visita agendada
- Relatórios semanais

### 5. Cloudinary (Imagens)

**Propósito:** Upload e otimização de imagens

**Status:** ❌ A implementar

**Features:**
- Upload de fotos de propriedades
- Resize automático
- CDN global

---

## 📋 Roadmap Técnico

### Fase 1: Backend MVP (4-6 semanas)

**Objetivo:** API funcional com autenticação

- [ ] Configurar projeto Node.js + TypeScript
- [ ] Implementar Prisma + PostgreSQL
- [ ] Criar endpoints de autenticação (register, login, refresh)
- [ ] Implementar CRUD de Clients
- [ ] Implementar CRUD de Properties
- [ ] Implementar CRUD de Visits
- [ ] Testes unitários (80% coverage)
- [ ] Deploy em Railway/Render

**Entregável:** Backend API completo

### Fase 2: Integração Frontend-Backend (2-3 semanas)

**Objetivo:** Conectar frontend ao backend

- [ ] Criar API client no frontend
- [ ] Implementar AuthContext + useAuth hook
- [ ] Substituir localStorage por chamadas API
- [ ] Implementar refresh token automático
- [ ] Tratamento de erros global
- [ ] Loading states em todas as páginas

**Entregável:** Aplicação full-stack funcional

### Fase 3: Features Críticas (3-4 semanas)

**Objetivo:** Completar funcionalidades essenciais

- [ ] Sistema de upload de imagens (Cloudinary)
- [ ] Integração Stripe (pagamentos)
- [ ] Emails transacionais (SendGrid)
- [ ] Sistema de notificações real-time (WebSockets ou Polling)
- [ ] Analytics e tracking

**Entregável:** MVP completo

### Fase 4: Otimização & Produção (2-3 semanas)

**Objetivo:** Preparar para lançamento

- [ ] Otimização de performance (caching, lazy loading)
- [ ] SEO (meta tags, sitemap)
- [ ] GDPR compliance (cookie banner, privacy policy)
- [ ] Testes E2E (Playwright ou Cypress)
- [ ] CI/CD pipeline
- [ ] Monitoramento (Sentry, logs)
- [ ] Documentação de API (Swagger)

**Entregável:** Aplicação em produção

### Fase 5: Pós-Lançamento (Contínuo)

- [ ] Migração de simulação para APIs reais (quando disponível)
- [ ] Features adicionais (calendário, relatórios avançados)
- [ ] Mobile app (React Native ou PWA)
- [ ] Integrações com CRMs externos

---

## 📊 Estimativas

### Esforço Total

| Fase | Duração | Complexidade |
|------|---------|--------------|
| Fase 1 | 4-6 semanas | Alta |
| Fase 2 | 2-3 semanas | Média |
| Fase 3 | 3-4 semanas | Alta |
| Fase 4 | 2-3 semanas | Média |
| **TOTAL** | **11-16 semanas** | **~3-4 meses** |

### Recursos Necessários

- **1 Backend Developer** (Fase 1, 3)
- **1 Frontend Developer** (Fase 2, 4)
- **1 Full-Stack Developer** (todas as fases) ← **Pode ser você!**

---

## 🎯 Próximos Passos Imediatos

1. ✅ **Criar PRD** (documento de requisitos) - @pm
2. ✅ **Criar Roadmap** (planejamento detalhado) - @pm
3. ⏭️ **Iniciar Backend MVP** (Fase 1)
   - Configurar projeto
   - Implementar autenticação
   - Deploy inicial

---

## 📚 Referências

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [GDPR Compliance Checklist](https://gdpr.eu/checklist/)
- [Supabase Documentation](https://supabase.com/docs)

---

**Documento criado por:** @architect (Aria)
**Data:** 31 Janeiro 2026
**Versão:** 1.0
**Status:** ✅ Completo

---

_Este documento deve ser atualizado conforme o projeto evolui._
