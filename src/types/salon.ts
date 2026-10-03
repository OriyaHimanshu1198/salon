export type ViewMode =
  | 'daily-dispatch'
  | 'client-engine'
  | 'express-checkout-pos'
  | 'stylists-stations'
  | 'manage-therapies'
  | 'manage-offers'
  | 'performance-reports';

export type AppointmentStatus =
  | 'in-service'
  | 'waiting'
  | 'completed'
  | 'confirmed'
  | 'no-show';

export interface Stylist {
  id: string;
  name: string;
  role: string;
  station: string;
  avatar: string;
  tier: string;
  bookingsCount: number;
  serviceRevenue: number;
  retailSold: number;
  commissionRate: number;
  estimatedCommission: number;
  status: 'In-Service' | 'Active' | 'Break' | 'Off-Duty';
  chairUtilization: number;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  membershipDate: string;
  vipTier?: 'VIP Platinum' | 'VIP Gold' | 'VIP' | 'New' | 'Standard';
  currentStatus: 'In-Service' | 'Active' | 'Waiting' | 'Completed' | 'Lapsed';
  currentStation?: string;
  primaryStylist: string;
  totalVisits: number;
  avgTicket: number;
  rebookRate: number;
  ltv: number;
  avatar?: string;
  allergies?: string[];
  beveragePreference?: string;
  sensoryNotes?: string[];
  baseFormula?: {
    title: string;
    details: string;
    developer: string;
    time: string;
  };
  tonerFormula?: {
    title: string;
    details: string;
    solution: string;
    time: string;
  };
  activeFormulaSnippet?: string;
  history: {
    id: string;
    title: string;
    date: string;
    stylist: string;
    status: 'In-Service' | 'Completed' | 'Paid';
    paymentMethod?: string;
    totalAmount: number;
    retailItem?: {
      name: string;
      price: number;
    };
    durationText?: string;
    station?: string;
  }[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  isVip?: boolean;
  stylistId: string;
  stylistName: string;
  serviceName: string;
  station: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "11:30"
  durationMinutes: number;
  status: AppointmentStatus;
  basePrice: number;
  addons?: { name: string; price: number }[];
  formulaNote?: string;
  subtotal: number;
  gridColumn: number; // 0 to 4
  topPx: number;
  heightPx: number;
}

export interface RetailProduct {
  id: string;
  brand: string;
  name: string;
  size: string;
  price: number;
  image: string;
  quantityInCart: number;
  inStock: number;
}

export interface CheckoutTicket {
  id: string;
  ticketNumber: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  clientEmail: string;
  stylistName: string;
  station: string;
  status: 'In-Service' | 'Completed' | 'Draft';
  services: {
    id: string;
    name: string;
    stylist: string;
    stylistLevel: string;
    durationMin: number;
    price: number;
    isAddon?: boolean;
  }[];
  retailItems: RetailProduct[];
  promoCode: string;
  promoDiscount: number;
  taxRate: number;
  selectedTipPercent: number; // 18, 20, 22, 25, or custom
  customTipAmount?: number;
  promptRebooking: boolean;
  rebookingDate?: string;
  rebookingService?: string;
}

export interface TherapyItem {
  id: string;
  name: string;
  category: string; // e.g. "Men's Waxing", "Scalp & Trichology", "Deep Bonding & Repair", etc.
  durationMinutes: number;
  price: number;
  commissionRate: number;
  station: string;
  protocolBrief: string; // Details about treatment
  treatmentDetails?: string; // Rich details about treatment
  status: 'Active' | 'Seasonal' | 'Draft';
  isPopular?: boolean;
  onlineBookingEnabled: boolean;
  consumables?: {
    name: string;
    brand: string;
    amount: string;
    cost: number;
  }[];
  consumableCost?: number;
  netMarginPercent?: number;
  stationDevice?: string;
  deviceDetails?: string;
  addOnPairings?: {
    serviceName: string;
    percentage: number;
  }[];
  frontDeskScript?: string;
}

export interface OfferCampaign {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  incentiveType: 'pct' | 'fixed' | 'therapy' | 'retail';
  incentiveHeadline: string;
  incentiveSub: string;
  targetEligibility: string;
  redemptionsUsed: number;
  poolLimit: number | 'Unlimited';
  status: 'Active' | 'Scheduled' | 'Expiring Soon' | 'Archived';
  discountValueDescription: string;
  inventoryScope: string;
  commissionProtection: boolean;
  checkoutTrigger: string;
  activeOnPos: boolean;
  liveSimulation: {
    client: string;
    vipTier: string;
    ticketNum: string;
    service: string;
    servicePrice: number;
    retailItem: string;
    retailPrice: number;
    discountAmount: number;
    totalAmount: number;
  };
}
