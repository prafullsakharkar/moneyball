import React from 'react';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Loading } from '../../components/ui/Loading';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = useCallback((message?: string) => {
    setIsLoading(true);
    setLoadingMessage(message || '');
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        showLoading,
        hideLoading,
        setLoading,
        isLoading,
        loadingMessage,
      }}
    >
      {children}
      <Loading
        text={loadingMessage}
        fullscreen={isLoading}
      />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export default LoadingContext;
