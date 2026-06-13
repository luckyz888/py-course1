import React, { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Play,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  Database,
  Loader2,
  Terminal,
  X,
  Code2,
  ClipboardCheck,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';
import { bootcampProjects } from '../data/bootcamp';
import { useBootcampStore } from '../stores/bootcampStore';
import { runPython, isPyodideLoaded, loadPyodide, onStatusChange, preloadPyodide } from '../utils/pyodide';
import MarkdownRenderer from '../components/MarkdownRenderer';
import AIFloatingWindow from '../components/AIFloatingWindow';

// 懒加载 Monaco Editor — 减少首屏加载体积
const Editor = React.lazy(() => import('@monaco-editor/react'));

// 检测移动设备
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
}

// Monaco 加载中的占位符
function EditorFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400 text-sm">
      <Loader2 size={16} className="animate-spin mr-2" />
      加载编辑器...
    </div>
  );
}

export default function BootcampProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const store = useBootcampStore();
  const project = bootcampProjects.find((p) => p.id === projectId);

  const [editorCode, setEditorCode] = useState<string>(() => {
    if (!project) return '';
    return store.getCode(project.id) || project.starterCode;
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showReference, setShowReference] = useState(false);
  const [leftWidth, setLeftWidth] = useState(420);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 进入页面时立即预加载 Pyodide（后台加载，不阻塞渲染）
  useEffect(() => {
    preloadPyodide();
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.userSelect = 'none';

    const getClientX = (e: MouseEvent | TouchEvent): number => {
      if ('touches' in e) {
        const t = e.touches[0] || (e as TouchEvent).changedTouches[0];
        return t ? t.clientX : 0;
      }
      return (e as MouseEvent).clientX;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(280, Math.min(getClientX(e) - containerRect.left, containerRect.width - 400));
      setLeftWidth(newWidth);
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, []);

  const handleCodeChange = useCallback(
    (code: string) => {
      setEditorCode(code);
      if (project) store.saveCode(project.id, code);
    },
    [project, store]
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleItem = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">项目未找到</p>
          <button
            onClick={() => navigate('/bootcamp')}
            className="px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
          >
            返回训练营
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/bootcamp')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-900 transition-colors"
          >
            <ArrowLeft size={16} />
            返回
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-base font-bold text-gray-900 truncate">{project.title}</h1>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {project.difficultyLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="hidden sm:inline px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 左右分栏主体 */}
      <div className="flex flex-1 min-h-0" ref={containerRef}>
        {/* 左侧：知识点大纲 */}
        <div className="shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto" style={{ width: leftWidth }}>
          <KnowledgePanel
            project={project}
            expandedSections={expandedSections}
            expandedItems={expandedItems}
            onToggleSection={toggleSection}
            onToggleItem={toggleItem}
            onLoadCode={handleCodeChange}
          />
        </div>

        {/* 拖拽分割条 */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="w-1.5 shrink-0 bg-gray-200 hover:bg-indigo-400 cursor-col-resize transition-colors relative group"
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gray-400 group-hover:bg-indigo-500 transition-colors" />
        </div>

        {/* 右侧：代码工作台 */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <Workspace
            project={project}
            code={editorCode}
            onCodeChange={handleCodeChange}
            showReference={showReference}
            onToggleReference={() => setShowReference(!showReference)}
            onCloseReference={() => setShowReference(false)}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== 左侧知识点面板 ====================

interface KnowledgePanelProps {
  project: (typeof bootcampProjects)[number];
  expandedSections: Record<string, boolean>;
  expandedItems: Record<string, boolean>;
  onToggleSection: (title: string) => void;
  onToggleItem: (key: string) => void;
  onLoadCode: (code: string) => void;
}

const KnowledgePanel = memo(function KnowledgePanel({
  project,
  expandedSections,
  expandedItems,
  onToggleSection,
  onToggleItem,
  onLoadCode,
}: KnowledgePanelProps) {
  const store = useBootcampStore();

  const importanceConfig = useMemo(() => ({
    core: { label: '核心', color: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
    important: { label: '重要', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    supplementary: { label: '补充', color: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400' },
  }), []);

  const sectionColors = useMemo(() => [
    'from-indigo-500 to-indigo-700',
    'from-emerald-500 to-emerald-700',
    'from-amber-500 to-amber-700',
    'from-rose-500 to-rose-700',
    'from-violet-500 to-violet-700',
    'from-cyan-500 to-cyan-700',
    'from-orange-500 to-orange-700',
  ], []);

  return (
    <div className="p-4 space-y-4">
      {/* 项目简介 - 渐变卡片 */}
      <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <h2 className="font-bold text-indigo-900">项目简介</h2>
        </div>
        <p className="text-sm text-indigo-800/80 leading-relaxed">{project.description}</p>
      </div>

      {/* 数据集说明 - 绿色卡片 */}
      <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Database size={14} className="text-white" />
          </div>
          <h2 className="font-bold text-emerald-900">数据集</h2>
        </div>
        <p className="text-sm text-emerald-800/80 leading-relaxed">{project.datasetDescription}</p>
        <div className="mt-2 px-2.5 py-1 bg-emerald-100 rounded-md inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-emerald-700 font-medium">df 变量已预加载，可直接使用</span>
        </div>
      </div>

      {/* 学习大纲 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-gray-900">学习大纲</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />核心</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />重要</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" />补充</span>
          </div>
        </div>
        {project.outline.map((section, si) => {
          const sectionOpen = expandedSections[section.title] ?? si === 0;
          const gradient = sectionColors[si % sectionColors.length];
          return (
            <div key={si} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <button
                onClick={() => onToggleSection(section.title)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} text-white text-xs font-bold shadow-sm`}>
                    {si + 1}
                  </span>
                  <span className="font-semibold text-sm text-gray-900">{section.title}</span>
                </div>
                {sectionOpen ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>

              {sectionOpen && (
                <div className="border-t border-gray-100 bg-white">
                  {section.items.map((item, ii) => {
                    const itemKey = `${si}-${ii}`;
                    const itemOpen = expandedItems[itemKey] ?? false;
                    const imp = item.importance || 'important';
                    const config = importanceConfig[imp];
                    return (
                      <div key={ii} className="border-b border-gray-50 last:border-b-0">
                        <button
                          onClick={() => onToggleItem(itemKey)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                            <span className="text-sm text-gray-800">{item.title}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          {itemOpen ? (
                            <ChevronDown size={14} className="text-gray-400" />
                          ) : (
                            <ChevronRight size={14} className="text-gray-400" />
                          )}
                        </button>

                        {itemOpen && (
                          <div className="px-4 pb-3 space-y-3">
                            <div className="pl-4 text-sm text-gray-600 leading-relaxed border-l-2 border-indigo-200">
                              <MarkdownRenderer content={item.content} />
                            </div>
                            {item.codeExample && (
                              <div className="relative rounded-lg overflow-hidden ring-1 ring-gray-200">
                                <pre className="bg-gray-900 text-green-300 p-3 pr-20 overflow-x-auto text-xs font-mono leading-relaxed">
                                  {item.codeExample}
                                </pre>
                                <button
                                  onClick={() => onLoadCode(item.codeExample!)}
                                  className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
                                >
                                  <Play size={10} />
                                  试一试
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 任务列表 */}
      <div className="rounded-xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center">
            <ClipboardCheck size={14} className="text-white" />
          </div>
          任务清单
        </h3>
        <div className="space-y-1.5">
          {project.tasks.map((task, i) => {
            const completed = store.isTaskCompleted(project.id, task.id);
            return (
              <div
                key={task.id}
                className={`flex items-start gap-2 p-2 rounded-lg text-sm transition-colors ${
                  completed ? 'bg-emerald-50/80' : 'bg-white/60 hover:bg-white'
                }`}
              >
                <button
                  onClick={() => { if (!completed) store.completeTask(project.id, task.id); }}
                  className="shrink-0 mt-0.5"
                >
                  <CheckCircle2
                    size={16}
                    className={completed ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-300'}
                  />
                </button>
                <div>
                  <span className={completed ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'}>
                    {i + 1}. {task.title}
                  </span>
                  {!completed && (
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// ==================== 右侧代码工作台 ====================

interface WorkspaceProps {
  project: (typeof bootcampProjects)[number];
  code: string;
  onCodeChange: (code: string) => void;
  showReference: boolean;
  onToggleReference: () => void;
  onCloseReference: () => void;
}

function Workspace({ project, code, onCodeChange, showReference, onToggleReference, onCloseReference }: WorkspaceProps) {
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideState, setPyodideState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    isPyodideLoaded() ? 'ready' : 'idle'
  );
  const [loadingStatus, setLoadingStatus] = useState('');
  const [runCount, setRunCount] = useState(0);
  const [activeBottomTab, setActiveBottomTab] = useState<'output' | 'tasks'>('output');
  const [bottomHeight, setBottomHeight] = useState(240);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const isVDragging = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 监听 Pyodide 加载状态
  useEffect(() => {
    const cleanup = onStatusChange((status) => {
      setLoadingStatus(status);
      if (status === '就绪') setPyodideState('ready');
      else if (status === '加载失败') setPyodideState('error');
      else setPyodideState('loading');
    });
    return cleanup;
  }, []);

  // Python 自动补全建议 — 缓存避免每次渲染重建
  const pythonCompletions = useMemo(() => [
    { label: 'import pandas as pd', kind: 4, insertText: 'import pandas as pd', documentation: '导入Pandas库' },
    { label: 'pd.read_csv', kind: 3, insertText: "pd.read_csv('${1:file}')", documentation: '读取CSV文件' },
    { label: 'pd.DataFrame', kind: 6, insertText: 'pd.DataFrame(${1:data})', documentation: '创建DataFrame' },
    { label: 'df.head', kind: 2, insertText: 'df.head(${1:5})', documentation: '查看前N行' },
    { label: 'df.info', kind: 2, insertText: 'df.info()', documentation: '查看数据信息' },
    { label: 'df.describe', kind: 2, insertText: 'df.describe()', documentation: '描述性统计' },
    { label: 'df.groupby', kind: 2, insertText: "df.groupby('${1:col}').${2:agg}()", documentation: '分组聚合' },
    { label: 'df.dropna', kind: 2, insertText: 'df.dropna()', documentation: '删除缺失值' },
    { label: 'df.fillna', kind: 2, insertText: "df.fillna(${1:0})", documentation: '填充缺失值' },
    { label: 'df.value_counts', kind: 2, insertText: "df['${1:col}'].value_counts()", documentation: '值计数' },
    { label: 'df.sort_values', kind: 2, insertText: "df.sort_values('${1:col}', ascending=${2:False})", documentation: '排序' },
    { label: 'df.apply', kind: 2, insertText: "df['${1:col}'].apply(${2:func})", documentation: '应用函数' },
    { label: 'df.pivot_table', kind: 2, insertText: "pd.pivot_table(df, values='${1:val}', index='${2:idx}', aggfunc='${3:mean}')", documentation: '透视表' },
    { label: 'df.merge', kind: 2, insertText: "pd.merge(${1:df1}, ${2:df2}, on='${3:key}')", documentation: '合并DataFrame' },
    { label: 'import numpy as np', kind: 4, insertText: 'import numpy as np', documentation: '导入NumPy库' },
    { label: 'np.mean', kind: 3, insertText: 'np.mean(${1:data})', documentation: '计算均值' },
    { label: 'import matplotlib', kind: 4, insertText: "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt", documentation: '导入Matplotlib（Agg后端）' },
    { label: 'plt.plot', kind: 3, insertText: "plt.plot(${1:x}, ${2:y})", documentation: '折线图' },
    { label: 'plt.bar', kind: 3, insertText: "plt.bar(${1:x}, ${2:height})", documentation: '柱状图' },
    { label: 'plt.scatter', kind: 3, insertText: "plt.scatter(${1:x}, ${2:y})", documentation: '散点图' },
  ], []);

  const handleEditorMount = useCallback((_editor: any, monaco: any) => {
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        const suggestions = pythonCompletions.map((s) => ({
          ...s,
          kind: s.kind as any,
          range,
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
    setActiveBottomTab('output');

    try {
      // 确保 Pyodide 已加载
      if (!isPyodideLoaded()) {
        setPyodideState('loading');
        setLoadingStatus('正在加载 Python 环境...');
        await loadPyodide();
      }

      // 加载数据集
      if (project.datasetCode) {
        setLoadingStatus('正在加载数据集...');
        try { await runPython(project.datasetCode); } catch {}
      }

      // 运行用户代码
      setLoadingStatus('正在执行代码...');
      const result = await runPython(code);
      setOutput(result.output);
      setError(result.error);
      setImages(result.images);
    } catch (err: any) {
      setError(err.message || '运行出错');
      if (!isPyodideLoaded()) setPyodideState('error');
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code, project.datasetCode]);

  const handleReset = useCallback(() => {
    onCodeChange(project.starterCode);
    setOutput('');
    setError(null);
    setImages([]);
  }, [onCodeChange, project.starterCode]);

  const handleLoadReference = useCallback(() => {
    onCodeChange(project.referenceSolution);
    onCloseReference();
  }, [onCodeChange, project.referenceSolution, onCloseReference]);

  // 文件上传处理
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls', 'tsv'].includes(ext || '')) {
      setError('仅支持 CSV / Excel (.xlsx/.xls) / TSV 文件');
      return;
    }

    try {
      if (!isPyodideLoaded()) {
        setPyodideState('loading');
        setLoadingStatus('正在加载 Python 环境...');
        await loadPyodide();
      }

      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);

      const targetPath = ext === 'csv' || ext === 'tsv' ? '/uploaded_data.csv' : '/uploaded_data.xlsx';
      (window as any).pyodide.FS.writeFile(targetPath, uint8);

      setUploadedFile(file.name);
      setActiveBottomTab('output');
      setOutput(`文件 "${file.name}" 已上传到 ${targetPath}\n可用以下代码读取：\n  df_uploaded = pd.read_csv('${targetPath}')  # CSV\n  df_uploaded = pd.read_excel('${targetPath}')  # Excel`);
      setError(null);
    } catch (err: any) {
      setError('文件上传失败: ' + (err.message || String(err)));
    }

    e.target.value = '';
  }, []);

  // 垂直拖拽：调节编辑器和输出面板的高度
  const handleVDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isVDragging.current = true;
    document.body.style.userSelect = 'none';

    const getClientY = (e: MouseEvent | TouchEvent): number => {
      if ('touches' in e) {
        const t = e.touches[0] || (e as TouchEvent).changedTouches[0];
        return t ? t.clientY : 0;
      }
      return (e as MouseEvent).clientY;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isVDragging.current || !workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const newHeight = Math.max(100, Math.min(rect.bottom - getClientY(e), rect.height - 150));
      setBottomHeight(newHeight);
    };

    const handleEnd = () => {
      isVDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, []);

  // Ctrl+Enter 快捷键
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
    <div className="flex flex-col h-full relative" ref={workspaceRef}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 size={14} className="text-amber-400" />
            <span className="text-sm font-medium">工作台</span>
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
          {pyodideState === 'error' && (
            <span className="text-xs text-red-400">加载失败</span>
          )}
          {pyodideState === 'idle' && (
            <span className="text-xs text-gray-400">点击运行加载环境</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* 文件上传 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
              uploadedFile ? 'bg-emerald-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Upload size={12} />
            {uploadedFile ? uploadedFile : '上传文件'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.tsv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <RotateCcw size={12} />
            重置代码
          </button>
          <button
            onClick={onToggleReference}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
              showReference ? 'bg-amber-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Lightbulb size={12} />
            参考答案
          </button>
          <button
            onClick={() => setActiveBottomTab('tasks')}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <ClipboardCheck size={12} />
            任务
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? '运行中...' : '运行代码'}
          </button>
        </div>
      </div>

      {/* 参考答案浮层 */}
      {showReference && (
        <div className="border-b border-amber-300 bg-amber-50 max-h-[40%] overflow-y-auto shrink-0">
          <div className="flex items-center justify-between px-4 py-2 bg-amber-100 sticky top-0">
            <span className="text-sm font-bold text-amber-800">参考解答</span>
            <div className="flex gap-2">
              <button
                onClick={handleLoadReference}
                className="px-3 py-1 text-xs bg-indigo-900 text-white rounded hover:bg-indigo-800 transition-colors"
              >
                加载到编辑器
              </button>
              <button onClick={onCloseReference} className="p-1 hover:bg-amber-200 rounded">
                <X size={14} className="text-amber-700" />
              </button>
            </div>
          </div>
          <pre className="p-4 text-sm text-gray-800 font-mono leading-relaxed whitespace-pre-wrap">
            {project.referenceSolution}
          </pre>
        </div>
      )}

      {/* 代码编辑器 — 移动端用 textarea，桌面端用 Monaco */}
      <div className="flex-1 min-h-0" style={{ minHeight: '120px' }}>
        {isMobileDevice() ? (
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full h-full bg-gray-900 text-green-300 p-3 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border-0"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        ) : (
          <React.Suspense fallback={<EditorFallback />}>
            <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => onCodeChange(value || '')}
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
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showVariables: true,
                showClasses: true,
                showModules: true,
              },
              parameterHints: { enabled: true },
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: true },
              hover: { enabled: true },
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              folding: true,
              foldingStrategy: 'indentation',
            }}
          />
        </React.Suspense>
        )}
      </div>

      {/* 上下拖拽分割条 */}
      <div
        onMouseDown={handleVDragStart}
        onTouchStart={handleVDragStart}
        className="h-1.5 shrink-0 bg-gray-200 hover:bg-indigo-400 cursor-row-resize transition-colors relative group flex items-center justify-center"
      >
        <div className="w-8 h-1 rounded-full bg-gray-400 group-hover:bg-indigo-500 transition-colors" />
      </div>

      {/* 底部输出/任务面板 */}
      <div className="shrink-0 border-t border-gray-300 flex flex-col" style={{ height: bottomHeight }}>
        {/* 底部标签栏 */}
        <div className="flex items-center bg-gray-100 border-b border-gray-200 shrink-0">
          <button
            onClick={() => setActiveBottomTab('output')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium transition-colors ${
              activeBottomTab === 'output'
                ? 'text-indigo-900 border-b-2 border-indigo-900 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Terminal size={12} />
            输出结果
            {runCount > 0 && (
              <span className="text-gray-400 ml-1">#{runCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveBottomTab('tasks')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium transition-colors ${
              activeBottomTab === 'tasks'
                ? 'text-indigo-900 border-b-2 border-indigo-900 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardCheck size={12} />
            任务测试
          </button>
          {hasOutput && activeBottomTab === 'output' && (
            <button
              onClick={() => { setOutput(''); setError(null); setImages([]); }}
              className="ml-auto px-3 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              清空
            </button>
          )}
        </div>

        {/* 底部内容 */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeBottomTab === 'output' && (
            <div className="p-3">
              {!hasOutput && !isRunning && (
                <div className="text-sm text-gray-400 flex flex-col items-center gap-2 py-4">
                  <div className="flex items-center gap-2">
                    <Play size={14} />
                    点击「运行代码」或按 Ctrl+Enter 执行
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <FileSpreadsheet size={12} />
                    支持上传 CSV/Excel 文件，在代码中用 pd.read_csv() 读取
                  </div>
                </div>
              )}
              {isRunning && !hasOutput && (
                <div className="text-sm text-gray-400 flex items-center gap-2 py-4 justify-center">
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
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`图表 ${i + 1}`}
                    className="max-w-full rounded border border-gray-200 shadow-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {activeBottomTab === 'tasks' && (
            <TaskTestPanel project={project} />
          )}
        </div>
      </div>

      {/* AI助手浮窗 */}
      <AIFloatingWindow
        chatId={`bootcamp-${project.id}`}
        contextInfo={{
          projectTitle: project.title,
          userCode: code,
          error: error || undefined,
        }}
      />
    </div>
  );
}

// ==================== 任务测试面板 ====================

function TaskTestPanel({ project }: { project: (typeof bootcampProjects)[number] }) {
  const store = useBootcampStore();

  return (
    <div className="p-3 space-y-2">
      {project.tasks.map((task, i) => {
        const completed = store.isTaskCompleted(project.id, task.id);
        return (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
              completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'
            }`}
          >
            <button
              onClick={() => { if (!completed) store.completeTask(project.id, task.id); }}
              className="shrink-0 mt-0.5"
            >
              <CheckCircle2
                size={20}
                className={completed ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-400'}
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-500">{i + 1}.</span>
                <span className={`text-sm font-medium ${completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {task.title}
                </span>
                {completed && (
                  <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">已完成</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              {!completed && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">
                  <span className="font-medium">提示：</span>{task.hint}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
