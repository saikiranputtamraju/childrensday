import type { PastelThemeConfig } from '../types/photoMagic';

interface AnimatedSkyBackdropProps {
  theme: PastelThemeConfig;
}

export default function AnimatedSkyBackdrop({ theme }: AnimatedSkyBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b transition-colors duration-500 ${theme.bgGradientClass}`}
    >
      {/* Pastel Sky Washes */}
      <div className={`absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl transition-colors duration-500 ${theme.orb1Class}`} />
      <div className={`absolute top-1/4 -right-24 h-96 w-96 rounded-full blur-3xl transition-colors duration-500 ${theme.orb2Class}`} />
      <div className={`absolute bottom-10 left-1/4 h-80 w-80 rounded-full blur-3xl transition-colors duration-500 ${theme.orb3Class}`} />

      {/* Drifting Clouds */}
      <svg
        className="animate-drift-cloud absolute top-16 left-[5%] w-32 opacity-85 sm:w-44"
        viewBox="0 0 180 90"
        fill="none"
      >
        <path
          d="M42 74H142C157 74 169 62 169 47C169 33 158 22 145 21C139 9 127 1 112 1C95 1 80 12 76 28C72 25 67 24 62 24C46 24 33 36 32 51C20 53 11 62 11 72C11 73 25 74 42 74Z"
          fill="#FFFFFF"
        />
      </svg>

      <svg
        className="animate-drift-cloud absolute top-28 right-[6%] w-32 opacity-80 sm:w-40"
        style={{ animationDelay: '3s' }}
        viewBox="0 0 180 90"
        fill="none"
      >
        <path
          d="M42 74H142C157 74 169 62 169 47C169 33 158 22 145 21C139 9 127 1 112 1C95 1 80 12 76 28C72 25 67 24 62 24C46 24 33 36 32 51C20 53 11 62 11 72C11 73 25 74 42 74Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Floating Pastel Balloons */}
      <svg
        className="animate-float-slow absolute top-32 left-[2%] w-12 opacity-85 sm:w-16"
        viewBox="0 0 80 140"
        fill="none"
      >
        <ellipse cx="40" cy="44" rx="28" ry="34" fill="#F472B6" />
        <ellipse cx="30" cy="32" rx="7" ry="12" transform="rotate(-20 30 32)" fill="#FCE7F3" fillOpacity="0.65" />
        <path d="M36 78L44 78L40 73Z" fill="#F472B6" />
        <path d="M40 78C34 96 47 110 38 134" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg
        className="animate-float-delayed absolute top-48 right-[3%] w-12 opacity-85 sm:w-16"
        viewBox="0 0 80 140"
        fill="none"
      >
        <ellipse cx="40" cy="44" rx="28" ry="34" fill="#38BDF8" />
        <ellipse cx="30" cy="32" rx="7" ry="12" transform="rotate(-20 30 32)" fill="#E0F2FE" fillOpacity="0.7" />
        <path d="M36 78L44 78L40 73Z" fill="#38BDF8" />
        <path d="M40 78C46 96 33 112 42 134" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg
        className="animate-float-slow absolute top-[45%] left-[4%] hidden w-14 opacity-85 md:block"
        style={{ animationDelay: '2s' }}
        viewBox="0 0 80 140"
        fill="none"
      >
        <ellipse cx="40" cy="44" rx="26" ry="32" fill="#FBBF24" />
        <ellipse cx="30" cy="32" rx="6" ry="11" transform="rotate(-20 30 32)" fill="#FEF3C7" fillOpacity="0.7" />
        <path d="M40 76C35 95 45 110 39 132" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg
        className="animate-float-delayed absolute bottom-24 right-[5%] hidden w-14 opacity-85 md:block"
        style={{ animationDelay: '1s' }}
        viewBox="0 0 80 140"
        fill="none"
      >
        <ellipse cx="40" cy="44" rx="26" ry="32" fill="#34D399" />
        <ellipse cx="30" cy="32" rx="6" ry="11" transform="rotate(-20 30 32)" fill="#D1FAE5" fillOpacity="0.7" />
        <path d="M40 76C45 95 35 110 41 132" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Fluttering Butterflies */}
      <svg
        className="animate-butterfly absolute top-64 left-[12%] w-10 opacity-85 sm:w-12"
        viewBox="0 0 64 56"
        fill="none"
      >
        <g className="animate-wing">
          <ellipse cx="18" cy="20" rx="14" ry="11" transform="rotate(-20 18 20)" fill="#C084FC" />
          <ellipse cx="46" cy="20" rx="14" ry="11" transform="rotate(20 46 20)" fill="#C084FC" />
          <ellipse cx="20" cy="36" rx="10" ry="8" transform="rotate(15 20 36)" fill="#E9D5FF" />
          <ellipse cx="44" cy="36" rx="10" ry="8" transform="rotate(-15 44 36)" fill="#E9D5FF" />
        </g>
        <rect x="30" y="14" width="4" height="26" rx="2" fill="#4C1D95" />
      </svg>

      <svg
        className="animate-butterfly absolute bottom-32 right-[11%] w-10 opacity-85 sm:w-11"
        style={{ animationDelay: '2.5s' }}
        viewBox="0 0 64 56"
        fill="none"
      >
        <g className="animate-wing">
          <ellipse cx="18" cy="20" rx="14" ry="11" transform="rotate(-20 18 20)" fill="#F472B6" />
          <ellipse cx="46" cy="20" rx="14" ry="11" transform="rotate(20 46 20)" fill="#F472B6" />
          <ellipse cx="20" cy="36" rx="10" ry="8" transform="rotate(15 20 36)" fill="#FBCFE8" />
          <ellipse cx="44" cy="36" rx="10" ry="8" transform="rotate(-15 44 36)" fill="#FBCFE8" />
        </g>
        <rect x="30" y="14" width="4" height="26" rx="2" fill="#831843" />
      </svg>

      {/* Cute Floating Pastel Hearts */}
      <svg
        className="animate-float-slow absolute top-[22%] right-[14%] w-7 opacity-80 sm:w-8"
        style={{ animationDelay: '0.8s' }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 27.5C16 27.5 4.5 20.1 4.5 11.8C4.5 8.1 7.4 5.2 11 5.2C13.2 5.2 15.1 6.3 16 8C16.9 6.3 18.8 5.2 21 5.2C24.6 5.2 27.5 8.1 27.5 11.8C27.5 20.1 16 27.5 16 27.5Z"
          fill="#F472B6"
        />
      </svg>

      <svg
        className="animate-float-delayed absolute bottom-[28%] left-[12%] w-6 opacity-75 sm:w-7"
        style={{ animationDelay: '1.6s' }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 27.5C16 27.5 4.5 20.1 4.5 11.8C4.5 8.1 7.4 5.2 11 5.2C13.2 5.2 15.1 6.3 16 8C16.9 6.3 18.8 5.2 21 5.2C24.6 5.2 27.5 8.1 27.5 11.8C27.5 20.1 16 27.5 16 27.5Z"
          fill="#A78BFA"
        />
      </svg>

      <svg
        className="animate-float-slow absolute top-[62%] right-[8%] hidden w-6 opacity-75 md:block"
        style={{ animationDelay: '2.2s' }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 27.5C16 27.5 4.5 20.1 4.5 11.8C4.5 8.1 7.4 5.2 11 5.2C13.2 5.2 15.1 6.3 16 8C16.9 6.3 18.8 5.2 21 5.2C24.6 5.2 27.5 8.1 27.5 11.8C27.5 20.1 16 27.5 16 27.5Z"
          fill="#38BDF8"
        />
      </svg>

      {/* Twinkling Stars */}
      <svg className="animate-twinkle absolute top-24 left-[25%] w-7 opacity-90" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L19.8 11.2L29.5 12.2L22.1 18.6L24.3 28.2L16 23.1L7.7 28.2L9.9 18.6L2.5 12.2L12.2 11.2L16 2Z" fill="#FBBF24" />
      </svg>
      <svg
        className="animate-twinkle absolute top-40 right-[22%] w-6 opacity-85"
        style={{ animationDelay: '1.2s' }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path d="M16 2L19.8 11.2L29.5 12.2L22.1 18.6L24.3 28.2L16 23.1L7.7 28.2L9.9 18.6L2.5 12.2L12.2 11.2L16 2Z" fill="#A78BFA" />
      </svg>
      <svg
        className="animate-twinkle absolute bottom-44 right-[24%] w-6 opacity-80"
        style={{ animationDelay: '0.6s' }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path d="M16 2L19.8 11.2L29.5 12.2L22.1 18.6L24.3 28.2L16 23.1L7.7 28.2L9.9 18.6L2.5 12.2L12.2 11.2L16 2Z" fill="#38BDF8" />
      </svg>
      <svg
        className="animate-twinkle absolute bottom-24 left-[18%] w-5 opacity-80"
        style={{ animationDelay: '1.9s' }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path d="M16 2L19.8 11.2L29.5 12.2L22.1 18.6L24.3 28.2L16 23.1L7.7 28.2L9.9 18.6L2.5 12.2L12.2 11.2L16 2Z" fill="#F472B6" />
      </svg>

      {/* Playful Pastel Confetti Specks */}
      <div className="animate-float-slow absolute top-[18%] right-[15%] h-3 w-3 rotate-12 rounded-sm bg-[#F472B6]/65" />
      <div className="animate-float-delayed absolute top-[58%] left-[9%] h-3 w-3 rounded-full bg-[#38BDF8]/65" />
      <div className="animate-float-slow absolute bottom-[22%] right-[6%] h-2.5 w-4 -rotate-12 rounded-sm bg-[#FBBF24]/70" />
      <div className="animate-float-delayed absolute top-[35%] left-[48%] h-2.5 w-2.5 rotate-45 rounded-xs bg-[#A78BFA]/60" />
    </div>
  );
}
