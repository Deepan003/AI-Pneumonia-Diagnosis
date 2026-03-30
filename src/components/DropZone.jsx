import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function DropZone({ onFile, isLoading }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/dicom'];

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setFileError('File is too large. Maximum 20 MB allowed.');
      return;
    }
    setFileError('');
    setFileName(file.name);

    // Generate preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);

    onFile(file);
  }, [onFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    setFileError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
          Patient Scan Intake
        </p>
        <h2 className="text-headline text-slate-900">Upload X-Ray</h2>
        <p className="mt-1 text-sm text-slate-500">
          High-resolution DICOM, JPEG, or PNG thoracic radiographs.
        </p>
      </div>

      {/* Drop area */}
      <div className="flex-1 p-6 flex flex-col">
        <motion.div
          onClick={() => !isLoading && inputRef.current?.click()}
          onDragOver={!isLoading ? onDragOver : undefined}
          onDragLeave={!isLoading ? onDragLeave : undefined}
          onDrop={!isLoading ? onDrop : undefined}
          animate={{
            borderColor: dragging ? '#0d9488' : preview ? '#0d9488' : '#bcc9c6',
            backgroundColor: dragging ? 'rgba(13,148,136,0.04)' : '#ffffff',
          }}
          transition={{ duration: 0.2 }}
          className="relative flex-1 min-h-[280px] md:min-h-0 rounded-md border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{ borderStyle: 'dashed' }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.dcm"
            className="hidden"
            onChange={onInputChange}
            disabled={isLoading}
          />

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Image preview */}
                <img
                  src={preview}
                  alt="X-ray preview"
                  className="w-full h-full object-contain p-3"
                />
                {/* Overlay controls */}
                {!isLoading && (
                  <button
                    onClick={clearFile}
                    className="absolute top-3 right-3 w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-sm"
                  >
                    <X size={14} />
                  </button>
                )}
                {/* Filename ribbon */}
                <div className="absolute bottom-0 inset-x-0 bg-white/90 border-t border-slate-100 px-4 py-2 flex items-center gap-2">
                  <ImageIcon size={13} className="text-teal-600 flex-shrink-0" />
                  <span className="text-xs text-slate-600 truncate font-mono">{fileName}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4 p-8 text-center select-none"
              >
                <motion.div
                  animate={{ scale: dragging ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center"
                >
                  <Upload size={26} className="text-teal-600" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {dragging ? 'Release to upload' : 'Drag & drop patient files here'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse local directory</p>
                </div>
                <div className="flex items-center gap-2">
                  {['DICOM', 'JPEG', 'PNG'].map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2 py-0.5 rounded bg-slate-100 text-xs text-slate-500 font-mono border border-slate-200"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400">Max file size: 20 MB</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-slate-200 border-t-teal-600 rounded-full"
                />
                <p className="text-xs font-medium text-slate-600">Analysing radiograph…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {fileError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2"
            >
              <AlertCircle size={12} />
              {fileError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* System notes */}
        <div className="mt-4 space-y-1.5">
          {[
            'End-to-end encrypted transmission',
            'HIPAA-compliant processing pipeline',
            'Data purged post-analysis — not stored',
          ].map((note) => (
            <div key={note} className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0" />
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
