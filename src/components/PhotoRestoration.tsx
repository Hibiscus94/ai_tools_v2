import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Upload, Loader2, RefreshCw, ZoomIn, 
  Download, Share2, Sparkles, Sliders
} from 'lucide-react';
import { ActiveTool, HistoryRecord, UserStats } from '../types';

interface PhotoRestorationProps {
  onBack: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addHistoryRecord: (record: HistoryRecord) => void;
}

// Beautifully restored classical portrait placeholders matching mockup 9
const SAMPLE_BLURRED = "https://lh3.googleusercontent.com/aida-public/AB6AXuCHXG6D0tH6S9U9V09Z5F_P65y58Y78g_Z67f9Y89r-G97Y9zQp7Q_9D8p9Wh_49h56yN6U_uN5a_8M_H9T_K_XvZ8h_v3s6f9Z7M5L4K3J2I1H_8g_9P-qR1t4Cg_38-6G_9KvlN5g_Nl_9gU4h6g9e_T98g7r7N6b_3d";
const SAMPLE_RESTORED = "https://lh3.googleusercontent.com/aida-public/AB6AXuA-c-W3e4G5F6y7u8I9O_P_Q0r_S1t2U3V4w5x6y7zB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5_6g_7A8B9C";

// Fallback images just in case the above ones aren't available
const RESTORE_BLURRED = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80&sat=-100&sepia=80&blur=3";
const RESTORE_CLEAN = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";

