import { Link } from 'react-router-dom'
import type { Notification } from '../../services/itemService'
import { formatNotificationTimestamp, notificationTypeLabels, notificationTypeTones } from './notificationUtils'

type NotificationItemProps = {
  notification: Notification
  compact?: boolean
  busy?: boolean
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
}

export default function NotificationItem({ notification, compact = false, busy = false, onMarkRead, onDelete }: NotificationItemProps) {
  const unread = !notification.is_read

  return (
    <article
      className={`group rounded-2xl border bg-white/90 p-4 shadow-sm transition dark:bg-white/5 ${
        unread ? 'border-moss/20 dark:border-moss/30' : 'border-black/5 dark:border-white/10'
      } ${compact ? 'p-3' : 'p-4 sm:p-5'}`}
    >
      <div className={`flex items-start gap-3 ${compact ? 'gap-3' : 'gap-4'}`}>
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          disabled={busy}
          className={`mt-1 h-3.5 w-3.5 rounded-full border transition ${unread ? 'border-moss bg-moss shadow-[0_0_0_4px_rgba(49,91,79,0.16)]' : 'border-black/20 bg-transparent dark:border-white/20'} ${busy ? 'opacity-60' : ''}`}
          aria-label={unread ? 'Mark notification as read' : 'Notification already read'}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="min-w-0 font-semibold text-ink dark:text-paper">{notification.title}</p>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${notificationTypeTones[notification.type]}`}>
              {notificationTypeLabels[notification.type]}
            </span>
          </div>
          <p className={`mt-2 text-sm leading-6 ${compact ? 'text-ink/65 dark:text-paper/65' : 'text-ink/70 dark:text-paper/70'}`}>
            {notification.message}
          </p>
          {notification.type === 'claim_request_received' ? (
            <div className="mt-3">
              <Link
                to="/claims/review"
                className="inline-flex items-center rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-black/5 dark:border-white/10 dark:text-paper dark:hover:bg-white/10"
              >
                Review claim
              </Link>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink/45 dark:text-paper/45">
            <span>{formatNotificationTimestamp(notification.created_at)}</span>
            {unread ? <span className="rounded-full bg-moss/10 px-2 py-1 font-semibold text-moss dark:bg-moss/20 dark:text-paper">Unread</span> : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          disabled={busy}
          className="rounded-full px-3 py-2 text-xs font-semibold text-rust transition hover:bg-rust/10 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </article>
  )
}