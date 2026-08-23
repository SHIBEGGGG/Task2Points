import { useState } from 'react';
import api from '../services/api';

// Handles the file picker + upload for one photo task. Submissions go to
// PENDING and only grant XP once an admin approves them.
export default function PhotoUploadWidget({ task, onSubmitted }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus('');
    try {
      const formData = new FormData();
      formData.append('taskId', task.id);
      formData.append('photo', file);

      await api.post('/submissions/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Submitted! Waiting for admin review.');
      onSubmitted?.();
    } catch (err) {
      setStatus(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Submit Photo'}
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