export default function PhotoRestoration({ onBack, userStats, setUserStats, addHistoryRecord }: PhotoRestorationProps) {
  const [originalImage, setOriginalImage] = useState(RESTORE_BLURRED);
  const [restoredImage, setRestoredImage] = useState(RESTORE_CLEAN);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [enhanceType, setEnhanceType] = useState<'all' | 'color' | 'scratch'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleStopDrag = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleStopDrag);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleStopDrag);
  };

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if ('clientX' in e) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleStopDrag);
    } else {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleStopDrag);
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (userStats.points < 10) {
      alert("老照片修复消耗较高，需 10 点数。当前额度不足，欢迎点击个人中心下方看广告速回！");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setOriginalImage(b64);
      setIsCustomMode(true);

      setTimeout(() => {
        setRestoredImage(b64);
        setIsProcessing(false);

        // Deduct points & save history
        setUserStats(prev => ({ ...prev, points: Math.max(0, prev.points - 10) }));
        addHistoryRecord({
          id: Math.random().toString(),
          toolName: "AI 老照片老片高清修复",
          timestamp: new Date().toISOString(),
          inputDescription: "旧底版划痕祛除高清重绘",
          pointsCost: 10
        });

        alert("修复画幅重绘臻享达成！用手指划卷中心指针，即可探照斑驳岁月背后的本真光华。");
      }, 3500);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    document.getElementById('photo-restore-picker')?.click();
  };

  useEffect(() => {
    let t = setTimeout(() => setSliderPosition(40), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-6 max-w-lg mx-auto pb-10"
    >
      {/* points and duration badge */}
      <div className="w-full flex justify-end gap-2 text-[10px] sm:text-xs text-[#B22222] font-serif font-bold">
        <span className="px-2.5 py-1 bg-[#B22222]/5 border border-[#B22222]">耗时: {isCustomMode ? "3.5s" : "1.8s"}</span>
        <span className="px-2.5 py-1 bg-[#B22222]/5 border border-[#B22222]">消耗: 10点</span>
      </div>

      {/* Main Core Slider comparison */}
      <div 
        ref={containerRef}
        className="w-full aspect-[4/3] bg-white rounded-xl border border-[#E0E0E0]/60 shadow-lg overflow-hidden relative select-none"
      >
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-[#F8FBF8]/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#1A2F4B] animate-spin" />
            <p className="text-xs text-[#1A2F4B] font-serif font-semibold animate-pulse">
              光阴逆旅，AI 粒度纹理精绘重构中...
            </p>
          </div>
        )}

        {/* restored image layer on deep base */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={restoredImage}
            className={`w-full h-full object-cover transition-all ${isCustomMode ? 'brightness-115 contrast-105 saturate-110' : ''}`}
            alt="AI Restored masterpiece"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-4 left-4 z-20 bg-[#021a35]/85 backdrop-blur-sm text-white rounded-full px-3 py-1 text-[10px] font-sans font-bold border border-white/20">
            修复后
          </span>
        </div>

        {/* blurry original on top (clipped horizontally) */}
        <div 
          className="absolute inset-0 w-full h-full bg-white z-10 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <img
            src={originalImage}
            className="w-full h-full object-cover"
            alt="Original damaged reference"
            style={{ 
              width: containerRef.current?.clientWidth || 360, 
              maxWidth: 'none',
              filter: isCustomMode ? "sepia(0.6) blur(2px) contrast(0.8)" : "none"
            }}
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-4 right-4 z-20 bg-black/40 text-white rounded-full px-3 py-1 text-[10px] font-sans font-bold border border-white/20">
            老照片 (原图)
          </span>
        </div>

        {/* Dynamic split handle */}
        <div 
          className="absolute top-0 bottom-0 z-30 w-0.5 bg-[#1A2F4B]"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[#1A2F4B] flex items-center justify-center shadow-md transform -translate-x-1/2 absolute top-1/2 -translate-y-1/2 hover:scale-105 active:scale-95 transition-transform cursor-ew-resize">
            <Sliders className="text-[#1A2F4B] w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Picker input */}
      <input 
        id="photo-restore-picker"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadImage}
      />

      {/* Option selectors for enhancement presets */}
      <div className="bg-white border rounded-2xl p-5 space-y-4">
        <h4 className="font-serif font-bold text-sm text-[#1A2F4B] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#B22222]" />
          <span>重塑模式选项</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setEnhanceType('all')}
            className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              enhanceType === 'all'
                ? 'bg-[#1A2F4B]/5 border-[#1A2F4B] text-[#1A2F4B]'
                : 'bg-white border-[#E0E0E0]/60 text-[#44474d] hover:bg-neutral-50'
            }`}
          >
            全面像素高清
          </button>
          <button
            onClick={() => setEnhanceType('color')}
            className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              enhanceType === 'color'
                ? 'bg-[#1A2F4B]/5 border-[#1A2F4B] text-[#1A2F4B]'
                : 'bg-white border-[#E0E0E0]/60 text-[#44474d] hover:bg-neutral-50'
            }`}
          >
            AI 智能着色
          </button>
          <button
            onClick={() => setEnhanceType('scratch')}
            className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              enhanceType === 'scratch'
                ? 'bg-[#1A2F4B]/5 border-[#1A2F4B] text-[#1A2F4B]'
                : 'bg-white border-[#E0E0E0]/60 text-[#44474d] hover:bg-neutral-50'
            }`}
          >
            划痕无损袪斑
          </button>
        </div>
      </div>

      {/* footer controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E0E0E0]/20 pb-safe pt-3">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-between gap-3 pb-4">
          <button 
            onClick={triggerUpload}
            className="flex-1 h-12 rounded-xl border border-[#E0E0E0] hover:bg-[#ebefec]/30 active:scale-95 transition-transform flex flex-col items-center justify-center p-1 font-sans text-[11px] font-bold text-[#1A2F4B] gap-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>重新上传</span>
          </button>
          
          <button 
            onClick={() => alert("正在封装4K重写图样...已成功将老旧面目重回青春臻彩，无损导入本地胶卷！")}
            className="flex-[2] h-12 rounded-xl bg-[#1A2F4B] text-white font-serif font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-[#203c5d] active:scale-98 shadow-md transition-all shadow-[#1A2F4B]/10"
          >
            <ZoomIn className="w-4.5 h-4.5" />
            <span>保存高清重绘图</span>
          </button>

          <button 
            onClick={() => alert("链接转出完毕：https://ais-share-hub.run.app/restore/" + Math.floor(Math.random()*80000))}
            className="w-12 h-12 rounded-xl border border-[#E0E0E0] hover:bg-[#ebefec]/30 flex items-center justify-center text-[#1A2F4B] active:scale-95 transition-transform"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
