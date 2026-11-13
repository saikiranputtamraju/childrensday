import {
  Camera,
  Check,
  Columns2,
  Copy,
  Download,
  ExternalLink,
  ImagePlus,
  Pencil,
  PlusCircle,
  Redo2,
  RotateCcw,
  RotateCw,
  Share2,
  Sparkles,
  Undo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FRAME_OPTIONS } from '../data/framesAndWishes';
import type { FrameId, PhotoTransform } from '../types/photoMagic';
import { CANVAS_W, createSamplePortraitDataUrl, renderFramedPhoto } from '../utils/canvasFrames';
import { soundEffects } from '../utils/soundEffects';

interface PhotoFrameStudioProps {
  externalCapturedDataUrl: string | null;
  onClearExternalCapture: () => void;
  onOpenCamera: () => void;
  onCelebrate: () => void;
  fileInputTriggerKey: number;
}

interface EditorSnapshot {
  frameId: FrameId;
  transform: PhotoTransform;
}

const DEFAULT_TRANSFORM: PhotoTransform = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 25 * 1024 * 1024;

export default function PhotoFrameStudio({
  externalCapturedDataUrl,
  onClearExternalCapture,
  onOpenCamera,
  onCelebrate,
  fileInputTriggerKey,
}: PhotoFrameStudioProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [imageReadyCount, setImageReadyCount] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameId>('sky-rainbow');
  const [frameSwitching, setFrameSwitching] = useState(false);
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM);
  const [customName, setCustomName] = useState('');
  const [customGreeting, setCustomGreeting] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Undo / Redo history
  const [history, setHistory] = useState<EditorSnapshot[]>([
    { frameId: 'sky-rainbow', transform: DEFAULT_TRANSFORM },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Before / After comparison
  const [isComparing, setIsComparing] = useState(false);
  const [comparePercent, setComparePercent] = useState(50);

  // Final preview state
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [whatsappReadyUrl, setWhatsappReadyUrl] = useState<string | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);

  // Pointer drag / pinch state
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);
  const pointerMovedRef = useRef(false);

  const commitHistory = useCallback(
    (nextFrame: FrameId, nextTransform: PhotoTransform) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        const last = sliced[sliced.length - 1];
        if (
          last &&
          last.frameId === nextFrame &&
          last.transform.zoom === nextTransform.zoom &&
          last.transform.offsetX === nextTransform.offsetX &&
          last.transform.offsetY === nextTransform.offsetY &&
          last.transform.rotation === nextTransform.rotation
        ) {
          return prev;
        }
        const updated = [...sliced, { frameId: nextFrame, transform: { ...nextTransform } }].slice(-25);
        setHistoryIndex(updated.length - 1);
        return updated;
      });
    },
    [historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const prevIdx = historyIndex - 1;
    const snap = history[prevIdx];
    setHistoryIndex(prevIdx);
    setSelectedFrame(snap.frameId);
    setTransform(snap.transform);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIdx = historyIndex + 1;
    const snap = history[nextIdx];
    setHistoryIndex(nextIdx);
    setSelectedFrame(snap.frameId);
    setTransform(snap.transform);
  };

  useEffect(() => {
    if (fileInputTriggerKey > 0) {
      fileInputRef.current?.click();
    }
  }, [fileInputTriggerKey]);

  useEffect(() => {
    if (externalCapturedDataUrl) {
      setUploadError(null);
      setPhotoSrc(externalCapturedDataUrl);
      setTransform(DEFAULT_TRANSFORM);
      setHistory([{ frameId: selectedFrame, transform: DEFAULT_TRANSFORM }]);
      setHistoryIndex(0);
      setIsComparing(false);
      setMode('edit');
      onClearExternalCapture();
    }
  }, [externalCapturedDataUrl, onClearExternalCapture, selectedFrame]);

  useEffect(() => {
    if (!photoSrc) {
      loadedImageRef.current = null;
      setIsPhotoLoading(false);
      setImageReadyCount((c) => c + 1);
      return;
    }

    let cancelled = false;
    setIsPhotoLoading(true);
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      loadedImageRef.current = img;
      setIsPhotoLoading(false);
      setImageReadyCount((c) => c + 1);
    };
    img.onerror = () => {
      if (cancelled) return;
      setIsPhotoLoading(false);
      setUploadError('We could not read that image file. Please try another JPG, PNG, or WebP photo.');
      loadedImageRef.current = null;
    };
    img.src = photoSrc;

    return () => {
      cancelled = true;
    };
  }, [photoSrc]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderFramedPhoto(
      canvas,
      loadedImageRef.current,
      selectedFrame,
      transform,
      customName,
      customGreeting
    );
  }, [selectedFrame, transform, customName, customGreeting, imageReadyCount]);

  useEffect(() => {
    let active = true;
    redrawCanvas();
    if (document.fonts && document.fonts.ready) {
      void document.fonts.ready.then(() => {
        if (active) redrawCanvas();
      });
    }
    return () => {
      active = false;
    };
  }, [redrawCanvas]);

  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);

    const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!ALLOWED_TYPES.has(file.type) && !extOk) {
      setUploadError('Please choose a JPG, JPEG, PNG, or WebP image file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError('That photo is larger than 25 MB. Please choose a smaller image.');
      return;
    }

    setIsPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoSrc(reader.result);
        setTransform(DEFAULT_TRANSFORM);
        setHistory([{ frameId: selectedFrame, transform: DEFAULT_TRANSFORM }]);
        setHistoryIndex(0);
        setIsComparing(false);
        setMode('edit');
      }
    };
    reader.onerror = () => {
      setIsPhotoLoading(false);
      setUploadError('Unable to open that file. Please try another photo.');
    };
    reader.readAsDataURL(file);
  };

  const handleUseSample = () => {
    setUploadError(null);
    const sampleUrl = createSamplePortraitDataUrl();
    setPhotoSrc(sampleUrl);
    setTransform(DEFAULT_TRANSFORM);
    setHistory([{ frameId: selectedFrame, transform: DEFAULT_TRANSFORM }]);
    setHistoryIndex(0);
    setIsComparing(false);
    setMode('edit');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!photoSrc || isComparing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pointerMovedRef.current = false;

    if (activePointersRef.current.size === 1) {
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: transform.offsetX,
        offsetY: transform.offsetY,
      };
      pinchStartRef.current = null;
    } else if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pinchStartRef.current = { dist, zoom: transform.zoom };
      dragStartRef.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!photoSrc || isComparing || !activePointersRef.current.has(e.pointerId)) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2 && pinchStartRef.current) {
      pointerMovedRef.current = true;
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const ratio = dist / Math.max(pinchStartRef.current.dist, 1);
      const nextZoom = Math.min(3, Math.max(0.6, Number((pinchStartRef.current.zoom * ratio).toFixed(2))));
      setTransform((prev) => ({ ...prev, zoom: nextZoom }));
      return;
    }

    if (activePointersRef.current.size === 1 && dragStartRef.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleRatio = CANVAS_W / Math.max(rect.width, 1);
      const dx = (e.clientX - dragStartRef.current.x) * scaleRatio;
      const dy = (e.clientY - dragStartRef.current.y) * scaleRatio;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        pointerMovedRef.current = true;
      }

      const clampedX = Math.max(-550, Math.min(550, dragStartRef.current.offsetX + dx));
      const clampedY = Math.max(-550, Math.min(550, dragStartRef.current.offsetY + dy));
      setTransform((prev) => ({
        ...prev,
        offsetX: clampedX,
        offsetY: clampedY,
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (activePointersRef.current.size === 0) {
      dragStartRef.current = null;
      if (pointerMovedRef.current) {
        pointerMovedRef.current = false;
        commitHistory(selectedFrame, transform);
      }
    }
  };

  const handleSelectFrame = (id: FrameId) => {
    if (id === selectedFrame) return;
    setFrameSwitching(true);
    setSelectedFrame(id);
    commitHistory(id, transform);
    window.setTimeout(() => setFrameSwitching(false), 180);
  };

  const handleResetTransform = () => {
    setTransform(DEFAULT_TRANSFORM);
    commitHistory(selectedFrame, DEFAULT_TRANSFORM);
  };

  const handleGeneratePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawCanvas();
    const url = canvas.toDataURL('image/png', 1.0);
    setFinalImageUrl(url);
    setMode('preview');
    setShareFeedback(null);
    setWhatsappReadyUrl(null);
    setCopiedImage(false);
    soundEffects.playCelebrationChime();
    onCelebrate();
  };

  const handleCreateAnotherPhoto = () => {
    setPhotoSrc(null);
    setFinalImageUrl(null);
    setTransform(DEFAULT_TRANSFORM);
    setHistory([{ frameId: selectedFrame, transform: DEFAULT_TRANSFORM }]);
    setHistoryIndex(0);
    setIsComparing(false);
    setShareFeedback(null);
    setWhatsappReadyUrl(null);
    setMode('edit');
  };

  const getExportBlob = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    redrawCanvas();
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
    });
  };

  const triggerPngDownload = (blob: Blob) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `happy-childrens-day-2026-${selectedFrame}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
  };

  const handleDownloadPng = async () => {
    const blob = await getExportBlob();
    if (!blob) return;
    triggerPngDownload(blob);
    setShareFeedback('Your HD PNG (1200 × 1440) keepsake has been downloaded!');
    onCelebrate();
  };

  const handleCopyImage = async () => {
    try {
      const blob = await getExportBlob();
      if (!blob) return;
      if (navigator.clipboard && 'ClipboardItem' in window) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedImage(true);
        setShareFeedback('HD PNG copied to clipboard! Paste it directly into WhatsApp or any chat.');
        window.setTimeout(() => setCopiedImage(false), 2600);
      } else {
        setShareFeedback('Clipboard image copy is not supported here — use Download HD PNG instead.');
      }
    } catch {
      setShareFeedback('Could not copy image automatically — please click Download HD PNG to save it.');
    }
  };

  const getShareMessage = () => {
    const namePart = customName.trim() ? ` for ${customName.trim()}` : '';
    return `Happy Children's Day 2026${namePart}! Made this joyful keepsake with Photo Magic 2026.`;
  };

  const handleWhatsAppShare = async () => {
    const shareText = getShareMessage();
    const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    try {
      const blob = await getExportBlob();
      if (blob && navigator.share) {
        const file = new File([blob], 'happy-childrens-day-2026.png', { type: 'image/png' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Happy Children's Day 2026",
            text: shareText,
            files: [file],
          });
          setShareFeedback('Shared directly using your device share sheet!');
          return;
        }
      }

      if (blob) {
        triggerPngDownload(blob);
      }
    } catch (err) {
      const error = err as DOMException;
      if (error?.name === 'AbortError') {
        setShareFeedback('Share was cancelled.');
        return;
      }
    }

    setWhatsappReadyUrl(waHref);
    setShareFeedback(
      'HD PNG downloaded! Tap "Open WhatsApp" below to send your greeting and attach the saved photo.'
    );
  };

  const handleNativeShare = async () => {
    const shareText = getShareMessage();
    try {
      const blob = await getExportBlob();
      if (blob && navigator.share) {
        const file = new File([blob], 'happy-childrens-day-2026.png', { type: 'image/png' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Happy Children's Day 2026",
            text: shareText,
            files: [file],
          });
          setShareFeedback('Shared your framed photo!');
          return;
        }
        await navigator.share({
          title: "Happy Children's Day 2026",
          text: shareText,
        });
        setShareFeedback('Greeting shared! Use Download HD PNG to save the photo file.');
        return;
      }
      await handleCopyImage();
    } catch (err) {
      const error = err as DOMException;
      if (error?.name !== 'AbortError') {
        setShareFeedback('Native share is unavailable in this browser — use Download HD PNG or Copy Image.');
      }
    }
  };

  return (
    <section id="studio" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#0284C7]">Photo Frame Studio</p>
          <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-[#1E1B4B] sm:text-4xl">
            Create Your Children’s Day Keepsake
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
            Upload a photo or snap one with your camera, choose from 10 pastel frames, add a name
            and message, and adjust the crop until it shines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#F9A8D4] bg-white px-4 py-2 text-sm font-semibold text-[#9D174D] shadow-sm transition-colors hover:bg-[#FCE7F3] whitespace-nowrap shrink-0"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload Photo
          </button>

          <button
            type="button"
            onClick={onOpenCamera}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#7DD3FC] bg-white px-4 py-2 text-sm font-semibold text-[#0369A1] shadow-sm transition-colors hover:bg-[#E0F2FE] whitespace-nowrap shrink-0"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Take Photo
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(e) => {
          handleFileSelected(e.target.files?.[0]);
          e.target.value = '';
        }}
        className="sr-only"
      />

      {uploadError && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
        >
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {mode === 'preview' && finalImageUrl ? (
        /* FINAL PHOTO PREVIEW MODE WITH CELEBRATION REVEAL */
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="rounded-3xl border border-white bg-gradient-to-br from-white/95 via-[#FFF8FC]/95 to-[#F0F9FF]/95 p-6 shadow-xl shadow-[#BAE6FD]/30 backdrop-blur-sm sm:p-8"
        >
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ rotate: -1.5, scale: 0.95 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-lg"
              >
                <img
                  src={finalImageUrl}
                  alt="Final Happy Children's Day 2026 framed photo"
                  className="h-auto w-full rounded-xl object-contain"
                />
              </motion.div>
            </div>

            <div className="space-y-6 lg:col-span-6">
              <div>
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#DB2777]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Hooray! Photo Magic Complete
                </p>
                <h3 className="font-display mt-1 text-3xl font-bold text-[#1E1B4B]">
                  Your Keepsake Frame Is Ready!
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569] sm:text-base">
                  Exported in crisp HD (1200 × 1440 PNG) with the Children’s Day 2026 keepsake
                  watermark. Save it or share directly with family and friends.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void handleDownloadPng()}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#DB2777] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#DB2777]/25 transition-all hover:bg-[#BE185D] active:scale-[0.98] whitespace-nowrap shrink-0"
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Download HD PNG
                </button>

                <button
                  type="button"
                  onClick={() => void handleWhatsAppShare()}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#16A34A]/20 transition-all hover:bg-[#15803D] active:scale-[0.98] whitespace-nowrap shrink-0"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                  Share on WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => void handleNativeShare()}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] px-5 py-2.5 text-sm font-semibold text-[#0369A1] transition-colors hover:bg-[#E0F2FE] whitespace-nowrap shrink-0"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Native Share
                </button>

                <button
                  type="button"
                  onClick={() => void handleCopyImage()}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-5 py-2.5 text-sm font-semibold text-[#6D28D9] transition-colors hover:bg-[#EDE9FE] whitespace-nowrap shrink-0"
                >
                  {copiedImage ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Copied PNG!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy Image
                    </>
                  )}
                </button>
              </div>

              {whatsappReadyUrl && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-900">
                    Your HD PNG has been saved to your device. Tap below to open WhatsApp and
                    attach it:
                  </p>
                  <a
                    href={whatsappReadyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#15803D] whitespace-nowrap shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Open WhatsApp
                  </a>
                </div>
              )}

              {shareFeedback && !whatsappReadyUrl && (
                <p
                  role="status"
                  className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] px-4 py-2.5 text-sm font-medium text-[#0369A1]"
                >
                  {shareFeedback}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1E1B4B] transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Back to Edit
                </button>

                <button
                  type="button"
                  onClick={handleCreateAnotherPhoto}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#F9A8D4] bg-[#FFF1F2] px-5 py-2.5 text-sm font-semibold text-[#9D174D] transition-colors hover:bg-[#FCE7F3] whitespace-nowrap shrink-0"
                >
                  <PlusCircle className="h-4 w-4" aria-hidden="true" />
                  Create Another Photo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* STUDIO EDITOR MODE */
        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* Left: Live Interactive Framed Canvas Stage + Before/After Comparison */}
          <div className="lg:col-span-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                handleFileSelected(e.dataTransfer.files?.[0]);
              }}
              className={`relative rounded-3xl border-2 bg-white/90 p-4 shadow-xl shadow-[#BAE6FD]/20 backdrop-blur-sm transition-colors sm:p-6 ${
                isDraggingOver ? 'border-[#DB2777] bg-[#FFF1F2]' : 'border-white'
              }`}
            >
              {/* Stage Quick Bar: Before/After + Undo/Redo */}
              {photoSrc && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComparing((v) => !v)}
                    aria-pressed={isComparing}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                      isComparing
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0369A1]'
                        : 'border-slate-200 bg-white text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    <Columns2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {isComparing ? 'Exit Before / After' : 'Before / After'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                      aria-label="Undo edit"
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0"
                    >
                      <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Undo
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1}
                      aria-label="Redo edit"
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0"
                    >
                      <Redo2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Redo
                    </button>
                  </div>
                </div>
              )}

              <div className="relative mx-auto max-w-[460px]">
                <motion.div
                  animate={{
                    scale: frameSwitching ? 0.985 : 1,
                    opacity: frameSwitching ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className={`h-auto w-full rounded-2xl shadow-md touch-none ${
                      photoSrc && !isComparing ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                    aria-label="Live Happy Children's Day photo frame preview"
                  />

                  {/* Interactive Before / After Split Overlay */}
                  {isComparing && photoSrc && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                      <div
                        className="absolute inset-0 bg-slate-900/90"
                        style={{ clipPath: `inset(0 ${100 - comparePercent}% 0 0)` }}
                      >
                        <img
                          src={photoSrc}
                          alt="Original unframed photo (Before)"
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Split Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
                        style={{ left: `${comparePercent}%` }}
                      />

                      <span className="absolute top-3 left-3 rounded-lg bg-[#1E1B4B]/80 px-2.5 py-1 text-[11px] font-bold text-white">
                        Before
                      </span>
                      <span className="absolute top-3 right-3 rounded-lg bg-[#DB2777]/90 px-2.5 py-1 text-[11px] font-bold text-white">
                        After (Framed)
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Loading indicator while reading image */}
                {isPhotoLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/85 backdrop-blur-xs">
                    <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#BAE6FD] border-t-[#DB2777]" />
                    <p className="text-sm font-semibold text-[#1E1B4B]">Preparing your photo...</p>
                  </div>
                )}

                {!photoSrc && !isPhotoLoading && (
                  <div className="absolute inset-x-[13%] top-[16%] bottom-[22%] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7DD3FC] bg-white/90 p-5 text-center backdrop-blur-xs">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0284C7]">
                      <ImagePlus className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <p className="font-display text-lg font-bold text-[#1E1B4B]">
                      Drop Your Photo Here
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#475569] sm:text-sm">
                      Supports JPG, JPEG, PNG, and WebP. Processed privately in your browser.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#BE185D] whitespace-nowrap shrink-0"
                      >
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        Browse Gallery
                      </button>
                      <button
                        type="button"
                        onClick={onOpenCamera}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#7DD3FC] bg-[#F0F9FF] px-4 py-2 text-sm font-semibold text-[#0369A1] hover:bg-[#E0F2FE] whitespace-nowrap shrink-0"
                      >
                        <Camera className="h-4 w-4" aria-hidden="true" />
                        Use Camera
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleUseSample}
                      className="mt-3 text-xs font-semibold text-[#7C3AED] underline underline-offset-4 hover:text-[#5B21B6]"
                    >
                      Or try with a cute sample illustration
                    </button>
                  </div>
                )}
              </div>

              {/* Before / After Slider Control */}
              {isComparing && photoSrc && (
                <div className="mx-auto mt-3 max-w-[460px] space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#475569]">
                    <span>Slide to compare Before & After</span>
                    <span className="tabular-nums">{comparePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={comparePercent}
                    onChange={(e) => setComparePercent(Number(e.target.value))}
                    aria-label="Before and after comparison split"
                    className="h-2 w-full cursor-pointer accent-[#0284C7]"
                  />
                </div>
              )}

              {photoSrc && !isComparing && (
                <p className="mt-3 text-center text-xs font-medium text-[#64748B]">
                  Drag directly on the photo to reposition, or pinch / use the slider to zoom.
                </p>
              )}
            </div>
          </div>

          {/* Right: 10 Frames + Crop/Zoom/Rotate + Personalized Name & Message + Generate */}
          <div className="space-y-5 lg:col-span-6">
            {/* Step 1: 10 Custom Children's Day Frames */}
            <div
              id="frames-gallery"
              className="scroll-mt-20 rounded-3xl border border-white bg-white/90 p-5 shadow-lg shadow-[#BAE6FD]/15 backdrop-blur-sm sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#1E1B4B]">
                  1. Choose Your Frame (10 Designs)
                </h3>
                <span className="text-xs font-medium text-[#64748B]">Instant preview</span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {FRAME_OPTIONS.map((frame) => {
                  const active = selectedFrame === frame.id;
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => handleSelectFrame(frame.id)}
                      aria-pressed={active}
                      className={`flex min-h-[58px] w-full items-center justify-between gap-2.5 rounded-2xl border p-2.5 text-left transition-all ${
                        active
                          ? 'border-[#DB2777] bg-[#FFF1F2] shadow-sm'
                          : 'border-slate-200 bg-white hover:border-[#BAE6FD] hover:bg-[#F8FBFF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Mini Visual Frame Thumbnail Preview */}
                        <span
                          className="relative flex h-11 w-9 shrink-0 flex-col items-center justify-between rounded-lg border-2 p-1 shadow-xs"
                          style={{
                            backgroundColor: frame.surfaceTint,
                            borderColor: frame.borderColor,
                          }}
                          aria-hidden="true"
                        >
                          <span className="h-5 w-full rounded-sm bg-white/90 shadow-inner" />
                          <span
                            className="h-1.5 w-full rounded-full"
                            style={{ backgroundColor: frame.accentColor }}
                          />
                        </span>

                        <div className="min-w-0">
                          <div className="truncate text-xs font-bold text-[#1E1B4B] sm:text-sm">
                            {frame.name}
                          </div>
                          <div className="truncate text-[11px] text-[#64748B]">{frame.subtitle}</div>
                        </div>
                      </div>

                      {active && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DB2777] text-white">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Add Name & Greeting, Crop, Zoom, Rotate & Generate */}
            <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-lg shadow-[#BAE6FD]/15 backdrop-blur-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#1E1B4B]">
                  2. Personalize & Adjust Photo
                </h3>
                {photoSrc && (
                  <button
                    type="button"
                    onClick={handleResetTransform}
                    className="text-xs font-semibold text-[#0284C7] hover:underline"
                  >
                    Center & Reset
                  </button>
                )}
              </div>

              {/* Personalized Name + Greeting Message */}
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="frame-name-input"
                    className="mb-1.5 block text-xs font-semibold text-[#475569]"
                  >
                    Child’s Name (optional)
                  </label>
                  <input
                    id="frame-name-input"
                    type="text"
                    maxLength={22}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Aarav or Mia"
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FBFF] px-3.5 py-2.5 text-sm font-medium text-[#1E1B4B] placeholder:text-slate-400 focus:border-[#DB2777] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="frame-greeting-input"
                    className="mb-1.5 block text-xs font-semibold text-[#475569]"
                  >
                    Greeting Message (optional)
                  </label>
                  <input
                    id="frame-greeting-input"
                    type="text"
                    maxLength={30}
                    value={customGreeting}
                    onChange={(e) => setCustomGreeting(e.target.value)}
                    placeholder="e.g., Shine Bright Always!"
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FBFF] px-3.5 py-2.5 text-sm font-medium text-[#1E1B4B] placeholder:text-slate-400 focus:border-[#DB2777] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Zoom Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
                  <span>Zoom</span>
                  <span className="tabular-nums">{Math.round(transform.zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={!photoSrc}
                    onClick={() => {
                      const next = {
                        ...transform,
                        zoom: Math.max(0.6, Number((transform.zoom - 0.1).toFixed(2))),
                      };
                      setTransform(next);
                      commitHistory(selectedFrame, next);
                    }}
                    aria-label="Zoom out"
                    className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white text-[#334155] hover:bg-slate-50 disabled:opacity-45"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>

                  <input
                    type="range"
                    min={0.6}
                    max={3}
                    step={0.02}
                    disabled={!photoSrc}
                    value={transform.zoom}
                    onChange={(e) =>
                      setTransform((p) => ({ ...p, zoom: parseFloat(e.target.value) }))
                    }
                    onPointerUp={() => commitHistory(selectedFrame, transform)}
                    aria-label="Zoom level"
                    className="h-2 w-full cursor-pointer accent-[#DB2777] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    disabled={!photoSrc}
                    onClick={() => {
                      const next = {
                        ...transform,
                        zoom: Math.min(3, Number((transform.zoom + 0.1).toFixed(2))),
                      };
                      setTransform(next);
                      commitHistory(selectedFrame, next);
                    }}
                    aria-label="Zoom in"
                    className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white text-[#334155] hover:bg-slate-50 disabled:opacity-45"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rotate Buttons */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#475569]">Rotate Photo</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!photoSrc}
                    onClick={() => {
                      const next = { ...transform, rotation: (transform.rotation - 90) % 360 };
                      setTransform(next);
                      commitHistory(selectedFrame, next);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-45 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Left 90°
                  </button>
                  <button
                    type="button"
                    disabled={!photoSrc}
                    onClick={() => {
                      const next = { ...transform, rotation: (transform.rotation + 90) % 360 };
                      setTransform(next);
                      commitHistory(selectedFrame, next);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-45 whitespace-nowrap shrink-0"
                  >
                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Right 90°
                  </button>
                </div>
              </div>

              {/* Primary Action: Generate & Preview */}
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  disabled={!photoSrc}
                  onClick={handleGeneratePreview}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#DB2777] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#DB2777]/25 transition-all hover:bg-[#BE185D] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none whitespace-nowrap shrink-0"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  {photoSrc ? 'Preview & Share' : 'Add a Photo First'}
                </button>

                {photoSrc && (
                  <button
                    type="button"
                    onClick={() => void handleDownloadPng()}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] px-5 py-3 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#E0F2FE] whitespace-nowrap shrink-0"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    HD PNG
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
