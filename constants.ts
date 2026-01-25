
import { Activity, Client, Property, PropertyStatus, VisitStatus, Visit, ReputationLevel, Notification, UserProfile } from './types';

export const CURRENT_USER: UserProfile = {
  name: "Ricardo",
  role: "Consultor Imobiliário",
  agency: "Independent",
  email: "ricardo.buyeragent@imobcurator.com",
  phone: "+351 910 000 000",
  avatar: "https://picsum.photos/id/64/100/100",
  micrositeUrl: "imobcurator.com/ricardo",
  licenseNumber: "AMI-12345",
  passwordHash: "123456", // Mock password for demo
  plan: 'Free',
  searchesUsed: 0,
  maxSearches: 2,
  settings: {
    notifications: true,
    language: 'pt-PT'
  },
  reputation: {
    level: ReputationLevel.GOOD,
    winStreak: 2, 
    lossStreak: 0
  }
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'agenda',
    title: 'Visita Amanhã',
    message: 'Lembrete: Visita com Ana Silva às 10:00 no Chiado.',
    time: 'Há 30 min',
    read: false,
    actionUrl: '/visits'
  },
  {
    id: 'n2',
    type: 'feedback_like',
    title: 'Novo Favorito',
    message: 'João Santos gostou da "Moradia de Luxo".',
    time: 'Há 2 horas',
    read: false,
    actionUrl: '/clients/c2'
  },
  {
    id: 'n3',
    type: 'feedback_dislike',
    title: 'Imóvel Descartado',
    message: 'Carlos Mendes descartou "Casa Histórica" (Preço Alto).',
    time: 'Há 5 horas',
    read: true,
    actionUrl: '/clients/c3'
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Relatório Mensal',
    message: 'O seu relatório de performance de Outubro está pronto.',
    time: 'Ontem',
    read: true,
    actionUrl: '/analytics'
  }
];

// Clientes "Ativos"
export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: "Ana Silva",
    avatar: "https://picsum.photos/id/65/100/100",
    email: "ana.silva@gmail.com",
    phone: "+351 912 345 678",
    locationInterest: "Lisboa (Centro)",
    budget: "€450k - €600k",
    status: "Visiting",
    lastActivity: "2h atrás",
    unreadCount: 3,
    attentionNeeded: false,
    proposalSent: true
  },
  {
    id: 'c2',
    name: "João Santos",
    avatar: "https://picsum.photos/id/91/100/100",
    email: "joao.santos@outlook.com",
    phone: "+351 933 456 789",
    locationInterest: "Cascais / Estoril",
    budget: "€800k+",
    status: "Searching",
    lastActivity: "1d atrás",
    attentionNeeded: false,
    proposalSent: true
  },
  {
    id: 'c3',
    name: "Carlos Mendes",
    avatar: "https://picsum.photos/id/55/100/100",
    email: "carlos.m@tech.pt",
    phone: "+351 961 234 567",
    locationInterest: "Oeiras",
    budget: "€1.2M",
    status: "Offer Made",
    lastActivity: "3h atrás",
    attentionNeeded: false,
    proposalSent: true
  },
  {
    id: 'c4',
    name: "Mariana Costa",
    avatar: "https://picsum.photos/id/40/100/100",
    email: "mariana.costa@gmail.com",
    phone: "+351 919 888 777",
    locationInterest: "Sintra",
    budget: "€350k",
    status: "Searching",
    lastActivity: "15d atrás",
    attentionNeeded: true, // Em atraso
    proposalSent: false
  },
  {
    id: 'c5',
    name: "Roberto Dias",
    avatar: "https://picsum.photos/id/10/100/100",
    email: "roberto.d@company.com",
    phone: "+351 922 333 444",
    locationInterest: "Porto",
    budget: "€500k",
    status: "Closed",
    lastActivity: "1 mês atrás",
    attentionNeeded: false,
    proposalSent: true
  }
];

