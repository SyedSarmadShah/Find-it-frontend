import { Link } from 'react-router-dom'
import type { Notification } from '../../services/itemService'
import NotificationItem from './NotificationItem'

type NotificationDropdownProps = {
  open: boolean
  notifications: Notification[]
  loading: boolean
  busyId: number | null
  allBusy: boolean
  onClose: () => void
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
  onMarkAllRead: () => void
}

export default function NotificationDropdown({
  open,
  notifications,
  loading,
  busyId,
  allBusy,
  onClose,
  onMarkRead,
  onDelete,
  onMarkAllRead,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  if (!open) {
    return null
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,24rem)] overflow-hidden rounded-[1.75rem] border border-black/5 bg-[color:var(--app-bg)] shadow-[0_28px_80px_rgba(11,23,39,0.22)] backdrop-blur-xl dark:border-white/10">
      <div className="flex items-start justify-between gap-3 border-b border-black/5 px-4 py-4 dark:border-white/10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rust dark:text-paper/55">Notifications</p>
          <h2 className="mt-1 font-display text-xl font-bold text-ink dark:text-paper">Stay in sync</h2>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
            {unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-black/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-black/10 dark:bg-white/5 dark:text-paper dark:hover:bg-white/10"
        >
          Close
        </button>
      </div>

      <div className="max-h-[min(70vh,36rem)] overflow-y-auto p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={allBusy || unreadCount === 0}
            className="rounded-full bg-moss px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allBusy ? 'Updating...' : 'Mark all read'}
          </button>
          <Link
            to="/notifications"
            onClick={onClose}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-black/5 dark:border-white/10 dark:text-paper dark:hover:bg-white/10"
          >
            View page
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white/70 p-4 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-paper/60">
            Loading notifications...
          </div>
        ) : notifications.length ? (
          <div className="grid gap-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                busy={busyId === notification.id}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-5 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-paper/60">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  )
}