// Centralized Real-Time Data Store for EstateSphere
// Connects Website Front-End ("Book a Call", Apartments Catalog, 360 Panoramas) & Admin Portal

const STORAGE_KEYS = {
  APARTMENTS: 'era_apartments_db_v2',
  INQUIRIES: 'era_inquiries_db_v2',
  ACTIVITY: 'era_activity_db_v2',
  TEAM: 'era_team_db_v2',
  MEDIA: 'era_media_db_v2',
  SETTINGS: 'era_settings_db_v2',
  SITE_CONTENT: 'era_site_content_v2',
  PROJECTS: 'era_projects_db_v3',
  BUYERS: 'era_buyers_db_v2',
  SESSIONS: 'era_sessions_db_v1'
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
  let buyer = null;

  if (index === 3) {
    status = 'RESERVED';
    buyer = {
      name: 'Ananya Deshmukh',
      phone: '+91 98112 33490',
      email: 'ananya.deshmukh@fortiscare.org',
      dealAmount: price,
      paidAmount: 1500000,
      balanceAmount: price - 1500000,
      paymentPlan: 'TOKEN_ADVANCE',
      bookingDate: '01 Nov 2026',
      saleDate: '01 Nov 2026',
      paymentStatus: 'TOKEN_PAID',
      paymentStatusLabel: 'Token Advance Received (₹15 Lakh Paid • Balance on Agreement)',
      emiDetails: { tokenAmount: 1500000, nextDueDate: '15 Nov 2026' },
      assignedAgent: 'Rohit Verma (Manager)',
      notes: 'Token received for 3 BHK Duplex. Financing approval in progress.'
    };
  } else if (index === 5) {
    status = 'SOLD';
    buyer = {
      name: 'Vikramaditya Singhania',
      phone: '+91 98201 44521',
      email: 'vikram.singhania@apexcapital.in',
      dealAmount: 31250000,
      paidAmount: 28125000,
      balanceAmount: 3125000,
      paymentPlan: 'EMI_PLAN',
      bookingDate: '26 Oct 2026',
      saleDate: '26 Oct 2026',
      paymentStatus: 'PARTIALLY_PAID',
      paymentStatusLabel: 'Active EMI Plan (90% Paid • ₹31.25 L Balance)',
      emiDetails: { monthlyEmi: 312500, paidInstallments: 9, totalInstallments: 10, nextDueDate: '15 Nov 2026' },
      assignedAgent: 'Super Admin',
      notes: 'Bespoke travertine finishes requested. Final registry scheduled next month.'
    };
  } else if (index === 8) {
    status = 'SOLD';
    buyer = {
      name: 'Dr. Harshvardhan Kapoor',
      phone: '+91 98220 88711',
      email: 'dr.harsh@cardiohealth.in',
      dealAmount: 35000000,
      paidAmount: 17500000,
      balanceAmount: 17500000,
      paymentPlan: 'EMI_PLAN',
      bookingDate: '29 Oct 2026',
      saleDate: '29 Oct 2026',
      paymentStatus: 'PARTIALLY_PAID',
      paymentStatusLabel: 'Milestone / EMI Plan (50% Paid • ₹1.75 Cr Balance)',
      emiDetails: { monthlyEmi: 350000, nextMilestone: 'Structure Complete (5th Floor Slab)', nextDueDate: '20 Dec 2026' },
      assignedAgent: 'Pooja Sharma (Sales Agent)',
      notes: 'Car parking slot P-14 allocated in basement B1.'
    };
  } else if (index === 19) {
    status = 'SOLD';
    buyer = {
      name: 'Sunil & Meera Mittal',
      phone: '+91 98330 99812',
      email: 'sunil.mittal@mittalgroup.com',
      dealAmount: 48750000,
      paidAmount: 48750000,
      balanceAmount: 0,
      paymentPlan: 'FULL_PAYMENT',
      bookingDate: '02 Nov 2026',
      saleDate: '02 Nov 2026',
      paymentStatus: 'FULLY_PAID',
      paymentStatusLabel: '100% Full Payment Cleared (Zero Balance Due)',
      emiDetails: null,
      assignedAgent: 'Super Admin',
      notes: 'All dues cleared. Possession letter and key handover scheduled.'
    };
  } else if (index === 7 || index === 14 || index === 21) {
    status = 'RESERVED';
    buyer = {
      name: index === 7 ? 'Siddharth Oberoi' : (index === 14 ? 'Kavita Chawla' : 'Aditya Roy'),
      phone: index === 7 ? '+91 98101 22345' : (index === 14 ? '+91 98711 55670' : '+91 99200 44321'),
      email: index === 7 ? 'siddharth@oberoiholdings.com' : (index === 14 ? 'kavita.chawla@gmail.com' : 'aditya.roy@zenithtech.io'),
      dealAmount: price,
      saleDate: '31 Oct 2026',
      paymentStatus: 'TOKEN_PAID',
      paymentStatusLabel: 'Holding Token Received',
      assignedAgent: index === 7 ? 'Pooja Sharma (Sales Agent)' : 'Rohit Verma (Manager)',
      notes: 'Client scheduled on-site inspection before final signing.'
    };
  }

  const typology = floorNum === 3 ? typologies[2] : (floorNum === 0 ? typologies[0] : typologies[1]);
  const carpetAreaSqft = Math.round(areaSqft * 0.72);
  const builtUpAreaSqft = Math.round(areaSqft * 0.88);
  const parkingSlot = index % 3 === 0 ? '2 Covered EV Bays' : (index % 2 === 0 ? '1 Covered Basement Slot' : '1 Dedicated Stilt Bay');

  return {
    id: index,
    projectId: 'proj-1',
    projectName: 'Dwellora Residence',
    title: `${bedrooms} BHK ${typology}`,
    apartmentNumber: aptNum,
    block,
    floor,
    bedrooms,
    bathrooms,
    carpetAreaSqft,
    builtUpAreaSqft,
    areaSqft,
    areaSqm: Math.round(areaSqft / 10.764),
    terraceArea,
    typology,
    basePrice: price,
    price,
    parking: parkingSlot,
    amenities: [
      'Italian Marble Flooring',
      'Floor-to-Ceiling Glazing',
      'Smart Home Controls',
      'Designer Modular Kitchen',
      'Private Solarium Balcony'
    ],
    floorPlanUrl: '',
    priceHistory: [],
    status,
    buyer,
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

// Seed Real Estate Master Project (Point 2: Project Management - Single Real Master Enclave)

// ========================================================
// POINT 4: BUYER / CUSTOMER MASTER REGISTRY SEED
// ========================================================
export const DEFAULT_BUYERS = [
  {
    id: 'BUY-2026-001',
    name: 'Ananya Deshmukh',
    phone: '+91 98112 33490',
    altPhone: '+91 98112 33491',
    email: 'ananya.deshmukh@fortiscare.org',
    address: 'Penthouse 402, Horizon Greens, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    occupation: 'Senior Partner & Legal Counsel',
    company: 'Deshmukh & Co Advocates',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'VERIFIED',
      panNumber: 'ABCDE1234F',
      aadhaarNumber: '5412-8921-3401',
      verifiedDate: '01 Nov 2026',
      verifiedBy: 'Super Admin',
      panDocName: 'ananya_pan_card.pdf',
      aadhaarDocName: 'ananya_aadhaar_card.pdf'
    },
    assignedAgent: 'Rohit Verma (Manager)',
    registeredDate: '01 Nov 2026',
    bookedUnits: ['No-03'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-003',
        unitNumber: 'No-03',
        projectName: 'Dwellora Residence',
        bookingDate: '01 Nov 2026',
        agreedPrice: 28750000,
        paidAmount: 1500000,
        balanceAmount: 27250000,
        status: 'RESERVED',
        agreementStatus: 'Under Legal Review',
        paymentPlan: 'TOKEN_ADVANCE'
      }
    ],
    paymentHistory: [
      {
        receiptNo: 'RCP-2026-003',
        date: '01 Nov 2026',
        amount: 1500000,
        paymentMode: 'NEFT / RTGS',
        txnId: 'HDFC0002910481',
        stage: 'Token Holding Advance',
        status: 'CLEARED',
        invoiceNo: 'INV-2026-003'
      }
    ],
    documents: [
      { id: 'doc-1', title: 'Official Booking Receipt (No-03)', type: 'RECEIPT', date: '01 Nov 2026', size: '1.2 MB', url: '#' },
      { id: 'doc-2', title: 'Draft Allotment Agreement', type: 'AGREEMENT', date: '02 Nov 2026', size: '3.4 MB', url: '#' },
      { id: 'doc-3', title: 'KYC PAN & Aadhaar Dossier', type: 'KYC_PROOF', date: '01 Nov 2026', size: '850 KB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '01 Nov 2026 11:30 AM', type: 'CALL', agent: 'Rohit Verma', summary: 'Discussed penthouse solarium deck specifications and agreement draft.', nextFollowUp: '15 Nov 2026' },
      { id: 'comm-2', date: '03 Nov 2026 03:45 PM', type: 'WHATSAPP', agent: 'Rohit Verma', summary: 'Shared high-resolution 360 floor plan and parking allocation slot P-08.' }
    ],
    internalNotes: 'Client preferred Tower B1 due to sunset solarium deck. Pre-approved home loan sanctioned with HDFC Bank.',
    cancellationHistory: []
  },
  {
    id: 'BUY-2026-002',
    name: 'Vikramaditya Singhania',
    phone: '+91 98201 44521',
    altPhone: '+91 98201 44522',
    email: 'vikram.singhania@apexcapital.in',
    address: 'Bungalow 12, Malabar Hill Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400006',
    occupation: 'Managing Director & CIO',
    company: 'Apex Capital Ventures',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'VERIFIED',
      panNumber: 'BKGPS9821M',
      aadhaarNumber: '7821-4412-9012',
      verifiedDate: '26 Oct 2026',
      verifiedBy: 'Super Admin',
      panDocName: 'vikram_pan.pdf',
      aadhaarDocName: 'vikram_aadhaar.pdf'
    },
    assignedAgent: 'Super Admin',
    registeredDate: '26 Oct 2026',
    bookedUnits: ['No-05'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-005',
        unitNumber: 'No-05',
        projectName: 'Dwellora Residence',
        bookingDate: '26 Oct 2026',
        agreedPrice: 31250000,
        paidAmount: 28125000,
        balanceAmount: 3125000,
        status: 'CONFIRMED',
        agreementStatus: 'Executed & Registered',
        paymentPlan: 'EMI_PLAN'
      }
    ],
    paymentHistory: [
      { receiptNo: 'RCP-2026-005A', date: '26 Oct 2026', amount: 5000000, paymentMode: 'RTGS', txnId: 'ICIC000391028', stage: 'Down Payment (15%)', status: 'CLEARED', invoiceNo: 'INV-2026-005' },
      { receiptNo: 'RCP-2026-005B', date: '01 Nov 2026', amount: 23125000, paymentMode: 'RTGS', txnId: 'ICIC000419201', stage: 'Milestone 1-4 Slab Payment', status: 'CLEARED', invoiceNo: 'INV-2026-005B' }
    ],
    documents: [
      { id: 'doc-1', title: 'Executed Buyer Sale Agreement', type: 'AGREEMENT', date: '27 Oct 2026', size: '4.8 MB', url: '#' },
      { id: 'doc-2', title: 'Payment Receipt Cum Tax Invoice', type: 'RECEIPT', date: '01 Nov 2026', size: '1.5 MB', url: '#' },
      { id: 'doc-3', title: 'Basement EV Parking Allotment Letter', type: 'PARKING_LETTER', date: '28 Oct 2026', size: '1.1 MB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '26 Oct 2026 10:00 AM', type: 'MEETING', agent: 'Super Admin', summary: 'On-site sample villa inspection and contract signing.', nextFollowUp: '15 Nov 2026' }
    ],
    internalNotes: 'VIP Investor. Final installment of ₹31.25 Lakh due upon structure hand-over milestone.',
    cancellationHistory: []
  },
  {
    id: 'BUY-2026-003',
    name: 'Dr. Harshvardhan Kapoor',
    phone: '+91 98220 88711',
    altPhone: '',
    email: 'dr.harsh@cardiohealth.in',
    address: 'Plot 45, Jubilee Enclave, Koramangala 4th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    occupation: 'Chief Cardiac Surgeon',
    company: 'Fortis Memorial Healthcare',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'VERIFIED',
      panNumber: 'HKLMN6621R',
      aadhaarNumber: '9012-3341-5521',
      verifiedDate: '29 Oct 2026',
      verifiedBy: 'Pooja Sharma (Sales Agent)',
      panDocName: 'dr_harsh_pan.pdf',
      aadhaarDocName: 'dr_harsh_aadhaar.pdf'
    },
    assignedAgent: 'Pooja Sharma (Sales Agent)',
    registeredDate: '29 Oct 2026',
    bookedUnits: ['No-08'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-008',
        unitNumber: 'No-08',
        projectName: 'Dwellora Residence',
        bookingDate: '29 Oct 2026',
        agreedPrice: 35000000,
        paidAmount: 17500000,
        balanceAmount: 17500000,
        status: 'CONFIRMED',
        agreementStatus: 'Executed & Registered',
        paymentPlan: 'EMI_PLAN'
      }
    ],
    paymentHistory: [
      { receiptNo: 'RCP-2026-008A', date: '29 Oct 2026', amount: 17500000, paymentMode: 'Cheque / Clearing', txnId: 'CHQ-991204', stage: 'Booking & Foundation Milestone (50%)', status: 'CLEARED', invoiceNo: 'INV-2026-008' }
    ],
    documents: [
      { id: 'doc-1', title: 'Allotment Letter & Unit Specs (No-08)', type: 'ALLOTMENT_LETTER', date: '29 Oct 2026', size: '2.1 MB', url: '#' },
      { id: 'doc-2', title: '50% Milestone Payment Receipt', type: 'RECEIPT', date: '30 Oct 2026', size: '1.2 MB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '29 Oct 2026 02:30 PM', type: 'CALL', agent: 'Pooja Sharma', summary: 'Confirmed receipt of clearance for Cheque CHQ-991204.', nextFollowUp: '20 Dec 2026' }
    ],
    internalNotes: 'Allocated 2 dedicated basement car parking slots P-14 & P-15.',
    cancellationHistory: []
  },
  {
    id: 'BUY-2026-004',
    name: 'Sunil & Meera Mittal',
    phone: '+91 98330 99812',
    altPhone: '+91 98330 99813',
    email: 'sunil.mittal@mittalgroup.com',
    address: 'Mittal Towers, 14th Floor, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400021',
    occupation: 'Chairman & Industrialist',
    company: 'Mittal Industrial Group',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'VERIFIED',
      panNumber: 'RNVMS7712E',
      aadhaarNumber: '2212-6612-8812',
      verifiedDate: '02 Nov 2026',
      verifiedBy: 'Super Admin',
      panDocName: 'mittal_pan.pdf',
      aadhaarDocName: 'mittal_aadhaar.pdf'
    },
    assignedAgent: 'Super Admin',
    registeredDate: '02 Nov 2026',
    bookedUnits: ['No-19'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-019',
        unitNumber: 'No-19',
        projectName: 'Dwellora Residence',
        bookingDate: '02 Nov 2026',
        agreedPrice: 48750000,
        paidAmount: 48750000,
        balanceAmount: 0,
        status: 'CONFIRMED',
        agreementStatus: '100% Registry & Possession Slip Issued',
        paymentPlan: 'FULL_PAYMENT'
      }
    ],
    paymentHistory: [
      { receiptNo: 'RCP-2026-020A', date: '02 Nov 2026', amount: 48750000, paymentMode: 'RTGS', txnId: 'KKBK000189211', stage: 'Full Lumsum Cleared (100%)', status: 'CLEARED', invoiceNo: 'INV-2026-020' }
    ],
    documents: [
      { id: 'doc-1', title: '100% Full Payment Clearance Certificate', type: 'CLEARANCE', date: '02 Nov 2026', size: '1.4 MB', url: '#' },
      { id: 'doc-2', title: 'Possession Letter & Key Handover Slip', type: 'POSSESSION', date: '03 Nov 2026', size: '2.6 MB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '02 Nov 2026 05:00 PM', type: 'MEETING', agent: 'Super Admin', summary: 'Executed deed of sale and handed over master welcome key kit.' }
    ],
    internalNotes: 'Zero balance due. Keys handed over. Priority interior access granted.',
    cancellationHistory: []
  },
  {
    id: 'BUY-2026-005',
    name: 'Siddharth Oberoi',
    phone: '+91 98101 22345',
    altPhone: '',
    email: 'siddharth@oberoiholdings.com',
    address: 'Villa 7, Golf Links Residences',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110003',
    occupation: 'Founder & CEO',
    company: 'Oberoi Tech Holdings',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'VERIFIED',
      panNumber: 'AOZPO4412K',
      aadhaarNumber: '3312-7782-9901',
      verifiedDate: '31 Oct 2026',
      verifiedBy: 'Pooja Sharma',
      panDocName: 'oberoi_pan.pdf',
      aadhaarDocName: 'oberoi_aadhaar.pdf'
    },
    assignedAgent: 'Pooja Sharma (Sales Agent)',
    registeredDate: '31 Oct 2026',
    bookedUnits: ['No-07'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-007',
        unitNumber: 'No-07',
        projectName: 'Dwellora Residence',
        bookingDate: '31 Oct 2026',
        agreedPrice: 33750000,
        paidAmount: 1500000,
        balanceAmount: 32250000,
        status: 'RESERVED',
        agreementStatus: 'Under Legal Review',
        paymentPlan: 'TOKEN_ADVANCE'
      }
    ],
    paymentHistory: [
      { receiptNo: 'RCP-2026-007', date: '31 Oct 2026', amount: 1500000, paymentMode: 'UPI / Online', txnId: 'UPI-9921029141', stage: 'Token Advance Deposit', status: 'CLEARED', invoiceNo: 'INV-2026-007' }
    ],
    documents: [
      { id: 'doc-1', title: 'Token Holding Certificate (No-07)', type: 'RECEIPT', date: '31 Oct 2026', size: '1.1 MB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '31 Oct 2026 12:15 PM', type: 'CALL', agent: 'Pooja Sharma', summary: 'Client confirmed token payment. Booking confirmation issued.', nextFollowUp: '15 Nov 2026' }
    ],
    internalNotes: 'Client scheduled on-site inspection with family on Nov 15th.',
    cancellationHistory: []
  },
  {
    id: 'BUY-2026-006',
    name: 'Kavita Chawla',
    phone: '+91 98711 55670',
    altPhone: '',
    email: 'kavita.chawla@gmail.com',
    address: 'A-24, Vasant Vihar Enclave',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110057',
    occupation: 'Creative Director & Designer',
    company: 'Chawla Couture Studio',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'PENDING',
      panNumber: 'CKMPR8812D',
      aadhaarNumber: '6612-4412-8890',
      verifiedDate: null,
      verifiedBy: null,
      panDocName: 'kavita_pan_pending.pdf',
      aadhaarDocName: ''
    },
    assignedAgent: 'Rohit Verma (Manager)',
    registeredDate: '31 Oct 2026',
    bookedUnits: ['No-14'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-014',
        unitNumber: 'No-14',
        projectName: 'Dwellora Residence',
        bookingDate: '31 Oct 2026',
        agreedPrice: 42500000,
        paidAmount: 1500000,
        balanceAmount: 41000000,
        status: 'RESERVED',
        agreementStatus: 'KYC Document Pending',
        paymentPlan: 'TOKEN_ADVANCE'
      }
    ],
    paymentHistory: [
      { receiptNo: 'RCP-2026-014', date: '31 Oct 2026', amount: 1500000, paymentMode: 'IMPS / Bank Transfer', txnId: 'SBIN000918231', stage: 'Holding Advance', status: 'CLEARED', invoiceNo: 'INV-2026-014' }
    ],
    documents: [
      { id: 'doc-1', title: 'Reservation Token Slip', type: 'RECEIPT', date: '31 Oct 2026', size: '980 KB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '31 Oct 2026 04:00 PM', type: 'CALL', agent: 'Rohit Verma', summary: 'Requested scanned Aadhaar card copy to complete KYC verification.', nextFollowUp: '08 Nov 2026' }
    ],
    internalNotes: 'Aadhaar card copy awaited to complete KYC signoff.',
    cancellationHistory: []
  },
  {
    id: 'BUY-2026-007',
    name: 'Aditya Roy',
    phone: '+91 99200 44321',
    altPhone: '',
    email: 'aditya.roy@zenithtech.io',
    address: 'Skyline Terrace 18, Indiranagar 100ft Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    occupation: 'VP of Engineering',
    company: 'Zenith Global Systems',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'VERIFIED',
      panNumber: 'AROYP3312L',
      aadhaarNumber: '4412-9912-3321',
      verifiedDate: '31 Oct 2026',
      verifiedBy: 'Super Admin',
      panDocName: 'aditya_pan.pdf',
      aadhaarDocName: 'aditya_aadhaar.pdf'
    },
    assignedAgent: 'Rohit Verma (Manager)',
    registeredDate: '31 Oct 2026',
    bookedUnits: ['No-21'],
    bookingHistory: [
      {
        bookingId: 'BK-2026-021',
        unitNumber: 'No-21',
        projectName: 'Dwellora Residence',
        bookingDate: '31 Oct 2026',
        agreedPrice: 51250000,
        paidAmount: 1500000,
        balanceAmount: 49750000,
        status: 'RESERVED',
        agreementStatus: 'Agreement Scheduled',
        paymentPlan: 'TOKEN_ADVANCE'
      }
    ],
    paymentHistory: [
      { receiptNo: 'RCP-2026-021', date: '31 Oct 2026', amount: 1500000, paymentMode: 'NEFT', txnId: 'AXIS000991823', stage: 'Token Advance', status: 'CLEARED', invoiceNo: 'INV-2026-021' }
    ],
    documents: [
      { id: 'doc-1', title: 'Token Holding Agreement Slip', type: 'RECEIPT', date: '31 Oct 2026', size: '1.2 MB', url: '#' }
    ],
    communications: [
      { id: 'comm-1', date: '31 Oct 2026 06:15 PM', type: 'WHATSAPP', agent: 'Rohit Verma', summary: 'Sent agreement schedule details for next week.' }
    ],
    internalNotes: 'Client opted for automated EMI milestone deductions.',
    cancellationHistory: []
  }
];

