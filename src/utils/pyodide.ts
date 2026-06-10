let pyodide: any = null;
let stdoutInitialized = false;
let coreLoaded = false; // numpy + pandas 已加载
let matplotlibLoaded = false;
let loadingPromise: Promise<any> | null = null;
let matplotlibPromise: Promise<void> | null = null;

// globalThis 兼容性 polyfill
const _global: any = typeof globalThis !== 'undefined' ? globalThis
  : typeof window !== 'undefined' ? window
  : typeof self !== 'undefined' ? self
  : {};

type StatusCallback = (status: string) => void;
const statusCallbacks = new Set<StatusCallback>();

export function onStatusChange(cb: StatusCallback) {
  statusCallbacks.add(cb);
  return () => { statusCallbacks.delete(cb); };
}

function setStatus(status: string) {
  statusCallbacks.forEach((cb) => cb(status));
}

/** 加载核心 Python 环境（Pyodide + numpy + pandas），matplotlib 按需加载 */
export async function loadPyodide() {
  if (pyodide && coreLoaded) return pyodide;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      setStatus('正在下载 Python 运行环境（约8MB）...');

      // 加载 Pyodide 脚本
      if (!(_global as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Python 环境下载失败，请检查网络'));
          document.head.appendChild(script);
        });
      }

      setStatus('正在初始化 Python 解释器...');
      pyodide = await (_global as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
      });

      // 并行加载 numpy 和 pandas（Pyodide 自动处理依赖顺序）
      setStatus('正在加载数据分析包（numpy + pandas）...');
      await pyodide.loadPackage(['numpy', 'pandas']);

      coreLoaded = true;

      // 如果在加载期间已经有人请求了 matplotlib，也一并加载
      if (matplotlibPromise) {
        await matplotlibPromise;
      }

      setStatus('就绪');
      return pyodide;
    } catch (err) {
      console.error('Pyodide 加载失败:', err);
      pyodide = null;
      coreLoaded = false;
      loadingPromise = null;
      setStatus('加载失败');
      throw err;
    }
  })();

  return loadingPromise;
}

/** 按需加载 matplotlib（约8MB，仅在代码使用绘图时加载） */
export async function loadMatplotlib() {
  if (matplotlibLoaded) return;
  if (matplotlibPromise) { await matplotlibPromise; return; }

  matplotlibPromise = (async () => {
    try {
      // 确保核心环境已加载
      if (!pyodide || !coreLoaded) {
        await loadPyodide();
      }
      setStatus('正在加载 matplotlib 绘图库（约8MB）...');
      await pyodide.loadPackage('matplotlib');
      await pyodide.runPythonAsync(`import matplotlib; matplotlib.use('Agg')`);
      matplotlibLoaded = true;
      setStatus('就绪');
    } catch (err) {
      console.error('matplotlib 加载失败:', err);
      matplotlibPromise = null;
      throw err;
    }
  })();

  await matplotlibPromise;
}

/** 检测代码是否需要 matplotlib */
function needsMatplotlib(code: string): boolean {
  return /matplotlib|plt\.|pyplot|\.plot\(|\.bar\(|\.scatter\(|\.hist\(|\.pie\(|\.figure\(|\.subplot/.test(code);
}

/** 在后台预加载 Pyodide，不阻塞页面渲染 */
export function preloadPyodide() {
  if (pyodide && coreLoaded) return;
  if (loadingPromise) return;
  loadPyodide().catch(() => {});
}

async function ensureStdoutCapture() {
  if (stdoutInitialized) return;
  if (!pyodide) return;
  await pyodide.runPythonAsync(`
import io, sys
class OutputCapture:
    def __init__(self):
        self.outputs = []
    def write(self, text):
        self.outputs.append(text)
    def flush(self):
        pass
_capture = OutputCapture()
sys.stdout = _capture
sys.stderr = _capture
`);
  stdoutInitialized = true;
}

export async function runPython(code: string): Promise<{ output: string; error: string | null; images: string[] }> {
  if (!pyodide || !coreLoaded) {
    throw new Error('Python 环境未就绪');
  }

  const images: string[] = [];

  try {
    await ensureStdoutCapture();
    await pyodide.runPythonAsync(`_capture.outputs.clear()`);

    // 如果代码需要 matplotlib，自动按需加载
    if (needsMatplotlib(code) && !matplotlibLoaded) {
      await loadMatplotlib();
    }

    // 运行用户代码
    await pyodide.runPythonAsync(code);

    // 捕获 matplotlib 图片
    if (matplotlibLoaded) {
      const hasMpl = await pyodide.runPythonAsync(`'matplotlib' in __import__('sys').modules`);
      if (hasMpl) {
        try {
          const imgData = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt, io, base64
figs = [plt.figure(i) for i in plt.get_fignums()]
img_list = []
for fig in figs:
    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    buf.seek(0)
    img_list.append(base64.b64encode(buf.read()).decode('utf-8'))
plt.close('all')
img_list[-1] if img_list else ''
`);
          if (imgData) images.push(imgData);
        } catch {}
      }
    }

    const output = await pyodide.runPythonAsync(`''.join(_capture.outputs)`);
    return { output, error: null, images };
  } catch (err: any) {
    let output = '';
    try { output = await pyodide.runPythonAsync(`''.join(_capture.outputs)`); } catch {}
    return { output, error: err.message || String(err), images };
  }
}

export function isPyodideLoaded() {
  return pyodide !== null && coreLoaded;
}

export function isMatplotlibLoaded() {
  return matplotlibLoaded;
}
