import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function run() {
  try {
    const tables = await prisma.$queryRawUnsafe(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const tableNames = tables.map(t => t.table_name.toLowerCase());

    const hasUserTable = tableNames.includes('user');
    const hasMigrationsTable = tableNames.includes('_prisma_migrations');

    if (hasUserTable && !hasMigrationsTable) {
      console.log('Detected existing database without Prisma migrations. Baselining 0_init...');
      execSync('npx prisma migrate resolve --applied 0_init', { stdio: 'inherit', env: process.env });
    }
    
    console.log('Running migrate deploy...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
  } catch (error) {
    console.error('Release script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
