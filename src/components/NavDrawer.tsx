import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Search, Sprout, Shield, Cpu, Phone, BookOpen } from 'lucide-react';
import { PioneerLogo } from './PioneerLogo';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const menuItems = [
    { name: 'Corn Hybrids & Trait Technology', desc: 'Industry-leading genetics built for maximum yield potential', icon: Sprout },
    { name: 'Seed Traits & Protection', desc: 'Borer, rootworm, and herbicide tolerance systems', icon: Shield },
    { name: 'Digital Agronomy & Pioneer Seeds App', desc: 'Real-time field scouting, weather data, and yield forecasts', icon: Cpu },
    { name: 'Agronomy Research & Field Insights', desc: 'Practical growing tips from local Corteva agronomists', icon: BookOpen },
    { name: 'Find Your Local Pioneer Representative', desc: 'Connect with a trusted seed sales professional in your county', icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="nav-drawer-backdrop" className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            id="nav-drawer-panel"
            className="relative z-10 w-full max-w-md bg-[#020e08] border-r border-emerald-900/40 text-zinc-100 h-full flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between px-6 py-6 border-b border-emerald-950/80">
                <PioneerLogo />
                <button
                  id="close-nav-drawer-btn"
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-emerald-950/60 transition"
                  aria-label="Close navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 pt-6">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-seed-hybrids"
                    type="text"
                    placeholder="Search hybrids, traits, or agronomy..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#05180f] border border-emerald-900/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              {/* Nav List */}
              <nav className="px-4 py-6 space-y-1.5">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      id={`nav-item-${index}`}
                      onClick={onClose}
                      className="w-full group text-left px-3.5 py-3 rounded-xl hover:bg-[#072417] transition flex items-start gap-3.5"
                    >
                      <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 group-hover:text-emerald-300 group-hover:border-emerald-500/50 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-zinc-100 group-hover:text-white flex items-center justify-between">
                          {item.name}
                          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition transform group-hover:translate-x-0.5" />
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-emerald-950/80 bg-[#010905]">
              <div className="text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-300">Pioneer &bull; A Corteva Agriscience Brand</p>
                <p className="text-zinc-500">&copy; 2026 Corteva. Trademarks and service marks of Corteva Agriscience.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
