import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileEdit, Languages, Mic, ListIcon, Image, 
  Sparkles, Trash2, RotateCcw, Smile
} from 'lucide-react';
import { ActiveTool } from '../types';

interface AIToolsViewProps {
  onLaunchTool: (tool: ActiveTool) => void;
}

export default function AIToolsView({ onLaunchTool }: AIToolsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'text' | 'image'>('text');

  const textTools = [
    { id: 'text-generator', name: '文案生成', icon: FileEdit, cost: '1点' },
    { id: 'translator', name: '智能翻译', icon: Languages, cost: '2点' },
    { id: 'voice-trans', name: '语音转文字', icon: Mic, cost: '5点', action: () => alert("语音极速转化中...本设备麦克风已成功联结，后台录入就绪。") },
    { id: 'word-count', name: '字数统计', icon: ListIcon, cost: '免费', action: () => alert("字数智能统计已经融合进“文案生成”工作台左下角的【工具分析】，您可以直接在里面极速查阅！") },
  ];

  const imageTools = [
    { id: 'bg-removal', name: '智能抠图', icon: Image, cost: '5点' },
    { id: 'watermark-removal', name: '去水印', icon: Trash2, cost: '3点' },
    { id: 'photo-restoration', name: '老照片修复', icon: RotateCcw, cost: '10点' },
    { id: 'anime-avatar', name: '动漫头像', icon: Smile, cost: '5点' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Sub-Tab Selection (Text AI vs Image AI) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-[#ebefec] rounded-xl border border-[#c4c6ce]/60 shadow-inner">
          <button
            onClick={() => setActiveSubTab('text')}
            className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeSubTab === 'text'
                ? 'bg-[#021a35] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#021a35]'
            }`}
          >
            文本 AI
          </button>
          <button
            onClick={() => setActiveSubTab('image')}
            className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeSubTab === 'image'
                ? 'bg-[#021a35] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#021a35]'
            }`}
          >
            图像 AI
          </button>
        </div>
      </div>

      {/* Decorative Title */}
      <div className="text-center">
        <p className="text-xs text-[#74777e] tracking-widest uppercase font-bold mb-1">
          Modern Literati Intelligence
        </p>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A2F4B]">墨香数字工坊</h2>
        <div className="w-12 h-0.5 bg-[#B22222] mx-auto mt-2 rounded-full" />
      </div>

      {/* Grid of Tools with Animated Transitions */}
      <div className="min-h-[260px]">
        <AnimatePresence mode="wait">
          {activeSubTab === 'text' ? (
            <motion.div
              key="text-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {textTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => tool.action ? tool.action() : onLaunchTool(tool.id as ActiveTool)}
                  className="group relative bg-[#ffffff] border border-[#c4c6ce]/60 p-5 rounded-2xl hover:border-[#1A2F4B]/50 transition-all duration-300 shadow-[0_10px_35px_-12px_rgba(26,47,75,0.06)] flex flex-col items-center justify-center aspect-[4/3] cursor-pointer active:scale-95"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1A2F4B]/5 flex items-center justify-center mb-3 group-hover:bg-[#1A2F4B]/10 transition-colors">
                    <tool.icon className="text-[#1A2F4B] w-7 h-7" />
                  </div>
                  <span className="font-semibold text-sm text-[#1A2F4B]">{tool.name}</span>
                  <div className="absolute top-2.5 right-2.5 bg-[#B22222] text-[#F8FBF8] text-[9px] font-semibold py-1 px-2 rounded seal-badge shadow-sm leading-none flex items-center justify-center">
                    {tool.cost}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="image-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {imageTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onLaunchTool(tool.id as ActiveTool)}
                  className="group relative bg-[#ffffff] border border-[#c4c6ce]/60 p-5 rounded-2xl hover:border-[#1A2F4B]/50 transition-all duration-300 shadow-[0_10px_35px_-12px_rgba(26,47,75,0.06)] flex flex-col items-center justify-center aspect-[4/3] cursor-pointer active:scale-95"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1A2F4B]/5 flex items-center justify-center mb-3 group-hover:bg-[#1A2F4B]/10 transition-colors">
                    <tool.icon className="text-[#1A2F4B] w-7 h-7" />
                  </div>
                  <span className="font-semibold text-sm text-[#1A2F4B]">{tool.name}</span>
                  <div className="absolute top-2.5 right-2.5 bg-[#B22222] text-[#F8FBF8] text-[9px] font-semibold py-1 px-2 rounded seal-badge shadow-sm leading-none flex items-center justify-center">
                    {tool.cost}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Banner Section */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] shadow-[0_10px_30px_-10px_rgba(26,47,75,0.1)] group max-w-4xl mx-auto border border-[#E0E0E0]/30">
        <img
          alt="Zen landscape banner"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR-yWd4Zi8boJyCpdRLcN3LAKzbrad8zJMABJBPLdv14nXxYUtDDaDpxVF0TpobjcryIjoi4F0hzDTZHrJP3e81-AtH__pzr4aoWHhxYPac5JEnXRfeBSWJ-jCccJ6mHIK2hGlosMh3JugNFFDwus7M4pfEQfXfFtCgKd8vZhQi_yuzzHyEXxuN7bOM1-oSzOLjFro8QvaaM8wJx6j3dOG3QrvlludqMJ82Rg3ASJt__B0vSCN8B-Ntm5J7h-FvPOss2EGnQ7QWvk"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F4B]/80 to-transparent flex flex-col justify-end p-5">
          <span className="text-[#B22222] font-semibold text-[10px] tracking-[0.2em] mb-1 font-sans">
            SPECIAL OFFER
          </span>
          <h3 className="text-[#F8FBF8] font-bold text-lg font-serif mb-1">
            开卷有益：新用户首充享双倍点数
          </h3>
          <p className="text-white/80 text-xs font-sans">探索 AI 灵感，延续文人雅兴</p>
        </div>
      </div>
    </motion.div>
  );
}
