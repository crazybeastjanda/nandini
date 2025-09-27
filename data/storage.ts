import {
  mockParticipants,
  mockCalendar,
  mockPastMeetings,
  mockSalesRecords,
  mockFollowUps,
} from './mockData';
import type { Participant, Meeting, SalesRecord, FollowUp, CalendarData } from '../types';

const STORAGE_KEY = 'discusso_app_data';

// A specific token for a demo user that should receive pre-populated data.
const DEMO_USER_TOKEN = 'mock-token-for-angela.bauer@example.com';

export interface UserData {
  participants: Participant[];
  pastMeetings: Meeting[];
  salesRecords: SalesRecord[];
  followUps: FollowUp[];
  meetingStreak: number;
  trustScore: number;
  unlockedBadges: string[];
  selectedSlot: string | null;
  agenda: string;
  meetingNotes: string;
  transcript: string;
  summary: string;
}

// Data for a brand new user.
const getInitialUserData = (): UserData => ({
  participants: mockParticipants,
  // Pre-populate with mock data to provide a richer demo experience for new users.
  pastMeetings: mockPastMeetings, 
  salesRecords: mockSalesRecords, 
  // These start empty as they are generated/earned by user actions.
  followUps: [],
  meetingStreak: 0,
  trustScore: 75,
  unlockedBadges: [],
  selectedSlot: null,
  agenda: '',
  meetingNotes: '',
  transcript: '',
  summary: '',
});

// Pre-populated data for the demo user.
const getDemoUserData = (): UserData => ({
  participants: mockParticipants,
  pastMeetings: mockPastMeetings,
  salesRecords: mockSalesRecords,
  followUps: mockFollowUps,
  meetingStreak: 3,
  trustScore: 92,
  unlockedBadges: ['streak-starter', 'trusted-partner'],
  selectedSlot: null,
  agenda: '',
  meetingNotes: '',
  transcript: '',
  summary: '',
});

interface AppStorage {
  [userId: string]: UserData;
}

function getAppData(): AppStorage {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return {};
  }
}

function saveAppData(data: AppStorage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
}

export function getUserData(userId: string): UserData {
  const appData = getAppData();
  if (appData[userId]) {
    // Merge with defaults to ensure new properties are added if the data model changes
    return { ...getInitialUserData(), ...appData[userId] };
  }
  // If a known demo user logs in for the first time, give them demo data
  if (userId === DEMO_USER_TOKEN) {
      return getDemoUserData();
  }
  return getInitialUserData();
}

export function initializeUser(userId: string): UserData {
    const appData = getAppData();
    if (appData[userId]) {
        return appData[userId];
    }
    // Give demo data to the demo user, and clean data to everyone else.
    const newUserData = userId === DEMO_USER_TOKEN ? getDemoUserData() : getInitialUserData();
    appData[userId] = newUserData;
    saveAppData(appData);
    return newUserData;
}


export function saveUserData(userId: string, userData: UserData) {
  const appData = getAppData();
  if (Object.keys(userData).length === 0) return;
  appData[userId] = userData;
  saveAppData(appData);
}

// Global data that is not user-specific
export const getCalendarData = (): CalendarData => {
  return mockCalendar;
};
