import { formatBytes, formatDate, getFileIcon } from '../utils/helpers';

interface FileData {
  id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface FileCardProps {
  file: FileData;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export default function FileCard({ file, onView, onDownload, onDelete }: FileCardProps) {
  return (
    <div className="file-card">
      <div className="file-card-icon">{getFileIcon(file.mime_type)}</div>
      <div className="file-card-info">
        <h3 className="file-card-name" title={file.original_name}>
          {file.original_name}
        </h3>
        <p className="file-card-meta">
          {formatBytes(file.size)} • {formatDate(file.created_at)}
        </p>
      </div>
      <div className="file-card-actions">
        <button className="btn-text" onClick={onView} title="View">
          View
        </button>
        <button className="btn-text" onClick={onDownload} title="Download">
          Download
        </button>
        <button className="btn-text btn-danger" onClick={onDelete} title="Delete">
          Delete
        </button>
      </div>
    </div>
  );
}
