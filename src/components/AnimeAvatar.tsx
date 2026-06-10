import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Upload, RefreshCw, PenTool, Sparkles, 
  Download, Share2, HelpCircle, Image as ImageIcon, Camera
} from 'lucide-react';
import { ActiveTool, HistoryRecord, UserStats } from '../types';

interface AnimeAvatarProps {
  onBack: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addHistoryRecord: (record: HistoryRecord) => void;
}

const STYLES = [
  { 
    name: "水墨漫感", 
    desc: "水墨染晕、山水写意极简", 
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    name: "清新日漫", 
    desc: "温暖透气、色彩明丽清脆", 
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    name: "国风插画", 
    desc: "朱红黛绿、端庄祥瑞臻品", 
    img: "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?auto=format&fit=crop&w=400&q=80" 
  }
];

export default function AnimeAvatar({ onBack, userStats, setUserStats, addHistoryRecord }: AnimeAvatarProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("水墨漫感");
  const [customPrompt, setCustomPrompt] = useState("");
  const [resultAvatar, setResultAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUploadClick = () => {
    document.getElementById('avatar-src-picker')?.click();
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (userStats.points < 5) {
      alert("AI动漫头像属于高端画卷生成，消耗 5 点数。当前额度不足，欢迎点击个人中心观看广告一键回血！");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setResultAvatar(null);

    try {
      // Connect to our express server, proxying Gemini/Imagen
      const response = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          style: selectedStyle,
          prompt: customPrompt
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "绘造头像失败");
      }

      setResultAvatar(data.imageUrl);

      // Deduct points & save history
      setUserStats(prev => ({ ...prev, points: Math.max(0, prev.points - 5) }));
      addHistoryRecord({
        id: Math.random().toString(),
        toolName: `AI动漫头像 (${selectedStyle})`,
        timestamp: new Date().toISOString(),
        inputDescription: customPrompt ? `描述: ${customPrompt}` : "国风仕女/侠客肖像渲染",
        pointsCost: 5,
        resultUrl: data.imageUrl
      });

      alert("神作大功告成！古典AI动漫头像已汇集完成，快去保存吧！");

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "丹青调色盘运作异常，请检查 Gemini API 激活配置状态。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!resultAvatar) return;
    const link = document.createElement('a');
    link.href = resultAvatar;
    link.download = `mo_yun_avatar_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("已成功打包并存入本地设备中！");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-lg mx-auto pb-10"
    >
      {/* 1. Header Portrait Upload Circle (Mockup 10 style) */}
      <section className="flex flex-col items-center py-4 bg-white/50 border border-amber-800/5 rounded-2xl p-4 shadow-sm text-center">
        <div 
          onClick={handleUploadClick}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white/90 border-2 border-dashed border-[#1A2F4B]/35 flex flex-col items-center justify-center cursor-pointer hover:border-[#B22222] transition-colors shadow group"
        >
          {uploadedImage ? (
            <>
              <img src={uploadedImage} className="w-full h-full object-cover" alt="Portrait source" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white w-6 h-6" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 select-none">
              <Camera className="text-[#1A2F4B]/70 w-7 h-7 mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-[10px] font-bold text-[#1A2F4B] leading-none mt-1">点此上传肖像</span>
              <span className="text-[8px] text-[#74777e] mt-1">(参考人物轮廓)</span>
            </div>
          )}
        </div>
        <p className="text-xs text-[#74777e] mt-3 max-w-xs leading-relaxed">
          {uploadedImage ? "肖像底版装载完成 √" : "上传个人照片，AI 可根据精美骨骼轮廓，提炼重塑动漫风貌；不上传则根据文本和风格进行自由创作"}
        </p>

        <input 
          id="avatar-src-picker"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFilePicked}
        />
      </section>

      {/* 2. Style selections (Style Cards - Mockup 10 style) */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[#1A2F4B] flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-[#B22222] rounded-full" />
          选择国风或日漫绘卷风格
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {STYLES.map((style) => (
            <div
              key={style.name}
              onClick={() => setSelectedStyle(style.name)}
              className={`relative rounded-xl overflow-hidden aspect-[4/5] border transition-all duration-300 cursor-pointer shadow-sm group ${
                selectedStyle === style.name
                  ? 'border-[#B22222] ring-1 ring-[#B22222]'
                  : 'border-[#E0E0E0]/60 opacity-80 hover:opacity-100'
              }`}
            >
              <img src={style.img} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" alt={style.name} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                <h4 className="text-[11px] font-serif font-bold text-[#F8FBF8] truncate">{style.name}</h4>
                <p className="text-[8px] text-white/70 truncate">{style.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Text micro-adjust details Input */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-[#1A2F4B]">画面微调描述 (可选)</h3>
        <div className="relative bg-white border border-[#E0E0E0]/60 rounded-xl overflow-hidden focus-within:border-[#1A2F4B]/50 shadow-sm">
          <input
            className="w-full p-4 text-xs font-semibold text-[#1A2F4B] border-none focus:ring-0 focus:outline-none placeholder:text-[#c4c6ce]/75"
            placeholder="如：白发侠客，手执龙泉剑，竹林背景..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </div>
      </section>

      {errorMessage && (
        <div className="p-3 rounded-lg border border-[#B22222]/20 bg-[#B22222]/5 text-xs text-[#B22222] font-semibold flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 4. Cost seal tag details card */}
      <div className="flex justify-center select-none pointer-events-none">
        <div className="flex items-center gap-2 bg-[#B22222]/5 px-3 py-1.5 border border-[#B22222]/15 rounded">
          <span className="text-[10px] text-[#B22222] font-serif font-bold tracking-widest px-1 py-0.5 border border-[#B22222]/30 bg-white">精美画幅</span>
          <span className="text-[10px] text-[#B22222] font-serif font-semibold">：消耗 5点 (灵感)</span>
        </div>
      </div>

      {/* 5. Trigger CTA button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full h-14 bg-[#1A2F4B] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#203c5d] active:scale-98 shadow-md disabled:bg-[#c4c6ce] disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="font-serif">AI绘卷研磨、朱印落款中...</span>
          </>
        ) : (
          <>
            <PenTool className="w-5 h-5" />
            <span>立即绘制原生态动漫头像</span>
          </>
        )}
      </button>

      {/* 6. AI AVATAR OUTCOME CONTAINER WITH SEAMLESS EXIT */}
      <AnimatePresence>
        {resultAvatar && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="bg-white border rounded-2xl p-5 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-[#1A2F4B] uppercase tracking-wider font-sans flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B22222]" />
                <span>AI 精修作品完成</span>
              </span>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-2xl overflow-hidden border border-[#E0E0E0] shadow-md">
                <img src={resultAvatar} className="w-full h-full object-cover" alt="AI Generated Portrait" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-[#B22222] hover:bg-[#92030f] text-white rounded-lg text-xs font-serif font-bold tracking-wider flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform"
              >
                <Download className="w-4 h-4" />
                <span>保存此头像</span>
              </button>
              <button
                onClick={() => alert("作品链接已经封装完成，欢迎发送给微信、QQ好友：https://ais-share-hub.run.app/avatar/" + Math.floor(Math.random()*90000))}
                className="py-3 px-5 border border-[#E0E0E0] hover:bg-neutral-50 rounded-lg text-xs text-[#1A2F4B] active:scale-95 transition-transform"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
