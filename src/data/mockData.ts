import {
  BusinessSettings,
  UserProfile,
  Customer,
  CustomerNote,
  CustomerHistory,
  Task,
  Service,
  Appointment,
  Invoice,
  Payment,
  Quote,
  Notification,
  Document,
  Review
} from '../types';

export const initialSettings: BusinessSettings = {
  businessName: 'Velora CRM AI',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  email: 'hello@veloracrm.ai',
  phone: '+1 (555) 321-9876',
  address: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
  website: 'https://veloracrm.ai',
  currency: 'USD',
  businessHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '10:00', close: '15:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: true }
  },
  theme: 'light'
};

export const initialProfile: UserProfile = {
  name: 'Sarah Jenkins',
  email: 'sjenkins@veloracrm.ai',
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

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Eleanor Vance',
    email: 'eleanor@vancecorp.com',
    phone: '+1 (555) 234-5678',
    company: 'Vance Corp',
    address: '456 Redwood Ave, Redwood City, CA 94063',
    status: 'active',
    createdAt: '2026-01-12T10:00:00Z',
    totalSpent: 4850
  },
  {
    id: 'cust-2',
    name: 'Marcus Brody',
    email: 'mbrody@brodymedia.io',
    phone: '+1 (555) 345-6789',
    company: 'Brody Media Group',
    address: '789 Sunset Blvd, Los Angeles, CA 90028',
    status: 'active',
    createdAt: '2026-02-20T14:30:00Z',
    totalSpent: 12400
  },
  {
    id: 'cust-3',
    name: 'Dr. Rene Belloq',
    email: 'rbelloq@antiquities.org',
    phone: '+1 (555) 456-7890',
    company: 'Historical Preservation Trust',
    address: '12 Rue de l\'Université, Paris, France 75007',
    status: 'inactive',
    createdAt: '2026-03-05T09:15:00Z',
    totalSpent: 1500
  },
  {
    id: 'cust-4',
    name: 'Marion Ravenwood',
    email: 'marion@theabyssinian.com',
    phone: '+1 (555) 567-8901',
    company: 'The Abyssinian Lounge',
    address: '52 Sherif St, Cairo, Egypt',
    status: 'active',
    createdAt: '2026-04-18T16:45:00Z',
    totalSpent: 8750
  },
  {
    id: 'cust-5',
    name: 'Sallah Mohammed Al-Kahir',
    email: 'sallah@digexperts.net',
    phone: '+1 (555) 678-9012',
    company: 'Cairo Excavation & Logistics',
    address: '10 Sharia El Nil, Cairo, Egypt',
    status: 'active',
    createdAt: '2026-05-02T11:00:00Z',
    totalSpent: 3200
  }
];

export const initialNotes: CustomerNote[] = [
  {
    id: 'note-1',
    customerId: 'cust-1',
    note: 'Requested specific corporate color palette (navy blue and copper gold). Prefers minimal serif typography.',
    author: 'Sarah Jenkins',
    createdAt: '2026-05-10T14:00:00Z',
    type: 'internal'
  },
  {
    id: 'note-2',
    customerId: 'cust-2',
    note: 'Reviewed Q2 marketing campaign and agreed on an increase in social ad spend. Scheduled follow-up in two weeks.',
    author: 'Sarah Jenkins',
    createdAt: '2026-06-18T11:30:00Z',
    type: 'client_communication'
  },
  {
    id: 'note-3',
    customerId: 'cust-4',
    note: 'Loves the brand strategy draft. Asked if we could integrate booking engine templates directly into the landing page.',
    author: 'Sarah Jenkins',
    createdAt: '2026-06-25T15:20:00Z',
    type: 'internal'
  }
];

