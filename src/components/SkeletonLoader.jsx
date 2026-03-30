import { motion } from 'framer-motion';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

function ShimmerBar({ className = '' }) {
  return (
    <motion.div
      {...shimmer}
      className={`rounded ${className}`}
      style={{
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header skeleton */}
      <div className="pb-4 border-b border-slate-100">
        <ShimmerBar className="h-3 w-24 mb-2" />
        <ShimmerBar className="h-6 w-48 mb-2" />
        <ShimmerBar className="h-3 w-64" />
      </div>

      {/* Prediction badge skeleton */}
      <div className="flex items-start gap-4 p-4 rounded-md border border-slate-100 bg-slate-50">
        <ShimmerBar className="w-12 h-12 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <ShimmerBar className="h-3 w-20" />
          <ShimmerBar className="h-5 w-40" />
          <ShimmerBar className="h-3 w-28" />
        </div>
      </div>

      {/* Confidence bar skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <ShimmerBar className="h-3 w-24" />
          <ShimmerBar className="h-3 w-12" />
        </div>
        <ShimmerBar className="h-2 w-full rounded-full" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-md border border-slate-100 p-3 space-y-2">
              <ShimmerBar className="h-3 w-16" />
              <ShimmerBar className="h-5 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Report skeleton */}
      <div className="flex-1 space-y-2">
        <ShimmerBar className="h-3 w-32 mb-3" />
        {[...Array(6)].map((_, i) => (
          <ShimmerBar key={i} className="h-3" style={{ width: `${85 - i * 7}%` }} />
        ))}
      </div>
    </div>
  );
}
