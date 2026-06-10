import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  QrCode, Calculator, Eye, Compass, Calendar, 
  Truck, PlusCircle, Sparkles, ChevronRight, HelpCircle
} from 'lucide-react';
import { ActiveTool } from '../types';

interface ConvenienceViewProps {
  onLaunchTool: (tool: ActiveTool) => void;
  setSelectedConvenienceTool: (toolName: string) => void;
}

export default function ConvenienceView({ onLaunchTool, setSelectedConvenienceTool }: ConvenienceViewProps) {
  const tools = [
    { id: 'qr', name: '二维码生成 & 扫码', icon: QrCode, badge: '免费' },
    { id: 'calc', name: '计算器', icon: Calculator, badge: '免费' },
    { id: 'flashlight', name: '手电筒', icon: Eye, badge: '免费' },
    { id: 'level', name: '水平仪', icon: Compass, badge: '免费' },
    { id: 'ruler', name: '尺子', icon: Calendar, badge: '免费' }, // note: matches mockup icon placeholder
    { id: 'date-calc', name: '日期计算', icon: Calendar, badge: '免费' },
    { id: 'express', name: '快递查询', icon: Truck, badge: '免费' },
  ];

  const handleToolClick = (toolId: string) => {
    setSelectedConvenienceTool(toolId);
    onLaunchTool('convenience-detail');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Title Intro */}
      <section className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1A2F4B]">生活助手</h2>
        <p className="text-sm text-[#74777e] leading-relaxed">极简主义工具集，为您的日常效率而生。</p>
      </section>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className="window-pane-card rounded-xl border border-[#1A2F4B]/10 p-5 flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-inner transition-all hover:bg-white hover:shadow-md cursor-pointer active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#1A2F4B]/5 flex items-center justify-center mb-3 group-hover:bg-[#1A2F4B]/10 group-hover:scale-105 transition-all">
              <tool.icon className="text-[#1A2F4B] w-6 h-6" />
            </div>
            <span className="font-semibold text-sm text-[#1A2F4B] mb-2 leading-tight">{tool.name}</span>
            <span className="border border-[#B22222]/80 text-[#B22222] font-serif text-[10px] px-2 py-0.5 rounded bg-[#B22222]/5 opacity-80 leading-none">
              {tool.badge}
            </span>
          </div>
        ))}

        {/* Add New Tool Placeholder */}
        <div
          onClick={() => alert("墨韵智汇正在精选更多好玩便捷的生活工具（如汇率转换、量角器、白噪音），如果您有希望添加的工具，欢迎联系开发客房！")}
          className="border-2 border-dashed border-[#c4c6ce]/60 rounded-xl p-5 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer active:scale-95 bg-white/20"
        >
          <div className="w-12 h-12 flex items-center justify-center mb-3 text-[#1A2F4B]/60">
            <PlusCircle className="w-8 h-8" />
          </div>
          <span className="font-semibold text-sm text-[#1A2F4B] leading-tight">添加工具</span>
        </div>
      </div>

      {/* Promotional Banner with Fresh Green/Nature Mood */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-2xl h-52 bg-[#2d4a2d] flex items-center px-6 sm:px-8 group shadow-lg border border-[#E0E0E0]/20">
          {/* Content overlay */}
          <div className="z-10 relative space-y-2">
            <h3 className="text-[#F8FBF8] font-bold text-lg font-serif">清新体验，自然高效</h3>
            <p className="text-white/80 text-xs max-w-[240px] leading-relaxed">
              墨韵智汇致力于打造更符合直觉的数字生活，让工具如同自然般呼吸。
            </p>
            <div className="pt-2">
              <button 
                onClick={() => alert("墨韵工具箱采用本地沙盒渲染，免除云端延迟与流量顾虑。配合深色柔光防疲劳绿色系，伴您高效宁静面对一整天。")}
                className="bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs hover:bg-white/20 transition-all font-semibold"
              >
                了解更多
              </button>
            </div>
          </div>
          {/* Fresh Landscape Decoration */}
          <img
            alt="Abstract minimalist green hills"
            className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-50 transition-transform duration-1000 group-hover:scale-102"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
          />
          {/* Gradient Overlay for stability and legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1a]/95 via-[#2d4a2d]/50 to-transparent pointer-events-none" />
          
          {/* Floating Decorative Leaf Element */}
          <div className="absolute right-4 bottom-4 opacity-10 transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
            <Sparkles className="w-32 h-32 text-white" />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
