import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const adminHash = bcrypt.hashSync('AdminPass123!', 10);
const memberHash = bcrypt.hashSync('MemberPass123!', 10);

export const roles = [
  { id: 'r1', name: 'admin', description: 'Site administrators with full access' },
  { id: 'r2', name: 'member', description: 'Club members with portal access' },
  { id: 'r3', name: 'guest', description: 'Public or limited-access users' }
];

export const users = [
  {
    id: 'u1',
    email: 'admin@byc.test',
    passwordHash: adminHash,
    firstName: 'Ada',
    lastName: 'Admin',
    roles: ['admin', 'member'],
    profileId: 'p1'
  },
  {
    id: 'u2',
    email: 'member@byc.test',
    passwordHash: memberHash,
    firstName: 'Mark',
    lastName: 'Member',
    roles: ['member'],
    profileId: 'p2'
  }
];

export const memberProfiles = [
  {
    id: 'p1',
    userId: 'u1',
    displayName: 'Ada Admin',
    phone: '555-0001',
    boatName: 'Sea Breeze',
    slip: 'A1',
    privacy: { phone: false, email: false, boat: false }
  },
  {
    id: 'p2',
    userId: 'u2',
    displayName: 'Mark Member',
    phone: '555-0002',
    boatName: 'Wind Runner',
    slip: 'B4',
    privacy: { phone: true, email: false, boat: false }
  }
];

export const events = [
  {
    id: 'e1',
    title: 'Opening Day',
    description: 'Kick off the boating season with a community potluck.',
    date: '2025-05-15',
    location: 'Clubhouse Lawn',
    visibility: 'public',
    capacity: 100,
    rsvps: ['u2']
  },
  {
    id: 'e2',
    title: 'Member Regatta',
    description: 'Friendly race across the bay.',
    date: '2025-06-10',
    location: 'Harbor',
    visibility: 'member',
    capacity: 40,
    rsvps: []
  }
];

export const documents = [
  {
    id: 'd1',
    title: 'March Newsletter',
    category: 'newsletter',
    url: '/uploads/march-newsletter.pdf',
    visibility: 'member'
  },
  {
    id: 'd2',
    title: 'Visitor Guide',
    category: 'document',
    url: '/uploads/visitor-guide.pdf',
    visibility: 'public'
  }
];

export const docks = {
  layout: [
    { dock: 'A', slips: ['A1', 'A2', 'A3', 'A4'] },
    { dock: 'B', slips: ['B1', 'B2', 'B3', 'B4'] }
  ],
  boats: [
    { slip: 'A1', boatName: 'Sea Breeze', ownerId: 'u1' },
    { slip: 'B4', boatName: 'Wind Runner', ownerId: 'u2' }
  ]
};

export const announcements = [
  { id: 'a1', title: 'Safety Reminder', body: 'Please wear life jackets on the docks.', visibility: 'public' },
  { id: 'a2', title: 'Work Party', body: 'Volunteers needed this Saturday.', visibility: 'member' }
];

export const pages = [
  { slug: 'home', title: 'Home', body: 'Welcome to the BYC community.', visibility: 'public' },
  { slug: 'about', title: 'About', body: 'Learn about our club history and mission.', visibility: 'public' }
];

export const auditLogs = [];

export const createId = () => randomUUID();
