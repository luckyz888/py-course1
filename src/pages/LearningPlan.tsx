import { useParams, Link } from 'react-router-dom';
import { allModules } from '../data/modules';
import { ArrowLeft, BookOpen } from 'lucide-react';

const stageMap: Record<string, { stage: string; title: string; weeks: string; description: string; gradient: string; headerGradient: string }> = {
  m1: { stage: '第一阶段', title: '基础入门', weeks: '第1~4周', description: '夯实Python数据分析基础，掌握核心工具链', gradient: 'from-emerald-500 to-teal-500', headerGradient: 'from-emerald-500 to-teal-500' },
  m2: { stage: '第二阶段', title: '核心技能', weeks: '第5~10周', description: '深入Pandas数据处理，掌握数据清洗与聚合分析', gradient: 'from-blue-500 to-indigo-500', headerGradient: 'from-blue-500 to-indigo-500' },
  m3: { stage: '第三阶段', title: '进阶提升', weeks: '第11~14周', description: '掌握数据可视化与商务统计分析方法', gradient: 'from-violet-500 to-purple-500', headerGradient: 'from-violet-500 to-purple-500' },
  m4: { stage: '第三阶段', title: '进阶提升', weeks: '第11~14周', description: '掌握商务统计分析方法与假设检验', gradient: 'from-violet-500 to-purple-500', headerGradient: 'from-violet-500 to-purple-500' },
  m5: { stage: '第四阶段', title: '实战应用', weeks: '第15~20周', description: '商务智能实战与数据挖掘，完成综合项目', gradient: 'from-amber-500 to-orange-500', headerGradient: 'from-amber-500 to-orange-500' },
  m6: { stage: '第四阶段', title: '实战应用', weeks: '第15~20周', description: '数据挖掘与商务实战，完成综合项目', gradient: 'from-amber-500 to-orange-500', headerGradient: 'from-amber-500 to-orange-500' },
};

const chapterColors = [
  { bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-400', line: 'bg-rose-200', text: 'text-rose-600', tag: 'bg-rose-100 text-rose-600' },
  { bg: 'bg-sky-50', border: 'border-sky-200', dot: 'bg-sky-400', line: 'bg-sky-200', text: 'text-sky-600', tag: 'bg-sky-100 text-sky-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400', line: 'bg-amber-200', text: 'text-amber-600', tag: 'bg-amber-100 text-amber-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400', line: 'bg-emerald-200', text: 'text-emerald-600', tag: 'bg-emerald-100 text-emerald-600' },
  { bg: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-400', line: 'bg-violet-200', text: 'text-violet-600', tag: 'bg-violet-100 text-violet-600' },
  { bg: 'bg-pink-50', border: 'border-pink-200', dot: 'bg-pink-400', line: 'bg-pink-200', text: 'text-pink-600', tag: 'bg-pink-100 text-pink-600' },
];

export default function LearningPlan() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = allModules.find(m => m.id === moduleId || m.id === getModuleId(moduleId));
  const stageInfo = stageMap[moduleId || ''];

  if (!mod || !stageInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">未找到该课程模块</p>
        <Link to="/" className="text-emerald-500 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className={`rounded-2xl bg-gradient-to-r ${stageInfo.headerGradient} text-white p-6 sm:p-8 relative overflow-hidden`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回学习规划
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{stageInfo.stage}</span>
            <span className="text-sm text-white/70">{stageInfo.weeks}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{mod.title}</h1>
          <p className="mt-2 text-white/80">{stageInfo.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
            <span>{mod.chapters.length} 个章节</span>
            <span>·</span>
            <span>{mod.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)} 个知识点</span>
          </div>
        </div>
      </div>

      {/* Mind Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1e1b4b] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            课程大纲思维导图
          </h2>
        </div>

        <div className="p-6 overflow-x-auto">
          {/* Mind Map - Central Node + Branches */}
          <div className="min-w-[700px]">
            {/* Central node */}
            <div className="flex justify-center mb-8">
              <div className={`px-6 py-3 bg-gradient-to-r ${stageInfo.gradient} text-white rounded-2xl text-lg font-bold shadow-lg`}>
                {mod.icon} {mod.title}
              </div>
            </div>

            {/* Branches */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {mod.chapters.map((chapter, chIdx) => {
                const colors = chapterColors[chIdx % chapterColors.length];
                return (
                  <div key={chapter.id} className="relative">
                    {/* Connector line from center */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 ${colors.line}`} />

                    {/* Chapter card */}
                    <div className={`${colors.bg} rounded-xl border ${colors.border} overflow-hidden`}>
                      {/* Chapter header */}
                      <div className={`px-4 py-2.5 ${colors.tag} font-bold text-sm flex items-center gap-2`}>
                        <span className={`w-5 h-5 rounded-full ${colors.dot} text-white text-xs flex items-center justify-center`}>
                          {chIdx + 1}
                        </span>
                        {chapter.title}
                      </div>

                      {/* Lessons */}
                      <div className="px-4 py-3 space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 shrink-0 opacity-60`} />
                            <span className="leading-snug">{lesson.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed outline list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1e1b4b]">详细课程大纲</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {mod.chapters.map((chapter, chIdx) => {
            const colors = chapterColors[chIdx % chapterColors.length];
            return (
              <div key={chapter.id} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${colors.tag} flex items-center justify-center text-sm font-bold`}>
                    {chIdx + 1}
                  </div>
                  <h3 className={`text-base font-bold ${colors.text}`}>{chapter.title}</h3>
                  <span className="text-xs text-gray-400">{chapter.lessons.length} 个知识点</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-11">
                  {chapter.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
                      <span className="text-sm text-gray-600 truncate">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getModuleId(shortId?: string): string {
  const map: Record<string, string> = {
    m1: 'python-basics',
    m2: 'data-processing',
    m3: 'data-visualization',
    m4: 'business-statistics',
    m5: 'business-intelligence',
    m6: 'data-mining',
  };
  return map[shortId || ''] || '';
}
