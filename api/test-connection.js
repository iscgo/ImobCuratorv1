// Test database connection
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');

    // Try to query the users table
    const count = await prisma.user.count();

    console.log('✅ Database connection successful!');
    console.log(`📊 Users in database: ${count}`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
