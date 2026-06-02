import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import NotificationItem from '../../components/notifications/NotificationItem'
import { useToast } from '../../components/ui/ToastProvider'
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  confirmClaimReceived,
  type Notification,
} from '../../services/itemService'

export default function NotificationsPage() {
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [allBusy, setAllBusy] = useState(false)

  const loadNotifications = async () => {
    setLoading(true)
    try {
      setNotifications(await listNotifications())
    } catch {
      showToast('Unable to load notifications right now.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadNotifications()
  }, [])

  const handleMarkRead = async (id: number) => {
    setBusyId(id)
    try {
      await markNotificationRead(id)
      setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)))
    } catch {
      showToast('Unable to update notification.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id: number) => {
    setBusyId(id)
    try {
      await deleteNotification(id)
      setNotifications((current) => current.filter((notification) => notification.id !== id))
      showToast('Notification deleted.', 'info')
    } catch {
      showToast('Unable to delete notification.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleConfirmReceived = async (claimId: number) => {
    const previous = notifications.slice()
    setBusyId(claimId)
    // optimistic update
    setNotifications((current) => current.map((n) => (n.reference_id === claimId ? { ...n, is_read: true } : n)))
    window.dispatchEvent(new Event('claims:updated'))
    try {
      await confirmClaimReceived(claimId)
      showToast('Marked as received. Claim completed.', 'success')
    } catch {
      setNotifications(previous)
      showToast('Unable to confirm receipt right now.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleMarkAllRead = async () => {
    setAllBusy(true)
    try {
      const response = await markAllNotificationsRead()
      setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })))
      showToast(response.updated > 0 ? `Marked ${response.updated} notification${response.updated === 1 ? '' : 's'} as read.` : 'No unread notifications.', 'success')
    } catch {
      showToast('Unable to update notifications.', 'error')
    } finally {
      setAllBusy(false)
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Notifications"
        title="Everything happening on your account"
        description="Track claim updates, match alerts, and announcements in one place. You can mark items as read, clear them all, or remove old alerts."
        actions={
          <>
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              disabled={allBusy || unreadCount === 0}
              className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allBusy ? 'Updating...' : 'Mark all read'}
            </button>
            <Link
              to="/dashboard"
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/10 dark:text-paper dark:hover:bg-white/10"
            >
              Back to dashboard
            </Link>
          </>
        }
      />

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-4 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/45">Unread</p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">{unreadCount} notification{unreadCount === 1 ? '' : 's'}</h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white/80 p-5 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-paper/60">
            Loading notifications...
          </div>
        ) : notifications.length ? (
          <div className="grid gap-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                busy={busyId === notification.id}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                onConfirmReceived={handleConfirmReceived}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-6 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-paper/60">
            No notifications yet. New matches, claims, and announcements will appear here automatically.
          </div>
        )}
      </section>
    </div>
  )
}