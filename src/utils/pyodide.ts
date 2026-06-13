let pyodide: any = null;
let stdoutInitialized = false;
let coreLoaded = false; // numpy + pandas 已加载
let matplotlibLoaded = false;
let sklearnLoaded = false;
let scipyLoaded = false;
let loadingPromise: Promise<any> | null = null;
let matplotlibPromise: Promise<void> | null = null;
let sklearnPromise: Promise<void> | null = null;
let scipyPromise: Promise<void> | null = null;

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

/** 加载核心 Python 环境（Pyodide + numpy + pandas） */
export async function loadPyodide() {
  if (pyodide && coreLoaded) return pyodide;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      setStatus('正在下载 Python 运行环境（约8MB）...');

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

      setStatus('正在加载数据分析包（numpy + pandas）...');
      await pyodide.loadPackage(['numpy', 'pandas']);

      coreLoaded = true;
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

/** 按需加载 matplotlib */
export async function loadMatplotlib() {
  if (matplotlibLoaded) return;
  if (matplotlibPromise) { await matplotlibPromise; return; }

  matplotlibPromise = (async () => {
    try {
      if (!pyodide || !coreLoaded) await loadPyodide();
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

/** 按需加载 scikit-learn（约15MB） */
export async function loadSklearn() {
  if (sklearnLoaded) return;
  if (sklearnPromise) { await sklearnPromise; return; }

  sklearnPromise = (async () => {
    try {
      if (!pyodide || !coreLoaded) await loadPyodide();
      setStatus('正在加载 scikit-learn 机器学习库（约15MB，首次较慢）...');
      await pyodide.loadPackage('scikit-learn');
      sklearnLoaded = true;
      setStatus('就绪');
    } catch (err) {
      console.error('scikit-learn 加载失败:', err);
      sklearnPromise = null;
      throw err;
    }
  })();

  await sklearnPromise;
}

/** 按需加载 scipy（约10MB） */
export async function loadScipy() {
  if (scipyLoaded) return;
  if (scipyPromise) { await scipyPromise; return; }

  scipyPromise = (async () => {
    try {
      if (!pyodide || !coreLoaded) await loadPyodide();
      setStatus('正在加载 scipy 科学计算库（约10MB，首次较慢）...');
      await pyodide.loadPackage('scipy');
      scipyLoaded = true;
      setStatus('就绪');
    } catch (err) {
      console.error('scipy 加载失败:', err);
      scipyPromise = null;
      throw err;
    }
  })();

  await scipyPromise;
}

/** 检测代码是否需要 matplotlib */
function needsMatplotlib(code: string): boolean {
  return /matplotlib|plt\.|pyplot|\.plot\(|\.bar\(|\.scatter\(|\.hist\(|\.pie\(|\.figure\(|\.subplot/.test(code);
}

/** 检测代码是否需要 scikit-learn */
function needsSklearn(code: string): boolean {
  return /sklearn|StandardScaler|MinMaxScaler|LabelEncoder|OneHotEncoder|KMeans|RandomForest|PCA|PolynomialFeatures|VarianceThreshold|FeatureHasher|OrdinalEncoder|silhouette_score|train_test_split|LogisticRegression|SVC|DecisionTree/.test(code);
}

/** 检测代码是否需要 scipy */
function needsScipy(code: string): boolean {
  return /scipy|chi2_contingency|ttest_ind|mannwhitneyu|stats\.|fisher_exact|norm\.|zscore/.test(code);
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

    // 按需加载 matplotlib
    if (needsMatplotlib(code) && !matplotlibLoaded) {
      await loadMatplotlib();
    }

    // 按需加载 scikit-learn
    if (needsSklearn(code) && !sklearnLoaded) {
      await loadSklearn();
    }

    // 按需加载 scipy
    if (needsScipy(code) && !scipyLoaded) {
      await loadScipy();
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
