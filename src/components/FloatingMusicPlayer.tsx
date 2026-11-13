import { Music, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { musicPlayer, type MusicState } from '../utils/musicPlayer';

export default function FloatingMusicPlayer() {
  const [musicState, setMusicState] = useState<MusicState>(() => musicPlayer.getState());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return musicPlayer.subscribe(setMusicState);
  }, []);

  // Close popover if clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, [isOpen]);

  const isAudible = musicState.isPlaying && !musicState.isMuted && musicState.volume > 0;

  return (
    <div
      ref={containerRef}
      data-music-control="true"
      className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6"
    >
      {/* Expandable Music Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 rounded-2xl border border-white bg-white/95 p-4 shadow-xl shadow-[#A78BFA]/25 backdrop-blur-md"
            role="region"
            aria-label="Background music controls"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#7C3AED]">
                  <Music className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-[#1E1B4B]">
                    Children’s Day Tune
                  </p>
                  <p className="text-[11px] font-medium text-[#64748B]">
                    {musicState.isPlaying
                      ? musicState.isMuted
                        ? 'Playing (Muted)'
                        : 'Playing cheerfully'
                      : 'Paused'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize music controls"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Play / Pause & Mute Controls */}
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void musicPlayer.togglePlay()}
                className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  musicState.isPlaying
                    ? 'bg-[#FCE7F3] text-[#BE185D] hover:bg-[#FBCFE8]'
                    : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
                }`}
              >
                {musicState.isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    Play
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => musicPlayer.toggleMute()}
                aria-pressed={musicState.isMuted}
                className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  musicState.isMuted
                    ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border-slate-200 bg-white text-[#334155] hover:bg-slate-50'
                }`}
              >
                {musicState.isMuted ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Mute
                  </>
                )}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#475569]">
                <span>Volume</span>
                <span className="tabular-nums">
                  {musicState.isMuted ? '0%' : `${Math.round(musicState.volume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicState.isMuted ? 0 : musicState.volume}
                onChange={(e) => musicPlayer.setVolume(parseFloat(e.target.value))}
                aria-label="Background music volume"
                className="h-2 w-full cursor-pointer accent-[#7C3AED]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cute Animated Floating Music Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isAudible ? 'Open music controls (Music playing)' : 'Open music controls'}
        className={`group relative flex h-13 w-13 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] ${
          isAudible
            ? 'animate-float-slow bg-gradient-to-br from-[#DB2777] via-[#9333EA] to-[#0284C7] text-white shadow-[#9333EA]/35'
            : 'bg-white/95 text-[#7C3AED] shadow-[#7DD3FC]/35 hover:bg-[#F5F3FF]'
        }`}
      >
        {isAudible ? (
          <Music className="h-6 w-6" aria-hidden="true" />
        ) : musicState.isMuted && musicState.isPlaying ? (
          <VolumeX className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Music className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
