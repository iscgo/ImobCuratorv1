# ImobCurator 3.0 - Roadmap de Implementação

**Versão:** 1.0
**Data:** 31 Janeiro 2026
**Product Manager:** @pm (Morgan)
**Última Atualização:** 31 Janeiro 2026

---

## 📋 Visão Geral

Este roadmap detalha as **etapas específicas** para tornar o ImobCurator **100% operacional** e pronto para lançamento.

### Status Atual

| Componente | Status | Próximo Passo |
|------------|--------|---------------|
| **Frontend** | ✅ 90% Completo | Integração com API backend |
| **Backend** | ❌ 0% | Criar do zero |
| **Database** | ❌ 0% | Setup PostgreSQL |
| **Deploy** | ❌ 0% | Configurar infraestrutura |
| **Integrações** | ⚠️ Gemini OK | Adicionar Stripe, SendGrid, Cloudinary |

### Meta Principal

**🎯 Lançar MVP em Produção em 12-16 semanas (Q2 2026)**

---

## 🗓️ Timeline Macro

```
┌──────────────────────────────────────────────────────────────┐
│  FASE 1: Backend MVP (4-6 semanas)                           │
│  ✓ Setup projeto                                             │
│  ✓ API Authentication                                        │
│  ✓ CRUD Endpoints                                            │
│  ✓ Deploy inicial                                            │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│  FASE 2: Integração Frontend-Backend (2-3 semanas)           │
│  ✓ API Client                                                │
│  ✓ AuthContext                                               │
│  ✓ Substituir mock data                                      │
│  ✓ Error handling                                            │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│  FASE 3: Features Críticas (3-4 semanas)                     │
│  ✓ Upload de imagens                                         │
│  ✓ Stripe (pagamentos)                                       │
│  ✓ Emails transacionais                                      │
│  ✓ Onboarding wizard                                         │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│  FASE 4: Polish & Launch (2-3 semanas)                       │
│  ✓ Testes E2E                                                │
│  ✓ Bug fixes                                                 │
│  ✓ Landing page                                              │
│  ✓ 🚀 BETA LAUNCH                                            │
└──────────────────────────────────────────────────────────────┘

Total: 11-16 semanas (~3-4 meses)
```

---

## 📦 FASE 1: Backend MVP (4-6 semanas)

**Objetivo:** API REST funcional com autenticação e CRUD completo

### Semana 1: Setup & Estrutura

#### Tarefas

1. **Criar projeto backend** (1 dia)
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express typescript @types/express @types/node
   npm install -D ts-node nodemon
   ```
   - [ ] Configurar `tsconfig.json`
   - [ ] Setup scripts npm (`dev`, `build`, `start`)
   - [ ] Criar estrutura de pastas:
     ```
     backend/
     ├── src/
     │   ├── api/
     │   ├── controllers/
     │   ├── services/
     │   ├── repositories/
     │   ├── middleware/
     │   ├── models/
     │   ├── utils/
     │   ├── config/
     │   └── index.ts
     ├── tests/
     ├── prisma/
     │   └── schema.prisma
     └── package.json
     ```

2. **Setup Prisma** (1 dia)
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```
   - [ ] Configurar `.env` (DATABASE_URL)
   - [ ] Criar schema inicial (User model)
   - [ ] Gerar migration: `npx prisma migrate dev --name init`
   - [ ] Gerar cliente: `npx prisma generate`

3. **Express básico** (0.5 dia)
   - [ ] Criar `src/index.ts` com servidor básico
   - [ ] Instalar middlewares:
     ```bash
     npm install cors helmet morgan dotenv
     npm install -D @types/cors
     ```
   - [ ] Configurar CORS, helmet, morgan
   - [ ] Criar endpoint de health check: `GET /api/health`
   - [ ] Testar servidor: `npm run dev`

4. **Ambiente de dev** (0.5 dia)
   - [ ] Setup PostgreSQL local (Docker)
     ```yaml
     # docker-compose.yml
     version: '3.8'
     services:
       postgres:
         image: postgres:15
         ports:
           - '5432:5432'
         environment:
           POSTGRES_USER: imobcurator
           POSTGRES_PASSWORD: dev123
           POSTGRES_DB: imobcurator_dev
         volumes:
           - postgres_data:/var/lib/postgresql/data
     volumes:
       postgres_data:
     ```
   - [ ] Testar conexão com DB
   - [ ] Criar `.env.example`

