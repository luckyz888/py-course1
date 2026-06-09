let pyodide: any = null;
let stdoutInitialized = false;
let packagesLoaded = false;
let loadingPromise: Promise<any> | null = null;

type StatusCallback = (status: string) => void;
const statusCallbacks = new Set<StatusCallback>();

export function onStatusChange(cb: StatusCallback) {
  statusCallbacks.add(cb);
  return () => { statusCallbacks.delete(cb); };
}

function setStatus(status: string) {
  statusCallbacks.forEach((cb) => cb(status));
}

export async function loadPyodide() {
  if (pyodide && packagesLoaded) return pyodide;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      setStatus('正在下载 Python 运行环境...');

      if (!(globalThis as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Python 环境下载失败，请检查网络'));
          document.head.appendChild(script);
        });
      }

      setStatus('正在初始化 Python...');
      // @ts-ignore
      pyodide = await globalThis.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
      });

      setStatus('正在加载 numpy（约10秒）...');
      await pyodide.loadPackage('numpy');

      setStatus('正在加载 pandas...');
      await pyodide.loadPackage('pandas');

      setStatus('正在加载 matplotlib...');
      await pyodide.loadPackage('matplotlib');

      await pyodide.runPythonAsync(`import matplotlib; matplotlib.use('Agg')`);

      packagesLoaded = true;
      setStatus('就绪');
      return pyodide;
    } catch (err) {
      console.error('Pyodide 加载失败:', err);
      pyodide = null;
      packagesLoaded = false;
      loadingPromise = null;
      setStatus('加载失败');
      throw err;
    }
  })();

  return loadingPromise;
}

export function preloadPyodide() {
  if (pyodide && packagesLoaded) return;
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
        if text:
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
  if (!pyodide || !packagesLoaded) {
    throw new Error('Python 环境未就绪');
  }

  const images: string[] = [];

  try {
    await ensureStdoutCapture();
    await pyodide.runPythonAsync(`_capture.outputs.clear()`);

    // 用 AST 检测最后一行是否为表达式 — 如果是，自动 print 其结果（REPL 行为）
    const wrappedCode = `
import ast, sys
_code = ${JSON.stringify(code)}
try:
    _tree = ast.parse(_code)
    if _tree.body:
        _last = _tree.body[-1]
        if isinstance(_last, ast.Expr):
            # 最后一行是表达式，执行前面的语句，再 eval 最后一行并 print
            _exec_code = ast.Module(body=_tree.body[:-1], type_ignores=[])
            _eval_code = ast.Expression(body=_last.value)
            if _tree.body[:-1]:
                exec(compile(_exec_code, '<user>', 'exec'))
            _result = eval(compile(_eval_code, '<user>', 'eval'))
            if _result is not None:
                print(repr(_result))
        else:
            exec(_code)
    else:
        exec(_code)
except SyntaxError:
    exec(_code)
`;

    // 运行包装后的代码
    await pyodide.runPythonAsync(wrappedCode);

    // 捕获 matplotlib 图片
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

    const output = await pyodide.runPythonAsync(`''.join(_capture.outputs)`);
    return { output, error: null, images };
  } catch (err: any) {
    let output = '';
    try { output = await pyodide.runPythonAsync(`''.join(_capture.outputs)`); } catch {}
    return { output, error: err.message || String(err), images };
  }
}

export function isPyodideLoaded() {
  return pyodide !== null && packagesLoaded;
}
