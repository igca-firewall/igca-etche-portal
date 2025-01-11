import React, { useRef, useState } from 'react';

const CustomVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-full max-h-[600px] rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="rounded-lg object-cover w-full h-full"
        src="/videos/add.mp4"
        playsInline
        preload="metadata"
      />
      {!isPlaying && (
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full p-3 focus:outline-none"
          onClick={handlePlayPause}
        >
          ▶️
        </button>
      )}
      {isPlaying && (
        <button
          className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full px-4 py-2 focus:outline-none"
          onClick={handlePlayPause}
        >
          ⏸ Pause
        </button>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
