import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany();
  console.log(JSON.stringify(teams, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
