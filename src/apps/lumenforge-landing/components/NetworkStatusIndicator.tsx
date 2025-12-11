/**
 * Network Status Indicator Component
 * EC-LAND-511, EC-LAND-512, EC-LAND-513, EC-LAND-514: Network status display
 */
import React from 'react';
import { Wifi, WifiOff, Signal, SignalLow } from 'lucide-react';
import { useNetworkStatus } from '../utils/network';
import { OfflineManager } from '../utils/network-resilience';

export interface NetworkStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  showDetails = false,
  className = '',
}) => {
  const networkStatus = useNetworkStatus();
  const [isSlow, setIsSlow] = React.useState(false);
  const [isDataSaver, setIsDataSaver] = React.useState(false);

  React.useEffect(() => {
    OfflineManager.isSlowConnection().then(setIsSlow);
    setIsDataSaver(OfflineManager.isDataSaverEnabled());
  }, [networkStatus]);

  if (!networkStatus.online) {
    return (
      <div className={`flex items-center gap-2 text-amber-400 ${className}`} role="status" aria-label="Offline">
        <WifiOff className="w-4 h-4" aria-hidden="true" />
        {showDetails && <span className="text-xs">Offline</span>}
      </div>
    );
  }

  if (isSlow) {
    return (
      <div className={`flex items-center gap-2 text-yellow-400 ${className}`} role="status" aria-label="Slow connection">
        <SignalLow className="w-4 h-4" aria-hidden="true" />
        {showDetails && (
          <span className="text-xs">
            {networkStatus.effectiveType?.toUpperCase() || 'Slow'}
          </span>
        )}
      </div>
    );
  }

  if (isDataSaver) {
    return (
      <div className={`flex items-center gap-2 text-blue-400 ${className}`} role="status" aria-label="Data saver enabled">
        <Signal className="w-4 h-4" aria-hidden="true" />
        {showDetails && <span className="text-xs">Data Saver</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-green-400 ${className}`} role="status" aria-label="Online">
      <Wifi className="w-4 h-4" aria-hidden="true" />
      {showDetails && (
        <span className="text-xs">
          {networkStatus.effectiveType?.toUpperCase() || 'Online'}
        </span>
      )}
    </div>
  );
};

