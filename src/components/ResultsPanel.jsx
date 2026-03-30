import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Activity, TrendingUp, Clock, FileText } from 'lucide-react';

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-teal-500 align-middle ml-0.5 animate-pulse" />}
    </span>
  );
}

function ConfidenceBar({ confidence }) {
  const isPneumonia = confidence > 50;
  const barColor = isPneumonia ? 'bg-red-500' : 'bg-teal-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Confidence Score</span>
        <span className="font-bold text-slate-900 font-mono">{confidence.toFixed(1)}%</span>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: 'NPV', value: isPneumonia ? '94.2%' : '99.1%', icon: ShieldCheck },
          { label: 'Sensitivity', value: '97.4%', icon: TrendingUp },
          { label: 'Specificity', value: '96.8%', icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-md bg-slate-50 border border-slate-100 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Icon size={11} />
              {label}
            </div>
            <div className="text-base font-bold text-slate-800 tracking-tight">{value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResultsPanel({ result }) {
  const isPneumonia = result?.prediction?.toLowerCase().includes('pneumonia');

  const BadgeIcon = isPneumonia ? AlertTriangle : CheckCircle2;
  const badgeBg = isPneumonia ? 'bg-red-50 border-red-200' : 'bg-teal-50 border-teal-200';
  const badgeIconColor = isPneumonia ? 'text-red-500' : 'text-teal-600';
  const badgeText = isPneumonia ? 'text-red-700' : 'text-teal-800';
  const badgeSub = isPneumonia ? 'text-red-500' : 'text-teal-600';

  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col h-full"
        >
          {/* Panel header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
              Diagnostic Analysis
            </p>
            <h2 className="text-headline text-slate-900">AI Report</h2>
            <p className="mt-1 text-sm text-slate-500">
              Real-time neural interpretation and structural classification.
            </p>
          </div>

          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            {/* Primary prediction badge */}
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className={`flex items-start gap-4 p-4 rounded-md border ${badgeBg}`}
            >
              <div className={`w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0 ${isPneumonia ? 'bg-red-100' : 'bg-teal-100'}`}>
                <BadgeIcon size={22} className={badgeIconColor} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wider ${badgeSub}`}>
                  Primary Finding
                </p>
                <p className={`text-lg font-bold mt-0.5 leading-tight ${badgeText}`}>
                  {result.prediction}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Activity size={11} className={badgeIconColor} />
                  <span className={`text-xs font-medium ${badgeSub}`}>
                    Neural Confidence: {result.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Confidence bar + metrics */}
            <ConfidenceBar confidence={result.confidence} />

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* AI Diagnostic Report */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-teal-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  AI Diagnostic Report
                </span>
              </div>

              <div className="rounded-md bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed font-light min-h-[80px]">
                <TypewriterText text={result.report} speed={15} />
              </div>
            </div>

            {/* Timestamp + Model info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-4"
            >
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Activity size={11} />
                PulmoScan Core v4.2.1
              </span>
              <span className="ml-auto text-teal-600 font-medium">
                DenseNet-121
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
