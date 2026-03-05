import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { getFiles, getFile, deleteFile } from "../services/api";
import { useToast } from "../context/ToastContext";
import FileUploader from "../components/FileUploader";
import FileList from "../components/FileList";
import Modal from "../components/Modal";
import { PageLoader } from "../components/Loader";
import { isImage, isVideo, isPdf } from "../utils/helpers";

const ImageViewer = lazy(() => import("../components/ImageViewer"));
const VideoViewer = lazy(() => import("../components/VideoViewer"));
const PdfViewer = lazy(() => import("../components/PdfViewer"));

interface FileData {
  id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size: number;
  created_at: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<FileData | null>(null);
  const [viewerType, setViewerType] = useState<
    "image" | "video" | "pdf" | null
  >(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<FileData | null>(null);
  const { showToast } = useToast();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFiles();
      setFiles(response.data.files);
    } catch (error) {
      showToast("Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleView = async (file: FileData) => {
    try {
      const response = await getFile(file.id);
      const url = URL.createObjectURL(response.data);
      setFileUrl(url);
      setViewingFile(file);

      if (isImage(file.mime_type)) {
        setViewerType("image");
      } else if (isVideo(file.mime_type)) {
        setViewerType("video");
      } else if (isPdf(file.mime_type)) {
        setViewerType("pdf");
      }
    } catch (error) {
      showToast("Failed to load file", "error");
    }
  };

  const handleDownload = async (file: FileData) => {
    try {
      const response = await getFile(file.id);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Download started", "success");
    } catch (error) {
      showToast("Download failed", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFile) return;

    try {
      await deleteFile(deletingFile.id);
      showToast("File deleted successfully", "success");
      setDeletingFile(null);
      fetchFiles();
    } catch (error) {
      showToast("Failed to delete file", "error");
    }
  };

  const closeViewer = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setViewingFile(null);
    setViewerType(null);
    setFileUrl(null);
  };

  if (loading && files.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Files</h1>
          <p>Manage your uploaded files</p>
        </div>

        <div className="upload-section">
          <FileUploader onUploadComplete={fetchFiles} />
        </div>

        <FileList
          files={files}
          onView={handleView}
          onDownload={handleDownload}
          onDelete={(file) => setDeletingFile(file)}
        />
      </div>

      {viewingFile && fileUrl && viewerType === "image" && (
        <Suspense fallback={<PageLoader />}>
          <ImageViewer
            fileUrl={fileUrl}
            fileName={viewingFile.original_name}
            onClose={closeViewer}
          />
        </Suspense>
      )}

      {viewingFile && fileUrl && viewerType === "video" && (
        <Suspense fallback={<PageLoader />}>
          <VideoViewer
            fileUrl={fileUrl}
            fileName={viewingFile.original_name}
            onClose={closeViewer}
          />
        </Suspense>
      )}

      {viewingFile && fileUrl && viewerType === "pdf" && (
        <Suspense fallback={<PageLoader />}>
          <PdfViewer
            fileUrl={fileUrl}
            fileName={viewingFile.original_name}
            onClose={closeViewer}
          />
        </Suspense>
      )}

      <Modal
        isOpen={!!deletingFile}
        onClose={() => setDeletingFile(null)}
        title="Delete File"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete</p>
          <h3>{deletingFile?.original_name}</h3>
          <p className="delete-warning">This action cannot be undone.</p>
          <div className="delete-actions">
            <button
              className="btn btn-outline"
              onClick={() => setDeletingFile(null)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
