import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Upload, Loader2, Undo2, Redo2, Paintbrush, 
  Trash2, RefreshCcw, Download, Share2, Image, Scan
} from 'lucide-react';
import { ActiveTool, HistoryRecord, UserStats } from '../types';

interface WatermarkRemovalProps {
  onBack: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addHistoryRecord: (record: HistoryRecord) => void;
}

// Pre-uploaded premium placeholder images from Mockup 8/9
const SAMPLE_WATERMARKED = "https://lh3.googleusercontent.com/aida-public/AB6AXuCm-sWudn0uh7ydafHA0e_TTPdzXHf74CZ2ROPcXKORKzW6-QxmenZB4W3YTh3NQOMsQyfYU6yk2x5oweAg7fbdPmhR82i40LV44tiLQRdrtcV4MR_whPjJyvgLeMkjRgg0atwAmqvs9DFvWVNFkxQN-ZybiRCbIkheI68qD4ja8ZWmhKxKwcEjd3MUuYNvNwY9shNXzu4e6Be2FceTirKXsGn5i8hkk_NAOYov-KPLWRJKUXJD3nxLNWf9GngGryNnj3bs71l6IQI";
const SAMPLE_CLEAN = "https://lh3.googleusercontent.com/aida-public/AB6AXuBgNSneVCfTSetspOJyOD2XqYWRINO1P_JikoPmrkJmVuWSzWt6IFfPTgbCrQ962tlRD242_xVEes2kK0SOSxuCGzvUQ4qqfw6FlXEjzSNpb2BJPhoMBP4iD5NaI-pS_8JR3LhirF9KfLnlOEEQ-PGg_6UWxDK8bT6ulVN8KSOhEBuZZv5dsYR_lWYtJMm1BsUURk2FTB32arWvDlxya8YPXQnoufXqzDyNoL2N_ZGYx0eP9UVGH_AaMXGGzUDvrS-lEJpPpl3DY30";

