import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Upload, Download, Share2, Scan, 
  Image as ImageIcon, RefreshCw, Layers
} from 'lucide-react';
import { ActiveTool, HistoryRecord, UserStats } from '../types';

interface BackgroundRemovalProps {
  onBack: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addHistoryRecord: (record: HistoryRecord) => void;
}

// Pre-uploaded premium assets matching screenshot 7
const DEFAULT_ORIGINAL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVNtFY2ndDpMcXiaWZ3V_4-_PYATdjEE_7CwbQLg3Ij-QcuJYy8vYe68BwrKTtkACvXARhVrGgVng_0WmPzhxfQbNBZw-1Di7XzSb10dNexjA1T97Hgzl_jtFkXztyMlV-2goLNY7uK7Zr62ucXAWozTMmG0CGSb3tCrYpKNXeIs4CiQzjfHC40eH3nTJXE36H6PbyMaeiTw8aTUBwDxCtxkxXWHHLO_hp1DVjN1DRAL7TdgZKwLttyiLyPjTZhglkaxkXG-oe7qY";
const DEFAULT_RESULT = "https://lh3.googleusercontent.com/aida-public/AB6AXuBytzK6HNybEsYt9MLRCzu_vYIT8NKSC5lbmu-jb6T3flrRlA9XExxdPDy7P8FtVLJz5J5exGap6gkCkI19uXKDNIYaqI1RVvIi0yKPyEO6Uif1POGQvGXJUSPtHD42IHIJjFU-TehnsRCaxa0fWPd8VjiGLuWE9K2d17anbtl7pqE4W_08svTw1kf9Gr_wgXfFhYcMvdkER0rI3sYjgSz_-i9Wn0XadqCvtHSYvQebSH7IaGpZ9QBPlnJV2o06CSpox7D7lvpbVOE";

