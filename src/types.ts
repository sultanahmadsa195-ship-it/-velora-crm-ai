export interface BusinessSettings {
  businessName: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  currency: string;
  businessHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  theme: 'light' | 'dark' | 'system';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
  notificationPreferences: {
    appointments: boolean;
    tasks: boolean;
    payments: boolean;
    reviews: boolean;
    emails: boolean;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  totalSpent: number;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  note: string;
  author: string;
  createdAt: string;
  type: 'internal' | 'client_communication';
}

export interface CustomerHistory {
  id: string;
  customerId: string;
  type: 'appointment' | 'invoice' | 'payment' | 'note' | 'system';
  description: string;
  amount?: number;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  customerId: string;
  serviceId: string;
  start: string; // ISO string
  end: string;   // ISO string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  reminderSent: boolean;
}

export interface InvoiceItem {
  id: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'credit_card' | 'bank_transfer' | 'paypal' | 'other';
  referenceNumber?: string;
}

export interface Quote {
  id: string;
  customerId: string;
  quoteNumber: string;
  issueDate?: string;
  expiryDate?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  status: 'draft' | 'sent' | 'approved' | 'declined' | 'converted' | 'drafted' | 'accepted';
  notes: string;
  serviceId?: string;
  estimatedPrice?: number;
  validUntil?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'task' | 'payment' | 'review' | 'system';
  read: boolean;
  date: string;
}

export interface Document {
  id: string;
  name: string;
  customerId?: string;
  invoiceId?: string;
  size: string;
  type: string; // e.g., 'pdf', 'png', 'docx'
  fileData?: string; // base64 representation if uploaded locally
  createdAt: string;
}

export interface Review {
  id: string;
  customerId?: string;
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
  response?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
