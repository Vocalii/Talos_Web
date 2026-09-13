import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShieldCheck } from 'lucide-react';

interface CookieModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookieModal({ isOpen, onClose }: CookieModalProps) {
  const [preferences, setPreferences] = useState({
    strictlyNecessary: true, // always required
    performance: true,
    functional: true,
    marketing: false,
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleAcceptAll = () => {
    setPreferences({
      strictlyNecessary: true,
      performance: true,
      functional: true,
      marketing: true,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cookie-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            id="cookie-modal-container"
            className="w-full max-w-lg bg-[#05140d] border border-emerald-900/60 text-zinc-100 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/80">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold tracking-wide text-white">Privacy & Cookie Preferences</h2>
              </div>
              <button
                id="close-cookie-modal-btn"
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-emerald-900/30 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-300/80 mt-3 leading-relaxed">
              Pioneer and Corteva Agriscience use cookies and related tracking technologies to provide seamless site functionality, analyze traffic, and tailor content to your regional agronomic needs.
            </p>

            {/* Cookie Categories */}
            <div className="mt-5 space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020b06] border border-emerald-950/60">
                <div>
                  <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    Strictly Necessary Cookies
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/40">
                      Required
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Essential for security, session stability, and navigation.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.strictlyNecessary}
                  disabled
                  className="w-4 h-4 rounded accent-emerald-500 cursor-not-allowed opacity-80"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020b06] border border-emerald-950/60">
                <div>
                  <h3 className="text-sm font-medium text-white">Analytics & Performance</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Helps measure hybrid yield queries and visitor journeys.</p>
                </div>
                <input
                  id="pref-performance"
                  type="checkbox"
                  checked={preferences.performance}
                  onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020b06] border border-emerald-950/60">
                <div>
                  <h3 className="text-sm font-medium text-white">Functional Preferences</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Remembers your geographic growing zone and unit preferences.</p>
                </div>
                <input
                  id="pref-functional"
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020b06] border border-emerald-950/60">
                <div>
                  <h3 className="text-sm font-medium text-white">Targeted Marketing</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Delivers tailored seed catalog and seasonal advisory alerts.</p>
                </div>
                <input
                  id="pref-marketing"
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-end gap-3">
              {savedNotice ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                  <Check className="w-4 h-4" /> Preferences saved
                </div>
              ) : (
                <>
                  <button
                    id="save-cookie-pref-btn"
                    onClick={handleSave}
                    className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-zinc-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 transition"
                  >
                    Save Preferences
                  </button>
                  <button
                    id="accept-all-cookie-btn"
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-lg shadow-emerald-950/50"
                  >
                    Accept All
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
