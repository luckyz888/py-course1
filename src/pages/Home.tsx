import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, PlayCircle, Flame, CheckCircle2, ArrowRight, Code2, Zap, Layers, Lightbulb, Code, Users, GraduationCap, Target, Calendar, Clock, Rocket, Star, Flag, Play, Loader2, Terminal, X } from 'lucide-react';
import React from 'react';
import { runPython, isPyodideLoaded, loadPyodide, onStatusChange } from '../utils/pyodide';

// 懒加载 Monaco Editor
const Editor = React.lazy(() => import('@monaco-editor/react'));

function EditorFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400 text-sm">
      <Loader2 size={16} className="animate-spin mr-2" />
      加载编辑器...
    </div>
  );
}

const stats = [
  { value: 6, label: '课程模块', suffix: '', gradient: 'from-indigo-50 to-blue-50', textColor: 'text-indigo-600', subColor: 'text-indigo-400', icon: BookOpen },
  { value: 29, label: '章节', suffix: '', gradient: 'from-emerald-50 to-teal-50', textColor: 'text-emerald-600', subColor: 'text-emerald-400', icon: Layers },
  { value: 100, label: '知识点', suffix: '+', gradient: 'from-amber-50 to-orange-50', textColor: 'text-amber-600', subColor: 'text-amber-400', icon: Lightbulb },
  { value: 50, label: '练习题', suffix: '+', gradient: 'from-rose-50 to-pink-50', textColor: 'text-rose-600', subColor: 'text-rose-400', icon: Code },
];

const roadmapModules = [
  { id: 'm1', emoji: '🐍', name: 'Python数据分析基础回顾' },
  { id: 'm2', emoji: '📊', name: 'Pandas数据处理与分析' },
  { id: 'm3', emoji: '📈', name: '数据可视化与商业图表' },
  { id: 'm4', emoji: '📐', name: '商务统计分析方法' },
  { id: 'm5', emoji: '📋', name: '商务智能与报表自动化' },
  { id: 'm6', emoji: '⛏️', name: '数据挖掘与商务实战' },
];

