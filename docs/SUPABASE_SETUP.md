# Supabase Integration - ImobCurator

**Data:** 31 Janeiro 2026
**Status:** ✅ Configurado - Aguardando Schema do Banco
**Arquiteto:** @architect (Aria)

---

## 🎯 Visão Geral

ImobCurator agora usa **Supabase** como Backend-as-a-Service! Isso acelera o desenvolvimento em **2-3 semanas** vs. backend custom.

### O Que o Supabase Fornece

✅ **PostgreSQL Database** - Banco de dados completo
✅ **Authentication** - Login, registro, JWT automático
✅ **Storage** - Upload de imagens
✅ **Real-time** - Subscriptions para updates em tempo real
✅ **Row Level Security (RLS)** - Segurança a nível de linha
✅ **Auto-generated APIs** - REST e GraphQL automáticos

---

## 🔧 Configuração Atual

### 1. Credenciais (.env)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://hdzbenshvrzndyijreio.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6javLC0aW0AI3oU4FVbxaw_jekUBE5x
SUPABASE_SERVICE_ROLE_KEY=sb_secret_ri3C92JZ2tK4M-x--C9wIw_KEnc1ZeR
SUPABASE_DB_PASSWORD=YaeWlDL8s63Weilz

# Direct Database URL
DATABASE_URL=postgresql://postgres:YaeWlDL8s63Weilz@db.hdzbenshvrzndyijreio.supabase.co:5432/postgres
```

### 2. Cliente Supabase

**Arquivo:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const auth = {
  signUp: async (email, password, userData) => { ... },
  signIn: async (email, password) => { ... },
  signOut: async () => { ... },
  getCurrentUser: async () => { ... },
  getSession: async () => { ... },
  resetPassword: async (email) => { ... },
  updatePassword: async (newPassword) => { ... },
};
```

### 3. Auth Context

**Arquivo:** `src/contexts/SupabaseAuthContext.tsx`

React Context para gerenciar autenticação globalmente.

```typescript
import { useSupabaseAuth } from './contexts/SupabaseAuthContext';

const { user, session, loading, signIn, signOut } = useSupabaseAuth();
```

### 4. TypeScript Types

**Arquivo:** `src/types/supabase.ts`

Types auto-gerados baseados no schema do banco.

---

## 📋 Schema do Banco de Dados

### Tabelas a Serem Criadas

O @dev criará o seguinte schema:

#### 1. `users` (Corretores)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent',
  agency TEXT DEFAULT 'Independent',
  license_number TEXT,
  phone TEXT NOT NULL,
  avatar TEXT,
  microsite_url TEXT,
  plan TEXT DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO')),
  searches_used INTEGER DEFAULT 0,
  max_searches INTEGER DEFAULT 2,
  reputation JSONB DEFAULT '{"level": "NEUTRAL", "winStreak": 0, "lossStreak": 0}',
  settings JSONB DEFAULT '{"notifications": true, "language": "pt-PT"}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `clients` (Clientes)

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar TEXT,
  location_interest TEXT NOT NULL,
  budget TEXT NOT NULL,
  status TEXT DEFAULT 'Searching',
  last_activity TIMESTAMP DEFAULT NOW(),
  archived_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `properties` (Imóveis)

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'NEW',
  agent_note TEXT,
  source TEXT DEFAULT 'manual',
  is_simulated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. `visits` (Visitas)

```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'REQUESTED',
  notes TEXT,
  timeline JSONB[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. `activities` (Atividades/Timeline)

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. `client_properties` (Many-to-Many)

```sql
CREATE TABLE client_properties (
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (client_id, property_id)
);
```

---

## 🔒 Row Level Security (RLS)

Políticas de segurança que serão criadas:

### Princípio: Usuários só veem seus próprios dados

```sql
-- Users: usuários podem ler e atualizar apenas seus próprios dados
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Clients: usuários só veem seus próprios clientes
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own clients"
  ON clients
  USING (user_id = auth.uid());

