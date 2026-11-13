import type { FrameId, PhotoTransform } from '../types/photoMagic';

export const CANVAS_W = 1200;
export const CANVAS_H = 1440;

interface ApertureBox {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  tiltDeg?: number;
  archTop?: boolean;
}

const APERTURES: Record<FrameId, ApertureBox> = {
  'sky-rainbow': { x: 120, y: 215, w: 960, h: 935, radius: 52 },
  'starlight-butterfly': { x: 130, y: 225, w: 940, h: 925, radius: 70, archTop: true },
  'balloon-carnival': { x: 145, y: 205, w: 910, h: 905, radius: 36, tiltDeg: -1.6 },
  'sunny-meadow': { x: 140, y: 215, w: 920, h: 915, radius: 110 },
  'golden-superstar': { x: 125, y: 215, w: 950, h: 925, radius: 48 },
  'rainbow-kids': { x: 125, y: 220, w: 950, h: 920, radius: 56 },
  'superhero': { x: 130, y: 215, w: 940, h: 925, radius: 40 },
  'superstar': { x: 130, y: 225, w: 940, h: 915, radius: 64, archTop: true },
  'balloon-party': { x: 130, y: 220, w: 940, h: 920, radius: 48 },
  'school-memories': { x: 135, y: 215, w: 930, h: 920, radius: 32 },
};

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawArchPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bottomRadius: number
) {
  const archR = w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + archR * 0.65);
  ctx.arc(x + w / 2, y + archR * 0.65, w / 2, Math.PI, 0, false);
  ctx.lineTo(x + w, y + h - bottomRadius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRadius, y + h);
  ctx.lineTo(x + bottomRadius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bottomRadius);
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number,
  fill: string,
  stroke?: string,
  rotation = -Math.PI / 2
) {
  ctx.save();
  ctx.beginPath();
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = rotation + i * step;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  fill = '#FFFFFF',
  shadowColor = 'rgba(148, 163, 184, 0.18)'
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = shadowColor;
  ctx.beginPath();
  ctx.arc(-52, 16, 38, 0, Math.PI * 2);
  ctx.arc(0, 4, 52, 0, Math.PI * 2);
  ctx.arc(54, 16, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(-52, 10, 38, 0, Math.PI * 2);
  ctx.arc(-14, -14, 46, 0, Math.PI * 2);
  ctx.arc(32, -8, 42, 0, Math.PI * 2);
  ctx.arc(58, 12, 34, 0, Math.PI * 2);
  ctx.roundRect(-72, 10, 148, 38, 19);
  ctx.fill();
  ctx.restore();
}

function drawBalloon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
  highlight: string,
  tiltDeg = 0,
  stringLen = 110
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tiltDeg * Math.PI) / 180);

  ctx.beginPath();
  ctx.moveTo(0, ry + 6);
  ctx.bezierCurveTo(-12, ry + stringLen * 0.35, 14, ry + stringLen * 0.7, -4, ry + stringLen);
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.55)';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-7, ry + 7);
  ctx.lineTo(7, ry + 7);
  ctx.lineTo(0, ry - 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(-rx * 0.34, -ry * 0.28, rx * 0.22, ry * 0.34, -0.35, 0, Math.PI * 2);
  ctx.fillStyle = highlight;
  ctx.fill();

  ctx.restore();
}

function drawButterfly(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  wingColor: string,
  innerColor: string,
  tiltDeg = 0
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.scale(scale, scale);

  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.scale(dir, 1);
    ctx.beginPath();
    ctx.ellipse(22, -12, 24, 18, -0.35, 0, Math.PI * 2);
    ctx.fillStyle = wingColor;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, -12, 11, 8, -0.35, 0, Math.PI * 2);
    ctx.fillStyle = innerColor;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(16, 14, 16, 13, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = wingColor;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, 14, 7, 5, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = innerColor;
    ctx.fill();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.roundRect(-4, -18, 8, 36, 4);
  ctx.fillStyle = '#4C1D95';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-2, -18);
  ctx.quadraticCurveTo(-10, -30, -16, -28);
  ctx.moveTo(2, -18);
  ctx.quadraticCurveTo(10, -30, 16, -28);
  ctx.strokeStyle = '#4C1D95';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

