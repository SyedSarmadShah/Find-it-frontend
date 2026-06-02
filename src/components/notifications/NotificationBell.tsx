import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/ToastProvider'
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  confirmClaimReceived,
  type Notification,
} from '../../services/itemService'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell() {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const containerRef = useRef<HTMLDivElement>(null)
  const seenIdsRef = useRef<Set<number>>(new Set())
  const initializedRef = useRef(false)
  const loadErrorNotifiedRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [allBusy, setAllBusy] = useState(false)

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.is_read).length, [notifications])

  const loadNotifications = async (announce = false) => {
    if (!isAuthenticated) {
      return
    }

    setLoading(true)
    try {
      const data = await listNotifications()
      if (announce && initializedRef.current) {
        const unseen = data.filter((notification) => !seenIdsRef.current.has(notification.id) && !notification.is_read)
        if (unseen.length > 0) {
          showToast(unseen.length === 1 ? unseen[0].title : `${unseen.length} new notifications`, 'info')
        }
      }

      seenIdsRef.current = new Set(data.map((notification) => notification.id))
      setNotifications(data)
      initializedRef.current = true
      loadErrorNotifiedRef.current = false
    } catch {
      if (!loadErrorNotifiedRef.current) {
        showToast('Unable to load notifications right now.', 'error')
        loadErrorNotifiedRef.current = true
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([])
      setLoading(false)
      loadErrorNotifiedRef.current = false
      return
    }

    void loadNotifications(false)
    const intervalId = window.setInterval(() => {
      void loadNotifications(true)
    }, 30000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const updateNotification = (id: number, updater: (notification: Notification) => Notification) => {
    setNotifications((current) => current.map((notification) => (notification.id === id ? updater(notification) : notification)))
  }

  const handleMarkRead = async (id: number) => {
    setBusyId(id)
    try {
      await markNotificationRead(id)
      updateNotification(id, (notification) => ({ ...notification, is_read: true }))
      showToast('Notification marked as read.', 'success')
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
    // optimistic update: mark notification(s) referring to this claim as read
    setNotifications((current) => current.map((n) => (n.reference_id === claimId ? { ...n, is_read: true } : n)))
    // notify other parts of the UI immediately
    window.dispatchEvent(new Event('claims:updated'))
    try {
      await confirmClaimReceived(claimId)
      showToast('Marked as received. Claim completed.', 'success')
    } catch {
      // revert optimistic change on failure
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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/70 text-ink transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-paper dark:hover:bg-white/10"
        aria-label="Open notifications"
        aria-expanded={open}
        aria-controls="notification-dropdown"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
          <path d="M12 6a4 4 0 0 0-4 4v2.3c0 .6-.18 1.19-.51 1.69L6 15.5h12l-1.49-1.51a2.9 2.9 0 0 1-.51-1.69V10a4 4 0 0 0-4-4Z" />
          <path d="M9.5 18a2.5 2.5 0 0 0 5 0" />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-rust px-1.5 py-0.5 text-[10px] font-bold leading-none text-ink dark:text-paper shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      <div id="notification-dropdown">
        <NotificationDropdown
          open={open}
          notifications={notifications}
          loading={loading}
          busyId={busyId}
          allBusy={allBusy}
          onClose={() => setOpen(false)}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
          onMarkAllRead={handleMarkAllRead}
          onConfirmReceived={handleConfirmReceived}
        />
      </div>
    </div>
  )
}