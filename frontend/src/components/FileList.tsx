import { useState } from 'react';
import FileCard from './FileCard';

interface FileData {
  id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface FileListProps {
  files: FileData[];
  onView: (file: FileData) => void;
  onDownload: (file: FileData) => void;
  onDelete: (file: FileData) => void;
}

export default function FileList({ files, onView, onDownload, onDelete }: FileListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter((file) =>
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>No files yet</h3>
        <p>Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <h2>Your Files</h2>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No files found</h3>
          <p>Try a different search term</p>
        </div>
      ) : (
        <div className="file-grid">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onView={() => onView(file)}
              onDownload={() => onDownload(file)}
              onDelete={() => onDelete(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
