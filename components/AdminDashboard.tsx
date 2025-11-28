import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Calendar as CalendarIcon, MessageSquare, LogOut, 
  CheckCircle, XCircle, Clock, Search, MoreHorizontal, User, Mail, Phone, ChevronRight, ChevronLeft,
  Filter, ChevronUp, ChevronDown, ArrowUpDown, AlertTriangle, CheckSquare, ExternalLink, History, Users, Eye, FileText,
  BarChart3, TrendingUp, DollarSign, PieChart, Trash2, RotateCcw, Menu, X, Database, Download, Upload, Lock, Settings, AlertOctagon, Briefcase, Plus, Edit
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [servicesPerPage, setServicesPerPage] = useState(5);
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

  useEffect(() => {
    setIsSidebarOpen(false);
    setSelectedIds(new Set());
    setIsBulkDropdownOpen(false);
  }, [activeTab]);

  const allServices = Array.from(new Set(services.map(s => s.title))).sort();

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeStatusTab === 'All' 
        ? apt.status !== 'Trash' 
        : apt.status === activeStatusTab;
    const matchesService = filterService === 'All' || apt.service === filterService;
    const matchesDateStart = !dateRange.start || apt.date >= dateRange.start;
    const matchesDateEnd = !dateRange.end || apt.date <= dateRange.end;
    return matchesSearch && matchesStatus && matchesService && matchesDateStart && matchesDateEnd;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue = a[key];
    let bValue = b[key];
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const paginatedAppointments = sortedAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalServicePages = Math.ceil(filteredServices.length / servicesPerPage);
  const paginatedServices = filteredServices.slice((currentServicePage - 1) * servicesPerPage, currentServicePage * servicesPerPage);

  const filteredInquiries = inquiries.filter(inq => {
     const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inq.message.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = activeInquiryStatus === 'All' || inq.status === activeInquiryStatus;
     return matchesSearch && matchesStatus;
  });

  const totalInquiryPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);
  const paginatedInquiries = filteredInquiries.slice((currentInquiryPage - 1) * inquiriesPerPage, currentInquiryPage * inquiriesPerPage);

  const handleSelectAll = () => {
    if (activeTab === 'appointments') {
        if (paginatedAppointments.length > 0 && paginatedAppointments.every(a => selectedIds.has(a.id))) {
          const newSelected = new Set(selectedIds);
          paginatedAppointments.forEach(a => newSelected.delete(a.id));
          setSelectedIds(newSelected);
        } else {
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

  const getStatusCount = (status: AppointmentStatus | 'All') => {
      if (status === 'All') return appointments.filter(a => a.status !== 'Trash').length;
      return appointments.filter(a => a.status === status).length;
  };

  // Client Directory Logic
  const uniqueClients = React.useMemo(() => {
    const clientMap = new Map<string, {name: string; email: string; phone: string; totalVisits: number; lastVisit: string; status: string;}>();
    appointments.forEach(apt => {
      const existing = clientMap.get(apt.clientName);
      if (existing) {
        existing.totalVisits += 1;
        if (new Date(apt.date) > new Date(existing.lastVisit)) { existing.lastVisit = apt.date; existing.email = apt.email; existing.phone = apt.phone; }
        if (apt.status === 'Confirmed' || apt.status === 'Pending') { existing.status = 'Active'; }
      } else {
        clientMap.set(apt.clientName, {
          name: apt.clientName, email: apt.email, phone: apt.phone, totalVisits: 1, lastVisit: apt.date,
          status: (apt.status === 'Confirmed' || apt.status === 'Pending') ? 'Active' : 'Inactive'
        });
      }
    });
    return Array.from(clientMap.values()).filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  // Client Stats Logic
  const clientHistoryStats = useMemo(() => {
    if (!viewClientHistory) return null;
    const clientAppts = appointments.filter(a => a.clientName === viewClientHistory);
    const completed = clientAppts.filter(a => a.status === 'Completed').length;
    const cancelled = clientAppts.filter(a => a.status === 'Cancelled').length;
    const serviceCounts: Record<string, number> = {};
    clientAppts.forEach(a => { serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1; });
    const favoriteService = Object.entries(serviceCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';
    return { total: clientAppts.length, completed, cancelled, favoriteService };
  }, [viewClientHistory, appointments]);

  const clientHistoryAppointments = useMemo(() => {
    if (!viewClientHistory) return [];
    return appointments.filter(a => a.clientName === viewClientHistory).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [viewClientHistory, appointments]);

  const clientInfo = useMemo(() => {
    if (clientHistoryAppointments.length === 0) return { phone: '', email: '' };
    const latest = clientHistoryAppointments[0];
    return { phone: latest.phone, email: latest.email };
  }, [clientHistoryAppointments]);

  // Report Logic
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
    activeApps.forEach(apt => { serviceCounts[apt.service] = (serviceCounts[apt.service] || 0) + 1; });
    const topServices = Object.entries(serviceCounts).sort(([, a], [, b]) => b - a).slice(0, 5)
      .map(([name, count]) => ({ name, count, percentage: (count / (activeApps.length || 1)) * 100 }));
    let totalRevenue = 0;
    filteredReportApps.filter(a => a.status === 'Completed').forEach(apt => {
       const service = services.find(s => s.title === apt.service) || servicesData.find(s => s.title === apt.service);
       if (service) {
         const priceString = service.priceRange.replace(/,/g, '').replace(/₱/g, '');
         const prices = priceString.match(/(\d+)/g);
         if (prices && prices.length > 0) {
            const avg = prices.length === 2 ? (parseInt(prices[0]) + parseInt(prices[1])) / 2 : parseInt(prices[0]);
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
        chartData = months.slice(0, new Date().getMonth() + 1).map(m => ({ label: m, count: monthlyCounts[m] || 0 }));
    } else {
        chartLabel = `Daily Bookings - ${reportFilterMonth}`;
        const dailyCounts: Record<number, number> = {};
        filteredReportApps.forEach(apt => { const day = new Date(apt.date).getDate(); dailyCounts[day] = (dailyCounts[day] || 0) + 1; });
        const daysInMonth = 31;
        chartData = Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => ({ label: d.toString(), count: dailyCounts[d] || 0 }));
    }
    const statusCounts = { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0, Trash: 0 };
    const allAppsForStatus = appointments.filter(apt => {
        if (reportFilterMonth === 'All') return true;
        const date = new Date(apt.date);
        const monthName = date.toLocaleString('default', { month: 'long' });
        return monthName === reportFilterMonth;
    });
    allAppsForStatus.forEach(apt => { if (apt.status in statusCounts) { statusCounts[apt.status]++; } });
    const totalApps = allAppsForStatus.length;
    let currentDeg = 0;
    const statusColors = { Confirmed: '#22c55e', Pending: '#eab308', Completed: '#3b82f6', Cancelled: '#9ca3af', Trash: '#ef4444' };
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
    const pieChartGradient = totalApps > 0 ? `conic-gradient(${gradientParts.join(', ')})` : 'conic-gradient(#f3f4f6 0deg 360deg)';
    const completedApps = statusCounts.Completed;
    const cancelledApps = statusCounts.Cancelled;
    const conversionRate = totalApps > 0 ? ((completedApps / totalApps) * 100).toFixed(1) : '0';
    const cancellationRate = totalApps > 0 ? ((cancelledApps / totalApps) * 100).toFixed(1) : '0';
    return { topServices, totalRevenue, chartData, chartLabel, conversionRate, cancellationRate, statusCounts, pieChartGradient, totalApps };
  }, [appointments, reportFilterMonth, services]);

  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status !== 'Trash').length;
  const unreadInquiries = inquiries.filter(i => !i.read).length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  const getDaysInMonth = (date: Date) => { return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); };
  const getFirstDayOfMonth = (date: Date) => { return new Date(date.getFullYear(), date.getMonth(), 1).getDay(); };
  const getDailyAppointments = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dateStr && a.status !== 'Trash');
  };
  const nextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };
  const prevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const goToToday = () => { setCurrentDate(new Date()); };
  const handleDayClick = (day: number) => { setSelectedCalendarDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)); };

  const openConfirmation = (id: string | null, type: any) => { setConfirmationAction({ isOpen: true, type, appointmentId: id }); };
  const closeConfirmation = () => { setConfirmationAction({ isOpen: false, type: null, appointmentId: null }); };
  const handleConfirmAction = () => {
    if (confirmationAction.type) {
      let message = ''; let toastType: ToastType = 'success';
      if (confirmationAction.type === 'ResetDatabase') { onResetDatabase(); message = 'System reset completed.'; }
      else if (confirmationAction.type === 'DeleteService' && confirmationAction.appointmentId) { onDeleteService(confirmationAction.appointmentId); message = 'Service deleted successfully'; }
      else if (confirmationAction.type === 'DeleteInquiry' && confirmationAction.appointmentId) { onDeleteInquiry(confirmationAction.appointmentId); message = 'Inquiry deleted successfully'; }
      else if (confirmationAction.type.startsWith('Bulk')) {
         const ids = Array.from(selectedIds);
         if (confirmationAction.type === 'BulkEnableServices') { onBulkServiceToggle(ids, true); message = `${ids.length} services enabled.`; } 
         else if (confirmationAction.type === 'BulkDisableServices') { onBulkServiceToggle(ids, false); message = `${ids.length} services disabled.`; } 
         else if (confirmationAction.type === 'BulkDeleteServices') { onBulkServiceDelete(ids); message = `${ids.length} services deleted.`; } 
         else if (confirmationAction.type === 'BulkDeleteInquiries') { onBulkInquiryDelete(ids); message = `${ids.length} inquiries deleted.`; } 
         else if (confirmationAction.type === 'BulkInquiryMarkRead') { onBulkInquiryMarkRead(ids); message = `${ids.length} inquiries marked as read.`; } 
         else {
             let newStatus: AppointmentStatus = 'Pending';
             if (confirmationAction.type === 'BulkTrash') newStatus = 'Trash';
             if (confirmationAction.type === 'BulkCancel') newStatus = 'Cancelled';
             if (confirmationAction.type === 'BulkComplete') newStatus = 'Completed';
             onBulkStatusChange(ids, newStatus); message = `${ids.length} items updated.`;
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
          if (confirmationAction.type !== 'DeleteService' && confirmationAction.type !== 'DeleteInquiry') { onStatusChange(confirmationAction.appointmentId, newStatus); }
      }
      if (confirmationAction.type !== 'ResetDatabase' && confirmationAction.type !== 'DeleteService' && confirmationAction.type !== 'DeleteInquiry') showToast(message, toastType);
      closeConfirmation(); setViewAppointment(null);
    }
  };

  const openAddServiceModal = () => {
    setServiceFormData({ title: '', category: ServiceCategory.SKIN_REJUVENATION, description: '', priceRange: '', image: 'https://picsum.photos/400/500', available: true, detailedDescription: '', benefits: [] });
    setEditingService(null); setIsServiceModalOpen(true);
  };
  const openEditServiceModal = (service: ServiceInfo) => { setServiceFormData(service); setEditingService(service); setIsServiceModalOpen(true); };
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) { onUpdateService({ ...editingService, ...serviceFormData } as ServiceInfo); } 
    else { const newService: ServiceInfo = { id: `SVC-${Date.now()}`, ...serviceFormData as ServiceInfo, benefits: serviceFormData.benefits || [] }; onAddService(newService); }
    setIsServiceModalOpen(false);
  };

  const statusTabs: (AppointmentStatus | 'All')[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Trash'];
  const selectedDayAppointments = selectedCalendarDate ? getDailyAppointments(selectedCalendarDate.getDate()) : [];

  return (
    <div className="min-h-screen bg-gray-100 flex animate-fade-in relative overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div><h2 className="font-serif text-2xl font-bold">Optimum<span className="text-gold-500">Admin</span></h2><p className="text-xs text-gray-500 mt-1">{adminRole === 'superadmin' ? 'Developer Access' : 'Staff Portal v1.0'}</p></div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {['overview', 'calendar', 'appointments', 'clients', 'inquiries', 'reports', 'services', 'settings'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-gold-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {tab === 'overview' && <LayoutDashboard size={20} />} {tab === 'calendar' && <CalendarIcon size={20} />} {tab === 'appointments' && <Clock size={20} />} {tab === 'clients' && <Users size={20} />} {tab === 'inquiries' && <MessageSquare size={20} />} {tab === 'reports' && <BarChart3 size={20} />} {tab === 'services' && <Briefcase size={20} />} {tab === 'settings' && <Settings size={20} />}
                {tab}
                {tab === 'appointments' && pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
                {tab === 'inquiries' && unreadInquiries > 0 && <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadInquiries}</span>}
             </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-800"><button onClick={onViewSite} className="w-full flex items-center gap-3 px-4 py-3 text-gold-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"><ExternalLink size={20} /> View Live Website</button></div>
        </nav>
        <div className="p-4 border-t border-gray-800"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors"><LogOut size={20} /> Logout</button></div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"><Menu size={24} /></button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize truncate">{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-sm text-gray-500">System Online</span></div>
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 relative group cursor-help"><User size={20} /><div className="absolute top-full right-0 mt-2 bg-black text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">Role: {adminRole === 'superadmin' ? 'Super Admin' : 'Staff'}</div></div>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-gray-500 mb-1">Pending Requests</p><h3 className="text-3xl font-bold text-gray-900">{pendingCount}</h3></div>
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={24} /></div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-gray-500 mb-1">Today's Appts</p><h3 className="text-3xl font-bold text-gray-900">{todayCount}</h3></div>
                    <div className="p-3 bg-gold-100 text-gold-600 rounded-lg"><CalendarIcon size={24} /></div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-gray-500 mb-1">Unread Messages</p><h3 className="text-3xl font-bold text-gray-900">{unreadInquiries}</h3></div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare size={24} /></div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-gray-500 mb-1">Completed Services</p><h3 className="text-3xl font-bold text-gray-900">{completedCount}</h3></div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckSquare size={24} /></div>
                  </div>
               </div>
            </div>

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
                               <button onClick={() => setViewClientHistory(apt.clientName)} className="font-bold text-sm text-gray-900 hover:text-gold-600 hover:underline transition-colors text-left">{apt.clientName}</button>
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
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800 mb-3"><strong>Reminder:</strong> Dr. Tica is out of office on April 20th. Block schedule accordingly.</div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 flex items-center gap-2"><Lock size={14} /> Database management is available in the Settings tab for Administrators.</div>
               </div>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in relative pb-10">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">{currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h2>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                   <button onClick={prevMonth} className="p-2 hover:bg-white rounded-md transition-colors"><ChevronLeft size={20} /></button>
                   <button onClick={goToToday} className="px-4 py-1 text-sm font-bold text-gray-600 hover:text-gray-900">Today</button>
                   <button onClick={nextMonth} className="p-2 hover:bg-white rounded-md transition-colors"><ChevronRight size={20} /></button>
                </div>
             </div>
             <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>))}
                  </div>
                  <div className="grid grid-cols-7 bg-gray-200 gap-px">
                     {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (<div key={`empty-${i}`} className="bg-white min-h-[100px] md:min-h-[120px] p-2 bg-gray-50/30"></div>))}
                     {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => {
                        const dayAppointments = getDailyAppointments(day);
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                        return (
                          <div key={day} onClick={() => handleDayClick(day)} className={`bg-white min-h-[100px] md:min-h-[120px] p-1 md:p-2 hover:bg-gray-50 transition-colors flex flex-col gap-1 group cursor-pointer ${isToday ? 'bg-gold-50/20' : ''}`}>
                             <div className="flex justify-between items-start"><span className={`text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-gold-600 text-white shadow-sm' : 'text-gray-700'}`}>{day}</span>{dayAppointments.length > 0 && (<span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">{dayAppointments.length}</span>)}</div>
                             <div className="space-y-1 overflow-y-auto max-h-[60px] md:max-h-[80px]">{dayAppointments.map(apt => (<div key={apt.id} className={`text-[10px] px-1.5 py-1 rounded border-l-2 truncate transition-transform hover:scale-105 ${apt.status === 'Confirmed' ? 'bg-green-50 border-green-500 text-green-800' : apt.status === 'Pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' : apt.status === 'Completed' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-gray-50 border-gray-400 text-gray-500'}`}><span className="font-bold hidden md:inline">{apt.time}</span> <span className="md:hidden">.</span> {apt.clientName}</div>))}</div>
                          </div>
                        );
                     })}
                  </div>
                </div>
             </div>
          </div>
        )}
        
        {/* Render ViewAppointment Modal with Timestamps */}
        {viewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col animate-slide-in overflow-hidden max-h-[90vh] overflow-y-auto">
             <div className="bg-gray-900 text-white p-6 relative">
                 <h2 className="text-xl font-bold font-serif">Appointment Details</h2>
                 <p className="text-gray-400 text-sm">ID: {viewAppointment.id}</p>
                 <button onClick={() => setViewAppointment(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"><XCircle size={24} /></button>
             </div>
             <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                   <div><p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p><span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(viewAppointment.status)}`}>{viewAppointment.status}</span></div>
                   <div className="text-right"><p className="text-xs text-gray-500 uppercase font-bold mb-1">Date & Time</p><p className="font-medium text-gray-900">{viewAppointment.date}</p><p className="text-sm text-gray-600">{viewAppointment.time}</p></div>
                </div>
                <div className="space-y-4">
                   <div><h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2"><User size={16} className="text-gold-600" /> Client Information</h4><div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100"><p className="font-bold text-gray-800">{viewAppointment.clientName}</p><div className="grid grid-cols-1 gap-1 mt-1 text-gray-600"><div className="flex items-center gap-2"><Phone size={14} /> {viewAppointment.phone}</div><div className="flex items-center gap-2"><Mail size={14} /> {viewAppointment.email}</div></div></div></div>
                   <div><h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2"><CheckSquare size={16} className="text-gold-600" /> Service Details</h4><div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100"><p className="font-medium text-gray-800 mb-1">{viewAppointment.service}</p>{viewAppointment.notes ? (<div className="text-gray-600 text-xs italic bg-white p-2 rounded border border-gray-100 mt-2"><span className="font-bold not-italic text-gold-600 block mb-1">Client Notes:</span>"{viewAppointment.notes}"</div>) : (<p className="text-gray-400 text-xs italic">No additional notes provided.</p>)}</div></div>
                   {/* Database Metadata */}
                   <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                      <span>Created: {viewAppointment.createdAt ? new Date(viewAppointment.createdAt).toLocaleString() : 'N/A'}</span>
                      <span>Updated: {viewAppointment.updatedAt ? new Date(viewAppointment.updatedAt).toLocaleString() : 'N/A'}</span>
                   </div>
                </div>
             </div>
             <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                 {/* ... action buttons ... */}
                 <button onClick={() => setViewAppointment(null)} className="px-4 py-2 border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors">Close</button>
             </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default AdminDashboard;
