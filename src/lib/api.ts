import axios from 'axios';
import type {
  ApiResponse,
  AuthData,
  PaginatedResponse,
  DashboardStats,
  User,
  AdminCity,
  AdminStation,
  AdminBus,
  AdminDriver,
  AdminRoute,
} from '@/types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post<ApiResponse<AuthData>>('/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/login', data),

  logout: () => api.post('/logout'),

  me: () => api.get<ApiResponse<{ user: AuthData['user'] }>>('/me'),
};

export const cityApi = {
  list: () => api.get<ApiResponse<import('@/types').City[]>>('/cities'),
};

export const tripApi = {
  search: (params: Record<string, string>) =>
    api.get<ApiResponse<PaginatedResponse<import('@/types').Trip>>>('/trips', {
      params,
    }),

  show: (id: string) =>
    api.get<ApiResponse<import('@/types').Trip>>(`/trips/${id}`),
};

export const bookingApi = {
  list: () =>
    api.get<
      ApiResponse<PaginatedResponse<import('@/types').Booking>>
    >('/bookings'),

  show: (id: string) =>
    api.get<ApiResponse<import('@/types').Booking>>(`/bookings/${id}`),

  create: (data: {
    trip_id: string;
    passengers: import('@/types').PassengerForm[];
    payment_method: string;
  }) => api.post<ApiResponse<import('@/types').Booking>>('/bookings', data),

  cancel: (id: string) =>
    api.post<ApiResponse<import('@/types').Booking>>(`/bookings/${id}/cancel`),
};

export const ticketApi = {
  myTickets: () =>
    api.get<
      ApiResponse<PaginatedResponse<import('@/types').Ticket>>
    >('/tickets'),

  show: (id: string) =>
    api.get<ApiResponse<import('@/types').Ticket>>(`/tickets/${id}`),
};

export const announcementApi = {
  list: (page = 1) =>
    api.get<
      ApiResponse<PaginatedResponse<import('@/types').Announcement>>
    >('/announcements', { params: { page } }),

  show: (id: string) =>
    api.get<ApiResponse<import('@/types').Announcement>>(
      `/announcements/${id}`,
    ),

  comment: (id: string, data: { body: string; parent_id?: string }) =>
    api.post(`/announcements/${id}/comments`, data),

  react: (id: string, type: string) =>
    api.post(`/announcements/${id}/reactions`, { type }),
};

/* ─── Admin API ───────────────────────────────────────────────────── */

export const adminApi = {
  dashboard: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),

  // Users
  users: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<User>>>('/admin/users', { params }),
    show: (id: string) => api.get<ApiResponse<User>>(`/admin/users/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<User>>('/admin/users', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<User>>(`/admin/users/${id}`, data),
    delete: (id: string) => api.delete(`/admin/users/${id}`),
    assignRole: (id: string, role: string) =>
      api.post(`/admin/users/${id}/role`, { role }),
  },

  // Companies
  companies: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<import('@/types').Company>>>('/admin/companies', { params }),
    show: (id: string) =>
      api.get<ApiResponse<import('@/types').Company>>(`/admin/companies/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<import('@/types').Company>>('/admin/companies', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<import('@/types').Company>>(`/admin/companies/${id}`, data),
    delete: (id: string) => api.delete(`/admin/companies/${id}`),
  },

  // Cities
  cities: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<AdminCity>>>('/admin/cities', { params }),
    show: (id: string) => api.get<ApiResponse<AdminCity>>(`/admin/cities/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<AdminCity>>('/admin/cities', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<AdminCity>>(`/admin/cities/${id}`, data),
    delete: (id: string) => api.delete(`/admin/cities/${id}`),
  },

  // Stations
  stations: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<AdminStation>>>('/admin/stations', { params }),
    show: (id: string) => api.get<ApiResponse<AdminStation>>(`/admin/stations/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<AdminStation>>('/admin/stations', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<AdminStation>>(`/admin/stations/${id}`, data),
    delete: (id: string) => api.delete(`/admin/stations/${id}`),
  },

  // Buses
  buses: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<AdminBus>>>('/admin/buses', { params }),
    show: (id: string) => api.get<ApiResponse<AdminBus>>(`/admin/buses/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<AdminBus>>('/admin/buses', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<AdminBus>>(`/admin/buses/${id}`, data),
    delete: (id: string) => api.delete(`/admin/buses/${id}`),
  },

  // Drivers
  drivers: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<AdminDriver>>>('/admin/drivers', { params }),
    show: (id: string) => api.get<ApiResponse<AdminDriver>>(`/admin/drivers/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<AdminDriver>>('/admin/drivers', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<AdminDriver>>(`/admin/drivers/${id}`, data),
    delete: (id: string) => api.delete(`/admin/drivers/${id}`),
  },

  // Routes
  routes: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<AdminRoute>>>('/admin/routes', { params }),
    show: (id: string) => api.get<ApiResponse<AdminRoute>>(`/admin/routes/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<AdminRoute>>('/admin/routes', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<AdminRoute>>(`/admin/routes/${id}`, data),
    delete: (id: string) => api.delete(`/admin/routes/${id}`),
  },

  // Trips
  trips: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<import('@/types').Trip>>>('/admin/trips', { params }),
    show: (id: string) =>
      api.get<ApiResponse<import('@/types').Trip>>(`/admin/trips/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<import('@/types').Trip>>('/admin/trips', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<import('@/types').Trip>>(`/admin/trips/${id}`, data),
    cancel: (id: string) =>
      api.post<ApiResponse<import('@/types').Trip>>(`/admin/trips/${id}/cancel`),
  },

  // Bookings
  bookings: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<import('@/types').Booking>>>('/admin/bookings', { params }),
    show: (id: string) =>
      api.get<ApiResponse<import('@/types').Booking>>(`/admin/bookings/${id}`),
  },

  // Tickets
  tickets: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<import('@/types').Ticket>>>('/admin/tickets', { params }),
    show: (id: string) =>
      api.get<ApiResponse<import('@/types').Ticket>>(`/admin/tickets/${id}`),
    validate: (data: { qr_code_data?: string; validation_code?: string }) =>
      api.post<ApiResponse<import('@/types').Ticket>>('/admin/tickets/validate', data),
    board: (id: string) =>
      api.post<ApiResponse<import('@/types').Ticket>>(`/admin/tickets/${id}/board`),
    checkBaggage: (id: string) =>
      api.post<ApiResponse<import('@/types').Ticket>>(`/admin/tickets/${id}/baggage`),
    findByNumber: (ticketNumber: string) =>
      api.get<ApiResponse<import('@/types').Ticket>>(`/admin/tickets/find/${ticketNumber}`),
  },

  // Announcements
  announcements: {
    list: (params?: Record<string, string>) =>
      api.get<ApiResponse<PaginatedResponse<import('@/types').Announcement>>>('/admin/announcements', { params }),
    show: (id: string) =>
      api.get<ApiResponse<import('@/types').Announcement>>(`/admin/announcements/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post<ApiResponse<import('@/types').Announcement>>('/admin/announcements', data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put<ApiResponse<import('@/types').Announcement>>(`/admin/announcements/${id}`, data),
    delete: (id: string) => api.delete(`/admin/announcements/${id}`),
  },
};

export default api;
