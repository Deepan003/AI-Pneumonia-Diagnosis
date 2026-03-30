import { useState, useCallback } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/Header';
import DropZone from './components/DropZone';
import SkeletonLoader from './components/SkeletonLoader';
import ResultsPanel from './components/ResultsPanel';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';

const API_ENDPOINT = 'http://localhost:8000/predict';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = useCallback(async (file) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      // Expected: { prediction: string, confidence: number, report: string }
      setResult(response.data);
    } catch (err) {
      console.error('[PulmoScan] API Error:', err);
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError('Cannot connect to the diagnostic server at localhost:8000. Please ensure the backend is running.');
      } else if (err.response) {
        setError(`Server error ${err.response.status}: ${err.response.data?.detail || 'Unknown error'}`);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky header */}
      <Header />

      {/* Main content — fills viewport vertically */}
      <main className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Two-column on desktop, stacked on mobile */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ── Left Column: Upload Zone ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-white rounded-md border border-slate-200 flex flex-col overflow-hidden min-h-[420px] md:min-h-0"
          >
            <DropZone onFile={handleFile} isLoading={isLoading} />
          </motion.div>

          {/* ── Right Column: Results Dashboard ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-md border border-slate-200 flex flex-col overflow-hidden min-h-[420px] md:min-h-0 relative"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <SkeletonLoader />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4"
                >
                  <div className="w-12 h-12 rounded-md bg-red-50 border border-red-200 flex items-center justify-center">
                    <span className="text-red-500 text-xl">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-1">Analysis Failed</p>
                    <p className="text-xs text-slate-500 max-w-xs">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 rounded bg-slate-900 text-white text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="results"
                  className="flex-1 flex flex-col"
                >
                  <ResultsPanel result={result} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="flex-1 flex flex-col"
                >
                  <EmptyState />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Sticky medical disclaimer footer */}
      <Footer />
    </div>
  );
}
