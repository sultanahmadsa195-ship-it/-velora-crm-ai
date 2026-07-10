import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Customer,
  Task,
  Service,
  Appointment,
  Invoice,
  Payment,
  Quote,
  Notification,
  Document,
  Review,
  BusinessSettings,
  UserProfile,
  CustomerNote,
  CustomerHistory
} from '../types';
import {
  initialCustomers,
  initialTasks,
  initialServices,
  initialAppointments,
  initialInvoices,
  initialPayments,
  initialQuotes,
  initialNotifications,
  initialDocuments,
  initialReviews,
  initialSettings,
  initialProfile,
  initialNotes,
  initialHistory
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where
} from '../lib/firebase';

interface BusinessContextType {
  customers: Customer[];
  tasks: Task[];
  services: Service[];
  appointments: Appointment[];
  invoices: Invoice[];
  payments: Payment[];
  quotes: Quote[];
  notifications: Notification[];
  documents: Document[];
  reviews: Review[];
  settings: BusinessSettings;
  profile: UserProfile;
  customerNotes: CustomerNote[];
  customerHistory: CustomerHistory[];

  // Mutations
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt' | 'totalSpent'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addService: (s: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  bookAppointment: (appt: Omit<Appointment, 'id' | 'reminderSent'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  recordPayment: (invoiceId: string, amount: number, method: Payment['method'], ref?: string) => void;
  deleteInvoice: (id: string) => void;

