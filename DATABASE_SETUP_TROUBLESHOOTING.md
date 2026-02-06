# Database Setup Troubleshooting - Supabase Connection

## 🔴 Error: Can't reach database server

**Error:** `P1001: Can't reach database server at db.hdzbenshvrzndyijreio.supabase.co`

### Possíveis Causas e Soluções

#### 1. **Verificar Credenciais (CRÍTICO)**
```bash
# Sua connection string atual:
postgresql://postgres:YaeWlDL8s63Weilz@db.hdzbenshvrzndyijreio.supabase.co:6543/postgres?pgbouncer=true

# Verifique no Supabase Dashboard:
# 1. Vá para Project Settings > Database
# 2. Copie a connection string exata da seção "Connection Pooler"
# 3. Certifique-se de que a senha está correta (sem caracteres especiais codificados)
```

#### 2. **Tentar Porta Direta (sem pgbouncer)**
```bash
# Se pgbouncer não funcionar, tente:
DATABASE_URL="postgresql://postgres:YaeWlDL8s63Weilz@db.hdzbenshvrzndyijreio.supabase.co:5432/postgres"
```

#### 3. **Verificar Firewall/Rede**
```bash
# Testar conectividade (macOS/Linux):
nc -zv db.hdzbenshvrzndyijreio.supabase.co 6543
nc -zv db.hdzbenshvrzndyijreio.supabase.co 5432

# Se ambos falharem:
# - Seu firewall pode estar bloqueando
# - VPN/Proxy pode estar interferindo
# - Rede local pode ter restrições
```

#### 4. **Verificar Connection String Format**

O Supabase fornece diferentes formats. Certifique-se de usar:

**Connection Pooler** (recomendado para aplicações):
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

**Direct Connection** (para ferramentas de banco):
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### 5. **Verificar se Supabase Project está Ativo**
- Faça login em https://app.supabase.com
- Verifique se o projeto está "Active" (não pausado)
- Verifique se há um aviso de overdraft ou suspensão

#### 6. **Resetar Password do Database (se necessário)**
```bash
# No Supabase Dashboard:
# 1. Project Settings > Database
# 2. Clique em "Reset database password"
# 3. Copie a nova senha
# 4. Atualize a .env com a nova senha
```

---

## ✅ Próximas Ações

### Se você conseguir conectar:
```bash
cd /Users/Isaac1005/Documents/ImobCurator/api
npx prisma migrate dev --name init
npx prisma studio
```

### Se ainda não conseguir conectar:
1. **Verifique a connection string exata** no Supabase Dashboard
2. **Teste a conexão manualmente** com psql ou DBeaver
3. **Contate suporte do Supabase** se credenciais estão corretas

---

## 📋 Checklist de Diagnóstico

- [ ] Credentials (senha) são exatos do Supabase
- [ ] Usando Connection Pooler (porta 6543) ou Direct (porta 5432)
- [ ] Supabase project está ativo (não pausado)
- [ ] Firewall permite conexão PostgreSQL
- [ ] Testou `nc -zv` para conexão
- [ ] .env tem a connection string correta
- [ ] Não há caracteres especiais ou espaços em branco

---

## 🆘 Se Tudo Falhar: Alternativas

### Opção A: PostgreSQL Local (Rápido para desenvolvimento)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb imobcurator
```

Depois atualizar `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/imobcurator"
```

### Opção B: Docker PostgreSQL
```bash
docker run -d \
  --name imobcurator-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=imobcurator \
  -p 5432:5432 \
  postgres:15
```

Depois atualizar `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/imobcurator"
```

---

## 🔗 Recursos

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Supabase Connection Pooler](https://supabase.com/docs/guides/database/connections/pooling)
- [Prisma Database Connection Errors](https://www.prisma.io/docs/reference/error-reference#p1000)

---

**Próximo passo:** Compartilhe o erro exato e a connection string (esconda a senha) para diagnóstico mais preciso.
