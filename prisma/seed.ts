const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // 1. Skapa din användare (Advokat)
  const hashedPassword = await bcrypt.hash('advokat123', 10) // Ditt lösenord blir 'advokat123'
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@advokat.se' },
    update: {},
    create: {
      email: 'admin@advokat.se',
      name: 'Chefsadvokat',
      password: hashedPassword,
    },
  })

  // 2. Skapa en test-klient
  const client = await prisma.client.create({
    data: {
      name: 'Svensson Entreprenad AB',
      email: 'info@svensson.se',
      orgNr: '556677-8899',
    },
  })

  // 3. Skapa ett test-ärende
  await prisma.case.create({
    data: {
      title: 'Avtalsgranskning: Nybygge City',
      description: 'Genomgång av entreprenadavtal.',
      clientId: client.id,
      status: 'OPEN',
      logs: { create: { action: 'Ärende skapat via system-initiering.' } }
    },
  })

  console.log('Databasen uppdaterad! Din inloggning är:')
  console.log('E-post: admin@advokat.se')
  console.log('Lösenord: advokat123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })