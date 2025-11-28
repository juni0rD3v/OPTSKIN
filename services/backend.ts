
import { Appointment, Inquiry, AppointmentStatus, InquiryStatus, ServiceInfo } from '../types';
import { mockAppointments, mockInquiries } from '../data/mockAdminData';
import { servicesData } from '../data/services';

const APPOINTMENTS_KEY = 'optimum_skin_appointments_db';
const INQUIRIES_KEY = 'optimum_skin_inquiries_db';
const SERVICES_KEY = 'optimum_skin_services_db';

// Initialize storage with mock data if it's the first visit
const initStorage = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(APPOINTMENTS_KEY)) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(mockAppointments));
    }
    if (!localStorage.getItem(INQUIRIES_KEY)) {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(mockInquiries));
    }
    if (!localStorage.getItem(SERVICES_KEY)) {
      // Initialize with the static service data
      localStorage.setItem(SERVICES_KEY, JSON.stringify(servicesData));
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

  updateMultipleAppointmentStatuses: async (ids: string[], status: AppointmentStatus): Promise<void> => {
    await delay(400);
    const appointments = await backend.getAppointments();
    const updated = appointments.map(a => ids.includes(a.id) ? { ...a, status } : a);
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

  updateInquiryStatus: async (id: string, status: InquiryStatus): Promise<void> => {
    await delay(200);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.map(i => i.id === id ? { ...i, status } : i);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  // --- Services ---
  getServices: async (): Promise<ServiceInfo[]> => {
    await delay(200);
    initStorage();
    const data = localStorage.getItem(SERVICES_KEY);
    // Fallback to static data if localstorage is empty/corrupt
    return data ? JSON.parse(data) : servicesData;
  },

  addService: async (service: ServiceInfo): Promise<ServiceInfo> => {
    await delay(500);
    const services = await backend.getServices();
    const newServices = [service, ...services];
    localStorage.setItem(SERVICES_KEY, JSON.stringify(newServices));
    return service;
  },

  updateService: async (updatedService: ServiceInfo): Promise<void> => {
    await delay(300);
    const services = await backend.getServices();
    const newServices = services.map(s => s.id === updatedService.id ? updatedService : s);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(newServices));
  },

  deleteService: async (id: string): Promise<void> => {
    await delay(300);
    const services = await backend.getServices();
    const newServices = services.filter(s => s.id !== id);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(newServices));
  },

  toggleServiceAvailability: async (id: string, isAvailable: boolean): Promise<void> => {
    await delay(300);
    const services = await backend.getServices();
    const updated = services.map(s => s.id === id ? { ...s, available: isAvailable } : s);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
  },

  // --- Database Management (Backup/Restore) ---
  getBackupData: async (): Promise<string> => {
    await delay(500);
    const backup = {
      appointments: JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]'),
      inquiries: JSON.parse(localStorage.getItem(INQUIRIES_KEY) || '[]'),
      services: JSON.parse(localStorage.getItem(SERVICES_KEY) || JSON.stringify(servicesData)),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  restoreBackupData: async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (data.appointments && Array.isArray(data.appointments)) {
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(data.appointments));
      }
      if (data.inquiries && Array.isArray(data.inquiries)) {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(data.inquiries));
      }
      if (data.services && Array.isArray(data.services)) {
        localStorage.setItem(SERVICES_KEY, JSON.stringify(data.services));
      }
      await delay(500);
      return true;
    } catch (e) {
      console.error("Failed to restore backup", e);
      return false;
    }
  },

  resetDatabase: async () => {
    localStorage.removeItem(APPOINTMENTS_KEY);
    localStorage.removeItem(INQUIRIES_KEY);
    localStorage.removeItem(SERVICES_KEY);
    initStorage();
    return true;
  }
};
