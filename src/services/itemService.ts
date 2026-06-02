import api from '../lib/api'

export type Item = {
  id: number
  owner: number
  owner_email: string
  item_type: 'lost' | 'found'
  title: string
  description: string
  image?: string | null
  image_url?: string | null
  category: string
  location: string
  map_x?: number | string | null
  map_y?: number | string | null
  status: 'open' | 'matched' | 'resolved'
  date: string
  is_anonymous: boolean
  created_at: string
  updated_at: string
}

export type ItemClaim = {
  id: number
  item: number
  item_title?: string
  item_owner?: number
  claimant: number
  claimant_email: string
  finder: number
  finder_email: string
  finder_full_name?: string
  answers: {
    brand: string
    unique_marks: string
    item_contents: string
    additional_details: string
  }
  contact_phone?: string
  pickup_location?: string
  verification_notes?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at: string
  updated_at: string
  can_review?: boolean
}

export type Notification = {
  id: number
  user: number
  title: string
  message: string
  type: 'new_match_found' | 'claim_request_received' | 'claim_approved' | 'claim_rejected' | 'claim_awaiting_receipt' | 'claim_completed' | 'item_returned' | 'new_comment' | 'admin_announcement'
  reference_id?: number | null
  is_read: boolean
  created_at: string
}

export type ItemMatch = {
  id: number
  lost_item: Item
  found_item: Item
  other_item?: Item
  score: number
  score_percentage: number
  status: 'suggested' | 'viewed' | 'confirmed' | 'rejected'
  match_reason: string
  created_at: string
  can_review?: boolean
}

export type ItemReport = {
  id: number
  item: number
  reporter: number
  reporter_email: string
  reason: string
  details: string
  created_at: string
}

export type ItemFilters = {
  item_type?: 'lost' | 'found'
  status?: string
  category?: string
  date?: string
  search?: string
}

export type DashboardSummary = {
  total_users: number
  total_posts: number
  total_lost_items: number
  total_found_items: number
  items_successfully_returned: number
  active_claims: number
  open_lost_reports: number
  open_found_reports: number
  active_reports: number
  resolved_reports: number
  matches_generated: number
  recovery_success_rate: number
  success_percentage: number
  lost_items_this_month: number
  found_items_this_month: number
}

export type DashboardTrendMap = {
  total_lost_items: number
  total_found_items: number
  items_successfully_returned: number
  active_claims: number
  open_lost_reports: number
  open_found_reports: number
  recovery_success_rate: number
  matches_generated: number
}

export type DashboardChartDatum = {
  name?: string
  month?: string
  value?: number
  lost?: number
  found?: number
  returned?: number
}

export type DashboardAnalytics = {
  summary: DashboardSummary
  trends: DashboardTrendMap
  charts: {
    lost_vs_found_items: DashboardChartDatum[]
    monthly_recovery_trend: DashboardChartDatum[]
    category_distribution: DashboardChartDatum[]
  }
}

export async function listItems(filters: ItemFilters = {}) {
  const { data } = await api.get<Item[]>('/items/', { params: filters })
  return data
}

export async function getItem(id: number) {
  const { data } = await api.get<Item>(`/items/${id}/`)
  return data
}

export async function createItem(payload: FormData) {
  const { data } = await api.post('/items/', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateItem(id: number, payload: FormData) {
  const { data } = await api.patch(`/items/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteItem(id: number) {
  const { data } = await api.delete(`/items/${id}/`)
  return data
}

export async function createClaim(payload: {
  item: number
  answers: {
    brand: string
    unique_marks: string
    item_contents: string
    additional_details: string
  }
}) {
  const { data } = await api.post<ItemClaim>('/items/claims/', payload)
  return data
}

export async function listClaimHistory() {
  const { data } = await api.get<ItemClaim[]>('/items/claims/history/')
  return data
}

export async function listClaimReviewQueue() {
  const { data } = await api.get<ItemClaim[]>('/items/claims/review-queue/')
  return data
}

export async function approveClaim(
  id: number,
  payload?: { verification_notes?: string; contact_number?: string; pickup_location?: string },
) {
  const { data } = await api.post<ItemClaim>(`/items/claims/${id}/approve/`, payload ?? {})
  return data
}

export async function rejectClaim(id: number, payload?: { verification_notes?: string }) {
  const { data } = await api.post<ItemClaim>(`/items/claims/${id}/reject/`, payload ?? {})
  return data
}

export async function reportItem(payload: { item: number; reason: string; details: string }) {
  const { data } = await api.post<ItemReport>('/items/reports/', payload)
  return data
}

export async function listNotifications() {
  const { data } = await api.get<Notification[]>('/messaging/notifications/')
  return data
}

export async function confirmClaimReceived(id: number) {
  const { data } = await api.post<ItemClaim>(`/items/claims/${id}/confirm-received/`)
  return data
}

export async function markNotificationRead(id: number) {
  const { data } = await api.post<Notification>(`/messaging/notifications/${id}/mark_read/`)
  return data
}

export async function markAllNotificationsRead() {
  const { data } = await api.post<{ updated: number }>('/messaging/notifications/mark_all_read/')
  return data
}

export async function deleteNotification(id: number) {
  const { data } = await api.delete(`/messaging/notifications/${id}/`)
  return data
}

export type MatchFilters = {
  item?: number
  status?: ItemMatch['status']
}

export async function listMatches(filters: MatchFilters = {}) {
  const { data } = await api.get<ItemMatch[]>('/items/matches/', { params: filters })
  return data
}

export async function confirmMatch(id: number) {
  const { data } = await api.post<ItemMatch>(`/items/matches/${id}/confirm/`)
  return data
}

export async function rejectMatch(id: number) {
  const { data } = await api.post<ItemMatch>(`/items/matches/${id}/reject/`)
  return data
}

export async function getDashboardAnalytics() {
  const { data } = await api.get<DashboardAnalytics>('/items/dashboard-analytics/')
  return data
}
