
import { Appointment, Inquiry } from '../types';

export const mockAppointments: Appointment[] = [
  {
    id: 'APT-001',
    clientName: 'Maria Santos',
    service: 'ZO Facial',
    date: '2025-04-15',
    time: '10:00 AM',
    phone: '0917 123 4567',
    email: 'maria.s@gmail.com',
    status: 'Confirmed',
    notes: 'Regular client'
  },
  {
    id: 'APT-002',
    clientName: 'John Doe',
    service: 'Ultherapy',
    date: '2025-04-15',
    time: '02:00 PM',
    phone: '0918 987 6543',
    email: 'j.doe@yahoo.com',
    status: 'Pending',
    notes: 'First time consultation'
  },
  {
    id: 'APT-003',
    clientName: 'Sarah Lee',
    service: 'Botulinum Toxins',
    date: '2025-04-16',
    time: '11:00 AM',
    phone: '0922 555 1234',
    email: 'sarah.lee@gmail.com',
    status: 'Pending',
    notes: 'Concerned about forehead lines'
  },
  {
    id: 'APT-004',
    clientName: 'Miguel Cruz',
    service: 'Emsculpt',
    date: '2025-04-14',
    time: '04:00 PM',
    phone: '0917 888 9999',
    email: 'mcruz@corp.ph',
    status: 'Completed',
  },
  {
    id: 'APT-005',
    clientName: 'Anna Reyes',
    service: 'Radiance Drip',
    date: '2025-04-17',
    time: '01:00 PM',
    phone: '0919 111 2222',
    email: 'anna.reyes@live.com',
    status: 'Cancelled',
    notes: 'Rescheduled to next week'
  }
];

export const mockInquiries: Inquiry[] = [
  {
    id: 'INQ-001',
    name: 'Jasmine Cole',
    email: 'jasmine@test.com',
    phone: '0917 000 0000',
    message: 'Hi, do you offer free consultations for Ultherapy? I am interested in the 600 shots package.',
    date: '2025-04-10',
    read: false,
    status: 'New'
  },
  {
    id: 'INQ-002',
    name: 'Robert Tan',
    email: 'robert.tan@test.com',
    phone: '0918 222 3333',
    message: 'How much is the Emsculpt package for 6 sessions?',
    date: '2025-04-09',
    read: true,
    status: 'Contacted'
  }
];
