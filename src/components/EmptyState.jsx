import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Stethoscope } from 'lucide-react';

export default function EmptyState() {
  return (
    <AnimatePresence>
      <motion.div
        key="empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-full"
      >
        {/* Panel header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Diagnostic Analysis
          </p>
          <h2 className="text-headline text-slate-300">Awaiting Input</h2>
          <p className="mt-1 text-sm text-slate-400">
            Real-time AI interpretation and structural classification.
          </p>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6 text-center">
          <div className="w-20 h-20 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Stethoscope size={32} className="text-slate-200" strokeWidth={1.2} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">No scan uploaded yet</p>
            <p className="text-xs text-slate-300 mt-1 max-w-[220px]">
              Upload a thoracic radiograph on the left to begin neural analysis.
            </p>
          </div>

          {/* Feature list */}
          <div className="w-full max-w-xs space-y-2">
            {[
              'Pneumonia detection with 97.4% sensitivity',
              'Confidence scoring with clinical metrics',
              'AI-generated diagnostic report',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0" />
                <span className="text-xs text-slate-400">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