  createQuote: (q: Omit<Quote, 'id' | 'quoteNumber'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  convertQuoteToInvoice: (quoteId: string) => Invoice | null;
  deleteQuote: (id: string) => void;

  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  uploadDocument: (name: string, size: string, type: string, fileData?: string, customerId?: string) => Document;
  deleteDocument: (id: string) => void;

  addCustomerNote: (customerId: string, note: string, type: CustomerNote['type']) => void;
  deleteCustomerNote: (id: string) => void;

  addReview: (customerName: string, rating: number, reviewText: string, customerId?: string) => void;
  respondToReview: (id: string, responseText: string) => void;

  updateSettings: (updates: Partial<BusinessSettings>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Auth & Toast System
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  currentUser: any;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string, firstName: string, lastName: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  toast: { show: boolean; message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  
  // Active module states
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setTheme } = useTheme();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Firebase Auth and Loading States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);

  const setIsAuthenticated = (val: boolean) => {
    setIsAuthenticatedState(val);
  };

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Loaded database states from Firestore/Firebase
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [customerHistory, setCustomerHistory] = useState<CustomerHistory[]>([]);

  // Apply theme dynamically when settings change
  useEffect(() => {
    if (settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings, setTheme]);

  // Auth Operations
  const signInWithEmail = async (emailStr: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, emailStr, pass);
  };

  const signUpWithEmail = async (emailStr: string, pass: string, firstName: string, lastName: string) => {
    const userCred = await createUserWithEmailAndPassword(auth, emailStr, pass);
    if (userCred.user) {
      const displayName = `${firstName} ${lastName}`;
      const newProfile: UserProfile = {
        name: displayName,
        email: emailStr,
        role: 'Managing Director & Founder',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '+1 (555) 123-4567',
        notificationPreferences: {
          appointments: true,
          tasks: true,
          payments: true,
          reviews: true,
          emails: false
        }
      };
      await setDoc(doc(db, 'profiles', userCred.user.uid), { ...newProfile, userId: userCred.user.uid });
      setProfile(newProfile);
    }
    return userCred;
  };

  const signInWithGoogle = async () => {
    const userCred = await signInWithPopup(auth, googleProvider);
    if (userCred.user) {
      const pDoc = await getDoc(doc(db, 'profiles', userCred.user.uid));
      if (!pDoc.exists()) {
        const newProfile: UserProfile = {
          name: userCred.user.displayName || 'Google Operator',
          email: userCred.user.email || '',
          role: 'Managing Director & Founder',
          avatar: userCred.user.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          phone: userCred.user.phoneNumber || '+1 (555) 123-4567',
          notificationPreferences: {
            appointments: true,
            tasks: true,
            payments: true,
            reviews: true,
            emails: false
          }
        };
        await setDoc(doc(db, 'profiles', userCred.user.uid), { ...newProfile, userId: userCred.user.uid });
        setProfile(newProfile);
      }
    }
    return userCred;
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const resetPassword = async (emailStr: string) => {
    await sendPasswordResetEmail(auth, emailStr);
  };

  // Reset helper
  const resetStatesToDefaults = () => {
    setCustomers([]);
    setTasks([]);
    setServices([]);
    setAppointments([]);
    setInvoices([]);
    setPayments([]);
    setQuotes([]);
    setNotifications([]);
    setDocuments([]);
    setReviews([]);
    setSettings(initialSettings);
    setProfile(initialProfile);
    setCustomerNotes([]);
    setCustomerHistory([]);
  };

  // Load user data from Firestore
  const loadAllUserData = async (uid: string) => {
    try {
      // 1. Settings
      let currentSettings = initialSettings;
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', uid));
        if (settingsDoc.exists()) {
          currentSettings = settingsDoc.data() as BusinessSettings;
          localStorage.setItem(`settings_${uid}`, JSON.stringify(currentSettings));
        } else {
          await setDoc(doc(db, 'settings', uid), { ...initialSettings, userId: uid });
          localStorage.setItem(`settings_${uid}`, JSON.stringify(initialSettings));
        }
      } catch (err: any) {
        console.warn('Failed to load settings from server, trying local cache/storage:', err);
        const cached = localStorage.getItem(`settings_${uid}`);
        if (cached) {
          try {
            currentSettings = JSON.parse(cached);
          } catch (e) {
            console.error('Failed to parse cached settings:', e);
          }
        }
      }
      setSettings(currentSettings);

      // 2. Profile
      let currentProfile = initialProfile;
      try {
        const profileDoc = await getDoc(doc(db, 'profiles', uid));
        if (profileDoc.exists()) {
          currentProfile = profileDoc.data() as UserProfile;
          localStorage.setItem(`profile_${uid}`, JSON.stringify(currentProfile));
        } else {
          await setDoc(doc(db, 'profiles', uid), { ...initialProfile, userId: uid });
          localStorage.setItem(`profile_${uid}`, JSON.stringify(initialProfile));
        }
      } catch (err: any) {
        console.warn('Failed to load profile from server, trying local cache/storage:', err);
        const cached = localStorage.getItem(`profile_${uid}`);
        if (cached) {
          try {
            currentProfile = JSON.parse(cached);
          } catch (e) {
            console.error('Failed to parse cached profile:', e);
          }
        }
      }
      setProfile(currentProfile);

      // 3. Collection loaders
      const loadCollection = async (collName: string, setter: (val: any) => void, initialData: any[]) => {
        try {
          const qSnap = await getDocs(query(collection(db, collName), where('userId', '==', uid)));
          if (!qSnap.empty) {
            const list = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setter(list);
            localStorage.setItem(`${collName}_${uid}`, JSON.stringify(list));
          } else {
            try {
              for (const item of initialData) {
                const { id, ...itemData } = item;
                await setDoc(doc(db, collName, id), { ...itemData, userId: uid });
              }
            } catch (writeErr) {
              console.warn(`Failed to seed collection ${collName} because client may be offline:`, writeErr);
            }
            setter(initialData);
            localStorage.setItem(`${collName}_${uid}`, JSON.stringify(initialData));
          }
        } catch (err: any) {
          console.warn(`Failed to load ${collName} from Firestore, trying local cache/storage:`, err);
          const cached = localStorage.getItem(`${collName}_${uid}`);
          if (cached) {
            try {
              setter(JSON.parse(cached));
            } catch (e) {
              console.error(`Failed to parse cached ${collName}:`, e);
              setter(initialData);
            }
          } else {
            setter(initialData);
          }
        }
      };

      await loadCollection('customers', setCustomers, initialCustomers);
      await loadCollection('tasks', setTasks, initialTasks);
      await loadCollection('services', setServices, initialServices);
      await loadCollection('appointments', setAppointments, initialAppointments);
      await loadCollection('invoices', setInvoices, initialInvoices);
      await loadCollection('payments', setPayments, initialPayments);
      await loadCollection('quotes', setQuotes, initialQuotes);
      await loadCollection('notifications', setNotifications, initialNotifications);
      await loadCollection('documents', setDocuments, initialDocuments);
      await loadCollection('reviews', setReviews, initialReviews);
      await loadCollection('customerNotes', setCustomerNotes, initialNotes);
      await loadCollection('customerHistory', setCustomerHistory, initialHistory);

    } catch (err) {
      console.error('Error loading Firestore data:', err);
      showToast('Failed to sync with Firebase database.', 'error');
    }
  };

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticatedState(true);
        await loadAllUserData(user.uid);
      } else {
        setCurrentUser(null);
        setIsAuthenticatedState(false);
        resetStatesToDefaults();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // MUTATIONS IMPLEMENTATIONS
  const syncToFirestore = async (collectionName: string, docId: string, data: any, isDelete: boolean = false) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    // Save/update in localStorage first for immediate offline local UI update resilience
    try {
      const cached = localStorage.getItem(`${collectionName}_${uid}`);
      if (cached) {
        let list = JSON.parse(cached);
        if (isDelete) {
          list = list.filter((item: any) => item.id !== docId);
        } else {
          const index = list.findIndex((item: any) => item.id === docId);
          if (index !== -1) {
            list[index] = { ...list[index], ...data };
          } else {
            list.unshift({ id: docId, ...data });
          }
        }
        localStorage.setItem(`${collectionName}_${uid}`, JSON.stringify(list));
      }
    } catch (err) {
      console.warn(`Failed to update localStorage cache for ${collectionName}:`, err);
    }

    try {
      const docRef = doc(db, collectionName, docId);
      if (isDelete) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { ...data, userId: uid }, { merge: true });
      }
    } catch (err) {
      console.error(`Error syncing ${collectionName} to Firestore:`, err);
    }
  };

  const addCustomer = (c: Omit<Customer, 'id' | 'createdAt' | 'totalSpent'>) => {
    const newCustomer: Customer = {
      ...c,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalSpent: 0
    };
    setCustomers(prev => [newCustomer, ...prev]);
    syncToFirestore('customers', newCustomer.id, newCustomer);

    // Track history
    const hist: CustomerHistory = {
      id: `hist-${Date.now()}`,
      customerId: newCustomer.id,
      type: 'system',
      description: 'Customer profile registered',
      date: new Date().toISOString()
    };
    setCustomerHistory(prev => [hist, ...prev]);
    syncToFirestore('customerHistory', hist.id, hist);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const item = { ...c, ...updates };
        syncToFirestore('customers', id, item);
        return item;
      }
      return c;
    }));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setCustomerNotes(prev => prev.filter(n => n.customerId !== id));
    setCustomerHistory(prev => prev.filter(h => h.customerId !== id));
    syncToFirestore('customers', id, null, true);
  };

  const addTask = (t: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...t,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    syncToFirestore('tasks', newTask.id, newTask);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const item = { ...t, ...updates };
        syncToFirestore('tasks', id, item);
        return item;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    syncToFirestore('tasks', id, null, true);
  };

  const addService = (s: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...s,
      id: `srv-${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
    syncToFirestore('services', newService.id, newService);
    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const item = { ...s, ...updates };
        syncToFirestore('services', id, item);
        return item;
      }
      return s;
    }));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    syncToFirestore('services', id, null, true);
  };

  const bookAppointment = (appt: Omit<Appointment, 'id' | 'reminderSent'>) => {
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}`,
      reminderSent: false
    };
    setAppointments(prev => [newAppt, ...prev]);
    syncToFirestore('appointments', newAppt.id, newAppt);

    // Log history
    const srv = services.find(s => s.id === appt.serviceId);
    const hist: CustomerHistory = {
      id: `hist-${Date.now()}`,
      customerId: appt.customerId,
      type: 'appointment',
      description: `Appointment booked: ${srv?.name || 'Service Appointment'}`,
      date: new Date().toISOString()
    };
    setCustomerHistory(prev => [hist, ...prev]);
    syncToFirestore('customerHistory', hist.id, hist);

    addNotification(
      'New Appointment Scheduled',
      `Appointment set on ${new Date(appt.start).toLocaleDateString()} for ${customers.find(c => c.id === appt.customerId)?.name || 'client'}.`,
      'appointment'
    );

    return newAppt;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const item = { ...a, ...updates };
        syncToFirestore('appointments', id, item);
        return item;
      }
      return a;
    }));
    
    if (updates.status === 'completed') {
      const appt = appointments.find(a => a.id === id);
      if (appt) {
        const srv = services.find(s => s.id === appt.serviceId);
        const hist: CustomerHistory = {
          id: `hist-${Date.now()}`,
          customerId: appt.customerId,
          type: 'appointment',
          description: `Appointment marked complete: ${srv?.name || 'Service Session'}`,
          date: new Date().toISOString()
        };
        setCustomerHistory(prev => [hist, ...prev]);
        syncToFirestore('customerHistory', hist.id, hist);
      }
    }
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    syncToFirestore('appointments', id, null, true);
  };

  const createInvoice = (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const serial = invoices.length + 1;
    const invoiceNumber = `INV-2026-${String(serial).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber
    };
    setInvoices(prev => [newInvoice, ...prev]);
    syncToFirestore('invoices', newInvoice.id, newInvoice);

    // Track history
    const hist: CustomerHistory = {
      id: `hist-${Date.now()}`,
      customerId: inv.customerId,
      type: 'invoice',
      description: `Invoice ${invoiceNumber} issued`,
      amount: inv.total,
      date: new Date().toISOString()
    };
    setCustomerHistory(prev => [hist, ...prev]);
    syncToFirestore('customerHistory', hist.id, hist);

    addNotification(
      'Invoice Generated',
      `Invoice ${invoiceNumber} issued for $${inv.total.toFixed(2)}`,
      'payment'
    );

    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const item = { ...inv, ...updates };
        syncToFirestore('invoices', id, item);
        return item;
      }
      return inv;
    }));
  };

  const recordPayment = (invoiceId: string, amount: number, method: Payment['method'], ref?: string) => {
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      invoiceId,
      amount,
      paymentDate: new Date().toISOString(),
      method,
      referenceNumber: ref
    };
    setPayments(prev => [newPayment, ...prev]);
    syncToFirestore('payments', newPayment.id, newPayment);

    // Update invoice status to 'paid'
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        // Track customer lifetime spent update
        setCustomers(custs => custs.map(c => {
          if (c.id === inv.customerId) {
            const updatedCust = { ...c, totalSpent: c.totalSpent + amount };
            syncToFirestore('customers', c.id, updatedCust);
            return updatedCust;
          }
          return c;
        }));
        
        // Track customer history
        const hist: CustomerHistory = {
          id: `hist-${Date.now()}`,
          customerId: inv.customerId,
          type: 'payment',
          description: `Payment of $${amount.toFixed(2)} received for ${inv.invoiceNumber}`,
          amount,
          date: new Date().toISOString()
        };
        setCustomerHistory(h => [hist, ...h]);
        syncToFirestore('customerHistory', hist.id, hist);

        const updatedInv = { ...inv, status: 'paid' as const };
        syncToFirestore('invoices', inv.id, updatedInv);
        return updatedInv;
      }
      return inv;
    }));

    addNotification(
      'Payment Recorded',
      `Successfully recorded $${amount.toFixed(2)} payment via ${method}`,
      'payment'
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    syncToFirestore('invoices', id, null, true);
  };

  const createQuote = (q: Omit<Quote, 'id' | 'quoteNumber'>) => {
    const serial = quotes.length + 1;
    const quoteNumber = `EST-2026-${String(serial).padStart(3, '0')}`;
    const newQuote: Quote = {
      ...q,
      id: `qte-${Date.now()}`,
      quoteNumber
    };
    setQuotes(prev => [newQuote, ...prev]);
    syncToFirestore('quotes', newQuote.id, newQuote);
    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === id) {
        const item = { ...q, ...updates };
        syncToFirestore('quotes', id, item);
        return item;
      }
      return q;
    }));
  };

  const convertQuoteToInvoice = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return null;

    // Build items safely for both schema shapes
    const items = quote.items || [
      {
        id: `item-${Date.now()}`,
        serviceId: quote.serviceId,
        description: services.find(s => s.id === quote.serviceId)?.name || 'Consulting Service',
        quantity: 1,
        unitPrice: quote.estimatedPrice || 0,
        amount: quote.estimatedPrice || 0
      }
    ];

    const subtotal = quote.subtotal ?? quote.estimatedPrice ?? 0;
    const tax = quote.tax ?? Math.round(subtotal * 0.08);
    const discount = quote.discount ?? 0;
    const total = quote.total ?? (subtotal + tax - discount);

    // Convert
    const newInv = createInvoice({
      customerId: quote.customerId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days later
      items,
      subtotal,
      tax,
      discount,
      total,
      status: 'sent',
      notes: quote.notes || 'Converted from quote estimate.'
    });

    // Update quote status
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'converted' as const } : q));

    return newInv;
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      date: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const uploadDocument = (name: string, size: string, type: string, fileData?: string, customerId?: string) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name,
      size,
      type,
      fileData,
      customerId,
      createdAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);

    if (customerId) {
      const hist: CustomerHistory = {
        id: `hist-${Date.now()}`,
        customerId,
        type: 'note',
        description: `Document uploaded: ${name}`,
        date: new Date().toISOString()
      };
      setCustomerHistory(prev => [hist, ...prev]);
    }

    addNotification('Document Saved', `Saved document "${name}" in customer repository`, 'system');
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const addCustomerNote = (customerId: string, note: string, type: CustomerNote['type']) => {
    const newNote: CustomerNote = {
      id: `note-${Date.now()}`,
      customerId,
      note,
      author: profile.name,
      createdAt: new Date().toISOString(),
      type
    };
    setCustomerNotes(prev => [newNote, ...prev]);

    const hist: CustomerHistory = {
      id: `hist-${Date.now()}`,
      customerId,
      type: 'note',
      description: `Note added by ${profile.name}`,
      date: new Date().toISOString()
    };
    setCustomerHistory(prev => [hist, ...prev]);
  };

  const deleteCustomerNote = (id: string) => {
    setCustomerNotes(prev => prev.filter(n => n.id !== id));
  };

  const addReview = (customerName: string, rating: number, reviewText: string, customerId?: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerId,
      customerName,
      rating,
      reviewText,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setReviews(prev => [newReview, ...prev]);
    addNotification('New Feedback Received', `Review (${rating}★) received from ${customerName}.`, 'review');
  };

  const respondToReview = (id: string, responseText: string) => {
    setReviews(prev => prev.map(rev => rev.id === id ? { ...rev, response: responseText, status: 'approved' } : rev));
  };

  const updateSettings = (updates: Partial<BusinessSettings>) => {
    setSettings(prev => {
      const item = { ...prev, ...updates };
      if (auth.currentUser) {
        try {
          localStorage.setItem(`settings_${auth.currentUser.uid}`, JSON.stringify(item));
        } catch (e) {
          console.warn('Failed to cache settings locally:', e);
        }
        setDoc(doc(db, 'settings', auth.currentUser.uid), item, { merge: true })
          .catch(err => console.error(err));
      }
      return item;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const item = { ...prev, ...updates };
      if (auth.currentUser) {
        try {
          localStorage.setItem(`profile_${auth.currentUser.uid}`, JSON.stringify(item));
        } catch (e) {
          console.warn('Failed to cache profile locally:', e);
        }
        setDoc(doc(db, 'profiles', auth.currentUser.uid), item, { merge: true })
          .catch(err => console.error(err));
      }
      return item;
    });
  };

  return (
    <BusinessContext.Provider value={{
      customers,
      tasks,
      services,
      appointments,
      invoices,
      payments,
      quotes,
      notifications,
      documents,
      reviews,
      settings,
      profile,
      customerNotes,
      customerHistory,

      addCustomer,
      updateCustomer,
      deleteCustomer,
      addTask,
      updateTask,
      deleteTask,
      addService,
      updateService,
      deleteService,
      bookAppointment,
      updateAppointment,
      deleteAppointment,
      createInvoice,
      updateInvoice,
      recordPayment,
      deleteInvoice,
      createQuote,
      updateQuote,
      convertQuoteToInvoice,
      deleteQuote,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      uploadDocument,
      deleteDocument,
      addCustomerNote,
      deleteCustomerNote,
      addReview,
      respondToReview,
      updateSettings,
      updateProfile,
      
      isAuthenticated,
      setIsAuthenticated,
      currentUser,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOutUser,
      resetPassword,
      toast,
      showToast,
      hideToast,

      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
export default BusinessContext;
