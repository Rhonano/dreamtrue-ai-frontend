export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  mfaEnabled: boolean;
  mfaVerified: boolean;
  phoneNumber?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface CompanyData {
  name: string;
  url?: string;
  location?: string;
  industry?: string;
}

export interface Report {
  id: string;
  companyData: CompanyData;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: string;
  completedAt?: string;
  playbookHtml?: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface LoadingMessage {
  text: string;
  duration: number;
}

export interface Brand {
  id: string;
  name: string;
  icon: string;
  color: string;
  lastUpdated: string;
  status: 'active' | 'completed' | 'in-progress';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  category: 'internal' | 'external' | 'research' | 'competitor' | 'other';
}

export interface MFASetupResult {
  success: boolean;
  verificationId?: string;
  qrCodeUrl?: string;
  secretKey?: string;
  error?: string;
}

export interface MFAVerificationResult {
  success: boolean;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  mfaVerified: boolean;
  error: string | null;
}
