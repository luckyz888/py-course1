import type { Quiz } from '../../types';

export const quiz4: Quiz = {
  id: 'quiz-statistics',
  moduleId: 'statistics',
  title: '统计分析测评',
  questions: [
    {
      id: 'q4-1',
      type: 'choice',
      question: '当数据中存在极端异常值时，以下哪个集中趋势度量指标最合适？',
      options: ['均值', '中位数', '众数', '几何平均数'],
      answer: '中位数',
      explanation: '中位数不受极端值影响（稳健性），而均值会被极端值拉偏。当数据偏态明显或含异常值时，中位数更能代表数据的中心位置。'
    },
    {
      id: 'q4-2',
      type: 'choice',
      question: '正态分布N(100, 15²)中，约95%的数据落在哪个范围内？',
      options: [
        '85 ~ 115',
        '70 ~ 130',
        '55 ~ 145',
        '90 ~ 110'
      ],
      answer: '70 ~ 130',
      explanation: '正态分布的95%数据落在μ±2σ范围内，即100±2×15 = 100±30 = [70, 130]。68%在μ±σ，99.7%在μ±3σ。'
    },
    {
      id: 'q4-3',
      type: 'fill',
      question: '假设检验中，当p值______显著性水平α时，我们拒绝零假设H₀。',
      answer: '小于',
      explanation: '当p值小于显著性水平α（通常0.05）时，说明在H₀成立条件下观察到当前结果的概率很小，因此拒绝H₀。'
    },
    {
      id: 'q4-4',
      type: 'choice',
      question: 'Pearson相关系数r=0.85，表示两个变量之间是什么关系？',
      options: [
        '强正相关',
        '弱正相关',
        '强负相关',
        '因果关系'
      ],
      answer: '强正相关',
      explanation: '|r|>0.7为强相关，r>0为正相关。r=0.85表示强正相关。注意：相关不等于因果。'
    },
    {
      id: 'q4-5',
      type: 'coding',
      question: '编写一个函数 `perform_ttest(sample1, sample2, alpha=0.05)`，执行独立样本t检验，返回包含t统计量、p值和是否显著的字典。',
      answer: 'from scipy import stats\n\ndef perform_ttest(sample1, sample2, alpha=0.05):\n    t_stat, p_value = stats.ttest_ind(sample1, sample2)\n    return {\n        "t统计量": round(t_stat, 4),\n        "p值": round(p_value, 4),\n        "是否显著": p_value < alpha\n    }',
      explanation: '使用scipy.stats.ttest_ind进行独立样本t检验，p值小于alpha则结果显著。',
      initialCode: 'from scipy import stats\n\ndef perform_ttest(sample1, sample2, alpha=0.05):\n    # 请在此处编写代码\n    pass'
    },
    {
      id: 'q4-6',
      type: 'choice',
      question: '在线性回归中，R²=0.75表示什么？',
      options: [
        '75%的数据点在回归线上',
        '自变量解释了因变量75%的方差',
        '相关系数为0.75',
        '预测准确率为75%'
      ],
      answer: '自变量解释了因变量75%的方差',
      explanation: 'R²（决定系数）表示回归模型解释的因变量方差比例。R²=0.75意味着模型解释了75%的方差，剩余25%由未解释的因素（残差）造成。'
    },
    {
      id: 'q4-7',
      type: 'fill',
      question: '时间序列的三大组成部分是趋势、______和随机性。',
      answer: '季节性',
      explanation: '时间序列通常由趋势（长期方向）、季节性（周期性规律波动）和随机性（不规则波动）组成。有时还包括周期性成分。'
    },
    {
      id: 'q4-8',
      type: 'choice',
      question: '简单移动平均的窗口大小增大时，平滑效果如何变化？',
      options: [
        '平滑效果减弱',
        '平滑效果增强',
        '没有变化',
        '取决于数据'
      ],
      answer: '平滑效果增强',
      explanation: '窗口越大，参与平均的数据点越多，短期波动被更多地抵消，平滑效果越强。但同时滞后也越明显。'
    }
  ]
};
