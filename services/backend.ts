
import { Appointment, Inquiry, AppointmentStatus, InquiryStatus, ServiceInfo } from '../types';
import { mockAppointments, mockInquiries } from '../data/mockAdminData';
import { servicesData } from '../data/services';

const APPOINTMENTS_KEY = 'optimum_skin_appointments_db';
const INQUIRIES_KEY = 'optimum_skin_inquiries_db';
const SERVICES_KEY = 'optimum_skin_services_db';

// Helper to add timestamps if missing
const withTimestamps = (item: any) => {
  const now = new Date().toISOString();
  return {
    ...item,
    createdAt: item.createdAt || now,
    updatedAt: now
  };
};

// Initialize storage with mock data if it's the first visit
export const initStorage = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(APPOINTMENTS_KEY)) {
      const seededAppointments = mockAppointments.map(a => ({...a, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}));
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(seededAppointments));
    }
    if (!localStorage.getItem(INQUIRIES_KEY)) {
      const seededInquiries = mockInquiries.map(i => ({...i, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}));
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(seededInquiries));
    }
    if (!localStorage.getItem(SERVICES_KEY)) {
      const seededServices = servicesData.map(s => ({...s, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}));
      localStorage.setItem(SERVICES_KEY, JSON.stringify(seededServices));
    }
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const backend = {
  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(300); 
    initStorage();
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addAppointment: async (appointment: Appointment): Promise<Appointment> => {
    await delay(500);
    const appointments = await backend.getAppointments();
    const newAppointment = withTimestamps(appointment);
    // Add to top
    const newAppointments = [newAppointment, ...appointments];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(newAppointments));
    return newAppointment;
  },

  updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
    await delay(300);
    const appointments = await backend.getAppointments();
    const updated = appointments.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  },

  updateMultipleAppointmentStatuses: async (ids: string[], status: AppointmentStatus): Promise<void> => {
    await delay(400);
    const appointments = await backend.getAppointments();
    const updated = appointments.map(a => ids.includes(a.id) ? { ...a, status, updatedAt: new Date().toISOString() } : a);
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
    const newInquiry = withTimestamps(inquiry);
    const newInquiries = [newInquiry, ...inquiries];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(newInquiries));
    return newInquiry;
  },

  markInquiryRead: async (id: string): Promise<void> => {
    await delay(200);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.map(i => i.id === id ? { ...i, read: true, updatedAt: new Date().toISOString() } : i);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  markMultipleInquiriesRead: async (ids: string[]): Promise<void> => {
    await delay(300);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.map(i => ids.includes(i.id) ? { ...i, read: true, updatedAt: new Date().toISOString() } : i);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  updateInquiryStatus: async (id: string, status: InquiryStatus): Promise<void> => {
    await delay(200);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.map(i => i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  deleteInquiry: async (id: string): Promise<void> => {
    await delay(300);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.filter(i => i.id !== id);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  deleteMultipleInquiries: async (ids: string[]): Promise<void> => {
    await delay(400);
    const inquiries = await backend.getInquiries();
    const updated = inquiries.filter(i => !ids.includes(i.id));
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
  },

  // --- Services ---
  getServices: async (): Promise<ServiceInfo[]> => {
    await delay(200);
    initStorage();
    const data = localStorage.getItem(SERVICES_KEY);
    return data ? JSON.parse(data) : servicesData;
  },

  addService: async (service: ServiceInfo): Promise<ServiceInfo> => {
    await delay(500);
    const services = await backend.getServices();
    const newService = withTimestamps(service);
    const newServices = [newService, ...services];
    localStorage.setItem(SERVICES_KEY, JSON.stringify(newServices));
    return newService;
  },

  updateService: async (updatedService: ServiceInfo): Promise<void> => {
    await delay(300);
    const services = await backend.getServices();
    const newServices = services.map(s => s.id === updatedService.id ? { ...updatedService, updatedAt: new Date().toISOString() } : s);
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
    const updated = services.map(s => s.id === id ? { ...s, available: isAvailable, updatedAt: new Date().toISOString() } : s);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
  },

  toggleMultipleServicesAvailability: async (ids: string[], isAvailable: boolean): Promise<void> => {
    await delay(400);
    const services = await backend.getServices();
    const updated = services.map(s => ids.includes(s.id) ? { ...s, available: isAvailable, updatedAt: new Date().toISOString() } : s);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
  },

  deleteMultipleServices: async (ids: string[]): Promise<void> => {
    await delay(400);
    const services = await backend.getServices();
    const updated = services.filter(s => !ids.includes(s.id));
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
  },

  // --- Database Management (Backup/Restore) ---
  getBackupData: async (): Promise<string> => {
    await delay(500);
    const backup = {
      version: "1.0",
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
    initStorage(); // Re-seed
    return true;
  }
};