**Deliverable:** Projeto backend configurado, Prisma funcionando, servidor rodando

---

### Semana 2: Autenticação

#### Tarefas

1. **Schema de User completo** (1 dia)
   - [ ] Atualizar `schema.prisma` com modelo User completo (ver architecture.md)
   - [ ] Adicionar enums (Agency, Plan, ReputationLevel)
   - [ ] Criar migration
   - [ ] Testar com Prisma Studio: `npx prisma studio`

2. **Auth utilities** (1 dia)
   ```bash
   npm install bcrypt jsonwebtoken
   npm install -D @types/bcrypt @types/jsonwebtoken
   ```
   - [ ] Criar `utils/jwt.ts` (sign, verify tokens)
   - [ ] Criar `utils/hash.ts` (bcrypt hash, compare)
   - [ ] Criar `utils/validation.ts` (Zod schemas)
     ```bash
     npm install zod
     ```

3. **Auth endpoints** (2 dias)
   - [ ] `POST /api/v1/auth/register`
     - Validar input (Zod)
     - Hash senha (bcrypt)
     - Criar usuário no DB
     - Retornar user + tokens
   - [ ] `POST /api/v1/auth/login`
     - Validar email/senha
     - Comparar hash
     - Retornar user + tokens
   - [ ] `POST /api/v1/auth/refresh`
     - Validar refresh token
     - Retornar novo access token
   - [ ] `POST /api/v1/auth/logout`
     - Invalidar refresh token (blacklist em Redis - futuro)
   - [ ] Criar testes unitários

4. **Auth middleware** (1 dia)
   - [ ] Criar `middleware/auth.middleware.ts`
     - Extrair token do header `Authorization: Bearer <token>`
     - Verificar JWT
     - Anexar userId ao `req.user`
     - Retornar 401 se inválido
   - [ ] Criar endpoint protegido de teste: `GET /api/v1/me`
   - [ ] Testar com Postman/Insomnia

**Deliverable:** Autenticação completa (register, login, protected routes)

---

### Semana 3-4: CRUD - Clients & Properties

#### Tarefas

1. **Models Prisma** (1 dia)
   - [ ] Criar models completos:
     - Client
     - Property
     - ClientProperty (many-to-many)
   - [ ] Migrations
   - [ ] Testar relações no Prisma Studio

2. **Clients CRUD** (2 dias)
   - [ ] `POST /api/v1/clients` - Criar cliente
   - [ ] `GET /api/v1/clients` - Listar clientes (com paginação)
   - [ ] `GET /api/v1/clients/:id` - Detalhes cliente
   - [ ] `PUT /api/v1/clients/:id` - Atualizar cliente
   - [ ] `DELETE /api/v1/clients/:id` - Deletar cliente (soft delete)
   - [ ] Filtros: status, localização, budget
   - [ ] Sorting: lastActivity, createdAt
   - [ ] Validação (Zod)
   - [ ] Autorização (apenas próprios clientes)
   - [ ] Testes unitários

3. **Properties CRUD** (2 dias)
   - [ ] `POST /api/v1/properties` - Criar propriedade
   - [ ] `GET /api/v1/properties` - Listar propriedades (paginação)
   - [ ] `GET /api/v1/properties/:id` - Detalhes propriedade
   - [ ] `PUT /api/v1/properties/:id` - Atualizar propriedade
   - [ ] `DELETE /api/v1/properties/:id` - Deletar propriedade
   - [ ] Filtros: tipo, localização, preço, quartos
   - [ ] Sorting: price, createdAt
   - [ ] Validação (Zod)
   - [ ] Autorização
   - [ ] Testes

4. **Search endpoint** (2 dias)
   - [ ] `POST /api/v1/properties/search`
     - Aceitar critérios de busca
     - Integrar com `propertySearchService.ts` existente
     - Retornar propriedades ranqueadas
     - Salvar busca no histórico (analytics)
     - Decrementar `searchesUsed` (Free plan)
   - [ ] Validação de plano (Free: 2 buscas, Pro: ilimitado)
   - [ ] Testes

