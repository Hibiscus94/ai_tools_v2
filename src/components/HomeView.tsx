import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, Bell, User, Search, Mic, ArrowRight, Sparkles, 
  Sparkle, PenTool, Image, Languages, QrCode, Calendar, 
  FileText, Star, AlertCircle, TrendingUp, Grid
} from 'lucide-react';
import { ActiveTab, ActiveTool } from '../types';

interface HomeViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onLaunchTool: (tool: ActiveTool) => void;
  userPoints: number;
}

export default function HomeView({ onNavigateTab, onLaunchTool, userPoints }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredTools = [
    { id: 'text-generator', name: '智能润色', icon: PenTool, desc: '妙笔生花' },
    { id: 'bg-removal', name: '一键抠图', icon: Image, desc: '去本留真' },
    { id: 'translator', name: '信雅互译', icon: Languages, desc: '信雅达翻译' },
    { id: 'watermark-removal', name: '美化扫码', icon: QrCode, desc: '艺术去噪' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (query.includes('文案') || query.includes('书') || query.includes('写') || query.includes('润色')) {
      onLaunchTool('text-generator');
    } else if (query.includes('译') || query.includes('英') || query.includes('中') || query.includes('translate')) {
      onLaunchTool('translator');
    } else if (query.includes('抠') || query.includes('底') || query.includes('背景')) {
      onLaunchTool('bg-removal');
    } else if (query.includes('水') || query.includes('印')) {
      onLaunchTool('watermark-removal');
    } else if (query.includes('照') || query.includes('修') || query.includes('旧')) {
      onLaunchTool('photo-restoration');
    } else if (query.includes('头') || query.includes('漫') || query.includes('动漫')) {
      onLaunchTool('anime-avatar');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-[#1A2F4B]/[0.01] rounded-xl pointer-events-none overflow-hidden">
          <div className="absolute -right-4 -top-8 w-32 h-32 bg-[#1A2F4B]/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="relative flex items-center bg-white/95 border border-[#E0E0E0]/60 rounded-xl px-4 py-3 transition-all duration-300 focus-within:ring-1 focus-within:ring-[#1A2F4B]/20 shadow-[0_10px_30px_-10px_rgba(26,47,75,0.06)]">
          <Search className="text-[#92030f]/60 mr-3 w-5 h-5 flex-shrink-0" />
          <input
            className="w-full bg-transparent border-none focus:outline-none text-base placeholder:text-[#c4c6ce] text-[#181c1b] font-medium"
            placeholder="搜索AI文案、抠图、去水印或工具..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Mic 
            onClick={() => alert("语音检索正在筹备中，您可输入文字直接检索工具")}
            className="text-[#1A2F4B] ml-3 cursor-pointer hover:scale-105 active:scale-95 transition-transform w-5 h-5" 
          />
        </div>
      </form>

      {/* Hero: Featured Tool Card */}
      <section className="relative">
        <div 
          onClick={() => onLaunchTool('text-generator')}
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer shadow-[0_10px_30px_-10px_rgba(26,47,75,0.12)] border border-[#E0E0E0]/40"
        >
          {/* Shanshui Ethereal Hero Image */}
          <img 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQAhuZGczkxBwToUEPtpQhMyd1cx1eSefCJh2kv-MdqqxO-wDUlaK4bRBafPA9rY6ZNM6f2DvsEKfnuDDrICbJJl8HGjHrQTcmZrVn5C5XDd4qdKTR8qaTdqPgXa5IikycahMy4JGxVTw_nIWnlemT4wh6GIiCHsQOg2_yizpk4CfhL7X1T_I_FI6xQMuTmIxlNT4A_4sdDpv-grRO-ehemQucjro11qa3cyJzfyAkxv741zoCMqXUct6bqMCWErSCg3yr4gbY5DU" 
            alt="Misty ink landscape background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021a35]/85 via-[#021a35]/40 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
            <div className="inline-flex items-center px-2.5 py-0.5 bg-[#B22222] text-[10px] tracking-widest uppercase rounded-full w-fit mb-2 font-bold">
              精选推荐
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mb-1 tracking-wide">AI 智能文案专家</h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xs mb-4">融合古典辞藻与现代逻辑，为您的创作注入核心灵魂。</p>
            <button className="flex items-center gap-2 bg-[#F8FBF8] text-[#1A2F4B] px-4 py-2 rounded-xl text-xs font-semibold w-fit transition-all hover:bg-white active:scale-95 shadow">
              <span>立即体验</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Common Tools Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[#1A2F4B] font-semibold text-base flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#B22222] rounded-full" />
            常用工具
          </h3>
          <span 
            onClick={() => onNavigateTab('ai-tools')}
            className="text-xs text-[#c4c6ce] hover:text-[#1A2F4B] transition-colors cursor-pointer"
          >
            查看全部
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {featuredTools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => onLaunchTool(tool.id as ActiveTool)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-full aspect-square bg-white border border-[#E0E0E0]/60 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:border-[#1A2F4B]/50 group-hover:bg-[#1A2F4B]/5 shadow-sm">
                <tool.icon className="text-[#1A2F4B] w-6 h-6 transition-transform group-hover:scale-105" />
              </div>
              <span className="text-xs text-[#181c1b] font-medium text-center truncate w-full">{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories: AI 热门 & 便民常用 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Hot */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[#E0E0E0]/40 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-[#E0E0E0]/20 pb-2">
            <TrendingUp className="text-[#B22222] w-5 h-5" />
            <h3 className="font-semibold text-base text-[#1A2F4B]">AI 热门排行</h3>
          </div>
          <div className="space-y-4">
            <div 
              onClick={() => onLaunchTool('text-generator')}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg text-[#B22222] italic font-semibold">01</span>
                <div>
                  <p className="text-sm font-semibold text-[#181c1b] group-hover:text-[#B22222] transition-colors">角色扮演对话</p>
                  <p className="text-xs text-[#c4c6ce] mt-0.5">与古今圣贤深度对谈，赋能创作</p>
                </div>
              </div>
              <ArrowRight className="text-[#c4c6ce] w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="w-full h-px bg-[#E0E0E0]/20" />

            <div 
              onClick={() => onLaunchTool('anime-avatar')}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg text-[#1A2F4B]/30 group-hover:text-[#B22222] italic font-semibold">02</span>
                <div>
                  <p className="text-sm font-semibold text-[#181c1b] group-hover:text-[#B22222] transition-colors">水墨风格绘画</p>
                  <p className="text-xs text-[#c4c6ce] mt-0.5">生成山水墨染写意国风动漫头像</p>
                </div>
              </div>
              <ArrowRight className="text-[#c4c6ce] w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Everyday Convenience */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[#E0E0E0]/40 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-[#E0E0E0]/20 pb-2">
            <Grid className="text-[#1A2F4B] w-5 h-5" />
            <h3 className="font-semibold text-base text-[#1A2F4B]">便民常用</h3>
          </div>
          <div className="space-y-4">
            <div 
              onClick={() => {
                onLaunchTool('convenience-detail');
              }}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2F4B]/5 flex items-center justify-center text-[#1A2F4B]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#181c1b] group-hover:text-[#1A2F4B] transition-colors">万年历与节气</p>
                  <p className="text-xs text-[#c4c6ce] mt-0.5">黄历宜忌与二十四节气详情查询</p>
                </div>
              </div>
              <ArrowRight className="text-[#c4c6ce] w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="w-full h-px bg-[#E0E0E0]/20" />

            <div 
              onClick={() => alert("目前支持：计算器、二维码、手电筒、尺子等全套极简常用轻工具，立即前往“便民工具”体验")}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A2F4B]/5 flex items-center justify-center text-[#1A2F4B]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#181c1b] group-hover:text-[#1A2F4B] transition-colors">多功能电子工具</p>
                  <p className="text-xs text-[#c4c6ce] mt-0.5">水平仪、尺子与汇率速查极速加载</p>
                </div>
              </div>
              <ArrowRight className="text-[#c4c6ce] w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Member Ad Banner */}
      <section>
        <div 
          onClick={() => onNavigateTab('profile')}
          className="relative w-full p-4 sm:p-5 bg-white border border-[#E0E0E0]/60 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#1A2F4B]/30 hover:shadow-md transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#1A2F4B]/5 rounded-tr-2xl translate-x-4 -translate-y-4" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#1A2F4B]/5 rounded-bl-2xl -translate-x-2 translate-y-2" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#B22222]/10 flex items-center justify-center text-[#B22222] shadow-[0_0_15px_rgba(178,34,34,0.1)]">
                <Star className="w-5 h-5 fill-[#B22222]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-[#181c1b]">墨韵会员享无限创作</h4>
                <p className="text-xs text-[#c4c6ce] mt-0.5">解锁超高清晰度无损头像生成及极速排队</p>
              </div>
            </div>
            <button className="bg-[#1A2F4B] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-transform active:scale-95 group-hover:shadow hover:bg-[#203c5d]">
              了解会员
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