export const initialHistory: CustomerHistory[] = [
  {
    id: 'hist-1',
    customerId: 'cust-1',
    type: 'note',
    description: 'Added internal design preference notes',
    date: '2026-05-10T14:00:00Z'
  },
  {
    id: 'hist-2',
    customerId: 'cust-1',
    type: 'appointment',
    description: 'Completed Brand Audit session',
    date: '2026-05-12T10:00:00Z'
  },
  {
    id: 'hist-3',
    customerId: 'cust-1',
    type: 'invoice',
    description: 'Invoice INV-2026-001 issued',
    amount: 1500,
    date: '2026-05-12T11:30:00Z'
  },
  {
    id: 'hist-4',
    customerId: 'cust-1',
    type: 'payment',
    description: 'Payment received for INV-2026-001 via Credit Card',
    amount: 1500,
    date: '2026-05-14T09:45:00Z'
  },
  {
    id: 'hist-5',
    customerId: 'cust-2',
    type: 'appointment',
    description: 'Completed Digital Strategy Alignment',
    date: '2026-06-18T10:00:00Z'
  },
  {
    id: 'hist-6',
    customerId: 'cust-2',
    type: 'invoice',
    description: 'Invoice INV-2026-002 issued',
    amount: 4500,
    date: '2026-06-18T13:00:00Z'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Draft landing page wireframe',
    description: 'Create low-fidelity desktop and mobile layouts for Vance Corp landing page redesign.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-07-08',
    createdAt: '2026-07-02T10:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Review Brody Media campaign metrics',
    description: 'Synthesize Meta and Google Ads performance for Brody Media June reports.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-07-12',
    createdAt: '2026-07-03T11:45:00Z'
  },
  {
    id: 'task-3',
    title: 'Finalize brand strategy documentation',
    description: 'Compile brand voice guideline and assets into a final premium PDF booklet for Marion Ravenwood.',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-07-06',
    createdAt: '2026-07-04T09:00:00Z'
  },
  {
    id: 'task-4',
    title: 'System backup and archive cleanup',
    description: 'Archive closed projects from local storage servers to secure AWS S3 cold vault.',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-07-04',
    createdAt: '2026-07-01T14:30:00Z'
  },
  {
    id: 'task-5',
    title: 'Follow up on Cairo Logistics quote',
    description: 'Connect with Sallah to approve the SEO Alignment campaign quote.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-07-10',
    createdAt: '2026-07-05T08:15:00Z'
  }
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    name: 'Brand Audit & Creative Strategy',
    description: 'Comprehensive evaluation of existing brand assets, market positioning, target audience profile, and full strategic action recommendations.',
    category: 'Consulting',
    price: 1500,
    duration: 90,
    status: 'active'
  },
  {
    id: 'srv-2',
    name: 'Digital Campaign Management',
    description: 'End-to-end design, launch, and optimization of search and social advertising, including creative assets, copywriting, and bid management.',
    category: 'Marketing',
    price: 3200,
    duration: 120,
    status: 'active'
  },
  {
    id: 'srv-3',
    name: 'Full Custom UI/UX Design System',
    description: 'Design of comprehensive digital user experiences, high-fidelity responsive layout prototypes, complete tokenized component stylesheets, and documentation.',
    category: 'Design',
    price: 6500,
    duration: 180,
    status: 'active'
  },
  {
    id: 'srv-4',
    name: 'SEO Technical Alignment Audit',
    description: 'Comprehensive crawl indexing optimization, schema mapping markup implementation, keyword performance gap analysis, and performance tuning recommendations.',
    category: 'Technical',
    price: 1800,
    duration: 60,
    status: 'active'
  },
  {
    id: 'srv-5',
    name: '1-on-1 Creative Direction Advisory',
    description: 'Ad-hoc consulting sessions providing expert product design critiques, visual layout oversight, system architecture guidance, or founder mentoring.',
    category: 'Consulting',
    price: 450,
    duration: 60,
    status: 'active'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'appt-1',
    customerId: 'cust-1',
    serviceId: 'srv-1',
    start: '2026-07-06T10:00:00Z',
    end: '2026-07-06T11:30:00Z',
    status: 'scheduled',
    notes: 'Pre-meeting homework was completed and shared by Vance Corp.',
    reminderSent: true
  },
  {
    id: 'appt-2',
    customerId: 'cust-4',
    serviceId: 'srv-5',
    start: '2026-07-07T14:00:00Z',
    end: '2026-07-07T15:00:00Z',
    status: 'scheduled',
    notes: 'Discussing final strategic edits to the Abyss Lounge website redesign.',
    reminderSent: false
  },
  {
    id: 'appt-3',
    customerId: 'cust-2',
    serviceId: 'srv-2',
    start: '2026-07-05T10:00:00Z',
    end: '2026-07-05T12:00:00Z',
    status: 'completed',
    notes: 'Alignment was successful. Brody Media team approved expanding search budget.',
    reminderSent: true
  },
  {
    id: 'appt-4',
    customerId: 'cust-5',
    serviceId: 'srv-1',
    start: '2026-07-09T09:30:00Z',
    end: '2026-07-09T11:00:00Z',
    status: 'scheduled',
    notes: 'Initial kick-off chat regarding Cairo Digs project mapping.',
    reminderSent: false
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    customerId: 'cust-1',
    invoiceNumber: 'INV-2026-001',
    issueDate: '2026-05-12',
    dueDate: '2026-05-26',
    items: [
      { id: 'item-1', serviceId: 'srv-1', description: 'Brand Audit & Creative Strategy Session', quantity: 1, unitPrice: 1500, amount: 1500 }
    ],
    subtotal: 1500,
    tax: 120,
    discount: 0,
    total: 1620,
    status: 'paid',
    notes: 'Thank you for your business!'
  },
  {
    id: 'inv-2',
    customerId: 'cust-2',
    invoiceNumber: 'INV-2026-002',
    issueDate: '2026-06-18',
    dueDate: '2026-07-02',
    items: [
      { id: 'item-2', serviceId: 'srv-2', description: 'Digital Campaign Management (Q3 Kickoff)', quantity: 1, unitPrice: 3200, amount: 3200 },
      { id: 'item-3', serviceId: 'srv-5', description: '1-on-1 Creative Direction Advisory', quantity: 2, unitPrice: 450, amount: 900 }
    ],
    subtotal: 4100,
    tax: 328,
    discount: 200,
    total: 4228,
    status: 'paid',
    notes: 'Includes Q3 discount retainer discount.'
  },
  {
    id: 'inv-3',
    customerId: 'cust-4',
    invoiceNumber: 'INV-2026-003',
    issueDate: '2026-06-25',
    dueDate: '2026-07-09',
    items: [
      { id: 'item-4', serviceId: 'srv-3', description: 'Full Custom UI/UX Design System (Phase 1 Draft)', quantity: 1, unitPrice: 6500, amount: 6500 }
    ],
    subtotal: 6500,
    tax: 520,
    discount: 0,
    total: 7020,
    status: 'sent',
    notes: 'Milestone 1 invoice. Design deliverables shared via secure Figma workspace.'
  },
  {
    id: 'inv-4',
    customerId: 'cust-3',
    invoiceNumber: 'INV-2026-004',
    issueDate: '2026-04-10',
    dueDate: '2026-04-24',
    items: [
      { id: 'item-5', serviceId: 'srv-1', description: 'Brand Audit & Creative Strategy', quantity: 1, unitPrice: 1500, amount: 1500 }
    ],
    subtotal: 1500,
    tax: 120,
    discount: 0,
    total: 1620,
    status: 'overdue',
    notes: 'Second notification reminder has been issued.'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    invoiceId: 'inv-1',
    amount: 1620,
    paymentDate: '2026-05-14T09:45:00Z',
    method: 'credit_card',
    referenceNumber: 'TXN-9821-BC'
  },
  {
    id: 'pay-2',
    invoiceId: 'inv-2',
    amount: 4228,
    paymentDate: '2026-06-20T16:15:00Z',
    method: 'bank_transfer',
    referenceNumber: 'WIRE-00982-1'
  }
];

