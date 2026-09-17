import { useState, useRef, type MouseEvent } from 'react';
import { motion, MotionValue } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Wifi,
  Battery,
  Activity,
} from 'lucide-react';

interface FloatingPhoneVideoProps {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  combinedScale?: MotionValue<number>;
  combinedY?: MotionValue<number>;
  combinedRotateY?: MotionValue<number>;
  combinedRotateX?: MotionValue<number>;
  combinedOpacity?: MotionValue<number>;
}

// Curated high-performance fitness / movement video clips
const VIDEO_TRACKS = [
  {
    id: 'muscle-up',
    title: 'Muscle-Up AI Tracking',
    subtitle: 'Transition & False Grip Analysis',
    badge: 'Real-Time Form AI',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: '/src/assets/images/MUMaster.png',
    hudData: {
      exercise: 'BAR MUSCLE-UP',
      angle: '174°',
      targetAngle: '180°',
      tempo: '2.1s',
      formScore: '98%',
      rep: '04 / 06',
    },
  },
  {
    id: 'handstand',
    title: 'Handstand Balance Node',
    subtitle: 'Shoulder Openness & Center of Mass',
    badge: 'Kinematic Balance',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    poster: '/src/assets/images/HandstandMaster.png',
    hudData: {
      exercise: 'HANDSTAND',
      angle: '180°',
      targetAngle: '180°',
      tempo: '18.4s',
      formScore: '99%',
      rep: 'HOLD',
    },
  },
  {
    id: 'back-lever',
    title: 'Back Lever Tension',
    subtitle: 'Scapular Protraction & Hip Alignment',
    badge: 'Tendon Conditioning',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: '/src/assets/images/BackLever1.png',
    hudData: {
      exercise: 'BACK LEVER',
      angle: '179°',
      targetAngle: '180°',
      tempo: '08.2s',
      formScore: '96%',
      rep: '03 / 05',
    },
  },
];

