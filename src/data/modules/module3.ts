import type { Module } from '../../types';

export const module3: Module = {
  id: 'data-visualization',
  title: '数据可视化与商业图表',
  description: '学习使用Matplotlib和Seaborn创建专业的商业数据可视化图表，掌握图表设计原则和商务报表可视化技巧。',
  icon: '📈',
  order: 3,
  chapters: [
    {
      id: 'ch3-1',
      moduleId: 'data-visualization',
      title: 'Matplotlib基础绘图',
      order: 1,
      lessons: [
        {
          id: 'les3-1-1',
          chapterId: 'ch3-1',
          title: '折线图与柱状图',
          type: 'both',
          content: `## 折线图与柱状图

Matplotlib是Python最基础也最重要的绘图库，几乎所有高级可视化库都基于它构建。掌握Matplotlib是数据可视化的基本功，也是商业数据分析中制作报表图表的核心技能。

### Matplotlib架构

Matplotlib有三层结构：
1. **Backend层**：处理渲染输出，在Pyodide浏览器环境中使用Agg后端
2. **Artist层**：所有可见元素都是Artist（Figure、Axes、Line2D等）
3. **Scripting层**：pyplot接口，提供MATLAB风格的绘图函数

### 基本绘图流程

\`\`\`python
import matplotlib
matplotlib.use('Agg')  # Pyodide环境必须设置
import matplotlib.pyplot as plt

fig, ax = plt.subplots()  # 创建画布和坐标轴
ax.plot(x, y)             # 绑定数据
ax.set_title('标题')       # 设置标题
fig.savefig('output.png')  # 保存图表
\`\`\`

### 折线图（Line Plot）

折线图用于展示数据随时间或顺序的变化趋势，是商业报表中最常用的图表类型之一。

**适用场景：**
- 时间序列数据（如月度销售额趋势）
- 连续数据的趋势变化
- 多组数据的对比趋势

**关键参数：**
- \`color\`：线条颜色
- \`linestyle\` / \`ls\`：线型（'-'、'--'、'-.'、':'）
- \`linewidth\` / \`lw\`：线宽
- \`marker\`：数据点标记（'o'、's'、'^'、'D'）
- \`label\`：图例标签

### 柱状图（Bar Chart）

柱状图用于比较不同类别之间的数值大小，在商业报表中常用于品类对比、区域对比等场景。

**适用场景：**
- 分类数据的比较（如各品类销售额）
- 频率/计数展示
- 排名展示

**类型：**
- 垂直柱状图：\`ax.bar()\`
- 水平柱状图：\`ax.barh()\`
- 分组柱状图：多组数据并排显示
- 堆叠柱状图：\`bottom\` 参数`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales_A = [120, 135, 148, 160, 175, 190]
sales_B = [100, 110, 125, 138, 150, 165]

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(months, sales_A, color='#2196F3', marker='o', linewidth=2, label='产品A')
ax.plot(months, sales_B, color='#FF5722', marker='s', linewidth=2, label='产品B')
ax.set_title('月度销售趋势', fontsize=16, fontweight='bold')
ax.set_xlabel('月份', fontsize=12)
ax.set_ylabel('销售额（万元）', fontsize=12)
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3)
fig.tight_layout()
fig.savefig('line_chart.png', dpi=150)`,
          exercise: {
            id: 'ex3-1-1',
            lessonId: 'les3-1-1',
            description: '编写一个函数 `plot_comparison(categories, values1, values2, label1, label2, title)`，绘制分组柱状图。要求：1) 两组数据并排显示；2) 包含图例；3) 每个柱子上方显示数值；4) 设置标题和轴标签。返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def plot_comparison(categories, values1, values2, label1, label2, title):
    # 请在此处编写代码
    pass

# 测试
categories = ['Q1', 'Q2', 'Q3', 'Q4']
fig, ax = plot_comparison(categories, [100, 120, 130, 150],
                          [90, 110, 140, 160], '2023', '2024', '季度收入对比')`,
            hints: [
              '使用 ax.bar() 绘制两组柱状图，用 x - width/2 和 x + width/2 控制位置',
              '用 ax.text() 在每个柱子上方添加数值标签，ha="center", va="bottom"',
              '使用 np.arange(len(categories)) 生成x坐标位置'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def plot_comparison(categories, values1, values2, label1, label2, title):
    fig, ax = plt.subplots(figsize=(10, 5))
    x = np.arange(len(categories))
    width = 0.35
    bars1 = ax.bar(x - width/2, values1, width, label=label1, color='#42A5F5')
    bars2 = ax.bar(x + width/2, values2, width, label=label2, color='#EF5350')
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.legend()
    for bar in bars1:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height(),
                f'{bar.get_height()}', ha='center', va='bottom', fontsize=9)
    for bar in bars2:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height(),
                f'{bar.get_height()}', ha='center', va='bottom', fontsize=9)
    return fig, ax`,
            testCases: [
              { input: 'fig, ax = plot_comparison(["A","B"], [10,20], [15,25], "X", "Y", "Test"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'fig, ax = plot_comparison(["Q1","Q2","Q3"], [1,2,3], [4,5,6], "A", "B", "T"); print(len(ax.patches))', expectedOutput: '6' }
            ]
          }
        },
        {
          id: 'les3-1-2',
          chapterId: 'ch3-1',
          title: '散点图与饼图',
          type: 'both',
          content: `## 散点图与饼图

### 散点图（Scatter Plot）

散点图用于展示两个数值变量之间的关系，是探索性数据分析中最常用的图表类型之一。在商业分析中，散点图常用于分析广告投入与销售额的关系、用户活跃度与消费金额的关联等。

**适用场景：**
- 两个连续变量之间的关系
- 发现数据中的模式、趋势和异常值
- 相关性可视化

**关键参数：**
- \`s\`：点的大小（可以是标量或数组）
- \`c\`：点的颜色（可以是标量、数组或颜色列表）
- \`alpha\`：透明度（0-1）
- \`cmap\`：颜色映射（当c为数组时）
- \`marker\`：标记样式

**高级用法：**
- 气泡图：用点的大小表示第三个变量
- 颜色编码：用颜色表示分类变量
- 添加趋势线：用numpy拟合后绘制

### 饼图（Pie Chart）

饼图用于展示各部分占整体的比例关系，在商业报表中常用于市场份额、收入构成等场景。

**适用场景：**
- 展示各部分占整体的比例
- 分类数据的占比对比

**关键参数：**
- \`labels\`：各扇区的标签
- \`autopct\`：显示百分比格式（如'%1.1f%%'）
- \`startangle\`：起始角度
- \`explode\`：突出显示某个扇区
- \`colors\`：自定义颜色

### 子图（Subplots）

子图允许在一个画布中绘制多个图表，便于对比展示。

**创建方式：**
1. \`plt.subplots(nrows, ncols)\`：创建规则网格
2. \`plt.subplot(nrows, ncols, index)\`：逐个添加
3. \`GridSpec\`：创建不规则布局

**子图调整：**
- \`fig.tight_layout()\`：自动调整间距
- \`fig.suptitle()\`：添加总标题`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# 散点图：广告投入与销售额
np.random.seed(42)
ad_spend = np.random.uniform(10, 100, 50)
sales = ad_spend * 2.5 + np.random.normal(0, 20, 50)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].scatter(ad_spend, sales, c='#2196F3', alpha=0.7, s=60, edgecolors='white')
z = np.polyfit(ad_spend, sales, 1)
p = np.poly1d(z)
x_line = np.linspace(10, 100, 100)
axes[0].plot(x_line, p(x_line), '--', color='red', label='趋势线')
axes[0].set_title('广告投入与销售额', fontsize=14)
axes[0].set_xlabel('广告投入（万元）')
axes[0].set_ylabel('销售额（万元）')
axes[0].legend()

# 饼图：市场份额
brands = ['品牌A', '品牌B', '品牌C', '其他']
shares = [35, 28, 22, 15]
colors = ['#2196F3', '#FF5722', '#4CAF50', '#FFC107']
axes[1].pie(shares, labels=brands, autopct='%1.1f%%', colors=colors, startangle=90)
axes[1].set_title('市场份额分布', fontsize=14)
fig.tight_layout()
fig.savefig('scatter_pie.png', dpi=150)`,
          exercise: {
            id: 'ex3-1-2',
            lessonId: 'les3-1-2',
            description: '编写一个函数 `plot_scatter_with_trend(x, y, title, xlabel, ylabel)`，绘制散点图并添加线性趋势线。要求：1) 散点图使用蓝色半透明点；2) 趋势线使用红色虚线；3) 在图上显示R²值（决定系数）；4) 设置标题和轴标签。返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def plot_scatter_with_trend(x, y, title, xlabel, ylabel):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
x = np.random.uniform(0, 100, 50)
y = 2 * x + 10 + np.random.normal(0, 20, 50)
fig, ax = plot_scatter_with_trend(x, y, '广告与销售', '广告投入', '销售额')`,
            hints: [
              '用 np.polyfit(x, y, 1) 拟合线性趋势线，用 np.poly1d 生成函数',
              'R² = 1 - SS_res / SS_tot，其中 SS_res = sum((y - y_pred)²)，SS_tot = sum((y - y_mean)²)',
              '用 ax.text() 在图上显示R²值，transform=ax.transAxes 使用坐标轴比例坐标'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def plot_scatter_with_trend(x, y, title, xlabel, ylabel):
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.scatter(x, y, c='#2196F3', alpha=0.6, s=50, edgecolors='white')
    z = np.polyfit(x, y, 1)
    p = np.poly1d(z)
    x_line = np.linspace(x.min(), x.max(), 100)
    ax.plot(x_line, p(x_line), '--', color='red', linewidth=2, label='趋势线')
    y_pred = p(x)
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r_squared = 1 - ss_res / ss_tot
    ax.text(0.05, 0.95, f'R² = {r_squared:.4f}', transform=ax.transAxes,
            fontsize=12, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.set_xlabel(xlabel, fontsize=12)
    ax.set_ylabel(ylabel, fontsize=12)
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax`,
            testCases: [
              { input: 'np.random.seed(42); x = np.array([1,2,3,4,5]); y = np.array([2,4,6,8,10]); fig, ax = plot_scatter_with_trend(x, y, "Test", "X", "Y"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'np.random.seed(42); x = np.array([1,2,3,4,5]); y = np.array([2,4,6,8,10]); fig, ax = plot_scatter_with_trend(x, y, "T", "X", "Y"); print(len(ax.lines))', expectedOutput: '1' }
            ]
          }
        },
        {
          id: 'les3-1-3',
          chapterId: 'ch3-1',
          title: '图表美化与样式设置',
          type: 'both',
          content: `## 图表美化与样式设置

在商业报表中，图表的美观程度直接影响数据传达的效果。一个精心设计的图表能让读者快速理解数据含义，而粗糙的图表则可能造成误解。本节学习如何美化Matplotlib图表，使其达到商业报表的专业水准。

### 颜色设置

**常用颜色格式：**
- 单字符：'b'（蓝）、'r'（红）、'g'（绿）、'k'（黑）
- 十六进制：'#2196F3'
- RGB元组：(0.13, 0.59, 0.95)
- CSS颜色名：'steelblue'、'coral'

**配色方案选择：**
- 分类数据：使用对比色（如Set2、Paired）
- 顺序数据：使用渐变色（如Blues、OrRd）
- 发散数据：使用双色渐变（如RdBu、RdYlGn）

### 字体设置

中文字体是Matplotlib绘图中的常见问题。在商业报表中，正确显示中文标题和标签至关重要。

\`\`\`python
plt.rcParams['font.sans-serif'] = ['SimHei']  # 设置中文字体
plt.rcParams['axes.unicode_minus'] = False     # 解决负号显示问题
\`\`\`

### 图例设置

图例帮助读者理解图表中不同数据系列的含义：
- \`loc\`：位置（'best'、'upper left'、'lower right'等）
- \`frameon\`：是否显示边框
- \`fontsize\`：字体大小
- \`ncol\`：列数

### 标注与注释

标注是突出关键数据点的重要手段：
- \`ax.annotate()\`：带箭头的注释
- \`ax.text()\`：纯文本标注
- \`arrowprops\`：箭头样式设置

### 保存图表

\`fig.savefig()\` 参数：
- \`dpi\`：分辨率（打印300dpi，屏幕150dpi）
- \`bbox_inches='tight'\`：去除空白边距
- \`facecolor\`：背景色
- \`transparent\`：透明背景`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

months = ['1月', '2月', '3月', '4月', '5月', '6月']
revenue = [120, 135, 128, 145, 160, 175]

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(months, revenue, color='#1A73E8', linewidth=2.5, marker='o',
        markersize=8, label='月度收入', zorder=3)
ax.fill_between(months, revenue, alpha=0.1, color='#1A73E8')

max_idx = np.argmax(revenue)
ax.annotate(f'最高: {revenue[max_idx]}万', xy=(months[max_idx], revenue[max_idx]),
            xytext=(20, 20), textcoords='offset points', fontsize=11,
            fontweight='bold', color='#1A73E8',
            arrowprops=dict(arrowstyle='->', color='#1A73E8'))

ax.set_title('月度收入趋势分析', fontsize=18, fontweight='bold', pad=15)
ax.set_ylabel('收入（万元）', fontsize=12)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.3, linestyle='--')
ax.legend(loc='upper left', frameon=True, framealpha=0.9)
fig.tight_layout()
fig.savefig('styled_chart.png', dpi=150, bbox_inches='tight')`,
          exercise: {
            id: 'ex3-1-3',
            lessonId: 'les3-1-3',
            description: '编写一个函数 `create_styled_chart(x_data, y_data, title, ylabel, highlight_max=True)`，创建一个美化折线图。要求：1) 删除上和右边框；2) 添加浅色网格线；3) 折线下方添加半透明填充；4) 如果highlight_max为True，标注最大值点；5) 返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def create_styled_chart(x_data, y_data, title, ylabel, highlight_max=True):
    # 请在此处编写代码
    pass

# 测试
months = ['1月', '2月', '3月', '4月', '5月', '6月']
revenue = [120, 135, 128, 145, 160, 175]
fig, ax = create_styled_chart(months, revenue, '月度收入', '收入（万元）')`,
            hints: [
              '用 ax.spines["top"].set_visible(False) 和 ax.spines["right"].set_visible(False) 删除边框',
              '用 ax.fill_between(x_data, y_data, alpha=0.1, color=颜色) 添加半透明填充',
              '用 np.argmax(y_data) 找到最大值索引，再用 ax.annotate() 标注'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def create_styled_chart(x_data, y_data, title, ylabel, highlight_max=True):
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(x_data, y_data, color='#1A73E8', linewidth=2.5, marker='o',
            markersize=8, label=title, zorder=3)
    ax.fill_between(x_data, y_data, alpha=0.1, color='#1A73E8')
    if highlight_max:
        max_idx = np.argmax(y_data)
        ax.annotate(f'{y_data[max_idx]}', xy=(x_data[max_idx], y_data[max_idx]),
                    xytext=(0, 15), textcoords='offset points', fontsize=11,
                    fontweight='bold', color='#1A73E8', ha='center')
    ax.set_title(title, fontsize=18, fontweight='bold', pad=15)
    ax.set_ylabel(ylabel, fontsize=12)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.legend(loc='upper left', frameon=True, framealpha=0.9)
    return fig, ax`,
            testCases: [
              { input: 'fig, ax = create_styled_chart(["A","B","C"], [10,30,20], "Test", "Val"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'fig, ax = create_styled_chart(["A","B"], [5,10], "T", "V", False); print(ax.spines["top"].get_visible())', expectedOutput: 'False' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch3-2',
      moduleId: 'data-visualization',
      title: 'Seaborn高级可视化',
      order: 2,
      lessons: [
        {
          id: 'les3-2-1',
          chapterId: 'ch3-2',
          title: '分布图与关系图',
          type: 'both',
          content: `## 分布图与关系图

Seaborn是基于Matplotlib的高级可视化库，提供了更美观的默认样式和更简洁的API，特别适合统计图表的绘制。在商业数据分析中，Seaborn能帮助我们快速洞察数据分布特征和变量间关系。

### Seaborn优势

- 更美观的默认样式和配色方案
- 内置主题：darkgrid、whitegrid、dark、white、ticks
- 与Pandas DataFrame深度集成
- 简化的统计图表API
- 自动处理图例和标注

### 分布图

分布图用于展示数据的分布特征，是探索性数据分析的重要工具。

**常用分布图函数：**
- \`sns.histplot()\`：直方图（推荐，替代distplot）
- \`sns.kdeplot()\`：核密度估计图
- \`sns.ecdfplot()\`：经验累积分布函数
- \`sns.rugplot()\`：地毯图（边际分布）
- \`sns.displot()\`：Figure级分布图（支持多子图）

**histplot关键参数：**
- \`kde=True\`：叠加核密度估计曲线
- \`hue\`：按分类变量分组
- \`multiple\`：分组模式（'layer'、'dodge'、'stack'、'fill'）
- \`bins\`：分箱数量

### 关系图

关系图用于展示两个或多个变量之间的关系。

**常用关系图函数：**
- \`sns.scatterplot()\`：散点图
- \`sns.lineplot()\`：折线图（自动计算置信区间）
- \`sns.relplot()\`：Figure级关系图（支持col/row分面）

**scatterplot关键参数：**
- \`hue\`：颜色编码分类变量
- \`size\`：点大小编码数值变量
- \`style\`：标记样式编码分类变量
- \`palette\`：配色方案`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

sns.set_theme(style='whitegrid')
np.random.seed(42)
df = pd.DataFrame({
    '年龄': np.random.normal(35, 10, 200),
    '收入': np.random.normal(8000, 3000, 200),
    '消费': np.random.normal(5000, 2000, 200),
    '性别': np.random.choice(['男', '女'], 200)
})

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sns.histplot(data=df, x='收入', kde=True, ax=axes[0], color='#2196F3')
axes[0].set_title('收入分布', fontsize=14)
sns.histplot(data=df, x='收入', hue='性别', multiple='stack',
             ax=axes[1], palette='Set2')
axes[1].set_title('收入分布（按性别）', fontsize=14)
fig.tight_layout()
fig.savefig('dist_plot.png', dpi=150)`,
          exercise: {
            id: 'ex3-2-1',
            lessonId: 'les3-2-1',
            description: '编写一个函数 `plot_distribution(df, col, hue_col, title)`，绘制分组分布图。要求：1) 使用Seaborn的histplot；2) 叠加KDE曲线；3) 按hue_col分组，使用stack模式；4) 设置标题。返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def plot_distribution(df, col, hue_col, title):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
df = pd.DataFrame({
    '收入': np.random.normal(8000, 2000, 100),
    '性别': np.random.choice(['男', '女'], 100)
})
fig, ax = plot_distribution(df, '收入', '性别', '收入分布')`,
            hints: [
              '使用 sns.histplot()，设置 kde=True, hue=hue_col, multiple="stack"',
              '使用 palette="Set2" 设置配色方案'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def plot_distribution(df, col, hue_col, title):
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(data=df, x=col, hue=hue_col, kde=True,
                 multiple='stack', palette='Set2', ax=ax)
    ax.set_title(title, fontsize=14)
    return fig, ax`,
            testCases: [
              { input: 'np.random.seed(42); df = pd.DataFrame({"A": [1,2,3,4,5,6], "B": ["X","Y","X","Y","X","Y"]}); fig, ax = plot_distribution(df, "A", "B", "Test"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'np.random.seed(42); df = pd.DataFrame({"V": np.random.randn(50), "G": np.random.choice(["A","B"], 50)}); fig, ax = plot_distribution(df, "V", "G", "T"); print(type(ax).__name__)', expectedOutput: 'Axes' }
            ]
          }
        },
        {
          id: 'les3-2-2',
          chapterId: 'ch3-2',
          title: '分类图与热力图',
          type: 'both',
          content: `## 分类图与热力图

### 分类图

分类图用于展示不同类别之间的数据分布和比较，是商业报表中常用的图表类型。

**常用分类图函数：**
- \`sns.boxplot()\`：箱线图，展示数据分布的五数概括
- \`sns.violinplot()\`：小提琴图，结合箱线图和核密度估计
- \`sns.barplot()\`：条形图，展示均值和置信区间
- \`sns.countplot()\`：计数图，展示各类别的数量
- \`sns.catplot()\`：Figure级分类图（支持col/row分面）

**箱线图解读：**
- 箱体：从Q1到Q3（四分位距IQR）
- 箱体中线：中位数
- 触须：1.5倍IQR范围内的最远数据点
- 离群点：超出触须范围的数据点

**小提琴图优势：**
- 同时展示数据分布的形状和统计摘要
- 宽度代表数据密度
- 适合中等规模数据集

### 热力图（Heatmap）

热力图用颜色深浅表示数值大小，在商业分析中常用于：
- 相关性矩阵可视化
- 透视表数据展示（如月度销售交叉表）
- 混淆矩阵展示

**关键参数：**
- \`annot=True\`：在格子中显示数值
- \`fmt\`：数值格式（如'.2f'）
- \`cmap\`：颜色映射
- \`center\`：颜色中心值
- \`vmin/vmax\`：颜色范围
- \`linewidths\`：格子间距

**常用cmap配色：**
- 数值型：'Blues'、'OrRd'、'YlOrRd'
- 发散型：'RdBu_r'、'RdYlGn'、'coolwarm'
- 分类型：'Set2'、'Paired'`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

sns.set_theme(style='whitegrid')
np.random.seed(42)
df = pd.DataFrame({
    '城市': np.random.choice(['北京', '上海', '广州'], 150),
    '收入': np.random.normal(8000, 3000, 150),
    '性别': np.random.choice(['男', '女'], 150),
    '年龄': np.random.normal(35, 10, 150),
    '消费': np.random.normal(5000, 2000, 150)
})

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sns.boxplot(data=df, x='城市', y='收入', ax=axes[0], palette='Set3')
axes[0].set_title('各城市收入箱线图', fontsize=14)
sns.violinplot(data=df, x='城市', y='收入', hue='性别',
               split=True, ax=axes[1], palette='Set2')
axes[1].set_title('各城市收入小提琴图', fontsize=14)
fig.tight_layout()
fig.savefig('cat_plot.png', dpi=150)

# 相关性热力图
corr = df[['年龄', '收入', '消费']].corr()
fig, ax = plt.subplots(figsize=(7, 5))
sns.heatmap(corr, annot=True, fmt='.2f', cmap='RdBu_r',
            center=0, square=True, ax=ax, linewidths=0.5)
ax.set_title('变量相关性热力图', fontsize=14)
fig.tight_layout()
fig.savefig('heatmap.png', dpi=150)`,
          exercise: {
            id: 'ex3-2-2',
            lessonId: 'les3-2-2',
            description: '编写一个函数 `plot_correlation_heatmap(df, columns, title)`，绘制指定列的相关性热力图。要求：1) 使用Seaborn的heatmap；2) 显示相关系数数值（保留2位小数）；3) 使用RdBu_r配色；4) 设置标题。返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def plot_correlation_heatmap(df, columns, title):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
df = pd.DataFrame({
    'A': np.random.randn(100),
    'B': np.random.randn(100),
    'C': np.random.randn(100)
})
fig, ax = plot_correlation_heatmap(df, ['A', 'B', 'C'], '相关性分析')`,
            hints: [
              '用 df[columns].corr() 计算相关矩阵',
              '用 sns.heatmap() 绘制，设置 annot=True, fmt=".2f", cmap="RdBu_r", center=0'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def plot_correlation_heatmap(df, columns, title):
    corr = df[columns].corr()
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(corr, annot=True, fmt='.2f', cmap='RdBu_r',
                center=0, square=True, ax=ax, linewidths=0.5)
    ax.set_title(title, fontsize=16)
    return fig, ax`,
            testCases: [
              { input: 'np.random.seed(42); df = pd.DataFrame({"A": [1,2,3], "B": [3,2,1]}); fig, ax = plot_correlation_heatmap(df, ["A", "B"], "Test"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'np.random.seed(42); df = pd.DataFrame({"X": [1,2,3,4], "Y": [4,3,2,1], "Z": [1,1,1,1]}); fig, ax = plot_correlation_heatmap(df, ["X","Y","Z"], "T"); print(type(ax).__name__)', expectedOutput: 'Axes' }
            ]
          }
        },
        {
          id: 'les3-2-3',
          chapterId: 'ch3-2',
          title: 'FacetGrid多子图',
          type: 'both',
          content: `## FacetGrid多子图

当需要在多个维度上对比数据时，逐个绘制子图既繁琐又容易出错。Seaborn提供了强大的多子图系统——Grid对象，可以按分类变量自动创建子图网格，实现高效的多维数据探索。

### FacetGrid

FacetGrid是Seaborn最核心的多子图工具，它按照一个或多个分类变量将数据分组，每组数据绘制在独立的子图中。

**使用步骤：**
1. 创建FacetGrid对象：\`g = sns.FacetGrid(df, col='列名', row='列名')\`
2. 映射绘图函数：\`g.map(sns.histplot, '数值列')\`
3. 添加装饰：\`g.add_legend()\`、\`g.fig.suptitle()\`

**关键参数：**
- \`col\`：列方向的分组变量
- \`row\`：行方向的分组变量
- \`hue\`：颜色编码变量
- \`col_wrap\`：每行最多显示的子图数
- \`height/aspect\`：子图大小和宽高比
- \`sharex/sharey\`：是否共享坐标轴

### PairGrid与pairplot

PairGrid用于绘制变量两两之间的关系矩阵，是探索多维数据关系的利器。

- \`sns.pairplot(df)\`：快速绘制配对图
- \`sns.PairGrid(df)\`：更灵活的配对图，可自定义对角线和下/上三角的图表类型

**PairGrid自定义：**
- \`g.map_diag()\`：对角线图表
- \`g.map_lower()\`：下三角图表
- \`g.map_upper()\`：上三角图表

### jointplot

jointplot用于展示两个变量的联合分布和边际分布，是双变量分析的高效工具。

- \`sns.jointplot(x, y, data=df, kind='scatter')\`：散点+直方图
- \`kind='kde'\`：核密度估计
- \`kind='hex'\`：六边形分箱图
- \`kind='reg'\`：带回归线的散点图`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

sns.set_theme(style='whitegrid')
np.random.seed(42)
df = pd.DataFrame({
    '城市': np.random.choice(['北京', '上海', '广州'], 200),
    '性别': np.random.choice(['男', '女'], 200),
    '收入': np.random.normal(8000, 3000, 200),
    '消费': np.random.normal(5000, 2000, 200),
    '年龄': np.random.normal(35, 10, 200)
})

# FacetGrid：按城市和性别分组绘制收入分布
g = sns.FacetGrid(df, col='城市', row='性别', height=3, aspect=1.2)
g.map(sns.histplot, '收入', kde=True, color='#2196F3')
g.fig.suptitle('各城市收入分布（按性别）', fontsize=14, y=1.02)
g.add_legend()
g.fig.tight_layout()
g.fig.savefig('facet_grid.png', dpi=150)

# jointplot：收入与消费的联合分布
g2 = sns.jointplot(data=df, x='收入', y='消费', kind='reg',
                   height=6, color='#2196F3')
g2.fig.suptitle('收入与消费关系', fontsize=14, y=1.02)
g2.fig.tight_layout()
g2.fig.savefig('joint_plot.png', dpi=150)`,
          exercise: {
            id: 'ex3-2-3',
            lessonId: 'les3-2-3',
            description: '编写一个函数 `create_facet_grid(df, col_var, hue_var, num_var, title)`，使用FacetGrid按col_var分组绘制num_var的分布图。要求：1) 使用sns.FacetGrid；2) 按hue_var设置颜色；3) 映射histplot并叠加KDE；4) 添加图例和标题。返回FacetGrid对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def create_facet_grid(df, col_var, hue_var, num_var, title):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
df = pd.DataFrame({
    '城市': np.random.choice(['北京', '上海'], 100),
    '性别': np.random.choice(['男', '女'], 100),
    '收入': np.random.normal(8000, 2000, 100)
})
g = create_facet_grid(df, '城市', '性别', '收入', '收入分布')`,
            hints: [
              '使用 sns.FacetGrid(df, col=col_var, hue=hue_var) 创建网格',
              '用 g.map(sns.histplot, num_var, kde=True) 映射绘图函数',
              '用 g.add_legend() 添加图例，g.fig.suptitle() 设置标题'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def create_facet_grid(df, col_var, hue_var, num_var, title):
    g = sns.FacetGrid(df, col=col_var, hue=hue_var, height=4, aspect=1.2)
    g.map(sns.histplot, num_var, kde=True, alpha=0.6)
    g.add_legend()
    g.fig.suptitle(title, fontsize=14, y=1.02)
    return g`,
            testCases: [
              { input: 'np.random.seed(42); df = pd.DataFrame({"C": ["A","A","B","B"], "H": ["X","Y","X","Y"], "V": [1,2,3,4]}); g = create_facet_grid(df, "C", "H", "V", "T"); print(type(g).__name__)', expectedOutput: 'FacetGrid' },
              { input: 'np.random.seed(42); df = pd.DataFrame({"C": ["A","B"], "H": ["X","Y"], "V": [10,20]}); g = create_facet_grid(df, "C", "H", "V", "Test"); print(type(g).__name__)', expectedOutput: 'FacetGrid' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch3-3',
      moduleId: 'data-visualization',
      title: '商业图表设计',
      order: 3,
      lessons: [
        {
          id: 'les3-3-1',
          chapterId: 'ch3-3',
          title: '商业报表图表规范',
          type: 'theory',
          content: `## 商业报表图表规范

在商业环境中，图表不仅是数据展示的工具，更是沟通和决策的媒介。一个规范的商业图表能让受众在几秒内抓住关键信息，而一个不规范的图表则可能造成误解甚至误导。本节介绍商业报表中图表设计的核心规范和原则。

### 图表选择指南

选择正确的图表类型是有效沟通的第一步。不同类型的数据和沟通目的需要不同的图表：

**比较类：**
- 柱状图：比较不同类别的数值大小
- 分组柱状图：同时比较多个维度
- 雷达图：多维度综合对比

**趋势类：**
- 折线图：展示时间序列的变化趋势
- 面积图：强调趋势的累积效果
- 双轴图：展示不同量纲的趋势对比

**占比类：**
- 饼图/环形图：展示各部分占整体的比例（类别不超过5个）
- 堆叠柱状图：同时展示占比和绝对值
- 矩形树图：层级占比展示

**关系类：**
- 散点图：两个数值变量的关系
- 气泡图：三个变量的关系
- 相关性热力图：多变量相关性矩阵

**分布类：**
- 直方图：单个变量的分布
- 箱线图：多组数据的分布对比
- 小提琴图：分布形状对比

### 配色理论

**配色原则：**
1. **品牌一致性**：使用公司品牌色系，主色不超过3种
2. **数据驱动配色**：分类用对比色，顺序用渐变色，发散用双色渐变
3. **可访问性**：考虑色盲用户，避免仅依赖颜色区分

**色盲友好配色：**
- 避免红绿搭配（最常见的色盲类型）
- 使用IBM Design色板或ColorBrewer色盲友好方案
- 添加形状、纹理等辅助区分手段

**商业配色推荐：**
- 主色：#1A73E8（蓝色系，专业可信）
- 辅色：#34A853（绿色系，积极正面）
- 警示：#EA4335（红色系，警示负面）
- 中性：#5F6368（灰色系，辅助信息）

### 可访问性设计

1. **颜色对比度**：文本与背景的对比度至少4.5:1
2. **字体大小**：标题不小于14pt，正文不小于10pt
3. **替代标识**：除颜色外，使用形状、线型、标签等辅助标识
4. **简洁明了**：每张图表只传达一个核心信息`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# 商业图表规范示例
BRAND_COLORS = {
    'primary': '#1A73E8',
    'success': '#34A853',
    'warning': '#FBBC04',
    'danger': '#EA4335',
    'gray': '#5F6368'
}

plt.rcParams.update({
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.linestyle': '--',
})

categories = ['Q1', 'Q2', 'Q3', 'Q4']
actual = [120, 135, 145, 160]
target = [130, 130, 140, 150]

fig, ax = plt.subplots(figsize=(8, 5))
x = np.arange(len(categories))
ax.bar(x - 0.17, actual, 0.34, label='实际', color=BRAND_COLORS['primary'])
ax.bar(x + 0.17, target, 0.34, label='目标', color=BRAND_COLORS['gray'])
ax.set_title('季度业绩达成分析', fontsize=16, fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(categories)
ax.legend(loc='upper left')
fig.tight_layout()
fig.savefig('biz_chart.png', dpi=150)`,
          exercise: {
            id: 'ex3-3-1',
            lessonId: 'les3-3-1',
            description: '编写一个函数 `create_business_bar(categories, actual, target, title)`，创建符合商业规范的分组柱状图。要求：1) 删除上和右边框；2) 使用专业配色（蓝色表示实际，灰色表示目标）；3) 添加网格线；4) 包含图例和标题。返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def create_business_bar(categories, actual, target, title):
    # 请在此处编写代码
    pass

# 测试
fig, ax = create_business_bar(['Q1','Q2','Q3','Q4'], [120,135,145,160], [130,130,140,150], '季度业绩')`,
            hints: [
              '使用 ax.bar() 绘制两组柱状图，用 x - width/2 和 x + width/2 控制位置',
              '用 ax.spines["top"].set_visible(False) 删除上和右边框',
              '使用蓝色 #1A73E8 表示实际，灰色 #5F6368 表示目标'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def create_business_bar(categories, actual, target, title):
    fig, ax = plt.subplots(figsize=(8, 5))
    x = np.arange(len(categories))
    width = 0.34
    ax.bar(x - width/2, actual, width, label='实际', color='#1A73E8')
    ax.bar(x + width/2, target, width, label='目标', color='#5F6368')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.legend(loc='upper left')
    return fig, ax`,
            testCases: [
              { input: 'fig, ax = create_business_bar(["A","B"], [10,20], [15,25], "Test"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'fig, ax = create_business_bar(["X","Y"], [1,2], [3,4], "T"); print(ax.spines["top"].get_visible())', expectedOutput: 'False' }
            ]
          }
        },
        {
          id: 'les3-3-2',
          chapterId: 'ch3-3',
          title: '数据仪表盘设计',
          type: 'theory',
          content: `## 数据仪表盘设计

数据仪表盘（Dashboard）是商业数据分析中最常见的交付形式，它将多个图表和指标整合在一个页面中，让决策者能够快速了解业务全貌。本节介绍仪表盘设计的核心原则和KPI卡片设计方法。

### 仪表盘布局原则

**1. 信息层次**
- 顶部：KPI关键指标卡片（最重要的数字）
- 中部：核心趋势图和对比图
- 底部：详细数据表和辅助图表

**2. 视觉流**
- 从左到右、从上到下的阅读习惯
- 最重要的信息放在左上角
- 相关图表就近排列

**3. 空间利用**
- 使用GridSpec实现灵活布局
- 合理分配图表大小，重要图表更大
- 留白让页面呼吸

**4. 一致性**
- 统一的配色方案
- 统一的字体和字号
- 统一的图表风格

### KPI卡片设计

KPI卡片是仪表盘的核心组件，用于展示关键业务指标：

**KPI卡片要素：**
- 指标名称（如"月度收入"）
- 当前值（大号字体突出显示）
- 同比/环比变化（绿色上升/红色下降）
- 迷你趋势图（sparkline）

**设计规范：**
- 数值格式化：大数用"万"/"亿"，百分比保留1位小数
- 变化指示：↑绿色表示正面，↓红色表示负面
- 对齐方式：左对齐标签，右对齐数值

### 数据叙事（Storytelling with Data）

数据叙事是将数据转化为有说服力故事的方法：

**1. 确定核心信息**
- 每个仪表盘只传达一个核心观点
- 用标题直接陈述结论（如"Q3收入同比增长15%"）

**2. 建立叙事结构**
- 背景：当前业务状况
- 发现：数据揭示的关键洞察
- 行动：基于洞察的建议

**3. 突出重点**
- 用颜色、大小、位置突出关键数据
- 删除不必要的信息（数据墨水比原则）
- 用注释引导读者注意力

**4. 选择合适的图表**
- 趋势用折线图
- 对比用柱状图
- 占比用饼图/环形图
- 关系用散点图`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

plt.rcParams.update({
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': True,
    'grid.alpha': 0.3,
})

fig = plt.figure(figsize=(14, 8))
gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.35, wspace=0.3)

# KPI区域 - 3个指标
kpi_data = [('月度收入', '1,250万', '+12.5%'), ('用户数', '8.6万', '+8.3%'), ('转化率', '3.2%', '-0.5%')]
for i, (name, value, change) in enumerate(kpi_data):
    ax = fig.add_subplot(gs[0, i])
    ax.text(0.5, 0.65, value, transform=ax.transAxes, fontsize=22,
            fontweight='bold', ha='center', va='center')
    ax.text(0.5, 0.35, name, transform=ax.transAxes, fontsize=12,
            color='gray', ha='center', va='center')
    color = '#34A853' if change.startswith('+') else '#EA4335'
    ax.text(0.5, 0.1, change, transform=ax.transAxes, fontsize=11,
            color=color, ha='center', va='center', fontweight='bold')
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_frame_on(False)

# 趋势图
ax_trend = fig.add_subplot(gs[1, :2])
months = ['1月','2月','3月','4月','5月','6月']
ax_trend.plot(months, [120,135,128,145,160,175], color='#1A73E8', linewidth=2, marker='o')
ax_trend.set_title('月度收入趋势', fontsize=13, fontweight='bold')

# 占比图
ax_pie = fig.add_subplot(gs[1, 2])
ax_pie.pie([35,28,22,15], labels=['A','B','C','其他'], autopct='%1.0f%%',
           colors=['#1A73E8','#34A853','#FBBC04','#5F6368'])
ax_pie.set_title('品类占比', fontsize=13, fontweight='bold')

fig.suptitle('业务数据仪表盘', fontsize=18, fontweight='bold', y=0.98)
fig.savefig('dashboard.png', dpi=150, bbox_inches='tight')`,
          exercise: {
            id: 'ex3-3-2',
            lessonId: 'les3-3-2',
            description: '编写一个函数 `create_dashboard(kpi_data, trend_x, trend_y, title)`，创建一个简单的数据仪表盘。kpi_data是列表，每个元素为(名称, 数值, 变化率字符串)。要求：1) 上方展示KPI卡片（数值+名称+变化率）；2) 下方展示趋势折线图；3) 变化率正值绿色、负值红色；4) 返回fig对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

def create_dashboard(kpi_data, trend_x, trend_y, title):
    # 请在此处编写代码
    pass

# 测试
kpi_data = [('收入', '1250万', '+12.5%'), ('用户', '8.6万', '+8.3%')]
fig = create_dashboard(kpi_data, ['1月','2月','3月','4月'], [100,120,115,135], '业务仪表盘')`,
            hints: [
              '使用 gridspec.GridSpec(2, len(kpi_data)) 创建布局，上方放KPI卡片，下方放趋势图',
              'KPI卡片用 ax.text() 显示文字，变化率颜色根据是否以"+"开头判断',
              '趋势图使用 gs[1, :] 跨列显示'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

def create_dashboard(kpi_data, trend_x, trend_y, title):
    n = len(kpi_data)
    fig = plt.figure(figsize=(4*n, 8))
    gs = gridspec.GridSpec(2, n, figure=fig, hspace=0.35)
    for i, (name, value, change) in enumerate(kpi_data):
        ax = fig.add_subplot(gs[0, i])
        ax.text(0.5, 0.65, value, transform=ax.transAxes, fontsize=20,
                fontweight='bold', ha='center', va='center')
        ax.text(0.5, 0.35, name, transform=ax.transAxes, fontsize=12,
                color='gray', ha='center', va='center')
        color = '#34A853' if change.startswith('+') else '#EA4335'
        ax.text(0.5, 0.1, change, transform=ax.transAxes, fontsize=11,
                color=color, ha='center', fontweight='bold')
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_frame_on(False)
    ax_trend = fig.add_subplot(gs[1, :])
    ax_trend.plot(trend_x, trend_y, color='#1A73E8', linewidth=2, marker='o')
    ax_trend.set_title('趋势', fontsize=13, fontweight='bold')
    fig.suptitle(title, fontsize=18, fontweight='bold', y=0.98)
    return fig`,
            testCases: [
              { input: 'kpi = [("A","100","+5%")]; fig = create_dashboard(kpi, ["X","Y"], [1,2], "T"); print(type(fig).__name__)', expectedOutput: 'Figure' },
              { input: 'kpi = [("A","100","+5%"),("B","200","-3%")]; fig = create_dashboard(kpi, ["X","Y"], [1,2], "Test"); print(type(fig).__name__)', expectedOutput: 'Figure' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch3-4',
      moduleId: 'data-visualization',
      title: '综合可视化实战',
      order: 4,
      lessons: [
        {
          id: 'les3-4-1',
          chapterId: 'ch3-4',
          title: '销售数据可视化',
          type: 'both',
          content: `## 销售数据可视化

销售数据分析是商业数据分析中最常见的场景之一。本节通过一个完整的销售数据可视化案例，综合运用折线图、柱状图、饼图、热力图等多种图表类型，构建一个专业的销售数据仪表盘。

### 销售数据可视化要点

**1. 核心指标**
- 总销售额与目标达成率
- 月度/季度销售趋势
- 各品类/区域销售占比
- 同比/环比增长率

**2. 图表组合策略**
- 趋势分析：折线图展示时间序列
- 结构分析：饼图/环形图展示占比
- 对比分析：分组柱状图展示差异
- 关联分析：热力图展示相关性

**3. 仪表盘布局**
- 顶部：KPI关键指标
- 左侧：趋势图（占较大面积）
- 右侧：占比图和排名图
- 底部：详细数据表

### 多图表组合技巧

使用GridSpec可以灵活控制子图的位置和大小，实现复杂的仪表盘布局：

\`\`\`python
gs = gridspec.GridSpec(2, 3, figure=fig)
ax1 = fig.add_subplot(gs[0, :2])   # 趋势图占2列
ax2 = fig.add_subplot(gs[0, 2])    # 饼图占1列
ax3 = fig.add_subplot(gs[1, :])    # 柱状图占整行
\`\`\`

### 销售数据常见分析维度

- **时间维度**：日/周/月/季/年
- **产品维度**：品类/品牌/SKU
- **区域维度**：全国/省/市
- **渠道维度**：线上/线下/各平台

### 实战注意事项

1. 数据预处理：确保数据清洗后再可视化
2. 异常值处理：标注或排除异常值
3. 颜色一致性：同一维度在不同图表中使用相同颜色
4. 标注关键信息：在图表中直接标注关键数据点`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

plt.rcParams['axes.spines.top'] = False
plt.rcParams['axes.spines.right'] = False

fig = plt.figure(figsize=(14, 8))
gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.35, wspace=0.3)

months = ['1月','2月','3月','4月','5月','6月']
sales = [120, 135, 128, 145, 160, 175]
target = [130, 130, 140, 150, 155, 165]

# 趋势图
ax1 = fig.add_subplot(gs[0, :2])
ax1.plot(months, sales, color='#1A73E8', linewidth=2, marker='o', label='实际')
ax1.plot(months, target, color='#5F6368', linewidth=1.5, linestyle='--', label='目标')
ax1.fill_between(months, sales, target, where=[s>=t for s,t in zip(sales,target)],
                 alpha=0.15, color='#34A853')
ax1.set_title('月度销售趋势', fontsize=13, fontweight='bold')
ax1.legend()

# 品类占比
ax2 = fig.add_subplot(gs[0, 2])
ax2.pie([35,28,22,15], labels=['电子','服装','食品','其他'], autopct='%1.0f%%',
        colors=['#1A73E8','#34A853','#FBBC04','#5F6368'])
ax2.set_title('品类占比', fontsize=13, fontweight='bold')

# 区域对比
ax3 = fig.add_subplot(gs[1, :])
regions = ['华东','华南','华北','西南','华中']
ax3.bar(regions, [450,380,320,280,250], color='#1A73E8', edgecolor='white')
ax3.set_title('区域销售额对比（万元）', fontsize=13, fontweight='bold')

fig.suptitle('销售数据仪表盘', fontsize=18, fontweight='bold', y=0.98)
fig.savefig('sales_dashboard.png', dpi=150, bbox_inches='tight')`,
          exercise: {
            id: 'ex3-4-1',
            lessonId: 'les3-4-1',
            description: '编写一个函数 `create_sales_dashboard(months, sales, target, categories, cat_values, title)`，创建销售数据仪表盘。要求：1) 上方左侧绘制销售趋势折线图（实际vs目标）；2) 上方右侧绘制品类占比饼图；3) 下方绘制区域柱状图；4) 使用专业配色；5) 返回fig对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

def create_sales_dashboard(months, sales, target, categories, cat_values, title):
    # 请在此处编写代码
    pass

# 测试
months = ['1月','2月','3月','4月','5月','6月']
fig = create_sales_dashboard(
    months, [120,135,128,145,160,175], [130,130,140,150,155,165],
    ['电子','服装','食品','其他'], [35,28,22,15], '销售仪表盘')`,
            hints: [
              '使用 gridspec.GridSpec(2, 3) 创建2行3列布局，趋势图占 gs[0,:2]，饼图占 gs[0,2]',
              '用 fill_between() 在趋势图中填充实际与目标之间的区域',
              '饼图使用 autopct="%1.0f%%" 显示百分比'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

def create_sales_dashboard(months, sales, target, categories, cat_values, title):
    fig = plt.figure(figsize=(14, 8))
    gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.35, wspace=0.3)
    ax1 = fig.add_subplot(gs[0, :2])
    ax1.plot(months, sales, color='#1A73E8', linewidth=2, marker='o', label='实际')
    ax1.plot(months, target, color='#5F6368', linewidth=1.5, linestyle='--', label='目标')
    ax1.set_title('销售趋势', fontsize=13, fontweight='bold')
    ax1.legend()
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)
    ax2 = fig.add_subplot(gs[0, 2])
    ax2.pie(cat_values, labels=categories, autopct='%1.0f%%',
            colors=['#1A73E8','#34A853','#FBBC04','#5F6368'])
    ax2.set_title('品类占比', fontsize=13, fontweight='bold')
    ax3 = fig.add_subplot(gs[1, :])
    ax3.bar(categories, cat_values, color='#1A73E8', edgecolor='white')
    ax3.set_title('品类销售额对比', fontsize=13, fontweight='bold')
    ax3.spines['top'].set_visible(False)
    ax3.spines['right'].set_visible(False)
    fig.suptitle(title, fontsize=18, fontweight='bold', y=0.98)
    return fig`,
            testCases: [
              { input: 'fig = create_sales_dashboard(["1月","2月"], [100,120], [110,115], ["A","B"], [60,40], "Test"); print(type(fig).__name__)', expectedOutput: 'Figure' },
              { input: 'fig = create_sales_dashboard(["M1","M2","M3"], [10,20,30], [15,18,25], ["X","Y"], [70,30], "T"); print(len(fig.axes))', expectedOutput: '3' }
            ]
          }
        },
        {
          id: 'les3-4-2',
          chapterId: 'ch3-4',
          title: '用户行为分析可视化',
          type: 'both',
          content: `## 用户行为分析可视化

用户行为分析是互联网和电商行业数据分析师的核心工作之一。通过可视化手段，我们可以直观地展示用户从访问到转化的全过程，发现用户流失的关键环节，为产品优化和运营决策提供数据支撑。

### 用户漏斗图

漏斗图是用户行为分析中最经典的图表，展示用户在转化路径各环节的数量变化。

**漏斗图要素：**
- 各环节名称和用户数量
- 环节间的转化率
- 整体转化率

**常见漏斗场景：**
- 电商：浏览→加购→下单→支付
- 注册：访问→注册→激活→留存
- 营销：曝光→点击→注册→购买

### 用户留存图

留存分析用于衡量用户在首次使用后的回访情况，是评估产品粘性的关键指标。

**留存类型：**
- 次日留存：第2天回访比例
- 7日留存：第7天回访比例
- 30日留存：第30天回访比例

**留存图形式：**
- 留存曲线：折线图展示留存率随时间衰减
- 留存热力图：热力图展示不同 cohort 的留存率

### 用户同期群分析（Cohort Analysis）

同期群分析将用户按首次使用时间分组，追踪每组用户的行为变化，是最强大的用户分析工具之一。

**分析步骤：**
1. 按首次使用月份对用户分组
2. 计算每组用户在后续各月的留存率
3. 用热力图展示留存率矩阵

**洞察价值：**
- 评估产品改进效果：新 cohort 的留存是否提升
- 发现异常：某月留存率突然下降
- 预测用户生命周期价值

### 可视化最佳实践

1. 漏斗图使用水平柱状图，从大到小排列
2. 留存曲线使用折线图，标注关键留存节点
3. 同期群热力图使用渐变色，高留存深色、低留存浅色
4. 所有图表标注关键数据点`,
          codeExample: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# 用户漏斗图
stages = ['浏览', '加购', '下单', '支付']
values = [10000, 3500, 1200, 800]
colors = ['#1A73E8', '#34A853', '#FBBC04', '#EA4335']

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# 漏斗图（水平柱状图）
y_pos = np.arange(len(stages))
bars = axes[0].barh(y_pos, values, color=colors, height=0.6, edgecolor='white')
axes[0].set_yticks(y_pos)
axes[0].set_yticklabels(stages, fontsize=12)
axes[0].invert_yaxis()
axes[0].set_title('用户转化漏斗', fontsize=14, fontweight='bold')
for i, (bar, val) in enumerate(zip(bars, values)):
    rate = f'{val/values[0]*100:.1f}%' if i > 0 else '100%'
    axes[0].text(bar.get_width() + 100, bar.get_y() + bar.get_height()/2,
                 f'{val} ({rate})', va='center', fontsize=11)

# 留存曲线
days = [0, 1, 3, 7, 14, 30]
retention = [100, 45, 30, 22, 15, 8]
axes[1].plot(days, retention, color='#1A73E8', linewidth=2.5, marker='o', markersize=8)
axes[1].fill_between(days, retention, alpha=0.1, color='#1A73E8')
axes[1].set_title('用户留存曲线', fontsize=14, fontweight='bold')
axes[1].set_xlabel('天数')
axes[1].set_ylabel('留存率（%）')
axes[1].set_ylim(0, 110)
axes[1].spines['top'].set_visible(False)
axes[1].spines['right'].set_visible(False)
axes[1].grid(True, alpha=0.3)

fig.tight_layout()
fig.savefig('user_behavior.png', dpi=150)`,
          exercise: {
            id: 'ex3-4-2',
            lessonId: 'les3-4-2',
            description: '编写一个函数 `plot_funnel(stages, values, title)`，绘制用户转化漏斗图。要求：1) 使用水平柱状图，从上到下按数值从大到小排列；2) 每个柱子右侧显示数值和占总体的百分比；3) 使用渐变蓝色配色；4) 设置标题。返回fig和ax对象。',
            initialCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def plot_funnel(stages, values, title):
    # 请在此处编写代码
    pass

# 测试
stages = ['浏览', '加购', '下单', '支付']
values = [10000, 3500, 1200, 800]
fig, ax = plot_funnel(stages, values, '用户转化漏斗')`,
            hints: [
              '使用 ax.barh() 绘制水平柱状图，用 ax.invert_yaxis() 翻转Y轴使最大值在上方',
              '用 plt.cm.Blues 渐变色或手动设置蓝色渐变列表',
              '百分比计算：val / values[0] * 100，用 ax.text() 在柱子右侧显示'
            ],
            referenceAnswer: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def plot_funnel(stages, values, title):
    fig, ax = plt.subplots(figsize=(8, 5))
    y_pos = np.arange(len(stages))
    n = len(stages)
    colors = [plt.cm.Blues(0.4 + 0.5 * i / (n - 1)) for i in range(n)]
    bars = ax.barh(y_pos, values, color=colors, height=0.6, edgecolor='white')
    ax.set_yticks(y_pos)
    ax.set_yticklabels(stages, fontsize=12)
    ax.invert_yaxis()
    ax.set_title(title, fontsize=14, fontweight='bold')
    for i, (bar, val) in enumerate(zip(bars, values)):
        rate = f'{val/values[0]*100:.1f}%'
        ax.text(bar.get_width() + max(values)*0.02, bar.get_y() + bar.get_height()/2,
                f'{val} ({rate})', va='center', fontsize=11)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    return fig, ax`,
            testCases: [
              { input: 'fig, ax = plot_funnel(["A","B","C"], [100,50,20], "Test"); print(type(ax).__name__)', expectedOutput: 'Axes' },
              { input: 'fig, ax = plot_funnel(["X","Y"], [200,100], "Funnel"); print(len(ax.patches))', expectedOutput: '2' }
            ]
          }
        }
      ]
    }
  ]
};
