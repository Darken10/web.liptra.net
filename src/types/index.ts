export interface User {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string | null;
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
  status: { value: string; label: string };
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
  comfort_type: { value: string; label: string };
  has_ac: boolean;
  has_wifi: boolean;
  has_usb: boolean;
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

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
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
