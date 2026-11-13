import { Check, Copy, Gift, Music, Share2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CHILDRENS_DAY_WISHES } from '../data/framesAndWishes';
import { soundEffects } from '../utils/soundEffects';

interface FunWishesSectionProps {
  onCelebrate: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function FunWishesSection({
  onCelebrate,
  isMusicPlaying,
  onToggleMusic,
}: FunWishesSectionProps) {
  const [wishIndex, setWishIndex] = useState(0);
  const [copiedWish, setCopiedWish] = useState(false);
  const [giftOpenCount, setGiftOpenCount] = useState(0);
  const [isLidOpen, setIsLidOpen] = useState(false);

  const current = CHILDRENS_DAY_WISHES[wishIndex];

  const triggerSurpriseWish = () => {
    let next = Math.floor(Math.random() * CHILDRENS_DAY_WISHES.length);
    if (next === wishIndex && CHILDRENS_DAY_WISHES.length > 1) {
      next = (wishIndex + 1) % CHILDRENS_DAY_WISHES.length;
    }
    setWishIndex(next);
    setCopiedWish(false);
    setIsLidOpen(true);
    setGiftOpenCount((c) => c + 1);
    soundEffects.playCelebrationChime();
    onCelebrate();

    window.setTimeout(() => {
      setIsLidOpen(false);
    }, 1100);
  };

  const handleCopyWish = async () => {
    const text = `${current.wish}\n\n"${current.quote}" — ${current.author}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWish(true);
      window.setTimeout(() => setCopiedWish(false), 2200);
    } catch {
      // Fallback ignored gracefully
    }
  };

  const whatsAppWishHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Happy Children's Day 2026! ${current.wish} "${current.quote}"`
  )}`;

  return (
    <section id="wishes" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-xl shadow-[#DDD6FE]/25 backdrop-blur-sm sm:p-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#7C3AED]">Fun & Joyful Notes</p>
            <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-[#1E1B4B] sm:text-4xl">
              Surprise Gift Box & Wishes
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-music-control="true"
              onClick={onToggleMusic}
              aria-pressed={isMusicPlaying}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isMusicPlaying
                  ? 'border-[#7C3AED] bg-[#F3E8FF] text-[#6D28D9]'
                  : 'border-slate-200 bg-white text-[#475569] hover:bg-slate-50'
              }`}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Mute Music
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                  Play Cheerful Music
                </>
              )}
            </button>

            <button
              type="button"
              onClick={triggerSurpriseWish}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#7C3AED] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#7C3AED]/25 transition-all hover:bg-[#6D28D9] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Surprise Me!
            </button>
          </div>
        </div>

        {/* Gift Box + Wish Display Grid */}
        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          {/* Interactive Animated Surprise Gift Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#FBCFE8] bg-gradient-to-b from-[#FFF1F2] via-[#FDF4FF] to-[#FEF9C3]/60 p-6 text-center lg:col-span-4">
            <button
              type="button"
              onClick={triggerSurpriseWish}
              aria-label="Tap the Surprise Gift Box to reveal a Children's Day wish"
              className="group relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DB2777]"
            >
              {/* Popping stars when gift opens */}
              <AnimatePresence>
                {isLidOpen && (
                  <motion.div
                    key={giftOpenCount}
                    initial={{ opacity: 0, y: 12, scale: 0.6 }}
                    animate={{ opacity: 1, y: -24, scale: 1.1 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none absolute -top-4 flex gap-3"
                    aria-hidden="true"
                  >
                    <span className="h-3 w-3 rotate-12 rounded-xs bg-[#FBBF24]" />
                    <span className="h-3.5 w-3.5 rounded-full bg-[#38BDF8]" />
                    <span className="h-3 w-3 -rotate-12 rounded-xs bg-[#DB2777]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                animate={
                  isLidOpen
                    ? { scale: [1, 1.08, 0.96, 1], rotate: [0, -3, 3, 0] }
                    : { y: [0, -5, 0] }
                }
                transition={
                  isLidOpen
                    ? { duration: 0.45 }
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                }
                className="w-36"
              >
                <svg viewBox="0 0 160 150" className="h-auto w-full drop-shadow-md" aria-hidden="true">
                  {/* Box Base */}
                  <rect x="26" y="64" width="108" height="74" rx="14" fill="#F472B6" />
                  <rect x="70" y="64" width="20" height="74" fill="#FBBF24" />
                  <rect x="26" y="64" width="108" height="10" fill="#DB2777" fillOpacity="0.2" />

                  {/* Animated Gift Lid */}
                  <motion.g
                    animate={
                      isLidOpen
                        ? { y: -22, rotate: -10 }
                        : { y: 0, rotate: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    style={{ originX: '80px', originY: '56px' }}
                  >
                    <rect x="18" y="42" width="124" height="24" rx="10" fill="#EC4899" />
                    <rect x="70" y="42" width="20" height="24" fill="#FBBF24" />
                    {/* Ribbon Bow */}
                    <ellipse cx="64" cy="34" rx="16" ry="11" transform="rotate(-20 64 34)" fill="#FCD34D" />
                    <ellipse cx="96" cy="34" rx="16" ry="11" transform="rotate(20 96 34)" fill="#FCD34D" />
                    <circle cx="80" cy="38" r="8" fill="#F59E0B" />
                  </motion.g>
                </svg>
              </motion.div>

              <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#DB2777] shadow-sm transition-transform group-hover:scale-105">
                <Gift className="h-4 w-4" aria-hidden="true" />
                {giftOpenCount === 0 ? 'Tap Gift Box!' : 'Open Another Wish'}
              </span>
            </button>

            <p className="mt-3 text-xs text-[#64748B]">
              Tap the gift box for a confetti pop and a joyful Children’s Day wish.
            </p>
          </div>

          {/* Wish & Quote Display + Share Actions */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-1 flex-col justify-between rounded-2xl p-6 sm:p-7"
                style={{ backgroundColor: current.themeColor }}
              >
                <div>
                  <p className="text-xs font-bold tracking-wide text-[#4C1D95]">
                    Warm Wish · Card {wishIndex + 1} of {CHILDRENS_DAY_WISHES.length}
                  </p>
                  <p className="font-display mt-3 text-xl font-bold leading-snug text-[#1E1B4B] sm:text-2xl">
                    {current.wish}
                  </p>
                  {giftOpenCount > 0 && (
                    <div className="mt-4 rounded-xl border border-white/80 bg-white/75 px-3.5 py-2.5 text-sm font-semibold text-[#7C3AED]">
                      {current.surpriseMessage}
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-white/70 pt-4">
                  <blockquote className="text-base italic leading-relaxed text-[#334155]">
                    “{current.quote}”
                  </blockquote>
                  <p className="mt-2 text-xs font-semibold text-[#64748B]">— {current.author}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-[#F8FBFF] px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Music className="h-4 w-4 text-[#7C3AED]" aria-hidden="true" />
                <span>
                  {isMusicPlaying
                    ? 'Music-box melody playing gently'
                    : 'Music muted — tap Play anytime'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void handleCopyWish()}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#1E1B4B] transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  {copiedWish ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy Wish
                    </>
                  )}
                </button>

                <a
                  href={whatsAppWishHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#16A34A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#15803D] whitespace-nowrap shrink-0"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Send on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
