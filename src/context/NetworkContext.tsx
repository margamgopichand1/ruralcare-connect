import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOfflineQueue, processOfflineQueue } from '../services/offlineSyncService';

interface NetworkContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  isSyncing: boolean;
  queuedCount: number;
  toggleNetworkSimulation: () => void;
  triggerSync: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [browserOnline, setBrowserOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [queuedCount, setQueuedCount] = useState<number>(() => getOfflineQueue().length);

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOnline = browserOnline && !isSimulatedOffline;

  // Auto-sync when going online
  useEffect(() => {
    if (isOnline && queuedCount > 0) {
      triggerSync();
    }
  }, [isOnline]);

  const toggleNetworkSimulation = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      await processOfflineQueue();
      setQueuedCount(0);
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshQueueCount = () => {
    setQueuedCount(getOfflineQueue().length);
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isSimulatedOffline,
        isSyncing,
        queuedCount,
        toggleNetworkSimulation,
        triggerSync
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within a NetworkProvider');
  return context;
};