export const initialQuotes: Quote[] = [
  {
    id: 'qte-1',
    customerId: 'cust-5',
    quoteNumber: 'EST-2026-001',
    issueDate: '2026-07-01',
    expiryDate: '2026-07-15',
    items: [
      { id: 'qi-1', serviceId: 'srv-4', description: 'SEO Technical Alignment Audit & Structural Markup', quantity: 1, unitPrice: 1800, amount: 1800 },
      { id: 'qi-2', serviceId: 'srv-5', description: '1-on-1 Creative Direction Advisory Support', quantity: 3, unitPrice: 450, amount: 1350 }
    ],
    subtotal: 3150,
    tax: 252,
    discount: 150,
    total: 3252,
    status: 'sent',
    notes: 'Custom quote prepared for Sallah Excavation Group. Valued for 14 working days.'
  },
  {
    id: 'qte-2',
    customerId: 'cust-1',
    quoteNumber: 'EST-2026-002',
    issueDate: '2026-05-01',
    expiryDate: '2026-05-15',
    items: [
      { id: 'qi-3', serviceId: 'srv-1', description: 'Initial Discovery Consulting Campaign', quantity: 1, unitPrice: 1500, amount: 1500 }
    ],
    subtotal: 1500,
    tax: 120,
    discount: 0,
    total: 1620,
    status: 'approved',
    notes: 'Approved by Eleanor Vance via digital signature.'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Client Review',
    message: 'Marcus Brody from Brody Media left a 5-star rating feedback!',
    type: 'review',
    read: false,
    date: '2026-07-05T18:30:00Z'
  },
  {
    id: 'notif-2',
    title: 'Payment Received',
    message: 'Brody Media fully cleared Invoice INV-2026-002 ($4,228.00).',
    type: 'payment',
    read: false,
    date: '2026-06-20T16:15:00Z'
  },
  {
    id: 'notif-3',
    title: 'Upcoming Appointment',
    message: 'Brand Audit meeting with Eleanor Vance scheduled tomorrow at 10:00 AM.',
    type: 'appointment',
    read: true,
    date: '2026-07-05T09:00:00Z'
  },
  {
    id: 'notif-4',
    title: 'Overdue Invoice Warning',
    message: 'Invoice INV-2026-004 for Rene Belloq is now 70 days overdue.',
    type: 'payment',
    read: true,
    date: '2026-07-01T08:00:00Z'
  }
];

