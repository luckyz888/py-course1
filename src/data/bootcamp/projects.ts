import type { BootcampProject } from '../../types';

// ========== 项目1: 数据清洗实战 ==========
export const project1: BootcampProject = {
  id: 'bootcamp-01',
  title: '数据清洗实战',
  description: '通过清洗模拟电商用户数据，系统掌握Pandas数据清洗的核心技能，包括缺失值处理、重复值删除、格式修正和异常值处理。',
  difficulty: 'beginner',
  difficultyLabel: '入门',
  tags: ['数据清洗', '缺失值', '重复值', '异常值', '格式修正'],
  datasetCode: `import pandas as pd
import numpy as np

np.random.seed(42)

n = 1000
user_ids = [f'U{i:04d}' for i in range(1, n + 1)]

# 生成基础数据
names = [f'用户{i}' for i in range(1, n + 1)]
ages = np.random.randint(18, 65, n)
genders = np.random.choice(['男', '女'], n)
cities = np.random.choice(['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'], n)
register_dates = pd.date_range('2022-01-01', periods=n, freq='6H').strftime('%Y-%m-%d')
total_spent = np.round(np.random.exponential(500, n) + 50, 2)
order_count = np.random.randint(0, 50, n)

# 构造脏数据
df = pd.DataFrame({
    '用户ID': user_ids,
    '姓名': names,
    '年龄': ages.astype(float),
    '性别': genders,
    '城市': cities,
    '注册日期': register_dates,
    '累计消费': total_spent,
    '订单数': order_count,
})

# 1. 注入缺失值
for col in ['年龄', '性别', '城市', '累计消费', '订单数']:
    mask = np.random.choice(n, int(n * 0.05), replace=False)
    df.loc[mask, col] = np.nan

# 2. 注入重复行
duplicates = df.sample(30, random_state=42)
df = pd.concat([df, duplicates], ignore_index=True)

# 3. 注入异常值
df.loc[np.random.choice(len(df), 5, replace=False), '年龄'] = np.random.choice([-5, -3, 150, 200, 999], 5)
df.loc[np.random.choice(len(df), 5, replace=False), '累计消费'] = np.random.choice([-100, -500, 999999, -999, 1000000], 5)

# 4. 注入格式不一致
fmt_mask = np.random.choice(len(df), 30, replace=False)
df.loc[fmt_mask[:10], '性别'] = df.loc[fmt_mask[:10], '性别'].replace({'男': 'M', '女': 'F'})
df.loc[fmt_mask[10:20], '城市'] = df.loc[fmt_mask[10:20], '城市'] + '市'
df.loc[fmt_mask[20:30], '注册日期'] = df.loc[fmt_mask[20:30], '注册日期'].str.replace('-', '/')

# 5. 注入类型问题
df['订单数'] = df['订单数'].astype(object)
some_str_idx = np.random.choice(len(df), 15, replace=False)
df.loc[some_str_idx, '订单数'] = 'N/A'

df = df.sample(frac=1, random_state=42).reset_index(drop=True)`,
  datasetDescription: '模拟电商用户数据，约1030行（含30行重复），字段包括：用户ID、姓名、年龄、性别、城市、注册日期、累计消费、订单数。数据中包含缺失值、重复行、异常值、格式不一致和类型错误等脏数据问题。',
  tasks: [
    {
      id: 'task-01-1',
      title: '检测缺失值并统计',
      description: '检查每列的缺失值数量和比例，找出缺失最多的列，统计总缺失值数。',
      hint: '使用 df.isnull().sum() 统计每列缺失数量，df.isnull().mean() 计算比例，df.isnull().sum().sum() 计算总缺失值。',
      validation: '正确统计各列缺失值数量和比例，找出缺失最多的列',
    },
    {
      id: 'task-01-2',
      title: '处理缺失值',
      description: '对数值列用中位数填充缺失值，对分类列用众数填充缺失值，确保数据中不再有NaN。',
      hint: '数值列用 df[col].fillna(df[col].median())，分类列用 df[col].fillna(df[col].mode()[0])。',
      validation: '成功填充所有缺失值，数据中不再有NaN',
    },
    {
      id: 'task-01-3',
      title: '去除重复行',
      description: '检测并删除重复行（基于用户ID判断），保留第一次出现的记录，重置索引。',
      hint: '使用 df.duplicated(subset="用户ID") 检测，df.drop_duplicates(subset="用户ID", keep="first") 删除。',
      validation: '成功删除所有重复行，每个用户ID只出现一次',
    },
    {
      id: 'task-01-4',
      title: '修正格式不一致数据',
      description: '将性别列中的"M"替换为"男"、"F"替换为"女"；去除城市名中的"市"后缀；将注册日期中的"/"统一为"-"。',
      hint: '使用 df["性别"].replace({"M":"男","F":"女"})，df["城市"].str.replace("市","")，df["注册日期"].str.replace("/","-")。',
      validation: '性别统一为男/女，城市名无"市"后缀，日期分隔符统一为"-"',
    },
    {
      id: 'task-01-5',
      title: '处理异常值',
      description: '将年龄clip到18-65范围，将累计消费clip到0-50000范围，处理订单数列中的非数值（如"N/A"）并转为整数类型。',
      hint: '使用 df["年龄"].clip(lower=18, upper=65)，df["累计消费"].clip(lower=0, upper=50000)，df["订单数"].replace("N/A", 0).astype(int)。',
      validation: '年龄在18-65范围内，累计消费在0-50000范围内，订单数为整数类型',
    },
    {
      id: 'task-01-6',
      title: '验证清洗结果',
      description: '验证数据清洗完成：检查缺失值数为0、无重复行、数据类型正确、数值范围合理，输出清洗后的数据概览。',
      hint: '检查 df.isnull().sum().sum() == 0，df.duplicated().sum() == 0，df.dtypes，df.describe()。',
      validation: '输出清洗验证结果，确认所有脏数据问题已解决',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np

# 数据集已加载到变量 df 中
# df 包含列：用户ID、姓名、年龄、性别、城市、注册日期、累计消费、订单数
# 数据中存在缺失值、重复行、异常值、格式不一致等问题

# 任务1: 检测缺失值并统计
# 在这里编写你的代码

# 任务2: 处理缺失值
# 在这里编写你的代码

# 任务3: 去除重复行
# 在这里编写你的代码

# 任务4: 修正格式不一致数据
# 在这里编写你的代码

# 任务5: 处理异常值
# 在这里编写你的代码

# 任务6: 验证清洗结果
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np

# 任务1: 检测缺失值并统计
print("=== 各列缺失值统计 ===")
missing_count = df.isnull().sum()
missing_pct = (df.isnull().mean() * 100).round(2)
missing_df = pd.DataFrame({'缺失数量': missing_count, '缺失比例(%)': missing_pct})
print(missing_df[missing_df['缺失数量'] > 0])
print(f"\\n总缺失值数: {df.isnull().sum().sum()}")
print(f"缺失最多的列: {missing_count.idxmax()}")

# 任务2: 处理缺失值
for col in ['年龄', '累计消费']:
    df[col] = df[col].fillna(df[col].median())
for col in ['性别', '城市']:
    df[col] = df[col].fillna(df[col].mode()[0])
df['订单数'] = df['订单数'].fillna(0)
print(f"\\n填充后缺失值总数: {df.isnull().sum().sum()}")

# 任务3: 去除重复行
dup_count = df.duplicated(subset='用户ID').sum()
print(f"\\n重复行数量: {dup_count}")
df = df.drop_duplicates(subset='用户ID', keep='first').reset_index(drop=True)
print(f"去重后行数: {len(df)}")

# 任务4: 修正格式不一致数据
df['性别'] = df['性别'].replace({'M': '男', 'F': '女'})
df['城市'] = df['城市'].str.replace('市', '', regex=False)
df['注册日期'] = df['注册日期'].str.replace('/', '-', regex=False)
print("\\n=== 格式修正后 ===")
print(f"性别唯一值: {df['性别'].unique()}")
print(f"城市示例: {df['城市'].unique()[:5]}")
print(f"注册日期示例: {df['注册日期'].head(3).tolist()}")

# 任务5: 处理异常值
df['年龄'] = df['年龄'].clip(lower=18, upper=65)
df['累计消费'] = df['累计消费'].clip(lower=0, upper=50000)
df['订单数'] = df['订单数'].replace('N/A', 0)
df['订单数'] = df['订单数'].astype(int)
print("\\n=== 异常值处理后 ===")
print(f"年龄范围: {df['年龄'].min()} - {df['年龄'].max()}")
print(f"累计消费范围: {df['累计消费'].min():.2f} - {df['累计消费'].max():.2f}")
print(f"订单数类型: {df['订单数'].dtype}")

# 任务6: 验证清洗结果
print("\\n=== 清洗验证报告 ===")
print(f"缺失值总数: {df.isnull().sum().sum()}")
print(f"重复行数: {df.duplicated(subset='用户ID').sum()}")
print(f"数据形状: {df.shape}")
print(f"数据类型:\\n{df.dtypes}")
print(f"\\n数据概览:")
print(df.describe())
`,
  keyPoints: ['isnull/notnull缺失值检测', 'dropna/fillna缺失值处理', 'duplicated/drop_duplicates重复值处理', 'replace值替换', 'astype类型转换', 'str字符串方法', 'clip异常值处理', '正则清洗'],
  outline: [
    {
      title: '缺失值检测与处理',
      items: [
        {
          title: 'isnull/notnull检测',
          content: '缺失值检测是数据清洗的第一步。Pandas提供了isnull()和notnull()两个方法来检测缺失值。isnull()返回一个布尔DataFrame，True表示该位置为NaN；notnull()则相反，True表示非空。结合sum()可以统计每列的缺失值数量，结合mean()可以计算缺失比例。这是了解数据质量状况的基础操作，帮助决策后续采用删除还是填充策略。',
          codeExample: `missing_count = df.isnull().sum()
missing_pct = df.isnull().mean()
print(missing_count[missing_count > 0])`,
          importance: 'core',
        },
        {
          title: 'dropna删除缺失值',
          content: 'dropna()方法用于直接删除包含缺失值的行或列。通过axis参数控制方向：axis=0删除行（默认），axis=1删除列。how参数控制删除条件：how="any"只要有缺失就删除（默认），how="all"全部缺失才删除。thresh参数可设置最少非缺失值数量。dropna适用于缺失比例较小且删除不影响分析的场景，但会损失数据量。',
          codeExample: `df_clean = df.dropna()  # 删除任何含缺失的行
df_clean = df.dropna(subset=['年龄', '性别'])  # 仅按指定列判断
df_clean = df.dropna(thresh=5)  # 至少5个非缺失值才保留`,
          importance: 'important',
        },
        {
          title: 'fillna填充缺失值',
          content: 'fillna()是处理缺失值最常用的方法，支持多种填充策略：可以用固定值填充（如0或"未知"），用均值/中位数/众数等统计量填充，用前向填充ffill()或后向填充bfill()利用相邻值填充。method="ffill"用前一个非缺失值填充，method="bfill"用后一个非缺失值填充。对于时间序列数据，前向/后向填充特别有效，因为相邻时间点的值通常相近。',
          codeExample: `df['年龄'] = df['年龄'].fillna(df['年龄'].median())
df['性别'] = df['性别'].fillna(df['性别'].mode()[0])
df['城市'] = df['城市'].fillna(method='ffill')`,
          importance: 'important',
        },
        {
          title: '插值法填充',
          content: 'interpolate()方法提供更精细的插值填充策略，适用于数值型数据和时间序列。线性插值（默认）在两个已知值之间进行线性估算；method="quadratic"使用二次插值；method="cubic"使用三次样条插值，更平滑。limit参数可限制连续填充的最大数量，避免过多连续插值导致失真。插值法比前向填充更精确，尤其适合有趋势的数值数据。',
          codeExample: `df['销售额'] = df['销售额'].interpolate(method='linear')
df['温度'] = df['温度'].interpolate(method='cubic', limit=3)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '重复值处理',
      items: [
        {
          title: 'duplicated检测重复',
          content: 'duplicated()方法用于检测DataFrame中的重复行，返回布尔Series，True表示该行是重复行。默认判断所有列完全相同的行，第一次出现的行标记为False，后续重复行标记为True。通过subset参数可以指定只按部分列判断重复，例如subset=["用户ID"]表示只要用户ID相同就视为重复。这是识别数据冗余的关键步骤。',
          codeExample: `dup_mask = df.duplicated()  # 全列判断
dup_count = dup_mask.sum()
dup_by_id = df.duplicated(subset=['用户ID'])  # 按用户ID判断`,
          importance: 'core',
        },
        {
          title: 'drop_duplicates删除重复',
          content: 'drop_duplicates()方法删除重复行，返回去重后的DataFrame。keep参数控制保留哪一条：keep="first"保留第一次出现的（默认），keep="last"保留最后一次出现的，keep=False删除所有重复行。subset参数指定判断重复的列。inplace=True可直接在原DataFrame上修改。去重后建议用reset_index重置索引。',
          codeExample: `df = df.drop_duplicates(subset=['用户ID'], keep='first')
df = df.reset_index(drop=True)
print(f'去重后行数: {len(df)}')`,
          importance: 'important',
        },
        {
          title: 'subset与keep参数详解',
          content: 'subset参数允许指定判断重复的列名列表，非常灵活。例如subset=["姓名","年龄"]表示姓名和年龄都相同的行才算重复。keep参数决定重复行的保留策略：first保留首次出现，last保留末次出现，False全部删除。实际业务中，subset常用于按主键去重，keep则根据业务逻辑选择保留最新还是最早的记录。',
          codeExample: `# 按多列判断，保留最后出现的
df = df.drop_duplicates(subset=['姓名', '城市'], keep='last')
# 删除所有重复行（不保留任何一条）
df_strict = df.drop_duplicates(keep=False)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '数据类型转换',
      items: [
        {
          title: 'astype类型转换',
          content: 'astype()是Pandas最基础的类型转换方法，可以将列转换为指定类型。常见转换包括：float转int（需先处理缺失值）、object转float/int、object转category等。注意astype不能处理含非数字字符串的列，会抛出异常。转换前应先确认数据内容，必要时先清洗再转换。astype转换是确保数据类型正确、节省内存的重要操作。',
          codeExample: `df['年龄'] = df['年龄'].astype(int)
df['性别'] = df['性别'].astype('category')
df['金额'] = df['金额'].astype(float)`,
          importance: 'core',
        },
        {
          title: 'pd.to_numeric智能转换',
          content: 'pd.to_numeric()比astype更智能，专门用于将列转为数值类型。errors参数控制错误处理：errors="raise"遇到无法转换的值抛异常（默认），errors="coerce"将无法转换的值设为NaN，errors="ignore"保持原样不变。downcast参数可自动选择最小数据类型以节省内存，如downcast="integer"自动选择int8/int16/int32/int64。这是处理混合类型列的首选方法。',
          codeExample: `df['订单数'] = pd.to_numeric(df['订单数'], errors='coerce')
df['金额'] = pd.to_numeric(df['金额'], errors='coerce', downcast='float')`,
          importance: 'important',
        },
        {
          title: 'pd.to_datetime日期转换',
          content: 'pd.to_datetime()将各种格式的日期字符串转为datetime64类型。支持自动解析多种日期格式，也可通过format参数指定格式（如"%Y-%m-%d"）。errors参数与to_numeric类似：coerce将无效日期设为NaT。转为datetime后可以使用dt访问器提取年、月、日、星期等时间属性，进行时间计算和重采样操作。这是时间序列分析的基础。',
          codeExample: `df['日期'] = pd.to_datetime(df['日期'], format='%Y-%m-%d')
df['日期'] = pd.to_datetime(df['日期'], errors='coerce')
df['年份'] = df['日期'].dt.year`,
          importance: 'important',
        },
        {
          title: 'category类型优化',
          content: '将低基数字符串列转为category类型可大幅节省内存。category类型内部用整数编码存储，仅维护一个类别映射表。适合取值种类有限的列，如性别、城市、等级等。astype("category")直接转换，也可用Categorical指定类别顺序。category类型还支持有序分类（如"低<中<高"），在排序和统计时按指定顺序处理。',
          codeExample: `df['城市'] = df['城市'].astype('category')
df['等级'] = pd.Categorical(df['等级'], categories=['低','中','高'], ordered=True)
print(df['城市'].cat.codes.head())  # 查看内部编码`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '字符串清洗',
      items: [
        {
          title: 'str访问器基础',
          content: 'Pandas的str访问器提供了丰富的字符串处理方法，通过df["列名"].str.方法名()调用。它将字符串方法向量化应用到整个Series，比用apply+lambda更高效。常用方法包括：lower()/upper()大小写转换、strip()/lstrip()/rstrip()去除空白、replace()替换、contains()包含判断、startswith()/endswith()前后缀判断等。str访问器是文本清洗的核心工具。',
          codeExample: `df['姓名'] = df['姓名'].str.strip()
df['城市'] = df['城市'].str.replace('市', '', regex=False)
df['邮箱域名'] = df['邮箱'].str.split('@').str[1]`,
          importance: 'core',
        },
        {
          title: '正则表达式清洗',
          content: 'str访问器支持正则表达式操作：str.contains()判断是否匹配正则模式，str.extract()提取匹配的子串，str.findall()找出所有匹配，str.replace()用正则替换。正则清洗适合处理格式不统一的数据，如提取电话号码中的数字、清洗带单位的数值、统一日期格式等。regex=True参数启用正则模式，注意特殊字符需要转义。',
          codeExample: `df['手机号'] = df['联系方式'].str.extract(r'(1\\d{10})')
df['数值'] = df['金额'].str.replace(r'[^\d.]', '', regex=True).astype(float)
mask = df['地址'].str.contains(r'北京|上海', na=False)`,
          importance: 'important',
        },
        {
          title: 'split字符串拆分',
          content: 'str.split()将字符串按分隔符拆分，返回列表。expand=True参数将拆分结果展开为多列DataFrame，非常适合处理"姓/名"、"省/市/区"等组合字段。n参数限制拆分次数，pat参数支持正则分隔符。str.cat()则相反，用于拼接字符串。rsplit()从右侧开始拆分。拆分后可用str[0]、str[1]等访问拆分后的各部分。',
          codeExample: `df[['姓', '名']] = df['姓名'].str.split('', n=1, expand=True)
df[['省', '市']] = df['地址'].str.split('省', n=1, expand=True)
df['域名'] = df['邮箱'].str.split('@').str[-1]`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '异常值处理',
      items: [
        {
          title: 'IQR方法',
          content: 'IQR（四分位距）方法是检测异常值的经典统计方法。计算Q1（25%分位数）和Q3（75%分位数），IQR=Q3-Q1。通常将低于Q1-1.5*IQR或高于Q3+1.5*IQR的值判定为异常值。1.5倍IQR是常用阈值，3倍IQR则为极端异常值。IQR方法基于数据分布的四分位数，对非正态分布数据也有较好的鲁棒性，是最常用的单变量异常值检测方法。',
          codeExample: `Q1 = df['金额'].quantile(0.25)
Q3 = df['金额'].quantile(0.75)
IQR = Q3 - Q1
lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
outliers = df[(df['金额'] < lower) | (df['金额'] > upper)]`,
          importance: 'core',
        },
        {
          title: 'Z-Score方法',
          content: 'Z-Score（标准分）方法假设数据近似正态分布，通过计算每个值偏离均值的标准差倍数来判定异常。Z-Score = (x - mean) / std，通常|Z|>3判定为异常值（3σ原则）。Z-Score方法简单直观，但对非正态分布数据效果不佳，且受极端值影响（均值和标准差本身会被异常值拉偏）。适合数据近似正态分布的场景。',
          codeExample: `z_scores = (df['金额'] - df['金额'].mean()) / df['金额'].std()
outliers = df[z_scores.abs() > 3]
print(f'异常值数量: {len(outliers)}')`,
          importance: 'important',
        },
        {
          title: 'clip裁剪',
          content: 'clip()方法将数值限制在指定范围内，低于下界的值设为下界，高于上界的值设为上界。这是一种温和的异常值处理方式，不删除数据而是将极端值"截断"到合理范围。例如clip(lower=0, upper=100)将负值变为0，超过100的值变为100。clip适合处理有明确业务边界的数值，如年龄0-150、百分比0-100等。',
          codeExample: `df['年龄'] = df['年龄'].clip(lower=0, upper=150)
df['百分比'] = df['百分比'].clip(0, 100)
df['金额'] = df['金额'].clip(lower=df['金额'].quantile(0.01))`,
          importance: 'important',
        },
        {
          title: '分位数法',
          content: '分位数法用分位数作为异常值的边界，常用1%和99%分位数作为下界和上界。与IQR方法类似但更灵活，可以直接控制裁剪的比例。quantile(0.01)获取1%分位数，quantile(0.99)获取99%分位数。这种方法适合长尾分布的数据，可以按比例去除极端值而不依赖正态假设。也可结合clip使用，将超出分位数范围的值截断。',
          codeExample: `lower = df['金额'].quantile(0.01)
upper = df['金额'].quantile(0.99)
df['金额'] = df['金额'].clip(lower, upper)
print(f'裁剪范围: [{lower:.2f}, {upper:.2f}]')`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目2: 分组聚合分析 ==========
export const project2: BootcampProject = {
  id: 'bootcamp-02',
  title: '分组聚合分析',
  description: '通过分析连锁超市各门店各品类的销售数据，深入学习Pandas分组聚合的多种方法，包括groupby、agg、transform、apply和pivot_table。',
  difficulty: 'beginner',
  difficultyLabel: '入门',
  tags: ['分组聚合', 'groupby', 'agg', 'transform', '透视表'],
  datasetCode: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(123)

stores = [f'门店{i:02d}' for i in range(1, 11)]
categories = ['水果', '蔬菜', '肉禽', '乳品', '零食', '饮料', '日用品']
n = 2000

store_list = np.random.choice(stores, n)
cat_list = np.random.choice(categories, n)
dates = [datetime(2024, 1, 1) + timedelta(days=int(d)) for d in np.random.randint(0, 180, n)]
sales = np.round(np.random.uniform(100, 10000, n), 2)
quantity = np.random.randint(1, 50, n)
cost = np.round(sales * np.random.uniform(0.5, 0.85, n), 2)

df = pd.DataFrame({
    '门店': store_list,
    '品类': cat_list,
    '日期': dates,
    '销售额': sales,
    '数量': quantity,
    '成本': cost,
})
df['利润'] = df['销售额'] - df['成本']`,
  datasetDescription: '模拟连锁超市10家门店7个品类6个月的销售数据，共2000条记录，字段包括：门店、品类、日期、销售额、数量、成本、利润。',
  tasks: [
    {
      id: 'task-02-1',
      title: '按品类分组统计',
      description: '按品类分组，计算每个品类的总销售额、平均利润和订单数量，按总销售额降序排列。',
      hint: '使用 df.groupby("品类").agg({"销售额":"sum","利润":"mean","门店":"count"}) 进行分组聚合。',
      validation: '正确按品类分组并计算多指标统计',
    },
    {
      id: 'task-02-2',
      title: '多维度分组分析',
      description: '按门店和品类两个维度分组，计算每组的总销售额和平均利润率（利润/销售额）。',
      hint: '使用 df.groupby(["门店","品类"]).agg(...) 进行多级分组聚合。',
      validation: '正确进行多维度分组分析',
    },
    {
      id: 'task-02-3',
      title: '使用agg多函数聚合',
      description: '对销售额列同时计算sum、mean、max、min四个统计量，对利润列计算sum和mean。',
      hint: '使用 df.groupby("品类").agg({"销售额":["sum","mean","max","min"], "利润":["sum","mean"]})。',
      validation: '正确使用agg对多列应用多个聚合函数',
    },
    {
      id: 'task-02-4',
      title: 'transform计算组内排名',
      description: '使用transform计算每条记录在其门店内的销售额排名和利润排名，添加"门店销售排名"和"门店利润排名"列。',
      hint: '使用 df.groupby("门店")["销售额"].transform(lambda x: x.rank(ascending=False)) 计算组内排名。',
      validation: '正确使用transform计算组内排名',
    },
    {
      id: 'task-02-5',
      title: '自定义分组分析',
      description: '使用apply找出每个门店利润率最高的品类，并使用pivot_table生成门店×品类的销售额透视表。',
      hint: 'apply: df.groupby("门店").apply(lambda x: x.loc[x["利润"].idxmax(),"品类"])，pivot_table: pd.pivot_table(df, values="销售额", index="门店", columns="品类", aggfunc="sum")。',
      validation: '正确使用apply和pivot_table进行分析',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np

# 数据集已加载到变量 df 中
# df 包含列：门店、品类、日期、销售额、数量、成本、利润

# 任务1: 按品类分组统计
# 在这里编写你的代码

# 任务2: 多维度分组分析
# 在这里编写你的代码

# 任务3: 使用agg多函数聚合
# 在这里编写你的代码

# 任务4: transform计算组内排名
# 在这里编写你的代码

# 任务5: 自定义分组分析
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np

# 任务1: 按品类分组统计
cat_stats = df.groupby('品类').agg(
    总销售额=('销售额', 'sum'),
    平均利润=('利润', 'mean'),
    订单数=('门店', 'count'),
).sort_values('总销售额', ascending=False)
print("=== 按品类分组统计 ===")
print(cat_stats.round(2))

# 任务2: 多维度分组分析
multi_stats = df.groupby(['门店', '品类']).agg(
    总销售额=('销售额', 'sum'),
    总利润=('利润', 'sum'),
).reset_index()
multi_stats['利润率'] = (multi_stats['总利润'] / multi_stats['总销售额'] * 100).round(2)
print("\\n=== 多维度分组分析 ===")
print(multi_stats.head(15))

# 任务3: 使用agg多函数聚合
agg_result = df.groupby('品类').agg({
    '销售额': ['sum', 'mean', 'max', 'min'],
    '利润': ['sum', 'mean'],
}).round(2)
print("\\n=== agg多函数聚合 ===")
print(agg_result)

# 任务4: transform计算组内排名
df['门店销售排名'] = df.groupby('门店')['销售额'].transform(lambda x: x.rank(ascending=False))
df['门店利润排名'] = df.groupby('门店')['利润'].transform(lambda x: x.rank(ascending=False))
print("\\n=== 组内排名 ===")
print(df[['门店', '品类', '销售额', '利润', '门店销售排名', '门店利润排名']].head(10))

# 任务5: 自定义分组分析
best_cat_per_store = df.groupby('门店').apply(lambda x: x.loc[x['利润'].idxmax(), '品类'])
print("\\n=== 各门店利润最高品类 ===")
print(best_cat_per_store)

pivot = pd.pivot_table(df, values='销售额', index='门店', columns='品类', aggfunc='sum', fill_value=0).round(2)
print("\\n=== 门店×品类销售额透视表 ===")
print(pivot)
`,
  keyPoints: ['groupby基本用法', 'agg多函数聚合', 'transform组内变换', 'apply自定义函数', '多级分组', 'pivot_table透视表'],
  outline: [
    {
      title: 'GroupBy基础',
      items: [
        {
          title: 'groupby原理与分组对象',
          content: 'groupby()是Pandas分组操作的核心方法，遵循"拆分-应用-合并"（Split-Apply-Combine）范式：先将数据按指定列拆分为多个组，对每组独立应用函数，最后合并结果。groupby()返回一个GroupBy对象，它是惰性求值的，只有在调用聚合/变换方法时才真正执行计算。可以按单列分组（df.groupby("列名")），也可以按多列分组（df.groupby(["列1","列2"])）。',
          codeExample: `grouped = df.groupby('品类')
print(type(grouped))  # DataFrameGroupBy对象
result = grouped['销售额'].sum()  # 触发实际计算
print(result)`,
          importance: 'core',
        },
        {
          title: '迭代分组与分组大小',
          content: 'GroupBy对象支持迭代，每次迭代返回(组名, 组数据)元组，可以逐组处理数据。groups属性返回字典，键为组名，值为该组的行索引。size()方法返回每组的大小（含NaN），count()返回每列非NaN计数。ngroups属性返回分组数量。这些方法帮助了解分组结构，在调试和探索性分析时非常有用。',
          codeExample: `for name, group in df.groupby('品类'):
    print(f'{name}: {len(group)}条')
print(df.groupby('品类').size())
print(df.groupby('品类').ngroups)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '聚合函数',
      items: [
        {
          title: '内置聚合函数',
          content: 'GroupBy对象提供了丰富的内置聚合方法：sum()求和、mean()均值、count()计数、max()最大值、min()最小值、std()标准差、var()方差、median()中位数等。这些方法可以直接对分组后的对象调用，如df.groupby("品类")["销售额"].sum()。也可以同时对多列聚合：df.groupby("品类")[["销售额","利润"]].mean()。内置方法效率高，应优先使用。',
          codeExample: `cat_stats = df.groupby('品类')['销售额'].agg(['sum', 'mean', 'count'])
print(cat_stats)
# 多列多指标
df.groupby('品类')[['销售额', '利润']].mean()`,
          importance: 'core',
        },
        {
          title: 'agg多函数聚合',
          content: 'agg()方法允许同时对一列或多列应用多个聚合函数。传入函数名列表如agg(["sum","mean"])，或传入字典指定每列的聚合方式如agg({"销售额":"sum","利润":"mean"})。还支持传入自定义函数。agg是分组聚合最灵活的方法，可以一次计算多种统计量，避免多次分组操作，显著提升代码效率和可读性。',
          codeExample: `df.groupby('品类').agg({
    '销售额': ['sum', 'mean', 'max'],
    '利润': ['sum', 'mean'],
    '门店': 'count'
})`,
          importance: 'important',
        },
        {
          title: '命名聚合',
          content: '命名聚合（Named Aggregation）使用pd.NamedAgg或元组语法为聚合结果指定列名，避免多层列索引的困扰。语法为agg(新列名=(原列名, 函数名))。这种方式生成的结果DataFrame具有清晰的列名，不再有MultiIndex，便于后续引用和处理。命名聚合是Pandas 0.25+引入的特性，是推荐的聚合写法。',
          codeExample: `df.groupby('品类').agg(
    总销售额=('销售额', 'sum'),
    平均利润=('利润', 'mean'),
    订单数=('门店', 'count')
)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '组内变换',
      items: [
        {
          title: 'transform方法',
          content: 'transform()方法对每组应用函数后，返回与原DataFrame相同长度的结果，而不是聚合为每行一个结果。这是transform与agg的核心区别。transform的结果会"广播"回原始行的位置，方便将组级统计量添加为新列。例如计算每个学生在班级中的排名、每个员工在部门中的薪资百分位等。transform的结果形状必须与输入组一致或可广播。',
          codeExample: `df['品类平均销售额'] = df.groupby('品类')['销售额'].transform('mean')
df['门店内排名'] = df.groupby('门店')['销售额'].transform(lambda x: x.rank(ascending=False))`,
          importance: 'core',
        },
        {
          title: '组内标准化与排名',
          content: '利用transform可以方便地进行组内标准化（Z-Score标准化）：(x - x.mean()) / x.std()，消除不同组之间的量纲差异。组内排名使用rank()方法，ascending=False为降序排名。组内差值计算当前值与组均值的差异。这些操作在对比分析中非常实用，如比较不同门店的相对表现而非绝对数值。',
          codeExample: `df['组内标准化'] = df.groupby('品类')['销售额'].transform(lambda x: (x - x.mean()) / x.std())
df['组内排名'] = df.groupby('门店')['销售额'].transform('rank', ascending=False)
df['与组均值差'] = df.groupby('品类')['销售额'].transform(lambda x: x - x.mean())`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '自定义操作',
      items: [
        {
          title: 'apply函数',
          content: 'apply()是最灵活的分组操作方法，可以对每组应用任意函数。与agg和transform不同，apply的返回值没有形状限制，可以返回标量、Series或DataFrame。apply适合处理复杂的组级逻辑，如找出每组中满足条件的行、对每组进行多步计算等。但apply性能较低，能用agg/transform实现的应优先使用它们。',
          codeExample: `# 找出每个门店利润最高的品类
df.groupby('门店').apply(lambda x: x.loc[x['利润'].idxmax(), '品类'])
# 每组自定义计算
df.groupby('品类').apply(lambda x: pd.Series({
    '利润率': x['利润'].sum() / x['销售额'].sum()
}))`,
          importance: 'core',
        },
        {
          title: 'filter过滤与pipe管道',
          content: 'filter()方法根据组级条件过滤整个组，保留满足条件的组。例如filter(lambda x: x["销售额"].sum() > 10000)只保留总销售额超过1万的品类。pipe()方法将GroupBy对象传入函数，便于链式操作和方法组合。filter适合按组级统计量筛选数据，pipe适合将分组操作整合到数据处理管道中。',
          codeExample: `# 只保留订单数超过50的品类
big_cats = df.groupby('品类').filter(lambda x: len(x) > 50)
# pipe链式操作
result = (df.groupby('品类')
    .pipe(lambda x: x['销售额'].sum())
    .sort_values(ascending=False))`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '透视表',
      items: [
        {
          title: 'pivot_table基础',
          content: 'pivot_table()是创建透视表的便捷方法，类似于Excel的数据透视表。核心参数：values指定要聚合的值列，index指定行维度，columns指定列维度，aggfunc指定聚合函数（默认mean）。margins=True添加行列合计。fill_value填充缺失值。透视表将长格式数据转为宽格式，便于交叉对比分析。',
          codeExample: `pivot = pd.pivot_table(df, values='销售额', index='门店', columns='品类', aggfunc='sum', fill_value=0)
print(pivot)
pivot_mean = pd.pivot_table(df, values='销售额', index='门店', aggfunc='mean')`,
          importance: 'core',
        },
        {
          title: '多级透视与melt反透视',
          content: 'pivot_table支持多级索引和列：index=["门店","品类"]创建多级行索引，columns也可以是多列。melt()是pivot_table的逆操作，将宽格式数据"融化"为长格式。id_vars指定保留的标识列，value_vars指定要融化的值列。多级透视适合多维度交叉分析，melt适合将透视结果转回长格式以便后续处理。',
          codeExample: `# 多级透视
pivot_multi = pd.pivot_table(df, values='销售额', index=['门店'], columns=['品类'], aggfunc=['sum', 'mean'])
# melt反透视
long_df = pd.melt(pivot.reset_index(), id_vars=['门店'], var_name='品类', value_name='销售额')`,
          importance: 'important',
        },
        {
          title: 'crosstab交叉表',
          content: 'crosstab()计算两个（或多个）因子的交叉频率表，默认计算频数。与pivot_table不同，crosstab可以直接接受数组而非DataFrame列。normalize参数可计算比例：normalize="index"按行归一化，normalize="columns"按列归一化，normalize=True按总计归一化。margins=True添加行列合计。crosstab常用于分析两个分类变量的关联关系。',
          codeExample: `ct = pd.crosstab(df['门店'], df['品类'])
ct_pct = pd.crosstab(df['门店'], df['品类'], normalize='index')  # 行百分比
ct_sum = pd.crosstab(df['门店'], df['品类'], values=df['销售额'], aggfunc='sum')`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目3: 购物篮分析 ==========
export const project3: BootcampProject = {
  id: 'bootcamp-03',
  title: '购物篮分析',
  description: '通过分析超市交易流水数据，学习购物篮分析的核心方法，包括交叉表、频繁项集挖掘和关联规则计算，发现商品间的搭配规律。',
  difficulty: 'elementary',
  difficultyLabel: '初级',
  tags: ['购物篮分析', '关联规则', '交叉表', '频繁项集', '组合分析'],
  datasetCode: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from itertools import combinations

np.random.seed(456)

# 商品池
products = ['牛奶', '面包', '鸡蛋', '苹果', '香蕉', '啤酒', '薯片', '纸巾', '洗衣液', '酸奶',
            '巧克力', '咖啡', '茶叶', '大米', '食用油', '方便面', '火腿肠', '可乐', '矿泉水', '饼干']

# 商品关联组合（经常一起购买）
combos = [
    ['牛奶', '面包', '鸡蛋'],
    ['啤酒', '薯片'],
    ['酸奶', '香蕉'],
    ['纸巾', '洗衣液'],
    ['方便面', '火腿肠', '可乐'],
    ['咖啡', '巧克力'],
    ['大米', '食用油'],
]

n_orders = 5000
order_ids = []
product_list = []
quantities = []
amounts = []
timestamps = []

for i in range(n_orders):
    order_id = f'TXN{i:06d}'
    ts = datetime(2024, 1, 1) + timedelta(
        days=int(np.random.randint(0, 90)),
        hours=int(np.random.randint(8, 22)),
        minutes=int(np.random.randint(0, 60))
    )

    # 70%概率选择关联组合，30%随机
    if np.random.random() < 0.7:
        combo = combos[np.random.randint(len(combos))]
        selected = combo.copy()
        # 可能额外添加1-2个随机商品
        if np.random.random() < 0.4:
            extra = np.random.choice([p for p in products if p not in selected], size=np.random.randint(1, 3), replace=False)
            selected.extend(extra.tolist())
    else:
        n_items = np.random.randint(1, 5)
        selected = np.random.choice(products, size=n_items, replace=False).tolist()

    for prod in selected:
        order_ids.append(order_id)
        product_list.append(prod)
        quantities.append(np.random.randint(1, 6))
        amounts.append(round(np.random.uniform(5, 80), 2))
        timestamps.append(ts)

df = pd.DataFrame({
    '订单ID': order_ids,
    '商品名': product_list,
    '数量': quantities,
    '金额': amounts,
    '时间': timestamps,
})`,
  datasetDescription: '模拟超市交易流水数据，约5000个订单的商品明细，字段包括：订单ID、商品名、数量、金额、时间。商品间存在关联购买模式。',
  tasks: [
    {
      id: 'task-03-1',
      title: '构建购物篮矩阵',
      description: '使用crosstab构建订单×商品的购物篮矩阵（0/1矩阵），每行是一个订单，每列是商品，1表示购买。',
      hint: '使用 pd.crosstab(df["订单ID"], df["商品名"]) 构建交叉表，然后转为0/1矩阵：basket = (crosstab > 0).astype(int)。',
      validation: '正确构建购物篮0/1矩阵',
    },
    {
      id: 'task-03-2',
      title: '计算商品支持度',
      description: '计算每个商品的支持度（包含该商品的订单占比），找出支持度最高的5个商品。',
      hint: '支持度 = 商品出现次数 / 总订单数，使用 basket.mean() 或 basket.sum() / len(basket)。',
      validation: '正确计算各商品支持度并找出TOP5',
    },
    {
      id: 'task-03-3',
      title: '找出频繁商品组合',
      description: '计算所有两商品组合的支持度，找出支持度大于0.05的频繁商品对。',
      hint: '遍历所有两商品组合，计算同时出现的订单占比：basket[list(pair)].all(axis=1).mean()。',
      validation: '正确计算两商品组合支持度并找出频繁组合',
    },
    {
      id: 'task-03-4',
      title: '计算关联规则置信度',
      description: '对频繁商品对(A,B)，计算A→B的置信度（购买A后也购买B的概率）和B→A的置信度。',
      hint: '置信度(A→B) = 支持度(A,B) / 支持度(A)，即 P(B|A) = 同时购买AB的订单数 / 购买A的订单数。',
      validation: '正确计算关联规则的置信度',
    },
    {
      id: 'task-03-5',
      title: '分析商品搭配推荐',
      description: '计算提升度（Lift），找出提升度最高的商品对，输出搭配推荐建议。提升度=置信度/支持度(B)。',
      hint: '提升度(A→B) = 置信度(A→B) / 支持度(B)，提升度>1表示正相关，<1表示负相关。',
      validation: '正确计算提升度并输出搭配推荐',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np
from itertools import combinations

# 数据集已加载到变量 df 中
# df 包含列：订单ID、商品名、数量、金额、时间

# 任务1: 构建购物篮矩阵
# 在这里编写你的代码

# 任务2: 计算商品支持度
# 在这里编写你的代码

# 任务3: 找出频繁商品组合
# 在这里编写你的代码

# 任务4: 计算关联规则置信度
# 在这里编写你的代码

# 任务5: 分析商品搭配推荐
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np
from itertools import combinations

# 任务1: 构建购物篮矩阵
basket = pd.crosstab(df['订单ID'], df['商品名'])
basket = (basket > 0).astype(int)
print("=== 购物篮矩阵 ===")
print(f"矩阵形状: {basket.shape} (订单数×商品数)")
print(basket.head())

# 任务2: 计算商品支持度
support = basket.mean().sort_values(ascending=False)
print("\\n=== 商品支持度 ===")
print(support.round(4))
print(f"\\n支持度TOP5: {support.head(5).to_dict()}")

# 任务3: 找出频繁商品组合
n_orders = len(basket)
freq_pairs = []
for pair in combinations(basket.columns, 2):
    pair_support = basket[list(pair)].all(axis=1).mean()
    if pair_support > 0.05:
        freq_pairs.append({'商品A': pair[0], '商品B': pair[1], '支持度': pair_support})

freq_df = pd.DataFrame(freq_pairs).sort_values('支持度', ascending=False)
print("\\n=== 频繁商品对（支持度>0.05）===")
print(freq_df.to_string(index=False))

# 任务4: 计算关联规则置信度
rules = []
for _, row in freq_df.iterrows():
    a, b = row['商品A'], row['商品B']
    support_a = basket[a].mean()
    support_b = basket[b].mean()
    support_ab = row['支持度']
    conf_ab = support_ab / support_a
    conf_ba = support_ab / support_b
    rules.append({
        '规则': f'{a}→{b}',
        '置信度': round(conf_ab, 4),
        '规则2': f'{b}→{a}',
        '置信度2': round(conf_ba, 4),
    })

rules_df = pd.DataFrame(rules)
print("\\n=== 关联规则置信度 ===")
print(rules_df.to_string(index=False))

# 任务5: 分析商品搭配推荐
recommendations = []
for _, row in freq_df.iterrows():
    a, b = row['商品A'], row['商品B']
    support_a = basket[a].mean()
    support_b = basket[b].mean()
    support_ab = row['支持度']
    lift_ab = (support_ab / support_a) / support_b
    lift_ba = (support_ab / support_b) / support_a
    recommendations.append({
        '商品A': a, '商品B': b,
        '支持度': round(support_ab, 4),
        'Lift(A→B)': round(lift_ab, 4),
        'Lift(B→A)': round(lift_ba, 4),
    })

rec_df = pd.DataFrame(recommendations).sort_values('Lift(A→B)', ascending=False)
print("\\n=== 商品搭配推荐（按Lift排序）===")
print(rec_df.head(10).to_string(index=False))
print("\\n搭配建议:")
for _, row in rec_df.head(3).iterrows():
    print(f"  购买{row['商品A']}的顾客推荐{row['商品B']}（Lift={row['Lift(A→B)']}）")
`,
  keyPoints: ['交叉表crosstab', '频繁项集挖掘', '支持度计算', '置信度计算', '提升度Lift', '关联规则', '组合分析'],
  outline: [
    {
      title: '交易数据准备',
      items: [
        {
          title: '读取与清洗交易数据',
          content: '购物篮分析的第一步是准备交易数据。交易数据通常为长格式：每行代表一个订单中的一个商品，包含订单ID和商品名。需要检查数据中的缺失值（如商品名为空）、重复记录和异常值。清洗后确保每个订单的商品记录完整准确。数据质量直接影响后续关联规则挖掘的可靠性，因此数据准备阶段需要仔细处理。',
          codeExample: `df = df.dropna(subset=['订单ID', '商品名'])
df = df.drop_duplicates()
print(f'订单数: {df["订单ID"].nunique()}, 商品种类: {df["商品名"].nunique()}')`,
          importance: 'core',
        },
        {
          title: '构建购物篮与编码转换',
          content: '购物篮分析需要将交易数据转换为0/1矩阵格式：每行是一个订单，每列是一个商品，1表示购买，0表示未购买。使用pd.crosstab()可以快速构建交叉表，再通过(basket > 0).astype(int)转为0/1矩阵。也可以用groupby+unstack实现。编码转换是关联规则挖掘的必要前提，Apriori等算法要求输入为0/1矩阵。',
          codeExample: `basket = pd.crosstab(df['订单ID'], df['商品名'])
basket = (basket > 0).astype(int)
print(f'购物篮矩阵形状: {basket.shape}')
print(basket.head())`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '频繁项集',
      items: [
        {
          title: '支持度概念',
          content: '支持度（Support）是衡量商品或商品组合出现频率的指标，定义为包含该项集的订单数占总订单数的比例。支持度(A) = 包含A的订单数 / 总订单数。支持度越高，说明该商品组合越常见。最小支持度阈值用于筛选有意义的频繁项集，过低会包含太多偶然组合，过高会遗漏有价值的低频组合。通常设为0.01-0.1之间。',
          codeExample: `support = basket.mean()  # 每个商品的支持度
print(support.sort_values(ascending=False).head())
min_support = 0.05
frequent_items = support[support >= min_support]`,
          importance: 'core',
        },
        {
          title: 'Apriori原理与频繁项集挖掘',
          content: 'Apriori原理是关联规则挖掘的核心：如果一个项集是频繁的，则它的所有子集也是频繁的；反之，如果一个项集是非频繁的，则它的所有超集也是非频繁的。基于此原理，Apriori算法逐层搜索：先找频繁1-项集，再组合生成2-项集候选，筛选频繁2-项集，以此类推。这大大减少了候选集数量，提高了挖掘效率。',
          codeExample: `from itertools import combinations
freq_pairs = []
for pair in combinations(basket.columns, 2):
    sup = basket[list(pair)].all(axis=1).mean()
    if sup >= 0.05:
        freq_pairs.append({'商品对': pair, '支持度': sup})
print(pd.DataFrame(freq_pairs).sort_values('支持度', ascending=False))`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '关联规则',
      items: [
        {
          title: '置信度',
          content: '置信度（Confidence）衡量规则的可靠性，定义为在包含A的订单中同时也包含B的比例，即P(B|A) = 支持度(A,B) / 支持度(A)。置信度越高，说明购买A后购买B的概率越大。但置信度可能产生误导：如果B本身就很畅销，即使A和B无关，置信度也可能很高。因此需要结合提升度一起判断规则的有效性。',
          codeExample: `conf_AB = basket[basket['牛奶'] == 1]['面包'].mean()
print(f'置信度(牛奶→面包): {conf_AB:.4f}')
# 等价于: support_AB / support_A`,
          importance: 'core',
        },
        {
          title: '提升度与杠杆率',
          content: '提升度（Lift）是衡量规则实际价值的指标：Lift(A→B) = 置信度(A→B) / 支持度(B) = P(A,B) / (P(A)×P(B))。Lift>1表示A和B正相关（购买A促进B的购买），Lift=1表示独立，Lift<1表示负相关。杠杆率（Leverage）= P(A,B) - P(A)×P(B)，衡量共现概率与独立假设的偏差。Conviction = (1-Support(B))/(1-Confidence(A→B))，衡量规则的方向性强度。',
          codeExample: `lift = conf_AB / basket['面包'].mean()
print(f'提升度(牛奶→面包): {lift:.4f}')
leverage = basket[['牛奶','面包']].all(axis=1).mean() - basket['牛奶'].mean() * basket['面包'].mean()
print(f'杠杆率: {leverage:.4f}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '结果分析',
      items: [
        {
          title: '规则筛选与排序',
          content: '挖掘出的关联规则通常数量庞大，需要按业务需求筛选和排序。常用筛选条件：最小支持度（如>0.01）、最小置信度（如>0.3）、最小提升度（如>1.2）。排序可以按提升度、置信度或综合得分排列。筛选后保留的规则应既有统计意义又有业务价值。避免选择提升度虽高但支持度极低的规则，这类规则缺乏实际指导意义。',
          codeExample: `rules_df = rules_df[(rules_df['支持度'] > 0.01) & (rules_df['置信度'] > 0.3) & (rules_df['提升度'] > 1.2)]
rules_df = rules_df.sort_values('提升度', ascending=False)
print(f'筛选后规则数: {len(rules_df)}')
print(rules_df.head(10))`,
          importance: 'core',
        },
        {
          title: '规则可视化与业务解读',
          content: '关联规则的可视化常用方法包括：散点图（支持度为x轴、置信度为y轴、提升度为气泡大小）、网络图（商品为节点、规则为边、提升度为边的粗细）、热力图（商品对的支持度/置信度矩阵）。业务解读需要将统计指标转化为可操作建议：如"购买啤酒的顾客有60%概率同时购买薯片，提升度2.5，建议将两者放在相邻货架"。',
          codeExample: `import matplotlib.pyplot as plt
plt.scatter(rules_df['支持度'], rules_df['置信度'], s=rules_df['提升度']*20, alpha=0.6)
plt.xlabel('支持度'); plt.ylabel('置信度'); plt.title('关联规则散点图')
plt.show()`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目4: 客户聚类分析 ==========
export const project4: BootcampProject = {
  id: 'bootcamp-04',
  title: '客户聚类分析',
  description: '通过K-Means聚类算法对客户消费行为数据进行分群，学习数据标准化、肘部法则确定聚类数、聚类结果分析和客户画像构建。',
  difficulty: 'intermediate',
  difficultyLabel: '中级',
  tags: ['聚类分析', 'K-Means', '客户画像', '标准化', '肘部法则'],
  datasetCode: `import pandas as pd
import numpy as np

np.random.seed(789)

n = 500

# 模拟3类客户
n1, n2, n3 = 200, 180, 120

# 高价值客户：高消费、高频次、最近购买
c1 = pd.DataFrame({
    '消费金额': np.random.normal(8000, 1500, n1),
    '购买频次': np.random.normal(25, 5, n1),
    '最近购买天数': np.random.normal(10, 5, n1),
    '平均客单价': np.random.normal(320, 50, n1),
})

# 中等客户：中等消费、中频次
c2 = pd.DataFrame({
    '消费金额': np.random.normal(3000, 800, n2),
    '购买频次': np.random.normal(12, 3, n2),
    '最近购买天数': np.random.normal(30, 10, n2),
    '平均客单价': np.random.normal(180, 30, n2),
})

# 低价值客户：低消费、低频次、久未购买
c3 = pd.DataFrame({
    '消费金额': np.random.normal(800, 400, n3),
    '购买频次': np.random.normal(4, 2, n3),
    '最近购买天数': np.random.normal(60, 20, n3),
    '平均客单价': np.random.normal(80, 25, n3),
})

df = pd.concat([c1, c2, c3], ignore_index=True)
df = df.round(2)

# 确保数值合理
df['消费金额'] = df['消费金额'].clip(lower=0)
df['购买频次'] = df['购买频次'].clip(lower=1).round(0).astype(int)
df['最近购买天数'] = df['最近购买天数'].clip(lower=1)
df['平均客单价'] = df['平均客单价'].clip(lower=10)

# 添加品类偏好
categories = ['电子', '服装', '食品', '家居', '美妆']
df['品类偏好'] = np.random.choice(categories, n)

df.insert(0, '客户ID', [f'C{i:04d}' for i in range(1, n + 1)])
df = df.sample(frac=1, random_state=42).reset_index(drop=True)`,
  datasetDescription: '模拟500个客户的消费行为数据，字段包括：客户ID、消费金额、购买频次、最近购买天数、平均客单价、品类偏好。客户自然分为3个群体。',
  tasks: [
    {
      id: 'task-04-1',
      title: '数据标准化',
      description: '选取数值特征列，使用StandardScaler进行标准化处理，使各特征均值为0、标准差为1。',
      hint: 'from sklearn.preprocessing import StandardScaler，scaler.fit_transform(df[数值列])。',
      validation: '正确对数值特征进行标准化',
    },
    {
      id: 'task-04-2',
      title: '确定最优聚类数',
      description: '使用肘部法则，对K=2到8分别计算K-Means的惯性（inertia），绘制肘部图确定最优K值。',
      hint: 'from sklearn.cluster import KMeans，遍历K值，记录 KMeans(n_clusters=k).fit(data).inertia_。',
      validation: '正确计算各K值的inertia并绘制肘部图',
    },
    {
      id: 'task-04-3',
      title: '执行K-Means聚类',
      description: '使用最优K值执行K-Means聚类，将聚类标签添加到原始DataFrame中。',
      hint: 'km = KMeans(n_clusters=k, random_state=42, n_init=10)，df["聚类标签"] = km.fit_predict(scaled_data)。',
      validation: '正确执行K-Means聚类并添加标签',
    },
    {
      id: 'task-04-4',
      title: '分析各簇特征',
      description: '按聚类标签分组，计算各簇的消费金额、购买频次、最近购买天数、平均客单价的均值，分析每簇特征。',
      hint: 'df.groupby("聚类标签")[数值列].mean()，观察各簇的数值特征差异。',
      validation: '正确分析各簇的数值特征',
    },
    {
      id: 'task-04-5',
      title: '输出客户画像',
      description: '根据各簇特征为每簇命名（如高价值客户、中等客户、低价值客户），统计各簇人数和占比，输出客户画像摘要。',
      hint: '根据各簇均值特征命名，使用 value_counts(normalize=True) 计算占比。',
      validation: '正确命名各簇并输出客户画像',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# 数据集已加载到变量 df 中
# df 包含列：客户ID、消费金额、购买频次、最近购买天数、平均客单价、品类偏好

# 任务1: 数据标准化
# 在这里编写你的代码

# 任务2: 确定最优聚类数
# 在这里编写你的代码

# 任务3: 执行K-Means聚类
# 在这里编写你的代码

# 任务4: 分析各簇特征
# 在这里编写你的代码

# 任务5: 输出客户画像
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# 任务1: 数据标准化
feature_cols = ['消费金额', '购买频次', '最近购买天数', '平均客单价']
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df[feature_cols])
scaled_df = pd.DataFrame(scaled_data, columns=feature_cols)
print("=== 标准化后数据统计 ===")
print(scaled_df.describe().round(4))

# 任务2: 确定最优聚类数
inertias = []
K_range = range(2, 9)
for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(scaled_data)
    inertias.append(km.inertia_)
    print(f"K={k}, Inertia={km.inertia_:.2f}")

print("\\n肘部法则：观察Inertia下降速度变缓的拐点即为最优K值")

# 任务3: 执行K-Means聚类
optimal_k = 3
km = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
df['聚类标签'] = km.fit_predict(scaled_data)
print(f"\\n=== K-Means聚类结果（K={optimal_k}）===")
print(df['聚类标签'].value_counts().sort_index())

# 任务4: 分析各簇特征
cluster_stats = df.groupby('聚类标签')[feature_cols].mean().round(2)
print("\\n=== 各簇特征均值 ===")
print(cluster_stats)

# 任务5: 输出客户画像
cluster_counts = df['聚类标签'].value_counts().sort_index()
cluster_pcts = (cluster_counts / len(df) * 100).round(1)

# 根据特征命名
cluster_names = {}
for label in sorted(df['聚类标签'].unique()):
    row = cluster_stats.loc[label]
    if row['消费金额'] > 6000 and row['购买频次'] > 20:
        cluster_names[label] = '高价值客户'
    elif row['消费金额'] > 2000 and row['购买频次'] > 8:
        cluster_names[label] = '中等客户'
    else:
        cluster_names[label] = '低价值客户'

df['客户类型'] = df['聚类标签'].map(cluster_names)

print("\\n=== 客户画像 ===")
for label, name in cluster_names.items():
    count = cluster_counts[label]
    pct = cluster_pcts[label]
    row = cluster_stats.loc[label]
    print(f"\\n【{name}】(簇{label}): {count}人, 占比{pct}%")
    print(f"  平均消费金额: ¥{row['消费金额']:,.2f}")
    print(f"  平均购买频次: {row['购买频次']:.0f}次")
    print(f"  平均最近购买: {row['最近购买天数']:.0f}天前")
    print(f"  平均客单价: ¥{row['平均客单价']:,.2f}")
`,
  keyPoints: ['K-Means聚类', 'StandardScaler标准化', '肘部法则', '轮廓系数', '聚类结果分析', '客户画像构建'],
  outline: [
    {
      title: '数据预处理',
      items: [
        {
          title: '特征选择',
          content: '聚类分析的特征选择至关重要，直接影响聚类效果。应选择能反映样本差异的特征，避免冗余和无关特征。对于客户聚类，常用RFM特征（最近购买时间、购买频次、消费金额）及衍生指标。特征间应尽量独立，高度相关的特征会导致某一维度权重过大。类别特征需要编码或排除，聚类算法通常只能处理数值特征。',
          codeExample: `feature_cols = ['消费金额', '购买频次', '最近购买天数', '平均客单价']
X = df[feature_cols]
print(X.describe())`,
          importance: 'core',
        },
        {
          title: '标准化与归一化',
          content: '聚类算法基于距离度量，不同特征的量纲差异会严重影响结果。StandardScaler将特征转为均值0、标准差1的标准正态分布，适合大多数聚类场景。MinMaxScaler将特征缩放到[0,1]区间，适合已知特征边界的情况。标准化是聚类的必要步骤，否则量纲大的特征会主导距离计算。注意：标准化应在训练集上fit，再transform测试集。',
          codeExample: `from sklearn.preprocessing import StandardScaler, MinMaxScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[feature_cols])
# MinMaxScaler归一化到[0,1]
X_norm = MinMaxScaler().fit_transform(df[feature_cols])`,
          importance: 'important',
        },
        {
          title: '距离度量',
          content: '聚类算法依赖距离度量衡量样本相似性。欧氏距离（Euclidean）最常用，衡量空间中两点直线距离。曼哈顿距离（Manhattan）沿坐标轴方向计算距离之和。余弦相似度衡量方向相似性，适合文本等高维稀疏数据。选择距离度量应考虑数据特性：连续数值用欧氏距离，稀疏向量用余弦距离。距离度量直接影响聚类形状和结果。',
          codeExample: `from sklearn.metrics import pairwise_distances
euclidean = pairwise_distances(X_scaled[:5], metric='euclidean')
manhattan = pairwise_distances(X_scaled[:5], metric='manhattan')
print('欧氏距离:\\n', euclidean)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: 'K-Means聚类',
      items: [
        {
          title: 'K-Means原理',
          content: 'K-Means是最经典的聚类算法，目标是将n个样本划分为K个簇，使簇内样本到簇中心的距离之和最小。算法流程：1）随机初始化K个簇中心；2）将每个样本分配到最近的簇中心；3）重新计算每个簇的中心（均值）；4）重复2-3直到收敛。K-Means简单高效，时间复杂度O(nKt)，但假设簇为球形，对非凸形状效果差。',
          codeExample: `from sklearn.cluster import KMeans
km = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = km.fit_predict(X_scaled)
print(f'簇中心:\\n{km.cluster_centers_}')
print(f'惯性: {km.inertia_:.2f}')`,
          importance: 'core',
        },
        {
          title: '初始化方法与收敛条件',
          content: 'K-Means对初始化敏感，随机初始化可能导致局部最优解。K-Means++初始化策略通过概率选择初始中心，使中心尽量分散，显著提高全局最优的概率。n_init参数控制运行次数，取最优结果（默认10次）。收敛条件为簇中心不再变化或变化小于tol阈值。max_iter限制最大迭代次数。sklearn默认使用K-Means++初始化，推荐保持。',
          codeExample: `km = KMeans(n_clusters=3, init='k-means++', n_init=10, max_iter=300, tol=1e-4, random_state=42)
labels = km.fit_predict(X_scaled)
print(f'迭代次数: {km.n_iter_}, 惯性: {km.inertia_:.2f}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '最优K值',
      items: [
        {
          title: '肘部法则',
          content: '肘部法则（Elbow Method）通过绘制不同K值对应的惯性（inertia，簇内平方和）曲线来确定最优K值。随着K增大，惯性单调递减，但递减速度会在某个K值处明显放缓，形成"肘部"。肘部对应的K值即为最优聚类数，因为此后增加K带来的改善不再显著。肘部法则直观易用，但肘部位置有时不明显，需要结合其他方法辅助判断。',
          codeExample: `inertias = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)
    print(f'K={k}, Inertia={km.inertia_:.2f}')`,
          importance: 'core',
        },
        {
          title: '轮廓系数',
          content: '轮廓系数（Silhouette Score）衡量聚类的紧密度和分离度，取值范围[-1,1]。对每个样本计算：s = (b-a) / max(a,b)，其中a为簇内平均距离，b为到最近其他簇的平均距离。轮廓系数越接近1表示聚类越好，接近0表示在边界上，为负表示分错簇。轮廓系数不依赖K值，可以客观比较不同K的聚类质量，是最常用的聚类评估指标。',
          codeExample: `from sklearn.metrics import silhouette_score
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)
    print(f'K={k}, 轮廓系数={score:.4f}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '聚类结果分析',
      items: [
        {
          title: '簇中心分析与特征画像',
          content: '聚类完成后，分析簇中心是理解每簇特征的关键。将标准化后的簇中心逆变换回原始尺度，可以直观理解每簇的实际含义。按簇分组计算各特征均值，对比簇间差异，为每簇命名。例如某簇消费金额高、购买频次高、最近购买天数少，可命名为"高价值客户"。特征画像将统计结果转化为业务语言，是聚类分析的核心输出。',
          codeExample: `cluster_stats = df.groupby('聚类标签')[feature_cols].mean().round(2)
print(cluster_stats)
# 逆变换簇中心到原始尺度
centers = scaler.inverse_transform(km.cluster_centers_)
print(pd.DataFrame(centers, columns=feature_cols).round(2))`,
          importance: 'core',
        },
        {
          title: '可视化与业务解读',
          content: '聚类结果的可视化帮助直观理解簇的分布和分离情况。PCA降维到2D/3D后绘制散点图是最常用的方法，不同簇用不同颜色标记。t-SNE更适合保留局部结构，但计算较慢。业务解读需要将聚类结果转化为可操作策略：如对不同客户群体制定差异化营销方案、对异常簇进行深入调查等。聚类的价值在于驱动业务决策。',
          codeExample: `from sklearn.decomposition import PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
import matplotlib.pyplot as plt
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=labels, cmap='Set2', alpha=0.6)
plt.xlabel('PC1'); plt.ylabel('PC2'); plt.title('聚类结果PCA可视化')
plt.show()`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目5: 数据可视化 ==========
export const project5: BootcampProject = {
  id: 'bootcamp-05',
  title: '数据可视化',
  description: '通过分析公司年度经营数据，学习使用matplotlib和seaborn创建多种图表，包括折线图、柱状图、饼图、热力图等，掌握图表美化技巧。',
  difficulty: 'elementary',
  difficultyLabel: '初级',
  tags: ['数据可视化', 'matplotlib', 'seaborn', '图表美化', '中文显示'],
  datasetCode: `import pandas as pd
import numpy as np

np.random.seed(2024)

months = list(range(1, 13))
month_names = [f'{m}月' for m in months]

# 收入与成本
base_revenue = np.array([120, 115, 130, 140, 155, 160, 145, 150, 165, 170, 180, 200]) * 10000
revenue = base_revenue + np.random.normal(0, 5000, 12)
cost = revenue * np.random.uniform(0.55, 0.75, 12)
profit = revenue - cost

# 产品线销量
product_lines = ['产品A', '产品B', '产品C', '产品D']
product_sales = {}
for p in product_lines:
    base = np.random.randint(100, 500)
    trend = np.linspace(0, np.random.randint(50, 200), 12)
    product_sales[p] = (base + trend + np.random.normal(0, 20, 12)).astype(int)

# 地区分布
regions = ['华东', '华南', '华北', '西南', '东北', '华中']
region_sales = np.random.uniform(50, 300, len(regions))

df = pd.DataFrame({
    '月份': month_names,
    '收入': np.round(revenue, 2),
    '成本': np.round(cost, 2),
    '利润': np.round(profit, 2),
})
for p in product_lines:
    df[p] = product_sales[p]

df_regions = pd.DataFrame({
    '地区': regions,
    '销售额': np.round(region_sales, 2),
})`,
  datasetDescription: '模拟公司年度经营数据，12个月×多维度，字段包括：月份、收入、成本、利润、产品A/B/C/D销量。另附地区销售分布数据。',
  tasks: [
    {
      id: 'task-05-1',
      title: '绘制收入成本趋势图',
      description: '使用matplotlib绘制折线图，展示12个月的收入和成本变化趋势，添加图例和标题。',
      hint: '使用 plt.plot(df["月份"], df["收入"], label="收入")，plt.legend()，plt.title()。',
      validation: '正确绘制双线折线图，包含图例和标题',
    },
    {
      id: 'task-05-2',
      title: '产品销量对比柱状图',
      description: '绘制分组柱状图，对比4个产品线各月的销量。',
      hint: '使用 df.plot(x="月份", y=["产品A","产品B","产品C","产品D"], kind="bar") 或手动绘制分组柱状图。',
      validation: '正确绘制分组柱状图对比产品销量',
    },
    {
      id: 'task-05-3',
      title: '利润分布饼图',
      description: '计算各季度利润占比，绘制饼图展示季度利润分布。',
      hint: '先计算季度利润：df["利润"].values.reshape(4,3).sum(axis=1)，再用 plt.pie() 绘制。',
      validation: '正确计算季度利润并绘制饼图',
    },
    {
      id: 'task-05-4',
      title: '多维度组合图表',
      description: '使用subplot创建2×2的组合图表：收入趋势折线图、产品销量柱状图、利润率折线图、地区销售饼图。',
      hint: '使用 fig, axes = plt.subplots(2, 2) 创建子图，在各个axes上分别绘制。',
      validation: '正确创建2×2组合图表',
    },
    {
      id: 'task-05-5',
      title: '图表美化与标注',
      description: '对收入成本趋势图进行美化：添加数据标注、设置中文字体、调整颜色和样式、添加网格线。',
      hint: '使用 plt.rcParams["font.sans-serif"] 设置中文字体，plt.grid() 添加网格，plt.annotate() 标注数据点。',
      validation: '正确美化图表，包含中文显示、数据标注和网格',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib

# 数据集已加载到变量 df 和 df_regions 中
# df 包含列：月份、收入、成本、利润、产品A、产品B、产品C、产品D
# df_regions 包含列：地区、销售额

# 任务1: 绘制收入成本趋势图
# 在这里编写你的代码

# 任务2: 产品销量对比柱状图
# 在这里编写你的代码

# 任务3: 利润分布饼图
# 在这里编写你的代码

# 任务4: 多维度组合图表
# 在这里编写你的代码

# 任务5: 图表美化与标注
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib

# 任务1: 绘制收入成本趋势图
plt.figure(figsize=(10, 5))
plt.plot(df['月份'], df['收入'], marker='o', label='收入', linewidth=2)
plt.plot(df['月份'], df['成本'], marker='s', label='成本', linewidth=2)
plt.xlabel('月份')
plt.ylabel('金额（元）')
plt.title('月度收入与成本趋势')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# 任务2: 产品销量对比柱状图
fig, ax = plt.subplots(figsize=(12, 5))
x = np.arange(len(df))
width = 0.2
products = ['产品A', '产品B', '产品C', '产品D']
colors = ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000']
for i, p in enumerate(products):
    ax.bar(x + i * width, df[p], width, label=p, color=colors[i])
ax.set_xlabel('月份')
ax.set_ylabel('销量')
ax.set_title('各产品线月度销量对比')
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(df['月份'])
ax.legend()
plt.tight_layout()
plt.show()

# 任务3: 利润分布饼图
quarterly_profit = df['利润'].values.reshape(4, 3).sum(axis=1)
quarter_labels = ['Q1', 'Q2', 'Q3', 'Q4']
plt.figure(figsize=(7, 7))
plt.pie(quarterly_profit, labels=quarter_labels, autopct='%1.1f%%',
        colors=['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000'], startangle=90)
plt.title('季度利润分布')
plt.show()

# 任务4: 多维度组合图表
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 收入趋势
axes[0, 0].plot(df['月份'], df['收入'], marker='o', color='#4472C4')
axes[0, 0].set_title('收入趋势')
axes[0, 0].grid(True, alpha=0.3)

# 产品销量
df.plot(x='月份', y=products, kind='bar', ax=axes[0, 1])
axes[0, 1].set_title('产品销量对比')

# 利润率
profit_rate = (df['利润'] / df['收入'] * 100).round(2)
axes[1, 0].plot(df['月份'], profit_rate, marker='o', color='#ED7D31')
axes[1, 0].set_title('利润率趋势(%)')
axes[1, 0].grid(True, alpha=0.3)

# 地区销售
axes[1, 1].pie(df_regions['销售额'], labels=df_regions['地区'], autopct='%1.1f%%')
axes[1, 1].set_title('地区销售分布')

plt.tight_layout()
plt.show()

# 任务5: 图表美化与标注
matplotlib.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS']
matplotlib.rcParams['axes.unicode_minus'] = False

fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(df['月份'], df['收入'], marker='o', label='收入', linewidth=2.5, color='#2E86AB')
ax.plot(df['月份'], df['成本'], marker='s', label='成本', linewidth=2.5, color='#A23B72')
ax.fill_between(df['月份'], df['收入'], df['成本'], alpha=0.15, color='#2E86AB', label='利润区间')

for i, (rev, cost_val) in enumerate(zip(df['收入'], df['成本'])):
    if i % 2 == 0:
        ax.annotate(f'{rev/10000:.1f}万', (df['月份'].iloc[i], rev),
                    textcoords="offset points", xytext=(0, 10), ha='center', fontsize=8)

ax.set_xlabel('月份', fontsize=12)
ax.set_ylabel('金额（元）', fontsize=12)
ax.set_title('年度收入与成本趋势分析', fontsize=16, fontweight='bold')
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3, linestyle='--')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.show()
`,
  keyPoints: ['matplotlib折线图', '柱状图', '饼图', 'seaborn热力图', 'subplot子图', '图表美化', '中文显示设置'],
  outline: [
    {
      title: 'Matplotlib基础',
      items: [
        {
          title: 'figure与axes',
          content: 'Matplotlib采用双层结构：Figure是整个画布（可包含多个子图），Axes是单个绘图区域（注意不是Axis坐标轴）。创建图表推荐使用plt.subplots()，返回fig和axes对象。fig控制整体属性（大小、保存），axes控制具体绘图（数据、标签、样式）。面向对象方式比pyplot状态机方式更灵活，适合复杂图表。figsize参数控制图表尺寸，dpi控制分辨率。',
          codeExample: `fig, ax = plt.subplots(figsize=(10, 6))
ax.plot([1, 2, 3], [4, 5, 6])
ax.set_title('示例图表')
ax.set_xlabel('X轴'); ax.set_ylabel('Y轴')
plt.tight_layout(); plt.show()`,
          importance: 'core',
        },
        {
          title: '折线图与柱状图',
          content: '折线图plot()适合展示趋势变化，参数包括color、linestyle、marker、linewidth等。柱状图bar()（垂直）和barh()（水平）适合对比分类数据，width参数控制柱宽。堆叠柱状图设置bottom参数。分组柱状图通过偏移x坐标实现。折线图强调变化趋势，柱状图强调数值对比，根据数据特点选择合适的图表类型。',
          codeExample: `ax.plot(df['月份'], df['收入'], marker='o', label='收入', color='#2E86AB')
ax.bar(x, df['销售额'], width=0.6, label='销售额', color='#ED7D31')
ax.legend(); plt.show()`,
          importance: 'important',
        },
        {
          title: '散点图与饼图',
          content: '散点图scatter()展示两个数值变量的关系，s参数控制点大小，c参数控制颜色（可传入数值列实现颜色映射），alpha控制透明度，cmap指定颜色映射表。饼图pie()展示比例分布，autopct格式化百分比标签，startangle起始角度，explode突出某扇区。散点图适合探索变量关系，饼图适合展示组成占比（分类不宜超过7个）。',
          codeExample: `ax.scatter(df['收入'], df['利润'], s=50, c=df['月份'], cmap='viridis', alpha=0.7)
ax.pie(values, labels=labels, autopct='%1.1f%%', startangle=90, explode=[0.05]*len(values))
plt.show()`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: 'Seaborn高级',
      items: [
        {
          title: '分布图与热力图',
          content: 'Seaborn是基于Matplotlib的高级绘图库，提供更美观的默认样式和更简洁的API。histplot()绘制直方图（替代已弃用的distplot），kde=True叠加核密度估计曲线。heatmap()绘制热力图，常用于展示相关系数矩阵或透视表数据，annot=True显示数值，cmap指定颜色方案。Seaborn图表自动处理标签、图例等细节，减少样板代码。',
          codeExample: `import seaborn as sns
sns.histplot(df['销售额'], kde=True, bins=30)
corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap='RdBu_r', center=0)`,
          importance: 'core',
        },
        {
          title: '箱线图与分类图',
          content: '箱线图boxplot()展示数据分布的五数概括（最小值、Q1、中位数、Q3、最大值）和异常值，适合比较不同组的分布差异。catplot()是分类图的统一接口，kind参数选择图表类型：box、violin、bar、strip、swarm等。violinplot()结合箱线图和核密度估计，更直观展示分布形状。分类图适合分析分类变量与数值变量的关系。',
          codeExample: `sns.boxplot(data=df, x='品类', y='销售额')
sns.catplot(data=df, x='门店', y='销售额', kind='violin', height=5, aspect=2)
sns.violinplot(data=df, x='类别', y='数值', hue='分组', split=True)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '图表美化',
      items: [
        {
          title: '标题标签与图例',
          content: '图表美化是数据可视化的关键环节。set_title()设置标题，支持fontsize、fontweight、color等参数。set_xlabel/set_ylabel设置轴标签。legend()添加图例，loc参数控制位置（best、upper right等），fontsize控制字号。spines属性控制边框显示。良好的标注让图表自解释，减少读者理解成本。标题应简洁明确，标签应包含单位。',
          codeExample: `ax.set_title('月度销售趋势', fontsize=16, fontweight='bold')
ax.set_xlabel('月份', fontsize=12); ax.set_ylabel('销售额（万元）', fontsize=12)
ax.legend(loc='best', fontsize=10)
ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)`,
          importance: 'core',
        },
        {
          title: '配色方案与注释标注',
          content: '配色方案影响图表的专业度和可读性。推荐使用色盲友好配色，如Tableau、ColorBrewer方案。Seaborn的set_palette()设置全局配色。annotate()添加注释箭头，xy参数指定标注点，xytext指定文字位置，arrowprops设置箭头样式。关键数据点应添加标注，如最大值、最小值、拐点等。配色应保持一致性，同一报告中相同类别使用相同颜色。',
          codeExample: `ax.annotate(f'峰值: {max_val}', xy=(max_idx, max_val), xytext=(max_idx, max_val*1.1),
    arrowprops=dict(arrowstyle='->', color='red'), fontsize=10, color='red')
ax.set_prop_cycle('color', ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'])`,
          importance: 'important',
        },
        {
          title: '中文显示设置',
          content: 'Matplotlib默认不支持中文显示，需要手动配置字体。方法一：plt.rcParams["font.sans-serif"] = ["SimHei"]设置黑体（Windows）；方法二：plt.rcParams["font.sans-serif"] = ["Arial Unicode MS"]（macOS）；方法三：使用FontProperties指定字体文件。还需设置axes.unicode_minus = False解决负号显示问题。中文显示是中文数据可视化的常见痛点。',
          codeExample: `import matplotlib
matplotlib.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS']
matplotlib.rcParams['axes.unicode_minus'] = False
plt.title('中文标题测试')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '组合图表',
      items: [
        {
          title: '子图subplot',
          content: 'plt.subplots()创建多子图布局，nrows和ncols指定行列数，返回fig和axes数组。axes[i][j]或axes[i]访问子图。sharex/sharey参数让子图共享坐标轴，减少冗余标签。gridspec_kw参数传入字典控制子图宽高比。tight_layout()自动调整子图间距。组合图表可以在一个画布上展示多个维度的信息，便于对比和综合分析。',
          codeExample: `fig, axes = plt.subplots(2, 2, figsize=(14, 10), sharex=True)
axes[0, 0].plot(x, y1); axes[0, 0].set_title('趋势1')
axes[0, 1].bar(x, y2); axes[0, 1].set_title('对比1')
axes[1, 0].scatter(x, y3); axes[1, 0].set_title('关系1')
plt.tight_layout()`,
          importance: 'core',
        },
        {
          title: '双Y轴与图表布局',
          content: '双Y轴图表使用twinx()创建共享x轴的第二y轴，适合在同一图中展示量纲不同的两个指标。如左轴为销售额（元），右轴为增长率（%）。constrained_layout=True替代tight_layout提供更智能的布局调整。GridSpec可实现更灵活的非均匀子图布局。双Y轴图表需注意左右轴颜色与对应数据线一致，避免读者混淆。',
          codeExample: `fig, ax1 = plt.subplots(figsize=(10, 5))
ax1.plot(x, sales, 'b-', label='销售额')
ax1.set_ylabel('销售额（元）', color='b')
ax2 = ax1.twinx()
ax2.plot(x, growth, 'r--', label='增长率')
ax2.set_ylabel('增长率（%）', color='r')
plt.title('销售额与增长率双轴图')`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目6: A/B测试分析 ==========
export const project6: BootcampProject = {
  id: 'bootcamp-06',
  title: 'A/B测试分析',
  description: '通过分析电商A/B测试数据，学习假设检验的完整流程，包括t检验、卡方检验、p值解读、置信区间计算和效应量评估。',
  difficulty: 'intermediate',
  difficultyLabel: '中级',
  tags: ['A/B测试', '假设检验', 't检验', '卡方检验', '效应量'],
  datasetCode: `import pandas as pd
import numpy as np

np.random.seed(321)

n = 2000

# 用户ID和分组
user_ids = [f'U{i:05d}' for i in range(1, n + 1)]
groups = ['A'] * 1000 + ['B'] * 1000

# A组（对照组）：转化率约5%，平均订单金额200
conv_a = np.random.binomial(1, 0.05, 1000)
amount_a = np.where(conv_a == 1, np.round(np.random.normal(200, 60, 1000).clip(50, 500), 2), 0)
pageviews_a = np.random.randint(1, 20, 1000)
clicks_a = np.random.binomial(pageviews_a, 0.1)
duration_a = np.round(np.random.exponential(3, 1000) + 1, 1)

# B组（实验组）：转化率约6.5%，平均订单金额220
conv_b = np.random.binomial(1, 0.065, 1000)
amount_b = np.where(conv_b == 1, np.round(np.random.normal(220, 65, 1000).clip(50, 550), 2), 0)
pageviews_b = np.random.randint(1, 20, 1000)
clicks_b = np.random.binomial(pageviews_b, 0.12)
duration_b = np.round(np.random.exponential(3.5, 1000) + 1, 1)

df = pd.DataFrame({
    '用户ID': user_ids,
    '组别': groups,
    '页面浏览量': np.concatenate([pageviews_a, pageviews_b]),
    '点击量': np.concatenate([clicks_a, clicks_b]),
    '是否转化': np.concatenate([conv_a, conv_b]),
    '停留时长': np.concatenate([duration_a, duration_b]),
    '订单金额': np.concatenate([amount_a, amount_b]),
})

df = df.sample(frac=1, random_state=42).reset_index(drop=True)`,
  datasetDescription: '模拟电商A/B测试数据，2000名用户分为A组（对照组）和B组（实验组）各1000人，字段包括：用户ID、组别、页面浏览量、点击量、是否转化、停留时长、订单金额。',
  tasks: [
    {
      id: 'task-06-1',
      title: '计算各组核心指标',
      description: '分别计算A组和B组的转化率、平均订单金额（仅转化用户）、平均停留时长、点击率等核心指标。',
      hint: '使用 df.groupby("组别").agg(...) 计算各指标，转化率 = 是否转化均值，点击率 = 点击量/页面浏览量。',
      validation: '正确计算A/B两组的核心指标',
    },
    {
      id: 'task-06-2',
      title: '检验转化率差异',
      description: '使用卡方检验（chi-square test）检验A组和B组的转化率是否存在显著差异，输出卡方统计量和p值。',
      hint: 'from scipy.stats import chi2_contingency，构建2×2列联表后进行卡方检验。',
      validation: '正确进行卡方检验并解读p值',
    },
    {
      id: 'task-06-3',
      title: '检验订单金额差异',
      description: '使用t检验检验A组和B组转化用户的订单金额是否存在显著差异。',
      hint: 'from scipy.stats import ttest_ind，筛选转化用户后进行独立样本t检验。',
      validation: '正确进行t检验并解读结果',
    },
    {
      id: 'task-06-4',
      title: '计算效应量和置信区间',
      description: '计算转化率差异的效应量（Cohen\'s h）和订单金额差异的效应量（Cohen\'s d），以及95%置信区间。',
      hint: 'Cohen\'s d = (mean_b - mean_a) / pooled_std，置信区间用 mean ± 1.96 * se。',
      validation: '正确计算效应量和置信区间',
    },
    {
      id: 'task-06-5',
      title: '输出分析结论',
      description: '综合统计显著性和业务显著性，给出A/B测试的最终结论和建议。',
      hint: '综合p值（统计显著性）和效应量（业务显著性）给出结论，p<0.05且效应量可观则推荐上线。',
      validation: '输出完整的A/B测试分析结论',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np
from scipy import stats

# 数据集已加载到变量 df 中
# df 包含列：用户ID、组别、页面浏览量、点击量、是否转化、停留时长、订单金额

# 任务1: 计算各组核心指标
# 在这里编写你的代码

# 任务2: 检验转化率差异
# 在这里编写你的代码

# 任务3: 检验订单金额差异
# 在这里编写你的代码

# 任务4: 计算效应量和置信区间
# 在这里编写你的代码

# 任务5: 输出分析结论
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np
from scipy import stats

# 任务1: 计算各组核心指标
group_stats = df.groupby('组别').agg(
    用户数=('用户ID', 'count'),
    转化数=('是否转化', 'sum'),
    转化率=('是否转化', 'mean'),
    平均停留时长=('停留时长', 'mean'),
    平均点击量=('点击量', 'mean'),
).round(4)

# 转化用户的平均订单金额
conv_users = df[df['是否转化'] == 1]
conv_amount = conv_users.groupby('组别')['订单金额'].mean().round(2)
group_stats['转化用户平均订单金额'] = conv_amount

print("=== 各组核心指标 ===")
print(group_stats)

# 任务2: 检验转化率差异
contingency = pd.crosstab(df['组别'], df['是否转化'])
chi2, p_value, dof, expected = stats.chi2_contingency(contingency)
print(f"\\n=== 转化率卡方检验 ===")
print(f"卡方统计量: {chi2:.4f}")
print(f"p值: {p_value:.4f}")
print(f"统计显著: {'是' if p_value < 0.05 else '否'}(α=0.05)")

# 任务3: 检验订单金额差异
amount_a = conv_users[conv_users['组别'] == 'A']['订单金额']
amount_b = conv_users[conv_users['组别'] == 'B']['订单金额']
t_stat, p_value_t = stats.ttest_ind(amount_a, amount_b)
print(f"\\n=== 订单金额t检验 ===")
print(f"t统计量: {t_stat:.4f}")
print(f"p值: {p_value_t:.4f}")
print(f"统计显著: {'是' if p_value_t < 0.05 else '否'}(α=0.05)")

# 任务4: 计算效应量和置信区间
# Cohen's d for 订单金额
pooled_std = np.sqrt((amount_a.std()**2 + amount_b.std()**2) / 2)
cohens_d = (amount_b.mean() - amount_a.mean()) / pooled_std
print(f"\\n=== 效应量 ===")
print(f"Cohen's d (订单金额): {cohens_d:.4f}")

# 转化率差异的效应量 (Cohen's h)
conv_a = df[df['组别'] == 'A']['是否转化'].mean()
conv_b = df[df['组别'] == 'B']['是否转化'].mean()
cohens_h = 2 * np.arcsin(np.sqrt(conv_b)) - 2 * np.arcsin(np.sqrt(conv_a))
print(f"Cohen's h (转化率): {cohens_h:.4f}")

# 95%置信区间
diff = conv_b - conv_a
se = np.sqrt(conv_a * (1 - conv_a) / 1000 + conv_b * (1 - conv_b) / 1000)
ci_lower = diff - 1.96 * se
ci_upper = diff + 1.96 * se
print(f"\\n=== 转化率差异95%置信区间 ===")
print(f"差异: {diff:.4f}")
print(f"置信区间: [{ci_lower:.4f}, {ci_upper:.4f}]")

# 任务5: 输出分析结论
print("\\n" + "=" * 50)
print("       A/B测试分析结论")
print("=" * 50)
print(f"\\n1. 转化率分析:")
print(f"   A组转化率: {conv_a:.2%}, B组转化率: {conv_b:.2%}")
print(f"   提升: {(conv_b - conv_a):.2%} (相对提升: {(conv_b - conv_a)/conv_a:.2%})")
print(f"   卡方检验p值: {p_value:.4f} {'< 0.05，统计显著' if p_value < 0.05 else '>= 0.05，统计不显著'}")

print(f"\\n2. 订单金额分析:")
print(f"   A组均值: ¥{amount_a.mean():.2f}, B组均值: ¥{amount_b.mean():.2f}")
print(f"   t检验p值: {p_value_t:.4f} {'< 0.05，统计显著' if p_value_t < 0.05 else '>= 0.05，统计不显著'}")

print(f"\\n3. 效应量评估:")
print(f"   Cohen's h = {cohens_h:.4f} ({'小效应' if abs(cohens_h) < 0.2 else '中效应' if abs(cohens_h) < 0.5 else '大效应'})")
print(f"   Cohen's d = {cohens_d:.4f} ({'小效应' if abs(cohens_d) < 0.2 else '中效应' if abs(cohens_d) < 0.5 else '大效应'})")

print(f"\\n4. 结论:")
if p_value < 0.05:
    print(f"   B组转化率显著高于A组，建议上线B方案。")
    print(f"   预计转化率可从{conv_a:.2%}提升至{conv_b:.2%}，相对提升{(conv_b - conv_a)/conv_a:.2%}。")
else:
    print(f"   转化率差异不显著，不建议上线B方案。")
`,
  keyPoints: ['假设检验', 't检验', '卡方检验', 'p值解读', '置信区间', '效应量Cohen\'s d/h', '统计显著性', '业务显著性'],
  outline: [
    {
      title: 'A/B测试基础',
      items: [
        {
          title: '实验设计与随机分组',
          content: 'A/B测试是一种随机对照实验，将用户随机分为对照组（A组）和实验组（B组），仅改变一个变量（如页面设计、定价策略），比较两组的核心指标差异。随机分组确保两组除实验变量外其他因素一致，是因果推断的基础。分层随机化可在关键维度上保证组间均衡。实验设计需确保样本量充足、实验周期覆盖完整周期、避免溢出效应。',
          codeExample: `import numpy as np
np.random.seed(42)
users = list(range(1000))
np.random.shuffle(users)
group_a = users[:500]
group_b = users[500:]
print(f'A组: {len(group_a)}人, B组: {len(group_b)}人')`,
          importance: 'core',
        },
        {
          title: '样本量计算与指标选择',
          content: '样本量直接影响检验的统计功效（Power）。样本量取决于：基线转化率p、最小可检测效应MDE、显著性水平α（通常0.05）、统计功效1-β（通常0.8）。公式：n = (Z_α/2 + Z_β)² × p(1-p) / (p1-p0)²。指标选择应与业务目标直接相关，分为主指标（决策依据）和辅助指标（参考）。指标应可测量、敏感且稳定。',
          codeExample: `import numpy as np
from scipy import stats
# 样本量计算公式：n = (Z_α/2 + Z_β)² × p(1-p) / δ²
p = 0.05  # 基线转化率
delta = 0.015  # 最小可检测差异
z_alpha = stats.norm.ppf(0.975)  # 1.96
z_beta = stats.norm.ppf(0.8)  # 0.84
n = (z_alpha + z_beta)**2 * p * (1-p) / delta**2
print(f'每组所需样本量: {int(np.ceil(n))}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '假设检验',
      items: [
        {
          title: '零假设与备择假设',
          content: '假设检验的核心是构建两个互斥假设：零假设H₀（两组无差异）和备择假设H₁（两组有差异）。检验的目标是判断数据是否提供足够证据拒绝H₀。如果p值小于显著性水平α，则拒绝H₀，认为差异显著；否则不能拒绝H₀。注意"不能拒绝H₀"不等于"H₀为真"，只是证据不足以推翻。假设检验是反证法思维，通过证伪来支持结论。',
          codeExample: `# H0: A组和B组转化率无差异
# H1: A组和B组转化率有差异
conv_a = df[df['组别']=='A']['是否转化'].mean()
conv_b = df[df['组别']=='B']['是否转化'].mean()
print(f'A组转化率: {conv_a:.4f}, B组转化率: {conv_b:.4f}')`,
          importance: 'core',
        },
        {
          title: 'p值与两类错误',
          content: 'p值是在H₀为真的前提下，观察到当前或更极端结果的概率。p值越小，拒绝H₀的证据越强。显著性水平α是事先设定的阈值（通常0.05），p<α则拒绝H₀。第一类错误（α错误）是H₀为真时错误拒绝（假阳性），概率为α。第二类错误（β错误）是H₀为假时未能拒绝（假阴性），概率为β。统计功效=1-β，是正确拒绝H₀的概率。降低α会增大β，需权衡。',
          codeExample: `from scipy import stats
chi2, p_value, dof, expected = stats.chi2_contingency(contingency)
alpha = 0.05
print(f'p值: {p_value:.4f}')
print(f'结论: {"拒绝H0，差异显著" if p_value < alpha else "不能拒绝H0"}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '检验方法',
      items: [
        {
          title: 't检验（连续指标）',
          content: '独立样本t检验用于比较两组连续变量的均值差异，如订单金额、停留时长等。前提假设：数据近似正态分布、两组方差齐性。scipy.stats.ttest_ind()执行检验，equal_var=False使用Welch t检验（不要求方差齐性）。若数据严重偏离正态，可用Mann-Whitney U检验替代。t检验是A/B测试中最常用的连续指标检验方法。',
          codeExample: `from scipy import stats
amount_a = df[(df['组别']=='A') & (df['是否转化']==1)]['订单金额']
amount_b = df[(df['组别']=='B') & (df['是否转化']==1)]['订单金额']
t_stat, p_val = stats.ttest_ind(amount_a, amount_b, equal_var=False)
print(f't统计量: {t_stat:.4f}, p值: {p_val:.4f}')`,
          importance: 'core',
        },
        {
          title: '卡方检验（比例指标）',
          content: '卡方检验用于比较两组分类变量的分布差异，最常用于检验转化率差异。构建2×2列联表（组别×是否转化），使用scipy.stats.chi2_contingency()计算卡方统计量和p值。当样本量较小时（任一期望频数<5），应使用Fisher精确检验stats.fisher_exact()。卡方检验是A/B测试中转化率、点击率等比例指标的标准检验方法。',
          codeExample: `contingency = pd.crosstab(df['组别'], df['是否转化'])
chi2, p_val, dof, expected = stats.chi2_contingency(contingency)
print(f'卡方统计量: {chi2:.4f}, p值: {p_val:.4f}')
print(f'列联表:\\n{contingency}')`,
          importance: 'important',
        },
        {
          title: '非参数检验与多重比较',
          content: '当数据不满足参数检验假设时，使用非参数检验。Mann-Whitney U检验比较两组中位数差异，不要求数据正态分布。当同时检验多个指标时，需要进行多重比较校正以控制总体第一类错误率。Bonferroni校正将α除以检验次数，简单但保守。FDR（False Discovery Rate）校正更平衡，控制错误发现比例。多重比较校正确保结论的可靠性。',
          codeExample: `from scipy.stats import mannwhitneyu
u_stat, p_val = mannwhitneyu(group_a, group_b, alternative='two-sided')
# Bonferroni校正
alpha_corrected = 0.05 / n_tests
print(f'校正后α: {alpha_corrected:.4f}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '效果评估',
      items: [
        {
          title: '效应量Cohen\'s d',
          content: '效应量衡量差异的实际大小，与样本量无关，是评估业务显著性的关键指标。Cohen\'s d = (mean_B - mean_A) / pooled_std，其中pooled_std = sqrt((std_A² + std_B²) / 2)。|d|<0.2为小效应，0.2-0.8为中效应，>0.8为大效应。统计显著性（p值）受样本量影响大，大样本下微小差异也可能显著；效应量则反映差异的实际意义，两者应结合解读。',
          codeExample: `pooled_std = np.sqrt((amount_a.std()**2 + amount_b.std()**2) / 2)
cohens_d = (amount_b.mean() - amount_a.mean()) / pooled_std
print(f"Cohen's d: {cohens_d:.4f}")
effect = '小' if abs(cohens_d) < 0.2 else '中' if abs(cohens_d) < 0.8 else '大'
print(f'效应大小: {effect}效应')`,
          importance: 'core',
        },
        {
          title: '置信区间与业务显著性',
          content: '置信区间给出参数真实值的范围估计，比点估计更有信息量。95%置信区间 = 样本统计量 ± 1.96 × 标准误。如果置信区间不包含0（差异）或1（比值），则差异在α=0.05水平显著。业务显著性关注差异是否有实际意义：即使统计显著，若效应量极小或置信区间下限接近0，业务上可能不值得投入。最终决策应综合统计显著性和业务成本收益分析。',
          codeExample: `diff = conv_b - conv_a
se = np.sqrt(conv_a*(1-conv_a)/n_a + conv_b*(1-conv_b)/n_b)
ci_lower, ci_upper = diff - 1.96*se, diff + 1.96*se
print(f'转化率差异: {diff:.4f}')
print(f'95%置信区间: [{ci_lower:.4f}, {ci_upper:.4f}]')`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目7: 时间序列分析 ==========
export const project7: BootcampProject = {
  id: 'bootcamp-07',
  title: '时间序列分析',
  description: '通过分析2年的每日销售数据，系统学习Pandas时间序列处理功能，包括时间索引、重采样、移动平均、同比环比和季节性分解。',
  difficulty: 'intermediate',
  difficultyLabel: '中级',
  tags: ['时间序列', '重采样', '移动平均', '同比环比', '季节性分解'],
  datasetCode: `import pandas as pd
import numpy as np

np.random.seed(654)

# 生成2年每日数据
dates = pd.date_range('2022-01-01', '2023-12-31', freq='D')
n = len(dates)

# 趋势：缓慢增长
trend = np.linspace(5000, 8000, n)

# 季节性：年周期
seasonality = 1500 * np.sin(2 * np.pi * np.arange(n) / 365)

# 周效应：周末销量高
day_of_week = dates.dayofweek
week_effect = np.where(day_of_week >= 5, 800, 0)

# 噪声
noise = np.random.normal(0, 300, n)

# 合成销售额
sales = trend + seasonality + week_effect + noise
sales = np.round(np.clip(sales, 1000, None), 2)

# 订单数和客单价
orders = (sales / np.random.uniform(80, 120, n)).astype(int)
orders = np.clip(orders, 10, None)
avg_price = np.round(sales / orders, 2)

df = pd.DataFrame({
    '日期': dates,
    '销售额': sales,
    '订单数': orders,
    '客单价': avg_price,
})`,
  datasetDescription: '模拟2年（2022-2023）每日销售数据，共730行，字段包括：日期、销售额、订单数、客单价。数据包含增长趋势、季节性波动和周末效应。',
  tasks: [
    {
      id: 'task-07-1',
      title: '时间索引与重采样',
      description: '将日期列转为datetime类型并设为索引，按月重采样计算月度总销售额和月均订单数。',
      hint: 'df["日期"] = pd.to_datetime(df["日期"])，df.set_index("日期")，df.resample("M").agg(...)。',
      validation: '正确设置时间索引并进行月度重采样',
    },
    {
      id: 'task-07-2',
      title: '移动平均趋势分析',
      description: '计算销售额的7日和30日移动平均，对比原始数据和移动平均线的趋势。',
      hint: '使用 df["销售额"].rolling(window=7).mean() 和 rolling(window=30).mean()。',
      validation: '正确计算7日和30日移动平均',
    },
    {
      id: 'task-07-3',
      title: '同比环比分析',
      description: '按月汇总销售额，计算月度环比增长率（与上月比）和同比增长率（与去年同月比）。',
      hint: '环比用 monthly.pct_change(1)，同比用 monthly.pct_change(12)。',
      validation: '正确计算月度环比和同比增长率',
    },
    {
      id: 'task-07-4',
      title: '季节性模式识别',
      description: '分析各月份的平均销售额，识别销售旺季和淡季；分析工作日与周末的销售差异。',
      hint: '按月分组：df.groupby(df.index.month)["销售额"].mean()；按星期分组：df.groupby(df.index.dayofweek)["销售额"].mean()。',
      validation: '正确识别季节性模式和周末效应',
    },
    {
      id: 'task-07-5',
      title: '预测简单趋势',
      description: '使用diff差分和pct_change环比分析趋势方向，用shift滞后特征构建简单的趋势预测。',
      hint: 'df["销售额"].diff() 差分，df["销售额"].pct_change() 环比，df["销售额"].shift(1) 滞后。',
      validation: '正确使用差分、环比和滞后特征分析趋势',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np

# 数据集已加载到变量 df 中
# df 包含列：日期、销售额、订单数、客单价

# 任务1: 时间索引与重采样
# 在这里编写你的代码

# 任务2: 移动平均趋势分析
# 在这里编写你的代码

# 任务3: 同比环比分析
# 在这里编写你的代码

# 任务4: 季节性模式识别
# 在这里编写你的代码

# 任务5: 预测简单趋势
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np

# 任务1: 时间索引与重采样
df['日期'] = pd.to_datetime(df['日期'])
df = df.set_index('日期')
print("=== 时间索引信息 ===")
print(f"索引类型: {type(df.index)}")
print(f"时间范围: {df.index.min()} ~ {df.index.max()}")

monthly = df.resample('M').agg({
    '销售额': 'sum',
    '订单数': 'mean',
}).round(2)
monthly.columns = ['月度总销售额', '月均订单数']
print("\\n=== 月度重采样 ===")
print(monthly.head(12))

# 任务2: 移动平均趋势分析
df['MA7'] = df['销售额'].rolling(window=7).mean()
df['MA30'] = df['销售额'].rolling(window=30).mean()
print("\\n=== 移动平均 ===")
print(df[['销售额', 'MA7', 'MA30']].head(35).tail(5))

# 任务3: 同比环比分析
monthly_sales = df.resample('M')['销售额'].sum()
monthly_df = pd.DataFrame({'月度销售额': monthly_sales})
monthly_df['环比增长率'] = monthly_df['月度销售额'].pct_change().round(4)
monthly_df['同比增长率'] = monthly_df['月度销售额'].pct_change(12).round(4)
print("\\n=== 同比环比分析 ===")
print(monthly_df.dropna().head(12))

# 任务4: 季节性模式识别
month_avg = df.groupby(df.index.month)['销售额'].mean().round(2)
print("\\n=== 各月平均销售额 ===")
print(month_avg)
print(f"旺季月份: {month_avg.nlargest(3).index.tolist()}")
print(f"淡季月份: {month_avg.nsmallest(3).index.tolist()}")

dow_avg = df.groupby(df.index.dayofweek)['销售额'].mean().round(2)
dow_names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
dow_avg.index = dow_names
print("\\n=== 工作日vs周末 ===")
print(dow_avg)
weekday_avg = dow_avg.loc['周一':'周五'].mean()
weekend_avg = dow_avg.loc['周六':'周日'].mean()
print(f"工作日均值: {weekday_avg:.2f}, 周末均值: {weekend_avg:.2f}")

# 任务5: 预测简单趋势
df['日差分'] = df['销售额'].diff()
df['日环比'] = df['销售额'].pct_change()
df['昨日销售额'] = df['销售额'].shift(1)
df['7日均值'] = df['销售额'].rolling(7).mean().shift(1)

# 简单趋势预测：用7日均值作为预测
df['预测销售额'] = df['7日均值']
df['预测误差'] = (df['销售额'] - df['预测销售额']).abs()
df['预测误差率'] = (df['预测误差'] / df['销售额'] * 100).round(2)

print("\\n=== 趋势预测 ===")
print(df[['销售额', '昨日销售额', '7日均值', '预测销售额', '预测误差率']].dropna().head(10))
print(f"\\n平均预测误差率: {df['预测误差率'].dropna().mean():.2f}%")
print(f"整体趋势: {'上升' if df['销售额'].iloc[-1] > df['销售额'].iloc[0] else '下降'}")
`,
  keyPoints: ['to_datetime日期解析', '时间索引设置', 'resample重采样', 'rolling移动平均', 'diff差分', 'pct_change环比', 'shift滞后', '季节性分解'],
  outline: [
    {
      title: '时间数据基础',
      items: [
        {
          title: 'to_datetime解析与时间索引',
          content: 'pd.to_datetime()将字符串转为datetime64类型，支持多种日期格式的自动解析。format参数可指定格式（如"%Y-%m-%d %H:%M"）以提高解析速度和准确性。转为datetime后，使用set_index()将日期列设为索引，即可使用Pandas强大的时间序列功能，如基于时间的切片、重采样等。DatetimeIndex支持部分字符串索引，如df["2023"]选取2023年所有数据。',
          codeExample: `df['日期'] = pd.to_datetime(df['日期'])
df = df.set_index('日期')
print(df.index.dtype)  # datetime64[ns]
print(df['2023-06'])  # 选取2023年6月数据`,
          importance: 'core',
        },
        {
          title: 'dt访问器与时间差',
          content: 'dt访问器用于提取datetime Series的时间属性：dt.year、dt.month、dt.day、dt.hour、dt.minute、dt.second、dt.dayofweek（0=周一）、dt.is_month_start等。dt.to_period("M")转为月周期。timedelta表示时间差，可由两个datetime相减得到，也支持pd.Timedelta("3 days")构造。时间差可进行加减运算，用于计算间隔天数、偏移日期等。',
          codeExample: `df['年份'] = df['日期'].dt.year
df['月份'] = df['日期'].dt.month
df['是否周末'] = df['日期'].dt.dayofweek >= 5
df['距今天数'] = (pd.Timestamp.now() - df['日期']).dt.days`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '重采样',
      items: [
        {
          title: 'resample方法',
          content: 'resample()是时间序列重采样的核心方法，类似于groupby但基于时间频率。常用频率：D（日）、W（周）、M（月末）、MS（月初）、Q（季末）、Y（年末）、H（时）、T/min（分）。resample后需跟聚合方法，如sum()、mean()、ohlc()等。重采样将高频数据转为低频（降采样）或将低频数据转为高频（升采样），是时间序列分析的基础操作。',
          codeExample: `monthly = df.resample('M')['销售额'].sum()
weekly_mean = df.resample('W')['销售额'].mean()
hourly = df.resample('H')['销售额'].sum()  # 升采样需填充`,
          importance: 'core',
        },
        {
          title: '升采样与OHLC重采样',
          content: '降采样（高频→低频）直接聚合即可。升采样（低频→高频）会产生缺失值，需要填充策略：asfreq()保留NaN，ffill()前向填充，bfill()后向填充，interpolate()插值填充。OHLC重采样（Open-High-Low-Close）使用ohlc()方法，生成开盘、最高、最低、收盘四个值，常用于金融数据分析。resample的label参数控制区间标签使用左端点还是右端点。',
          codeExample: `# OHLC重采样
ohlc = df['销售额'].resample('W').ohlc()
# 升采样填充
daily = monthly.resample('D').ffill()
quarterly = df.resample('Q', label='right')['销售额'].sum()`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '滑动窗口',
      items: [
        {
          title: 'rolling移动平均',
          content: 'rolling()创建滑动窗口，对窗口内的数据计算统计量。最常用的是移动平均：rolling(window=7).mean()计算7日均线，用于平滑短期波动、揭示长期趋势。window参数指定窗口大小，min_periods指定最少有效值数量，center=True使用居中窗口。rolling还支持sum()、std()、max()、min()、quantile()等聚合方法。移动平均是技术分析和趋势判断的基本工具。',
          codeExample: `df['MA7'] = df['销售额'].rolling(window=7).mean()
df['MA30'] = df['销售额'].rolling(window=30, min_periods=15).mean()
df['滚动标准差'] = df['销售额'].rolling(7).std()`,
          importance: 'core',
        },
        {
          title: 'expanding与ewm指数加权',
          content: 'expanding()创建扩展窗口，从第一个数据点开始逐步扩大，计算累计统计量。如expanding().mean()即为累计均值。ewm()创建指数加权窗口，近期数据权重更大，远期数据权重指数衰减，由span或alpha参数控制衰减速度。ewm().mean()即指数加权移动平均（EMA），对近期变化更敏感。shift(n)将数据向后移动n步，lag特征常用于时间序列预测。',
          codeExample: `df['累计均值'] = df['销售额'].expanding().mean()
df['EMA12'] = df['销售额'].ewm(span=12).mean()
df['昨日销售额'] = df['销售额'].shift(1)
df['7日均值_lag'] = df['销售额'].rolling(7).mean().shift(1)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '趋势与季节',
      items: [
        {
          title: '趋势分解与季节性检测',
          content: '时间序列可分解为趋势（Trend）、季节（Seasonal）和残差（Residual）三个分量。加法模型：Y = T + S + R，适合季节波动幅度恒定；乘法模型：Y = T × S × R，适合季节波动幅度随趋势增大。可用移动平均提取趋势，用按月均值提取季节性，残差=原始值-趋势-季节。分解后可分别分析趋势方向、季节模式和异常残差。',
          codeExample: `# 手动趋势分解：移动平均提取趋势
trend = df['销售额'].rolling(window=30, center=True).mean()
detrended = df['销售额'] - trend
seasonal = detrended.groupby(detrended.index.month).mean()
residual = detrended - seasonal[detrended.index.month].values
print(f'趋势:\\n{trend.head()}')
print(f'\\n季节性（各月均值）:\\n{seasonal}')`,
          importance: 'core',
        },
        {
          title: '同比环比与差分平稳化',
          content: '同比（Year-over-Year）比较与去年同期的变化，消除季节性影响；环比（Month-over-Month）比较与上一期的变化，反映短期趋势。pct_change(1)计算环比，pct_change(12)计算同比（月度数据）。差分diff()将序列转为变化量，一阶差分去趋势，二阶差分去趋势和季节性。差分是使非平稳序列平稳化的常用方法，也是ARIMA模型的基础。',
          codeExample: `monthly = df.resample('M')['销售额'].sum()
monthly_pct = monthly.pct_change()  # 环比
monthly_yoy = monthly.pct_change(12)  # 同比
df_diff = df['销售额'].diff()  # 一阶差分
df_diff2 = df['销售额'].diff().diff()  # 二阶差分`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目8: 特征工程 ==========
export const project8: BootcampProject = {
  id: 'bootcamp-08',
  title: '特征工程',
  description: '通过客户信用评估数据，系统学习特征工程的核心方法，包括特征编码、特征缩放、特征交叉、分箱处理和特征选择。',
  difficulty: 'advanced',
  difficultyLabel: '高级',
  tags: ['特征工程', '特征编码', '分箱处理', '特征选择', '特征交叉'],
  datasetCode: `import pandas as pd
import numpy as np

np.random.seed(852)

n = 1000

# 基础特征
ages = np.random.randint(22, 65, n)
incomes = np.round(np.random.lognormal(10.5, 0.6, n), 0)
debt_ratio = np.round(np.random.uniform(0, 0.8, n), 4)
credit_history = np.random.randint(0, 20, n)
overdue_count = np.random.choice([0, 0, 0, 0, 1, 1, 2, 3, 5, 8], n)
loan_amount = np.round(np.random.uniform(10000, 500000, n), 2)

# 教育程度
education = np.random.choice(['高中', '大专', '本科', '硕士', '博士'], n, p=[0.15, 0.25, 0.35, 0.2, 0.05])

# 婚姻状况
marriage = np.random.choice(['未婚', '已婚', '离异'], n, p=[0.3, 0.55, 0.15])

# 是否有房
has_house = np.random.choice(['有', '无'], n, p=[0.4, 0.6])

# 是否违约（与特征相关）
logit = (-3 + 0.02 * ages - 0.0001 * incomes + 3 * debt_ratio
         - 0.1 * credit_history + 0.3 * overdue_count
         + (education == '高中') * 0.5 + (marriage == '离异') * 0.3)
prob = 1 / (1 + np.exp(-logit))
default = (np.random.random(n) < prob).astype(int)

df = pd.DataFrame({
    '客户ID': [f'C{i:04d}' for i in range(1, n + 1)],
    '年龄': ages,
    '收入': incomes,
    '负债比': debt_ratio,
    '信用历史': credit_history,
    '逾期次数': overdue_count,
    '贷款金额': loan_amount,
    '教育程度': education,
    '婚姻状况': marriage,
    '是否有房': has_house,
    '是否违约': default,
})`,
  datasetDescription: '模拟客户信用评估数据，1000条记录，字段包括：客户ID、年龄、收入、负债比、信用历史、逾期次数、贷款金额、教育程度、婚姻状况、是否有房、是否违约。',
  tasks: [
    {
      id: 'task-08-1',
      title: '类别特征编码',
      description: '对教育程度使用LabelEncoder编码，对婚姻状况和是否有房使用OneHot编码（pd.get_dummies）。',
      hint: 'LabelEncoder: from sklearn.preprocessing import LabelEncoder；OneHot: pd.get_dummies(df, columns=["婚姻状况","是否有房"], drop_first=True)。',
      validation: '正确对类别特征进行编码',
    },
    {
      id: 'task-08-2',
      title: '连续特征分箱',
      description: '将年龄分为青年(22-30)、中年(31-45)、中老年(46-55)、老年(56+)四个区间，将收入按四分位数分箱。',
      hint: 'pd.cut(df["年龄"], bins=[21,30,45,55,65], labels=["青年","中年","中老年","老年"])；pd.qcut(df["收入"], 4)。',
      validation: '正确对连续特征进行分箱',
    },
    {
      id: 'task-08-3',
      title: '特征交叉组合',
      description: '创建交叉特征：收入×负债比（还款压力）、贷款金额/收入（贷款收入比）、逾期次数/信用历史（逾期率）。',
      hint: 'df["还款压力"] = df["收入"] * df["负债比"]，df["贷款收入比"] = df["贷款金额"] / df["收入"]。',
      validation: '正确创建交叉特征',
    },
    {
      id: 'task-08-4',
      title: '特征选择与重要性排序',
      description: '使用随机森林计算特征重要性，对数值特征进行重要性排序，选出最重要的5个特征。',
      hint: 'from sklearn.ensemble import RandomForestClassifier，rf.fit(X, y)，rf.feature_importances_。',
      validation: '正确计算特征重要性并排序',
    },
    {
      id: 'task-08-5',
      title: '构建最终特征矩阵',
      description: '整合编码后的类别特征、分箱特征、交叉特征和原始数值特征，构建最终的特征矩阵，输出特征矩阵形状和前5行。',
      hint: '使用 pd.concat 拼接所有特征列，确保无缺失值，检查数据类型。',
      validation: '正确构建最终特征矩阵',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier

# 数据集已加载到变量 df 中
# df 包含列：客户ID、年龄、收入、负债比、信用历史、逾期次数、贷款金额、教育程度、婚姻状况、是否有房、是否违约

# 任务1: 类别特征编码
# 在这里编写你的代码

# 任务2: 连续特征分箱
# 在这里编写你的代码

# 任务3: 特征交叉组合
# 在这里编写你的代码

# 任务4: 特征选择与重要性排序
# 在这里编写你的代码

# 任务5: 构建最终特征矩阵
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier

# 任务1: 类别特征编码
le = LabelEncoder()
df['教育程度_编码'] = le.fit_transform(df['教育程度'])
print("=== LabelEncoder编码 ===")
print(f"教育程度映射: {dict(zip(le.classes_, le.transform(le.classes_)))}")

df_encoded = pd.get_dummies(df, columns=['婚姻状况', '是否有房'], drop_first=True, dtype=int)
print("\\n=== OneHot编码后的列 ===")
onehot_cols = [c for c in df_encoded.columns if c not in df.columns or c.startswith('婚姻') or c.startswith('是否')]
print([c for c in df_encoded.columns if '婚姻' in c or '是否有房' in c])

# 任务2: 连续特征分箱
df['年龄分组'] = pd.cut(df['年龄'], bins=[21, 30, 45, 55, 65], labels=['青年', '中年', '中老年', '老年'])
df['收入分组'] = pd.qcut(df['收入'], 4, labels=['低收入', '中低收入', '中高收入', '高收入'])
print("\\n=== 年龄分箱 ===")
print(df['年龄分组'].value_counts())
print("\\n=== 收入分箱 ===")
print(df['收入分组'].value_counts())

# 任务3: 特征交叉组合
df['还款压力'] = (df['收入'] * df['负债比']).round(2)
df['贷款收入比'] = (df['贷款金额'] / df['收入']).round(4)
df['逾期率'] = np.where(df['信用历史'] > 0, (df['逾期次数'] / df['信用历史']).round(4), 0)
print("\\n=== 交叉特征统计 ===")
print(df[['还款压力', '贷款收入比', '逾期率']].describe().round(4))

# 任务4: 特征选择与重要性排序
feature_cols = ['年龄', '收入', '负债比', '信用历史', '逾期次数', '贷款金额',
                '教育程度_编码', '还款压力', '贷款收入比', '逾期率']
# 添加OneHot列
onehot_cols = [c for c in df_encoded.columns if ('婚姻' in c or '是否有房' in c)]
for col in onehot_cols:
    if col not in feature_cols:
        feature_cols.append(col)

X = df_encoded[feature_cols].fillna(0)
y = df_encoded['是否违约']

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

importance = pd.DataFrame({
    '特征': feature_cols,
    '重要性': rf.feature_importances_,
}).sort_values('重要性', ascending=False)

print("\\n=== 特征重要性排序 ===")
print(importance.to_string(index=False))
print(f"\\nTOP5重要特征: {importance['特征'].head(5).tolist()}")

# 任务5: 构建最终特征矩阵
top_features = importance['特征'].head(8).tolist()
final_X = df_encoded[top_features].fillna(0)

# 标准化数值特征
scaler = StandardScaler()
final_X_scaled = pd.DataFrame(
    scaler.fit_transform(final_X),
    columns=top_features
)

print("\\n=== 最终特征矩阵 ===")
print(f"形状: {final_X_scaled.shape}")
print(f"特征列: {top_features}")
print(f"\\n前5行:")
print(final_X_scaled.head().round(4))
print(f"\\n缺失值: {final_X_scaled.isnull().sum().sum()}")
`,
  keyPoints: ['LabelEncoder编码', 'OneHotEncoder编码', '特征缩放StandardScaler', '特征交叉', '分箱处理cut/qcut', '特征选择', '特征重要性', '随机森林'],
  outline: [
    {
      title: '类别特征编码',
      items: [
        {
          title: 'LabelEncoder与OrdinalEncoder',
          content: 'LabelEncoder将类别特征编码为0到n-1的整数，适合有序类别（如"低<中<高"）。sklearn的LabelEncoder作用于单个Series，OrdinalEncoder作用于多列DataFrame。注意：LabelEncoder对无序类别（如城市名）会产生虚假的序关系，可能导致模型误判距离。对于无序类别应使用OneHot编码。LabelEncoder的优点是节省内存，不增加特征维度。',
          codeExample: `from sklearn.preprocessing import LabelEncoder, OrdinalEncoder
le = LabelEncoder()
df['教育编码'] = le.fit_transform(df['教育程度'])
oe = OrdinalEncoder(categories=[['低', '中', '高']])
df[['等级编码']] = oe.fit_transform(df[['等级']])`,
          importance: 'core',
        },
        {
          title: 'OneHotEncoder',
          content: 'OneHotEncoder将每个类别值展开为独立的0/1列，消除虚假序关系。sklearn的OneHotEncoder输出稀疏矩阵（节省内存），sparse_output=False输出密集数组。drop="first"删除第一个类别避免共线性（虚拟变量陷阱）。Pandas的get_dummies()更简洁，但sklearn的OneHotEncoder可保存编码映射，适合生产环境。OneHot适合无序类别，但高基数特征会产生大量列。',
          codeExample: `from sklearn.preprocessing import OneHotEncoder
ohe = OneHotEncoder(sparse_output=False, drop='first')
encoded = ohe.fit_transform(df[['婚姻状况', '是否有房']])
# Pandas方式
df_encoded = pd.get_dummies(df, columns=['婚姻状况'], drop_first=True, dtype=int)`,
          importance: 'important',
        },
        {
          title: '目标编码',
          content: '目标编码（Target Encoding）将类别替换为目标变量的条件均值，即该类别对应的标签均值。适合高基数类别特征（如邮编、用户ID），不增加特征维度。但容易过拟合，需要正则化：使用K折交叉验证计算目标编码，或添加随机噪声。category_encoders库提供了成熟的实现。目标编码在Kaggle竞赛中广泛使用，是处理高基数类别的有效策略。',
          codeExample: `# 手动目标编码
target_mean = df.groupby('城市')['是否违约'].mean()
df['城市_目标编码'] = df['城市'].map(target_mean)
# 添加平滑避免过拟合
global_mean = df['是否违约'].mean()
smoothing = 10
df['城市_平滑编码'] = (df.groupby('城市')['是否违约'].transform('sum') + smoothing * global_mean) / (df.groupby('城市')['是否违约'].transform('count') + smoothing)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '连续特征处理',
      items: [
        {
          title: '分箱处理',
          content: '分箱（Binning）将连续特征转为离散区间，减少噪声影响、捕获非线性关系。pd.cut()按等宽分箱，指定bins数量或边界列表；pd.qcut()按等频分箱，每箱样本数大致相同。labels参数自定义箱标签。分箱后的特征可作为类别特征输入模型，也可与原始特征并存。分箱适合特征与目标之间有明确阈值效应的场景，如信用评分的等级划分。',
          codeExample: `df['年龄分组'] = pd.cut(df['年龄'], bins=[0, 30, 45, 60, 100], labels=['青年', '中年', '中老年', '老年'])
df['收入分组'] = pd.qcut(df['收入'], q=4, labels=['Q1', 'Q2', 'Q3', 'Q4'])
print(df['年龄分组'].value_counts())`,
          importance: 'core',
        },
        {
          title: '多项式特征与对数变换',
          content: '多项式特征通过特征的高次幂和交叉项扩展特征空间，帮助线性模型捕获非线性关系。sklearn的PolynomialFeatures(degree=2)生成二次项和交互项。对数变换np.log1p()压缩长尾分布，使偏态数据更接近正态分布，提升模型表现。对数变换适合收入、金额等右偏数据。注意：多项式特征会指数级增加维度，degree一般不超过3。',
          codeExample: `from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(df[['年龄', '收入']])
df['收入_log'] = np.log1p(df['收入'])  # log(1+x)，避免log(0)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '特征交叉',
      items: [
        {
          title: '组合特征与交互特征',
          content: '特征交叉通过组合现有特征创造新特征，捕获特征间的交互效应。常见交叉方式：乘法（收入×负债比=还款压力）、除法（贷款/收入=贷款收入比）、比率（逾期次数/信用历史=逾期率）。交互特征可以通过业务理解手动构建，也可以用PolynomialFeatures自动生成。好的交叉特征往往比原始特征更有预测力，是特征工程的核心技巧。',
          codeExample: `df['还款压力'] = df['收入'] * df['负债比']
df['贷款收入比'] = df['贷款金额'] / df['收入']
df['逾期率'] = df['逾期次数'] / df['信用历史'].clip(lower=1)
df['年龄收入交互'] = df['年龄'] * df['收入']`,
          importance: 'core',
        },
        {
          title: '特征组合策略',
          content: '特征组合策略需要结合业务知识和数据探索。常用策略：1）业务驱动：根据领域知识构建有意义的交叉特征；2）统计驱动：通过相关系数和互信息发现强关联特征对；3）模型驱动：利用树模型的特征交互信息。特征哈希（Feature Hashing）用哈希函数将高维特征映射到固定维度，适合超大规模类别组合。组合策略应避免盲目穷举，聚焦有业务解释性的特征。',
          codeExample: `# 相关性驱动的特征交叉
corr_matrix = df.corr(numeric_only=True)
high_corr = corr_matrix[corr_matrix.abs() > 0.5].stack().dropna()
# 特征哈希（简单实现）
import hashlib
df['城市_哈希'] = df['城市'].apply(lambda x: int(hashlib.md5(x.encode()).hexdigest()[:8], 16) % 100)
print(df['城市_哈希'].head())`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '特征选择',
      items: [
        {
          title: '方差阈值与相关系数',
          content: '方差阈值法（VarianceThreshold）删除方差过低的特征，因为方差接近0的特征几乎不携带信息。相关系数法删除高度相关的冗余特征（保留一个），以及与目标变量相关性极低的无用特征。皮尔逊相关系数衡量线性关系，斯皮尔曼相关系数衡量单调关系。这些方法计算简单、速度快，适合初步筛选，但可能遗漏非线性关系。',
          codeExample: `from sklearn.feature_selection import VarianceThreshold
vt = VarianceThreshold(threshold=0.01)
X_selected = vt.fit_transform(X)
# 删除高相关特征
corr = pd.DataFrame(X).corr().abs()
upper = corr.where(np.triu(np.ones(corr.shape), k=1).astype(bool))
to_drop = [col for col in upper.columns if any(upper[col] > 0.95)]`,
          importance: 'core',
        },
        {
          title: '互信息与特征重要性',
          content: '互信息（Mutual Information）衡量特征与目标之间的信息依赖，能捕获非线性关系，比相关系数更全面。sklearn的mutual_info_classif/regression计算互信息得分。树模型的feature_importances_基于分裂增益衡量特征重要性，是最常用的特征选择方法。随机森林的特征重要性具有鲁棒性，不受特征缩放影响。排列重要性（Permutation Importance）更可靠但计算更慢。',
          codeExample: `from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)
importance = pd.Series(rf.feature_importances_, index=X.columns)
print(importance.sort_values(ascending=False).head(10))`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目9: 异常值检测 ==========
export const project9: BootcampProject = {
  id: 'bootcamp-09',
  title: '异常值检测',
  description: '通过分析服务器监控数据，学习多种异常值检测方法，包括IQR、Z-Score、孤立森林和LOF，并输出综合异常报告。',
  difficulty: 'advanced',
  difficultyLabel: '高级',
  tags: ['异常检测', 'IQR', 'Z-Score', '孤立森林', 'LOF'],
  datasetCode: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(951)

n = 2000
timestamps = [datetime(2024, 1, 1) + timedelta(minutes=5*i) for i in range(n)]

# 正常数据
cpu = np.random.normal(45, 10, n)
memory = np.random.normal(60, 8, n)
network = np.random.normal(500, 100, n)
response_time = np.random.normal(200, 50, n)
error_rate = np.random.normal(0.5, 0.2, n)

# 注入异常点（约5%）
n_anomalies = 100
anomaly_idx = np.random.choice(n, n_anomalies, replace=False)

# CPU异常飙升
cpu_spike = np.random.choice(n_anomalies // 3, replace=False)
cpu[anomaly_idx[cpu_spike]] = np.random.uniform(85, 99, len(cpu_spike))

# 内存泄漏
mem_leak = np.random.choice(n_anomalies // 3, replace=False)
memory[anomaly_idx[mem_leak]] = np.random.uniform(85, 98, len(mem_leak))

# 网络异常
net_anomaly = np.random.choice(n_anomalies // 3, replace=False)
network[anomaly_idx[net_anomaly]] = np.random.choice(
    [np.random.uniform(0, 10, len(net_anomaly)),  # 网络断流
     np.random.uniform(2000, 5000, len(net_anomaly))],  # 流量突增
    size=1
).flatten()[:len(net_anomaly)]

# 响应时间异常
remaining = n_anomalies - len(cpu_spike) - len(mem_leak) - len(net_anomaly)
resp_anomaly = anomaly_idx[len(cpu_spike)+len(mem_leak)+len(net_anomaly):]
response_time[resp_anomaly] = np.random.uniform(1000, 5000, len(resp_anomaly))
error_rate[resp_anomaly] = np.random.uniform(3, 10, len(resp_anomaly))

# 确保数值合理
cpu = np.clip(cpu, 0, 100)
memory = np.clip(memory, 0, 100)
network = np.clip(network, 0, None)
response_time = np.clip(response_time, 0, None)
error_rate = np.clip(error_rate, 0, None)

df = pd.DataFrame({
    '时间戳': timestamps,
    'CPU使用率': np.round(cpu, 2),
    '内存使用率': np.round(memory, 2),
    '网络流量': np.round(network, 2),
    '响应时间': np.round(response_time, 2),
    '错误率': np.round(error_rate, 2),
})`,
  datasetDescription: '模拟服务器监控数据，2000条记录，字段包括：时间戳、CPU使用率、内存使用率、网络流量、响应时间、错误率。数据中包含约5%的异常点。',
  tasks: [
    {
      id: 'task-09-1',
      title: 'IQR方法检测异常值',
      description: '使用IQR方法（四分位距法）检测各指标的异常值，标记超出Q1-1.5*IQR和Q3+1.5*IQR范围的点。',
      hint: 'Q1 = df[col].quantile(0.25)，Q3 = df[col].quantile(0.75)，IQR = Q3 - Q1，异常 = (val < Q1-1.5*IQR) | (val > Q3+1.5*IQR)。',
      validation: '正确使用IQR方法检测各指标异常值',
    },
    {
      id: 'task-09-2',
      title: 'Z-Score方法检测异常值',
      description: '使用Z-Score方法检测异常值，标记|Z|>3的数据点为异常。',
      hint: 'z_score = (df[col] - df[col].mean()) / df[col].std()，异常 = abs(z_score) > 3。',
      validation: '正确使用Z-Score方法检测异常值',
    },
    {
      id: 'task-09-3',
      title: '孤立森林检测',
      description: '使用sklearn的IsolationForest对多维数据进行异常检测，标记异常点。',
      hint: 'from sklearn.ensemble import IsolationForest，iso = IsolationForest(contamination=0.05, random_state=42)，iso.fit_predict(X)。',
      validation: '正确使用孤立森林进行异常检测',
    },
    {
      id: 'task-09-4',
      title: '多维度联合异常检测',
      description: '综合IQR、Z-Score和孤立森林的结果，统计被至少2种方法标记为异常的数据点，作为最终异常点。',
      hint: '将三种方法的异常标记合并，df["异常计数"] = iqr_flag + zscore_flag + iso_flag，最终异常 = 异常计数 >= 2。',
      validation: '正确综合多种方法进行联合异常检测',
    },
    {
      id: 'task-09-5',
      title: '输出异常报告',
      description: '生成异常检测报告，包括各方法检测的异常数量、联合检测的异常数量、异常时间段的分布和异常指标统计。',
      hint: '汇总各方法结果，按时间段统计异常分布，输出各指标异常统计。',
      validation: '输出完整的异常检测报告',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor

# 数据集已加载到变量 df 中
# df 包含列：时间戳、CPU使用率、内存使用率、网络流量、响应时间、错误率

# 任务1: IQR方法检测异常值
# 在这里编写你的代码

# 任务2: Z-Score方法检测异常值
# 在这里编写你的代码

# 任务3: 孤立森林检测
# 在这里编写你的代码

# 任务4: 多维度联合异常检测
# 在这里编写你的代码

# 任务5: 输出异常报告
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor

monitor_cols = ['CPU使用率', '内存使用率', '网络流量', '响应时间', '错误率']

# 任务1: IQR方法检测异常值
iqr_flags = pd.DataFrame(index=df.index)
for col in monitor_cols:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    iqr_flags[f'{col}_iqr'] = ((df[col] < lower) | (df[col] > upper)).astype(int)

df['IQR异常数'] = iqr_flags.sum(axis=1)
df['IQR异常'] = (df['IQR异常数'] > 0).astype(int)
print("=== IQR方法检测结果 ===")
for col in monitor_cols:
    print(f"  {col} 异常数: {iqr_flags[f'{col}_iqr'].sum()}")
print(f"  总异常记录数: {df['IQR异常'].sum()}")

# 任务2: Z-Score方法检测异常值
zscore_flags = pd.DataFrame(index=df.index)
for col in monitor_cols:
    z = (df[col] - df[col].mean()) / df[col].std()
    zscore_flags[f'{col}_zscore'] = (z.abs() > 3).astype(int)

df['ZScore异常数'] = zscore_flags.sum(axis=1)
df['ZScore异常'] = (df['ZScore异常数'] > 0).astype(int)
print("\\n=== Z-Score方法检测结果 ===")
for col in monitor_cols:
    print(f"  {col} 异常数: {zscore_flags[f'{col}_zscore'].sum()}")
print(f"  总异常记录数: {df['ZScore异常'].sum()}")

# 任务3: 孤立森林检测
iso = IsolationForest(contamination=0.05, random_state=42)
iso_pred = iso.fit_predict(df[monitor_cols])
df['孤立森林异常'] = (iso_pred == -1).astype(int)
print("\\n=== 孤立森林检测结果 ===")
print(f"  异常记录数: {df['孤立森林异常'].sum()}")

# 任务4: 多维度联合异常检测
df['异常计数'] = df['IQR异常'] + df['ZScore异常'] + df['孤立森林异常']
df['最终异常'] = (df['异常计数'] >= 2).astype(int)
print("\\n=== 联合异常检测结果 ===")
print(f"  至少2种方法标记异常: {df['最终异常'].sum()}条")
print(f"  3种方法均标记异常: {(df['异常计数'] == 3).sum()}条")

# 任务5: 输出异常报告
print("\\n" + "=" * 50)
print("       服务器监控异常检测报告")
print("=" * 50)

print(f"\\n【检测概况】")
print(f"  总记录数: {len(df)}")
print(f"  IQR方法异常数: {df['IQR异常'].sum()} ({df['IQR异常'].mean():.2%})")
print(f"  Z-Score方法异常数: {df['ZScore异常'].sum()} ({df['ZScore异常'].mean():.2%})")
print(f"  孤立森林异常数: {df['孤立森林异常'].sum()} ({df['孤立森林异常'].mean():.2%})")
print(f"  联合检测异常数: {df['最终异常'].sum()} ({df['最终异常'].mean():.2%})")

print(f"\\n【各指标异常统计】")
for col in monitor_cols:
    iqr_n = iqr_flags[f'{col}_iqr'].sum()
    z_n = zscore_flags[f'{col}_zscore'].sum()
    print(f"  {col}: IQR={iqr_n}, Z-Score={z_n}")

print(f"\\n【异常时间段分布】")
df['小时'] = pd.to_datetime(df['时间戳']).dt.hour
hourly_anomaly = df[df['最终异常'] == 1].groupby('小时').size()
print(f"  异常最多的时段: {hourly_anomaly.idxmax()}时 ({hourly_anomaly.max()}次)")

print(f"\\n【异常记录样本】")
anomaly_cols = ['时间戳'] + monitor_cols + ['异常计数']
print(df[df['最终异常'] == 1][anomaly_cols].head(10).to_string(index=False))
`,
  keyPoints: ['IQR方法', 'Z-Score方法', '孤立森林IsolationForest', 'LOF局部异常因子', '多方法联合检测', '异常报告'],
  outline: [
    {
      title: '统计方法',
      items: [
        {
          title: 'IQR四分位距法',
          content: 'IQR方法基于数据的四分位数检测异常值，是最经典的单变量异常检测方法。计算Q1（25%分位数）和Q3（75%分位数），IQR=Q3-Q1。异常值判定：低于Q1-1.5×IQR或高于Q3+1.5×IQR的值。1.5倍IQR是温和异常值阈值，3倍IQR为极端异常值。IQR方法对数据分布假设少，对非正态分布数据也有较好的鲁棒性，适合作为异常检测的基线方法。',
          codeExample: `Q1 = df['CPU使用率'].quantile(0.25)
Q3 = df['CPU使用率'].quantile(0.75)
IQR = Q3 - Q1
lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
outliers = df[(df['CPU使用率'] < lower) | (df['CPU使用率'] > upper)]
print(f'异常值数量: {len(outliers)}')`,
          importance: 'core',
        },
        {
          title: 'Z-Score标准分法与3σ原则',
          content: 'Z-Score方法计算每个值偏离均值的标准差倍数：Z = (x - μ) / σ。3σ原则将|Z|>3的值判定为异常（正态分布下99.7%的数据在3σ内）。Grubbs检验是更严格的统计检验方法，逐步检测并剔除最大偏差值。Z-Score方法简单直观，但对非正态分布效果差，且均值和标准差本身会被极端值拉偏。改良的MAD-Z Score用中位数和MAD替代，更鲁棒。',
          codeExample: `z_scores = (df['响应时间'] - df['响应时间'].mean()) / df['响应时间'].std()
outliers = df[z_scores.abs() > 3]
# MAD-Z Score（更鲁棒）
median = df['响应时间'].median()
mad = (df['响应时间'] - median).abs().median()
modified_z = 0.6745 * (df['响应时间'] - median) / mad
outliers_mad = df[modified_z.abs() > 3.5]`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '孤立森林',
      items: [
        {
          title: 'IsolationForest原理',
          content: '孤立森林（Isolation Forest）基于"异常点更少且不同"的直觉，通过随机分割将数据点孤立。算法递归地随机选择特征和分割值，将数据空间划分为区域。异常点由于稀少且与多数点不同，通常只需较少的分割次数即可被孤立，因此路径长度较短。异常分数 = 2^(-E(h)/c(n))，其中E(h)为平均路径长度，c(n)为归一化因子。分数越接近1越可能是异常。',
          codeExample: `from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.05, random_state=42, n_estimators=100)
pred = iso.fit_predict(X)
# -1表示异常，1表示正常
anomaly_score = iso.decision_function(X)
print(f'异常数量: {(pred == -1).sum()}')`,
          importance: 'core',
        },
        {
          title: 'contamination参数与sklearn实现',
          content: 'contamination参数指定数据中异常点的预期比例，影响异常判定的阈值。取值范围(0, 0.5]，默认0.1。如果已知异常比例约为5%，设置contamination=0.05可获得更准确的结果。n_estimators控制树的数量（默认100），max_samples控制每棵树的采样量。IsolationForest的优势：无需计算距离矩阵、线性时间复杂度、适合高维数据、无需正态假设。',
          codeExample: `iso = IsolationForest(contamination=0.05, n_estimators=100, max_samples='auto', random_state=42)
labels = iso.fit_predict(df[monitor_cols])
df['孤立森林异常'] = (labels == -1).astype(int)
scores = iso.decision_function(df[monitor_cols])
print(f'异常比例: {df["孤立森林异常"].mean():.2%}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: 'LOF方法',
      items: [
        {
          title: '局部异常因子原理',
          content: '局部异常因子（Local Outlier Factor, LOF）通过比较数据点的局部密度与其邻居的局部密度来检测异常。核心思想：异常点的局部密度显著低于其邻居的局部密度。计算步骤：1）找k近邻；2）计算局部可达密度（LRD）；3）LOF = 邻居平均LRD / 自身LRD。LOF≈1表示与邻居密度相当（正常），LOF>>1表示密度远低于邻居（异常）。LOF能检测局部异常，对密度不均的数据效果好。',
          codeExample: `from sklearn.neighbors import LocalOutlierFactor
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
labels = lof.fit_predict(X)
# LOF负值表示异常
df['LOF异常'] = (labels == -1).astype(int)
# 获取LOF分数（负值，越小越异常）
lof_scores = lof.negative_outlier_factor_`,
          importance: 'core',
        },
        {
          title: 'k近邻与局部密度',
          content: 'LOF的关键参数是n_neighbors（k值），控制局部邻域的大小。k太小导致局部波动敏感，k太大则退化为全局方法。通常k取10-50之间，可通过交叉验证选择。contamination参数与IsolationForest类似。LOF的计算复杂度为O(n²)，大数据集上较慢。LOF的优势在于能处理密度不均匀的数据，对局部异常点更敏感，但需要存储距离矩阵，内存消耗较大。',
          codeExample: `lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
labels = lof.fit_predict(df[monitor_cols])
df['LOF异常'] = (labels == -1).astype(int)
print(f'LOF检测异常数: {df["LOF异常"].sum()}')
print(f'LOF分数范围: [{lof.negative_outlier_factor_.min():.2f}, {lof.negative_outlier_factor_.max():.2f}]')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '多维异常检测',
      items: [
        {
          title: '特征组合与多变量统计距离',
          content: '单变量异常检测可能遗漏多维空间中的异常点——每个维度单独看都正常，但组合起来异常。马氏距离（Mahalanobis Distance）考虑特征间相关性，计算样本到分布中心的标准化距离：D² = (x-μ)ᵀΣ⁻¹(x-μ)。卡方分布下可设定阈值。多变量统计距离适合检测特征组合异常，如CPU正常但内存极高、或响应时间正常但错误率极高的情况。',
          codeExample: `from scipy.spatial.distance import mahalanobis
cov = df[monitor_cols].cov().values
inv_cov = np.linalg.inv(cov)
center = df[monitor_cols].mean().values
df['马氏距离'] = df[monitor_cols].apply(lambda x: mahalanobis(x, center, inv_cov), axis=1)
threshold = np.sqrt(df['马氏距离'].quantile(0.99))
df['多维异常'] = (df['马氏距离'] > threshold).astype(int)`,
          importance: 'core',
        },
        {
          title: '业务规则与异常报告',
          content: '综合多种检测方法的结果，结合业务规则生成最终异常报告。常用策略：投票法（被多种方法标记的更可信）、加权法（根据方法可靠性赋权）。业务规则补充统计方法无法捕获的领域知识，如"CPU>95%持续5分钟"或"错误率>5%"。异常报告应包含：异常时间、异常指标、异常程度、可能原因、建议措施。报告应可操作，便于运维人员快速响应。',
          codeExample: `df['异常计数'] = df['IQR异常'] + df['ZScore异常'] + df['孤立森林异常']
df['最终异常'] = (df['异常计数'] >= 2).astype(int)
# 生成报告
report = df[df['最终异常'] == 1][['时间戳'] + monitor_cols + ['异常计数']]
print(f'异常报告: {len(report)}条异常记录')
print(report.head())`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};

// ========== 项目10: 多数据集合并 ==========
export const project10: BootcampProject = {
  id: 'bootcamp-10',
  title: '多数据集合并',
  description: '通过操作客户信息表、订单表和产品表三个关联数据集，系统学习Pandas数据合并的多种方法，包括merge、concat、join和多表关联。',
  difficulty: 'elementary',
  difficultyLabel: '初级',
  tags: ['数据合并', 'merge', 'concat', '多表关联', '数据一致性'],
  datasetCode: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(111)

# 客户信息表
n_customers = 200
df_customers = pd.DataFrame({
    '客户ID': [f'C{i:04d}' for i in range(1, n_customers + 1)],
    '客户名': [f'客户{i}' for i in range(1, n_customers + 1)],
    '城市': np.random.choice(['北京', '上海', '广州', '深圳', '杭州', '成都'], n_customers),
    '会员等级': np.random.choice(['普通', '银卡', '金卡', '钻石'], n_customers, p=[0.4, 0.3, 0.2, 0.1]),
    '注册日期': [datetime(2022, 1, 1) + timedelta(days=int(d)) for d in np.random.randint(0, 365, n_customers)],
})

# 产品表
n_products = 50
df_products = pd.DataFrame({
    '产品ID': [f'P{i:03d}' for i in range(1, n_products + 1)],
    '产品名': [f'产品{i}' for i in range(1, n_products + 1)],
    '类别': np.random.choice(['电子', '服装', '食品', '家居', '美妆'], n_products),
    '单价': np.round(np.random.uniform(20, 1500, n_products), 2),
})

# 订单表
n_orders = 1000
df_orders = pd.DataFrame({
    '订单ID': [f'ORD{i:05d}' for i in range(1, n_orders + 1)],
    '客户ID': np.random.choice(df_customers['客户ID'], n_orders),
    '产品ID': np.random.choice(df_products['产品ID'], n_orders),
    '数量': np.random.randint(1, 10, n_orders),
    '订单日期': [datetime(2023, 1, 1) + timedelta(days=int(d)) for d in np.random.randint(0, 365, n_orders)],
})`,
  datasetDescription: '三个关联表：df_customers为客户信息表（200客户）、df_orders为订单表（1000订单）、df_products为产品表（50产品）。通过客户ID和产品ID关联。',
  tasks: [
    {
      id: 'task-10-1',
      title: '两表内连接查询',
      description: '将订单表(df_orders)与客户表(df_customers)通过客户ID进行内连接，查看合并后的数据形状和列名。',
      hint: '使用 pd.merge(df_orders, df_customers, on="客户ID", how="inner") 进行内连接。',
      validation: '正确执行内连接并查看结果',
    },
    {
      id: 'task-10-2',
      title: '左连接保留所有客户',
      description: '将客户表(df_customers)与订单表(df_orders)通过客户ID进行左连接，保留所有客户（包括未下单的客户），统计未下单客户数。',
      hint: 'pd.merge(df_customers, df_orders, on="客户ID", how="left")，未下单客户 = 订单ID为NaN的记录。',
      validation: '正确执行左连接并统计未下单客户',
    },
    {
      id: 'task-10-3',
      title: '多表关联查询',
      description: '将订单表、客户表和产品表三表关联，生成完整的订单明细表（包含客户信息和产品信息），计算每笔订单的销售额。',
      hint: '链式merge：先merge订单和客户，再merge结果和产品，然后计算 销售额 = 数量 × 单价。',
      validation: '正确关联三张表并计算销售额',
    },
    {
      id: 'task-10-4',
      title: 'concat合并同类数据',
      description: '将订单按季度分为4个子集，使用concat重新合并，验证合并后数据与原始数据一致。',
      hint: '按季度筛选后用 pd.concat([q1, q2, q3, q4]) 合并，用 equals() 或比较shape验证一致性。',
      validation: '正确使用concat合并并验证一致性',
    },
    {
      id: 'task-10-5',
      title: '数据一致性验证',
      description: '验证三张表的关联一致性：检查订单表中的客户ID是否都在客户表中、产品ID是否都在产品表中，检查是否有孤立记录。',
      hint: '使用 set(df_orders["客户ID"]) - set(df_customers["客户ID"]) 检查不一致的ID。',
      validation: '正确验证数据一致性并报告结果',
    },
  ],
  starterCode: `import pandas as pd
import numpy as np

# 数据集已加载到变量 df_customers, df_orders, df_products 中
# df_customers: 客户信息表（客户ID, 客户名, 城市, 会员等级, 注册日期）
# df_orders: 订单表（订单ID, 客户ID, 产品ID, 数量, 订单日期）
# df_products: 产品表（产品ID, 产品名, 类别, 单价）

# 任务1: 两表内连接查询
# 在这里编写你的代码

# 任务2: 左连接保留所有客户
# 在这里编写你的代码

# 任务3: 多表关联查询
# 在这里编写你的代码

# 任务4: concat合并同类数据
# 在这里编写你的代码

# 任务5: 数据一致性验证
# 在这里编写你的代码
`,
  referenceSolution: `import pandas as pd
import numpy as np

# 任务1: 两表内连接查询
order_customer = pd.merge(df_orders, df_customers, on='客户ID', how='inner')
print("=== 内连接结果 ===")
print(f"合并后形状: {order_customer.shape}")
print(f"列名: {order_customer.columns.tolist()}")
print(order_customer.head())

# 任务2: 左连接保留所有客户
customer_order = pd.merge(df_customers, df_orders, on='客户ID', how='left')
no_order = customer_order[customer_order['订单ID'].isna()]
print(f"\\n=== 左连接结果 ===")
print(f"合并后形状: {customer_order.shape}")
print(f"未下单客户数: {len(no_order)}")
print(f"未下单客户占比: {len(no_order)/len(df_customers):.2%}")

# 任务3: 多表关联查询
full_detail = pd.merge(df_orders, df_customers, on='客户ID', how='left')
full_detail = pd.merge(full_detail, df_products, on='产品ID', how='left')
full_detail['销售额'] = full_detail['数量'] * full_detail['单价']
print(f"\\n=== 三表关联结果 ===")
print(f"合并后形状: {full_detail.shape}")
print(f"总销售额: ¥{full_detail['销售额'].sum():,.2f}")
print(full_detail[['订单ID', '客户名', '产品名', '数量', '单价', '销售额']].head())

# 任务4: concat合并同类数据
df_orders['订单日期'] = pd.to_datetime(df_orders['订单日期'])
q1 = df_orders[df_orders['订单日期'].dt.month <= 3]
q2 = df_orders[(df_orders['订单日期'].dt.month > 3) & (df_orders['订单日期'].dt.month <= 6)]
q3 = df_orders[(df_orders['订单日期'].dt.month > 6) & (df_orders['订单日期'].dt.month <= 9)]
q4 = df_orders[df_orders['订单日期'].dt.month > 9]

print(f"\\n=== 各季度订单数 ===")
print(f"Q1: {len(q1)}, Q2: {len(q2)}, Q3: {len(q3)}, Q4: {len(q4)}")

merged_back = pd.concat([q1, q2, q3, q4], ignore_index=True)
merged_back = merged_back.sort_values('订单ID').reset_index(drop=True)
original_sorted = df_orders.sort_values('订单ID').reset_index(drop=True)
print(f"合并后行数: {len(merged_back)}, 原始行数: {len(original_sorted)}")
print(f"数据一致: {len(merged_back) == len(original_sorted)}")

# 任务5: 数据一致性验证
print(f"\\n=== 数据一致性验证 ===")

# 检查订单表中的客户ID
order_customers = set(df_orders['客户ID'].unique())
all_customers = set(df_customers['客户ID'].unique())
missing_customers = order_customers - all_customers
print(f"订单中引用的客户ID数: {len(order_customers)}")
print(f"客户表中的客户ID数: {len(all_customers)}")
print(f"订单中不存在的客户ID: {len(missing_customers)}")

# 检查订单表中的产品ID
order_products = set(df_orders['产品ID'].unique())
all_products = set(df_products['产品ID'].unique())
missing_products = order_products - all_products
print(f"\\n订单中引用的产品ID数: {len(order_products)}")
print(f"产品表中的产品ID数: {len(all_products)}")
print(f"订单中不存在的产品ID: {len(missing_products)}")

# 检查未下单客户
no_order_customers = all_customers - order_customers
print(f"\\n未下单客户数: {len(no_order_customers)}")

# 检查未售出产品
unsold_products = all_products - order_products
print(f"未售出产品数: {len(unsold_products)}")

print(f"\\n数据一致性结论: {'通过' if len(missing_customers) == 0 and len(missing_products) == 0 else '存在问题'}")
`,
  keyPoints: ['merge内连接/左连接/右连接/外连接', 'concat纵向/横向拼接', 'join索引合并', '多表关联', '数据一致性检查'],
  outline: [
    {
      title: 'merge连接',
      items: [
        {
          title: '四种连接类型',
          content: 'pd.merge()支持四种连接类型，通过how参数指定：inner（内连接，取交集，只保留两表都有的键）、left（左连接，保留左表所有行）、right（右连接，保留右表所有行）、outer（外连接，取并集，保留所有行）。默认为inner。on参数指定连接键列名，两表键列名不同时用left_on/right_on。merge是Pandas数据合并的核心方法，类似于SQL的JOIN操作。',
          codeExample: `# 内连接：只保留两表都有的客户
result = pd.merge(df_orders, df_customers, on='客户ID', how='inner')
# 左连接：保留所有订单（即使客户信息缺失）
result = pd.merge(df_orders, df_customers, on='客户ID', how='left')
print(f'内连接: {len(result)}行, 左连接: {len(result)}行')`,
          importance: 'core',
        },
        {
          title: 'on参数与连接键',
          content: 'on参数指定连接键，当两表键列名相同时直接用on="列名"。列名不同时使用left_on="左表列"和right_on="右表列"。多键连接传入列表：on=["键1","键2"]。连接后重复列名会自动添加后缀（_x, _y），可通过suffixes参数自定义。如果连接键就是索引，可使用left_index=True或right_index=True。选择正确的连接键是数据合并成功的关键。',
          codeExample: `# 不同列名连接
result = pd.merge(df1, df2, left_on='客户编号', right_on='客户ID', how='inner')
# 多键连接
result = pd.merge(df1, df2, on=['门店', '日期'], how='left')
# 自定义后缀
result = pd.merge(df1, df2, on='ID', suffixes=('_订单', '_退货'))`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '连接键处理',
      items: [
        {
          title: '多键连接与indicator参数',
          content: '多键连接使用on=["键1","键2"]指定多个连接列，只有所有指定列都匹配时才连接。indicator=True参数添加_merge列，标记每行的来源：both（两表都有）、left_only（仅左表）、right_only（仅右表）。indicator非常适合诊断连接结果，快速发现不匹配的记录。validate参数验证连接类型："1:1"一对一、"1:m"一对多、"m:m"多对多，防止意外产生笛卡尔积。',
          codeExample: `result = pd.merge(df_orders, df_customers, on='客户ID', how='outer', indicator=True)
print(result['_merge'].value_counts())
# 验证一对一连接
result = pd.merge(df1, df2, on='ID', validate='1:1')`,
          importance: 'core',
        },
        {
          title: 'suffixes与validate验证',
          content: 'suffixes参数控制非连接键列名冲突时的后缀，默认为("_x","_y")。建议使用有意义的后缀如("_订单","_退货")提高可读性。validate参数在合并时检查键的对应关系："one_to_one"确保键唯一、"one_to_many"允许一对多、"many_to_many"允许多对多。如果验证失败抛出MergeError。validate是防止数据爆炸（意外笛卡尔积）的重要安全措施。',
          codeExample: `result = pd.merge(df_orders, df_products, on='产品ID', how='left',
    suffixes=('_订单', '_产品'), validate='many_to_one')
# 检查是否有重复行（可能表示数据问题）
dup_keys = result.duplicated(subset=['订单ID', '产品ID']).sum()
print(f'重复键数: {dup_keys}')`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: 'concat拼接',
      items: [
        {
          title: '纵向与横向拼接',
          content: 'pd.concat()沿指定轴拼接DataFrame列表。axis=0（默认）纵向拼接（追加行），axis=1横向拼接（追加列）。纵向拼接时，列名相同的列对齐，不同列填充NaN。横向拼接时，按索引对齐。objs参数传入DataFrame列表。纵向拼接适合合并结构相同的分片数据（如各月数据），横向拼接适合合并不同特征列（如基本信息+行为信息）。',
          codeExample: `# 纵向拼接（追加行）
full = pd.concat([df_q1, df_q2, df_q3, df_q4], axis=0)
# 横向拼接（追加列）
wide = pd.concat([df_info, df_scores], axis=1)
print(f'纵向拼接: {full.shape}, 横向拼接: {wide.shape}')`,
          importance: 'core',
        },
        {
          title: 'ignore_index与keys层次索引',
          content: 'ignore_index=True忽略原始索引，生成新的0到n-1的整数索引，适合纵向拼接后不需要保留来源信息的情况。keys参数为每段数据添加层次索引标签，如keys=["Q1","Q2","Q3","Q4"]，便于追踪数据来源。verify_integrity=True检查结果索引是否唯一（有重复则报错）。concat后的索引可能重复，建议使用ignore_index=True或reset_index()重置。',
          codeExample: `# 带来源标签的拼接
full = pd.concat([df_q1, df_q2, df_q3, df_q4], keys=['Q1', 'Q2', 'Q3', 'Q4'])
print(full.loc['Q1'].head())  # 按来源选取
# 重置索引
full = pd.concat([df_q1, df_q2], ignore_index=True)`,
          importance: 'supplementary',
        },
      ],
    },
    {
      title: '数据一致性',
      items: [
        {
          title: '缺失值与重复值检查',
          content: '合并后的数据需要检查一致性。缺失值检查：isnull().sum()统计每列缺失数量，左/外连接产生的缺失值表示右/左表中无匹配记录。重复值检查：duplicated()检测合并后是否产生重复行，多对多连接可能导致行数膨胀。检查行数是否符合预期：内连接行数≤min(左表,右表)，左连接行数=左表行数，外连接行数≥max(左表,右表)。',
          codeExample: `merged = pd.merge(df_orders, df_customers, on='客户ID', how='left')
print(f'缺失值:\\n{merged.isnull().sum()}')
print(f'重复行: {merged.duplicated().sum()}')
print(f'行数: {len(merged)}, 预期: {len(df_orders)}')`,
          importance: 'core',
        },
        {
          title: '引用完整性与合并后验证',
          content: '引用完整性检查确保关联表之间的ID对应关系正确：子表中的外键值必须存在于父表的主键中。使用集合差集检查：set(子表外键) - set(父表主键)找出孤立引用。合并后验证包括：行数是否合理、缺失值比例是否可接受、关键列的统计量是否与预期一致。数据一致性是保证分析结果可靠的前提，合并操作后务必进行验证。',
          codeExample: `# 检查引用完整性
orphan_customers = set(df_orders['客户ID']) - set(df_customers['客户ID'])
orphan_products = set(df_orders['产品ID']) - set(df_products['产品ID'])
print(f'孤立客户引用: {len(orphan_customers)}')
print(f'孤立产品引用: {len(orphan_products)}')
# 验证合并结果
assert len(result) == len(df_orders), '行数异常'`,
          importance: 'supplementary',
        },
      ],
    },
  ],
};
