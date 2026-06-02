import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/home/HomePage'
import AppShell from '../components/layout/AppShell'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import NotificationsPage from '../pages/notifications/NotificationsPage'
import LostItemsPage from '../pages/items/LostItemsPage'
import FoundItemsPage from '../pages/items/FoundItemsPage'
import NewItemPage from '../pages/items/NewItemPage'
import EditItemPage from '../pages/items/EditItemPage'
import ItemDetailPage from '../pages/items/ItemDetailPage'
import ClaimReviewQueuePage from '../pages/items/ClaimReviewQueuePage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/items/lost" element={<LostItemsPage />} />
        <Route path="/items/found" element={<FoundItemsPage />} />
        <Route path="/claims/review" element={<ClaimReviewQueuePage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/items/new" element={<NewItemPage />} />
        <Route path="/items/:id/edit" element={<EditItemPage />} />
      </Route>
    </Routes>
  )
}