export function FloatingPhoneVideo({
  combinedOpacity,
}: FloatingPhoneVideoProps) {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHud, setShowHud] = useState(true);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTrack = VIDEO_TRACKS[selectedTrackIndex];

  // Toggle video playback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Fallback if browser autoplay policies require muted video
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true));
          }
        });
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 15);
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const restartVideo = (e: MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Time format helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full max-w-[340px] flex flex-col items-center justify-center select-none">
      {/* Background Soft Aura - static ambient backlight */}
      <div
        className="absolute -inset-6 rounded-full pointer-events-none opacity-30 blur-2xl transition-opacity duration-700"
        style={{
          background: isPlaying
            ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.18) 0%, rgba(16, 185, 129, 0.1) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Static Compact Smartphone Chassis (Fixed & Still) */}
      <motion.div
        style={{
          opacity: combinedOpacity || 1,
        }}
        className="relative w-[215px] sm:w-[230px] h-[435px] sm:h-[465px] rounded-[36px] p-2 bg-gradient-to-b from-[#2a2c30] via-[#141517] to-[#0c0d0f] shadow-[0_25px_60px_rgba(0,0,0,0.92),0_0_35px_rgba(16,185,129,0.1)] border border-white/20 ring-1 ring-black/90 cursor-default"
      >
        {/* Physical Smartphone Side Hardware Details */}
        {/* Left Side: Volume Buttons & Action Button */}
        <div className="absolute -left-[4px] top-20 w-[3px] h-7 bg-[#383a40] rounded-l-sm border-l border-white/30" />
        <div className="absolute -left-[4px] top-30 w-[3px] h-10 bg-[#383a40] rounded-l-sm border-l border-white/30" />
        <div className="absolute -left-[4px] top-42 w-[3px] h-10 bg-[#383a40] rounded-l-sm border-l border-white/30" />
        {/* Right Side: Power Button */}
        <div className="absolute -right-[4px] top-28 w-[3px] h-12 bg-[#383a40] rounded-r-sm border-r border-white/30" />

        {/* Outer Metal Bezel Chamfer Highlight */}
        <div className="absolute inset-0 rounded-[36px] border border-white/10 pointer-events-none" />

        {/* OLED Screen Enclosure */}
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black flex flex-col border border-white/10 shadow-inner">
          {/* Top Status Bar: Clock, Dynamic Island, Network/Battery */}
          <div className="relative z-30 pt-2 px-3 pb-1 flex items-center justify-between text-white select-none">
            {/* Clock */}
            <span className="font-mono text-[9px] font-semibold tracking-tight text-white/90">
              09:41
            </span>

            {/* Dynamic Island Pill */}
            <div className="w-18 h-4 rounded-full bg-black border border-white/15 flex items-center justify-between px-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {/* Front Camera Lens */}
              <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-500/70" />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1">
                {isPlaying ? (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                )}
                <span className="text-[7px] font-mono tracking-wider uppercase text-white/70">
                  {isPlaying ? 'REC' : 'AI'}
                </span>
              </div>
            </div>

            {/* Network & Battery */}
            <div className="flex items-center gap-1 text-white/80">
              <span className="text-[8px] font-mono font-bold">5G</span>
              <Wifi className="w-2.5 h-2.5 text-white/80" />
              <Battery className="w-3 h-3 text-white/90" />
            </div>
          </div>

          {/* Main Video Screen Container */}
          <div
            className="relative flex-1 w-full bg-neutral-950 overflow-hidden cursor-pointer"
            onClick={togglePlay}
            onMouseEnter={() => setIsHoveringControls(true)}
            onMouseLeave={() => setIsHoveringControls(false)}
          >
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={currentTrack.src}
              poster={currentTrack.poster}
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
            />

            {/* Subtle Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

            {/* TALOS REAL-TIME AI FORM HUD (Overlayed directly on video) */}
            {showHud && (
              <div className="absolute inset-x-2.5 top-1.5 pointer-events-none z-10 flex flex-col gap-1">
                {/* Exercise Tag & Form Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15">
                    <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span className="text-[7.5px] font-mono font-medium tracking-wider text-emerald-300 uppercase">
                      {currentTrack.hudData.exercise}
                    </span>
                  </div>

                  <div className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[7.5px] font-bold">
                    SCORE {currentTrack.hudData.formScore}
                  </div>
                </div>

                {/* Real-time Angle & Tempo Callouts */}
                <div className="flex gap-1 text-[7px] font-mono text-white/80">
                  <div className="px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-sm border border-white/10 flex items-center gap-0.5">
                    <span className="text-white/40">ANG:</span>
                    <span className="text-white font-bold">{currentTrack.hudData.angle}</span>
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-sm border border-white/10 flex items-center gap-0.5">
                    <span className="text-white/40">REP:</span>
                    <span className="text-white font-bold">{currentTrack.hudData.rep}</span>
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-sm border border-white/10 flex items-center gap-0.5">
                    <span className="text-white/40">TMP:</span>
                    <span className="text-white font-bold">{currentTrack.hudData.tempo}</span>
                  </div>
                </div>

                {/* Animated Targeting Reticle */}
                <div className="absolute top-14 right-2 w-9 h-9 rounded-full border border-emerald-400/35 border-dashed animate-[spin_10s_linear_infinite] flex items-center justify-center opacity-55">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            )}

            {/* Central Play Watermark Button when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white shadow-[0_0_25px_rgba(0,0,0,0.8)]">
                  <Play className="w-5 h-5 fill-white translate-x-0.5 text-white" />
                </div>
              </div>
            )}

            {/* Bottom In-Screen Controls Bar */}
            <div
              className={`absolute inset-x-2.5 bottom-2 z-20 flex flex-col gap-1.5 transition-opacity duration-300 ${
                isPlaying && !isHoveringControls ? 'opacity-40 hover:opacity-100' : 'opacity-100'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Scrubber */}
              <div
                className="w-full h-1 rounded-full bg-white/20 cursor-pointer overflow-hidden relative group/bar"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full relative"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-3 h-3 text-white/70" /> : <Volume2 className="w-3 h-3 text-emerald-300" />}
                  </button>

                  <button
                    type="button"
                    onClick={restartVideo}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Restart video"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                  </button>

                  <span className="font-mono text-[7.5px] text-white/60">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* HUD Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowHud(!showHud)}
                    className={`px-1.5 py-0.5 rounded text-[7px] font-mono tracking-wider uppercase border transition-colors cursor-pointer ${
                      showHud
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                        : 'bg-white/5 border-white/20 text-white/50'
                    }`}
                  >
                    HUD {showHud ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Quick Clip Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 pt-0.5 border-t border-white/10">
                {VIDEO_TRACKS.map((track, idx) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSelectedTrackIndex(idx);
                      setIsPlaying(true);
                      setTimeout(() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          videoRef.current.play();
                        }
                      }, 50);
                    }}
                    className={`px-0.5 py-0.5 rounded text-center truncate font-mono text-[7px] uppercase tracking-wider transition-all cursor-pointer ${
                      selectedTrackIndex === idx
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    {track.id === 'muscle-up' ? 'Muscle-Up' : track.id === 'handstand' ? 'Handstand' : 'Lever'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Home Indicator Bar at the bottom of the screen */}
          <div className="relative z-30 py-1.5 flex items-center justify-center bg-black/90">
            <div className="w-20 h-0.5 rounded-full bg-white/40" />
          </div>
        </div>
      </motion.div>

      {/* Minimal Helper Label under the Phone */}
      <div className="mt-3 flex items-center gap-1.5 text-center text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-white/50 select-none">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>TAP SCREEN TO PLAY VIDEO</span>
      </div>
    </div>
  );
}
