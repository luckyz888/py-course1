import type { Module } from '../../types';

export const module1: Module = {
  id: 'python-basics',
  title: 'Python数据分析基础回顾',
  description: '回顾Python编程基础，重点掌握数据分析相关的Python核心技能，包括数据结构操作、函数式编程、文件处理等，为后续数据分析课程做好衔接。',
  icon: '🐍',
  order: 1,
  chapters: [
    {
      id: 'ch1-1',
      moduleId: 'python-basics',
      title: '数据结构与操作',
      order: 1,
      lessons: [
        {
          id: 'les1-1-1',
          chapterId: 'ch1-1',
          title: '列表与字典的高级操作',
          type: 'both',
          content: `## 列表与字典的高级操作

在数据分析中，列表和字典是最基础也最常用的数据容器。本课将重点回顾它们的高级操作，这些技巧在数据清洗、转换和聚合中频繁使用。

### 列表推导式

列表推导式是Python中最优雅的特性之一，它可以用一行代码完成过滤和变换操作，在数据预处理中极为常用。

\`\`\`python
# 基本语法：[表达式 for 变量 in 可迭代对象 if 条件]
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

**常见数据分析场景：**
- 数据类型转换：\`[float(x) for x in string_list]\`
- 过滤缺失值：\`[x for x in data if x is not None]\`
- 提取字段：\`[item['name'] for item in records]\`

### 列表常用高阶操作

- \`sorted(lst, key=func, reverse=True)\`：自定义排序，key参数接收函数
- \`list(filter(func, lst))\`：过滤元素
- \`list(map(func, lst))\`：批量变换
- \`zip(lst1, lst2)\`：并行组合多个列表
- \`enumerate(lst)\`：获取索引与元素

### 字典高级操作

字典在数据分析中常用于存储和聚合数据，掌握以下操作至关重要：

- **字典推导式**：\`{k: v for k, v in items if condition}\`
- **get与默认值**：\`d.get(key, default)\` 避免KeyError
- **setdefault**：\`d.setdefault(key, []).append(value)\` 分组聚合利器
- **defaultdict**：\`from collections import defaultdict\` 自动初始化
- **合并字典**：\`{**d1, **d2}\` 或 \`d1 | d2\`（Python 3.9+）
- **Counter**：\`Counter(lst)\` 快速频率统计

### 嵌套数据结构

实际数据往往是嵌套的，如JSON解析后的字典列表。熟练操作嵌套结构是数据分析师的基本功。`,
          codeExample: `# 列表推导式：数据清洗场景
raw_prices = ["12.5", "N/A", "8.3", "", "15.0", "N/A"]
clean_prices = [float(p) for p in raw_prices if p not in ("N/A", "")]
print(f"清洗后价格: {clean_prices}")

# sorted + lambda：按多字段排序
students = [
    {"name": "张三", "score": 85, "age": 20},
    {"name": "李四", "score": 92, "age": 19},
    {"name": "王五", "score": 85, "age": 21}
]
ranked = sorted(students, key=lambda s: (-s["score"], s["age"]))
print(f"排名: {[s['name'] for s in ranked]}")

# defaultdict：分组聚合
from collections import defaultdict
orders = [("A", 100), ("B", 200), ("A", 150), ("C", 50), ("B", 300)]
groups = defaultdict(list)
for category, amount in orders:
    groups[category].append(amount)
summary = {k: sum(v) for k, v in groups.items()}
print(f"分组汇总: {summary}")

# Counter：频率统计
from collections import Counter
words = ["数据", "分析", "数据", "Python", "分析", "数据"]
freq = Counter(words)
print(f"词频: {freq.most_common(2)}")`,
          exercise: {
            id: 'ex1-1-1',
            lessonId: 'les1-1-1',
            description: '编写一个函数 `aggregate_sales(records)`，接收一个销售记录列表，每条记录为字典格式 {"category": 类别, "amount": 金额}。返回一个字典，键为类别，值为该类别的总金额，按金额从高到低排序。提示：可以使用 defaultdict 分组，再用 sorted 排序。',
            initialCode: `def aggregate_sales(records):
    # 请在此处编写代码
    pass

# 测试
data = [
    {"category": "食品", "amount": 120},
    {"category": "电器", "amount": 899},
    {"category": "食品", "amount": 65},
    {"category": "服装", "amount": 350},
    {"category": "电器", "amount": 1299},
    {"category": "服装", "amount": 280}
]
print(aggregate_sales(data))`,
            hints: [
              '使用 collections.defaultdict(list) 或 defaultdict(int) 按 category 分组累加 amount',
              '用字典推导式或 sorted 对结果按值降序排序：sorted(d.items(), key=lambda x: -x[1])',
              '最终用 dict() 将排序后的列表转回字典'
            ],
            referenceAnswer: `from collections import defaultdict

def aggregate_sales(records):
    groups = defaultdict(int)
    for record in records:
        groups[record["category"]] += record["amount"]
    sorted_items = sorted(groups.items(), key=lambda x: -x[1])
    return dict(sorted_items)`,
            testCases: [
              { input: 'aggregate_sales([{"category": "A", "amount": 10}, {"category": "B", "amount": 20}, {"category": "A", "amount": 30}])', expectedOutput: "{'A': 40, 'B': 20}" },
              { input: 'aggregate_sales([{"category": "X", "amount": 100}])', expectedOutput: "{'X': 100}" },
              { input: 'aggregate_sales([])', expectedOutput: '{}' }
            ]
          }
        },
        {
          id: 'les1-1-2',
          chapterId: 'ch1-1',
          title: '元组、集合与推导式',
          type: 'both',
          content: `## 元组、集合与推导式

元组和集合虽然在日常编程中使用频率低于列表和字典，但在数据分析场景中各有其独特价值。掌握它们的特性与操作，能让代码更简洁高效。

### 元组（tuple）

元组是不可变序列，一旦创建就不能修改。这个特性使它成为字典键、函数返回多值、数据记录的理想选择。

**核心特性：**
- 不可变：创建后不能增删改，因此可以作为字典的键
- 可哈希：可用于set和dict的键
- 轻量：比列表占用更少内存

**元组解包（Tuple Unpacking）：**

元组解包是数据分析中极为实用的技巧，尤其在遍历字典items、处理zip结果、函数多返回值时。

\`\`\`python
# 基本解包
name, age, score = ("张三", 20, 95)

# 扩展解包
first, *rest = [1, 2, 3, 4, 5]  # first=1, rest=[2,3,4,5]
head, *middle, tail = [1, 2, 3, 4, 5]  # head=1, middle=[2,3,4], tail=5

# 交换变量
a, b = b, a
\`\`\`

**命名元组（namedtuple）：** 为元组元素赋予字段名，提高可读性，是轻量级的数据记录方式。

### 集合（set）

集合是无序、不重复的元素集合，在数据去重和集合运算中非常有用。

**数据分析常用操作：**
- 去重：\`list(set(lst))\` 快速去重
- 交集：\`set1 & set2\` 找共同元素
- 并集：\`set1 | set2\` 合并去重
- 差集：\`set1 - set2\` 找独有元素
- 对称差集：\`set1 ^ set2\` 找不同元素

### 嵌套推导式

当处理多维数据或需要组合多个序列时，嵌套推导式可以替代多层循环，使代码更紧凑。

\`\`\`python
# 矩阵展平
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [x for row in matrix for x in row]

# 字典推导式嵌套
{f"{k}_{i}": v for k, vals in data.items() for i, v in enumerate(vals)}
\`\`\`

**注意：** 嵌套推导式超过两层时会降低可读性，此时应改用普通循环。`,
          codeExample: `# 元组解包：遍历字典
student_scores = {"张三": 85, "李四": 92, "王五": 78}
for name, score in student_scores.items():
    print(f"{name}: {score}分")

# 扩展解包
record = ("2024-01", "北京", 25.3, 60, "晴")
month, city, *metrics, weather = record
print(f"月份:{month}, 城市:{city}, 天气:{weather}, 指标:{metrics}")

# 集合运算：数据对比
online_users = {"user1", "user2", "user3", "user5"}
paid_users = {"user2", "user4", "user5"}
print(f"付费在线用户: {online_users & paid_users}")
print(f"仅在线未付费: {online_users - paid_users}")
print(f"所有相关用户: {online_users | paid_users}")

# 集合去重
data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
unique = sorted(set(data))
print(f"去重排序: {unique}")

# 嵌套推导式：矩阵展平
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for row in matrix for x in row]
print(f"展平: {flat}")

# 嵌套推导式：笛卡尔积
colors = ["红", "蓝"]
sizes = ["S", "M", "L"]
combos = [(c, s) for c in colors for s in sizes]
print(f"组合: {combos}")`,
          exercise: {
            id: 'ex1-1-2',
            lessonId: 'les1-1-2',
            description: '编写一个函数 `analyze_tags(tag_lists)`，接收一个列表，其中每个元素是一个标签列表（如 [["Python","数据"],["Python","机器学习"],["数据","可视化"]]）。返回一个字典，包含：1) "all_tags"：所有出现过的标签（去重，按字母排序）；2) "common_tags"：所有列表中都出现的标签（交集）；3) "unique_counts"：每个标签出现在多少个列表中。',
            initialCode: `def analyze_tags(tag_lists):
    # 请在此处编写代码
    pass

# 测试
data = [
    ["Python", "数据", "分析"],
    ["Python", "机器学习", "数据"],
    ["数据", "可视化", "Python"]
]
print(analyze_tags(data))`,
            hints: [
              '用 set 的并集 | 获取所有标签，交集 & 获取公共标签',
              '统计每个标签出现在几个列表中：对每个标签，用 sum(1 for lst in tag_lists if tag in lst) 计数',
              '先将每个子列表转为 set，方便做集合运算'
            ],
            referenceAnswer: `def analyze_tags(tag_lists):
    sets = [set(lst) for lst in tag_lists]
    all_tags = sorted(set.union(*sets)) if sets else []
    common_tags = sorted(set.intersection(*sets)) if sets else []
    unique_counts = {}
    for tag in all_tags:
        unique_counts[tag] = sum(1 for s in sets if tag in s)
    return {
        "all_tags": all_tags,
        "common_tags": common_tags,
        "unique_counts": unique_counts
    }`,
            testCases: [
              { input: 'analyze_tags([["A","B"],["B","C"],["A","B","C"]])', expectedOutput: "{'all_tags': ['A', 'B', 'C'], 'common_tags': ['B'], 'unique_counts': {'A': 2, 'B': 3, 'C': 2}}" },
              { input: 'analyze_tags([["X"],["X"]])', expectedOutput: "{'all_tags': ['X'], 'common_tags': ['X'], 'unique_counts': {'X': 2}}" }
            ]
          }
        },
        {
          id: 'les1-1-3',
          chapterId: 'ch1-1',
          title: '字符串处理与正则表达式',
          type: 'both',
          content: `## 字符串处理与正则表达式

数据清洗是数据分析中耗时最多的环节，而字符串处理是数据清洗的核心技能。本课将系统回顾字符串操作和正则表达式，帮助你高效处理脏数据。

### 字符串常用方法

在数据清洗中，以下字符串方法使用频率最高：

| 方法 | 用途 | 示例 |
|------|------|------|
| \`strip()\` | 去除首尾空白 | \`"  hello  ".strip()\` → \`"hello"\` |
| \`replace()\` | 替换子串 | \`"2024/01/15".replace("/", "-")\` |
| \`split()\` | 分割字符串 | \`"a,b,c".split(",")\` |
| \`join()\` | 连接字符串 | \`",".join(["a","b"])\` |
| \`upper()/lower()\` | 大小写转换 | \`"Hello".lower()\` → \`"hello"\` |
| \`startswith()/endswith()\` | 前后缀判断 | \`"test.py".endswith(".py")\` |
| \`isdigit()/isalpha()\` | 类型判断 | \`"123".isdigit()\` → \`True\` |
| \`zfill()\` | 补零 | \`"5".zfill(3)\` → \`"005"\` |

### f-string 格式化

f-string 是 Python 3.6+ 引入的格式化方式，简洁高效：

\`\`\`python
name, score, avg = "张三", 95, 87.656
print(f"{name}成绩: {score}, 均分: {avg:.2f}")
# 张三成绩: 95, 均分: 87.66
\`\`\`

### 正则表达式（re模块）

正则表达式是文本处理的终极武器，在数据提取和清洗中不可替代。

**常用函数：**
- \`re.search(pattern, string)\`：搜索第一个匹配
- \`re.findall(pattern, string)\`：找出所有匹配
- \`re.sub(pattern, repl, string)\`：替换匹配
- \`re.match(pattern, string)\`：从开头匹配

**常用模式：**
- \`\\d\` 数字，\`\\w\` 字母数字下划线，\`\\s\` 空白
- \`+\` 一次或多次，\`*\` 零次或多次，\`?\` 零次或一次
- \`{n,m}\` n到m次，\`[]\` 字符集，\`()\` 分组

**编译正则：** 如果同一个模式需要多次使用，先用 \`re.compile()\` 编译可提升性能。`,
          codeExample: `import re

# 字符串清洗：处理脏数据
raw = "  张三 , 25岁 , 北京 , 85.5分  "
fields = [f.strip() for f in raw.split(",")]
print(f"清洗字段: {fields}")

# 提取数字
text = "订单A325金额1280.50元，优惠-120.00元"
numbers = re.findall(r"-?\\d+\\.?\\d*", text)
print(f"提取数字: {numbers}")

# 正则替换：统一日期格式
dates = ["2024/01/15", "2024-1-5", "2024.12.3"]
for d in dates:
    standardized = re.sub(r"[/.]", "-", d)
    print(f"{d} → {standardized}")

# 正则提取：解析日志
log = '2024-01-15 10:23:45 ERROR [auth] Login failed for user "admin"'
pattern = r'(\\d{4}-\\d{2}-\\d{2}).*?(\\w+)\\s+\\[(\\w+)\\]'
match = re.search(pattern, log)
if match:
    print(f"日期: {match.group(1)}, 级别: {match.group(2)}, 模块: {match.group(3)}")

# f-string 格式化
for name, score in [("张三", 85.567), ("李四", 92.1)]:
    print(f"{name:>6}: {score:>6.2f}分")`,
          exercise: {
            id: 'ex1-1-3',
            lessonId: 'les1-1-3',
            description: '编写一个函数 `extract_contacts(text)`，从一段文本中提取所有手机号和邮箱地址。返回一个字典 {"phones": 手机号列表, "emails": 邮箱列表}。手机号格式：1开头11位数字；邮箱格式：包含@和域名。文本中可能有各种干扰字符。',
            initialCode: `import re

def extract_contacts(text):
    # 请在此处编写代码
    pass

# 测试
sample = "联系方式：手机13812345678，邮箱test@example.com，备用15987654321，work@company.cn"
print(extract_contacts(sample))`,
            hints: [
              '手机号正则：r"1[3-9]\\d{9}"，匹配1开头、第二位3-9、共11位数字',
              '邮箱正则：r"[\\w.+-]+@[\\w-]+\\.[\\w.]+"，匹配用户名@域名格式',
              '使用 re.findall() 提取所有匹配结果'
            ],
            referenceAnswer: `import re

def extract_contacts(text):
    phones = re.findall(r'1[3-9]\\d{9}', text)
    emails = re.findall(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+', text)
    return {"phones": phones, "emails": emails}`,
            testCases: [
              { input: 'extract_contacts("手机13812345678，邮箱test@example.com，备用15987654321")', expectedOutput: "{'phones': ['13812345678', '15987654321'], 'emails': ['test@example.com']}" },
              { input: 'extract_contacts("无联系方式")', expectedOutput: "{'phones': [], 'emails': []}" },
              { input: 'extract_contacts("call 18600001111 and mail admin@site.org")', expectedOutput: "{'phones': ['18600001111'], 'emails': ['admin@site.org']}" }
            ]
          }
        }
      ]
    },
    {
      id: 'ch1-2',
      moduleId: 'python-basics',
      title: '函数与模块化编程',
      order: 2,
      lessons: [
        {
          id: 'les1-2-1',
          chapterId: 'ch1-2',
          title: '函数定义与高阶函数',
          type: 'both',
          content: `## 函数定义与高阶函数

函数是代码复用的基本单位，而高阶函数是函数式编程的核心，在数据处理中能极大简化代码。本课重点掌握函数式编程技巧在数据分析中的应用。

### 函数快速回顾

\`\`\`python
def function_name(params):
    """文档字符串"""
    # 函数体
    return result
\`\`\`

**参数类型速览：**
- 位置参数、默认参数、关键字参数
- \`*args\`：接收多余位置参数（元组）
- \`**kwargs\`：接收多余关键字参数（字典）

### lambda 表达式

lambda 是匿名函数，语法为 \`lambda 参数: 表达式\`，常用于需要简单函数的场合，尤其是排序和数据变换的 key 参数。

\`\`\`python
# 等价关系
f = lambda x, y: x + y
# 等同于
def f(x, y): return x + y
\`\`\`

### 高阶函数

高阶函数是接受函数作为参数或返回函数的函数，是函数式编程的基石。

**map(func, iterable)**：对每个元素应用函数
\`\`\`python
list(map(str, [1, 2, 3]))  # ['1', '2', '3']
\`\`\`

**filter(func, iterable)**：过滤元素
\`\`\`python
list(filter(lambda x: x > 0, [-1, 2, -3, 4]))  # [2, 4]
\`\`\`

**reduce(func, iterable)**：累积计算
\`\`\`python
from functools import reduce
reduce(lambda a, b: a + b, [1, 2, 3, 4])  # 10
\`\`\`

**sorted(iterable, key=func)**：自定义排序
\`\`\`python
sorted(["banana", "apple", "cherry"], key=len)  # 按长度排序
\`\`\`

### 列表推导式 vs 高阶函数

在Python中，列表推导式通常比 map/filter 更Pythonic且更易读，但理解高阶函数有助于阅读他人代码和使用pandas等库。`,
          codeExample: `from functools import reduce

# lambda + sorted：多条件排序
data = [
    {"city": "北京", "temp": 32, "humidity": 65},
    {"city": "上海", "temp": 35, "humidity": 80},
    {"city": "广州", "temp": 35, "humidity": 75}
]
by_temp = sorted(data, key=lambda x: (-x["temp"], x["humidity"]))
print(f"按温度降序、湿度升序: {[d['city'] for d in by_temp]}")

# map：批量数据转换
prices = ["128.5", "99.9", "256.0", "75.5"]
float_prices = list(map(float, prices))
print(f"价格转换: {float_prices}")

# filter：数据过滤
scores = [45, 78, 92, 56, 88, 33, 95, 61]
passed = list(filter(lambda x: x >= 60, scores))
print(f"及格成绩: {passed}")

# reduce：累积计算
monthly_sales = [1200, 1500, 980, 2100, 1800]
total = reduce(lambda a, b: a + b, monthly_sales)
max_sale = reduce(lambda a, b: a if a > b else b, monthly_sales)
print(f"总额: {total}, 最高: {max_sale}")

# 实际场景：数据管道式处理
raw = ["  张三,85  ", "李四,92", "  王五,78  "]
cleaned = list(map(str.strip, raw))
parsed = list(map(lambda s: s.split(","), cleaned))
names = [p[0] for p in parsed]
scores = [int(p[1]) for p in parsed]
print(f"姓名: {names}, 成绩: {scores}")`,
          exercise: {
            id: 'ex1-2-1',
            lessonId: 'les1-2-1',
            description: '编写一个函数 `process_data(records)`，接收一个字典列表，每个字典包含 "name"（字符串）、"score"（可能是字符串或数字）、"absent"（布尔值，是否缺考）。返回及格（score>=60）且未缺考的学生姓名列表，按成绩降序排列。要求使用 filter 和 sorted 配合 lambda 完成。',
            initialCode: `def process_data(records):
    # 请在此处编写代码
    pass

# 测试
data = [
    {"name": "张三", "score": "85", "absent": False},
    {"name": "李四", "score": 45, "absent": False},
    {"name": "王五", "score": 92, "absent": False},
    {"name": "赵六", "score": 78, "absent": True},
    {"name": "钱七", "score": "55", "absent": False}
]
print(process_data(data))`,
            hints: [
              '先用 filter 过滤掉 absent 为 True 的记录，再过滤 score < 60 的',
              'score 可能是字符串，需要用 int() 或 float() 转换后再比较',
              '用 sorted + lambda 按 score 降序排序，最后提取 name 列表'
            ],
            referenceAnswer: `def process_data(records):
    valid = filter(lambda r: not r["absent"], records)
    passed = filter(lambda r: int(r["score"]) >= 60, valid)
    sorted_list = sorted(passed, key=lambda r: -int(r["score"]))
    return [r["name"] for r in sorted_list]`,
            testCases: [
              { input: 'process_data([{"name": "A", "score": 90, "absent": False}, {"name": "B", "score": 50, "absent": False}, {"name": "C", "score": 80, "absent": True}])', expectedOutput: "['A']" },
              { input: 'process_data([{"name": "X", "score": "70", "absent": False}, {"name": "Y", "score": "95", "absent": False}])', expectedOutput: "['Y', 'X']" }
            ]
          }
        },
        {
          id: 'les1-2-2',
          chapterId: 'ch1-2',
          title: '模块与包管理',
          type: 'theory',
          content: `## 模块与包管理

Python的强大很大程度上来源于其丰富的第三方库生态。作为数据分析从业者，理解模块、包和虚拟环境的管理是必备技能。

### 模块导入方式

\`\`\`python
import numpy                           # 导入整个模块
import numpy as np                     # 使用别名（社区约定）
from pandas import DataFrame           # 导入特定类
from pandas import read_csv, read_excel # 导入多个
from collections import Counter, defaultdict
\`\`\`

**导入最佳实践：**
- 标准库 → 第三方库 → 本地模块，按此顺序分组导入
- 避免使用 \`from module import *\`，会污染命名空间
- 遵循社区约定的别名：\`numpy as np\`、\`pandas as pd\`、\`matplotlib.pyplot as plt\`

### pip 包管理器

pip 是 Python 的包管理工具，用于安装和管理第三方库：

\`\`\`bash
pip install pandas              # 安装最新版
pip install numpy==1.24.0       # 安装指定版本
pip install -r requirements.txt # 从文件批量安装
pip list                        # 查看已安装包
pip show pandas                 # 查看包详情
pip uninstall pandas            # 卸载包
\`\`\`

**requirements.txt：** 项目依赖清单，每行一个包名（可指定版本），确保环境可复现。

### 虚拟环境

虚拟环境为不同项目创建独立的Python运行环境，避免包版本冲突。

\`\`\`bash
# venv（Python内置）
python -m venv myenv           # 创建虚拟环境
myenv\\Scripts\\activate        # Windows激活
source myenv/bin/activate      # Linux/Mac激活
deactivate                     # 退出虚拟环境
\`\`\`

**为什么需要虚拟环境？**
- 项目A需要pandas 1.x，项目B需要pandas 2.x
- 避免全局环境被污染
- 方便导出项目依赖

### 数据分析常用库一览

| 库 | 用途 | 导入约定 |
|---|---|---|
| NumPy | 数值计算 | \`import numpy as np\` |
| Pandas | 数据分析 | \`import pandas as pd\` |
| Matplotlib | 基础绑图 | \`import matplotlib.pyplot as plt\` |
| Seaborn | 统计可视化 | \`import seaborn as sns\` |
| Scikit-learn | 机器学习 | \`from sklearn import ...\` |
| SciPy | 科学计算 | \`from scipy import stats\` |

### \\_\\_name\\_\\_ 与 \\_\\_main\\_\\_

当Python文件被直接运行时，\`__name__\` 变量值为 \`"__main__"\`；被导入时则为模块名。这常用于编写模块的测试代码：

\`\`\`python
if __name__ == "__main__":
    # 仅在直接运行时执行
    main()
\`\`\``,
          codeExample: `# 标准的导入风格
import os
import json
from collections import Counter, defaultdict

import numpy as np
import pandas as pd

# 查看模块信息
print(f"NumPy版本: {np.__version__}")
print(f"Pandas版本: {pd.__version__}")

# 使用 os 模块处理路径
data_dir = "data"
if not os.path.exists(data_dir):
    os.makedirs(data_dir)
print(f"数据目录: {os.path.abspath(data_dir)}")

# 使用 json 模块
config = {"data_source": "csv", "encoding": "utf-8", "max_rows": 10000}
json_str = json.dumps(config, ensure_ascii=False, indent=2)
print(f"配置:\\n{json_str}")

# 模拟 requirements.txt 内容
requirements = """
numpy>=1.24.0
pandas>=2.0.0
matplotlib>=3.7.0
seaborn>=0.12.0
scikit-learn>=1.3.0
"""
print(f"项目依赖:{requirements}")`,
          exercise: {
            id: 'ex1-2-2',
            lessonId: 'les1-2-2',
            description: '编写一个函数 `check_environment()`，检查当前Python环境中是否安装了数据分析常用库（numpy、pandas、matplotlib）。返回一个字典，键为库名，值为已安装的版本号字符串或"未安装"。',
            initialCode: `def check_environment():
    # 请在此处编写代码
    pass

# 测试
print(check_environment())`,
            hints: [
              '使用 try-except 包裹 import 语句，成功则读取 __version__ 属性',
              '对每个库分别尝试 import，用 importlib 或直接 try import'
            ],
            referenceAnswer: `def check_environment():
    result = {}
    for lib in ["numpy", "pandas", "matplotlib"]:
        try:
            module = __import__(lib)
            result[lib] = module.__version__
        except ImportError:
            result[lib] = "未安装"
    return result`,
            testCases: [
              { input: 'result = check_environment(); isinstance(result, dict) and "numpy" in result', expectedOutput: 'True' },
              { input: 'result = check_environment(); all(lib in result for lib in ["numpy", "pandas", "matplotlib"])', expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les1-2-3',
          chapterId: 'ch1-2',
          title: '面向对象编程基础',
          type: 'theory',
          content: `## 面向对象编程基础

虽然数据分析以过程式和函数式编程为主，但理解面向对象编程（OOP）对使用pandas、numpy等库至关重要——因为它们的核心对象（DataFrame、ndarray）都是类的实例。

### 类与对象

类是对象的蓝图，定义了属性（数据）和方法（行为）。对象是类的具体实例。

\`\`\`python
class ClassName:
    """类的文档字符串"""
    def __init__(self, param):  # 构造方法
        self.attr = param       # 实例属性

    def method(self):           # 实例方法
        return self.attr
\`\`\`

### 核心概念

**\\_\\_init\\_\\_ 方法**：构造方法，创建对象时自动调用，用于初始化属性。

**self**：指向实例本身的引用，类似其他语言的 this。在方法中通过 self 访问实例属性和其他方法。

**实例属性 vs 类属性**：
- 实例属性：每个对象独有，在 \`__init__\` 中通过 \`self.xxx\` 定义
- 类属性：所有实例共享，直接在类体中定义

**实例方法**：第一个参数为 self，可访问和修改实例属性。

### 理解 pandas 对象

pandas 的核心对象都是类的实例，理解这一点有助于更好地使用它们：

\`\`\`python
import pandas as pd

df = pd.DataFrame({"A": [1, 2, 3]})
# df 是 DataFrame 类的实例
# df.columns 是属性
# df.head() 是方法
# df.describe() 是方法
\`\`\`

当你在pandas中调用 \`df.head()\`、\`df.describe()\` 时，你实际上是在调用 DataFrame 类的实例方法。理解这一点，就能更好地查阅文档和理解API设计。

### 继承简介

继承允许创建一个新类，复用已有类的属性和方法：

\`\`\`python
class ChildClass(ParentClass):
    def __init__(self, param):
        super().__init__(param)  # 调用父类构造方法
\`\`\`

pandas 的 Series 和 DataFrame 都继承自NDFrame类，共享许多方法（如 head、tail、describe等），这就是继承的体现。

### 魔术方法

以双下划线包围的方法，如 \`__init__\`、\`__repr__\`、\`__len__\`，定义了对象的特殊行为。例如 \`__len__\` 使得 \`len(obj)\` 可用，\`__getitem__\` 使得 \`obj[key]\` 可用。`,
          codeExample: `# 定义一个数据分析结果类
class AnalysisResult:
    """存储数据分析结果的类"""
    description = "数据分析结果"  # 类属性，所有实例共享

    def __init__(self, name, data):
        self.name = name          # 实例属性
        self.data = data          # 实例属性
        self._computed = {}       # 私有属性（约定用_前缀）

    def mean(self):
        """计算均值"""
        if "mean" not in self._computed:
            self._computed["mean"] = sum(self.data) / len(self.data)
        return self._computed["mean"]

    def std(self):
        """计算标准差"""
        m = self.mean()
        variance = sum((x - m) ** 2 for x in self.data) / len(self.data)
        return variance ** 0.5

    def summary(self):
        """返回摘要信息"""
        return {
            "name": self.name,
            "count": len(self.data),
            "mean": round(self.mean(), 2),
            "std": round(self.std(), 2),
            "min": min(self.data),
            "max": max(self.data)
        }

    def __repr__(self):
        return f"AnalysisResult('{self.name}', n={len(self.data)})"

    def __len__(self):
        return len(self.data)


# 使用类
result = AnalysisResult("考试成绩", [85, 92, 78, 95, 88, 76, 90, 83])
print(result)                          # __repr__
print(f"数据量: {len(result)}")         # __len__
print(f"均值: {result.mean():.2f}")
print(f"标准差: {result.std():.2f}")
print(f"摘要: {result.summary()}")`,
          exercise: {
            id: 'ex1-2-3',
            lessonId: 'les1-2-3',
            description: '编写一个类 \`DataTransformer\`，用于数据变换。要求：1) \`__init__(self, data)\` 接收一个数字列表；2) \`normalize(self)\` 方法返回归一化后的列表（每个值减去最小值后除以极差，即 (x-min)/(max-min)）；3) \`z_score(self)\` 方法返回标准化后的列表（每个值减去均值后除以标准差）；4) \`__repr__self)\` 返回 "DataTransformer(n=数据量)" 格式。',
            initialCode: `class DataTransformer:
    # 请在此处编写代码
    pass

# 测试
dt = DataTransformer([10, 20, 30, 40, 50])
print(dt)
print(f"归一化: {[round(x, 2) for x in dt.normalize()]}")
print(f"标准化: {[round(x, 2) for x in dt.z_score()]}")`,
            hints: [
              '归一化：(x - min) / (max - min)，极差 = max - min，注意极差为0时返回全0',
              '标准化：(x - mean) / std，std = sqrt(sum((x-mean)**2) / n)',
              '__repr__ 方法返回 f"DataTransformer(n={len(self.data)})"'
            ],
            referenceAnswer: `class DataTransformer:
    def __init__(self, data):
        self.data = data

    def normalize(self):
        min_val = min(self.data)
        max_val = max(self.data)
        range_val = max_val - min_val
        if range_val == 0:
            return [0.0] * len(self.data)
        return [(x - min_val) / range_val for x in self.data]

    def z_score(self):
        mean = sum(self.data) / len(self.data)
        std = (sum((x - mean) ** 2 for x in self.data) / len(self.data)) ** 0.5
        if std == 0:
            return [0.0] * len(self.data)
        return [(x - mean) / std for x in self.data]

    def __repr__(self):
        return f"DataTransformer(n={len(self.data)})"`,
            testCases: [
              { input: 'str(DataTransformer([1,2,3]))', expectedOutput: 'DataTransformer(n=3)' },
              { input: 'DataTransformer([10, 20, 30]).normalize()', expectedOutput: '[0.0, 0.5, 1.0]' },
              { input: 'DataTransformer([0, 0, 0]).normalize()', expectedOutput: '[0.0, 0.0, 0.0]' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch1-3',
      moduleId: 'python-basics',
      title: '文件处理与数据IO',
      order: 3,
      lessons: [
        {
          id: 'les1-3-1',
          chapterId: 'ch1-3',
          title: '文件读写操作',
          type: 'both',
          content: `## 文件读写操作

数据分析的第一步通常是读取数据，最后一步可能是保存结果。本课将回顾Python原生文件操作，包括文本文件、CSV和JSON的读写，为后续使用pandas做铺垫。

### 文件打开与 with 语句

\`\`\`python
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
\`\`\`

**with 语句的优势：** 自动管理资源，确保文件在使用后正确关闭，即使发生异常也不会遗漏。

**打开模式：**
- \`'r'\`：只读（默认），文件不存在则报错
- \`'w'\`：写入，覆盖已有内容
- \`'a'\`：追加，在文件末尾添加
- \`'rb'/'wb'\`：二进制读写

### 读取方法

- \`f.read()\`：一次性读取全部内容
- \`f.readline()\`：读取一行
- \`f.readlines()\`：读取所有行，返回列表
- \`for line in f:\`：逐行迭代（内存友好，推荐处理大文件）

### CSV 文件处理

CSV是数据分析最常见的文件格式。Python标准库 \`csv\` 模块提供读写支持：

\`\`\`python
import csv

# 读取
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)  # 每行为字典
    for row in reader:
        print(row['column_name'])

# 写入
with open('output.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'score'])
    writer.writeheader()
    writer.writerow({'name': '张三', 'score': 85})
\`\`\`

### JSON 文件处理

JSON是Web API和配置文件的标准格式，也是NoSQL数据库的存储格式：

\`\`\`python
import json

# 读取
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 写入
with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
\`\`\`

**json.dumps() vs json.dump()：** \`dumps\` 返回字符串，\`dump\` 直接写入文件。\`loads\` 和 \`load\` 同理。

### 路径处理

推荐使用 \`pathlib.Path\` 替代 \`os.path\`，API更现代：

\`\`\`python
from pathlib import Path
p = Path('data') / 'raw' / 'sales.csv'
p.exists()  # 是否存在
p.read_text(encoding='utf-8')  # 读取文本
\`\`\``,
          codeExample: `import csv
import json
from pathlib import Path

# === CSV 读写 ===
# 写入CSV
sales_data = [
    {"product": "笔记本", "price": 5999, "quantity": 120},
    {"product": "鼠标", "price": 89, "quantity": 450},
    {"product": "键盘", "price": 299, "quantity": 230}
]
with open('sales.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=sales_data[0].keys())
    writer.writeheader()
    writer.writerows(sales_data)

# 读取CSV并计算
with open('sales.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    total_revenue = 0
    for row in reader:
        revenue = float(row['price']) * int(row['quantity'])
        total_revenue += revenue
        print(f"{row['product']}: ¥{revenue:,.0f}")
print(f"总营收: ¥{total_revenue:,.0f}")

# === JSON 读写 ===
config = {
    "data_source": "sales.csv",
    "columns": ["product", "price", "quantity"],
    "filters": {"min_price": 50}
}
with open('config.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

with open('config.json', 'r', encoding='utf-8') as f:
    loaded = json.load(f)
print(f"配置: {loaded['data_source']}")

# === pathlib 路径操作 ===
p = Path('sales.csv')
print(f"文件名: {p.name}, 后缀: {p.suffix}, 存在: {p.exists()}")`,
          exercise: {
            id: 'ex1-3-1',
            lessonId: 'les1-3-1',
            description: '编写一个函数 `csv_to_json(csv_filename, json_filename)`，读取CSV文件并将其转换为JSON文件。CSV第一行为表头，后续行为数据。JSON格式为对象列表，每个对象的键为表头。函数返回写入的记录数。',
            initialCode: `import csv
import json

def csv_to_json(csv_filename, json_filename):
    # 请在此处编写代码
    pass

# 测试（先创建测试CSV文件）
with open('test_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age", "city"])
    writer.writerow(["张三", "25", "北京"])
    writer.writerow(["李四", "30", "上海"])

count = csv_to_json('test_data.csv', 'test_data.json')
print(f"转换了 {count} 条记录")

with open('test_data.json', 'r', encoding='utf-8') as f:
    print(json.load(f))`,
            hints: [
              '使用 csv.DictReader 读取CSV，每行自动变为字典',
              '将所有行收集到列表中，用 json.dump 写入JSON文件',
              '返回 len(records) 即为记录数'
            ],
            referenceAnswer: `import csv
import json

def csv_to_json(csv_filename, json_filename):
    records = []
    with open(csv_filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)
    with open(json_filename, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    return len(records)`,
            testCases: [
              { input: 'import csv; f=open("t.csv","w",newline="",encoding="utf-8"); w=csv.writer(f); w.writerow(["a","b"]); w.writerow(["1","2"]); w.writerow(["3","4"]); f.close(); csv_to_json("t.csv","t.json")', expectedOutput: '2' },
              { input: 'import json; json.load(open("t.json","r",encoding="utf-8"))', expectedOutput: "[{'a': '1', 'b': '2'}, {'a': '3', 'b': '4'}]" }
            ]
          }
        },
        {
          id: 'les1-3-2',
          chapterId: 'ch1-3',
          title: '数据格式与编码',
          type: 'theory',
          content: `## 数据格式与编码

在实际数据分析工作中，数据来源多样、格式各异、编码不统一是常见的挑战。理解数据格式和编码原理，能帮助你快速定位和解决数据读取问题。

### 字符编码

计算机只认识0和1，字符编码是将字符映射为数字的规则。

**常见编码：**
- **ASCII**：128个字符，仅英文，1字节
- **UTF-8**：Unicode的实现方式，1-4字节变长，兼容ASCII，**互联网标准编码**
- **GBK/GB2312**：中文编码，2字节，中文Windows默认
- **ISO-8859-1**：西欧语言编码

**编码问题排查：** 读取文件出现乱码时，通常是编码不匹配。解决方法：

\`\`\`python
# 尝试不同编码
for encoding in ['utf-8', 'gbk', 'gb2312', 'latin1']:
    try:
        with open('data.csv', 'r', encoding=encoding) as f:
            content = f.read()
        print(f"成功: {encoding}")
        break
    except UnicodeDecodeError:
        continue
\`\`\`

**BOM（Byte Order Mark）：** UTF-8 with BOM 在文件开头有3个特殊字节 \`\\xef\\xbb\\xbf\`，可能导致解析问题。使用 \`encoding='utf-8-sig'\` 可自动处理。

### CSV 格式详解

CSV（Comma-Separated Values）是最通用的表格数据交换格式。

**常见变体：**
- 分隔符：逗号（标准）、制表符（TSV）、分号（欧洲常用）
- 引号：双引号包裹含特殊字符的字段
- 换行符：Windows用 \`\\r\\n\`，Linux用 \`\\n\`
- 表头：第一行可能是表头，也可能不是

**CSV的局限性：**
- 不支持多Sheet
- 不存储数据类型（所有值都是字符串）
- 大文件性能较差

### JSON 格式详解

JSON（JavaScript Object Notation）是轻量级的数据交换格式。

**数据类型映射：**

| JSON | Python |
|------|--------|
| object | dict |
| array | list |
| string | str |
| number (int) | int |
| number (float) | float |
| true/false | True/False |
| null | None |

**JSON vs CSV：**
- JSON支持嵌套结构，CSV是扁平表格
- JSON保留数据类型，CSV全部为字符串
- JSON适合API和配置，CSV适合表格数据
- JSON文件通常比CSV大

### Excel 格式

Excel（.xlsx）是商业环境中最常见的表格格式：
- 支持多Sheet、公式、格式
- Python读取需要 \`openpyxl\` 库
- 数据分析中通常先转为CSV再处理

### 数据格式选择建议

| 场景 | 推荐格式 |
|------|----------|
| 表格数据存储与交换 | CSV |
| API数据与配置 | JSON |
| 需要保留格式和公式 | Excel |
| 大规模数值数据 | NumPy二进制(.npy/.npz) |
| 长期存档 | Parquet/Feather |`,
          codeExample: `# 编码问题演示与解决
text = "数据分析：Python编程"

# 编码与解码
encoded_utf8 = text.encode('utf-8')
encoded_gbk = text.encode('gbk')
print(f"UTF-8编码: {encoded_utf8}")
print(f"GBK编码: {encoded_gbk}")

# 解码
decoded = encoded_utf8.decode('utf-8')
print(f"解码: {decoded}")

# 常见编码错误处理
try:
    encoded_gbk.decode('utf-8')
except UnicodeDecodeError as e:
    print(f"编码错误: {e}")

# 使用 errors 参数处理
safe_decode = encoded_gbk.decode('utf-8', errors='replace')
print(f"安全解码: {safe_decode}")

# CSV不同分隔符处理
import csv
tsv_data = "姓名\\t年龄\\t城市\\n张三\\t25\\t北京\\n李四\\t30\\t上海"
with open('data.tsv', 'w', encoding='utf-8') as f:
    f.write(tsv_data)

with open('data.tsv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\\t')
    for row in reader:
        print(f"{row['姓名']}: {row['城市']}")

# JSON嵌套数据处理
import json
api_response = {
    "status": "ok",
    "data": {
        "users": [
            {"id": 1, "name": "张三", "scores": [85, 92, 78]},
            {"id": 2, "name": "李四", "scores": [90, 88, 95]}
        ]
    }
}
json_str = json.dumps(api_response, ensure_ascii=False, indent=2)
print(f"JSON输出:\\n{json_str[:200]}...")`,
          exercise: {
            id: 'ex1-3-2',
            lessonId: 'les1-3-2',
            description: '编写一个函数 `detect_encoding(filename)`，尝试用多种编码（utf-8, utf-8-sig, gbk, gb2312, latin1）读取文件，返回第一个成功读取的编码名称。如果都失败，返回 None。同时打印读取内容的前50个字符。',
            initialCode: `def detect_encoding(filename):
    # 请在此处编写代码
    pass

# 测试
with open('test_enc.txt', 'w', encoding='gbk') as f:
    f.write("这是一个GBK编码的测试文件，包含中文字符。")

result = detect_encoding('test_enc.txt')
print(f"检测到的编码: {result}")`,
            hints: [
              '遍历编码列表，对每个编码尝试 open(filename, "r", encoding=编码) 并读取',
              '用 try-except 捕获 UnicodeDecodeError，成功则返回当前编码名',
              'latin1 (ISO-8859-1) 永远不会报错，可作为最后兜底'
            ],
            referenceAnswer: `def detect_encoding(filename):
    encodings = ['utf-8', 'utf-8-sig', 'gbk', 'gb2312', 'latin1']
    for encoding in encodings:
        try:
            with open(filename, 'r', encoding=encoding) as f:
                content = f.read()
            print(f"内容预览: {content[:50]}")
            return encoding
        except UnicodeDecodeError:
            continue
    return None`,
            testCases: [
              { input: "open('te.txt','w',encoding='utf-8').write('Hello世界'); detect_encoding('te.txt')", expectedOutput: 'utf-8' },
              { input: "open('te2.txt','w',encoding='gbk').write('测试数据'); detect_encoding('te2.txt')", expectedOutput: 'gbk' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch1-4',
      moduleId: 'python-basics',
      title: 'NumPy数值计算基础',
      order: 4,
      lessons: [
        {
          id: 'les1-4-1',
          chapterId: 'ch1-4',
          title: 'ndarray创建与运算',
          type: 'both',
          content: `## ndarray创建与运算

NumPy（Numerical Python）是Python数据科学生态的基石，pandas、scikit-learn等库都建立在NumPy之上。其核心是ndarray（N-dimensional array），一个高效的多维数组对象。

### 为什么需要NumPy

Python原生列表处理数值计算有三个问题：
1. **性能差**：列表存储对象引用，无法利用CPU向量化指令
2. **无广播**：两个长度不同的列表无法直接运算
3. **功能弱**：缺少矩阵运算、线性代数等数学功能

NumPy的ndarray使用连续内存存储同类型数据，比Python列表快10-100倍。

### 创建ndarray

\`\`\`python
import numpy as np

# 从列表创建
arr = np.array([1, 2, 3, 4, 5])

# 快速创建
np.zeros(5)          # [0, 0, 0, 0, 0]
np.ones((2, 3))      # 2行3列全1矩阵
np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
np.linspace(0, 1, 5) # [0, 0.25, 0.5, 0.75, 1.0]

# 随机创建
np.random.rand(3)        # [0,1)均匀分布
np.random.randn(3)       # 标准正态分布
np.random.randint(1, 10, 5)  # [1,10)随机整数
\`\`\`

### 数据类型（dtype）

ndarray中所有元素类型相同，常用dtype：
- \`int32/int64\`：整数
- \`float32/float64\`：浮点数（默认float64）
- \`bool\`：布尔
- \`str_\`：字符串

\`\`\`python
arr = np.array([1, 2, 3], dtype=np.float64)
arr.dtype  # dtype('float64')
\`\`\`

### 向量化运算

ndarray支持逐元素运算，无需循环，这是NumPy的核心优势：

\`\`\`python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b    # [11, 22, 33, 44]
a * b    # [10, 40, 90, 160]
a ** 2   # [1, 4, 9, 16]
a > 2    # [False, False, True, True]
\`\`\`

### 广播机制

当两个数组形状不同时，NumPy会自动"扩展"较小的数组，使运算能够进行：

\`\`\`python
a = np.array([[1, 2, 3], [4, 5, 6]])  # shape (2, 3)
b = np.array([10, 20, 30])             # shape (3,)
a + b  # b被广播为[[10,20,30],[10,20,30]]
\`\`\`

**广播规则：** 从最右侧维度开始比较，维度相等或其中一个为1时可以广播。`,
          codeExample: `import numpy as np

# 创建数组
scores = np.array([85, 92, 78, 95, 88, 76, 90, 83])
print(f"成绩: {scores}")
print(f"类型: {scores.dtype}, 形状: {scores.shape}")

# 向量化运算：成绩标准化
mean = scores.mean()
std = scores.std()
z_scores = (scores - mean) / std
print(f"标准化: {np.round(z_scores, 2)}")

# 广播：二维数组与一维数组运算
matrix = np.array([[1, 2, 3], [4, 5, 6]])
row_means = matrix.mean(axis=1, keepdims=True)
centered = matrix - row_means
print(f"行中心化:\\n{centered}")

# 快速创建与运算
x = np.linspace(0, 2 * np.pi, 5)
y = np.sin(x)
print(f"sin值: {np.round(y, 3)}")

# 条件运算
mask = scores >= 80
print(f"80分以上: {scores[mask]}")
print(f"及格率: {mask.mean():.1%}")

# 标量广播
prices = np.array([29.9, 49.5, 15.8])
discounted = prices * 0.8  # 标量广播
print(f"八折价: {discounted}")`,
          exercise: {
            id: 'ex1-4-1',
            lessonId: 'les1-4-1',
            description: '编写一个函数 `normalize_matrix(matrix)`，接收一个二维NumPy数组，对每列进行归一化处理（每列减去该列均值，除以该列标准差）。返回归一化后的数组。如果某列标准差为0，则该列归一化后全为0。',
            initialCode: `import numpy as np

def normalize_matrix(matrix):
    # 请在此处编写代码
    pass

# 测试
data = np.array([[1, 10, 100],
                 [2, 20, 200],
                 [3, 30, 300],
                 [4, 40, 400]])
result = normalize_matrix(data)
print(f"归一化结果:\\n{np.round(result, 4)}")
print(f"各列均值: {np.round(result.mean(axis=0), 10)}")
print(f"各列标准差: {np.round(result.std(axis=0), 10)}")`,
            hints: [
              '用 matrix.mean(axis=0) 计算每列均值，matrix.std(axis=0) 计算每列标准差',
              '利用广播机制：matrix - col_means 自动按行广播',
              '处理标准差为0的情况：用 np.where(std == 0, 0, normalized) 或类似方法'
            ],
            referenceAnswer: `import numpy as np

def normalize_matrix(matrix):
    col_means = matrix.mean(axis=0)
    col_stds = matrix.std(axis=0)
    normalized = (matrix - col_means) / col_stds
    normalized[:, col_stds == 0] = 0
    return normalized`,
            testCases: [
              { input: 'import numpy as np; data = np.array([[1,5],[2,5],[3,5]]); r = normalize_matrix(data); np.allclose(r.mean(axis=0), 0)', expectedOutput: 'True' },
              { input: 'import numpy as np; data = np.array([[1,5],[2,5],[3,5]]); r = normalize_matrix(data); np.allclose(r[:,1], 0)', expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les1-4-2',
          chapterId: 'ch1-4',
          title: '数组索引与形状操作',
          type: 'both',
          content: `## 数组索引与形状操作

灵活的索引和形状操作是NumPy的精髓，掌握它们可以高效地选取、变换和处理数据，这是数据分析中每天都要用到的技能。

### 基本索引

一维数组索引与Python列表类似：

\`\`\`python
arr = np.array([10, 20, 30, 40, 50])
arr[0]      # 10
arr[-1]     # 50
arr[1:4]    # [20, 30, 40]
arr[::2]    # [10, 30, 50]
\`\`\`

### 多维数组索引

\`\`\`python
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
matrix[0, 1]     # 2（第0行第1列）
matrix[1, :]     # [4, 5, 6]（第1行全部）
matrix[:, 0]     # [1, 4, 7]（第0列全部）
matrix[:2, 1:]   # [[2,3],[5,6]]
\`\`\`

### 花式索引（Fancy Indexing）

使用整数数组作为索引，可以同时选取多个不连续的元素：

\`\`\`python
arr = np.array([10, 20, 30, 40, 50])
indices = [0, 2, 4]
arr[indices]  # [10, 30, 50]

# 二维花式索引
matrix[[0, 2], [1, 2]]  # [2, 9]（(0,1)和(2,2)）
\`\`\`

### 布尔索引

用布尔数组筛选满足条件的元素，在数据过滤中极为常用：

\`\`\`python
scores = np.array([85, 92, 78, 95, 88])
scores[scores >= 90]  # [92, 95]

# 组合条件
scores[(scores >= 80) & (scores < 90)]  # [85, 88]
\`\`\`

**注意：** 布尔索引中 \`and/or/not\` 要替换为 \`&/|/~\`，且条件需用括号包裹。

### 形状操作

\`\`\`python
arr = np.arange(12)  # [0,1,2,...,11]

# reshape：改变形状
arr.reshape(3, 4)    # 3行4列
arr.reshape(2, -1)   # -1表示自动计算

# 转置
matrix.T             # 行列互换

# 展平
matrix.flatten()     # 返回副本
matrix.ravel()       # 返回视图（可能）

# 堆叠
np.vstack([a, b])   # 垂直堆叠
np.hstack([a, b])   # 水平堆叠
np.concatenate([a, b], axis=0)
\`\`\`

### axis 参数

axis是NumPy中最重要的概念之一，理解它对后续学习pandas至关重要：

- \`axis=0\`：沿行方向操作（跨行），结果减少行数 → 按列计算
- \`axis=1\`：沿列方向操作（跨列），结果减少列数 → 按行计算

\`\`\`python
matrix.sum(axis=0)  # 每列的和
matrix.sum(axis=1)  # 每行的和
\`\`\``,
          codeExample: `import numpy as np

# 创建示例数据：4个学生3门课的成绩
scores = np.array([
    [85, 92, 78],  # 张三
    [90, 88, 95],  # 李四
    [76, 82, 70],  # 王五
    [95, 91, 89]   # 赵六
])
students = ["张三", "李四", "王五", "赵六"]
subjects = ["数学", "英语", "物理"]

# 基本索引
print(f"张三的英语成绩: {scores[0, 1]}")
print(f"李四所有成绩: {scores[1, :]}")
print(f"所有人的数学成绩: {scores[:, 0]}")

# 布尔索引：找数学>=85的学生
math_mask = scores[:, 0] >= 85
print(f"数学>=85: {[students[i] for i in np.where(math_mask)[0]]}")

# 花式索引：选取特定学生
top_indices = np.argsort(scores.mean(axis=1))[::-1][:2]
print(f"前两名: {[students[i] for i in top_indices]}")

# 形状操作
print(f"原始形状: {scores.shape}")
row_avg = scores.mean(axis=1, keepdims=True)
print(f"行均值形状: {row_avg.shape}")

# reshape 与转置
flat = scores.flatten()
print(f"展平: {flat}")
reshaped = flat.reshape(2, 6)
print(f"重塑为2x6:\\n{reshaped}")

# axis计算
print(f"每科平均: {scores.mean(axis=0)}")
print(f"每人平均: {scores.mean(axis=1)}")`,
          exercise: {
            id: 'ex1-4-2',
            lessonId: 'les1-4-2',
            description: '编写一个函数 `select_top_students(scores, n)`，接收一个二维NumPy数组（行=学生，列=科目）和整数n，返回平均分最高的n个学生的行索引数组。如果n超过学生数，返回所有学生索引。',
            initialCode: `import numpy as np

def select_top_students(scores, n):
    # 请在此处编写代码
    pass

# 测试
data = np.array([
    [85, 92, 78],
    [90, 88, 95],
    [76, 82, 70],
    [95, 91, 89],
    [60, 55, 62]
])
print(select_top_students(data, 2))
print(select_top_students(data, 10))`,
            hints: [
              '先计算每个学生的平均分：scores.mean(axis=1)',
              '用 np.argsort 对平均分排序，[::-1] 反转为降序，取前n个索引',
              '用 min(n, len(scores)) 处理n超过学生数的情况'
            ],
            referenceAnswer: `import numpy as np

def select_top_students(scores, n):
    avg_scores = scores.mean(axis=1)
    sorted_indices = np.argsort(avg_scores)[::-1]
    n = min(n, len(scores))
    return sorted_indices[:n]`,
            testCases: [
              { input: 'import numpy as np; data = np.array([[85,92,78],[90,88,95],[76,82,70]]); select_top_students(data, 2).tolist()', expectedOutput: '[1, 0]' },
              { input: 'import numpy as np; data = np.array([[100,100,100],[50,50,50]]); select_top_students(data, 1).tolist()', expectedOutput: '[0]' }
            ]
          }
        },
        {
          id: 'les1-4-3',
          chapterId: 'ch1-4',
          title: 'NumPy常用函数',
          type: 'both',
          content: `## NumPy常用函数

NumPy提供了大量数学函数，这些函数都是向量化的（自动对每个元素操作），在数据分析中极为常用。本课将系统学习统计函数、条件函数、排序和随机数生成。

### 统计函数

\`\`\`python
arr = np.array([85, 92, 78, 95, 88, 76, 90, 83])

arr.sum()       # 总和
arr.mean()      # 均值
arr.std()       # 标准差（默认ddof=0，总体标准差）
arr.var()       # 方差
arr.min()       # 最小值
arr.max()       # 最大值
arr.argmin()    # 最小值索引
arr.argmax()    # 最大值索引
arr.cumsum()    # 累计和
arr.cumprod()   # 累计积
\`\`\`

**注意 ddof 参数：** \`std()\` 默认计算总体标准差（除以N），数据分析中常用样本标准差（除以N-1），需设置 \`ddof=1\`。

### np.where 条件函数

\`np.where(condition, x, y)\` 类似Excel的IF函数，根据条件从x或y中选取值：

\`\`\`python
scores = np.array([85, 45, 92, 55, 78])
result = np.where(scores >= 60, "及格", "不及格")
# ['及格', '不及格', '及格', '不及格', '及格']
\`\`\`

**单参数形式：** \`np.where(condition)\` 返回满足条件的索引，等价于 \`np.nonzero(condition)\`。

### 排序函数

\`\`\`python
arr = np.array([3, 1, 4, 1, 5, 9, 2, 6])

np.sort(arr)          # 返回排序后的副本
np.argsort(arr)       # 返回排序后的索引
arr.sort()            # 原地排序

# 二维数组排序
matrix.sort(axis=0)   # 按列排序
np.sort(matrix, axis=1)  # 按行排序
\`\`\`

### 随机数生成

NumPy的随机模块是模拟和采样的基础：

\`\`\`python
rng = np.random.default_rng(42)  # 推荐的新API

rng.random(5)          # [0,1)均匀分布
rng.normal(0, 1, 5)    # 正态分布 N(0,1)
rng.integers(1, 100, 5) # [1,100)随机整数
rng.choice([1,2,3], 2)  # 随机选择
rng.shuffle(arr)        # 原地打乱
\`\`\`

**设置随机种子：** 使用 \`np.random.seed(42)\` 或 \`default_rng(seed)\` 确保结果可复现。

### 其他常用函数

- \`np.unique(arr)\`：去重并排序
- \`np.clip(arr, min, max)\`：限制值范围
- \`np.round(arr, decimals)\`：四舍五入
- \`np.isnan(arr)\`：检测NaN
- \`np.nanmean(arr)\`：忽略NaN计算均值
- \`np.percentile(arr, q)\`：计算百分位数`,
          codeExample: `import numpy as np

# 统计函数
data = np.array([23, 45, 12, 67, 34, 89, 56, 78, 43, 21])
print(f"均值: {data.mean():.1f}")
print(f"标准差(总体): {data.std():.2f}")
print(f"标准差(样本): {data.std(ddof=1):.2f}")
print(f"中位数: {np.median(data):.1f}")
print(f"百分位25%: {np.percentile(data, 25):.1f}")

# np.where：成绩等级
scores = np.array([85, 45, 92, 55, 78, 98, 62])
grades = np.where(scores >= 90, "优秀",
         np.where(scores >= 80, "良好",
         np.where(scores >= 60, "及格", "不及格")))
print(f"成绩等级: {dict(zip(scores, grades))}")

# 排序
indices = np.argsort(scores)[::-1]
print(f"排名索引: {indices}")
print(f"排名成绩: {scores[indices]}")

# 随机数
rng = np.random.default_rng(42)
simulated = rng.normal(loc=100, scale=15, size=10)
print(f"模拟成绩: {np.round(simulated, 1)}")

# 处理缺失值
data_with_nan = np.array([85, 92, np.nan, 78, np.nan, 95])
print(f"有效数据: {data_with_nan[~np.isnan(data_with_nan)]}")
print(f"忽略NaN均值: {np.nanmean(data_with_nan):.1f}")

# clip：限制范围
ages = np.array([15, 25, 35, 65, 85, 120])
clipped = np.clip(ages, 18, 100)
print(f"限制年龄: {clipped}")`,
          exercise: {
            id: 'ex1-4-3',
            lessonId: 'les1-4-3',
            description: '编写一个函数 `score_report(scores)`，接收一个一维NumPy数组（学生成绩，可能包含NaN表示缺考）。返回一个字典，包含："count"（有效成绩数）、"mean"（均值，忽略NaN，保留2位小数）、"std"（样本标准差，ddof=1，保留2位小数）、"pass_rate"（及格率，>=60的比例，保留2位小数）、"grades"（等级分布字典，90+为"A"，80-89为"B"，60-79为"C"，<60为"D"，忽略NaN）。',
            initialCode: `import numpy as np

def score_report(scores):
    # 请在此处编写代码
    pass

# 测试
data = np.array([85, 92, np.nan, 78, 55, 95, np.nan, 62, 88, 45])
print(score_report(data))`,
            hints: [
              '用 ~np.isnan(scores) 过滤有效成绩，或用 np.nanmean/nanstd 等函数',
              '及格率 = (有效成绩中>=60的数量) / 有效成绩总数',
              '等级分布：用 np.where 或布尔索引统计各等级人数'
            ],
            referenceAnswer: `import numpy as np

def score_report(scores):
    valid = scores[~np.isnan(scores)]
    count = len(valid)
    mean = round(float(np.mean(valid)), 2)
    std = round(float(np.std(valid, ddof=1)), 2)
    pass_rate = round(float(np.mean(valid >= 60)), 2)
    grades = {
        "A": int(np.sum(valid >= 90)),
        "B": int(np.sum((valid >= 80) & (valid < 90))),
        "C": int(np.sum((valid >= 60) & (valid < 80))),
        "D": int(np.sum(valid < 60))
    }
    return {
        "count": count,
        "mean": mean,
        "std": std,
        "pass_rate": pass_rate,
        "grades": grades
    }`,
            testCases: [
              { input: 'import numpy as np; r = score_report(np.array([85, 92, 78, 55, 95])); r["count"]', expectedOutput: '5' },
              { input: 'import numpy as np; r = score_report(np.array([85, 92, 78, 55, 95])); r["grades"]', expectedOutput: "{'A': 2, 'B': 1, 'C': 1, 'D': 1}" },
              { input: 'import numpy as np; r = score_report(np.array([85, np.nan, 55])); r["count"]', expectedOutput: '2' }
            ]
          }
        }
      ]
    }
  ]
};
