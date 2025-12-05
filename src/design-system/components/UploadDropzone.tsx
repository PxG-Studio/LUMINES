import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { Panel } from './Panel';
import { lumenForgeColors, transitions } from '../tokens';

interface UploadDropzoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  accept = ['.unitypackage', '.asset', '.prefab', '.fbx', '.png', '.shader', '.cs', '.mat', '.uasset', '.blend'],
  maxSize = 100 * 1024 * 1024,
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const validFiles: File[] = [];
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (accept.includes(ext) && file.size <= maxSize) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                onFileSelect(validFiles);
              }, 300);
              return 100;
            }
            return prev + 10;
          });
        }, 50);
      }
    },
    [accept, maxSize, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  return (
    <Panel
      variant={isDragging ? 'primary' : 'glass'}
      padding="lg"
      className="relative"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          transition: transitions.normal,
          opacity: isDragging ? 0.8 : 1,
        }}
      >
        <Upload
          size={48}
          style={{
            color: isDragging ? lumenForgeColors.accent.primary : lumenForgeColors.text.secondary,
            transition: transitions.normal,
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: lumenForgeColors.text.primary, fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {isDragging ? 'Drop files here' : 'Drag & drop Unity assets'}
          </p>
          <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
            or click to browse
          </p>
          <p style={{ color: lumenForgeColors.text.tertiary, fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Supports: {accept.join(', ')}
          </p>
        </div>

        {isUploading && (
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <div
              style={{
                width: '100%',
                height: '4px',
                background: lumenForgeColors.background.tertiary,
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
                  transition: transitions.fast,
                }}
              />
            </div>
            <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <input
          type="file"
          multiple={multiple}
          accept={accept.join(',')}
          onChange={handleFileInput}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
    </Panel>
  );
};