export default function BackgroundRemoval({ onBack, userStats, setUserStats, addHistoryRecord }: BackgroundRemovalProps) {
  const [originalImage, setOriginalImage] = useState(DEFAULT_ORIGINAL);
  const [resultImage, setResultImage] = useState(DEFAULT_RESULT);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 2400, h: 3200 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Handle slide resize calculation
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

  // Image Upload logic to trigger simulated custom segmentation
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (userStats.points < 5) {
      alert("智能一键抠图消耗 5 点数。您的当前额度不足，可以使用个人中心的观影奖励进行补充！");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setOriginalImage(b64);
      setIsCustomUpload(true);

      // Extract random simulated dimensions
      const randomW = [1200, 1920, 2048, 2400][Math.floor(Math.random() * 4)];
      const randomH = [1600, 1080, 2048, 3200][Math.floor(Math.random() * 4)];
      setDimensions({ w: randomW, h: randomH });

      setTimeout(() => {
        // High fidelity mock result (cut out via simple circular zoom or simulated aesthetic mask)
        setResultImage(b64);
        setIsProcessing(false);

        // Deduct points
        setUserStats(prev => ({ ...prev, points: Math.max(0, prev.points - 5) }));
        addHistoryRecord({
          id: Math.random().toString(),
          toolName: "AI 智能抠图",
          timestamp: new Date().toISOString(),
          inputDescription: "自定义图片抠图",
          pointsCost: 5,
        });

        alert("图像墨染提取大功告成！左右倾动滚棒可细致比对背景分离效果。");
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUpload = () => {
    const el = document.getElementById('bg-file-picker');
    if (el) el.click();
  };

  const handleSave = () => {
    alert("正在编纂切制PNG图层...已成功将扣除后高保真透明底片留存至本地相册！");
  };

  // Pre-animated slide tutorial on mount
  useEffect(() => {
    let t1 = setTimeout(() => setSliderPosition(35), 400);
    let t2 = setTimeout(() => setSliderPosition(65), 900);
    let t3 = setTimeout(() => setSliderPosition(50), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-6 max-w-lg mx-auto pb-10"
    >
      {/* Cost Seal Badges */}
      <div className="w-full flex justify-end gap-2 animate-fade-in select-none">
        <div className="px-2.5 py-1 border border-[#B22222] text-[#B22222] bg-[#B22222]/5 text-[10px] sm:text-xs font-serif font-bold rounded">
          耗时: {isCustomUpload ? "1.8s" : "1.2s"}
        </div>
        <div className="px-2.5 py-1 border border-[#B22222] text-[#B22222] bg-[#B22222]/5 text-[10px] sm:text-xs font-serif font-bold rounded">
          消耗点数: 5点
        </div>
      </div>

      {/* Main Core Comparison Slider Canvas container */}
      <div 
        ref={containerRef}
        className="w-full aspect-[4/3] bg-white rounded-2xl border border-[#E0E0E0]/60 shadow-lg overflow-hidden relative select-none"
      >
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-[#F8FBF8]/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#1A2F4B] animate-spin" />
            <p className="text-xs text-[#1A2F4B] font-serif font-semibold animate-pulse">
              灵笔镂刻中，请静候丹青自成...
            </p>
          </div>
        )}

        {/* transparent grids under layer (only visible for cutouts!) */}
        <div 
          className="absolute inset-0 bg-[#f0f0f0]"
          style={{
            backgroundImage: "conic-gradient(#e0e0e0 90deg, #ffffff 90deg 180deg, #e0e0e0 180deg 270deg, #ffffff 270deg)",
            backgroundSize: "20px 20px"
          }}
        />

        {/* 1. Transparent Segemented/Result Layer on bottom */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
          <img
            alt="AI Segmented Result"
            className={`w-full h-full object-contain z-10 transition-transform ${isCustomUpload ? 'rounded-lg bg-transparent mix-blend-multiply scale-80' : ''}`}
            src={resultImage}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 2. Original reference Layer on top (clipped horizontally) */}
        <div 
          className="absolute inset-0 w-full h-full bg-white z-20 overflow-hidden flex items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            alt="Original reference"
            className="w-full h-full object-contain p-4"
            src={originalImage}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Labels overlay */}
        <div className="absolute bottom-4 left-4 z-30 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-sans font-bold text-[#1A2F4B] border border-[#E0E0E0]/30 shadow-sm pointer-events-none">
          原图
        </div>
        <div className="absolute bottom-4 right-4 z-30 bg-[#1A2F4B]/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-sans font-bold text-[#F8FBF8] border border-white/10 shadow-sm pointer-events-none">
          抠图结果
        </div>

        {/* Dynamic comparison slider handle */}
        <div 
          className="absolute top-0 bottom-0 z-40 w-0.5 bg-[#1A2F4B] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[#1A2F4B] flex items-center justify-center shadow-md transform -translate-x-1/2 absolute top-1/2 -translate-y-1/2 hover:scale-105 active:scale-95 transition-transform">
            <Scan className="text-[#1A2F4B] w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Hidden File Finder */}
      <input 
        id="bg-file-picker"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      {/* Detail Specifications cards */}
      <div className="grid grid-cols-2 gap-4 select-none">
        <div className="bg-[#eef5ee]/30 border border-[#1A2F4B]/10 p-4 rounded-xl flex items-center gap-3">
          <Layers className="text-[#1A2F4B] w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-[#1A2F4B]/70 tracking-wider">背景类型</p>
            <p className="text-[11px] font-semibold text-[#44474d] mt-0.5">PNG 透明格式</p>
          </div>
        </div>
        <div className="bg-[#eef5ee]/30 border border-[#1A2F4B]/10 p-4 rounded-xl flex items-center gap-3">
          <ImageIcon className="text-[#1A2F4B] w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-[#1A2F4B]/70 tracking-wider">图像分辨率</p>
            <p className="text-[11px] font-semibold text-[#44474d] mt-0.5">{dimensions.w} x {dimensions.h} px</p>
          </div>
        </div>
      </div>

      {/* Footer controls floating bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E0E0E0]/20 pb-safe pt-3">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-between gap-3 pb-4">
          <button 
            onClick={handleTriggerUpload}
            className="flex-1 h-12 rounded-xl border border-[#E0E0E0] hover:bg-[#ebefec]/30 active:scale-95 transition-transform flex flex-col items-center justify-center p-1 font-sans text-[11px] font-bold text-[#1A2F4B] gap-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>重新上传</span>
          </button>
          
          <button 
            onClick={handleSave}
            className="flex-[2] h-12 rounded-xl bg-[#1A2F4B] text-white font-serif font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-[#203c5d] active:scale-98 shadow-md transition-all shadow-[#1A2F4B]/10"
          >
            <Download className="w-4.5 h-4.5" />
            <span>保存至相册</span>
          </button>

          <button 
            onClick={() => alert("画卷海报链接已成功转义：https://ais-share-hub.run.app/segment/" + Math.floor(Math.random()*9000000))}
            className="w-12 h-12 rounded-xl border border-[#E0E0E0] hover:bg-[#ebefec]/30 flex items-center justify-center text-[#1A2F4B] active:scale-95 transition-transform"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