-- Properties: usuários só veem suas próprias propriedades
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own properties"
  ON properties
  USING (user_id = auth.uid());

-- Visits: usuários só veem suas próprias visitas
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own visits"
  ON visits
  USING (user_id = auth.uid());

-- Activities: usuários só veem suas próprias atividades
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own activities"
  ON activities
  USING (user_id = auth.uid());
```

---

## 🚀 Como Usar

### Autenticação

```typescript
import { useSupabaseAuth } from './contexts/SupabaseAuthContext';

function LoginPage() {
  const { signIn, loading } = useSupabaseAuth();

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) {
      console.error('Login failed:', error.message);
    } else {
      console.log('Logged in:', data.user);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### CRUD Operations

```typescript
import { supabase } from './lib/supabase';

// Criar cliente
const createClient = async (clientData) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();

  return { data, error };
};

// Listar clientes
const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Atualizar cliente
const updateClient = async (id, updates) => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

// Deletar cliente
const deleteClient = async (id) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  return { error };
};
```

### Real-time Subscriptions

```typescript
import { subscribeToChannel } from './lib/supabase';

// Escutar mudanças em clientes
const subscription = subscribeToChannel(
  'clients',
  'INSERT',
  (payload) => {
    console.log('New client added:', payload.new);
  }
);

// Cleanup
subscription.unsubscribe();
```

---

## 📦 Storage (Upload de Imagens)

### Configuração de Bucket

No dashboard do Supabase, criar bucket `property-images`:

1. Ir em **Storage** > **New Bucket**
2. Nome: `property-images`
3. Public: ✅ (para imagens públicas)
4. File size limit: 5MB
5. Allowed MIME types: `image/jpeg, image/png, image/webp`

### Upload de Imagem

```typescript
import { supabase } from './lib/supabase';

const uploadPropertyImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath);

  return publicUrl;
};
```

---

## 🔄 Migração de Dados Mock → Supabase

### Passo 1: Atualizar Services

**Antes (Mock):**
```typescript
const clients = localStorage.getItem('clients');
```

**Depois (Supabase):**
```typescript
const { data: clients } = await supabase
  .from('clients')
  .select('*');
```

### Passo 2: Criar API Hooks

```typescript
// src/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
```

---

## 📊 Dashboard do Supabase

Acesse: https://app.supabase.com/project/hdzbenshvrzndyijreio

**Features:**
- **Table Editor:** Editar dados manualmente
- **SQL Editor:** Executar queries SQL
- **Auth:** Gerenciar usuários
- **Storage:** Ver arquivos uploaded
- **Database:** Ver schema, migrations
- **Logs:** Ver logs de requisições

---

## ✅ Próximos Passos

### 1. Criar Schema (com @dev)

Execute o SQL para criar todas as tabelas e políticas RLS.

### 2. Habilitar Auth

No dashboard Supabase:
- **Authentication** > **Providers**
- Habilitar **Email** provider
- Configurar **Email Templates** (opcional)

### 3. Atualizar Frontend

- Substituir mock data por Supabase calls
- Atualizar Login page para usar `useSupabaseAuth`
- Criar hooks para cada tabela (useClients, useProperties, etc.)

### 4. Deploy

- Frontend: Vercel (já configurado)
- Backend: Supabase (já está online!)

---

## 💰 Custo

**Supabase Free Tier:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 50.000 MAU (Monthly Active Users)
- ✅ 2GB bandwidth

**Suficiente para:**
- 500 usuários ativos
- 10.000 clientes
- 50.000 propriedades

**Quando upgrade para Pro ($25/mês)?**
- Se > 500 MAU
- Se > 500MB database
- Se > 1GB storage

---

## 📚 Recursos

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers (React)](https://supabase.com/docs/guides/auth/auth-helpers/react)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

**Criado por:** @architect (Aria)
**Status:** ✅ Cliente Configurado - Aguardando Schema do DB (@dev)
**Próximo:** Criar tabelas e RLS no Supabase

---

_Supabase economiza 2-3 semanas vs. backend custom. Excelente escolha! 🚀_
