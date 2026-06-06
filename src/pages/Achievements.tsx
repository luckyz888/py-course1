import { useState } from 'react';
import { Trophy, Flame, Star, X, Lock } from 'lucide-react';
import { useAchievementStore } from '../stores/achievementStore';
import { badges } from '../data/badges';
import type { Badge } from '../types';

// 徽章稀有度配色方案
const badgeRarity: Record<string, { tier: string; border: string; bg: string; glow: string; iconBg: string; lockColor: string }> = {
  // 普通 - 绿色系
  'first-lesson':    { tier: '普通', border: 'border-emerald-400/50', bg: 'bg-emerald-50', glow: 'shadow-[0_0_16px_rgba(16,185,129,0.3)]', iconBg: 'bg-emerald-100', lockColor: 'text-emerald-400' },
  'first-exercise':  { tier: '普通', border: 'border-teal-400/50', bg: 'bg-teal-50', glow: 'shadow-[0_0_16px_rgba(20,184,166,0.3)]', iconBg: 'bg-teal-100', lockColor: 'text-teal-400' },
  'first-quiz':      { tier: '普通', border: 'border-cyan-400/50', bg: 'bg-cyan-50', glow: 'shadow-[0_0_16px_rgba(34,211,238,0.3)]', iconBg: 'bg-cyan-100', lockColor: 'text-cyan-400' },
  // 稀有 - 蓝色系
  'streak-7':        { tier: '稀有', border: 'border-blue-400/50', bg: 'bg-blue-50', glow: 'shadow-[0_0_16px_rgba(59,130,246,0.3)]', iconBg: 'bg-blue-100', lockColor: 'text-blue-400' },
  'points-100':      { tier: '稀有', border: 'border-indigo-400/50', bg: 'bg-indigo-50', glow: 'shadow-[0_0_16px_rgba(99,102,241,0.3)]', iconBg: 'bg-indigo-100', lockColor: 'text-indigo-400' },
  // 珍贵 - 金色系
  'streak-30':       { tier: '珍贵', border: 'border-amber-400/50', bg: 'bg-amber-50', glow: 'shadow-[0_0_16px_rgba(245,158,11,0.35)]', iconBg: 'bg-amber-100', lockColor: 'text-amber-400' },
  'perfect-quiz':    { tier: '珍贵', border: 'border-yellow-400/50', bg: 'bg-yellow-50', glow: 'shadow-[0_0_16px_rgba(234,179,8,0.35)]', iconBg: 'bg-yellow-100', lockColor: 'text-yellow-400' },
  'module-complete':  { tier: '珍贵', border: 'border-orange-400/50', bg: 'bg-orange-50', glow: 'shadow-[0_0_16px_rgba(251,146,60,0.35)]', iconBg: 'bg-orange-100', lockColor: 'text-orange-400' },
  // 史诗 - 紫色系
  'points-500':      { tier: '史诗', border: 'border-purple-400/50', bg: 'bg-purple-50', glow: 'shadow-[0_0_16px_rgba(168,85,247,0.35)]', iconBg: 'bg-purple-100', lockColor: 'text-purple-400' },
  'points-1000':     { tier: '史诗', border: 'border-violet-400/50', bg: 'bg-violet-50', glow: 'shadow-[0_0_16px_rgba(139,92,246,0.35)]', iconBg: 'bg-violet-100', lockColor: 'text-violet-400' },
  'exercises-10':    { tier: '史诗', border: 'border-fuchsia-400/50', bg: 'bg-fuchsia-50', glow: 'shadow-[0_0_16px_rgba(217,70,239,0.35)]', iconBg: 'bg-fuchsia-100', lockColor: 'text-fuchsia-400' },
  // 传说 - 红色系
  'all-modules':     { tier: '传说', border: 'border-rose-400/50', bg: 'bg-rose-50', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]', iconBg: 'bg-rose-100', lockColor: 'text-rose-400' },
};

const defaultRarity = { tier: '普通', border: 'border-gray-300/50', bg: 'bg-gray-50', glow: 'shadow-[0_0_12px_rgba(156,163,175,0.2)]', iconBg: 'bg-gray-100', lockColor: 'text-gray-400' };

function getRarity(badgeId: string) {
  return badgeRarity[badgeId] || defaultRarity;
}

// 稀有度标签颜色
const tierColors: Record<string, string> = {
  '普通': 'bg-emerald-100 text-emerald-700',
  '稀有': 'bg-blue-100 text-blue-700',
  '珍贵': 'bg-amber-100 text-amber-700',
  '史诗': 'bg-purple-100 text-purple-700',
  '传说': 'bg-rose-100 text-rose-700',
};

