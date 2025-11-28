
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Calendar as CalendarIcon, MessageSquare, LogOut, 
  CheckCircle, XCircle, Clock, Search, MoreHorizontal, User, Mail, Phone, ChevronRight, ChevronLeft,
  Filter, ChevronUp, ChevronDown, ArrowUpDown, AlertTriangle, CheckSquare, ExternalLink, History, Users, Eye, FileText,
  BarChart3, TrendingUp, DollarSign, PieChart, Trash2, RotateCcw, Menu, X, Database, Download, Upload, Lock, Settings, AlertOctagon, Briefcase, Plus, Edit, Send
} from 'lucide-react';
import { Appointment, Inquiry, AppointmentStatus, InquiryStatus, ServiceInfo, ServiceCategory } from '../types';
import { servicesData } from '../data/services';
import { ToastType } from './Toast';

interface AdminDashboardProps {
  onLogout: () => void;
  appointments: Appointment[];
  inquiries: Inquiry[];
  services: ServiceInfo[]; 
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onBulkStatusChange: (ids: string[], status: AppointmentStatus) => void;
  onMarkInquiryRead: (id: string) => void;
  onInquiryStatusChange: (id: string, status: InquiryStatus) => void;
  onDeleteInquiry: (id: string) => void;
  onBulkInquiryDelete: (ids: string[]) => void;
  onBulkInquiryMarkRead: (ids: string[]) => void;
  onToggleServiceAvailability: (id: string, isAvailable: boolean) => void;
  onAddService: (service: ServiceInfo) => void;
  onUpdateService: (service: ServiceInfo) => void;
  onDeleteService: (id: string) => void;
  onBulkServiceToggle: (ids: string[], isAvailable: boolean) => void;
  onBulkServiceDelete: (ids: string[]) => void;
  showToast: (message: string, type: ToastType) => void;
  onViewSite: () => void;
  onDownloadBackup: () => void;
  onUploadBackup: (file: File) => void;
  onResetDatabase: () => void;
  adminRole: 'staff' | 'superadmin' | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  appointments, 
  inquiries, 
  services,
  onStatusChange, 
  onBulkStatusChange,
  onMarkInquiryRead, 
  onInquiryStatusChange,
  onDeleteInquiry,
  onBulkInquiryDelete,
  onBulkInquiryMarkRead,
  onToggleServiceAvailability,
  onAddService,
  onUpdateService,
  onDeleteService,
  onBulkServiceToggle,
  onBulkServiceDelete,
  showToast, 
  onViewSite,
  onDownloadBackup,
  onUploadBackup,
  onResetDatabase,
  adminRole
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'appointments' | 'inquiries' | 'clients' | 'reports' | 'settings' | 'services'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  
  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Tab State for Status
  const [activeStatusTab, setActiveStatusTab] = useState<AppointmentStatus | 'All'>('All');
  const [activeInquiryStatus, setActiveInquiryStatus] = useState<InquiryStatus | 'All'>('All');

  const [filterService, setFilterService] = useState<string>('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Bulk Action State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Report Filter State
  const [reportFilterMonth, setReportFilterMonth] = useState<string>('All');

  // Pagination State - Appointments
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination State - Services
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [servicesPerPage, setServicesPerPage] = useState(5);

  // Pagination State - Inquiries
  const [currentInquiryPage, setCurrentInquiryPage] = useState(1);
  const [inquiriesPerPage, setInquiriesPerPage] = useState(5);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  // Tooltip State
  const [tooltipData, setTooltipData] = useState<{
    appointment: Appointment;
    rect: DOMRect;
  } | null>(null);

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: 'clientName' | 'date'; direction: 'asc' | 'desc' } | null>(null);

  // Confirmation Dialog State
  const [confirmationAction, setConfirmationAction] = useState<{
    isOpen: boolean;
    type: 'Confirm' | 'Cancel' | 'Complete' | 'Trash' | 'Restore' | 'BulkTrash' | 'BulkCancel' | 'BulkComplete' | 'ResetDatabase' | 'DeleteService' | 'BulkEnableServices' | 'BulkDisableServices' | 'BulkDeleteServices' | 'DeleteInquiry' | 'BulkDeleteInquiries' | null;
    appointmentId: string | null;
  }>({ isOpen: false, type: null, appointmentId: null });

