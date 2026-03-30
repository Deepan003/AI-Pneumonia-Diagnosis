import { ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-sm border-t border-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert size={12} className="text-amber-500 flex-shrink-0" />
          <span>
            <strong className="text-slate-600 font-semibold">Medical Disclaimer:</strong>{' '}
            For professional clinical review only. AI outputs are not a substitute for medical diagnosis.
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {['Privacy Policy', 'Terms of Service', 'Clinical Disclaimer'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-slate-400 hover:text-teal-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
