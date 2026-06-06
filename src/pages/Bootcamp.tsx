import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Flame, Layers, Signal, ChevronRight, BookOpen } from 'lucide-react';
import { bootcampProjects } from '../data/bootcamp';
import { useBootcampStore } from '../stores/bootcampStore';
import type { BootcampProject } from '../types';

const difficultyConfig: Record<BootcampProject['difficulty'], { label: string; color: string; bgColor: string }> = {
  beginner: { label: '入门', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  elementary: { label: '初级', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  intermediate: { label: '中级', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  advanced: { label: '高级', color: 'text-rose-700', bgColor: 'bg-rose-50' },
};

const difficultyFilters: { key: BootcampProject['difficulty'] | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'beginner', label: '入门' },
  { key: 'elementary', label: '初级' },
  { key: 'intermediate', label: '中级' },
  { key: 'advanced', label: '高级' },
];

const cardGradients = [
  'from-indigo-500/10 to-violet-500/10',
  'from-emerald-500/10 to-teal-500/10',
  'from-amber-500/10 to-orange-500/10',
  'from-rose-500/10 to-pink-500/10',
  'from-violet-500/10 to-purple-500/10',
  'from-cyan-500/10 to-sky-500/10',
  'from-orange-500/10 to-red-500/10',
  'from-teal-500/10 to-emerald-500/10',
  'from-fuchsia-500/10 to-pink-500/10',
  'from-lime-500/10 to-green-500/10',
];

const accentColors = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-fuchsia-500',
  'bg-lime-500',
];

export default function Bootcamp() {
  const navigate = useNavigate();
  const isProjectCompleted = useBootcampStore((s) => s.isProjectCompleted);
  const getProjectProgress = useBootcampStore((s) => s.getProjectProgress);
  const getOverallProgress = useBootcampStore((s) => s.getOverallProgress);

  const [filter, setFilter] = useState<BootcampProject['difficulty'] | 'all'>('all');

  const overallProgress = getOverallProgress();
  const completedCount = bootcampProjects.filter((p) => isProjectCompleted(p.id)).length;
  const totalTasks = bootcampProjects.reduce((sum, p) => sum + p.tasks.length, 0);
  const totalKeyPoints = bootcampProjects.reduce((sum, p) => sum + p.keyPoints.length, 0);

  const filteredProjects =
    filter === 'all' ? bootcampProjects : bootcampProjects.filter((p) => p.difficulty === filter);

  return (
    <div className="animate-slide-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-indigo-700 px-8 py-10 text-white mb-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Pandas 数据分析实战训练营</h1>
          <p className="text-indigo-200 text-lg mb-6">
            10个真实项目，覆盖数据清洗到特征工程，AI教练全程陪练
          </p>

          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-indigo-200">总体进度</span>
              <span className="text-sm font-semibold">
                已完成 {completedCount}/10 个项目
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span className="text-sm">
                <span className="font-bold text-lg">10</span> 个项目
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Signal className="w-5 h-5 text-amber-400" />
              <span className="text-sm">
                <span className="font-bold text-lg">{totalTasks}</span> 个任务
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="text-sm">
                <span className="font-bold text-lg">{totalKeyPoints}</span> 个知识点
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span className="text-sm">
                <span className="font-bold text-lg">4</span> 个难度级别
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2 mb-6">
        {difficultyFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === f.key
                ? 'bg-[#1e1b4b] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const completed = isProjectCompleted(project.id);
          const progress = getProjectProgress(project.id);
          const completedTaskCount = progress?.completedTasks.length ?? 0;
          const totalTaskCount = project.tasks.length;
          const diff = difficultyConfig[project.difficulty];
          const displayIndex = String(bootcampProjects.indexOf(project) + 1).padStart(2, '0');
          const projectIdx = bootcampProjects.indexOf(project);
          const gradient = cardGradients[projectIdx % cardGradients.length];
          const accent = accentColors[projectIdx % accentColors.length];

          return (
            <div
              key={project.id}
              onClick={() => navigate(`/bootcamp/${project.id}`)}
              className={`relative bg-gradient-to-br ${gradient} rounded-xl p-6 cursor-pointer
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                border border-gray-100 overflow-hidden`}
            >
              {/* 左侧彩色条 */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />

              <div className="flex items-start gap-4">
                {/* Project Number */}
                <div className={`text-3xl font-black select-none shrink-0 leading-none mt-1 ${accent.replace('bg-', 'text-').replace('500', '300')}`}>
                  {displayIndex}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title + Completed Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1e1b4b] text-lg truncate">
                      {project.title}
                    </h3>
                    {completed && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Difficulty + Tags */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${diff.color} ${diff.bgColor}`}
                    >
                      {diff.label}
                    </span>
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-gray-500 bg-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Key Points */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-gray-500">核心知识点</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.keyPoints.map((point) => (
                        <span
                          key={point}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Task Progress + Enter Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${totalTaskCount > 0 ? (completedTaskCount / totalTaskCount) * 100 : 0}%`,
                            backgroundColor: completed ? '#10b981' : '#f59e0b',
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {completedTaskCount}/{totalTaskCount} 任务
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-[#1e1b4b]">
                      进入项目
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
