import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface ClerkAuthContextType {
  isSignedIn: boolean | null;
  isLoaded: boolean;
  userId: string | null;
  sessionId: string | null;
  signOut: () => Promise<void>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, userId, sessionId, signOut } = useAuth();

  return (
    <ClerkAuthContext.Provider value={{
      isSignedIn: isSignedIn ?? null,
      isLoaded,
      userId: userId ?? null,
      sessionId: sessionId ?? null,
      signOut,
    }}>
      {children}
    </ClerkAuthContext.Provider>
  );
}

export function useClerkAuthContext() {
  const context = useContext(ClerkAuthContext);
  if (context === undefined) {
    throw new Error('useClerkAuthContext must be used within a ClerkAuthProvider');
  }
  return context;
}