// Clientes Antigos (Arquivo Morto) - Apenas acessíveis via Search
export const ARCHIVED_CLIENTS: Client[] = [
  {
    id: 'arch-1',
    name: "Felipe Antunes",
    avatar: "https://picsum.photos/id/33/100/100",
    email: "felipe.a@oldmail.com",
    phone: "+351 911 222 333",
    locationInterest: "Algarve",
    budget: "€300k",
    status: "Archived",
    lastActivity: "2 anos atrás",
    archivedDate: "2024-05-10",
    attentionNeeded: false
  },
  {
    id: 'arch-2',
    name: "Cláudia Raia",
    avatar: "https://picsum.photos/id/34/100/100",
    email: "claudia@example.com",
    phone: "+351 922 111 444",
    locationInterest: "Coimbra",
    budget: "€250k",
    status: "Archived",
    lastActivity: "3 anos atrás",
    archivedDate: "2023-11-20",
    attentionNeeded: false
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'inquiry',
    title: "Nova consulta de Sara",
    description: "O imóvel no centro ainda está disponível?",
    time: "15 min atrás",
    isUrgent: true
  },
  {
    id: 'a2',
    type: 'visit',
    title: "Visita Agendada",
    description: "Encontro com João Santos na Av. da Liberdade, 45.",
    time: "2 horas atrás"
  },
  {
    id: 'a3',
    type: 'contract',
    title: "Contrato Atualizado",
    description: "Revisar os novos termos da Unidade 402.",
    time: "Ontem"
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: "Apartamento Moderno com Terraço",
    location: "Centro de Lisboa",
    price: 450000,
    currency: "€",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    imageUrl: "https://picsum.photos/id/15/800/600",
    url: "https://www.idealista.pt",
    tags: ["T2", "Luz Natural"],
    status: PropertyStatus.NEW
  },
  {
    id: 'p2',
    title: "Moradia de Luxo com Piscina",
    location: "Cascais",
    price: 620000,
    currency: "€",
    bedrooms: 3,
    bathrooms: 3,
    area: 120,
    imageUrl: "https://picsum.photos/id/20/800/600",
    url: "https://www.idealista.pt",
    tags: ["T3", "Piscina", "Jardim"],
    status: PropertyStatus.LIKED
  },
  {
    id: 'p3',
    title: "Casa Histórica",
    location: "Sintra",
    price: 395000,
    currency: "€",
    bedrooms: 2,
    bathrooms: 1,
    area: 88,
    imageUrl: "https://picsum.photos/id/48/800/600",
    url: "https://www.idealista.pt",
    tags: ["Renovado"],
    status: PropertyStatus.DISCARDED
  }
];

export const MOCK_VISIT = {
  id: "VIS-2942",
  propertyId: "p1",
  propertyTitle: "Penthouse no Centro",
  propertyImage: "https://picsum.photos/id/15/200/200",
  address: "Av. da República 123, Lisboa",
  clientId: "c1",
  clientName: "Ana Silva",
  clientAvatar: "https://picsum.photos/id/65/100/100",
  date: "2026-10-24",
  time: "10:00",
  status: VisitStatus.PENDING_CONFIRMATION,
  price: "€1.2M",
  ref: "LST-9921",
  listingAgent: "Century Properties",
  timeline: [
    { status: VisitStatus.REQUESTED, timestamp: "10:00", completed: true },
    { status: VisitStatus.PENDING_CONFIRMATION, timestamp: "10:15", completed: true },
    { status: VisitStatus.CONFIRMED, timestamp: "", completed: false },
    { status: VisitStatus.COMPLETED, timestamp: "", completed: false },
  ]
};

export const MOCK_VISITS_LIST: Visit[] = [
  {
    id: "v1",
    propertyId: "p1",
    propertyTitle: "Apartamento Chiado Premium",
    propertyImage: "https://picsum.photos/id/101/400/300",
    address: "Rua Garrett 14, Lisboa",
    clientId: "c1", // Ana Silva
    clientName: "Ana Silva",
    clientAvatar: "https://picsum.photos/id/65/100/100",
    date: "2026-10-25", // Amanhã
    time: "10:00",
    status: VisitStatus.CONFIRMED,
    notes: "Cliente quer ver a pressão da água."
  },
  {
    id: "v2",
    propertyId: "p2",
    propertyTitle: "Moradia T4 Cascais",
    propertyImage: "https://picsum.photos/id/102/400/300",
    address: "Av. do Mar 22, Cascais",
    clientId: "c2", // João Santos
    clientName: "João Santos",
    clientAvatar: "https://picsum.photos/id/91/100/100",
    date: "2026-10-25", // Amanhã
    time: "14:30",
    status: VisitStatus.PENDING_CONFIRMATION,
    notes: "Aguardando confirmação do proprietário."
  },
  {
    id: "v3",
    propertyId: "p3",
    propertyTitle: "Duplex Vista Rio",
    propertyImage: "https://picsum.photos/id/103/400/300",
    address: "Av. 24 de Julho 99, Lisboa",
    clientId: "c1", // Ana Silva
    clientName: "Ana Silva",
    clientAvatar: "https://picsum.photos/id/65/100/100",
    date: "2026-10-28", // Futuro
    time: "09:00",
    status: VisitStatus.REQUESTED,
    notes: "Visita solicitada via portal."
  },
  {
    id: "v4",
    propertyId: "p4",
    propertyTitle: "Terreno para Construção",
    propertyImage: "https://picsum.photos/id/104/400/300",
    address: "Estrada da Malveira, Sintra",
    clientId: "c3", // Carlos Mendes
    clientName: "Carlos Mendes",
    clientAvatar: "https://picsum.photos/id/55/100/100",
    date: "2026-10-23", // Passado
    time: "11:00",
    status: VisitStatus.COMPLETED,
    notes: "Cliente gostou da localização."
  }
];