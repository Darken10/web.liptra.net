import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import TripSearchPage from '@/pages/TripSearchPage';
import TripDetailPage from '@/pages/TripDetailPage';
import BookingPage from '@/pages/BookingPage';
import BookingsListPage from '@/pages/BookingsListPage';
import TicketDetailPage from '@/pages/TicketDetailPage';
import AnnouncementsPage from '@/pages/AnnouncementsPage';
import AnnouncementDetailPage from '@/pages/AnnouncementDetailPage';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trips" element={<TripSearchPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:announcementId" element={<AnnouncementDetailPage />} />

        {/* Protected routes */}
        <Route path="/booking/:tripId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsListPage /></ProtectedRoute>} />
        <Route path="/tickets/:ticketId" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
