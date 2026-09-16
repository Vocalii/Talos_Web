export function PioneerLogo({ className = '' }: { className?: string }) {
  return (
    <div id="pioneer-brand-logo" className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Talos Emblem */}
      <img
        src="/talos-icon.png"
        alt="Talos Logo"
        className="w-6 h-6 md:w-7 md:h-7 object-contain transition-transform duration-300 group-hover:scale-105"
      />

      {/* Pioneer Wordmark */}
      <span className="font-display font-medium text-base md:text-lg tracking-[0.3em] text-white uppercase">
        TΛLOS
      </span>
    </div>
  );
}
