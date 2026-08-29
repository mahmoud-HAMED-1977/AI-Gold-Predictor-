import React, { useState } from 'react';
import {
  Check,
  Copy,
  FileText,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

interface AiExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
  onRefreshExplanation: () => void;
  isLoading: boolean;
}

export const AiExplanationModal: React.FC<AiExplanationModalProps> = ({
  isOpen,
  onClose,
  explanation,
  onRefreshExplanation,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="modal-ai-explanation"
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تقرير الذكاء الاصطناعي الشامل لتفسير حركة الذهب</h2>
              <p className="text-xs text-slate-400">تحليل رصين موجه للمستثمر صادر عن محرك Gemini التحليلي</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshExplanation}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="إعادة توليد التقرير"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 overflow-y-auto flex-1 text-xs text-slate-200 leading-relaxed font-sans space-y-4 whitespace-pre-line">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
              <p className="text-xs text-slate-400">جارِ تحليل جميع مؤشرات المحركات وتوليد التقرير...</p>
            </div>
          ) : (
            <div>{explanation}</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500">تم توليد التقرير بناءً على البيانات اللحظية المحدثة لنظام XAU/USD.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ التقرير'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
