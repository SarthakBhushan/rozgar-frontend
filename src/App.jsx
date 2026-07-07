import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout, ProtectedLayout } from './components/layout/AppLayout'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BusinessSetupPage from './pages/BusinessSetupPage'
import BusinessesPage from './pages/BusinessesPage'
import BusinessDetailPage from './pages/BusinessDetailPage'
import CatalogPage from './pages/CatalogPage'
import PostRfqPage from './pages/PostRfqPage'
import OpenRfqsPage from './pages/OpenRfqsPage'
import MyRfqsPage from './pages/MyRfqsPage'
import RfqDetailPage from './pages/RfqDetailPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ChatListPage from './pages/ChatListPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>

      {/* ── Public routes ─────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/businesses/:id" element={<BusinessDetailPage />} />
        <Route path="/rfq/open" element={<OpenRfqsPage />} />
        <Route path="/rfq/:id" element={<RfqDetailPage />} />
      </Route>

      {/* ── Protected routes ──────────────────────────────────────────── */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Business */}
        <Route path="/business/setup" element={<BusinessSetupPage />} />
        <Route path="/business/edit" element={<BusinessSetupPage />} />
        <Route path="/business/catalog" element={<CatalogPage />} />

        {/* RFQ */}
        <Route path="/rfq/post" element={<PostRfqPage />} />
        <Route path="/rfq/my" element={<MyRfqsPage />} />

        {/* Orders */}
        <Route path="/orders/buyer" element={<OrdersPage role="buyer" />} />
        <Route path="/orders/seller" element={<OrdersPage role="seller" />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />

        {/* Chat */}
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:threadId" element={<ChatPage />} />
      </Route>

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  )
}
