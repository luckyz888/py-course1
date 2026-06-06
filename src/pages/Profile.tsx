import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Star, Flame, BookOpen, Download, Upload, Trash2, AlertTriangle, TrendingUp, Award, BarChart3, Database, LogIn, Settings, Lock } from 'lucide-react';
import { useCourseStore } from '../stores/courseStore';
import { useExerciseStore } from '../stores/exerciseStore';
import { useQuizStore } from '../stores/quizStore';
import { useAchievementStore } from '../stores/achievementStore';
import { useAuthStore } from '../stores/authStore';
import { allModules } from '../data/modules';
import { exportAllData, importAllData, resetAllData } from '../utils/dataExport';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';

export default function Profile() {
  const { completedLessons, getModuleProgress } = useCourseStore();
  const { exerciseResults } = useExerciseStore();
  const { quizResults, getBestScore } = useQuizStore();
  const { points, streak, getLevel } = useAchievementStore();
  const { isLoggedIn, currentUser, updateProfile, changePassword } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const level = getLevel();

  // 练习统计
  const totalExercises = allModules.reduce(
    (sum, m) => sum + m.chapters.reduce(
      (s, ch) => s + ch.lessons.filter((l) => l.exercise).length, 0
    ), 0
  );
  const passedExercises = Object.values(exerciseResults).filter((r) => r.passed).length;

  // 测评统计
  const quizEntries = Object.values(quizResults);
  const passedQuizzes = quizEntries.filter((r) => (r.score / r.totalQuestions) * 100 >= 60).length;
  const quizPassRate = quizEntries.length > 0
    ? Math.round((passedQuizzes / quizEntries.length) * 100)
    : 0;

  // 测评最高分列表
  const bestScores = allModules.map((m) => ({
    moduleId: m.id,
    title: m.title,
    bestScore: getBestScore(m.id),
  })).filter((s) => s.bestScore > 0);

  // 导出
  const handleExport = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(false);
    setImportSuccess(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = importAllData(text);
      if (success) {
        setImportSuccess(true);
        setTimeout(() => window.location.reload(), 800);
      } else {
        setImportError(true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 重置
  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 个人中心头部横幅 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 p-6 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC00VjI0SDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 text-3xl">
            {isLoggedIn && currentUser ? currentUser.avatar : <User className="w-8 h-8 text-white" />}
          </div>
          <div className="flex-1">
            {isLoggedIn && currentUser ? (
              <>
                <h1 className="text-2xl font-bold text-white">{currentUser.username}</h1>
                <p className="text-sm text-white/70 mt-0.5">{currentUser.bio || currentUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white/80">
                    {currentUser.loginType === 'local' ? '邮箱注册' : currentUser.loginType === 'wechat' ? '微信登录' : 'GitHub登录'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">个人中心</h1>
                <p className="text-sm text-white/70 mt-0.5">登录后可同步学习进度</p>
                <Link to="/auth" className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30 transition-colors">
                  <LogIn className="w-3 h-3" /> 登录 / 注册
                </Link>
              </>
            )}
          </div>
          {isLoggedIn && currentUser && (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditUsername(currentUser.username); setEditBio(currentUser.bio); setEditingProfile(true); }}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => { setChangingPassword(true); setPwdMsg(null); }}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Lock className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 学习统计卡片 */}
      <div className="grid grid-cols-2 gap-4 stagger-children">
        <StatsCard
          title="总积分"
          value={points}
          icon={<Star className="w-6 h-6" />}
          color="#f59e0b"
        />
        <StatsCard
          title="当前等级"
          value={level.name}
          icon={<Award className="w-6 h-6" />}
          color="#8b5cf6"
        />
        <StatsCard
          title="连续学习天数"
          value={streak}
          icon={<Flame className="w-6 h-6" />}
          color="#ef4444"
        />
        <StatsCard
          title="完成知识点数"
          value={completedLessons.length}
          icon={<BookOpen className="w-6 h-6" />}
          color="#10b981"
        />
      </div>

      {/* 学习进度概览 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-[#1e1b4b]">学习进度概览</h2>
        </div>
        <div className="space-y-4">
          {allModules.map((m) => (
            <ProgressBar
              key={m.id}
              label={m.title}
              progress={getModuleProgress(m.id)}
            />
          ))}
        </div>
      </div>

      {/* 练习与测评统计 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          <BarChart3 className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-[#1e1b4b]">练习与测评统计</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <p className="text-sm text-emerald-600 mb-1">已通过练习</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {passedExercises}<span className="text-base font-normal text-gray-400"> / {totalExercises}</span>
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <p className="text-sm text-amber-600 mb-1">测评通过率</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{quizPassRate}%</p>
          </div>
        </div>
        {bestScores.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">测评最高分</h3>
            <div className="space-y-2">
              {bestScores.map((s) => (
                <div key={s.moduleId} className="flex justify-between items-center py-2 px-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                  <span className="text-sm text-gray-700">{s.title}</span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">{s.bestScore}分</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {bestScores.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">暂无测评记录</p>
        )}
      </div>

      {/* 数据管理 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500" />
          <Database className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-[#1e1b4b]">数据管理</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 text-sm font-medium hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-200"
          >
            <Download className="w-4 h-4 group-hover:animate-bounce" />
            导出数据
          </button>
          <button
            onClick={handleImport}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-200 text-sm font-medium hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-200"
          >
            <Upload className="w-4 h-4 group-hover:animate-bounce" />
            导入数据
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-lg hover:from-red-500 hover:to-rose-600 transition-all duration-200 text-sm font-medium hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-200"
          >
            <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
            重置数据
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        {importSuccess && (
          <p className="mt-3 text-sm text-emerald-500 font-medium">✓ 导入成功，页面即将刷新…</p>
        )}
        {importError && (
          <p className="mt-3 text-sm text-red-500 font-medium">✗ 导入失败，请检查文件格式是否正确。</p>
        )}
      </div>

      {/* 编辑资料对话框 */}
      {editingProfile && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 animate-slide-up border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">编辑资料</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setEditingProfile(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={() => { updateProfile({ username: editUsername, bio: editBio }); setEditingProfile(false); }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:shadow-md transition-all">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 修改密码对话框 */}
      {changingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 animate-slide-up border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">修改密码</h3>
            {pwdMsg && (
              <div className={`mb-3 px-3 py-2 rounded-lg text-sm ${pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{pwdMsg.text}</div>
            )}
            <div className="space-y-3">
              <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="原密码"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="新密码（至少6位）"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setChangingPassword(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={() => {
                const result = changePassword(oldPwd, newPwd);
                setPwdMsg({ type: result.success ? 'success' : 'error', text: result.message });
                if (result.success) setTimeout(() => setChangingPassword(false), 1000);
              }} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:shadow-md transition-all">确认修改</button>
            </div>
          </div>
        </div>
      )}

      {/* 重置确认对话框 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 animate-slide-up border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">确认重置</h3>
            </div>
            <p className="text-gray-600 mb-6">此操作将清除所有学习数据，包括课程进度、练习记录、测评结果和成就数据。此操作不可撤销。</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-200 hover:shadow-md"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
