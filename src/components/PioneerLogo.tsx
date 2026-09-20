export function PioneerLogo({ className = '' }: { className?: string }) {
  return (
    <div id="pioneer-brand-logo" className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Talos Emblem */}
      <img
        src="/talos-icon.webp"
        alt="Talos Logo"
        className="w-6 h-6 md:w-7 md:h-7 object-contain transition-all duration-500 ease-out group-hover:scale-[1.22] group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"
      />

      {/* Pioneer Wordmark */}
      <span className="font-display font-medium text-base md:text-lg tracking-[0.3em] text-white/90 uppercase transition-all duration-500 ease-out group-hover:tracking-[0.38em] group-hover:text-white group-hover:[text-shadow:0_0_14px_rgba(255,255,255,0.55)]">
        TΛLOS
      </span>
    </div>
  );
}