export default function Achievements() {
  const { points, streak, longestStreak, studyDays, earnedBadges, getLevel, getLevelProgress } =
    useAchievementStore();
  const level = getLevel();
  const levelProgress = getLevelProgress();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // 最近30天日期列表
  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    last30Days.push(d.toISOString().split('T')[0]);
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 标题 - 渐变背景 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">成就中心</h1>
            <p className="text-sm text-white/80 mt-0.5">记录你的每一步成长</p>
          </div>
        </div>
      </div>

      {/* 积分与等级区域 - 渐变卡片 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
          {/* 积分 - 渐变卡片 */}
          <div className="text-center min-w-[120px] rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-100/50">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-amber-600">当前积分</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{points}</div>
          </div>

          {/* 分隔线 */}
          <div className="w-px h-16 bg-gray-200 hidden sm:block" />

          {/* 等级 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{level.icon}</span>
                <span className="text-lg font-semibold text-[#1e1b4b]">{level.name}</span>
              </div>
              {level.nextLevelPoints !== null && (
                <span className="text-sm text-gray-400">
                  下一等级需 {level.nextLevelPoints} 积分
                </span>
              )}
            </div>
            {/* 等级进度条 with gradient */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${levelProgress}%`,
                  background: 'linear-gradient(90deg, #f59e0b, #f97316, #ef4444)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">{level.minPoints}</span>
              {level.nextLevelPoints !== null && (
                <span className="text-xs text-gray-400">{level.nextLevelPoints}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 连续学习区域 - 渐变统计卡片 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-[#1e1b4b] mb-4">学习记录</h2>
        <div className="flex items-center gap-4 mb-5">
          {/* 当前连续天数 - 渐变卡片 */}
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-4 border border-orange-100/50 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{streak}</div>
              <div className="text-xs text-orange-500">当前连续天数</div>
            </div>
          </div>

          {/* 最长连续记录 - 渐变卡片 */}
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-100/50 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{longestStreak}</div>
              <div className="text-xs text-emerald-500">最长连续记录</div>
            </div>
          </div>
        </div>

        {/* 最近30天热力图 with tooltip */}
        <div>
          <div className="text-sm text-gray-500 mb-2">最近 30 天</div>
          <div className="flex flex-wrap gap-1.5">
            {last30Days.map((day) => {
              const studied = studyDays.includes(day);
              return (
                <div
                  key={day}
                  className={`w-5 h-5 rounded-sm transition-all heatmap-tooltip ${
                    studied
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shadow-emerald-200'
                      : 'bg-gray-200'
                  }`}
                  data-tooltip={`${day}${studied ? ' (已学习)' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 徽章墙 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-[#1e1b4b] mb-4">
          徽章墙
          <span className="text-sm font-normal text-gray-400 ml-2">
            {earnedBadges.length} / {badges.length}
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const earned = earnedBadges.includes(badge.id);
            const rarity = getRarity(badge.id);
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  earned
                    ? `${rarity.border} ${rarity.bg} ${rarity.glow} hover:scale-[1.03] animate-badge-glow`
                    : 'border-gray-200 bg-gray-50/80 grayscale-[60%] opacity-60 hover:opacity-75 hover:grayscale-[40%]'
                }`}
              >
                {/* 稀有度标签 */}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tierColors[rarity.tier] || 'bg-gray-100 text-gray-500'}`}>
                  {rarity.tier}
                </span>
                {/* 锁定图标 */}
                {!earned && (
                  <div className={`absolute top-2 left-2 ${rarity.lockColor}`}>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`text-3xl mb-2 ${!earned ? 'grayscale' : ''}`}>{badge.icon}</div>
                <div className={`text-sm font-semibold mb-0.5 ${earned ? 'text-[#1e1b4b]' : 'text-gray-500'}`}>
                  {badge.name}
                </div>
                <div className="text-xs text-gray-400 line-clamp-2">
                  {earned ? badge.description : badge.condition}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 徽章详情弹窗 */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedBadge(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部装饰渐变条 */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-6xl mb-4">{selectedBadge.icon}</div>
            <h3 className="text-xl font-bold text-[#1e1b4b] mb-1">{selectedBadge.name}</h3>
            {/* 稀有度标签 */}
            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${tierColors[getRarity(selectedBadge.id).tier] || 'bg-gray-100 text-gray-500'}`}>
              {getRarity(selectedBadge.id).tier}
            </span>
            <p className="text-sm text-gray-500 mb-3">{selectedBadge.description}</p>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                earnedBadges.includes(selectedBadge.id)
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-200'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {earnedBadges.includes(selectedBadge.id) ? '✨ 已获得' : '🔒 未获得'}
            </div>
            {!earnedBadges.includes(selectedBadge.id) && (
              <p className="text-xs text-gray-400 mt-3">获得条件：{selectedBadge.condition}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