const learningStages = [
  {
    stage: '第一阶段',
    title: '基础入门',
    weeks: '第1~4周',
    icon: Rocket,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    lineColor: 'bg-emerald-200',
    description: '夯实Python数据分析基础，掌握核心工具链',
    points: [
      'Python数据类型与控制流回顾',
      'NumPy数组操作与向量化计算',
      'Pandas DataFrame创建与基本操作',
      '数据读取（CSV/Excel/JSON）',
      '数据索引、筛选与排序',
    ],
    courseId: 'm1',
  },
  {
    stage: '第二阶段',
    title: '核心技能',
    weeks: '第5~10周',
    icon: Star,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    lineColor: 'bg-blue-200',
    description: '深入Pandas数据处理，掌握数据清洗与聚合分析',
    points: [
      '缺失值处理与数据清洗',
      '分组聚合（groupby）与透视表',
      '数据合并（merge/concat/join）',
      '文本数据处理与正则表达式',
      '时间序列数据处理基础',
    ],
    courseId: 'm2',
  },
  {
    stage: '第三阶段',
    title: '进阶提升',
    weeks: '第11~14周',
    icon: Calendar,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    bgGradient: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    dotColor: 'bg-violet-500',
    lineColor: 'bg-violet-200',
    description: '掌握数据可视化与商务统计分析方法',
    points: [
      'Matplotlib基础与高级图表',
      'Seaborn统计可视化',
      '描述性统计与推断性统计',
      'A/B测试与假设检验',
      '相关分析与回归分析入门',
    ],
    courseId: 'm3',
  },
  {
    stage: '第四阶段',
    title: '实战应用',
    weeks: '第15~20周',
    icon: Flag,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    lineColor: 'bg-amber-200',
    description: '商务智能实战与数据挖掘，完成综合项目',
    points: [
      'Excel/报表自动化生成',
      '客户聚类分析与用户画像',
      '购物篮分析与关联规则',
      '异常值检测与业务预警',
      '综合商务分析项目实战',
    ],
    courseId: 'm5',
  },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Home() {
  const streakDays = 0;
  const todayChecked = false;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#e7f9f6] text-gray-800 px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-white/30 blur-3xl" />
          {/* Geometric decorations */}
          <div className="absolute top-8 right-8 w-20 h-20 border border-emerald-200 rounded-lg rotate-12 md:w-32 md:h-32" />
          <div className="absolute bottom-12 right-24 w-12 h-12 border border-emerald-200 rounded-full md:w-16 md:h-16" />
          <div className="absolute top-16 left-1/3 w-6 h-6 bg-emerald-300/30 rounded rotate-45" />
          <div className="absolute bottom-8 left-1/4 w-4 h-4 bg-teal-300/30 rounded-full" />
        </div>

        {/* Floating code snippet decoration */}
        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-64 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-200 p-4 font-mono text-xs leading-relaxed opacity-70 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div>
            <span className="text-purple-600">import</span> <span className="text-blue-600">pandas</span> <span className="text-purple-600">as</span> <span className="text-green-600">pd</span>
          </div>
          <div>
            <span className="text-purple-600">import</span> <span className="text-blue-600">matplotlib</span>
          </div>
          <div className="mt-2">
            <span className="text-green-600">df</span> = <span className="text-blue-600">pd</span>.<span className="text-yellow-600">read_csv</span>(<span className="text-amber-600">'sales.csv'</span>)
          </div>
          <div>
            <span className="text-green-600">df</span>.<span className="text-yellow-600">groupby</span>(<span className="text-amber-600">'region'</span>)
          </div>
          <div>
            &nbsp;&nbsp;.<span className="text-yellow-600">agg</span>({'{'} <span className="text-amber-600">'revenue'</span>: <span className="text-amber-600">'sum'</span> {'}'})
          </div>
          <div>
            &nbsp;&nbsp;.<span className="text-yellow-600">plot</span>(<span className="text-amber-600">kind</span>=<span className="text-amber-600">'bar'</span>)
          </div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#1e1b4b]">
            商务数据分析
            <br />
            在线教育平台
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            从Python基础到商业智能，系统掌握数据分析核心技能，助力你的职业发展
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
          >
            开始学习
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 text-center shadow-sm border border-white/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="flex justify-center mb-2">
                <div className={`w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center ${stat.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.textColor}`}>
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className={`mt-1 text-sm ${stat.subColor}`}>{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* 学习规划线 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            学习规划
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">按照以下阶段循序渐进，20周系统掌握商务数据分析核心技能。点击阶段卡片查看详细课程大纲</p>
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 via-violet-300 to-amber-300 md:left-1/2 md:-translate-x-px" />

            {learningStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isLeft = idx % 2 === 0;
              return (
                <div key={stage.stage} className={`relative mb-8 last:mb-0 md:flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-6 -translate-x-1/2 z-10 md:left-1/2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stage.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-4 md:mr-auto' : 'md:pl-4 md:ml-auto'}`}>
                    <Link to={`/learning-plan/${stage.courseId}`} className={`group block p-5 bg-gradient-to-br ${stage.bgGradient} rounded-2xl border ${stage.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 bg-gradient-to-r ${stage.gradient} text-white text-xs font-bold rounded-full`}>
                          {stage.stage}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {stage.weeks}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1e1b4b] mb-1">{stage.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{stage.description}</p>
                      <ul className="space-y-1.5">
                        {stage.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className={`w-1.5 h-1.5 rounded-full ${stage.dotColor} mt-1.5 shrink-0`} />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                        <span>查看课程</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 课程路线图 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3">
          <h2 className="text-lg font-bold text-white">课程路线图</h2>
        </div>
        <div className="p-6">
          <div className="relative">
            {/* Connecting line - desktop */}
            <div className="hidden md:block absolute top-10 left-[calc(8.33%+20px)] right-[calc(8.33%+20px)] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200" />
            {/* Connecting line - mobile */}
            <div className="md:hidden absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-indigo-200 via-violet-200 to-indigo-200" />
            {/* Desktop: horizontal layout */}
            <div className="hidden md:grid md:grid-cols-6 gap-4">
              {roadmapModules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {idx + 1}
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 w-full">
                    <div className="text-2xl mb-1">{mod.emoji}</div>
                    <div className="text-xs font-medium text-gray-700 leading-tight">{mod.name}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile: vertical layout */}
            <div className="md:hidden space-y-4">
              {roadmapModules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="flex items-center gap-4"
                >
                  <div className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {idx + 1}
                  </div>
                  <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-2xl">{mod.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{mod.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Entry Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <Link
          to="/courses/m1"
          className="group flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-amber-400 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <PlayCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#1e1b4b]">继续学习</div>
            <div className="text-sm text-gray-500">从上次的位置继续</div>
          </div>
        </Link>

        <Link
          to="/courses"
          className="group flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-indigo-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#1e1b4b]">课程中心</div>
            <div className="text-sm text-gray-500">浏览所有课程模块</div>
          </div>
        </Link>

        <Link
          to="/achievements"
          className="group flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-emerald-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#1e1b4b]">成就中心</div>
            <div className="text-sm text-gray-500">查看学习成就</div>
          </div>
        </Link>

        <Link
          to="/bootcamp"
          className="group flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-violet-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#1e1b4b]">实战训练营</div>
            <div className="text-sm text-gray-500">项目驱动式学习</div>
          </div>
        </Link>
      </section>

      {/* Pandas 实战训练营入口 */}
      <section className="relative overflow-hidden rounded-2xl bg-[#e7f9f6] text-gray-800 p-6 sm:p-8 animate-fade-in">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-teal-200/30 blur-2xl" />
          <div className="absolute top-4 right-16 text-6xl opacity-10 font-mono font-black text-emerald-600">PD</div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">实战训练营</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#1e1b4b]">Pandas 数据分析实战训练营</h2>
            <p className="text-gray-600 mb-4">
              10个真实项目，从数据清洗到商业分析，AI教练全程陪练，边学边练快速提升
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">10个梯度项目</span>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">真实数据集</span>
              <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">AI 陪练教练</span>
              <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm">浏览器内运行</span>
            </div>
            <Link
              to="/bootcamp"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
            >
              <Code2 className="w-5 h-5" />
              进入训练营
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="bg-white/60 rounded-lg p-3 text-center backdrop-blur-sm border border-emerald-100">
              <div className="text-xl font-bold text-emerald-600">10</div>
              <div className="text-[10px] text-gray-500">实战项目</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center backdrop-blur-sm border border-emerald-100">
              <div className="text-xl font-bold text-emerald-600">50</div>
              <div className="text-[10px] text-gray-500">练习任务</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center backdrop-blur-sm border border-emerald-100">
              <div className="text-xl font-bold text-emerald-600">4</div>
              <div className="text-[10px] text-gray-500">难度级别</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center backdrop-blur-sm border border-emerald-100">
              <div className="text-xl font-bold text-emerald-600">AI</div>
              <div className="text-[10px] text-gray-500">教练陪练</div>
            </div>
          </div>
        </div>
      </section>

      {/* Streak Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in">
        <h2 className="text-lg font-bold text-[#1e1b4b] mb-4">连续学习打卡</h2>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1e1b4b]">{streakDays} 天</div>
              <div className="text-sm text-gray-500">连续学习</div>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                todayChecked ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-100'
              }`}
            >
              <CheckCircle2
                className={`w-7 h-7 ${todayChecked ? 'text-white' : 'text-gray-300'}`}
              />
            </div>
            <div>
              <div className={`text-lg font-bold ${todayChecked ? 'text-emerald-600' : 'text-gray-400'}`}>
                {todayChecked ? '已打卡' : '未打卡'}
              </div>
              <div className="text-sm text-gray-500">今日状态</div>
            </div>
          </div>
        </div>
      </section>

      {/* 在线代码编辑器 */}
      <HomeCodeEditor />

      {/* 讲师团队 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-rose-500 to-orange-400 px-6 py-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            核心讲师团队
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 讲师1 */}
            <div className="group flex flex-col items-center text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                张
              </div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">张明远</h3>
              <p className="text-sm text-indigo-500 font-medium mt-1">课程总设计师</p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                前阿里数据分析专家，10年数据分析与商业智能经验。主导过多个千万级用户产品的数据体系搭建，擅长将复杂分析方法转化为可落地的商业决策。
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-indigo-400">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>浙江大学 统计学硕士</span>
              </div>
            </div>

            {/* 讲师2 */}
            <div className="group flex flex-col items-center text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                李
              </div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">李晓峰</h3>
              <p className="text-sm text-emerald-500 font-medium mt-1">Pandas 实战营主讲师</p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                前字节跳动高级数据分析师，8年Python数据分析实战经验。深耕Pandas数据处理与特征工程，累计培养数据分析师超2000人。
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>北京大学 计算机科学硕士</span>
              </div>
            </div>

            {/* 讲师3 */}
            <div className="group flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                王
              </div>
              <h3 className="text-lg font-bold text-[#1e1b4b]">王建国</h3>
              <p className="text-sm text-amber-500 font-medium mt-1">可视化与统计模块讲师</p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                前腾讯商业分析经理，6年商务数据可视化与统计分析经验。专注于用数据讲故事，帮助企业在复杂数据中发现商业洞察。
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-amber-400">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>复旦大学 应用数学硕士</span>
              </div>
            </div>
          </div>

          {/* 团队专注领域 */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-base font-bold text-[#1e1b4b] mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" />
              团队专注领域
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full text-sm font-medium shadow-sm">Python 数据分析</span>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-sm">Pandas 数据处理</span>
              <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-sm">数据可视化</span>
              <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-sm">商务统计分析</span>
              <span className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-sm">商业智能 BI</span>
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-full text-sm font-medium shadow-sm">数据挖掘与建模</span>
              <span className="px-4 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-full text-sm font-medium shadow-sm">报表自动化</span>
              <span className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-sm">A/B 测试与增长分析</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== 首页代码编辑器 ====================

const DEFAULT_CODE = `# 欢迎使用在线 Python 编辑器！
# 在这里可以直接运行 Python 代码，支持 numpy、pandas、matplotlib

import pandas as pd
import numpy as np

# 创建一个简单的 DataFrame
data = {
    '产品': ['笔记本', '手机', '平板', '耳机', '手表'],
    '销量': [1200, 3500, 1800, 4200, 2100],
    '单价': [5999, 3999, 2999, 999, 1599],
    '评分': [4.7, 4.5, 4.3, 4.8, 4.6]
}

df = pd.DataFrame(data)
df['销售额'] = df['销量'] * df['单价']

print("=== 产品销售数据 ===")
print(df.to_string(index=False))
print()
print(f"总销售额: ¥{df['销售额'].sum():,.0f}")
print(f"平均评分: {df['评分'].mean():.1f}")
print(f"最畅销产品: {df.loc[df['销量'].idxmax(), '产品']}")
`;

function HomeCodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideState, setPyodideState] = useState<'idle' | 'loading' | 'ready'>(
    isPyodideLoaded() ? 'ready' : 'idle'
  );
  const [loadingStatus, setLoadingStatus] = useState('');
  const [runCount, setRunCount] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const cleanup = onStatusChange((status) => {
      setLoadingStatus(status);
      if (status === '就绪') setPyodideState('ready');
      else if (status === '加载失败') setPyodideState('idle');
      else setPyodideState('loading');
    });
    return cleanup;
  }, []);

  const pythonCompletions = useMemo(() => [
    { label: 'import pandas as pd', kind: 4, insertText: 'import pandas as pd', documentation: '导入Pandas库' },
    { label: 'pd.read_csv', kind: 3, insertText: 'pd.read_csv(${1:filepath})', documentation: '读取CSV文件' },
    { label: 'pd.DataFrame', kind: 6, insertText: 'pd.DataFrame(${1:data})', documentation: '创建DataFrame' },
    { label: 'df.head', kind: 2, insertText: 'df.head(${1:5})', documentation: '查看前N行' },
    { label: 'df.info', kind: 2, insertText: 'df.info()', documentation: '查看数据信息' },
    { label: 'df.describe', kind: 2, insertText: 'df.describe()', documentation: '描述性统计' },
    { label: 'df.groupby', kind: 2, insertText: "df.groupby('${1:column}').${2:agg}()", documentation: '分组聚合' },
    { label: 'import numpy as np', kind: 4, insertText: 'import numpy as np', documentation: '导入NumPy库' },
    { label: 'import matplotlib.pyplot as plt', kind: 4, insertText: "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt", documentation: '导入Matplotlib' },
    { label: 'plt.plot', kind: 3, insertText: "plt.plot(${1:x}, ${2:y})", documentation: '折线图' },
    { label: 'plt.bar', kind: 3, insertText: "plt.bar(${1:x}, ${2:height})", documentation: '柱状图' },
  ], []);

  const handleEditorMount = useCallback((_editor: any, monaco: any) => {
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: () => {
        const suggestions = pythonCompletions.map((s) => ({
          ...s,
          kind: s.kind as any,
          insertTextRules: s.insertText.includes('${') ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
        }));
        return { suggestions };
      },
    });
  }, [pythonCompletions]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setError(null);
    setImages([]);
    setRunCount((c) => c + 1);
    setShowOutput(true);

    try {
      if (!isPyodideLoaded()) {
        setPyodideState('loading');
        await loadPyodide();
      }
      const result = await runPython(code);
      setOutput(result.output);
      setError(result.error);
      setImages(result.images);
    } catch (err: any) {
      setError(err.message || '运行出错');
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  const hasOutput = output || error || images.length > 0;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          在线 Python 编辑器
        </h2>
      </div>

      <div className="flex flex-col">
        {/* 工具栏 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-amber-400" />
              <span className="text-sm font-medium">Python 控制台</span>
            </div>
            {pyodideState === 'loading' && (
              <span className="text-xs text-amber-300 flex items-center gap-1">
                <Loader2 size={11} className="animate-spin" />
                {loadingStatus || '加载中...'}
              </span>
            )}
            {pyodideState === 'ready' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                就绪
              </span>
            )}
            {pyodideState === 'idle' && (
              <span className="text-xs text-gray-400">点击运行加载环境</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasOutput && showOutput && (
              <button
                onClick={() => { setOutput(''); setError(null); setImages([]); }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                <X size={12} />
                清空
              </button>
            )}
            <button
              onClick={handleRun}
              disabled={isRunning || pyodideState === 'loading'}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm"
            >
              {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isRunning ? '运行中...' : '运行代码'}
            </button>
          </div>
        </div>

        {/* 编辑器 */}
        <div style={{ height: '360px' }}>
          <React.Suspense fallback={<EditorFallback />}>
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                padding: { top: 12 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: { other: true, comments: false, strings: true },
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                folding: true,
                foldingStrategy: 'indentation',
              }}
            />
          </React.Suspense>
        </div>

        {/* 输出区域 */}
        {showOutput && (
          <div className="border-t border-gray-300">
            <div className="px-4 py-1.5 bg-gray-100 text-xs font-semibold text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>输出结果</span>
                {runCount > 0 && (
                  <span className="text-gray-400 font-normal">第 {runCount} 次运行</span>
                )}
              </div>
              <button
                onClick={() => setShowOutput(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            </div>
            <div className="p-4 bg-gray-50 min-h-[60px] max-h-[250px] overflow-y-auto">
              {!hasOutput && !isRunning && (
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <Play size={14} />
                  点击「运行代码」或按 Ctrl+Enter 执行
                </div>
              )}
              {isRunning && !hasOutput && (
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  正在执行代码...
                </div>
              )}
              {output && (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
              )}
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono leading-relaxed">{error}</pre>
                </div>
              )}
              {images.map((img, i) => (
                <div key={i} className="mt-3">
                  <img src={`data:image/png;base64,${img}`} alt={`图表 ${i + 1}`} className="max-w-full rounded border border-gray-200 shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">支持 numpy、pandas、matplotlib · 代码在浏览器本地运行 · Ctrl+Enter 快速执行</p>
      </div>
    </section>
  );
}
