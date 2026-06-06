import { useEffect, useState } from 'react';
import { loadPyodide, isPyodideLoaded } from '../utils/pyodide';
import { Loader2, RefreshCw } from 'lucide-react';

export default function PyodideLoader() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(isPyodideLoaded());
  const [error, setError] = useState(false);

  const startLoading = () => {
    setError(false);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12;
      });
    }, 400);

    loadPyodide().then(() => {
      setProgress(100);
      setLoaded(true);
      clearInterval(timer);
    }).catch(() => {
      clearInterval(timer);
      setError(true);
    });
  };

  useEffect(() => {
    if (loaded) return;
    startLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  if (loaded) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-indigo-50 rounded-lg">
      {error ? (
        <>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-sm text-red-600 font-medium mb-1">加载失败</p>
          <p className="text-xs text-gray-500 mb-4">Python 运行环境加载失败，请重试</p>
          <button
            onClick={startLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            重新加载
          </button>
        </>
      ) : (
        <>
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm text-indigo-700 font-medium mb-2">正在加载 Python 运行环境...</p>
          <div className="w-48 h-2 bg-indigo-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
              }}
            />
          </div>
          <p className="text-xs text-indigo-500 mt-1">首次加载可能需要几秒钟</p>
        </>
      )}
    </div>
  );
}
