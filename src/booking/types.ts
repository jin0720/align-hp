/**
 * types.ts - LINE Mini App 予約システムの型定義
 */

export type BookingStep =
  | 'menu'
  | 'datetime'
  | 'confirm'
  | 'complete'
  | 'history';

export interface Menu {
  id: string;
  name: string;
  prices: {
    [key: number]: {
      original: number;
      discounted: number;
      label: string;
    };
  };
}

export interface Booking {
  date: string;
  time: string;
  menu: string;
  duration: number;
  name: string;
  userId?: string;
  comment?: string;
}

export interface BookingSession extends Booking {
  endTime?: string;
  bookingRef?: string;
}

export interface AvailabilityResponse {
  date: string;
  duration: number;
  slots: string[];
}

export interface BookingHistory {
  rowIndex: number;
  date: string;
  time: string;
  endTime: string;
  menu: string;
  duration: number;
  name: string;
  userId: string;
  status: string;
}

export interface BookingContextType {
  // State
  currentStep: BookingStep;
  booking: BookingSession;
  menus: Menu[];
  availableSlots: string[];
  weekAvailability: { [date: string]: string[] };
  weekLoading: boolean;
  userProfile: {
    userId: string;
    name: string;
  } | null;
  bookingHistory: BookingHistory[];
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: BookingStep) => void;
  updateBooking: (data: Partial<BookingSession>) => void;
  fetchMenus: () => Promise<void>;
  fetchAvailableSlots: (date: string, duration: number) => Promise<void>;
  fetchWeekAvailability: (weekStart: string, duration: number) => Promise<void>;
  submitBooking: () => Promise<void>;
  fetchBookingHistory: (userId: string) => Promise<void>;
  cancelBooking: (rowIndex: number, booking: BookingHistory) => Promise<void>;
  resetBooking: () => void;
}
