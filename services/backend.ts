
import { Appointment, Inquiry, AppointmentStatus, InquiryStatus, ServiceInfo } from '../types';
import { mockAppointments, mockInquiries } from '../data/mockAdminData';
import { servicesData } from '../data/services';

// --- DATABASE CONFIGURATION (SIMULATED) ---
const DB_TABLES = {
  APPOINTMENTS: 'optimum_skin_appointments_db',
  INQUIRIES: 'optimum_skin_inquiries_db',
  SERVICES: 'optimum_skin_services_db'
};

// --- MOCK SQL DRIVER ---
// This layer simulates how a backend would interact with a database.
// It handles the "SQL" logic using LocalStorage as the data store.

const simulatedNetworkDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

const db = {
  // SELECT * FROM table
  select: async <T>(tableName: string): Promise<T[]> => {
    await simulatedNetworkDelay();
    const data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : [];
  },

  // INSERT INTO table VALUES (...)
  insert: async <T extends { id: string }>(tableName: string, item: T): Promise<T> => {
    await simulatedNetworkDelay(500); // Writes take longer
    const currentData = await db.select<T>(tableName);
    
    // Add timestamps
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      createdAt: now,
      updatedAt: now
    };

    // Prepend to simulate LIFO (or append depending on preference, here LIFO for dashboard convenience)
    const newData = [newItem, ...currentData];
    localStorage.setItem(tableName, JSON.stringify(newData));
    return newItem;
  },

  // UPDATE table SET ... WHERE id = ...
  update: async <T extends { id: string }>(tableName: string, id: string, updates: Partial<T>): Promise<void> => {
    await simulatedNetworkDelay();
    const currentData = await db.select<T>(tableName);
    
    const updatedData = currentData.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
        : item
    );
    
    localStorage.setItem(tableName, JSON.stringify(updatedData));
  },

  // DELETE FROM table WHERE id = ...
  delete: async <T extends { id: string }>(tableName: string, id: string): Promise<void> => {
    await simulatedNetworkDelay();
    const currentData = await db.select<T>(tableName);
    const filteredData = currentData.filter(item => item.id !== id);
    localStorage.setItem(tableName, JSON.stringify(filteredData));
  },

  // Bulk Operations (Transactions)
  bulkUpdate: async <T extends { id: string }>(tableName: string, ids: string[], updates: Partial<T>): Promise<void> => {
    await simulatedNetworkDelay(400);
    const currentData = await db.select<T>(tableName);
    
    const updatedData = currentData.map(item => 
      ids.includes(item.id) 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
        : item
    );
    
    localStorage.setItem(tableName, JSON.stringify(updatedData));
  },

  bulkDelete: async <T extends { id: string }>(tableName: string, ids: string[]): Promise<void> => {
    await simulatedNetworkDelay(400);
    const currentData = await db.select<T>(tableName);
    const filteredData = currentData.filter(item => !ids.includes(item.id));
    localStorage.setItem(tableName, JSON.stringify(filteredData));
  }
};

// --- DATA SEEDING ---
export const initStorage = () => {
  if (typeof window !== 'undefined') {
    // Seed Appointments
    if (!localStorage.getItem(DB_TABLES.APPOINTMENTS)) {
      const seeded = mockAppointments.map(a => ({
        ...a, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem(DB_TABLES.APPOINTMENTS, JSON.stringify(seeded));
    }
    // Seed Inquiries
    if (!localStorage.getItem(DB_TABLES.INQUIRIES)) {
      const seeded = mockInquiries.map(i => ({
        ...i, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem(DB_TABLES.INQUIRIES, JSON.stringify(seeded));
    }
    // Seed Services
    if (!localStorage.getItem(DB_TABLES.SERVICES)) {
      const seeded = servicesData.map(s => ({
        ...s, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem(DB_TABLES.SERVICES, JSON.stringify(seeded));
    }
  }
};

// --- API LAYER (Backend Service) ---
export const backend = {
  // Appointments
  getAppointments: () => db.select<Appointment>(DB_TABLES.APPOINTMENTS),
  addAppointment: (apt: Appointment) => db.insert(DB_TABLES.APPOINTMENTS, apt),
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => db.update<Appointment>(DB_TABLES.APPOINTMENTS, id, { status }),
  updateMultipleAppointmentStatuses: (ids: string[], status: AppointmentStatus) => db.bulkUpdate<Appointment>(DB_TABLES.APPOINTMENTS, ids, { status }),

  // Inquiries
  getInquiries: () => db.select<Inquiry>(DB_TABLES.INQUIRIES),
  addInquiry: (inq: Inquiry) => db.insert(DB_TABLES.INQUIRIES, inq),
  markInquiryRead: (id: string) => db.update<Inquiry>(DB_TABLES.INQUIRIES, id, { read: true }),
  markMultipleInquiriesRead: (ids: string[]) => db.bulkUpdate<Inquiry>(DB_TABLES.INQUIRIES, ids, { read: true }),
  updateInquiryStatus: (id: string, status: InquiryStatus) => db.update<Inquiry>(DB_TABLES.INQUIRIES, id, { status }),
  deleteInquiry: (id: string) => db.delete<Inquiry>(DB_TABLES.INQUIRIES, id),
  deleteMultipleInquiries: (ids: string[]) => db.bulkDelete<Inquiry>(DB_TABLES.INQUIRIES, ids),

  // Services
  getServices: async () => {
    const data = await db.select<ServiceInfo>(DB_TABLES.SERVICES);
    // Fallback to static data if empty (safety net)
    return data.length > 0 ? data : servicesData;
  },
  addService: (svc: ServiceInfo) => db.insert(DB_TABLES.SERVICES, svc),
  updateService: (svc: ServiceInfo) => db.update<ServiceInfo>(DB_TABLES.SERVICES, svc.id, svc),
  deleteService: (id: string) => db.delete<ServiceInfo>(DB_TABLES.SERVICES, id),
  toggleServiceAvailability: (id: string, available: boolean) => db.update<ServiceInfo>(DB_TABLES.SERVICES, id, { available }),
  toggleMultipleServicesAvailability: (ids: string[], available: boolean) => db.bulkUpdate<ServiceInfo>(DB_TABLES.SERVICES, ids, { available }),
  deleteMultipleServices: (ids: string[]) => db.bulkDelete<ServiceInfo>(DB_TABLES.SERVICES, ids),

  // Management
  getBackupData: async (): Promise<string> => {
    const [appointments, inquiries, services] = await Promise.all([
      db.select(DB_TABLES.APPOINTMENTS),
      db.select(DB_TABLES.INQUIRIES),
      db.select(DB_TABLES.SERVICES)
    ]);
    
    return JSON.stringify({
      version: "1.0",
      timestamp: new Date().toISOString(),
      appointments,
      inquiries,
      services
    }, null, 2);
  },

  restoreBackupData: async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (data.appointments) localStorage.setItem(DB_TABLES.APPOINTMENTS, JSON.stringify(data.appointments));
      if (data.inquiries) localStorage.setItem(DB_TABLES.INQUIRIES, JSON.stringify(data.inquiries));
      if (data.services) localStorage.setItem(DB_TABLES.SERVICES, JSON.stringify(data.services));
      return true;
    } catch (e) {
      console.error("Restore failed", e);
      return false;
    }
  },

  resetDatabase: async () => {
    localStorage.removeItem(DB_TABLES.APPOINTMENTS);
    localStorage.removeItem(DB_TABLES.INQUIRIES);
    localStorage.removeItem(DB_TABLES.SERVICES);
    initStorage();
    return true;
  }
};
