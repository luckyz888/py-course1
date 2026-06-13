import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Loader2, Terminal, X } from 'lucide-react';
import { runPython, isPyodideLoaded, loadPyodide, onStatusChange, preloadPyodide } from '../utils/pyodide';

// 检测是否为移动设备
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
}

// 懒加载 Monaco Editor（仅桌面端使用）
const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

function EditorFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400 text-sm">
      <Loader2 size={16} className="animate-spin mr-2" />
      加载编辑器...
    </div>
  );
}

// 移动端代码输入框 — 原生 textarea，兼容虚拟键盘
function MobileCodeInput({ code, onChange, height }: { code: string; onChange: (v: string) => void; height: string }) {
  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      style={{ height, minHeight: '200px' }}
      className="w-full bg-gray-900 text-green-300 p-3 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border-0"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      inputMode="text"
    />
  );
}

interface CodeEditorProps {
  code: string;
  onCodeChange?: (code: string) => void;
  height?: string;
  datasetCode?: string;
}

export default function CodeEditor({ code: codeProp, onCodeChange, height = '350px', datasetCode }: CodeEditorProps) {
  const [internalCode, setInternalCode] = useState(codeProp);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideState, setPyodideState] = useState<'idle' | 'loading' | 'ready'>(
    isPyodideLoaded() ? 'ready' : 'idle'
  );
  const [loadingStatus, setLoadingStatus] = useState('');
  const [runCount, setRunCount] = useState(0);
  const [isMobile] = useState(isMobileDevice);
  const editorRef = useRef<any>(null);

  useEffect(() => { setInternalCode(codeProp); }, [codeProp]);
  useEffect(() => { preloadPyodide(); }, []);

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
    { label: 'df.merge', kind: 2, insertText: "pd.merge(${1:df1}, ${2:df2}, on='${3:key}')", documentation: '合并DataFrame' },
    { label: 'df.dropna', kind: 2, insertText: 'df.dropna(${1:subset=[]})', documentation: '删除缺失值' },
    { label: 'df.fillna', kind: 2, insertText: "df.fillna(${1:value})", documentation: '填充缺失值' },
    { label: 'df.value_counts', kind: 2, insertText: "df['${1:column}'].value_counts()", documentation: '值计数' },
    { label: 'df.pivot_table', kind: 2, insertText: "pd.pivot_table(df, values='${1:values}', index='${2:index}', columns='${3:columns}', aggfunc='${4:mean}')", documentation: '透视表' },
    { label: 'df.apply', kind: 2, insertText: "df['${1:column}'].apply(${2:func})", documentation: '应用函数' },
    { label: 'df.sort_values', kind: 2, insertText: "df.sort_values('${1:column}', ascending=${2:False})", documentation: '排序' },
    { label: 'import numpy as np', kind: 4, insertText: 'import numpy as np', documentation: '导入NumPy库' },
    { label: 'np.array', kind: 3, insertText: 'np.array(${1:data})', documentation: '创建数组' },
    { label: 'np.mean', kind: 3, insertText: 'np.mean(${1:data})', documentation: '计算均值' },
    { label: 'import matplotlib.pyplot as plt', kind: 4, insertText: "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt", documentation: '导入Matplotlib' },
    { label: 'plt.plot', kind: 3, insertText: "plt.plot(${1:x}, ${2:y})", documentation: '折线图' },
    { label: 'plt.bar', kind: 3, insertText: "plt.bar(${1:x}, ${2:height})", documentation: '柱状图' },
    { label: 'plt.scatter', kind: 3, insertText: "plt.scatter(${1:x}, ${2:y})", documentation: '散点图' },
    { label: 'plt.hist', kind: 3, insertText: "plt.hist(${1:data}, bins=${2:10})", documentation: '直方图' },
    { label: 'plt.figure', kind: 3, insertText: "plt.figure(figsize=(${1:10}, ${2:6}))", documentation: '创建画布' },
  ], []);

  const handleEditorMount = useCallback((_editor: any, monaco: any) => {
    editorRef.current = _editor;
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

  const ensurePyodide = useCallback(async () => {
    if (isPyodideLoaded()) { setPyodideState('ready'); return true; }
    try { setPyodideState('loading'); await loadPyodide(); setPyodideState('ready'); return true; }
    catch { setPyodideState('idle'); return false; }
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setError(null);
    setImages([]);
    setRunCount((c) => c + 1);
    try {
      const ok = await ensurePyodide();
      if (!ok) { setError('Python 环境加载失败，请刷新页面重试'); return; }
      if (datasetCode) { try { await runPython(datasetCode); } catch {} }
      const result = await runPython(internalCode);
      setOutput(result.output);
      setError(result.error);
      setImages(result.images);
    } catch (err: any) { setError(err.message || '运行出错'); }
    finally { setIsRunning(false); }
  }, [isRunning, internalCode, datasetCode, ensurePyodide]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  const handleCodeChange = useCallback((value: string) => {
    setInternalCode(value);
    onCodeChange?.(value);
  }, [onCodeChange]);

  const handleClear = () => { setOutput(''); setError(null); setImages([]); };
  const hasOutput = output || error || images.length > 0;

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-white shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-amber-400" />
          <span className="text-sm font-medium">Python 控制台</span>
          {pyodideState === 'loading' && (
            <span className="text-xs text-amber-300 flex items-center gap-1">
              <Loader2 size={11} className="animate-spin" />
              {loadingStatus || '加载中...'}
            </span>
          )}
          {pyodideState === 'ready' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              就绪
            </span>
          )}
          {pyodideState === 'idle' && (
            <span className="text-xs text-gray-400">点击运行加载环境</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasOutput && (
            <button onClick={handleClear} className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="清空输出">
              <X size={12} />清空
            </button>
          )}
          <button
            onClick={handleRun}
            disabled={isRunning || pyodideState === 'loading'}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm"
          >
            {isRunning ? <><Loader2 size={14} className="animate-spin" />运行中...</> : <><Play size={14} />运行</>}
          </button>
        </div>
      </div>

      {/* 编辑器 — 移动端用 textarea，桌面端用 Monaco */}
      {isMobile ? (
        <MobileCodeInput code={internalCode} onChange={handleCodeChange} height={height} />
      ) : (
        <React.Suspense fallback={<EditorFallback />}>
          <MonacoEditor
            height={height}
            language="python"
            theme="vs-dark"
            value={internalCode}
            onChange={(value) => handleCodeChange(value || '')}
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
              suggest: { showKeywords: true, showSnippets: true, showFunctions: true, showVariables: true, showClasses: true, showModules: true },
              parameterHints: { enabled: true },
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              guides: { bracketPairs: true, indentation: true },
              hover: { enabled: true },
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              folding: true,
              foldingStrategy: 'indentation',
            }}
          />
        </React.Suspense>
      )}

      {/* 输出区域 */}
      <div className="border-t border-gray-300">
        <div className="px-3 py-1.5 bg-gray-100 text-xs font-semibold text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>输出结果</span>
            {runCount > 0 && <span className="text-gray-400 font-normal">第 {runCount} 次运行</span>}
          </div>
          {isRunning && <span className="text-amber-600 flex items-center gap-1"><Loader2 size={10} className="animate-spin" />执行中...</span>}
        </div>
        <div className="p-3 bg-gray-50 min-h-[60px] max-h-[250px] overflow-y-auto">
          {!hasOutput && !isRunning && (
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Play size={14} /><span>点击「运行」或按 Ctrl+Enter 执行代码</span>
            </div>
          )}
          {isRunning && !hasOutput && (
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /><span>正在执行代码...</span>
            </div>
          )}
          {output && <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>}
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
    </div>
  );
}
