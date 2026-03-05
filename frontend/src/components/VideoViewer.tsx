import { useEffect } from 'react';

interface VideoViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export default function VideoViewer({ fileUrl, fileName, onClose }: VideoViewerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-content viewer-video" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h3>{fileName}</h3>
          <button className="viewer-close" onClick={onClose}>×</button>
        </div>
        <div className="viewer-body">
          <video src={fileUrl} controls autoPlay>
            Your browser does not support video playback.
          </video>
        </div>
      </div>
    </div>
  );
}
