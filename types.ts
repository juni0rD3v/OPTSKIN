
export enum ServiceCategory {
  SKIN_REJUVENATION = 'Skin Rejuvenation',
  FACIAL_ENHANCEMENTS = 'Facial Enhancements',
  BODY_SCULPTING = 'Body SCULPTING',
  OTHER = 'Other Services'
}

export interface ServiceInfo {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  detailedDescription: string;
  benefits: string[];
  priceRange: string;
  image: string;
  available: boolean;
  createdAt?: string; // ISO Date String
  updatedAt?: string; // ISO Date String
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  image: string;
  category?: string;
  author?: string;
  excerpt?: string;
  content?: string[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  concern: string;
  category: ServiceCategory | string;
  service: string;
  date: string;
  time: string;
}

export interface AIRecommendation {
  category: ServiceCategory;
  reason: string;
}

// --- Admin Types ---

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Trash';

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string; // ISO Date String
  updatedAt?: string; // ISO Date String
}

export type InquiryStatus = 'New' | 'Contacted' | 'Follow-up Needed' | 'Resolved';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
  status?: InquiryStatus;
  createdAt?: string; // ISO Date String
  updatedAt?: string; // ISO Date String
}
