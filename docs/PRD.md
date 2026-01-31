# ImobCurator 3.0 - Product Requirements Document (PRD)

**Versão:** 1.0
**Data:** 31 Janeiro 2026
**Status:** 🔄 Em Desenvolvimento
**Product Manager:** @pm (Morgan)
**Última Atualização:** 31 Janeiro 2026

---

## 📋 Índice

1. [Visão Executiva](#visão-executiva)
2. [Problema & Oportunidade](#problema--oportunidade)
3. [Objetivos do Produto](#objetivos-do-produto)
4. [Personas & Segmentos](#personas--segmentos)
5. [Features & Requisitos](#features--requisitos)
6. [User Journeys](#user-journeys)
7. [Requisitos Não-Funcionais](#requisitos-não-funcionais)
8. [Métricas de Sucesso](#métricas-de-sucesso)
9. [Roadmap & Priorização](#roadmap--priorização)
10. [Riscos & Mitigação](#riscos--mitigação)
11. [Dependências](#dependências)
12. [Go-to-Market](#go-to-market)

---

## 🎯 Visão Executiva

### Elevator Pitch

**ImobCurator** é um CRM inteligente para corretores imobiliários em Portugal que combina gestão de clientes, busca assistida por IA e gamificação de performance para aumentar a produtividade e taxa de fechamento de negócios.

### Proposta de Valor

| Problema | Solução ImobCurator |
|----------|---------------------|
| **Gestão manual dispersa** | CRM centralizado e intuitivo |
| **Busca de imóveis ineficiente** | Busca inteligente com IA (Gemini) |
| **Falta de acompanhamento de clientes** | Timeline automática + notificações |
| **Dificuldade em organizar visitas** | Agendamento integrado com status |
| **Sem visibilidade de performance** | Dashboard com KPIs + sistema de reputação |

### Diferencial Competitivo

1. **🤖 IA Integrada** - Gemini AI para recomendações personalizadas
2. **🎮 Gamificação** - Sistema de reputação (Elite, Good, Neutral, Risk)
3. **🇵🇹 Foco Portugal** - Dados de mercado 2026, multi-idioma (PT-PT, PT-BR, EN, FR)
4. **💰 Freemium** - Plano gratuito (2 buscas/mês) + Pro (ilimitado)
5. **📱 Mobile-First** - Interface responsiva e moderna

---

## 🔍 Problema & Oportunidade

### Problema

**Corretores imobiliários em Portugal enfrentam:**

1. **Fragmentação de ferramentas**
   - WhatsApp para comunicação
   - Excel para tracking de clientes
   - Portais diferentes para busca de imóveis
   - Google Calendar para visitas
   - **Resultado:** Perda de informação, ineficiência, erros

2. **Falta de inteligência nos dados**
   - Sem histórico centralizado de preferências do cliente
   - Recomendações manuais e subjetivas
   - Difícil identificar padrões de sucesso

3. **Baixa produtividade**
   - Tempo perdido em tarefas administrativas
   - Falta de visibilidade de pipeline
   - Dificuldade em priorizar leads

4. **Mercado competitivo**
   - Pressão por resultados
   - Clientes exigentes com alta expectativa
   - Necessidade de diferenciação profissional

### Oportunidade de Mercado

**Portugal - Mercado Imobiliário 2026:**

- **€25B+** volume anual de transações imobiliárias
- **~15.000** corretores ativos (estimativa)
- **Digitalização acelerada** pós-pandemia
- **Crescimento de estrangeiros** comprando em Portugal (Brasil, França, UK)

**Competidores Identificados:**

| Competidor | Foco | Limitações |
|------------|------|------------|
| **Pipedrive** | CRM genérico | Não especializado em imobiliário |
| **HubSpot** | CRM enterprise | Caro, complexo |
| **Imovirtual CRM** | Integrado ao portal | Lock-in, apenas Imovirtual |
| **Excel + WhatsApp** | Manual | Sem automação, propenso a erros |

**Gap de Mercado:**
✅ CRM especializado em imobiliário
✅ Acessível (freemium)
✅ IA integrada para recomendações
✅ Gamificação para motivação

---

## 🎯 Objetivos do Produto

### Objetivos de Negócio

1. **Adoção:**
   - **500 usuários** no primeiro trimestre (Q2 2026)
   - **2.000 usuários** no primeiro ano
   - **20% conversão Free → Pro** (target)

2. **Receita:**
   - **€10/mês** por usuário Pro
   - **€4.000 MRR** no primeiro ano (200 Pro users)
   - **€50k ARR** até final de 2027

3. **Engajamento:**
   - **80% MAU/DAU ratio** (usuários ativos)
   - **3+ sessões/semana** por usuário ativo
   - **10+ min** tempo médio por sessão

### Objetivos de Produto

1. **Produtividade:**
   - Reduzir **30% tempo** em tarefas administrativas
   - Aumentar **20% taxa de agendamento** de visitas
   - Aumentar **15% taxa de fechamento** de negócios

2. **Experiência:**
   - **NPS > 40** (Net Promoter Score)
   - **< 5 min** tempo de onboarding
   - **Zero** bugs críticos em produção

3. **Confiabilidade:**
   - **99.5% uptime** (SLA)
   - **< 2s** tempo de resposta (p95)
   - **Zero** perda de dados

---

## 👥 Personas & Segmentos

### Persona Primária: Corretor Independente

**Nome:** João Silva
**Idade:** 32 anos
**Localização:** Lisboa
**Experiência:** 5 anos como corretor

**Perfil:**
- Trabalha de forma independente (sem agência grande)
- 15-20 clientes ativos simultaneamente
- Usa WhatsApp + Excel para organização
- Frustrado com falta de profissionalismo das ferramentas
- Quer se destacar com tecnologia

**Objetivos:**
- Aumentar número de fechamentos
- Melhorar relacionamento com clientes
- Parecer mais profissional
- Economizar tempo em admin

**Dores:**
- Esquece follow-ups importantes
- Perde oportunidades por desorganização
- Clientes reclamam de falta de comunicação
- Difícil demonstrar valor vs. concorrentes

**Comportamento:**
- Mobile-first (90% do tempo no celular)
- Prefere simplicidade vs. features complexas
- Sensível a preço (€10-20/mês OK)
- Compartilha no Instagram/LinkedIn

**Jobs to Be Done:**
- "Quando um cliente me pede imóveis, preciso encontrar rapidamente opções relevantes"
- "Quando tenho muitos leads, preciso priorizar quem tem mais chance de fechar"
- "Quando fechei um negócio, quero entender o que funcionou para replicar"

### Persona Secundária: Corretor de Agência

**Nome:** Maria Costa
**Idade:** 28 anos
**Localização:** Porto
**Experiência:** 2 anos (RE/MAX)

**Perfil:**
- Trabalha em agência grande
- 30-40 clientes em pipeline
- Usa CRM da agência (mas acha limitado)
- Quer destacar-se internamente
- Ambição de ser top performer

**Objetivos:**
- Bater metas mensais
- Subir no ranking interno
- Construir reputação pessoal
- Eventualmente trabalhar independente

**Dores:**
- CRM da agência é genérico
- Sem personalização
- Sem IA/automação
- Interface antiga

**Comportamento:**
- Tech-savvy
- Usa múltiplas ferramentas
- Disposta a pagar por vantagem competitiva
- Ativa em redes sociais

### Segmentos de Mercado

| Segmento | % Mercado | Prioridade | Estratégia |
|----------|-----------|------------|------------|
| **Independentes** | 60% | 🔴 Alta | Foco MVP |
| **Agências pequenas** (2-10 corretores) | 25% | 🟡 Média | Fase 2 (planos team) |
| **Agências grandes** (10+ corretores) | 15% | 🟢 Baixa | Futuro (enterprise) |

---

## ⚙️ Features & Requisitos

### Modelo MoSCoW

#### Must Have (MVP - Fase 1)

**Autenticação & Onboarding:**
- [x] ✅ Registro de usuário (email + senha)
- [x] ✅ Login com JWT
- [ ] 📋 Onboarding wizard (5 passos: perfil, agência, preferências)
- [ ] 📋 Recuperação de senha via email

**Gestão de Clientes:**
- [x] ✅ CRUD de clientes (criar, ler, atualizar, deletar)
- [x] ✅ Status de cliente (Searching, Visiting, Offer Made, Closed, Inactive, Archived)
- [x] ✅ Preferências de cliente (localização, budget, tipo de imóvel)
- [ ] 📋 Timeline de atividades do cliente
- [ ] 📋 Notas privadas do corretor

**Gestão de Imóveis:**
- [x] ✅ Listagem de imóveis
- [x] ✅ Filtros básicos (localização, preço, quartos, tipo)
- [x] ✅ Busca inteligente com IA (Gemini)
- [x] ✅ Status de imóvel (New, Liked, Discarded, Visit Requested)
- [ ] 📋 Upload de imagens de imóveis
- [ ] 📋 Importação manual de imóveis

**Agendamento de Visitas:**
- [x] ✅ CRUD de visitas
- [x] ✅ Status de visita (Requested, Confirmed, Completed, Cancelled)
- [x] ✅ Timeline de visita
- [ ] 📋 Notificações de visita (email + push)
- [ ] 📋 Calendário de visitas

**Dashboard & Relatórios:**
- [x] ✅ Dashboard com KPIs básicos
- [x] ✅ Gráficos de atividade
- [x] ✅ Sistema de reputação (Elite, Good, Neutral, Risk)
- [ ] 📋 Exportação de relatórios (PDF)

**Settings:**
- [x] ✅ Configurações de perfil
- [x] ✅ Multi-idioma (PT-PT, PT-BR, EN, FR)
- [x] ✅ Dark mode
- [ ] 📋 Notificações configuráveis

#### Should Have (Fase 2)

**Comunicação:**
- [ ] 📧 Email templates (confirmação visita, follow-up)
- [ ] 📧 Histórico de comunicação com cliente
- [ ] 📧 WhatsApp integration (envio de mensagens)

**Busca Avançada:**
- [ ] 🔍 Filtros avançados (amenidades, ano construção, certificado energético)
- [ ] 🔍 Busca por mapa
- [ ] 🔍 Alertas de novos imóveis (match automático com clientes)

**Colaboração:**
- [ ] 👥 Compartilhamento de imóveis com clientes (link público)
- [ ] 👥 Feedback de cliente (like/dislike)
- [ ] 👥 Chat interno (corretor ↔ cliente)

**Analytics Avançado:**
- [ ] 📊 Funil de conversão (lead → visita → proposta → fechamento)
- [ ] 📊 Análise de performance por região
- [ ] 📊 Previsão de vendas (IA)

**Monetização:**
- [ ] 💳 Integração Stripe (checkout)
- [ ] 💳 Gestão de planos (Free → Pro upgrade)
- [ ] 💳 Portal de cobrança (customer portal)

#### Could Have (Fase 3)

**Integrações Externas:**
- [ ] 🔗 Idealista.pt API (quando disponível)
- [ ] 🔗 Imovirtual API (quando disponível)
- [ ] 🔗 Google Calendar sync
- [ ] 🔗 Zapier integration

**Mobile App:**
- [ ] 📱 PWA (Progressive Web App)
- [ ] 📱 React Native app (iOS + Android)

**Features Avançadas:**
- [ ] 🏘️ Gestão de portfólio próprio (corretor com imóveis exclusivos)
- [ ] 🏘️ Sistema de propostas (geração automática de proposta)
- [ ] 🏘️ Assinatura digital de contratos

**Team Features:**
- [ ] 👥 Plano Team (2-10 corretores)
- [ ] 👥 Compartilhamento de clientes entre corretores
- [ ] 👥 Leaderboard de agência

#### Won't Have (Fora de Escopo)

- ❌ Gestão financeira completa (usar software dedicado)
- ❌ Gestão de contratos legais (usar advogado/notário)
- ❌ CRM genérico (foco apenas imobiliário)
- ❌ Marketplace de imóveis (não somos portal)

---

## 🗺️ User Journeys

### Journey 1: Corretor Novo Usuário

**Objetivo:** Primeiro fechamento de negócio usando ImobCurator

**Etapas:**

1. **Descoberta** (Dia 0)
   - João vê anúncio no Instagram
   - Clica em "Experimente Grátis"
   - Chega na landing page

2. **Registro** (Dia 0 - 2 min)
   - Cadastro rápido (email, senha, nome)
   - Confirma email
   - Onboarding wizard:
     - Passo 1: Dados profissionais (agência, licença)
     - Passo 2: Preferências de região
     - Passo 3: Importar clientes (opcional)
     - Passo 4: Tour guiado (5 features chave)
     - Passo 5: Primeira ação (adicionar cliente ou buscar imóvel)

3. **Primeiro Valor** (Dia 0 - 10 min)
   - João adiciona primeiro cliente (Maria, procura T2 em Lisboa €300k)
   - Faz busca inteligente de imóveis
   - IA retorna 15 sugestões relevantes
   - João marca 3 como "Liked"
   - Envia por WhatsApp para Maria

4. **Adoção Ativa** (Semana 1)
   - Maria gosta de 1 imóvel
   - João agenda visita pelo sistema
   - Recebe notificação de confirmação
   - Após visita, marca status "Completed"
   - Adiciona notas: "Cliente adorou varanda, preço OK"

5. **Expansão de Uso** (Semana 2-3)
   - João adiciona mais 5 clientes
   - Usa dashboard para priorizar follow-ups
   - Descobre sistema de reputação ("Good" ranking)
   - Quer melhorar para "Elite"

6. **Conversão Pro** (Semana 4)
   - João atinge limite de 2 buscas gratuitas
   - Ve valor claro do produto
   - Upgrade para Pro (€10/mês)
   - Justificativa: "Vale a pena, já fechei 1 negócio"

7. **Advocacia** (Mês 2)
   - João fecha 2º negócio usando ImobCurator
   - Posta screenshot no LinkedIn
   - Recomenda para 3 colegas

### Journey 2: Busca de Imóvel

**Objetivo:** Cliente encontrar imóvel ideal com recomendação IA

**Etapas:**

1. **Entrada de Critérios**
   - Corretor abre "Buscar Imóveis"
   - Seleciona cliente (Maria)
   - Define critérios:
     - Tipo: Apartamento
     - Localização: Lisboa (Avenidas Novas)
     - Budget: €300.000
     - Quartos: 2
     - Amenidades: Garagem, Elevador

2. **Busca Inteligente**
   - Sistema busca em:
     - Base simulada (dados mercado 2026)
     - [Futuro] APIs de portais
   - IA Gemini analisa:
     - Histórico de preferências de Maria
     - Imóveis que ela já gostou/rejeitou
     - Padrões de sucesso de corretores similares

3. **Resultados Ranqueados**
   - 15 imóveis retornados
   - Ordenados por "Match Score" (95%, 89%, 87%...)
   - Cada imóvel mostra:
     - Foto, preço, localização
     - Match reason ("Preço ideal para Avenidas Novas")
     - Prós e contras
     - Link para portal original

4. **Curação pelo Corretor**
   - Corretor revisa lista
   - Marca 3 como "Liked" (para enviar à Maria)
   - Marca 5 como "Discarded" (fora do perfil)
   - Adiciona nota em 1: "Negociar preço"

5. **Compartilhamento**
   - [MVP] Copia links e envia por WhatsApp
   - [Futuro] Envia direto pelo sistema com email/link
   - Maria recebe e avalia

6. **Feedback Loop**
   - Maria responde: gostou de 2, não gostou de 1
   - Corretor atualiza status no sistema
   - IA aprende preferências de Maria
   - Próxima busca será mais precisa

### Journey 3: Fechamento de Negócio

**Objetivo:** Rastrear cliente desde lead até fechamento

**Etapas:**

1. **Lead Entry** (Status: Searching)
   - Corretor adiciona lead "Pedro"
   - Define budget, localização, tipo
   - Sistema sugere 5 imóveis automaticamente

2. **Ativação** (Status: Visiting)
   - Pedro gosta de 2 imóveis
   - Corretor agenda 2 visitas
   - Timeline registra: "2 visitas agendadas"

3. **Visitas** (Status: Visiting)
   - Corretor e Pedro visitam imóveis
   - Após cada visita:
     - Marca status "Completed"
     - Adiciona feedback de Pedro
     - Atualiza próximos passos

4. **Proposta** (Status: Offer Made)
   - Pedro decide fazer proposta em 1 imóvel
   - Corretor muda status para "Offer Made"
   - Timeline: "Proposta enviada €285k"
   - Sistema alerta: "Acompanhe em 48h"

5. **Negociação** (Status: Offer Made)
   - Contraproposta recebida
   - Corretor registra notas de negociação
   - Define lembrete para follow-up

6. **Fechamento** (Status: Closed)
   - Negócio fechado! 🎉
   - Corretor marca status "Closed"
   - Sistema:
     - Atualiza métricas (1 negócio fechado)
     - Incrementa "Win Streak" (reputação)
     - Sugere: "Peça testemunho para LinkedIn"
   - Corretor sobe para "Elite" ranking

7. **Pós-Venda**
   - Sistema sugere: "Enviar follow-up em 30 dias"
   - Corretor mantém relacionamento
   - Pedro se torna fonte de referrals

---

## 🔧 Requisitos Não-Funcionais

### Performance

| Métrica | Target | Justificativa |
|---------|--------|---------------|
| **Page Load** | < 2s (p95) | Retenção de usuários |
| **API Response** | < 500ms (p95) | Experiência fluida |
| **Busca IA** | < 5s | Aceitável para IA |
| **Image Upload** | < 10s | Aceitável para uploads |

### Escalabilidade

- **1.000 usuários simultâneos** (ano 1)
- **10.000 usuários** (ano 3)
- **100k clientes** no banco de dados
- **500k imóveis** catalogados

### Disponibilidade

- **99.5% uptime** (SLA)
- **Downtime planejado:** Apenas madrugadas (2-5h AM)
- **Backup diário** automático
- **RTO (Recovery Time Objective):** < 4h
- **RPO (Recovery Point Objective):** < 1h

### Segurança

- **HTTPS obrigatório** em produção
- **JWT tokens** com expiração curta (15 min access, 7 dias refresh)
- **Rate limiting:** 100 req/15min por IP
- **Password hashing:** bcrypt (cost 12)
- **GDPR compliance:**
  - Consentimento explícito
  - Direito ao esquecimento (DELETE /users/me)
  - Portabilidade de dados (export JSON)
  - Criptografia de dados sensíveis

### Usabilidade

- **Mobile-first design** (80% usuários em mobile)
- **< 5 min onboarding** (time to first value)
- **Acessibilidade WCAG 2.1 AA:**
  - Contraste adequado
  - Navegação por teclado
  - Screen reader friendly
- **Multi-idioma:** PT-PT, PT-BR, EN, FR
- **Dark mode** (economia bateria + preferência usuário)

### Manutenibilidade

- **80% code coverage** (testes)
- **TypeScript 100%** (type safety)
- **Documentação API** (Swagger/OpenAPI)
- **Logs estruturados** (Winston + JSON)
- **Monitoramento:** Sentry (errors), Vercel Analytics (performance)

---

## 📊 Métricas de Sucesso

### Métricas AARRR (Pirate Metrics)

#### Acquisition (Aquisição)

| Métrica | Target Q2 2026 | Target Q4 2026 | Como Medir |
|---------|----------------|----------------|------------|
| **Cadastros** | 500 | 2.000 | Novos usuários/mês |
| **CAC** (Customer Acquisition Cost) | < €20 | < €15 | Gasto marketing / novos usuários |
| **Canal principal** | Instagram Ads | Organic + Referral | Google Analytics |

#### Activation (Ativação)

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Onboarding completado** | > 70% | % usuários que completam wizard |
| **Time to First Value** | < 10 min | Tempo até adicionar 1º cliente ou fazer 1ª busca |
| **1ª ação em 24h** | > 60% | % usuários que fazem ação no 1º dia |

#### Retention (Retenção)

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **D7 Retention** | > 40% | % usuários ativos 7 dias após cadastro |
| **D30 Retention** | > 25% | % usuários ativos 30 dias após cadastro |
| **MAU/DAU Ratio** | > 0.3 | Usuários mensais / usuários diários |
| **Churn Rate** | < 5%/mês | % usuários que cancelam Pro |

#### Referral (Indicação)

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **NPS** | > 40 | Net Promoter Score (survey) |
| **Viral Coefficient** | > 0.3 | Novos usuários por usuário existente |
| **Share Actions** | > 20% usuários | % que compartilham no LinkedIn/Instagram |

#### Revenue (Receita)

| Métrica | Target Q2 2026 | Target Q4 2026 | Como Medir |
|---------|----------------|----------------|------------|
| **MRR** (Monthly Recurring Revenue) | €1.000 | €4.000 | Receita mensal recorrente |
| **ARR** (Annual Recurring Revenue) | €12.000 | €50.000 | MRR × 12 |
| **Conversão Free→Pro** | > 15% | > 20% | % usuários que upgradaram |
| **LTV** (Lifetime Value) | €200 | €300 | Receita média por usuário |
| **LTV/CAC Ratio** | > 3:1 | > 5:1 | LTV / CAC |

### Métricas de Produto

#### Engagement

| Métrica | Target | Frequência |
|---------|--------|------------|
| **Sessões/usuário/semana** | > 3 | Semanal |
| **Tempo médio/sessão** | > 10 min | Semanal |
| **Features mais usadas** | Top 5 | Mensal |
| **Busca IA usage** | > 50% MAU | Mensal |

#### Qualidade

| Métrica | Target | Frequência |
|---------|--------|------------|
| **Crash-free rate** | > 99.9% | Diário |
| **Bugs críticos** | 0 | Diário |
| **Support tickets/usuário** | < 0.5/mês | Mensal |
| **CSAT** (Customer Satisfaction) | > 4.2/5 | Trimestral |

#### Business Impact

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Negócios fechados/usuário** | > 2/mês | Self-reported + tracking |
| **Tempo economizado** | > 30% | Survey + tempo em features |
| **Taxa de agendamento** | +20% | Comparação antes/depois |

---

## 📅 Roadmap & Priorização

### Q2 2026 (Abril - Junho): MVP Launch

**Objetivo:** Lançar MVP funcional para 500 early adopters

**Milestones:**

- ✅ **M1 (Semana 1-4): Backend MVP**
  - Setup projeto (Node.js + TypeScript + Prisma)
  - Autenticação (register, login, JWT)
  - CRUD APIs (Clients, Properties, Visits)
  - Deploy em Railway

- 📋 **M2 (Semana 5-7): Integração Frontend**
  - API client no frontend
  - AuthContext + protected routes
  - Substituir mock data por API calls
  - Loading states + error handling

- 📋 **M3 (Semana 8-10): Features Críticas**
  - Upload de imagens (Cloudinary)
  - Emails transacionais (SendGrid)
  - Onboarding wizard
  - Analytics básico

- 📋 **M4 (Semana 11-12): Polish & Launch**
  - Testes E2E
  - Bug fixes
  - Landing page
  - **🚀 LAUNCH BETA (100 usuários)**

**Deliverables:**
- ✅ Aplicação full-stack funcional
- ✅ 100 usuários beta testando
- ✅ Feedback coletado para iterar

### Q3 2026 (Julho - Setembro): Growth & Monetização

**Objetivo:** Escalar para 1.000 usuários e implementar planos pagos

**Features:**

- **Monetização:**
  - Integração Stripe
  - Planos Free (2 buscas) + Pro (€10/mês ilimitado)
  - Upgrade flow
  - Customer portal

- **Engagement:**
  - Email templates (confirmação visita, follow-up)
  - Notificações push (PWA)
  - Calendário de visitas
  - Exportação de relatórios (PDF)

- **Growth:**
  - Programa de referral (20% desconto)
  - Landing page otimizada (SEO)
  - Integração com Instagram/LinkedIn (share)

**Target:**
- 1.000 usuários cadastrados
- 150 usuários Pro (15% conversão)
- €1.500 MRR

### Q4 2026 (Outubro - Dezembro): Scale & Features Avançadas

**Objetivo:** 2.000 usuários, €4.000 MRR, features competitivas

**Features:**

- **Comunicação:**
  - WhatsApp integration (envio de mensagens)
  - Chat interno (corretor ↔ cliente)
  - Histórico de comunicação

- **Busca Avançada:**
  - Filtros avançados (amenidades, certificado energético)
  - Busca por mapa
  - Alertas automáticos (match clientes)

- **Analytics:**
  - Funil de conversão
  - Previsão de vendas (IA)
  - Relatórios personalizáveis

**Target:**
- 2.000 usuários cadastrados
- 400 usuários Pro (20% conversão)
- €4.000 MRR

### 2027: Expansão & Enterprise

**Futuro (não priorizado agora):**

- Planos Team (2-10 corretores)
- Mobile app nativo (React Native)
- Integrações com Idealista/Imovirtual (se disponível)
- Gestão de portfólio próprio
- Sistema de propostas automatizado
- Expansão internacional (Espanha, Brasil)

---

## ⚠️ Riscos & Mitigação

### Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **APIs de imóveis indisponíveis** | Alta | Alto | ✅ Simulação com dados reais (implementado) |
| **Escalabilidade do backend** | Média | Médio | Railway auto-scaling + cache (Redis) |
| **Performance da IA** | Média | Médio | Timeout 30s + fallback para busca simples |
| **Segurança (data breach)** | Baixa | Crítico | HTTPS, JWT, bcrypt, GDPR compliance, audits |

### Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Baixa adoção inicial** | Média | Alto | Marketing agressivo (Instagram Ads), freemium |
| **Baixa conversão Free→Pro** | Alta | Alto | Demonstrar valor claro, limite de buscas justo |
| **Competidores copiam features** | Alta | Médio | Velocidade de iteração, foco em UX superior |
| **Mudanças regulatórias GDPR** | Baixa | Alto | Consultoria legal, compliance desde início |

### Riscos de Mercado

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Recessão imobiliária** | Média | Alto | Diversificar para aluguel (não só venda) |
| **Consolidação do mercado** | Baixa | Médio | Focar em independentes (60% mercado) |
| **Portais lançam CRM próprio** | Alta | Alto | Diferenciação em IA + gamificação |

### Riscos de Execução

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Atrasos no desenvolvimento** | Média | Médio | Roadmap realista, priorização ruthless (MoSCoW) |
| **Bugs críticos em produção** | Média | Alto | Testes automatizados (80% coverage), staging env |
| **Churn por bugs/UX ruim** | Média | Alto | User testing, feedback loops, iteração rápida |

---

## 🔗 Dependências

### Dependências Críticas (Bloqueantes)

1. **Backend API** (Fase 1)
   - Sem backend, nenhuma feature funciona
   - **Owner:** @dev
   - **ETA:** 4-6 semanas

2. **Integração Gemini AI** (Já Completo)
   - Essencial para busca inteligente
   - **Status:** ✅ Implementado
   - **API Key:** Já configurado em .env

3. **Deploy de Produção** (Fase 1)
   - Sem deploy, não há acesso de usuários
   - **Owner:** @devops
   - **ETA:** 1 semana

### Dependências Importantes (Não Bloqueantes)

4. **Cloudinary (Images)** (Fase 3)
   - Sem isso, sem upload de fotos
   - **Workaround:** URLs manuais temporariamente
   - **ETA:** 2 semanas

5. **Stripe (Pagamentos)** (Fase 2)
   - Sem isso, sem receita
   - **Workaround:** Apenas plano Free no MVP
   - **ETA:** 3-4 semanas

6. **SendGrid (Email)** (Fase 3)
   - Sem isso, sem notificações email
   - **Workaround:** Notificações in-app apenas
   - **ETA:** 2 semanas

### Dependências Externas (Sem Controle)

7. **APIs de Portais Imobiliários**
   - Status: ❌ Indisponíveis
   - **Impacto:** Médio (mitigado com simulação)
   - **Ação:** Aplicar para acesso (Idealista, Imovirtual)

8. **Gemini AI Rate Limits**
   - Status: ⚠️ 60 req/min (grátis)
   - **Impacto:** Alto se muitos usuários
   - **Ação:** Monitorar uso, implementar queue se necessário

---

## 🚀 Go-to-Market

### Estratégia de Lançamento

**Fase 1: Beta Fechado** (100 usuários - Semana 1-2)

- **Público:** Corretores conhecidos, early adopters
- **Canal:** Convites diretos (email + WhatsApp)
- **Objetivo:** Validar produto, coletar feedback
- **Incentivo:** Grátis vitalício (Pro plan)

**Fase 2: Beta Aberto** (500 usuários - Semana 3-8)

- **Público:** Corretores em Portugal
- **Canal:** Instagram Ads + LinkedIn
- **Objetivo:** Escalar adoção, testar conversão
- **Incentivo:** 3 meses Pro grátis

**Fase 3: Launch Público** (1.000+ usuários - Semana 9+)

- **Público:** Mercado geral
- **Canal:** Ads + SEO + Referral
- **Objetivo:** Crescimento sustentável
- **Incentivo:** Programa de referral (20% desconto)

### Canais de Marketing

| Canal | Target Audience | Budget | ROI Esperado |
|-------|----------------|--------|--------------|
| **Instagram Ads** | Corretores 25-40 anos | €2.000/mês | 3:1 |
| **LinkedIn Ads** | Corretores profissionais | €1.000/mês | 4:1 |
| **SEO** | Busca orgânica "CRM corretor Portugal" | €500/mês | 10:1 (longo prazo) |
| **Referral** | Usuários existentes | €0 (desconto) | 8:1 |
| **Partnerships** | Agências imobiliárias | €0 (comissão) | TBD |

### Mensagens Chave

**Headline:** "O CRM que corretores imobiliários amam usar"

**Value Props:**
1. 🤖 Busca inteligente com IA (economize 30% do tempo)
2. 📊 Dashboard visual (veja seu progresso em tempo real)
3. 🎮 Sistema de reputação (torne-se Elite)
4. 💰 Freemium (comece grátis, upgrade quando valer a pena)
5. 🇵🇹 Feito para Portugal (dados de mercado real 2026)

**Call-to-Action:**
- "Experimente Grátis" (sem cartão de crédito)
- "Comece Hoje" (onboarding 5 min)

### Pricing Strategy

| Plano | Preço | Features | Target |
|-------|-------|----------|--------|
| **Free** | €0/mês | 2 buscas IA/mês, 10 clientes | Testar produto |
| **Pro** | €10/mês | Buscas ilimitadas, clientes ilimitados, suporte prioritário | Corretores ativos |
| **Team** | €8/usuário/mês (min 3) | Tudo do Pro + compartilhamento + leaderboard | Agências pequenas |

**Justificativa de Preço:**
- Competidores: €20-50/mês (Pipedrive, HubSpot)
- Valor percebido: 1 negócio fechado > €10
- Margem: 80%+ (SaaS)

---

## ✅ Critérios de Sucesso do MVP

### Launch Checklist

**Funcional:**
- ✅ Todos features "Must Have" implementados
- ✅ Zero bugs críticos
- ✅ Performance < 2s page load
- ✅ Mobile responsivo 100%

**Negócio:**
- ✅ 100 usuários beta testaram
- ✅ NPS > 30
- ✅ 70%+ completaram onboarding
- ✅ 40%+ fizeram ação em 24h

**Técnico:**
- ✅ 99.5% uptime (2 semanas)
- ✅ 80%+ code coverage
- ✅ GDPR compliant
- ✅ Monitoring ativo (Sentry + logs)

**Marketing:**
- ✅ Landing page pronta
- ✅ 1.000 seguidores Instagram
- ✅ 10 depoimentos de usuários
- ✅ Press kit preparado

### Definition of Done (MVP)

**MVP está pronto quando:**

1. ✅ Corretor pode se cadastrar e fazer onboarding < 5 min
2. ✅ Corretor pode adicionar cliente e definir preferências
3. ✅ Corretor pode buscar imóveis com IA e obter 15 sugestões relevantes
4. ✅ Corretor pode agendar visita e rastrear status
5. ✅ Corretor pode ver dashboard com KPIs e reputação
6. ✅ Sistema está em produção com 99.5% uptime
7. ✅ 100 usuários beta validaram o produto (NPS > 30)

---

## 📚 Apêndices

### Glossário

- **MAU:** Monthly Active Users
- **DAU:** Daily Active Users
- **MRR:** Monthly Recurring Revenue
- **ARR:** Annual Recurring Revenue
- **CAC:** Customer Acquisition Cost
- **LTV:** Lifetime Value
- **NPS:** Net Promoter Score
- **CSAT:** Customer Satisfaction Score
- **Churn:** Taxa de cancelamento

### Referências

- [Mercado Imobiliário Portugal 2026](https://www.ine.pt)
- [Competitor Analysis](https://docs.google.com/spreadsheets/...)
- [User Research](https://docs.google.com/document/...)
- [Technical Architecture](./architecture.md)

---

**Documento criado por:** @pm (Morgan)
**Data:** 31 Janeiro 2026
**Versão:** 1.0
**Status:** ✅ Completo
**Próxima revisão:** Após MVP Launch (Q2 2026)

---

_Este PRD é um documento vivo e será atualizado conforme aprendemos com usuários e mercado._
