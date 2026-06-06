import type { Quiz } from '../../types';

export const quiz6: Quiz = {
  id: 'quiz-data-mining',
  moduleId: 'data-mining',
  title: '数据挖掘与商务实战测评',
  questions: [
    {
      id: 'q6-1',
      type: 'choice',
      question: '以下哪个不是分类模型的评估指标？',
      options: ['准确率', '轮廓系数', 'F1分数', 'AUC-ROC'],
      answer: '轮廓系数',
      explanation: '轮廓系数（Silhouette Score）是聚类模型的评估指标，衡量簇内紧密度和簇间分离度。准确率、F1分数和AUC-ROC都是分类模型的评估指标。'
    },
    {
      id: 'q6-2',
      type: 'choice',
      question: 'K-Means聚类算法中，使用肘部法则确定K值时，应该选择哪个点作为最优K？',
      options: [
        'SSE最大的点',
        'SSE最小的点',
        'SSE下降速度明显变缓的拐点',
        '轮廓系数最小的点'
      ],
      answer: 'SSE下降速度明显变缓的拐点',
      explanation: '肘部法则选择SSE曲线的"拐点"（类似手肘），即增加K值后SSE下降不再显著的点。这个点在增加聚类数与减少误差之间取得平衡。'
    },
    {
      id: 'q6-3',
      type: 'fill',
      question: '关联规则中，提升度Lift>1表示规则前件和后件之间是______相关关系。',
      answer: '正',
      explanation: 'Lift>1表示正相关（A的出现增加了B出现的概率），Lift=1表示无关，Lift<1表示负相关（A的出现降低了B出现的概率）。'
    },
    {
      id: 'q6-4',
      type: 'choice',
      question: '协同过滤推荐系统中，"冷启动"问题是指什么？',
      options: [
        '系统运行速度慢',
        '新用户或新物品缺乏历史数据难以推荐',
        '推荐结果不够多样化',
        '用户隐私保护问题'
      ],
      answer: '新用户或新物品缺乏历史数据难以推荐',
      explanation: '冷启动是协同过滤的核心问题：新用户没有行为数据无法计算相似度，新物品没有评分无法被推荐。解决方法包括基于内容的推荐、混合推荐等。'
    },
    {
      id: 'q6-5',
      type: 'coding',
      question: '编写一个函数 `calculate_rfm_scores(df, r_col, f_col, m_col, n_groups=5)`，对RFM三个指标分别进行分组评分。R越小分越高（5→1），F和M越大分越高（1→5）。返回包含评分列的DataFrame。',
      answer: "import pandas as pd\n\ndef calculate_rfm_scores(df, r_col, f_col, m_col, n_groups=5):\n    df = df.copy()\n    df['R_score'] = pd.qcut(df[r_col], n_groups, labels=range(n_groups, 0, -1), duplicates='drop').astype(int)\n    df['F_score'] = pd.qcut(df[f_col].rank(method='first'), n_groups, labels=range(1, n_groups+1), duplicates='drop').astype(int)\n    df['M_score'] = pd.qcut(df[m_col].rank(method='first'), n_groups, labels=range(1, n_groups+1), duplicates='drop').astype(int)\n    return df",
      explanation: 'R评分反向（越近越高分），F和M评分正向（越多越高分）。使用pd.qcut等频分组，rank(method="first")处理重复值。',
      initialCode: 'import pandas as pd\n\ndef calculate_rfm_scores(df, r_col, f_col, m_col, n_groups=5):\n    # 请在此处编写代码\n    pass'
    },
    {
      id: 'q6-6',
      type: 'choice',
      question: '决策树算法中，CART算法使用的分裂准则是？',
      options: ['信息增益', '信息增益率', '基尼指数', '卡方检验'],
      answer: '基尼指数',
      explanation: 'CART（Classification and Regression Trees）使用基尼指数（Gini Index）作为分裂准则，选择使基尼不纯度减少最多的特征进行分裂。ID3使用信息增益，C4.5使用信息增益率。'
    },
    {
      id: 'q6-7',
      type: 'fill',
      question: 'Apriori算法的核心先验性质是：频繁项集的______也必须是频繁的。',
      answer: '子集',
      explanation: 'Apriori性质（先验性质）：频繁项集的所有子集也必须是频繁的。反之，如果一个项集的某个子集不频繁，则该项集也不可能是频繁的。这一性质用于剪枝，减少候选项集的数量。'
    },
    {
      id: 'q6-8',
      type: 'choice',
      question: '以下哪种方法最适合处理客户细分问题？',
      options: ['逻辑回归', 'K-Means聚类', '关联规则', '线性回归'],
      answer: 'K-Means聚类',
      explanation: '客户细分是无监督学习问题，没有预定义的类别标签，适合使用聚类方法。K-Means是最常用的聚类算法，能根据客户特征将客户划分为不同群体。'
    }
  ]
};
