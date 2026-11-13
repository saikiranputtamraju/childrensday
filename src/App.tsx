import { PartyPopper, Sparkles, Volume2, VolumeX, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AnimatedSkyBackdrop from './components/AnimatedSkyBackdrop';
import CameraModal from './components/CameraModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import ConfettiBurst from './components/ConfettiBurst';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import FunWishesSection from './components/FunWishesSection';
import GreetingCardCreator from './components/GreetingCardCreator';
import HeroSection from './components/HeroSection';
import PhotoFrameStudio from './components/PhotoFrameStudio';
import PrivacySection from './components/PrivacySection';
import SparkleCursor from './components/SparkleCursor';
import { PASTEL_THEMES } from './data/framesAndWishes';
import type { PastelThemeId } from './types/photoMagic';
import { musicPlayer } from './utils/musicPlayer';
import { soundEffects } from './utils/soundEffects';

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [fileInputTriggerKey, setFileInputTriggerKey] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => musicPlayer.getState().isPlaying);

  // Interactive features state
  const [themeId, setThemeId] = useState<PastelThemeId>('rainbow-celebration');
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [sparkleCursorEnabled, setSparkleCursorEnabled] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => soundEffects.isEnabled());

  const activeTheme = PASTEL_THEMES.find((t) => t.id === themeId) ?? PASTEL_THEMES[0];

  const triggerConfetti = useCallback(() => {
    setConfettiKey((k) => k + 1);
  }, []);

  const scrollToStudio = useCallback(() => {
    const el = document.getElementById('studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToFrames = useCallback(() => {
    const el = document.getElementById('frames-gallery') ?? document.getElementById('studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleToggleMusic = useCallback(() => {
    void musicPlayer.togglePlay();
  }, []);

  const handleToggleCelebration = () => {
    setCelebrationMode((prev) => {
      const next = !prev;
      if (next) {
        triggerConfetti();
        soundEffects.playCelebrationChime();
      }
      return next;
    });
  };

  const handleToggleSoundEffects = () => {
    setSoundEffectsEnabled((prev) => {
      const next = !prev;
      soundEffects.setEnabled(next);
      return next;
    });
  };

  useEffect(() => {
    const unsubscribe = musicPlayer.subscribe((state) => {
      setIsMusicPlaying(state.isPlaying && !state.isMuted);
    });

    let active = true;
    let firstInteractionAttached = false;

    const onFirstInteraction = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-music-control]')) {
        cleanupListeners();
        return;
      }
      const current = musicPlayer.getState();
      if (!current.hasExplicitlyStopped && !current.isPlaying) {
        void musicPlayer.tryPlay(false);
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      if (!firstInteractionAttached) return;
      firstInteractionAttached = false;
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };

    void musicPlayer.tryPlay(false).then((started) => {
      if (!active || started) return;
      const current = musicPlayer.getState();
      if (!current.hasExplicitlyStopped && !current.isPlaying) {
        firstInteractionAttached = true;
        window.addEventListener('pointerdown', onFirstInteraction, { passive: true });
        window.addEventListener('keydown', onFirstInteraction, { passive: true });
      }
    });

    return () => {
      active = false;
      cleanupListeners();
      unsubscribe();
      musicPlayer.stop();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedSkyBackdrop theme={activeTheme} />
      <CelebrationOverlay active={celebrationMode} />
      <SparkleCursor enabled={sparkleCursorEnabled} />
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Top Navigation (3-Zone Contract) */}
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-[#1E1B4B] whitespace-nowrap shrink-0 sm:text-xl"
          >
            Photo Magic 2026
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#475569] md:flex">
            <a
              href="#studio"
              className="transition-colors hover:text-[#DB2777] whitespace-nowrap shrink-0"
            >
              Frame Studio
            </a>
            <a
              href="#wishes"
              className="transition-colors hover:text-[#7C3AED] whitespace-nowrap shrink-0"
            >
              Wishes & Gift
            </a>
            <a
              href="#greeting-card"
              className="transition-colors hover:text-[#DB2777] whitespace-nowrap shrink-0"
            >
              Greeting Card
            </a>
            <a
              href="#privacy"
              className="transition-colors hover:text-[#0284C7] whitespace-nowrap shrink-0"
            >
              Privacy
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToStudio}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#BE185D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] whitespace-nowrap shrink-0"
          >
            Create Your Photo
          </button>
        </div>
      </header>

      <main id="top">
        <HeroSection
          onStartCreate={scrollToStudio}
          onOpenCamera={() => {
            scrollToStudio();
            setIsCameraOpen(true);
          }}
          onExploreFrames={scrollToFrames}
        />

        {/* Compact Interactive Theme & Celebration Bar */}
        <section
          aria-label="Theme and celebration preferences"
          className="mx-auto max-w-6xl px-4 pb-2 sm:px-6 lg:px-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
            {/* 3 Pastel Color Themes */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#475569] mr-1">Pastel Theme:</span>
              {PASTEL_THEMES.map((theme) => {
                const active = theme.id === themeId;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    aria-pressed={active}
                    className={`inline-flex min-h-[36px] items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      active
                        ? 'border-[#1E1B4B] bg-white text-[#1E1B4B] shadow-xs'
                        : 'border-slate-200 bg-white/70 text-[#475569] hover:bg-white'
                    }`}
                  >
                    <span className="flex -space-x-1" aria-hidden="true">
                      {theme.swatchColors.map((hex) => (
                        <span
                          key={hex}
                          className="h-3.5 w-3.5 rounded-full border border-white"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </span>
                    {theme.name}
                  </button>
                );
              })}
            </div>

            {/* Celebration Mode, Sound FX, and Optional Desktop Sparkle Cursor */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleCelebration}
                aria-pressed={celebrationMode}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  celebrationMode
                    ? 'border-[#DB2777] bg-[#FCE7F3] text-[#BE185D] shadow-xs'
                    : 'border-slate-200 bg-white text-[#334155] hover:bg-[#FFF1F2]'
                }`}
              >
                <PartyPopper className="h-3.5 w-3.5" aria-hidden="true" />
                {celebrationMode ? 'Celebration On' : 'Celebration Mode'}
              </button>

              <button
                type="button"
                onClick={handleToggleSoundEffects}
                aria-pressed={soundEffectsEnabled}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  soundEffectsEnabled
                    ? 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]'
                    : 'border-slate-200 bg-white text-[#64748B]'
                }`}
              >
                {soundEffectsEnabled ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Sound FX On
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                    Sound FX Off
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSparkleCursorEnabled((v) => !v)}
                aria-pressed={sparkleCursorEnabled}
                className={`hidden md:inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  sparkleCursorEnabled
                    ? 'border-[#DDD6FE] bg-[#F3E8FF] text-[#6D28D9]'
                    : 'border-slate-200 bg-white text-[#475569] hover:bg-[#F5F3FF]'
                }`}
              >
                <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                {sparkleCursorEnabled ? 'Sparkle Cursor On' : 'Sparkle Cursor'}
              </button>
            </div>
          </div>
        </section>

        <PhotoFrameStudio
          externalCapturedDataUrl={capturedPhotoUrl}
          onClearExternalCapture={() => setCapturedPhotoUrl(null)}
          onOpenCamera={() => setIsCameraOpen(true)}
          onCelebrate={triggerConfetti}
          fileInputTriggerKey={fileInputTriggerKey}
        />

        <FunWishesSection
          onCelebrate={triggerConfetti}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />

        <GreetingCardCreator onCelebrate={triggerConfetti} />

        <PrivacySection />
      </main>

      <footer className="mt-8 border-t border-white/80 bg-white/75 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-[#64748B] sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 font-display text-base font-bold text-[#1E1B4B]">
              <Sparkles className="h-4 w-4 text-[#DB2777]" aria-hidden="true" />
              Happy Children’s Day – Photo Magic 2026
            </span>
            <p className="text-xs text-[#64748B]">
              Made with Love ❤️ · 100% browser-private keepsakes
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-[#475569]">
            <a href="#studio" className="hover:text-[#DB2777] whitespace-nowrap">
              Frame Studio
            </a>
            <a href="#wishes" className="hover:text-[#7C3AED] whitespace-nowrap">
              Surprise Wishes
            </a>
            <a href="#greeting-card" className="hover:text-[#DB2777] whitespace-nowrap">
              Greeting Card
            </a>
            <a href="#privacy" className="hover:text-[#0284C7] whitespace-nowrap">
              Privacy
            </a>
          </nav>
        </div>
      </footer>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setCapturedPhotoUrl(dataUrl);
          setIsCameraOpen(false);
          scrollToStudio();
          triggerConfetti();
        }}
        onFallbackUpload={() => {
          scrollToStudio();
          setFileInputTriggerKey((k) => k + 1);
        }}
      />

      <FloatingMusicPlayer />
    </div>
  );
}