function drawDaisy(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  petalColor = '#FFFFFF',
  centerColor = '#FBBF24'
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.beginPath();
    ctx.ellipse(0, -20, 8, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = petalColor;
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fillStyle = centerColor;
  ctx.fill();
  ctx.restore();
}

function drawSmilingSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.translate(cx, cy);

  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 6);
    ctx.beginPath();
    ctx.roundRect(-6, -r - 24, 12, 18, 6);
    ctx.fillStyle = '#FCD34D';
    ctx.fill();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#FBBF24';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FEF3C7';
  ctx.stroke();

  ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
  ctx.beginPath();
  ctx.arc(-r * 0.42, r * 0.14, r * 0.14, 0, Math.PI * 2);
  ctx.arc(r * 0.42, r * 0.14, r * 0.14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1E1B4B';
  ctx.beginPath();
  ctx.arc(-r * 0.28, -r * 0.12, r * 0.09, 0, Math.PI * 2);
  ctx.arc(r * 0.28, -r * 0.12, r * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, r * 0.05, r * 0.28, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = '#1E1B4B';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

function drawCuteBunnyPeek(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.translate(dir * 26, -54);
    ctx.rotate(dir * 0.18);
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 38, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FBCFE8';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 2, 7, 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#F9A8D4';
    ctx.fill();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.ellipse(0, 0, 52, 42, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FBCFE8';
  ctx.stroke();

  ctx.fillStyle = '#FBCFE8';
  ctx.beginPath();
  ctx.arc(-26, 8, 9, 0, Math.PI * 2);
  ctx.arc(26, 8, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1E1B4B';
  ctx.beginPath();
  ctx.arc(-16, -4, 4.5, 0, Math.PI * 2);
  ctx.arc(16, -4, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F472B6';
  ctx.beginPath();
  ctx.ellipse(0, 4, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-5, 9, 5, 0, Math.PI);
  ctx.arc(5, 9, 5, 0, Math.PI);
  ctx.strokeStyle = '#1E1B4B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.restore();
}

function drawLightningBolt(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, fill: string, tiltDeg = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(8, -38);
  ctx.lineTo(-22, 6);
  ctx.lineTo(-2, 6);
  ctx.lineTo(-10, 38);
  ctx.lineTo(24, -6);
  ctx.lineTo(4, -6);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.restore();
}

function drawCrown(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(-48, 26);
  ctx.lineTo(-56, -18);
  ctx.lineTo(-22, 4);
  ctx.lineTo(0, -32);
  ctx.lineTo(22, 4);
  ctx.lineTo(56, -18);
  ctx.lineTo(48, 26);
  ctx.closePath();
  ctx.fillStyle = '#FBBF24';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  for (const [gx, gy, col] of [
    [-24, 12, '#EC4899'],
    [0, 10, '#38BDF8'],
    [24, 12, '#A78BFA'],
  ] as const) {
    ctx.beginPath();
    ctx.arc(gx, gy, 6, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  }
  ctx.restore();
}

function drawMusicNote(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string, tilt = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tilt * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(-8, 16, 12, 9, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(0, -24, 6, 40);
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.quadraticCurveTo(22, -20, 18, -2);
  ctx.quadraticCurveTo(12, -10, 0, -12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCrayon(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string, tipColor: string, tiltDeg: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.beginPath();
  ctx.roundRect(-14, -40, 28, 90, 6);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = '#1E1B4B';
  ctx.fillRect(-14, -22, 28, 6);
  ctx.fillRect(-14, 24, 28, 6);
  ctx.beginPath();
  ctx.moveTo(-12, -40);
  ctx.lineTo(12, -40);
  ctx.lineTo(0, -64);
  ctx.closePath();
  ctx.fillStyle = tipColor;
  ctx.fill();
  ctx.restore();
}

function drawPaperPlane(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tiltDeg: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(-40, 10);
  ctx.lineTo(44, -14);
  ctx.lineTo(-10, 32);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-14, 16);
  ctx.lineTo(44, -14);
  ctx.lineTo(-24, -6);
  ctx.closePath();
  ctx.fillStyle = '#E0F2FE';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawConfettiDots(ctx: CanvasRenderingContext2D, colors: string[], seedOffset = 0) {
  const positions = [
    [95, 130, 9],
    [220, 75, 7],
    [980, 95, 8],
    [1105, 165, 10],
    [65, 520, 8],
    [1135, 480, 9],
    [70, 840, 10],
    [1130, 890, 8],
    [110, 1265, 9],
    [1095, 1255, 9],
    [340, 1345, 7],
    [860, 1345, 7],
  ];
  positions.forEach(([x, y, r], idx) => {
    ctx.save();
    ctx.fillStyle = colors[(idx + seedOffset) % colors.length];
    if (idx % 3 === 0) {
      ctx.translate(x, y);
      ctx.rotate(idx * 0.5);
      ctx.fillRect(-r, -r * 0.5, r * 2, r);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawRibbonBanner(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  bgColor: string,
  foldColor: string,
  textColor: string,
  mainText: string,
  subText: string
) {
  ctx.save();
  const x = centerX - width / 2;
  const y = centerY - height / 2;

  ctx.fillStyle = foldColor;
  ctx.beginPath();
  ctx.moveTo(x - 42, y + 18);
  ctx.lineTo(x + 20, y + 18);
  ctx.lineTo(x + 20, y + height + 12);
  ctx.lineTo(x - 42, y + height + 12);
  ctx.lineTo(x - 20, y + height / 2 + 15);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + width + 42, y + 18);
  ctx.lineTo(x + width - 20, y + 18);
  ctx.lineTo(x + width - 20, y + height + 12);
  ctx.lineTo(x + width + 42, y + height + 12);
  ctx.lineTo(x + width + 20, y + height / 2 + 15);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = 'rgba(30, 27, 75, 0.14)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  drawRoundedRectPath(ctx, x, y, width, height, 28);
  ctx.fillStyle = bgColor;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 48px "Fredoka", "DM Sans", sans-serif';
  ctx.fillText(mainText, centerX, subText ? centerY - 19 : centerY);

  if (subText) {
    ctx.font = '700 28px "DM Sans", sans-serif';
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.92;
    ctx.fillText(subText, centerX, centerY + 28);
  }
  ctx.restore();
}

function drawFooterWatermark(ctx: CanvasRenderingContext2D, darkText = true) {
  ctx.save();
  ctx.font = '600 22px "DM Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = darkText ? 'rgba(30, 27, 75, 0.62)' : 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('Made with Love ❤️ | Happy Children’s Day 2026', CANVAS_W / 2, CANVAS_H - 42);
  ctx.restore();
}

export function renderFramedPhoto(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement | null,
  frameId: FrameId,
  transform: PhotoTransform,
  customName: string,
  customGreeting = ''
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const aperture = APERTURES[frameId];
  const cleanName = customName.trim();
  const cleanGreeting = customGreeting.trim();
  const bannerSubText =
    cleanName && cleanGreeting
      ? `${cleanName} · ${cleanGreeting}`
      : cleanName
        ? `Celebrating ${cleanName} · 2026`
        : cleanGreeting
          ? cleanGreeting
          : 'Joy, Wonder & Big Dreams · 2026';

  // 1. Frame Background Layer
  if (frameId === 'sky-rainbow') {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#BAE6FD');
    grad.addColorStop(0.45, '#E0F2FE');
    grad.addColorStop(1, '#FEF9C3');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const rainbowColors = ['#FDA4AF', '#FDBA74', '#FDE047', '#86EFAC', '#7DD3FC', '#C4B5FD'];
    rainbowColors.forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(CANVAS_W / 2, 340, 480 - i * 24, Math.PI, 0);
      ctx.strokeStyle = col;
      ctx.lineWidth = 22;
      ctx.stroke();
    });
  } else if (frameId === 'starlight-butterfly') {
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    grad.addColorStop(0, '#EDE9FE');
    grad.addColorStop(0.5, '#FCE7F3');
    grad.addColorStop(1, '#E0E7FF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  } else if (frameId === 'balloon-carnival') {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#FCE7F3');
    grad.addColorStop(0.5, '#FFFBEB');
    grad.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = 'rgba(244, 114, 182, 0.14)';
    for (let gx = 60; gx < CANVAS_W; gx += 120) {
      for (let gy = 60; gy < CANVAS_H; gy += 120) {
        ctx.beginPath();
        ctx.arc(gx + (gy % 240 === 60 ? 0 : 40), gy, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (frameId === 'sunny-meadow') {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#E0F2FE');
    grad.addColorStop(0.6, '#FEF3C7');
    grad.addColorStop(1, '#DCFCE7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = '#BBF7D0';
    ctx.beginPath();
    ctx.ellipse(320, 1370, 560, 220, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#86EFAC';
    ctx.beginPath();
    ctx.ellipse(900, 1410, 620, 220, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (frameId === 'golden-superstar') {
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    grad.addColorStop(0, '#EEF2FF');
    grad.addColorStop(0.5, '#F5F3FF');
    grad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  } else if (frameId === 'rainbow-kids') {
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    grad.addColorStop(0, '#D1FAE5');
    grad.addColorStop(0.45, '#E0F2FE');
    grad.addColorStop(1, '#FCE7F3');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Colorful pastel stripes at top
    const cols = ['#FB7185', '#FBBF24', '#34D399', '#38BDF8', '#A78BFA'];
    cols.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.28;
      ctx.fillRect(0, i * 36, CANVAS_W, 36);
    });
    ctx.globalAlpha = 1;
  } else if (frameId === 'superhero') {
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    grad.addColorStop(0, '#DBEAFE');
    grad.addColorStop(0.5, '#FEF3C7');
    grad.addColorStop(1, '#FEE2E2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle comic sunburst rays
    ctx.save();
    ctx.translate(CANVAS_W / 2, 650);
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-65, -900);
      ctx.lineTo(65, -900);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(56,189,248,0.08)';
      ctx.fill();
    }
    ctx.restore();
  } else if (frameId === 'superstar') {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#FAE8FF');
    grad.addColorStop(0.5, '#FDF2F8');
    grad.addColorStop(1, '#EDE9FE');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Soft spotlight beams
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(540, 1200);
    ctx.lineTo(20, 1200);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(1020, 0);
    ctx.lineTo(1180, 1200);
    ctx.lineTo(660, 1200);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (frameId === 'balloon-party') {
    const grad = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    grad.addColorStop(0, '#E0F2FE');
    grad.addColorStop(0.5, '#FCE7F3');
    grad.addColorStop(1, '#FEF9C3');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  } else {
    // school-memories
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Notebook horizontal lines
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
    ctx.lineWidth = 2.5;
    for (let y = 90; y < CANVAS_H; y += 54) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }
    // Notebook vertical pink margin line
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(86, 0);
    ctx.lineTo(86, CANVAS_H);
    ctx.stroke();
  }

  // Outer pastel border frame
  drawRoundedRectPath(ctx, 28, 28, CANVAS_W - 56, CANVAS_H - 56, 56);
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.stroke();

  // 2. Photo Window + Clipped User Image
  ctx.save();
  if (aperture.tiltDeg) {
    const cx = aperture.x + aperture.w / 2;
    const cy = aperture.y + aperture.h / 2;
    ctx.translate(cx, cy);
    ctx.rotate((aperture.tiltDeg * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  if (frameId === 'balloon-carnival') {
    ctx.save();
    ctx.shadowColor = 'rgba(30, 27, 75, 0.12)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 12;
    drawRoundedRectPath(ctx, aperture.x - 28, aperture.y - 28, aperture.w + 56, aperture.h + 110, 42);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.shadowColor = 'rgba(30, 27, 75, 0.14)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;
  if (aperture.archTop) {
    drawArchPath(ctx, aperture.x, aperture.y, aperture.w, aperture.h, aperture.radius);
  } else {
    drawRoundedRectPath(ctx, aperture.x, aperture.y, aperture.w, aperture.h, aperture.radius);
  }
  ctx.fillStyle = '#F1F5F9';
  ctx.fill();
  ctx.restore();

  ctx.save();
  if (aperture.archTop) {
    drawArchPath(ctx, aperture.x, aperture.y, aperture.w, aperture.h, aperture.radius);
  } else {
    drawRoundedRectPath(ctx, aperture.x, aperture.y, aperture.w, aperture.h, aperture.radius);
  }
  ctx.clip();

  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(aperture.x, aperture.y, aperture.w, aperture.h);

  if (image && image.width > 0 && image.height > 0) {
    const rad = (transform.rotation * Math.PI) / 180;
    const effW = Math.abs(Math.cos(rad)) * image.width + Math.abs(Math.sin(rad)) * image.height;
    const effH = Math.abs(Math.sin(rad)) * image.width + Math.abs(Math.cos(rad)) * image.height;
    const baseScale = Math.max(aperture.w / effW, aperture.h / effH);
    const scale = baseScale * transform.zoom;

    ctx.save();
    ctx.translate(
      aperture.x + aperture.w / 2 + transform.offsetX,
      aperture.y + aperture.h / 2 + transform.offsetY
    );
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
  }
  ctx.restore();

  if (aperture.archTop) {
    drawArchPath(ctx, aperture.x, aperture.y, aperture.w, aperture.h, aperture.radius);
  } else {
    drawRoundedRectPath(ctx, aperture.x, aperture.y, aperture.w, aperture.h, aperture.radius);
  }
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  if (frameId === 'golden-superstar') {
    drawRoundedRectPath(ctx, aperture.x - 8, aperture.y - 8, aperture.w + 16, aperture.h + 16, aperture.radius + 6);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FBBF24';
    ctx.stroke();
  } else if (frameId === 'superhero') {
    drawRoundedRectPath(ctx, aperture.x - 10, aperture.y - 10, aperture.w + 20, aperture.h + 20, aperture.radius + 6);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();
  }
  ctx.restore();

  // 3. Decorative Foreground Artwork + Banner per Frame
  if (frameId === 'sky-rainbow') {
    const pennantColors = ['#F472B6', '#FBBF24', '#38BDF8', '#A78BFA', '#34D399'];
    for (let i = 0; i < 11; i++) {
      const px = 110 + i * 98;
      ctx.beginPath();
      ctx.moveTo(px - 36, 48);
      ctx.lineTo(px + 36, 48);
      ctx.lineTo(px, 114);
      ctx.closePath();
      ctx.fillStyle = pennantColors[i % pennantColors.length];
      ctx.fill();
    }

    drawSmilingSun(ctx, 165, 165, 58);
    drawCloud(ctx, 1020, 170, 1.1);
    drawCloud(ctx, 155, 1140, 1.12);
    drawCloud(ctx, 1045, 1150, 1.05);
    drawBalloon(ctx, 95, 360, 40, 50, '#F472B6', 'rgba(255,255,255,0.45)', -10, 130);
    drawBalloon(ctx, 1105, 410, 42, 52, '#38BDF8', 'rgba(255,255,255,0.45)', 12, 130);
    drawStar(ctx, 1060, 260, 5, 22, 10, '#FBBF24');
    drawStar(ctx, 130, 620, 5, 18, 8, '#A78BFA');
    drawConfettiDots(ctx, ['#38BDF8', '#F472B6', '#FBBF24', '#A78BFA'], 0);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 800, 122, '#FFFFFF', '#BAE6FD', '#0369A1', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'starlight-butterfly') {
    drawStar(ctx, 175, 145, 5, 34, 15, '#FBBF24', '#FFFBEB');
    drawStar(ctx, 1025, 145, 5, 34, 15, '#FBBF24', '#FFFBEB');
    drawStar(ctx, 290, 100, 5, 18, 8, '#F472B6');
    drawStar(ctx, 910, 100, 5, 18, 8, '#A78BFA');
    drawStar(ctx, 600, 96, 5, 24, 11, '#FDE047', '#FFFFFF');

    drawButterfly(ctx, 140, 310, 1.45, '#F472B6', '#FCE7F3', -18);
    drawButterfly(ctx, 1055, 340, 1.35, '#A78BFA', '#EDE9FE', 18);
    drawButterfly(ctx, 130, 1010, 1.25, '#38BDF8', '#E0F2FE', 14);
    drawButterfly(ctx, 1065, 1020, 1.4, '#FBBF24', '#FEF3C7', -16);

    drawConfettiDots(ctx, ['#C084FC', '#F472B6', '#FDE047', '#60A5FA'], 1);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#7E22CE', '#C084FC', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'balloon-carnival') {
    drawBalloon(ctx, 135, 175, 46, 58, '#F472B6', 'rgba(255,255,255,0.45)', -14, 140);
    drawBalloon(ctx, 215, 140, 38, 48, '#FBBF24', 'rgba(255,255,255,0.45)', 6, 135);
    drawBalloon(ctx, 1055, 180, 46, 58, '#38BDF8', 'rgba(255,255,255,0.45)', 14, 140);
    drawBalloon(ctx, 980, 135, 38, 48, '#A78BFA', 'rgba(255,255,255,0.45)', -8, 135);

    drawBalloon(ctx, 105, 1050, 42, 52, '#34D399', 'rgba(255,255,255,0.45)', -8, 110);
    drawBalloon(ctx, 1095, 1040, 42, 52, '#FB7185', 'rgba(255,255,255,0.45)', 10, 110);

    drawStar(ctx, 600, 102, 5, 22, 10, '#F472B6', '#FFFFFF');
    drawConfettiDots(ctx, ['#F472B6', '#38BDF8', '#FBBF24', '#A78BFA', '#34D399'], 2);

    ctx.save();
    ctx.fillStyle = '#DB2777';
    ctx.font = '700 42px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('2026 Celebration', CANVAS_W / 2, 112);
    ctx.restore();

    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#DB2777', '#F9A8D4', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'sunny-meadow') {
    drawSmilingSun(ctx, 1030, 155, 56);
    drawCloud(ctx, 180, 150, 1.1);
    drawCuteBunnyPeek(ctx, 180, 1145, 1.35);

    drawDaisy(ctx, 1030, 1120, 1.3, '#FFFFFF', '#FBBF24');
    drawDaisy(ctx, 950, 1185, 0.95, '#FCE7F3', '#F59E0B');
    drawDaisy(ctx, 290, 1195, 0.9, '#FFFFFF', '#FBBF24');
    drawButterfly(ctx, 145, 420, 1.2, '#F472B6', '#FEF3C7', 12);
    drawButterfly(ctx, 1060, 520, 1.15, '#38BDF8', '#FFFFFF', -14);

    drawRibbonBanner(ctx, CANVAS_W / 2, 1265, 800, 120, '#FEF3C7', '#FDE68A', '#92400E', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'golden-superstar') {
    drawStar(ctx, 175, 145, 5, 40, 18, '#FBBF24', '#FFFFFF');
    drawStar(ctx, 1025, 145, 5, 40, 18, '#FBBF24', '#FFFFFF');
    drawStar(ctx, 105, 560, 5, 24, 11, '#A78BFA', '#FFFFFF');
    drawStar(ctx, 1095, 560, 5, 24, 11, '#38BDF8', '#FFFFFF');
    drawStar(ctx, 145, 1050, 5, 28, 13, '#F472B6', '#FFFFFF');
    drawStar(ctx, 1055, 1050, 5, 28, 13, '#FBBF24', '#FFFFFF');

    ctx.save();
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(270, 115);
    ctx.quadraticCurveTo(600, 55, 930, 115);
    ctx.stroke();
    ctx.restore();

    drawConfettiDots(ctx, ['#FBBF24', '#818CF8', '#F472B6', '#38BDF8'], 3);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#4F46E5', '#818CF8', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'rainbow-kids') {
    // Cheerful crayons & rainbow cloud
    drawCloud(ctx, 180, 150, 1.05);
    drawCloud(ctx, 1020, 150, 1.05);
    drawCrayon(ctx, 125, 1055, '#F472B6', '#DB2777', -16);
    drawCrayon(ctx, 180, 1095, '#38BDF8', '#0284C7', 8);
    drawCrayon(ctx, 1075, 1055, '#FBBF24', '#D97706', 16);
    drawCrayon(ctx, 1020, 1095, '#34D399', '#059669', -10);

    ctx.save();
    ctx.fillStyle = '#047857';
    ctx.font = '700 44px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Rainbow Kids 2026', CANVAS_W / 2, 125);
    ctx.restore();

    drawStar(ctx, 315, 115, 5, 20, 9, '#FBBF24', '#FFFFFF');
    drawStar(ctx, 885, 115, 5, 20, 9, '#F472B6', '#FFFFFF');
    drawConfettiDots(ctx, ['#FB7185', '#FBBF24', '#34D399', '#38BDF8', '#A78BFA'], 1);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#059669', '#6EE7B7', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'superhero') {
    // Lightning bolts & hero badge
    drawLightningBolt(ctx, 150, 165, 1.2, '#FBBF24', -14);
    drawLightningBolt(ctx, 1050, 165, 1.2, '#FBBF24', 14);
    drawLightningBolt(ctx, 115, 1035, 0.95, '#38BDF8', 12);
    drawLightningBolt(ctx, 1085, 1035, 0.95, '#F43F5E', -12);

    // Top Hero Emblem Shield
    ctx.save();
    ctx.translate(CANVAS_W / 2, 118);
    drawRoundedRectPath(ctx, -180, -44, 360, 88, 24);
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.fillStyle = '#FEF08A';
    ctx.font = '700 38px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LITTLE HERO 2026', 0, 2);
    ctx.restore();

    drawStar(ctx, 340, 120, 5, 22, 10, '#FBBF24', '#FFFFFF');
    drawStar(ctx, 860, 120, 5, 22, 10, '#FBBF24', '#FFFFFF');
    drawConfettiDots(ctx, ['#EF4444', '#FBBF24', '#3B82F6', '#38BDF8'], 0);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 820, 122, '#DC2626', '#FCA5A5', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'superstar') {
    // Golden crown at top center + music notes + twinkling stars
    drawCrown(ctx, CANVAS_W / 2, 128, 1.15);
    drawMusicNote(ctx, 170, 165, 1.25, '#DB2777', -12);
    drawMusicNote(ctx, 1030, 165, 1.25, '#9333EA', 12);
    drawStar(ctx, 125, 520, 5, 28, 12, '#FBBF24', '#FFFFFF');
    drawStar(ctx, 1075, 520, 5, 28, 12, '#FBBF24', '#FFFFFF');
    drawStar(ctx, 150, 1040, 5, 32, 14, '#F472B6', '#FFFFFF');
    drawStar(ctx, 1050, 1040, 5, 32, 14, '#A78BFA', '#FFFFFF');
    drawConfettiDots(ctx, ['#EC4899', '#FBBF24', '#A855F7', '#38BDF8'], 2);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#C026D3', '#F0ABFC', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else if (frameId === 'balloon-party') {
    // Festive balloon party bouquets
    drawBalloon(ctx, 115, 175, 42, 52, '#38BDF8', 'rgba(255,255,255,0.45)', -12, 130);
    drawBalloon(ctx, 195, 130, 38, 48, '#F472B6', 'rgba(255,255,255,0.45)', 4, 130);
    drawBalloon(ctx, 275, 165, 34, 42, '#FBBF24', 'rgba(255,255,255,0.45)', 12, 120);

    drawBalloon(ctx, 1085, 175, 42, 52, '#A78BFA', 'rgba(255,255,255,0.45)', 12, 130);
    drawBalloon(ctx, 1005, 130, 38, 48, '#34D399', 'rgba(255,255,255,0.45)', -4, 130);
    drawBalloon(ctx, 925, 165, 34, 42, '#FB7185', 'rgba(255,255,255,0.45)', -12, 120);

    drawBalloon(ctx, 105, 990, 38, 48, '#FBBF24', 'rgba(255,255,255,0.45)', -8, 120);
    drawBalloon(ctx, 1095, 990, 38, 48, '#38BDF8', 'rgba(255,255,255,0.45)', 8, 120);

    ctx.save();
    ctx.fillStyle = '#0369A1';
    ctx.font = '700 42px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Party Time!', CANVAS_W / 2, 118);
    ctx.restore();

    drawConfettiDots(ctx, ['#38BDF8', '#F472B6', '#FBBF24', '#34D399', '#A78BFA'], 3);
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#0284C7', '#7DD3FC', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  } else {
    // school-memories
    drawPaperPlane(ctx, 185, 145, 1.25, -10);
    drawPaperPlane(ctx, 1015, 155, 1.15, 14);
    drawCrayon(ctx, 115, 1035, '#FBBF24', '#D97706', -18);
    drawCrayon(ctx, 1085, 1035, '#38BDF8', '#0284C7', 18);

    // ABC / 123 Cute Blocks top center
    const blocks = [
      { ch: 'A', bg: '#FCA5A5', fg: '#7F1D1D', x: 465 },
      { ch: 'B', bg: '#FDE68A', fg: '#78350F', x: 560 },
      { ch: 'C', bg: '#93C5FD', fg: '#1E3A8A', x: 655 },
    ];
    blocks.forEach((b) => {
      ctx.save();
      drawRoundedRectPath(ctx, b.x, 76, 80, 80, 16);
      ctx.fillStyle = b.bg;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.fillStyle = b.fg;
      ctx.font = '700 42px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.ch, b.x + 40, 118);
      ctx.restore();
    });

    drawStar(ctx, 360, 115, 5, 20, 9, '#F59E0B', '#FFFFFF');
    drawStar(ctx, 840, 115, 5, 20, 9, '#EC4899', '#FFFFFF');
    drawRibbonBanner(ctx, CANVAS_W / 2, 1255, 810, 122, '#D97706', '#FCD34D', '#FFFFFF', 'Happy Children’s Day', bannerSubText);
  }

  // 4. Watermark at bottom of every generated photo
  drawFooterWatermark(ctx, true);
}

export function createSamplePortraitDataUrl(): string {
  const c = document.createElement('canvas');
  c.width = 900;
  c.height = 900;
  const ctx = c.getContext('2d');
  if (!ctx) return '';

  const grad = ctx.createLinearGradient(0, 0, 0, 900);
  grad.addColorStop(0, '#DBEAFE');
  grad.addColorStop(0.55, '#FCE7F3');
  grad.addColorStop(1, '#FEF3C7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 900);

  drawCloud(ctx, 180, 180, 1.2, '#FFFFFF', 'rgba(148,163,184,0.12)');
  drawCloud(ctx, 730, 220, 1.0, '#FFFFFF', 'rgba(148,163,184,0.12)');
  drawStar(ctx, 450, 140, 5, 30, 14, '#FBBF24', '#FFFFFF');
  drawBalloon(ctx, 735, 380, 54, 68, '#38BDF8', 'rgba(255,255,255,0.45)', 10, 160);
  drawBalloon(ctx, 165, 420, 48, 60, '#F472B6', 'rgba(255,255,255,0.45)', -12, 150);

  ctx.save();
  ctx.translate(450, 520);

  ctx.beginPath();
  ctx.ellipse(0, 240, 210, 170, 0, Math.PI, 0);
  ctx.fillStyle = '#38BDF8';
  ctx.fill();
  drawStar(ctx, 0, 195, 5, 36, 16, '#FDE047');

  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(dir * 125, -130, 58, 0, Math.PI * 2);
    ctx.fillStyle = '#D97706';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dir * 125, -130, 34, 0, Math.PI * 2);
    ctx.fillStyle = '#FDE68A';
    ctx.fill();
  }

  ctx.beginPath();
  ctx.ellipse(0, -15, 168, 148, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#F59E0B';
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, 28, 72, 54, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FEF3C7';
  ctx.fill();

  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.beginPath();
  ctx.arc(-96, 18, 24, 0, Math.PI * 2);
  ctx.arc(96, 18, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1E1B4B';
  ctx.beginPath();
  ctx.arc(-58, -32, 16, 0, Math.PI * 2);
  ctx.arc(58, -32, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-63, -38, 6, 0, Math.PI * 2);
  ctx.arc(53, -38, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.ellipse(0, 12, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 28, 28, 0.15, Math.PI - 0.15);
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-56, -135);
  ctx.lineTo(56, -135);
  ctx.lineTo(0, -270);
  ctx.closePath();
  ctx.fillStyle = '#EC4899';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -275, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#FDE047';
  ctx.fill();

  ctx.restore();
  return c.toDataURL('image/png');
}
