/**
 * TEST: Apify Integration - Real Property Search
 *
 * Este script testa a integração com Apify Idealista Scraper
 */

import { apifyService } from './src/services/apifyService';
import { propertySearchService } from './src/services/propertySearchService';

async function testApifyConnection() {
  console.log('\n🧪 TESTE 1: Verificando conexão com Apify\n');
  console.log('─'.repeat(60));

  const isConnected = await apifyService.testConnection();

  if (isConnected) {
    console.log('✅ Conexão com Apify estabelecida com sucesso!');
  } else {
    console.log('❌ Falha na conexão com Apify');
    console.log('💡 Verifique se APIFY_API_TOKEN está configurado em .env');
  }

  console.log('─'.repeat(60));
}

async function testRealPropertySearch() {
  console.log('\n🧪 TESTE 2: Busca de imóveis reais via Apify\n');
  console.log('─'.repeat(60));

  const criteria = {
    type: 'Apartamento',
    location: 'Lisboa',
    budget: '350000',
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Garagem', 'Elevador']
  };

  console.log('📍 Critérios de busca:');
  console.log(JSON.stringify(criteria, null, 2));
  console.log('\n⏳ Buscando... (pode levar 5-15 segundos)\n');

  try {
    const properties = await propertySearchService.search(criteria, 'REAL_SEARCH');

    console.log(`\n✅ Busca concluída! ${properties.length} imóveis encontrados\n`);
    console.log('─'.repeat(60));

    // Mostra resumo dos primeiros 3 imóveis
    properties.slice(0, 3).forEach((prop, idx) => {
      console.log(`\n📍 Imóvel ${idx + 1}:`);
      console.log(`   Título: ${prop.title}`);
      console.log(`   Preço: ${prop.price}`);
      console.log(`   Localização: ${prop.location}`);
      console.log(`   URL: ${prop.url}`);
      console.log(`   Match Score: ${prop.matchScore}%`);
      console.log(`   ${prop.isSimulated ? '⚠️  Simulado' : '✅ REAL'}`);
    });

    console.log('\n' + '─'.repeat(60));

    // Estatísticas
    const realCount = properties.filter(p => !p.isSimulated).length;
    const simulatedCount = properties.filter(p => p.isSimulated).length;

    console.log('\n📊 Estatísticas:');
    console.log(`   Imóveis reais: ${realCount}`);
    console.log(`   Imóveis simulados: ${simulatedCount}`);
    console.log(`   Total: ${properties.length}`);
  } catch (error) {
    console.error('\n❌ Erro na busca:', error);
  }

  console.log('\n' + '─'.repeat(60));
}

async function testCompareStrategies() {
  console.log('\n🧪 TESTE 3: Comparação de estratégias\n');
  console.log('─'.repeat(60));

  const criteria = {
    type: 'Apartamento',
    location: 'Lisboa',
    budget: '300000',
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Elevador']
  };

  console.log('Testando velocidade de cada estratégia...\n');

  // REALISTIC_SIMULATION
  console.log('1️⃣  REALISTIC_SIMULATION...');
  const start1 = Date.now();
  await propertySearchService.search(criteria, 'REALISTIC_SIMULATION');
  const time1 = Date.now() - start1;
  console.log(`   ⏱️  Tempo: ${time1}ms\n`);

  // AI_ENHANCED
  console.log('2️⃣  AI_ENHANCED...');
  const start2 = Date.now();
  await propertySearchService.search(criteria, 'AI_ENHANCED');
  const time2 = Date.now() - start2;
  console.log(`   ⏱️  Tempo: ${time2}ms\n`);

  // REAL_SEARCH
  if (apifyService.isConfigured()) {
    console.log('3️⃣  REAL_SEARCH...');
    const start3 = Date.now();
    await propertySearchService.search(criteria, 'REAL_SEARCH');
    const time3 = Date.now() - start3;
    console.log(`   ⏱️  Tempo: ${time3}ms\n`);

    console.log('─'.repeat(60));
    console.log('\n📊 Resumo de Performance:');
    console.log(`   REALISTIC_SIMULATION: ${time1}ms (mais rápido)`);
    console.log(`   AI_ENHANCED: ${time2}ms`);
    console.log(`   REAL_SEARCH: ${time3}ms (dados reais)`);
  } else {
    console.log('⚠️  REAL_SEARCH não disponível (APIFY_API_TOKEN não configurado)');
  }

  console.log('\n' + '─'.repeat(60));
}

async function runAllTests() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🧪 TESTE DE INTEGRAÇÃO APIFY - IMOBCURATOR 3.0        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // Teste 1: Conexão
    await testApifyConnection();

    // Teste 2: Busca real
    if (apifyService.isConfigured()) {
      await testRealPropertySearch();

      // Teste 3: Comparação
      await testCompareStrategies();
    } else {
      console.log('\n⚠️  Pulando testes de busca (Apify não configurado)');
      console.log('💡 Configure APIFY_API_TOKEN em .env para habilitar testes completos');
    }

    console.log('\n✅ Todos os testes concluídos!\n');
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error);
  }
}

// Executa todos os testes
runAllTests().catch(console.error);
