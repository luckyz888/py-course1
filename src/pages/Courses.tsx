import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import { allModules } from '../data/modules';
import { useCourseStore } from '../stores/courseStore';

interface ThemeColors {
  gradient: string;
  gradientHover: string;
  borderAccent: string;
  iconBg: string;
  iconText: string;
  progressStroke: string;
  progressBg: string;
  barFrom: string;
  barTo: string;
  tagBg: string;
  tagText: string;
}

const moduleThemes: Record<string, ThemeColors> = {
  'python-basics': {
    gradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%)',
    gradientHover: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
    borderAccent: '#6366f1',
    iconBg: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    iconText: '#ffffff',
    progressStroke: '#6366f1',
    progressBg: '#c7d2fe',
    barFrom: '#6366f1',
    barTo: '#3b82f6',
    tagBg: 'rgba(99,102,241,0.1)',
    tagText: '#4f46e5',
  },
  'data-processing': {
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
    gradientHover: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
    borderAccent: '#10b981',
    iconBg: 'linear-gradient(135deg, #10b981, #14b8a6)',
    iconText: '#ffffff',
    progressStroke: '#10b981',
    progressBg: '#a7f3d0',
    barFrom: '#10b981',
    barTo: '#14b8a6',
    tagBg: 'rgba(16,185,129,0.1)',
    tagText: '#059669',
  },
  'data-visualization': {
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
    gradientHover: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
    borderAccent: '#f59e0b',
    iconBg: 'linear-gradient(135deg, #f59e0b, #f97316)',
    iconText: '#ffffff',
    progressStroke: '#f59e0b',
    progressBg: '#fde68a',
    barFrom: '#f59e0b',
    barTo: '#f97316',
    tagBg: 'rgba(245,158,11,0.1)',
    tagText: '#d97706',
  },
  'statistics': {
    gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
    gradientHover: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 50%, #fda4af 100%)',
    borderAccent: '#f43f5e',
    iconBg: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    iconText: '#ffffff',
    progressStroke: '#f43f5e',
    progressBg: '#fecdd3',
    barFrom: '#f43f5e',
    barTo: '#ec4899',
    tagBg: 'rgba(244,63,94,0.1)',
    tagText: '#e11d48',
  },
  'business-intelligence': {
    gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
    gradientHover: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
    borderAccent: '#8b5cf6',
    iconBg: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    iconText: '#ffffff',
    progressStroke: '#8b5cf6',
    progressBg: '#ddd6fe',
    barFrom: '#8b5cf6',
    barTo: '#a855f7',
    tagBg: 'rgba(139,92,246,0.1)',
    tagText: '#7c3aed',
  },
  'data-mining': {
    gradient: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 50%, #a5f3fc 100%)',
    gradientHover: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 50%, #67e8f9 100%)',
    borderAccent: '#06b6d4',
    iconBg: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    iconText: '#ffffff',
    progressStroke: '#06b6d4',
    progressBg: '#a5f3fc',
    barFrom: '#06b6d4',
    barTo: '#0ea5e9',
    tagBg: 'rgba(6,182,212,0.1)',
    tagText: '#0891b2',
  },
};

function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  theme,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  theme: ThemeColors;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);
  const strokeColor = progress === 100 ? '#10b981' : theme.progressStroke;
  const gradientId = `progress-gradient-${theme.borderAccent.replace('#', '')}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.barFrom} />
          <stop offset="100%" stopColor={theme.barTo} />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={theme.progressBg}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={progress === 100 ? '#10b981' : `url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-700 ease-out"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold"
        fill={strokeColor}
      >
        {progress}%
      </text>
    </svg>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const getModuleProgress = useCourseStore((s) => s.getModuleProgress);

  const allZeroProgress = allModules.every((m) => getModuleProgress(m.id) === 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">课程中心</h1>
        </div>
        <p className="text-gray-500">系统化学习商务数据分析，从Python基础到数据挖掘实战，开启你的数据之旅。</p>
      </div>

      {/* Empty state for all-zero progress */}
      {allZeroProgress && (
        <div
          className="rounded-xl p-6 flex items-center gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(249,115,22,0.1))',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#1e1b4b]">准备好开始了吗？</p>
            <p className="text-sm text-gray-500">点击任意课程模块，迈出你数据分析学习的第一步！</p>
          </div>
        </div>
      )}

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {allModules.map((mod) => {
          const progress = getModuleProgress(mod.id);
          const chapterCount = mod.chapters.length;
          const lessonCount = mod.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
          const theme = moduleThemes[mod.id] || moduleThemes['python-basics'];

          return (
            <div
              key={mod.id}
              onClick={() => navigate(`/courses/${mod.id}`)}
              className="relative rounded-xl cursor-pointer overflow-hidden
                transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group"
              style={{ background: theme.gradient }}
            >
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                style={{
                  background: `linear-gradient(90deg, ${theme.barFrom}, ${theme.barTo})`,
                }}
              />

              {/* Left accent border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                style={{
                  background: `linear-gradient(180deg, ${theme.barFrom}, ${theme.barTo})`,
                }}
              />

              <div className="relative p-6 h-full">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0
                      transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: theme.iconBg }}
                  >
                    <span className="text-2xl" style={{ filter: 'brightness(0) invert(1)' }}>
                      {mod.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#1e1b4b] text-lg leading-tight">{mod.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{mod.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-sm mb-4">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: theme.tagBg, color: theme.tagText }}
                  >
                    {chapterCount} 章节
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: theme.tagBg, color: theme.tagText }}
                  >
                    {lessonCount} 知识点
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">学习进度</span>
                    <span className="text-xs font-semibold" style={{ color: theme.tagText }}>
                      {progress}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: theme.progressBg }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${theme.barFrom}, ${theme.barTo})`,
                      }}
                    />
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center justify-end mt-3">
                  <ProgressRing progress={progress} theme={theme} />
                </div>
              </div>

              {/* Hover background overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                style={{ background: theme.gradientHover }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
