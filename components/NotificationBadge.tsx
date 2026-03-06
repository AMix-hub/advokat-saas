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
      bg: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-400',
      icon: AlertTriangle,
      title: 'text-red-300'
    },
    pending: {
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-400',
      icon: Clock,
      title: 'text-amber-200'
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'text-emerald-400',
      icon: CheckCircle2,
      title: 'text-emerald-300'
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-blue-400',
      icon: AlertCircle,
      title: 'text-blue-300'
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
