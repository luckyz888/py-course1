import type { Module } from '../../types';

export const module4: Module = {
  id: 'statistics',
  title: '商务统计分析方法',
  description: '学习描述性统计、假设检验、相关与回归分析等统计方法，掌握商务场景下的数据分析与决策支撑能力。',
  icon: '📐',
  order: 4,
  chapters: [
    {
      id: 'ch4-1',
      moduleId: 'statistics',
      title: '描述性统计分析',
      order: 1,
      lessons: [
        {
          id: 'les4-1-1',
          chapterId: 'ch4-1',
          title: '集中趋势与离散程度',
          type: 'both',
          content: `## 集中趋势与离散程度

描述性统计是数据分析的第一步，通过数值指标概括数据的特征，帮助我们快速了解数据的分布情况。在商务场景中，描述性统计常用于销售汇总、客户画像、绩效评估等。

### 集中趋势度量

集中趋势反映数据的"中心位置"，常用的度量指标有：

**1. 均值（Mean）**
- 定义：所有数据值之和除以数据个数
- 公式：x̄ = (x₁ + x₂ + ... + xₙ) / n
- 特点：受极端值影响较大
- 商务应用：计算平均客单价、平均日销售额

**2. 中位数（Median）**
- 定义：将数据排序后位于中间位置的值
- 特点：不受极端值影响（稳健性）
- 商务应用：收入分布分析——中位数比均值更能代表"典型水平"

**3. 众数（Mode）**
- 定义：出现频率最高的值
- 特点：可以不存在或存在多个
- 商务应用：最畅销商品、最常见客户类型

### 离散程度度量

离散程度反映数据的"分散程度"，帮助判断数据的稳定性和风险：

**1. 方差（Variance）**
- 总体方差：σ² = Σ(xᵢ - μ)² / N
- 样本方差：s² = Σ(xᵢ - x̄)² / (n-1)（无偏估计）

**2. 标准差（Standard Deviation）**
- 定义：方差的算术平方根
- 特点：与原始数据同量纲，更直观
- 商务应用：衡量销售额波动、投资风险

**3. 四分位距（IQR）**
- 定义：Q3 - Q1（第75百分位数 - 第25百分位数）
- 特点：不受极端值影响
- 用途：箱线图中识别异常值

**4. 变异系数（CV）**
- 定义：标准差 / 均值 × 100%
- 用途：比较不同量纲数据的离散程度，如比较不同品类销售额的波动`,
          codeExample: `import numpy as np
import pandas as pd
from scipy import stats

# 某电商30天的日销售额数据（万元）
np.random.seed(42)
sales = np.concatenate([
    np.random.normal(50, 8, 25),   # 正常日销售额
    [120, 135, 110, 98, 105]       # 促销日异常高值
])

print("=== 集中趋势 ===")
print(f"均值: {np.mean(sales):.2f} 万元")
print(f"中位数: {np.median(sales):.2f} 万元")
mode_result = stats.mode(np.round(sales, 0), keepdims=True)
print(f"众数: {mode_result.mode[0]:.0f} 万元")

print("\\n=== 离散程度 ===")
print(f"方差: {np.var(sales, ddof=1):.2f}")
print(f"标准差: {np.std(sales, ddof=1):.2f} 万元")
print(f"变异系数: {np.std(sales, ddof=1)/np.mean(sales)*100:.2f}%")

q1 = np.percentile(sales, 25)
q3 = np.percentile(sales, 75)
iqr = q3 - q1
print(f"\\nQ1: {q1:.2f}, Q3: {q3:.2f}, IQR: {iqr:.2f}")

# IQR异常值检测
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
outliers = sales[(sales < lower) | (sales > upper)]
print(f"异常值下界: {lower:.2f}, 上界: {upper:.2f}")
print(f"检测到异常值: {sorted(outliers.round(2))}")

# Pandas描述性统计
df = pd.DataFrame({'日销售额': sales})
print(f"\\n描述性统计摘要:")
print(df.describe().round(2))`,
          exercise: {
            id: 'ex4-1-1',
            lessonId: 'les4-1-1',
            description: '编写一个函数 `sales_stats(data)`，接收一个数值数组（销售额数据），返回一个字典，包含：均值、中位数、标准差、IQR、变异系数（百分比），以及基于IQR方法检测的异常值列表。',
            initialCode: `import numpy as np
from scipy import stats

def sales_stats(data):
    # 请在此处编写代码
    pass

# 测试
data = [45, 52, 48, 55, 50, 47, 53, 120, 135, 49]
result = sales_stats(data)
for key, value in result['stats'].items():
    print(f"{key}: {value:.2f}")
print(f"异常值: {result['outliers']}")`,
            hints: [
              '使用 numpy 的 mean、median、std、percentile 函数，注意 std 中 ddof=1 为样本标准差',
              'IQR = Q3 - Q1，异常值为小于 Q1-1.5*IQR 或大于 Q3+1.5*IQR 的值',
              '变异系数 = 标准差 / 均值 × 100'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def sales_stats(data):
    arr = np.array(data, dtype=float)
    q1 = np.percentile(arr, 25)
    q3 = np.percentile(arr, 75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    outliers = arr[(arr < lower) | (arr > upper)].tolist()
    mean_val = np.mean(arr)
    std_val = np.std(arr, ddof=1)
    return {
        'stats': {
            '均值': mean_val,
            '中位数': np.median(arr),
            '标准差': std_val,
            'IQR': iqr,
            '变异系数(%)': std_val / mean_val * 100,
        },
        'outliers': outliers
    }`,
            testCases: [
              { input: "result = sales_stats([10, 20, 30, 40, 50]); print(f\"{result['stats']['均值']:.1f}\")", expectedOutput: '30.0' },
              { input: "result = sales_stats([1, 2, 3, 100]); print(len(result['outliers']))", expectedOutput: '1' },
              { input: "result = sales_stats([10, 12, 11, 13, 10]); print(result['stats']['变异系数(%)'] > 0)", expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les4-1-2',
          chapterId: 'ch4-1',
          title: '数据分布与偏度峰度',
          type: 'both',
          content: `## 数据分布与偏度峰度

了解数据的分布形态是描述性统计的重要环节。偏度和峰度是刻画分布形态的两个关键指标，在商务分析中可以帮助我们判断数据是否符合正态假设，从而选择合适的统计方法。

### 数据分布的形态

**对称分布**：左右两侧基本对称，均值≈中位数≈众数
- 典型：正态分布
- 商务案例：产品质量指标、日产量数据

**右偏分布（正偏）**：右侧尾部较长，均值 > 中位数 > 众数
- 典型：收入分布、房价分布
- 商务案例：客户消费金额——少数大客户拉高均值

**左偏分布（负偏）**：左侧尾部较长，均值 < 中位数 < 众数
- 典型：考试成绩（偏难时）
- 商务案例：产品满意度评分（多数人打高分）

### 偏度（Skewness）

- 定义：衡量分布不对称程度的指标
- 偏度 = 0：对称分布
- 偏度 > 0：右偏（正偏）
- 偏度 < 0：左偏（负偏）
- |偏度| > 1：严重偏态，需考虑数据变换

### 峰度（Kurtosis）

- 定义：衡量分布尾部厚度和峰部尖锐程度的指标
- 超额峰度（Excess Kurtosis）= 峰度 - 3（以正态分布为基准）
- 峰度 = 0：与正态分布相同（常峰）
- 峰度 > 0：尖峰分布，尾部更厚（极端值更多）
- 峰度 < 0：平坦分布，尾部更薄

### 频数分布表

频数分布表将连续数据分组统计，是了解数据分布的基本工具：
- 确定组数：Sturges公式 k = 1 + 3.322×log₁₀(n)
- 确定组距：(最大值 - 最小值) / 组数
- 统计各组频数和频率`,
          codeExample: `import numpy as np
import pandas as pd
from scipy import stats

# 模拟客户消费金额数据（典型右偏分布）
np.random.seed(42)
consumption = np.random.exponential(scale=500, size=200)

# 偏度和峰度
skewness = stats.skew(consumption)
kurtosis = stats.kurtosis(consumption)  # 超额峰度

print("=== 消费金额分布特征 ===")
print(f"均值: {np.mean(consumption):.2f}")
print(f"中位数: {np.median(consumption):.2f}")
print(f"偏度: {skewness:.4f} ({'右偏' if skewness > 0 else '左偏'})")
print(f"峰度: {kurtosis:.4f} ({'尖峰' if kurtosis > 0 else '平坦'})")

# 正态性检验
stat, p_value = stats.shapiro(consumption[:50])  # Shapiro检验样本不超过5000
print(f"\\nShapiro-Wilk检验: p={p_value:.4f}")
print(f"结论: {'非正态分布' if p_value < 0.05 else '可能为正态分布'}")

# 频数分布表
df = pd.DataFrame({'消费金额': consumption})
bins = np.linspace(0, consumption.max(), 11)
df['分组'] = pd.cut(df['消费金额'], bins=bins)
freq_table = df['分组'].value_counts().sort_index()
print(f"\\n=== 频数分布表 ===")
for interval, count in freq_table.items():
    pct = count / len(df) * 100
    bar = '█' * int(pct)
    print(f"{interval}: {count:3d} ({pct:5.1f}%) {bar}")

# 对数变换改善偏态
log_consumption = np.log1p(consumption)
log_skew = stats.skew(log_consumption)
print(f"\\n对数变换后偏度: {log_skew:.4f} (原始: {skewness:.4f})")`,
          exercise: {
            id: 'ex4-1-2',
            lessonId: 'les4-1-2',
            description: "编写一个函数 `distribution_analysis(data)`，分析数据分布特征。返回字典包含：偏度、峰度（超额峰度）、分布类型（右偏/左偏/近似对称）、是否近似正态（基于Shapiro检验，alpha=0.05）。如果数据量超过5000，取前5000个做Shapiro检验。",
            initialCode: `import numpy as np
from scipy import stats

def distribution_analysis(data):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
data1 = np.random.normal(100, 15, 100)
result = distribution_analysis(data1)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              '使用 stats.skew() 计算偏度，stats.kurtosis() 计算超额峰度',
              '偏度绝对值 < 0.5 可认为近似对称，0.5~1 为中等偏态，> 1 为严重偏态',
              '使用 stats.shapiro() 做正态性检验，样本量超5000时取前5000个'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def distribution_analysis(data):
    arr = np.array(data, dtype=float)
    skewness = stats.skew(arr)
    kurtosis = stats.kurtosis(arr)
    if abs(skewness) < 0.5:
        dist_type = '近似对称'
    elif skewness > 0:
        dist_type = '右偏'
    else:
        dist_type = '左偏'
    sample = arr[:5000] if len(arr) > 5000 else arr
    _, p_value = stats.shapiro(sample)
    is_normal = p_value >= 0.05
    return {
        '偏度': round(skewness, 4),
        '峰度': round(kurtosis, 4),
        '分布类型': dist_type,
        '是否近似正态': is_normal,
    }`,
            testCases: [
              { input: "np.random.seed(42); result = distribution_analysis(np.random.normal(0, 1, 100)); print(result['分布类型'])", expectedOutput: '近似对称' },
              { input: "result = distribution_analysis(np.random.exponential(1, 200)); print(result['分布类型'])", expectedOutput: '右偏' }
            ]
          }
        },
        {
          id: 'les4-1-3',
          chapterId: 'ch4-1',
          title: '探索性数据分析EDA',
          type: 'both',
          content: `## 探索性数据分析EDA

探索性数据分析（Exploratory Data Analysis，EDA）是数据科学项目中最关键的步骤之一。在建立模型之前，通过EDA全面了解数据的特征、发现异常、揭示规律，为后续分析奠定基础。

### EDA工作流程

**1. 数据概览**
- 查看数据维度、列名、数据类型
- 使用 \`df.info()\` 和 \`df.describe()\` 快速了解数据

**2. 数据质量评估**
- 缺失值检测与处理：\`df.isnull().sum()\`
- 重复值检测：\`df.duplicated().sum()\`
- 异常值识别：IQR方法或Z-score方法

**3. 单变量分析**
- 数值型：直方图、箱线图、描述性统计
- 分类型：频数统计、柱状图

**4. 双变量/多变量分析**
- 相关性矩阵与热力图
- 分组统计与对比

**5. 数据画像（Profiling）**
- 使用 pandas-profiling 自动生成数据报告
- 一键获取全面的EDA报告

### 商务场景中的EDA

- **销售数据分析**：发现季节性规律、识别异常订单
- **客户数据分析**：了解客户分布、发现高价值客户特征
- **产品数据分析**：评估产品质量稳定性、发现缺陷模式

### 数据质量评估要点

| 问题类型 | 检测方法 | 处理策略 |
|---------|---------|---------|
| 缺失值 | isnull().sum() | 删除/填充/插值 |
| 重复值 | duplicated().sum() | 去重 |
| 异常值 | IQR/Z-score | 核实后删除或保留 |
| 数据类型 | dtypes | 类型转换 |
| 不一致 | unique()检查 | 标准化处理 |`,
          codeExample: `import numpy as np
import pandas as pd
from scipy import stats

# 模拟电商订单数据
np.random.seed(42)
n = 500
df = pd.DataFrame({
    '订单金额': np.random.exponential(200, n),
    '购买数量': np.random.poisson(3, n),
    '客户年龄': np.random.normal(35, 10, n),
    '支付方式': np.random.choice(['微信', '支付宝', '银行卡'], n, p=[0.5, 0.35, 0.15]),
})

# 注入数据质量问题
df.loc[np.random.choice(n, 20), '订单金额'] = np.nan
df.loc[np.random.choice(n, 10), '客户年龄'] = np.nan
df.loc[np.random.choice(n, 5), '购买数量'] = 999  # 异常值

print("=== 数据概览 ===")
print(f"数据维度: {df.shape}")
print(f"\\n数据类型:\\n{df.dtypes}")
print(f"\\n描述性统计:\\n{df.describe().round(2)}")

print("\\n=== 数据质量评估 ===")
print(f"缺失值:\\n{df.isnull().sum()}")
print(f"\\n重复行数: {df.duplicated().sum()}")

# 异常值检测（订单金额）
q1 = df['订单金额'].quantile(0.25)
q3 = df['订单金额'].quantile(0.75)
iqr = q3 - q1
outlier_mask = (df['订单金额'] < q1 - 1.5*iqr) | (df['订单金额'] > q3 + 1.5*iqr)
print(f"\\n订单金额异常值数量: {outlier_mask.sum()}")

# 分组统计
print("\\n=== 按支付方式分组统计 ===")
group_stats = df.groupby('支付方式')['订单金额'].agg(['mean', 'median', 'count'])
print(group_stats.round(2))

# 相关性
numeric_df = df.select_dtypes(include=[np.number])
print(f"\\n=== 相关系数矩阵 ===")
print(numeric_df.corr().round(3))`,
          exercise: {
            id: 'ex4-1-3',
            lessonId: 'les4-1-3',
            description: '编写一个函数 `eda_report(df)`，对DataFrame进行EDA分析。返回字典包含：总行数、总列数、缺失值总数、各列缺失值字典、数值列的描述性统计字典（每列含均值和标准差）、重复行数。',
            initialCode: `import numpy as np
import pandas as pd

def eda_report(df):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
df = pd.DataFrame({
    'A': [1, 2, np.nan, 4, 5, 2],
    'B': [10, 20, 30, np.nan, 50, 20],
    'C': ['x', 'y', 'x', 'y', 'z', 'x'],
})
result = eda_report(df)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              '使用 df.shape 获取行列数，df.isnull().sum() 获取各列缺失值，df.duplicated().sum() 获取重复行数',
              '数值列用 df.select_dtypes(include=[np.number]) 筛选，然后用 .agg() 计算均值和标准差'
            ],
            referenceAnswer: `import numpy as np
import pandas as pd

def eda_report(df):
    n_rows, n_cols = df.shape
    total_missing = int(df.isnull().sum().sum())
    missing_per_col = df.isnull().sum().to_dict()
    numeric_df = df.select_dtypes(include=[np.number])
    desc_stats = {}
    for col in numeric_df.columns:
        desc_stats[col] = {
            '均值': round(float(numeric_df[col].mean()), 4),
            '标准差': round(float(numeric_df[col].std()), 4),
        }
    dup_count = int(df.duplicated().sum())
    return {
        '总行数': n_rows,
        '总列数': n_cols,
        '缺失值总数': total_missing,
        '各列缺失值': missing_per_col,
        '数值列统计': desc_stats,
        '重复行数': dup_count,
    }`,
            testCases: [
              { input: "df = pd.DataFrame({'A': [1, 2, np.nan], 'B': [4, 5, 6]}); result = eda_report(df); print(result['缺失值总数'])", expectedOutput: '1' },
              { input: "df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]}); result = eda_report(df); print(result['总行数'])", expectedOutput: '3' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch4-2',
      moduleId: 'statistics',
      title: '概率与抽样',
      order: 2,
      lessons: [
        {
          id: 'les4-2-1',
          chapterId: 'ch4-2',
          title: '概率基础与分布',
          type: 'both',
          content: `## 概率基础与分布

概率论是统计推断的理论基础。在商务数据分析中，概率帮助我们量化不确定性，做出更科学的决策。

### 概率基本概念

**1. 概率的定义**
- 古典概率：P(A) = 事件A的有利结果数 / 所有可能结果数
- 统计概率：P(A) ≈ 事件A发生的频率（大量重复试验）

**2. 基本运算法则**
- 加法法则：P(A∪B) = P(A) + P(B) - P(A∩B)
- 乘法法则：P(A∩B) = P(A) × P(B|A)
- 独立事件：P(A∩B) = P(A) × P(B)

**3. 商务应用**
- 转化率：访客购买的概率
- 流失率：客户不再复购的概率
- 违约率：贷款客户无法偿还的概率

### 正态分布（Normal Distribution）

正态分布是最重要的连续概率分布，记为N(μ, σ²)：
- 钟形曲线，关于μ对称
- 约68%的数据在μ±σ内，95%在μ±2σ内，99.7%在μ±3σ内
- 商务应用：质量控制（六西格玛）、金融风险评估

### 二项分布（Binomial Distribution）

二项分布描述n次独立试验中成功次数的分布，记为B(n, p)：
- 条件：固定次数n、每次独立、成功概率p恒定
- 商务应用：转化率分析、合格品率检验、A/B测试

### scipy.stats中的分布工具

scipy.stats为每种分布提供了统一接口：
- \`pdf/pmf\`：概率密度/质量函数
- \`cdf\`：累积分布函数
- \`ppf\`：分位函数（cdf的逆函数）
- \`rvs\`：生成随机数`,
          codeExample: `import numpy as np
from scipy import stats

# === 正态分布：质量控制 ===
# 产品重量标准：均值500g，标准差5g
mu, sigma = 500, 5
norm_dist = stats.norm(mu, sigma)

print("=== 产品重量质量控制 ===")
print(f"低于490g的概率: {norm_dist.cdf(490):.4f}")
print(f"高于510g的概率: {1 - norm_dist.cdf(510):.4f}")
print(f"合格范围[490,510]g的概率: {norm_dist.cdf(510) - norm_dist.cdf(490):.4f}")
print(f"95%产品重量范围: [{norm_dist.ppf(0.025):.1f}, {norm_dist.ppf(0.975):.1f}]g")

# === 二项分布：转化率分析 ===
# 网站日访客1000人，转化率3%
n, p = 1000, 0.03
binom_dist = stats.binom(n, p)

print(f"\\n=== 转化率分析 ===")
print(f"期望转化人数: {binom_dist.mean():.1f}")
print(f"标准差: {binom_dist.std():.2f}")
print(f"至少40人转化的概率: {1 - binom_dist.cdf(39):.4f}")
print(f"95%置信区间: [{binom_dist.ppf(0.025):.0f}, {binom_dist.ppf(0.975):.0f}]")

# === 商务决策：库存管理 ===
# 日需求服从正态分布 N(80, 15)
demand_dist = stats.norm(80, 15)
# 缺货概率 < 5% 时的库存量
safety_stock = demand_dist.ppf(0.95)
print(f"\\n=== 库存管理 ===")
print(f"保证95%不缺货的库存量: {safety_stock:.1f}件")`,
          exercise: {
            id: 'ex4-2-1',
            lessonId: 'les4-2-1',
            description: '编写一个函数 `quality_control(mu, sigma, lower, upper)`，分析产品质量的正态分布。返回字典包含：合格率（在[lower, upper]内的概率）、低于下界的概率、高于上界的概率、使合格率达到99%的容差范围（对称区间，返回上下界）。',
            initialCode: `from scipy import stats
import numpy as np

def quality_control(mu, sigma, lower, upper):
    # 请在此处编写代码
    pass

# 测试
result = quality_control(500, 5, 490, 510)
for key, value in result.items():
    print(f"{key}: {value:.4f}")`,
            hints: [
              '使用 stats.norm(mu, sigma) 创建正态分布对象，用 cdf 计算累积概率',
              '合格率 = cdf(upper) - cdf(lower)，99%对称区间用 ppf(0.005) 和 ppf(0.995)'
            ],
            referenceAnswer: `from scipy import stats
import numpy as np

def quality_control(mu, sigma, lower, upper):
    dist = stats.norm(mu, sigma)
    pass_rate = dist.cdf(upper) - dist.cdf(lower)
    below_lower = dist.cdf(lower)
    above_upper = 1 - dist.cdf(upper)
    tol_lower = dist.ppf(0.005)
    tol_upper = dist.ppf(0.995)
    return {
        '合格率': round(pass_rate, 4),
        '低于下界概率': round(below_lower, 4),
        '高于上界概率': round(above_upper, 4),
        '99%容差下界': round(tol_lower, 4),
        '99%容差上界': round(tol_upper, 4),
    }`,
            testCases: [
              { input: "result = quality_control(0, 1, -1, 1); print(f\"{result['合格率']:.2f}\")", expectedOutput: '0.68' },
              { input: "result = quality_control(100, 10, 80, 120); print(result['合格率'] > 0.9)", expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les4-2-2',
          chapterId: 'ch4-2',
          title: '抽样与中心极限定理',
          type: 'theory',
          content: `## 抽样与中心极限定理

在商务分析中，我们通常无法获取全部数据（总体），而是通过抽样来推断总体特征。理解抽样方法和中心极限定理，是进行统计推断的前提。

### 抽样方法

**1. 简单随机抽样**
- 每个个体被抽中的概率相等
- 实现：\`np.random.choice()\` 或 \`df.sample()\`
- 适用：总体同质性较高时

**2. 分层抽样**
- 将总体按特征分为若干层，每层内随机抽样
- 适用：总体存在明显子群体时
- 商务案例：按地区/客户等级分层调研

**3. 系统抽样**
- 按固定间隔抽取样本
- 实现：每隔k个取一个
- 适用：有序排列的总体

**4. 整群抽样**
- 随机抽取若干群组，对群组内全部调查
- 适用：群组间差异小、群组内差异大

### 中心极限定理（CLT）

中心极限定理是统计学最重要的定理之一：

**内容**：无论总体服从什么分布，当样本量n足够大时（通常n≥30），样本均值的抽样分布近似服从正态分布 N(μ, σ²/n)。

**关键推论**：
- 样本均值的期望 = 总体均值μ
- 样本均值的标准误 = σ/√n
- 样本量越大，样本均值越集中在总体均值附近

**商务意义**：
- 即使客户消费金额严重右偏，但多次抽样的平均消费金额近似正态
- 这使得我们可以用正态分布进行区间估计和假设检验

### 置信区间

置信区间给出了总体参数的可能范围：

**均值置信区间**：x̄ ± z × (s/√n)
- 90%置信水平：z = 1.645
- 95%置信水平：z = 1.96
- 99%置信水平：z = 2.576

**解读**：95%置信区间意味着，如果重复抽样100次，约95次区间会包含真实参数值。

**商务应用**：估计平均客单价、用户满意度、转化率等的不确定性范围。`,
          codeExample: `import numpy as np
from scipy import stats

# 演示中心极限定理
np.random.seed(42)
# 总体：指数分布（严重右偏，非正态）
population = np.random.exponential(500, size=100000)

print("=== 总体特征 ===")
print(f"总体均值: {population.mean():.2f}")
print(f"总体标准差: {population.std():.2f}")
print(f"总体偏度: {stats.skew(population):.4f} (严重右偏)")

# 不同样本量下，样本均值的分布
sample_sizes = [5, 30, 100]
for n in sample_sizes:
    # 重复抽样1000次，每次取n个样本
    sample_means = [np.random.choice(population, n).mean() for _ in range(1000)]
    print(f"\\n样本量n={n}:")
    print(f"  样本均值分布的均值: {np.mean(sample_means):.2f}")
    print(f"  样本均值分布的标准差: {np.std(sample_means):.2f}")
    print(f"  理论标准误: {population.std()/np.sqrt(n):.2f}")
    print(f"  样本均值偏度: {stats.skew(sample_means):.4f}")

# 置信区间计算
sample = np.random.choice(population, 50)
n = len(sample)
x_bar = sample.mean()
se = sample.std(ddof=1) / np.sqrt(n)
ci_95 = stats.norm.interval(0.95, loc=x_bar, scale=se)
ci_99 = stats.norm.interval(0.99, loc=x_bar, scale=se)

print(f"\\n=== 置信区间（n=50）===")
print(f"样本均值: {x_bar:.2f}")
print(f"标准误: {se:.2f}")
print(f"95%置信区间: [{ci_95[0]:.2f}, {ci_95[1]:.2f}]")
print(f"99%置信区间: [{ci_99[0]:.2f}, {ci_99[1]:.2f}]")
print(f"真实均值: {population.mean():.2f}")`,
          exercise: {
            id: 'ex4-2-2',
            lessonId: 'les4-2-2',
            description: '编写一个函数 `confidence_interval(data, confidence=0.95)`，计算总体均值的置信区间。返回字典包含：样本均值、标准误、置信水平、区间下界、区间上界。使用stats.norm.interval计算。',
            initialCode: `import numpy as np
from scipy import stats

def confidence_interval(data, confidence=0.95):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
data = np.random.normal(100, 15, 50)
result = confidence_interval(data)
for key, value in result.items():
    print(f"{key}: {value:.4f}")`,
            hints: [
              '标准误 SE = std(data, ddof=1) / sqrt(n)',
              '使用 stats.norm.interval(confidence, loc=mean, scale=se) 计算置信区间'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def confidence_interval(data, confidence=0.95):
    arr = np.array(data, dtype=float)
    n = len(arr)
    x_bar = arr.mean()
    se = arr.std(ddof=1) / np.sqrt(n)
    ci_lower, ci_upper = stats.norm.interval(confidence, loc=x_bar, scale=se)
    return {
        '样本均值': round(x_bar, 4),
        '标准误': round(se, 4),
        '置信水平': confidence,
        '区间下界': round(ci_lower, 4),
        '区间上界': round(ci_upper, 4),
    }`,
            testCases: [
              { input: "np.random.seed(42); result = confidence_interval(np.random.normal(100, 15, 50)); print(result['区间下界'] < 100 < result['区间上界'])", expectedOutput: 'True' },
              { input: "result = confidence_interval([10, 20, 30, 40, 50], 0.99); print(result['置信水平'])", expectedOutput: '0.99' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch4-3',
      moduleId: 'statistics',
      title: '假设检验',
      order: 3,
      lessons: [
        {
          id: 'les4-3-1',
          chapterId: 'ch4-3',
          title: '假设检验原理',
          type: 'both',
          content: `## 假设检验原理

假设检验是统计推断的核心方法，它让我们能够基于样本数据对总体做出科学判断，是商务决策的重要工具。

### 假设检验的基本思想

假设检验采用"反证法"的思路：
1. 先假设"没有差异/没有效果"（零假设H₀）
2. 收集数据，计算在H₀成立时观察到当前结果的概率
3. 如果概率很小（p值 < α），则拒绝H₀，认为有差异/有效果

### 核心概念

**1. 零假设与备择假设**
- H₀（零假设）：通常表示"无差异""无效果""无关"
- H₁（备择假设）：通常表示"有差异""有效果""有关"
- 检验的目标是判断是否有足够证据拒绝H₀

**2. p值**
- 定义：在H₀成立条件下，观察到当前或更极端结果的概率
- p值越小，反对H₀的证据越强
- 通常 p < 0.05 时拒绝H₀

**3. 显著性水平α**
- 事先设定的拒绝H₀的阈值，通常取0.05或0.01
- α = 0.05 意味着：当H₀为真时，有5%的概率错误拒绝

**4. 两类错误**
- 第一类错误（弃真）：H₀为真时错误拒绝，概率为α
- 第二类错误（取伪）：H₀为假时未能拒绝，概率为β
- 统计功效（Power）= 1 - β：正确拒绝错误H₀的概率

### 假设检验步骤

1. 建立假设（H₀和H₁）
2. 选择检验方法和显著性水平α
3. 计算检验统计量和p值
4. 做出决策：p < α 则拒绝H₀，否则不能拒绝H₀
5. 结合业务背景解释结果

### 商务应用注意事项

- 统计显著 ≠ 业务显著：差异可能很小但统计显著
- 样本量影响：大样本下微小差异也会显著
- 务必结合业务实际解释统计结果`,
          codeExample: `import numpy as np
from scipy import stats

# 案例：新营销方案是否提升了客单价？
np.random.seed(42)

# 旧方案客单价数据
old_plan = np.random.normal(120, 25, 40)
# 新方案客单价数据
new_plan = np.random.normal(135, 25, 40)

print("=== 假设检验：新方案是否提升客单价 ===")
print(f"旧方案均值: {old_plan.mean():.2f}")
print(f"新方案均值: {new_plan.mean():.2f}")
print(f"差异: {new_plan.mean() - old_plan.mean():.2f}")

# 步骤1：建立假设
print("\\nH₀: 新旧方案客单价无差异 (μ₁ = μ₂)")
print("H₁: 新方案客单价更高 (μ₁ > μ₂)")

# 步骤2-3：独立样本t检验
t_stat, p_value = stats.ttest_ind(new_plan, old_plan, alternative='greater')

print(f"\\nt统计量: {t_stat:.4f}")
print(f"p值: {p_value:.4f}")

# 步骤4：决策
alpha = 0.05
print(f"\\n显著性水平α = {alpha}")
if p_value < alpha:
    print(f"p值({p_value:.4f}) < α({alpha})，拒绝H₀")
    print("结论：新方案显著提升了客单价")
else:
    print(f"p值({p_value:.4f}) >= α({alpha})，不能拒绝H₀")
    print("结论：没有足够证据表明新方案提升了客单价")

# 效应量
pooled_std = np.sqrt((np.var(old_plan, ddof=1) + np.var(new_plan, ddof=1)) / 2)
cohens_d = (new_plan.mean() - old_plan.mean()) / pooled_std
print(f"\\nCohen's d = {cohens_d:.4f}")
effect = '小' if abs(cohens_d) < 0.5 else ('中' if abs(cohens_d) < 0.8 else '大')
print(f"效应量: {effect}（{'实际意义有限' if effect == '小' else '有实际意义'}）")`,
          exercise: {
            id: 'ex4-3-1',
            lessonId: 'les4-3-1',
            description: '编写一个函数 `hypothesis_test(sample, popmean, alpha=0.05)`，进行单样本t检验，判断样本均值是否显著大于已知总体均值。返回字典包含：样本均值、t统计量、p值、是否显著、结论描述。',
            initialCode: `import numpy as np
from scipy import stats

def hypothesis_test(sample, popmean, alpha=0.05):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
sample = np.random.normal(108, 15, 30)
result = hypothesis_test(sample, 100)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              '使用 stats.ttest_1samp(sample, popmean, alternative=\'greater\') 进行单侧检验',
              'p值 < alpha 时拒绝H₀，结论为"显著大于"'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def hypothesis_test(sample, popmean, alpha=0.05):
    arr = np.array(sample, dtype=float)
    sample_mean = arr.mean()
    t_stat, p_value = stats.ttest_1samp(arr, popmean, alternative='greater')
    significant = p_value < alpha
    conclusion = f"样本均值({sample_mean:.2f})显著大于{popmean}" if significant else f"无足够证据表明样本均值显著大于{popmean}"
    return {
        '样本均值': round(sample_mean, 4),
        't统计量': round(t_stat, 4),
        'p值': round(p_value, 4),
        '是否显著': significant,
        '结论': conclusion,
    }`,
            testCases: [
              { input: "np.random.seed(42); result = hypothesis_test(np.random.normal(120, 10, 50), 100); print(result['是否显著'])", expectedOutput: 'True' },
              { input: "result = hypothesis_test([100, 101, 99, 100, 101], 100); print(type(result['是否显著']).__name__)", expectedOutput: 'bool' }
            ]
          }
        },
        {
          id: 'les4-3-2',
          chapterId: 'ch4-3',
          title: '常用检验方法',
          type: 'both',
          content: `## 常用检验方法

不同的数据类型和研究问题需要选择不同的检验方法。本节介绍商务分析中最常用的t检验、卡方检验和A/B测试方法。

### t检验

t检验用于比较均值差异，适用于连续型数据：

**1. 单样本t检验**：检验样本均值是否与已知值有差异
- \`stats.ttest_1samp(sample, popmean)\`
- 商务案例：本月销售额是否高于历史平均水平

**2. 独立样本t检验**：检验两组独立样本均值是否有差异
- \`stats.ttest_ind(sample1, sample2)\`
- 商务案例：两个地区客单价是否有差异

**3. 配对样本t检验**：检验同一组对象前后变化
- \`stats.ttest_rel(before, after)\`
- 商务案例：培训前后业绩是否提升

### 卡方检验

卡方检验用于分类数据的分析：

**1. 独立性检验**：检验两个分类变量是否关联
- \`stats.chi2_contingency(observed)\`
- 商务案例：性别与购买偏好是否有关联

**2. 适合度检验**：检验观测频率是否符合期望
- \`stats.chisquare(f_obs, f_exp)\`
- 商务案例：各渠道客户占比是否符合预期

### A/B测试

A/B测试是商务中最常见的实验方法：
- 随机将用户分为对照组（A组）和实验组（B组）
- 对比两组的关键指标差异
- 用假设检验判断差异是否显著

**A/B测试流程**：
1. 确定指标和假设
2. 计算所需样本量
3. 随机分流并运行实验
4. 统计检验与决策

**注意事项**：
- 确保随机分流的公平性
- 实验周期要足够长
- 同时只测试一个变量`,
          codeExample: `import numpy as np
from scipy import stats
import pandas as pd

np.random.seed(42)

# === A/B测试：新页面是否提升转化率 ===
# 对照组(A)：旧页面，1000访客
n_A = 1000
conversions_A = np.random.binomial(1, 0.04, n_A)
# 实验组(B)：新页面，1000访客
n_B = 1000
conversions_B = np.random.binomial(1, 0.06, n_B)

print("=== A/B测试：页面转化率 ===")
print(f"A组转化率: {conversions_A.mean():.4f}")
print(f"B组转化率: {conversions_B.mean():.4f}")
print(f"提升幅度: {(conversions_B.mean() - conversions_A.mean()) / conversions_A.mean() * 100:.1f}%")

# 比例检验（两独立样本）
from statsmodels.stats.proportion import proportions_ztest
count = np.array([conversions_A.sum(), conversions_B.sum()])
nobs = np.array([n_A, n_B])
z_stat, p_value = proportions_ztest(count, nobs)
print(f"\\nZ检验: z={z_stat:.4f}, p={p_value:.4f}")
print(f"结论: {'显著差异' if p_value < 0.05 else '无显著差异'}")

# === 卡方独立性检验 ===
# 性别与产品偏好
observed = np.array([
    [80, 60, 40],  # 男性：偏好A/B/C
    [50, 70, 60],  # 女性：偏好A/B/C
])
chi2, p_value, dof, expected = stats.chi2_contingency(observed)
print(f"\\n=== 卡方独立性检验 ===")
print(f"卡方值: {chi2:.4f}, p值: {p_value:.4f}")
print(f"结论: 性别与偏好{'有关联' if p_value < 0.05 else '无关联'}")

# === 配对t检验 ===
# 员工培训前后绩效
before = np.random.normal(70, 10, 30)
after = before + np.random.normal(5, 6, 30)
t_stat, p_value = stats.ttest_rel(before, after)
print(f"\\n=== 配对t检验：培训效果 ===")
print(f"培训前: {before.mean():.2f}, 培训后: {after.mean():.2f}")
print(f"t={t_stat:.4f}, p={p_value:.4f}")
print(f"结论: 培训{'有' if p_value < 0.05 else '无'}显著效果")`,
          exercise: {
            id: 'ex4-3-2',
            lessonId: 'les4-3-2',
            description: '编写一个函数 `ab_test(conversions_a, n_a, conversions_b, n_b, alpha=0.05)`，对两组转化率数据进行A/B测试。使用独立样本比例Z检验（手动计算：p_pool = (conv_a+conv_b)/(n_a+n_b)，SE = sqrt(p_pool*(1-p_pool)*(1/n_a+1/n_b))，z = (p_b-p_a)/SE）。返回字典包含：A组转化率、B组转化率、Z统计量、p值（双侧）、是否显著。',
            initialCode: `import numpy as np
from scipy import stats

def ab_test(conversions_a, n_a, conversions_b, n_b, alpha=0.05):
    # 请在此处编写代码
    pass

# 测试
result = ab_test(40, 1000, 60, 1000)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              'p_a = conversions_a / n_a, p_b = conversions_b / n_b',
              'p_pool = (conversions_a + conversions_b) / (n_a + n_b)',
              'SE = sqrt(p_pool * (1-p_pool) * (1/n_a + 1/n_b)), z = (p_b - p_a) / SE, p值用 stats.norm.sf(abs(z))*2'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def ab_test(conversions_a, n_a, conversions_b, n_b, alpha=0.05):
    p_a = conversions_a / n_a
    p_b = conversions_b / n_b
    p_pool = (conversions_a + conversions_b) / (n_a + n_b)
    se = np.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
    z_stat = (p_b - p_a) / se
    p_value = 2 * stats.norm.sf(abs(z_stat))
    significant = p_value < alpha
    return {
        'A组转化率': round(p_a, 4),
        'B组转化率': round(p_b, 4),
        'Z统计量': round(z_stat, 4),
        'p值': round(p_value, 4),
        '是否显著': significant,
    }`,
            testCases: [
              { input: "result = ab_test(40, 1000, 60, 1000); print(result['A组转化率'])", expectedOutput: '0.04' },
              { input: "result = ab_test(50, 1000, 50, 1000); print(result['Z统计量'] == 0.0)", expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les4-3-3',
          chapterId: 'ch4-3',
          title: '方差分析',
          type: 'both',
          content: `## 方差分析

方差分析（Analysis of Variance，ANOVA）用于比较三个或更多组的均值是否存在显著差异，是商务分析中多组对比的重要工具。

### 为什么需要方差分析？

当需要比较多组均值时，如果反复做t检验：
- 3组需要做3次比较，4组需要6次
- 每次检验α=0.05，多次检验会大幅增加犯第一类错误的概率
- ANOVA通过一次检验解决多组比较问题

### 单因素方差分析（One-way ANOVA）

**基本思想**：将总变异分解为组间变异和组内变异
- 组间变异（SSB）：各组均值之间的差异
- 组内变异（SSW）：各组内部数据的差异
- F统计量 = 组间方差 / 组内方差

**假设条件**：
1. 各组数据近似正态分布
2. 各组方差齐性（相等）
3. 各组观测值独立

**检验步骤**：
1. H₀：各组均值相等；H₁：至少有一组均值不同
2. 计算F统计量和p值
3. p < α 则拒绝H₀

### 事后多重比较

ANOVA只能告诉我们"有差异"，但不能指出哪些组之间有差异。拒绝H₀后需要做事后比较：
- Tukey HSD检验：控制族错误率
- Bonferroni校正：调整显著性水平

### 商务应用场景

- 比较不同地区的销售业绩
- 评估不同营销渠道的转化效果
- 分析不同价格策略对利润的影响
- 比较不同门店的客户满意度`,
          codeExample: `import numpy as np
from scipy import stats

# 案例：三个地区的销售额对比
np.random.seed(42)

# 三个地区的月销售额数据
region_a = np.random.normal(85, 12, 30)   # 华东区
region_b = np.random.normal(78, 12, 30)   # 华南区
region_c = np.random.normal(92, 12, 30)   # 华北区

print("=== 三地区销售额描述统计 ===")
for name, data in [('华东区', region_a), ('华南区', region_b), ('华北区', region_c)]:
    print(f"{name}: 均值={data.mean():.2f}, 标准差={data.std(ddof=1):.2f}")

# 单因素方差分析
f_stat, p_value = stats.f_oneway(region_a, region_b, region_c)
print(f"\\n=== ANOVA结果 ===")
print(f"F统计量: {f_stat:.4f}")
print(f"p值: {p_value:.6f}")
print(f"结论: {'至少有一个地区均值显著不同' if p_value < 0.05 else '三个地区均值无显著差异'}")

# 方差齐性检验（Levene检验）
lev_stat, lev_p = stats.levene(region_a, region_b, region_c)
print(f"\\nLevene方差齐性检验: p={lev_p:.4f}")
print(f"方差齐性: {'满足' if lev_p > 0.05 else '不满足'}")

# 事后比较：两两t检验（Bonferroni校正）
pairs = [('华东', '华南', region_a, region_b),
         ('华东', '华北', region_a, region_c),
         ('华南', '华北', region_b, region_c)]
alpha = 0.05 / 3  # Bonferroni校正
print(f"\\n=== 事后比较（Bonferroni校正α={alpha:.4f}）===")
for name1, name2, d1, d2 in pairs:
    t_stat, p_val = stats.ttest_ind(d1, d2)
    sig = '显著' if p_val < alpha else '不显著'
    print(f"{name1} vs {name2}: t={t_stat:.3f}, p={p_val:.4f} ({sig})")`,
          exercise: {
            id: 'ex4-3-3',
            lessonId: 'les4-3-3',
            description: '编写一个函数 `oneway_anova(*groups)`，对多组数据进行单因素方差分析。返回字典包含：各组均值列表、F统计量、p值、是否显著（alpha=0.05）、组数。',
            initialCode: `import numpy as np
from scipy import stats

def oneway_anova(*groups):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
g1 = np.random.normal(80, 10, 25)
g2 = np.random.normal(85, 10, 25)
g3 = np.random.normal(90, 10, 25)
result = oneway_anova(g1, g2, g3)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              '使用 stats.f_oneway(*groups) 计算F统计量和p值',
              '各组均值用 [g.mean() for g in groups] 获取'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def oneway_anova(*groups):
    f_stat, p_value = stats.f_oneway(*groups)
    means = [round(g.mean(), 4) for g in groups]
    significant = p_value < 0.05
    return {
        '各组均值': means,
        'F统计量': round(f_stat, 4),
        'p值': round(p_value, 6),
        '是否显著': significant,
        '组数': len(groups),
    }`,
            testCases: [
              { input: "np.random.seed(42); g1 = np.random.normal(80, 10, 25); g2 = np.random.normal(80, 10, 25); result = oneway_anova(g1, g2); print(result['组数'])", expectedOutput: '2' },
              { input: "np.random.seed(42); g1 = np.random.normal(50, 5, 30); g2 = np.random.normal(80, 5, 30); result = oneway_anova(g1, g2); print(result['是否显著'])", expectedOutput: 'True' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch4-4',
      moduleId: 'statistics',
      title: '相关与回归分析',
      order: 4,
      lessons: [
        {
          id: 'les4-4-1',
          chapterId: 'ch4-4',
          title: '相关分析',
          type: 'both',
          content: `## 相关分析

相关分析是研究变量之间线性关系强度和方向的方法，是商务分析中探索变量关联的基础工具。

### 相关系数

**1. Pearson相关系数**
- 衡量两个连续变量之间的线性关系
- 范围：-1 到 1
- r > 0：正相关；r < 0：负相关；r ≈ 0：无线性相关
- |r| < 0.3：弱相关；0.3~0.7：中等相关；> 0.7：强相关
- 使用条件：数据近似正态、关系为线性、无极端异常值

**2. Spearman秩相关系数**
- 基于数据的秩次（排名）计算
- 适用于有序数据和非线性单调关系
- 对异常值更稳健
- 不要求正态分布

**3. Kendall秩相关系数**
- 基于一致对和不一致对的数量
- 适用于小样本和存在并列排名的数据

### 相关性矩阵与热力图

当变量较多时，相关性矩阵可以同时展示所有变量两两之间的相关系数：
- 对角线为1（自相关）
- 矩阵关于对角线对称
- 热力图用颜色深浅直观展示相关强度

### 重要提醒

**相关 ≠ 因果**
- 冰淇淋销量和溺水人数正相关，但不是因果关系
- 可能存在第三个变量（气温）同时影响两者
- 确定因果关系需要实验设计或更深入的分析

**商务应用**：
- 广告投入与销售额的关系
- 客户满意度与复购率的关系
- 商品价格与销量的关系`,
          codeExample: `import numpy as np
import pandas as pd
from scipy import stats

# 模拟商务数据
np.random.seed(42)
n = 100
ad_spend = np.random.uniform(10, 100, n)       # 广告投入（万元）
sales = 50 + 2.5 * ad_spend + np.random.normal(0, 15, n)  # 销售额
satisfaction = np.random.uniform(3, 5, n)        # 客户满意度
repurchase = 10 + 8 * satisfaction + np.random.normal(0, 5, n)  # 复购率

df = pd.DataFrame({
    '广告投入': ad_spend,
    '销售额': sales,
    '满意度': satisfaction,
    '复购率': repurchase
})

# Pearson相关系数
print("=== Pearson相关系数 ===")
r, p = stats.pearsonr(df['广告投入'], df['销售额'])
print(f"广告投入 vs 销售额: r={r:.4f}, p={p:.6f}")

r2, p2 = stats.pearsonr(df['满意度'], df['复购率'])
print(f"满意度 vs 复购率: r={r2:.4f}, p={p2:.6f}")

# Spearman相关系数
print("\\n=== Spearman秩相关 ===")
rs, ps = stats.spearmanr(df['广告投入'], df['销售额'])
print(f"广告投入 vs 销售额: rs={rs:.4f}, p={ps:.6f}")

# 相关性矩阵
print("\\n=== 相关性矩阵 ===")
corr_matrix = df.corr()
print(corr_matrix.round(3))

# 相关强度判断
def corr_strength(r):
    ar = abs(r)
    if ar < 0.3: return '弱相关'
    elif ar < 0.7: return '中等相关'
    else: return '强相关'

print("\\n=== 相关强度 ===")
for col1 in df.columns:
    for col2 in df.columns:
        if col1 < col2:
            r = df[col1].corr(df[col2])
            print(f"{col1} vs {col2}: r={r:.3f} ({corr_strength(r)})")`,
          exercise: {
            id: 'ex4-4-1',
            lessonId: 'les4-4-1',
            description: '编写一个函数 `correlation_analysis(df)`，对DataFrame的所有数值列进行相关分析。返回字典包含：相关性矩阵（嵌套字典）、最强正相关变量对（不含自身）、最强负相关变量对。变量对格式为 "列A vs 列B"。',
            initialCode: `import numpy as np
import pandas as pd
from scipy import stats

def correlation_analysis(df):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
df = pd.DataFrame({
    '广告': np.random.uniform(10, 100, 50),
    '销售': np.random.uniform(20, 200, 50),
    '价格': np.random.uniform(50, 150, 50),
})
df['销售'] = 50 + 2 * df['广告'] - 0.5 * df['价格'] + np.random.normal(0, 10, 50)
result = correlation_analysis(df)
print(f"最强正相关: {result['最强正相关']}")
print(f"最强负相关: {result['最强负相关']}")`,
            hints: [
              '使用 df.corr() 计算相关性矩阵，遍历上三角找最大和最小相关系数',
              '排除对角线（自身相关为1），变量对格式为 "列A vs 列B"'
            ],
            referenceAnswer: `import numpy as np
import pandas as pd
from scipy import stats

def correlation_analysis(df):
    corr = df.corr()
    corr_dict = {}
    cols = corr.columns.tolist()
    for col in cols:
        corr_dict[col] = corr[col].to_dict()
    max_r, min_r = -2, 2
    max_pair, min_pair = '', ''
    for i in range(len(cols)):
        for j in range(i+1, len(cols)):
            r = corr.iloc[i, j]
            pair = f"{cols[i]} vs {cols[j]}"
            if r > max_r:
                max_r, max_pair = r, pair
            if r < min_r:
                min_r, min_pair = r, pair
    return {
        '相关性矩阵': corr_dict,
        '最强正相关': max_pair,
        '最强负相关': min_pair,
    }`,
            testCases: [
              { input: "np.random.seed(42); df = pd.DataFrame({'A': [1,2,3,4,5], 'B': [2,4,6,8,10], 'C': [10,8,6,4,2]}); result = correlation_analysis(df); print(result['最强正相关'])", expectedOutput: 'A vs B' },
              { input: "np.random.seed(42); df = pd.DataFrame({'A': [1,2,3,4,5], 'B': [2,4,6,8,10], 'C': [10,8,6,4,2]}); result = correlation_analysis(df); print(result['最强负相关'])", expectedOutput: 'A vs C' }
            ]
          }
        },
        {
          id: 'les4-4-2',
          chapterId: 'ch4-4',
          title: '一元线性回归',
          type: 'both',
          content: `## 一元线性回归

一元线性回归是建立两个变量之间线性关系模型的方法，是回归分析中最基本的形式，也是商务预测的重要工具。

### 回归模型

一元线性回归模型：Y = β₀ + β₁X + ε

- Y：因变量（响应变量），如销售额
- X：自变量（解释变量），如广告投入
- β₀：截距，X=0时Y的期望值
- β₁：斜率，X每增加1单位，Y的平均变化量
- ε：随机误差项

### 最小二乘法

回归线的参数通过最小化残差平方和来估计：
- 残差 = 观测值 - 预测值 = Yᵢ - Ŷᵢ
- 最小化 Σ(Yᵢ - Ŷᵢ)²

### 模型评估指标

**1. R²（决定系数）**
- 范围：0 到 1
- 含义：模型解释的方差占总方差的比例
- R² = 0.85 表示模型解释了85%的变异

**2. 调整R²**
- 考虑自变量个数的影响
- 更适合比较不同模型

**3. RMSE（均方根误差）**
- 预测误差的标准差
- 与因变量同量纲，更直观

### 残差分析

残差分析用于检验回归假设：
- 残差应随机散布在0附近（线性假设）
- 残差的方差应大致恒定（等方差性）
- 残差应近似正态分布（正态性）

### 商务应用

- 根据广告预算预测销售额
- 根据店铺面积预测营业额
- 根据经验年限预测薪资水平`,
          codeExample: `import numpy as np
from scipy import stats
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# 案例：广告投入预测销售额
np.random.seed(42)
n = 80
ad_spend = np.random.uniform(5, 80, n)
sales = 30 + 2.8 * ad_spend + np.random.normal(0, 12, n)

# 使用scipy进行回归（同时获取p值等统计信息）
slope, intercept, r_value, p_value, std_err = stats.linregress(ad_spend, sales)

print("=== 一元线性回归结果 ===")
print(f"回归方程: 销售额 = {intercept:.2f} + {slope:.2f} × 广告投入")
print(f"R²: {r_value**2:.4f}")
print(f"斜率标准误: {std_err:.4f}")
print(f"斜率p值: {p_value:.6f}")

# 使用sklearn进行预测
X = ad_spend.reshape(-1, 1)
model = LinearRegression()
model.fit(X, sales)

y_pred = model.predict(X)
rmse = np.sqrt(mean_squared_error(sales, y_pred))
print(f"\\nRMSE: {rmse:.2f}")

# 预测新数据
new_ad = np.array([[20], [50], [80]])
predictions = model.predict(new_ad)
print("\\n=== 预测 ===")
for ad, pred in zip(new_ad.flatten(), predictions):
    print(f"广告投入{ad:.0f}万 → 预计销售额{pred:.1f}万")

# 残差分析
residuals = sales - y_pred
print(f"\\n=== 残差分析 ===")
print(f"残差均值: {residuals.mean():.4f} (应接近0)")
print(f"残差标准差: {residuals.std():.2f}")
dw = np.sum(np.diff(residuals)**2) / np.sum(residuals**2)
print(f"Durbin-Watson统计量: {dw:.4f} (接近2表示无自相关)")`,
          exercise: {
            id: 'ex4-4-2',
            lessonId: 'les4-4-2',
            description: '编写一个函数 `simple_linear_regression(x, y)`，进行一元线性回归分析。返回字典包含：截距、斜率、R²、p值（斜率的显著性）、残差标准差。使用scipy.stats.linregress。',
            initialCode: `import numpy as np
from scipy import stats

def simple_linear_regression(x, y):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
x = np.random.uniform(10, 100, 50)
y = 20 + 3 * x + np.random.normal(0, 15, 50)
result = simple_linear_regression(x, y)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              '使用 stats.linregress(x, y) 一次性获取斜率、截距、r值、p值、标准误',
              'R² = r_value²，残差标准差 = sqrt(sum((y - y_pred)²) / (n-2))'
            ],
            referenceAnswer: `import numpy as np
from scipy import stats

def simple_linear_regression(x, y):
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
    y_pred = intercept + slope * x
    residuals = y - y_pred
    residual_std = np.sqrt(np.sum(residuals**2) / (len(y) - 2))
    return {
        '截距': round(intercept, 4),
        '斜率': round(slope, 4),
        'R²': round(r_value**2, 4),
        'p值': round(p_value, 6),
        '残差标准差': round(residual_std, 4),
    }`,
            testCases: [
              { input: "np.random.seed(42); x = np.array([1,2,3,4,5]); y = np.array([3,5,7,9,11]); result = simple_linear_regression(x, y); print(result['斜率'])", expectedOutput: '2.0' },
              { input: "np.random.seed(42); x = np.array([1,2,3,4,5]); y = np.array([3,5,7,9,11]); result = simple_linear_regression(x, y); print(result['R²'])", expectedOutput: '1.0' }
            ]
          }
        },
        {
          id: 'les4-4-3',
          chapterId: 'ch4-4',
          title: '多元回归与预测',
          type: 'both',
          content: `## 多元回归与预测

多元线性回归是建立因变量与多个自变量之间线性关系的方法，能够更全面地解释因变量的变化，并进行更准确的预测。

### 多元线性回归模型

Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε

- Y：因变量（如销售额）
- X₁, X₂, ..., Xₖ：k个自变量（如广告投入、价格、促销力度）
- β₀：截距
- β₁, β₂, ..., βₖ：各自变量的回归系数（控制其他变量不变时该变量的效应）

### 回归系数的解释

在多元回归中，每个回归系数表示**控制其他变量不变时**，该自变量对因变量的净效应：
- β₁ = 2.5 表示：在其他条件不变时，广告投入每增加1万，销售额平均增加2.5万
- 这与一元回归不同，多元回归控制了混淆变量

### 特征选择

并非所有变量都应纳入模型，特征选择的方法有：

**1. 向前选择**：从空模型开始，逐步加入最显著的变量
**2. 向后剔除**：从全模型开始，逐步剔除最不显著的变量
**3. 逐步回归**：结合向前和向后
**4. 基于准则**：AIC、BIC、调整R²

### 多重共线性

当自变量之间高度相关时，会产生多重共线性问题：
- 回归系数不稳定
- 标准误增大
- 使用VIF（方差膨胀因子）检测：VIF > 10 表示严重共线性

### 预测与评估

- 训练集/测试集划分
- 交叉验证评估预测能力
- 注意过拟合：训练集R²很高但测试集表现差

### 商务应用

- 销售预测：基于广告、价格、季节等因素
- 客户价值预测：基于消费频次、金额、时长等
- 风险评估：基于多个财务指标预测违约概率`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

# 模拟多因素销售数据
np.random.seed(42)
n = 200
df = pd.DataFrame({
    '广告投入': np.random.uniform(10, 100, n),
    '价格': np.random.uniform(50, 200, n),
    '促销力度': np.random.uniform(0, 0.3, n),
    '竞品价格': np.random.uniform(40, 180, n),
})
# 销售额 = 100 + 2*广告 - 0.5*价格 + 80*促销 + 0.3*竞品价格 + 噪声
df['销售额'] = (100 + 2*df['广告投入'] - 0.5*df['价格']
               + 80*df['促销力度'] + 0.3*df['竞品价格']
               + np.random.normal(0, 15, n))

# 准备数据
features = ['广告投入', '价格', '促销力度', '竞品价格']
X = df[features]
y = df['销售额']

# 训练集/测试集划分
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 多元回归
model = LinearRegression()
model.fit(X_train, y_train)

print("=== 多元回归结果 ===")
print(f"截距: {model.intercept_:.2f}")
for feat, coef in zip(features, model.coef_):
    print(f"  {feat}: {coef:.4f}")

# 模型评估
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)
print(f"\\n训练集 R²: {r2_score(y_train, y_train_pred):.4f}")
print(f"测试集 R²: {r2_score(y_test, y_test_pred):.4f}")
print(f"测试集 RMSE: {np.sqrt(mean_squared_error(y_test, y_test_pred)):.2f}")

# 预测新数据
new_data = pd.DataFrame({
    '广告投入': [50, 80],
    '价格': [120, 100],
    '促销力度': [0.1, 0.2],
    '竞品价格': [100, 90],
})
predictions = model.predict(new_data)
print("\\n=== 预测 ===")
for i, pred in enumerate(predictions):
    print(f"场景{i+1}: 预计销售额 {pred:.1f} 万元")

# VIF检测多重共线性
from statsmodels.stats.outliers_influence import variance_inflation_factor
print("\\n=== VIF（方差膨胀因子）===")
for i, feat in enumerate(features):
    vif = variance_inflation_factor(X.values, i)
    print(f"  {feat}: {vif:.2f}")`,
          exercise: {
            id: 'ex4-4-3',
            lessonId: 'les4-4-3',
            description: '编写一个函数 `multiple_regression(X, y)`，对DataFrame X和Series y进行多元线性回归。返回字典包含：截距、各特征系数字典、R²、调整R²。调整R² = 1 - (1-R²)*(n-1)/(n-p-1)，其中n为样本量，p为特征数。',
            initialCode: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def multiple_regression(X, y):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
n = 100
X = pd.DataFrame({
    '广告': np.random.uniform(10, 100, n),
    '价格': np.random.uniform(50, 200, n),
})
y = 50 + 2 * X['广告'] - 0.3 * X['价格'] + np.random.normal(0, 10, n)
result = multiple_regression(X, y)
for key, value in result.items():
    print(f"{key}: {value}")`,
            hints: [
              '使用 LinearRegression().fit(X, y) 拟合模型，model.intercept_ 获取截距，model.coef_ 获取系数',
              'R² = model.score(X, y)，调整R² = 1 - (1-R²)*(n-1)/(n-p-1)'
            ],
            referenceAnswer: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def multiple_regression(X, y):
    model = LinearRegression()
    model.fit(X, y)
    r2 = model.score(X, y)
    n = len(y)
    p = X.shape[1]
    adj_r2 = 1 - (1 - r2) * (n - 1) / (n - p - 1)
    coef_dict = {}
    for feat, coef in zip(X.columns, model.coef_):
        coef_dict[feat] = round(coef, 4)
    return {
        '截距': round(model.intercept_, 4),
        '特征系数': coef_dict,
        'R²': round(r2, 4),
        '调整R²': round(adj_r2, 4),
    }`,
            testCases: [
              { input: "np.random.seed(42); X = pd.DataFrame({'A': [1,2,3,4,5], 'B': [5,4,3,2,1]}); y = pd.Series([10,12,14,16,18]); result = multiple_regression(X, y); print(result['R²'] > 0.9)", expectedOutput: 'True' },
              { input: "np.random.seed(42); X = pd.DataFrame({'A': [1,2,3,4,5], 'B': [5,4,3,2,1]}); y = pd.Series([10,12,14,16,18]); result = multiple_regression(X, y); print(result['调整R²'] <= result['R²'])", expectedOutput: 'True' }
            ]
          }
        }
      ]
    }
  ]
};
