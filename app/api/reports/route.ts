import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET - Hämta rapporter/statistik
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: token.email as string } })
    if (!user) return NextResponse.json({ error: 'Användaren hittades inte' }, { status: 401 })
    const userId = user.id

    const type = req.nextUrl.searchParams.get('type') || 'overview'
    const startDate = req.nextUrl.searchParams.get('startDate')
    const endDate = req.nextUrl.searchParams.get('endDate')

    let where: any = { assignedToId: userId }
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // OVERVIEW - Övergripande statistik
    if (type === 'overview') {
      const totalCases = await prisma.case.count({ where })
      const openCases = await prisma.case.count({ where: { ...where, status: 'OPEN' } })
      const totalRevenue = await prisma.invoice.aggregate({
        where: { status: 'PAID', case: { assignedToId: userId } },
        _sum: { totalAmount: true }
      })
      const totalHours = await prisma.timeEntry.aggregate({
        where: { case: { assignedToId: userId } },
        _sum: { hours: true }
      })

      return NextResponse.json({
        type: 'overview',
        data: {
          totalCases,
          openCases,
          closedCases: totalCases - openCases,
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          totalHours: totalHours._sum.hours || 0,
          averageHourlyRevenue: (totalRevenue._sum.totalAmount || 0) / (totalHours._sum.hours || 1)
        }
      })
    }

    // CASE_TYPES - Statistik per ärendekategori
    if (type === 'case_types') {
      const casesByType = await prisma.case.groupBy({
        by: ['caseType'],
        _count: true,
        where
      })

      const detailed = await Promise.all(
        casesByType.map(async (ct) => ({
          type: ct.caseType || 'OTHER',
          count: ct._count,
          avgHours: await prisma.timeEntry.aggregate({
            where: { case: { caseType: ct.caseType, assignedToId: userId } },
            _avg: { hours: true }
          }),
          totalRevenue: await prisma.invoice.aggregate({
            where: { 
              case: { caseType: ct.caseType, assignedToId: userId },
              status: 'PAID'
            },
            _sum: { totalAmount: true }
          })
        }))
      )

      return NextResponse.json({
        type: 'case_types',
        data: detailed
      })
    }

    // PROFITABILITY - Lönsamhetsanalys
    if (type === 'profitability') {
      const cases = await prisma.case.findMany({
        include: {
          timeEntries: true,
          expenses: true,
          invoices: { where: { status: 'PAID' } }
        },
        where
      })

      const profitability = cases.map((c) => {
        const totalHours = c.timeEntries.reduce((sum, t) => sum + t.hours, 0)
        const totalCost = totalHours * (c.hourlyRate * 0.2) // Estimerad kostnad (20% av timtaxa)
        const expenses = c.expenses.reduce((sum, e) => sum + e.amount, 0)
        const revenue = c.invoices.reduce((sum, i) => sum + i.totalAmount, 0)
        const profit = revenue - totalCost - expenses

        return {
          caseId: c.id,
          title: c.title,
          revenue,
          costs: totalCost + expenses,
          profit,
          profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0,
          hoursWorked: totalHours
        }
      })

      return NextResponse.json({
        type: 'profitability',
        data: profitability.sort((a, b) => b.profit - a.profit)
      })
    }

    // TIME_BUDGET - Jämför budgeterad tid vs faktisk tid
    if (type === 'time_budget') {
      const cases = await prisma.case.findMany({
        include: { timeEntries: true },
        where: { ...where, budgetedHours: { not: null } }
      })

      const timeBudget = cases.map((c) => ({
        caseId: c.id,
        title: c.title,
        budgeted: c.budgetedHours || 0,
        actual: c.timeEntries.reduce((sum, t) => sum + t.hours, 0),
        status: c.timeEntries.reduce((sum, t) => sum + t.hours, 0) > (c.budgetedHours || 0) ? 'OVER' : 'UNDER'
      }))

      return NextResponse.json({
        type: 'time_budget',
        data: timeBudget
      })
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Could not generate report' }, { status: 500 })
  }
}
