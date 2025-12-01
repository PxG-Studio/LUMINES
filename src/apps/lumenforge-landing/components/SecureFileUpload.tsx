/**
 * Secure File Upload Component
 * EC-LAND-071 to EC-LAND-080: File upload security
 */
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { SecureFileUpload as SecureFileUploadUtil } from '../utils/security';
import { ErrorMessage } from './ErrorMessage';

export interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    setUploading(true);

    // EC-LAND-071 to EC-LAND-080: Validate file
    const validation = SecureFileUploadUtil.validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setUploading(false);
      return;
    }

    // EC-LAND-074: Validate MIME type
    if (acceptedTypes.length > 0) {
      const mimeTypes = acceptedTypes.flatMap(type => {
        if (type.endsWith('/*')) {
          return [type];
        }
        return [type];
      });
      
      if (!SecureFileUploadUtil.validateMimeType(file, mimeTypes)) {
        setError('File type not allowed');
        setUploading(false);
        return;
      }
    }

    // EC-LAND-073: Check size
    if (file.size > maxSize) {
      setError(`File size exceeds maximum of ${maxSize / 1024 / 1024}MB`);
      setUploading(false);
      return;
    }

    try {
      onFileSelect(file);
      setUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className={className}>
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-500'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          disabled={disabled || uploading}
          className="hidden"
          aria-label="File upload"
        />

        <div className="flex flex-col items-center gap-4">
          <Upload
            className={`w-12 h-12 ${dragActive ? 'text-blue-400' : 'text-gray-400'}`}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-white mb-1">
              {uploading ? 'Processing file...' : 'Drop file here or click to upload'}
            </p>
            <p className="text-xs text-gray-400">
              Maximum size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select File
          </button>
        </div>
      </motion.div>

      {error && (
        <ErrorMessage
          message={error}
          type="error"
          onDismiss={() => setError(null)}
          autoDismiss={true}
          dismissAfter={5000}
        />
      )}
    </div>
  );
};

