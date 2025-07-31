// User Types
export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  createdAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  language: 'tr' | 'en' | 'ar';
  notificationPreferences: NotificationSettings;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  orderUpdates: boolean;
  mediaUpdates: boolean;
  appointmentReminders: boolean;
}

// Order Types
export type ServiceType = 'kurban' | 'adak' | 'sukur';
export type DeliveryType = 'personal' | 'charity' | 'restaurant' | 'africa';
export type OrderStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'delivered' | 'donated';

export interface Order {
  id: string;
  userId: string;
  serviceType: ServiceType;
  deliveryType: DeliveryType;
  appointmentDate?: Date;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  specialNotes?: string;
  charityOrganization?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  serviceType: ServiceType;
  deliveryType: DeliveryType;
  appointmentDate?: Date;
  totalAmount: number;
  currency: string;
  specialNotes?: string;
  charityOrganization?: string;
}

// Appointment Types
export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  capacity: number;
  bookedCount: number;
}

export interface Appointment {
  id: string;
  orderId: string;
  timeSlot: TimeSlot;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Media Types
export interface MediaFile {
  id: string;
  orderId: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  orderId: string;
  userId: string;
  content: string;
  rating: number;
  isAnonymous: boolean;
  authorName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface CreateReviewRequest {
  orderId: string;
  content: string;
  rating: number;
  isAnonymous: boolean;
  authorName?: string;
}

// Payment Types
export type PaymentMethod = 'paypal' | 'iban' | 'local';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Main: undefined;
  OrderDetails: { serviceType: 'KURBAN' | 'ADAK' | 'SUKUR' };
  OrderConfirmation: { orderId: string };
  Payment: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Calendar: undefined;
  Media: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
}; 