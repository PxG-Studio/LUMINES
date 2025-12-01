/**
 * Offline Indicator Component
 * EC-079, EC-080: Offline state handling
 * EC-LAND-501, EC-LAND-502, EC-LAND-503: Enhanced offline detection
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../utils/network';
import { OfflineManager } from '../utils/network-resilience';
import { ARIAManager } from '../utils/accessibility';

export const OfflineIndicator: React.FC = () => {
  const networkStatus = useNetworkStatus();
  const [isOnline, setIsOnline] = React.useState(networkStatus.online);

  // EC-LAND-501: Enhanced offline detection
  useEffect(() => {
    const unsubscribe = OfflineManager.onStatusChange((online) => {
      setIsOnline(online);
      // EC-LAND-503: Announce status change
      ARIAManager.announce(
        online ? 'Connection restored' : 'Connection lost',
        'assertive'
      );
    });

    return unsubscribe;
  }, []);

  const isOffline = !networkStatus.online || !isOnline;

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-amber-500/90 text-white px-4 py-3 z-[300] flex items-center justify-center gap-2"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <WifiOff className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium">
            You're currently offline. Some features may be unavailable.
          </span>
        </motion.div>
      )}
      {!isOffline && networkStatus.effectiveType && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-blue-500/90 text-white px-4 py-2 z-[300] flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Wifi className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs">
            Connection: {networkStatus.effectiveType.toUpperCase()}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

