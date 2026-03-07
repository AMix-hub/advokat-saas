'use client'
import dynamic from 'next/dynamic'

const ReportsOverview = dynamic(() => import('./ReportsOverview'), { ssr: false })

export default function ReportsOverviewClient() {
  return <ReportsOverview />
}
