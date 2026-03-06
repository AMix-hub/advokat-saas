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
  const client = await prisma.client.upsert({
    where: { email: 'info@svensson.se' },
    update: {},
    create: {
      name: 'Svensson Entreprenad AB',
      email: 'info@svensson.se',
      orgNr: '556677-8899',
    },
  })

  // 3. Skapa ett test-ärende (först ta bort gamla test-ärendet om det finns)
  // Leta efter existande test-ärendet
  const existingTestCase = await prisma.case.findFirst({
    where: {
      clientId: client.id,
      title: 'Avtalsgranskning: Nybygge City'
    }
  })

  // Om den finns, radera den och all tillhörande data
  if (existingTestCase) {
    await prisma.deadline.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.invoice.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.task.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.timeEntry.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.expense.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.document.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.log.deleteMany({ where: { caseId: existingTestCase.id } })
    await prisma.case.delete({ where: { id: existingTestCase.id } })
    console.log('🗑️  Tog bort gamla test-ärendet')
  }

  const testCase = await prisma.case.create({
    data: {
      title: 'Avtalsgranskning: Nybygge City',
      description: 'Genomgång av entreprenadavtal.',
      clientId: client.id,
      status: 'OPEN',
      hourlyRate: 1500,
      logs: { create: { action: 'Ärende skapat via system-initiering.' } }
    },
  })

  // 4. Skapa test-deadlines
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const nextMonth = new Date()
  nextMonth.setDate(nextMonth.getDate() + 30)

  await prisma.deadline.create({
    data: {
      title: 'Inlämning av svarsmål',
      description: 'Inlämna svarsmål till domstolen',
      caseId: testCase.id,
      dueDate: nextWeek,
      type: 'LAW_DEADLINE',
      isCompleted: false
    }
  })

  await prisma.deadline.create({
    data: {
      title: 'Domstolsförhandling',
      description: 'Muntligt förbindelse inför Stockholm Tingsrätt',
      caseId: testCase.id,
      dueDate: nextMonth,
      type: 'COURT_DATE',
      isCompleted: false
    }
  })

  await prisma.deadline.create({
    data: {
      title: 'Klientsamtal - uppdatering',
      description: 'Ring klienten och uppdatera om ärendets status',
      caseId: testCase.id,
      dueDate: tomorrow,
      type: 'REMINDER',
      isCompleted: false
    }
  })

  // 5. Skapa test-faktura
  await prisma.invoice.create({
    data: {
      invoiceNumber: `2024-001`,
      invoiceDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'DRAFT',
      totalAmount: 45000,
      caseId: testCase.id,
      items: {
        create: [
          {
            description: 'Juridisk rådgivning - 20 timmar',
            quantity: 20,
            unitPrice: 1500,
            amount: 30000
          },
          {
            description: 'Dokumentgranskning',
            quantity: 10,
            unitPrice: 1500,
            amount: 15000
          }
        ]
      }
    }
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