import { Download, Heart, Share2, Sparkles, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CHILDRENS_DAY_WISHES } from '../data/framesAndWishes';

interface GreetingCardCreatorProps {
  onCelebrate: () => void;
}

type CardStyleId = 'pastel-sky' | 'blossom-hearts' | 'sunshine-stars';

const CARD_STYLES: {
  id: CardStyleId;
  label: string;
  bgTop: string;
  bgBottom: string;
  accent: string;
  text: string;
}[] = [
  {
    id: 'pastel-sky',
    label: 'Sky & Balloons',
    bgTop: '#E0F2FE',
    bgBottom: '#FCE7F3',
    accent: '#0284C7',
    text: '#1E1B4B',
  },
  {
    id: 'blossom-hearts',
    label: 'Pink & Hearts',
    bgTop: '#FCE7F3',
    bgBottom: '#F3E8FF',
    accent: '#DB2777',
    text: '#4C1D95',
  },
  {
    id: 'sunshine-stars',
    label: 'Sunny & Stars',
    bgTop: '#FEF3C7',
    bgBottom: '#DCFCE7',
    accent: '#D97706',
    text: '#78350F',
  },
];

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 5);
}

export default function GreetingCardCreator({ onCelebrate }: GreetingCardCreatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recipientName, setRecipientName] = useState('Little Star');
  const [senderName, setSenderName] = useState('With Lots of Love');
  const [message, setMessage] = useState(
    'Wishing you a magical Children’s Day filled with bright rainbows, happy laughter, and big dreams!'
  );
  const [cardStyle, setCardStyle] = useState<CardStyleId>('pastel-sky');
  const [feedback, setFeedback] = useState<string | null>(null);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1200;
    const H = 800;
    canvas.width = W;
    canvas.height = H;

    const style = CARD_STYLES.find((s) => s.id === cardStyle) ?? CARD_STYLES[0];

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, style.bgTop);
    grad.addColorStop(1, style.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Soft white inner card panel
    ctx.save();
    ctx.shadowColor = 'rgba(30, 27, 75, 0.1)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.roundRect(64, 58, W - 128, H - 116, 44);
    ctx.fill();
    ctx.restore();

    // Dashed inner border
    ctx.save();
    ctx.strokeStyle = style.accent;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 4;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.roundRect(88, 82, W - 176, H - 164, 32);
    ctx.stroke();
    ctx.restore();

    // Decorative corner balloons / stars / hearts
    const drawMiniStar = (cx: number, cy: number, r: number, color: string) => {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? r : r * 0.45;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = cx + Math.cos(a) * rad;
        const py = cy + Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const drawMiniHeart = (cx: number, cy: number, size: number, color: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.35);
      ctx.bezierCurveTo(-size * 0.8, -size * 0.45, -size * 1.15, size * 0.4, 0, size * 1.05);
      ctx.bezierCurveTo(size * 1.15, size * 0.4, size * 0.8, -size * 0.45, 0, size * 0.35);
      ctx.fill();
      ctx.restore();
    };

    drawMiniStar(170, 165, 24, '#FBBF24');
    drawMiniStar(1030, 165, 24, '#F472B6');
    drawMiniHeart(170, 620, 20, '#F472B6');
    drawMiniHeart(1030, 620, 20, '#38BDF8');
    drawMiniStar(260, 650, 14, '#A78BFA');
    drawMiniStar(940, 150, 14, '#38BDF8');

    // Header
    ctx.fillStyle = style.accent;
    ctx.font = '700 28px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HAPPY CHILDREN’S DAY 2026', W / 2, 160);

    // Recipient Headline
    const toText = recipientName.trim() ? `Dear ${recipientName.trim()},` : 'Dear Little Star,';
    ctx.fillStyle = style.text;
    ctx.font = '700 58px "Fredoka", "DM Sans", sans-serif';
    ctx.fillText(toText, W / 2, 248);

    // Personal Message
    ctx.fillStyle = '#334155';
    ctx.font = '500 32px "DM Sans", sans-serif';
    const bodyText =
      message.trim() ||
      'Wishing you a joyful Children’s Day full of smiles, balloons, and wonderful dreams!';
    const lines = wrapCanvasText(ctx, bodyText, 840);
    const startY = 345;
    lines.forEach((line, idx) => {
      ctx.fillText(line, W / 2, startY + idx * 50);
    });

    // Sender signature
    const fromText = senderName.trim() ? `— ${senderName.trim()}` : '— With Love';
    ctx.fillStyle = style.accent;
    ctx.font = '700 34px "Fredoka", "DM Sans", sans-serif';
    ctx.fillText(fromText, W / 2, 625);

    // Bottom Watermark
    ctx.fillStyle = 'rgba(30, 27, 75, 0.55)';
    ctx.font = '600 20px "DM Sans", sans-serif';
    ctx.fillText('Made with Love ❤️ | Happy Children’s Day 2026', W / 2, 705);
  }, [recipientName, senderName, message, cardStyle]);

  useEffect(() => {
    drawCard();
    if (document.fonts && document.fonts.ready) {
      void document.fonts.ready.then(drawCard);
    }
  }, [drawCard]);

  const handleFillRandomWish = () => {
    const random = CHILDRENS_DAY_WISHES[Math.floor(Math.random() * CHILDRENS_DAY_WISHES.length)];
    setMessage(random.wish);
  };

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCard();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'childrens-day-2026-greeting-card.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 2500);
      setFeedback('Greeting card PNG downloaded!');
      onCelebrate();
    }, 'image/png', 1.0);
  };

  const handleNativeShareCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCard();
    const shareText = `Happy Children's Day 2026! Dear ${recipientName.trim() || 'Friend'}, ${message.trim()} — ${
      senderName.trim() || 'With Love'
    }`;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0)
      );
      if (blob && navigator.share) {
        const file = new File([blob], 'childrens-day-2026-card.png', { type: 'image/png' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Happy Children's Day 2026 Greeting Card",
            text: shareText,
            files: [file],
          });
          setFeedback('Greeting card shared!');
          return;
        }
        await navigator.share({
          title: "Happy Children's Day 2026 Greeting Card",
          text: shareText,
        });
        setFeedback('Greeting message shared!');
        return;
      }
      handleDownloadCard();
    } catch (err) {
      const error = err as DOMException;
      if (error?.name !== 'AbortError') {
        handleDownloadCard();
      }
    }
  };

  const whatsAppCardHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Happy Children's Day 2026! Dear ${recipientName.trim() || 'Friend'}, ${message.trim()} — ${
      senderName.trim() || 'With Love'
    }`
  )}`;

  return (
    <section id="greeting-card" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-xl shadow-[#FBCFE8]/25 backdrop-blur-sm sm:p-10">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#DB2777]">Digital Greeting Card Creator</p>
            <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-[#1E1B4B] sm:text-4xl">
              Make a Personalized Greeting Card
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
              Write a warm note with your child’s name and download or send a custom Children’s Day
              2026 card.
            </p>
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Card Form Controls */}
          <div className="space-y-4 lg:col-span-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                Card Pastel Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CARD_STYLES.map((s) => {
                  const active = cardStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCardStyle(s.id)}
                      aria-pressed={active}
                      className={`min-h-[42px] rounded-xl border px-2.5 py-2 text-xs font-bold transition-all ${
                        active
                          ? 'border-[#DB2777] bg-[#FFF1F2] text-[#9D174D] shadow-sm'
                          : 'border-slate-200 bg-white text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="card-recipient"
                  className="mb-1.5 block text-xs font-semibold text-[#475569]"
                >
                  To (Child’s Name)
                </label>
                <input
                  id="card-recipient"
                  type="text"
                  maxLength={24}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Aarav"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FBFF] px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:border-[#DB2777] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="card-sender"
                  className="mb-1.5 block text-xs font-semibold text-[#475569]"
                >
                  From (Your Name)
                </label>
                <input
                  id="card-sender"
                  type="text"
                  maxLength={26}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g., Mom & Dad"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FBFF] px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:border-[#DB2777] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="card-message" className="text-xs font-semibold text-[#475569]">
                  Personal Message
                </label>
                <button
                  type="button"
                  onClick={handleFillRandomWish}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C3AED] hover:underline"
                >
                  <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Fill Random Wish
                </button>
              </div>
              <textarea
                id="card-message"
                rows={3}
                maxLength={170}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a sweet Children's Day message..."
                className="w-full rounded-xl border border-slate-200 bg-[#F8FBFF] px-3.5 py-2.5 text-sm leading-relaxed text-[#1E1B4B] focus:border-[#DB2777] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadCard}
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#DB2777] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#DB2777]/20 transition-all hover:bg-[#BE185D] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Card PNG
              </button>

              <button
                type="button"
                onClick={() => void handleNativeShareCard()}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] px-4 py-2.5 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#E0F2FE] whitespace-nowrap shrink-0"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share
              </button>

              <a
                href={whatsAppCardHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#16A34A]/20 transition-all hover:bg-[#15803D] whitespace-nowrap shrink-0"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>

            {feedback && (
              <p
                role="status"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7]"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {feedback}
              </p>
            )}
          </div>

          {/* Live Greeting Card Preview */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-[#F8FBFF] p-3 shadow-md">
              <canvas
                ref={canvasRef}
                className="h-auto w-full rounded-xl"
                aria-label="Live personalized Happy Children's Day 2026 greeting card preview"
              />
            </div>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
              <Heart className="h-3.5 w-3.5 text-[#F472B6]" aria-hidden="true" />
              Updates live as you type · High-resolution PNG export
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
