
export interface Participant {
  id: string;
  name: string;
  nickname?: string;
}

export interface Meeting {
  date: string;
  topic: string;
  outcome: string;
  participants: string[]; // Array of participant IDs
}

export interface SalesRecord {
  product: string;
  customerType: string;
  licenses: number;
  month: string;
}

export interface FollowUp {
  date: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface CalendarSlot {
  start: string;
  end: string;
}

export interface CalendarData {
  chennai: CalendarSlot[];
  germany: CalendarSlot[];
}

export interface GeneratedFollowUp {
    task: string;
    priority: 'High' | 'Medium' | 'Low';
    date: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactElement;
}