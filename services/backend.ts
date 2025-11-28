
import { Appointment, Inquiry, AppointmentStatus } from '../types';
import { mockAppointments, mockInquiries } from '../data/mockAdminData';

const APPOINTMENTS_KEY = 'optimum_skin_appointments_db';
const INQUIRIES_KEY = 'optimum_skin_inquiries_db';

// Initialize storage with mock data if it's the first visit
const initStorage = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(APPOINTMENTS_KEY)) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(mockAppointments));
    }
    if (!localStorage.getItem(INQUIRIES_KEY)) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(mockInquiries));
    }
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const backend = {
  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(300); // Simulate network latency
    initStorage();
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addAppointment: async (appointment: Appointment): Promise<Appointment> => {
    await delay(500);
    const appointments = await backend.getAppointments();
    // Add to top
    const newAppointments = [appointment, ...appointments];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(newAppointments));
    return appointment;
  },

  updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
    await delay(300);
    const appointments = await backend.getAppointments();
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  },

  // --- Inquiries ---
  getInquiries: async (): Promise<Inquiry[]> => {
    await delay(300);
    initStorage();
    const data = localStorage.getItem(INQUIRIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  addInquiry: async (inquiry: Inquiry): Promise<Inquiry> => {
    await delay(500);
    const inquiries = await backend.getInquiries();
    const newInquiries = [inquiry, ...inquiries];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(newInquiries));
    return inquiry;
  },

  markInquiryRead: async (id: string): Promise<void> => {
    await delay(200);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.map(i => i.id === id ? { ...i, read: true } : i);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  // --- Reset/Debug ---
  resetDatabase: async () => {
    localStorage.removeItem(APPOINTMENTS_KEY);
    localStorage.removeItem(INQUIRIES_KEY);
    initStorage();
    return true;
  }
};
