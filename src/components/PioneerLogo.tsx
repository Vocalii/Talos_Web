export function PioneerLogo({ className = '' }: { className?: string }) {
  return (
    <div id="pioneer-brand-logo" className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Pioneer Emblem */}
      <svg
        className="w-8 h-8 md:w-9 md:h-9 text-white transition-transform duration-300 group-hover:scale-105"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pioneer Logo"
      >
        {/* Rounded Lozenge Shield Contour */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="18"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
        />

        {/* Stylized Corn Plant / Seedling Sprout */}
        <path
          d="M50 80V40"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Left Sprouting Leaf */}
        <path
          d="M50 62 C34 56 22 48 24 32 C26 22 40 30 50 44"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right Sprouting Leaf */}
        <path
          d="M50 62 C66 56 78 48 76 32 C74 22 60 30 50 44"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central Crown Tip */}
        <path
          d="M50 36 C47 28 50 20 50 18 C50 20 53 28 50 36Z"
          fill="currentColor"
        />

        {/* Base Seed Kernel */}
        <circle cx="50" cy="74" r="5" fill="currentColor" />
      </svg>

      {/* Pioneer Wordmark */}
      <span className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
        TALOS
      </span>
    </div>
  );
}
