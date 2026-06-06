import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, ArrowLeft, ArrowRight, Play, MessageSquare } from 'lucide-react';
import { allModules } from '../data/modules';
import { useCourseStore } from '../stores/courseStore';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CodeEditor from '../components/CodeEditor';
import AIFloatingWindow from '../components/AIFloatingWindow';

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const isLessonComplete = useCourseStore((s) => s.isLessonComplete);
  const markLessonComplete = useCourseStore((s) => s.markLessonComplete);
  const [justMarked, setJustMarked] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const { mod, chapter, lesson, prevLesson, nextLesson } = useMemo(() => {
    const m = allModules.find((m) => m.id === moduleId);
    if (!m) return { mod: null, chapter: null, lesson: null, prevLesson: null, nextLesson: null };

    let foundLesson: import('../types').Lesson | null = null;
    let foundChapter: import('../types').Chapter | null = null;
    let prev: { moduleId: string; lessonId: string } | null = null;
    let next: { moduleId: string; lessonId: string } | null = null;

    const allLessonsWithModule = m.chapters.flatMap((ch) =>
      ch.lessons.map((l) => ({ moduleId: m.id, chapterId: ch.id, lessonId: l.id, chapterTitle: ch.title, lessonTitle: l.title }))
    );

    for (let i = 0; i < allLessonsWithModule.length; i++) {
      if (allLessonsWithModule[i].lessonId === lessonId) {
        foundLesson = m.chapters.flatMap((ch) => ch.lessons).find((l) => l.id === lessonId) || null;
        foundChapter = m.chapters.find((ch) => ch.id === foundLesson?.chapterId) || null;
        if (i > 0) prev = { moduleId: allLessonsWithModule[i - 1].moduleId, lessonId: allLessonsWithModule[i - 1].lessonId };
        if (i < allLessonsWithModule.length - 1) next = { moduleId: allLessonsWithModule[i + 1].moduleId, lessonId: allLessonsWithModule[i + 1].lessonId };
        break;
      }
    }

    return { mod: m, chapter: foundChapter, lesson: foundLesson, prevLesson: prev, nextLesson: next };
  }, [moduleId, lessonId]);

  if (!mod || !lesson || !chapter) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">未找到该知识点</p>
      </div>
    );
  }

  const completed = isLessonComplete(lesson.id);

  const handleMarkComplete = () => {
    if (completed) return;
    markLessonComplete(lesson.id);
    setJustMarked(true);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 flex-wrap gap-y-1">
        <button onClick={() => navigate('/courses')} className="hover:text-[#1e1b4b] transition-colors">课程中心</button>
        <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
        <button onClick={() => navigate(`/courses/${mod.id}`)} className="hover:text-[#1e1b4b] transition-colors">{mod.title}</button>
        <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
        <span className="text-gray-400 hidden sm:inline">{chapter.title}</span>
        <ChevronRight className="w-4 h-4 mx-1 shrink-0 hidden sm:inline" />
        <span className="text-[#1e1b4b] font-medium">{lesson.title}</span>
      </nav>

      {/* Lesson Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">{lesson.title}</h1>
        {(completed || justMarked) && (
          <CheckCircle className={`w-6 h-6 text-[#10b981] shrink-0 ${justMarked ? 'animate-check-pop' : ''}`} />
        )}
      </div>

      {/* Main Content: Left theory + Right code — stack on small screens */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Theory */}
        <div className="flex-1 min-w-0 bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
          <MarkdownRenderer content={lesson.content} />
        </div>

        {/* Right: Code Editor */}
        {lesson.codeExample && (
          <div className="lg:w-[480px] shrink-0 min-h-[400px]">
            <div className="flex items-center justify-end mb-2">
              <button
                onClick={() => setAiOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  aiOpen ? 'bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <MessageSquare size={13} />
                AI助手
              </button>
            </div>
            <CodeEditor code={lesson.codeExample} height="500px" />
          </div>
        )}
      </div>

      {/* Practice Button */}
      {lesson.exercise && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-[#1e1b4b]">编程练习</h3>
              <p className="text-sm text-gray-500 mt-1">{lesson.exercise.description.slice(0, 80)}…</p>
            </div>
            <button
              onClick={() => navigate(`/practice/${lesson.exercise!.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1e1b4b] hover:bg-[#2d2a6e] text-white rounded-lg font-medium transition-colors shrink-0"
            >
              <Play className="w-4 h-4" />
              开始练习
            </button>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-wrap gap-3">
        {/* Prev */}
        <button
          onClick={() => prevLesson && navigate(`/courses/${prevLesson.moduleId}/${prevLesson.lessonId}`)}
          disabled={!prevLesson}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          上一个
        </button>

        {/* Mark Complete */}
        <button
          onClick={handleMarkComplete}
          disabled={completed}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            completed
              ? 'bg-[#10b981]/10 text-[#10b981] cursor-default'
              : justMarked
              ? 'bg-[#10b981] text-white animate-green-pulse'
              : 'bg-[#f59e0b] hover:bg-[#d97706] text-white'
          }`}
        >
          <CheckCircle className={`w-4 h-4 ${justMarked ? 'animate-check-pop' : ''}`} />
          {completed ? '已学完' : justMarked ? '已学完' : '标记为已学'}
        </button>

        {/* Next */}
        <button
          onClick={() => nextLesson && navigate(`/courses/${nextLesson.moduleId}/${nextLesson.lessonId}`)}
          disabled={!nextLesson}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          下一个
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI助手浮窗 */}
      <AIFloatingWindow
        chatId={`lesson-${lessonId}`}
        hideTrigger
        open={aiOpen}
        onOpenChange={setAiOpen}
        contextInfo={{
          projectTitle: lesson.title,
          userCode: lesson.codeExample,
        }}
      />
    </div>
  );
}
