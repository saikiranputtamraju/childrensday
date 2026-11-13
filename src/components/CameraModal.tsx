import { Camera, RefreshCw, ShieldCheck, Timer, Upload, Volume2, VolumeX, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { soundEffects } from '../utils/soundEffects';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  onFallbackUpload: () => void;
}

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
  onFallbackUpload,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<number | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [useTimer, setUseTimer] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [shutterSoundOn, setShutterSoundOn] = useState(() => soundEffects.isEnabled());

  const stopStream = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async (mode: 'user' | 'environment') => {
      stopStream();
      setStatus('loading');
      setErrorMessage('');
      setCountdown(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('error');
        setErrorMessage(
          'Your browser does not support live camera capture. Please upload a photo from your gallery instead.'
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus('ready');
      } catch (err) {
        const error = err as DOMException;
        setStatus('error');
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setErrorMessage(
            'Camera permission was denied. To turn it on, tap the camera or lock icon in your browser address bar, set Camera to Allow, and tap Try Again — or upload a photo from your gallery.'
          );
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setErrorMessage(
            'No camera was detected on this device. You can still upload a photo from your gallery!'
          );
        } else {
          setErrorMessage(
            'Could not open the camera right now. Please check if another app is using it or upload a photo instead.'
          );
        }
      }
    },
    [stopStream]
  );

  // Never initialize the camera automatically on mount or modal open;
  // only ensure all tracks are stopped and state resets when modal closes or unmounts.
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setStatus('idle');
      setErrorMessage('');
      setCountdown(null);
    } else {
      setShutterSoundOn(soundEffects.isEnabled());
    }
    return () => {
      stopStream();
    };
  }, [isOpen, stopStream]);

  const snapNow = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    if (shutterSoundOn) {
      soundEffects.playShutter();
    }
    setFlashActive(true);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    window.setTimeout(() => {
      setFlashActive(false);
      stopStream();
      setStatus('idle');
      onCapture(dataUrl);
    }, 140);
  }, [facingMode, onCapture, shutterSoundOn, stopStream]);

  const handleShutter = () => {
    if (status !== 'ready' || countdown !== null) return;
    if (!useTimer) {
      snapNow();
      return;
    }

    let remaining = 3;
    setCountdown(remaining);
    countdownTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (countdownTimerRef.current !== null) {
          window.clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setCountdown(null);
        snapNow();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  };

  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (status === 'ready') {
      void startCamera(nextMode);
    }
  };

  const handleCloseModal = () => {
    stopStream();
    setStatus('idle');
    setErrorMessage('');
    setCountdown(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="camera-modal-title" className="font-display text-lg font-bold text-[#1E1B4B]">
                Smile for the Camera
              </h2>
              <p className="text-xs text-[#64748B]">
                {status === 'ready'
                  ? facingMode === 'user'
                    ? 'Front camera active'
                    : 'Rear camera active'
                  : 'Camera starts only when you allow'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const next = !shutterSoundOn;
                setShutterSoundOn(next);
                soundEffects.setEnabled(next);
              }}
              aria-pressed={shutterSoundOn}
              aria-label={shutterSoundOn ? 'Mute camera shutter sound' : 'Enable camera shutter sound'}
              title={shutterSoundOn ? 'Shutter sound on' : 'Shutter sound off'}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-[#0284C7]"
            >
              {shutterSoundOn ? <Volume2 className="h-5 w-5 text-[#0284C7]" /> : <VolumeX className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close camera"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-[#0284C7]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="relative aspect-[4/3] w-full bg-slate-950">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`h-full w-full object-cover transition-opacity duration-200 ${
              status === 'ready' ? 'opacity-100' : 'opacity-0'
            } ${facingMode === 'user' ? '-scale-x-100' : ''}`}
          />

          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#F0F9FF] via-[#FFF8FC] to-[#FEFCE8] p-6 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0284C7] shadow-sm">
                <Camera className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1E1B4B]">
                Ready to Snap a Photo?
              </h3>
              <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#475569]">
                Click <strong>Start Camera</strong> below to allow browser camera access and take a
                picture.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => void startCamera(facingMode)}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#DB2777] px-6 py-2.5 text-base font-bold text-white shadow-md shadow-[#DB2777]/25 transition-all hover:bg-[#BE185D] active:scale-[0.98] whitespace-nowrap shrink-0"
                >
                  <Camera className="h-5 w-5" aria-hidden="true" />
                  Start Camera
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    onFallbackUpload();
                  }}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-[#BAE6FD] bg-white px-4 py-2.5 text-sm font-semibold text-[#0369A1] hover:bg-[#E0F2FE] whitespace-nowrap shrink-0"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Upload Photo
                </button>
              </div>

              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                <ShieldCheck className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
                Processed locally on your device · Never uploaded
              </p>
            </div>
          )}

          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <div className="h-9 w-9 animate-spin rounded-full border-3 border-white/30 border-t-[#38BDF8]" />
              <p className="text-sm font-medium">Requesting camera access...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF8FB] p-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE7F3] text-[#DB2777]">
                <Camera className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[#334155]">{errorMessage}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => void startCamera(facingMode)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1E1B4B] hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    onFallbackUpload();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white hover:bg-[#BE185D] whitespace-nowrap shrink-0"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Upload Instead
                </button>
              </div>
            </div>
          )}

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="font-display text-7xl font-bold text-white drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}

          {flashActive && <div className="pointer-events-none absolute inset-0 bg-white/85" />}
        </div>

        {/* Camera Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FBFF] px-5 py-4">
          <button
            type="button"
            onClick={handleSwitchCamera}
            disabled={status !== 'ready' || countdown !== null}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#BAE6FD] bg-white px-3.5 py-2 text-sm font-semibold text-[#0369A1] transition-colors hover:bg-[#E0F2FE] disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Switch Camera
          </button>

          <button
            type="button"
            onClick={handleShutter}
            disabled={status !== 'ready' || countdown !== null}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#DB2777] px-6 py-2.5 text-base font-bold text-white shadow-md shadow-[#DB2777]/25 transition-all hover:bg-[#BE185D] active:scale-[0.97] disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Camera className="h-5 w-5" aria-hidden="true" />
            {countdown !== null ? `Wait ${countdown}...` : 'Capture Photo'}
          </button>

          <button
            type="button"
            onClick={() => setUseTimer((v) => !v)}
            disabled={status !== 'ready' || countdown !== null}
            aria-pressed={useTimer}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              useTimer
                ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                : 'border-slate-200 bg-white text-[#475569] hover:bg-slate-50'
            }`}
          >
            <Timer className="h-4 w-4" aria-hidden="true" />
            {useTimer ? '3s On' : '3s Timer'}
          </button>
        </div>
      </div>
    </div>
  );
}
