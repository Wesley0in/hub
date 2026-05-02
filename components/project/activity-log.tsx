'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Activity } from 'lucide-react'
import { ActivityLog } from '@/lib/types'

interface ActivityLogSectionProps {
  logs: ActivityLog[]
}

export function ActivityLogSection({ logs }: ActivityLogSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/70">Histórico de Atividades</h3>

      {logs.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-4">Nenhuma atividade registrada</p>
      ) : (
        <div className="space-y-0 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/6" />
          {logs.map((log, i) => (
            <div key={log.id} className="flex gap-3 pb-4 relative">
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 shrink-0 mt-0.5 relative z-10" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 leading-relaxed">{log.action}</p>
                {log.detail && (
                  <p className="text-[11px] text-white/35 mt-0.5 truncate">{log.detail}</p>
                )}
                <p className="text-[10px] text-white/25 mt-1">
                  {formatDistanceToNow(new Date(log.created_at), { locale: ptBR, addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