export const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'EstateSphere Indore',
    tagline: 'Luxury Living & High-Rise Apartments on Super Corridor',
    description: 'A boutique residential master enclave designed around privacy, wellbeing, and timeless contemporary living located on Super Corridor, Indore. Featuring natural travertine stone, layered solarium terraces, and generous private openings.',
    location: 'Super Corridor, Near Airport Road',
    address: '302-B, 3rd Floor, Swadesh Bhawan, Indore (452001)',
    city: 'Indore',
    googleMapsUrl: 'https://maps.google.com/?q=22.7196,75.8577',
    startingPrice: 26250000,
    status: 'Under Construction',
    launchDate: '15 Jan 2024',
    completionDate: 'December 2026',
    reraNumber: 'PRM/MP/RERA/2026/044',
    heroImage: '/assets/luxury_villa_day.jpg',
    nightImage: '/assets/luxury_villa_night.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    brochureUrl: '/assets/Dwellora_Master_Brochure.pdf',
    floorPlanUrl: '',
    totalUnits: 25,
    totalBlocks: '3 Towers (Block B1, B2, B3)',
    amenities: [
      'Saltwater Horizon Pool',
      'Gated Community 24/7',
      'Underground EV Parking',
      'State-of-the-Art Gym & Wellness',
      'Mediterranean Landscaping',
      'Private Rooftop Solarium',
      'Smart Home Automation',
      'Italian Modular Kitchen'
    ],
    isMaster: true,
    syncUrl: 'http://localhost:8085/api/projects',
    projectKey: 'PROJ-INDORE-MASTER',
    syncStatus: 'CONNECTED',
    syncLastTested: 'Live MySQL & Spring Boot Active'
  }
];

