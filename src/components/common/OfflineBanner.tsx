import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useLanguage } from '../../context/LanguageContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSyncing, queuedCount, toggleNetworkSimulation, triggerSync } = useNetwork();
  const { t } = useLanguage();

  if (isOnline && !isSyncing && queuedCount === 0) {
    return null;
  }

  return (
    <div
      className={`w-full py-2 px-4 transition-colors ${
        !isOnline
          ? 'bg-amber-500 text-amber-950 font-medium'
          : isSyncing
          ? 'bg-blue-600 text-white'
          : 'bg-emerald-600 text-white'
      } text-xs md:text-sm flex items-center justify-between shadow-md relative z-40`}
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 text-amber-900 animate-pulse" />
          ) : isSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Wifi className="w-4 h-4 text-emerald-200" />
          )}

          <span>
            {!isOnline
              ? `${t.offlineStatus} (${queuedCount} queued locally)`
              : isSyncing
              ? t.syncingData
              : t.syncedData}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isOnline && (
            <button
              onClick={toggleNetworkSimulation}
              className="px-2.5 py-1 bg-amber-900 text-white hover:bg-amber-950 rounded text-xs font-semibold transition shadow-sm"
            >
              Go Online
            </button>
          )}

          {isOnline && queuedCount > 0 && !isSyncing && (
            <button
              onClick={triggerSync}
              className="px-2.5 py-1 bg-white text-emerald-800 hover:bg-emerald-50 rounded text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              <RefreshCw className="w-3 h-3" /> Sync Now ({queuedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
