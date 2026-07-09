import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileVideo, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { VideoQuality } from '../types';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: { title: string; quality: VideoQuality; description: string }) => void;
}

export function UploadModal({ open, onClose, onUpload }: UploadModalProps) {
  const [title, setTitle] = React.useState('');
  const [quality, setQuality] = React.useState<VideoQuality>('1080p');
  const [description, setDescription] = React.useState('');
  const [dragOver, setDragOver] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle('');
    setQuality('1080p');
    setDescription('');
    setFile(null);
    setUploading(false);
    setProgress(0);
    setDone(false);
    setError(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    setError(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('video/')) handleFile(f);
    else setError(true);
  };

  const startUpload = () => {
    if (!file || !title) return;
    setUploading(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setUploading(false);
          setDone(true);
          setTimeout(() => {
            onUpload({ title, quality, description });
            handleClose();
          }, 800);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500 transition-colors';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Upload Video</h3>
                <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Drop zone */}
                {!uploading && !done && (
                  <>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current?.click()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                        dragOver
                          ? 'border-primary-500 bg-primary-500/5'
                          : error
                          ? 'border-red-500/50 bg-red-500/5'
                          : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                    >
                      <input
                        ref={inputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFile(f);
                        }}
                      />
                      {error ? (
                        <>
                          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <p className="text-sm text-red-500 font-medium">Please select a video file</p>
                        </>
                      ) : file ? (
                        <>
                          <FileVideo className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{file.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Drag & drop or <span className="text-primary-500">browse</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-1">MP4, MOV, AVI up to 5GB</p>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Title</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" className={inputClass} />
                    </div>

                    {/* Quality */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Quality</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['4K', '1080p', '720p', '480p'] as VideoQuality[]).map((q) => (
                          <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className={cn(
                              'px-3 py-2 rounded-xl text-sm font-medium transition-colors border',
                              quality === q
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional description..."
                        rows={2}
                        className={cn(inputClass, 'resize-none')}
                      />
                    </div>
                  </>
                )}

                {/* Upload progress */}
                {uploading && (
                  <div className="py-8 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-700" />
                        <circle
                          cx="40" cy="40" r="36" fill="none" stroke="#6366f1" strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-200"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-white">
                        {progress}%
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploading...</p>
                    <p className="text-xs text-slate-400 mt-1">{file?.name}</p>
                  </div>
                )}

                {/* Done */}
                {done && (
                  <div className="py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload complete!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!uploading && !done && (
                <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
                  <button onClick={handleClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={startUpload}
                    disabled={!file || !title}
                    className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
