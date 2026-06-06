import type { Quiz } from '../../types';

export const quiz2: Quiz = {
  id: 'quiz-data-processing',
  moduleId: 'data-processing',
  title: '数据处理与分析测评',
  questions: [
    {
      id: 'q2-1',
      type: 'choice',
      question: 'NumPy中，以下哪种方式创建的数组是只读的？',
      options: [
        'np.array([1, 2, 3])',
        'np.array([1, 2, 3], readonly=True)',
        'np.array([1, 2, 3]).view()',
        '以上都不是'
      ],
      answer: '以上都不是',
      explanation: 'NumPy数组默认是可写的。要创建只读数组需要设置 writeable=False 属性，或使用 np.shares_memory() 相关方法。'
    },
    {
      id: 'q2-2',
      type: 'choice',
      question: '在Pandas中，`df.loc[0]` 和 `df.iloc[0]` 的区别是什么？',
      options: [
        '没有区别',
        'loc基于位置索引，iloc基于标签索引',
        'loc基于标签索引，iloc基于位置索引',
        'loc只能选择行，iloc只能选择列'
      ],
      answer: 'loc基于标签索引，iloc基于位置索引',
      explanation: 'loc使用标签（索引名）进行选择，iloc使用整数位置进行选择。当索引为默认整数时，loc[0]和iloc[0]结果相同，但本质不同。'
    },
    {
      id: 'q2-3',
      type: 'fill',
      question: '使用Pandas检测DataFrame中每列缺失值数量的方法是______。',
      answer: 'df.isna().sum()',
      explanation: 'isna()返回布尔DataFrame表示是否为缺失值，sum()对每列求和统计True（缺失值）的数量。也可以用isnull()。'
    },
    {
      id: 'q2-4',
      type: 'choice',
      question: '关于pd.merge()的how参数，以下说法错误的是？',
      options: [
        'how="inner"取交集',
        'how="outer"取并集',
        'how="left"保留左表所有行',
        'how="cross"只匹配相同键'
      ],
      answer: 'how="cross"只匹配相同键',
      explanation: 'how="cross"执行笛卡尔积（交叉连接），生成两个DataFrame所有行的组合，而不是只匹配相同键。'
    },
    {
      id: 'q2-5',
      type: 'coding',
      question: '编写一个函数 `fill_missing_with_group_mean(df, group_col, value_col)`，按group_col分组，用各组的均值填充value_col中的缺失值。',
      answer: 'def fill_missing_with_group_mean(df, group_col, value_col):\n    df = df.copy()\n    df[value_col] = df.groupby(group_col)[value_col].transform(\n        lambda x: x.fillna(x.mean())\n    )\n    return df',
      explanation: '使用groupby + transform可以在保持原始DataFrame形状的情况下，用各组的均值填充缺失值。transform返回与原DataFrame相同长度的结果。',
      initialCode: 'def fill_missing_with_group_mean(df, group_col, value_col):\n    # 请在此处编写代码\n    pass'
    },
    {
      id: 'q2-6',
      type: 'choice',
      question: '以下哪个操作会改变原始DataFrame？',
      options: [
        'df.head()',
        'df.copy()',
        'df.loc[0, "A"] = 100',
        'df[df["A"] > 0]'
      ],
      answer: 'df.loc[0, "A"] = 100',
      explanation: 'df.loc[0, "A"] = 100 直接修改了原始DataFrame中的值。head()、copy()和布尔索引都返回新的对象，不修改原始数据。'
    },
    {
      id: 'q2-7',
      type: 'fill',
      question: '使用Pandas的pivot_table时，指定聚合函数的参数名是______。',
      answer: 'aggfunc',
      explanation: 'pivot_table的aggfunc参数指定聚合函数，默认为mean（均值）。可以传入字符串如"sum"、"count"，或函数列表。'
    }
  ]
};
