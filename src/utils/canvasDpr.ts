/**
 * Backing-store scale for the decorative canvases. Phones report a DPR of 3,
 * which makes a full-screen canvas ~9x the pixels of its CSS size; the specks
 * and glows drawn here don't need it, so cap it (tighter below the `lg`
 * breakpoint, where GPUs are weakest).
 */
export function getCanvasDpr(): number {
  const cap = window.innerWidth >= 1024 ? 2 : 1.5;
  return Math.min(window.devicePixelRatio || 1, cap);
}
