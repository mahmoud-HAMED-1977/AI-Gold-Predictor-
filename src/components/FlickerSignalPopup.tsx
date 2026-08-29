import React, { useEffect, useRef, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Maximize2,
  Minimize2,
  Radio,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { TradeAlert } from '../types';

interface FlickerSignalPopupProps {
  alert: TradeAlert | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onViewDetails?: () => void;
  secondsUntilNextCheck: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onForceReevaluate: () => void;
  isEvaluating?: boolean;
}

// Audio synthesizer for alert chimes using Web Audio API
const playAlertSound = (type: 'BUY' | 'SELL', isUrgent: boolean) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (isUrgent) {
      // Rapid 3-beep emergency alarm
      [0, 0.15, 0.3].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 660, now + delay);
        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } else if (type === 'BUY') {
      // Pleasant double ascending chime for BUY
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.45);
    } else {
      // Decisive descending chime for SELL
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(740, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, now + 0.12);
      gain2.gain.setValueAtTime(0.28, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.4);
    }
  } catch (err) {
    console.warn('Audio chime error:', err);
  }
};

export const FlickerSignalPopup: React.FC<FlickerSignalPopupProps> = ({
  alert,
  onDismiss,
  onSnooze,
  onViewDetails,
  secondsUntilNextCheck,
  soundEnabled,
  onToggleSound,
  onForceReevaluate,
  isEvaluating = false,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const playedAlertIdRef = useRef<string | null>(null);

  // Play sound when a new alert pops up and sound is enabled
  useEffect(() => {
    if (alert && soundEnabled && playedAlertIdRef.current !== alert.id) {
      playedAlertIdRef.current = alert.id;
      playAlertSound(alert.action, alert.isUrgent);
    }
  }, [alert, soundEnabled]);

  if (!alert) {
    // Show mini monitor widget if no active alert
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 shadow-xl flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span className="font-semibold">المراقب الذكي (كل 10 د)</span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-300">
            المسح القادم: {Math.floor(secondsUntilNextCheck / 60)}:{String(secondsUntilNextCheck % 60).padStart(2, '0')}
          </span>
          <button
            onClick={onForceReevaluate}
            disabled={isEvaluating}
            className="text-slate-400 hover:text-amber-400 p-1 rounded transition-colors"
            title="إعادة التقييم اللحظي الآن"
          >
            <RefreshCw className={`w-3 h-3 ${isEvaluating ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  const isBuy = alert.action === 'BUY';
  const isUrgent = alert.isUrgent;

  // Choose flicker animation class
  const flickerClass = isUrgent
    ? 'flicker-urgent border-2 border-red-500'
    : isBuy
    ? 'flicker-buy border-2 border-emerald-400'
    : 'flicker-sell border-2 border-rose-500';

  const bgGradient = isUrgent
    ? 'bg-gradient-to-b from-slate-950 via-red-950/70 to-slate-950'
    : isBuy
    ? 'bg-gradient-to-b from-slate-950 via-emerald-950/60 to-slate-950'
    : 'bg-gradient-to-b from-slate-950 via-rose-950/60 to-slate-950';

  const badgeColor = isUrgent
    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
    : isBuy
    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 font-black'
    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 font-black';

  const textColor = isBuy ? 'text-emerald-400' : 'text-rose-400';

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50 animate-bounce">
        <div
          onClick={() => setIsMinimized(false)}
          className={`cursor-pointer rounded-2xl p-3 shadow-2xl flex items-center gap-3 backdrop-blur-md ${bgGradient} ${flickerClass}`}
        >
          <div className={`p-2 rounded-xl ${badgeColor}`}>
            {isBuy ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase text-white">{alert.title}</span>
              {isUrgent && (
                <span className="bg-red-600 text-[10px] text-white px-1.5 py-0.2 rounded font-bold animate-pulse">
                  مستعجل!
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-300">
              السعر: <strong className={textColor}>${alert.price.toFixed(2)}</strong>
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="flicker-signal-popup-root"
      className="fixed bottom-5 left-4 right-4 sm:right-auto sm:left-6 z-50 max-w-lg w-full transition-all duration-300 transform scale-100"
    >
      <div
        className={`rounded-2xl p-5 shadow-2xl backdrop-blur-xl ${bgGradient} ${flickerClass} relative overflow-hidden transition-all`}
      >
        {/* Ambient Top Glow Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isUrgent
              ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse'
              : isBuy
              ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400'
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500'
          }`}
        />

        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${badgeColor} flex items-center justify-center shrink-0`}>
              {isUrgent ? (
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              ) : isBuy ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${badgeColor} tracking-wide`}>
                  {alert.action === 'BUY' ? 'إشارة شراء' : 'إشارة بيع'}
                </span>

                {isUrgent && (
                  <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 badge-pulse shadow-md shadow-red-500/50">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>تنبيه عاجل الآن!</span>
                  </span>
                )}

                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {alert.timeFormatted}
                </span>
              </div>

              <h2 className={`text-base font-black mt-1 text-white tracking-tight ${isUrgent ? 'text-flickering' : ''}`}>
                {alert.title}
              </h2>
            </div>
          </div>

          {/* Top Controls: Sound, Minimize, Close */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
                soundEnabled ? 'text-amber-400' : 'text-slate-600'
              }`}
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل التنبيه الصوتي'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="تصغير"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onDismiss}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Urgent Warning Ribbon if Urgent */}
        {isUrgent && alert.urgencyReason && (
          <div className="mt-3 bg-red-950/90 border border-red-500/50 rounded-xl p-3 flex items-start gap-2.5 shadow-inner">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs text-red-200 leading-relaxed">
              <strong className="text-white block mb-0.5">سبب التنبيه العاجل:</strong>
              {alert.urgencyReason}
            </div>
          </div>
        )}

        {/* Core Message & Indicators Summary */}
        <div className="mt-3 space-y-2.5">
          <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
            {alert.message}
          </p>

          {/* Targets Grid */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs pt-1">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block font-sans">السعر الحالي</span>
              <span className={`text-sm font-bold ${textColor}`}>${alert.price.toFixed(2)}</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block font-sans">الهدف المتوقع</span>
              <span className="text-sm font-bold text-white">${alert.targetPrice.toFixed(2)}</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block font-sans">وقف الخسارة (أمان)</span>
              <span className="text-sm font-bold text-rose-400">${alert.stopLoss.toFixed(2)}</span>
            </div>
          </div>

          {/* Indicators Footnote */}
          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>نسبة الثقة: <strong className="text-amber-400 font-mono">{alert.confidenceScore}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>مستوى الخطر: <strong className="font-mono text-slate-200">{alert.riskScore}/100</strong></span>
            </div>
            <div className="text-slate-400 font-mono">
              العائد للخطر <strong className="text-emerald-400">{alert.riskReward}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions & 10-Min Timer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>فحص تلقائي:</span>
            <span className="text-amber-400 font-bold">
              {Math.floor(secondsUntilNextCheck / 60)}:{String(secondsUntilNextCheck % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSnooze(5)}
              className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-[11px]"
            >
              تأجيل 5 دقائق
            </button>

            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className={`flex items-center gap-1 font-bold px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-md text-slate-950 ${
                  isBuy
                    ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                    : 'bg-rose-400 hover:bg-rose-300 shadow-rose-500/20'
                }`}
              >
                <span>تفاصيل الخطة</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
