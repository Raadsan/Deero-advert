import { prisma } from './lib/prisma.js';

async function test() {
  console.log('Available models on prisma:', Object.keys(prisma).filter(k => !k.startsWith('$')));
  try {
    const count = await prisma.companyContact.count();
    console.log('CompanyContact count:', count);
  } catch (e) {
    console.error('Error accessing companyContact:', e.message);
  }
  process.exit(0);
}

test();
