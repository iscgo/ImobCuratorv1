# 🚀 Setup OpenAI Integration

## ✅ O que foi feito

1. **Removido**: Google Gemini (`@google/genai`)
2. **Adicionado**: OpenAI SDK (`openai`)
3. **Migrado**: Toda a lógica de IA para usar OpenAI GPT-4o e GPT-4o-mini
4. **Apagado**: Todos os dados fictícios de clientes para teste limpo
5. **Criado**: Serviço centralizado de IA em `src/services/aiService.ts`

## 📋 Arquivos Modificados

### Core
- **src/services/aiService.ts** (NOVO) - Serviço centralizado para todas as chamadas OpenAI
- **package.json** - Substituiu @google/genai por openai

### Páginas
- **src/pages/PropertyImport.tsx** - Busca de imóveis com IA
- **src/pages/ClientManager.tsx** - Geração de mensagens para clientes
- **src/pages/Properties.tsx** - Extração de dados de imóvel por URL

## 🔑 Configuração de API

### Opção 1: Usando a chave fornecida

A chave já está em `.env`:
```
VITE_OPENAI_API_KEY=sk-proj-...
```

### Opção 2: Usando sua própria chave

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave (revogue a anterior se necessário)
3. Copie-a
4. Adicione ao arquivo `.env`:
```
VITE_OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

## 🧪 Como Testar

### 1. **Instalar dependências** (já feito)
```bash
npm install
```

### 2. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
```

### 3. **Testar cada funcionalidade**

#### A) **Busca de Imóveis com IA**
- Acesse: `http://localhost:5173/#/import`
- Preencha os dados:
  - Nome do cliente
  - Localização (ex: Lisboa)
  - Orçamento (ex: 300000)
  - Critérios adicionais
- Clique "Buscar Imóveis"
- ✅ A IA deve retornar 15 imóveis reais

#### B) **Geração de Mensagens**
- Acesse: `http://localhost:5173/#/clients`
- Selecione um cliente
- Clique em "Atualizar Proposta" ou "Contactar Agente"
- ✅ A IA deve gerar uma mensagem personalizada

#### C) **Extração de Dados**
- Acesse: `http://localhost:5173/#/properties`
- Cole um URL de imóvel
- Clique "Extrair Dados"
- ✅ A IA deve extrair os dados automaticamente

## 📊 Modelos de IA Utilizados

| Funcionalidade | Modelo | Razão |
|---|---|---|
| Busca de imóveis | GPT-4o | Mais capaz para análise complexa |
| Mensagens | GPT-4o-mini | Rápido e econômico |
| Extração de dados | GPT-4o-mini | Simples e barato |

## 💰 Custo Estimado

- **Busca de imóveis**: ~$0.01-0.02 por busca
- **Mensagem**: ~$0.001 por mensagem
- **Extração**: ~$0.001 por extração

## ⚠️ Segurança

- **NUNCA** commit a chave de API em git
- Use variáveis de ambiente
- A chave fornecida é temporária - revogue assim que possível
- Guarde suas chaves privadas

## 🐛 Troubleshooting

### "API Key not found"
```
✅ Certifique-se que VITE_OPENAI_API_KEY está em .env
✅ Reinicie o servidor de desenvolvimento
```

### "Invalid API Key"
```
✅ Acesse https://platform.openai.com/account/api-keys
✅ Verifique se a chave está ativa
✅ Copie exatamente (sem espaços)
```

### Erros de rate limit
```
✅ Espere alguns segundos entre requisições
✅ Considere fazer upgrade da conta OpenAI
```

## 📝 Próximos Passos

1. Testar todas as 3 funcionalidades
2. Adicionar seus próprios clientes e imóveis
3. Monitorar uso de API em: https://platform.openai.com/usage
4. Ajustar modelos conforme necessário

## 🎯 Dicas

- Use sempre dados reais para testes
- A IA aprende melhor com prompts específicos
- Revise as respostas antes de usar em produção
- Mantenha histórico de requisições para análise

---

**Status**: ✅ Pronto para testar
**Última atualização**: 2026-01-31
