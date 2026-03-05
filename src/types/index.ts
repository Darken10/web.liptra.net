export type UserRole = 'super-admin' | 'admin' | 'chef-gare' | 'agent' | 'bagagiste' | 'user';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned';

export interface User {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  phone_indication: string | null;
  gender: string | null;
  status: UserStatus;
  role: UserRole;
  roles: string[];
  permissions: string[];
  company_id?: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  region: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  email: string | null;
  phone: string;
  address: string | null;
}

export interface Trip {
  id: string;
  company: Company;
  route: Route;
  bus: Bus;
  driver: Driver;
  departure_station: Station;
  arrival_station: Station;
  departure_at: string;
  estimated_arrival_at: string | null;
  price: number;
  price_formatted: string;
  available_seats: number;
  status: string;
  status_label: string;
}

export interface Route {
  id: string;
  departure_city: City;
  arrival_city: City;
  distance_km: number | null;
  estimated_duration_minutes: number | null;
}

export interface Bus {
  id: string;
  registration_number: string;
  brand: string | null;
  model: string | null;
  total_seats: number;
  comfort_type: string;
  comfort_type_label: string;
  has_air_conditioning: boolean;
  has_wifi: boolean;
  has_usb_charging: boolean;
  has_toilet: boolean;
}

export interface Driver {
  id: string;
  full_name: string;
}

export interface Station {
  id: string;
  name: string;
  city: City;
}

export interface Booking {
  id: string;
  booking_reference: string;
  total_amount: number;
  total_amount_formatted: string;
  payment_status: string;
  payment_status_label: string;
  payment_method: string | null;
  payment_method_label: string | null;
  paid_at: string | null;
  trip: Trip;
  tickets: Ticket[];
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  validation_code: string;
  qr_code_data: string;
  seat_number: string | null;
  passenger_full_name: string;
  passenger_firstname: string;
  passenger_lastname: string;
  passenger_phone: string;
  passenger_email: string | null;
  passenger_relation: string;
  passenger_relation_label: string;
  status: string;
  status_label: string;
  validated_at: string | null;
  boarded_at: string | null;
  baggage_checked: boolean;
  baggage_checked_at: string | null;
  booking?: Booking;
  trip?: Trip;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface AnnouncementImage {
  id: string;
  url: string;
  order: number;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string | null;
  image: string | null;
  images: AnnouncementImage[];
  tags: Tag[];
  is_published: boolean;
  published_at: string | null;
  company?: Company;
  author?: User;
  comments?: Comment[];
  reactions?: Reaction[];
  comments_count?: number;
  reactions_count?: number;
  created_at: string;
}

export interface Comment {
  id: string;
  body: string;
  user: User;
  replies: Comment[];
  created_at: string;
}

export interface Reaction {
  id: string;
  type: string;
  user: User;
}

export type TripScheduleType = 'one_time' | 'daily' | 'weekly';

export interface TripSchedule {
  id: string;
  company: Company;
  route: Route;
  bus: Bus;
  driver: Driver;
  departure_station: Station;
  arrival_station: Station;
  schedule_type: TripScheduleType;
  schedule_type_label: string;
  departure_times: string[];
  days_of_week: number[] | null;
  start_date: string;
  end_date: string | null;
  one_time_departure_at: string | null;
  estimated_duration_minutes: number | null;
  price: number;
  price_formatted: string;
  notes: string | null;
  is_active: boolean;
  trips_count?: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  user: User;
  token: string;
}

export type PaymentMethod =
  | 'orange-money'
  | 'moov-money'
  | 'coris-money-plus'
  | 'wave'
  | 'cash'
  | 'card';

export type PassengerRelation =
  | 'self'
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'friend'
  | 'colleague'
  | 'other';

export interface PassengerForm {
  passenger_firstname: string;
  passenger_lastname: string;
  passenger_phone: string;
  passenger_email: string;
  passenger_relation: PassengerRelation;
  seat_number: string;
}

/* ─── Admin Types ─────────────────────────────────────────────────── */

export interface DashboardStats {
  total_users: number;
  total_companies: number;
  total_trips: number;
  total_bookings: number;
  total_revenue: number;
  total_tickets: number;
  recent_bookings: Booking[];
  upcoming_trips: Trip[];
  users_trend: number;
  bookings_trend: number;
  revenue_trend: number;
  trips_trend: number;
}

export interface AdminCity extends City {
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  stations_count: number;
  created_at: string;
}

export interface AdminStation extends Station {
  company: Company;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminBus extends Bus {
  company: Company;
  photo: string | null;
  color: string | null;
  manufacture_year: number | null;
  mileage: number | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminDriver {
  id: string;
  company: Company;
  firstname: string;
  lastname: string;
  full_name: string;
  phone: string;
  license_number: string;
  license_type: string | null;
  license_expiry: string | null;
  photo: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminRoute {
  id: string;
  company: Company;
  departure_city: City;
  arrival_city: City;
  distance_km: number | null;
  estimated_duration_minutes: number | null;
  is_active: boolean;
  created_at: string;
}

export interface RolePermission {
  name: string;
  label: string;
  permissions: string[];
}