**Deliverable:** CRUD completo de Clients e Properties, busca inteligente funcionando

---

### Semana 5: CRUD - Visits & Activities

#### Tarefas

1. **Visits CRUD** (2 dias)
   - [ ] Models Prisma (Visit)
   - [ ] `POST /api/v1/visits` - Agendar visita
   - [ ] `GET /api/v1/visits` - Listar visitas
     - Filtros: status, data, clientId, propertyId
     - Sorting: date
   - [ ] `GET /api/v1/visits/:id` - Detalhes visita
   - [ ] `PUT /api/v1/visits/:id` - Atualizar visita (status, notes)
   - [ ] `DELETE /api/v1/visits/:id` - Cancelar visita
   - [ ] Timeline tracking (JSON field)
   - [ ] Validação e testes

2. **Activities CRUD** (1 dia)
   - [ ] Model Prisma (Activity)
   - [ ] `POST /api/v1/activities` - Criar atividade
   - [ ] `GET /api/v1/activities` - Listar atividades (timeline)
   - [ ] Filtros: type, isUrgent, clientId
   - [ ] Auto-criar atividades em eventos (visita agendada, proposta enviada)
   - [ ] Testes

3. **Dashboard endpoint** (1 dia)
   - [ ] `GET /api/v1/dashboard/stats`
     - Total clientes (por status)
     - Total visitas (próximas, completadas)
     - Negócios fechados (mês atual vs. anterior)
     - Reputação (winStreak, level)
   - [ ] `GET /api/v1/dashboard/recent-activity`
     - Últimas 10 atividades
   - [ ] Cache com Redis (futuro)
   - [ ] Testes

4. **Error handling global** (1 dia)
   - [ ] Criar `middleware/error.middleware.ts`
     - Capturar erros
     - Formatar resposta consistente
     - Log de erros (Winston)
   - [ ] Criar utility de logger:
     ```bash
     npm install winston
     ```
   - [ ] Padronizar respostas de erro

**Deliverable:** CRUD completo de Visits e Activities, dashboard com KPIs

---

### Semana 6: Deploy & Testes

#### Tarefas

1. **Testes automatizados** (2 dias)
   ```bash
   npm install -D jest @types/jest ts-jest supertest @types/supertest
   ```
   - [ ] Configurar Jest
   - [ ] Testes unitários (services, utils)
   - [ ] Testes de integração (controllers + DB)
   - [ ] Target: 80%+ coverage
   - [ ] CI: rodar testes no GitHub Actions

2. **Setup Railway/Render** (1 dia)
   - [ ] Criar conta Railway (ou Render)
   - [ ] Criar projeto backend
   - [ ] Provisionar PostgreSQL
   - [ ] Configurar variáveis de ambiente:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `JWT_REFRESH_SECRET`
     - `GEMINI_API_KEY`
   - [ ] Deploy manual inicial

3. **CI/CD Pipeline** (1 dia)
   ```yaml
   # .github/workflows/backend-ci.yml
   name: Backend CI/CD
   on:
     push:
       branches: [main, develop]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm ci
         - run: npm test
     deploy:
       needs: test
       if: github.ref == 'refs/heads/main'
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: railwayapp/railway-deploy@v1
   ```
   - [ ] Configurar secrets no GitHub
   - [ ] Testar deploy automático

4. **Documentação API** (1 dia)
   ```bash
   npm install swagger-jsdoc swagger-ui-express
   npm install -D @types/swagger-jsdoc @types/swagger-ui-express
   ```
   - [ ] Adicionar Swagger decorators
   - [ ] Endpoint `/api-docs` com Swagger UI
   - [ ] Documentar todos endpoints
   - [ ] Testar no Swagger UI

**Deliverable:** Backend deployado em produção, testes passando, API documentada

---

## 📱 FASE 2: Integração Frontend-Backend (2-3 semanas)

**Objetivo:** Frontend consumindo API real, autenticação funcional

### Semana 7: API Client & Auth

#### Tarefas

