/**
 * Accessible Modal Component
 * EC-LAND-252, EC-LAND-258, EC-LAND-260: Modal accessibility
 */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { KeyboardNavigation, MotionAccessibility } from '../utils/accessibility';

export interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // EC-LAND-252: Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // EC-LAND-260: Save focus before opening
    KeyboardNavigation.saveFocus();

    // Focus the modal title first
    titleRef.current?.focus();

    // Set up focus trap
    const cleanup = KeyboardNavigation.trapFocus(modalRef.current);

    // EC-LAND-258: Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      cleanup();
      document.removeEventListener('keydown', handleEscape);
      // EC-LAND-260: Restore focus after closing
      KeyboardNavigation.restoreFocus();
    };
  }, [isOpen, closeOnEscape, onClose]);

  // EC-LAND-291: Respect reduced motion
  const shouldAnimate = !MotionAccessibility.prefersReducedMotion();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          animate={shouldAnimate ? { opacity: 1 } : { opacity: 1 }}
          exit={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          className={`relative bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 ${className}`}
          initial={shouldAnimate ? { opacity: 0, scale: 0.95, y: 20 } : { opacity: 1, scale: 1, y: 0 }}
          animate={shouldAnimate ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldAnimate ? { opacity: 0, scale: 0.95, y: 20 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2
              id="modal-title"
              ref={titleRef}
              tabIndex={-1}
              className="text-xl font-semibold text-white"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

