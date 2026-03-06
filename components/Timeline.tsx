import { 
  UserPlus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2,
  MessageSquare,
  LucideIcon
} from 'lucide-react'

interface TimelineEvent {
  id: string
  action: string
  timestamp: string
  type?: 'create' | 'update' | 'delete' | 'comment' | 'status' | 'other'
  user?: string
}

interface TimelineProps {
  events: TimelineEvent[]
  title?: string
}

export default function Timeline({ events, title }: TimelineProps) {
  const getIcon = (type?: string): LucideIcon => {
    switch (type) {
      case 'create': return FileText
      case 'update': return Edit3
      case 'delete': return Trash2
      case 'comment': return MessageSquare
      case 'status': return CheckCircle2
      default: return AlertCircle
    }
  }

  const getColor = (type?: string) => {
    switch (type) {
      case 'create': return 'text-blue-400 bg-blue-500/10'
      case 'update': return 'text-amber-400 bg-amber-500/10'
      case 'delete': return 'text-red-400 bg-red-500/10'
      case 'comment': return 'text-purple-400 bg-purple-500/10'
      case 'status': return 'text-emerald-400 bg-emerald-500/10'
      default: return 'text-slate-400 bg-white/[0.04]'
    }
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/[0.08] p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" /> 
        {title || 'Aktivitetslogg'}
      </h3>

      <div className="space-y-0">
        {events.map((event, index) => {
          const Icon = getIcon(event.type)
          const colorClass = getColor(event.type)
          const isLast = index === events.length - 1

          return (
            <div key={event.id} className={`flex gap-4 pb-6 ${!isLast ? 'border-b border-white/[0.06]' : ''}`}>
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass} ring-4 ring-slate-900`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <p className="font-semibold text-slate-100">{event.action}</p>
                {event.user && (
                  <p className="text-xs text-slate-500 mt-1 font-bold">
                    av {event.user}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {new Date(event.timestamp).toLocaleString('sv-SE')}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Ingen aktivitet ännu</p>
        </div>
      )}
    </div>
  )
}
