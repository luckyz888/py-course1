import type { Module } from '../../types';

export const module2: Module = {
  id: 'data-processing',
  title: 'Pandas数据处理与分析',
  description: '系统学习Pandas数据分析核心技能，掌握DataFrame操作、数据清洗、分组聚合、合并拼接等关键能力，成为数据处理高手。',
  icon: '📊',
  order: 2,
  chapters: [
    {
      id: 'ch2-1',
      moduleId: 'data-processing',
      title: 'Pandas入门与DataFrame',
      order: 1,
      lessons: [
        {
          id: 'les2-1-1',
          chapterId: 'ch2-1',
          title: 'Series与DataFrame基础',
          type: 'both',
          content: `## Series与DataFrame基础

Pandas是Python数据分析最核心的库，几乎所有商业数据分析工作都离不开它。Pandas提供了两种核心数据结构：**Series**（一维）和**DataFrame**（二维），它们让数据处理变得高效而直观。

### Series——一维标签数组

Series是一种类似于一维数组的数据结构，由**数据值**（values）和**索引标签**（index）两部分组成。你可以把它想象成Excel中的一列数据，每一行都有一个标签。

创建Series的常用方式：
- \`pd.Series([1, 2, 3])\`：从列表创建，自动生成整数索引
- \`pd.Series({'语文': 85, '数学': 92})\`：从字典创建，键作为索引
- \`pd.Series([1, 2, 3], index=['a', 'b', 'c'])\`：指定索引标签

Series常用属性：
- \`.values\`：获取数据值（NumPy数组）
- \`.index\`：获取索引对象
- \`.dtype\`：数据类型
- \`.name\`：Series名称
- \`.shape\`：形状

### DataFrame——二维表格数据

DataFrame是Pandas最重要的数据结构，类似于Excel工作表或SQL数据表。它由行索引和列索引共同定位数据，每列可以是不同的数据类型。

创建DataFrame的常用方式：
- \`pd.DataFrame(dict)\`：从字典创建，键为列名，值为列数据
- \`pd.DataFrame(list_of_lists, columns=[...])\`：从嵌套列表创建
- \`pd.read_csv()\`：从CSV文件读取（下节课详解）

DataFrame常用属性：
- \`.shape\`：返回(行数, 列数)元组
- \`.columns\`：列名列表
- \`.index\`：行索引
- \`.dtypes\`：各列数据类型
- \`.values\`：NumPy数组表示

### 数据快速查看

在实际工作中，数据集往往非常大，我们需要快速了解数据概况：
- \`.head(n)\`：查看前n行（默认5行）
- \`.tail(n)\`：查看后n行
- \`.info()\`：数据概览（行数、列数、类型、内存占用）
- \`.describe()\`：数值列的统计摘要（均值、标准差、最值、分位数）

掌握Series和DataFrame的创建与基本属性，是后续所有数据分析操作的基础。`,
          codeExample: `import pandas as pd
import numpy as np

# 创建Series
sales = pd.Series([1200, 980, 1560, 890], index=['Q1', 'Q2', 'Q3', 'Q4'], name='季度销售额')
print(f"Series:\\n{sales}")
print(f"索引: {sales.index.tolist()}, 值: {sales.values}")

# 创建DataFrame - 商品销售数据
df = pd.DataFrame({
    '商品名称': ['笔记本电脑', '智能手机', '平板电脑', '智能手表', '无线耳机'],
    '单价': [5999, 3999, 2999, 1299, 899],
    '销量': [120, 350, 200, 180, 500],
    '类别': ['电子', '电子', '电子', '穿戴', '配件']
})
print(f"\\nDataFrame:\\n{df}")
print(f"\\n形状: {df.shape}")
print(f"列名: {df.columns.tolist()}")
print(f"数据类型:\\n{df.dtypes}")
print(f"\\n统计摘要:\\n{df.describe()}")
print(f"\\n前3行:\\n{df.head(3)}")`,
          exercise: {
            id: 'ex2-1-1',
            lessonId: 'les2-1-1',
            description: '编写一个函数 `create_product_df(products)`，接收商品列表（每个元素为包含名称、价格、库存的字典），返回一个DataFrame，并添加一列"库存金额"（价格×库存）。再编写函数 `get_summary(df)`，返回包含各列均值、最大值、最小值的字典。',
            initialCode: `import pandas as pd

def create_product_df(products):
    # 请在此处编写代码
    pass

def get_summary(df):
    # 请在此处编写代码
    pass

# 测试
products = [
    {'名称': '键盘', '价格': 299, '库存': 50},
    {'名称': '鼠标', '价格': 99, '库存': 200},
    {'名称': '显示器', '价格': 1999, '库存': 30}
]
df = create_product_df(products)
print(df)
print(get_summary(df))`,
            hints: [
              '使用 pd.DataFrame(products) 可以直接从字典列表创建DataFrame',
              '添加列用 df["库存金额"] = df["价格"] * df["库存"]',
              'get_summary可以用 df.describe() 或分别用 .mean()、.max()、.min() 获取统计值'
            ],
            referenceAnswer: `import pandas as pd

def create_product_df(products):
    df = pd.DataFrame(products)
    df['库存金额'] = df['价格'] * df['库存']
    return df

def get_summary(df):
    num_cols = df.select_dtypes(include='number').columns
    return {
        '均值': df[num_cols].mean().to_dict(),
        '最大值': df[num_cols].max().to_dict(),
        '最小值': df[num_cols].min().to_dict()
    }`,
            testCases: [
              { input: "products = [{'名称': '键盘', '价格': 299, '库存': 50}, {'名称': '鼠标', '价格': 99, '库存': 200}]; df = create_product_df(products); print(df['库存金额'].tolist())", expectedOutput: '[14950, 19800]' },
              { input: "products = [{'名称': '键盘', '价格': 100, '库存': 10}]; df = create_product_df(products); print(df.shape)", expectedOutput: '(1, 4)' }
            ]
          }
        },
        {
          id: 'les2-1-2',
          chapterId: 'ch2-1',
          title: '数据读取与写入',
          type: 'both',
          content: `## 数据读取与写入

在真实的数据分析工作中，数据通常存储在CSV、Excel等文件中，我们需要先将数据读取到Pandas中，处理完成后再保存到文件。这是数据分析工作流的第一步和最后一步。

### 读取CSV文件

CSV（逗号分隔值）是最常见的数据存储格式，Pandas提供了强大的\`pd.read_csv()\`函数：

常用参数：
- \`filepath_or_buffer\`：文件路径或URL
- \`encoding\`：编码格式，中文数据常用\`'utf-8'\`或\`'gbk'\`
- \`sep\`或\`delimiter\`：分隔符，默认为逗号
- \`header\`：指定哪一行作为列名，默认为0（第一行）
- \`names\`：自定义列名列表
- \`index_col\`：指定某列作为行索引
- \`usecols\`：只读取指定列
- \`nrows\`：只读取前n行
- \`dtype\`：指定列的数据类型
- \`na_values\`：指定哪些值应视为缺失值

### 读取Excel文件

\`pd.read_excel()\`函数用于读取Excel文件：
- \`io\`：文件路径
- \`sheet_name\`：工作表名称或索引，默认为0（第一个表）
- \`header\`、\`names\`、\`usecols\`等参数与read_csv类似

### 数据写入

将DataFrame保存到文件：
- \`df.to_csv()\`：写入CSV文件
  - \`index=False\`：不写入行索引（推荐）
  - \`encoding\`：编码格式
- \`df.to_excel()\`：写入Excel文件
  - \`sheet_name\`：工作表名称
  - \`index=False\`：不写入行索引

### 编码问题处理

中文数据常遇到编码问题，常见编码：
- \`utf-8\`：通用编码，推荐使用
- \`gbk\` / \`gb2312\`：中文Windows系统常用
- 如果读取报错，尝试\`encoding='gbk'\`或\`encoding='utf-8-sig'\`

在实际项目中，养成先读取少量数据（\`nrows=5\`）确认格式和编码的习惯，可以避免很多问题。`,
          codeExample: `import pandas as pd
import io

# 模拟CSV数据（实际工作中从文件读取）
csv_data = '''商品,单价,销量,类别
笔记本电脑,5999,120,电子
智能手机,3999,350,电子
平板电脑,2999,200,电子
智能手表,1299,180,穿戴
无线耳机,899,500,配件'''

# 从CSV字符串读取（等价于pd.read_csv('文件路径')）
df = pd.read_csv(io.StringIO(csv_data), encoding='utf-8')
print("读取的CSV数据:")
print(df)
print(f"\\n数据类型:\\n{df.dtypes}")

# 只读取指定列
df_partial = pd.read_csv(io.StringIO(csv_data), usecols=['商品', '销量'])
print(f"\\n部分列:\\n{df_partial}")

# 指定列类型
df_typed = pd.read_csv(io.StringIO(csv_data), dtype={'单价': float})
print(f"\\n指定类型后:\\n{df_typed.dtypes}")

# 写入CSV到字符串（等价于df.to_csv('文件路径', index=False)）
output = df.to_csv(index=False)
print(f"\\n写入CSV结果:\\n{output}")

# 写入时指定编码
# df.to_csv('sales.csv', index=False, encoding='utf-8-sig')  # utf-8-sig兼容Excel
# df.to_excel('sales.xlsx', index=False, sheet_name='销售数据')`,
          exercise: {
            id: 'ex2-1-2',
            lessonId: 'les2-1-2',
            description: '编写一个函数 `load_and_process(csv_string)`，从CSV字符串中读取数据，完成以下处理：1) 读取时指定"编号"列为索引列；2) 只读取"名称"、"价格"、"库存"三列；3) 将"价格"列转为float类型；4) 添加"总价值"列（价格×库存）；5) 返回处理后的DataFrame。',
            initialCode: `import pandas as pd
import io

def load_and_process(csv_string):
    # 请在此处编写代码
    pass

# 测试
csv_data = '''编号,名称,价格,库存,备注
P001,键盘,299,50,热销
P002,鼠标,99,200,新品
P003,显示器,1999,30,缺货'''
print(load_and_process(csv_data))`,
            hints: [
              '使用 pd.read_csv(io.StringIO(csv_string), index_col="编号", usecols=["编号","名称","价格","库存"])',
              '注意usecols需要包含index_col指定的列，然后用 dtype={"价格": float} 指定类型'
            ],
            referenceAnswer: `import pandas as pd
import io

def load_and_process(csv_string):
    df = pd.read_csv(io.StringIO(csv_string), index_col='编号',
                     usecols=['编号', '名称', '价格', '库存'],
                     dtype={'价格': float})
    df['总价值'] = df['价格'] * df['库存']
    return df`,
            testCases: [
              { input: "csv_data = '编号,名称,价格,库存\\nP001,键盘,299,50'; print(load_and_process(csv_data)['总价值'].iloc[0])", expectedOutput: '14950.0' },
              { input: "csv_data = '编号,名称,价格,库存\\nP001,键盘,299,50\\nP002,鼠标,99,200'; df = load_and_process(csv_data); print(df.index.name)", expectedOutput: '编号' }
            ]
          }
        },
        {
          id: 'les2-1-3',
          chapterId: 'ch2-1',
          title: '数据选择与筛选',
          type: 'both',
          content: `## 数据选择与筛选

数据选择和筛选是数据分析中使用频率最高的操作。无论是查看特定列的数据、选取满足条件的行，还是同时按行列定位数据，Pandas都提供了灵活而强大的方式。

### 列选择

- \`df['列名']\`：选择单列，返回Series
- \`df[['列1', '列2']]\`：选择多列，返回DataFrame
- \`df.列名\`：属性方式访问（列名必须是有效Python标识符且不与属性冲突）

### loc——基于标签的索引

\`df.loc[行标签, 列标签]\`使用标签进行数据选择，切片时**包含右端**：
- \`df.loc['row1']\`：选择一行
- \`df.loc['row1':'row3']\`：选择多行（含row3）
- \`df.loc[:, ['列1', '列2']]\`：选择指定列的所有行
- \`df.loc['row1', '列1']\`：选择单个值

### iloc——基于位置的索引

\`df.iloc[行位置, 列位置]\`使用整数位置进行数据选择，切片时**不包含右端**：
- \`df.iloc[0]\`：选择第一行
- \`df.iloc[0:3]\`：选择前3行（不含第3行索引对应行）
- \`df.iloc[:, 0:2]\`：选择前2列
- \`df.iloc[0, 1]\`：选择第0行第1列的值

### 布尔索引

布尔索引是Pandas最强大的筛选方式，通过条件表达式生成布尔Series，用于筛选满足条件的行：
- 单条件：\`df[df['销售额'] > 1000]\`
- 多条件组合：\`df[(df['销售额'] > 1000) & (df['类别'] == '电子')]\`
  - 注意：多条件必须用\`&\`（与）、\`|\`（或），每个条件要用括号包裹
- \`isin()\`：判断值是否在列表中，\`df[df['城市'].isin(['北京', '上海'])]\`

### query方法

\`df.query(表达式)\`使用字符串表达式进行筛选，语法更简洁直观：
- \`df.query("销售额 > 1000")\`
- \`df.query("类别 == '电子' and 销售额 > 1000")\`

在实际业务中，数据筛选是最常用的操作之一，熟练掌握loc、iloc和布尔索引是高效分析数据的前提。`,
          codeExample: `import pandas as pd

# 商品销售数据
df = pd.DataFrame({
    '商品': ['笔记本电脑', '智能手机', '平板电脑', '智能手表', '无线耳机', '机械键盘'],
    '单价': [5999, 3999, 2999, 1299, 899, 599],
    '销量': [120, 350, 200, 180, 500, 280],
    '类别': ['电子', '电子', '电子', '穿戴', '配件', '配件'],
    '评分': [4.8, 4.6, 4.5, 4.3, 4.7, 4.4]
}, index=['P001', 'P002', 'P003', 'P004', 'P005', 'P006'])

print("原始数据:")
print(df)

# 列选择
print(f"\\n商品列:\\n{df['商品']}")
print(f"\\n多列选择:\\n{df[['商品', '单价', '销量']]}")

# loc 基于标签
print(f"\\nloc选择行P001-P003:\\n{df.loc['P001':'P003']}")
print(f"\\nloc选择指定行列:\\n{df.loc['P002', '商品']}")

# iloc 基于位置
print(f"\\niloc前3行:\\n{df.iloc[0:3]}")
print(f"\\niloc第0行第1列: {df.iloc[0, 1]}")

# 布尔索引
print(f"\\n单价>2000的商品:\\n{df[df['单价'] > 2000]}")
print(f"\\n电子类且销量>150:\\n{df[(df['类别'] == '电子') & (df['销量'] > 150)]}")

# isin
print(f"\\n配件或穿戴类:\\n{df[df['类别'].isin(['配件', '穿戴'])]}")

# query
print(f"\\nquery筛选:\\n{df.query('单价 > 1000 and 评分 >= 4.5')}")`,
          exercise: {
            id: 'ex2-1-3',
            lessonId: 'les2-1-3',
            description: '编写一个函数 `filter_products(df, min_price, max_price, categories)`，从商品DataFrame中筛选出单价在[min_price, max_price]范围内且类别在categories列表中的商品，返回按销量降序排列的DataFrame，只包含"商品"、"单价"、"销量"、"类别"四列。',
            initialCode: `import pandas as pd

def filter_products(df, min_price, max_price, categories):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '商品': ['笔记本电脑', '智能手机', '平板电脑', '智能手表', '无线耳机'],
    '单价': [5999, 3999, 2999, 1299, 899],
    '销量': [120, 350, 200, 180, 500],
    '类别': ['电子', '电子', '电子', '穿戴', '配件'],
    '评分': [4.8, 4.6, 4.5, 4.3, 4.7]
})
result = filter_products(df, 1000, 5000, ['电子', '穿戴'])
print(result)`,
            hints: [
              '使用布尔索引组合条件：(df["单价"] >= min_price) & (df["单价"] <= max_price) & (df["类别"].isin(categories))',
              '选择列用 df[["商品","单价","销量","类别"]]，排序用 .sort_values("销量", ascending=False)'
            ],
            referenceAnswer: `import pandas as pd

def filter_products(df, min_price, max_price, categories):
    mask = (df['单价'] >= min_price) & (df['单价'] <= max_price) & (df['类别'].isin(categories))
    result = df.loc[mask, ['商品', '单价', '销量', '类别']]
    return result.sort_values('销量', ascending=False)`,
            testCases: [
              { input: "df = pd.DataFrame({'商品': ['A', 'B', 'C'], '单价': [100, 500, 1000], '销量': [10, 50, 30], '类别': ['X', 'Y', 'X']}); print(filter_products(df, 100, 600, ['X']).to_string())", expectedOutput: '   商品   单价  销量 类别\\n0    A   100   10   X' },
              { input: "df = pd.DataFrame({'商品': ['A', 'B'], '单价': [200, 800], '销量': [10, 50], '类别': ['X', 'X']}); print(len(filter_products(df, 100, 500, ['X'])))", expectedOutput: '1' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch2-2',
      moduleId: 'data-processing',
      title: '数据清洗与预处理',
      order: 2,
      lessons: [
        {
          id: 'les2-2-1',
          chapterId: 'ch2-2',
          title: '缺失值处理',
          type: 'both',
          content: `## 缺失值处理

真实世界的数据几乎不可能完美无缺，缺失值是数据分析中最常见的问题之一。在商业数据分析中，缺失值可能导致分析结果偏差、模型训练失败等严重后果，因此正确处理缺失值是数据清洗的首要任务。

### 缺失值的来源与类型

缺失值可能来源于：
- **数据采集缺失**：用户未填写、传感器故障
- **数据传输丢失**：网络问题导致部分数据丢失
- **数据合并产生**：两个表合并时，某些键无法匹配
- **业务逻辑缺失**：某些字段在特定条件下不适用

Pandas中缺失值用\`NaN\`（Not a Number）表示，可以使用\`np.nan\`、\`None\`或\`pd.NA\`创建。

### 检测缺失值

- \`df.isna()\`或\`df.isnull()\`：返回布尔DataFrame，True表示缺失
- \`df.notna()\`或\`df.notnull()\`：返回非缺失值的布尔DataFrame
- \`df.isna().sum()\`：统计每列缺失值数量
- \`df.isna().any()\`：判断每列是否有缺失值
- \`df.isna().mean()\`：计算每列缺失值比例

### 删除缺失值——dropna

- \`df.dropna()\`：删除包含任何缺失值的行
- \`df.dropna(axis=1)\`：删除包含任何缺失值的列
- \`df.dropna(how='all')\`：仅当整行全部缺失时才删除
- \`df.dropna(subset=['列名'])\`：只根据指定列判断
- \`df.dropna(thresh=n)\`：保留至少有n个非缺失值的行

### 填充缺失值——fillna

- \`df.fillna(0)\`：用固定值填充
- \`df.fillna(df.mean())\`：用均值填充（数值列常用）
- \`df.fillna({'列1': 0, '列2': '未知'})\`：不同列用不同值填充
- \`df.fillna(method='ffill')\`：前向填充（用上一个非缺失值填充）
- \`df.fillna(method='bfill')\`：后向填充（用下一个非缺失值填充）

### 插值法——interpolate

\`df.interpolate()\`使用插值方法填充缺失值，适合时间序列数据：
- \`method='linear'\`：线性插值（默认）
- \`method='pad'\`：前向填充

选择缺失值处理策略时，需要根据业务场景和数据特点决定：删除可能丢失信息，填充可能引入偏差。`,
          codeExample: `import pandas as pd
import numpy as np

# 客户订单数据（含缺失值）
df = pd.DataFrame({
    '客户ID': ['C001', 'C002', 'C003', 'C004', 'C005', 'C006'],
    '姓名': ['张三', '李四', np.nan, '赵六', '钱七', np.nan],
    '订单金额': [5999, np.nan, 2999, np.nan, 899, 1299],
    '城市': ['北京', '上海', np.nan, '北京', '深圳', '广州'],
    '会员等级': ['金卡', '银卡', '银卡', np.nan, '普通', '金卡']
})
print("原始数据:")
print(df)
print(f"\\n缺失值统计:\\n{df.isna().sum()}")
print(f"\\n缺失比例:\\n{df.isna().mean().round(2)}")

# 删除缺失值
print(f"\\n删除含缺失值的行:\\n{df.dropna()}")
print(f"\\n仅根据订单金额判断:\\n{df.dropna(subset=['订单金额'])}")

# 填充缺失值
df_filled = df.copy()
df_filled['订单金额'] = df_filled['订单金额'].fillna(df_filled['订单金额'].mean())
df_filled['姓名'] = df_filled['姓名'].fillna('未知客户')
df_filled['城市'] = df_filled['城市'].fillna('未知')
df_filled['会员等级'] = df_filled['会员等级'].fillna('普通')
print(f"\\n填充后数据:\\n{df_filled}")

# 前向填充
df_ffill = df.fillna(method='ffill')
print(f"\\n前向填充:\\n{df_ffill}")`,
          exercise: {
            id: 'ex2-2-1',
            lessonId: 'les2-2-1',
            description: '编写一个函数 `smart_fillna(df)`，对DataFrame进行智能缺失值填充：1) 数值列用中位数填充；2) 字符串/对象列用众数（mode）填充，如果众数为空则用"未知"填充；3) 返回填充后的DataFrame。注意不要修改原始DataFrame。',
            initialCode: `import pandas as pd
import numpy as np

def smart_fillna(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '商品': ['键盘', '鼠标', np.nan, '键盘', '显示器'],
    '价格': [299, np.nan, 899, 299, 1999],
    '销量': [50, 200, np.nan, 50, 30]
})
print(smart_fillna(df))`,
            hints: [
              '遍历每列，用 pd.api.types.is_numeric_dtype(df[col]) 判断是否为数值列',
              '数值列用 df[col].median() 填充，字符串列用 df[col].mode()[0] 填充（众数可能为空，需要判断）'
            ],
            referenceAnswer: `import pandas as pd
import numpy as np

def smart_fillna(df):
    df = df.copy()
    for col in df.columns:
        if df[col].isna().any():
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                mode_val = df[col].mode()
                fill_val = mode_val[0] if len(mode_val) > 0 else '未知'
                df[col] = df[col].fillna(fill_val)
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'价格': [100, np.nan, 300], '类别': ['A', np.nan, 'A']}); result = smart_fillna(df); print(result['价格'].iloc[1], result['类别'].iloc[1])", expectedOutput: '200.0 A' },
              { input: "df = pd.DataFrame({'价格': [100, np.nan], '类别': ['A', np.nan]}); result = smart_fillna(df); print(result.isna().sum().sum())", expectedOutput: '0' }
            ]
          }
        },
        {
          id: 'les2-2-2',
          chapterId: 'ch2-2',
          title: '数据类型转换与重复值处理',
          type: 'both',
          content: `## 数据类型转换与重复值处理

数据类型不正确和重复数据是数据清洗中常见的两类问题。数据类型错误会导致计算结果异常，重复数据会导致统计结果偏高，都需要在分析前妥善处理。

### Pandas常用数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| int64 | 整数 | 1, 2, 100 |
| float64 | 浮点数 | 1.5, 3.14 |
| bool | 布尔值 | True, False |
| object | Python对象（通常为字符串） | 'hello' |
| datetime64 | 日期时间 | 2024-01-15 |
| category | 分类类型 | 有限个离散值 |

### 类型转换方法

**astype()**——最基本的类型转换：
- \`df['列名'].astype(int)\`：转为整数
- \`df['列名'].astype(float)\`：转为浮点数
- \`df['列名'].astype(str)\`：转为字符串
- \`df['列名'].astype('category')\`：转为分类类型

**pd.to_numeric()**——安全地转为数值类型：
- \`errors='coerce'\`：无法转换的值设为NaN（推荐）
- \`errors='raise'\`：无法转换时报错（默认）
- \`errors='ignore'\`：无法转换时保持原样

**pd.to_datetime()**——转为日期时间类型：
- 支持多种日期格式自动推断
- \`format\`参数可指定格式，如\`'%Y-%m-%d'\`

### 重复值检测与处理

- \`df.duplicated()\`：检测重复行，返回布尔Series
- \`df.duplicated(subset=['列1'])\`：根据指定列检测重复
- \`df.drop_duplicates()\`：删除重复行
- \`df.drop_duplicates(subset=['列1'], keep='first')\`：按指定列去重，保留第一条
- \`df.drop_duplicates(subset=['列1'], keep='last')\`：保留最后一条
- \`df.drop_duplicates(keep=False)\`：删除所有重复行

### 分类类型的好处

将低基数字符串列转为category类型可以：
- 大幅减少内存占用
- 提高groupby等操作的性能
- 明确表示该列为分类变量`,
          codeExample: `import pandas as pd
import numpy as np

# 订单数据（含类型问题和重复值）
df = pd.DataFrame({
    '订单号': ['ORD001', 'ORD002', 'ORD003', 'ORD001', 'ORD004'],
    '金额': ['5999', '3999', 'abc', '5999', '1299'],
    '日期': ['2024-01-15', '2024/02/20', '2024-03-10', '2024-01-15', '2024-04-05'],
    '状态': ['已完成', '配送中', '已完成', '已完成', '待发货']
})
print("原始数据:")
print(df)
print(f"\\n数据类型:\\n{df.dtypes}")

# 类型转换
df['金额'] = pd.to_numeric(df['金额'], errors='coerce')
df['日期'] = pd.to_datetime(df['日期'])
df['状态'] = df['状态'].astype('category')
print(f"\\n转换后类型:\\n{df.dtypes}")
print(f"\\n转换后数据:\\n{df}")

# 重复值检测
print(f"\\n重复行检测:\\n{df.duplicated()}")
print(f"\\n按订单号检测重复:\\n{df.duplicated(subset=['订单号'])}")

# 删除重复值
print(f"\\n删除完全重复行:\\n{df.drop_duplicates()}")
print(f"\\n按订单号去重(保留最后):\\n{df.drop_duplicates(subset=['订单号'], keep='last')}")

# 分类类型信息
print(f"\\n状态分类:\\n{df['状态'].cat.categories.tolist()}")
print(f"分类数量: {df['状态'].nunique()}")`,
          exercise: {
            id: 'ex2-2-2',
            lessonId: 'les2-2-2',
            description: '编写一个函数 `clean_and_dedup(df)`，对DataFrame进行清洗：1) 将所有看起来像数字的列转为数值类型（用pd.to_numeric，无效值变NaN）；2) 将看起来像日期的列名含"日期"或"时间"的列转为datetime类型；3) 删除完全重复的行；4) 返回清洗后的DataFrame。',
            initialCode: `import pandas as pd

def clean_and_dedup(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '订单号': ['O001', 'O002', 'O001'],
    '金额': ['5999', 'abc', '5999'],
    '日期': ['2024-01-15', '2024-02-20', '2024-01-15'],
    '状态': ['已完成', '配送中', '已完成']
})
print(clean_and_dedup(df))`,
            hints: [
              '遍历列，对object类型的列尝试 pd.to_numeric(errors="coerce")，如果转换后非空值没有减少则保留原值',
              '日期列判断：if "日期" in col or "时间" in col，用 pd.to_datetime(errors="coerce") 转换'
            ],
            referenceAnswer: `import pandas as pd

def clean_and_dedup(df):
    df = df.drop_duplicates()
    df = df.copy()
    for col in df.columns:
        if df[col].dtype == 'object':
            if '日期' in col or '时间' in col:
                df[col] = pd.to_datetime(df[col], errors='coerce')
            else:
                numeric = pd.to_numeric(df[col], errors='coerce')
                if numeric.notna().sum() >= df[col].notna().sum() * 0.5:
                    df[col] = numeric
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'金额': ['100', 'abc', '100'], '日期': ['2024-01-01', '2024-02-01', '2024-01-01']}); result = clean_and_dedup(df); print(result.shape[0])", expectedOutput: '2' },
              { input: "df = pd.DataFrame({'金额': ['100', '200'], '日期': ['2024-01-01', '2024-02-01']}); result = clean_and_dedup(df); print(result['金额'].dtype)", expectedOutput: 'float64' }
            ]
          }
        },
        {
          id: 'les2-2-3',
          chapterId: 'ch2-2',
          title: '异常值检测与处理',
          type: 'both',
          content: `## 异常值检测与处理

异常值（Outlier）是指明显偏离其他观测值的数据点，可能是数据录入错误、测量误差，也可能是真实的极端情况。在商业数据分析中，异常值会严重影响均值、标准差等统计量，导致分析结论失真。

### 异常值的来源

- **数据录入错误**：多输一个零（100→1000）、负数（价格不应为负）
- **测量误差**：传感器故障、系统bug
- **真实极端值**：双十一销量暴增、VIP客户超大订单
- **数据处理错误**：单位换算错误、合并错误

### IQR方法（四分位距法）

IQR方法是最常用的异常值检测方法，基于数据的分位数，不受极端值影响：

1. 计算第一四分位数Q1（25%分位）和第三四分位数Q3（75%分位）
2. 计算IQR = Q3 - Q1
3. 定义正常范围：[Q1 - 1.5×IQR, Q3 + 1.5×IQR]
4. 超出此范围的值为异常值

\`\`\`python
Q1 = df['列名'].quantile(0.25)
Q3 = df['列名'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
outliers = df[(df['列名'] < lower) | (df['列名'] > upper)]
\`\`\`

### Z-Score方法

Z-Score方法基于标准正态分布，假设数据近似正态分布：

1. 计算Z-Score：z = (x - μ) / σ
2. |z| > 3的值视为异常值（3σ原则）

\`\`\`python
z_scores = (df['列名'] - df['列名'].mean()) / df['列名'].std()
outliers = df[abs(z_scores) > 3]
\`\`\`

### 异常值处理策略

- **删除**：确认是错误数据时直接删除
- **替换为边界值**：\`df['列名'].clip(lower, upper)\`，将超出范围的值截断到边界
- **用中位数替换**：比均值更稳健
- **标记后单独分析**：保留原始数据，增加异常标记列

选择处理策略时，需要结合业务场景判断异常值是错误还是真实极端情况。`,
          codeExample: `import pandas as pd
import numpy as np

# 客户消费数据（含异常值）
np.random.seed(42)
df = pd.DataFrame({
    '客户ID': [f'C{i:03d}' for i in range(1, 21)],
    '月消费额': np.concatenate([
        np.random.normal(500, 100, 18),  # 正常消费
        [5000, -200]  # 异常值：极高消费、负消费
    ])
})
print("消费数据统计:")
print(df['月消费额'].describe())

# IQR方法检测异常值
Q1 = df['月消费额'].quantile(0.25)
Q3 = df['月消费额'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
print(f"\\nIQR方法: Q1={Q1:.1f}, Q3={Q3:.1f}, IQR={IQR:.1f}")
print(f"正常范围: [{lower:.1f}, {upper:.1f}]")
outliers_iqr = df[(df['月消费额'] < lower) | (df['月消费额'] > upper)]
print(f"异常值(IQR):\\n{outliers_iqr}")

# Z-Score方法检测异常值
mean = df['月消费额'].mean()
std = df['月消费额'].std()
z_scores = (df['月消费额'] - mean) / std
outliers_z = df[abs(z_scores) > 3]
print(f"\\n异常值(Z-Score):\\n{outliers_z}")

# clip截断处理
df['消费额_截断'] = df['月消费额'].clip(lower, upper)
print(f"\\n截断后统计:\\n{df['消费额_截断'].describe()}")

# 标记异常值
df['是否异常'] = (df['月消费额'] < lower) | (df['月消费额'] > upper)
print(f"\\n异常值数量: {df['是否异常'].sum()}")`,
          exercise: {
            id: 'ex2-2-3',
            lessonId: 'les2-2-3',
            description: "编写一个函数 `detect_and_handle_outliers(df, column, method='iqr', action='clip')`，对指定列进行异常值检测和处理。method可选'iqr'或'zscore'，action可选'clip'（截断到边界）、'remove'（删除异常行）或'mark'（添加是否异常列）。返回处理后的DataFrame。",
            initialCode: `import pandas as pd
import numpy as np

def detect_and_handle_outliers(df, column, method='iqr', action='clip'):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '客户ID': ['C001', 'C002', 'C003', 'C004', 'C005'],
    '消费额': [500, 480, 5200, 510, -100]
})
print(detect_and_handle_outliers(df, '消费额', method='iqr', action='clip'))
print(detect_and_handle_outliers(df, '消费额', method='iqr', action='mark'))`,
            hints: [
              'IQR方法：Q1=df[col].quantile(0.25), Q3=df[col].quantile(0.75), IQR=Q3-Q1, 边界为Q1-1.5*IQR和Q3+1.5*IQR',
              'Z-Score方法：z=(df[col]-mean)/std, 边界用mean±3*std',
              'clip用df[col].clip(lower, upper)，mark用df["是否异常"]=(df[col]<lower)|(df[col]>upper)'
            ],
            referenceAnswer: `import pandas as pd
import numpy as np

def detect_and_handle_outliers(df, column, method='iqr', action='clip'):
    df = df.copy()
    col_data = df[column]
    if method == 'iqr':
        Q1 = col_data.quantile(0.25)
        Q3 = col_data.quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
    else:
        mean = col_data.mean()
        std = col_data.std()
        lower = mean - 3 * std
        upper = mean + 3 * std

    is_outlier = (col_data < lower) | (col_data > upper)

    if action == 'clip':
        df[column] = df[column].clip(lower, upper)
    elif action == 'remove':
        df = df[~is_outlier]
    elif action == 'mark':
        df['是否异常'] = is_outlier
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'消费额': [500, 480, 5200, 510, -100]}); result = detect_and_handle_outliers(df, '消费额', 'iqr', 'clip'); print(result['消费额'].min() >= 0)", expectedOutput: 'True' },
              { input: "df = pd.DataFrame({'消费额': [500, 480, 5200, 510, -100]}); result = detect_and_handle_outliers(df, '消费额', 'iqr', 'mark'); print(result['是否异常'].sum())", expectedOutput: '2' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch2-3',
      moduleId: 'data-processing',
      title: '数据变换与特征工程',
      order: 3,
      lessons: [
        {
          id: 'les2-3-1',
          chapterId: 'ch2-3',
          title: '列操作与映射变换',
          type: 'both',
          content: `## 列操作与映射变换

在数据分析中，我们经常需要对数据进行各种变换：计算新列、转换值格式、批量应用函数等。Pandas提供了apply、map、applymap等强大的映射变换工具，让我们能够高效地完成这些操作。

### apply——万能变换器

\`apply()\`是最灵活的变换方法，可以沿DataFrame的行或列应用自定义函数：
- \`df.apply(func, axis=0)\`：对每列应用函数（默认）
- \`df.apply(func, axis=1)\`：对每行应用函数
- \`Series.apply(func)\`：对Series的每个元素应用函数

### map——值映射

\`Series.map()\`将Series中的每个值映射为新值：
- 传入字典：\`df['等级'].map({'A': '优', 'B': '良', 'C': '中'})\`
- 传入函数：\`df['价格'].map(lambda x: f'¥{x}')\`
- map只能用于Series，且返回与原Series相同长度的结果

### applymap——元素级变换

\`DataFrame.applymap(func)\`对DataFrame中的**每个元素**应用函数：
- \`df.applymap(lambda x: str(x).strip())\`：去除所有字符串的空格
- \`df.applymap(type)\`：查看每个元素的类型

> 注意：Pandas 2.1+中推荐使用\`map()\`替代\`applymap()\`

### assign——链式添加列

\`df.assign(新列名=表达式)\`返回添加了新列的DataFrame副本，支持链式操作：
\`\`\`python
df.assign(总金额=lambda x: x['单价'] * x['数量'])
  .assign(折扣价=lambda x: x['总金额'] * 0.9)
\`\`\`

### 实际业务场景

- **价格分级**：根据消费金额将客户分为"高消费"、"中消费"、"低消费"
- **数据标准化**：将不同量级的数据转换到同一尺度
- **格式转换**：将日期字符串转为季度、将金额格式化为带货币符号

选择变换方法的原则：能用向量化操作就不用apply，能用map就不用apply，简单优先。`,
          codeExample: `import pandas as pd

# 客户消费数据
df = pd.DataFrame({
    '客户': ['张三', '李四', '王五', '赵六', '钱七'],
    '消费额': [5800, 1200, 3500, 800, 9200],
    '等级代码': ['A', 'C', 'B', 'D', 'A'],
    '折扣率': [0.9, 0.95, 0.92, 0.98, 0.88]
})
print("原始数据:")
print(df)

# map - 值映射
grade_map = {'A': '金牌', 'B': '银牌', 'C': '铜牌', 'D': '普通'}
df['等级'] = df['等级代码'].map(grade_map)
print(f"\\nmap映射等级:\\n{df[['客户', '等级代码', '等级']]}")

# apply - 行级计算
df['实付金额'] = df.apply(lambda row: row['消费额'] * row['折扣率'], axis=1)
print(f"\\napply计算实付:\\n{df[['客户', '消费额', '折扣率', '实付金额']]}")

# apply - 自定义函数
def classify_customer(amount):
    if amount >= 5000:
        return '高消费'
    elif amount >= 2000:
        return '中消费'
    else:
        return '低消费'

df['消费级别'] = df['消费额'].apply(classify_customer)
print(f"\\napply分类:\\n{df[['客户', '消费额', '消费级别']]}")

# assign - 链式添加列
result = df.assign(
   节省金额=lambda x: x['消费额'] - x['实付金额']
).assign(
   节省比例=lambda x: (x['节省金额'] / x['消费额'] * 100).round(1)
)
print(f"\\nassign链式操作:\\n{result[['客户', '消费额', '节省金额', '节省比例']]}")`,
          exercise: {
            id: 'ex2-3-1',
            lessonId: 'les2-3-1',
            description: '编写一个函数 `transform_sales(df)`，对销售DataFrame进行变换：1) 用map将"支付方式"列的英文值映射为中文（Credit→信用卡, Debit→借记卡, Cash→现金, WeChat→微信, Alipay→支付宝）；2) 用apply对每行计算"实际收入"=金额×(1-折扣)；3) 用assign添加"是否大单"列（金额>1000为True）；4) 返回变换后的DataFrame。',
            initialCode: `import pandas as pd

def transform_sales(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '订单号': ['O001', 'O002', 'O003', 'O004'],
    '金额': [599, 1299, 89, 2500],
    '折扣': [0.05, 0.10, 0, 0.15],
    '支付方式': ['Credit', 'WeChat', 'Cash', 'Alipay']
})
print(transform_sales(df))`,
            hints: [
              '支付方式映射：df["支付方式"].map({"Credit": "信用卡", "Debit": "借记卡", "Cash": "现金", "WeChat": "微信", "Alipay": "支付宝"})',
              '实际收入用 apply(axis=1) 对每行计算，或直接用向量化 df["金额"] * (1 - df["折扣"])'
            ],
            referenceAnswer: `import pandas as pd

def transform_sales(df):
    df = df.copy()
    pay_map = {'Credit': '信用卡', 'Debit': '借记卡', 'Cash': '现金', 'WeChat': '微信', 'Alipay': '支付宝'}
    df['支付方式'] = df['支付方式'].map(pay_map)
    df['实际收入'] = df.apply(lambda row: row['金额'] * (1 - row['折扣']), axis=1)
    df = df.assign(是否大单=df['金额'] > 1000)
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'金额': [599, 1299], '折扣': [0.05, 0.10], '支付方式': ['Credit', 'WeChat']}); result = transform_sales(df); print(result['支付方式'].tolist())", expectedOutput: "['信用卡', '微信']" },
              { input: "df = pd.DataFrame({'金额': [599, 1299], '折扣': [0.05, 0.10], '支付方式': ['Credit', 'WeChat']}); result = transform_sales(df); print(result['是否大单'].tolist())", expectedOutput: '[False, True]' }
            ]
          }
        },
        {
          id: 'les2-3-2',
          chapterId: 'ch2-3',
          title: '分箱与标准化',
          type: 'both',
          content: `## 分箱与标准化

分箱和标准化是数据预处理中的两个重要技术。分箱将连续变量离散化，便于分组分析和建模；标准化将不同量级的数据转换到同一尺度，消除量纲影响。

### 分箱（Binning）

分箱将连续数值划分为若干个区间（箱子），每个值被分配到对应的区间中。

**等宽分箱——pd.cut()**
- 将值域均匀划分为若干等宽区间
- \`pd.cut(df['列名'], bins=5)\`：分为5个等宽区间
- \`pd.cut(df['列名'], bins=[0, 60, 80, 100])\`：自定义区间边界
- \`labels\`参数：自定义区间标签
- \`right=False\`：左闭右开区间（默认左开右闭）

**等频分箱——pd.qcut()**
- 每个区间包含大致相同数量的数据
- \`pd.qcut(df['列名'], q=4)\`：分为4个等频区间（四分位数）
- \`pd.qcut(df['列名'], q=4, labels=['D', 'C', 'B', 'A'])\`：自定义标签

**cut vs qcut选择：**
- 希望区间等宽→cut
- 希望每组样本量相近→qcut
- 数据分布不均匀时，qcut更稳定

### 标准化（Normalization）

**Z-Score标准化（StandardScaler）**
- 公式：z = (x - μ) / σ
- 结果：均值为0，标准差为1
- 适用于数据近似正态分布的情况
- \`from sklearn.preprocessing import StandardScaler\`（需sklearn）
- 纯Pandas实现：\`(df - df.mean()) / df.std()\`

**Min-Max标准化（MinMaxScaler）**
- 公式：x' = (x - min) / (max - min)
- 结果：缩放到[0, 1]区间
- 适用于数据分布无明显异常值的情况
- 纯Pandas实现：\`(df - df.min()) / (df.max() - df.min())\`

### 业务应用场景

- **客户分群**：将消费金额分箱为"低/中/高"消费群体
- **信用评分**：将连续评分分箱为"差/一般/良好/优秀"
- **特征工程**：标准化消除不同特征量纲差异，提高模型效果`,
          codeExample: `import pandas as pd
import numpy as np

# 客户消费数据
df = pd.DataFrame({
    '客户': [f'C{i:03d}' for i in range(1, 16)],
    '消费额': [120, 580, 2300, 450, 8900, 340, 1500, 780, 3200, 560,
              90, 4200, 670, 1800, 950]
})
print("原始数据:")
print(df.to_string())

# 等宽分箱 - cut
df['消费等级_cut'] = pd.cut(df['消费额'], bins=3, labels=['低', '中', '高'])
print(f"\\n等宽分箱(cut):\\n{df[['客户', '消费额', '消费等级_cut']]}")

# 自定义分箱
df['消费区间'] = pd.cut(df['消费额'],
    bins=[0, 500, 2000, float('inf')],
    labels=['低消费(≤500)', '中消费(500-2000)', '高消费(>2000)'])
print(f"\\n自定义分箱:\\n{df[['客户', '消费额', '消费区间']]}")

# 等频分箱 - qcut
df['消费四分位'] = pd.qcut(df['消费额'], q=4, labels=['Q1', 'Q2', 'Q3', 'Q4'])
print(f"\\n等频分箱(qcut):\\n{df[['客户', '消费额', '消费四分位']]}")

# Z-Score标准化
df['消费_ZScore'] = ((df['消费额'] - df['消费额'].mean()) / df['消费额'].std()).round(2)
print(f"\\nZ-Score标准化:\\n{df[['客户', '消费额', '消费_ZScore']]}")

# Min-Max标准化
df['消费_MinMax'] = ((df['消费额'] - df['消费额'].min()) / (df['消费额'].max() - df['消费额'].min())).round(3)
print(f"\\nMin-Max标准化:\\n{df[['客户', '消费额', '消费_MinMax']]}")`,
          exercise: {
            id: 'ex2-3-2',
            lessonId: 'les2-3-2',
            description: "编写一个函数 `bin_and_normalize(df, value_col)`，对指定列进行分箱和标准化：1) 用qcut将值分为4个等频区间，标签为['低', '中低', '中高', '高']，添加等级列；2) 对值进行Min-Max标准化，添加标准化值列；3) 返回包含原始列、等级和标准化值列的DataFrame。",
            initialCode: `import pandas as pd

def bin_and_normalize(df, value_col):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '商品': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    '销量': [100, 500, 200, 800, 300, 600, 150, 700]
})
print(bin_and_normalize(df, '销量'))`,
            hints: [
              'qcut分箱：pd.qcut(df[value_col], q=4, labels=["低", "中低", "中高", "高"])',
              'Min-Max标准化：(df[value_col] - df[value_col].min()) / (df[value_col].max() - df[value_col].min())'
            ],
            referenceAnswer: `import pandas as pd

def bin_and_normalize(df, value_col):
    df = df.copy()
    df['等级'] = pd.qcut(df[value_col], q=4, labels=['低', '中低', '中高', '高'])
    df['标准化值'] = (df[value_col] - df[value_col].min()) / (df[value_col].max() - df[value_col].min())
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'销量': [100, 500, 200, 800, 300, 600, 150, 700]}); result = bin_and_normalize(df, '销量'); print(result['标准化值'].min(), result['标准化值'].max())", expectedOutput: '0.0 1.0' },
              { input: "df = pd.DataFrame({'销量': [100, 500, 200, 800, 300, 600, 150, 700]}); result = bin_and_normalize(df, '销量'); print(len(result['等级'].unique()))", expectedOutput: '4' }
            ]
          }
        },
        {
          id: 'les2-3-3',
          chapterId: 'ch2-3',
          title: '文本数据处理',
          type: 'both',
          content: `## 文本数据处理

在商业数据分析中，文本数据无处不在：商品名称、客户地址、订单备注、评论内容等。Pandas提供了强大的\`.str\`访问器，让我们能够像操作Python字符串一样高效地处理整个列的文本数据。

### str访问器

对Series使用\`.str\`访问器后，可以调用几乎所有Python字符串方法，且自动对每个元素进行操作：

**基本操作：**
- \`.str.lower()\` / \`.str.upper()\`：转小写/大写
- \`.str.strip()\` / \`.str.lstrip()\` / \`.str.rstrip()\`：去除空白
- \`.str.len()\`：计算字符串长度
- \`.str.contains('pattern')\`：是否包含指定字符串
- \`.str.startswith('prefix')\` / \`.str.endswith('suffix')\`：前缀/后缀判断
- \`.str.replace('old', 'new')\`：替换字符串

**分割与提取：**
- \`.str.split('sep')\`：按分隔符分割，返回列表
- \`.str.split('sep', expand=True)\`：分割并展开为多列
- \`.str.get(i)\`：获取分割后的第i个元素
- \`.str.slice(start, stop)\`：切片
- \`.str.extract(r'pattern')\`：用正则提取第一个匹配
- \`.str.findall(r'pattern')\`：用正则查找所有匹配

### 正则表达式

Pandas的str方法支持正则表达式，常用的正则模式：
- \`\\d\`：数字
- \`\\w\`：字母数字下划线
- \`\\s\`：空白字符
- \`.\`：任意字符
- \`*\`：0次或多次
- \`+\`：1次或多次
- \`?\`：0次或1次
- \`()\`：捕获组

### 常见业务场景

- **清洗地址**：提取省市区信息
- **清洗电话**：统一格式、去除特殊字符
- **商品分类**：从商品名称中提取品牌、型号
- **评论分析**：提取关键词、情感判断

文本处理是数据清洗的重要环节，掌握str访问器能大幅提高数据清洗效率。`,
          codeExample: `import pandas as pd

# 商品数据（含文本问题）
df = pd.DataFrame({
    '商品名称': ['  苹果iPhone15  ', '华为Mate60Pro', ' 小米14Ultra ', 'OPPO Find X7', 'vivo X100'],
    '价格标签': ['¥5999', '￥4999', '3999元', '¥4299', '￥3999'],
    '规格': ['128G/黑色', '256G/白色', '512G/蓝色', '256G/黑色', '128G/白色'],
    '地址': ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区']
})
print("原始数据:")
print(df)

# 去除空白
df['商品名称'] = df['商品名称'].str.strip()
print(f"\\n去除空白后:\\n{df['商品名称']}")

# 提取价格数字
df['价格'] = df['价格标签'].str.replace('[¥￥元]', '', regex=True).astype(int)
print(f"\\n提取价格:\\n{df[['价格标签', '价格']]}")

# 分割规格
df[['存储', '颜色']] = df['规格'].str.split('/', expand=True)
print(f"\\n分割规格:\\n{df[['规格', '存储', '颜色']]}")

# 提取品牌
df['品牌'] = df['商品名称'].str.extract(r'^(\\w+)')
print(f"\\n提取品牌:\\n{df[['商品名称', '品牌']]}")

# 提取省份
df['省份'] = df['地址'].str.extract(r'^(.+?[省市])')
print(f"\\n提取省份:\\n{df[['地址', '省份']]}")

# contains筛选
has_pro = df[df['商品名称'].str.contains('Pro|Ultra', case=False, na=False)]
print(f"\\n含Pro/Ultra的商品:\\n{has_pro['商品名称']}")`,
          exercise: {
            id: 'ex2-3-3',
            lessonId: 'les2-3-3',
            description: '编写一个函数 `clean_product_text(df)`，对商品DataFrame进行文本清洗：1) "商品名称"列去除首尾空白并转为首字母大写格式（str.title()）；2) 从"价格文本"列中提取数字部分转为float类型存为"价格"列（处理¥、￥、元等符号）；3) 从"规格"列中用split分割出"容量"和"颜色"两列；4) 返回清洗后的DataFrame。',
            initialCode: `import pandas as pd

def clean_product_text(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '商品名称': ['  apple iphone15  ', 'HUAWEI mate60', ' xiaomi 14 '],
    '价格文本': ['¥5999', '￥4999', '3999元'],
    '规格': ['128G/黑色', '256G/白色', '512G/蓝色']
})
print(clean_product_text(df))`,
            hints: [
              '去除空白用 str.strip()，首字母大写用 str.title()',
              '提取价格数字：str.replace("[¥￥元]", "", regex=True) 然后转 float',
              '分割规格：str.split("/", expand=True) 得到两列'
            ],
            referenceAnswer: `import pandas as pd

def clean_product_text(df):
    df = df.copy()
    df['商品名称'] = df['商品名称'].str.strip().str.title()
    df['价格'] = df['价格文本'].str.replace('[¥￥元]', '', regex=True).astype(float)
    df[['容量', '颜色']] = df['规格'].str.split('/', expand=True)
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'商品名称': ['  apple  '], '价格文本': ['¥5999'], '规格': ['128G/黑色']}); result = clean_product_text(df); print(result['商品名称'].iloc[0], result['价格'].iloc[0])", expectedOutput: 'Apple 5999.0' },
              { input: "df = pd.DataFrame({'商品名称': ['  HUAWEI  '], '价格文本': ['￥3999'], '规格': ['256G/白色']}); result = clean_product_text(df); print(result['容量'].iloc[0], result['颜色'].iloc[0])", expectedOutput: '256G 白色' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch2-4',
      moduleId: 'data-processing',
      title: '分组聚合与透视表',
      order: 4,
      lessons: [
        {
          id: 'les2-4-1',
          chapterId: 'ch2-4',
          title: 'groupby分组操作',
          type: 'both',
          content: `## groupby分组操作

分组聚合是商业数据分析中最核心的操作之一。无论是按部门统计销售额、按地区汇总订单量，还是按客户等级分析消费行为，都离不开分组聚合。Pandas的groupby遵循经典的"Split-Apply-Combine"（拆分-应用-合并）模式。

### groupby机制

1. **Split（拆分）**：按分组键将数据拆分为多个组
2. **Apply（应用）**：对每个组独立应用聚合函数
3. **Combine（合并）**：将各组结果合并为新的数据结构

### 基本用法

\`\`\`python
# 单列分组 + 单列聚合
df.groupby('类别')['销售额'].sum()

# 单列分组 + 多列聚合
df.groupby('类别')[['销售额', '利润']].mean()

# 多列分组
df.groupby(['地区', '类别'])['销售额'].sum()
\`\`\`

### 常用聚合函数

| 函数 | 说明 | 示例场景 |
|------|------|----------|
| sum() | 求和 | 总销售额 |
| mean() | 平均值 | 平均客单价 |
| count() | 非空值计数 | 订单数量 |
| size() | 总行数计数 | 含缺失的记录数 |
| min() / max() | 最小/最大值 | 最低/最高消费 |
| std() / var() | 标准差/方差 | 消费波动 |
| first() / last() | 首个/末个值 | 首次/最近购买 |
| nunique() | 唯一值数量 | 去重客户数 |

### GroupBy对象

groupby返回的不是DataFrame，而是一个GroupBy对象。可以理解为"分组后的数据容器"：
- \`groups\`属性：查看分组字典
- \`get_group(key)\`：获取某个分组的数据
- \`ngroups\`属性：分组数量
- 遍历：\`for name, group in df.groupby('列名')\`

### as_index参数

默认情况下，分组列会成为结果的索引。设置\`as_index=False\`可以保持分组列为普通列，这在后续处理时更方便。

掌握groupby是成为数据分析高手的关键一步，几乎所有商业分析报告都离不开分组统计。`,
          codeExample: `import pandas as pd

# 销售数据
df = pd.DataFrame({
    '地区': ['华东', '华东', '华北', '华北', '华南', '华南', '华东', '华北'],
    '类别': ['电子', '服装', '电子', '服装', '电子', '服装', '电子', '电子'],
    '销售额': [12000, 8500, 9800, 7200, 11000, 6800, 13500, 8900],
    '利润': [2400, 1700, 1960, 1440, 2200, 1360, 2700, 1780],
    '订单数': [45, 62, 38, 55, 42, 48, 50, 35]
})
print("原始数据:")
print(df)

# 基本分组聚合
print(f"\\n各地区总销售额:")
print(df.groupby('地区')['销售额'].sum())

print(f"\\n各地区平均销售额和利润:")
print(df.groupby('地区')[['销售额', '利润']].mean())

# 多列分组
print(f"\\n地区-类别分组:")
print(df.groupby(['地区', '类别'])['销售额'].sum())

# as_index=False
print(f"\\nas_index=False:")
print(df.groupby('地区', as_index=False)['销售额'].sum())

# 多种聚合
print(f"\\n各地区销售额统计:")
print(df.groupby('地区')['销售额'].agg(['sum', 'mean', 'count']))

# 查看分组
grouped = df.groupby('地区')
print(f"\\n分组数量: {grouped.ngroups}")
print(f"\\n华东组数据:\\n{grouped.get_group('华东')}")`,
          exercise: {
            id: 'ex2-4-1',
            lessonId: 'les2-4-1',
            description: '编写一个函数 `sales_summary(df)`，对销售DataFrame进行分组统计：1) 按"地区"分组，计算"销售额"的总和、均值、最大值，"订单数"的总和，"利润"的平均值；2) 列名分别为"总销售额"、"平均销售额"、"最高销售额"、"总订单数"、"平均利润"；3) 返回以"地区"为普通列（非索引）的DataFrame。',
            initialCode: `import pandas as pd

def sales_summary(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '地区': ['华东', '华东', '华北', '华北', '华南'],
    '销售额': [12000, 8500, 9800, 7200, 11000],
    '利润': [2400, 1700, 1960, 1440, 2200],
    '订单数': [45, 62, 38, 55, 42]
})
print(sales_summary(df))`,
            hints: [
              '使用 groupby + agg，传入字典指定每列的聚合函数：agg({"销售额": ["sum","mean","max"], "订单数": "sum", "利润": "mean"})',
              'agg返回多级列名，需要重命名。也可以分步聚合后拼接，或用 as_index=False'
            ],
            referenceAnswer: `import pandas as pd

def sales_summary(df):
    result = df.groupby('地区', as_index=False).agg(
        总销售额=('销售额', 'sum'),
        平均销售额=('销售额', 'mean'),
        最高销售额=('销售额', 'max'),
        总订单数=('订单数', 'sum'),
        平均利润=('利润', 'mean')
    )
    return result`,
            testCases: [
              { input: "df = pd.DataFrame({'地区': ['华东', '华东', '华北'], '销售额': [12000, 8500, 9800], '利润': [2400, 1700, 1960], '订单数': [45, 62, 38]}); result = sales_summary(df); print(result[result['地区']=='华东']['总销售额'].values[0])", expectedOutput: '20500' },
              { input: "df = pd.DataFrame({'地区': ['华东', '华东'], '销售额': [100, 200], '利润': [10, 20], '订单数': [5, 10]}); result = sales_summary(df); print(result.columns.tolist())", expectedOutput: "['地区', '总销售额', '平均销售额', '最高销售额', '总订单数', '平均利润']" }
            ]
          }
        },
        {
          id: 'les2-4-2',
          chapterId: 'ch2-4',
          title: '聚合与变换',
          type: 'both',
          content: `## 聚合与变换

groupby不仅仅是简单的聚合统计，Pandas还提供了transform、filter和apply等高级操作，让我们能够在分组层面进行更灵活的数据变换。

### agg——多函数聚合

\`agg()\`允许对每列应用不同的聚合函数，是最常用的聚合方法：

\`\`\`python
# 方式1：每列相同的多函数
df.groupby('类别').agg(['mean', 'sum'])

# 方式2：每列不同的函数（字典）
df.groupby('类别').agg({'销售额': 'sum', '利润': 'mean'})

# 方式3：命名聚合（推荐，结果列名清晰）
df.groupby('类别').agg(
    总销售额=('销售额', 'sum'),
    平均利润=('利润', 'mean')
)

# 方式4：自定义函数
df.groupby('类别')['销售额'].agg(lambda x: x.max() - x.min())
\`\`\`

### transform——组内变换

\`transform()\`返回与原DataFrame**相同形状**的结果，将聚合值"广播"回每一行：

\`\`\`python
# 每行的值为该组的平均值
df['组内均值'] = df.groupby('类别')['销售额'].transform('mean')

# 组内标准化
df['标准化'] = df.groupby('类别')['销售额'].transform(
    lambda x: (x - x.mean()) / x.std()
)
\`\`\`

transform的典型应用：
- 组内标准化/归一化
- 填充组内缺失值（用组均值填充）
- 计算组内占比（每个值/组总和）

### filter——组过滤

\`filter()\`根据组的整体特征过滤整个组：

\`\`\`python
# 只保留销售额总和>10000的类别
df.groupby('类别').filter(lambda x: x['销售额'].sum() > 10000)
\`\`\`

### apply——灵活应用

\`apply()\`是最灵活的分组操作，可以对每个组执行任意操作，返回任意形状的结果：

\`\`\`python
# 每组取销售额最高的2行
df.groupby('类别').apply(lambda x: x.nlargest(2, '销售额'), include_groups=False)
\`\`\`

### 方法选择指南

| 方法 | 返回形状 | 使用场景 |
|------|----------|----------|
| agg | 每组一行 | 汇总统计 |
| transform | 与原表相同 | 组内标准化、填充 |
| filter | 原表子集 | 按组特征筛选 |
| apply | 任意 | 复杂组操作 |`,
          codeExample: `import pandas as pd

# 销售数据
df = pd.DataFrame({
    '地区': ['华东', '华东', '华东', '华北', '华北', '华北', '华南', '华南'],
    '类别': ['电子', '电子', '服装', '电子', '服装', '服装', '电子', '服装'],
    '销售额': [12000, 8500, 6200, 9800, 7200, 5800, 11000, 6800],
    '利润': [2400, 1700, 1240, 1960, 1440, 1160, 2200, 1360]
})
print("原始数据:")
print(df)

# agg - 命名聚合
result = df.groupby('地区').agg(
    总销售额=('销售额', 'sum'),
    平均利润=('利润', 'mean'),
    订单数=('销售额', 'count'),
    销售额极差=('销售额', lambda x: x.max() - x.min())
)
print(f"\\n命名聚合结果:\\n{result}")

# transform - 组内占比
df['地区总销售额'] = df.groupby('地区')['销售额'].transform('sum')
df['地区占比'] = (df['销售额'] / df['地区总销售额'] * 100).round(1)
print(f"\\n组内占比:\\n{df[['地区', '销售额', '地区总销售额', '地区占比']]}")

# transform - 组内标准化
df['销售额标准化'] = df.groupby('地区')['销售额'].transform(
    lambda x: ((x - x.mean()) / x.std()).round(2)
)
print(f"\\n组内标准化:\\n{df[['地区', '销售额', '销售额标准化']]}")

# filter - 过滤小分组
big_regions = df.groupby('地区').filter(lambda x: x['销售额'].sum() > 20000)
print(f"\\n总销售额>20000的地区:\\n{big_regions[['地区', '销售额']]}")

# apply - 每组取Top2
top2 = df.groupby('地区').apply(lambda x: x.nlargest(2, '销售额'), include_groups=False)
print(f"\\n每组销售额Top2:\\n{top2}")`,
          exercise: {
            id: 'ex2-4-2',
            lessonId: 'les2-4-2',
            description: '编写一个函数 `group_transform(df)`，对销售DataFrame进行分组变换：1) 按"类别"分组，用transform计算每个商品销售额在该类别中的占比（百分比，保留1位小数），添加"类别占比"列；2) 按"地区"分组，用transform计算每个商品销售额在该地区的排名（降序），添加"地区排名"列；3) 返回包含原始列和两个新列的DataFrame。',
            initialCode: `import pandas as pd

def group_transform(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '地区': ['华东', '华东', '华北', '华北', '华南', '华南'],
    '类别': ['电子', '服装', '电子', '服装', '电子', '服装'],
    '销售额': [12000, 8500, 9800, 7200, 11000, 6800]
})
print(group_transform(df))`,
            hints: [
              '类别占比：df["销售额"] / df.groupby("类别")["销售额"].transform("sum") * 100',
              '地区排名：df.groupby("地区")["销售额"].rank(ascending=False, method="min")'
            ],
            referenceAnswer: `import pandas as pd

def group_transform(df):
    df = df.copy()
    df['类别占比'] = (df['销售额'] / df.groupby('类别')['销售额'].transform('sum') * 100).round(1)
    df['地区排名'] = df.groupby('地区')['销售额'].rank(ascending=False, method='min').astype(int)
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'地区': ['华东', '华东', '华北', '华北'], '类别': ['电子', '服装', '电子', '服装'], '销售额': [100, 200, 300, 100]}); result = group_transform(df); print(result['类别占比'].tolist())", expectedOutput: '[25.0, 66.7, 75.0, 33.3]' },
              { input: "df = pd.DataFrame({'地区': ['华东', '华东'], '类别': ['电子', '电子'], '销售额': [200, 100]}); result = group_transform(df); print(result['地区排名'].tolist())", expectedOutput: '[1, 2]' }
            ]
          }
        },
        {
          id: 'les2-4-3',
          chapterId: 'ch2-4',
          title: '透视表与交叉表',
          type: 'both',
          content: `## 透视表与交叉表

透视表和交叉表是商业数据分析报告中最常用的数据汇总工具。它们能将原始数据按照多个维度进行交叉汇总，快速生成清晰的分析报表。

### pivot_table——透视表

\`pd.pivot_table()\`类似于Excel的数据透视表，按多个维度对数据进行交叉汇总：

\`\`\`python
pd.pivot_table(df, values='值列', index='行维度', columns='列维度', aggfunc='mean')
\`\`\`

**关键参数：**
- \`values\`：要聚合的值列
- \`index\`：行维度（可以是列表，表示多级索引）
- \`columns\`：列维度
- \`aggfunc\`：聚合函数，默认\`'mean'\`，可以是\`'sum'\`、\`'count'\`等
- \`fill_value\`：填充缺失值
- \`margins\`：是否添加汇总行/列（\`margins_name\`指定汇总名称）
- \`margins_name\`：汇总行/列的名称，默认\`'All'\`

### crosstab——交叉表

\`pd.crosstab()\`专门用于计算两个（或多个）因素的交叉频数表：

\`\`\`python
pd.crosstab(df['行因素'], df['列因素'])
\`\`\`

**关键参数：**
- \`values\`：可选，指定值列（配合aggfunc使用）
- \`aggfunc\`：聚合函数（当指定values时）
- \`normalize\`：标准化方式
  - \`'index'\`：按行标准化（每行和为1）
  - \`'columns'\`：按列标准化（每列和为1）
  - \`'all'\`：按总数标准化（所有值和为1）
- \`margins\`：是否添加汇总行/列

### pivot_table vs crosstab

| 特性 | pivot_table | crosstab |
|------|-------------|----------|
| 输入 | DataFrame | Series或数组 |
| 默认聚合 | mean | count |
| 适用场景 | 数值汇总 | 频数统计 |
| 数据来源 | 必须是DataFrame | 可以直接传Series |

### 业务应用

- **销售报表**：按地区和类别交叉汇总销售额
- **客户分析**：按性别和年龄段统计客户数量
- **产品分析**：按品牌和价格区间统计销量
- **趋势分析**：按月份和产品线统计销售额变化`,
          codeExample: `import pandas as pd

# 销售数据
df = pd.DataFrame({
    '地区': ['华东', '华东', '华东', '华北', '华北', '华北', '华南', '华南', '华南',
            '华东', '华北', '华南'],
    '类别': ['电子', '电子', '服装', '电子', '服装', '服装', '电子', '服装', '服装',
            '服装', '电子', '电子'],
    '季度': ['Q1', 'Q2', 'Q1', 'Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2', 'Q2', 'Q2', 'Q1'],
    '销售额': [12000, 13500, 6200, 9800, 7200, 5800, 11000, 6800, 7500, 8900, 8200, 9500],
    '订单数': [45, 50, 62, 38, 55, 48, 42, 48, 52, 58, 35, 40]
})
print("原始数据:")
print(df)

# 透视表 - 地区×类别 销售额总和
pivot1 = pd.pivot_table(df, values='销售额', index='地区', columns='类别', aggfunc='sum')
print(f"\\n地区×类别 销售额:\\n{pivot1}")

# 透视表 - 带汇总
pivot2 = pd.pivot_table(df, values='销售额', index='地区', columns='类别',
                        aggfunc='sum', margins=True, margins_name='合计')
print(f"\\n带汇总的透视表:\\n{pivot2}")

# 透视表 - 多维度
pivot3 = pd.pivot_table(df, values='销售额', index=['地区', '季度'],
                        columns='类别', aggfunc='sum', fill_value=0)
print(f"\\n多维度透视表:\\n{pivot3}")

# 交叉表 - 频数统计
cross1 = pd.crosstab(df['地区'], df['类别'])
print(f"\\n频数交叉表:\\n{cross1}")

# 交叉表 - 带值的聚合
cross2 = pd.crosstab(df['地区'], df['季度'], values=df['销售额'],
                     aggfunc='sum', margins=True)
print(f"\\n带值的交叉表:\\n{cross2}")

# 交叉表 - 行标准化
cross3 = pd.crosstab(df['地区'], df['类别'], normalize='index')
print(f"\\n行标准化交叉表:\\n{cross3.round(2)}")`,
          exercise: {
            id: 'ex2-4-3',
            lessonId: 'les2-4-3',
            description: '编写一个函数 `create_sales_report(df)`，对销售数据创建分析报表：1) 用pivot_table创建"地区"为行、"类别"为列的销售额总和透视表，带汇总行（margins），缺失值填0；2) 用crosstab创建"地区"为行、"季度"为列的订单数频数交叉表；3) 返回一个字典 {"销售透视表": pivot_result, "订单频数表": cross_result}。',
            initialCode: `import pandas as pd

def create_sales_report(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '地区': ['华东', '华东', '华北', '华北', '华南', '华南'],
    '类别': ['电子', '服装', '电子', '服装', '电子', '服装'],
    '季度': ['Q1', 'Q2', 'Q1', 'Q1', 'Q2', 'Q2'],
    '销售额': [12000, 8500, 9800, 7200, 11000, 6800]
})
result = create_sales_report(df)
print("销售透视表:")
print(result['销售透视表'])
print("\\n订单频数表:")
print(result['订单频数表'])`,
            hints: [
              '透视表：pd.pivot_table(df, values="销售额", index="地区", columns="类别", aggfunc="sum", margins=True, fill_value=0)',
              '交叉表：pd.crosstab(df["地区"], df["季度"])'
            ],
            referenceAnswer: `import pandas as pd

def create_sales_report(df):
    pivot_result = pd.pivot_table(df, values='销售额', index='地区',
                                  columns='类别', aggfunc='sum',
                                  margins=True, fill_value=0)
    cross_result = pd.crosstab(df['地区'], df['季度'])
    return {'销售透视表': pivot_result, '订单频数表': cross_result}`,
            testCases: [
              { input: "df = pd.DataFrame({'地区': ['华东', '华东', '华北'], '类别': ['电子', '服装', '电子'], '季度': ['Q1', 'Q2', 'Q1'], '销售额': [100, 200, 300]}); result = create_sales_report(df); print(type(result['销售透视表']).__name__)", expectedOutput: 'DataFrame' },
              { input: "df = pd.DataFrame({'地区': ['华东', '华北', '华北'], '类别': ['电子', '电子', '服装'], '季度': ['Q1', 'Q1', 'Q2'], '销售额': [100, 200, 300]}); result = create_sales_report(df); print(result['订单频数表'].shape)", expectedOutput: '(2, 2)' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch2-5',
      moduleId: 'data-processing',
      title: '数据合并与重塑',
      order: 5,
      lessons: [
        {
          id: 'les2-5-1',
          chapterId: 'ch2-5',
          title: 'concat合并',
          type: 'both',
          content: `## concat合并

在数据分析中，数据经常分散在多个文件或表中。例如，每月的销售数据分别存储在不同CSV文件中，需要合并后才能进行年度分析。Pandas的\`pd.concat()\`函数可以沿指定轴将多个DataFrame拼接在一起。

### 基本用法

\`\`\`python
pd.concat([df1, df2, df3], axis=0)  # 按行拼接（默认）
pd.concat([df1, df2], axis=1)       # 按列拼接
\`\`\`

### 关键参数

**axis——拼接方向**
- \`axis=0\`（默认）：按行拼接，上下堆叠，类似SQL的UNION
- \`axis=1\`：按列拼接，左右并排

**join——列/行处理方式**
- \`join='outer'\`（默认）：取并集，缺失部分填NaN
- \`join='inner'\`：取交集，只保留共有的列/行

**ignore_index——索引处理**
- \`ignore_index=False\`（默认）：保留原始索引
- \`ignore_index=True\`：重新生成0,1,2,...的整数索引（推荐）

**keys——多级索引标识**
- \`keys=['Q1', 'Q2']\`：为每个输入添加层级标识，便于区分数据来源

### 常见业务场景

**场景1：合并多月数据**
将1月、2月、3月的销售数据合并为年度数据：
\`\`\`python
annual = pd.concat([df_jan, df_feb, df_mar], ignore_index=True)
\`\`\`

**场景2：合并不同特征**
将客户基本信息和客户消费信息合并：
\`\`\`python
customer_full = pd.concat([df_basic, df_consumption], axis=1)
\`\`\`

**场景3：合并不同列名的数据**
不同来源的数据列名可能不完全一致，concat会自动对齐列名。

### 注意事项

- 按行拼接时，列名相同的列会自动对齐
- 按列拼接时，行索引相同的行会自动对齐
- 使用\`verify_integrity=True\`可以检查是否有重复索引
- 大量数据拼接时，建议一次性concat而非循环追加`,
          codeExample: `import pandas as pd

# Q1和Q2销售数据
df_q1 = pd.DataFrame({
    '商品': ['笔记本电脑', '智能手机', '平板电脑'],
    '销售额': [120000, 98000, 65000],
    '订单数': [20, 35, 22]
})
df_q2 = pd.DataFrame({
    '商品': ['笔记本电脑', '智能手机', '智能手表'],
    '销售额': [135000, 105000, 48000],
    '订单数': [23, 38, 30]
})

print("Q1数据:")
print(df_q1)
print("\\nQ2数据:")
print(df_q2)

# 按行拼接（上下堆叠）
result_row = pd.concat([df_q1, df_q2], ignore_index=True)
print(f"\\n按行拼接:\\n{result_row}")

# 按行拼接 - 保留来源标识
result_keys = pd.concat([df_q1, df_q2], keys=['Q1', 'Q2'])
print(f"\\n带来源标识:\\n{result_keys}")

# 按行拼接 - join='inner'（只保留共有列）
df_extra = pd.DataFrame({
    '商品': ['无线耳机'],
    '销售额': [32000],
    '评分': [4.8]
})
result_inner = pd.concat([df_q1, df_extra], ignore_index=True, join='inner')
print(f"\\ninner拼接(共有列):\\n{result_inner}")

# 按列拼接
df_rating = pd.DataFrame({
    '评分': [4.8, 4.6, 4.5]
})
result_col = pd.concat([df_q1, df_rating], axis=1)
print(f"\\n按列拼接:\\n{result_col}")`,
          exercise: {
            id: 'ex2-5-1',
            lessonId: 'les2-5-1',
            description: '编写一个函数 `merge_quarterly_data(dfs, labels)`，接收一个DataFrame列表和对应的标签列表，将所有DataFrame按行拼接，添加"季度"列标识数据来源，重置索引，返回合并后的DataFrame。',
            initialCode: `import pandas as pd

def merge_quarterly_data(dfs, labels):
    # 请在此处编写代码
    pass

# 测试
df_q1 = pd.DataFrame({'商品': ['A', 'B'], '销售额': [100, 200]})
df_q2 = pd.DataFrame({'商品': ['A', 'C'], '销售额': [150, 300]})
df_q3 = pd.DataFrame({'商品': ['B', 'C'], '销售额': [250, 350]})
result = merge_quarterly_data([df_q1, df_q2, df_q3], ['Q1', 'Q2', 'Q3'])
print(result)`,
            hints: [
              '给每个DataFrame添加"季度"列：df["季度"] = label，然后pd.concat(dfs, ignore_index=True)',
              '遍历zip(dfs, labels)，对每个df添加季度列后再concat'
            ],
            referenceAnswer: `import pandas as pd

def merge_quarterly_data(dfs, labels):
    tagged_dfs = []
    for df, label in zip(dfs, labels):
        df = df.copy()
        df['季度'] = label
        tagged_dfs.append(df)
    return pd.concat(tagged_dfs, ignore_index=True)`,
            testCases: [
              { input: "df1 = pd.DataFrame({'商品': ['A'], '销售额': [100]}); df2 = pd.DataFrame({'商品': ['B'], '销售额': [200]}); result = merge_quarterly_data([df1, df2], ['Q1', 'Q2']); print(result['季度'].tolist())", expectedOutput: "['Q1', 'Q2']" },
              { input: "df1 = pd.DataFrame({'商品': ['A'], '销售额': [100]}); df2 = pd.DataFrame({'商品': ['B'], '销售额': [200]}); result = merge_quarterly_data([df1, df2], ['Q1', 'Q2']); print(result.shape[0])", expectedOutput: '2' }
            ]
          }
        },
        {
          id: 'les2-5-2',
          chapterId: 'ch2-5',
          title: 'merge连接',
          type: 'both',
          content: `## merge连接

当需要根据某些键列的值将两个DataFrame的行匹配连接时，就需要使用\`pd.merge()\`。merge类似于SQL的JOIN操作，是关系型数据处理的核心工具。

### 四种连接类型

**inner join（内连接）**
- 只保留两个表中键值都匹配的行
- 结果行数 ≤ 较小表的行数
- 适用于：只需要两表都有的数据

**left join（左连接）**
- 保留左表所有行，右表无匹配时填NaN
- 结果行数 = 左表行数
- 适用于：以左表为主，补充右表信息

**right join（右连接）**
- 保留右表所有行，左表无匹配时填NaN
- 与左连接对称

**outer join（外连接/全连接）**
- 保留两个表的所有行，无匹配时填NaN
- 结果行数 ≥ 较大表的行数
- 适用于：需要保留所有数据

### 关键参数

- \`left\` / \`right\`：要合并的左右DataFrame
- \`how\`：连接类型，\`'inner'\`（默认）、\`'left'\`、\`'right'\`、\`'outer'\`
- \`on\`：连接键（两表列名相同时）
- \`left_on\` / \`right_on\`：分别指定左右表的连接键（列名不同时）
- \`suffixes\`：重名列的后缀，默认\`('_x', '_y')\`
- \`indicator\`：添加\`_merge\`列标识行来源

### 一对多与多对多

- **一对一**：两个表的连接键都唯一
- **一对多**：一个表的键唯一，另一个不唯一（如一个客户多个订单）
- **多对多**：两个表的键都不唯一，会产生笛卡尔积

### 业务应用场景

- 订单表 + 客户表 → 带客户信息的订单
- 订单表 + 产品表 → 带产品详情的订单
- 学生表 + 成绩表 → 带成绩的学生信息
- 员工表 + 部门表 → 带部门名称的员工信息`,
          codeExample: `import pandas as pd

# 客户表
customers = pd.DataFrame({
    '客户ID': ['C001', 'C002', 'C003', 'C004'],
    '姓名': ['张三', '李四', '王五', '赵六'],
    '城市': ['北京', '上海', '广州', '深圳']
})

# 订单表
orders = pd.DataFrame({
    '订单号': ['O001', 'O002', 'O003', 'O004', 'O005'],
    '客户ID': ['C001', 'C002', 'C001', 'C003', 'C005'],
    '金额': [5999, 3999, 1299, 899, 2999],
    '商品': ['笔记本电脑', '智能手机', '智能手表', '无线耳机', '平板电脑']
})

print("客户表:")
print(customers)
print("\\n订单表:")
print(orders)

# 内连接 - 只有匹配的客户
inner = pd.merge(orders, customers, on='客户ID', how='inner')
print(f"\\n内连接:\\n{inner}")

# 左连接 - 保留所有订单
left = pd.merge(orders, customers, on='客户ID', how='left')
print(f"\\n左连接:\\n{left}")

# 右连接 - 保留所有客户
right = pd.merge(orders, customers, on='客户ID', how='right')
print(f"\\n右连接:\\n{right}")

# 外连接 - 保留所有数据
outer = pd.merge(orders, customers, on='客户ID', how='outer')
print(f"\\n外连接:\\n{outer}")

# 带indicator
with_indicator = pd.merge(orders, customers, on='客户ID', how='outer', indicator=True)
print(f"\\n带来源标识:\\n{with_indicator[['客户ID', '_merge']]}")

# 列名不同时
orders2 = orders.rename(columns={'客户ID': 'CID'})
diff_cols = pd.merge(orders2, customers, left_on='CID', right_on='客户ID')
print(f"\\n不同列名连接:\\n{diff_cols[['订单号', '姓名', '金额']]}")`,
          exercise: {
            id: 'ex2-5-2',
            lessonId: 'les2-5-2',
            description: '编写一个函数 `merge_order_info(orders, products, customers)`，将三个DataFrame合并为完整的订单信息表：1) 先将orders和products按"产品ID"进行左连接；2) 再将结果与customers按"客户ID"进行左连接；3) 只保留"订单号"、"客户姓名"、"产品名称"、"数量"、"单价"列；4) 添加"总价"列=数量×单价；5) 返回结果DataFrame。',
            initialCode: `import pandas as pd

def merge_order_info(orders, products, customers):
    # 请在此处编写代码
    pass

# 测试
orders = pd.DataFrame({
    '订单号': ['O001', 'O002', 'O003'],
    '客户ID': ['C001', 'C002', 'C001'],
    '产品ID': ['P001', 'P002', 'P001'],
    '数量': [2, 1, 1]
})
products = pd.DataFrame({
    '产品ID': ['P001', 'P002', 'P003'],
    '产品名称': ['笔记本电脑', '智能手机', '平板电脑'],
    '单价': [5999, 3999, 2999]
})
customers = pd.DataFrame({
    '客户ID': ['C001', 'C002', 'C003'],
    '客户姓名': ['张三', '李四', '王五']
})
print(merge_order_info(orders, products, customers))`,
            hints: [
              '先merge orders和products：pd.merge(orders, products, on="产品ID", how="left")',
              '再merge结果和customers：pd.merge(result, customers, on="客户ID", how="left")',
              '选择列后添加总价：df["总价"] = df["数量"] * df["单价"]'
            ],
            referenceAnswer: `import pandas as pd

def merge_order_info(orders, products, customers):
    merged = pd.merge(orders, products, on='产品ID', how='left')
    merged = pd.merge(merged, customers, on='客户ID', how='left')
    merged = merged[['订单号', '客户姓名', '产品名称', '数量', '单价']]
    merged['总价'] = merged['数量'] * merged['单价']
    return merged`,
            testCases: [
              { input: "orders = pd.DataFrame({'订单号': ['O01'], '客户ID': ['C01'], '产品ID': ['P01'], '数量': [2]}); products = pd.DataFrame({'产品ID': ['P01'], '产品名称': ['电脑'], '单价': [5000]}); customers = pd.DataFrame({'客户ID': ['C01'], '客户姓名': ['张三']}); result = merge_order_info(orders, products, customers); print(result['总价'].iloc[0])", expectedOutput: '10000' },
              { input: "orders = pd.DataFrame({'订单号': ['O01'], '客户ID': ['C01'], '产品ID': ['P01'], '数量': [3]}); products = pd.DataFrame({'产品ID': ['P01'], '产品名称': ['手机'], '单价': [3000]}); customers = pd.DataFrame({'客户ID': ['C01'], '客户姓名': ['李四']}); result = merge_order_info(orders, products, customers); print(result.columns.tolist())", expectedOutput: "['订单号', '客户姓名', '产品名称', '数量', '单价', '总价']" }
            ]
          }
        },
        {
          id: 'les2-5-3',
          chapterId: 'ch2-5',
          title: '数据重塑',
          type: 'both',
          content: `## 数据重塑

数据重塑是指改变数据的组织形式，在"宽格式"（wide format）和"长格式"（long format）之间转换。不同的分析和可视化工具对数据格式有不同的要求，掌握数据重塑是数据整理的关键技能。

### 宽格式 vs 长格式

**宽格式**：每个变量占一列，每行是一个观测对象
| 姓名 | 语文 | 数学 | 英语 |
|------|------|------|------|
| 张三 | 85   | 90   | 82   |

**长格式**：变量名和值分别占一列
| 姓名 | 科目 | 成绩 |
|------|------|------|
| 张三 | 语文 | 85   |
| 张三 | 数学 | 90   |
| 张三 | 英语 | 82   |

### melt——宽转长

\`pd.melt()\`将宽格式数据"融化"为长格式：

\`\`\`python
pd.melt(df, id_vars=['标识列'], value_vars=['值列1', '值列2'],
        var_name='变量名列名', value_name='值列名')
\`\`\`

- \`id_vars\`：保持不变的标识列
- \`value_vars\`：需要融化的列（省略则融化所有非id列）
- \`var_name\`：融化后变量列的名称
- \`value_name\`：融化后值列的名称

### pivot——长转宽

\`df.pivot()\`将长格式数据"旋转"为宽格式：

\`\`\`python
df.pivot(index='行索引列', columns='列名列', values='值列')
\`\`\`

注意：pivot要求index+columns组合唯一，否则会报错。如有重复，使用pivot_table。

### stack与unstack

- \`df.stack()\`：将列索引"堆叠"为行索引的最内层（宽→长）
- \`df.unstack()\`：将行索引的最内层"展开"为列索引（长→宽）

stack/unstack适用于多级索引（MultiIndex）的DataFrame。

### 何时使用

- **melt**：将多个月份/科目/指标列合并为一列，便于分组分析
- **pivot**：将某列的不同值展开为多列，便于对比展示
- **stack/unstack**：处理多级索引数据的层次变换
- **pivot_table**：需要聚合的长转宽操作

在数据可视化中，Seaborn等库通常需要长格式数据；而报表展示通常需要宽格式数据。`,
          codeExample: `import pandas as pd

# 宽格式 - 各门店月度销售额
wide_df = pd.DataFrame({
    '门店': ['北京店', '上海店', '广州店'],
    '1月': [120, 135, 98],
    '2月': [115, 142, 105],
    '3月': [128, 150, 112]
})
print("宽格式数据:")
print(wide_df)

# melt - 宽转长
long_df = pd.melt(wide_df, id_vars=['门店'],
                  value_vars=['1月', '2月', '3月'],
                  var_name='月份', value_name='销售额')
print(f"\\nmelt宽转长:\\n{long_df}")

# pivot - 长转宽
wide_back = long_df.pivot(index='门店', columns='月份', values='销售额')
print(f"\\npivot长转宽:\\n{wide_back}")

# 重置索引使门店变为普通列
wide_back_reset = wide_back.reset_index()
print(f"\\n重置索引后:\\n{wide_back_reset}")

# stack/unstack示例
multi_df = pd.DataFrame({
    '销售额': [120, 115, 135, 142, 98, 105],
    '利润': [24, 23, 27, 28, 20, 21]
}, index=pd.MultiIndex.from_tuples([
    ('北京店', '1月'), ('北京店', '2月'),
    ('上海店', '1月'), ('上海店', '2月'),
    ('广州店', '1月'), ('广州店', '2月')
], names=['门店', '月份']))
print(f"\\n多级索引DataFrame:\\n{multi_df}")

# unstack - 将月份展开为列
unstacked = multi_df.unstack(level='月份')
print(f"\\nunstack展开:\\n{unstacked}")

# stack - 将列堆叠回行
restacked = unstacked.stack()
print(f"\\nstack堆叠:\\n{restacked}")`,
          exercise: {
            id: 'ex2-5-3',
            lessonId: 'les2-5-3',
            description: '编写一个函数 `reshape_data(df)`，接收宽格式的销售数据DataFrame（第一列为标识列如"门店"，其余列为月份列），完成以下操作：1) 用melt将宽格式转为长格式，变量列名为"月份"，值列名为"销售额"；2) 对长格式数据按"门店"分组，计算每个门店的平均销售额；3) 返回长格式数据和分组统计结果的字典 {"长格式": long_df, "门店统计": stats_df}。',
            initialCode: `import pandas as pd

def reshape_data(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '门店': ['北京店', '上海店', '广州店'],
    '1月': [120, 135, 98],
    '2月': [115, 142, 105],
    '3月': [128, 150, 112]
})
result = reshape_data(df)
print("长格式:")
print(result['长格式'])
print("\\n门店统计:")
print(result['门店统计'])`,
            hints: [
              'melt：pd.melt(df, id_vars=[第一列], var_name="月份", value_name="销售额")',
              '第一列名可以用 df.columns[0] 获取，月份列可以用 df.columns[1:] 指定'
            ],
            referenceAnswer: `import pandas as pd

def reshape_data(df):
    id_col = df.columns[0]
    month_cols = df.columns[1:]
    long_df = pd.melt(df, id_vars=[id_col], value_vars=month_cols,
                      var_name='月份', value_name='销售额')
    stats_df = long_df.groupby(id_col, as_index=False)['销售额'].mean()
    stats_df.columns = [id_col, '平均销售额']
    return {'长格式': long_df, '门店统计': stats_df}`,
            testCases: [
              { input: "df = pd.DataFrame({'门店': ['北京店', '上海店'], '1月': [120, 135], '2月': [115, 142]}); result = reshape_data(df); print(result['长格式'].shape)", expectedOutput: '(4, 3)' },
              { input: "df = pd.DataFrame({'门店': ['北京店', '上海店'], '1月': [120, 135], '2月': [115, 142]}); result = reshape_data(df); print(result['门店统计']['平均销售额'].round(1).tolist())", expectedOutput: '[117.5, 138.5]' }
            ]
          }
        }
      ]
    }
  ]
};
