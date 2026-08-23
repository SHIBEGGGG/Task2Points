import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

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
    <form onSubmit={handleUpload} className="mt-3 space-y-2">
      <label className="block text-sm border-2 border-dashed border-ink/25 rounded-md px-4 py-3 text-center cursor-pointer hover:border-gold transition-colors">
        {file ? file.name : 'Tap to choose a photo'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>
      <button type="submit" className="btn btn-primary text-sm !py-2 w-full" disabled={!file || uploading}>
        {uploading ? 'Uploading…' : 'Submit Photo'}
      </button>
      {status && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-parchment-text/80">
          {status}
        </motion.p>
      )}
    </form>
  );
}
