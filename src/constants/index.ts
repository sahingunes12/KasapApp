// App Constants
export const APP_NAME = 'KasapApp';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_BASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
export const API_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Service Types
export const SERVICE_TYPES = {
  KURBAN: 'kurban',
  ADAK: 'adak',
  SUKUR: 'sukur',
} as const;

export const SERVICE_TYPE_LABELS = {
  [SERVICE_TYPES.KURBAN]: 'Kurban',
  [SERVICE_TYPES.ADAK]: 'Adak',
  [SERVICE_TYPES.SUKUR]: 'Şükür',
} as const;

// Delivery Types
export const DELIVERY_TYPES = {
  PERSONAL: 'personal',
  CHARITY: 'charity',
  RESTAURANT: 'restaurant',
  AFRICA: 'africa',
} as const;

export const DELIVERY_TYPE_LABELS = {
  [DELIVERY_TYPES.PERSONAL]: 'Kişisel Teslimat',
  [DELIVERY_TYPES.CHARITY]: 'Bağış',
  [DELIVERY_TYPES.RESTAURANT]: 'Restoran',
  [DELIVERY_TYPES.AFRICA]: 'Afrika Dağıtımı',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
  DONATED: 'donated',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Beklemede',
  [ORDER_STATUS.SCHEDULED]: 'Planlandı',
  [ORDER_STATUS.IN_PROGRESS]: 'İşlemde',
  [ORDER_STATUS.COMPLETED]: 'Tamamlandı',
  [ORDER_STATUS.DELIVERED]: 'Teslim Edildi',
  [ORDER_STATUS.DONATED]: 'Bağışlandı',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  PAYPAL: 'paypal',
  IBAN: 'iban',
  LOCAL: 'local',
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.IBAN]: 'IBAN Transfer',
  [PAYMENT_METHODS.LOCAL]: 'Yerel Ödeme',
} as const;

// Languages
export const LANGUAGES = {
  TURKISH: 'tr',
  ENGLISH: 'en',
  ARABIC: 'ar',
} as const;

export const LANGUAGE_LABELS = {
  [LANGUAGES.TURKISH]: 'Türkçe',
  [LANGUAGES.ENGLISH]: 'English',
  [LANGUAGES.ARABIC]: 'العربية',
} as const;

// Validation Constants
export const VALIDATION = {
  MAX_SPECIAL_NOTES_LENGTH: 500,
  MIN_PASSWORD_LENGTH: 6,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mov'],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
  INVALID_CREDENTIALS: 'Geçersiz e-posta veya şifre.',
  EMAIL_ALREADY_EXISTS: 'Bu e-posta adresi zaten kullanımda.',
  WEAK_PASSWORD: 'Şifre en az 6 karakter olmalıdır.',
  REQUIRED_FIELD: 'Bu alan zorunludur.',
  INVALID_EMAIL: 'Geçerli bir e-posta adresi girin.',
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük. Maksimum 50MB.',
  INVALID_FILE_TYPE: 'Geçersiz dosya türü.',
  PAYMENT_FAILED: 'Ödeme başarısız. Lütfen tekrar deneyin.',
  ORDER_CREATION_FAILED: 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Başarıyla giriş yapıldı.',
  REGISTER_SUCCESS: 'Hesap başarıyla oluşturuldu.',
  ORDER_CREATED: 'Sipariş başarıyla oluşturuldu.',
  PAYMENT_SUCCESS: 'Ödeme başarıyla tamamlandı.',
  PROFILE_UPDATED: 'Profil başarıyla güncellendi.',
  APPOINTMENT_BOOKED: 'Randevu başarıyla rezerve edildi.',
} as const;

// Navigation Constants
export const ROUTES = {
  WELCOME: 'Welcome',
  AUTH: 'Auth',
  MAIN: 'Main',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  HOME: 'Home',
  ORDERS: 'Orders',
  CALENDAR: 'Calendar',
  MEDIA: 'Media',
  PROFILE: 'Profile',
  ORDER_DETAILS: 'OrderDetails',
  PAYMENT: 'Payment',
  ORDER_CONFIRMATION: 'OrderConfirmation',
} as const; 