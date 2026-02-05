# Epic 1: Authentication & User Management

**Status:** 🔄 Em Desenvolvimento
**Prioridade:** Must Have (MVP - Fase 1)
**Fase:** Q2 2026 - MVP Launch
**Owner:** @dev

---

## Visão Geral

Implementar sistema completo de autenticação e gestão de usuários, incluindo registro, login, onboarding e gestão de perfil. Este é o foundation do ImobCurator, permitindo que corretores criem contas e configurem suas preferências.

## Objetivos de Negócio

- Permitir registro rápido (< 2 min)
- Onboarding completado em < 5 min
- 70%+ taxa de conclusão de onboarding
- Zero fricção na entrada de novos usuários

## User Stories

### Story 1.1: User Registration & Login
**Como** corretor imobiliário
**Quero** criar uma conta e fazer login
**Para que** eu possa acessar o sistema de forma segura

**Acceptance Criteria:**
- [ ] Usuário pode se registrar com email e senha
- [ ] Validação de email (formato válido)
- [ ] Senha deve ter mínimo 8 caracteres
- [ ] Hash de senha com bcrypt (cost 12)
- [ ] Login retorna JWT token (access + refresh)
- [ ] Access token expira em 15 min
- [ ] Refresh token expira em 7 dias
- [ ] Rate limiting: 5 tentativas de login por 15 min

**Technical Context:**
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (Supabase)
- Auth: JWT + bcrypt
- Validation: Zod schemas

**Files Affected:**
- `api/src/routes/auth.routes.ts`
- `api/src/controllers/auth.controller.ts`
- `api/src/middleware/auth.middleware.ts`
- `api/src/utils/jwt.utils.ts`

---

### Story 1.2: Email Verification
**Como** administrador do sistema
**Quero** verificar emails de novos usuários
**Para que** reduzamos spam e contas falsas

**Acceptance Criteria:**
- [ ] Email de confirmação enviado após registro
- [ ] Link de verificação expira em 24h
- [ ] Usuário não pode fazer login sem verificar email
- [ ] Opção de reenviar email de verificação
- [ ] Integração com SendGrid para envio de emails

**Technical Context:**
- Email provider: SendGrid
- Template: Transactional email
- Fallback: Permitir login sem verificação em dev

**Files Affected:**
- `api/src/services/email.service.ts`
- `api/src/templates/email-verification.html`

---

### Story 1.3: Password Recovery
**Como** corretor
**Quero** recuperar minha senha se esquecer
**Para que** eu não perca acesso à minha conta

**Acceptance Criteria:**
- [ ] Página "Esqueci minha senha"
- [ ] Email com link de reset enviado
- [ ] Link expira em 1 hora
- [ ] Nova senha deve passar validação
- [ ] Token de reset usado apenas uma vez
- [ ] Notificação quando senha é alterada

**Technical Context:**
- Reset token: UUID v4
- Armazenamento: Campo `reset_token` e `reset_expires` em users table
- Rate limiting: 3 requests por hora

**Files Affected:**
- `api/src/routes/auth.routes.ts`
- `web/src/pages/ResetPassword.tsx`
- `api/src/templates/password-reset.html`

---

### Story 1.4: Onboarding Wizard
**Como** novo usuário
**Quero** completar um wizard de configuração inicial
**Para que** o sistema esteja personalizado para mim

**Acceptance Criteria:**
- [ ] Wizard com 5 passos:
  - Passo 1: Dados profissionais (nome, agência, licença)
  - Passo 2: Preferências de região (cidades que atua)
  - Passo 3: Configurações de idioma e moeda
  - Passo 4: Tour guiado (5 features chave)
  - Passo 5: Primeira ação sugerida (adicionar cliente ou buscar imóvel)
- [ ] Progresso salvo automaticamente
- [ ] Possível pular passos (exceto Passo 1)
- [ ] Possível voltar e editar
- [ ] Conclusão marca flag `onboarding_completed`

**Technical Context:**
- Frontend: Multi-step form com React Hook Form
- State: Zustand store para persistência local
- Backend: Endpoint PATCH /users/me/onboarding

**Files Affected:**
- `web/src/pages/Onboarding/OnboardingWizard.tsx`
- `web/src/pages/Onboarding/steps/Step1Professional.tsx`
- `web/src/pages/Onboarding/steps/Step2Regions.tsx`
- `web/src/pages/Onboarding/steps/Step3Preferences.tsx`
- `web/src/pages/Onboarding/steps/Step4Tour.tsx`
- `web/src/pages/Onboarding/steps/Step5FirstAction.tsx`
- `api/src/routes/users.routes.ts`

