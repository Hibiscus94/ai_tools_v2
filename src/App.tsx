import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Sparkles, Grid, User, Menu, Bell, X, 
  HelpCircle, RefreshCw, LogIn, ChevronLeft, Moon, Sun
} from 'lucide-react';
import { ActiveTab, ActiveTool, HistoryRecord, UserStats } from './types';

// Modularity importations
import HomeView from './components/HomeView';
import AIToolsView from './components/AIToolsView';
import ConvenienceView from './components/ConvenienceView';
import ProfileView from './components/ProfileView';

// Tool view importations
import TextGenerator from './components/TextGenerator';
import Translator from './components/Translator';
import BackgroundRemoval from './components/BackgroundRemoval';
import WatermarkRemoval from './components/WatermarkRemoval';
import PhotoRestoration from './components/PhotoRestoration';
import AnimeAvatar from './components/AnimeAvatar';
import ConvenienceDetail from './components/ConvenienceDetail';

export default function App() {
  // --- MASTER STATE ---
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [currentTool, setCurrentTool] = useState<ActiveTool>(null);
  const [selectedConvenienceTool, setSelectedConvenienceTool] = useState<string>("");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    nickname: '未登录旅客',
    level: 0,
    points: 3, // starting with 3 points
    adsSeenToday: 0,
    maxAdsPerDay: 8
  });

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);

  // --- ACTIONS ---
  const handleLaunchTool = (tool: ActiveTool) => {
    setCurrentTool(tool);
  };

  const handleBackToMain = () => {
    setCurrentTool(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserStats(prev => ({
      ...prev,
      nickname: 'Mineeing@gmail.com', // user authentic visual identity
      level: 1,
      points: prev.points + 5 // rewarded points
    }));
    alert("恭迎雅墨居士！登记入册大喜，特礼赠 5 点专属灵感！");
  };

  const addHistoryRecord = (record: HistoryRecord) => {
    setHistory(prev => [record, ...prev]);
  };

  const notifications = [
    "【系统通告】墨韵智汇 2.0 正式落款。新增一键老照片高清修饰与仕女墨绘滤图接口。",
    "【喜讯】新客登录即赠送余存 5 次灵感提炼额度。请点击个人中心登记通行。"
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#181c1b] font-sans antialiased selection:bg-[#B22222]/20 flex flex-col relative overflow-x-hidden">
      
      {/* 🏮 MASTER APPBAR (Refined Elegant Slate Header) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0E0E0]/60 shadow-[0_2px_15px_-5px_rgba(26,47,75,0.04)] px-4 h-15 flex items-center justify-between">
        
        {/* Left Option: Drawer Trigger / Tool Back Trigger */}
        <div className="flex items-center gap-3">
          {currentTool ? (
            <button 
              onClick={handleBackToMain}
              className="p-1 px-2 hover:bg-[#ebefec] rounded-lg transition-colors flex items-center gap-1 text-xs text-[#1A2F4B] font-bold"
            >
              <ChevronLeft className="w-5 h-5 text-[#1A2F4B]" />
              <span>返回</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-[#ebefec] rounded-xl text-[#1A2F4B] transition-colors"
              title="打开侧边菜单"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Centralized elegant App Title logo */}
          <span className="font-serif font-extrabold text-base tracking-wide text-[#1A2F4B]">
            {currentTool ? "" : "墨韵智汇"}
          </span>
        </div>

        {/* Right options: Point bubble, Notification Bell, Login state */}
        <div className="flex items-center gap-3">
          <div className="bg-[#B22222]/5 px-2.5 py-1 rounded border border-[#B22222]/15 text-[10px] sm:text-xs font-serif font-bold text-[#B22222]">
            余存灵感: {userStats.points} 点
          </div>

          <button 
            onClick={() => setShowNotificationOverlay(true)}
            className="p-2 hover:bg-[#ebefec] rounded-xl text-[#1A2F4B] relative transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B22222] rounded-full ring-2 ring-white" />
          </button>

          <div 
            onClick={() => {
              if (!isLoggedIn) handleLogin();
              else setCurrentTab('profile');
            }}
            className="w-8 h-8 rounded-full bg-[#1A2F4B]/5 border border-[#E0E0E0] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center overflow-hidden"
            title="查看个人中心"
          >
            {isLoggedIn ? (
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMMrzyUtsuc_j99O471P5yu52zGBCWflKl4WBJObz59OF9xGQ9HrWraEZkCSDMjc-_Xp13EzKgy9YXKSnz0r1upH4yW0cR3lI1jfCAlY_Wl-iZtRFwLHtXVTSjnfPqvTrlini-jpwTUaqvcQAWa3CMT_j9AqqTHN-JFnhy_M7zlUFsBfO3DAh3ylw8Kh2FjDpHxgUYrKGl_VvoRzTRjY8S-GZS27knqi9KAP4VmDaaHC9nm57S-V9_81miSVcqRmlW9lLLb2KUSKw"
                className="w-full h-full object-cover" 
                alt="Profile Avatar" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-4 h-4 text-[#1A2F4B]" />
            )}
          </div>
        </div>
      </header>

      {/* ☘️ MAIN CONTENT GUTTER (Desktop center-locked view container) */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 pb-28">
        <AnimatePresence mode="wait">
          {currentTool ? (
            /* ACTIVE TOOL ROUTE CONTROLLERS */
            <motion.div
              key={currentTool}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {currentTool === 'text-generator' && (
                <TextGenerator 
                  onBack={handleBackToMain} 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  addHistoryRecord={addHistoryRecord} 
                />
              )}
              {currentTool === 'translator' && (
                <Translator 
                  onBack={handleBackToMain} 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  addHistoryRecord={addHistoryRecord} 
                />
              )}
              {currentTool === 'bg-removal' && (
                <BackgroundRemoval 
                  onBack={handleBackToMain} 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  addHistoryRecord={addHistoryRecord} 
                />
              )}
              {currentTool === 'watermark-removal' && (
                <WatermarkRemoval 
                  onBack={handleBackToMain} 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  addHistoryRecord={addHistoryRecord} 
                />
              )}
              {currentTool === 'photo-restoration' && (
                <PhotoRestoration 
                  onBack={handleBackToMain} 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  addHistoryRecord={addHistoryRecord} 
                />
              )}
              {currentTool === 'anime-avatar' && (
                <AnimeAvatar 
                  onBack={handleBackToMain} 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  addHistoryRecord={addHistoryRecord} 
                />
              )}
              {currentTool === 'convenience-detail' && (
                <ConvenienceDetail 
                  toolId={selectedConvenienceTool} 
                  onBack={handleBackToMain} 
                />
              )}
            </motion.div>
          ) : (
            /* MAIN SUB-VIEWPORT NAVIGATION TAB GROUPS */
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'home' && (
                <HomeView 
                  onNavigateTab={setCurrentTab} 
                  onLaunchTool={handleLaunchTool} 
                  userPoints={userStats.points} 
                />
              )}
              {currentTab === 'ai-tools' && (
                <AIToolsView onLaunchTool={handleLaunchTool} />
              )}
              {currentTab === 'convenience' && (
                <ConvenienceView 
                  onLaunchTool={handleLaunchTool} 
                  setSelectedConvenienceTool={setSelectedConvenienceTool} 
                />
              )}
              {currentTab === 'profile' && (
                <ProfileView 
                  userStats={userStats} 
                  setUserStats={setUserStats} 
                  history={history} 
                  onLogin={handleLogin} 
                  isLoggedIn={isLoggedIn} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🧭 BOTTOM MODERN GLASS JADE NAVIGATION BAR (Only visible in Tab context) */}
      {!currentTool && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E0E0E0]/60 pb-safe pt-2 shadow-[0_-5px_20px_-5px_rgba(26,47,75,0.06)]">
          <div className="max-w-lg mx-auto flex items-center justify-around h-14">
            
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'home' ? 'text-[#B22222]' : 'text-[#74777e]/80 hover:text-[#1A2F4B]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 font-sans">首页</span>
            </button>

            <button
              onClick={() => setCurrentTab('ai-tools')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'ai-tools' ? 'text-[#B22222]' : 'text-[#74777e]/80 hover:text-[#1A2F4B]'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 font-sans">AI工具</span>
            </button>

            <button
              onClick={() => setCurrentTab('convenience')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'convenience' ? 'text-[#B22222]' : 'text-[#74777e]/80 hover:text-[#1A2F4B]'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 font-sans">便民工具</span>
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                currentTab === 'profile' ? 'text-[#B22222]' : 'text-[#74777e]/80 hover:text-[#1A2F4B]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-1 font-sans">个人中心</span>
            </button>

          </div>
        </nav>
      )}

      {/* 📜 SLIDING DRAWER DIALOG (Classical Side Panel - "坊记") */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            />
            
            {/* Sliding cabinet */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative w-72 max-w-[80vw] h-full bg-[#fbfbf8] border-r border-[#E0E0E0] shadow-2xl flex flex-col p-6 space-y-6 text-[#1A2F4B]"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-serif font-bold text-base">墨韵坊记 / 蓝图说明</span>
                <X className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => setIsDrawerOpen(false)} />
              </div>

              {/* Drawer Content - Classical and humble */}
              <div className="flex-1 overflow-y-auto space-y-5 text-xs text-[#44474d] leading-relaxed custom-scrollbar pr-1">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-[#1A2F4B]">【坊主致礼】</h4>
                  <p>
                    林泉野径，墨香氤氲。墨韵智汇旨在为当世文人雅士，定制一套融合古典笔韵和现代AI逻辑的修心生产力包。
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-[#1A2F4B]">【系统核心版本】</h4>
                  <p className="font-mono">Lunar Core v2.0.4 - Premium</p>
                  <p>集结了 Gemini 3.5 Flash 高速文学创作模型、Gemini 2.5 Image 影像转化和 Imagen 国风艺术渲染，全栈服务器代理运作安全。</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-[#1A2F4B]">【致谢名录】</h4>
                  <p>© Lunar Ink AI Workgroup</p>
                  <p>致力于创造更富有呼吸感和温度感的数字工具体验。</p>
                </div>
              </div>

              <div className="border-t pt-4 text-[10px] text-neutral-400 text-center select-none font-medium">
                无痕安全防护已启用
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ⚠️ SYSTEM NOTIFICATIONS DIALOG */}
      <AnimatePresence>
        {showNotificationOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotificationOverlay(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden border border-[#E0E0E0] shadow-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-serif font-bold text-base text-[#1A2F4B] flex items-center gap-1.5">
                  <Bell className="w-5 h-5 text-[#B22222]" />
                  <span>画案传书（系统通告）</span>
                </h3>
                <X className="w-5 h-5 text-[#c4c6ce] cursor-pointer hover:text-[#1A2F4B]" onClick={() => setShowNotificationOverlay(false)} />
              </div>

              <div className="space-y-3">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-lg text-xs leading-relaxed text-[#44474d] text-left border">
                    {notif}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowNotificationOverlay(false)}
                className="w-full py-2.5 bg-[#1A2F4B] hover:bg-[#203c5d] text-white rounded-xl text-xs font-semibold active:scale-95 transition-transform"
              >
                已阅知晓
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