export const initialDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'vance_corp_color_palette.png',
    customerId: 'cust-1',
    size: '1.4 MB',
    type: 'png',
    createdAt: '2026-05-15T11:00:00Z'
  },
  {
    id: 'doc-2',
    name: 'velora_crm_brochure_2026.pdf',
    size: '4.8 MB',
    type: 'pdf',
    createdAt: '2026-01-20T09:30:00Z'
  },
  {
    id: 'doc-3',
    name: 'inv_2026_002_brody_media.pdf',
    customerId: 'cust-2',
    invoiceId: 'inv-2',
    size: '184 KB',
    type: 'pdf',
    createdAt: '2026-06-18T13:05:00Z'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    customerId: 'cust-2',
    customerName: 'Marcus Brody',
    rating: 5,
    reviewText: 'Sarah and the Velora CRM AI crew are stellar! They took our messy branding guidelines and turned them into an ultra-modern, crisp, cohesive visual system. Our digital engagement is already up 34% in Q2!',
    date: '2026-07-05T18:25:00Z',
    status: 'approved',
    response: 'Thank you so much Marcus! It was an absolute pleasure working with Brody Media. Here is to more digital wins!'
  },
  {
    id: 'rev-2',
    customerId: 'cust-4',
    customerName: 'Marion Ravenwood',
    rating: 5,
    reviewText: 'Highly professional. They actually listened to our custom needs instead of forcing standard templates on us. The strategy book is worth every penny.',
    date: '2026-05-30T14:10:00Z',
    status: 'approved'
  },
  {
    id: 'rev-3',
    customerName: 'Anonymous Client',
    rating: 4,
    reviewText: 'Great consulting sessions. Very actionable insight. Sometimes communications take an extra day or two, but the quality of work is outstanding.',
    date: '2026-04-12T10:00:00Z',
    status: 'approved'
  }
];
