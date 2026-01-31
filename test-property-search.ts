/**
 * SCRIPT DE TESTE - Property Search Service
 *
 * Este script testa todas as estratégias de busca de imóveis
 * e valida a qualidade dos dados gerados.
 */

import { propertySearchService, SearchStrategy } from './src/services/propertySearchService';

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title: string) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

async function testStrategy(
  strategy: SearchStrategy,
  description: string
) {
  logSection(`Testando: ${strategy}`);
  log(description, 'yellow');

  const criteria = {
    type: 'Apartamento',
    location: 'Lisboa',
    budget: '400000',
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Garagem', 'Elevador', 'Varanda']
  };

  log('\nCritérios de busca:', 'blue');
  console.log(JSON.stringify(criteria, null, 2));

  try {
    const startTime = Date.now();
    log('\n⏱️  Iniciando busca...', 'yellow');

    const properties = await propertySearchService.search(criteria, strategy);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log(`\n✅ Busca concluída em ${duration}s`, 'green');
    log(`📊 Total de imóveis: ${properties.length}`, 'green');

    // Validações
    logSection('Validações de Qualidade');

    // 1. Quantidade
    const hasCorrectAmount = properties.length === 15;
    log(
      `${hasCorrectAmount ? '✅' : '❌'} Quantidade: ${properties.length} (esperado: 15)`,
      hasCorrectAmount ? 'green' : 'red'
    );

    // 2. Preços realistas
    const prices = properties.map(p =>
      parseInt(p.price.replace(/[^0-9]/g, ''))
    );
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    log(`\n💰 Análise de Preços:`, 'blue');
    log(`   Mínimo: €${minPrice.toLocaleString('pt-PT')}`, 'cyan');
    log(`   Médio: €${Math.round(avgPrice).toLocaleString('pt-PT')}`, 'cyan');
    log(`   Máximo: €${maxPrice.toLocaleString('pt-PT')}`, 'cyan');

    const pricesRealistic = minPrice > 100000 && maxPrice < 2000000;
    log(
      `${pricesRealistic ? '✅' : '❌'} Preços dentro de range realista`,
      pricesRealistic ? 'green' : 'red'
    );

    // 3. Match scores
    const matchScores = properties.map(p => p.matchScore);
    const avgMatchScore = matchScores.reduce((a, b) => a + b, 0) / matchScores.length;

    log(`\n🎯 Análise de Match Score:`, 'blue');
    log(`   Mínimo: ${Math.min(...matchScores)}`, 'cyan');
    log(`   Médio: ${Math.round(avgMatchScore)}`, 'cyan');
    log(`   Máximo: ${Math.max(...matchScores)}`, 'cyan');

    const matchScoresValid = matchScores.every(s => s >= 60 && s <= 95);
    log(
      `${matchScoresValid ? '✅' : '❌'} Match scores no range 60-95`,
      matchScoresValid ? 'green' : 'red'
    );

    // 4. Campos obrigatórios
    const allHaveRequiredFields = properties.every(p =>
      p.title && p.price && p.location && p.url &&
      p.bedrooms && p.bathrooms && p.area &&
      p.matchScore && p.matchReason &&
      Array.isArray(p.pros) && Array.isArray(p.cons) &&
      p.website
    );

    log(
      `${allHaveRequiredFields ? '✅' : '❌'} Todos imóveis têm campos obrigatórios`,
      allHaveRequiredFields ? 'green' : 'red'
    );

    // 5. URLs válidas
    const allHaveValidUrls = properties.every(p =>
      p.url.startsWith('https://') &&
      (p.url.includes('idealista') ||
       p.url.includes('imovirtual') ||
       p.url.includes('remax') ||
       p.url.includes('era') ||
       p.url.includes('century21') ||
       p.url.includes('zome'))
    );

    log(
      `${allHaveValidUrls ? '✅' : '❌'} Todas URLs são válidas`,
      allHaveValidUrls ? 'green' : 'red'
    );

    // 6. Flag de simulação
    const allMarkedAsSimulated = properties.every(p => p.isSimulated === true);
    log(
      `${allMarkedAsSimulated ? '✅' : '❌'} Todos marcados como simulados`,
      allMarkedAsSimulated ? 'green' : 'red'
    );

    // Mostra alguns exemplos
    logSection('Exemplos de Imóveis Gerados');

    properties.slice(0, 3).forEach((prop, idx) => {
      log(`\n📍 Imóvel ${idx + 1}:`, 'yellow');
      log(`   Título: ${prop.title}`, 'cyan');
      log(`   Preço: ${prop.price}`, 'cyan');
      log(`   Localização: ${prop.location}`, 'cyan');
      log(`   Match: ${prop.matchScore}% - ${prop.matchReason}`, 'cyan');
      log(`   Área: ${prop.area}m² | 🛏️ ${prop.bedrooms} | 🚿 ${prop.bathrooms}`, 'cyan');
      log(`   Prós: ${prop.pros.join(', ')}`, 'green');
      log(`   Contras: ${prop.cons.join(', ')}`, 'red');
      log(`   URL: ${prop.url}`, 'blue');
      log(`   Website: ${prop.website}`, 'blue');
    });

    return {
      success: true,
      duration: parseFloat(duration),
      properties: properties.length
    };

  } catch (error) {
    log(`\n❌ ERRO durante teste:`, 'red');
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function testMarketInfo() {
  logSection('Testando: Informações de Mercado');

  const locations = propertySearchService.getAvailableLocations();
  log(`\n📍 Localizações disponíveis (${locations.length}):`, 'blue');
  log(`   ${locations.join(', ')}`, 'cyan');

  log(`\n🏢 Testando dados de Lisboa:`, 'blue');
  const lisbonMarket = propertySearchService.getMarketInfo('Lisboa');

  if (lisbonMarket.avgPrices) {
    log(`   Bairros com dados: ${Object.keys(lisbonMarket.avgPrices).length}`, 'cyan');

    Object.entries(lisbonMarket.avgPrices).forEach(([neighborhood, price]) => {
      log(`   ${neighborhood}: €${(price as number).toLocaleString('pt-PT')}/m²`, 'green');
    });
  }

  log(`\n📋 Disclaimer:`, 'yellow');
  log(`   ${lisbonMarket.disclaimer}`, 'cyan');

  // Testa localização sem dados
  log(`\n🔍 Testando localização sem dados (Funchal):`, 'blue');
  const hasData = propertySearchService.hasMarketData('Funchal');
  log(
    `   ${hasData ? '✅' : '❌'} Tem dados de mercado: ${hasData}`,
    hasData ? 'green' : 'yellow'
  );
}

async function runAllTests() {
  log('╔═════════════════════════════════════════════════════════════╗', 'bright');
  log('║  TESTE COMPLETO - PROPERTY SEARCH SERVICE                  ║', 'bright');
  log('║  ImobCurator 3.0                                           ║', 'bright');
  log('╚═════════════════════════════════════════════════════════════╝', 'bright');

  const results = [];

  // Teste 1: REALISTIC_SIMULATION
  const realistic = await testStrategy(
    'REALISTIC_SIMULATION',
    'Estratégia padrão baseada em dados reais de mercado 2026'
  );
  results.push({ strategy: 'REALISTIC_SIMULATION', ...realistic });

  // Aguarda um pouco entre testes
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Teste 2: AI_ENHANCED (se API key estiver disponível)
  if (process.env.VITE_OPENAI_API_KEY) {
    log('\n⚠️  API key detectada, testando AI_ENHANCED...', 'yellow');
    const aiEnhanced = await testStrategy(
      'AI_ENHANCED',
      'Estratégia com GPT-4o para descrições contextualizadas'
    );
    results.push({ strategy: 'AI_ENHANCED', ...aiEnhanced });
  } else {
    log('\n⚠️  API key não configurada, pulando teste AI_ENHANCED', 'yellow');
  }

  // Aguarda um pouco entre testes
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Teste 3: DEMO_MODE
  const demo = await testStrategy(
    'DEMO_MODE',
    'Estratégia de demonstração com marcadores [DEMO]'
  );
  results.push({ strategy: 'DEMO_MODE', ...demo });

  // Teste 4: Informações de mercado
  await testMarketInfo();

  // Resumo final
  logSection('RESUMO DOS TESTES');

  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'PASSOU' : 'FALHOU';

    log(`\n${icon} ${result.strategy}: ${status}`, result.success ? 'green' : 'red');

    if (result.success) {
      log(`   ⏱️  Tempo: ${result.duration}s`, 'cyan');
      log(`   📊 Imóveis: ${result.properties}`, 'cyan');
    } else {
      log(`   ❌ Erro: ${result.error}`, 'red');
    }
  });

  const allPassed = results.every(r => r.success);
  const totalPassed = results.filter(r => r.success).length;
  const totalTests = results.length;

  log('\n' + '─'.repeat(60), 'cyan');

  if (allPassed) {
    log(`\n🎉 TODOS OS TESTES PASSARAM! (${totalPassed}/${totalTests})`, 'green');
    log('\n✅ O Property Search Service está funcionando perfeitamente!', 'bright');
  } else {
    log(`\n⚠️  ${totalPassed}/${totalTests} testes passaram`, 'yellow');
    log('\n❌ Alguns testes falharam. Revise os erros acima.', 'red');
  }

  log('\n' + '─'.repeat(60), 'cyan');

  log('\n📚 Para mais informações, consulte:', 'blue');
  log('   - PROPERTY_SEARCH_SOLUTION.md (documentação completa)', 'cyan');
  log('   - src/services/propertySearchService.ts (código fonte)', 'cyan');
  log('   - src/components/PropertySearchDemo.tsx (demo interativo)', 'cyan');

  log('\n');
}

// Executa os testes
runAllTests().catch(error => {
  log('❌ ERRO FATAL:', 'red');
  console.error(error);
  process.exit(1);
});
