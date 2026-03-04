import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
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
import {
  AdminDashboard,
  UsersPage as AdminUsersPage,
  UserFormPage,
  CompaniesPage as AdminCompaniesPage,
  CompanyFormPage,
  CitiesPage as AdminCitiesPage,
  CityFormPage,
  StationsPage as AdminStationsPage,
  StationFormPage,
  BusesPage as AdminBusesPage,
  BusFormPage,
  DriversPage as AdminDriversPage,
  DriverFormPage,
  RoutesPage as AdminRoutesPage,
  RouteFormPage,
  TripsPage as AdminTripsPage,
  TripFormPage,
  BookingsPage as AdminBookingsPage,
  TicketsPage as AdminTicketsPage,
  AnnouncementsPage as AdminAnnouncementsPage,
  AnnouncementFormPage,
  TicketValidationPage,
  BaggageCheckPage,
  DeparturesPage,
} from '@/pages/admin';
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
      {/* Public & user routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trips" element={<TripSearchPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:announcementId" element={<AnnouncementDetailPage />} />

        {/* Protected routes */}
        <Route path="/booking/:tripId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsListPage /></ProtectedRoute>} />
        <Route path="/tickets/:ticketId" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        {/* Users */}
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/create" element={<UserFormPage />} />
        <Route path="users/:userId/edit" element={<UserFormPage />} />

        {/* Companies */}
        <Route path="companies" element={<AdminCompaniesPage />} />
        <Route path="companies/create" element={<CompanyFormPage />} />
        <Route path="companies/:companyId/edit" element={<CompanyFormPage />} />

        {/* Cities */}
        <Route path="cities" element={<AdminCitiesPage />} />
        <Route path="cities/create" element={<CityFormPage />} />
        <Route path="cities/:cityId/edit" element={<CityFormPage />} />

        {/* Stations */}
        <Route path="stations" element={<AdminStationsPage />} />
        <Route path="stations/create" element={<StationFormPage />} />
        <Route path="stations/:stationId/edit" element={<StationFormPage />} />

        {/* Buses */}
        <Route path="buses" element={<AdminBusesPage />} />
        <Route path="buses/create" element={<BusFormPage />} />
        <Route path="buses/:busId/edit" element={<BusFormPage />} />

        {/* Drivers */}
        <Route path="drivers" element={<AdminDriversPage />} />
        <Route path="drivers/create" element={<DriverFormPage />} />
        <Route path="drivers/:driverId/edit" element={<DriverFormPage />} />

        {/* Routes */}
        <Route path="routes" element={<AdminRoutesPage />} />
        <Route path="routes/create" element={<RouteFormPage />} />
        <Route path="routes/:routeId/edit" element={<RouteFormPage />} />

        {/* Trips */}
        <Route path="trips" element={<AdminTripsPage />} />
        <Route path="trips/create" element={<TripFormPage />} />
        <Route path="trips/:tripId/edit" element={<TripFormPage />} />

        {/* Bookings (read-only) */}
        <Route path="bookings" element={<AdminBookingsPage />} />

        {/* Tickets (read-only) */}
        <Route path="tickets" element={<AdminTicketsPage />} />

        {/* Announcements */}
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
        <Route path="announcements/create" element={<AnnouncementFormPage />} />
        <Route path="announcements/:announcementId/edit" element={<AnnouncementFormPage />} />

        {/* Role-specific pages */}
        <Route path="departures" element={<DeparturesPage />} />
        <Route path="ticket-validation" element={<TicketValidationPage />} />
        <Route path="baggage" element={<BaggageCheckPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
