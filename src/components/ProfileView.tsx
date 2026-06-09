import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Star, History, Shield, Settings, FileText, 
  ChevronRight, Play, CheckCircle2, X
} from 'lucide-react';
import { HistoryRecord, UserStats } from '../types';

interface ProfileViewProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  history: HistoryRecord[];
  onLogin: () => void;
  isLoggedIn: boolean;
}

export default function ProfileView({ userStats, setUserStats, history, onLogin, isLoggedIn }: ProfileViewProps) {
  const [activeAd, setActiveSubAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAgreements, setShowAgreements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Play a mock ad to gain points (+3 point restoration)
  const handleWatchAd = () => {
    setActiveSubAd(true);
    setAdTimer(5);
    const interval = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimAdReward = () => {
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 3,
      adsSeenToday: Math.min(prev.adsSeenToday + 1, prev.maxAdsPerDay)
    }));
    setActiveSubAd(false);
    alert("广告功德圆满！您已成功领取 3 点灵感点数（次数）。继续妙笔生花吧！");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-md mx-auto"
    >
      {/* Profile Header Block */}
      <section className="bg-gradient-to-br from-white/95 to-[#e9f0e9]/50 border border-amber-600/10 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-[#E0E0E0]/60 shadow-inner flex items-center justify-center flex-shrink-0">
            {isLoggedIn ? (
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMMrzyUtsuc_j99O471P5yu52zGBCWflKl4WBJObz59OF9xGQ9HrWraEZkCSDMjc-_Xp13EzKgy9YXKSnz0r1upH4yW0cR3lI1jfCAlY_Wl-iZtRFwLHtXVTSjnfPqvTrlini-jpwTUaqvcQAWa3CMT_j9AqqTHN-JFnhy_M7zlUFsBfO3DAh3ylw8Kh2FjDpHxgUYrKGl_VvoRzTRjY8S-GZS27knqi9KAP4VmDaaHC9nm57S-V9_81miSVcqRmlW9lLLb2KUSKw"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="text-[#1A2F4B] w-7 h-7" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[#1A2F4B] font-serif font-bold text-base">
                {isLoggedIn ? userStats.nickname : "游客身份"}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-800 font-bold">
                Lvl.{userStats.level}
              </span>
            </div>
            <p className="text-xs text-[#c4c6ce]">
              {isLoggedIn ? "墨韵雅客尊享通行" : "注册登录后享受更多权益"}
            </p>
          </div>
        </div>
        {!isLoggedIn && (
          <button 
            onClick={onLogin}
            className="bg-[#1A2F4B] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-opacity-90 active:scale-95 shadow-sm transition-transform"
          >
            登录
          </button>
        )}
      </section>

      {/* Rights / Stats Card Grid */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[#1A2F4B] flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#B22222] rounded-full" />
          我的权益
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/95 border border-[#E0E0E0]/60 p-4 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center">
            <span className="text-[10px] text-[#74777e] uppercase tracking-wider font-semibold">剩余点数</span>
            <span className="text-2xl font-serif font-bold text-[#1A2F4B] my-1">{userStats.points}</span>
            <p className="text-xs text-[#c4c6ce]">次灵感提取</p>
          </div>
          <div className="bg-white/95 border border-[#E0E0E0]/60 p-4 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center">
            <span className="text-[10px] text-[#74777e] uppercase tracking-wider font-semibold">今日观看</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl font-serif font-bold text-[#B22222]">{userStats.adsSeenToday}</span>
              <span className="text-xs text-[#c4c6ce]">/ {userStats.maxAdsPerDay}</span>
            </div>
            <p className="text-xs text-[#c4c6ce]">广告解锁点数</p>
          </div>
        </div>
      </section>

      {/* Action Items List */}
      <section className="bg-white/95 border border-[#E0E0E0]/60 rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E0E0E0]/20">
        {/* Usage Records */}
        <div 
          onClick={() => setShowHistoryModal(true)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F8FBF8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ebefec] flex items-center justify-center text-[#1A2F4B]">
              <History className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium text-[#1A2F4B]">使用记录</span>
          </div>
          <ChevronRight className="text-[#c4c6ce] w-4 h-4" />
        </div>

        {/* My Rights explanation */}
        <div 
          onClick={() => alert("【墨韵智汇 权益说明】\n- 每次生成文案扣除 1 点数\n- 每次精密翻译扣除 2 点数\n- 动漫头像与修复扣除 3-5 点数\n- 本地便民工具全部免费\n- 点数用光后，点击“我的权益”下方浮窗观看广告即可直接白嫖！")}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F8FBF8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ebefec] flex items-center justify-center text-[#1A2F4B]">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium text-[#1A2F4B]">我的权益</span>
          </div>
          <ChevronRight className="text-[#c4c6ce] w-4 h-4" />
        </div>

        {/* Application Setting toggles */}
        <div 
          onClick={() => setShowSettings(true)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F8FBF8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ebefec] flex items-center justify-center text-[#1A2F4B]">
              <Settings className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium text-[#1A2F4B]">应用设置</span>
          </div>
          <ChevronRight className="text-[#c4c6ce] w-4 h-4" />
        </div>

        {/* Legal agreements */}
        <div 
          onClick={() => setShowAgreements(true)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F8FBF8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ebefec] flex items-center justify-center text-[#1A2F4B]">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium text-[#1A2F4B]">协议说明</span>
          </div>
          <ChevronRight className="text-[#c4c6ce] w-4 h-4" />
        </div>
      </section>

      {/* Mini Promotion Banner Ad */}
      <section 
        onClick={handleWatchAd}
        className="relative rounded-2xl overflow-hidden group shadow-sm border border-[#E0E0E0]/60 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2F4B]/90 to-transparent z-10" />
        <img 
          alt="Ad Banner backdrop" 
          className="w-full h-24 object-cover sepia-[0.1] contrast-[0.9] group-hover:scale-102 transition-transform duration-500" 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-between px-5">
          <div className="text-white">
            <p className="text-[10px] opacity-8 tracking-wider font-semibold">看段广告增添点数</p>
            <h4 className="font-serif font-bold text-base text-[#F8FBF8] mt-0.5">点数耗尽？极速补充数额</h4>
          </div>
          <button className="bg-[#B22222] hover:bg-[#92030f] text-white text-xs px-4 py-2 rounded-full font-semibold active:scale-90 transition-transform">
            立即观看
          </button>
        </div>
      </section>

      {/* ⚠️ DIALOG: History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden border border-[#E0E0E0]/30 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-serif font-bold text-base text-[#1A2F4B]">工具使用记录</h3>
              <X className="w-5 h-5 text-[#c4c6ce] cursor-pointer hover:text-[#1A2F4B]" onClick={() => setShowHistoryModal(false)} />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {history.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#c4c6ce]">
                  暂无使用记录，快去体验AI工具妙用吧！
                </div>
              ) : (
                history.map((record) => (
                  <div key={record.id} className="p-3 bg-[#ebefec]/30 rounded-xl border border-[#E0E0E0]/20 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#1A2F4B]">{record.toolName}</span>
                      <span className="text-[#c4c6ce]">{record.timestamp.slice(5, 16)}</span>
                    </div>
                    <p className="text-xs text-[#44474d] truncate">
                      输入：{record.inputDescription}
                    </p>
                    <div className="text-[9px] text-[#B22222] font-semibold">
                      消耗 {record.pointsCost} 点
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ DIALOG: Agreements Modal */}
      {showAgreements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAgreements(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E0E0E0]/30 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-serif font-bold text-base text-[#1A2F4B]">服务声明与特权</h3>
              <X className="w-5 h-5 text-[#c4c6ce] cursor-pointer hover:text-[#1A2F4B]" onClick={() => setShowAgreements(false)} />
            </div>
            <div className="text-xs text-[#44474d] space-y-2 leading-relaxed max-h-60 overflow-y-auto">
              <p className="font-bold">一、 隐私护航声明</p>
              <p>墨韵智汇（Lunar Ink AI）深切尊重文客隐私。您的每一个词词画卷、头像，皆在本地或经服务器加密接口临时中继，绝不留存或进行越权侵入分析。</p>
              <p className="font-bold">二、 广告点数规则</p>
              <p>为了给文人们提供永久无常的创作便利。我们集成了极简观视制度，每日看广告赠予3个点数，最多观看8次积攒点数。</p>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ DIALOG: Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E0E0E0]/30 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-serif font-bold text-base text-[#1A2F4B]">应用设置</h3>
              <X className="w-5 h-5 text-[#c4c6ce] cursor-pointer hover:text-[#1A2F4B]" onClick={() => setShowSettings(false)} />
            </div>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A2F4B]">禅意白噪音背景声</span>
                <input 
                  type="checkbox" 
                  defaultChecked={false} 
                  onChange={(e) => {
                    if (e.target.checked) alert("山泉、古琴背景禅意乐声准备就绪，稍后完美开启！");
                  }} 
                  className="rounded text-[#1A2F4B] focus:ring-[#1A2F4B]" 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A2F4B]">极简无痕缓存清理</span>
                <button 
                  onClick={() => alert("本地草稿与配置已成功归档并一键释盘！已清除 12.4 MB 缓存")}
                  className="text-xs bg-[#ebefec] text-[#1A2F4B] px-3 py-1.5 rounded-lg border hover:bg-[#c4c6ce]/30"
                >
                  一键清理
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📺 MOCK AD: Timed visual pop-up modal */}
      {activeAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-primary/45 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#F8FBF8] rounded-2xl overflow-hidden border border-[#E0E0E0]/30 shadow-2xl">
            <div className="h-1 w-full bg-[#B22222]" />
            <div className="p-6 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-[#1A2F4B]/5 flex items-center justify-center mx-auto text-[#1A2F4B] animate-pulse">
                <Play className="w-6 h-6 fill-[#1A2F4B] ml-0.5" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#1A2F4B]">
                  墨韵灵采广告中
                </h3>
                <p className="text-xs text-[#74777e] leading-relaxed max-w-[200px] mx-auto">
                  “山色空蒙雨亦奇。购买墨韵精选礼包，无限点数，快去右下角看看！”
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-[#B22222]/5 border border-[#B22222]/30 px-4 py-1.5 rounded">
                <span className="text-[10px] text-[#B22222] font-serif font-bold">奖励发放剩余</span>
                <span className="text-[#B22222] font-mono font-bold text-xs">
                  {adTimer > 0 ? `${adTimer}s` : "就绪"}
                </span>
              </div>

              <div>
                {adTimer > 0 ? (
                  <button 
                    disabled 
                    className="w-full py-3 bg-[#ebefec] text-[#c4c6ce] text-xs font-semibold rounded-xl"
                  >
                    请观赏广告以加载加赠
                  </button>
                ) : (
                  <button 
                    onClick={claimAdReward}
                    className="w-full py-3 bg-[#1A2F4B] text-white text-xs font-semibold rounded-xl hover:bg-[#203c5d] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>领取 3 点数奖励</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
