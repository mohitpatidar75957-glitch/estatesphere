// Centralized Real-Time Data Store for EstateSphere
// Connects Website Front-End ("Book a Call", Apartments Catalog, 360 Panoramas) & Admin Portal

const STORAGE_KEYS = {
  APARTMENTS: 'era_apartments_db_v2',
  INQUIRIES: 'era_inquiries_db_v2',
  ACTIVITY: 'era_activity_db_v2',
  TEAM: 'era_team_db_v2',
  MEDIA: 'era_media_db_v2',
  SETTINGS: 'era_settings_db_v2',
  SITE_CONTENT: 'era_site_content_v2'
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[dataStore] localStorage quota warning for key ${key}:`, e);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
      localStorage.setItem(key, value);
    } catch (e2) {
      console.error(`[dataStore] Storage quota still exceeded:`, e2);
    }
  }
};

// Seed 25 realistic apartments matching website & DatabaseSeeder
export const DEFAULT_25_APARTMENTS = Array.from({ length: 25 }, (_, i) => {
  const index = i + 1;
  const blocks = ['Block B1', 'Block B2', 'Block B3'];
  const floors = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];
  const typologies = ['Garden Residence', 'Ready Luxury Home', 'Penthouse Duplex'];
  
  const block = blocks[(index - 1) % blocks.length];
  const floorNum = (index - 1) % 4;
  const floor = floors[floorNum];
  const bedrooms = (index % 2 === 0) ? 2 : (index % 5 === 0 ? 4 : 3);
  const bathrooms = bedrooms >= 3 ? bedrooms : 2;
  const areaSqft = 1250 + (index * 85);
  const terraceArea = 20 + (index * 3);
  const aptNum = `No-${index < 10 ? '0' + index : index}`;
  const price = 25000000 + (index * 1250000); // from ₹2.62 Cr to ₹5.62 Cr
  
  // Realistic initial statuses (18 Available, 4 Reserved, 3 Sold)
  let status = 'AVAILABLE';
  if (index === 3 || index === 7 || index === 14 || index === 21) status = 'RESERVED';
  if (index === 5 || index === 8 || index === 19) status = 'SOLD';

  const typology = floorNum === 3 ? typologies[2] : (floorNum === 0 ? typologies[0] : typologies[1]);

  return {
    id: index,
    title: `${bedrooms} BHK ${typology}`,
    apartmentNumber: aptNum,
    block,
    floor,
    bedrooms,
    bathrooms,
    areaSqft,
    areaSqm: Math.round(areaSqft / 10.764),
    terraceArea,
    typology,
    price,
    status,
    headline: `${bedrooms} Bed Luxury Residence with panoramic skyline views`,
    description: `Elevated residence in ${block} featuring natural travertine stone finishes, open floorplan, Italian modular kitchen, and expansive private terrace.`,
    imageUrl: index % 4 === 0 
      ? '/assets/estate-private-terrace.png' 
      : (index % 3 === 0 
          ? '/assets/estate-apartment-exterior.png' 
          : (index % 2 === 0 
              ? '/assets/estate-boutique-lounge.png' 
              : '/assets/luxury_villa_day.jpg')),
    // Multiple Room Gallery & 3D Walkthrough
    roomGallery: {
      livingHall: '/assets/interior-living-hall.png',
      kitchen: '/assets/interior-kitchen.png',
      bedroom: '/assets/interior-master-bedroom.png',
      terrace: '/assets/estate-private-terrace.png',
      panorama360: index % 2 === 0 ? '/assets/cayley-interior-8k.jpg' : '/assets/kiara-interior-8k.jpg'
    }
  };
});

// Initial inquiries
const DEFAULT_INITIAL_INQUIRIES = [
  {
    id: 101,
    name: 'Vikramaditya Singhania',
    email: 'vikram.singhania@apexcapital.in',
    phone: '+91 98201 44521',
    message: 'Interested in the 3 BHK Penthouse Duplex. Please schedule a private weekend site tour.',
    interestedApartment: 'Unit No-03 — Penthouse Duplex',
    assignedAgent: 'Rohit Verma',
    status: 'VISIT_BOOKED',
    createdAt: new Date().toISOString(),
    displayTime: 'Today, 11:30 AM',
    isToday: true
  },
  {
    id: 102,
    name: 'Ananya Deshmukh',
    email: 'ananya.d@meridianventures.com',
    phone: '+91 98112 33490',
    message: 'Looking for a 2 BHK garden residence for family investment.',
    interestedApartment: 'Unit No-02 — Garden Apartment',
    assignedAgent: 'Super Admin',
    status: 'CONTACTED',
    createdAt: new Date().toISOString(),
    displayTime: 'Today, 09:45 AM',
    isToday: true
  },
  {
    id: 103,
    name: 'Rajesh Mehra',
    email: 'mehra.rajesh@globaltech.co',
    phone: '+91 98710 88231',
    message: 'Please share payment milestone plan and tax breakdown for Unit No-01.',
    interestedApartment: 'Unit No-01 — Three Bedroom Residence',
    assignedAgent: 'Unassigned',
    status: 'NEW',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    displayTime: 'Yesterday, 06:15 PM',
    isToday: false
  },
  {
    id: 104,
    name: 'Kavita Chawla',
    email: 'kavita.c@horizonfin.com',
    phone: '+91 99203 11842',
    message: 'Token advance processed for executive villa. Awaiting agreement copy.',
    interestedApartment: 'Unit No-05 — Executive Sky Villa',
    assignedAgent: 'Super Admin',
    status: 'DEAL_CLOSED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    displayTime: '2 days ago',
    isToday: false
  },
  {
    id: 105,
    name: 'Siddharth Rao',
    email: 'siddharth@raomedia.net',
    phone: '+91 98450 77312',
    message: 'Budget mismatch for current phase. Will consider next tower launch.',
    interestedApartment: 'Unit No-04 — Luxury 2 BHK Residence',
    assignedAgent: 'Rohit Verma',
    status: 'NOT_INTERESTED',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    displayTime: '3 days ago',
    isToday: false
  }
];

// Initial activity feed
const DEFAULT_INITIAL_ACTIVITY = [
  {
    id: 'act-1',
    text: 'Super Admin marked Unit No-05 as SOLD OUT',
    tag: 'STATUS_CHANGE',
    time: '10 mins ago',
    type: 'sold'
  },
  {
    id: 'act-2',
    text: 'New inquiry received from Ananya Deshmukh (Book a Call)',
    tag: 'NEW_LEAD',
    time: '45 mins ago',
    type: 'lead'
  },
  {
    id: 'act-3',
    text: 'Super Admin reserved Unit No-03 for client review',
    tag: 'STATUS_CHANGE',
    time: '2 hours ago',
    type: 'reserved'
  },
  {
    id: 'act-4',
    text: 'Site visit confirmed for Vikramaditya Singhania (Penthouse Duplex)',
    tag: 'SITE_TOUR',
    time: '3 hours ago',
    type: 'tour'
  }
];

// Role-Based Access Control (RBAC) & Custom Permissions Configuration
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    modules: ['dashboard', 'apartments', 'media', 'content', 'inquiries', 'team', 'settings'],
    canAddApartment: true,
    canEditApartment: true,
    canDeleteApartment: true,
    canEditMedia: true,
    canEditContent: true,
    canManageTeam: true,
    canEditSettings: true
  },
  ADMIN_MANAGER: {
    modules: ['dashboard', 'apartments', 'media', 'content', 'inquiries'],
    canAddApartment: true,
    canEditApartment: true,
    canDeleteApartment: false,
    canEditMedia: true,
    canEditContent: true,
    canManageTeam: false,
    canEditSettings: false
  },
  SALES_AGENT: {
    modules: ['dashboard', 'apartments', 'inquiries'],
    canAddApartment: false,
    canEditApartment: false,
    canDeleteApartment: false,
    canEditMedia: false,
    canEditContent: false,
    canManageTeam: false,
    canEditSettings: false
  }
};

// Initial Team Members (3 Core Roles)
const DEFAULT_INITIAL_TEAM = [
  {
    id: 'team-1',
    name: 'Super Admin',
    email: 'superadmin@estatesphere.com',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    roleLabel: 'Super Admin',
    roleBadge: '👑 Super Admin',
    accessLevel: 'All-Access Control (Users, Deletions, Settings)',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
    phone: '+91 98200 11000',
    status: 'ACTIVE',
    joinedDate: 'Jan 2026'
  },
  {
    id: 'team-2',
    name: 'Rohit Verma',
    email: 'manager@estatesphere.com',
    password: 'manager123',
    role: 'ADMIN_MANAGER',
    roleLabel: 'Admin (Manager)',
    roleBadge: '💼 Admin (Manager)',
    accessLevel: 'Flats Add/Edit, Photos, Sold-Out Toggle & Leads',
    permissions: ROLE_PERMISSIONS.ADMIN_MANAGER,
    phone: '+91 98210 22111',
    status: 'ACTIVE',
    joinedDate: 'Mar 2026'
  },
  {
    id: 'team-3',
    name: 'Pooja Sharma',
    email: 'agent@estatesphere.com',
    password: 'agent123',
    role: 'SALES_AGENT',
    roleLabel: 'Sales Agent',
    roleBadge: '📞 Sales Agent',
    accessLevel: 'Inventory View & Leads Outreach (No Deletions)',
    permissions: ROLE_PERMISSIONS.SALES_AGENT,
    phone: '+91 98220 33222',
    status: 'ACTIVE',
    joinedDate: 'May 2026'
  }
];

// Initial Media Assets Catalog
const DEFAULT_INITIAL_MEDIA = [
  {
    id: 'med-1',
    title: 'Estate Exterior — Day Vision',
    category: 'Architecture',
    url: '/assets/luxury_villa_day.jpg',
    description: 'Hero architectural facade under Mediterranean sunlight.',
    dimensions: '3840 x 2160 (4K)'
  },
  {
    id: 'med-2',
    title: 'Estate Exterior — Night Ambient',
    category: 'Architecture',
    url: '/assets/luxury_villa_night.jpg',
    description: 'Illuminated evening view of infinity pool and travertine facade.',
    dimensions: '3840 x 2160 (4K)'
  },
  {
    id: 'med-3',
    title: 'Living Hall & Solarium Deck',
    category: 'Interior',
    url: '/assets/interior-living-hall.png',
    description: 'Open-concept living room with seamless glass sliding doors.',
    dimensions: '2560 x 1440'
  },
  {
    id: 'med-4',
    title: 'Master Bedroom Suite',
    category: 'Interior',
    url: '/assets/interior-master-bedroom.png',
    description: 'Bespoke bedroom suite with private terrace access and dressing room.',
    dimensions: '2560 x 1440'
  },
  {
    id: 'med-5',
    title: 'Italian Designer Kitchen',
    category: 'Interior',
    url: '/assets/interior-kitchen.png',
    description: 'Custom cabinetry, Miele appliances, and waterfall quartz island.',
    dimensions: '2560 x 1440'
  },
  {
    id: 'med-6',
    title: 'Private Solarium Terrace',
    category: 'Penthouse',
    url: '/assets/estate-private-terrace.png',
    description: 'Duplex penthouse rooftop terrace with horizon views.',
    dimensions: '2560 x 1440'
  },
  {
    id: 'med-7',
    title: 'Saltwater Horizon Pool',
    category: 'Amenities',
    url: '/assets/community_pool_1787305166324.jpg',
    description: 'Community infinity pool bordered by olive trees and stone decking.',
    dimensions: '1920 x 1080'
  },
  {
    id: 'med-8',
    title: '360° Panorama — Cayley Interior',
    category: '360 Virtual Tour',
    url: '/assets/cayley-interior-8k.jpg',
    description: 'Interactive 8K equirectangular walkthrough projection.',
    dimensions: '8192 x 4096 (8K 360°)'
  }
];

// Initial Site Global Content (Hero Images, Titles, Community Sections, All Website Copy)
export const DEFAULT_SITE_CONTENT = {
  // 1. Hero Section
  heroDayImage: '/assets/luxury_villa_day.jpg',
  heroNightImage: '/assets/luxury_villa_night.jpg',
  heroTitle: 'Dwellora',
  heroSubtitle: 'A place by day — by night to return to',
  heroStatementTitle: 'Designed to elevate everyday living',
  heroStatementText: 'A harmonious blend of coastal serenity and modern architectural sophistication.',

  // 2. Concept & Reveal Section
  revealImage: '/assets/estate-exterior-reveal.png',
  revealBadge: 'ESTATESPHERE RESIDENCES',
  revealTitle: 'Designed to feel like home',
  revealDescription: 'Landscaped terraces, timeless materials and generous openings connect every residence to light, greenery and calm.',
  conceptKicker: 'THE CONCEPT',
  conceptHeading: 'ESTATESPHERE IS A BOUTIQUE RESIDENTIAL COMMUNITY, DESIGNED AROUND PRIVACY, WELLBEING AND TIMELESS CONTEMPORARY LIVING',
  conceptDescription: 'Created for modern city life, the community combines thoughtful architecture with warm materials, natural landscaping and carefully curated spaces.',

  // 3. Location & Story Section
  locationKicker: 'NEW GOLDEN MILE',
  locationTitle: 'BETWEEN MARBELLA AND ESTEPONA',
  locationCopy: 'Surrounded by beaches, golf courses, wellness clubs and established amenities, with the coast always close.',
  routeHeading: 'THE COAST YOU WANTED — yours THIS YEAR',

  // 4. Residences Section
  residencesHeadTitle: 'THE RESIDENCES',
  residencesHeadSubtitle: 'Space to make your own',
  residencesHeadCopy: 'Single-level and duplex layouts with generous terraces, gardens and private outdoor access.',
  residencesStatementKicker: 'A PLACE TO LIVE — TO RETURN YEAR AFTER YEAR',
  residencesStatementTitle: 'RESIDENCES RANGE FROM 104 TO 244 SQ.M., OFFERING SPACIOUS SINGLE-LEVEL AND DUPLEX LAYOUTS WITH GENEROUS TERRACES AND ROOFTOP SOLARIUMS.',

  // 5. Architecture & Living Details Section
  architectureTitle: 'Clean lines. Mediterranean warmth.',
  architectureCopy: 'Natural stone, layered terraces and expansive openings connect the residences to landscape and light.',
  detailsTitle: 'Every detail selected for effortless living',
  detailsCopy: 'Underfloor heating. Climate automation. Smart access. Adjustable shutters. Materials chosen to age beautifully.',

  // 6. Contact & CTA Section
  ctaKicker: 'A short conversation is enough to understand which residence fits your life.',
  ctaTitle: 'Perfect city views',
  ctaButtonText: 'Book a private call',

  communityFeatures: [
    { 
      id: 'comm-1', 
      title: 'GATED COMMUNITY', 
      image: '/assets/community_exterior_1787305142682.jpg', 
      copy: 'INSTEAD OF CORRIDORS, WALKING PATHS CONNECT the APARTMENTS — MAKING DWELLORA FEEL CLOSER TO A GROUP OF PRIVATE HOMES THAN A STANDARD COMPLEX.' 
    },
    { 
      id: 'comm-2', 
      title: 'SWIMMING POOL', 
      image: '/assets/community_pool_1787305166324.jpg', 
      copy: 'A CALM OASIS FEATURING A SALTWATER POOL, CHILDREN\'S POOL, AND DEDICATED RELAXATION AREAS FOR EVERYDAY WELLBEING.' 
    },
    { 
      id: 'comm-3', 
      title: 'PARKING AREA', 
      image: '/assets/community_parking_1787305178991.jpg', 
      copy: 'SECURE UNDERGROUND PARKING WITH OPTIONAL EV CHARGING STATIONS, ENSURING CONVENIENCE AND PEACE OF MIND.' 
    },
    { 
      id: 'comm-4', 
      title: 'GYM & WELLNESS', 
      image: '/assets/community_gym_1787305191603.jpg', 
      copy: 'A STATE-OF-THE-ART FITNESS CENTER DESIGNED FOR MOVEMENT AND RECOVERY, FEATURING PREMIUM EQUIPMENT.' 
    },
    { 
      id: 'comm-5', 
      title: 'LANDSCAPING', 
      image: '/assets/community_landscaping_1787305205295.jpg', 
      copy: 'MEDITERRANEAN GARDENS SOFTEN EVERY ARCHITECTURAL LINE, INTERTWINING LUSH FOLIAGE WITH OUTDOOR LIVING SPACES.' 
    }
  ]
};

// Initial Settings
const DEFAULT_SETTINGS = {
  projectName: 'EstateSphere Residences',
  tagline: 'Luxury Real Estate & Property Management System',
  supportPhone: '+91 (798) 788-0769',
  whatsappNumber: '+91 98765 43210',
  supportEmail: 'info@estatesphere.com',
  officeAddress: '302-B, 3rd Floor, Swadesh Bhawan, Indore (452001)',
  currency: 'INR',
  enableRealtimeSync: true,
  autoNotifyLeads: true
};

export const dataStore = {
  // --- APARTMENTS ---
  getApartments() {
    const raw = localStorage.getItem(STORAGE_KEYS.APARTMENTS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let needsUpdate = false;
          const normalized = parsed.map(a => {
            if (a.apartmentNumber && (a.apartmentNumber.includes('№') || a.apartmentNumber.startsWith('NO.') || a.apartmentNumber.startsWith('NO '))) {
              needsUpdate = true;
              const intNum = parseInt(a.apartmentNumber.replace(/[^\d]/g, ''), 10) || a.id || 1;
              const newNum = `No-${intNum < 10 ? '0' + intNum : intNum}`;
              return {
                ...a,
                apartmentNumber: newNum,
                title: a.title ? a.title.replace(/№0?\d+/g, newNum).replace(/NO\.\s*\d+/gi, newNum) : a.title
              };
            }
            return a;
          });
          if (needsUpdate) {
            safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(normalized));
          }
          return normalized;
        }
      } catch (_) {}
    }
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(DEFAULT_25_APARTMENTS));
    return DEFAULT_25_APARTMENTS;
  },

  updateApartmentStatus(id, newStatus, userName = 'Admin') {
    const current = this.getApartments();
    const target = current.find(a => a.id === id);
    const updated = current.map(a => a.id === id ? { ...a, status: newStatus } : a);
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));

    if (target) {
      const statusLabel = newStatus === 'SOLD' ? 'SOLD OUT' : (newStatus === 'RESERVED' ? 'RESERVED' : 'AVAILABLE');
      this.addActivity(
        `${userName} marked Unit ${target.apartmentNumber} as ${statusLabel}`,
        newStatus.toLowerCase()
      );
    }

    this.notifyUpdate();
    return updated;
  },

  updateApartment(id, updatedFields, userName = 'Admin') {
    const current = this.getApartments();
    const updated = current.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
    this.addActivity(`${userName} updated details for Unit ${updatedFields.apartmentNumber || id}`, 'edit');
    this.notifyUpdate();
    return updated;
  },

  updateApartmentMedia(id, { imageUrl, roomGallery, title, description, headline }, userName = 'Admin') {
    const current = this.getApartments();
    const updated = current.map(a => {
      if (String(a.id) === String(id)) {
        return {
          ...a,
          imageUrl: imageUrl || a.imageUrl,
          title: title || a.title,
          description: description || a.description,
          headline: headline || a.headline,
          roomGallery: {
            ...a.roomGallery,
            ...roomGallery
          }
        };
      }
      return a;
    });
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
    this.addActivity(`${userName} updated photos and 360° tour for Unit #${id}`, 'media');
    this.notifyUpdate();
    return updated;
  },

  addApartment(aptData, userName = 'Admin') {
    const current = this.getApartments();
    const nextId = current.length > 0 ? Math.max(...current.map(a => a.id)) + 1 : 1;
    const newApt = {
      id: nextId,
      ...aptData,
      status: aptData.status || 'AVAILABLE',
      imageUrl: aptData.imageUrl || '/assets/estate-boutique-lounge.png',
      roomGallery: aptData.roomGallery || {
        livingHall: '/assets/interior-living-hall.png',
        kitchen: '/assets/interior-kitchen.png',
        bedroom: '/assets/interior-master-bedroom.png',
        terrace: '/assets/estate-private-terrace.png',
        panorama360: '/assets/cayley-interior-8k.jpg'
      }
    };
    const updated = [newApt, ...current];
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
    this.addActivity(`${userName} registered new Unit ${newApt.apartmentNumber} (${newApt.title})`, 'add');
    this.notifyUpdate();
    return newApt;
  },

  deleteApartment(id, userName = 'Admin') {
    const current = this.getApartments();
    const target = current.find(a => a.id === id);
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
    if (target) {
      this.addActivity(`${userName} removed Unit ${target.apartmentNumber} from inventory`, 'delete');
    }
    this.notifyUpdate();
    return updated;
  },

  // --- INQUIRIES (FROM WEBSITE "BOOK A CALL") ---
  getInquiries() {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INITIAL_INQUIRIES));
    return DEFAULT_INITIAL_INQUIRIES;
  },

  addInquiry({ name, email, phone, message, interestedApartment = 'General Residence Inquiry', assignedAgent = 'Unassigned' }) {
    const current = this.getInquiries();
    const newInq = {
      id: Date.now(),
      name: name || 'Website Visitor',
      email: email || '',
      phone: phone || '',
      message: message || 'Interested in EstateSphere Residences',
      interestedApartment: interestedApartment || 'General Residence Inquiry',
      assignedAgent: assignedAgent || 'Unassigned',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      displayTime: 'Just now',
      isToday: true
    };

    const updated = [newInq, ...current];
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));

    this.addActivity(
      `New lead received from ${newInq.name} (${newInq.phone}) for ${newInq.interestedApartment}`,
      'lead'
    );

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message, interestedApartment, assignedAgent })
    }).catch(() => {});

    this.notifyUpdate();
    return newInq;
  },

  updateInquiryStatus(id, newStatus, userName = 'Admin') {
    const current = this.getInquiries();
    const target = current.find(i => i.id === id);
    const updated = current.map(i => i.id === id ? { ...i, status: newStatus } : i);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    if (target) {
      this.addActivity(`${userName} updated lead status of ${target.name} to ${newStatus}`, 'lead');
    }
    this.notifyUpdate();
    return updated;
  },

  assignInquiryAgent(id, agentName, userName = 'Admin') {
    const current = this.getInquiries();
    const target = current.find(i => i.id === id);
    const updated = current.map(i => i.id === id ? { ...i, assignedAgent: agentName } : i);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    if (target) {
      this.addActivity(`${userName} assigned lead ${target.name} to agent ${agentName}`, 'team');
    }
    this.notifyUpdate();
    return updated;
  },

  deleteInquiry(id, userName = 'Admin') {
    const current = this.getInquiries();
    const target = current.find(i => i.id === id);
    const updated = current.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    if (target) {
      this.addActivity(`${userName} deleted lead record of ${target.name}`, 'lead');
    }
    this.notifyUpdate();
    return updated;
  },

  // --- RECENT ACTIVITY FEED ---
  getActivityFeed() {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(DEFAULT_INITIAL_ACTIVITY));
    return DEFAULT_INITIAL_ACTIVITY;
  },

  addActivity(text, type = 'info') {
    const current = this.getActivityFeed();
    const newAct = {
      id: `act-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    const updated = [newAct, ...current.slice(0, 24)];
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(updated));
    return updated;
  },

  // --- TEAM & ROLES (SUPER ADMIN ONLY: 3 ROLES + GRANULAR PERMISSIONS) ---
  getTeam() {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee all team members have valid permissions structure
          return parsed.map(m => {
            const defaultPerms = ROLE_PERMISSIONS[m.role] || ROLE_PERMISSIONS.SALES_AGENT;
            return {
              ...m,
              permissions: m.permissions || defaultPerms
            };
          });
        }
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEFAULT_INITIAL_TEAM));
    return DEFAULT_INITIAL_TEAM;
  },

  addTeamMember(memberData, userName = 'Super Admin') {
    const current = this.getTeam();
    const roleKey = memberData.role || 'SALES_AGENT';
    const roleLabel = roleKey === 'SUPER_ADMIN' 
      ? 'Super Admin' 
      : (roleKey === 'ADMIN_MANAGER' || roleKey === 'PROPERTY_MANAGER' ? 'Admin (Manager)' : (roleKey === 'CUSTOM' ? 'Custom Staff' : 'Sales Agent'));
    const roleBadge = roleKey === 'SUPER_ADMIN' 
      ? '👑 Super Admin' 
      : (roleKey === 'ADMIN_MANAGER' || roleKey === 'PROPERTY_MANAGER' ? '💼 Admin (Manager)' : (roleKey === 'CUSTOM' ? '⚙️ Custom Role' : '📞 Sales Agent'));
    const accessLevel = roleKey === 'SUPER_ADMIN' 
      ? 'All-Access Control (Users, Deletions, Settings)' 
      : (roleKey === 'ADMIN_MANAGER' || roleKey === 'PROPERTY_MANAGER' 
          ? 'Flats Add/Edit, Photos, Sold-Out Toggle & Leads' 
          : (roleKey === 'CUSTOM' ? 'Custom Assigned Modules & Permissions' : 'Inventory View & Leads Outreach (No Deletions)'));

    const permissions = memberData.permissions || ROLE_PERMISSIONS[roleKey] || ROLE_PERMISSIONS.SALES_AGENT;

    const newMember = {
      id: `team-${Date.now()}`,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      password: memberData.password ? memberData.password.trim() : 'Sphere@2026',
      role: roleKey,
      roleLabel,
      roleBadge,
      accessLevel,
      permissions,
      phone: memberData.phone ? memberData.phone.trim() : '+91 98000 00000',
      status: 'ACTIVE',
      joinedDate: 'Oct 2026'
    };
    const updated = [...current, newMember];
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.addActivity(`${userName} created new user ${newMember.name} (${roleBadge})`, 'team');
    this.notifyUpdate();
    return newMember;
  },

  updateTeamMemberRole(id, newRole, userName = 'Super Admin') {
    const current = this.getTeam();
    const roleLabel = newRole === 'SUPER_ADMIN' 
      ? 'Super Admin' 
      : (newRole === 'ADMIN_MANAGER' || newRole === 'PROPERTY_MANAGER' ? 'Admin (Manager)' : (newRole === 'CUSTOM' ? 'Custom Staff' : 'Sales Agent'));
    const roleBadge = newRole === 'SUPER_ADMIN' 
      ? '👑 Super Admin' 
      : (newRole === 'ADMIN_MANAGER' || newRole === 'PROPERTY_MANAGER' ? '💼 Admin (Manager)' : (newRole === 'CUSTOM' ? '⚙️ Custom Role' : '📞 Sales Agent'));
    const accessLevel = newRole === 'SUPER_ADMIN' 
      ? 'All-Access Control (Users, Deletions, Settings)' 
      : (newRole === 'ADMIN_MANAGER' || newRole === 'PROPERTY_MANAGER' ? 'Flats Add/Edit, Photos, Sold-Out Toggle & Leads' : 'Inventory View & Leads Outreach (No Deletions)');

    const defaultPerms = ROLE_PERMISSIONS[newRole] || ROLE_PERMISSIONS.SALES_AGENT;

    const updated = current.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          role: newRole, 
          roleLabel, 
          roleBadge, 
          accessLevel,
          permissions: defaultPerms
        };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.addActivity(`${userName} updated role for ${id} to ${roleBadge}`, 'team');
    this.notifyUpdate();
    return updated;
  },

  updateTeamMemberPermissions(id, permissions, newRole = null, userName = 'Super Admin') {
    const current = this.getTeam();
    let updatedName = '';
    const updated = current.map(m => {
      if (m.id === id) {
        updatedName = m.name;
        const assignedRole = newRole || m.role;
        const roleLabel = assignedRole === 'SUPER_ADMIN' 
          ? 'Super Admin' 
          : (assignedRole === 'ADMIN_MANAGER' || assignedRole === 'PROPERTY_MANAGER' ? 'Admin (Manager)' : (assignedRole === 'CUSTOM' ? 'Custom Staff' : 'Sales Agent'));
        const roleBadge = assignedRole === 'SUPER_ADMIN' 
          ? '👑 Super Admin' 
          : (assignedRole === 'ADMIN_MANAGER' || assignedRole === 'PROPERTY_MANAGER' ? '💼 Admin (Manager)' : (assignedRole === 'CUSTOM' ? '⚙️ Custom Role' : '📞 Sales Agent'));
        
        return {
          ...m,
          role: assignedRole,
          roleLabel,
          roleBadge,
          permissions,
          accessLevel: `${permissions.modules.length} Modules: ${permissions.modules.join(', ')}`
        };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.addActivity(`${userName} updated granular access permissions for ${updatedName}`, 'team');
    this.notifyUpdate();
    return updated;
  },

  toggleTeamMemberStatus(id, userName = 'Super Admin') {
    const current = this.getTeam();
    let updatedMember = null;
    const updated = current.map(m => {
      if (m.id === id) {
        if (m.role === 'SUPER_ADMIN' && (m.id === 'team-1' || current.filter(x => x.role === 'SUPER_ADMIN').length <= 1)) {
          return m; // Cannot deactivate primary or only Super Admin
        }
        const nextStatus = m.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
        updatedMember = { ...m, status: nextStatus };
        return updatedMember;
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    if (updatedMember) {
      const actionText = updatedMember.status === 'DEACTIVATED' ? 'deactivated access for' : 'reactivated access for';
      this.addActivity(`${userName} ${actionText} ${updatedMember.name}`, 'team');
    }
    this.notifyUpdate();
    return updated;
  },

  updateTeamMemberPassword(id, newPassword, userName = 'Super Admin') {
    const current = this.getTeam();
    const updated = current.map(m => {
      if (m.id === id) {
        return { ...m, password: newPassword.trim() };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.addActivity(`${userName} reset password for team member ID ${id}`, 'team');
    this.notifyUpdate();
    return updated;
  },

  deleteTeamMember(id, userName = 'Super Admin') {
    const current = this.getTeam();
    const target = current.find(m => m.id === id);
    if (target && target.role === 'SUPER_ADMIN' && (target.id === 'team-1' || current.filter(x => x.role === 'SUPER_ADMIN').length <= 1)) {
      throw new Error('Primary Super Admin cannot be deleted.');
    }
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    if (target) {
      this.addActivity(`${userName} permanently deleted team user ${target.name}`, 'team');
    }
    this.notifyUpdate();
    return updated;
  },

  // --- MEDIA & PHOTOS MANAGER ---
  getMedia() {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(DEFAULT_INITIAL_MEDIA));
    return DEFAULT_INITIAL_MEDIA;
  },

  addMediaItem(item, userName = 'Admin') {
    const current = this.getMedia();
    const newItem = {
      id: `med-${Date.now()}`,
      title: item.title,
      category: item.category || 'Architecture',
      url: item.url,
      description: item.description || 'Property asset visual',
      dimensions: item.dimensions || 'High Resolution'
    };
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    this.addActivity(`${userName} uploaded new media asset: ${newItem.title}`, 'media');
    this.notifyUpdate();
    return newItem;
  },

  updateMediaItem(id, updatedFields, userName = 'Admin') {
    const current = this.getMedia();
    const updated = current.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    this.addActivity(`${userName} updated media asset "${updatedFields.title || id}"`, 'media');
    this.notifyUpdate();
    return updated;
  },

  deleteMediaItem(id, userName = 'Admin') {
    const current = this.getMedia();
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    this.notifyUpdate();
    return updated;
  },

  // --- SITE GLOBAL CONTENT (HERO IMAGES, TEXTS, COMMUNITY, ALL COPY) ---
  getSiteContent() {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SITE_CONTENT, ...parsed };
        }
      } catch (_) {}
    }
    safeSetItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
    return DEFAULT_SITE_CONTENT;
  },

  updateSiteContent(updatedFields, userName = 'Super Admin') {
    const current = this.getSiteContent();
    const updated = { ...current, ...updatedFields };
    safeSetItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(updated));
    this.addActivity(`${userName} updated website images and presentation text`, 'content');
    this.notifyUpdate();
    return updated;
  },

  updateCommunityFeature(id, updatedFeature, userName = 'Super Admin') {
    const current = this.getSiteContent();
    const updatedList = (current.communityFeatures || []).map(f => String(f.id) === String(id) ? { ...f, ...updatedFeature } : f);
    const updated = { ...current, communityFeatures: updatedList };
    safeSetItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(updated));
    this.addActivity(`${userName} updated section "${updatedFeature.title || id}"`, 'content');
    this.notifyUpdate();
    return updated;
  },

  // --- ADMIN PROFILE UPDATE ---
  updateAdminProfile(profileData, currentEmail = 'superadmin@estatesphere.com') {
    const currentTeam = this.getTeam();
    let updatedMember = null;
    const updatedTeam = currentTeam.map(m => {
      const isTarget = (m.email && m.email.toLowerCase() === currentEmail.toLowerCase()) || 
                       (!currentEmail && m.role === 'SUPER_ADMIN') ||
                       (m.id === 'team-1');
      if (isTarget) {
        updatedMember = {
          ...m,
          name: profileData.name ? profileData.name.trim() : m.name,
          email: profileData.email ? profileData.email.trim() : m.email,
          phone: profileData.phone ? profileData.phone.trim() : m.phone,
          password: profileData.password ? profileData.password.trim() : m.password
        };
        return updatedMember;
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updatedTeam));
    this.addActivity(`Admin profile updated for ${profileData.name || currentEmail}`, 'settings');
    this.notifyUpdate();
    return { updatedTeam, updatedMember };
  },

  // --- SITE SETTINGS ---
  getSettings() {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  updateSettings(newSettings, userName = 'Super Admin') {
    const updated = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.addActivity(`${userName} saved updated site configuration`, 'settings');
    this.notifyUpdate();
    return updated;
  },

  // Reset to initial clean state
  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(DEFAULT_25_APARTMENTS));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INITIAL_INQUIRIES));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(DEFAULT_INITIAL_ACTIVITY));
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEFAULT_INITIAL_TEAM));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(DEFAULT_INITIAL_MEDIA));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
    this.notifyUpdate();
  },

  // Event dispatch for real-time reactive sync across components/tabs
  notifyUpdate() {
    window.dispatchEvent(new Event('era_datastore_updated'));
  },

  // Subscription helper for React components
  subscribe(callback) {
    if (typeof window === 'undefined' || typeof callback !== 'function') return () => {};
    const handler = () => callback();
    window.addEventListener('era_datastore_updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('era_datastore_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }
};

export default dataStore;
