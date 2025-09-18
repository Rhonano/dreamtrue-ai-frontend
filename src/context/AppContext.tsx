import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Report, ChatMessage, AuthState } from '../types';
import { authService } from '../services/authService';

interface AppState {
  user: User | null;
  currentReport: Report | null;
  reports: Report[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  authState: AuthState;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_REPORT'; payload: Report }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_REPORT'; payload: Report }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_MESSAGES' }
  | { type: 'SET_AUTH_STATE'; payload: AuthState }
  | { type: 'SET_MFA_REQUIRED'; payload: boolean }
  | { type: 'SET_MFA_VERIFIED'; payload: boolean };

const initialState: AppState = {
  user: null,
  currentReport: null,
  reports: [],
  chatMessages: [],
  isLoading: false,
  error: null,
  authState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    mfaRequired: false,
    mfaVerified: false,
    error: null,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        error: null,
        authState: {
          ...state.authState,
          user: action.payload,
          isAuthenticated: true,
          isLoading: false,
        }
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        currentReport: null, 
        chatMessages: [],
        authState: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          mfaRequired: false,
          mfaVerified: false,
          error: null,
        }
      };
    case 'SET_CURRENT_REPORT':
      return { ...state, currentReport: action.payload };
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(r => 
          r.id === action.payload.id ? action.payload : r
        ),
        currentReport: state.currentReport?.id === action.payload.id 
          ? action.payload 
          : state.currentReport,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'CLEAR_CHAT_MESSAGES':
      return { ...state, chatMessages: [] };
    case 'SET_AUTH_STATE':
      return { ...state, authState: action.payload };
    case 'SET_MFA_REQUIRED':
      return { 
        ...state, 
        authState: { 
          ...state.authState, 
          mfaRequired: action.payload 
        } 
      };
    case 'SET_MFA_VERIFIED':
      return { 
        ...state, 
        authState: { 
          ...state.authState, 
          mfaVerified: action.payload 
        } 
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get user data from Firestore
        const userData = await authService.getCurrentUserData();
        if (userData) {
          dispatch({ type: 'SET_USER', payload: userData });
        }
      } else {
        // User is signed out
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
