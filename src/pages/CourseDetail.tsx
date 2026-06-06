import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle, BookOpen, Code, ArrowRight } from 'lucide-react';
import { allModules } from '../data/modules';
import { useCourseStore } from '../stores/courseStore';

export default function CourseDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const getChapterProgress = useCourseStore((s) => s.getChapterProgress);
  const isLessonComplete = useCourseStore((s) => s.isLessonComplete);

  const mod = allModules.find((m) => m.id === moduleId);

  if (!mod) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">未找到该课程模块</p>
      </div>
    );
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Module Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-4xl w-14 h-14 flex items-center justify-center bg-[#1e1b4b]/5 rounded-xl shrink-0">
              {mod.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e1b4b]">{mod.title}</h1>
              <p className="text-gray-500 mt-1">{mod.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>{mod.chapters.length} 章节</span>
                <span>{mod.chapters.reduce((s, ch) => s + ch.lessons.length, 0)} 知识点</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/quiz/${mod.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg font-medium transition-colors shrink-0"
          >
            开始测评
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-3 stagger-children">
        {mod.chapters.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const lessonIds = chapter.lessons.map((l) => l.id);
          const progress = getChapterProgress(chapter.id, lessonIds);

          return (
            <div
              key={chapter.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-[#f59e0b]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <h3 className="font-semibold text-[#1e1b4b]">{chapter.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 hidden sm:inline">{chapter.lessons.length} 知识点</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: progress === 100 ? '#10b981' : '#f59e0b',
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-8 text-right">{progress}%</span>
                  </div>
                </div>
              </button>

              {/* Lesson List */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {chapter.lessons.map((lesson) => {
                    const completed = isLessonComplete(lesson.id);
                    const isTheory = lesson.type === 'theory';
                    const isPractice = lesson.type === 'practice';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/courses/${mod.id}/${lesson.id}`)}
                        className="w-full flex items-center justify-between px-6 py-3.5 pl-14 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          {completed ? (
                            <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <span className={`text-sm ${completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(isTheory || lesson.type === 'both') && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#1e1b4b]/5 text-[#1e1b4b]">
                              <BookOpen className="w-3 h-3" />
                              理论
                            </span>
                          )}
                          {(isPractice || lesson.type === 'both') && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b]">
                              <Code className="w-3 h-3" />
                              练习
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
