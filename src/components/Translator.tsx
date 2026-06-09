import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Copy, Volume2, Languages, 
  HelpCircle, AlertCircle, RefreshCw, Sparkles, Check
} from 'lucide-react';
import { ActiveTool, HistoryRecord, UserStats } from '../types';

interface TranslatorProps {
  onBack: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addHistoryRecord: (record: HistoryRecord) => void;
}

export default function Translator({ onBack, userStats, setUserStats, addHistoryRecord }: TranslatorProps) {
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [isChToEn, setIsChToEn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const handleSwap = () => {
    setIsChToEn(prev => !prev);
    setInputText("");
    setResultText("");
    setErrorMessage("");
  };

  const handleCopyInput = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    alert("原件复制成功！");
  };

  const handleCopyOutput = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    alert("译作一键抄录到裁剪栏！");
  };

  // Speaks output text aloud using Browser WebSpeech TTS API
  const handleSpeak = () => {
    if (!resultText) return;
    const utterance = new SpeechSynthesisUtterance(resultText);
    utterance.lang = isChToEn ? "en-US" : "zh-CN";
    window.speechSynthesis.speak(utterance);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setErrorMessage("请先输入翻译原文");
      return;
    }

    if (userStats.points < 2) {
      alert("您的点数低于本重工具消耗标准（2点）。请在“个人中心”观看广告恢复额度！");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setResultText("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          from: isChToEn ? "中文" : "English",
          to: isChToEn ? "English" : "中文"
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "信雅达翻译请求失败");
      }

      setResultText(data.text);

      // Deduct 2 points & save history
      setUserStats(prev => ({ ...prev, points: Math.max(0, prev.points - 2) }));
      addHistoryRecord({
        id: Math.random().toString(),
        toolName: `AI信雅达翻译 (${isChToEn ? "中→英" : "英→中"})`,
        timestamp: new Date().toISOString(),
        inputDescription: inputText.slice(0, 30) + (inputText.length > 30 ? "..." : ""),
        pointsCost: 2,
        resultText: data.text
      });

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "翻译出现未知异常，请检查API密钥配给。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      {/* Source Input Card */}
      <div className="bg-white border border-[#E0E0E0]/60 rounded-2xl overflow-hidden shadow-sm transition-all focus-within:border-[#1A2F4B]/50">
        <div className="px-4 py-3 bg-[#eef5ee]/50 border-b border-[#E0E0E0]/40 flex justify-between items-center">
          <span className="text-xs font-semibold text-[#1A2F4B] tracking-wider uppercase font-sans">
            {isChToEn ? "源语言 (中文原文)" : "源语言 (English source)"}
          </span>
          <button 
            type="button" 
            onClick={handleCopyInput}
            className="text-[#74777e] hover:text-[#1A2F4B] transition-colors p-1"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <textarea
          className="w-full h-36 p-5 bg-transparent border-none focus:ring-0 focus:outline-none text-sm leading-relaxed text-[#1A2F4B] placeholder:text-[#c4c6ce]/75 resize-none font-medium"
          placeholder={isChToEn ? "在此输入需要精密翻译的中文内容" : "Enter English texts here to interpret into elegant Chinese"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {/* Dynamic Language Swapper Button */}
      <div className="flex items-center justify-center gap-4 my-2 select-none">
        <div 
          onClick={handleSwap}
          className="px-6 py-2 bg-white border border-[#E0E0E0]/60 rounded-full flex items-center gap-4 hover:border-[#1A2F4B] transition-all cursor-pointer shadow-sm group active:scale-95"
        >
          <span className="font-serif font-bold text-sm text-[#1A2F4B] w-4 text-center select-none">
            {isChToEn ? "中" : "英"}
          </span>
          <div className="w-7 h-7 rounded-full bg-[#1A2F4B]/5 flex items-center justify-center text-[#1A2F4B] group-hover:bg-[#1A2F4B]/10 transition-colors pointer-events-none">
            <RefreshCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
          </div>
          <span className="font-serif font-bold text-sm text-[#1A2F4B] w-4 text-center select-none">
            {isChToEn ? "英" : "中"}
          </span>
        </div>
      </div>

      {/* Destination Translation Display */}
      <div className="relative bg-white border border-[#E0E0E0]/60 rounded-2xl overflow-hidden shadow-sm min-h-[175px]">
        {/* Subtle Watermark when empty */}
        {!resultText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(26,47,75,0.02)_0%,transparent_70%)] flex items-center justify-center">
              <span className="font-serif text-sm text-[#c4c6ce] italic font-semibold tracking-widest">
                墨韵智汇 · 虚位以待
              </span>
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-[#eef5ee]/50 border-b border-[#E0E0E0]/40 flex justify-between items-center">
          <span className="text-xs font-semibold text-[#1A2F4B] tracking-wider uppercase font-sans">
            {isChToEn ? "译作结果 (Translation)" : "译作结果 (中文呈现)"}
          </span>
          <div className="flex gap-2">
            {resultText && (
              <>
                <button 
                  onClick={handleSpeak}
                  className="text-[#74777e] hover:text-[#1A2F4B] transition-colors p-1"
                  title="听读译作"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCopyOutput}
                  className="text-[#74777e] hover:text-[#1A2F4B] transition-colors p-1"
                  title="拷贝译作"
                >
                  {hasCopied ? <Check className="w-4 h-4 text-[#B22222]" /> : <Copy className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-5 text-sm text-[#1A2F4B] font-medium leading-relaxed font-sans min-h-[120px] whitespace-pre-wrap select-text">
          {resultText}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-[#B22222] font-semibold bg-[#B22222]/5 p-3 rounded-lg border border-[#B22222]/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Consumption Tag Seal (Right side of screen, matching screenshot 6) */}
      <div className="flex justify-end pr-2 select-none pointer-events-none">
        <div className="flex flex-col items-center justify-center py-2 px-1 border-2 border-[#B22222] text-[#B22222] font-serif font-bold text-xs bg-[#B22222]/5 tracking-widest scale-95 opacity-80 leading-3 rounded select-none">
          消<br/>耗<br/>两<br/>点
        </div>
      </div>

      {/* Action Submit Area */}
      <div className="pt-2">
        <button
          onClick={handleTranslate}
          disabled={isLoading}
          className="w-full h-14 bg-[#1A2F4B] text-[#F8FBF8] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#203c5d] active:scale-98 transition-all shadow-lg shadow-[#1A2F4B]/10 disabled:bg-[#c4c6ce] disabled:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="font-serif">信雅达转化精磨中...</span>
            </div>
          ) : (
            <>
              <Languages className="w-5 h-5" />
              <span>立即翻译</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
