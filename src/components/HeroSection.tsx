import { Camera, ImagePlus, LayoutGrid, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onStartCreate: () => void;
  onOpenCamera: () => void;
  onExploreFrames: () => void;
}

export default function HeroSection({
  onStartCreate,
  onOpenCamera,
  onExploreFrames,
}: HeroSectionProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-14 lg:pb-16">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Copy & Prominent Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:col-span-6 lg:text-left"
        >
          <p className="mb-3 text-sm font-semibold tracking-wide text-[#7E22CE]">
            Photo Magic Studio · Happy Children’s Day 2026
          </p>

          <h1
            className="font-display text-4xl font-bold tracking-tight text-[#1E1B4B] sm:text-5xl lg:text-6xl"
            style={{ textWrap: 'balance', lineHeight: 1.08 }}
          >
            Celebrate Every Smile on{' '}
            <span className="bg-gradient-to-r from-[#0284C7] via-[#DB2777] to-[#7C3AED] bg-clip-text text-transparent">
              Children’s Day 2026
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#334155] sm:text-lg lg:mx-0">
            Welcome to a magical corner of balloons, butterflies, and bright rainbows! Upload a
            favorite photo or snap one with your camera, add your child’s name, and download a
            ready-to-share keepsake in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <button
              type="button"
              onClick={onStartCreate}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#DB2777] to-[#9333EA] px-6 py-3 text-base font-bold text-white shadow-lg shadow-[#DB2777]/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] active:scale-[0.98] sm:w-auto whitespace-nowrap shrink-0"
            >
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              Create Your Photo
            </button>

            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-[#7DD3FC] bg-white px-5 py-3 text-base font-bold text-[#0369A1] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E0F2FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] active:scale-[0.98] sm:w-auto whitespace-nowrap shrink-0"
            >
              <Camera className="h-5 w-5" aria-hidden="true" />
              Take a Photo
            </button>

            <button
              type="button"
              onClick={onExploreFrames}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-5 py-3 text-sm font-bold text-[#6D28D9] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EDE9FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] active:scale-[0.98] sm:w-auto whitespace-nowrap shrink-0"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Explore Frames
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-[#475569] lg:justify-start">
            <span>10 Unique Pastel Frames</span>
            <span aria-hidden="true">·</span>
            <span>No Login Needed</span>
            <span aria-hidden="true">·</span>
            <span>HD PNG & WhatsApp Share</span>
          </div>
        </motion.div>

        {/* Right Cute Cartoon Storybook Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <div className="relative mx-auto max-w-lg rounded-3xl border border-white/95 bg-gradient-to-br from-white/90 via-[#FFF8FC]/90 to-[#F0F9FF]/90 p-5 shadow-xl shadow-[#7DD3FC]/25 backdrop-blur-sm sm:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#BAE6FD] via-[#FCE7F3]/50 to-[#FEF3C7] p-4 sm:p-6">
              <svg
                viewBox="0 0 520 380"
                className="h-auto w-full"
                role="img"
                aria-label="Playful Children's Day cartoon scene with smiling sun, rainbow, pastel balloons, butterfly, confetti, and cute storybook friends"
              >
                {/* Rainbow Arc */}
                <path d="M70 250 A190 190 0 0 1 450 250" stroke="#FDA4AF" strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M88 250 A172 172 0 0 1 432 250" stroke="#FDBA74" strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M106 250 A154 154 0 0 1 414 250" stroke="#FDE047" strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M124 250 A136 136 0 0 1 396 250" stroke="#86EFAC" strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M142 250 A118 118 0 0 1 378 250" stroke="#7DD3FC" strokeWidth="18" strokeLinecap="round" fill="none" />

                {/* Smiling Cartoon Sun */}
                <g transform="translate(92 84)">
                  <circle cx="0" cy="0" r="34" fill="#FBBF24" />
                  <circle cx="-12" cy="-5" r="3.5" fill="#1E1B4B" />
                  <circle cx="12" cy="-5" r="3.5" fill="#1E1B4B" />
                  <circle cx="-18" cy="5" r="5" fill="#F472B6" fillOpacity="0.5" />
                  <circle cx="18" cy="5" r="5" fill="#F472B6" fillOpacity="0.5" />
                  <path d="M-9 5 Q0 14 9 5" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>

                {/* Fluffy Clouds */}
                <g fill="#FFFFFF">
                  <circle cx="90" cy="248" r="28" />
                  <circle cx="122" cy="236" r="34" />
                  <circle cx="155" cy="248" r="26" />
                  <circle cx="368" cy="248" r="26" />
                  <circle cx="400" cy="236" r="34" />
                  <circle cx="432" cy="248" r="28" />
                </g>

                {/* Cute Framed Photo Card Mockup in Center */}
                <g transform="translate(185 112)">
                  <rect x="0" y="0" width="150" height="176" rx="22" fill="#FFFFFF" stroke="#F9A8D4" strokeWidth="5" />
                  <rect x="14" y="14" width="122" height="114" rx="14" fill="#FCE7F3" />
                  <circle cx="75" cy="72" r="34" fill="#F59E0B" />
                  <circle cx="48" cy="46" r="13" fill="#D97706" />
                  <circle cx="102" cy="46" r="13" fill="#D97706" />
                  <circle cx="75" cy="80" r="17" fill="#FEF3C7" />
                  <circle cx="63" cy="65" r="4" fill="#1E1B4B" />
                  <circle cx="87" cy="65" r="4" fill="#1E1B4B" />
                  <ellipse cx="75" cy="76" rx="5" ry="3.5" fill="#78350F" />
                  <path d="M68 83 Q75 90 82 83" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <text
                    x="75"
                    y="153"
                    textAnchor="middle"
                    fill="#9D174D"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Fredoka, sans-serif"
                  >
                    Children’s Day
                  </text>
                </g>

                {/* Pastel Balloons */}
                <g className="animate-float-slow">
                  <ellipse cx="428" cy="96" rx="24" ry="30" fill="#F472B6" />
                  <path d="M428 126 Q422 150 432 175" stroke="#94A3B8" strokeWidth="2" fill="none" />
                </g>
                <g className="animate-float-delayed">
                  <ellipse cx="465" cy="126" rx="21" ry="26" fill="#A78BFA" />
                  <path d="M465 152 Q470 176 460 198" stroke="#94A3B8" strokeWidth="2" fill="none" />
                </g>
                <g className="animate-float-slow" style={{ animationDelay: '1s' }}>
                  <ellipse cx="52" cy="175" rx="18" ry="23" fill="#38BDF8" />
                  <path d="M52 198 Q48 218 55 236" stroke="#94A3B8" strokeWidth="2" fill="none" />
                </g>

                {/* Animated Butterfly inside hero */}
                <g className="animate-butterfly" transform="translate(150 96)">
                  <ellipse cx="-10" cy="0" rx="10" ry="8" transform="rotate(-20 -10 0)" fill="#C084FC" />
                  <ellipse cx="10" cy="0" rx="10" ry="8" transform="rotate(20 10 0)" fill="#C084FC" />
                  <rect x="-2" y="-7" width="4" height="16" rx="2" fill="#4C1D95" />
                </g>

                {/* Rolling Mint Meadow */}
                <path d="M0 325 Q130 280 260 320 T520 315 L520 380 L0 380 Z" fill="#BBF7D0" />
                <path d="M0 345 Q180 308 350 345 T520 336 L520 380 L0 380 Z" fill="#86EFAC" />

                {/* Cute Peeking Bunny */}
                <g transform="translate(88 320)">
                  <ellipse cx="-14" cy="-34" rx="8" ry="22" transform="rotate(-12 -14 -34)" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
                  <ellipse cx="14" cy="-34" rx="8" ry="22" transform="rotate(12 14 -34)" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
                  <ellipse cx="0" cy="0" rx="28" ry="22" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
                  <circle cx="-9" cy="-3" r="3" fill="#1E1B4B" />
                  <circle cx="9" cy="-3" r="3" fill="#1E1B4B" />
                  <ellipse cx="0" cy="3" rx="3.5" ry="2.5" fill="#F472B6" />
                </g>

                {/* Twinkling Stars & Confetti */}
                <path d="M350 56 L354 66 L364 68 L356 75 L358 85 L350 80 L342 85 L344 75 L336 68 L346 66 Z" fill="#FBBF24" />
                <path d="M150 52 L153 59 L160 60 L155 65 L156 72 L150 68 L144 72 L145 65 L140 60 L147 59 Z" fill="#A78BFA" />
                <rect x="260" y="54" width="10" height="6" rx="2" transform="rotate(20 260 54)" fill="#F472B6" />
                <circle cx="388" cy="188" r="5" fill="#38BDF8" />
                <rect x="448" y="294" width="9" height="5" rx="2" transform="rotate(-18 448 294)" fill="#FBBF24" />
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 px-1 text-sm text-[#475569]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1E1B4B]">
                <Sparkles className="h-4 w-4 text-[#DB2777]" aria-hidden="true" />
                Instant Browser Photo Magic
              </span>
              <span className="text-xs font-medium text-[#64748B]">
                10 Pastel Frames · Ready in Seconds
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
