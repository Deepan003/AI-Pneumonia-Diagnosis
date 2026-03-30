import { motion } from 'framer-motion';
import { Activity, Cpu, Database } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white border-b border-slate-200 sticky top-0 z-30"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Activity size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-base leading-none">
            PulmoScan<span className="text-teal-600">AI</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse-slow" />
            v4.2.1
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Dashboard', 'History', 'Resources'].map((item, i) => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${i === 0
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* System status */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Cpu size={11} />
            Neural Core: <span className="text-teal-600 font-medium">ONLINE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Database size={11} />
            Model: <span className="text-slate-600 font-medium">DenseNet-121</span>
          </span>
        </div>
      </div>
    </motion.header>
  );
}
