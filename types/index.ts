
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface Client extends User {
  role: 'client';
  therapistNotes?: string;
  assignedTasks: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'exercise' | 'reading' | 'reflection';
  content: string;
  duration?: number; // in minutes
  completed: boolean;
  assignedDate: string;
  dueDate?: string;
  clientId: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnail?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  estimatedTime: number;
}