1. **API Client base** (1 dia)
   ```bash
   cd frontend
   npm install axios
   ```
   - [ ] Criar `src/services/api/client.ts`
     ```typescript
     import axios from 'axios';

     const apiClient = axios.create({
       baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
       timeout: 10000,
     });

     // Interceptors (auth token, refresh, errors)
     ```
   - [ ] Configurar interceptors:
     - Request: adicionar `Authorization: Bearer <token>`
     - Response: tratar 401 (refresh token)
     - Error: formatar erros

2. **Auth service** (1 dia)
   - [ ] Criar `src/services/api/auth.ts`
     ```typescript
     export const authApi = {
       register: (data) => apiClient.post('/auth/register', data),
       login: (data) => apiClient.post('/auth/login', data),
       refresh: () => apiClient.post('/auth/refresh'),
       logout: () => apiClient.post('/auth/logout'),
       me: () => apiClient.get('/me'),
     };
     ```
   - [ ] Criar `src/hooks/useAuth.ts`
   - [ ] Criar `src/contexts/AuthContext.tsx`
     - Estado: `user`, `isLoading`, `isAuthenticated`
     - Métodos: `login()`, `register()`, `logout()`
     - Persistência de tokens (memory + httpOnly cookies)

3. **Atualizar Login page** (1 dia)
   - [ ] Remover autenticação mock
   - [ ] Integrar com `authApi.login()`
   - [ ] Loading states
   - [ ] Error handling (mensagens de erro)
   - [ ] Redirect após login

4. **Protected routes** (0.5 dia)
   - [ ] Criar `PrivateRoute` component
   - [ ] Proteger todas rotas (exceto Login)
   - [ ] Redirect para Login se não autenticado
   - [ ] Mostrar loading durante check de auth

5. **Registro de usuário** (0.5 dia)
   - [ ] Criar página `/register`
   - [ ] Form com campos (ver schema User)
   - [ ] Integrar com `authApi.register()`
   - [ ] Redirect para onboarding após registro

**Deliverable:** Autenticação funcional, frontend conectado ao backend

---

### Semana 8: CRUD Integration - Clients & Properties

#### Tarefas

1. **Clients API service** (1 dia)
   - [ ] Criar `src/services/api/clients.ts`
     ```typescript
     export const clientsApi = {
       list: (params) => apiClient.get('/clients', { params }),
       get: (id) => apiClient.get(`/clients/${id}`),
       create: (data) => apiClient.post('/clients', data),
       update: (id, data) => apiClient.put(`/clients/${id}`, data),
       delete: (id) => apiClient.delete(`/clients/${id}`),
     };
     ```
   - [ ] Criar `src/hooks/useClients.ts` (React Query)
     ```bash
     npm install @tanstack/react-query
     ```

2. **Atualizar ClientPortal page** (1 dia)
   - [ ] Substituir mock data por `useClients()`
   - [ ] Loading skeletons
   - [ ] Error states
   - [ ] Pagination
   - [ ] Filtros (status, search)

3. **Atualizar ClientManager page** (1 dia)
   - [ ] Buscar cliente por ID
   - [ ] Form de edição
   - [ ] Salvar alterações
   - [ ] Deletar cliente (confirmação)

4. **Properties API service** (1 dia)
   - [ ] Criar `src/services/api/properties.ts`
   - [ ] Criar `src/hooks/useProperties.ts`
   - [ ] Atualizar Properties page
   - [ ] Atualizar PropertyDetail page

5. **Search integration** (1 dia)
   - [ ] Atualizar `propertySearchService.ts`
     - Chamar backend API `/properties/search`
     - Fallback para simulação local (se API falhar)
   - [ ] Validar plano (Free: 2 buscas)
   - [ ] Mostrar aviso de limite (upgrade para Pro)

**Deliverable:** Frontend consumindo todos CRUDs, busca integrada

---

### Semana 9: CRUD Integration - Visits & Dashboard

#### Tarefas

1. **Visits API service** (1 dia)
   - [ ] Criar `src/services/api/visits.ts`
   - [ ] Criar `src/hooks/useVisits.ts`
   - [ ] Atualizar Visits page
   - [ ] Atualizar VisitDetail page
   - [ ] Adicionar agendamento de visita (form)