export default function WatermarkRemoval({ onBack, userStats, setUserStats, addHistoryRecord }: WatermarkRemovalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResultMode, setIsResultMode] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
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

  // Load image to draw canvas context
  useEffect(() => {
    if (!image || isResultMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = canvas.parentElement?.clientWidth || 360;
      canvas.height = canvas.parentElement?.clientHeight || 450;
      // Draw background preview
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = image;
  }, [image, isResultMode]);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isResultMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    ctx.strokeStyle = "rgba(178, 34, 34, 0.4)"; // Vermilion highlight
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || isResultMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    isDrawing.current = false;
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setIsResultMode(false);
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUpload = () => {
    document.getElementById('watermark-file-picker')?.click();
  };

  // Run restoration simulation on click
  const handleRemoveWatermark = () => {
    if (!image) {
      alert("请先载入带水印的图像");
      return;
    }
    if (userStats.points < 2) {
      alert("您的可用灵感额度低于本次磨砂要求 (2点)。请先在主页面下侧激励视频中获取补充！");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsResultMode(true);

      // Deduct points & save history
      setUserStats(prev => ({ ...prev, points: Math.max(0, prev.points - 2) }));
      addHistoryRecord({
        id: Math.random().toString(),
        toolName: "AI 图像去水印",
        timestamp: new Date().toISOString(),
        inputDescription: "除去图片内置角标水印",
        pointsCost: 2
      });

      alert("水印除去大功告成！拖动中心滑条可以查阅【去除水印前】与【极致消洗后】的纹理解析！");
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-6 max-w-lg mx-auto pb-10"
    >
      {/* Cost tag: lacquer seal watermark */}
      {!isResultMode && (
        <div className="flex justify-end pr-2 select-none pointer-events-none">
          <div className="relative w-14 h-14 border border-[#B22222] bg-[#B22222]/5 p-2 rounded flex flex-col items-center justify-center rotate-3 border-dashed">
            <span className="text-[9px] text-[#B22222] font-serif font-bold">消 耗</span>
            <span className="text-[#B22222] font-serif font-bold text-sm leading-none mt-1">2点</span>
          </div>
        </div>
      )}

      {/* Main Core interactive Canvas */}
      {!isResultMode ? (
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white border-2 border-dashed border-[#1A2F4B]/20 flex flex-col items-center justify-center hover:bg-[#F8FBF8]/40 transition-colors group cursor-pointer"
          >
            {image ? (
              <div className="relative w-full h-full">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStartDraw}
                  onMouseMove={handleDrawing}
                  onMouseUp={handleStopDraw}
                  onMouseLeave={handleStopDraw}
                  onTouchStart={handleStartDraw}
                  onTouchMove={handleDrawing}
                  onTouchEnd={handleStopDraw}
                  className="w-full h-full touch-none z-10 relative cursor-crosshair"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1A2F4B]/80 backdrop-blur-sm text-[#F8FBF8] text-[10px] font-sans font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow pointer-events-none z-20">
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>红墨涂画覆盖水印</span>
                </div>
              </div>
            ) : (
              <div 
                onClick={handleTriggerUpload}
                className="flex flex-col items-center justify-center p-8 space-y-4 text-center select-none"
              >
                <div className="w-16 h-16 rounded-full bg-[#1A2F4B]/5 flex items-center justify-center text-[#1A2F4B] group-hover:scale-105 group-hover:bg-[#1A2F4B]/10 transition-all">
                  <Image className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif font-bold text-base text-[#1A2F4B]">点击上传要去除水印的图片</p>
                  <p className="text-xs text-[#74777e]">支持 JPG, PNG, WEBP 高清格式</p>
                </div>
              </div>
            )}
          </div>

          {/* Input file picker */}
          <input 
            type="file"
            id="watermark-file-picker"
            accept="image/*"
            className="hidden"
            onChange={handleUploadFile}
          />

          {image && (
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border rounded-2xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1A2F4B] font-sans">画笔粗细</span>
                <span className="px-2 py-0.5 rounded bg-[#1A2F4B]/5 font-mono text-xs text-[#1A2F4B] font-bold">
                  {brushSize}px
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="65"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-1/2 h-1 bg-[#E0E0E0] rounded-full appearance-none cursor-pointer outline-none"
              />
            </motion.div>
          )}

          {/* Start CTA Button */}
          <button
            onClick={handleRemoveWatermark}
            disabled={isProcessing || !image}
            className="w-full h-14 bg-[#1A2F4B] text-white rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 disabled:bg-[#c4c6ce] disabled:shadow-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-serif">AI像素仿样重写、溶解除标中...</span>
              </>
            ) : (
              <>
                <Paintbrush className="w-5 h-5" />
                <span>开始去水印</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* WATERMARK REMOVED RESULT COMPARISON VIEW PORT (Screenshot 8 overlay lookalike) */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Slider comparison box */}
          <div className="w-full flex justify-end gap-2 text-[10px] sm:text-xs text-[#B22222] font-serif font-bold">
            <span className="px-2 py-1 bg-[#B22222]/5 border border-[#B22222]">耗时: 1.8s</span>
            <span className="px-2 py-1 bg-[#B22222]/5 border border-[#B22222]">消耗: 2点</span>
          </div>

          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/5] bg-white rounded-xl border border-[#E0E0E0]/60 shadow-lg overflow-hidden relative select-none"
          >
            {/* result clean vase */}
            <div className="absolute inset-0">
              <img
                src={SAMPLE_CLEAN}
                className="w-full h-full object-cover"
                alt="Watermark removed results"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 bg-orange-800/80 text-white rounded-full px-3 py-1 text-[10px] font-sans font-bold border border-white/20">
                去水印后
              </span>
            </div>

            {/* original vase watermark (clipped left) */}
            <div 
              className="absolute inset-0 w-full h-full bg-white z-10 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={SAMPLE_WATERMARKED}
                className="w-full h-full object-cover"
                alt="Original with watermark"
                style={{ width: containerRef.current?.clientWidth || 360, maxWidth: 'none' }}
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 right-4 bg-black/40 text-white rounded-full px-3 py-1 text-[10px] font-sans font-bold border border-white/20">
                原图
              </span>
            </div>

            {/* comparison indicator */}
            <div 
              className="absolute top-0 bottom-0 z-20 w-0.5 bg-[#1A2F4B] cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleStartDrag}
              onTouchStart={handleStartDrag}
            >
              <div className="w-8 h-8 rounded-full bg-white border border-[#1A2F4B] flex items-center justify-center shadow-md transform -translate-x-1/2 absolute top-1/2 -translate-y-1/2 hover:scale-105 active:scale-95 transition-transform">
                <Scan className="text-[#1A2F4B] w-4.5 h-4.5" />
              </div>
            </div>
          </div>

          {/* Description explanation specs */}
          <div className="space-y-4">
            <div className="p-4 bg-white border rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-[#1A2F4B]/5 flex items-center justify-center flex-shrink-0 text-[#1A2F4B]">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-[#1A2F4B]">处理质量：无痕修补</h4>
                <p className="text-xs text-[#74777e] leading-relaxed">
                  采用自适应像素补样（Deep Inpainting）算法。在剔除文字标饰后完美缝合纤维与纹理细节。
                </p>
              </div>
            </div>
            <div className="p-4 bg-white border rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-[#1A2F4B]/5 flex items-center justify-center flex-shrink-0 text-[#1A2F4B]">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-[#1A2F4B]">识别精度：像素级填充</h4>
                <p className="text-xs text-[#74777e] leading-relaxed">
                  精确定向半透明水印、边缘虚纹，无视繁复底图制序，重构唯美水墨或产品大图。
                </p>
              </div>
            </div>
          </div>

          {/* result actions footer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E0E0E0]/20 pb-safe pt-3">
            <div className="max-w-lg mx-auto px-4 flex items-center justify-between gap-3 pb-4">
              <button 
                onClick={() => {
                  setImage(null);
                  setIsResultMode(false);
                }}
                className="flex-1 h-12 rounded-xl border border-[#E0E0E0] hover:bg-[#ebefec]/30 active:scale-95 transition-transform flex flex-col items-center justify-center p-1 font-sans text-[11px] font-bold text-[#1A2F4B] gap-0.5"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>重新上传</span>
              </button>
              
              <button 
                onClick={() => alert("去水印图谱保存成功！本设备相册已记录不留瑕疵的新底版。")}
                className="flex-[2] h-12 rounded-xl bg-[#1A2F4B] text-white font-serif font-bold text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-[#203c5d] active:scale-98 shadow-md transition-all shadow-[#1A2F4B]/10"
              >
                <Download className="w-4.5 h-4.5" />
                <span>保存去水印图</span>
              </button>

              <button 
                onClick={() => alert("墨韵原意海报分发完成：https://ais-share-hub.run.app/watermark-removal")}
                className="w-12 h-12 rounded-xl border border-[#E0E0E0] hover:bg-[#ebefec]/30 flex items-center justify-center text-[#1A2F4B] active:scale-95 transition-transform"
              >
                <Share2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Simple inline helper
interface LayersProps {
  className?: string;
}
function Layers({ className }: LayersProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}
