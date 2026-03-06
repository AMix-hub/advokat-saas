import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

interface NotificationBadgeProps {
  type: 'overdue' | 'pending' | 'success' | 'info'
  title: string
  description?: string
  count?: number
}

export default function NotificationBadge({ type, title, description, count }: NotificationBadgeProps) {
  const config = {
    overdue: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      icon: AlertTriangle,
      title: 'text-red-900'
    },
    pending: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      icon: Clock,
      title: 'text-amber-900'
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      icon: CheckCircle2,
      title: 'text-green-900'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      icon: AlertCircle,
      title: 'text-blue-900'
    }
  }

  const c = config[type]
  const Icon = c.icon

  return (
    <div className={`border-2 rounded-xl p-4 ${c.bg} flex items-start gap-3`}>
      <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${c.text}`} />
      <div className="flex-1">
        <div className={`font-bold ${c.title}`}>{title}</div>
        {description && <div className={`text-sm ${c.text} opacity-80 mt-1`}>{description}</div>}
      </div>
      {count !== undefined && (
        <div className={`font-black text-2xl ${c.text} ml-4`}>{count}</div>
      )}
    </div>
  )
}
