/**
 * Setup Database Script
 * Executa o schema SQL no Supabase
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Criar cliente com service role (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log('🚀 Iniciando setup do banco de dados...\n');

  try {
    // Ler schema SQL
    const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('📄 Schema SQL lido com sucesso');
    console.log(`   Tamanho: ${schema.length} caracteres\n`);

    // Executar SQL
    console.log('⚙️  Executando schema no Supabase...');

    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: schema
    });

    if (error) {
      // Se a função exec_sql não existir, vamos tentar executar por partes
      console.log('⚠️  Função exec_sql não disponível, executando manualmente via Dashboard...\n');
      console.log('📋 INSTRUÇÕES MANUAIS:');
      console.log('1. Acesse: https://app.supabase.com/project/hdzbenshvrzndyijreio/sql/new');
      console.log('2. Copie todo o conteúdo de: /supabase/schema.sql');
      console.log('3. Cole no SQL Editor');
      console.log('4. Clique em "Run"');
      console.log('5. Verifique a criação das 6 tabelas no Table Editor\n');

      console.log('✅ Por favor, execute manualmente e depois continue com as próximas tarefas.');
      process.exit(0);
    }

    console.log('✅ Schema executado com sucesso!\n');

    // Verificar tabelas criadas
    console.log('🔍 Verificando tabelas criadas...');

    const tables = ['users', 'clients', 'properties', 'visits', 'activities', 'client_properties'];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: ERRO - ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: OK (${count} registros)`);
      }
    }

    console.log('\n✨ Setup completo!\n');
    console.log('📝 Próximos passos:');
    console.log('   1. Criar serviços de integração Supabase');
    console.log('   2. Configurar React Query');
    console.log('   3. Migrar páginas para usar Supabase\n');

  } catch (error: any) {
    console.error('❌ Erro ao executar schema:', error.message);
    console.log('\n📋 Execute manualmente via Dashboard:');
    console.log('   https://app.supabase.com/project/hdzbenshvrzndyijreio/sql/new\n');
    process.exit(1);
  }
}

// Executar
setupDatabase();
