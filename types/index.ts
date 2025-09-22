
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
  type: 'video' | 'exercise' | 'reading' | 'reflection' | 'photo_submission' | 'document';
  content: string;
  duration?: number; // in minutes
  completed: boolean;
  assignedDate: string;
  dueDate?: string;
  clientId: string;
  adminId?: string;
  videoId?: string; // Reference to video table
  exerciseId?: string; // Reference to exercise table
  documentId?: string; // Reference to document table
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: number;
  thumbnailUrl?: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  estimatedTime: number;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: number;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoSubmission {
  id: string;
  taskId: string;
  clientId: string;
  photoUrl: string;
  notes?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  avatarUrl?: string;
  logoUrl?: string;
  practiceName?: string;
  createdAt: string;
  updatedAt: string;
}
