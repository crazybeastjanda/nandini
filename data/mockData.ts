
import React from 'react';
import type { Meeting, SalesRecord, FollowUp, CalendarData, Badge, Participant } from '../types';
import { RocketLaunchIcon, ClipboardCheckIcon, SparklesIcon } from '../components/icons';

export const mockParticipants: Participant[] = [
  { id: 'p1', name: 'Angela Bauer', nickname: 'The Strategist' },
  { id: 'p2', name: 'Klaus Schmidt', nickname: 'Tech Guru' },
  { id: 'p3', name: 'Heidi Weber' },
];

export const mockPastMeetings: Meeting[] = [
  {
    date: '2024-07-15',
    topic: 'Q2 Sales Review & Q3 Forecast',
    outcome: 'Agreed to target enterprise clients for the new "Fusion" software. Follow-up needed on marketing materials.',
    participants: ['p1', 'p2'],
  },
  {
    date: '2024-06-20',
    topic: 'Customer Feedback on "Connect" v2.1',
    outcome: 'Identified key UI improvements. German team to provide a consolidated feedback report.',
    participants: ['p2', 'p3'],
  },
  {
    date: '2024-05-18',
    topic: 'Annual Partnership Strategy',
    outcome: 'Set a 15% growth target for the German market. Explored co-marketing opportunities.',
    participants: ['p1', 'p3'],
  },
  {
    date: '2024-04-22',
    topic: 'Onboarding for New "AnalyticsPro" Features',
    outcome: 'Klaus provided excellent feedback on the API documentation, suggesting clearer examples.',
    participants: ['p2'],
  }
];

export const mockSalesRecords: SalesRecord[] = [
  {
    product: 'Fusion',
    customerType: 'Enterprise',
    licenses: 500,
    month: 'July',
  },
  {
    product: 'Connect',
    customerType: 'SMB',
    licenses: 2500,
    month: 'July',
  },
  {
    product: 'AnalyticsPro',
    customerType: 'Enterprise',
    licenses: 250,
    month: 'June',
  },
  {
    product: 'Connect',
    customerType: 'Startup',
    licenses: 1500,
    month: 'June',
  },
];

export const mockFollowUps: FollowUp[] = [
  {
    date: '2024-07-25',
    task: 'Finalize marketing materials for "Fusion" software.',
    priority: 'High',
    completed: false,
  },
  {
    date: '2024-07-28',
    task: 'Consolidate German team feedback report on "Connect" v2.1.',
    priority: 'Medium',
    completed: true,
  },
  {
    date: '2024-08-01',
    task: 'Draft Q3 co-marketing plan.',
    priority: 'Low',
    completed: false,
  },
];

export const mockCalendar: CalendarData = {
  chennai: [ // IST (UTC+5:30)
    { start: '2024-08-05T09:00:00+05:30', end: '2024-08-05T10:00:00+05:30' },
    { start: '2024-08-05T11:30:00+05:30', end: '2024-08-05T12:30:00+05:30' },
    { start: '2024-08-05T14:00:00+05:30', end: '2024-08-05T15:00:00+05:30' },
    { start: '2024-08-05T16:00:00+05:30', end: '2024-08-05T17:00:00+05:30' },
  ],
  germany: [ // CEST (UTC+2:00)
    { start: '2024-08-05T09:00:00+02:00', end: '2024-08-05T10:00:00+02:00' },
    { start: '2024-08-05T10:30:00+02:00', end: '2024-08-05T11:30:00+02:00' },
    { start: '2024-08-05T12:00:00+02:00', end: '2024-08-05T13:30:00+02:00' },
    { start: '2024-08-05T15:00:00+02:00', end: '2024-08-05T16:00:00+02:00' },
  ],
};


export const allBadges: Badge[] = [
    {
        id: 'streak-starter',
        name: 'Streak Starter',
        description: 'Maintain a meeting streak of 3 or more.',
        icon: React.createElement(RocketLaunchIcon, { className: "w-8 h-8 text-orange-400" }),
    },
    {
        id: 'task-master',
        name: 'Task Master',
        description: 'Complete 3 or more follow-up tasks.',
        icon: React.createElement(ClipboardCheckIcon, { className: "w-8 h-8 text-cyan-400" }),
    },
    {
        id: 'trusted-partner',
        name: 'Trusted Partner',
        description: 'Achieve a Trust Score of 90 or higher.',
        icon: React.createElement(SparklesIcon, { className: "w-8 h-8 text-yellow-400" }),
    },
];