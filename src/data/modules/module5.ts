import type { Module } from '../../types';

export const module5: Module = {
  id: 'business-intelligence',
  title: '商务智能与报表自动化',
  description: '学习Excel自动化处理、数据透视分析、商业指标体系构建和自动化报表生成，提升商务数据分析实战能力。',
  icon: '📋',
  order: 5,
  chapters: [
    {
      id: 'ch5-1',
      moduleId: 'business-intelligence',
      title: 'Excel数据处理自动化',
      order: 1,
      lessons: [
        {
          id: 'les5-1-1',
          chapterId: 'ch5-1',
          title: 'pandas读写Excel',
          type: 'both',
          content: `## pandas读写Excel

Excel是商务领域最广泛使用的数据载体，掌握用Python批量读写Excel文件是实现办公自动化的第一步。pandas提供了简洁高效的Excel读写接口，结合openpyxl引擎可以灵活处理多工作表、指定列、跳过行等复杂场景。

### read_excel 核心参数

\`pd.read_excel()\` 是读取Excel文件的主力函数，常用参数包括：

- **sheet_name**：指定工作表名称或索引，默认读取第一个工作表；传入列表可读取多个工作表，返回字典
- **header**：指定表头所在行，默认为0（第一行）；若数据无表头可设为None
- **usecols**：指定读取的列，支持列名列表如\`['姓名','成绩']\`、列索引列表如\`[0,2,4]\`或范围如\`'A:C'\`
- **skiprows**：跳过开头的行数，常用于跳过合并单元格的标题行
- **dtype**：指定列的数据类型，避免pandas自动推断错误，如\`{'手机号': str}\`
- **na_values**：自定义缺失值标记，如将\`'N/A'\`、\`'—'\`识别为NaN

### to_excel 与 ExcelWriter

\`df.to_excel()\` 将DataFrame写入Excel文件，关键参数：

- **sheet_name**：工作表名称，默认'Sheet1'
- **index**：是否写入行索引，通常设为False
- **encoding**：文件编码

当需要写入多个工作表时，必须使用\`pd.ExcelWriter\`：

\`\`\`python
with pd.ExcelWriter('report.xlsx', engine='openpyxl') as writer:
    df1.to_excel(writer, sheet_name='销售数据', index=False)
    df2.to_excel(writer, sheet_name='汇总', index=False)
\`\`\`

### 多工作表批量处理

在实际业务中，一个Excel文件往往包含多个工作表，例如月度销售报表中每月一个sheet。使用\`pd.read_excel(file, sheet_name=None)\`可一次性读取所有工作表，返回以工作表名为键的字典，再通过循环批量处理。

### 实际业务场景

某电商公司每月收到供应商发来的Excel订单文件，每个文件包含"订单明细"和"商品信息"两个工作表。使用pandas可以快速读取两个工作表，按商品ID合并后计算各品类的采购金额，并将结果写入新的Excel文件发送给财务部门。`,
          codeExample: `import pandas as pd
import numpy as np

# 创建示例数据 - 模拟电商订单
orders = pd.DataFrame({
    '订单ID': ['ORD001','ORD002','ORD003','ORD004','ORD005'],
    '商品': ['笔记本电脑','手机','平板','耳机','键盘'],
    '数量': [2, 5, 3, 10, 8],
    '单价': [5999, 3999, 2999, 599, 299]
})
summary = pd.DataFrame({
    '品类': ['电脑', '手机', '配件'],
    '供应商数': [3, 5, 8],
    '在售商品数': [12, 25, 40]
})

# 写入多工作表Excel
with pd.ExcelWriter('sales_data.xlsx', engine='openpyxl') as writer:
    orders.to_excel(writer, sheet_name='订单明细', index=False)
    summary.to_excel(writer, sheet_name='品类汇总', index=False)

# 读取所有工作表
all_sheets = pd.read_excel('sales_data.xlsx', sheet_name=None)
for name, df in all_sheets.items():
    print(f"--- {name} ---")
    print(df)

# 读取指定列和跳过行
df_selected = pd.read_excel('sales_data.xlsx',
    sheet_name='订单明细', usecols=['商品','数量','单价'])
print("\\n指定列读取:")
print(df_selected)`,
          exercise: {
            id: 'ex5-1-1',
            lessonId: 'les5-1-1',
            description: '编写一个函数 `merge_excel_sheets(file_path)`，读取Excel文件中所有工作表，将它们纵向合并为一个DataFrame（要求所有工作表结构相同），并添加一列"来源工作表"标记每行数据来自哪个工作表。',
            initialCode: `import pandas as pd

def merge_excel_sheets(file_path):
    # 请在此处编写代码
    pass

# 测试
with pd.ExcelWriter('test_multi.xlsx', engine='openpyxl') as writer:
    pd.DataFrame({'产品':['A','B'],'销量':[100,200]}).to_excel(writer, sheet_name='1月', index=False)
    pd.DataFrame({'产品':['C','D'],'销量':[150,250]}).to_excel(writer, sheet_name='2月', index=False)
result = merge_excel_sheets('test_multi.xlsx')
print(result)`,
            hints: [
              '使用 pd.read_excel(file_path, sheet_name=None) 读取所有工作表，返回字典',
              '遍历字典，给每个DataFrame添加"来源工作表"列，再用 pd.concat 合并'
            ],
            referenceAnswer: `import pandas as pd

def merge_excel_sheets(file_path):
    all_sheets = pd.read_excel(file_path, sheet_name=None)
    dfs = []
    for sheet_name, df in all_sheets.items():
        df = df.copy()
        df['来源工作表'] = sheet_name
        dfs.append(df)
    return pd.concat(dfs, ignore_index=True)`,
            testCases: [
              { input: "result = merge_excel_sheets('test_multi.xlsx'); print(len(result))", expectedOutput: '4' },
              { input: "result = merge_excel_sheets('test_multi.xlsx'); print(sorted(result['来源工作表'].unique().tolist()))", expectedOutput: "['1月', '2月']" }
            ]
          }
        },
        {
          id: 'les5-1-2',
          chapterId: 'ch5-1',
          title: 'Excel格式化与图表',
          type: 'both',
          content: `## Excel格式化与图表

数据写入Excel后，往往还需要进行格式美化与图表生成，使报表更专业、更易读。pandas负责数据处理，openpyxl负责格式化和图表，两者配合是Excel报表自动化的最佳实践。

### 条件格式

条件格式可以根据数据值自动设置单元格样式，突出关键信息：

- **高亮最大/最小值**：用不同颜色标记TOP N或BOTTOM N
- **数据条**：在单元格内嵌入迷你条形图，直观展示数值大小
- **色阶**：从绿到红渐变，快速识别高低值
- **图标集**：用箭头、交通灯等图标表示趋势

在openpyxl中，通过\`ConditionalFormatting\`对象添加条件格式规则，支持\`CellIsRule\`、\`DataBarRule\`、\`ColorScaleRule\`等。

### 图表生成

openpyxl支持在Excel中创建原生图表，包括：

- **柱状图（BarChart）**：适合比较不同类别的数值
- **折线图（LineChart）**：适合展示时间序列趋势
- **饼图（PieChart）**：适合展示占比构成
- **散点图（ScatterChart）**：适合展示两个变量的关系

创建图表的基本步骤：1) 创建图表对象；2) 添加数据引用；3) 设置标题和样式；4) 将图表添加到工作表。

### 样式设置

openpyxl提供了丰富的样式控制：

- **Font**：字体名称、大小、颜色、加粗、斜体
- **PatternFill**：背景填充色
- **Alignment**：对齐方式（水平、垂直、换行）
- **Border**：边框样式
- **NumberFormat**：数字格式（如货币、百分比、千分位）

### 实际业务场景

某零售企业每周需要生成销售周报，报表包含：各门店销售额汇总表（带条件格式高亮TOP3门店）、品类占比饼图、销售趋势折线图。通过Python脚本自动化生成，将原来2小时的手工操作缩短为30秒。`,
          codeExample: `import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import DataBarRule

# 创建销售数据并写入Excel
df = pd.DataFrame({
    '门店': ['朝阳店','海淀店','西城店','东城店','丰台店'],
    '销售额': [158000, 132000, 98000, 145000, 87000],
    '目标': [150000, 140000, 100000, 130000, 90000]
})
df['完成率(%)'] = (df['销售额'] / df['目标'] * 100).round(1)
df.to_excel('store_report.xlsx', index=False)

# 用openpyxl美化
wb = openpyxl.load_workbook('store_report.xlsx')
ws = wb.active

# 表头样式
for cell in ws[1]:
    cell.font = Font(bold=True, color='FFFFFF', size=11)
    cell.fill = PatternFill(start_color='4472C4', fill_type='solid')
    cell.alignment = Alignment(horizontal='center')

# 完成率列添加数据条
col_letter = 'D'
ws.conditional_formatting.add(
    f'{col_letter}2:{col_letter}6',
    DataBarRule(start_type='min', end_type='max', color='4472C4')
)

# 添加柱状图
chart = BarChart()
chart.title = '各门店销售额'
data = Reference(ws, min_col=2, min_row=1, max_row=6)
cats = Reference(ws, min_col=1, min_row=2, max_row=6)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
ws.add_chart(chart, 'A8')

wb.save('store_report_formatted.xlsx')
print("格式化报表已生成")`,
          exercise: {
            id: 'ex5-1-2',
            lessonId: 'les5-1-2',
            description: '编写一个函数 `format_sales_report(filename)`，读取已有的Excel销售报表（含"产品"和"销售额"列），为表头设置蓝色背景白色加粗字体，为销售额列添加数据条条件格式，并添加一个柱状图展示各产品销售额。',
            initialCode: `import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import DataBarRule

def format_sales_report(filename):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({'产品':['手机','电脑','平板'], '销售额':[50000,80000,30000]})
df.to_excel('test_sales.xlsx', index=False)
format_sales_report('test_sales.xlsx')
print("格式化完成")`,
            hints: [
              '先用 openpyxl.load_workbook 加载文件，遍历 ws[1] 设置表头样式',
              '用 DataBarRule 添加数据条，用 BarChart + Reference 创建柱状图'
            ],
            referenceAnswer: `import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import DataBarRule

def format_sales_report(filename):
    wb = openpyxl.load_workbook(filename)
    ws = wb.active
    # 表头样式
    for cell in ws[1]:
        cell.font = Font(bold=True, color='FFFFFF', size=11)
        cell.fill = PatternFill(start_color='4472C4', fill_type='solid')
        cell.alignment = Alignment(horizontal='center')
    # 数据条
    max_row = ws.max_row
    ws.conditional_formatting.add(
        f'B2:B{max_row}',
        DataBarRule(start_type='min', end_type='max', color='4472C4')
    )
    # 柱状图
    chart = BarChart()
    chart.title = '销售额'
    data = Reference(ws, min_col=2, min_row=1, max_row=max_row)
    cats = Reference(ws, min_col=1, min_row=2, max_row=max_row)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    ws.add_chart(chart, 'A8')
    wb.save(filename)`,
            testCases: [
              { input: "format_sales_report('test_sales.xlsx'); wb = openpyxl.load_workbook('test_sales.xlsx'); ws = wb.active; print(ws['A1'].font.bold)", expectedOutput: 'True' },
              { input: "format_sales_report('test_sales.xlsx'); wb = openpyxl.load_workbook('test_sales.xlsx'); ws = wb.active; print(len(ws._charts))", expectedOutput: '1' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch5-2',
      moduleId: 'business-intelligence',
      title: '商业指标体系',
      order: 2,
      lessons: [
        {
          id: 'les5-2-1',
          chapterId: 'ch5-2',
          title: '核心商业指标',
          type: 'theory',
          content: `## 核心商业指标

商业指标体系是量化业务健康度的基石，不同行业和商业模式关注的核心指标各有侧重。掌握这些指标的定义、计算方式和业务含义，是数据分析从业者的必备素养。

### 电商与零售核心指标

**GMV（Gross Merchandise Volume，商品交易总额）**：一段时间内平台所有订单金额的总和，包含已付款和未付款订单。GMV反映平台的交易规模，但不等于实际收入。

**客单价（ARPU，Average Revenue Per User）**：平均每个用户贡献的收入。ARPU = 总收入 / 活跃用户数。在电商场景中，客单价 = 总销售额 / 订单数，反映用户的消费能力。

**CAC（Customer Acquisition Cost，获客成本）**：获取一个新客户所需的平均营销费用。CAC = 营销总费用 / 新增客户数。CAC越低，获客效率越高。

**LTV（Life Time Value，客户终身价值）**：一个客户在整个生命周期内为企业贡献的净利润。LTV = ARPU × 客户平均生命周期 × 毛利率。健康的商业模式要求 LTV > CAC，通常 LTV/CAC > 3 被认为是良好的。

### 转化率指标

**转化率（Conversion Rate）**：从上一个环节进入下一个环节的用户比例。电商核心转化路径为：访问→浏览商品→加购物车→下单→支付，每个环节都有对应的转化率。整体转化率 = 支付用户数 / 访问用户数。

**付费转化率**：免费用户转化为付费用户的比例，是SaaS企业最关注的指标之一。

### 留存率指标

**留存率（Retention Rate）**：某批用户在第N天后仍活跃的比例。次日留存率、7日留存率、30日留存率是三个关键观测点。留存率直接反映产品粘性，Facebook著名的"40-20-10"法则认为：次日留存40%、7日留存20%、30日留存10%的产品才有机会成功。

**流失率（Churn Rate）**：留存率的反面，流失率 = 1 - 留存率。月流失率5%意味着每年流失近半数用户。

### 指标之间的关系

- **LTV / CAC 比值**：衡量商业模型可持续性，比值越高越健康
- **ARPU × 生命周期 = LTV**：提升客单价或延长生命周期都能增加LTV
- **转化率 × 流量 = 成交量**：提升转化率和获取流量是增长的两大引擎
- **留存率决定生命周期**：留存率越高，用户生命周期越长，LTV越大`,
          codeExample: `import pandas as pd

# 模拟电商平台月度运营数据
data = {
    '月份': ['1月','2月','3月','4月','5月','6月'],
    'GMV': [1200000, 980000, 1350000, 1500000, 1680000, 2100000],
    '实际收入': [960000, 784000, 1080000, 1200000, 1344000, 1680000],
    '活跃用户': [50000, 48000, 55000, 60000, 63000, 72000],
    '新增用户': [8000, 6000, 9000, 10000, 8500, 12000],
    '付费用户': [5000, 4800, 5800, 6500, 7000, 8200],
    '营销费用': [200000, 180000, 220000, 250000, 230000, 280000]
}
df = pd.DataFrame(data)

# 计算核心指标
df['客单价'] = (df['实际收入'] / df['付费用户']).round(2)
df['ARPU'] = (df['实际收入'] / df['活跃用户']).round(2)
df['CAC'] = (df['营销费用'] / df['新增用户']).round(2)
df['付费转化率(%)'] = (df['付费用户'] / df['活跃用户'] * 100).round(2)
df['LTV(估)'] = (df['ARPU'] * 12 * 0.3).round(2)  # 假设生命周期12月,毛利率30%
df['LTV/CAC'] = (df['LTV(估)'] / df['CAC']).round(2)

print("月度核心指标:")
print(df[['月份','客单价','ARPU','CAC','付费转化率(%)','LTV/CAC']].to_string(index=False))`,
          exercise: {
            id: 'ex5-2-1',
            lessonId: 'les5-2-1',
            description: '编写一个函数 `calculate_business_metrics(df)`，接收包含"实际收入"、"活跃用户"、"新增用户"、"付费用户"、"营销费用"列的DataFrame，计算并返回包含ARPU、CAC、付费转化率、LTV（假设生命周期6个月、毛利率25%）和LTV/CAC比值的新DataFrame。',
            initialCode: `import pandas as pd

def calculate_business_metrics(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '实际收入': [960000, 1200000],
    '活跃用户': [50000, 60000],
    '新增用户': [8000, 10000],
    '付费用户': [5000, 6500],
    '营销费用': [200000, 250000]
})
result = calculate_business_metrics(df)
print(result)`,
            hints: [
              'ARPU = 实际收入 / 活跃用户，CAC = 营销费用 / 新增用户',
              'LTV = ARPU × 生命周期(6) × 毛利率(0.25)，LTV/CAC = LTV / CAC'
            ],
            referenceAnswer: `import pandas as pd

def calculate_business_metrics(df):
    result = pd.DataFrame()
    result['ARPU'] = (df['实际收入'] / df['活跃用户']).round(2)
    result['CAC'] = (df['营销费用'] / df['新增用户']).round(2)
    result['付费转化率(%)'] = (df['付费用户'] / df['活跃用户'] * 100).round(2)
    result['LTV'] = (result['ARPU'] * 6 * 0.25).round(2)
    result['LTV/CAC'] = (result['LTV'] / result['CAC']).round(2)
    return result`,
            testCases: [
              { input: "df = pd.DataFrame({'实际收入':[100000],'活跃用户':[5000],'新增用户':[1000],'付费用户':[500],'营销费用':[20000]}); r = calculate_business_metrics(df); print(r['ARPU'].iloc[0])", expectedOutput: '20.0' },
              { input: "df = pd.DataFrame({'实际收入':[100000],'活跃用户':[5000],'新增用户':[1000],'付费用户':[500],'营销费用':[20000]}); r = calculate_business_metrics(df); print(r['LTV/CAC'].iloc[0])", expectedOutput: '1.5' }
            ]
          }
        },
        {
          id: 'les5-2-2',
          chapterId: 'ch5-2',
          title: '指标拆解与漏斗分析',
          type: 'both',
          content: `## 指标拆解与漏斗分析

面对一个宏观指标（如GMV下降20%），直接定位原因非常困难。指标拆解是将宏观指标逐层分解为可操作子指标的方法，而漏斗分析则是拆解转化路径的利器。

### 指标拆解方法

**公式拆解法**：将指标表达为数学公式，逐项分析。

以GMV为例：GMV = 访问用户数 × 转化率 × 客单价

当GMV下降时，分别检查三个子指标的变化，快速定位是流量、转化还是客单价出了问题。每个子指标还可以继续拆解：

- 访问用户数 = 新用户 + 回访用户 = 渠道A流量 + 渠道B流量 + ...
- 转化率 = 浏览率 × 加购率 × 下单率 × 支付率
- 客单价 = 人均购买件数 × 件单价

**维度拆解法**：按业务维度切片，找出异常维度。

GMV下降 → 按地区拆解（华东/华南/华北...）→ 按品类拆解（3C/服装/食品...）→ 按渠道拆解（APP/小程序/PC...），逐层下钻直到找到具体问题。

### AARRR模型

AARRR（海盗指标）是互联网产品最经典的指标框架：

1. **Acquisition（获取）**：用户从哪里来？关注渠道流量、获客成本
2. **Activation（激活）**：用户体验到核心价值了吗？关注注册转化、首次使用率
3. **Retention（留存）**：用户会回来吗？关注次日/7日/30日留存率
4. **Revenue（收入）**：用户付费了吗？关注付费转化率、ARPU、LTV
5. **Referral（推荐）**：用户会推荐给别人吗？关注邀请率、K因子

AARRR本质上就是一个从获客到推荐的完整漏斗，每一层都有对应的转化率。

### 漏斗分析实战

漏斗分析的核心是计算各环节转化率，找到流失最严重的环节（"漏水点"），针对性优化。例如，如果"加购→下单"转化率仅15%，说明购物车环节存在严重问题，可能的原因包括：运费过高、支付方式不够、结算流程复杂等。`,
          codeExample: `import pandas as pd
import numpy as np

# AARRR漏斗数据
funnel = pd.DataFrame({
    '环节': ['访问', '注册', '首次购买', '复购', '推荐他人'],
    '用户数': [100000, 32000, 8000, 3200, 960]
})
funnel['环节转化率(%)'] = (funnel['用户数'] / funnel['用户数'].shift(1) * 100).fillna(100).round(1)
funnel['总体转化率(%)'] = (funnel['用户数'] / funnel['用户数'].iloc[0] * 100).round(1)

print("AARRR漏斗分析:")
print(funnel.to_string(index=False))

# GMV指标拆解
np.random.seed(42)
monthly = pd.DataFrame({
    '月份': range(1, 7),
    'GMV': [120, 115, 108, 95, 98, 105],  # 万元
    '访问用户': [50, 48, 45, 40, 42, 44],   # 万
    '转化率(%)': [4.0, 3.8, 3.6, 3.2, 3.3, 3.5],
    '客单价': [600, 630, 667, 742, 705, 682]
})
monthly['GMV验证'] = (monthly['访问用户'] * 10000 * monthly['转化率(%)'] / 100 * monthly['客单价'] / 10000).round(0)

# 计算各指标环比变化
for col in ['GMV', '访问用户', '转化率(%)', '客单价']:
    monthly[f'{col}环比'] = (monthly[col].pct_change() * 100).round(1)

print("\\nGMV拆解分析:")
print(monthly[['月份','GMV','GMV环比','访问用户环比','转化率(%)环比','客单价环比']].to_string(index=False))`,
          exercise: {
            id: 'ex5-2-2',
            lessonId: 'les5-2-2',
            description: '编写一个函数 `decompose_gmv(df)`，接收包含"月份"、"访问用户数(万)"、"转化率(%)"、"客单价"列的DataFrame，验证 GMV = 访问用户数 × 转化率 × 客单价，并计算各子指标对GMV变化的贡献度（用各指标环比变化的绝对值占总变化的百分比表示）。',
            initialCode: `import pandas as pd

def decompose_gmv(df):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '月份': [1, 2],
    '访问用户数(万)': [50, 45],
    '转化率(%)': [4.0, 3.5],
    '客单价': [600, 650]
})
result = decompose_gmv(df)
print(result)`,
            hints: [
              'GMV = 访问用户数(万) × 转化率(%) / 100 × 客单价，先计算每月GMV',
              '各指标环比变化 = (当期 - 上期) / 上期，贡献度 = 各指标变化绝对值 / 总变化绝对值之和'
            ],
            referenceAnswer: `import pandas as pd

def decompose_gmv(df):
    df = df.copy()
    df['GMV'] = df['访问用户数(万)'] * df['转化率(%)'] / 100 * df['客单价']
    df['访问用户环比(%)'] = (df['访问用户数(万)'].pct_change() * 100).round(2)
    df['转化率环比(%)'] = (df['转化率(%)'].pct_change() * 100).round(2)
    df['客单价环比(%)'] = (df['客单价'].pct_change() * 100).round(2)
    df['GMV环比(%)'] = (df['GMV'].pct_change() * 100).round(2)
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'月份':[1,2],'访问用户数(万)':[50,55],'转化率(%)':[4.0,4.0],'客单价':[600,600]}); r = decompose_gmv(df); print(round(r['GMV'].iloc[1]))", expectedOutput: '1320' },
              { input: "df = pd.DataFrame({'月份':[1,2],'访问用户数(万)':[50,50],'转化率(%)':[4.0,4.0],'客单价':[600,600]}); r = decompose_gmv(df); print(r['GMV环比(%)'].iloc[1])", expectedOutput: '0.0' }
            ]
          }
        },
        {
          id: 'les5-2-3',
          chapterId: 'ch5-2',
          title: '同环比与趋势分析',
          type: 'both',
          content: `## 同环比与趋势分析

判断业务指标是否健康，不能只看绝对值，必须与历史数据对比。同比和环比是最常用的两种对比方式，趋势分析则帮助我们从时间序列中发现规律和异常。

### 同比与环比

**同比（Year-over-Year, YoY）**：与去年同一时期对比。例如2024年6月销售额同比 = (2024年6月销售额 - 2023年6月销售额) / 2023年6月销售额 × 100%。同比消除了季节性因素，反映业务的真实增长趋势。

**环比（Month-over-Month, MoM）**：与上一个时期对比。例如6月环比 = (6月销售额 - 5月销售额) / 5月销售额 × 100%。环比反映短期变化，对季节性敏感。

**如何选择**：
- 强季节性行业（服装、旅游）→ 优先看同比
- 快速变化业务（互联网产品）→ 优先看环比
- 最稳妥的方式：同时看同比和环比，两者结合判断

### 移动平均

移动平均（Moving Average）通过计算一段时间窗口内的平均值来平滑短期波动，揭示长期趋势。

- **简单移动平均（SMA）**：窗口内等权平均，如7日SMA = 最近7天销售额的平均值
- **加权移动平均（WMA）**：近期数据赋予更高权重
- **指数移动平均（EMA）**：指数衰减权重，对最新数据最敏感

pandas中用\`df.rolling(window=n).mean()\`计算移动平均，用\`df.ewm(span=n).mean()\`计算EMA。

### 趋势分解

时间序列可以分解为三个组成部分：

- **趋势（Trend）**：长期上升或下降方向
- **季节性（Seasonality）**：周期性重复的模式
- **残差（Residual）**：去除趋势和季节性后的随机波动

使用\`statsmodels\`的\`seasonal_decompose\`函数可以自动分解。加法模型：Y = T + S + R；乘法模型：Y = T × S × R。

### 实际业务场景

某SaaS公司发现月度MRR（月经常性收入）在6月出现下降，通过同环比分析发现：环比下降5%但同比仍增长30%，结合移动平均线确认长期趋势向上，6月下降属于季节性波动（客户财年预算周期导致），无需恐慌。`,
          codeExample: `import pandas as pd
import numpy as np

# 模拟24个月的销售数据（含季节性）
np.random.seed(42)
dates = pd.date_range('2023-01', periods=24, freq='MS')
trend = np.linspace(100, 160, 24)  # 上升趋势
seasonality = 15 * np.sin(np.arange(24) * np.pi / 6)  # 年度季节性
noise = np.random.normal(0, 5, 24)
sales = trend + seasonality + noise

df = pd.DataFrame({'日期': dates, '销售额': sales.round(1)})
df['月份'] = df['日期'].dt.month
df['年份'] = df['日期'].dt.year

# 同比增长率
df['去年同期'] = df['销售额'].shift(12)
df['同比增长率(%)'] = ((df['销售额'] - df['去年同期']) / df['去年同期'] * 100).round(1)

# 环比增长率
df['上月销售额'] = df['销售额'].shift(1)
df['环比增长率(%)'] = ((df['销售额'] - df['上月销售额']) / df['上月销售额'] * 100).round(1)

# 3个月移动平均
df['3月移动平均'] = df['销售额'].rolling(window=3).mean().round(1)

print("同环比与趋势分析:")
print(df[['日期','销售额','同比增长率(%)','环比增长率(%)','3月移动平均']].tail(12).to_string(index=False))`,
          exercise: {
            id: 'ex5-2-3',
            lessonId: 'les5-2-3',
            description: '编写一个函数 `calc_yoy_mom(df, date_col, value_col)`，接收DataFrame和日期列名、数值列名，计算同比增长率和环比增长率，返回包含原始值和增长率的DataFrame。同比需与12个月前对比，环比与上月对比。',
            initialCode: `import pandas as pd

def calc_yoy_mom(df, date_col, value_col):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '日期': pd.date_range('2023-01', periods=18, freq='MS'),
    '销售额': [100,105,110,108,115,120,118,125,130,128,135,140,
              138,145,150,148,155,160]
})
result = calc_yoy_mom(df, '日期', '销售额')
print(result.tail(6))`,
            hints: [
              '用 df[value_col].shift(12) 获取去年同期值，shift(1) 获取上月值',
              '同比增长率 = (当期 - 去年同期) / 去年同期 * 100，注意处理除零情况'
            ],
            referenceAnswer: `import pandas as pd

def calc_yoy_mom(df, date_col, value_col):
    df = df.copy()
    df['去年同期'] = df[value_col].shift(12)
    df['上月值'] = df[value_col].shift(1)
    df['同比增长率(%)'] = ((df[value_col] - df['去年同期']) / df['去年同期'] * 100).round(1)
    df['环比增长率(%)'] = ((df[value_col] - df['上月值']) / df['上月值'] * 100).round(1)
    return df`,
            testCases: [
              { input: "df = pd.DataFrame({'日期':pd.date_range('2023-01',periods=18,freq='MS'),'销售额':[100]*6+[120]*6+[144]*6}); r = calc_yoy_mom(df,'日期','销售额'); print(r['同比增长率(%)'].iloc[17])", expectedOutput: '20.0' },
              { input: "df = pd.DataFrame({'日期':pd.date_range('2023-01',periods=18,freq='MS'),'销售额':[100]*6+[120]*6+[144]*6}); r = calc_yoy_mom(df,'日期','销售额'); print(r['环比增长率(%)'].iloc[7])", expectedOutput: '20.0' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch5-3',
      moduleId: 'business-intelligence',
      title: '数据透视与多维分析',
      order: 3,
      lessons: [
        {
          id: 'les5-3-1',
          chapterId: 'ch5-3',
          title: '数据透视表进阶',
          type: 'both',
          content: `## 数据透视表进阶

数据透视表（Pivot Table）是商务分析中使用频率最高的工具之一。pandas的\`pivot_table\`函数比Excel透视表更灵活，支持多级分组、多聚合函数和计算字段，是批量生成报表的核心工具。

### pivot_table 核心参数

\`\`\`python
pd.pivot_table(data, values=None, index=None, columns=None,
               aggfunc='mean', fill_value=None, margins=False,
               margins_name='All', dropna=True)
\`\`\`

- **values**：要聚合的数值列，可以是列表实现多值聚合
- **index**：行分组键，可以是列表实现多级行索引
- **columns**：列分组键，可以是列表实现多级列索引
- **aggfunc**：聚合函数，可以是字符串（'sum'、'mean'、'count'、'min'、'max'）、函数或函数列表
- **fill_value**：填充缺失值，避免报表中出现NaN
- **margins**：是否添加行/列合计
- **dropna**：是否删除全为NaN的列

### 多级分组

当index或columns传入列表时，会生成多级索引（MultiIndex），实现OLAP风格的多维分析。例如\`index=['地区','渠道']\`会先按地区分组，再按渠道细分。

### 计算字段

透视表生成后，可以像操作普通DataFrame一样添加计算列。常见操作：

- **占比**：各分组的值 / 合计值
- **差异**：当期值 - 上期值
- **排名**：用\`rank()\`方法

### 交叉表 crosstab

\`pd.crosstab()\`专门用于频数统计，比pivot_table更适合计数场景：

- \`normalize='index'\`：行百分比
- \`normalize='columns'\`：列百分比
- \`normalize='all'\`：总百分比

### 实际业务场景

某电商运营团队需要按地区×品类维度分析销售情况，既要看销售额合计，又要看平均客单价，还要计算各地区占比。用pivot_table一次生成多维度、多指标的透视表，再添加占比列，即可快速产出分析报告。`,
          codeExample: `import pandas as pd
import numpy as np

# 模拟电商销售数据
np.random.seed(42)
n = 300
df = pd.DataFrame({
    '地区': np.random.choice(['华东','华南','华北','西南'], n),
    '品类': np.random.choice(['3C','服装','食品','家居'], n),
    '渠道': np.random.choice(['APP','小程序','PC'], n),
    '销售额': np.random.uniform(50, 3000, n).round(2),
    '订单数': np.random.randint(1, 10, n)
})
df['客单价'] = (df['销售额'] / df['订单数']).round(2)

# 多级透视表 - 地区×品类
pt = pd.pivot_table(df, values=['销售额','客单价'],
    index='地区', columns='品类',
    aggfunc={'销售额': 'sum', '客单价': 'mean'},
    fill_value=0)
print("多指标透视表:")
print(pt.round(0))

# 带合计的透视表
pt_sum = pd.pivot_table(df, values='销售额',
    index='地区', columns='品类',
    aggfunc='sum', margins=True, margins_name='合计',
    fill_value=0)
print("\\n带合计的透视表:")
print(pt_sum.round(0))

# 计算各地区占比
region_total = df.groupby('地区')['销售额'].sum()
pct = (region_total / region_total.sum() * 100).round(1)
print("\\n地区销售占比:")
print(pct)`,
          exercise: {
            id: 'ex5-3-1',
            lessonId: 'les5-3-1',
            description: '编写一个函数 `advanced_pivot(df)`，接收包含"地区"、"品类"、"渠道"、"销售额"列的DataFrame，返回一个透视表：行为地区，列为品类，值为销售额合计，并添加一列"合计"和一行"占比"（各品类占总销售额的百分比）。',
            initialCode: `import pandas as pd
import numpy as np

def advanced_pivot(df):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
df = pd.DataFrame({
    '地区': np.random.choice(['华东','华南','华北'], 100),
    '品类': np.random.choice(['3C','服装'], 100),
    '渠道': np.random.choice(['APP','PC'], 100),
    '销售额': np.random.uniform(100, 2000, 100).round(2)
})
result = advanced_pivot(df)
print(result)`,
            hints: [
              '先用 pd.pivot_table 创建地区×品类的销售额合计透视表，margins=True添加合计列',
              '计算占比行：各品类合计 / 总合计 * 100，用 pd.concat 或 loc 添加到透视表'
            ],
            referenceAnswer: `import pandas as pd
import numpy as np

def advanced_pivot(df):
    pt = pd.pivot_table(df, values='销售额',
        index='地区', columns='品类',
        aggfunc='sum', fill_value=0, margins=True, margins_name='合计')
    # 计算占比行
    total = pt.loc['合计']
    pct_row = (total / total['合计'] * 100).round(1)
    pct_row.name = '占比(%)'
    pt = pd.concat([pt, pct_row.to_frame().T])
    return pt`,
            testCases: [
              { input: "np.random.seed(42); df = pd.DataFrame({'地区':['东','西']*50,'品类':['A','B']*50,'渠道':['X']*100,'销售额':[100]*100}); r = advanced_pivot(df); print(type(r).__name__)", expectedOutput: 'DataFrame' },
              { input: "df = pd.DataFrame({'地区':['东','西'],'品类':['A','A'],'渠道':['X','X'],'销售额':[300,700]}); r = advanced_pivot(df); print(r.loc['占比(%)','A'])", expectedOutput: '100.0' }
            ]
          }
        },
        {
          id: 'les5-3-2',
          chapterId: 'ch5-3',
          title: 'RFM客户分析模型',
          type: 'both',
          content: `## RFM客户分析模型

RFM模型是客户价值分析的经典方法，通过三个维度对客户进行分层，帮助企业制定精准的运营策略。RFM模型简单直观、可操作性强，被广泛应用于电商、零售、SaaS等行业。

### RFM三个维度

- **R（Recency，最近一次消费时间）**：客户最后一次购买距今天数。R值越小，说明客户越活跃。
- **F（Frequency，消费频率）**：客户在统计期内的购买次数。F值越大，说明客户越忠诚。
- **M（Monetary，消费金额）**：客户在统计期内的消费总额。M值越大，说明客户价值越高。

### RFM评分方法

**五分位法**：将每个维度按数值大小分为5组，分别赋1-5分。R值越小分数越高（最近消费得分高），F和M值越大分数越高。

\`\`\`python
# R评分：值越小越好，所以取反
df['R_score'] = pd.qcut(df['R'], 5, labels=[5,4,3,2,1]).astype(int)
# F评分和M评分：值越大越好
df['F_score'] = pd.qcut(df['F'], 5, labels=[1,2,3,4,5]).astype(int)
df['M_score'] = pd.qcut(df['M'], 5, labels=[1,2,3,4,5]).astype(int)
\`\`\`

### 客户分群

根据RFM评分，可以将客户分为8个群体：

| 客户类型 | R | F | M | 运营策略 |
|---------|---|---|---|---------|
| 重要价值客户 | 高 | 高 | 高 | VIP服务，保持关系 |
| 重要发展客户 | 高 | 高 | 低 | 提升客单价 |
| 重要保持客户 | 高 | 低 | 高 | 提升消费频次 |
| 重要挽留客户 | 高 | 低 | 低 | 激活消费 |
| 一般价值客户 | 低 | 高 | 高 | 召回，提升活跃 |
| 一般发展客户 | 低 | 高 | 低 | 召回+提升客单价 |
| 一般保持客户 | 低 | 低 | 高 | 召回+提升频次 |
| 一般挽留客户 | 低 | 低 | 低 | 低优先级 |

### 实际业务场景

某电商平台有10万活跃客户，运营团队需要制定差异化营销策略。通过RFM分析发现：重要价值客户占8%但贡献45%的GMV，应重点维护；重要挽留客户占15%，通过优惠券召回可显著提升GMV。`,
          codeExample: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 模拟客户交易数据
np.random.seed(42)
n_customers = 200
customer_ids = [f'C{str(i).zfill(4)}' for i in range(1, n_customers + 1)]

transactions = []
for cid in customer_ids:
    n_orders = np.random.randint(1, 30)
    for _ in range(n_orders):
        transactions.append({
            '客户ID': cid,
            '订单日期': datetime(2024, 6, 30) - timedelta(days=np.random.randint(1, 365)),
            '订单金额': round(np.random.uniform(50, 2000), 2)
        })
df = pd.DataFrame(transactions)

# 计算RFM
reference_date = datetime(2024, 7, 1)
rfm = df.groupby('客户ID').agg(
    R=('订单日期', lambda x: (reference_date - x.max()).days),
    F=('订单日期', 'count'),
    M=('订单金额', 'sum')
).reset_index()

# RFM评分（五分位法）
rfm['R_score'] = pd.qcut(rfm['R'], 5, labels=[5,4,3,2,1]).astype(int)
rfm['F_score'] = pd.qcut(rfm['F'].rank(method='first'), 5, labels=[1,2,3,4,5]).astype(int)
rfm['M_score'] = pd.qcut(rfm['M'], 5, labels=[1,2,3,4,5]).astype(int)

# 客户分群
rfm['RFM总分'] = rfm['R_score'] + rfm['F_score'] + rfm['M_score']
rfm['客户等级'] = pd.cut(rfm['RFM总分'], bins=[0,6,9,12,15],
    labels=['一般客户','潜力客户','重要客户','VIP客户'])

print("客户分群统计:")
print(rfm['客户等级'].value_counts().sort_index())
print(f"\\nVIP客户平均M值: {rfm[rfm['客户等级']=='VIP客户']['M'].mean():.0f}")`,
          exercise: {
            id: 'ex5-3-2',
            lessonId: 'les5-3-2',
            description: '编写一个函数 `rfm_analysis(df, customer_col, date_col, amount_col, reference_date)`，接收交易数据DataFrame和参考日期，计算每个客户的R、F、M值，进行五分位评分，并根据RFM总分将客户分为"高价值"、"中价值"、"低价值"三个等级，返回结果DataFrame。',
            initialCode: `import pandas as pd
from datetime import datetime

def rfm_analysis(df, customer_col, date_col, amount_col, reference_date):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '客户': ['A','A','A','B','B','C','C','C','C'],
    '日期': pd.to_datetime(['2024-06-01','2024-06-15','2024-06-28',
                            '2024-05-01','2024-06-20',
                            '2024-06-25','2024-06-27','2024-06-29','2024-06-30']),
    '金额': [100, 200, 150, 300, 250, 80, 90, 100, 120]
})
result = rfm_analysis(df, '客户', '日期', '金额', datetime(2024, 7, 1))
print(result)`,
            hints: [
              '用 groupby + agg 计算 R(距今天数)、F(订单数)、M(总金额)',
              '用 pd.qcut 进行五分位评分，R值越小分数越高用 labels=[5,4,3,2,1]，总分用 pd.cut 分三档'
            ],
            referenceAnswer: `import pandas as pd
from datetime import datetime

def rfm_analysis(df, customer_col, date_col, amount_col, reference_date):
    rfm = df.groupby(customer_col).agg(
        R=(date_col, lambda x: (reference_date - x.max()).days),
        F=(date_col, 'count'),
        M=(amount_col, 'sum')
    ).reset_index()
    rfm['R_score'] = pd.qcut(rfm['R'], 5, labels=[5,4,3,2,1], duplicates='drop').astype(int)
    rfm['F_score'] = pd.qcut(rfm['F'].rank(method='first'), 5, labels=[1,2,3,4,5], duplicates='drop').astype(int)
    rfm['M_score'] = pd.qcut(rfm['M'], 5, labels=[1,2,3,4,5], duplicates='drop').astype(int)
    rfm['RFM总分'] = rfm['R_score'] + rfm['F_score'] + rfm['M_score']
    rfm['客户等级'] = pd.cut(rfm['RFM总分'], bins=[0,6,10,15],
        labels=['低价值','中价值','高价值'])
    return rfm`,
            testCases: [
              { input: "df = pd.DataFrame({'客户':['A','A','B'],'日期':pd.to_datetime(['2024-06-28','2024-06-29','2024-06-30']),'金额':[100,200,500]}); r = rfm_analysis(df,'客户','日期','金额',datetime(2024,7,1)); print(sorted(r.columns.tolist()))", expectedOutput: "['R', 'R_score', 'F', 'F_score', 'M', 'M_score', 'RFM总分', '客户', '客户等级']" },
              { input: "df = pd.DataFrame({'客户':['A','A','B'],'日期':pd.to_datetime(['2024-06-28','2024-06-29','2024-06-30']),'金额':[100,200,500]}); r = rfm_analysis(df,'客户','日期','金额',datetime(2024,7,1)); print(len(r))", expectedOutput: '2' }
            ]
          }
        },
        {
          id: 'les5-3-3',
          chapterId: 'ch5-3',
          title: '同期群分析',
          type: 'both',
          content: `## 同期群分析

同期群分析（Cohort Analysis）是衡量用户留存和生命周期最有效的方法之一。它将用户按首次出现时间（如注册月份）分组为不同的"同期群"，然后追踪每个同期群在后续时间段的留存或行为变化。

### 为什么需要同期群分析

单纯看整体留存率会掩盖重要信息。例如，1月注册的用户可能留存率很高，而6月注册的用户留存率很低，但两者混在一起看整体留存率可能变化不大。同期群分析将不同时期的用户分开追踪，能准确发现留存率的变化趋势。

### 同期群分析步骤

1. **确定同期群分组维度**：通常按用户首次购买/注册的月份分组
2. **计算每个同期群在后续各月的留存用户数**：第N月留存 = 在首次购买后第N月仍有购买行为的用户数
3. **计算留存率**：第N月留存率 = 第N月留存用户数 / 该同期群初始用户数 × 100%
4. **生成留存热力图**：以同期群为行、月份偏移为列，用颜色深浅表示留存率高低

### 留存热力图解读

留存热力图是对角线结构，每行代表一个同期群，每列代表距首次购买的月数。理想情况下，留存率曲线应呈"先急后缓"的下降趋势，并在某个水平稳定下来。如果近期同期群的留存率明显低于早期同期群，说明产品或运营出了问题。

### 用户生命周期分析

基于留存数据可以估算用户生命周期：

- **平均生命周期** = 1 / 流失率（假设流失率恒定）
- **半衰期**：留存率降到50%所需的时间
- **LTV估算** = ARPU × 平均生命周期 × 毛利率

### 实际业务场景

某SaaS产品通过同期群分析发现：2024年Q1注册的用户30日留存率为45%，Q2降至35%。进一步分析发现Q2的产品改版导致新用户引导流程变长，优化引导流程后Q3留存率恢复到42%。同期群分析帮助团队快速定位了问题并验证了改进效果。`,
          codeExample: `import pandas as pd
import numpy as np

# 模拟用户交易数据
np.random.seed(42)
records = []
for cohort_month in range(1, 7):  # 1-6月同期群
    n_users = np.random.randint(80, 150)
    for uid in range(n_users):
        first_date = pd.Timestamp(2024, cohort_month, 1)
        records.append({'用户ID': f'{cohort_month}M_{uid}', '日期': first_date})
        # 模拟后续留存
        for m in range(1, 7 - cohort_month + 1):
            if np.random.random() < 0.6 * (0.85 ** m):
                records.append({
                    '用户ID': f'{cohort_month}M_{uid}',
                    '日期': pd.Timestamp(2024, cohort_month + m, 1)
                })

df = pd.DataFrame(records)
df['月份'] = df['日期'].dt.to_period('M')

# 获取每个用户的首次月份（同期群）
first_month = df.groupby('用户ID')['月份'].min().rename('同期群')
df = df.merge(first_month, on='用户ID')

# 计算月份偏移
df['月份偏移'] = (df['月份'] - df['同期群']).apply(lambda x: x.n)

# 构建留存表
cohort_counts = df.groupby(['同期群', '月份偏移'])['用户ID'].nunique().reset_index()
cohort_pivot = cohort_counts.pivot(index='同期群', columns='月份偏移', values='用户ID')

# 计算留存率
cohort_sizes = cohort_pivot.iloc[:, 0]
retention = (cohort_pivot.divide(cohort_sizes, axis=0) * 100).round(1)

print("同期群留存率(%):")
print(retention.fillna('-'))`,
          exercise: {
            id: 'ex5-3-3',
            lessonId: 'les5-3-3',
            description: '编写一个函数 `cohort_retention(df, user_col, date_col)`，接收用户行为DataFrame，计算同期群留存率表。同期群按用户首次出现的月份分组，月份偏移为距首次月份的月数差，留存率为各偏移月的活跃用户数占同期群初始用户数的百分比。',
            initialCode: `import pandas as pd

def cohort_retention(df, user_col, date_col):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '用户ID': ['A','A','A','B','B','C','C','C','C'],
    '日期': pd.to_datetime(['2024-01-05','2024-02-10','2024-03-15',
                            '2024-02-01','2024-03-05',
                            '2024-01-10','2024-02-10','2024-03-10','2024-04-10'])
})
result = cohort_retention(df, '用户ID', '日期')
print(result)`,
            hints: [
              '先计算每个用户的首次月份作为同期群：df.groupby(user_col)[date_col].min().dt.to_period("M")',
              '月份偏移 = (当月 - 同期群月).n，然后用 pivot_table 构建留存表，除以第0月用户数得到留存率'
            ],
            referenceAnswer: `import pandas as pd

def cohort_retention(df, user_col, date_col):
    df = df.copy()
    df['月份'] = df[date_col].dt.to_period('M')
    first_month = df.groupby(user_col)['月份'].min().rename('同期群')
    df = df.merge(first_month, on=user_col)
    df['月份偏移'] = (df['月份'] - df['同期群']).apply(lambda x: x.n)
    cohort_counts = df.groupby(['同期群','月份偏移'])[user_col].nunique().reset_index()
    pivot = cohort_counts.pivot(index='同期群', columns='月份偏移', values=user_col)
    cohort_sizes = pivot.iloc[:, 0]
    retention = (pivot.divide(cohort_sizes, axis=0) * 100).round(1)
    return retention`,
            testCases: [
              { input: "df = pd.DataFrame({'用户ID':['A','A','B'],'日期':pd.to_datetime(['2024-01-01','2024-02-01','2024-01-01'])}); r = cohort_retention(df,'用户ID','日期'); print(r.iloc[0,0])", expectedOutput: '100.0' },
              { input: "df = pd.DataFrame({'用户ID':['A','A','B'],'日期':pd.to_datetime(['2024-01-01','2024-02-01','2024-01-01'])}); r = cohort_retention(df,'用户ID','日期'); print(type(r).__name__)", expectedOutput: 'DataFrame' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch5-4',
      moduleId: 'business-intelligence',
      title: '报表自动化',
      order: 4,
      lessons: [
        {
          id: 'les5-4-1',
          chapterId: 'ch5-4',
          title: '自动化报表生成',
          type: 'both',
          content: `## 自动化报表生成

报表自动化是将数据处理、指标计算、格式美化、文件生成等步骤串联为自动化流水线，将人工数小时的重复工作缩短为几分钟甚至几秒。掌握报表自动化是数据分析师从"手工操作"迈向"工程化思维"的关键一步。

### 报表自动化流水线

一个完整的报表自动化流程包含四个阶段：

**1. 数据获取**：从数据源读取原始数据。常见数据源包括Excel文件、CSV文件、数据库（MySQL、PostgreSQL）、API接口等。pandas提供了\`read_excel\`、\`read_csv\`、\`read_sql\`等函数统一处理。

**2. 数据处理**：清洗、转换、计算指标。这是最核心的环节，包括：缺失值处理、数据类型转换、指标计算（同环比、占比、排名等）、透视表生成等。所有逻辑应封装为函数，便于复用和测试。

**3. 报表生成**：将处理结果写入格式化的Excel文件。使用\`ExcelWriter\`写入多个工作表，用openpyxl设置表头样式、条件格式、图表等。

**4. 报表分发**：将生成的报表通过邮件、企业微信、钉钉等渠道发送给相关人员。

### 模板化报表

模板化是报表自动化的核心思想：将报表的结构（工作表布局、样式、图表位置）定义为模板，每次只需更新数据即可。具体做法：

- 创建一个格式完善的Excel模板文件
- 用Python读取模板，只更新数据区域
- 保留所有格式和图表设置

### 代码组织建议

将报表生成逻辑按职责拆分为独立函数：

\`\`\`python
def fetch_data(date): ...        # 数据获取
def process_data(raw_df): ...    # 数据处理
def generate_report(df, path): ... # 报表生成
def send_report(path): ...       # 报表分发

# 主流程
raw = fetch_data('2024-06-15')
processed = process_data(raw)
generate_report(processed, 'report.xlsx')
send_report('report.xlsx')
\`\`\`

### 实际业务场景

某连锁零售企业每天需要生成"门店日报"：从POS系统导出销售数据，按门店汇总销售额、订单数、客单价，与昨日和上月同期对比，生成带条件格式的Excel报表并发送给区域经理。通过Python脚本自动化后，每天早上8点自动生成并发送，区域经理到岗即可查看。`,
          codeExample: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# === 报表自动化流水线 ===

def fetch_data(date_str):
    """模拟数据获取"""
    np.random.seed(hash(date_str) % 2**32)
    stores = ['朝阳店','海淀店','西城店','东城店','丰台店']
    return pd.DataFrame({
        '门店': stores,
        '销售额': np.random.uniform(50000, 200000, 5).round(2),
        '订单数': np.random.randint(100, 500, 5),
        '访客数': np.random.randint(1000, 5000, 5)
    })

def process_data(df):
    """数据处理与指标计算"""
    df = df.copy()
    df['客单价'] = (df['销售额'] / df['订单数']).round(2)
    df['转化率(%)'] = (df['订单数'] / df['访客数'] * 100).round(2)
    df['排名'] = df['销售额'].rank(ascending=False).astype(int)
    return df.sort_values('排名')

def generate_report(df, filename):
    """生成Excel报表"""
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='门店日报', index=False)
        # 汇总行
        summary = pd.DataFrame([{
            '门店': '合计', '销售额': df['销售额'].sum(),
            '订单数': df['订单数'].sum(), '访客数': df['访客数'].sum(),
            '客单价': round(df['销售额'].sum() / df['订单数'].sum(), 2),
            '转化率(%)': round(df['订单数'].sum() / df['访客数'].sum() * 100, 2),
            '排名': '-'
        }])
        summary.to_excel(writer, sheet_name='汇总', index=False)

# 执行流水线
today = datetime.now().strftime('%Y-%m-%d')
raw = fetch_data(today)
processed = process_data(raw)
generate_report(processed, f'daily_report_{today}.xlsx')
print("日报生成完成:")
print(processed.to_string(index=False))`,
          exercise: {
            id: 'ex5-4-1',
            lessonId: 'les5-4-1',
            description: '编写一个函数 `generate_weekly_report(df, filename)`，接收包含"日期"、"门店"、"销售额"、"订单数"列的DataFrame（一周数据），生成Excel报表：第一个工作表为各门店周汇总（销售额合计、日均订单数、客单价），第二个工作表为每日趋势（日期×门店的销售额透视表）。',
            initialCode: `import pandas as pd
import numpy as np

def generate_weekly_report(df, filename):
    # 请在此处编写代码
    pass

# 测试
np.random.seed(42)
dates = pd.date_range('2024-06-10', periods=7)
stores = ['朝阳店','海淀店','西城店']
rows = []
for d in dates:
    for s in stores:
        rows.append({'日期': d, '门店': s,
                     '销售额': np.random.uniform(5000, 20000),
                     '订单数': np.random.randint(20, 80)})
df = pd.DataFrame(rows)
generate_weekly_report(df, 'weekly_report.xlsx')
print("周报已生成")`,
            hints: [
              '第一个工作表：groupby("门店")聚合，计算销售额sum、订单数mean、客单价=总销售额/总订单数',
              '第二个工作表：用 pivot_table(index="日期", columns="门店", values="销售额", aggfunc="sum")'
            ],
            referenceAnswer: `import pandas as pd
import numpy as np

def generate_weekly_report(df, filename):
    # 工作表1：门店周汇总
    summary = df.groupby('门店').agg(
        销售额合计=('销售额', 'sum'),
        日均订单数=('订单数', 'mean')
    ).reset_index()
    summary['客单价'] = (summary['销售额合计'] / df.groupby('门店')['订单数'].sum().values).round(2)
    summary['日均订单数'] = summary['日均订单数'].round(1)
    # 工作表2：每日趋势
    trend = pd.pivot_table(df, values='销售额',
        index='日期', columns='门店', aggfunc='sum')
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        summary.to_excel(writer, sheet_name='门店周汇总', index=False)
        trend.to_excel(writer, sheet_name='每日趋势')`,
            testCases: [
              { input: "np.random.seed(42); dates=pd.date_range('2024-06-10',periods=7); stores=['A','B']; rows=[{'日期':d,'门店':s,'销售额':1000,'订单数':10} for d in dates for s in stores]; df=pd.DataFrame(rows); generate_weekly_report(df,'test_weekly.xlsx'); print('ok')", expectedOutput: 'ok' },
              { input: "np.random.seed(42); dates=pd.date_range('2024-06-10',periods=7); stores=['A','B']; rows=[{'日期':d,'门店':s,'销售额':1000,'订单数':10} for d in dates for s in stores]; df=pd.DataFrame(rows); generate_weekly_report(df,'test_weekly.xlsx'); xl=pd.ExcelFile('test_weekly.xlsx'); print(sorted(xl.sheet_names))", expectedOutput: "['每日趋势', '门店周汇总']" }
            ]
          }
        },
        {
          id: 'les5-4-2',
          chapterId: 'ch5-4',
          title: '数据看板设计',
          type: 'theory',
          content: `## 数据看板设计

数据看板（Dashboard）是将关键指标以可视化方式集中展示的界面，让决策者一目了然地掌握业务全貌。好的看板设计不是简单地把图表堆砌在一起，而是遵循信息设计原则，讲好数据故事。

### 看板设计原则

**1. 明确受众与目标**

不同角色关注不同指标：
- **高管**：关注核心KPI、趋势、异常信号，看板应简洁突出
- **运营**：关注过程指标、转化漏斗、渠道对比，看板应详细可下钻
- **一线**：关注个人/团队绩效、任务进度，看板应实时更新

**2. 信息层次与视觉层级**

看板应遵循"总—分—细"的信息架构：

- **第一层（顶部）**：3-5个核心KPI卡片，大字号显示当前值和环比变化，用颜色（绿/红）标注好坏
- **第二层（中部）**：趋势图、对比图、占比图，展示指标的变化和构成
- **第三层（底部）**：明细表格、下钻链接，供需要细节的用户查看

**3. 选择合适的图表类型**

| 分析目的 | 推荐图表 |
|---------|---------|
| 趋势变化 | 折线图、面积图 |
| 对比差异 | 柱状图、条形图 |
| 占比构成 | 饼图、环形图、堆叠柱状图 |
| 转化流程 | 漏斗图 |
| 分布情况 | 直方图、箱线图 |
| 关联关系 | 散点图、气泡图 |
| 地域分布 | 地图 |

**4. 数据讲故事（Data Storytelling）**

好的看板不只是展示数据，而是引导用户发现洞察：

- **突出异常**：用颜色、标注、箭头强调需要关注的异常值
- **提供上下文**：每个指标都应有对比基准（目标值、同期值、行业均值）
- **引导行动**：在看板上标注"建议"或"待办"，将洞察转化为行动

### 看板布局最佳实践

- **F型布局**：用户视线从左上到右下，重要信息放左上
- **卡片式设计**：每个指标/图表独立成卡片，间距统一
- **颜色克制**：主色不超过3种，用颜色突出重点而非装饰
- **响应式设计**：适配不同屏幕尺寸，确保手机端也可查看

### 常见看板类型

- **经营驾驶舱**：核心KPI + 趋势 + 预警，面向高管
- **运营监控台**：实时数据 + 漏斗 + 排行，面向运营
- **专题分析板**：围绕一个主题深入分析，如用户增长、商品效率
- **项目进度板**：里程碑 + 完成率 + 风险预警，面向项目经理

### 实际业务场景

某电商公司设计了一个"经营驾驶舱"看板：顶部5个KPI卡片（GMV、订单数、客单价、转化率、ROI），中部左侧为GMV趋势折线图（含目标线），中部右侧为品类占比饼图，底部为门店排名表。区域经理每天打开看板，30秒内即可判断业务是否正常。`,
          codeExample: `import pandas as pd
import numpy as np

# 模拟看板数据
np.random.seed(42)

# KPI卡片数据
kpi = {
    'GMV': 2150000, 'GMV目标': 2000000,
    '订单数': 8560, '客单价': 251.2,
    '转化率': 4.28, 'ROI': 2.8
}
kpi['GMV达成率'] = round(kpi['GMV'] / kpi['GMV目标'] * 100, 1)

print("=== 经营驾驶舱 KPI ===")
for name, value in kpi.items():
    print(f"  {name}: {value}")

# 趋势数据（近30天GMV）
dates = pd.date_range('2024-06-01', periods=30)
gmv_trend = pd.DataFrame({
    '日期': dates,
    'GMV': np.random.uniform(60000, 90000, 30).cumsum()
})
gmv_trend['7日均线'] = gmv_trend['GMV'].rolling(7).mean()
print(f"\\n近7日日均GMV: {gmv_trend['GMV'].tail(7).mean():.0f}")

# 品类占比
category = pd.DataFrame({
    '品类': ['3C数码','服装鞋包','食品饮料','家居生活','美妆个护'],
    'GMV': [680000, 520000, 380000, 310000, 260000]
})
category['占比(%)'] = (category['GMV'] / category['GMV'].sum() * 100).round(1)
print("\\n品类占比:")
print(category.to_string(index=False))`,
          exercise: {
            id: 'ex5-4-2',
            lessonId: 'les5-4-2',
            description: '编写一个函数 `design_kpi_cards(current, target)`，接收当期指标字典和目标指标字典，返回一个DataFrame，包含每个指标的当期值、目标值、达成率(%)和状态（达成率≥100为"达标"，≥90为"接近"，否则为"未达标"）。',
            initialCode: `import pandas as pd

def design_kpi_cards(current, target):
    # 请在此处编写代码
    pass

# 测试
current = {'GMV': 2150000, '订单数': 8560, '转化率': 4.28}
target = {'GMV': 2000000, '订单数': 9000, '转化率': 4.5}
result = design_kpi_cards(current, target)
print(result)`,
            hints: [
              '遍历current字典的键，从target中获取对应目标值，计算达成率 = 当期/目标*100',
              '用 numpy.select 或 if-elif-else 判断状态：>=100达标，>=90接近，否则未达标'
            ],
            referenceAnswer: `import pandas as pd

def design_kpi_cards(current, target):
    rows = []
    for key in current:
        curr = current[key]
        tgt = target.get(key, 0)
        rate = round(curr / tgt * 100, 1) if tgt != 0 else 0
        if rate >= 100:
            status = '达标'
        elif rate >= 90:
            status = '接近'
        else:
            status = '未达标'
        rows.append({
            '指标': key, '当期值': curr, '目标值': tgt,
            '达成率(%)': rate, '状态': status
        })
    return pd.DataFrame(rows)`,
            testCases: [
              { input: "c = {'GMV': 200, '订单': 90}; t = {'GMV': 200, '订单': 100}; r = design_kpi_cards(c, t); print(r['状态'].tolist())", expectedOutput: "['达标', '接近']" },
              { input: "c = {'A': 80}; t = {'A': 100}; r = design_kpi_cards(c, t); print(r['达成率(%)'].iloc[0])", expectedOutput: '80.0' }
            ]
          }
        }
      ]
    }
  ]
};
