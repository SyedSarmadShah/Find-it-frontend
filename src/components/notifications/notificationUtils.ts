import type { Notification } from '../../services/itemService'

export const notificationTypeLabels: Record<Notification['type'], string> = {
  new_match_found: 'New match',
  claim_request_received: 'Claim request',
  claim_approved: 'Claim approved',
  claim_rejected: 'Claim rejected',
  item_returned: 'Item returned',
  new_comment: 'New comment',
  admin_announcement: 'Announcement',
}

export const notificationTypeTones: Record<Notification['type'], string> = {
  new_match_found: 'bg-moss/15 text-moss dark:bg-moss/20 dark:text-paper',
  claim_request_received: 'bg-navy/10 text-navy dark:bg-navy/20 dark:text-paper',
  claim_approved: 'bg-moss/15 text-moss dark:bg-moss/20 dark:text-paper',
  claim_rejected: 'bg-rust/15 text-rust dark:bg-rust/20 dark:text-paper',
  item_returned: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-paper',
  new_comment: 'bg-sand text-ink dark:bg-white/10 dark:text-paper',
  admin_announcement: 'bg-ink/10 text-ink dark:bg-white/10 dark:text-paper',
}

export function formatNotificationTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}