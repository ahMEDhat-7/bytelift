import { useState, useEffect } from 'react';

interface ImageViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export default function ImageViewer({ fileUrl, fileName, onClose }: ImageViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h3>{fileName}</h3>
          <button className="viewer-close" onClick={onClose}>×</button>
        </div>
        <div className="viewer-body">
          {loading && <div className="viewer-loader">Loading...</div>}
          <img
            src={fileUrl}
            alt={fileName}
            onLoad={() => setLoading(false)}
            style={{ display: loading ? 'none' : 'block' }}
          />
        </div>
      </div>
    </div>
  );
}
