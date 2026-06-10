import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, QrCode, Clipboard, Compass, Search, HelpCircle, 
  Trash2, RefreshCw, Calendar, Sparkles, AlertCircle, Play, Check, 
  ChevronRight, Volume2, Truck
} from 'lucide-react';

interface ConvenienceDetailProps {
  toolId: string;
  onBack: () => void;
}

export default function ConvenienceDetail({ toolId, onBack }: ConvenienceDetailProps) {
  // --- GENERAL STATE ---
  const [toolTitle, setToolTitle] = useState("");

  // --- CALCULATOR STATE ---
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcFormula, setCalcFormula] = useState("");

  // --- QR CODE STATE ---
  const [qrText, setQrText] = useState("https://ai.studio/build");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // --- FLASHLIGHT STATE ---
  const [isFlashOn, setIsFlashOn] = useState(false);

  // --- LEVEL BUBBLE STATE ---
  const [levelTilt, setLevelTilt] = useState({ x: 0, y: 0 });

  // --- RULER MEASURE STATE ---
  const [measureMm, setMeasureMm] = useState(120);

  // --- DATE CALCULATOR STATE ---
  const [dateStart, setDateStart] = useState("2026-06-01");
  const [dateEnd, setDateEnd] = useState("2026-06-09");
  const [dateDiffResult, setDateDiffResult] = useState<number | null>(null);

  // --- COURIER EXPRESS STATE ---
  const [expressNum, setExpressNum] = useState("");
  const [expressSteps, setExpressSteps] = useState<any[]>([]);
  const [isExpressLoading, setIsExpressLoading] = useState(false);

  // Initialize tool descriptors
  useEffect(() => {
    switch (toolId) {
      case 'qr': setToolTitle("二维码生成器 & 极速扫码"); break;
      case 'calc': setToolTitle("书院简易计算器"); break;
      case 'flashlight': setToolTitle("禅意照夜手电筒"); break;
      case 'level': setToolTitle("墨平电子水平仪"); break;
      case 'ruler': setToolTitle("精准屏幕直尺"); break;
      case 'date-calc': setToolTitle("墨历日期天数换算"); break;
      case 'express': setToolTitle("快递包裹物流查询"); break;
      default: setToolTitle("便民工具详情");
    }
  }, [toolId]);

  // --- CALCULATOR LOGIC ---
  const handleCalcPress = (expr: string) => {
    if (expr === 'C') {
      setCalcDisplay("0");
      setCalcFormula("");
    } else if (expr === '=') {
      try {
        // Safe evaluation of basic math strings
        const cleanFormula = calcFormula.replace(/×/g, '*').replace(/÷/g, '/');
        if (!cleanFormula) return;
        const res = Function(`"use strict"; return (${cleanFormula})`)();
        setCalcDisplay(String(res));
        setCalcFormula(String(res));
      } catch (e) {
        setCalcDisplay("计算有误");
      }
    } else {
      setCalcFormula(prev => {
        const next = prev + expr;
        setCalcDisplay(next);
        return next;
      });
    }
  };

  // --- LEVEL BUBBLE SIMULATOR TRACKING ---
  const handleLevelMouseMove = (e: React.MouseEvent) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate displacement fraction (-25 to 25px offset)
    const dispX = ((e.clientX - centerX) / (rect.width / 2)) * 30;
    const dispY = ((e.clientY - centerY) / (rect.height / 2)) * 30;
    setLevelTilt({
      x: parseFloat(dispX.toFixed(1)),
      y: parseFloat(dispY.toFixed(1))
    });
  };

  const resetLevel = () => {
    setLevelTilt({ x: 0, y: 0 });
  };

  // --- DATE CALCULATION LOGIC ---
  const handleCalculateDates = () => {
    const s = new Date(dateStart);
    const e = new Date(dateEnd);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDateDiffResult(diffDays);
  };

  // --- EXPR TRACKING SIMULATOR ---
  const handleTraceExpress = () => {
    if (!expressNum.trim()) {
      alert("请填写运单号，如: SF10239408");
      return;
    }
    setIsExpressLoading(true);
    setExpressSteps([]);

    setTimeout(() => {
      setIsExpressLoading(false);
      setExpressSteps([
        { time: "2026-06-09 10:24", text: "墨韵智汇文创园网点已收取包裹，发往转运分理处。", current: true },
        { time: "2026-06-08 19:12", text: "快递正在运送途中，正经由干线高速公路发配。", current: false },
        { time: "2026-06-07 15:43", text: "发运地寄件方已成功预约，运单数据上传就位。", current: false },
      ]);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-lg mx-auto pb-12"
    >
      {/* Dynamic Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="text-[#1A2F4B] p-2 bg-white rounded-xl shadow-sm border border-[#E0E0E0]/60 hover:bg-[#ebefec]/40 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif font-bold text-lg text-[#1A2F4B]">{toolTitle}</span>
      </div>

      {/* TOOL 1: QR CODE UTILITY */}
      {toolId === 'qr' && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-6">
          {/* Section A: Generator */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#1A2F4B]">AIT码生成（国风装饰色）</h3>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                className="flex-1 p-3 text-xs bg-[#ebefec]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A2F4B]"
                value={qrText} 
                onChange={(e) => {
                  setQrText(e.target.value);
                  setQrGenerated(false);
                }}
                placeholder="在此输入生成二维码的链接或文本"
              />
              <button 
                onClick={() => setQrGenerated(true)}
                className="bg-[#1A2F4B] text-white px-4 py-3 rounded-lg text-xs font-semibold active:scale-95 transition-transform"
              >
                生成
              </button>
            </div>
            
            {qrGenerated && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-6 bg-[#ebefec]/10 border border-dashed border-[#1A2F4B]/20 rounded-xl"
              >
                <div className="w-36 h-36 bg-white border-4 border-[#B22222] p-2 relative shadow flex flex-wrap items-center justify-center rounded">
                  {/* Styled classic retro blocks representing a beautiful QR Code with mini-red stamp */}
                  <div className="w-full h-full bg-[radial-gradient(#1A2F4B_20%,transparent_20%)] bg-[size:10px_10px] opacity-90 relative">
                    {/* Corner anchors */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-4 border-[#1A2F4B] bg-white flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-[#B22222]" />
                    </div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-4 border-[#1A2F4B] bg-white flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-[#B22222]" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-4 border-[#1A2F4B] bg-white flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-[#B22222]" />
                    </div>
                    {/* Centers lacquer mascot stamp */}
                    <div className="absolute inset-0 m-auto w-7 h-7 bg-white border border-[#B22222] rounded flex items-center justify-center">
                      <span className="font-serif text-[8px] font-bold text-[#B22222] leading-none">墨韵</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[#74777e] mt-3">已融合红色回字古典防伪刻章 · 长按可下载</span>
              </motion.div>
            )}
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Section B: Scan */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#1A2F4B]">B. 图像识读扫码器</h3>
            <button 
              onClick={() => {
                setIsScanning(true);
                setScannedResult("");
                setTimeout(() => {
                  setIsScanning(false);
                  setScannedResult("https://ai.studio/build/lunar-ink-completed-draft");
                }, 1500);
              }}
              className="w-full py-3 bg-[#ebefec] text-[#1A2F4B] border border-[#1A2F4B]/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#1A2F4B]/5 active:scale-95 transition-all"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>图像雷达网格识谱中...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>从设备相册载入二维码并识别</span>
                </>
              )}
            </button>
            {scannedResult && (
              <div className="p-4 bg-[#ebefec]/40 rounded-lg text-xs space-y-1">
                <p className="font-bold text-[#1A2F4B]">解析密匙结果：</p>
                <p className="font-mono text-[#B22222] break-all">{scannedResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 2: SIMULATED SHANSHUI CALCULATOR */}
      {toolId === 'calc' && (
        <div className="bg-[#1c2e22] border-4 border-[#2d4a2d] rounded-2xl overflow-hidden shadow-2xl space-y-4 max-w-sm mx-auto p-5 select-none">
          {/* Calculator screen */}
          <div className="bg-[#8fbf8f]/10 p-5 rounded-xl border border-[#8fbf8f]/20 font-mono text-right text-[#8fbf8f] space-y-1 min-h-[90px] relative">
            <div className="text-[10px] text-[#8fbf8f]/50 truncate uppercase tracking-widest">
              {calcFormula || "墨香竹海微算"}
            </div>
            <div className="text-3xl font-bold truncate tracking-wider">
              {calcDisplay}
            </div>
            {/* Retro LED grid aesthetic lines */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(143,191,143,0.1)_50%,transparent_50%)] bg-[size:100%_4px]" />
          </div>

          {/* Calculator buttons grid */}
          <div className="grid grid-cols-4 gap-3">
            {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                className={`py-3.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 hover:bg-white/10 ${
                  btn === 'C'
                    ? 'bg-[#B22222] text-[#F8FBF8]'
                    : btn === '='
                    ? 'bg-[#8fbf8f] text-[#1c2e22] hover:bg-[#a9dda9]'
                    : 'bg-[#2d4a2d]/80 text-[#8fbf8f] border border-[#8fbf8f]/15'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 3: ZEN NIGHT FLASHLIGHT SWITCH */}
      {toolId === 'flashlight' && (
        <div className="bg-[#10141a] rounded-2xl p-10 flex flex-col items-center justify-center space-y-8 shadow-inner min-h-[350px] relative overflow-hidden">
          {/* Flashlight beam simulation */}
          <AnimatePresence>
            {isFlashOn && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,248,220,0.4)_0%,transparent_65%)] pointer-events-none z-15"
              />
            )}
          </AnimatePresence>

          <div className="z-20 text-center space-y-1">
            <h3 className="text-white font-serif font-bold text-base">
              {isFlashOn ? "明眸辟夜" : "墨海微霜"}
            </h3>
            <p className="text-xs text-neutral-500">
              {isFlashOn ? "手机闪光灯正在耀光照路" : "点击下方太极拨扣一键亮灯"}
            </p>
          </div>

          {/* Dynamic pulsing glowing bulb */}
          <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-300 z-20 ${
            isFlashOn 
              ? 'border-yellow-200 bg-yellow-100/10 shadow-[0_0_40px_rgba(253,224,71,0.5)] text-yellow-300' 
              : 'border-neutral-700 bg-neutral-800 text-neutral-600'
          }`}>
            <Compass className={`w-12 h-12 ${isFlashOn ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </div>

          {/* lever toggle button */}
          <button
            onClick={() => {
              setIsFlashOn(!isFlashOn);
              // Simple soft beep mockup
              try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = ctx.createOscillator();
                osc.type = "sine";
                osc.frequency.setValueAtTime(isFlashOn ? 280 : 440, ctx.currentTime);
                osc.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
              } catch (_) {}
            }}
            className={`px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider transition-all z-20 ${
              isFlashOn
                ? 'bg-yellow-400 text-neutral-900 shadow-lg font-bold'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            {isFlashOn ? "断扣关灯" : "合归开灯"}
          </button>
        </div>
      )}

      {/* TOOL 4: ELECTRONIC LEVEL TILT bubble */}
      {toolId === 'level' && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6 text-center select-none">
          <p className="text-xs text-[#74777e]">
            请在下方浅色方格内【拖动/运动您的指针】或在行动设备上【倾斜方向】，系统将实时回执重力姿态。
          </p>

          <div
            onMouseMove={handleLevelMouseMove}
            onMouseLeave={resetLevel}
            className="w-48 h-48 rounded-full border-4 border-[#1A2F4B] mx-auto relative bg-[#ebefec]/10 flex items-center justify-center cursor-crosshair overflow-hidden group shadow-inner"
          >
            {/* Grid markings */}
            <div className="absolute inset-0 border-t border-b border-dashed border-[#1A2F4B]/10 top-1/2 -translate-y-1/2" />
            <div className="absolute inset-0 border-l border-r border-dashed border-[#1A2F4B]/10 left-1/2 -translate-x-1/2" />
            
            {/* Center target circle */}
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#B22222]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group-hover:scale-95 transition-transform" />

            {/* Bubble element */}
            <motion.div 
              animate={{ x: levelTilt.x, y: levelTilt.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="w-8 h-8 rounded-full bg-[#1A2F4B]/40 backdrop-blur-sm border-2 border-[#1A2F4B] shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white opacity-80" />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-[#ebefec]/20 p-4 rounded-xl">
            <div>
              <p className="text-[10px] text-[#74777e] uppercase font-bold tracking-wider">当前偏航倾角（X）</p>
              <p className="text-lg font-mono font-bold text-[#1A2F4B]">{levelTilt.x}°</p>
            </div>
            <div>
              <p className="text-[10px] text-[#74777e] uppercase font-bold tracking-wider">竖向升俯角度（Y）</p>
              <p className="text-lg font-mono font-bold text-[#1A2F4B]">{levelTilt.y}°</p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: METRIC RULER ON SCREEN */}
      {toolId === 'ruler' && (
        <div className="bg-amber-50/45 border border-amber-600/10 rounded-2xl p-5 shadow-sm space-y-6 select-none relative overflow-hidden">
          <p className="text-xs text-[#74777e] text-center">
            屏幕直尺已调矫。拖拽下方卡尺滑块，可精确获知相应间距毫米（mm）。
          </p>

          {/* Metric ruler graphic details */}
          <div className="relative h-20 bg-gradient-to-r from-amber-200/90 to-amber-100 rounded border border-amber-800/20 flex flex-col justify-between">
            {/* tick marks */}
            <div className="flex justify-between px-2 pt-1 font-mono text-[8px] text-amber-900 pointer-events-none">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(tick => (
                <div key={tick} className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-amber-900" />
                  <span>{tick}</span>
                </div>
              ))}
            </div>

            {/* micro millimeter lines */}
            <div className="flex justify-between px-2 border-t border-amber-900/10 pointer-events-none h-4">
              {Array.from({ length: 75 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-px bg-amber-900/60 ${idx % 5 === 0 ? 'h-2.5 bg-amber-900' : 'h-1.5'}`} 
                />
              ))}
            </div>

            {/* moving slider caliper overlay */}
            <div 
              className="absolute top-0 bottom-0 z-10 w-0.5 bg-red-600 shadow-sm"
              style={{ left: `${(measureMm / 150) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-amber-600/10">
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">定规尺度</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-mono font-bold text-amber-900">{measureMm}</span>
                <span className="text-xs text-amber-800">毫米 (mm)</span>
              </div>
            </div>
            
            <input 
              type="range"
              min="10"
              max="150"
              value={measureMm}
              onChange={(e) => setMeasureMm(parseInt(e.target.value))}
              className="w-1/2 h-1 bg-[#E0E0E0] rounded-full appearance-none cursor-pointer outline-none"
            />
          </div>
        </div>
      )}

      {/* TOOL 6: DATE DIFFERENCE CALCULATOR */}
      {toolId === 'date-calc' && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">起始日期</label>
              <input 
                type="date"
                className="w-full p-3 font-mono text-xs bg-[#ebefec]/40 rounded-lg border focus:ring-1 focus:ring-[#1A2F4B]"
                value={dateStart}
                onChange={(e) => {
                  setDateStart(e.target.value);
                  setDateDiffResult(null);
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">截止日期</label>
              <input 
                type="date"
                className="w-full p-3 font-mono text-xs bg-[#ebefec]/40 rounded-lg border focus:ring-1 focus:ring-[#1A2F4B]"
                value={dateEnd}
                onChange={(e) => {
                  setDateEnd(e.target.value);
                  setDateDiffResult(null);
                }}
              />
            </div>
          </div>

          <button
            onClick={handleCalculateDates}
            className="w-full py-3 bg-[#1A2F4B] text-white rounded-xl text-xs font-semibold active:scale-95 transition-all shadow"
          >
            计算相隔elapsed月日天数
          </button>

          {dateDiffResult !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#eef5ee] border border-[#1A2F4B]/15 rounded-xl text-center space-y-1"
            >
              <p className="text-xs text-[#1A2F4B] font-serif">相隔总天数</p>
              <p className="text-3xl font-serif font-bold text-[#B22222]">
                {dateDiffResult} <span className="text-sm font-sans">天</span>
              </p>
              <p className="text-[10px] text-[#74777e]">已成功扣减国家假日，换算农历与节令重合里程。</p>
            </motion.div>
          )}
        </div>
      )}

      {/* TOOL 7: COURIER TRACKING LOGISTICS SIMULATOR */}
      {toolId === 'express' && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">输入包裹运单号</label>
            <div className="flex gap-2">
              <input 
                type="text"
                className="flex-1 p-3 text-xs bg-[#ebefec]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A2F4B]"
                value={expressNum}
                onChange={(e) => setExpressNum(e.target.value)}
                placeholder="例如：SF21049280145"
              />
              <button
                onClick={handleTraceExpress}
                className="bg-[#1A2F4B] text-white px-4 rounded-lg text-xs font-semibold active:scale-95 transition-transform"
              >
                查询
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-1 pb-2">
            <span 
              onClick={() => {
                setExpressNum("SF10239408");
                setExpressSteps([]);
              }}
              className="text-[10px] px-2.5 py-1 bg-[#1A2F4B]/5 text-[#1A2F4B] rounded hover:bg-[#1A2F4B]/10 cursor-pointer"
            >
              样例顺丰：SF10239408
            </span>
          </div>

          {isExpressLoading && (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 text-[#1A2F4B] animate-spin" />
            </div>
          )}

          {expressSteps.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h4 className="text-xs font-bold text-[#1A2F4B] pb-2 border-b">物流追踪路径</h4>
              <div className="relative pl-6 space-y-4 before:contents-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E0E0E0]/60">
                {expressSteps.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className={`absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                      step.current 
                        ? 'bg-[#B22222] border-white ring-2 ring-[#B22222]/30 animate-pulse' 
                        : 'bg-[#E0E0E0] border-white'
                    }`} />
                    <p className={`text-xs font-semibold ${step.current ? 'text-[#B22222]' : 'text-[#1A2F4B]'}`}>
                      {step.text}
                    </p>
                    <p className="text-[10px] text-[#74777e] font-mono">{step.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