  // Service Management State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceInfo | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceInfo>>({
    title: '',
    category: ServiceCategory.SKIN_REJUVENATION,
    description: '',
    priceRange: '',
    image: 'https://picsum.photos/400/500',
    available: true,
    detailedDescription: '',
    benefits: []
  });

  // Client History State
  const [viewClientHistory, setViewClientHistory] = useState<string | null>(null);

  // View Appointment Details State
  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);

  // Status Badge Helper
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Trash': return 'bg-red-50 text-red-500 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSort = (key: 'clientName' | 'date') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Reset pagination and selections when filters change
  useEffect(() => {
    setCurrentPage(1);
    setCurrentServicePage(1);
    setCurrentInquiryPage(1);
    setSelectedIds(new Set()); 
    setIsBulkDropdownOpen(false);
  }, [searchTerm, activeStatusTab, activeInquiryStatus, filterService, dateRange]);

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
    // Also clear selections on tab change to prevent mixing IDs
    setSelectedIds(new Set());
    setIsBulkDropdownOpen(false);
  }, [activeTab]);

  // Extract unique services for filter dropdown
  const allServices = Array.from(new Set(services.map(s => s.title))).sort();

  // Filter Logic
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status Logic: If 'All', show everything EXCEPT Trash. If 'Trash', show Trash.
    const matchesStatus = activeStatusTab === 'All' 
        ? apt.status !== 'Trash' 
        : apt.status === activeStatusTab;

    const matchesService = filterService === 'All' || apt.service === filterService;
    
    const matchesDateStart = !dateRange.start || apt.date >= dateRange.start;
    const matchesDateEnd = !dateRange.end || apt.date <= dateRange.end;

    return matchesSearch && matchesStatus && matchesService && matchesDateStart && matchesDateEnd;
  });

  // Sort Logic
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    let aValue = a[key];
    let bValue = b[key];

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Logic - Appointments
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Logic - Services
  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalServicePages = Math.ceil(filteredServices.length / servicesPerPage);
  const paginatedServices = filteredServices.slice(
    (currentServicePage - 1) * servicesPerPage,
    currentServicePage * servicesPerPage
  );

  // Pagination Logic - Inquiries
  const filteredInquiries = inquiries.filter(inq => {
     const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inq.message.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = activeInquiryStatus === 'All' || inq.status === activeInquiryStatus;
     
     return matchesSearch && matchesStatus;
  });

  const totalInquiryPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentInquiryPage - 1) * inquiriesPerPage,
    currentInquiryPage * inquiriesPerPage
  );

  // Bulk Selection Logic
  const handleSelectAll = () => {
    if (activeTab === 'appointments') {
        if (paginatedAppointments.length > 0 && paginatedAppointments.every(a => selectedIds.has(a.id))) {
          // Deselect all on current page
          const newSelected = new Set(selectedIds);
          paginatedAppointments.forEach(a => newSelected.delete(a.id));
          setSelectedIds(newSelected);
        } else {
          // Select all on current page
          const newSelected = new Set(selectedIds);
          paginatedAppointments.forEach(a => newSelected.add(a.id));
          setSelectedIds(newSelected);
        }
    } else if (activeTab === 'services') {
        if (paginatedServices.length > 0 && paginatedServices.every(s => selectedIds.has(s.id))) {
            const newSelected = new Set(selectedIds);
            paginatedServices.forEach(s => newSelected.delete(s.id));
            setSelectedIds(newSelected);
        } else {
            const newSelected = new Set(selectedIds);
            paginatedServices.forEach(s => newSelected.add(s.id));
            setSelectedIds(newSelected);
        }
    } else if (activeTab === 'inquiries') {
        if (paginatedInquiries.length > 0 && paginatedInquiries.every(i => selectedIds.has(i.id))) {
            const newSelected = new Set(selectedIds);
            paginatedInquiries.forEach(i => newSelected.delete(i.id));
            setSelectedIds(newSelected);
        } else {
            const newSelected = new Set(selectedIds);
            paginatedInquiries.forEach(i => newSelected.add(i.id));
            setSelectedIds(newSelected);
        }
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  // Counts for Tabs
  const getStatusCount = (status: AppointmentStatus | 'All') => {
      if (status === 'All') return appointments.filter(a => a.status !== 'Trash').length;
      return appointments.filter(a => a.status === status).length;
  };

  // Client Directory Data Logic
  const uniqueClients = React.useMemo(() => {
    const clientMap = new Map<string, {
      name: string;
      email: string;
      phone: string;
      totalVisits: number;
      lastVisit: string;
      status: string;
    }>();

    appointments.forEach(apt => {
      const existing = clientMap.get(apt.clientName);
      if (existing) {
        existing.totalVisits += 1;
        if (new Date(apt.date) > new Date(existing.lastVisit)) {
          existing.lastVisit = apt.date;
          existing.email = apt.email;
          existing.phone = apt.phone;
        }
        if (apt.status === 'Confirmed' || apt.status === 'Pending') {
           existing.status = 'Active';
        }
      } else {
        clientMap.set(apt.clientName, {
          name: apt.clientName,
          email: apt.email,
          phone: apt.phone,
          totalVisits: 1,
          lastVisit: apt.date,
          status: (apt.status === 'Confirmed' || apt.status === 'Pending') ? 'Active' : 'Inactive'
        });
      }
    });

    return Array.from(clientMap.values()).filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  // Client History Stats Logic
  const clientHistoryStats = useMemo(() => {
    if (!viewClientHistory) return null;
    
    const clientAppts = appointments.filter(a => a.clientName === viewClientHistory);
    const completed = clientAppts.filter(a => a.status === 'Completed').length;
    const cancelled = clientAppts.filter(a => a.status === 'Cancelled').length;
    
    const serviceCounts: Record<string, number> = {};
    clientAppts.forEach(a => { serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1; });
    const favoriteService = Object.entries(serviceCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
      total: clientAppts.length,
      completed,
      cancelled,
      favoriteService
    };
  }, [viewClientHistory, appointments]);

  // Derived state for Client History Modal
  const clientHistoryAppointments = useMemo(() => {
    if (!viewClientHistory) return [];
    return appointments
      .filter(a => a.clientName === viewClientHistory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [viewClientHistory, appointments]);

  const clientInfo = useMemo(() => {
    if (clientHistoryAppointments.length === 0) return { phone: '', email: '' };
    // Prioritize the most recent contact info found
    const latest = clientHistoryAppointments[0];
    return { phone: latest.phone, email: latest.email };
  }, [clientHistoryAppointments]);

  // --- Reports Logic ---
  const reportsData = useMemo(() => {
    const filteredReportApps = appointments.filter(apt => {
        if (apt.status === 'Trash') return false;
        if (reportFilterMonth === 'All') return true;
        const date = new Date(apt.date);
        const monthName = date.toLocaleString('default', { month: 'long' });
        return monthName === reportFilterMonth;
    });

    const activeApps = filteredReportApps.filter(a => a.status !== 'Trash');
    const serviceCounts: Record<string, number> = {};
    activeApps.forEach(apt => {
      serviceCounts[apt.service] = (serviceCounts[apt.service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, percentage: (count / (activeApps.length || 1)) * 100 }));

    let totalRevenue = 0;
    filteredReportApps.filter(a => a.status === 'Completed').forEach(apt => {
       const service = services.find(s => s.title === apt.service) || servicesData.find(s => s.title === apt.service);
       if (service) {
         const priceString = service.priceRange.replace(/,/g, '').replace(/₱/g, '');
         const prices = priceString.match(/(\d+)/g);
         if (prices && prices.length > 0) {
            const avg = prices.length === 2 
               ? (parseInt(prices[0]) + parseInt(prices[1])) / 2
               : parseInt(prices[0]);
            totalRevenue += avg;
         }
       }
    });

    let chartData = [];
    let chartLabel = '';

    if (reportFilterMonth === 'All') {
        chartLabel = 'Monthly Bookings (YTD)';
        const monthlyCounts: Record<string, number> = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        appointments.filter(a => a.status !== 'Trash').forEach(apt => {
           const date = new Date(apt.date);
           const key = months[date.getMonth()];
           monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        });
        chartData = months.slice(0, new Date().getMonth() + 1).map(m => ({
           label: m,
           count: monthlyCounts[m] || 0
        }));
    } else {
        chartLabel = `Daily Bookings - ${reportFilterMonth}`;
        const dailyCounts: Record<number, number> = {};
        filteredReportApps.forEach(apt => {
           const day = new Date(apt.date).getDate();
           dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });
        const daysInMonth = 31;
        chartData = Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => ({
           label: d.toString(),
           count: dailyCounts[d] || 0
        }));
    }

    const statusCounts = {
        Pending: 0,
        Confirmed: 0,
        Completed: 0,
        Cancelled: 0,
        Trash: 0
    };
    
    const allAppsForStatus = appointments.filter(apt => {
        if (reportFilterMonth === 'All') return true;
        const date = new Date(apt.date);
        const monthName = date.toLocaleString('default', { month: 'long' });
        return monthName === reportFilterMonth;
    });

    allAppsForStatus.forEach(apt => {
        if (apt.status in statusCounts) {
           statusCounts[apt.status]++;
        }
    });
    
    const totalApps = allAppsForStatus.length;
    let currentDeg = 0;
    const statusColors = {
        Confirmed: '#22c55e', 
        Pending: '#eab308',   
        Completed: '#3b82f6', 
        Cancelled: '#9ca3af', 
        Trash: '#ef4444'      
    };
    
    let gradientParts: string[] = [];
    const statuses: AppointmentStatus[] = ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'Trash'];
    
    statuses.forEach(status => {
        const count = statusCounts[status];
        if (count > 0) {
            const deg = (count / totalApps) * 360;
            gradientParts.push(`${statusColors[status]} ${currentDeg}deg ${currentDeg + deg}deg`);
            currentDeg += deg;
        }
    });
    
    const pieChartGradient = totalApps > 0 
        ? `conic-gradient(${gradientParts.join(', ')})` 
        : 'conic-gradient(#f3f4f6 0deg 360deg)';

    const completedApps = statusCounts.Completed;
    const cancelledApps = statusCounts.Cancelled;
    const conversionRate = totalApps > 0 ? ((completedApps / totalApps) * 100).toFixed(1) : '0';
    const cancellationRate = totalApps > 0 ? ((cancelledApps / totalApps) * 100).toFixed(1) : '0';

    return { 
      topServices, totalRevenue, chartData, chartLabel, conversionRate, cancellationRate, 
      statusCounts, pieChartGradient, totalApps 
    };
  }, [appointments, reportFilterMonth, services]);


  // Stats
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status !== 'Trash').length;
  const unreadInquiries = inquiries.filter(i => !i.read).length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDailyAppointments = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dateStr && a.status !== 'Trash');
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedCalendarDate(date);
  };

  // Action Handlers
  const openConfirmation = (id: string | null, type: 'Confirm' | 'Cancel' | 'Complete' | 'Trash' | 'Restore' | 'BulkTrash' | 'BulkCancel' | 'BulkComplete' | 'ResetDatabase' | 'DeleteService' | 'BulkEnableServices' | 'BulkDisableServices' | 'BulkDeleteServices' | 'DeleteInquiry' | 'BulkDeleteInquiries') => {
    setConfirmationAction({ isOpen: true, type, appointmentId: id });
  };

  const closeConfirmation = () => {
    setConfirmationAction({ isOpen: false, type: null, appointmentId: null });
  };

  const handleConfirmAction = () => {
    if (confirmationAction.type) {
      let message = '';
      let toastType: ToastType = 'success';

      if (confirmationAction.type === 'ResetDatabase') {
         onResetDatabase();
         message = 'System reset completed.';
      }
      else if (confirmationAction.type === 'DeleteService' && confirmationAction.appointmentId) {
         onDeleteService(confirmationAction.appointmentId);
         message = 'Service deleted successfully';
      }
      else if (confirmationAction.type === 'DeleteInquiry' && confirmationAction.appointmentId) {
         onDeleteInquiry(confirmationAction.appointmentId);
         message = 'Inquiry deleted successfully';
      }
      else if (confirmationAction.type.startsWith('Bulk')) {
         const ids = Array.from(selectedIds);
         
         if (confirmationAction.type === 'BulkEnableServices') {
             onBulkServiceToggle(ids, true);
             message = `${ids.length} services enabled.`;
         } else if (confirmationAction.type === 'BulkDisableServices') {
             onBulkServiceToggle(ids, false);
             message = `${ids.length} services disabled.`;
         } else if (confirmationAction.type === 'BulkDeleteServices') {
             onBulkServiceDelete(ids);
             message = `${ids.length} services deleted.`;
         } else if (confirmationAction.type === 'BulkDeleteInquiries') {
             onBulkInquiryDelete(ids);
             message = `${ids.length} inquiries deleted.`;
         } else {
             let newStatus: AppointmentStatus = 'Pending';
             if (confirmationAction.type === 'BulkTrash') newStatus = 'Trash';
             if (confirmationAction.type === 'BulkCancel') newStatus = 'Cancelled';
             if (confirmationAction.type === 'BulkComplete') newStatus = 'Completed';
             
             onBulkStatusChange(ids, newStatus);
             message = `${ids.length} items updated.`;
         }
         setSelectedIds(new Set()); 
      } else if (confirmationAction.appointmentId) {
          let newStatus: AppointmentStatus = 'Pending';
          switch (confirmationAction.type) {
              case 'Confirm': newStatus = 'Confirmed'; message = 'Appointment Confirmed'; break;
              case 'Cancel': newStatus = 'Cancelled'; message = 'Appointment Cancelled'; toastType = 'info'; break;
              case 'Complete': newStatus = 'Completed'; message = 'Appointment Completed'; break;
              case 'Trash': newStatus = 'Trash'; message = 'Moved to Trash'; toastType = 'error'; break;
              case 'Restore': newStatus = 'Pending'; message = 'Restored to Pending'; break;
          }
          if (confirmationAction.type !== 'DeleteService' && confirmationAction.type !== 'DeleteInquiry') {
             onStatusChange(confirmationAction.appointmentId, newStatus);
          }
      }

      if (confirmationAction.type !== 'ResetDatabase' && confirmationAction.type !== 'DeleteService' && confirmationAction.type !== 'DeleteInquiry') showToast(message, toastType);
      closeConfirmation();
      setViewAppointment(null);
    }
  };

  // Service Management Handlers
  const openAddServiceModal = () => {
    setServiceFormData({
        title: '',
        category: ServiceCategory.SKIN_REJUVENATION,
        description: '',
        priceRange: '',
        image: 'https://picsum.photos/400/500',
        available: true,
        detailedDescription: '',
        benefits: []
    });
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: ServiceInfo) => {
    setServiceFormData(service);
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
        onUpdateService({ ...editingService, ...serviceFormData } as ServiceInfo);
    } else {
        const newService: ServiceInfo = {
            id: `SVC-${Date.now()}`,
            ...serviceFormData as ServiceInfo,
            benefits: serviceFormData.benefits || []
        };
        onAddService(newService);
    }
    setIsServiceModalOpen(false);
  };

  const statusTabs: (AppointmentStatus | 'All')[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Trash'];

  // Calendar Day Modal Appointments
  const selectedDayAppointments = selectedCalendarDate 
    ? getDailyAppointments(selectedCalendarDate.getDate())
    : [];

  return (
    <div className="min-h-screen bg-gray-100 flex animate-fade-in relative overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold">Optimum<span className="text-gold-500">Admin</span></h2>
            <p className="text-xs text-gray-500 mt-1">
              {adminRole === 'superadmin' ? 'Developer Access' : 'Staff Portal v1.0'}
            </p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {['overview', 'calendar', 'appointments', 'clients', 'inquiries', 'reports', 'services', 'settings'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-gold-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
             >
                {tab === 'overview' && <LayoutDashboard size={20} />}
                {tab === 'calendar' && <CalendarIcon size={20} />}
                {tab === 'appointments' && <Clock size={20} />}
                {tab === 'clients' && <Users size={20} />}
                {tab === 'inquiries' && <MessageSquare size={20} />}
                {tab === 'reports' && <BarChart3 size={20} />}
                {tab === 'services' && <Briefcase size={20} />}
                {tab === 'settings' && <Settings size={20} />}
                {tab}
                {tab === 'appointments' && pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
                {tab === 'inquiries' && unreadInquiries > 0 && <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadInquiries}</span>}
             </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-800">
             <button 
                onClick={onViewSite}
                className="w-full flex items-center gap-3 px-4 py-3 text-gold-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                <ExternalLink size={20} /> View Live Website
              </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize truncate">
              {activeTab === 'overview' ? 'Dashboard Overview' : 
               activeTab === 'calendar' ? 'Calendar' : 
               activeTab === 'clients' ? 'Client Directory' :
               activeTab === 'reports' ? 'Analytics & Reports' :
               activeTab === 'settings' ? 'System Settings' :
               activeTab === 'services' ? 'Services Management' : 
               activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-500">System Online</span>
             </div>
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 relative group cursor-help">
                <User size={20} />
                <div className="absolute top-full right-0 mt-2 bg-black text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
                   Role: {adminRole === 'superadmin' ? 'Super Admin' : 'Staff'}
                </div>
             </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in pb-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                      <h3 className="text-3xl font-bold text-gray-900">{pendingCount}</h3>
                    </div>
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                      <Clock size={24} />
                    </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Today's Appts</p>
                      <h3 className="text-3xl font-bold text-gray-900">{todayCount}</h3>
                    </div>
                    <div className="p-3 bg-gold-100 text-gold-600 rounded-lg">
                      <CalendarIcon size={24} />
                    </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Unread Messages</p>
                      <h3 className="text-3xl font-bold text-gray-900">{unreadInquiries}</h3>
                    </div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <MessageSquare size={24} />
                    </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Completed Services</p>
                      <h3 className="text-3xl font-bold text-gray-900">{completedCount}</h3>
                    </div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                      <CheckSquare size={24} />
                    </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Recent Appointments</h3>
                    <span className="text-xs text-gray-400">Latest 3</span>
                  </div>
                  <div className="space-y-4">
                     {appointments.filter(a => a.status !== 'Trash').slice(0, 3).map(apt => (
                       <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div>
                            <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => setViewClientHistory(apt.clientName)}
                                 className="font-bold text-sm text-gray-900 hover:text-gold-600 hover:underline transition-colors text-left"
                               >
                                 {apt.clientName}
                               </button>
                               {apt.id.startsWith('APT-') && apt.id.length > 8 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">NEW</span>}
                            </div>
                            <p className="text-xs text-gray-500">{apt.service} • {apt.time}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(apt.status)}`}>{apt.status}</span>
                       </div>
                     ))}
                     <button onClick={() => setActiveTab('appointments')} className="w-full py-2 text-sm text-gold-600 font-bold hover:bg-gold-50 rounded transition-colors border border-dashed border-gold-200">View All Appointments</button>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Clinic Notes</h3>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800 mb-3">
                     <strong>Reminder:</strong> Dr. Tica is out of office on April 20th. Block schedule accordingly.
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
                     <Lock size={14} /> Database management is available in the Settings tab for Administrators.
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
           <div className="space-y-6 animate-fade-in pb-10">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-lg font-bold text-gray-800">Performance Metrics</h2>
                <div className="flex items-center gap-2">
                   <label className="text-sm text-gray-500 font-medium">Filter by:</label>
                   <select 
                      value={reportFilterMonth}
                      onChange={(e) => setReportFilterMonth(e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold-500 outline-none shadow-sm cursor-pointer"
                   >
                      <option value="All">All Months (YTD)</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                          <option key={m} value={m}>{m}</option>
                      ))}
                   </select>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                      <p className="text-sm text-gray-500 mb-1">Estimated Revenue</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">₱{reportsData.totalRevenue.toLocaleString()}</h3>
                      <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1"/> Based on completed</p>
                   </div>
                   <div className="p-4 bg-green-50 text-green-600 rounded-full">
                      <DollarSign size={24} />
                   </div>
                </div>
                {/* ... other report cards ... */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                      <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{reportsData.conversionRate}%</h3>
                      <p className="text-xs text-gray-400 mt-1">Appointments Completed</p>
                   </div>
                   <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                      <PieChart size={24} />
                   </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                      <p className="text-sm text-gray-500 mb-1">Cancellation Rate</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{reportsData.cancellationRate}%</h3>
                      <p className="text-xs text-red-400 mt-1">Total Cancelled/Rejected</p>
                   </div>
                   <div className="p-4 bg-red-50 text-red-600 rounded-full">
                      <XCircle size={24} />
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <PieChart size={20} className="text-gold-600" /> Appointment Status
                   </h3>
                   <div className="flex flex-col items-center">
                      <div 
                         className="w-48 h-48 rounded-full shadow-inner mb-6 relative"
                         style={{ background: reportsData.pieChartGradient }}
                      >
                         <div className="absolute inset-0 m-12 bg-white rounded-full flex items-center justify-center flex-col">
                             <span className="text-2xl font-bold text-gray-800">{reportsData.totalApps}</span>
                             <span className="text-xs text-gray-500">Total Apps</span>
                         </div>
                      </div>
                      <div className="w-full space-y-2">
                          {['Confirmed', 'Pending', 'Completed', 'Cancelled', 'Trash'].map((status) => (
                             <div key={status} className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                   <span className={`w-3 h-3 rounded-full ${
                                      status === 'Confirmed' ? 'bg-green-500' :
                                      status === 'Pending' ? 'bg-yellow-500' :
                                      status === 'Completed' ? 'bg-blue-500' :
                                      status === 'Trash' ? 'bg-red-500' : 'bg-gray-400'
                                   }`}></span> {status}
                                </div>
                                <span className="font-bold">{reportsData.statusCounts[status as keyof typeof reportsData.statusCounts]}</span>
                             </div>
                          ))}
                      </div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                   <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <BarChart3 size={20} className="text-gold-600" /> Most Popular Services <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-2">{reportFilterMonth}</span>
                   </h3>
                   <div className="space-y-4">
                      {reportsData.topServices.map((service, idx) => (
                         <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                               <span className="font-medium text-gray-700">{service.name}</span>
                               <span className="text-gray-500">{service.count} bookings</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                               <div 
                                 className="bg-gold-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                                 style={{ width: `${service.percentage}%` }}
                               ></div>
                            </div>
                         </div>
                      ))}
                      {reportsData.topServices.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No data available for this period.</p>
                      )}
                   </div>
                   <div className="mt-8 pt-6 border-t border-gray-100">
                     <h3 className="font-bold text-gray-900 mb-6">{reportsData.chartLabel}</h3>
                     <div className="flex items-end justify-between h-32 gap-1">
                        {reportsData.chartData.map((data, idx) => (
                           <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                              <div className="relative w-full flex justify-center">
                                 <div 
                                   className="w-full max-w-[20px] bg-blue-100 hover:bg-blue-500 transition-colors rounded-t-sm" 
                                   style={{ height: `${Math.max(data.count * (reportFilterMonth === 'All' ? 10 : 5), 4)}px` }} 
                                 ></div>
                                 <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                    {data.label}: {data.count}
                                 </div>
                              </div>
                              <span className="text-[10px] text-gray-400 font-medium">
                                 {reportFilterMonth === 'All' ? data.label : (parseInt(data.label) % 5 === 0 || parseInt(data.label) === 1 ? data.label : '')}
                              </span>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>
             </div>
           </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in relative pb-10">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
                  {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                   <button onClick={prevMonth} className="p-2 hover:bg-white rounded-md transition-colors"><ChevronLeft size={20} /></button>
                   <button onClick={goToToday} className="px-4 py-1 text-sm font-bold text-gray-600 hover:text-gray-900">Today</button>
                   <button onClick={nextMonth} className="p-2 hover:bg-white rounded-md transition-colors"><ChevronRight size={20} /></button>
                </div>
             </div>
             <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {day}
                        </div>
                     ))}
                  </div>
                  <div className="grid grid-cols-7 bg-gray-200 gap-px">
                     {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-white min-h-[100px] md:min-h-[120px] p-2 bg-gray-50/30"></div>
                     ))}
                     {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => {
                        const dayAppointments = getDailyAppointments(day);
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                        return (
                          <div 
                            key={day} 
                            onClick={() => handleDayClick(day)}
                            className={`bg-white min-h-[100px] md:min-h-[120px] p-1 md:p-2 hover:bg-gray-50 transition-colors flex flex-col gap-1 group cursor-pointer ${isToday ? 'bg-gold-50/20' : ''}`}
                          >
                             <div className="flex justify-between items-start">
                                <span className={`text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-gold-600 text-white shadow-sm' : 'text-gray-700'}`}>
                                  {day}
                                </span>
                                {dayAppointments.length > 0 && (
                                   <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                      {dayAppointments.length}
                                   </span>
                                )}
                             </div>
                             <div className="space-y-1 overflow-y-auto max-h-[60px] md:max-h-[80px]">
                                {dayAppointments.map(apt => (
                                  <div 
                                    key={apt.id}
                                    className={`text-[10px] px-1.5 py-1 rounded border-l-2 truncate transition-transform hover:scale-105 ${
                                      apt.status === 'Confirmed' ? 'bg-green-50 border-green-500 text-green-800' :
                                      apt.status === 'Pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                                      apt.status === 'Completed' ? 'bg-blue-50 border-blue-500 text-blue-800' :
                                      'bg-gray-50 border-gray-400 text-gray-500'
                                    }`}
                                  >
                                    <span className="font-bold hidden md:inline">{apt.time}</span> <span className="md:hidden">.</span> {apt.clientName}
                                  </div>
                                ))}
                             </div>
                          </div>
                        );
                     })}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col h-[calc(100vh-140px)]">
             {/* Toolbar */}
             <div className="p-4 md:p-6 border-b border-gray-100 space-y-4 flex-shrink-0">
               {/* Status Tabs */}
               <div className="flex flex-wrap gap-2 pb-2">
                  {statusTabs.map(status => {
                     const isActive = activeStatusTab === status;
                     const count = getStatusCount(status);
                     return (
                       <button
                         key={status}
                         onClick={() => setActiveStatusTab(status)}
                         className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
                           isActive 
                           ? (status === 'Trash' ? 'bg-red-600 text-white shadow-md' : 'bg-gold-600 text-white shadow-md') 
                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                         }`}
                       >
                         {status === 'Trash' && <Trash2 size={14} />}
                         {status} 
                         <span className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>{count}</span>
                       </button>
                     );
                  })}
               </div>

               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Bulk Actions Dropdown */}
                    {selectedIds.size > 0 && (
                       <div className="relative animate-fade-in z-20">
                          <button 
                            onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Bulk Actions ({selectedIds.size})
                            <ChevronDown size={14} />
                          </button>
                          
                          {isBulkDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-30">
                               <button onClick={() => { openConfirmation(null, 'BulkComplete'); setIsBulkDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 border-b border-gray-50"><CheckSquare size={16}/> Mark Completed</button>
                               <button onClick={() => { openConfirmation(null, 'BulkCancel'); setIsBulkDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 flex items-center gap-2 border-b border-gray-50"><XCircle size={16}/> Cancel Selected</button>
                               <button onClick={() => { openConfirmation(null, 'BulkTrash'); setIsBulkDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Trash2 size={16}/> Move to Trash</button>
                            </div>
                          )}
                       </div>
                    )}
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search client name or ID..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                   <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? 'bg-gold-50 text-gold-700 border border-gold-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                   >
                     <Filter size={16} /> Filters {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                   </button>
                 </div>
               </div>

               {/* Collapsible Filters */}
               {showFilters && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in border border-gray-200">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Service</label>
                       <select 
                         value={filterService}
                         onChange={(e) => setFilterService(e.target.value)}
                         className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gold-500 outline-none"
                       >
                         <option value="All">All Services</option>
                         {allServices.map(service => (
                           <option key={service} value={service}>{service}</option>
                         ))}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Start Date</label>
                       <input 
                         type="date" 
                         value={dateRange.start}
                         onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                         className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gold-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">End Date</label>
                       <input 
                         type="date" 
                         value={dateRange.end}
                         onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                         className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-gold-500 outline-none"
                       />
                    </div>
                 </div>
               )}
             </div>

             <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead>
                   <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                     <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          onChange={handleSelectAll}
                          checked={paginatedAppointments.length > 0 && paginatedAppointments.every(a => selectedIds.has(a.id))}
                          className="w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                     </th>
                     <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('clientName')}>
                        <div className="flex items-center gap-1">
                          ID & Client
                          <ArrowUpDown size={12} className={sortConfig?.key === 'clientName' ? 'text-gold-600' : 'text-gray-400'} />
                        </div>
                     </th>
                     <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                        <div className="flex items-center gap-1">
                          Service & Date
                          <ArrowUpDown size={12} className={sortConfig?.key === 'date' ? 'text-gold-600' : 'text-gray-400'} />
                        </div>
                     </th>
                     <th className="p-4 font-medium">Contact</th>
                     <th className="p-4 font-medium">Status</th>
                     <th className="p-4 font-medium text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                   {paginatedAppointments.map(apt => (
                     <tr 
                       key={apt.id} 
                       className={`hover:bg-gray-50 transition-colors ${selectedIds.has(apt.id) ? 'bg-gold-50/50' : ''}`}
                       onMouseEnter={(e) => setTooltipData({ appointment: apt, rect: e.currentTarget.getBoundingClientRect() })}
                       onMouseLeave={() => setTooltipData(null)}
                     >
                       <td className="p-4">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(apt.id)}
                            onChange={() => handleSelectOne(apt.id)}
                            className="w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                          />
                       </td>
                       <td className="p-4">
                         <div className="flex items-center">
                           <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                             {getInitials(apt.clientName)}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setViewClientHistory(apt.clientName)}
                                  className="font-bold text-gray-900 hover:text-gold-600 hover:underline transition-colors text-left truncate max-w-[120px]"
                                  title="View History"
                                >
                                    {apt.clientName}
                                </button>
                                  {/* Visual indicator for new appointments */}
                                  {apt.id.startsWith('APT-') && apt.id.length > 8 && (
                                      <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" title="New Booking"></span>
                                  )}
                              </div>
                              <div className="text-xs text-gray-500">{apt.id}</div>
                           </div>
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="flex items-center">
                            <span className="font-medium text-gray-900">{apt.service}</span>
                            {apt.notes && (
                              <span title="Has notes" className="ml-2">
                                <FileText size={14} className="text-gray-400" />
                              </span>
                            )}
                         </div>
                         <div className="text-gray-500 flex items-center gap-1 text-xs mt-0.5">
                           <Clock size={12} /> {apt.date} <span className="mx-1">•</span> {apt.time}
                         </div>
                       </td>
                       <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-1"><Phone size={14} /> {apt.phone}</div>
                          <div className="flex items-center gap-2 text-gray-600"><Mail size={14} /> {apt.email}</div>
                       </td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusBadge(apt.status)}`}>
                           {apt.status}
                         </span>
                       </td>
                       <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           {/* Common Actions */}
                           <button
                              onClick={() => setViewClientHistory(apt.clientName)}
                              className="p-1.5 text-gray-500 hover:text-gold-600 hover:bg-gold-50 rounded transition-colors"
                              title="View Client History"
                           >
                              <History size={18} />
                           </button>
                           <button
                              onClick={() => setViewAppointment(apt)}
                              className="p-1.5 text-gray-500 hover:text-gold-600 hover:bg-gold-50 rounded transition-colors"
                              title="View Details"
                           >
                              <Eye size={18} />
                           </button>

                           {/* Pending Actions */}
                           {apt.status === 'Pending' && (
                             <>
                                <button 
                                  onClick={() => openConfirmation(apt.id, 'Confirm')}
                                  className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Confirm"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button 
                                  onClick={() => openConfirmation(apt.id, 'Cancel')}
                                  className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                             </>
                           )}

                           {/* Confirmed Actions */}
                           {apt.status === 'Confirmed' && (
                              <>
                                <button
                                    onClick={() => openConfirmation(apt.id, 'Complete')}
                                    className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Mark as Completed"
                                >
                                    <CheckSquare size={18} />
                                </button>
                                <button 
                                    onClick={() => openConfirmation(apt.id, 'Cancel')}
                                    className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Cancel Appointment"
                                >
                                    <XCircle size={18} />
                                </button>
                                <button 
                                    onClick={() => openConfirmation(apt.id, 'Trash')}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Move to Trash"
                                >
                                    <Trash2 size={18} />
                                </button>
                              </>
                           )}

                           {/* Completed / Cancelled Actions - Move to Trash */}
                           {(apt.status === 'Completed' || apt.status === 'Cancelled') && (
                              <button 
                                onClick={() => openConfirmation(apt.id, 'Trash')}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Move to Trash"
                              >
                                <Trash2 size={18} />
                              </button>
                           )}

                           {/* Trash Actions - Restore */}
                           {apt.status === 'Trash' && (
                               <button 
                                onClick={() => openConfirmation(apt.id, 'Restore')}
                                className="p-1.5 bg-gold-100 text-gold-700 hover:bg-gold-200 rounded transition-colors" title="Restore"
                              >
                                <RotateCcw size={18} />
                              </button>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                   {sortedAppointments.length === 0 && (
                     <tr>
                       <td colSpan={6} className="p-8 text-center text-gray-500">No appointments found.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>

             {/* Pagination Controls */}
             <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden md:inline">Rows per page:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded p-1 outline-none text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="ml-2">
                    {sortedAppointments.length > 0 
                      ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedAppointments.length)} of ${sortedAppointments.length}`
                      : '0 of 0'
                    }
                  </span>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
               </div>
             </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in pb-10">
              <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h2 className="text-lg font-bold text-gray-900">Client Directory</h2>
                 <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                   <input 
                     type="text" 
                     placeholder="Search clients..." 
                     className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                       <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                          <th className="p-4 font-medium">Client Name</th>
                          <th className="p-4 font-medium">Contact</th>
                          <th className="p-4 font-medium text-center">Total Visits</th>
                          <th className="p-4 font-medium">Last Visit</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                       {uniqueClients.map((client, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                             <td className="p-4">
                                <div className="font-bold text-gray-900">{client.name}</div>
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-2 text-gray-600 mb-1"><Phone size={14} /> {client.phone}</div>
                                <div className="flex items-center gap-2 text-gray-600"><Mail size={14} /> {client.email}</div>
                             </td>
                             <td className="p-4 text-center">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-bold">{client.totalVisits}</span>
                             </td>
                             <td className="p-4 text-gray-600">{client.lastVisit}</td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                   client.status === 'Active' 
                                   ? 'bg-green-50 text-green-700 border-green-200' 
                                   : 'bg-gray-100 text-gray-500 border-gray-200'
                                }`}>
                                   {client.status}
                                </span>
                             </td>
                             <td className="p-4 text-right">
                                <button 
                                  onClick={() => setViewClientHistory(client.name)}
                                  className="text-gold-600 hover:text-gold-800 font-bold text-xs flex items-center gap-1 justify-end"
                                >
                                   <History size={14} /> View History
                                </button>
                             </td>
                          </tr>
                       ))}
                       {uniqueClients.length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-500">No clients found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col h-[calc(100vh-140px)]">
              {/* Toolbar */}
              <div className="p-4 md:p-6 border-b border-gray-100 space-y-4 flex-shrink-0">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Bulk Actions Dropdown */}
                        {selectedIds.size > 0 && (
                           <div className="relative animate-fade-in z-20">
                              <button 
                                onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Bulk Actions ({selectedIds.size})
                                <ChevronDown size={14} />
                              </button>
                              {isBulkDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-30">
                                   <button onClick={() => { openConfirmation(null, 'BulkDeleteInquiries'); setIsBulkDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 flex items-center gap-2"><Trash2 size={16}/> Delete Selected</button>
                                </div>
                              )}
                           </div>
                        )}
                        <div className="relative w-full md:w-96">
                           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                           <input 
                             type="text" 
                             placeholder="Search name, email or message..." 
                             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto items-center">
                       <label className="text-xs font-bold text-gray-500 uppercase mr-2">Filter:</label>
                       <select 
                          value={activeInquiryStatus}
                          onChange={(e) => setActiveInquiryStatus(e.target.value as any)}
                          className="px-3 py-2 rounded-lg text-sm bg-gray-100 border-none outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
                       >
                          <option value="All">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up Needed">Follow-up Needed</option>
                          <option value="Resolved">Resolved</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Inquiry List */}
              <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2 px-2">
                   <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={paginatedInquiries.length > 0 && paginatedInquiries.every(i => selectedIds.has(i.id))}
                      className="w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                   />
                   <span className="text-xs text-gray-500 font-bold uppercase">Select All</span>
                </div>

                {paginatedInquiries.length > 0 ? paginatedInquiries.map(inq => (
                  <div key={inq.id} className={`p-4 md:p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all ${selectedIds.has(inq.id) ? 'border-gold-400 bg-gold-50/10' : 'border-gray-100'} ${!inq.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
                      <div className="flex items-start gap-3 w-full">
                        <input 
                            type="checkbox" 
                            checked={selectedIds.has(inq.id)}
                            onChange={() => handleSelectOne(inq.id)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <div className="flex-1">
                           <div className="flex items-center gap-2 flex-wrap mb-1">
                              {!inq.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" title="Unread"></span>}
                              <h3 className="font-bold text-gray-900 text-lg">{inq.name}</h3>
                              <span className="text-gray-400 text-xs border border-gray-200 px-2 py-0.5 rounded whitespace-nowrap">{inq.date}</span>
                           </div>
                           <div className="text-sm text-gray-500 flex flex-col md:flex-row md:gap-4">
                              <span className="flex items-center gap-1"><Mail size={12}/> {inq.email}</span>
                              <span className="flex items-center gap-1"><Phone size={12}/> {inq.phone}</span>
                           </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                         <select
                            value={inq.status || 'New'}
                            onChange={(e) => onInquiryStatusChange(inq.id, e.target.value as InquiryStatus)}
                            className={`text-xs font-bold border rounded px-2 py-1 outline-none cursor-pointer transition-colors ${
                               inq.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                               inq.status === 'Contacted' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                               inq.status === 'Follow-up Needed' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                               'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                         >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Follow-up Needed">Follow-up Needed</option>
                            <option value="Resolved">Resolved</option>
                         </select>
                         <button 
                            onClick={() => openConfirmation(inq.id, 'DeleteInquiry')}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete Inquiry"
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 ml-7 text-sm">
                      "{inq.message}"
                    </p>
                    
                    <div className="mt-3 flex gap-2 ml-7">
                      <a 
                        href={`mailto:${inq.email}?subject=Re: Inquiry for Optimum Skin`}
                        className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-gold-600 transition-colors flex items-center gap-2"
                      >
                        <Send size={12} /> Reply via Email
                      </a>
                      {!inq.read && (
                        <button 
                          onClick={() => onMarkInquiryRead(inq.id)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-100 transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-500">No inquiries found matching your filters.</div>
                )}
              </div>

              {/* Inquiry Pagination */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden md:inline">Rows per page:</span>
                  <select 
                    value={inquiriesPerPage}
                    onChange={(e) => {
                      setInquiriesPerPage(Number(e.target.value));
                      setCurrentInquiryPage(1);
                    }}
                    className="border border-gray-300 rounded p-1 outline-none text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="ml-2">
                    {paginatedInquiries.length > 0 
                      ? `${(currentInquiryPage - 1) * inquiriesPerPage + 1}-${Math.min(currentInquiryPage * inquiriesPerPage, filteredInquiries.length)} of ${filteredInquiries.length}`
                      : '0 of 0'
                    }
                  </span>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentInquiryPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentInquiryPage === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentInquiryPage(prev => Math.min(prev + 1, totalInquiryPages))}
                    disabled={currentInquiryPage === totalInquiryPages || totalInquiryPages === 0}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
               </div>
             </div>
           </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in flex flex-col h-[calc(100vh-140px)]">
              <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
                 <div>
                    <h2 className="text-lg font-bold text-gray-900">Services Management</h2>
                    <p className="text-sm text-gray-500">Toggle availability of clinic services.</p>
                 </div>
                 
                 {/* Bulk Actions & Search Toolbar */}
                 <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full xl:w-auto">
                    {selectedIds.size > 0 && (
                       <div className="relative animate-fade-in z-20">
                          <button 
                            onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Bulk Actions ({selectedIds.size})
                            <ChevronDown size={14} />
                          </button>
                          
                          {isBulkDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-30">
                               <button 
                                 onClick={() => { openConfirmation(null, 'BulkEnableServices'); setIsBulkDropdownOpen(false); }}
                                 className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors"
                               >
                                 <CheckCircle size={16} /> Enable Selected
                               </button>
                               <button 
                                 onClick={() => { openConfirmation(null, 'BulkDisableServices'); setIsBulkDropdownOpen(false); }}
                                 className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors border-t border-gray-50"
                               >
                                 <XCircle size={16} /> Disable Selected
                               </button>
                               <button 
                                 onClick={() => { openConfirmation(null, 'BulkDeleteServices'); setIsBulkDropdownOpen(false); }}
                                 className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2 transition-colors border-t border-gray-50"
                               >
                                 <Trash2 size={16} /> Delete Selected
                               </button>
                            </div>
                          )}
                       </div>
                    )}

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                           <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                           <input 
                             type="text" 
                             placeholder="Search services..." 
                             className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                        <button 
                           onClick={openAddServiceModal}
                           className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gold-600 transition-colors whitespace-nowrap"
                        >
                           <Plus size={16} /> <span className="hidden md:inline">Add Service</span>
                        </button>
                    </div>
                 </div>
              </div>
              
              {/* Mobile Card View for Services */}
              <div className="md:hidden overflow-y-auto flex-1 p-4 space-y-4">
                 {paginatedServices.map(service => (
                    <div key={service.id} className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 relative ${selectedIds.has(service.id) ? 'ring-2 ring-gold-500 bg-gold-50/20' : ''}`}>
                       <div className="flex items-start gap-3 mb-3">
                          <input 
                             type="checkbox" 
                             checked={selectedIds.has(service.id)}
                             onChange={() => handleSelectOne(service.id)}
                             className="mt-1 w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                          />
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                                <h4 className={`font-bold ${service.available ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{service.title}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${service.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                                   {service.available ? 'Active' : 'Offline'}
                                </span>
                             </div>
                             <p className="text-xs text-gold-600 font-bold uppercase mt-1">{service.category}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <span className="font-medium text-gray-700">{service.priceRange}</span>
                       </div>

                       <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-400 uppercase font-bold">Booking</span>
                             <button 
                               onClick={() => onToggleServiceAvailability(service.id, !service.available)}
                               className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                 service.available ? 'bg-green-500' : 'bg-gray-200'
                               }`}
                             >
                               <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${service.available ? 'translate-x-5' : 'translate-x-1'}`}/>
                             </button>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => openEditServiceModal(service)} className="p-2 bg-blue-50 text-blue-600 rounded"><Edit size={16}/></button>
                             <button onClick={() => openConfirmation(service.id, 'DeleteService')} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={16}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Desktop Table View for Services */}
              <div className="hidden md:block overflow-x-auto flex-1">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                       <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                          <th className="p-4 w-10">
                            <input 
                              type="checkbox" 
                              onChange={handleSelectAll}
                              checked={
                                paginatedServices.length > 0 && paginatedServices.every(s => selectedIds.has(s.id))
                              }
                              className="w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                            />
                          </th>
                          <th className="p-4 font-medium">Service Name</th>
                          <th className="p-4 font-medium">Category</th>
                          <th className="p-4 font-medium">Price Range</th>
                          <th className="p-4 font-medium text-center">Status</th>
                          <th className="p-4 font-medium text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                       {paginatedServices.map((service) => (
                          <tr 
                            key={service.id} 
                            className={`hover:bg-gray-50 transition-colors ${selectedIds.has(service.id) ? 'bg-gold-50/30' : ''}`}
                          >
                             <td className="p-4">
                                <input 
                                  type="checkbox" 
                                  checked={selectedIds.has(service.id)}
                                  onChange={() => handleSelectOne(service.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                                />
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-3">
                                   <img src={service.image} alt={service.title} className="w-10 h-10 rounded object-cover" />
                                   <div className={`font-bold ${service.available ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{service.title}</div>
                                </div>
                             </td>
                             <td className="p-4 text-gray-600">{service.category}</td>
                             <td className="p-4 text-gray-600 font-medium">{service.priceRange}</td>
                             <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                   service.available
                                   ? 'bg-green-50 text-green-700 border-green-200' 
                                   : 'bg-red-50 text-red-500 border-red-200'
                                }`}>
                                   {service.available ? 'Active' : 'Unavailable'}
                                </span>
                             </td>
                             <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                   <div className="flex items-center gap-2 mr-2">
                                      <span className="text-[10px] text-gray-400 uppercase font-bold">Public Booking</span>
                                      <button 
                                        onClick={() => onToggleServiceAvailability(service.id, !service.available)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 ${
                                          service.available ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                      >
                                        <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            service.available ? 'translate-x-6' : 'translate-x-1'
                                          }`}
                                        />
                                      </button>
                                   </div>
                                   
                                   <button 
                                      onClick={() => openEditServiceModal(service)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Service"
                                   >
                                      <Edit size={18} />
                                   </button>
                                   <button 
                                      onClick={() => openConfirmation(service.id, 'DeleteService')}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete Service"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {paginatedServices.length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-500">No services found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>

              {/* Service Pagination Controls */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden md:inline">Rows per page:</span>
                  <select 
                    value={servicesPerPage}
                    onChange={(e) => {
                      setServicesPerPage(Number(e.target.value));
                      setCurrentServicePage(1);
                    }}
                    className="border border-gray-300 rounded p-1 outline-none text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="ml-2">
                    {paginatedServices.length > 0 
                      ? `${(currentServicePage - 1) * servicesPerPage + 1}-${Math.min(currentServicePage * servicesPerPage, filteredServices.length)} of ${filteredServices.length}`
                      : '0 of 0'
                    }
                  </span>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentServicePage(prev => Math.max(prev - 1, 1))}
                    disabled={currentServicePage === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentServicePage(prev => Math.min(prev + 1, totalServicePages))}
                    disabled={currentServicePage === totalServicePages || totalServicePages === 0}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
               </div>
             </div>
           </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
           <div className="space-y-8 animate-fade-in pb-10">
              {/* Profile Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><User size={20} className="text-gold-600"/> Account Information</h3>
                 </div>
                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
                       <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                          <Lock size={16} />
                          <span className="capitalize font-bold">{adminRole === 'superadmin' ? 'Super Admin (Developer)' : 'Staff Member'}</span>
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Branch</label>
                       <input type="text" disabled value="Optimum Skin - Pasig City" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600" />
                    </div>
                 </div>
              </div>

              {/* General Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Settings size={20} className="text-gold-600"/> System Preferences</h3>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                       <div>
                          <h4 className="font-bold text-gray-800 text-sm">Email Notifications</h4>
                          <p className="text-xs text-gray-500">Receive an email when a new booking is made.</p>
                       </div>
                       <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                       <div>
                          <h4 className="font-bold text-gray-800 text-sm">SMS Alerts</h4>
                          <p className="text-xs text-gray-500">Receive SMS for high-priority inquiries.</p>
                       </div>
                       <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer shadow-inner">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Data Management - Super Admin Only */}
              {adminRole === 'superadmin' && (
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                       <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Database size={20} className="text-gold-600"/> Database Management</h3>
                          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-red-200">Restricted Area</span>
                       </div>
                    </div>
                    <div className="p-6 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 border border-gray-200 rounded-xl bg-white hover:border-gold-300 transition-colors">
                             <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Download size={16} /> Backup Data</h4>
                             <p className="text-sm text-gray-500 mb-4">Download a full JSON snapshot of all appointments and inquiries.</p>
                             <button 
                                onClick={onDownloadBackup}
                                className="w-full py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gold-600 transition-colors"
                             >
                                Download Backup
                             </button>
                          </div>
                          <div className="p-4 border border-gray-200 rounded-xl bg-white hover:border-gold-300 transition-colors relative">
                             <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Upload size={16} /> Restore Data</h4>
                             <p className="text-sm text-gray-500 mb-4">Upload a JSON backup file to restore the database state.</p>
                             <input 
                               type="file" 
                               accept=".json"
                               onChange={(e) => e.target.files && onUploadBackup(e.target.files[0])}
                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                                Select File to Upload
                             </button>
                          </div>
                       </div>

                       {/* Danger Zone */}
                       <div className="mt-8 pt-6 border-t border-gray-200">
                          <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2"><AlertOctagon size={18} /> Danger Zone</h4>
                          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg gap-4">
                             <div>
                                <p className="font-bold text-gray-900 text-sm">Reset Database to Defaults</p>
                                <p className="text-xs text-gray-600">This will permanently delete all current data and restore the initial mock data. This action cannot be undone unless you have a backup.</p>
                             </div>
                             <button 
                                onClick={() => openConfirmation(null, 'ResetDatabase')}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-colors whitespace-nowrap"
                             >
                                Reset Database
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}

      </main>

      {/* SERVICE MODAL (Add/Edit) */}
      {isServiceModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-slide-in max-h-[90vh] overflow-y-auto">
               <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                  {editingService ? 'Edit Service' : 'Add New Service'}
               </h2>
               <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                     <input 
                        type="text" 
                        required 
                        value={serviceFormData.title}
                        onChange={(e) => setServiceFormData({...serviceFormData, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                     <select 
                        value={serviceFormData.category}
                        onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value as ServiceCategory})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold-500 outline-none"
                     >
                        {Object.values(ServiceCategory).map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                     <input 
                        type="text" 
                        placeholder="e.g., ₱3,500 - ₱5,000"
                        required 
                        value={serviceFormData.priceRange}
                        onChange={(e) => setServiceFormData({...serviceFormData, priceRange: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                     <textarea 
                        rows={3}
                        required 
                        value={serviceFormData.description}
                        onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                     <input 
                        type="url" 
                        placeholder="https://..."
                        required 
                        value={serviceFormData.image}
                        onChange={(e) => setServiceFormData({...serviceFormData, image: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold-500 outline-none"
                     />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                     <button 
                        type="button" 
                        onClick={() => setIsServiceModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gold-600 transition-colors"
                     >
                        {editingService ? 'Update Service' : 'Add Service'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Day Schedule Modal (Calendar Interaction) */}
      {selectedCalendarDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col animate-slide-in overflow-hidden max-h-[80vh]">
             <div className="bg-gold-50 p-6 border-b border-gold-100 flex justify-between items-start">
                <div>
                   <h2 className="text-xl font-serif font-bold text-gray-900">
                      {selectedCalendarDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                   </h2>
                   <p className="text-gold-600 text-sm mt-1">{selectedDayAppointments.length} Appointments Scheduled</p>
                </div>
                <button onClick={() => setSelectedCalendarDate(null)} className="p-2 hover:bg-gold-100 rounded-full text-gold-600">
                   <X size={24} />
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto flex-1">
                {selectedDayAppointments.length > 0 ? (
                   <div className="space-y-4">
                      {selectedDayAppointments.map((apt, index) => (
                         <div key={apt.id} className="relative pl-4 border-l-2 border-gold-200 pb-4 last:pb-0">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold-500 ring-4 ring-white"></div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewAppointment(apt)}>
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-gray-900 text-sm">{apt.time}</h4>
                                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusBadge(apt.status)}`}>
                                    {apt.status}
                                  </span>
                               </div>
                               <h3 className="font-bold text-gray-800 mb-1">{apt.clientName}</h3>
                               <p className="text-sm text-gray-500">{apt.service}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div className="text-center py-12 text-gray-400">
                      <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No appointments scheduled for this day.</p>
                   </div>
                )}
             </div>
             
             <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                <button 
                  onClick={() => setSelectedCalendarDate(null)}
                  className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationAction.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-slide-in">
             <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  confirmationAction.type?.includes('Confirm') ? 'bg-green-100 text-green-600' :
                  confirmationAction.type?.includes('Cancel') || confirmationAction.type?.includes('Delete') ? 'bg-red-100 text-red-600' :
                  confirmationAction.type?.includes('Trash') ? 'bg-gray-100 text-gray-600' :
                  confirmationAction.type === 'Restore' ? 'bg-gold-100 text-gold-600' :
                  confirmationAction.type === 'ResetDatabase' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                   <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {confirmationAction.type === 'Confirm' && 'Confirm Appointment'}
                  {confirmationAction.type === 'Cancel' && 'Cancel Appointment'}
                  {confirmationAction.type === 'Complete' && 'Complete Appointment'}
                  {confirmationAction.type === 'Trash' && 'Move to Trash'}
                  {confirmationAction.type === 'Restore' && 'Restore Appointment'}
                  {confirmationAction.type === 'BulkTrash' && 'Trash Selected Items'}
                  {confirmationAction.type === 'BulkCancel' && 'Cancel Selected Items'}
                  {confirmationAction.type === 'BulkComplete' && 'Complete Selected Items'}
                  {confirmationAction.type === 'ResetDatabase' && 'Reset System Database?'}
                  {confirmationAction.type === 'DeleteService' && 'Delete Service?'}
                  {confirmationAction.type === 'DeleteInquiry' && 'Delete Inquiry?'}
                  {confirmationAction.type === 'BulkEnableServices' && 'Enable Selected Services'}
                  {confirmationAction.type === 'BulkDisableServices' && 'Disable Selected Services'}
                  {confirmationAction.type === 'BulkDeleteServices' && 'Delete Selected Services'}
                  {confirmationAction.type === 'BulkDeleteInquiries' && 'Delete Selected Inquiries'}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {confirmationAction.type === 'ResetDatabase'
                    ? 'WARNING: This will delete ALL current appointments and inquiries and reset the system to its initial state. Are you absolutely sure?' 
                    : confirmationAction.type?.includes('Trash')
                    ? 'Are you sure you want to remove these items? You can restore them later.' 
                    : confirmationAction.type?.includes('Delete')
                    ? 'This will permanently remove the item(s) from your list.'
                    : confirmationAction.type === 'Restore' 
                    ? 'This appointment will be moved back to Pending status.'
                    : confirmationAction.type?.startsWith('Bulk')
                    ? `Are you sure you want to update ${selectedIds.size} selected items?`
                    : `Are you sure you want to ${confirmationAction.type?.toLowerCase()} this item?`}
                  
                  {confirmationAction.type?.includes('Cancel') && ' This action cannot be easily undone.'}
                  {confirmationAction.type?.includes('Complete') && ' This will mark the service as finished.'}
                </p>
                <div className="flex gap-3 w-full">
                   <button 
                     onClick={closeConfirmation}
                     className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                   >
                     No, Go Back
                   </button>
                   <button 
                     onClick={handleConfirmAction}
                     className={`flex-1 py-2.5 rounded-lg text-white font-medium shadow-md transition-colors ${
                       confirmationAction.type?.includes('Confirm') ? 'bg-green-600 hover:bg-green-700' :
                       confirmationAction.type?.includes('Cancel') || confirmationAction.type?.includes('Delete') ? 'bg-red-600 hover:bg-red-700' :
                       confirmationAction.type?.includes('Trash') ? 'bg-gray-600 hover:bg-gray-700' :
                       confirmationAction.type === 'Restore' ? 'bg-gold-600 hover:bg-gold-700' :
                       confirmationAction.type === 'ResetDatabase' ? 'bg-red-600 hover:bg-red-700' :
                       'bg-blue-600 hover:bg-blue-700'
                     }`}
                   >
                     {confirmationAction.type === 'ResetDatabase' || confirmationAction.type?.includes('Delete') ? 'Yes, Delete' : 'Yes, Confirm'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Client History Modal */}
      {viewClientHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-slide-in">
             <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div>
                   <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                      <History className="text-gold-500" size={24} /> Client History
                   </h2>
                   <p className="text-gray-500 mt-1 text-sm md:text-base">Records for <span className="font-bold text-gray-800">{viewClientHistory}</span></p>
                </div>
                <button onClick={() => setViewClientHistory(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                   <XCircle size={24} />
                </button>
             </div>
             
             <div className="p-6 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Phone size={16} className="text-gold-600" /> 
                     <span>{clientInfo.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Mail size={16} className="text-gold-600" /> 
                     <span>{clientInfo.email || 'N/A'}</span>
                  </div>
                </div>

                {/* Client Stats Summary */}
                {clientHistoryStats && (
                   <div className="grid grid-cols-3 gap-4 mb-2">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                         <p className="text-xs text-blue-500 font-bold uppercase">Completed</p>
                         <p className="text-xl font-bold text-blue-700">{clientHistoryStats.completed}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                         <p className="text-xs text-red-500 font-bold uppercase">Cancelled</p>
                         <p className="text-xl font-bold text-red-700">{clientHistoryStats.cancelled}</p>
                      </div>
                      <div className="bg-gold-50 p-3 rounded-lg border border-gold-100 text-center">
                         <p className="text-xs text-gold-600 font-bold uppercase">Top Service</p>
                         <p className="text-sm font-bold text-gold-800 truncate">{clientHistoryStats.favoriteService}</p>
                      </div>
                   </div>
                )}
             </div>

             <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                   {clientHistoryAppointments.map((apt, index) => (
                      <div key={apt.id} className="relative pl-6 border-l-2 border-gray-200 pb-2 last:pb-0">
                         <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                            index === 0 ? 'bg-gold-500' : 'bg-gray-300'
                         }`}></div>
                         <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-gray-900">{apt.service}</h4>
                               <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusBadge(apt.status)}`}>
                                 {apt.status}
                               </span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                               <CalendarIcon size={14} /> {apt.date}
                               <span className="text-gray-300">|</span>
                               <Clock size={14} /> {apt.time}
                            </div>
                            {apt.notes && (
                               <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded italic">
                                  "{apt.notes}"
                               </div>
                            )}
                         </div>
                      </div>
                   ))}
                   {clientHistoryAppointments.length === 0 && (
                      <div className="text-center text-gray-500 py-8">No history found for this client.</div>
                   )}
                </div>
             </div>

             <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl text-right">
                <button 
                  onClick={() => setViewClientHistory(null)}
                  className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {viewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col animate-slide-in overflow-hidden max-h-[90vh] overflow-y-auto">
             <div className="bg-gray-900 text-white p-6 relative">
                 <h2 className="text-xl font-bold font-serif">Appointment Details</h2>
                 <p className="text-gray-400 text-sm">ID: {viewAppointment.id}</p>
                 <button 
                    onClick={() => setViewAppointment(null)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                 >
                    <XCircle size={24} />
                 </button>
             </div>
             
             <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(viewAppointment.status)}`}>
                         {viewAppointment.status}
                      </span>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date & Time</p>
                      <p className="font-medium text-gray-900">{viewAppointment.date}</p>
                      <p className="text-sm text-gray-600">{viewAppointment.time}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                         <User size={16} className="text-gold-600" /> Client Information
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                         <p className="font-bold text-gray-800">{viewAppointment.clientName}</p>
                         <div className="grid grid-cols-1 gap-1 mt-1 text-gray-600">
                            <div className="flex items-center gap-2"><Phone size={14} /> {viewAppointment.phone}</div>
                            <div className="flex items-center gap-2"><Mail size={14} /> {viewAppointment.email}</div>
                         </div>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                         <CheckSquare size={16} className="text-gold-600" /> Service Details
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                         <p className="font-medium text-gray-800 mb-1">{viewAppointment.service}</p>
                         {viewAppointment.notes ? (
                             <div className="text-gray-600 text-xs italic bg-white p-2 rounded border border-gray-100 mt-2">
                                <span className="font-bold not-italic text-gold-600 block mb-1">Client Notes:</span>
                                "{viewAppointment.notes}"
                             </div>
                         ) : (
                             <p className="text-gray-400 text-xs italic">No additional notes provided.</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                 {viewAppointment.status === 'Pending' && (
                    <>
                       <button 
                         onClick={() => openConfirmation(viewAppointment.id, 'Cancel')}
                         className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
                       >
                         Reject
                       </button>
                       <button 
                         onClick={() => openConfirmation(viewAppointment.id, 'Confirm')}
                         className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                       >
                         Approve
                       </button>
                    </>
                 )}
                 {viewAppointment.status === 'Confirmed' && (
                    <>
                       <button 
                         onClick={() => openConfirmation(viewAppointment.id, 'Cancel')}
                         className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
                       >
                         Cancel
                       </button>
                       <button 
                         onClick={() => openConfirmation(viewAppointment.id, 'Trash')}
                         className="px-4 py-2 border border-gray-300 text-gray-500 bg-white hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors"
                       >
                         Trash
                       </button>
                       <button 
                         onClick={() => openConfirmation(viewAppointment.id, 'Complete')}
                         className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                       >
                         Complete
                       </button>
                    </>
                 )}
                 {(viewAppointment.status === 'Completed' || viewAppointment.status === 'Cancelled') && (
                     <button 
                        onClick={() => openConfirmation(viewAppointment.id, 'Trash')}
                        className="px-4 py-2 border border-gray-300 text-gray-500 bg-white hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors"
                     >
                        Trash
                     </button>
                 )}
                 {viewAppointment.status === 'Trash' && (
                     <button 
                        onClick={() => openConfirmation(viewAppointment.id, 'Restore')}
                        className="px-4 py-2 bg-gold-600 text-white hover:bg-gold-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                     >
                        Restore
                     </button>
                 )}
                 <button 
                    onClick={() => setViewAppointment(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors"
                 >
                    Close
                 </button>
             </div>
          </div>
        </div>
      )}

      {tooltipData && (
        <div 
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs pointer-events-none max-w-xs animate-fade-in hidden md:block"
          style={{ 
            top: tooltipData.rect.top - 8, 
            left: tooltipData.rect.left,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-bold text-gold-400 mb-1 text-sm">{tooltipData.appointment.service}</div>
          <div className="font-semibold text-white mb-1">{tooltipData.appointment.clientName}</div>
          <div className="text-gray-300 mb-2 space-y-1">
             <div className="flex items-center gap-2"><Clock size={12} className="text-gray-500"/> {tooltipData.appointment.time}</div>
             <div className="flex items-center gap-2"><Phone size={12} className="text-gray-500"/> {tooltipData.appointment.phone}</div>
             <div className="flex items-center gap-2"><Mail size={12} className="text-gray-500"/> {tooltipData.appointment.email}</div>
          </div>
          <div className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusBadge(tooltipData.appointment.status)}`}>
             {tooltipData.appointment.status}
          </div>
          {tooltipData.appointment.notes && (
             <div className="mt-2 pt-2 border-t border-gray-700 italic text-gold-100 bg-gray-800 p-2 rounded">
                "{tooltipData.appointment.notes}"
             </div>
          )}
          <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
