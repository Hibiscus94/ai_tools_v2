import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MoreHorizontal, Sparkles, Wand2, Landmark, 
  Copy, FileSignature, RefreshCw, HelpCircle, AlertCircle
} from 'lucide-react';
import { ActiveTool, HistoryRecord, UserStats } from '../types';

interface TextGeneratorProps {
  onBack: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addHistoryRecord: (record: HistoryRecord) => void;
}

const CATEGORIES = ["朋友圈", "爆款推文", "暖心短句", "冷幽默", "电商宣传", "诗词润色"];

export default function TextGenerator({ onBack, userStats, setUserStats, addHistoryRecord }: TextGeneratorProps) {
  const [activeCategory, setActiveCategory] = useState("朋友圈");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleApplyHelper = (helperType: 'expansion' | 'literary') => {
    if (!inputText.trim()) {
      alert("请先输入少许提示，例如: '春雨、新茶'");
      return;
    }
    if (helperType === 'expansion') {
      setInputText(prev => prev + "。请以细腻的观察将本主题展开，描述极尽唯美精致画面，富有叙事代入感。");
    } else {
      setInputText(prev => prev + "。请运用唐诗宋词之古典逸蕴、汉唐笔意，融汇古典名句，做古典化润色。");
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setErrorMessage("请先输入文案创作主题或要求");
      return;
    }
    
    // Check points
    if (userStats.points < 1) {
      alert("您的剩余点数已用完。请先前往个人中心下方观看激励视频/广告获取 3 次免费提取机会！");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setResult("");

    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputText,
          style: activeCategory === "诗词润色" || activeCategory === "朋友圈" ? "高雅古典、赋比兴" : "新潮、爆款、极简力",
          category: activeCategory
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "文意晕染失败");
      }

      setResult(data.text);

      // Deduct 1 point & save history
      setUserStats(prev => ({ ...prev, points: Math.max(0, prev.points - 1) }));
      addHistoryRecord({
        id: Math.random().toString(),
        toolName: `AI文案生成 (${activeCategory})`,
        timestamp: new Date().toISOString(),
        inputDescription: inputText.slice(0, 30) + (inputText.length > 30 ? "..." : ""),
        pointsCost: 1,
        resultText: data.text
      });

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "绘卷文意失败，请检查网络或配置。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert("墨香已一键拷贝到剪贴板，快去发布吧！");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      {/* Category Pills Slider */}
      <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex space-x-3 min-w-max px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#1A2F4B] text-[#F8FBF8] border-[#1A2F4B] shadow-sm'
                  : 'bg-white/40 text-[#1A2F4B] border-[#E0E0E0]/60 hover:bg-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Core Xuan-Zhi input area */}
      <div className="relative group rounded-xl border border-[#E0E0E0]/60 shadow-[0_8px_30px_rgb(26,47,75,0.03)] bg-white overflow-hidden">
        <textarea
          className="w-full h-72 xuan-zhi-texture p-6 text-sm text-[#1A2F4B] placeholder:text-[#c4c6ce]/75 border-none focus:ring-0 focus:outline-none leading-relaxed resize-none font-medium"
          placeholder="请输入您的文案需求，如：写一段关于春天的朋友圈文案"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        {/* Ink Wash corner ornaments */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#1A2F4B]/15 rounded-tl-lg pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#1A2F4B]/15 rounded-br-lg pointer-events-none" />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-[#B22222] font-semibold bg-[#B22222]/5 p-3 rounded-lg border border-[#B22222]/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cost Seal Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-[#B22222]/5 px-4 py-2 border border-[#B22222]/15 rounded shadow-sm hover:scale-102 transition-transform select-none">
          <div className="w-8 h-8 bg-[#B22222] text-[#F8FBF8] text-xs font-serif font-bold rounded flex items-center justify-center pointer-events-none leading-none select-none">
            <span style={{ writingMode: 'vertical-rl' }}>消耗</span>
          </div>
          <span className="text-[#B22222] font-serif font-semibold tracking-wide text-xs">：1点 (灵感)</span>
        </div>
      </div>

      {/* Contextual Utility Helpers */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => handleApplyHelper('expansion')}
          className="bg-white/40 p-4 rounded-xl border border-[#E0E0E0]/60 flex items-center gap-3 hover:bg-white/70 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1A2F4B]/5 flex items-center justify-center text-[#1A2F4B]">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-semibold text-[#1A2F4B]">灵感扩写</span>
        </div>

        <div
          onClick={() => handleApplyHelper('literary')}
          className="bg-white/40 p-4 rounded-xl border border-[#E0E0E0]/60 flex items-center gap-3 hover:bg-white/70 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-[#B22222]/5 flex items-center justify-center text-[#B22222]">
            <FileSignature className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-semibold text-[#1A2F4B]">古风润色</span>
        </div>
      </div>

      {/* Generate Trigger Button */}
      <div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-14 bg-[#1A2F4B] text-[#F8FBF8] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#203c5d] active:scale-98 transition-all shadow-lg hover:shadow-xl shadow-[#1A2F4B]/10 disabled:bg-[#c4c6ce] disabled:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="font-serif">墨色晕染、妙笔成作中...</span>
            </div>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>开始生成文案</span>
            </>
          )}
        </button>
      </div>

      {/* RESULTS DISPLAY AREA */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-5 rounded-2xl bg-white border border-[#E0E0E0]/80 shadow-[0_15px_40px_rgba(26,47,75,0.06)] space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-semibold text-[#1A2F4B] uppercase tracking-wider">AI 创作结果</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#B22222] font-semibold hover:opacity-80 active:scale-95 transition-transform"
              >
                <Copy className="w-4 h-4" />
                <span>复制文案</span>
              </button>
            </div>
            <div className="text-sm text-[#1A2F4B] leading-relaxed whitespace-pre-wrap font-medium font-sans">
              {result}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
