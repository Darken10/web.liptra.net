import axios from 'axios';
import type { ApiResponse, AuthData, PaginatedResponse } from '@/types';

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

export default api;
