import { useEffect, type RefObject } from 'react';
import { PRODUCT_VIDEO } from './productStory.config';

interface ProductVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string;
  poster?: string;
  /** Only when true is `src` attached — keeps the network idle until near the viewport. */
  load: boolean;
  className?: string;
}

/**
 * The one shared <video> primitive. Both the background video and the
 * phone-screen video render through this, so crop (object-fit / position),
 * muting, looping and inline playback are identical by construction.
 * Playback itself is driven externally (see useCoordinatedPlayback).
 */
export function ProductVideo({ videoRef, src, poster, load, className = '' }: ProductVideoProps) {
  // React's `muted` attribute is unreliable for autoplay policies; set the DOM property.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = true;
  }, [videoRef]);

  return (
    <video
      ref={videoRef}
      src={load ? src : undefined}
      poster={poster}
      preload={load ? 'auto' : 'none'}
      muted
      loop
      playsInline
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      style={{ objectPosition: PRODUCT_VIDEO.objectPosition }}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
