import { useRef, useEffect } from 'react';
import { MotionValue } from 'motion/react';

interface ConstellationCanvasProps {
  className?: string;
  activeSlide?: number;
  scrollProgress?: MotionValue<number>;
}

interface NodePoint {
  id: number;
  relY: number; // 0..1 down the vertical canvas
  angleOffset: number; // base angular offset (radians)
  helicalTurns: number; // number of spiral twists
  radiusFactor: number; // radial distance from central helical axis (0..1)
  radius: number; // base radius in px
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
  connections: number[]; // IDs of connected nodes
}

interface ProjectedNode extends NodePoint {
  projX: number;
  projY: number;
  z3d: number;
  perspective: number;
  depthT: number; // 0 (furthest back) to 1 (closest front)
}

interface DataPulse {
  fromNode: number;
  toNode: number;
  progress: number; // 0..1
  speed: number;
  color: string;
}

interface PointCloudParticle {
  relX: number;
  relY: number;
  baseRadius: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
}

export function ConstellationCanvas({
  className = '',
  activeSlide = 0,
  scrollProgress,
}: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);

  // Synchronize scroll progress without re-triggering heavy Canvas re-mounts
  useEffect(() => {
    if (!scrollProgress) return;
    progressRef.current = scrollProgress.get();
    const unsubscribe = scrollProgress.on('change', (latest) => {
      progressRef.current = latest;
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      if (!canvas) return;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for interactive tilt and node attraction
    const mouse = {
      x: -1000,
      y: -1000,
      relX: 0.5,
      relY: 0.5,
      active: false,
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.relX = mouse.x / width;
      mouse.relY = mouse.y / height;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.relX = 0.5;
      mouse.relY = 0.5;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // 3D Helical Genomic Network Model
    // 2 interleaved spiral strands (Strand A: Gold/Amber, Strand B: Emerald/Teal)
    // with cross-ladder rungs and central algorithmic nexus hubs - extended vertical length
    const turns = 3.4; // Longer, continuous helical spiral curvature along the vertical length

    const nodes: NodePoint[] = [
      // STRAND A (Angle offset: 0) - Primary Genomic Trait Sequence (Extended)
      { id: 100, relY: -0.06, angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.95, radius: 6.5, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.75)', pulsePhase: 0.5, pulseSpeed: 0.02, connections: [101, 102] },
      { id: 102, relY: 0.00,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.0,  radius: 7.0, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.8)',  pulsePhase: 1.2, pulseSpeed: 0.019, connections: [103, 0] },
      { id: 0,   relY: 0.06,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.0,  radius: 7.5, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.85)', pulsePhase: 0.0, pulseSpeed: 0.02, connections: [1, 2] },
      { id: 2,   relY: 0.13,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.95, radius: 6.0, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.75)',  pulsePhase: 0.8, pulseSpeed: 0.018, connections: [3, 4] },
      { id: 4,   relY: 0.20,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.0,  radius: 6.5, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.8)',  pulsePhase: 1.6, pulseSpeed: 0.022, connections: [5, 6] },
      { id: 6,   relY: 0.28,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.9,  radius: 6.0, color: '#ca8a04', glowColor: 'rgba(202, 138, 4, 0.7)',   pulsePhase: 2.4, pulseSpeed: 0.017, connections: [7, 8] },
      { id: 8,   relY: 0.36,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.0,  radius: 7.0, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.85)', pulsePhase: 3.2, pulseSpeed: 0.021, connections: [9, 10] },
      { id: 10,  relY: 0.44,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.95, radius: 6.5, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.75)',  pulsePhase: 4.0, pulseSpeed: 0.019, connections: [11, 12] },
      { id: 12,  relY: 0.52,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.05, radius: 8.5, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.9)',   pulsePhase: 4.8, pulseSpeed: 0.024, connections: [13, 14, 28] },
      { id: 14,  relY: 0.60,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.95, radius: 6.5, color: '#ca8a04', glowColor: 'rgba(202, 138, 4, 0.75)',  pulsePhase: 0.5, pulseSpeed: 0.018, connections: [15, 16] },
      { id: 16,  relY: 0.68,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.0,  radius: 7.0, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.85)', pulsePhase: 1.4, pulseSpeed: 0.022, connections: [17, 18] },
      { id: 18,  relY: 0.76,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.95, radius: 6.5, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.75)',  pulsePhase: 2.3, pulseSpeed: 0.019, connections: [19, 20] },
      { id: 20,  relY: 0.84,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.9,  radius: 7.0, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.8)',  pulsePhase: 3.1, pulseSpeed: 0.02,  connections: [21, 32] },
      { id: 22,  relY: 0.92,  angleOffset: 0.1,         helicalTurns: turns, radiusFactor: 0.85, radius: 8.0, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.85)', pulsePhase: 4.0, pulseSpeed: 0.022, connections: [105, 106] },
      { id: 106, relY: 1.00,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 0.95, radius: 7.5, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.8)',  pulsePhase: 0.8, pulseSpeed: 0.02,  connections: [107, 108] },
      { id: 108, relY: 1.07,  angleOffset: 0,           helicalTurns: turns, radiusFactor: 1.0,  radius: 8.0, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.75)', pulsePhase: 1.7, pulseSpeed: 0.019, connections: [] },

      // STRAND B (Angle offset: Math.PI) - Counter-Helix Bioluminescent Strand (Extended)
      { id: 101, relY: -0.05, angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.95, radius: 6.0, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.75)', pulsePhase: 0.7, pulseSpeed: 0.018, connections: [103] },
      { id: 103, relY: 0.01,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.0,  radius: 6.5, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.8)',  pulsePhase: 1.5, pulseSpeed: 0.02,  connections: [1] },
      { id: 1,   relY: 0.07,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.0,  radius: 6.0, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.8)',  pulsePhase: 0.4, pulseSpeed: 0.019, connections: [3] },
      { id: 3,   relY: 0.14,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.95, radius: 6.5, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.75)', pulsePhase: 1.2, pulseSpeed: 0.021, connections: [5] },
      { id: 5,   relY: 0.22,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.0,  radius: 7.0, color: '#6ee7b7', glowColor: 'rgba(110, 231, 183, 0.8)', pulsePhase: 2.0, pulseSpeed: 0.017, connections: [7] },
      { id: 7,   relY: 0.30,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.9,  radius: 6.0, color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.7)',  pulsePhase: 2.8, pulseSpeed: 0.02,  connections: [9] },
      { id: 9,   relY: 0.38,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.0,  radius: 6.5, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.75)', pulsePhase: 3.6, pulseSpeed: 0.018, connections: [11] },
      { id: 11,  relY: 0.46,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.95, radius: 7.0, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.8)',  pulsePhase: 4.4, pulseSpeed: 0.023, connections: [13] },
      { id: 13,  relY: 0.54,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.05, radius: 8.0, color: '#6ee7b7', glowColor: 'rgba(110, 231, 183, 0.85)', pulsePhase: 0.2, pulseSpeed: 0.025, connections: [15, 29] },
      { id: 15,  relY: 0.62,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.95, radius: 6.5, color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.7)',  pulsePhase: 1.1, pulseSpeed: 0.019, connections: [17] },
      { id: 17,  relY: 0.70,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.0,  radius: 6.5, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.75)', pulsePhase: 2.1, pulseSpeed: 0.02,  connections: [19] },
      { id: 19,  relY: 0.78,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.95, radius: 6.0, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.75)', pulsePhase: 2.9, pulseSpeed: 0.018, connections: [21] },
      { id: 21,  relY: 0.86,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.9,  radius: 7.5, color: '#6ee7b7', glowColor: 'rgba(110, 231, 183, 0.85)', pulsePhase: 3.8, pulseSpeed: 0.022, connections: [22] },
      { id: 105, relY: 0.94,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 0.95, radius: 7.0, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.8)',  pulsePhase: 4.3, pulseSpeed: 0.021, connections: [107] },
      { id: 107, relY: 1.02,  angleOffset: Math.PI,     helicalTurns: turns, radiusFactor: 1.0,  radius: 7.5, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.85)', pulsePhase: 0.6, pulseSpeed: 0.024, connections: [] },

      // CENTRAL ALGORITHMIC NEXUS HUBS (Lower radiusFactor, inner core computational nodes)
      { id: 104, relY: -0.02, angleOffset: Math.PI * 0.5, helicalTurns: turns, radiusFactor: 0.35, radius: 6.0, color: '#a7f3d0', glowColor: 'rgba(167, 243, 208, 0.75)', pulsePhase: 0.9, pulseSpeed: 0.02, connections: [100, 101] },
      { id: 31,  relY: 0.09,  angleOffset: Math.PI * 0.2, helicalTurns: turns, radiusFactor: 0.4,  radius: 5.5, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.7)',  pulsePhase: 0.5, pulseSpeed: 0.018, connections: [0, 1] },
      { id: 24,  relY: 0.17,  angleOffset: Math.PI * 0.5, helicalTurns: turns, radiusFactor: 0.35, radius: 6.0, color: '#a7f3d0', glowColor: 'rgba(167, 243, 208, 0.8)',  pulsePhase: 1.0, pulseSpeed: 0.02,  connections: [2, 3] },
      { id: 25,  relY: 0.33,  angleOffset: Math.PI * 1.5, helicalTurns: turns, radiusFactor: 0.4,  radius: 6.5, color: '#a7f3d0', glowColor: 'rgba(167, 243, 208, 0.8)',  pulsePhase: 2.6, pulseSpeed: 0.022, connections: [6, 7] },
      { id: 26,  relY: 0.49,  angleOffset: Math.PI * 0.5, helicalTurns: turns, radiusFactor: 0.3,  radius: 8.0, color: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.9)',  pulsePhase: 3.5, pulseSpeed: 0.025, connections: [10, 11, 12, 13] },
      { id: 28,  relY: 0.58,  angleOffset: Math.PI * 0.2, helicalTurns: turns, radiusFactor: 0.5,  radius: 6.0, color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.7)',  pulsePhase: 1.7, pulseSpeed: 0.021, connections: [14] },
      { id: 29,  relY: 0.60,  angleOffset: Math.PI * 1.2, helicalTurns: turns, radiusFactor: 0.5,  radius: 6.0, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.7)',  pulsePhase: 2.2, pulseSpeed: 0.018, connections: [15] },
      { id: 27,  relY: 0.68,  angleOffset: Math.PI * 1.5, helicalTurns: turns, radiusFactor: 0.4,  radius: 6.5, color: '#a7f3d0', glowColor: 'rgba(167, 243, 208, 0.8)',  pulsePhase: 0.8, pulseSpeed: 0.019, connections: [14, 15] },
      { id: 30,  relY: 0.83,  angleOffset: Math.PI * 0.5, helicalTurns: turns, radiusFactor: 0.35, radius: 7.0, color: '#a7f3d0', glowColor: 'rgba(167, 243, 208, 0.8)',  pulsePhase: 3.3, pulseSpeed: 0.022, connections: [18, 19, 20, 21] },
      { id: 32,  relY: 0.90,  angleOffset: 0.1,           helicalTurns: turns, radiusFactor: 0.45, radius: 7.5, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.85)', pulsePhase: 4.0, pulseSpeed: 0.023, connections: [22] },
      { id: 110, relY: 0.98,  angleOffset: Math.PI * 0.4, helicalTurns: turns, radiusFactor: 0.4,  radius: 7.0, color: '#a7f3d0', glowColor: 'rgba(167, 243, 208, 0.8)',  pulsePhase: 1.3, pulseSpeed: 0.022, connections: [22, 105] },
      { id: 111, relY: 1.05,  angleOffset: Math.PI * 1.4, helicalTurns: turns, radiusFactor: 0.4,  radius: 7.5, color: '#5eead4', glowColor: 'rgba(94, 234, 212, 0.85)', pulsePhase: 2.5, pulseSpeed: 0.021, connections: [106, 107] },
    ];

    // Travelling data pulses along the extended genetic helix & cross-bridges
    const dataPulses: DataPulse[] = [
      { fromNode: 100, toNode: 102, progress: 0.2, speed: 0.009, color: '#facc15' },
      { fromNode: 101, toNode: 103, progress: 0.6, speed: 0.008, color: '#5eead4' },
      { fromNode: 102, toNode: 0, progress: 0.4, speed: 0.008, color: '#eab308' },
      { fromNode: 103, toNode: 1, progress: 0.7, speed: 0.008, color: '#2dd4bf' },
      { fromNode: 0, toNode: 2, progress: 0.1, speed: 0.009, color: '#facc15' },
      { fromNode: 1, toNode: 3, progress: 0.5, speed: 0.008, color: '#5eead4' },
      { fromNode: 2, toNode: 24, progress: 0.3, speed: 0.007, color: '#a7f3d0' },
      { fromNode: 24, toNode: 3, progress: 0.7, speed: 0.008, color: '#6ee7b7' },
      { fromNode: 2, toNode: 4, progress: 0.4, speed: 0.009, color: '#eab308' },
      { fromNode: 3, toNode: 5, progress: 0.8, speed: 0.007, color: '#34d399' },
      { fromNode: 4, toNode: 6, progress: 0.2, speed: 0.008, color: '#facc15' },
      { fromNode: 5, toNode: 7, progress: 0.6, speed: 0.008, color: '#2dd4bf' },
      { fromNode: 6, toNode: 25, progress: 0.4, speed: 0.007, color: '#a7f3d0' },
      { fromNode: 25, toNode: 7, progress: 0.8, speed: 0.008, color: '#5eead4' },
      { fromNode: 8, toNode: 10, progress: 0.15, speed: 0.009, color: '#facc15' },
      { fromNode: 9, toNode: 11, progress: 0.55, speed: 0.008, color: '#6ee7b7' },
      { fromNode: 10, toNode: 26, progress: 0.35, speed: 0.01, color: '#ffffff' },
      { fromNode: 11, toNode: 26, progress: 0.75, speed: 0.01, color: '#ffffff' },
      { fromNode: 26, toNode: 12, progress: 0.2, speed: 0.009, color: '#facc15' },
      { fromNode: 26, toNode: 13, progress: 0.6, speed: 0.009, color: '#2dd4bf' },
      { fromNode: 12, toNode: 14, progress: 0.45, speed: 0.008, color: '#eab308' },
      { fromNode: 13, toNode: 15, progress: 0.85, speed: 0.007, color: '#5eead4' },
      { fromNode: 14, toNode: 27, progress: 0.25, speed: 0.008, color: '#a7f3d0' },
      { fromNode: 27, toNode: 15, progress: 0.65, speed: 0.008, color: '#34d399' },
      { fromNode: 16, toNode: 18, progress: 0.3, speed: 0.008, color: '#facc15' },
      { fromNode: 17, toNode: 19, progress: 0.7, speed: 0.007, color: '#2dd4bf' },
      { fromNode: 18, toNode: 30, progress: 0.1, speed: 0.008, color: '#a7f3d0' },
      { fromNode: 30, toNode: 21, progress: 0.5, speed: 0.009, color: '#6ee7b7' },
      { fromNode: 20, toNode: 32, progress: 0.4, speed: 0.008, color: '#5eead4' },
      { fromNode: 22, toNode: 105, progress: 0.3, speed: 0.008, color: '#2dd4bf' },
      { fromNode: 105, toNode: 107, progress: 0.65, speed: 0.009, color: '#5eead4' },
      { fromNode: 22, toNode: 106, progress: 0.4, speed: 0.008, color: '#facc15' },
      { fromNode: 106, toNode: 108, progress: 0.75, speed: 0.008, color: '#eab308' },
    ];

    // Ambient floating particles
    const pointCloud: PointCloudParticle[] = [];
    const pointCount = 200;

    for (let i = 0; i < pointCount; i++) {
      const relX = 0.35 + Math.pow(Math.random(), 0.7) * 0.62;
      const relY = Math.random();
      const isBright = Math.random() < 0.14;
      const isAmber = Math.random() < 0.3;

      pointCloud.push({
        relX,
        relY,
        baseRadius: isBright ? Math.random() * 1.5 + 1.2 : Math.random() * 0.9 + 0.5,
        alpha: isBright ? Math.random() * 0.45 + 0.4 : Math.random() * 0.22 + 0.08,
        color: isAmber ? 'rgba(250, 204, 21, ' : 'rgba(52, 211, 153, ',
        vx: (Math.random() - 0.5) * 0.00015,
        vy: (Math.random() - 0.5) * 0.00012 - 0.00006,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw atmospheric background particle matrix
      pointCloud.forEach((pt) => {
        pt.relX += pt.vx;
        pt.relY += pt.vy;
        if (pt.relY < 0) pt.relY = 1;
        if (pt.relY > 1) pt.relY = 0;
        if (pt.relX < 0.25) pt.relX = 0.95;
        if (pt.relX > 1) pt.relX = 0.32;

        const px = pt.relX * width;
        const py = pt.relY * height;

        ctx.fillStyle = `${pt.color}${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.baseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Compute 3D Spiral Coordinates driven by scroll progress
      const isMobile = width < 768;
      // Center of the helix spiral: positioned on the right half (0.57) on desktop, centered (0.50) on mobile
      const mouseTiltX = mouse.active ? (mouse.relX - 0.5) * 35 : 0;
      const axisX = width * (isMobile ? 0.50 : 0.57) + mouseTiltX;
      const maxHelixRadius = isMobile ? Math.min(width * 0.38, 135) : Math.min(width * 0.20, 185);

      // Spiral rotation angle: strictly rotates with scroll, with reduced spiral amount (no idle auto-rotation)
      const scrollRotation = progressRef.current * Math.PI * 1.5; // ~0.75 turns across entire scroll
      const totalSpiralAngle = scrollRotation;

      // Calculate 3D positions and project to 2D
      const camDistance = 460;

      const projectedNodes: ProjectedNode[] = nodes.map((node) => {
        // Node angle along the spiral
        const nodeAngle =
          node.relY * Math.PI * 2 * node.helicalTurns + node.angleOffset + totalSpiralAngle;
        const r = maxHelixRadius * node.radiusFactor;

        // 3D coordinates
        let x3d = Math.cos(nodeAngle) * r;
        let z3d = Math.sin(nodeAngle) * r; // -r to +r (depth)
        let y3d = node.relY * height;

        // Subtle breathing & mouse deflection
        const breath = Math.sin(time * 1.2 + node.pulsePhase) * 2;
        y3d += breath;

        if (mouse.active) {
          const dx = mouse.x - (axisX + x3d);
          const dy = mouse.y - y3d;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 2) {
            const pull = (1 - dist / 130) * 14;
            x3d += (dx / dist) * pull;
            y3d += (dy / dist) * pull;
          }
        }

        // Camera perspective
        const perspective = camDistance / (camDistance + z3d);
        const projX = axisX + x3d * perspective;
        const projY = y3d;
        const depthT = Math.max(0, Math.min(1, (z3d + maxHelixRadius) / (2 * maxHelixRadius)));

        return {
          ...node,
          projX,
          projY,
          z3d,
          perspective,
          depthT,
        };
      });

      // 3. Draw Connecting Lines (Dotted algorithmic links with 3D depth-modulated opacity)
      projectedNodes.forEach((node) => {
        node.connections.forEach((targetId) => {
          const target = projectedNodes.find((n) => n.id === targetId);
          if (!target) return;

          const avgDepthT = (node.depthT + target.depthT) * 0.5;
          const lineAlpha = 0.22 + 0.65 * avgDepthT;
          const lineWidth = (0.8 + 1.0 * avgDepthT) * Math.min(node.perspective, target.perspective);

          ctx.save();
          const grad = ctx.createLinearGradient(
            node.projX,
            node.projY,
            target.projX,
            target.projY
          );
          grad.addColorStop(0, node.glowColor);
          grad.addColorStop(1, target.glowColor);

          ctx.strokeStyle = grad;
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = lineWidth;
          ctx.setLineDash([3, 4]); // Dotted algorithmic line style
          ctx.beginPath();
          ctx.moveTo(node.projX, node.projY);
          ctx.lineTo(target.projX, target.projY);
          ctx.stroke();
          ctx.restore();
        });
      });

      // 4. Draw Travelling Data Pulses along 3D lines
      dataPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const fromNode = projectedNodes.find((n) => n.id === pulse.fromNode);
        const toNode = projectedNodes.find((n) => n.id === pulse.toNode);
        if (!fromNode || !toNode) return;

        const px = fromNode.projX + (toNode.projX - fromNode.projX) * pulse.progress;
        const py = fromNode.projY + (toNode.projY - fromNode.projY) * pulse.progress;
        const pDepthT = fromNode.depthT + (toNode.depthT - fromNode.depthT) * pulse.progress;
        const pScale = (0.7 + 0.6 * pDepthT) * Math.min(fromNode.perspective, toNode.perspective);

        ctx.save();
        ctx.globalAlpha = 0.35 + 0.65 * pDepthT;
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 8 * pScale;
        ctx.beginPath();
        ctx.arc(px, py, 2.4 * pScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw Glowing Nodes (Z-Sorted: background nodes first, foreground on top)
      const sortedNodes = [...projectedNodes].sort((a, b) => a.z3d - b.z3d);

      sortedNodes.forEach((node) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.15 + 0.85;
        const radius = node.radius * node.perspective * pulse;
        const nodeAlpha = 0.45 + 0.55 * node.depthT;

        ctx.save();
        ctx.globalAlpha = nodeAlpha;

        // Outer soft glow halo
        const haloGrad = ctx.createRadialGradient(
          node.projX,
          node.projY,
          0,
          node.projX,
          node.projY,
          radius * 2.8
        );
        haloGrad.addColorStop(0, node.glowColor);
        haloGrad.addColorStop(0.5, node.glowColor.replace(/[\d\.]+\)$/, '0.2)'));
        haloGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Node core circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Specular glint for nodes facing forward (depthT > 0.4)
        if (node.depthT > 0.4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.5 * node.depthT})`;
          ctx.beginPath();
          ctx.arc(
            node.projX - radius * 0.25,
            node.projY - radius * 0.25,
            radius * 0.35,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [activeSlide]);

  return (
    <canvas
      ref={canvasRef}
      id="algorithm-constellation-canvas"
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  );
}