---

### Story 1.5: User Profile Management
**Como** corretor
**Quero** editar meu perfil e configurações
**Para que** mantenha meus dados atualizados

**Acceptance Criteria:**
- [ ] Página de configurações com abas:
  - Aba "Perfil": Nome, email, foto, telefone, agência
  - Aba "Preferências": Idioma, timezone, moeda, tema (light/dark)
  - Aba "Notificações": Email, push, frequência
  - Aba "Segurança": Alterar senha, 2FA (futuro)
- [ ] Upload de foto de perfil (Cloudinary)
- [ ] Validação de dados
- [ ] Salvar com feedback de sucesso/erro
- [ ] Opção "Deletar Conta" (GDPR compliance)

**Technical Context:**
- Image upload: Cloudinary
- Max file size: 5MB
- Formats: JPG, PNG, WEBP
- Delete account: Soft delete + data export

**Files Affected:**
- `web/src/pages/Settings/ProfileSettings.tsx`
- `web/src/pages/Settings/PreferencesSettings.tsx`
- `web/src/pages/Settings/NotificationsSettings.tsx`
- `web/src/pages/Settings/SecuritySettings.tsx`
- `api/src/routes/users.routes.ts`
- `api/src/controllers/users.controller.ts`

---

## Requisitos Técnicos

### Database Schema (Supabase/PostgreSQL)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  agency VARCHAR(255),
  license_number VARCHAR(100),
  avatar_url TEXT,

  -- Preferences
  language VARCHAR(5) DEFAULT 'pt-PT',
  timezone VARCHAR(50) DEFAULT 'Europe/Lisbon',
  currency VARCHAR(3) DEFAULT 'EUR',
  theme VARCHAR(10) DEFAULT 'light',

  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,

  -- Email Verification
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_expires TIMESTAMP,

  -- Password Reset
  reset_token VARCHAR(255),
  reset_expires TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);
```

### API Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login (returns JWT)
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Logout (invalidate tokens)
POST   /api/auth/verify-email      - Verify email with token
POST   /api/auth/resend-verification - Resend verification email
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token

GET    /api/users/me               - Get current user profile
PATCH  /api/users/me               - Update profile
PATCH  /api/users/me/onboarding    - Update onboarding progress
DELETE /api/users/me               - Delete account (soft delete)
POST   /api/users/me/avatar        - Upload profile picture
```

### Security Requirements

- HTTPS obrigatório em produção
- JWT tokens com expiração curta (15 min access, 7 dias refresh)
- Rate limiting: 100 req/15min por IP
- Password hashing: bcrypt (cost 12)
- CORS configurado para frontend domain apenas
- Input validation com Zod
- SQL injection prevention (Prisma ORM)
- XSS prevention (sanitização de inputs)

---

## Métricas de Sucesso

- **Tempo de registro:** < 2 min (p95)
- **Taxa de conclusão de onboarding:** > 70%
- **Tempo de onboarding:** < 5 min (p95)
- **Taxa de verificação de email:** > 80% em 24h
- **Taxa de recuperação de senha bem-sucedida:** > 90%
- **Zero** vulnerabilidades de segurança em auth

---

## Dependências

- Supabase (PostgreSQL + Auth)
- SendGrid (Email transacional)
- Cloudinary (Upload de imagens)
- JWT library (jsonwebtoken)
- bcrypt (Password hashing)

---

## Riscos & Mitigação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Rate limit abuse** | Média | Implementar rate limiting robusto + captcha se necessário |
| **Token leakage** | Baixa | HTTPS only, short expiration, secure cookies |
| **Email delivery issues** | Média | Fallback: Permitir login sem verificação em dev, monitorar SendGrid |
| **Brute force attacks** | Alta | Rate limiting + account lockout após 5 tentativas |

---

## Definition of Done

- [ ] Todas as stories implementadas e testadas
- [ ] Testes unitários com > 80% coverage
- [ ] Testes E2E para fluxo completo (registro → login → onboarding)
- [ ] Documentação da API atualizada (Swagger)
- [ ] Security audit realizado
- [ ] Deploy em staging testado
- [ ] Product Owner aprovou

---

**Epic Owner:** @dev
**Estimated Effort:** 4-6 semanas
**Priority:** P0 (Blocker para MVP)
