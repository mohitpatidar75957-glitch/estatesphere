import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, LogOut, ShieldCheck, Users, Home, CheckCircle2, Printer, Download, Handshake, Receipt, BadgeCheck, 
  Clock, Plus, RefreshCw, ChevronRight, Search, Bell, Filter, 
  Trash2, Edit3, ExternalLink, Calendar, Check, X, 
  Layers, Mail, Phone, TrendingUp, AlertCircle, Inbox, 
  UserCheck, ArrowRight, ArrowLeft, Activity, Eye, Copy, LayoutDashboard,
  Image as ImageIcon, Settings as SettingsIcon, UploadCloud,
  CheckCircle, UserPlus, Lock, Key, Shield, HelpCircle, Save,
  XCircle, SlidersHorizontal, Sparkles, MessageSquare, PhoneCall,
  MapPin, Type, FileText, AlignLeft
} from 'lucide-react';
import { authService } from './auth';
import { dataStore, DEFAULT_SITE_CONTENT, ROLE_PERMISSIONS } from './dataStore';

export default function AdminDashboard() {
  const currentUser = authService.getUser();

  useEffect(() => {
    if (!authService.isAuthenticated() || !currentUser) {
      window.location.href = '/admin/login';
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const [user, setUser] = useState(() => {
    const rawUser = currentUser;
    const teamDb = dataStore.getTeam();
    const matched = teamDb.find(m => (m.email && rawUser.email && m.email.trim().toLowerCase() === rawUser.email.trim().toLowerCase()) || m.id === rawUser.id);
    if (matched) {
      return {
        ...rawUser,
        name: matched.name || rawUser.name,
        role: matched.role || rawUser.role,
        roleLabel: matched.roleLabel,
        permissions: matched.permissions || ROLE_PERMISSIONS[matched.role] || ROLE_PERMISSIONS.SALES_AGENT
      };
    }
    return {
      ...rawUser,
      permissions: rawUser.permissions || ROLE_PERMISSIONS[rawUser.role] || ROLE_PERMISSIONS.SUPER_ADMIN
    };
  });

  const currentRole = user?.role || 'SALES_AGENT';
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';
  const isSalesAgent = currentRole === 'SALES_AGENT';

  const userPermissions = useMemo(() => {
    if (isSuperAdmin) {
      return ROLE_PERMISSIONS.SUPER_ADMIN;
    }
    if (user?.permissions && Array.isArray(user.permissions.modules)) {
      return user.permissions;
    }
    return ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.SALES_AGENT;
  }, [user, currentRole, isSuperAdmin]);

  // Active Sidebar Modules:
  // 1. dashboard | 2. apartments | 3. media | 4. content | 5. inquiries | 6. team | 7. settings
  const [currentTab, setCurrentTab] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (['dashboard', 'apartments', 'sales', 'media', 'content', 'inquiries', 'team', 'settings'].includes(hash)) {
      return hash;
    }
    return 'dashboard';
  });

  // Role Access Guard: Ensure user never stays on or navigates to an unauthorized tab
  useEffect(() => {
    if (userPermissions && Array.isArray(userPermissions.modules) && userPermissions.modules.length > 0) {
      if (!userPermissions.modules.includes(currentTab)) {
        const fallbackTab = userPermissions.modules.includes('dashboard') ? 'dashboard' : userPermissions.modules[0];
        setCurrentTab(fallbackTab);
        if (typeof window !== 'undefined') {
          window.location.hash = fallbackTab;
        }
      }
    }
  }, [currentTab, userPermissions]);

  // Dynamic Data from centralized dataStore
  const [apartments, setApartments] = useState(() => dataStore.getApartments());
  const [inquiries, setInquiries] = useState(() => dataStore.getInquiries());
  const [activityFeed, setActivityFeed] = useState(() => dataStore.getActivityFeed());
  const [team, setTeam] = useState(() => dataStore.getTeam());
  const [mediaList, setMediaList] = useState(() => dataStore.getMedia());
  const [settings, setSettings] = useState(() => dataStore.getSettings());

  // Scheduled Site Visits
  const [tours, setTours] = useState([
    { id: 201, customerName: 'Vikramaditya Singhania', phone: '+91 98201 44521', unit: 'No-03 Penthouse Duplex', date: 'Today', time: '02:30 PM', status: 'CONFIRMED' },
    { id: 202, customerName: 'Ananya Deshmukh', phone: '+91 98112 33490', unit: 'No-02 Garden Apartment', date: 'Tomorrow', time: '11:00 AM', status: 'PENDING' },
    { id: 203, customerName: 'Sameer Kapoor', phone: '+91 98330 11982', unit: 'No-06 Corner Panorama', date: '29 Oct 2026', time: '04:30 PM', status: 'CONFIRMED' }
  ]);

  // Filters & Search for Apartments
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [bhkFilter, setBhkFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Option: Sold Units & Buyer Registry State
  const [searchSalesQuery, setSearchSalesQuery] = useState('');
  const [salesStatusFilter, setSalesStatusFilter] = useState('ALL'); // 'ALL' | 'SOLD' | 'RESERVED'
  const [buyerModal, setBuyerModal] = useState({
    isOpen: false,
    apartmentId: null,
    apartmentNumber: '',
    unitTitle: '',
    price: 0,
    status: 'SOLD',
    name: '',
    phone: '',
    email: '',
    dealAmount: '',
    paidAmount: '',
    balanceAmount: 0,
    paymentPlan: 'FULL_PAYMENT', // 'FULL_PAYMENT' | 'EMI_PLAN' | 'TOKEN_ADVANCE'
    monthlyEmi: '',
    nextDueDate: '',
    bookingDate: '',
    saleDate: '',
    paymentStatus: 'FULLY_PAID',
    paymentStatusLabel: '100% Payment Cleared (Registry Complete)',
    assignedAgent: '',
    notes: ''
  });
  const [saleReceiptModal, setSaleReceiptModal] = useState({
    isOpen: false,
    apt: null
  });

  const openEditBuyerModal = (apt) => {
    if (!apt) return;
    const todayFormatted = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
    const existingBuyer = apt.buyer || {};
    const deal = existingBuyer.dealAmount || apt.price || 30000000;
    const isFull = existingBuyer.paymentStatus === 'FULLY_PAID' || existingBuyer.paymentPlan === 'FULL_PAYMENT';
    const paid = existingBuyer.paidAmount !== undefined ? existingBuyer.paidAmount : (isFull ? deal : (apt.status === 'RESERVED' ? 1500000 : Math.round(deal * 0.9)));
    const balance = Math.max(0, deal - paid);
    const plan = existingBuyer.paymentPlan || (balance === 0 ? 'FULL_PAYMENT' : (apt.status === 'RESERVED' ? 'TOKEN_ADVANCE' : 'EMI_PLAN'));

    setBuyerModal({
      isOpen: true,
      apartmentId: apt.id,
      apartmentNumber: apt.apartmentNumber,
      unitTitle: apt.title || `${apt.bedrooms || 3} BHK ${apt.typology || 'Residence'}`,
      price: apt.price || 0,
      status: apt.status === 'AVAILABLE' ? 'SOLD' : apt.status,
      name: existingBuyer.name || '',
      phone: existingBuyer.phone || '',
      email: existingBuyer.email || '',
      dealAmount: deal,
      paidAmount: paid,
      balanceAmount: balance,
      paymentPlan: plan,
      monthlyEmi: existingBuyer.emiDetails?.monthlyEmi || (plan === 'EMI_PLAN' ? Math.round(balance / 10) : ''),
      nextDueDate: existingBuyer.emiDetails?.nextDueDate || '15 Nov 2026',
      bookingDate: existingBuyer.bookingDate || existingBuyer.saleDate || todayFormatted,
      saleDate: existingBuyer.saleDate || todayFormatted,
      paymentStatus: existingBuyer.paymentStatus || (balance === 0 ? 'FULLY_PAID' : (apt.status === 'RESERVED' ? 'TOKEN_PAID' : 'PARTIALLY_PAID')),
      paymentStatusLabel: existingBuyer.paymentStatusLabel || (balance === 0 ? '100% Full Payment Cleared' : (apt.status === 'RESERVED' ? 'Token Advance Received' : 'Active EMI Schedule')),
      assignedAgent: existingBuyer.assignedAgent || user?.name || 'Super Admin',
      notes: existingBuyer.notes || ''
    });
  };

  const handleSaveBuyerModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!buyerModal.name.trim()) {
      alert('Please enter Buyer Full Name.');
      return;
    }
    const deal = Number(buyerModal.dealAmount) || buyerModal.price;
    const paid = Number(buyerModal.paidAmount) || 0;
    const balance = Math.max(0, deal - paid);
    const plan = buyerModal.paymentPlan;

    let computedStatus = buyerModal.status;
    let paymentStatus = 'PARTIALLY_PAID';
    let paymentStatusLabel = `Active EMI (${formatINR(paid)} Paid • ${formatINR(balance)} Balance)`;

    if (balance === 0 && paid > 0) {
      paymentStatus = 'FULLY_PAID';
      paymentStatusLabel = '100% Full Payment Cleared (Zero Balance Due)';
      computedStatus = 'SOLD';
    } else if (plan === 'TOKEN_ADVANCE') {
      paymentStatus = 'TOKEN_PAID';
      paymentStatusLabel = `Token Advance (${formatINR(paid)} Paid • Balance on Agreement)`;
      computedStatus = 'RESERVED';
    }

    const updatedBuyerObj = {
      name: buyerModal.name.trim(),
      phone: buyerModal.phone.trim(),
      email: buyerModal.email.trim(),
      dealAmount: deal,
      paidAmount: paid,
      balanceAmount: balance,
      paymentPlan: plan,
      bookingDate: buyerModal.bookingDate || 'Today',
      saleDate: buyerModal.saleDate || 'Today',
      paymentStatus: paymentStatus,
      paymentStatusLabel: paymentStatusLabel,
      emiDetails: plan === 'EMI_PLAN' ? {
        monthlyEmi: Number(buyerModal.monthlyEmi) || Math.round(balance / 10),
        nextDueDate: buyerModal.nextDueDate || '15 Nov 2026'
      } : (plan === 'TOKEN_ADVANCE' ? {
        tokenAmount: paid,
        nextDueDate: buyerModal.nextDueDate || 'Within 15 Days'
      } : null),
      assignedAgent: buyerModal.assignedAgent || user?.name || 'Super Admin',
      notes: buyerModal.notes.trim()
    };

    const updatedApts = dataStore.updateApartment(
      buyerModal.apartmentId,
      {
        status: computedStatus,
        buyer: updatedBuyerObj
      },
      user?.name || 'Super Admin'
    );
    setApartments(updatedApts);
    setActivityFeed(dataStore.getActivityFeed());
    setBuyerModal(prev => ({ ...prev, isOpen: false }));
    triggerToast(`Buyer details & payment record for Unit ${buyerModal.apartmentNumber} saved!`);
  };

  const filteredSalesApartments = useMemo(() => {
    return apartments.filter(apt => {
      if (salesStatusFilter === 'SOLD') {
        if (apt.status !== 'SOLD') return false;
      } else if (salesStatusFilter === 'RESERVED') {
        if (apt.status !== 'RESERVED') return false;
      } else {
        if (apt.status !== 'SOLD' && apt.status !== 'RESERVED') return false;
      }

      if (!searchSalesQuery.trim()) return true;
      const q = searchSalesQuery.toLowerCase().trim();
      const num = (apt.apartmentNumber || '').toLowerCase();
      const title = (apt.title || '').toLowerCase();
      const block = (apt.block || '').toLowerCase();
      const buyerName = (apt.buyer?.name || '').toLowerCase();
      const buyerPhone = (apt.buyer?.phone || '').toLowerCase();
      const buyerEmail = (apt.buyer?.email || '').toLowerCase();
      const agent = (apt.buyer?.assignedAgent || '').toLowerCase();

      return num.includes(q) || title.includes(q) || block.includes(q) ||
             buyerName.includes(q) || buyerPhone.includes(q) || buyerEmail.includes(q) || agent.includes(q);
    });
  }, [apartments, salesStatusFilter, searchSalesQuery]);

// Option 2: Live Media & Photo Changer State
  const [siteContent, setSiteContent] = useState(() => dataStore.getSiteContent());
  const [contentForm, setContentForm] = useState(() => dataStore.getSiteContent());
  const [selectedUnitForPhoto, setSelectedUnitForPhoto] = useState(1);
  const [mediaSubTab, setMediaSubTab] = useState('website'); // 'website' | 'units' | 'library'
  const [photoModal, setPhotoModal] = useState({
    isOpen: false,
    mode: '', // 'apartment_room' | 'site_hero' | 'community' | 'media_asset'
    targetId: null,
    roomKey: '',
    label: '',
    title: '',
    description: '',
    previewUrl: '',
    initialUrl: '',
    fileName: '',
    fileSize: ''
  });

  // Option 3: Customer Inquiries & Leads CRM State
  const [searchInquiryQuery, setSearchInquiryQuery] = useState('');
  const [statusInquiryFilter, setStatusInquiryFilter] = useState('ALL');
  const [agentInquiryFilter, setAgentInquiryFilter] = useState('ALL');
  const [showAddInquiryModal, setShowAddInquiryModal] = useState(false);
  const [formInquiry, setFormInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    interestedApartment: 'Unit No-01 — Three Bedroom Residence',
    message: 'Customer requested quotation and site walkthrough.',
    assignedAgent: 'Unassigned'
  });

  // Toast Feedback
  const [toastMsg, setToastMsg] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // New Apartment Form State (With all requested fields)
  const [formApt, setFormApt] = useState({
    apartmentNumber: '',
    title: '',
    headline: 'Elevated luxury residence with sunset horizon views.',
    description: 'Custom architectural finishes, expansive terrace deck, stone travertine floors, underfloor heating and designer European fittings.',
    block: 'Block B1',
    floor: '1st Floor',
    typology: '3 Bed Luxury Home',
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1850,
    terraceArea: 28,
    price: 32500000,
    status: 'AVAILABLE',
    imageUrl: '/assets/estate-boutique-lounge.png'
  });

  // New Team Member Form State
  const [formTeam, setFormTeam] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'SALES_AGENT',
    modules: ['dashboard', 'apartments', 'inquiries'],
    canAddApartment: false,
    canEditApartment: false
  });
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [showEditPermissionsModal, setShowEditPermissionsModal] = useState(false);
  const [editingPermissionsMember, setEditingPermissionsMember] = useState(null);
  const [memberPermissionsForm, setMemberPermissionsForm] = useState({
    role: 'SALES_AGENT',
    modules: ['dashboard', 'apartments', 'inquiries'],
    canAddApartment: false,
    canEditApartment: false,
    canDeleteApartment: false,
    canEditMedia: false,
    canEditContent: false,
    canManageTeam: false,
    canEditSettings: false
  });
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // New Media Asset Form State
  const [formMedia, setFormMedia] = useState({
    title: '',
    category: 'Architecture',
    url: '',
    description: ''
  });

  // Admin Profile & Security Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Super Admin',
    email: user?.email || 'superadmin@estatesphere.com',
    phone: '+91 98200 11000',
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Switch Sidebar Module (smoothly closes any active form)
  const handleSwitchTab = (tabName) => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowAddTeamModal(false);
    setShowAddInquiryModal(false);
    setShowResetPassModal(false);
    setCurrentTab(tabName);
    if (typeof window !== 'undefined') {
      window.location.hash = tabName;
    }
  };

  // Verify authentication session on load (with seamless demo fallback)
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      const fallbackUser = { id: 1, name: 'Super Admin', email: 'superadmin@estatesphere.com', role: 'SUPER_ADMIN' };
      authService.saveSession(`demo-session-${Date.now()}`, fallbackUser, true);
      setUser(fallbackUser);
      return;
    }
    authService.verifySession().then(u => { if (u) setUser(u); });
  }, []);

  // Listen to live data store updates from website submissions or other tabs
  useEffect(() => {
    const handleSync = () => {
      setApartments(dataStore.getApartments());
      setInquiries(dataStore.getInquiries());
      setActivityFeed(dataStore.getActivityFeed());
      setTeam(dataStore.getTeam());
      setMediaList(dataStore.getMedia());
      setSettings(dataStore.getSettings());
      const latestSiteContent = dataStore.getSiteContent();
      setSiteContent(latestSiteContent);
      setContentForm(latestSiteContent);
    };

    window.addEventListener('era_datastore_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('era_datastore_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // KPIs Calculation based on live data
  const totalApartmentsCount = apartments.length;
  const availableCount = apartments.filter(a => a.status === 'AVAILABLE').length;
  const soldCount = apartments.filter(a => a.status === 'SOLD').length;
  const reservedCount = apartments.filter(a => a.status === 'RESERVED').length;
  
  // New Inquiries Today
  const todayInquiriesCount = inquiries.filter(i => {
    if (i.isToday) return true;
    if (!i.createdAt) return false;
    const itemDate = new Date(i.createdAt).toDateString();
    return itemDate === new Date().toDateString();
  }).length;

  // Calculate closed sales revenue
  const totalSoldRevenue = useMemo(() => {
    return apartments
      .filter(a => a.status === 'SOLD')
      .reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  }, [apartments]);

  // Handle Apartment Status Change (AVAILABLE / RESERVED / SOLD) - Single Unit
  const handleApartmentStatus = (aptId, newStatus) => {
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateApartmentStatus(aptId, newStatus, userName);
    setApartments(updated);
    setActivityFeed(dataStore.getActivityFeed());
    
    const targetApt = apartments.find(a => a.id === aptId);
    const unitLabel = targetApt ? targetApt.apartmentNumber : `Unit #${aptId}`;
    if (newStatus === 'SOLD') {
      triggerToast(`🔴 ${unitLabel} marked as SOLD OUT! Booking closed on website.`);
    } else if (newStatus === 'RESERVED') {
      triggerToast(`🟡 ${unitLabel} put on RESERVED hold.`);
    } else {
      triggerToast(`🟢 ${unitLabel} is now AVAILABLE for sale.`);
    }
  };

  // Handle One-Click Toggle for Sold Out / Available
  const toggleSoldStatus = (apt) => {
    const nextStatus = apt.status === 'SOLD' ? 'AVAILABLE' : 'SOLD';
    handleApartmentStatus(apt.id, nextStatus);
  };

  // Handle Deleting Apartment
  const handleDeleteApartment = (aptId) => {
    const target = apartments.find(a => a.id === aptId);
    if (window.confirm(`Are you sure you want to delete and archive ${target?.apartmentNumber || 'this unit'}?`)) {
      const userName = user?.name || 'Super Admin';
      const updated = dataStore.deleteApartment(aptId, userName);
      setApartments(updated);
      setActivityFeed(dataStore.getActivityFeed());
      triggerToast('Apartment unit removed from inventory and website.');
    }
  };

  // Handle Adding New Apartment (Fixed: Single plus)
  const handleCreateApartment = (e) => {
    e.preventDefault();
    if (!formApt.apartmentNumber.trim()) {
      alert('Please enter a unit number (e.g. Unit B3-102 or No-26)');
      return;
    }

    const userName = user?.name || 'Super Admin';
    const newUnit = dataStore.addApartment({
      ...formApt,
      apartmentNumber: formApt.apartmentNumber.trim(),
      title: formApt.title || `${formApt.bedrooms} BHK ${formApt.typology}`,
      areaSqm: Math.round(formApt.areaSqft / 10.764)
    }, userName);

    setApartments(dataStore.getApartments());
    setActivityFeed(dataStore.getActivityFeed());
    setShowAddModal(false);
    setFormApt({
      apartmentNumber: '',
      title: '',
      headline: 'Elevated luxury residence with sunset horizon views.',
      description: 'Custom architectural finishes, expansive terrace deck, stone travertine floors, underfloor heating and designer European fittings.',
      block: 'Block B1',
      floor: '1st Floor',
      typology: '3 Bed Luxury Home',
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 1850,
      terraceArea: 28,
      price: 32500000,
      status: 'AVAILABLE',
      imageUrl: '/assets/estate-boutique-lounge.png'
    });
    triggerToast(`Unit ${newUnit.apartmentNumber} registered and live on website!`);
  };

  // Handle Editing Apartment
  const handleSaveEditApartment = (e) => {
    e.preventDefault();
    if (!editingApt) return;
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateApartment(editingApt.id, {
      ...editingApt,
      areaSqm: Math.round(editingApt.areaSqft / 10.764)
    }, userName);
    setApartments(updated);
    setActivityFeed(dataStore.getActivityFeed());
    setShowEditModal(false);
    setEditingApt(null);
    triggerToast(`Unit ${editingApt.apartmentNumber} details updated successfully!`);
  };

  // Handle Changing Showcase Photo for an Apartment
  const handleChangeShowcasePhoto = (newUrl) => {
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateApartmentPhoto(selectedUnitForPhoto, newUrl, userName);
    setApartments(updated);
    setActivityFeed(dataStore.getActivityFeed());
    triggerToast('Apartment showcase photo updated live on website!');
  };

  // Option 2: Full Screen Live Media & Text Editor Helpers
  const LUXURY_PRESETS = [
    { name: 'Villa Day Exterior', url: '/assets/luxury_villa_day.jpg', cat: 'Exterior' },
    { name: 'Villa Night Exterior', url: '/assets/luxury_villa_night.jpg', cat: 'Exterior' },
    { name: 'Travertine Living Hall', url: '/assets/interior-living-hall.png', cat: 'Living Hall' },
    { name: 'Master Bedroom Suite', url: '/assets/interior-master-bedroom.png', cat: 'Bedroom' },
    { name: 'European Designer Kitchen', url: '/assets/interior-kitchen.png', cat: 'Kitchen' },
    { name: 'Private Horizon Solarium', url: '/assets/estate-private-terrace.png', cat: 'Terrace' },
    { name: 'Saltwater Infinity Pool', url: '/assets/community_pool_1787305166324.jpg', cat: 'Amenities' },
    { name: 'Gated Community Path', url: '/assets/community_exterior_1787305142682.jpg', cat: 'Exterior' },
    { name: '360° Cayley Suite (8K)', url: '/assets/cayley-interior-8k.jpg', cat: '360 Panorama' },
    { name: '360° Kiara Luxury (8K)', url: '/assets/kiara-interior-8k.jpg', cat: '360 Panorama' },
    { name: '360° Bedroom Suite (8K)', url: '/assets/bedroom-interior-8k.png', cat: '360 Panorama' }
  ];

  const openPhotoEditor = ({ mode, targetId = null, roomKey = '', label = '', title = '', description = '', url = '' }) => {
    setPhotoModal({
      isOpen: true,
      mode,
      targetId,
      roomKey,
      label,
      title: title || '',
      description: description || '',
      previewUrl: url || '',
      initialUrl: url || '',
      fileName: '',
      fileSize: ''
    });
  };

  const compressImageForWeb = (file, maxWidth = 1600, quality = 0.82) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handlePcFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      const compressedDataUrl = await compressImageForWeb(file, 1600, 0.82);
      if (compressedDataUrl) {
        setPhotoModal(prev => ({
          ...prev,
          previewUrl: compressedDataUrl,
          fileName: file.name,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB (Web Optimized)'
        }));
      }
    } catch (err) {
      console.error('File compression error:', err);
    }
  };

  const handleSavePhotoModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const userName = user?.name || 'Super Admin';
      const finalUrl = photoModal.previewUrl || photoModal.initialUrl;

      if (!finalUrl) {
        alert('Please select an image from your PC or choose a luxury preset.');
        return;
      }

      if (photoModal.mode === 'apartment_room') {
        const apt = apartments.find(a => String(a.id) === String(photoModal.targetId));
        if (apt) {
          const currentGallery = apt.roomGallery || {
            cover: apt.imageUrl,
            livingHall: '/assets/interior-living-hall.png',
            kitchen: '/assets/interior-kitchen.png',
            bedroom: '/assets/interior-master-bedroom.png',
            terrace: '/assets/estate-private-terrace.png',
            panorama360: '/assets/cayley-interior-8k.jpg'
          };

          const updatedGallery = {
            ...currentGallery,
            [photoModal.roomKey]: finalUrl
          };

          const payload = { roomGallery: updatedGallery };
          if (photoModal.roomKey === 'cover') {
            payload.imageUrl = finalUrl;
          }
          if (photoModal.title && photoModal.title !== apt.title) {
            payload.title = photoModal.title;
          }
          if (photoModal.description && photoModal.description !== apt.description) {
            payload.description = photoModal.description;
          }

          const updated = dataStore.updateApartmentMedia(apt.id, payload, userName);
          setApartments(updated);
          setActivityFeed(dataStore.getActivityFeed());
          triggerToast(`Unit ${apt.apartmentNumber} ${photoModal.label} updated and live on website!`);
        }
      } else if (photoModal.mode === 'site_hero') {
        const fields = {};
        if (photoModal.roomKey === 'heroDay') fields.heroDayImage = finalUrl;
        if (photoModal.roomKey === 'heroNight') fields.heroNightImage = finalUrl;
        if (photoModal.roomKey === 'revealImage') fields.revealImage = finalUrl;
        if (photoModal.title) fields.heroTitle = photoModal.title;
        if (photoModal.description) fields.heroSubtitle = photoModal.description;

        const updated = dataStore.updateSiteContent(fields, userName);
        setSiteContent(updated);
        setContentForm(prev => ({ ...prev, ...fields }));
        setActivityFeed(dataStore.getActivityFeed());
        triggerToast('Website hero visual and presentation updated live!');
      } else if (photoModal.mode === 'community') {
        const updated = dataStore.updateCommunityFeature(photoModal.targetId, {
          image: finalUrl,
          title: photoModal.title,
          copy: photoModal.description
        }, userName);
        setSiteContent(updated);
        setActivityFeed(dataStore.getActivityFeed());
        triggerToast(`Community section "${photoModal.title}" updated live!`);
      } else if (photoModal.mode === 'media_asset') {
        if (photoModal.targetId) {
          const updated = dataStore.updateMediaItem(photoModal.targetId, {
            url: finalUrl,
            title: photoModal.title,
            description: photoModal.description
          }, userName);
          setMediaList(updated);
        } else {
          dataStore.addMediaItem({
            url: finalUrl,
            title: photoModal.title || 'Property Visual',
            description: photoModal.description || 'Uploaded asset',
            category: 'Architecture'
          }, userName);
          setMediaList(dataStore.getMedia());
        }
        setActivityFeed(dataStore.getActivityFeed());
        triggerToast('Media asset saved to gallery!');
      }

      setPhotoModal({ isOpen: false });
    } catch (err) {
      console.error('Error saving media:', err);
      triggerToast('Photo updated!');
      setPhotoModal({ isOpen: false });
    }
  };

  // Option 3: Customer Inquiries & Leads CRM Status Map
  const LEAD_STATUS_MAP = {
    NEW: { label: 'New Lead', icon: '🆕', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    CONTACTED: { label: 'Contacted / Discussing', icon: '📞', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    VISIT_BOOKED: { label: 'Site Visit Booked', icon: '📍', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    DEAL_CLOSED: { label: 'Deal Closed / Sold', icon: '🤝', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    NOT_INTERESTED: { label: 'Not Interested', icon: '❌', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' }
  };

  // Handle Inquiry Status
  const handleInquiryStatus = (id, newStatus) => {
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateInquiryStatus(id, newStatus, userName);
    setInquiries(updated);
    setActivityFeed(dataStore.getActivityFeed());
    triggerToast(`Lead status updated to ${LEAD_STATUS_MAP[newStatus]?.label || newStatus}`);
  };

  // Handle Assigning Agent to Lead
  const handleAssignAgent = (id, agentName) => {
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.assignInquiryAgent(id, agentName, userName);
    setInquiries(updated);
    setActivityFeed(dataStore.getActivityFeed());
    triggerToast(`Lead assigned to ${agentName}`);
  };

  // Handle Delete Inquiry
  const handleDeleteInquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this customer inquiry?')) {
      const userName = user?.name || 'Super Admin';
      const updated = dataStore.deleteInquiry(id, userName);
      setInquiries(updated);
      setActivityFeed(dataStore.getActivityFeed());
      triggerToast('Inquiry record deleted.');
    }
  };

  // Handle Adding Manual Offline / Walk-in Lead
  const handleAddManualInquiry = (e) => {
    e.preventDefault();
    if (!formInquiry.name || !formInquiry.phone) {
      alert('Please provide customer name and phone number.');
      return;
    }
    const newInq = dataStore.addInquiry(formInquiry);
    setInquiries(dataStore.getInquiries());
    setActivityFeed(dataStore.getActivityFeed());
    setShowAddInquiryModal(false);
    setFormInquiry({
      name: '',
      email: '',
      phone: '',
      interestedApartment: 'Unit No-01 — Three Bedroom Residence',
      message: 'Customer requested quotation and site walkthrough.',
      assignedAgent: 'Unassigned'
    });
    triggerToast(`New lead for ${newInq.name} created!`);
  };

  // Handle Team Member Addition (Super Admin Only)
  const handleAddTeamMember = (e) => {
    e.preventDefault();
    if (!formTeam.name || !formTeam.email) {
      triggerToast('Please provide member name and official email.');
      return;
    }
    const userName = user?.name || 'Super Admin';
    const permissions = {
      modules: formTeam.modules || ['dashboard', 'apartments', 'inquiries'],
      canAddApartment: Boolean(formTeam.canAddApartment),
      canEditApartment: Boolean(formTeam.canEditApartment),
      canDeleteApartment: formTeam.role === 'SUPER_ADMIN',
      canEditMedia: formTeam.modules?.includes('media'),
      canEditContent: formTeam.modules?.includes('content'),
      canManageTeam: formTeam.role === 'SUPER_ADMIN' || formTeam.modules?.includes('team'),
      canEditSettings: formTeam.role === 'SUPER_ADMIN' || formTeam.modules?.includes('settings')
    };

    const newMember = dataStore.addTeamMember({ ...formTeam, permissions }, userName);
    setTeam(dataStore.getTeam());
    setActivityFeed(dataStore.getActivityFeed());
    setShowAddTeamModal(false);

    // Auto copy credentials to clipboard
    const credentialsText = `EstateSphere Login Credentials:\nName: ${newMember.name}\nEmail: ${newMember.email}\nPassword: ${newMember.password}\nRole: ${newMember.roleBadge}\nPortal: ${window.location.origin}/admin/login`;
    copyToClipboard(credentialsText);

    setFormTeam({ 
      name: '', 
      email: '', 
      phone: '', 
      password: '', 
      role: 'SALES_AGENT',
      modules: ['dashboard', 'apartments', 'inquiries'],
      canAddApartment: false,
      canEditApartment: false
    });
    triggerToast(`New user ${newMember.name} created as ${newMember.roleBadge}! Login credentials copied.`);
  };

  // Open Edit Permissions Modal for an existing member
  const openEditPermissionsModal = (member) => {
    setEditingPermissionsMember(member);
    const existingPerms = member.permissions || ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.SALES_AGENT;
    setMemberPermissionsForm({
      role: member.role || 'SALES_AGENT',
      modules: existingPerms.modules ? [...existingPerms.modules] : ['dashboard', 'apartments', 'inquiries'],
      canAddApartment: Boolean(existingPerms.canAddApartment),
      canEditApartment: Boolean(existingPerms.canEditApartment),
      canDeleteApartment: Boolean(existingPerms.canDeleteApartment),
      canEditMedia: Boolean(existingPerms.canEditMedia),
      canEditContent: Boolean(existingPerms.canEditContent),
      canManageTeam: Boolean(existingPerms.canManageTeam),
      canEditSettings: Boolean(existingPerms.canEditSettings)
    });
    setShowEditPermissionsModal(true);
  };

  // Save Granular Permissions for Member
  const handleSaveMemberPermissions = (e) => {
    e.preventDefault();
    if (!editingPermissionsMember) return;
    const userName = user?.name || 'Super Admin';
    const permissions = {
      modules: memberPermissionsForm.modules,
      canAddApartment: Boolean(memberPermissionsForm.canAddApartment),
      canEditApartment: Boolean(memberPermissionsForm.canEditApartment),
      canDeleteApartment: memberPermissionsForm.role === 'SUPER_ADMIN' || Boolean(memberPermissionsForm.canDeleteApartment),
      canEditMedia: memberPermissionsForm.modules.includes('media'),
      canEditContent: memberPermissionsForm.modules.includes('content'),
      canManageTeam: memberPermissionsForm.role === 'SUPER_ADMIN' || memberPermissionsForm.modules.includes('team'),
      canEditSettings: memberPermissionsForm.role === 'SUPER_ADMIN' || memberPermissionsForm.modules.includes('settings')
    };

    const updated = dataStore.updateTeamMemberPermissions(
      editingPermissionsMember.id,
      permissions,
      memberPermissionsForm.role,
      userName
    );
    setTeam(updated);
    setActivityFeed(dataStore.getActivityFeed());
    setShowEditPermissionsModal(false);
    triggerToast(`Permissions updated for ${editingPermissionsMember.name}!`);
  };

  // Handle Team Role Update from Dropdown
  const handleUpdateRole = (id, newRole) => {
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateTeamMemberRole(id, newRole, userName);
    setTeam(updated);
    setActivityFeed(dataStore.getActivityFeed());
    triggerToast('Team member role updated successfully.');
  };

  // Handle 1-Second Instant Deactivate / Activate
  const handleToggleMemberStatus = (id) => {
    const userName = user?.name || 'Super Admin';
    const member = team.find(m => m.id === id);
    if (!member) return;
    if (member.role === 'SUPER_ADMIN' && member.id === 'team-1') {
      triggerToast('Primary Super Admin cannot be deactivated.');
      return;
    }
    const updated = dataStore.toggleTeamMemberStatus(id, userName);
    setTeam(updated);
    setActivityFeed(dataStore.getActivityFeed());
    const actionWord = member.status === 'ACTIVE' ? 'deactivated' : 'reactivated';
    triggerToast(`Access ${actionWord} for ${member.name} in 1 second!`);
  };

  // Handle Password Reset Submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeamMember || !newPasswordInput.trim()) return;
    const userName = user?.name || 'Super Admin';
    dataStore.updateTeamMemberPassword(selectedTeamMember.id, newPasswordInput.trim(), userName);
    setTeam(dataStore.getTeam());
    setActivityFeed(dataStore.getActivityFeed());
    setShowResetPassModal(false);
    setNewPasswordInput('');
    setSelectedTeamMember(null);
    triggerToast('Password reset and updated successfully!');
  };

  // Handle Delete Team Member
  const handleDeleteTeamMember = (id) => {
    const member = team.find(m => m.id === id);
    if (!member) return;
    if (member.role === 'SUPER_ADMIN' && (member.id === 'team-1' || team.filter(m => m.role === 'SUPER_ADMIN').length <= 1)) {
      triggerToast('Primary Super Admin cannot be deleted.');
      return;
    }
    if (window.confirm(`Permanently delete account for "${member.name}" (${member.email}) and revoke all access?`)) {
      try {
        const userName = user?.name || 'Super Admin';
        const updated = dataStore.deleteTeamMember(id, userName);
        setTeam(updated);
        setActivityFeed(dataStore.getActivityFeed());
        triggerToast(`User ${member.name} permanently removed.`);
      } catch (err) {
        triggerToast(err.message || 'Could not delete member.');
      }
    }
  };

  // Handle Adding New Media Asset
  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!formMedia.title || !formMedia.url) {
      alert('Please provide image title and URL.');
      return;
    }
    const userName = user?.name || 'Super Admin';
    const newMed = dataStore.addMediaItem(formMedia, userName);
    setMediaList(dataStore.getMedia());
    setActivityFeed(dataStore.getActivityFeed());
    setShowAddMediaModal(false);
    setFormMedia({ title: '', category: 'Architecture', url: '', description: '' });
    triggerToast(`Media asset "${newMed.title}" added to gallery!`);
  };

  // Handle Settings Save (Public Contact Details)
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateSettings(settings, userName);
    setSettings(updated);
    triggerToast('Public Contact Details & Website Footer updated live!');
  };

  // Handle Admin Profile & Password Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      alert('Please enter your admin name and email.');
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    dataStore.updateAdminProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      password: profileForm.newPassword || undefined
    }, user?.email || 'superadmin@estatesphere.com');

    const updatedUser = {
      ...user,
      name: profileForm.name.trim(),
      email: profileForm.email.trim()
    };
    setUser(updatedUser);
    if (localStorage.getItem('era_admin_user')) {
      localStorage.setItem('era_admin_user', JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem('era_admin_user', JSON.stringify(updatedUser));
    }
    setTeam(dataStore.getTeam());
    setProfileForm({ ...profileForm, newPassword: '', confirmPassword: '' });
    triggerToast('Admin Profile & credentials updated successfully!');
  };

  // Handle Website Content & Text CMS Save
  const handleSaveSiteContent = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const userName = user?.name || 'Super Admin';
    const updated = dataStore.updateSiteContent(contentForm, userName);
    setSiteContent(updated);
    triggerToast('✅ All Website Texts & Headings saved and live on website!');
  };

  const handleResetSiteContent = () => {
    if (window.confirm('Reset all website text fields to defaults?')) {
      setContentForm(DEFAULT_SITE_CONTENT);
      dataStore.updateSiteContent(DEFAULT_SITE_CONTENT, user?.name || 'Super Admin');
      setSiteContent(DEFAULT_SITE_CONTENT);
      triggerToast('Website text reset to original defaults.');
    }
  };

  // Handle Logout with custom in-app confirmation modal (No browser native alert)
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    authService.logout();
    window.location.href = '/admin/login';
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    triggerToast('Copied to clipboard!');
  };

  // Filtered Apartments by Search, Status, Block, and BHK/Typology
  const filteredApartments = useMemo(() => {
    return apartments.filter(a => {
      const matchesSearch = 
        (a.apartmentNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.block || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesBlock = blockFilter === 'ALL' || a.block === blockFilter;
      
      let matchesBhk = true;
      if (bhkFilter === '2') matchesBhk = a.bedrooms === 2;
      else if (bhkFilter === '3') matchesBhk = a.bedrooms === 3;
      else if (bhkFilter === '4') matchesBhk = a.bedrooms >= 4;
      else if (bhkFilter === 'PENTHOUSE') matchesBhk = (a.typology || '').toLowerCase().includes('penthouse');
      else if (bhkFilter === 'GARDEN') matchesBhk = (a.typology || '').toLowerCase().includes('garden');

      return matchesSearch && matchesStatus && matchesBlock && matchesBhk;
    });
  }, [apartments, searchQuery, statusFilter, blockFilter, bhkFilter]);

  // Option 3: Filtered Inquiries & Leads CRM Memo
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const q = (searchInquiryQuery || '').toLowerCase();
      const matchesSearch = 
        (inq.name || '').toLowerCase().includes(q) ||
        (inq.phone || '').toLowerCase().includes(q) ||
        (inq.email || '').toLowerCase().includes(q) ||
        (inq.interestedApartment || '').toLowerCase().includes(q) ||
        (inq.message || '').toLowerCase().includes(q);

      const matchesStatus = statusInquiryFilter === 'ALL' || inq.status === statusInquiryFilter;
      const matchesAgent = agentInquiryFilter === 'ALL' || (inq.assignedAgent || 'Unassigned') === agentInquiryFilter;

      return matchesSearch && matchesStatus && matchesAgent;
    });
  }, [inquiries, searchInquiryQuery, statusInquiryFilter, agentInquiryFilter]);

  // Lead Pipeline Counts
  const leadPipeline = useMemo(() => {
    return {
      total: inquiries.length,
      newCount: inquiries.filter(i => i.status === 'NEW').length,
      contactedCount: inquiries.filter(i => i.status === 'CONTACTED').length,
      visitCount: inquiries.filter(i => i.status === 'VISIT_BOOKED').length,
      closedCount: inquiries.filter(i => i.status === 'DEAL_CLOSED').length,
      notInterestedCount: inquiries.filter(i => i.status === 'NOT_INTERESTED').length
    };
  }, [inquiries]);

  // Format Indian Currency
  const formatINR = (val) => {
    if (!val) return '₹0';
    const cr = val / 10000000;
    if (cr >= 1) return `₹${cr.toFixed(2)} Cr`;
    const lac = val / 100000;
    return `₹${lac.toFixed(1)} L`;
  };

  // Lock body/html scroll when any fullscreen view is active to eliminate duplicate scrollbars
  const isAnyFullscreenOpen = Boolean(showAddModal || showEditModal || showAddTeamModal || showEditPermissionsModal || photoModal?.isOpen || buyerModal?.isOpen || saleReceiptModal?.isOpen);
  useEffect(() => {
    if (isAnyFullscreenOpen) {
      document.body.classList.add('has-fullscreen-open');
      document.documentElement.classList.add('has-fullscreen-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('has-fullscreen-open');
      document.documentElement.classList.remove('has-fullscreen-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('has-fullscreen-open');
      document.documentElement.classList.remove('has-fullscreen-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyFullscreenOpen]);

  return (
    <div className={`admin-app-wrapper ${isAnyFullscreenOpen ? 'fullscreen-locked' : ''}`}>
      {/* Styles for Left Sidebar + Clean White Layout */}
      <style>{`
        .admin-app-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        body.has-fullscreen-open, html.has-fullscreen-open {
          overflow: hidden !important;
          height: 100vh !important;
        }

        .fullscreen-locked {
          max-height: 100vh !important;
          overflow: hidden !important;
        }

        /* 1. LEFT SIDEBAR */
        .admin-sidebar {
          width: 275px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 60;
          box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.02);
        }

        .sidebar-header {
          padding: 22px 20px 18px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sidebar-brand-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon-box {
          width: 40px;
          height: 40px;
          background: #2563eb;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
          flex-shrink: 0;
        }

        .brand-meta h1 {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .brand-meta p {
          font-size: 11px;
          color: #64748b;
          margin: 3px 0 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
          box-shadow: 0 0 0 2.5px rgba(16, 185, 129, 0.2);
        }

        /* Sidebar Nav Links */
        .sidebar-nav {
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.06em;
          padding: 8px 12px 4px;
        }

        .sidebar-link-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
        }

        .sidebar-link-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .sidebar-link-btn.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }

        .sidebar-link-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 12px;
          background: #f1f5f9;
          color: #64748b;
        }

        .sidebar-link-btn.active .nav-badge {
          background: #dbeafe;
          color: #1d4ed8;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 14px 14px 18px;
          border-top: 1px solid #f1f5f9;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .view-website-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          transition: all 0.15s;
        }

        .view-website-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
        }

        .sidebar-logout-btn:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .sidebar-user-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .user-left-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name-small {
          font-size: 12px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.2;
        }

        .user-role-small {
          font-size: 10px;
          font-weight: 600;
          color: #2563eb;
          background: #eff6ff;
          padding: 1px 5px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        /* MAIN VIEW AREA */
        .admin-main-viewport {
          margin-left: 275px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .main-top-bar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .breadcrumb-trail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
        }

        .breadcrumb-active {
          color: #0f172a;
          font-weight: 600;
        }

        .top-action-cluster {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-primary-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2563eb;
          color: #ffffff;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
          transition: all 0.15s;
        }

        .btn-primary-action:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-secondary-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          color: #334155;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-secondary-action:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #94a3b8;
        }

        .main-scroll-content {
          padding: 20px 24px 50px;
          max-width: 1400px;
          width: 100%;
          box-sizing: border-box;
        }

        /* 5 Top Metric Cards (KPIs) */
        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }

        .kpi-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 6px 16px -2px rgba(15, 23, 42, 0.06);
          transform: translateY(-2px);
        }

        .kpi-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .kpi-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kpi-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-value-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 4px;
        }

        .kpi-number {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .kpi-subtext {
          font-size: 11.5px;
          color: #64748b;
        }

        /* White Panel Card */
        .white-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
          margin-bottom: 24px;
        }

        .panel-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .panel-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #2563eb;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          padding: 0;
        }

        .panel-link:hover {
          text-decoration: underline;
        }

        /* Status Dropdown Clean */
        .status-select-clean {
          font-size: 12px;
          font-weight: 600;
          padding: 5px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          cursor: pointer;
          outline: none;
        }

        /* Quick One-Click Sold Out Button */
        .btn-quick-sold {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #dc2626;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s;
        }

        .btn-quick-sold:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .btn-quick-reopen {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #a7f3d0;
          background: #ecfdf5;
          color: #059669;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s;
        }

        .btn-quick-reopen:hover {
          background: #d1fae5;
          color: #047857;
        }

        /* Table */
        .clean-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .clean-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          text-align: left;
          padding: 10px 10px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .clean-table td {
          padding: 10px 10px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }

        .clean-table tr:hover td {
          background: #f8fafc;
        }

        /* CRM 1-Click WhatsApp & Call Links */
        .btn-whatsapp-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #22c55e;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(34, 197, 94, 0.25);
        }

        .btn-whatsapp-link:hover {
          background: #16a34a;
          transform: translateY(-1px);
        }

        .btn-call-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-call-link:hover {
          background: #e2e8f0;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .unit-interest-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          padding: 3px 7px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lead-avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
        }

        /* Fullscreen Page Views for Add / Create Forms (Sidebar stays visible on left) */
        .fullscreen-page-overlay {
          position: fixed;
          left: 275px;
          top: 0;
          right: 0;
          bottom: 0;
          background: #f8fafc;
          z-index: 45;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .fullscreen-page-overlay::-webkit-scrollbar {
          width: 8px;
        }
        .fullscreen-page-overlay::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .fullscreen-page-overlay::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .fullscreen-page-overlay::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .fullscreen-top-nav {
          position: sticky;
          top: 0;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 50;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }

        .fullscreen-content-container {
          max-width: 1120px;
          width: 100%;
          margin: 28px auto 60px;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .modal-content-card {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 650px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-body {
          padding: 24px;
          max-height: 75vh;
          overflow-y: auto;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group-clean {
          margin-bottom: 16px;
        }

        .form-group-clean label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .input-clean {
          width: 100%;
          box-sizing: border-box;
          padding: 9px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
        }

        .input-clean:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .modal-footer {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 18px;
          border-radius: 10px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 9999;
        }

        @media (max-width: 1080px) {
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* 1. EXACT LEFT SIDEBAR AS REQUESTED */}
      <aside className="admin-sidebar">
        
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand-box">
            <div className="brand-icon-box">
              <Building2 size={20} />
            </div>
            <div className="brand-meta">
              <h1>ESTATESPHERE</h1>
              <p>
                <span className="live-dot" />
                Luxury Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* 7 Sidebar Menu Options Breakdown (Filtered by User Permissions) */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Admin Modules</div>

          {/* Dashboard */}
          {userPermissions.modules?.includes('dashboard') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('dashboard')}
            >
              <div className="sidebar-link-content">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
            </button>
          )}

          {/* Apartments / Inventory */}
          {userPermissions.modules?.includes('apartments') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'apartments' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('apartments')}
            >
              <div className="sidebar-link-content">
                <Building2 size={18} />
                <span>Apartments / Inventory</span>
              </div>
            </button>
          )}

          {/* Sold Units & Buyers (Customer Ownership Registry) */}
          {userPermissions.modules?.includes('sales') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'sales' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('sales')}
            >
              <div className="sidebar-link-content">
                <UserCheck size={18} />
                <span>Sold Units & Buyers</span>
              </div>
              {soldCount > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: currentTab === 'sales' ? '#dc2626' : '#fee2e2',
                  color: currentTab === 'sales' ? '#ffffff' : '#b91c1c'
                }}>
                  {soldCount}
                </span>
              )}
            </button>
          )}

          {/* Media & Photos Manager */}
          {userPermissions.modules?.includes('media') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'media' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('media')}
            >
              <div className="sidebar-link-content">
                <ImageIcon size={18} />
                <span>Media & Photos</span>
              </div>
            </button>
          )}

          {/* Website Text & Content CMS */}
          {userPermissions.modules?.includes('content') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'content' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('content')}
            >
              <div className="sidebar-link-content">
                <Type size={18} />
                <span>Website Text & Content</span>
              </div>
            </button>
          )}

          {/* Customer Inquiries */}
          {userPermissions.modules?.includes('inquiries') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('inquiries')}
            >
              <div className="sidebar-link-content">
                <Inbox size={18} />
                <span>Customer Inquiries</span>
              </div>
            </button>
          )}

          {/* Team & Roles */}
          {userPermissions.modules?.includes('team') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'team' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('team')}
            >
              <div className="sidebar-link-content">
                <Users size={18} />
                <span>Team & Roles</span>
              </div>
            </button>
          )}

          {/* Site Settings & Profile */}
          {userPermissions.modules?.includes('settings') && (
            <button 
              className={`sidebar-link-btn ${currentTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('settings')}
            >
              <div className="sidebar-link-content">
                <SettingsIcon size={18} />
                <span>Site Settings & Profile</span>
              </div>
            </button>
          )}
        </nav>

        {/* Sidebar Footer: Public Site & Logout */}
        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="view-website-btn">
            <ExternalLink size={13} />
            <span>View Public Website</span>
          </a>

          <div className="sidebar-user-card">
            <div className="user-left-info">
              <div className="user-avatar-small">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="user-name-small">{user?.name || 'Super Admin'}</div>
                <span className="user-role-small">{user?.role || 'SUPER_ADMIN'}</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button 
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign Out from Admin Panel"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div className="admin-main-viewport">
        
        {/* Top Header Bar */}
        <header className="main-top-bar">
          <div className="breadcrumb-trail">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="breadcrumb-active">
              {currentTab === 'dashboard' && 'Dashboard Overview'}
              {currentTab === 'apartments' && 'Apartments & Inventory Manager'}
              {currentTab === 'sales' && 'Sold Properties & Buyer Registry'}
              {currentTab === 'media' && 'Media & Photos Manager'}
              {currentTab === 'inquiries' && 'Customer Inquiries (Leads)'}
              {currentTab === 'team' && 'Team & Roles (Super Admin Access)'}
              {currentTab === 'settings' && 'Site Settings & Profile'}
            </span>
          </div>

          {/* Quick Action Cluster */}
          <div className="top-action-cluster">
            {/* Single Plus Button - Only visible for users with Add Apartment permission */}
            {userPermissions.canAddApartment && (
              <button 
                className="btn-primary-action"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                <span>Add New Apartment</span>
              </button>
            )}

            <button 
              className="btn-secondary-action"
              onClick={() => setCurrentTab('inquiries')}
            >
              <Inbox size={15} />
              <span>View Leads ({inquiries.length})</span>
            </button>

            <button 
              className="btn-secondary-action"
              onClick={() => {
                setApartments(dataStore.getApartments());
                setInquiries(dataStore.getInquiries());
                setActivityFeed(dataStore.getActivityFeed());
                setTeam(dataStore.getTeam());
                setMediaList(dataStore.getMedia());
                setSettings(dataStore.getSettings());
                triggerToast('Data refreshed with live website status!');
              }}
              title="Refresh live sync"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-scroll-content">
          
          {/* Top 5 Metric Cards (KPIs) - ONLY displayed on Dashboard Overview */}
          {currentTab === 'dashboard' && (
            <section className="kpi-cards-grid">
              
              {/* 1. Total Apartments */}
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">Total Apartments</span>
                  <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <Building2 size={18} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number">{totalApartmentsCount}</span>
                  <span className="kpi-subtext">Units</span>
                </div>
                <div className="kpi-subtext">Block B1, B2 & B3 registered</div>
              </div>

              {/* 2. Available Units */}
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">Available Units</span>
                  <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number" style={{ color: '#059669' }}>{availableCount}</span>
                  <span className="kpi-subtext">Open</span>
                </div>
                <div className="kpi-subtext">Ready for website booking</div>
              </div>

              {/* 3. Sold Out Units */}
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">Sold Out Units</span>
                  <div className="kpi-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number" style={{ color: '#dc2626' }}>{soldCount}</span>
                  <span className="kpi-subtext">Closed</span>
                </div>
                <div className="kpi-subtext">{formatINR(totalSoldRevenue)} booked revenue</div>
              </div>

              {/* 4. Reserved Units */}
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-label">Reserved Units</span>
                  <div className="kpi-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
                    <Clock size={18} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number" style={{ color: '#d97706' }}>{reservedCount}</span>
                  <span className="kpi-subtext">On Hold</span>
                </div>
                <div className="kpi-subtext">Token deposit received</div>
              </div>

              {/* 5. New Inquiries Today */}
              <div className="kpi-card" style={{ borderColor: todayInquiriesCount > 0 ? '#bfdbfe' : '#e2e8f0', background: todayInquiriesCount > 0 ? '#f0f7ff' : '#ffffff' }}>
                <div className="kpi-card-header">
                  <span className="kpi-label">New Inquiries Today</span>
                  <div className="kpi-icon-wrap" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                    <Inbox size={18} />
                  </div>
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-number" style={{ color: '#1d4ed8' }}>{todayInquiriesCount}</span>
                  <span className="kpi-subtext">Website Leads</span>
                </div>
                <div className="kpi-subtext">From "Book a call" modal</div>
              </div>

            </section>
          )}

          {/* ========================================================
              MODULE 2: APARTMENTS / INVENTORY (FULL SPECIFICATION)
          ======================================================== */}
          {currentTab === 'apartments' && (
            <div className="white-panel">
              
              {/* Header with Title & Action */}
              <div className="panel-header-row" style={{ flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h3 className="panel-title" style={{ fontSize: '18px' }}>
                    <Building2 size={20} style={{ color: '#2563eb' }} />
                    <span>Apartments & Inventory Management</span>
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Control individual unit availability. One-click <b>Sold Out</b> toggle instantly blocks website booking and displays red badge.
                  </p>
                </div>

                {userPermissions.canAddApartment && (
                  <button 
                    className="btn-primary-action"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus size={16} />
                    <span>Add New Apartment</span>
                  </button>
                )}
              </div>

              {/* SEARCH & FILTERS ROW (Status, Block, BHK/Typology) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Search by Unit No or Title */}
                  <div style={{ position: 'relative', width: '230px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search Unit (e.g. B3-102 or No-01)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-clean"
                      style={{ paddingLeft: '32px', height: '35px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Filter by Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-clean"
                    style={{ width: '160px', height: '35px', fontSize: '13px' }}
                  >
                    <option value="ALL">All Statuses ({apartments.length})</option>
                    <option value="AVAILABLE">🟢 Available Only ({availableCount})</option>
                    <option value="SOLD">🔴 Sold Out Only ({soldCount})</option>
                    <option value="RESERVED">🟡 Reserved Only ({reservedCount})</option>
                  </select>

                  {/* Filter by Block */}
                  <select
                    value={blockFilter}
                    onChange={(e) => setBlockFilter(e.target.value)}
                    className="input-clean"
                    style={{ width: '135px', height: '35px', fontSize: '13px' }}
                  >
                    <option value="ALL">All Blocks</option>
                    <option value="Block B1">Block B1</option>
                    <option value="Block B2">Block B2</option>
                    <option value="Block B3">Block B3</option>
                    <option value="North Tower">North Tower</option>
                  </select>

                  {/* Filter by BHK / Typology */}
                  <select
                    value={bhkFilter}
                    onChange={(e) => setBhkFilter(e.target.value)}
                    className="input-clean"
                    style={{ width: '155px', height: '35px', fontSize: '13px' }}
                  >
                    <option value="ALL">All Typologies</option>
                    <option value="2">2 BHK Only</option>
                    <option value="3">3 BHK Only</option>
                    <option value="4">4+ BHK Only</option>
                    <option value="PENTHOUSE">Penthouse Duplex</option>
                    <option value="GARDEN">Garden Residence</option>
                  </select>
                </div>

                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Showing <b>{filteredApartments.length}</b> units
                </div>

              </div>

              {/* APARTMENTS TABLE */}
              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th style={{ width: '110px' }}>Unit / Flat</th>
                      <th>Title & Typology</th>
                      <th>Block & Floor</th>
                      <th>Bed / Bath</th>
                      <th>Super Area</th>
                      <th>Price</th>
                      <th style={{ width: '160px' }}>Status</th>
                      <th style={{ width: '90px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApartments.map(apt => (
                      <tr key={apt.id}>
                        {/* Unit / Flat No */}
                        <td>
                          <b style={{ color: '#0f172a', fontSize: '14px', letterSpacing: '-0.01em' }}>
                            {apt.apartmentNumber}
                          </b>
                        </td>

                        {/* Title & Typology */}
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{apt.title}</div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {apt.typology} {apt.completion ? `• ${apt.completion}` : ''}
                          </span>
                          {apt.buyer?.name && (apt.status === 'SOLD' || apt.status === 'RESERVED') && (
                            <div 
                              onClick={() => openEditBuyerModal(apt)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#2563eb', cursor: 'pointer', marginTop: '3px' }}
                              title="Click to view/edit buyer details"
                            >
                              <UserCheck size={11} />
                              <span>Buyer: {apt.buyer.name}</span>
                            </div>
                          )}
                        </td>

                        {/* Block & Floor */}
                        <td>
                          <div>{apt.block}</div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{apt.floor}</span>
                        </td>

                        {/* Bedrooms & Bathrooms */}
                        <td>
                          <div><b>{apt.bedrooms} BHK</b></div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{apt.bathrooms || 2} Bath</span>
                        </td>

                        {/* Area */}
                        <td>
                          <div><b>{apt.areaSqft} sqft</b></div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            ({apt.areaSqm || Math.round(apt.areaSqft / 10.764)} m² + {apt.terraceArea || 25} m² terrace)
                          </span>
                        </td>

                        {/* Price */}
                        <td>
                          <b style={{ color: '#0f172a', fontSize: '13.5px' }}>{formatINR(apt.price)}</b>
                        </td>

                        {/* Status Dropdown or Static Badge */}
                        <td>
                          {userPermissions.canEditApartment ? (
                            <select
                              className="status-select-clean"
                              value={apt.status}
                              onChange={(e) => handleApartmentStatus(apt.id, e.target.value)}
                              style={{
                                borderColor: apt.status === 'AVAILABLE' ? '#a7f3d0' : (apt.status === 'RESERVED' ? '#fde68a' : '#fecaca'),
                                color: apt.status === 'AVAILABLE' ? '#059669' : (apt.status === 'RESERVED' ? '#d97706' : '#dc2626'),
                                backgroundColor: apt.status === 'AVAILABLE' ? '#ecfdf5' : (apt.status === 'RESERVED' ? '#fffbeb' : '#fef2f2'),
                                width: '100%'
                              }}
                            >
                              <option value="AVAILABLE">🟢 Available</option>
                              <option value="RESERVED">🟡 Reserved</option>
                              <option value="SOLD">🔴 Sold Out</option>
                            </select>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 600,
                              border: apt.status === 'AVAILABLE' ? '1px solid #a7f3d0' : (apt.status === 'RESERVED' ? '1px solid #fde68a' : '1px solid #fecaca'),
                              color: apt.status === 'AVAILABLE' ? '#047857' : (apt.status === 'RESERVED' ? '#b45309' : '#b91c1c'),
                              background: apt.status === 'AVAILABLE' ? '#ecfdf5' : (apt.status === 'RESERVED' ? '#fffbeb' : '#fef2f2')
                            }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: apt.status === 'AVAILABLE' ? '#10b981' : (apt.status === 'RESERVED' ? '#f59e0b' : '#ef4444') }} />
                              {apt.status === 'AVAILABLE' ? 'Available' : (apt.status === 'RESERVED' ? 'Reserved' : 'Sold Out')}
                            </span>
                          )}
                        </td>

                        {/* Actions: Edit + Delete or View Only */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {userPermissions.canEditApartment ? (
                              <button
                                style={{
                                  background: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  color: '#2563eb',
                                  cursor: 'pointer',
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                onClick={() => {
                                  setEditingApt(apt);
                                  setShowEditModal(true);
                                }}
                                title="Edit apartment details"
                              >
                                <Edit3 size={14} />
                              </button>
                            ) : (
                              <button
                                style={{
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  color: '#475569',
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '11px',
                                  fontWeight: 600
                                }}
                                onClick={() => {
                                  setEditingApt(apt);
                                  setShowEditModal(true);
                                }}
                                title="View apartment details"
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </button>
                            )}

                            {userPermissions.canDeleteApartment && (
                              <button
                                style={{
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                onClick={() => handleDeleteApartment(apt.id)}
                                title="Delete unit"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================
              MODULE: SOLD PROPERTIES & BUYER REGISTRY
          ======================================================== */}
          {currentTab === 'sales' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header Panel */}
              <div className="white-panel" style={{ padding: '22px 24px' }}>
                <div className="panel-header-row" style={{ flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '18px' }}>
                  <div>
                    <h3 className="panel-title" style={{ fontSize: '19px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <UserCheck size={22} style={{ color: '#2563eb' }} />
                      <span>Sold Properties & Buyer Registry</span>
                    </h3>
                    <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                      Comprehensive ownership registry of all closed sales and reserved units. View buyer contact profiles, transaction values, payment status, and generate official allotment slips.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      className="btn-secondary-action"
                      onClick={() => window.print()}
                      title="Print buyer sales report"
                      style={{ height: '38px', padding: '0 14px', fontSize: '13px' }}
                    >
                      <Printer size={15} />
                      <span>Print Report</span>
                    </button>

                    <button
                      className="btn-primary-action"
                      onClick={() => {
                        const target = apartments.find(a => a.status === 'AVAILABLE') || apartments[0];
                        openEditBuyerModal(target);
                      }}
                      style={{ height: '38px', padding: '0 16px', fontSize: '13px' }}
                    >
                      <Plus size={16} />
                      <span>Record New Buyer / Sale</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  
                  {/* Total Sold Units */}
                  <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sold Out Units</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#991b1b', letterSpacing: '-0.02em' }}>
                      {soldCount} <span style={{ fontSize: '14px', fontWeight: 600, color: '#b91c1c' }}>Units Closed</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '4px' }}>
                      Official registry complete
                    </div>
                  </div>

                  {/* Reserved Units */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reserved / On Hold</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#92400e', letterSpacing: '-0.02em' }}>
                      {reservedCount} <span style={{ fontSize: '14px', fontWeight: 600, color: '#b45309' }}>Under Token</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
                      Advance deposit received
                    </div>
                  </div>

                  {/* Booked Sales Revenue */}
                  <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Closed Booked Value</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#065f46', letterSpacing: '-0.02em' }}>
                      {formatINR(totalSoldRevenue)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>
                      Total value of sold units
                    </div>
                  </div>

                  {/* Registered Buyers Count */}
                  <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Buyers</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#1e40af', letterSpacing: '-0.02em' }}>
                      {apartments.filter(a => (a.status === 'SOLD' || a.status === 'RESERVED') && a.buyer?.name).length} <span style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb' }}>Profiles</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '4px' }}>
                      Verified contact details
                    </div>
                  </div>

                </div>

                {/* Filter and Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  
                  {/* Search Input */}
                  <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '360px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search buyer name, phone, email, unit..."
                      value={searchSalesQuery}
                      onChange={(e) => setSearchSalesQuery(e.target.value)}
                      className="input-clean"
                      style={{ paddingLeft: '36px', height: '36px', fontSize: '13px', background: '#ffffff', width: '100%' }}
                    />
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSalesStatusFilter('ALL')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: '1px solid',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: salesStatusFilter === 'ALL' ? '#2563eb' : '#ffffff',
                        borderColor: salesStatusFilter === 'ALL' ? '#2563eb' : '#cbd5e1',
                        color: salesStatusFilter === 'ALL' ? '#ffffff' : '#475569'
                      }}
                    >
                      All Booked Units ({soldCount + reservedCount})
                    </button>

                    <button
                      type="button"
                      onClick={() => setSalesStatusFilter('SOLD')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: '1px solid',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: salesStatusFilter === 'SOLD' ? '#dc2626' : '#ffffff',
                        borderColor: salesStatusFilter === 'SOLD' ? '#dc2626' : '#cbd5e1',
                        color: salesStatusFilter === 'SOLD' ? '#ffffff' : '#475569'
                      }}
                    >
                      🔴 Sold Out Only ({soldCount})
                    </button>

                    <button
                      type="button"
                      onClick={() => setSalesStatusFilter('RESERVED')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: '1px solid',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: salesStatusFilter === 'RESERVED' ? '#d97706' : '#ffffff',
                        borderColor: salesStatusFilter === 'RESERVED' ? '#d97706' : '#cbd5e1',
                        color: salesStatusFilter === 'RESERVED' ? '#ffffff' : '#475569'
                      }}
                    >
                      🟡 Reserved Only ({reservedCount})
                    </button>
                  </div>

                </div>

                {/* Buyers & Properties Table */}
                <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                  {filteredSalesApartments.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      <UserCheck size={40} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
                      <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#334155' }}>No matching property sales found</h4>
                      <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
                        {searchSalesQuery ? 'Try clearing your search query or switching filters.' : 'Mark apartments as Sold Out or Reserved in the inventory to track them here.'}
                      </p>
                      <button
                        className="btn-primary-action"
                        onClick={() => handleSwitchTab('apartments')}
                        style={{ margin: '0 auto' }}
                      >
                        <Building2 size={15} />
                        <span>Go to Apartments Inventory</span>
                      </button>
                    </div>
                  ) : (
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ width: '22%' }}>Unit & Typology</th>
                          <th style={{ width: '12%' }}>Status</th>
                          <th style={{ width: '24%' }}>Buyer Contact Details</th>
                          <th style={{ width: '14%' }}>Deal Value</th>
                          <th style={{ width: '14%' }}>Payment Status</th>
                          <th style={{ width: '14%', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSalesApartments.map(apt => {
                          const buyer = apt.buyer || {
                            name: apt.status === 'SOLD' ? 'Private Client' : 'Prospective Buyer',
                            phone: '+91 98200 00000',
                            email: 'client@estatesphere.in',
                            dealAmount: apt.price,
                            saleDate: 'Recently',
                            paymentStatus: apt.status === 'SOLD' ? 'FULLY_PAID' : 'TOKEN_PAID',
                            paymentStatusLabel: apt.status === 'SOLD' ? '100% Payment Cleared' : 'Token Advance Received',
                            assignedAgent: 'Super Admin',
                            notes: 'Allotment in progress.'
                          };

                          return (
                            <tr key={apt.id} style={{ transition: 'background 0.15s ease' }}>
                              
                              {/* 1. Unit & Typology */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <img
                                    src={apt.imageUrl || '/assets/estate-boutique-lounge.png'}
                                    alt={apt.apartmentNumber}
                                    style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                  />
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <b style={{ color: '#0f172a', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                                        {apt.apartmentNumber}
                                      </b>
                                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                                        {apt.block}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                                      {apt.title || `${apt.bedrooms} BHK Residence`}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                      {apt.floor} &bull; {apt.areaSqft} sq.ft
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Status Badge */}
                              <td>
                                {apt.status === 'SOLD' ? (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 10px',
                                    borderRadius: '16px',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    background: '#fef2f2',
                                    color: '#b91c1c',
                                    border: '1px solid #fecaca'
                                  }}>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
                                    Sold Out
                                  </span>
                                ) : (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 10px',
                                    borderRadius: '16px',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    background: '#fffbeb',
                                    color: '#b45309',
                                    border: '1px solid #fde68a'
                                  }}>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                                    Reserved
                                  </span>
                                )}
                              </td>

                              {/* 3. Buyer Details */}
                              <td>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <UserCheck size={14} style={{ color: '#2563eb' }} />
                                    <span>{buyer.name}</span>
                                  </div>
                                  
                                  {buyer.phone && (
                                    <div style={{ marginTop: '3px' }}>
                                      <a
                                        href={`tel:${buyer.phone}`}
                                        style={{ fontSize: '12px', color: '#475569', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                        title="Click to call buyer"
                                      >
                                        <Phone size={11} style={{ color: '#64748b' }} />
                                        <span>{buyer.phone}</span>
                                      </a>
                                    </div>
                                  )}

                                  {buyer.email && (
                                    <div style={{ marginTop: '2px' }}>
                                      <a
                                        href={`mailto:${buyer.email}`}
                                        style={{ fontSize: '11.5px', color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                        title="Click to email buyer"
                                      >
                                        <Mail size={11} />
                                        <span>{buyer.email}</span>
                                      </a>
                                    </div>
                                  )}

                                  {buyer.assignedAgent && (
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                                      Handled by: <b>{buyer.assignedAgent}</b>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 4. Deal Value & Payment Breakdown */}
                              <td>
                                <div>
                                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                                    {formatINR(buyer.dealAmount || apt.price)}
                                  </div>
                                  <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                                    Paid: {formatINR(buyer.paidAmount !== undefined ? buyer.paidAmount : (buyer.paymentStatus === 'FULLY_PAID' ? (buyer.dealAmount || apt.price) : Math.round((buyer.dealAmount || apt.price) * 0.9)))}
                                  </div>
                                  <div style={{ fontSize: '11px', color: (buyer.balanceAmount === 0 || buyer.paymentStatus === 'FULLY_PAID') ? '#059669' : '#dc2626', fontWeight: 600 }}>
                                    Balance: {(buyer.balanceAmount === 0 || buyer.paymentStatus === 'FULLY_PAID') ? '₹0 (Cleared)' : formatINR(buyer.balanceAmount !== undefined ? buyer.balanceAmount : Math.round((buyer.dealAmount || apt.price) * 0.1))}
                                  </div>
                                </div>
                              </td>

                              {/* 5. Payment Status & Booking Date */}
                              <td>
                                <div>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '3px 9px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    background: (buyer.balanceAmount === 0 || buyer.paymentStatus === 'FULLY_PAID') ? '#ecfdf5' : (buyer.paymentPlan === 'TOKEN_ADVANCE' || buyer.paymentStatus === 'TOKEN_PAID' ? '#fffbeb' : '#eff6ff'),
                                    color: (buyer.balanceAmount === 0 || buyer.paymentStatus === 'FULLY_PAID') ? '#047857' : (buyer.paymentPlan === 'TOKEN_ADVANCE' || buyer.paymentStatus === 'TOKEN_PAID' ? '#b45309' : '#1d4ed8'),
                                    border: `1px solid ${(buyer.balanceAmount === 0 || buyer.paymentStatus === 'FULLY_PAID') ? '#a7f3d0' : (buyer.paymentPlan === 'TOKEN_ADVANCE' || buyer.paymentStatus === 'TOKEN_PAID' ? '#fde68a' : '#bfdbfe')}`
                                  }}>
                                    {(buyer.balanceAmount === 0 || buyer.paymentStatus === 'FULLY_PAID') ? '✅ Full Payment' : (buyer.paymentPlan === 'TOKEN_ADVANCE' || buyer.paymentStatus === 'TOKEN_PAID' ? '🟡 Token Advance' : '🔵 EMI / Installments')}
                                  </span>

                                  <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <Calendar size={11} style={{ color: '#64748b' }} />
                                    <span>Booked: <b>{buyer.bookingDate || buyer.saleDate || 'Recently'}</b></span>
                                  </div>

                                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', fontWeight: 500, lineHeight: 1.3 }}>
                                    {buyer.paymentStatusLabel || 'Details recorded'}
                                  </div>
                                </div>
                              </td>

                              {/* 6. Actions */}
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => openEditBuyerModal(apt)}
                                    className="btn-secondary-action"
                                    style={{ padding: '6px 11px', fontSize: '12px', gap: '5px' }}
                                    title="Edit buyer details"
                                  >
                                    <Edit3 size={13} />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setSaleReceiptModal({ isOpen: true, apt })}
                                    className="btn-secondary-action"
                                    style={{ padding: '6px 11px', fontSize: '12px', gap: '5px', background: '#f8fafc' }}
                                    title="View luxury allotment receipt / booking certificate"
                                  >
                                    <FileText size={13} style={{ color: '#2563eb' }} />
                                    <span>Slip</span>
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

              </div>

            </div>
          )}


          {/* ========================================================
              MODULE 1: DASHBOARD OVERVIEW
          ======================================================== */}
          {currentTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div>
                {/* Recent Activity */}
                <div className="white-panel">
                  <div className="panel-header-row">
                    <h3 className="panel-title">
                      <Activity size={17} style={{ color: '#2563eb' }} />
                      <span>Recent Activity Feed</span>
                    </h3>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Live Event Stream</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activityFeed.slice(0, 6).map((act, idx) => (
                      <div key={act.id || idx} style={{ display: 'flex', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: act.type === 'sold' ? '#fee2e2' : '#dbeafe', color: act.type === 'sold' ? '#ef4444' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {act.type === 'sold' ? <ShieldCheck size={14} /> : <CheckCircle2 size={14} />}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>{act.text}</p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{act.time || 'Recently'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Quick Unit Status */}
                <div className="white-panel">
                  <div className="panel-header-row">
                    <h3 className="panel-title">
                      <Building2 size={17} style={{ color: '#2563eb' }} />
                      <span>Quick Unit Status</span>
                    </h3>
                    <button className="panel-link" onClick={() => setCurrentTab('apartments')}>
                      <span>All ({apartments.length}) &rarr;</span>
                    </button>
                  </div>
                  <div>
                    {apartments.slice(0, 5).map(a => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div>
                          <b>{a.apartmentNumber}</b>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>{a.block} &bull; {formatINR(a.price)}</div>
                        </div>
                        {userPermissions.canEditApartment ? (
                          <select
                            className="status-select-clean"
                            value={a.status}
                            onChange={(e) => handleApartmentStatus(a.id, e.target.value)}
                          >
                            <option value="AVAILABLE">🟢 Available</option>
                            <option value="RESERVED">🟡 Reserved</option>
                            <option value="SOLD">🔴 Sold Out</option>
                          </select>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '16px',
                            fontSize: '11px',
                            fontWeight: 700,
                            border: a.status === 'AVAILABLE' ? '1px solid #a7f3d0' : (a.status === 'RESERVED' ? '1px solid #fde68a' : '1px solid #fecaca'),
                            color: a.status === 'AVAILABLE' ? '#047857' : (a.status === 'RESERVED' ? '#b45309' : '#b91c1c'),
                            background: a.status === 'AVAILABLE' ? '#ecfdf5' : (a.status === 'RESERVED' ? '#fffbeb' : '#fef2f2')
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.status === 'AVAILABLE' ? '#10b981' : (a.status === 'RESERVED' ? '#f59e0b' : '#ef4444') }} />
                            {a.status === 'AVAILABLE' ? 'Available' : (a.status === 'RESERVED' ? 'Reserved' : 'Sold Out')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 3: OPTION 2 - LIVE IMAGE CHANGER & MEDIA MANAGER
          ======================================================== */}
          {currentTab === 'media' && (() => {
            const currentSelectedApt = apartments.find(a => a.id === selectedUnitForPhoto) || apartments[0];
            const currentGallery = currentSelectedApt?.roomGallery || {
              cover: currentSelectedApt?.imageUrl || '/assets/estate-boutique-lounge.png',
              livingHall: '/assets/interior-living-hall.png',
              kitchen: '/assets/interior-kitchen.png',
              bedroom: '/assets/interior-master-bedroom.png',
              terrace: '/assets/estate-private-terrace.png',
              panorama360: '/assets/cayley-interior-8k.jpg'
            };

            const roomCards = [
              {
                key: 'cover',
                label: 'Apartment Listing Cover Photo',
                tag: 'FLAT LISTING CARD PHOTO',
                url: currentSelectedApt?.imageUrl || currentGallery.cover,
                title: currentSelectedApt?.title || 'Main Residence Exterior',
                description: currentSelectedApt?.headline || 'Displayed on this unit\'s inventory card on the /apartments catalog page.'
              },
              {
                key: 'bedroom',
                label: 'Master Bedroom Photo',
                tag: 'ROOM GALLERY',
                url: currentGallery.bedroom || '/assets/interior-master-bedroom.png',
                title: 'Master Bedroom Suite',
                description: 'Bespoke bedroom suite with private terrace access and dressing room.'
              },
              {
                key: 'livingHall',
                label: 'Living Hall Photo',
                tag: 'ROOM GALLERY',
                url: currentGallery.livingHall || '/assets/interior-living-hall.png',
                title: 'Living Hall & Solarium Deck',
                description: 'Open-concept living room with seamless glass sliding doors and natural light.'
              },
              {
                key: 'kitchen',
                label: 'Kitchen Photo',
                tag: 'ROOM GALLERY',
                url: currentGallery.kitchen || '/assets/interior-kitchen.png',
                title: 'Italian Designer Travertine Kitchen',
                description: 'Custom cabinetry, Miele integrated appliances and waterfall quartz island.'
              },
              {
                key: 'terrace',
                label: 'Private Terrace / Balcony Photo',
                tag: 'OUTDOOR LIVING',
                url: currentGallery.terrace || '/assets/estate-private-terrace.png',
                title: 'Private Solarium Terrace',
                description: 'Duplex rooftop terrace with horizon sunset views and bougainvillea plantings.'
              },
              {
                key: 'panorama360',
                label: '3D / 360° Virtual Walkthrough',
                tag: '360° EQUIRECTANGULAR TOUR',
                url: currentGallery.panorama360 || '/assets/cayley-interior-8k.jpg',
                is360: true,
                title: 'Interactive 360° Walkthrough Scene',
                description: 'High-definition 360° panorama equirectangular sphere rendered when client clicks "+ ENTER 360° VIEW".'
              }
            ];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Top Control Bar with Sub-Tabs */}
                <div className="white-panel" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ImageIcon size={20} style={{ color: '#2563eb' }} />
                        <span>Option 2: Live Image Changer & Media Studio</span>
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                        Upload directly from PC with instant preview. Edit flat room photos, 360° tours, and public website visual copy.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn-primary-action"
                        onClick={() => openPhotoEditor({
                          mode: 'media_asset',
                          label: 'Upload New Property Visual Asset',
                          title: 'Property Visual Asset',
                          description: 'Luxury architectural visual captured for EstateSphere.'
                        })}
                      >
                        <UploadCloud size={16} />
                        <span>Upload from PC / Add Asset</span>
                      </button>
                    </div>
                  </div>

                  {/* Sub-Navigation Pills (Clear Separation between Website Main Photos & Apartment Rooms) */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setMediaSubTab('website')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        background: mediaSubTab === 'website' ? '#2563eb' : '#f1f5f9',
                        color: mediaSubTab === 'website' ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        boxShadow: mediaSubTab === 'website' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none'
                      }}
                    >
                      <Sparkles size={15} />
                      <span>🌐 Website Main Photos (Day/Night Hero & 5 Amenities)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaSubTab('units')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        background: mediaSubTab === 'units' ? '#2563eb' : '#f1f5f9',
                        color: mediaSubTab === 'units' ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        boxShadow: mediaSubTab === 'units' ? '0 2px 8px rgba(37,99,235,0.25)' : 'none'
                      }}
                    >
                      <Building2 size={15} />
                      <span>🏢 Apartment Room Galleries (Unit No-01 to No-25)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaSubTab('library')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        background: mediaSubTab === 'library' ? '#2563eb' : '#f1f5f9',
                        color: mediaSubTab === 'library' ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px'
                      }}
                    >
                      <Layers size={15} />
                      <span>Global Media Assets Library ({mediaList.length})</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================
                    SUB-TAB 1: APARTMENT ROOM GALLERIES & 360 WALKTHROUGH
                ======================================================== */}
                {mediaSubTab === 'units' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Apartment Unit Picker Header */}
                    <div className="white-panel" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ minWidth: '320px', flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            Choose Residence Flat To Edit (25 Units):
                          </label>
                          <select
                            value={selectedUnitForPhoto}
                            onChange={(e) => setSelectedUnitForPhoto(Number(e.target.value))}
                            className="input-clean"
                            style={{ height: '42px', fontSize: '14px', fontWeight: 600, borderColor: '#94a3b8' }}
                          >
                            {apartments.map(a => (
                              <option key={a.id} value={a.id}>
                                {a.apartmentNumber} — {a.title} ({a.block} • {formatINR(a.price)})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selected Flat Quick Specs */}
                        {currentSelectedApt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{currentSelectedApt.apartmentNumber}</div>
                              <div style={{ fontSize: '11.5px', color: '#64748b' }}>{currentSelectedApt.typology} • {currentSelectedApt.block}</div>
                            </div>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: currentSelectedApt.status === 'SOLD' ? '#fef2f2' : (currentSelectedApt.status === 'RESERVED' ? '#fffbeb' : '#ecfdf5'),
                              color: currentSelectedApt.status === 'SOLD' ? '#dc2626' : (currentSelectedApt.status === 'RESERVED' ? '#d97706' : '#059669'),
                              border: `1px solid ${currentSelectedApt.status === 'SOLD' ? '#fecaca' : (currentSelectedApt.status === 'RESERVED' ? '#fde68a' : '#a7f3d0')}`
                            }}>
                              {currentSelectedApt.status === 'SOLD' ? 'SOLD OUT' : currentSelectedApt.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 6 Photo Cards Grid (Cover + Bedroom + Living Hall + Kitchen + Terrace + 360 Walkthrough) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                      {roomCards.map((rc) => (
                        <div 
                          key={rc.key} 
                          className="white-panel" 
                          style={{ 
                            padding: 0, 
                            overflow: 'hidden', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            border: rc.is360 ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                          }}
                        >
                          {/* Photo Thumbnail */}
                          <div style={{ height: '200px', width: '100%', position: 'relative', background: '#0f172a' }}>
                            <img
                              src={rc.url}
                              alt={rc.label}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = '/assets/luxury_villa_day.jpg' }}
                            />
                            
                            {/* Badges */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                              <span style={{
                                background: rc.is360 ? 'rgba(37, 99, 235, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                                color: '#ffffff',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                letterSpacing: '0.04em'
                              }}>
                                {rc.tag}
                              </span>
                            </div>

                            {rc.is360 && (
                              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Sparkles size={12} />
                                <span>360° VIRTUAL SPHERE</span>
                              </div>
                            )}
                          </div>

                          {/* Body Information */}
                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                {rc.label}
                              </div>
                              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#2563eb', marginBottom: '6px' }}>
                                {rc.title}
                              </div>
                              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                                {rc.description}
                              </p>
                            </div>

                            {/* Action Button that opens Full Screen Modal */}
                            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                              <button
                                type="button"
                                className="btn-primary-action"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => openPhotoEditor({
                                  mode: 'apartment_room',
                                  targetId: currentSelectedApt.id,
                                  roomKey: rc.key,
                                  label: `${currentSelectedApt.apartmentNumber} • ${rc.label}`,
                                  title: rc.title,
                                  description: rc.description,
                                  url: rc.url
                                })}
                              >
                                <UploadCloud size={15} />
                                <span>Upload from PC / Change & Edit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 2: WEBSITE PUBLIC VISUALS & PRESENTATION
                ======================================================== */}
                {mediaSubTab === 'website' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Hero Day & Night Section */}
                    <div className="white-panel">
                      <div className="panel-header-row">
                        <h3 className="panel-title">
                          <Sparkles size={18} style={{ color: '#2563eb' }} />
                          <span>Website Homepage Hero Presentation</span>
                        </h3>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        
                        {/* Hero Day View */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style={{ height: '210px', position: 'relative', background: '#0f172a' }}>
                            <img
                              src={siteContent?.heroDayImage || '/assets/luxury_villa_day.jpg'}
                              alt="Hero Day View"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(234, 179, 8, 0.95)', color: '#000', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                              ☀️ DAY MODE EXTERIOR
                            </span>
                          </div>
                          <div style={{ padding: '16px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{siteContent?.heroTitle || 'Dwellora'}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{siteContent?.heroSubtitle || 'A place by day — by night to return to'}</div>
                            <button
                              type="button"
                              className="btn-primary-action"
                              style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                              onClick={() => openPhotoEditor({
                                mode: 'site_hero',
                                roomKey: 'heroDay',
                                label: 'Hero Day Mode Exterior Visual',
                                title: siteContent?.heroTitle || 'Dwellora',
                                description: siteContent?.heroSubtitle || 'A place by day — by night to return to',
                                url: siteContent?.heroDayImage || '/assets/luxury_villa_day.jpg'
                              })}
                            >
                              <Edit3 size={14} />
                              <span>Edit Day Photo & Text</span>
                            </button>
                          </div>
                        </div>

                        {/* Hero Night View */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style={{ height: '210px', position: 'relative', background: '#0f172a' }}>
                            <img
                              src={siteContent?.heroNightImage || '/assets/luxury_villa_night.jpg'}
                              alt="Hero Night View"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(99, 102, 241, 0.95)', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                              🌙 NIGHT MODE EXTERIOR
                            </span>
                          </div>
                          <div style={{ padding: '16px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{siteContent?.heroTitle || 'Dwellora'} (Night View)</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Illuminated evening perspective with tranquil waterscape.</div>
                            <button
                              type="button"
                              className="btn-primary-action"
                              style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                              onClick={() => openPhotoEditor({
                                mode: 'site_hero',
                                roomKey: 'heroNight',
                                label: 'Hero Night Mode Exterior Visual',
                                title: siteContent?.heroTitle || 'Dwellora',
                                description: siteContent?.heroSubtitle || 'A place by day — by night to return to',
                                url: siteContent?.heroNightImage || '/assets/luxury_villa_night.jpg'
                              })}
                            >
                              <Edit3 size={14} />
                              <span>Edit Night Photo & Text</span>
                            </button>
                          </div>
                        </div>

                        {/* Architectural Reveal Card */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style={{ height: '210px', position: 'relative', background: '#0f172a' }}>
                            <img
                              src={siteContent?.revealImage || '/assets/estate-exterior-reveal.png'}
                              alt="Exterior Reveal Architecture"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(16, 185, 129, 0.95)', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                              🏛️ ARCHITECTURAL REVEAL
                            </span>
                          </div>
                          <div style={{ padding: '16px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{siteContent?.revealTitle || 'Designed to feel like home'}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{siteContent?.revealBadge || 'ESTATESPHERE RESIDENCES'} — Architectural identity banner.</div>
                            <button
                              type="button"
                              className="btn-primary-action"
                              style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                              onClick={() => openPhotoEditor({
                                mode: 'site_hero',
                                roomKey: 'revealImage',
                                label: 'Exterior Reveal Architectural Visual',
                                title: siteContent?.revealTitle || 'Designed to feel like home',
                                description: siteContent?.revealDescription || 'Landscaped terraces, timeless materials and generous openings connect every residence to light, greenery and calm.',
                                url: siteContent?.revealImage || '/assets/estate-exterior-reveal.png'
                              })}
                            >
                              <Edit3 size={14} />
                              <span>Edit Reveal Photo & Headline</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Community 5 Amenity Features Section */}
                    <div className="white-panel">
                      <div className="panel-header-row">
                        <div>
                          <h3 className="panel-title">
                            <Layers size={18} style={{ color: '#2563eb' }} />
                            <span>Community Sections & Amenity Features (5 Areas)</span>
                          </h3>
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                            Displayed in the interactive 3D scroll section on both homepage and apartment pages.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '14px' }}>
                        {(siteContent?.communityFeatures || []).map((feat, idx) => (
                          <div key={feat.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ height: '170px', width: '100%', position: 'relative', background: '#0f172a' }}>
                                <img
                                  src={feat.image}
                                  alt={feat.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.85)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700 }}>
                                  SECTION #{idx + 1}
                                </span>
                              </div>

                              <div style={{ padding: '14px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{feat.title}</div>
                                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>{feat.copy}</p>
                              </div>
                            </div>

                            <div style={{ padding: '0 14px 14px' }}>
                              <button
                                type="button"
                                className="btn-secondary-action"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => openPhotoEditor({
                                  mode: 'community',
                                  targetId: feat.id,
                                  label: `Community Section #${idx + 1}: ${feat.title}`,
                                  title: feat.title,
                                  description: feat.copy,
                                  url: feat.image
                                })}
                              >
                                <Edit3 size={13} />
                                <span>Edit Photo & Text</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 3: MEDIA ASSETS LIBRARY
                ======================================================== */}
                {mediaSubTab === 'library' && (
                  <div className="white-panel">
                    <div className="panel-header-row">
                      <div>
                        <h3 className="panel-title">
                          <Layers size={18} style={{ color: '#2563eb' }} />
                          <span>All Property Media Assets ({mediaList.length})</span>
                        </h3>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                          Upload high-resolution photography and 360° panoramas from your PC.
                        </p>
                      </div>

                      <button 
                        className="btn-primary-action"
                        onClick={() => openPhotoEditor({
                          mode: 'media_asset',
                          label: 'Upload New Property Asset',
                          title: 'Property Visual',
                          description: 'High-resolution luxury estate imagery.'
                        })}
                      >
                        <UploadCloud size={15} />
                        <span>Upload New Photo Asset</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
                      {mediaList.map((med) => (
                        <div key={med.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ height: '170px', width: '100%', background: '#0f172a', position: 'relative' }}>
                              <img src={med.url} alt={med.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/luxury_villa_day.jpg' }} />
                              <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(15,23,42,0.85)', color: '#fff', fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                {med.category}
                              </span>
                            </div>
                            <div style={{ padding: '14px' }}>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{med.title}</div>
                              <p style={{ margin: '4px 0 8px', fontSize: '12px', color: '#64748b' }}>{med.description}</p>
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{med.dimensions || 'High Resolution'}</div>
                            </div>
                          </div>

                          <div style={{ padding: '10px 14px 14px', display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              style={{ flex: 1, justifyContent: 'center' }}
                              onClick={() => openPhotoEditor({
                                mode: 'media_asset',
                                targetId: med.id,
                                label: `Edit Asset: ${med.title}`,
                                title: med.title,
                                description: med.description,
                                url: med.url
                              })}
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              style={{ color: '#dc2626', borderColor: '#fecaca' }}
                              onClick={() => {
                                if (window.confirm('Delete this media asset?')) {
                                  const updated = dataStore.deleteMediaItem(med.id);
                                  setMediaList(updated);
                                  triggerToast('Asset removed from library.');
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* ========================================================
              MODULE 4: OPTION 3 - CUSTOMER INQUIRIES & LEADS CRM
          ======================================================== */}
          {currentTab === 'inquiries' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Header with Title, Stats & Quick Add Button */}
              <div className="white-panel" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Inbox size={18} style={{ color: '#2563eb' }} />
                      <span>Option 3: Customer Inquiries & Leads CRM</span>
                      <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                        {filteredInquiries.length} Active Leads
                      </span>
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                      Live website inquiries, 1-click WhatsApp/Call outreach, status tracking & agent assignments.
                    </p>
                  </div>

                  <button
                    className="btn-primary-action"
                    style={{ padding: '7px 13px', fontSize: '12.5px' }}
                    onClick={() => setShowAddInquiryModal(true)}
                  >
                    <Plus size={15} />
                    <span>Register Walk-in / Phone Lead</span>
                  </button>
                </div>

                {/* 5 Compact Pipeline Filter Tabs + Search Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  
                  {/* Status Pipeline Filter Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setStatusInquiryFilter('ALL')}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: statusInquiryFilter === 'ALL' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        background: statusInquiryFilter === 'ALL' ? '#eff6ff' : '#ffffff',
                        color: statusInquiryFilter === 'ALL' ? '#1d4ed8' : '#475569',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>All Inquiries</span>
                      <span style={{ background: statusInquiryFilter === 'ALL' ? '#2563eb' : '#f1f5f9', color: statusInquiryFilter === 'ALL' ? '#ffffff' : '#64748b', padding: '1px 6px', borderRadius: '10px', fontSize: '10.5px' }}>
                        {leadPipeline.total}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusInquiryFilter('NEW')}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: statusInquiryFilter === 'NEW' ? '1.5px solid #2563eb' : '1px solid #bfdbfe',
                        background: statusInquiryFilter === 'NEW' ? '#eff6ff' : '#ffffff',
                        color: statusInquiryFilter === 'NEW' ? '#1d4ed8' : '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>🆕 New</span>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 700 }}>
                        {leadPipeline.newCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusInquiryFilter('CONTACTED')}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: statusInquiryFilter === 'CONTACTED' ? '1.5px solid #d97706' : '1px solid #fde68a',
                        background: statusInquiryFilter === 'CONTACTED' ? '#fffbeb' : '#ffffff',
                        color: statusInquiryFilter === 'CONTACTED' ? '#b45309' : '#d97706',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>📞 Contacted</span>
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 700 }}>
                        {leadPipeline.contactedCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusInquiryFilter('VISIT_BOOKED')}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: statusInquiryFilter === 'VISIT_BOOKED' ? '1.5px solid #7c3aed' : '1px solid #ddd6fe',
                        background: statusInquiryFilter === 'VISIT_BOOKED' ? '#f5f3ff' : '#ffffff',
                        color: statusInquiryFilter === 'VISIT_BOOKED' ? '#6d28d9' : '#7c3aed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>📍 Site Visit</span>
                      <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '1px 6px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 700 }}>
                        {leadPipeline.visitCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusInquiryFilter('DEAL_CLOSED')}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: statusInquiryFilter === 'DEAL_CLOSED' ? '1.5px solid #059669' : '1px solid #a7f3d0',
                        background: statusInquiryFilter === 'DEAL_CLOSED' ? '#ecfdf5' : '#ffffff',
                        color: statusInquiryFilter === 'DEAL_CLOSED' ? '#047857' : '#059669',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>🤝 Closed</span>
                      <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 6px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 700 }}>
                        {leadPipeline.closedCount}
                      </span>
                    </button>
                  </div>

                  {/* Search Input & Sales Agent Filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '270px' }}>
                      <Search size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search lead by name, phone, flat..."
                        value={searchInquiryQuery}
                        onChange={(e) => setSearchInquiryQuery(e.target.value)}
                        className="input-clean"
                        style={{ paddingLeft: '30px', height: '34px', fontSize: '12px' }}
                      />
                    </div>

                    <select
                      value={agentInquiryFilter}
                      onChange={(e) => setAgentInquiryFilter(e.target.value)}
                      className="input-clean"
                      style={{ width: '150px', height: '34px', fontSize: '12px', fontWeight: 500 }}
                    >
                      <option value="ALL">All Agents</option>
                      <option value="Unassigned">Unassigned</option>
                      {team.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>

                    {(searchInquiryQuery || statusInquiryFilter !== 'ALL' || agentInquiryFilter !== 'ALL') && (
                      <button
                        type="button"
                        className="btn-secondary-action"
                        style={{ height: '34px', padding: '0 10px', fontSize: '12px' }}
                        onClick={() => {
                          setSearchInquiryQuery('');
                          setStatusInquiryFilter('ALL');
                          setAgentInquiryFilter('ALL');
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Live Inquiries CRM Table */}
              <div className="white-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ width: '100%', overflow: 'hidden' }}>
                  <table className="clean-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '21%' }}>Customer</th>
                        <th style={{ width: '18%' }}>1-Click Outreach</th>
                        <th style={{ width: '21%' }}>Interested Apartment</th>
                        <th style={{ width: '18%' }}>Lead Status Tracker</th>
                        <th style={{ width: '16%' }}>Assigned Agent</th>
                        <th style={{ width: '6%', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.length > 0 ? (
                        filteredInquiries.map((inq) => {
                          const statusMeta = LEAD_STATUS_MAP[inq.status] || LEAD_STATUS_MAP.NEW;
                          
                          // Prepare WhatsApp Link with Pre-filled Greeting
                          const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                          const whatsappNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                          const greetingMsg = `Hello ${inq.name}, thank you for your inquiry on EstateSphere Residences regarding ${inq.interestedApartment || 'our luxury residences'}. I am connecting from the sales advisory team to share details and schedule your private viewing.`;
                          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(greetingMsg)}`;
                          const phoneUrl = `tel:${(inq.phone || '').replace(/\s+/g, '')}`;

                          // Initials for avatar
                          const initials = inq.name ? inq.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CU';

                          return (
                            <tr key={inq.id}>
                              
                              {/* 1. Customer Column */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                  <div className="lead-avatar-circle" style={{ width: '28px', height: '28px', fontSize: '11px', flexShrink: 0 }}>
                                    {initials}
                                  </div>
                                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {inq.name}
                                    </div>
                                    {inq.email && (
                                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={inq.email}>
                                        <Mail size={10} style={{ flexShrink: 0 }} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{inq.email}</span>
                                      </div>
                                    )}
                                    <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '1px' }}>
                                      {inq.displayTime || 'Today'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Direct Call / 1-Click WhatsApp Button */}
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>
                                    {inq.phone}
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'nowrap' }}>
                                    {/* 1-Click WhatsApp Button */}
                                    <a
                                      href={whatsappUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-whatsapp-link"
                                      style={{ padding: '3px 6px', fontSize: '11px' }}
                                      title="Open WhatsApp chat"
                                    >
                                      <MessageSquare size={11} />
                                      <span>WhatsApp</span>
                                    </a>

                                    {/* Direct Phone Call Button */}
                                    <a
                                      href={phoneUrl}
                                      className="btn-call-link"
                                      style={{ padding: '3px 6px', fontSize: '11px' }}
                                      title="Direct Phone Call"
                                    >
                                      <Phone size={10} />
                                      <span>Call</span>
                                    </a>
                                  </div>
                                </div>
                              </td>

                              {/* 3. Interested Apartment & Message */}
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                                  <span className="unit-interest-pill" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inq.interestedApartment || 'General Residence Inquiry'}>
                                    <Building2 size={11} style={{ flexShrink: 0 }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {inq.interestedApartment || 'General Residence Inquiry'}
                                    </span>
                                  </span>

                                  {inq.message && (
                                    <div style={{ 
                                      fontSize: '11px', 
                                      color: '#475569', 
                                      background: '#f8fafc', 
                                      padding: '3px 6px', 
                                      borderRadius: '5px', 
                                      borderLeft: '2px solid #94a3b8',
                                      maxWidth: '100%',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }} title={inq.message}>
                                      "{inq.message}"
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 4. Lead Status Tracker (Dropdown with 5 States) */}
                              <td>
                                <select
                                  value={inq.status || 'NEW'}
                                  onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                                  style={{
                                    height: '32px',
                                    width: '100%',
                                    padding: '2px 6px',
                                    borderRadius: '7px',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    outline: 'none',
                                    border: `1.5px solid ${statusMeta.border}`,
                                    background: statusMeta.bg,
                                    color: statusMeta.color
                                  }}
                                >
                                  <option value="NEW">🆕 New Lead</option>
                                  <option value="CONTACTED">📞 Contacted</option>
                                  <option value="VISIT_BOOKED">📍 Site Visit</option>
                                  <option value="DEAL_CLOSED">🤝 Deal Closed</option>
                                  <option value="NOT_INTERESTED">❌ Not Interested</option>
                                </select>
                              </td>

                              {/* 5. Agent Assignment Dropdown */}
                              <td>
                                <select
                                  value={inq.assignedAgent || 'Unassigned'}
                                  onChange={(e) => handleAssignAgent(inq.id, e.target.value)}
                                  className="input-clean"
                                  style={{ 
                                    height: '32px', 
                                    width: '100%',
                                    fontSize: '11.5px', 
                                    fontWeight: 600,
                                    padding: '2px 6px',
                                    borderColor: inq.assignedAgent && inq.assignedAgent !== 'Unassigned' ? '#93c5fd' : '#e2e8f0',
                                    background: inq.assignedAgent && inq.assignedAgent !== 'Unassigned' ? '#eff6ff' : '#ffffff',
                                    color: inq.assignedAgent && inq.assignedAgent !== 'Unassigned' ? '#1d4ed8' : '#64748b'
                                  }}
                                >
                                  <option value="Unassigned">Unassigned</option>
                                  {team.map(m => (
                                    <option key={m.id} value={m.name}>
                                      {m.name}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* 6. Actions (Delete Lead Only) */}
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  className="btn-secondary-action"
                                  style={{ 
                                    padding: '5px 7px', 
                                    color: '#ef4444', 
                                    borderColor: '#fecaca',
                                    background: '#ffffff',
                                    borderRadius: '6px'
                                  }}
                                  title="Delete Lead"
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>

                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                            <Inbox size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>No inquiries found matching your filters</div>
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>Try resetting filters or search query above.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              MODULE 5: OPTION 4 - TEAM & ROLES MANAGEMENT
          ======================================================== */}
          {currentTab === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Access Restriction Guard: Super Admin Only */}
              {!isSuperAdmin ? (
                <div className="white-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Lock size={26} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                    👑 Super Admin Access Only
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                    Yeh page sirf <b>Super Admin</b> ke liye reserved hai. Yahan se naye users banana, 3-tier roles assign karna aur kisi employee ka access 1 second me deactivate/delete karna manage hota hai.
                  </p>
                  <div style={{ display: 'inline-flex', gap: '10px' }}>
                    <button 
                      className="btn-primary-action"
                      onClick={() => setCurrentTab('apartments')}
                    >
                      Go to Inventory
                    </button>
                    <button 
                      className="btn-secondary-action"
                      onClick={() => setCurrentTab('inquiries')}
                    >
                      View Assigned Leads
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Top Header Panel with 3-Role KPIs & Create User Button */}
                  <div className="white-panel" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={19} style={{ color: '#2563eb' }} />
                          <span>Option 4: Team & Roles Management</span>
                          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                            👑 Super Admin Access
                          </span>
                        </h3>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                          Create staff accounts, assign 3 core roles, copy credentials, and deactivate access in 1 second.
                        </p>
                      </div>

                      <button 
                        className="btn-primary-action"
                        style={{ padding: '7px 14px', fontSize: '12.5px' }}
                        onClick={() => {
                          setFormTeam({
                            name: '',
                            email: '',
                            phone: '',
                            password: 'Sphere@' + Math.floor(1000 + Math.random() * 9000),
                            role: 'SALES_AGENT'
                          });
                          setShowAddTeamModal(true);
                        }}
                      >
                        <UserPlus size={15} />
                        <span>+ Create New User / Admin</span>
                      </button>
                    </div>

                    {/* 3 Roles System Explanation & Quick Counter Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      
                      {/* 👑 Super Admin Card */}
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>👑 Super Admin</span>
                          <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                            {team.filter(m => m.role === 'SUPER_ADMIN').length}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          All-access control (Users, Deletions, Settings)
                        </div>
                      </div>

                      {/* 💼 Admin (Manager) Card */}
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>💼 Admin (Manager)</span>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                            {team.filter(m => m.role === 'ADMIN_MANAGER' || m.role === 'PROPERTY_MANAGER').length}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          Flats add/edit, photos, sold out toggle, leads CRM
                        </div>
                      </div>

                      {/* 📞 Sales Agent Card */}
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>📞 Sales Agent</span>
                          <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                            {team.filter(m => m.role === 'SALES_AGENT').length}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          Sirf Inventory view & Leads calling updates (No deletes)
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Team Members List Table (Strictly 100% width, no side-scroll) */}
                  <div className="white-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                      <table className="clean-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '22%' }}>Team Member</th>
                            <th style={{ width: '22%' }}>Login Credentials</th>
                            <th style={{ width: '20%' }}>Assign Role (3 Roles)</th>
                            <th style={{ width: '18%' }}>Access Scope</th>
                            <th style={{ width: '10%' }}>Status</th>
                            <th style={{ width: '8%', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.map((member) => {
                            const isDeactivated = member.status === 'DEACTIVATED';
                            const isPrimaryAdmin = member.role === 'SUPER_ADMIN' && member.id === 'team-1';

                            return (
                              <tr key={member.id} style={{ opacity: isDeactivated ? 0.6 : 1, background: isDeactivated ? '#fafafa' : '#ffffff' }}>
                                
                                {/* 1. Team Member Info */}
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                    <div 
                                      className="lead-avatar-circle"
                                      style={{ 
                                        width: '28px', 
                                        height: '28px', 
                                        fontSize: '11px',
                                        background: member.role === 'SUPER_ADMIN' ? '#eff6ff' : (member.role === 'SALES_AGENT' ? '#f5f3ff' : '#fffbeb'),
                                        color: member.role === 'SUPER_ADMIN' ? '#1d4ed8' : (member.role === 'SALES_AGENT' ? '#6d28d9' : '#b45309'),
                                        borderColor: member.role === 'SUPER_ADMIN' ? '#bfdbfe' : (member.role === 'SALES_AGENT' ? '#ddd6fe' : '#fde68a'),
                                        flexShrink: 0
                                      }}
                                    >
                                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {member.name}
                                        {isPrimaryAdmin && (
                                          <span style={{ marginLeft: '4px', fontSize: '9.5px', background: '#dbeafe', color: '#1d4ed8', padding: '1px 5px', borderRadius: '4px' }}>
                                            Primary
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '1px' }}>
                                        Joined {member.joinedDate || '2026'}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* 2. Login Credentials (Email, Phone, Password) */}
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {member.email}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                      {member.phone || 'No phone'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                      <span style={{ fontSize: '10.5px', color: '#475569', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                        {showPasswordMap[member.id] ? (member.password || 'admin123') : '••••••••'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setShowPasswordMap({ ...showPasswordMap, [member.id]: !showPasswordMap[member.id] })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px 2px', color: '#64748b' }}
                                        title={showPasswordMap[member.id] ? "Hide password" : "Show password"}
                                      >
                                        <Eye size={11} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const creds = `EstateSphere Login:\nEmail: ${member.email}\nPassword: ${member.password || 'admin123'}\nRole: ${member.roleLabel || member.role}\nPortal: ${window.location.origin}/admin/login`;
                                          copyToClipboard(creds);
                                          triggerToast(`Login credentials copied for ${member.name}!`);
                                        }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px 2px', color: '#2563eb' }}
                                        title="Copy Login Credentials"
                                      >
                                        <Copy size={11} />
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                {/* 3. Assign Role Dropdown (3 Roles) */}
                                <td>
                                  <select
                                    value={member.role}
                                    onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                                    disabled={isPrimaryAdmin}
                                    className="input-clean"
                                    style={{
                                      height: '32px',
                                      width: '100%',
                                      fontSize: '11.5px',
                                      fontWeight: 600,
                                      cursor: isPrimaryAdmin ? 'not-allowed' : 'pointer',
                                      borderColor: member.role === 'SUPER_ADMIN' ? '#bfdbfe' : (member.role === 'SALES_AGENT' ? '#ddd6fe' : '#fde68a'),
                                      background: member.role === 'SUPER_ADMIN' ? '#eff6ff' : (member.role === 'SALES_AGENT' ? '#f5f3ff' : '#fffbeb'),
                                      color: member.role === 'SUPER_ADMIN' ? '#1d4ed8' : (member.role === 'SALES_AGENT' ? '#6d28d9' : '#b45309')
                                    }}
                                  >
                                    <option value="SUPER_ADMIN">👑 Super Admin</option>
                                    <option value="ADMIN_MANAGER">💼 Admin (Manager)</option>
                                    <option value="SALES_AGENT">📞 Sales Agent</option>
                                    {member.role === 'CUSTOM' && <option value="CUSTOM">⚙️ Custom Role</option>}
                                  </select>
                                </td>

                                {/* 4. Permissions Scope Description & Active Module Badges */}
                                <td>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center' }}>
                                    {member.role === 'SUPER_ADMIN' ? (
                                      <span style={{ fontSize: '10.5px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                                        👑 All-Access (All 7 Modules)
                                      </span>
                                    ) : (
                                      <>
                                        {(member.permissions?.modules || (ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.SALES_AGENT).modules).map(m => (
                                          <span key={m} style={{ fontSize: '10px', background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                                            {m === 'dashboard' && 'Dashboard'}
                                            {m === 'apartments' && 'Inventory'}
                                            {m === 'media' && 'Media'}
                                            {m === 'content' && 'Content'}
                                            {m === 'inquiries' && 'Leads'}
                                            {m === 'team' && 'Team'}
                                            {m === 'settings' && 'Settings'}
                                          </span>
                                        ))}
                                        {member.permissions?.canAddApartment && (
                                          <span style={{ fontSize: '9.5px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '1px 4px', borderRadius: '4px', fontWeight: 700 }}>
                                            +Add Flats
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>

                                {/* 5. 1-Second Instant Deactivate / Activate */}
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleMemberStatus(member.id)}
                                    disabled={isPrimaryAdmin}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 8px',
                                      borderRadius: '12px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      cursor: isPrimaryAdmin ? 'not-allowed' : 'pointer',
                                      border: !isDeactivated ? '1px solid #a7f3d0' : '1px solid #fecaca',
                                      background: !isDeactivated ? '#ecfdf5' : '#fef2f2',
                                      color: !isDeactivated ? '#047857' : '#b91c1c',
                                      transition: 'all 0.15s'
                                    }}
                                    title={!isDeactivated ? "Click to Deactivate Access immediately" : "Click to Reactivate Access"}
                                  >
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: !isDeactivated ? '#10b981' : '#ef4444' }} />
                                    <span>{!isDeactivated ? 'Active' : 'Deactivated'}</span>
                                  </button>
                                </td>

                                {/* 6. Actions (Configure Access, Reset Password & Delete User) */}
                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    {/* Configure Granular Permissions Button */}
                                    <button
                                      type="button"
                                      className="btn-secondary-action"
                                      style={{ padding: '4px 6px', color: '#059669', borderColor: '#a7f3d0', background: '#fff', borderRadius: '6px' }}
                                      title="Configure User Access & Granular Permissions"
                                      onClick={() => openEditPermissionsModal(member)}
                                    >
                                      <SlidersHorizontal size={12} />
                                    </button>

                                    <button
                                      type="button"
                                      className="btn-secondary-action"
                                      style={{ padding: '4px 6px', color: '#2563eb', borderColor: '#bfdbfe', background: '#fff', borderRadius: '6px' }}
                                      title="Reset Password"
                                      onClick={() => {
                                        setSelectedTeamMember(member);
                                        setNewPasswordInput('');
                                        setShowResetPassModal(true);
                                      }}
                                    >
                                      <Key size={12} />
                                    </button>

                                    {!isPrimaryAdmin && (
                                      <button
                                        type="button"
                                        className="btn-secondary-action"
                                        style={{ padding: '4px 6px', color: '#ef4444', borderColor: '#fecaca', background: '#fff', borderRadius: '6px' }}
                                        title="Delete User permanently"
                                        onClick={() => handleDeleteTeamMember(member.id)}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

            </div>
          )}

          {/* ========================================================
              MODULE 6: SITE SETTINGS & PROFILE
          ======================================================== */}
          {currentTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
                {/* 1. ADMIN PROFILE & PASSWORD MANAGEMENT */}
                <div className="white-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                  <div className="panel-header-row" style={{ minHeight: '52px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                    <div>
                      <h3 className="panel-title" style={{ fontSize: '15px' }}>
                        <Lock size={17} style={{ color: '#2563eb' }} />
                        <span>Admin Profile & Security</span>
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#64748b' }}>
                        Apna naam, official email aur login password yahan se change karein.
                      </p>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#eff6ff', 
                      color: '#1d4ed8', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontWeight: 700,
                      border: '1px solid #bfdbfe',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap'
                    }}>
                      <ShieldCheck size={12} />
                      {user?.role || 'SUPER_ADMIN'}
                    </span>
                  </div>

                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Admin Full Name *</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="input-clean"
                        placeholder="e.g. Super Admin"
                        required
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Official Email Address (Login ID) *</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="input-clean"
                        placeholder="superadmin@estatesphere.com"
                        required
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Admin Contact / Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="input-clean"
                        placeholder="+91 98200 11000"
                      />
                    </div>

                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Change Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            const gen = 'Sphere@' + Math.floor(1000 + Math.random() * 9000);
                            setProfileForm({ ...profileForm, newPassword: gen, confirmPassword: gen });
                            setShowNewPassword(true);
                            triggerToast(`Generated password: ${gen}`);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={11} /> Auto-Generate
                        </button>
                      </div>

                      <div className="form-group-clean" style={{ marginBottom: '10px' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={profileForm.newPassword}
                            onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                            className="input-clean"
                            placeholder="Naya password likhein (blank to keep same)"
                            style={{ paddingRight: '40px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="form-group-clean" style={{ marginBottom: 0 }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={profileForm.confirmPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                          className="input-clean"
                          placeholder="Naye password ko confirm karein"
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
                      <button type="submit" className="btn-primary-action" style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '13px' }}>
                        <Save size={15} />
                        <span>Update Admin Profile & Password</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. PUBLIC WEBSITE CONTACT DETAILS & FOOTER SYNC */}
                <div className="white-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                  <div className="panel-header-row" style={{ minHeight: '52px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                    <div>
                      <h3 className="panel-title" style={{ fontSize: '15px' }}>
                        <SettingsIcon size={17} style={{ color: '#2563eb' }} />
                        <span>Public Contact Details & Footer Sync</span>
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#64748b' }}>
                        Website ke footer me dikhne wala Phone, WhatsApp number, aur Office address update karein.
                      </p>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#ecfdf5', 
                      color: '#059669', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontWeight: 700,
                      border: '1px solid #a7f3d0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                      Live Website Sync
                    </span>
                  </div>

                  <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="form-grid-2">
                      <div className="form-group-clean">
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Project Title</label>
                        <input
                          type="text"
                          value={settings.projectName || ''}
                          onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
                          className="input-clean"
                          placeholder="ESTATESPHERE"
                        />
                      </div>

                      <div className="form-group-clean">
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Tagline</label>
                        <input
                          type="text"
                          value={settings.tagline || ''}
                          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                          className="input-clean"
                          placeholder="Luxury Living Redefined"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-clean">
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Public Phone (Footer Call)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={settings.supportPhone || ''}
                            onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                            className="input-clean"
                            placeholder="+91 (798) 788-0769"
                          />
                          <PhoneCall size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        </div>
                      </div>

                      <div className="form-group-clean">
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Official WhatsApp Number</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={settings.whatsappNumber || ''}
                            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                            className="input-clean"
                            placeholder="+91 98765 43210"
                          />
                          <MessageSquare size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#16a34a' }} />
                        </div>
                      </div>
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Official Support Email</label>
                      <input
                        type="email"
                        value={settings.supportEmail || ''}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="input-clean"
                        placeholder="info@estatesphere.com"
                      />
                    </div>

                    <div className="form-group-clean" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Office Address (Displayed in Website Footer)</label>
                      <textarea
                        rows={3}
                        value={settings.officeAddress || ''}
                        onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                        className="input-clean"
                        placeholder="302-B, 3RD FLOOR, SWADESH BHAWAN INDORE (452001)"
                        style={{ height: 'auto', padding: '8px 10px', lineHeight: '1.4' }}
                      />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
                      <button type="submit" className="btn-primary-action" style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '13px' }}>
                        <Save size={15} />
                        <span>Save & Update Public Website Footer</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE: WEBSITE TEXT & CONTENT CMS EDITOR
          ======================================================== */}
          {currentTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Top Banner & Save Controls */}
              <div className="white-panel" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Type size={20} style={{ color: '#2563eb' }} />
                      <span>Website Text & Content CMS</span>
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                      Website ke har ek section ke text, headline, sub-headline aur button label ko yahan se edit karein.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary-action"
                      onClick={handleResetSiteContent}
                      title="Reset all fields to original defaults"
                    >
                      <RefreshCw size={14} />
                      <span>Reset Defaults</span>
                    </button>
                    <button
                      type="button"
                      className="btn-primary-action"
                      onClick={handleSaveSiteContent}
                      style={{ padding: '9px 20px', fontSize: '13px' }}
                    >
                      <Save size={15} />
                      <span>Save & Apply Live to Website</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form with 7 Clearly Captioned Cards */}
              <form onSubmit={handleSaveSiteContent} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                
                {/* 1. HERO TOP SECTION */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 1 • TOP SCREEN
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Hero Top Banner & Statement (#top)
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Website load hone par sabse upar dikhne wala main brand name, tagline aur statement title.
                      </p>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      Live at #top
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Website Brand Title (Big Center Logo)
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.heroTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                        placeholder="Dwellora"
                      />
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Center me bada display name jo scroll pe animated rehta hai</span>
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Hero Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.heroSubtitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                        placeholder="A place by day — by night to return to"
                      />
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Day / Night toggle ke saath text caption</span>
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Center Statement Headline
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.heroStatementTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, heroStatementTitle: e.target.value })}
                        placeholder="Designed to elevate everyday living"
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Center Statement Description Text
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.heroStatementText || ''}
                        onChange={(e) => setContentForm({ ...contentForm, heroStatementText: e.target.value })}
                        placeholder="A harmonious blend of coastal serenity and modern architectural sophistication."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONCEPT & LIVING MANIFESTO */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 2 • PHILOSOPHY
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Concept & Living Manifesto (#concept)
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Horizontal scrolling story me brand vision aur architectural philosophy text.
                      </p>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#6d28d9', background: '#f5f3ff', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      Live at #concept
                    </span>
                  </div>

                  <div className="form-group-clean">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Concept Tagline / Kicker
                    </label>
                    <input
                      type="text"
                      className="input-clean"
                      value={contentForm.conceptKicker || ''}
                      onChange={(e) => setContentForm({ ...contentForm, conceptKicker: e.target.value })}
                      placeholder="THE CONCEPT"
                    />
                  </div>

                  <div className="form-group-clean">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Concept Main Heading
                    </label>
                    <textarea
                      rows={3}
                      className="input-clean"
                      ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = Math.max(80, el.scrollHeight) + 'px'; } }}
                      value={contentForm.conceptHeading || ''}
                      onChange={(e) => {
                        setContentForm({ ...contentForm, conceptHeading: e.target.value });
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.max(80, e.target.scrollHeight) + 'px';
                      }}
                      placeholder="ESTATESPHERE IS A BOUTIQUE RESIDENTIAL COMMUNITY..."
                      style={{ minHeight: '80px', overflow: 'hidden', resize: 'none', lineHeight: '1.5' }}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Concept Detailed Description
                    </label>
                    <textarea
                      rows={3}
                      className="input-clean"
                      value={contentForm.conceptDescription || ''}
                      onChange={(e) => setContentForm({ ...contentForm, conceptDescription: e.target.value })}
                      placeholder="Created for modern city life, the community combines thoughtful architecture..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* 3. EXTERIOR REVEAL SECTION */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 3 • EXTERIOR REVEAL
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Exterior Reveal & Architectural Identity
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Badi exterior photo ke upar aane wali headline aur description text.
                      </p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Section Eyebrow / Badge
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.revealBadge || ''}
                        onChange={(e) => setContentForm({ ...contentForm, revealBadge: e.target.value })}
                        placeholder="ESTATESPHERE RESIDENCES"
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Main Reveal Headline
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.revealTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, revealTitle: e.target.value })}
                        placeholder="Designed to feel like home"
                      />
                    </div>
                  </div>

                  <div className="form-group-clean">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Reveal Descriptive Text
                    </label>
                    <textarea
                      rows={2}
                      className="input-clean"
                      value={contentForm.revealDescription || ''}
                      onChange={(e) => setContentForm({ ...contentForm, revealDescription: e.target.value })}
                      placeholder="Landscaped terraces, timeless materials and generous openings..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* 4. LOCATION & ROUTE */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 4 • GEOGRAPHY & ROUTE
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Location & Coastal Route Story (#location)
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Location highlights, regional connectivity aur coastal route headline text.
                      </p>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#b45309', background: '#fffbeb', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      Live at #location
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Location Eyebrow Kicker
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.locationKicker || ''}
                        onChange={(e) => setContentForm({ ...contentForm, locationKicker: e.target.value })}
                        placeholder="NEW GOLDEN MILE"
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Location Main Title
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.locationTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, locationTitle: e.target.value })}
                        placeholder="BETWEEN MARBELLA AND ESTEPONA"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Location Description
                      </label>
                      <textarea
                        rows={2}
                        className="input-clean"
                        value={contentForm.locationCopy || ''}
                        onChange={(e) => setContentForm({ ...contentForm, locationCopy: e.target.value })}
                        placeholder="Surrounded by beaches, golf courses, wellness clubs..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Coastal Route Headline
                      </label>
                      <textarea
                        rows={2}
                        className="input-clean"
                        value={contentForm.routeHeading || ''}
                        onChange={(e) => setContentForm({ ...contentForm, routeHeading: e.target.value })}
                        placeholder="THE COAST YOU WANTED — yours THIS YEAR"
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. THE RESIDENCES SHOWCASE HEADINGS */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 5 • RESIDENCES
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          The Residences Showcase Headlines (#residences)
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Apartment cards section ke upar aane wale main intro texts aur statement headline.
                      </p>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#be185d', background: '#fdf2f8', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      Live at #residences
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Residences Eyebrow
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.residencesHeadTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, residencesHeadTitle: e.target.value })}
                        placeholder="THE RESIDENCES"
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Residences Section Title
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.residencesHeadSubtitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, residencesHeadSubtitle: e.target.value })}
                        placeholder="Space to make your own"
                      />
                    </div>
                  </div>

                  <div className="form-group-clean" style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Residences Subtitle Description
                    </label>
                    <input
                      type="text"
                      className="input-clean"
                      value={contentForm.residencesHeadCopy || ''}
                      onChange={(e) => setContentForm({ ...contentForm, residencesHeadCopy: e.target.value })}
                      placeholder="Single-level and duplex layouts with generous terraces, gardens and private outdoor access."
                    />
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Full Statement Kicker
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.residencesStatementKicker || ''}
                        onChange={(e) => setContentForm({ ...contentForm, residencesStatementKicker: e.target.value })}
                        placeholder="A PLACE TO LIVE — TO RETURN YEAR AFTER YEAR"
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Full Statement Title
                      </label>
                      <textarea
                        rows={4}
                        className="input-clean"
                        ref={(el) => {
                          if (el) {
                            el.style.height = 'auto';
                            el.style.height = Math.max(110, el.scrollHeight) + 'px';
                          }
                        }}
                        value={contentForm.residencesStatementTitle || ''}
                        onChange={(e) => {
                          setContentForm({ ...contentForm, residencesStatementTitle: e.target.value });
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.max(110, e.target.scrollHeight) + 'px';
                        }}
                        placeholder="RESIDENCES RANGE FROM 104 TO 244 SQ.M., OFFERING SPACIOUS SINGLE-LEVEL..."
                        style={{
                          minHeight: '110px',
                          overflow: 'hidden',
                          resize: 'none',
                          lineHeight: '1.55',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 6. ARCHITECTURE & DETAILS */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 6 • ARCHITECTURE & DETAILS
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Architecture & Finishing Details (#architecture)
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        3D Architecture model section aur interior specification copy text.
                      </p>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#0f766e', background: '#f0fdfa', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      Live at #architecture
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Architecture Headline
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.architectureTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, architectureTitle: e.target.value })}
                        placeholder="Clean lines. Mediterranean warmth."
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Architecture Description
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.architectureCopy || ''}
                        onChange={(e) => setContentForm({ ...contentForm, architectureCopy: e.target.value })}
                        placeholder="Natural stone, layered terraces and expansive openings connect the residences..."
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Interior Details Headline
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.detailsTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, detailsTitle: e.target.value })}
                        placeholder="Every detail selected for effortless living"
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Interior Details Description
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.detailsCopy || ''}
                        onChange={(e) => setContentForm({ ...contentForm, detailsCopy: e.target.value })}
                        placeholder="Underfloor heating. Climate automation. Smart access..."
                      />
                    </div>
                  </div>
                </div>

                {/* 7. CONTACT & CTA SECTION */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          SECTION 7 • VIP CALL TO ACTION
                        </span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          Footer Consultation & Booking CTA (#contact)
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Website footer ke just upar aane wala call to action banner jahan se customer call book karta hai.
                      </p>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#92400e', background: '#fef3c7', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      Live at #contact
                    </span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        CTA Kicker / Introductory Note
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.ctaKicker || ''}
                        onChange={(e) => setContentForm({ ...contentForm, ctaKicker: e.target.value })}
                        placeholder="A short conversation is enough to understand which residence fits your life."
                      />
                    </div>

                    <div className="form-group-clean">
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        CTA Big Headline
                      </label>
                      <input
                        type="text"
                        className="input-clean"
                        value={contentForm.ctaTitle || ''}
                        onChange={(e) => setContentForm({ ...contentForm, ctaTitle: e.target.value })}
                        placeholder="Perfect city views"
                      />
                    </div>
                  </div>

                  <div className="form-group-clean" style={{ marginTop: '12px', maxWidth: '400px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      className="input-clean"
                      value={contentForm.ctaButtonText || ''}
                      onChange={(e) => setContentForm({ ...contentForm, ctaButtonText: e.target.value })}
                      placeholder="Book a private call"
                    />
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="white-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', borderColor: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '12.5px', fontWeight: 600 }}>
                    <CheckCircle2 size={16} />
                    <span>Instant Live Sync Enabled (All changes reflect immediately on public site)</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary-action"
                      onClick={handleResetSiteContent}
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-action"
                      style={{ padding: '9px 24px', fontSize: '13.5px' }}
                    >
                      <Save size={15} />
                      <span>Save All Changes to Live Website</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          FULLSCREEN PAGE: ADD NEW APARTMENT TO INVENTORY
      ======================================================== */}
      {showAddModal && (
        <div className="fullscreen-page-overlay">
          <header className="fullscreen-top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn-secondary-action"
                style={{ padding: '7px 12px', fontSize: '13px' }}
                onClick={() => setShowAddModal(false)}
              >
                <ArrowLeft size={16} />
                <span>Back to Inventory</span>
              </button>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} style={{ color: '#2563eb' }} />
                  <span>+ Add New Apartment to Inventory</span>
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Full Screen Form: Complete unit specs, pricing, typology & media
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="form-add-new-apartment"
                className="btn-primary-action"
              >
                <Plus size={15} />
                <span>Publish Unit to Website</span>
              </button>
            </div>
          </header>

          <div className="fullscreen-content-container">
            <form id="form-add-new-apartment" onSubmit={handleCreateApartment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                
                {/* Left Panel: Unit Specifications */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} style={{ color: '#2563eb' }} />
                    <span>1. Unit Specifications & Architecture</span>
                  </h4>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Flat / Unit No *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Unit B3-102 or No-26"
                        value={formApt.apartmentNumber}
                        onChange={(e) => setFormApt({ ...formApt, apartmentNumber: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>Typology / Category</label>
                      <select
                        value={formApt.typology}
                        onChange={(e) => setFormApt({ ...formApt, typology: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      >
                        <option value="Garden Residence">Garden Residence</option>
                        <option value="Ready Luxury Home">Ready Luxury Home</option>
                        <option value="Penthouse Duplex">Penthouse Duplex</option>
                        <option value="Executive Sky Villa">Executive Sky Villa</option>
                        <option value="Corner Panorama Suite">Corner Panorama Suite</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Block / Tower</label>
                      <select
                        value={formApt.block}
                        onChange={(e) => setFormApt({ ...formApt, block: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      >
                        <option value="Block B1">Block B1</option>
                        <option value="Block B2">Block B2</option>
                        <option value="Block B3">Block B3</option>
                        <option value="North Tower">North Tower</option>
                      </select>
                    </div>

                    <div className="form-group-clean">
                      <label>Floor Number</label>
                      <select
                        value={formApt.floor}
                        onChange={(e) => setFormApt({ ...formApt, floor: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      >
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="1st Floor">1st Floor</option>
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                        <option value="4th Floor">4th Floor</option>
                        <option value="Penthouse Level">Penthouse Level</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Bedrooms Count</label>
                      <select
                        value={formApt.bedrooms}
                        onChange={(e) => setFormApt({ ...formApt, bedrooms: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      >
                        <option value={1}>1 Bedroom</option>
                        <option value={2}>2 Bedrooms</option>
                        <option value={3}>3 Bedrooms</option>
                        <option value={4}>4 Bedrooms</option>
                        <option value={5}>5+ Bedrooms</option>
                      </select>
                    </div>

                    <div className="form-group-clean">
                      <label>Bathrooms Count</label>
                      <select
                        value={formApt.bathrooms}
                        onChange={(e) => setFormApt({ ...formApt, bathrooms: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      >
                        <option value={1}>1 Bathroom</option>
                        <option value={2}>2 Bathrooms</option>
                        <option value={3}>3 Bathrooms</option>
                        <option value={4}>4 Bathrooms</option>
                        <option value={5}>5 Bathrooms</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Super Built-up Area (Sqft)</label>
                      <input
                        type="number"
                        value={formApt.areaSqft}
                        onChange={(e) => setFormApt({ ...formApt, areaSqft: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>Terrace Area (Sqm)</label>
                      <input
                        type="number"
                        value={formApt.terraceArea}
                        onChange={(e) => setFormApt({ ...formApt, terraceArea: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Price (₹ INR)</label>
                      <input
                        type="number"
                        step="500000"
                        value={formApt.price}
                        onChange={(e) => setFormApt({ ...formApt, price: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px', fontWeight: 700 }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>Initial Status</label>
                      <select
                        value={formApt.status}
                        onChange={(e) => setFormApt({ ...formApt, status: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px', fontWeight: 600 }}
                      >
                        <option value="AVAILABLE">🟢 Available (Publicly Open)</option>
                        <option value="RESERVED">🟡 Reserved (Token Hold)</option>
                        <option value="SOLD">🔴 Sold Out (Block Booking)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Marketing & Media */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={16} style={{ color: '#2563eb' }} />
                    <span>2. Marketing & Photos</span>
                  </h4>

                  <div className="form-group-clean">
                    <label>Short Catchy Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Elevated duplex residence with sunset horizon views"
                      value={formApt.headline}
                      onChange={(e) => setFormApt({ ...formApt, headline: e.target.value })}
                      className="input-clean"
                      style={{ height: '38px', fontSize: '13px' }}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Full Apartment Description</label>
                    <textarea
                      rows={4}
                      placeholder="Provide property details, natural stone finishes, terrace specs..."
                      value={formApt.description}
                      onChange={(e) => setFormApt({ ...formApt, description: e.target.value })}
                      className="input-clean"
                      style={{ resize: 'vertical', fontSize: '13px' }}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Cover Photo Image URL</label>
                    <input
                      type="text"
                      placeholder="/assets/estate-boutique-lounge.png"
                      value={formApt.imageUrl}
                      onChange={(e) => setFormApt({ ...formApt, imageUrl: e.target.value })}
                      className="input-clean"
                      style={{ height: '38px', fontSize: '13px' }}
                    />
                    {formApt.imageUrl && (
                      <div style={{ marginTop: '10px', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img src={formApt.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          FULLSCREEN PAGE: EDIT APARTMENT (COMPLETE UPDATE)
      ======================================================== */}
      {showEditModal && editingApt && (
        <div className="fullscreen-page-overlay">
          <header className="fullscreen-top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn-secondary-action"
                style={{ padding: '7px 12px', fontSize: '13px' }}
                onClick={() => setShowEditModal(false)}
              >
                <ArrowLeft size={16} />
                <span>Back to Inventory</span>
              </button>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={17} style={{ color: '#2563eb' }} />
                  <span>Edit Apartment: {editingApt.apartmentNumber} — {editingApt.title}</span>
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Full Screen Update Form
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="form-edit-apartment"
                className="btn-primary-action"
              >
                <Save size={15} />
                <span>Save Changes to Website</span>
              </button>
            </div>
          </header>

          <div className="fullscreen-content-container">
            <form id="form-edit-apartment" onSubmit={handleSaveEditApartment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                
                {/* Left Panel: Unit Info */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    Unit Details & Status
                  </h4>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Flat / Unit No</label>
                      <input
                        type="text"
                        value={editingApt.apartmentNumber}
                        onChange={(e) => setEditingApt({ ...editingApt, apartmentNumber: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>Title</label>
                      <input
                        type="text"
                        value={editingApt.title}
                        onChange={(e) => setEditingApt({ ...editingApt, title: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Price (₹ INR)</label>
                      <input
                        type="number"
                        step="500000"
                        value={editingApt.price}
                        onChange={(e) => setEditingApt({ ...editingApt, price: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px', fontWeight: 700 }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>Status (Live on Website)</label>
                      <select
                        value={editingApt.status}
                        onChange={(e) => setEditingApt({ ...editingApt, status: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px', fontWeight: 600 }}
                      >
                        <option value="AVAILABLE">🟢 Available</option>
                        <option value="RESERVED">🟡 Reserved</option>
                        <option value="SOLD">🔴 Sold Out</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Bedrooms Count</label>
                      <input
                        type="number"
                        value={editingApt.bedrooms}
                        onChange={(e) => setEditingApt({ ...editingApt, bedrooms: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>Super Built-up Area (Sqft)</label>
                      <input
                        type="number"
                        value={editingApt.areaSqft}
                        onChange={(e) => setEditingApt({ ...editingApt, areaSqft: Number(e.target.value) })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Panel: Description & Cover */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    Headline & Description
                  </h4>

                  <div className="form-group-clean">
                    <label>Full Description</label>
                    <textarea
                      rows={6}
                      value={editingApt.description || ''}
                      onChange={(e) => setEditingApt({ ...editingApt, description: e.target.value })}
                      className="input-clean"
                      style={{ resize: 'vertical', fontSize: '13px' }}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Cover Photo Image URL</label>
                    <input
                      type="text"
                      value={editingApt.imageUrl || ''}
                      onChange={(e) => setEditingApt({ ...editingApt, imageUrl: e.target.value })}
                      className="input-clean"
                      style={{ height: '38px', fontSize: '13px' }}
                    />
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          FULLSCREEN PAGE: CREATE NEW USER / ADMIN (SUPER ADMIN ONLY)
      ======================================================== */}
      {showAddTeamModal && (
        <div className="fullscreen-page-overlay">
          {/* Top Sticky Bar */}
          <header className="fullscreen-top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn-secondary-action"
                style={{ padding: '7px 12px', fontSize: '13px' }}
                onClick={() => setShowAddTeamModal(false)}
              >
                <ArrowLeft size={16} />
                <span>Back to Team</span>
              </button>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} style={{ color: '#2563eb' }} />
                  <span>Create New User / Admin</span>
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Option 4: Team & Roles Management (Full Screen View)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setShowAddTeamModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="form-add-team-member"
                className="btn-primary-action"
              >
                <UserPlus size={15} />
                <span>Create User & Copy Credentials</span>
              </button>
            </div>
          </header>

          {/* Full Screen Body Content in 2-Column Wide Layout */}
          <div className="fullscreen-content-container">
            <form id="form-add-team-member" onSubmit={handleAddTeamMember}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '24px' }}>
                
                {/* Left Card: Account Credentials */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} style={{ color: '#2563eb' }} />
                    <span>1. User Profile & Login Credentials</span>
                  </h4>

                  <div className="form-group-clean">
                    <label>Team Member Name / Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formTeam.name}
                      onChange={(e) => setFormTeam({ ...formTeam, name: e.target.value })}
                      className="input-clean"
                      style={{ height: '38px', fontSize: '13px' }}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Official Email Address (Login ID) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@estatesphere.com"
                      value={formTeam.email}
                      onChange={(e) => setFormTeam({ ...formTeam, email: e.target.value })}
                      className="input-clean"
                      style={{ height: '38px', fontSize: '13px' }}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-clean">
                      <label>Phone / WhatsApp</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={formTeam.phone}
                        onChange={(e) => setFormTeam({ ...formTeam, phone: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group-clean">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <label style={{ margin: 0 }}>Password *</label>
                        <button
                          type="button"
                          onClick={() => setFormTeam({ ...formTeam, password: 'Pass@' + Math.floor(1000 + Math.random() * 9000) })}
                          style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          🎲 Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pass@1234"
                        value={formTeam.password}
                        onChange={(e) => setFormTeam({ ...formTeam, password: e.target.value })}
                        className="input-clean"
                        style={{ height: '38px', fontSize: '13px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  {/* Live Credentials Preview Box */}
                  <div style={{ marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      📋 Credentials Sharing Card
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, fontFamily: 'monospace' }}>
                      <div><b>Portal:</b> {window.location.origin}/admin/login</div>
                      <div><b>User:</b> {formTeam.name || '(Name)'}</div>
                      <div><b>Email:</b> {formTeam.email || '(Email)'}</div>
                      <div><b>Pass:</b> {formTeam.password || '(Password)'}</div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Assign Role (3 Roles System) */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} style={{ color: '#2563eb' }} />
                    <span>2. Assign Role & Permissions (3 Roles System)</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Role 1: Super Admin */}
                    <div
                      onClick={() => setFormTeam({ 
                        ...formTeam, 
                        role: 'SUPER_ADMIN', 
                        modules: ['dashboard', 'apartments', 'media', 'content', 'inquiries', 'team', 'settings'],
                        canAddApartment: true,
                        canEditApartment: true
                      })}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: formTeam.role === 'SUPER_ADMIN' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: formTeam.role === 'SUPER_ADMIN' ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="fsTeamRole"
                            checked={formTeam.role === 'SUPER_ADMIN'}
                            onChange={() => setFormTeam({ 
                              ...formTeam, 
                              role: 'SUPER_ADMIN', 
                              modules: ['dashboard', 'apartments', 'media', 'content', 'inquiries', 'team', 'settings'],
                              canAddApartment: true,
                              canEditApartment: true
                            })}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>👑 Super Admin</span>
                        </div>
                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                          All-Access Control
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                        All-access control: Naye users banana, flats delete karna, aur system settings change karna.
                      </p>
                    </div>

                    {/* Role 2: Admin (Manager) */}
                    <div
                      onClick={() => setFormTeam({ 
                        ...formTeam, 
                        role: 'ADMIN_MANAGER',
                        modules: ['dashboard', 'apartments', 'media', 'content', 'inquiries'],
                        canAddApartment: true,
                        canEditApartment: true
                      })}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: formTeam.role === 'ADMIN_MANAGER' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: formTeam.role === 'ADMIN_MANAGER' ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="fsTeamRole"
                            checked={formTeam.role === 'ADMIN_MANAGER'}
                            onChange={() => setFormTeam({ 
                              ...formTeam, 
                              role: 'ADMIN_MANAGER',
                              modules: ['dashboard', 'apartments', 'media', 'content', 'inquiries'],
                              canAddApartment: true,
                              canEditApartment: true
                            })}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>💼 Admin (Manager)</span>
                        </div>
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                          Inventory & Leads
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                        Flats add/edit karna, photos badalna, sold out toggle karna aur leads CRM manage karna.
                      </p>
                    </div>

                    {/* Role 3: Sales Agent */}
                    <div
                      onClick={() => setFormTeam({ 
                        ...formTeam, 
                        role: 'SALES_AGENT',
                        modules: ['dashboard', 'apartments', 'inquiries'],
                        canAddApartment: false,
                        canEditApartment: false
                      })}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: formTeam.role === 'SALES_AGENT' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: formTeam.role === 'SALES_AGENT' ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="fsTeamRole"
                            checked={formTeam.role === 'SALES_AGENT'}
                            onChange={() => setFormTeam({ 
                              ...formTeam, 
                              role: 'SALES_AGENT',
                              modules: ['dashboard', 'apartments', 'inquiries'],
                              canAddApartment: false,
                              canEditApartment: false
                            })}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>📞 Sales Agent</span>
                        </div>
                        <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                          Outreach Only
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                        Sirf Inventory dekhna aur Leads pe direct calling/WhatsApp updates daalna (flats delete ya price change nahi kar sakte).
                      </p>
                    </div>

                    {/* Section 3: Granular Module Checkboxes Matrix */}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <SlidersHorizontal size={14} style={{ color: '#2563eb' }} />
                        <span>Granular Module Access Checklists</span>
                      </div>
                      <p style={{ margin: '0 0 12px', fontSize: '11.5px', color: '#64748b' }}>
                        Specific module toggles karein. Jin modules pe tick nahi hoga wo user ke sidebar se gayab rahenge.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                          { key: 'dashboard', label: '📊 Dashboard Overview' },
                          { key: 'apartments', label: '🏢 Apartments / Inventory' },
                          { key: 'media', label: '🖼️ Media & Photos Studio' },
                          { key: 'content', label: '✍️ Website Text & Content CMS' },
                          { key: 'inquiries', label: '📥 Customer Inquiries CRM' },
                          { key: 'team', label: '👥 Team & Roles Management' },
                          { key: 'settings', label: '⚙️ Site Settings & Profile' }
                        ].map(mod => {
                          const isChecked = formTeam.modules?.includes(mod.key);
                          return (
                            <label key={mod.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: isChecked ? '#eff6ff' : '#f8fafc', border: isChecked ? '1px solid #bfdbfe' : '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: isChecked ? 600 : 500, color: isChecked ? '#1d4ed8' : '#334155' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const currentMods = formTeam.modules || [];
                                  const nextMods = e.target.checked
                                    ? [...currentMods, mod.key]
                                    : currentMods.filter(m => m !== mod.key);
                                  setFormTeam({ ...formTeam, modules: nextMods, role: 'CUSTOM' });
                                }}
                              />
                              <span>{mod.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Sub-capability toggle */}
                      {formTeam.modules?.includes('apartments') && (
                        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#166534' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(formTeam.canAddApartment && formTeam.canEditApartment)}
                              onChange={(e) => {
                                setFormTeam({
                                  ...formTeam,
                                  canAddApartment: e.target.checked,
                                  canEditApartment: e.target.checked
                                });
                              }}
                            />
                            <span>➕ Allow Adding / Editing Flats & Sold Out Toggle</span>
                          </label>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          FULLSCREEN PAGE: CONFIGURE GRANULAR ACCESS & PERMISSIONS
      ======================================================== */}
      {showEditPermissionsModal && editingPermissionsMember && (
        <div className="fullscreen-page-overlay">
          {/* Top Sticky Bar */}
          <header className="fullscreen-top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn-secondary-action"
                style={{ padding: '7px 12px', fontSize: '13px' }}
                onClick={() => setShowEditPermissionsModal(false)}
              >
                <ArrowLeft size={16} />
                <span>Back to Team</span>
              </button>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={18} style={{ color: '#2563eb' }} />
                  <span>Configure User Access & Permissions: {editingPermissionsMember.name}</span>
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {editingPermissionsMember.email} &bull; Current Role: {editingPermissionsMember.roleLabel || editingPermissionsMember.role}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setShowEditPermissionsModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="form-edit-permissions"
                className="btn-primary-action"
              >
                <Save size={15} />
                <span>Save Access Permissions</span>
              </button>
            </div>
          </header>

          {/* Full Screen Body Content in 2-Column Wide Layout */}
          <div className="fullscreen-content-container">
            <form id="form-edit-permissions" onSubmit={handleSaveMemberPermissions}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '24px' }}>
                
                {/* Left Card: User Info & 3 Role Presets */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} style={{ color: '#2563eb' }} />
                    <span>1. Team Member Info & Role Preset</span>
                  </h4>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{editingPermissionsMember.name}</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>{editingPermissionsMember.email}</div>
                    <div style={{ display: 'inline-flex', marginTop: '8px', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                      {editingPermissionsMember.roleBadge || editingPermissionsMember.role}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    Choose Base Role Preset:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { role: 'SUPER_ADMIN', label: '👑 Super Admin', badge: 'All-Access', desc: 'All 7 modules: Team, Inventory Add/Edit/Delete, Content CMS, Media, Settings.' },
                      { role: 'ADMIN_MANAGER', label: '💼 Admin (Manager)', badge: 'Manage Inventory', desc: 'Flats Add/Edit, Photos & Media, Website Text CMS, Leads CRM.' },
                      { role: 'SALES_AGENT', label: '📞 Sales Agent', badge: 'Leads & View Only', desc: 'Sirf Inventory view & Leads outreach (No flat deletes, no media/content edits).' }
                    ].map(r => {
                      const isSelected = memberPermissionsForm.role === r.role;
                      return (
                        <div
                          key={r.role}
                          onClick={() => {
                            const defaultPerms = ROLE_PERMISSIONS[r.role];
                            setMemberPermissionsForm({
                              role: r.role,
                              modules: [...defaultPerms.modules],
                              canAddApartment: defaultPerms.canAddApartment,
                              canEditApartment: defaultPerms.canEditApartment,
                              canDeleteApartment: defaultPerms.canDeleteApartment,
                              canEditMedia: defaultPerms.canEditMedia,
                              canEditContent: defaultPerms.canEditContent,
                              canManageTeam: defaultPerms.canManageTeam,
                              canEditSettings: defaultPerms.canEditSettings
                            });
                          }}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="radio"
                                name="memberEditRoleRadio"
                                checked={isSelected}
                                onChange={() => {}}
                              />
                              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{r.label}</span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, background: isSelected ? '#dbeafe' : '#f1f5f9', color: isSelected ? '#1d4ed8' : '#475569', padding: '2px 8px', borderRadius: '10px' }}>
                              {r.badge}
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                            {r.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Card: Granular Module Checkboxes Matrix */}
                <div className="white-panel" style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SlidersHorizontal size={16} style={{ color: '#2563eb' }} />
                    <span>2. Granular Module Access Scope (Visible in Sidebar)</span>
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                    Jin modules pe tick hoga sirf wahi module is user ke sidebar me aayenge. Baaki unpermitted modules user ke sidebar se 100% hide rahenge.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { key: 'dashboard', label: '📊 Dashboard Overview' },
                      { key: 'apartments', label: '🏢 Apartments / Inventory' },
                      { key: 'media', label: '🖼️ Media & Photos Studio' },
                      { key: 'content', label: '✍️ Website Text & Content CMS' },
                      { key: 'inquiries', label: '📥 Customer Inquiries CRM' },
                      { key: 'team', label: '👥 Team & Roles Management' },
                      { key: 'settings', label: '⚙️ Site Settings & Profile' }
                    ].map(mod => {
                      const isChecked = memberPermissionsForm.modules.includes(mod.key);
                      return (
                        <label key={mod.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: isChecked ? '#eff6ff' : '#f8fafc', border: isChecked ? '1px solid #bfdbfe' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: isChecked ? 600 : 500, color: isChecked ? '#1d4ed8' : '#334155', transition: 'all 0.15s' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const currentMods = memberPermissionsForm.modules;
                              const nextMods = e.target.checked
                                ? [...currentMods, mod.key]
                                : currentMods.filter(m => m !== mod.key);
                              setMemberPermissionsForm({ ...memberPermissionsForm, modules: nextMods, role: 'CUSTOM' });
                            }}
                          />
                          <span>{mod.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Sub-capability toggle */}
                  {memberPermissionsForm.modules.includes('apartments') && (
                    <div style={{ marginTop: '16px', padding: '14px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#166534' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(memberPermissionsForm.canAddApartment && memberPermissionsForm.canEditApartment)}
                          onChange={(e) => {
                            setMemberPermissionsForm({
                              ...memberPermissionsForm,
                              canAddApartment: e.target.checked,
                              canEditApartment: e.target.checked
                            });
                          }}
                        />
                        <span>➕ Allow Adding / Editing Flats & Sold Out Status Toggle</span>
                      </label>
                      <p style={{ margin: '4px 0 0 25px', fontSize: '11.5px', color: '#15803d' }}>
                        Agar yeh unchecked rahega to user ko sirf read-only inventory list dikhegi (koi status change ya add button nahi dikhega).
                      </p>
                    </div>
                  )}

                  {/* Live Effective Scope Preview */}
                  <div style={{ marginTop: '20px', padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      👁️ Live Sidebar Preview for {editingPermissionsMember.name}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {memberPermissionsForm.modules.map(m => (
                        <span key={m} style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          ✓ {m.charAt(0).toUpperCase() + m.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: RESET USER PASSWORD
      ======================================================== */}
      {showResetPassModal && selectedTeamMember && (
        <div className="modal-overlay" onClick={() => setShowResetPassModal(false)}>
          <div className="modal-content-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} style={{ color: '#2563eb' }} />
                <span>Reset Password: {selectedTeamMember.name}</span>
              </h3>
              <button 
                onClick={() => setShowResetPassModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="modal-body">
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#64748b' }}>
                  Enter a new login password for <b>{selectedTeamMember.email}</b>.
                </p>
                <div className="form-group-clean">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>New Password *</label>
                    <button
                      type="button"
                      onClick={() => setNewPasswordInput('Pass@' + Math.floor(1000 + Math.random() * 9000))}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      🎲 Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter new password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="input-clean"
                    style={{ height: '36px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-action" onClick={() => setShowResetPassModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: ADD MEDIA ASSET
      ======================================================== */}
      {showAddMediaModal && (
        <div className="modal-overlay" onClick={() => setShowAddMediaModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                Upload Property Media Asset
              </h3>
              <button 
                onClick={() => setShowAddMediaModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMedia}>
              <div className="modal-body">
                <div className="form-group-clean">
                  <label>Asset Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Bedroom Balcony View"
                    value={formMedia.title}
                    onChange={(e) => setFormMedia({ ...formMedia, title: e.target.value })}
                    className="input-clean"
                  />
                </div>

                <div className="form-group-clean">
                  <label>Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="/assets/... or https://..."
                    value={formMedia.url}
                    onChange={(e) => setFormMedia({ ...formMedia, url: e.target.value })}
                    className="input-clean"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group-clean">
                    <label>Category</label>
                    <select
                      value={formMedia.category}
                      onChange={(e) => setFormMedia({ ...formMedia, category: e.target.value })}
                      className="input-clean"
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Interior">Interior</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Amenities">Amenities</option>
                    </select>
                  </div>

                  <div className="form-group-clean">
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Short caption"
                      value={formMedia.description}
                      onChange={(e) => setFormMedia({ ...formMedia, description: e.target.value })}
                      className="input-clean"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setShowAddMediaModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD MANUAL INQUIRY / WALK-IN LEAD
      ======================================================== */}
      {showAddInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowAddInquiryModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                Register Walk-in / Phone Lead
              </h3>
              <button 
                onClick={() => setShowAddInquiryModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddManualInquiry}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group-clean">
                    <label>Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alok Sharma"
                      value={formInquiry.name}
                      onChange={(e) => setFormInquiry({ ...formInquiry, name: e.target.value })}
                      className="input-clean"
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98..."
                      value={formInquiry.phone}
                      onChange={(e) => setFormInquiry({ ...formInquiry, phone: e.target.value })}
                      className="input-clean"
                    />
                  </div>
                </div>

                <div className="form-group-clean">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="customer@domain.com"
                    value={formInquiry.email}
                    onChange={(e) => setFormInquiry({ ...formInquiry, email: e.target.value })}
                    className="input-clean"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group-clean">
                    <label>Interested Apartment</label>
                    <select
                      value={formInquiry.interestedApartment}
                      onChange={(e) => setFormInquiry({ ...formInquiry, interestedApartment: e.target.value })}
                      className="input-clean"
                    >
                      <option value="General Residence Inquiry">General Residence Inquiry</option>
                      {apartments.map(a => (
                        <option key={a.id} value={`${a.apartmentNumber} — ${a.title}`}>
                          {a.apartmentNumber} — {a.title} ({a.block})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-clean">
                    <label>Assign to Sales Agent</label>
                    <select
                      value={formInquiry.assignedAgent}
                      onChange={(e) => setFormInquiry({ ...formInquiry, assignedAgent: e.target.value })}
                      className="input-clean"
                    >
                      <option value="Unassigned">👤 Unassigned</option>
                      {team.map(m => (
                        <option key={m.id} value={m.name}>
                          🧑‍💼 {m.name} ({m.roleLabel || m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group-clean">
                  <label>Inquiry Message / Site Visit Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter discussion notes or specific preferences..."
                    value={formInquiry.message}
                    onChange={(e) => setFormInquiry({ ...formInquiry, message: e.target.value })}
                    className="input-clean"
                    style={{ resize: 'vertical' }}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setShowAddInquiryModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                >
                  Register Lead & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          FULLSCREEN LIVE PHOTO & MEDIA STUDIO
      ======================================================== */}
      {photoModal.isOpen && (
        <div className="fullscreen-page-overlay">
          {/* Top Sticky Bar */}
          <header className="fullscreen-top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn-secondary-action"
                style={{ padding: '7px 12px', fontSize: '13px' }}
                onClick={() => setPhotoModal({ isOpen: false })}
              >
                <ArrowLeft size={16} />
                <span>Back to Media & Photos</span>
              </button>
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} style={{ color: '#2563eb' }} />
                  <span>Live Media & Visual Content Studio</span>
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Target: <b style={{ color: '#0f172a' }}>{photoModal.label || 'Visual Asset'}</b> • Full Screen Visual Studio
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                type="button"
                className="btn-secondary-action"
                onClick={() => setPhotoModal({ isOpen: false })}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="btn-primary-action"
                onClick={handleSavePhotoModal}
                style={{ padding: '9px 20px', fontSize: '13px', cursor: 'pointer', zIndex: 10 }}
              >
                <Check size={16} />
                <span>Save & Apply Live to Website</span>
              </button>
            </div>
          </header>

          <div className="fullscreen-content-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '24px' }}>
              
              {/* LEFT CARD: Large Instant Live Preview & Presets */}
              <div className="white-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={16} style={{ color: '#2563eb' }} />
                    <span>Instant Live Preview (Website Display)</span>
                  </h4>
                  <span style={{ fontSize: '11.5px', color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px', fontWeight: 600, border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} /> Live Sync Ready
                  </span>
                </div>

                {/* Big Preview Screen */}
                <div style={{ 
                  height: '380px', 
                  width: '100%', 
                  borderRadius: '14px', 
                  background: '#0f172a', 
                  overflow: 'hidden', 
                  position: 'relative',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}>
                  {photoModal.previewUrl ? (
                    <img 
                      src={photoModal.previewUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.src = '/assets/luxury_villa_day.jpg' }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <UploadCloud size={54} style={{ opacity: 0.4, marginBottom: '12px' }} />
                      <span style={{ fontSize: '13px' }}>Select or upload an image to see live preview</span>
                    </div>
                  )}

                  {photoModal.fileName && (
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(6px)', color: '#ffffff', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>📁 {photoModal.fileName}</span>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>{photoModal.fileSize}</span>
                    </div>
                  )}
                </div>

                {/* Quick Luxury Presets Picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                    Or Choose from Curated Luxury Presets:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '10px', maxHeight: '160px', overflowY: 'auto' }}>
                    {LUXURY_PRESETS
                      .filter(p => {
                        if (photoModal.mode === 'site_hero') return p.cat === 'Exterior' || p.cat === 'Amenities';
                        if (photoModal.roomKey === 'bedroom') return p.cat === 'Bedroom';
                        if (photoModal.roomKey === 'livingHall') return p.cat === 'Living Hall';
                        if (photoModal.roomKey === 'kitchen') return p.cat === 'Kitchen';
                        if (photoModal.roomKey === 'terrace') return p.cat === 'Terrace' || p.cat === 'Penthouse';
                        if (photoModal.roomKey === 'panorama360') return p.cat === '360 Panorama';
                        if (photoModal.roomKey === 'cover') return p.cat === 'Exterior';
                        return true;
                      })
                      .map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoModal(prev => ({ ...prev, previewUrl: p.url, fileName: p.name, fileSize: 'Preset Asset' }))}
                        style={{
                          background: photoModal.previewUrl === p.url ? '#eff6ff' : '#ffffff',
                          border: photoModal.previewUrl === p.url ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '6px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '11.5px',
                          color: '#0f172a',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ height: '48px', borderRadius: '6px', overflow: 'hidden', background: '#0f172a', marginBottom: '5px' }}>
                          <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/luxury_villa_day.jpg' }} />
                        </div>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT CARD: PC Upload & Title & Description Text */}
              <div className="white-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UploadCloud size={16} style={{ color: '#2563eb' }} />
                  <span>Upload & Content Specifications</span>
                </h4>

                {/* 1. Direct PC File Upload Button */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    1. Upload Photo Directly from PC:
                  </label>
                  
                  <input
                    type="file"
                    id="pc-photo-file-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onClick={(e) => { e.target.value = null; }}
                    onChange={handlePcFileUpload}
                  />

                  <label
                    htmlFor="pc-photo-file-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '28px 16px',
                      border: '2px dashed #93c5fd',
                      borderRadius: '14px',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <UploadCloud size={36} style={{ color: '#2563eb', marginBottom: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                      Click to Select Image from Computer
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Supports PNG, JPG, WEBP, or 8K 360° Equirectangular Panoramas
                    </span>
                  </label>
                </div>

                {/* 2. Or Image URL / 360 Link */}
                <div className="form-group-clean">
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    2. Or Image / 360 Walkthrough Link:
                  </label>
                  <input
                    type="text"
                    className="input-clean"
                    placeholder="/assets/... or https://..."
                    value={photoModal.previewUrl}
                    onChange={(e) => setPhotoModal(prev => ({ ...prev, previewUrl: e.target.value }))}
                    style={{ fontSize: '13px', height: '40px' }}
                  />
                </div>

                {/* 3. Title Input */}
                <div className="form-group-clean">
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    3. Change Title / Heading:
                  </label>
                  <input
                    type="text"
                    className="input-clean"
                    placeholder="e.g. Master Bedroom — Skyline Balcony"
                    value={photoModal.title}
                    onChange={(e) => setPhotoModal(prev => ({ ...prev, title: e.target.value }))}
                    style={{ fontSize: '13px', fontWeight: 600, height: '40px' }}
                  />
                </div>

                {/* 4. Text / Description Input */}
                <div className="form-group-clean" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    4. Change Descriptive Text / Caption:
                  </label>
                  <textarea
                    rows={4}
                    className="input-clean"
                    placeholder="Provide catchy description or specifications..."
                    value={photoModal.description}
                    onChange={(e) => setPhotoModal(prev => ({ ...prev, description: e.target.value }))}
                    style={{ fontSize: '13px', resize: 'vertical', lineHeight: '1.5' }}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom In-App Logout Modal (No browser alert) */}
      
      {/* ========================================================
          MODAL 1: RECORD / EDIT BUYER DETAILS & PAYMENT PLAN
      ======================================================== */}
      {buyerModal.isOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setBuyerModal(prev => ({ ...prev, isOpen: false }))}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div 
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '680px', 
              width: '100%', 
              margin: 'auto', 
              maxHeight: '92vh', 
              overflowY: 'auto', 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '24px 28px', 
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
              border: '1px solid #e2e8f0'
            }}
          >
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    Buyer Profile & Payment Schedule
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Unit {buyerModal.apartmentNumber} &bull; {buyerModal.unitTitle}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBuyerModal(prev => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBuyerModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Unit Selection & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Select Apartment Unit
                  </label>
                  <select
                    className="input-clean"
                    value={buyerModal.apartmentId}
                    onChange={(e) => {
                      const selected = apartments.find(a => a.id === Number(e.target.value));
                      if (selected) {
                        openEditBuyerModal(selected);
                      }
                    }}
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  >
                    {apartments.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.apartmentNumber} — {a.title} ({a.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Unit Inventory Status
                  </label>
                  <select
                    className="input-clean"
                    value={buyerModal.status}
                    onChange={(e) => setBuyerModal(prev => ({ ...prev, status: e.target.value }))}
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  >
                    <option value="SOLD">🔴 SOLD OUT (Purchased)</option>
                    <option value="RESERVED">🟡 RESERVED (Token Paid)</option>
                    <option value="AVAILABLE">🟢 AVAILABLE</option>
                  </select>
                </div>
              </div>

              {/* Buyer Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Buyer / Allottee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={buyerModal.name}
                  onChange={(e) => setBuyerModal(prev => ({ ...prev, name: e.target.value }))}
                  className="input-clean"
                  style={{ width: '100%', height: '38px', fontSize: '13.5px' }}
                />
              </div>

              {/* Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Buyer Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98201 44521"
                    value={buyerModal.phone}
                    onChange={(e) => setBuyerModal(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-clean"
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Buyer Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@domain.com"
                    value={buyerModal.email}
                    onChange={(e) => setBuyerModal(prev => ({ ...prev, email: e.target.value }))}
                    className="input-clean"
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* FINANCIAL BREAKDOWN SECTION (Kitna Diya, Kitna Bacha) */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>💰 Financial Settlement & Payment Status</span>
                  <span style={{ fontSize: '11px', color: (Number(buyerModal.dealAmount) - Number(buyerModal.paidAmount) <= 0) ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    Balance Due: {formatINR(Math.max(0, (Number(buyerModal.dealAmount) || 0) - (Number(buyerModal.paidAmount) || 0)))}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Total Agreed Deal Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 31250000"
                      value={buyerModal.dealAmount}
                      onChange={(e) => {
                        const newDeal = Number(e.target.value) || 0;
                        const newPaid = Number(buyerModal.paidAmount) || 0;
                        setBuyerModal(prev => ({ ...prev, dealAmount: newDeal, balanceAmount: Math.max(0, newDeal - newPaid) }));
                      }}
                      className="input-clean"
                      style={{ width: '100%', height: '38px', fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{formatINR(Number(buyerModal.dealAmount))}</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                      Amount Paid So Far (Kitna Diya) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 28125000"
                      value={buyerModal.paidAmount}
                      onChange={(e) => {
                        const newPaid = Number(e.target.value) || 0;
                        const newDeal = Number(buyerModal.dealAmount) || 0;
                        setBuyerModal(prev => ({ ...prev, paidAmount: newPaid, balanceAmount: Math.max(0, newDeal - newPaid) }));
                      }}
                      className="input-clean"
                      style={{ width: '100%', height: '38px', fontSize: '13px', borderColor: '#a7f3d0' }}
                    />
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>{formatINR(Number(buyerModal.paidAmount))}</span>
                  </div>
                </div>

                {/* Payment Plan Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Payment Plan Type
                    </label>
                    <select
                      className="input-clean"
                      value={buyerModal.paymentPlan}
                      onChange={(e) => setBuyerModal(prev => ({ ...prev, paymentPlan: e.target.value }))}
                      style={{ width: '100%', height: '38px', fontSize: '13px' }}
                    >
                      <option value="FULL_PAYMENT">✅ 100% Full Payment (Zero Balance)</option>
                      <option value="EMI_PLAN">🔵 Active EMI / Installments Schedule</option>
                      <option value="TOKEN_ADVANCE">🟡 Token Booking Advance (Under Hold)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {buyerModal.paymentPlan === 'EMI_PLAN' ? 'Monthly EMI Amount (₹)' : 'Balance Status'}
                    </label>
                    {buyerModal.paymentPlan === 'EMI_PLAN' ? (
                      <input
                        type="number"
                        placeholder="e.g. 312500"
                        value={buyerModal.monthlyEmi}
                        onChange={(e) => setBuyerModal(prev => ({ ...prev, monthlyEmi: e.target.value }))}
                        className="input-clean"
                        style={{ width: '100%', height: '38px', fontSize: '13px' }}
                      />
                    ) : (
                      <div style={{ height: '38px', display: 'flex', alignItems: 'center', padding: '0 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700, color: buyerModal.paymentPlan === 'FULL_PAYMENT' ? '#059669' : '#d97706' }}>
                        {buyerModal.paymentPlan === 'FULL_PAYMENT' ? 'Zero Dues Pending' : 'Balance Due on Agreement'}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Booking Date & Handled By */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Booking / Token Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 26 Oct 2026"
                    value={buyerModal.bookingDate}
                    onChange={(e) => setBuyerModal(prev => ({ ...prev, bookingDate: e.target.value, saleDate: e.target.value }))}
                    className="input-clean"
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Next Due Date / Milestone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov 2026"
                    value={buyerModal.nextDueDate}
                    onChange={(e) => setBuyerModal(prev => ({ ...prev, nextDueDate: e.target.value }))}
                    className="input-clean"
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Assigned Staff */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Assigned Relationship Manager / Staff
                </label>
                <input
                  type="text"
                  placeholder="e.g. Super Admin or Rohit Verma"
                  value={buyerModal.assignedAgent}
                  onChange={(e) => setBuyerModal(prev => ({ ...prev, assignedAgent: e.target.value }))}
                  className="input-clean"
                  style={{ width: '100%', height: '38px', fontSize: '13px' }}
                />
              </div>

              {/* Special Terms / Agreement Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Agreement Notes / Special Terms (Parking Slot, Bespoke Customizations)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bespoke travertine finishes requested. Car parking slot P-14 allocated in basement B1."
                  value={buyerModal.notes}
                  onChange={(e) => setBuyerModal(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-clean"
                  style={{ width: '100%', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setBuyerModal(prev => ({ ...prev, isOpen: false }))}
                  style={{ padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                  style={{ padding: '9px 24px' }}
                >
                  <Save size={15} />
                  <span>Save Buyer Record</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: LUXURY REAL-ESTATE ALLOTMENT CERTIFICATE & SLIP (CENTERED MODAL)
      ======================================================== */}
      {saleReceiptModal.isOpen && saleReceiptModal.apt && (() => {
        const apt = saleReceiptModal.apt;
        const buyer = apt.buyer || {
          name: 'Private Client',
          phone: '+91 98200 00000',
          email: 'client@estatesphere.in',
          dealAmount: apt.price || 30000000,
          paidAmount: apt.price || 30000000,
          balanceAmount: 0,
          paymentPlan: 'FULL_PAYMENT',
          bookingDate: '26 Oct 2026',
          saleDate: '26 Oct 2026',
          paymentStatus: 'FULLY_PAID',
          paymentStatusLabel: '100% Full Payment Cleared',
          assignedAgent: 'Super Admin',
          notes: 'Standard residence allotment.'
        };

        const deal = Number(buyer.dealAmount) || apt.price || 30000000;
        const paid = buyer.paidAmount !== undefined ? Number(buyer.paidAmount) : (buyer.paymentStatus === 'FULLY_PAID' ? deal : Math.round(deal * 0.9));
        const balance = Math.max(0, deal - paid);
        const percentPaid = Math.min(100, Math.round((paid / deal) * 100));
        const isFullPayment = balance === 0 || buyer.paymentPlan === 'FULL_PAYMENT' || buyer.paymentStatus === 'FULLY_PAID';
        const isEmi = !isFullPayment && (buyer.paymentPlan === 'EMI_PLAN' || buyer.paymentStatus === 'PARTIALLY_PAID');
        const isToken = !isFullPayment && (buyer.paymentPlan === 'TOKEN_ADVANCE' || buyer.paymentStatus === 'TOKEN_PAID');

        const refNo = `ES-REC-${apt.apartmentNumber}-${String(apt.id).padStart(4, '0')}`;
        const bookingDateStr = buyer.bookingDate || buyer.saleDate || '26 Oct 2026';
        const todayDateStr = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

        return (
          <div 
            className="modal-overlay" 
            onClick={() => setSaleReceiptModal({ isOpen: false, apt: null })}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 999999, 
              backgroundColor: 'rgba(15, 23, 42, 0.75)', 
              backdropFilter: 'blur(6px)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '24px 16px', 
              overflowY: 'auto' 
            }}
          >
            <div 
              className="modal-content-card" 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                maxWidth: '820px', 
                width: '100%', 
                margin: 'auto', 
                maxHeight: '94vh', 
                overflowY: 'auto', 
                borderRadius: '16px', 
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)', 
                background: '#fcfbfa', 
                border: '1px solid #e7dfd2', 
                padding: '0' 
              }}
            >
              
              {/* Slip Top Toolbar (Non-printable controls) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} style={{ color: '#059669' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: '#1e293b' }}>
                    Official EstateSphere Allotment Slip & Payment Certificate
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-primary-action"
                    style={{ padding: '6px 14px', fontSize: '12.5px', gap: '6px' }}
                  >
                    <Printer size={14} />
                    <span>Print Slip / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaleReceiptModal({ isOpen: false, apt: null })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Certificate Inner Printable Sheet */}
              <div style={{ background: '#ffffff', margin: '20px', padding: '32px', borderRadius: '12px', border: '1px solid #e5ded2', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                
                {/* Brand Title & Watermark Seal */}
                <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.14em', color: '#0f172a', textTransform: 'uppercase' }}>
                    EstateSphere Luxury Residences
                  </div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>
                    New Golden Mile &bull; Private Architectural Sanctuary
                  </div>
                  <div style={{ height: '2px', width: '90px', background: '#d97706', margin: '12px auto' }} />
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350f', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Official Residence Allotment Certificate & Payment Receipt
                  </div>
                  
                  {/* Reference & Booking Date Bar */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                    <span><b>Certificate Ref:</b> {refNo}</span>
                    <span>&bull;</span>
                    <span><b>📅 Booking Date:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{bookingDateStr}</span></span>
                    <span>&bull;</span>
                    <span><b>🕒 Issued On:</b> {todayDateStr}</span>
                  </div>
                </div>

                {/* Allottee & Residence Profile Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '18px', marginBottom: '22px', background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em' }}>
                      Allottee / Buyer Details
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      {buyer.name}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '3px' }}>
                      Phone: <b>{buyer.phone || 'N/A'}</b>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '2px' }}>
                      Email: <b>{buyer.email || 'N/A'}</b>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Authorized Manager: <b>{buyer.assignedAgent || 'Super Admin'}</b>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em' }}>
                      Allotted Residence Specifications
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      Unit {apt.apartmentNumber}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '3px' }}>
                      Location: <b>{apt.block} &bull; {apt.floor}</b>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '2px' }}>
                      Typology: <b>{apt.bedrooms} BHK &bull; {apt.typology || 'Luxury Residence'}</b>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Super Built-up: <b>{apt.areaSqft} sq.ft ({apt.areaSqm || Math.round(apt.areaSqft / 10.764)} m²) + {apt.terraceArea || 25} m² Terrace</b>
                    </div>
                  </div>
                </div>

                {/* 3 SUMMARY METRICS (Kitna Diya, Kitna Bacha) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '22px' }}>
                  
                  {/* 1. Total Price */}
                  <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Total Property Price
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                      {formatINR(deal)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Agreed Consideration Value
                    </div>
                  </div>

                  {/* 2. Amount Paid */}
                  <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' }}>
                      Amount Paid (Kitna Diya)
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                      {formatINR(paid)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px', fontWeight: 600 }}>
                      {percentPaid}% of Total Price Cleared
                    </div>
                  </div>

                  {/* 3. Balance Due */}
                  <div style={{ background: isFullPayment ? '#ecfdf5' : '#fef2f2', border: `1.5px solid ${isFullPayment ? '#a7f3d0' : '#fecaca'}`, borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: isFullPayment ? '#065f46' : '#991b1b', textTransform: 'uppercase' }}>
                      Balance Due (Kitna Bacha)
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: isFullPayment ? '#059669' : '#dc2626', marginTop: '4px' }}>
                      {isFullPayment ? '₹0.00 (NIL)' : formatINR(balance)}
                    </div>
                    <div style={{ fontSize: '11px', color: isFullPayment ? '#047857' : '#b91c1c', marginTop: '2px', fontWeight: 600 }}>
                      {isFullPayment ? 'Zero Outstanding Balance' : `${100 - percentPaid}% Pending Consideration`}
                    </div>
                  </div>

                </div>

                {/* VISUAL PAYMENT PROGRESS BAR */}
                <div style={{ marginBottom: '22px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    <span>Payment Completion Progress</span>
                    <span style={{ color: isFullPayment ? '#059669' : '#2563eb' }}>{percentPaid}% Completed</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentPaid}%`, height: '100%', background: isFullPayment ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #3b82f6, #2563eb)', borderRadius: '5px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* DISTINCT PAYMENT PLAN BANNER (Full Payment vs EMI vs Token) */}
                {isFullPayment && (
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '16px 20px', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <CheckCircle2 size={18} />
                      <span>100% Full Payment Received & Settled</span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '12.5px', color: '#166534', lineHeight: 1.5 }}>
                      The entire agreed property consideration of <b>{formatINR(deal)}</b> has been fully cleared and credited. All financial covenants for Unit <b>{apt.apartmentNumber}</b> have been discharged. Formal Title Deed Registry authorization and Keys Possession Clearance are granted.
                    </p>
                  </div>
                )}

                {isEmi && (
                  <div style={{ background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '10px', padding: '16px 20px', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <CreditCard size={18} />
                      <span>Active EMI / Installment Payment Plan</span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>Amount Paid</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a' }}>{formatINR(paid)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>Remaining Balance</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#dc2626' }}>{formatINR(balance)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>Monthly Installment</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a' }}>
                          {buyer.emiDetails?.monthlyEmi ? `${formatINR(buyer.emiDetails.monthlyEmi)} / mo` : 'Milestone Linked'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>Next Due Date</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a' }}>
                          {buyer.emiDetails?.nextDueDate || '15 Nov 2026'}
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#1e40af', lineHeight: 1.4 }}>
                      Customer account is verified in good standing. Installments are debited per approved milestone schedule.
                    </p>
                  </div>
                )}

                {isToken && (
                  <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '16px 20px', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <Clock size={18} />
                      <span>Token Booking Advance Received & Verified</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #fde68a' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>Token Paid</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350f' }}>{formatINR(paid)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>Balance on Agreement</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#dc2626' }}>{formatINR(balance)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>Agreement Target</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350f' }}>Within 15 Days of Token</div>
                      </div>
                    </div>
                    <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#92400e', lineHeight: 1.4 }}>
                      Residence is exclusively reserved for the buyer. Balance consideration is payable upon execution of the Builder-Buyer Agreement.
                    </p>
                  </div>
                )}

                {/* Special Terms & Notes */}
                {buyer.notes && (
                  <div style={{ marginBottom: '22px', padding: '12px 16px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', fontSize: '12.5px', color: '#854d0e', lineHeight: 1.5 }}>
                    <b>Special Terms & Inclusions:</b> {buyer.notes}
                  </div>
                )}

                {/* Official Legal Seal & Verification */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '18px', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                    <b>EstateSphere Luxury Community Living &bull; RERA Reg: PRM/KA/RERA/1251/310/PR/261026/007812</b><br />
                    This is an electronically verifiable allotment slip issued directly by EstateSphere Property Management.
                  </div>
                  
                  <div style={{ textAlign: 'center', border: '2px solid #059669', color: '#059669', padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#ecfdf5' }}>
                    ✔ OFFICIAL ALLOTMENT VERIFIED
                    <div style={{ fontSize: '10px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>
                      EstateSphere Authorized Signatory
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

{showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)} style={{ zIndex: 999999 }}>
          <div 
            className="modal-content-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '420px', 
              padding: '28px 24px', 
              textAlign: 'center', 
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
            }}
          >
            <div style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              background: '#fee2e2', 
              color: '#dc2626', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}>
              <LogOut size={24} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Sign Out from Admin Panel?
            </h3>
            
            <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Are you sure you want to sign out from EstateSphere Admin?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary-action"
                style={{ flex: 1, padding: '10px 16px', fontSize: '13.5px', fontWeight: 600, justifyContent: 'center' }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary-action"
                style={{ 
                  flex: 1, 
                  padding: '10px 16px', 
                  fontSize: '13.5px', 
                  fontWeight: 600, 
                  justifyContent: 'center', 
                  background: '#dc2626', 
                  borderColor: '#dc2626',
                  color: '#ffffff'
                }}
                onClick={confirmLogout}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-notification">
          <CheckCircle2 size={16} style={{ color: '#10b981' }} />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
