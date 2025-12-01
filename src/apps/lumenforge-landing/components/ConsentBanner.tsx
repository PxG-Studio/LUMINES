/**
 * Consent Banner Component
 * EC-LAND-091, EC-LAND-092, EC-LAND-093: GDPR compliance and consent management
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check } from 'lucide-react';
import { PrivacyManager } from '../utils/security';
import { analytics } from '../utils/analytics';

export const ConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // EC-LAND-091: Check if consent has been given
    const hasConsent = PrivacyManager.hasConsent();
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // EC-LAND-092: Set consent and enable analytics
    PrivacyManager.setConsent(true);
    PrivacyManager.enableDataCollection();
    setConsentGiven(true);
    setShowBanner(false);
    analytics.track({ name: 'consent_given', properties: { type: 'accept' } });
  };

  const handleReject = () => {
    // EC-LAND-092: Set consent and disable analytics
    PrivacyManager.setConsent(false);
    PrivacyManager.disableDataCollection();
    setConsentGiven(true);
    setShowBanner(false);
    analytics.track({ name: 'consent_given', properties: { type: 'reject' } });
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (consentGiven || !showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-[1000] bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl"
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-description"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 id="consent-title" className="text-lg font-semibold text-white mb-1">
                    Cookie & Privacy Consent
                  </h3>
                  <p id="consent-description" className="text-sm text-gray-300">
                    We use cookies and analytics to improve your experience. By continuing, you agree to our use of cookies.
                    <a
                      href="/privacy"
                      className="text-blue-400 hover:text-blue-300 underline ml-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  aria-label="Reject cookies"
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  aria-label="Accept cookies"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Accept
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