2. **Dashboard integration** (1 dia)
   - [ ] Criar `src/services/api/dashboard.ts`
   - [ ] Buscar stats reais
   - [ ] Atualizar Dashboard page com dados do backend
   - [ ] Loading states
   - [ ] Gráficos (com dados reais)

3. **Error handling global** (1 dia)
   - [ ] Criar `ErrorBoundary` component
   - [ ] Toasts de erro (react-hot-toast)
     ```bash
     npm install react-hot-toast
     ```
   - [ ] Retry logic (React Query)
   - [ ] Offline detection

4. **Loading states** (0.5 dia)
   - [ ] Skeleton loaders (react-loading-skeleton)
   - [ ] Spinners em botões
   - [ ] Progress bars (nprogress)

5. **Testes E2E setup** (0.5 dia)
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```
   - [ ] Configurar Playwright
   - [ ] Criar testes básicos (login, criar cliente)

**Deliverable:** Frontend 100% integrado, error/loading states, testes E2E

---

## 🚀 FASE 3: Features Críticas (3-4 semanas)

**Objetivo:** Features essenciais para lançamento (imagens, pagamentos, emails)

### Semana 10: Upload de Imagens

#### Tarefas

1. **Setup Cloudinary** (0.5 dia)
   - [ ] Criar conta Cloudinary
   - [ ] Obter API keys
   - [ ] Configurar env vars (backend)

2. **Backend - Upload endpoint** (1 dia)
   ```bash
   npm install cloudinary multer
   npm install -D @types/multer
   ```
   - [ ] `POST /api/v1/upload/property-image`
     - Multer middleware (buffer)
     - Upload para Cloudinary
     - Retornar URL da imagem
     - Limit: 5MB, formatos: jpg, png, webp

3. **Frontend - Upload component** (1 dia)
   - [ ] Criar `ImageUpload` component
     - Drag & drop (react-dropzone)
     - Preview
     - Progress bar
     - Error handling (tamanho, formato)
   - [ ] Integrar em PropertyImport page
   - [ ] Integrar em PropertyDetail (adicionar fotos)

4. **Image optimization** (0.5 dia)
   - [ ] Cloudinary transformations (resize, compress)
   - [ ] Lazy loading de imagens (react-lazy-load-image)
   - [ ] Placeholder blur (lqip)

**Deliverable:** Upload de imagens funcionando, otimizado

---

### Semana 11: Stripe (Pagamentos)

#### Tarefas

1. **Setup Stripe** (0.5 dia)
   - [ ] Criar conta Stripe
   - [ ] Criar produtos:
     - "ImobCurator Pro" - €10/mês
   - [ ] Obter API keys (test + live)
   - [ ] Configurar webhooks

2. **Backend - Stripe integration** (2 dias)
   ```bash
   npm install stripe
   ```
   - [ ] `POST /api/v1/billing/create-checkout-session`
     - Criar checkout session
     - Retornar URL de checkout
   - [ ] `POST /api/v1/billing/create-portal-session`
     - Customer portal (gerenciar assinatura)
   - [ ] `POST /api/v1/webhooks/stripe`
     - Webhook handler (subscription.created, updated, deleted)
     - Atualizar plano do usuário no DB
     - Verificar signature (segurança)

3. **Frontend - Pricing page** (1 dia)
   - [ ] Criar `src/pages/Pricing.tsx`
     - Comparação planos (Free vs Pro)
     - CTAs "Upgrade to Pro"
   - [ ] Integrar checkout:
     ```typescript
     const handleUpgrade = async () => {
       const { url } = await billingApi.createCheckoutSession();
       window.location.href = url; // Redirect para Stripe
     };
     ```

4. **Settings - Billing tab** (0.5 dia)
   - [ ] Adicionar tab "Billing" em Settings
   - [ ] Mostrar plano atual
   - [ ] Botão "Manage Subscription" (portal)
   - [ ] Histórico de pagamentos (via portal)

5. **Validação de plano** (1 dia)
   - [ ] Middleware backend: `checkPlan('pro')`
     - Bloquear buscas se Free e limite atingido
   - [ ] Frontend: Mostrar modal "Upgrade" se limite
   - [ ] Testes de upgrade flow

**Deliverable:** Stripe integrado, upgrade Free→Pro funcionando

---

### Semana 12: Emails Transacionais

#### Tarefas

1. **Setup SendGrid** (0.5 dia)
   - [ ] Criar conta SendGrid
   - [ ] Verificar domínio (DNS records)
   - [ ] Criar API key
   - [ ] Criar templates:
     - Welcome email
     - Confirmação de visita
     - Lembrete de visita (1 dia antes)
     - Reset de senha

2. **Backend - Email service** (1 dia)
   ```bash
   npm install @sendgrid/mail
   ```
   - [ ] Criar `services/email.service.ts`
     ```typescript
     export const emailService = {
       sendWelcome: (user) => {},
       sendVisitConfirmation: (visit) => {},
       sendVisitReminder: (visit) => {},
       sendPasswordReset: (user, token) => {},
     };
     ```
   - [ ] Integrar nos eventos:
     - Registro → Welcome email
     - Visita agendada → Confirmação
     - Senha esquecida → Reset email

3. **Frontend - Reset de senha** (1 dia)
   - [ ] Página `/forgot-password`
     - Form com email
     - Enviar email de reset
   - [ ] Página `/reset-password/:token`
     - Form com nova senha
     - Validar token
     - Atualizar senha

4. **Email previews** (0.5 dia)
   - [ ] Testar templates no SendGrid
   - [ ] Personalização (nome, logo, links)
   - [ ] Responsivo (mobile)

**Deliverable:** Emails transacionais enviados automaticamente

---

### Semana 13: Onboarding & Polish

#### Tarefas

1. **Onboarding wizard** (2 dias)
   - [ ] Criar `src/pages/Onboarding.tsx`
     - Passo 1: Dados profissionais (agência, licença)
     - Passo 2: Preferências de região
     - Passo 3: Importar clientes (CSV - opcional)
     - Passo 4: Tour guiado (react-joyride)
     - Passo 5: Primeira ação (criar cliente ou buscar imóvel)
   - [ ] Salvar progresso (localStorage)
   - [ ] Skip option (para experientes)
   - [ ] Redirect após completar

2. **Tour guiado** (1 dia)
   ```bash
   npm install react-joyride
   ```
   - [ ] Highlight 5 features chave:
     - Dashboard
     - Adicionar cliente
     - Buscar imóveis
     - Agendar visita
     - Ver reputação
   - [ ] Skip tour
   - [ ] Replay tour (Settings)

3. **Analytics tracking** (1 dia)
   ```bash
   npm install mixpanel-browser
   ```
   - [ ] Setup Mixpanel (ou PostHog)
   - [ ] Trackear eventos:
     - Signup
     - Login
     - Onboarding completed
     - Feature usage (busca, criar cliente, etc.)
     - Upgrade to Pro
   - [ ] Dashboard de analytics (Mixpanel)

4. **SEO & Meta tags** (0.5 dia)
   - [ ] Atualizar `index.html`:
     - Meta description
     - Open Graph tags (para social media)
     - Favicon
   - [ ] React Helmet (dynamic meta tags)
   - [ ] Sitemap.xml

**Deliverable:** Onboarding wizard, tour guiado, analytics

---

## 🎨 FASE 4: Polish & Launch (2-3 semanas)

**Objetivo:** Bugs corrigidos, landing page, beta launch

### Semana 14: Bug Fixes & QA

#### Tarefas

1. **Testes E2E completos** (2 dias)
   - [ ] Criar suíte de testes Playwright:
     - User journey completo (signup → busca → visita → dashboard)
     - Edge cases (erro de rede, sessão expirada)
   - [ ] Rodar testes em CI
   - [ ] Corrigir bugs encontrados

2. **Performance audit** (1 dia)
   - [ ] Lighthouse audit (target: 90+ score)
   - [ ] Otimizações:
     - Code splitting (React.lazy)
     - Tree shaking
     - Image lazy loading
     - Minificação
   - [ ] Bundle analysis (webpack-bundle-analyzer)

3. **Security audit** (1 dia)
   - [ ] OWASP Top 10 checklist
   - [ ] Rate limiting testado
   - [ ] CORS configurado corretamente
   - [ ] HTTPS em produção
   - [ ] Dependências sem vulnerabilidades (npm audit)

4. **User acceptance testing** (1 dia)
   - [ ] Recrutar 5-10 corretores para testar
   - [ ] Criar checklist de testes
   - [ ] Coletar feedback (bugs, UX)
   - [ ] Priorizar fixes críticos

**Deliverable:** App estável, bugs críticos corrigidos

---

### Semana 15: Landing Page & Marketing

#### Tarefas

1. **Landing page** (2 dias)
   - [ ] Criar `/landing` (ou domínio separado)
   - [ ] Seções:
     - Hero (headline + CTA)
     - Features (5 principais com ícones)
     - Pricing (Free vs Pro)
     - Testimonials (se disponível)
     - FAQ
     - Footer
   - [ ] Responsivo 100%
   - [ ] CTA leads para `/register`

2. **SEO otimização** (1 dia)
   - [ ] Keywords: "CRM corretor imobiliário Portugal"
   - [ ] Google Search Console setup
   - [ ] Sitemap submit
   - [ ] robots.txt
   - [ ] Structured data (schema.org)

3. **Marketing assets** (1 dia)
   - [ ] Screenshots do produto (5-10)
   - [ ] Demo video (2 min)
   - [ ] Social media graphics
   - [ ] Press kit (logos, descrição, fundadores)

4. **Beta invites** (1 dia)
   - [ ] Lista de 100 early adopters (emails)
   - [ ] Email de convite (SendGrid)
   - [ ] Incentivo: Pro grátis por 3 meses
   - [ ] Formulário de feedback

**Deliverable:** Landing page pronta, marketing setup

---

### Semana 16: Beta Launch 🚀

#### Tarefas

1. **Pre-launch checklist** (1 dia)
   - [ ] Todos features "Must Have" funcionando
   - [ ] Zero bugs críticos
   - [ ] Performance < 2s
   - [ ] 99.5% uptime (testado)
   - [ ] Monitoring ativo (Sentry)
   - [ ] Backup automático configurado

2. **Lançamento beta fechado** (Dia 1)
   - [ ] Enviar convites para 100 early adopters
   - [ ] Post no LinkedIn (fundador)
   - [ ] Post em grupos de corretores (Facebook)
   - [ ] Monitorar signups (Mixpanel)

3. **Suporte ativo** (Semana 16)
   - [ ] Criar canal de suporte (email ou Discord)
   - [ ] Responder bugs/questões < 24h
   - [ ] Coletar feedback estruturado (Typeform)
   - [ ] Daily check de métricas:
     - Signups
     - Activations (onboarding completado)
     - DAU/MAU
     - Erros (Sentry)

4. **Iteração rápida** (Semana 16)
   - [ ] Hot fixes de bugs críticos
   - [ ] Deploy diário (se necessário)
   - [ ] Atualizar roadmap baseado em feedback

**Deliverable:** 🎉 BETA LAUNCH COMPLETO!

---

## 📊 Métricas de Acompanhamento

### KPIs de Desenvolvimento

| Métrica | Target | Frequência |
|---------|--------|------------|
| **Velocity** | 10 story points/semana | Semanal |
| **Code coverage** | > 80% | A cada PR |
| **Build time** | < 5 min | Diário |
| **Deploy frequency** | 2-3x/semana | Semanal |

### KPIs de Produto (Beta)

| Métrica | Target Semana 1 | Target Semana 4 | Como Medir |
|---------|-----------------|-----------------|------------|
| **Signups** | 50 | 200 | Mixpanel |
| **Activation** | 60% | 70% | Onboarding completed |
| **D7 Retention** | 30% | 40% | Active 7 dias após signup |
| **Critical bugs** | < 5 | 0 | Sentry |

### KPIs de Negócio (Pós-Beta)

| Métrica | Target Q3 2026 | Como Medir |
|---------|----------------|------------|
| **MAU** | 500 | Mixpanel |
| **Conversão Free→Pro** | 15% | Stripe |
| **MRR** | €750 | Stripe |
| **NPS** | > 30 | Survey |

---

## ⚠️ Riscos & Contingências

### Riscos Técnicos

| Risco | Probabilidade | Impacto | Contingência |
|-------|---------------|---------|--------------|
| **Atrasos no backend** | Média | Alto | Contratar freelancer backend |
| **Stripe sandbox issues** | Baixa | Médio | Documentação Stripe, suporte |
| **Performance problems** | Média | Médio | Caching (Redis), otimização de queries |
| **Deploy failures** | Baixa | Alto | Rollback automático, staging env |

### Riscos de Timeline

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Fase 1 atrasa 2 semanas** | Média | Reduzir escopo Fase 3 (remover emails) |
| **QA encontra bugs críticos** | Alta | Buffer de 1 semana (Semana 17) |
| **Early adopters não engajam** | Média | Iteração rápida, pivot se necessário |

---

## 🎯 Critérios de Sucesso do Roadmap

### MVP está completo quando:

1. ✅ Backend API deployado e estável (99.5% uptime)
2. ✅ Frontend integrado 100% com backend
3. ✅ Autenticação funcional (register, login, JWT)
4. ✅ CRUD completo (Clients, Properties, Visits)
5. ✅ Busca inteligente com IA funcionando
6. ✅ Upload de imagens (Cloudinary)
7. ✅ Stripe integrado (upgrade Free→Pro)
8. ✅ Emails transacionais (SendGrid)
9. ✅ Onboarding wizard completado
10. ✅ 100 usuários beta testaram (NPS > 30)
11. ✅ Zero bugs críticos
12. ✅ Landing page publicada

---

## 📝 Próximos Passos Imediatos

**Semana 1 (Esta Semana):**

1. ⏭️ **Decisão arquitetural:** Supabase (BaaS) vs. Backend custom?
   - **Supabase:** Mais rápido (2-3 semanas a menos), mas vendor lock-in
   - **Custom:** Mais flexível, mas mais tempo
   - **Recomendação:** Supabase para MVP, migrar se necessário

2. ⏭️ **Setup inicial:**
   - Criar repositório backend (se custom)
   - Ou criar projeto Supabase
   - Configurar ambientes (dev, staging, prod)

3. ⏭️ **Primeira milestone:**
   - Autenticação funcionando (register, login)
   - Deploy inicial

---

## 📚 Recursos & Ferramentas

### Desenvolvimento

- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite (já existe)
- **Testes:** Jest + Playwright
- **Docs:** Swagger/OpenAPI

### Infraestrutura

- **Hosting Backend:** Railway ou Render (€15-25/mês)
- **Hosting Frontend:** Vercel (grátis)
- **Database:** PostgreSQL (incluído Railway/Render)
- **Cache:** Redis (Upstash grátis tier)

### SaaS & Integrações

- **Email:** SendGrid (grátis 100 emails/dia)
- **Imagens:** Cloudinary (grátis 25GB)
- **Pagamentos:** Stripe (2.9% + €0.25 por transação)
- **Analytics:** Mixpanel (grátis 100k events/mês)
- **Monitoring:** Sentry (grátis 5k errors/mês)

**Custo total estimado:** €25-40/mês (MVP)

---

## ✅ Checklist de Lançamento

**Pré-Lançamento:**
- [ ] Todos features "Must Have" implementados
- [ ] 80%+ code coverage (testes)
- [ ] Zero bugs críticos
- [ ] Performance < 2s (p95)
- [ ] HTTPS em produção
- [ ] GDPR compliant (cookie banner, privacy policy)
- [ ] Monitoring ativo (Sentry + logs)
- [ ] Backup automático configurado

**Lançamento:**
- [ ] Landing page publicada
- [ ] 100 convites enviados
- [ ] Suporte ativo (< 24h response)
- [ ] Daily metrics tracking
- [ ] Feedback loops configurados

**Pós-Lançamento:**
- [ ] NPS survey enviado (Semana 2)
- [ ] Bugs hot-fixed (< 48h)
- [ ] Roadmap Q3 atualizado
- [ ] Press release (se > 100 usuários)

---

**Documento criado por:** @pm (Morgan)
**Data:** 31 Janeiro 2026
**Versão:** 1.0
**Status:** ✅ Pronto para Execução

---

_Este roadmap é um documento vivo. Revise semanalmente e ajuste conforme aprendizado._

**🚀 Próximo passo:** Iniciar Fase 1 (Backend MVP) - Semana 1