// Role-Based Access Control (RBAC) & Custom Permissions Configuration
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    modules: ['dashboard', 'projects', 'apartments', 'sales', 'media', 'content', 'inquiries', 'team', 'settings'],
    canAddProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canAddApartment: true,
    canEditApartment: true,
    canDeleteApartment: true,
    canEditMedia: true,
    canEditContent: true,
    canManageTeam: true,
    canEditSettings: true
  },
  ADMIN_MANAGER: {
    modules: ['dashboard', 'projects', 'apartments', 'sales', 'media', 'content', 'inquiries'],
    canAddProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canAddApartment: true,
    canEditApartment: true,
    canDeleteApartment: false,
    canEditMedia: true,
    canEditContent: true,
    canManageTeam: false,
    canEditSettings: false
  },
  SALES_AGENT: {
    modules: ['dashboard', 'projects', 'apartments', 'sales', 'inquiries'],
    canAddProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canAddApartment: false,
    canEditApartment: false,
    canDeleteApartment: false,
    canEditMedia: false,
    canEditContent: false,
    canManageTeam: false,
    canEditSettings: false
  }
};

// Initial Team Members (3 Core Roles with Assigned Projects)
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
    assignedProjects: ['ALL'],
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
    assignedProjects: ['proj-1'],
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
    assignedProjects: ['proj-1'],
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
  heroMobileImage: '/assets/estate-boutique-lounge.png',
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
            let item = { ...a };
            if (item.apartmentNumber && (item.apartmentNumber.includes('№') || item.apartmentNumber.startsWith('NO.') || item.apartmentNumber.startsWith('NO '))) {
              needsUpdate = true;
              const intNum = parseInt(item.apartmentNumber.replace(/[^\d]/g, ''), 10) || item.id || 1;
              const newNum = `No-${intNum < 10 ? '0' + intNum : intNum}`;
              item = {
                ...item,
                apartmentNumber: newNum,
                title: item.title ? item.title.replace(/№0?\d+/g, newNum).replace(/NO\.\s*\d+/gi, newNum) : item.title
              };
            }
            // Ensure buyer financial breakdown is always present
            if (item.buyer && item.buyer.name) {
              const deal = item.buyer.dealAmount || item.price || 30000000;
              const isFull = item.buyer.paymentStatus === 'FULLY_PAID' || item.buyer.paymentPlan === 'FULL_PAYMENT';
              const paid = item.buyer.paidAmount !== undefined ? item.buyer.paidAmount : (isFull ? deal : (item.status === 'RESERVED' ? 1500000 : Math.round(deal * 0.9)));
              const balance = item.buyer.balanceAmount !== undefined ? item.buyer.balanceAmount : Math.max(0, deal - paid);
              const plan = item.buyer.paymentPlan || (balance === 0 ? 'FULL_PAYMENT' : (item.status === 'RESERVED' ? 'TOKEN_ADVANCE' : 'EMI_PLAN'));
              item.buyer = {
                ...item.buyer,
                dealAmount: deal,
                paidAmount: paid,
                balanceAmount: balance,
                paymentPlan: plan,
                bookingDate: item.buyer.bookingDate || item.buyer.saleDate || '26 Oct 2026'
              };
            }
            // Auto-hydrate buyer on sold/reserved units if missing
            if ((item.status === 'SOLD' || item.status === 'RESERVED') && (!item.buyer || !item.buyer.name)) {
              const seed = DEFAULT_25_APARTMENTS.find(d => d.id === item.id || d.apartmentNumber === item.apartmentNumber);
              if (seed && seed.buyer) {
                needsUpdate = true;
                item.buyer = { ...seed.buyer };
              } else if (item.status === 'SOLD') {
                needsUpdate = true;
                item.buyer = {
                  name: 'Private Client',
                  phone: '+91 98200 11000',
                  email: 'buyer@estatesphere.in',
                  dealAmount: item.price || 30000000,
                  saleDate: '28 Oct 2026',
                  paymentStatus: 'FULLY_PAID',
                  paymentStatusLabel: '100% Payment Cleared (Registry Complete)',
                  assignedAgent: 'Super Admin',
                  notes: 'Direct client purchase.'
                };
              } else if (item.status === 'RESERVED') {
                needsUpdate = true;
                item.buyer = {
                  name: 'Prospective Client',
                  phone: '+91 98112 00000',
                  email: 'client@estatesphere.in',
                  dealAmount: item.price || 28000000,
                  saleDate: 'Today',
                  paymentStatus: 'TOKEN_PAID',
                  paymentStatusLabel: 'Token Advance Received',
                  assignedAgent: 'Rohit Verma',
                  notes: 'Token advance received. Document verification in progress.'
                };
              }
            }
            // Enrich with Point 3 Apartment Management specs if missing
            const superArea = Number(item.areaSqft) || 1500;
            if (!item.carpetAreaSqft) {
              item.carpetAreaSqft = Math.round(superArea * 0.72);
              needsUpdate = true;
            }
            if (!item.builtUpAreaSqft) {
              item.builtUpAreaSqft = Math.round(superArea * 0.88);
              needsUpdate = true;
            }
            if (!item.basePrice) {
              item.basePrice = Number(item.price) || 25000000;
              needsUpdate = true;
            }
            if (!item.projectId) {
              item.projectId = 'proj-1';
              item.projectName = 'Dwellora Residence';
              needsUpdate = true;
            }
            if (!item.parking) {
              item.parking = (item.id % 3 === 0) ? '2 Covered EV Bays' : ((item.id % 2 === 0) ? '1 Covered Basement Slot' : '1 Dedicated Stilt Bay');
              needsUpdate = true;
            }
            if (!item.amenities || !Array.isArray(item.amenities) || item.amenities.length === 0) {
              item.amenities = ['Italian Marble Flooring', 'Floor-to-Ceiling Windows', 'Smart Video Door Phone', 'Modular Kitchen', 'Private Solarium Balcony'];
              needsUpdate = true;
            }
            if (!item.priceHistory) {
              item.priceHistory = [];
            }
            if (item.floorPlanUrl && item.floorPlanUrl.includes('estate-exterior-reveal')) {
              item.floorPlanUrl = '';
              needsUpdate = true;
            }

            return item;
          });
          const sorted = [...normalized].sort((a, b) => {
            const numA = parseInt((a.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || a.id || 0;
            const numB = parseInt((b.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || b.id || 0;
            return numA - numB;
          });
          if (needsUpdate) {
            safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(sorted));
          }
          return sorted;
        }
      } catch (_) {}
    }
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(DEFAULT_25_APARTMENTS));
    return DEFAULT_25_APARTMENTS;
  },

  updateApartmentStatus(id, newStatus, userName = 'Admin') {
    const current = this.getApartments();
    const target = current.find(a => String(a.id) === String(id));
    const updated = current.map(a => String(a.id) === String(id) ? { ...a, status: newStatus } : a);
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));

    if (target) {
      const statusLabel = newStatus === 'SOLD' ? 'SOLD OUT' : (newStatus === 'RESERVED' ? 'RESERVED' : (newStatus === 'BOOKED' ? 'BOOKED' : 'AVAILABLE'));
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
    const targetApt = current.find(a => String(a.id) === String(id));
    if (!targetApt) return current;

    // 1. Duplicate Apartment Number Validation (Point 3)
    if (updatedFields.apartmentNumber) {
      const cleanNum = updatedFields.apartmentNumber.trim().toLowerCase();
      const cleanProjId = updatedFields.projectId || targetApt.projectId || 'proj-1';
      const duplicate = current.find(a => 
        String(a.id) !== String(id) && 
        a.apartmentNumber && 
        a.apartmentNumber.trim().toLowerCase() === cleanNum &&
        (a.projectId || 'proj-1') === cleanProjId
      );
      if (duplicate) {
        throw new Error(`Duplicate Unit Number! Unit "${updatedFields.apartmentNumber}" already exists in this project.`);
      }
    }

    // 2. Double-Booking Validation (Point 3: Ek apartment ko ek hi samay par do buyers ke naam book nahi kiya ja sake)
    if (updatedFields.buyer && updatedFields.buyer.name && targetApt.buyer && targetApt.buyer.name) {
      if (targetApt.status !== 'AVAILABLE' && targetApt.buyer.name.trim().toLowerCase() !== updatedFields.buyer.name.trim().toLowerCase()) {
        if (!updatedFields.forceReassign) {
          throw new Error(`Cannot double-book Unit ${targetApt.apartmentNumber}! It is already assigned to "${targetApt.buyer.name}". Release or cancel the existing booking first.`);
        }
      }
    }

    // 3. Unit Price History Tracking (Point 3)
    let nextPriceHistory = Array.isArray(targetApt.priceHistory) ? [...targetApt.priceHistory] : [];
    if (updatedFields.price !== undefined && Number(updatedFields.price) !== Number(targetApt.price)) {
      const oldP = Number(targetApt.price);
      const newP = Number(updatedFields.price);
      if (!isNaN(newP) && oldP !== newP) {
        nextPriceHistory.unshift({
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          oldPrice: oldP,
          newPrice: newP,
          diff: newP - oldP,
          changedBy: userName
        });
      }
    }

    const updated = current.map(a => {
      if (String(a.id) === String(id)) {
        const nextRoomGallery = {
          ...(a.roomGallery || {}),
          ...(updatedFields.roomGallery || {}),
          ...(updatedFields.panorama360 ? { panorama360: updatedFields.panorama360 } : {}),
          ...(updatedFields.imageUrl ? { cover: updatedFields.imageUrl } : {})
        };
        const superArea = updatedFields.areaSqft ? Number(updatedFields.areaSqft) : a.areaSqft;
        const carpetArea = updatedFields.carpetAreaSqft ? Number(updatedFields.carpetAreaSqft) : (a.carpetAreaSqft || Math.round(superArea * 0.72));
        const builtUpArea = updatedFields.builtUpAreaSqft ? Number(updatedFields.builtUpAreaSqft) : (a.builtUpAreaSqft || Math.round(superArea * 0.88));
        const finalPrice = updatedFields.price !== undefined ? Number(updatedFields.price) : a.price;

        return {
          ...a,
          ...updatedFields,
          carpetAreaSqft: carpetArea,
          builtUpAreaSqft: builtUpArea,
          areaSqft: superArea,
          basePrice: updatedFields.basePrice !== undefined ? Number(updatedFields.basePrice) : (a.basePrice || finalPrice),
          price: finalPrice,
          priceHistory: nextPriceHistory,
          roomGallery: nextRoomGallery
        };
      }
      return a;
    });
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
    this.addActivity(`${userName} updated details for Unit ${updatedFields.apartmentNumber || targetApt.apartmentNumber}`, 'edit');
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
    const cleanNum = (aptData.apartmentNumber || '').trim();
    const cleanProjId = aptData.projectId || 'proj-1';

    // Duplicate Apartment Validation (Point 3)
    const exists = current.some(a => 
      a.apartmentNumber && 
      a.apartmentNumber.trim().toLowerCase() === cleanNum.toLowerCase() &&
      (a.projectId || 'proj-1') === cleanProjId
    );
    if (exists) {
      throw new Error(`Duplicate Unit Number! Unit "${cleanNum}" already exists in ${aptData.projectName || 'this project'}. Please use a unique unit number.`);
    }

    const nextId = current.length > 0 ? Math.max(...current.map(a => Number(a.id) || 0)) + 1 : 1;
    const superArea = Number(aptData.areaSqft) || 1500;
    const carpetArea = Number(aptData.carpetAreaSqft) || Math.round(superArea * 0.72);
    const builtUpArea = Number(aptData.builtUpAreaSqft) || Math.round(superArea * 0.88);
    const unitPrice = Number(aptData.price) || 25000000;

    const newApt = {
      id: nextId,
      ...aptData,
      apartmentNumber: cleanNum,
      projectId: cleanProjId,
      projectName: aptData.projectName || 'Dwellora Residence',
      carpetAreaSqft: carpetArea,
      builtUpAreaSqft: builtUpArea,
      areaSqft: superArea,
      areaSqm: Math.round(superArea / 10.764),
      basePrice: Number(aptData.basePrice) || unitPrice,
      price: unitPrice,
      parking: aptData.parking || '1 Covered Basement Slot',
      amenities: Array.isArray(aptData.amenities) && aptData.amenities.length > 0 
        ? aptData.amenities 
        : ['Italian Marble Flooring', 'Floor-to-Ceiling Windows', 'Smart Video Door Phone', 'Modular Kitchen', 'Private Solarium Balcony'],
      floorPlanUrl: (aptData.floorPlanUrl && !aptData.floorPlanUrl.includes('estate-exterior-reveal')) ? aptData.floorPlanUrl : '',
      priceHistory: [],
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
    const updated = [...current, newApt].sort((a, b) => {
      const numA = parseInt((a.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || a.id || 0;
      const numB = parseInt((b.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || b.id || 0;
      return numA - numB;
    });
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
    this.addActivity(`${userName} registered new Unit ${newApt.apartmentNumber} (${newApt.title || newApt.apartmentNumber})`, 'add');
    this.notifyUpdate();
    return newApt;
  },

  // Bulk Import Apartments via CSV / Excel (Point 3)
  bulkImportApartments(rows, userName = 'Admin') {
    const current = this.getApartments();
    const existingNumbers = new Set(current.map(a => (a.apartmentNumber || '').trim().toLowerCase()));
    let nextId = current.length > 0 ? Math.max(...current.map(a => Number(a.id) || 0)) + 1 : 1;

    const imported = [];
    const skipped = [];

    rows.forEach((r, idx) => {
      const unitNum = (r.apartmentNumber || r.unitNumber || `No-${nextId}`).trim();
      const lowerNum = unitNum.toLowerCase();

      if (!unitNum || existingNumbers.has(lowerNum)) {
        skipped.push(unitNum || `Row #${idx + 1}`);
        return;
      }
      existingNumbers.add(lowerNum);

      const superArea = Number(r.areaSqft || r.superBuiltUpAreaSqft || 1450);
      const carpetArea = Number(r.carpetAreaSqft || Math.round(superArea * 0.72));
      const builtUpArea = Number(r.builtUpAreaSqft || Math.round(superArea * 0.88));
      const price = Number(r.price || r.basePrice || 26000000);
      const bedrooms = Number(r.bedrooms || 3);
      const bathrooms = Number(r.bathrooms || (bedrooms >= 3 ? 3 : 2));
      const typology = r.typology || (bedrooms >= 4 ? 'Penthouse Duplex' : (bedrooms === 2 ? 'Ready Luxury Home' : 'Garden Residence'));
      const block = r.block || r.tower || 'Block B1';
      const floor = r.floor || '1st Floor';
      const parking = r.parking || '1 Covered Basement Slot';
      const status = (r.status || 'AVAILABLE').toUpperCase();

      const item = {
        id: nextId++,
        apartmentNumber: unitNum,
        projectId: r.projectId || 'proj-1',
        projectName: r.projectName || 'Dwellora Residence',
        title: r.title || `${bedrooms} BHK ${typology}`,
        headline: r.headline || `${bedrooms} Bed Luxury Residence in ${block}`,
        description: r.description || `Luxury apartment in ${block}, ${floor} with bespoke travertine finishes.`,
        block,
        floor,
        bedrooms,
        bathrooms,
        areaSqft: superArea,
        carpetAreaSqft: carpetArea,
        builtUpAreaSqft: builtUpArea,
        areaSqm: Math.round(superArea / 10.764),
        terraceArea: Number(r.terraceArea || 25),
        typology,
        price,
        basePrice: price,
        parking,
        status: ['AVAILABLE', 'RESERVED', 'SOLD', 'BOOKED'].includes(status) ? status : 'AVAILABLE',
        amenities: Array.isArray(r.amenities) && r.amenities.length > 0 
          ? r.amenities 
          : ['Italian Marble Flooring', 'Smart Video Door Phone', 'Modular Kitchen'],
        priceHistory: [],
        imageUrl: r.imageUrl || '/assets/estate-boutique-lounge.png',
        floorPlanUrl: (r.floorPlanUrl && !r.floorPlanUrl.includes('estate-exterior-reveal')) ? r.floorPlanUrl : '',
        roomGallery: {
          livingHall: '/assets/interior-living-hall.png',
          kitchen: '/assets/interior-kitchen.png',
          bedroom: '/assets/interior-master-bedroom.png',
          terrace: '/assets/estate-private-terrace.png',
          panorama360: '/assets/cayley-interior-8k.jpg'
        }
      };
      imported.push(item);
    });

    if (imported.length > 0) {
      const updated = [...current, ...imported].sort((a, b) => {
        const numA = parseInt((a.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || a.id || 0;
        const numB = parseInt((b.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || b.id || 0;
        return numA - numB;
      });
      safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
      this.addActivity(`${userName} bulk imported ${imported.length} apartments via Excel / CSV`, 'add');
      this.notifyUpdate();
      return { success: true, count: imported.length, skippedCount: skipped.length, skipped };
    }

    return { success: false, count: 0, skippedCount: skipped.length, skipped, error: 'No new unique unit numbers found to import.' };
  },

  deleteApartment(id, userName = 'Admin') {
    const current = this.getApartments();
    const target = current.find(a => String(a.id) === String(id));
    const updated = current.filter(a => String(a.id) !== String(id));
    safeSetItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(updated));
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
            let perms = m.permissions || defaultPerms;
            if (perms && Array.isArray(perms.modules) && !perms.modules.includes('sales')) {
              perms = { ...perms, modules: [...perms.modules, 'sales'] };
            }
            return {
              ...m,
              permissions: perms,
              assignedProjects: m.assignedProjects || (m.role === 'SUPER_ADMIN' ? ['ALL'] : ['proj-1'])
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
      password: memberData.password !== undefined && memberData.password !== '' ? String(memberData.password) : 'Sphere@2026',
      role: roleKey,
      roleLabel,
      roleBadge,
      accessLevel,
      permissions,
      phone: memberData.phone ? memberData.phone.trim() : '+91 98000 00000',
      status: 'ACTIVE',
      assignedProjects: Array.isArray(memberData.assignedProjects) && memberData.assignedProjects.length > 0 
        ? memberData.assignedProjects 
        : (roleKey === 'SUPER_ADMIN' ? ['ALL'] : ['proj-1']),
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

  updateTeamMemberPermissions(id, permissions, newRole = null, userName = 'Super Admin', assignedProjects = null) {
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
          assignedProjects: assignedProjects || m.assignedProjects || (assignedRole === 'SUPER_ADMIN' ? ['ALL'] : ['proj-1']),
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

  // --- PROJECTS (POINT 2: PROJECT MANAGEMENT) ---
  getProjects() {
    try {
      localStorage.removeItem('era_projects_db_v2');
    } catch (_) {}

    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      try {
        let parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Strictly remove all dummy Bhopal/Ujjain projects (proj-2, proj-3) and duplicates
          const cleaned = [];
          const seenIds = new Set();
          const seenNames = new Set();

          for (const p of parsed) {
            // Delete dummy demo projects
            if (p.id === 'proj-2' || p.id === 'proj-3' || p.projectKey === 'PROJ-BHOPAL-LAKEVIEW' || p.projectKey === 'PROJ-UJJAIN-HERITAGE') {
              continue;
            }

            const cleanName = (p.name || '').trim();
            const lowerName = cleanName.toLowerCase();

            // If it's the primary project
            if (p.id === 'proj-1' || lowerName.includes('dwellora') || lowerName === 'estatesphere indore') {
              if (!seenIds.has('proj-1')) {
                cleaned.push({
                  ...p,
                  id: 'proj-1',
                  name: 'EstateSphere Indore',
                  city: 'Indore',
                  location: 'Super Corridor, Indore',
                  address: '302-B, 3rd Floor, Swadesh Bhawan, Indore (452001)',
                  reraNumber: 'PRM/MP/RERA/2026/044',
                  projectKey: 'PROJ-INDORE-MASTER',
                  isMaster: true
                });
                seenIds.add('proj-1');
                seenNames.add('estatesphere indore');
              }
            } else if (!seenIds.has(p.id) && !seenNames.has(lowerName)) {
              // Real custom project added by user
              cleaned.push(p);
              seenIds.add(p.id);
              seenNames.add(lowerName);
            }
          }

          if (cleaned.length === 0) {
            cleaned.push(DEFAULT_PROJECTS[0]);
          }

          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(cleaned));
          return cleaned;
        }
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  },

  getProject(id) {
    const list = this.getProjects();
    return list.find(p => String(p.id) === String(id)) || list[0] || null;
  },

  addProject(projectData, userName = 'Super Admin') {
    const current = this.getProjects();
    const newId = `proj-${Date.now()}`;
    const newProj = {
      id: newId,
      name: projectData.name || 'New Master Development',
      tagline: projectData.tagline || 'Luxury Residential Community',
      description: projectData.description || 'Exclusive residential development featuring world-class architecture and serene living spaces.',
      location: projectData.location || 'Super Corridor, Indore',
      address: projectData.address || '302-B, 3rd Floor, Swadesh Bhawan, Indore (452001)',
      city: projectData.city || 'Indore',
      googleMapsUrl: projectData.googleMapsUrl || 'https://maps.google.com/?q=12.9716,77.5946',
      startingPrice: Number(projectData.startingPrice) || 25000000,
      status: projectData.status || 'Under Construction',
      launchDate: projectData.launchDate || 'Jan 2026',
      completionDate: projectData.completionDate || 'Dec 2028',
      reraNumber: projectData.reraNumber || 'PRM/KA/RERA/2026/999',
      heroImage: projectData.heroImage || '/assets/luxury_villa_day.jpg',
      nightImage: projectData.nightImage || '/assets/luxury_villa_night.jpg',
      videoUrl: projectData.videoUrl || '',
      brochureUrl: projectData.brochureUrl || '/assets/Dwellora_Master_Brochure.pdf',
      floorPlanUrl: (projectData.floorPlanUrl && !projectData.floorPlanUrl.includes('estate-exterior-reveal')) ? projectData.floorPlanUrl : '',
      totalUnits: Number(projectData.totalUnits) || 20,
      totalBlocks: projectData.totalBlocks || '2 Towers',
      amenities: Array.isArray(projectData.amenities) ? projectData.amenities : ['Gated Community 24/7', 'Swimming Pool', 'EV Parking'],
      isMaster: !!projectData.isMaster,
      syncUrl: projectData.syncUrl || 'http://localhost:8085/api/projects',
      projectKey: projectData.projectKey || ('PROJ-' + String(newId).toUpperCase()),
      syncStatus: projectData.syncStatus || 'CONNECTED',
      syncLastTested: projectData.syncLastTested || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let updated = [newProj, ...current];
    if (newProj.isMaster) {
      updated = updated.map(p => p.id === newId ? p : { ...p, isMaster: false });
      this.syncProjectToWebsite(newProj);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    this.addActivity(`${userName} created new project: "${newProj.name}" (${newProj.city})`, 'add');
    this.notifyUpdate();
    return newProj;
  },

  updateProject(id, updatedFields, userName = 'Super Admin') {
    const current = this.getProjects();
    let updatedProj = null;
    let updated = current.map(p => {
      if (String(p.id) === String(id)) {
        updatedProj = { ...p, ...updatedFields };
        return updatedProj;
      }
      return p;
    });

    if (updatedFields.isMaster) {
      updated = updated.map(p => String(p.id) === String(id) ? { ...p, isMaster: true } : { ...p, isMaster: false });
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));

    // CRITICAL: Reflect changes on the live website immediately!
    const activeMaster = updated.find(p => p.isMaster) || updated[0];
    if (activeMaster && (String(activeMaster.id) === String(id) || updatedFields.isMaster)) {
      this.syncProjectToWebsite(activeMaster);
    }

    this.addActivity(`${userName} updated project details for "${updatedProj?.name || id}"`, 'edit');
    this.notifyUpdate();
    return updatedProj;
  },

  deleteProject(id, userName = 'Super Admin') {
    const current = this.getProjects();
    const target = current.find(p => String(p.id) === String(id));
    if (target?.isMaster) {
      throw new Error('Cannot delete the active master project currently powering the live website.');
    }
    const updated = current.filter(p => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    if (target) {
      this.addActivity(`${userName} deleted project: "${target.name}"`, 'delete');
    }
    this.notifyUpdate();
    return updated;
  },

  setActiveMasterProject(id, userName = 'Super Admin') {
    const current = this.getProjects();
    const target = current.find(p => String(p.id) === String(id));
    if (!target) return null;
    const updated = current.map(p => ({ ...p, isMaster: String(p.id) === String(id) }));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    this.syncProjectToWebsite(target);
    this.addActivity(`${userName} set "${target.name}" as the active master project on live website`, 'settings');
    this.notifyUpdate();
    return target;
  },

  syncProjectToWebsite(project) {
    if (!project) return;
    try {
      const siteContent = this.getSiteContent();
      const updatedSiteContent = {
        ...siteContent,
        heroTitle: project.name || siteContent.heroTitle,
        heroSubtitle: project.tagline || siteContent.heroSubtitle,
        heroDayImage: project.heroImage || siteContent.heroDayImage,
        heroNightImage: project.nightImage || siteContent.heroNightImage,
        conceptDescription: project.description || siteContent.conceptDescription,
        locationTitle: project.location || siteContent.locationTitle,
        revealTitle: project.name ? `Welcome to ${project.name}` : siteContent.revealTitle
      };
      this.saveSiteContent(updatedSiteContent);
    } catch (e) {
      console.warn('[dataStore] syncProjectToWebsite error:', e);
    }
  },


  // ==========================================
  // POINT 4: BUYER & CUSTOMER MANAGEMENT METHODS
  // ==========================================
  getBuyers() {
    if (typeof window === 'undefined') return DEFAULT_BUYERS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BUYERS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(DEFAULT_BUYERS));
        return DEFAULT_BUYERS;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(DEFAULT_BUYERS));
        return DEFAULT_BUYERS;
      }

      // Auto-migrate unit number for Sunil & Meera Mittal to No-19 matching inventory
      let needsFix = false;
      const normalized = parsed.map(b => {
        if (b.name?.includes('Sunil') && b.bookedUnits?.includes('No-20')) {
          needsFix = true;
          return {
            ...b,
            bookedUnits: ['No-19'],
            bookingHistory: (b.bookingHistory || []).map(bk => ({
              ...bk,
              unitNumber: 'No-19',
              bookingId: 'BK-2026-019'
            }))
          };
        }
        return b;
      });
      if (needsFix) {
        localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(normalized));
        return normalized;
      }

      return parsed;
    } catch (e) {
      console.error('[dataStore] Error loading buyers:', e);
      return DEFAULT_BUYERS;
    }
  },

  saveBuyers(buyers) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(buyers));
      this.notifyUpdate();
    } catch (e) {
      console.error('[dataStore] Error saving buyers:', e);
    }
  },

  addBuyer(buyerData, userName = 'Super Admin') {
    const current = this.getBuyers();
    
    // Duplicate Mobile or Email validation
    const cleanPhone = (buyerData.phone || '').trim().replace(/[^0-9]/g, '');
    const cleanEmail = (buyerData.email || '').trim().toLowerCase();
    
    if (cleanPhone && current.some(b => (b.phone || '').replace(/[^0-9]/g, '') === cleanPhone)) {
      throw new Error(`A buyer with mobile number "${buyerData.phone}" is already registered.`);
    }
    if (cleanEmail && current.some(b => (b.email || '').toLowerCase() === cleanEmail)) {
      throw new Error(`A buyer with email "${buyerData.email}" is already registered.`);
    }
    if (buyerData.kyc?.panNumber) {
      const cleanPan = buyerData.kyc.panNumber.trim().toUpperCase();
      if (current.some(b => b.kyc?.panNumber?.toUpperCase() === cleanPan)) {
        throw new Error(`A buyer with PAN Number "${cleanPan}" is already registered.`);
      }
    }

    const nextIdNum = current.length + 1;
    const newId = `BUY-2026-${String(nextIdNum).padStart(3, '0')}`;
    const todayFormatted = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    const newBuyer = {
      id: newId,
      name: buyerData.name.trim(),
      phone: buyerData.phone.trim(),
      altPhone: buyerData.altPhone?.trim() || '',
      email: buyerData.email.trim().toLowerCase(),
      address: buyerData.address?.trim() || '',
      city: buyerData.city?.trim() || 'Indore',
      state: buyerData.state?.trim() || 'Karnataka',
      pincode: buyerData.pincode?.trim() || '',
      occupation: buyerData.occupation?.trim() || 'Business Professional',
      company: buyerData.company?.trim() || '',
      avatar: buyerData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(buyerData.name)}&background=2563eb&color=fff`,
      kyc: {
        status: buyerData.kyc?.status || 'VERIFIED',
        panNumber: buyerData.kyc?.panNumber?.trim().toUpperCase() || '',
        aadhaarNumber: buyerData.kyc?.aadhaarNumber?.trim() || '',
        verifiedDate: buyerData.kyc?.status === 'VERIFIED' ? todayFormatted : null,
        verifiedBy: buyerData.kyc?.status === 'VERIFIED' ? userName : null,
        panDocName: buyerData.kyc?.panDocName || '',
        aadhaarDocName: buyerData.kyc?.aadhaarDocName || ''
      },
      assignedAgent: buyerData.assignedAgent || userName,
      registeredDate: todayFormatted,
      bookedUnits: Array.isArray(buyerData.bookedUnits) ? buyerData.bookedUnits : (buyerData.unitNumber ? [buyerData.unitNumber] : []),
      bookingHistory: Array.isArray(buyerData.bookingHistory) ? buyerData.bookingHistory : (buyerData.unitNumber ? [{
        bookingId: `BK-2026-${String(Math.floor(100 + Math.random() * 900))}`,
        unitNumber: buyerData.unitNumber,
        projectName: buyerData.projectName || 'Dwellora Residence',
        bookingDate: todayFormatted,
        agreedPrice: Number(buyerData.dealAmount || 0),
        paidAmount: Number(buyerData.paidAmount || 0),
        balanceAmount: Math.max(0, Number(buyerData.dealAmount || 0) - Number(buyerData.paidAmount || 0)),
        status: (Number(buyerData.dealAmount || 0) - Number(buyerData.paidAmount || 0) === 0 && Number(buyerData.paidAmount || 0) > 0) ? 'CONFIRMED' : 'RESERVED',
        agreementStatus: 'Booking Form Executed',
        paymentPlan: buyerData.paymentPlan || 'TOKEN_ADVANCE'
      }] : []),
      paymentHistory: buyerData.initialPayment ? [{
        receiptNo: `RCP-2026-${String(Math.floor(100 + Math.random() * 900))}`,
        date: todayFormatted,
        amount: Number(buyerData.paidAmount || 0),
        paymentMode: buyerData.paymentMode || 'NEFT / RTGS',
        txnId: buyerData.txnId || `TXN-${Date.now().toString().slice(-8)}`,
        stage: 'Initial Booking Advance',
        status: 'CLEARED',
        invoiceNo: `INV-2026-${String(Math.floor(100 + Math.random() * 900))}`
      }] : [],
      documents: [
        { id: 'doc-1', title: `Booking Dossier (${newBuyer?.name || buyerData.name})`, type: 'REGISTRATION', date: todayFormatted, size: '1.4 MB', url: '#' }
      ],
      communications: [
        { id: 'comm-1', date: `${todayFormatted} 10:00 AM`, type: 'MEETING', agent: userName, summary: `Buyer profile created and enrolled by ${userName}.` }
      ],
      internalNotes: buyerData.internalNotes || '',
      cancellationHistory: []
    };

    const updated = [newBuyer, ...current];
    this.saveBuyers(updated);
    this.addActivity(`${userName} registered new buyer: "${newBuyer.name}" (${newBuyer.phone})`, 'add');
    return newBuyer;
  },

  updateBuyer(id, updatedFields, userName = 'Super Admin') {
    const current = this.getBuyers();
    let updatedBuyer = null;

    const updated = current.map(b => {
      if (b.id === id) {
        updatedBuyer = {
          ...b,
          ...updatedFields,
          kyc: {
            ...b.kyc,
            ...(updatedFields.kyc || {})
          }
        };
        return updatedBuyer;
      }
      return b;
    });

    this.saveBuyers(updated);
    this.addActivity(`${userName} updated profile for buyer: "${updatedBuyer?.name || id}"`, 'edit');
    return updatedBuyer;
  },

  deleteBuyer(id, userName = 'Super Admin') {
    const current = this.getBuyers();
    const target = current.find(b => b.id === id);
    if (!target) return current;

    const updated = current.filter(b => b.id !== id);
    this.saveBuyers(updated);
    this.addActivity(`${userName} removed buyer profile: "${target.name}"`, 'delete');
    return updated;
  },

  addPaymentToBuyer(buyerId, paymentData, userName = 'Super Admin') {
    const current = this.getBuyers();
    const todayFormatted = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    const updated = current.map(b => {
      if (b.id === buyerId) {
        const pAmt = Number(paymentData.amount) || 0;
        const newReceipt = {
          receiptNo: paymentData.receiptNo || `RCP-2026-${String(Math.floor(100 + Math.random() * 900))}`,
          date: paymentData.date || todayFormatted,
          amount: pAmt,
          paymentMode: paymentData.paymentMode || 'NEFT / RTGS',
          txnId: paymentData.txnId || `TXN-${Date.now().toString().slice(-8)}`,
          stage: paymentData.stage || 'Installment Payment',
          status: 'CLEARED',
          invoiceNo: paymentData.invoiceNo || `INV-2026-${String(Math.floor(100 + Math.random() * 900))}`
        };

        const updatedHistory = [newReceipt, ...(b.paymentHistory || [])];
        const updatedBookings = (b.bookingHistory || []).map(bk => {
          if (!paymentData.unitNumber || bk.unitNumber === paymentData.unitNumber) {
            const newPaid = (bk.paidAmount || 0) + pAmt;
            const newBal = Math.max(0, (bk.agreedPrice || 0) - newPaid);
            return {
              ...bk,
              paidAmount: newPaid,
              balanceAmount: newBal,
              status: newBal === 0 ? 'CONFIRMED' : bk.status
            };
          }
          return bk;
        });

        // Also add auto-generated receipt document
        const newDoc = {
          id: `doc-${Date.now()}`,
          title: `Payment Receipt ${newReceipt.receiptNo} (${newReceipt.stage})`,
          type: 'RECEIPT',
          date: todayFormatted,
          size: '1.1 MB',
          url: '#'
        };

        return {
          ...b,
          paymentHistory: updatedHistory,
          bookingHistory: updatedBookings,
          documents: [newDoc, ...(b.documents || [])]
        };
      }
      return b;
    });

    this.saveBuyers(updated);
    this.addActivity(`${userName} recorded payment of ₹${Number(paymentData.amount).toLocaleString('en-IN')} for buyer ${buyerId}`, 'payment');
    return updated;
  },

  cancelBuyerBooking(buyerId, unitNumber, cancellationData, userName = 'Super Admin') {
    const current = this.getBuyers();
    const todayFormatted = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    const updated = current.map(b => {
      if (b.id === buyerId) {
        const remainingUnits = (b.bookedUnits || []).filter(u => u !== unitNumber);
        const updatedBookings = (b.bookingHistory || []).map(bk => {
          if (bk.unitNumber === unitNumber) {
            return {
              ...bk,
              status: 'CANCELLED',
              agreementStatus: 'Booking Cancelled & Refund Initiated',
              cancelledDate: todayFormatted,
              cancellationReason: cancellationData.reason || 'Client withdrawal request',
              refundAmount: Number(cancellationData.refundAmount || 0)
            };
          }
          return bk;
        });

        const cancelEntry = {
          unitNumber,
          date: todayFormatted,
          reason: cancellationData.reason || 'Client requested cancellation',
          refundAmount: Number(cancellationData.refundAmount || 0),
          refundStatus: cancellationData.refundStatus || 'PROCESSED',
          authorizedBy: userName
        };

        return {
          ...b,
          bookedUnits: remainingUnits,
          bookingHistory: updatedBookings,
          cancellationHistory: [cancelEntry, ...(b.cancellationHistory || [])]
        };
      }
      return b;
    });

    this.saveBuyers(updated);

    // Release apartment back to AVAILABLE in inventory
    const apts = this.getApartments();
    const updatedApts = apts.map(a => {
      if (a.apartmentNumber === unitNumber) {
        return {
          ...a,
          status: 'AVAILABLE',
          buyer: null
        };
      }
      return a;
    });
    this.saveApartments(updatedApts);

    this.addActivity(`${userName} cancelled booking for Unit ${unitNumber} (Buyer: ${buyerId})`, 'delete');
    return updated;
  },

  addBuyerDocument(buyerId, docData, userName = 'Super Admin') {
    const current = this.getBuyers();
    const todayFormatted = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

    const updated = current.map(b => {
      if (b.id === buyerId) {
        const newDoc = {
          id: `doc-${Date.now()}`,
          title: docData.title,
          type: docData.type || 'DOCUMENT',
          date: todayFormatted,
          size: docData.size || '1.5 MB',
          url: docData.url || '#'
        };
        return {
          ...b,
          documents: [newDoc, ...(b.documents || [])]
        };
      }
      return b;
    });

    this.saveBuyers(updated);
    this.addActivity(`${userName} uploaded document "${docData.title}" for buyer ${buyerId}`, 'edit');
    return updated;
  },

  addBuyerCommunication(buyerId, commData, userName = 'Super Admin') {
    const current = this.getBuyers();
    const todayFormatted = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());

    const updated = current.map(b => {
      if (b.id === buyerId) {
        const newComm = {
          id: `comm-${Date.now()}`,
          date: commData.date || todayFormatted,
          type: commData.type || 'CALL',
          agent: commData.agent || userName,
          summary: commData.summary,
          nextFollowUp: commData.nextFollowUp || null
        };
        return {
          ...b,
          communications: [newComm, ...(b.communications || [])]
        };
      }
      return b;
    });

    this.saveBuyers(updated);
    this.addActivity(`${userName} logged CRM interaction with buyer ${buyerId}`, 'edit');
    return updated;
  },

  // Reset to initial clean state
  // --- Point 10: LOGIN SESSIONS & SECURITY AUDIT ---
  getLoginHistory() {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const defaultSessions = [
      { id: 'sess-101', name: 'Super Admin', email: 'superadmin@estatesphere.com', role: 'SUPER_ADMIN', ip: '192.168.1.104', location: 'Indore, MP', device: 'Windows 11 • Chrome 124', time: 'Today, 04:00 PM', status: 'ACTIVE' },
      { id: 'sess-102', name: 'Rohit Verma', email: 'rohit@estatesphere.com', role: 'ADMIN_MANAGER', ip: '192.168.1.118', location: 'Indore, MP', device: 'Windows 11 • Edge 123', time: 'Today, 02:30 PM', status: 'ACTIVE' },
      { id: 'sess-103', name: 'Sneha Rao', email: 'sneha@estatesphere.com', role: 'SALES_AGENT', ip: '103.21.144.18', location: 'Mumbai, MH', device: 'macOS Sonoma • Safari 17', time: 'Yesterday, 06:15 PM', status: 'LOGGED_OUT' },
      { id: 'sess-104', name: 'Arjun Kapoor', email: 'arjun@estatesphere.com', role: 'SALES_AGENT', ip: '49.207.211.55', location: 'New Delhi, DL', device: 'iOS 17 • Mobile Safari', time: '02 Nov 2026, 11:20 AM', status: 'EXPIRED' }
    ];
    safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(defaultSessions));
    return defaultSessions;
  },

  revokeSession(sessionId, actor = 'Super Admin') {
    const history = this.getLoginHistory().map(item => item.id === sessionId ? { ...item, status: 'REVOKED' } : item);
    safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(history));
    this.addActivity(`${actor} revoked active login session ref ${sessionId}`, 'security');
    this.notifyUpdate();
    return history;
  },

  // --- Point 13 & 14: BACKEND DIAGNOSTICS & HEALTH CHECK ---
  async checkBackendHealth() {
    const start = Date.now();
    try {
      const res = await fetch('/api/properties', { method: 'GET', headers: { 'Accept': 'application/json' } });
      const latency = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          status: 'CONNECTED',
          latencyMs: latency,
          recordsCount: Array.isArray(data) ? data.length : 0,
          endpoint: '/api/properties',
          springBootPort: '8085',
          databaseDialect: 'MySQLDialect',
          databaseName: 'estatesphere',
          timestamp: new Date().toLocaleTimeString('en-IN')
        };
      } else {
        return {
          online: false,
          status: `HTTP ${res.status}`,
          latencyMs: latency,
          endpoint: '/api/properties',
          springBootPort: '8085',
          databaseDialect: 'MySQLDialect',
          databaseName: 'estatesphere',
          timestamp: new Date().toLocaleTimeString('en-IN')
        };
      }
    } catch (err) {
      return {
        online: false,
        status: 'OFFLINE_SANDBOX_ACTIVE',
        error: err.message,
        endpoint: '/api/properties',
        springBootPort: '8085',
        databaseDialect: 'MySQLDialect',
        databaseName: 'estatesphere',
        timestamp: new Date().toLocaleTimeString('en-IN')
      };
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
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
