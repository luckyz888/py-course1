import type { Quiz } from '../../types';

export const quiz3: Quiz = {
  id: 'quiz-data-visualization',
  moduleId: 'data-visualization',
  title: '数据可视化测评',
  questions: [
    {
      id: 'q3-1',
      type: 'choice',
      question: '在Matplotlib中，以下哪种方式创建的图表更推荐用于面向对象编程？',
      options: [
        'plt.plot()',
        'fig, ax = plt.subplots()',
        'plt.subplot()',
        'plt.figure()'
      ],
      answer: 'fig, ax = plt.subplots()',
      explanation: 'plt.subplots()创建Figure和Axes对象，是面向对象编程的推荐方式，更灵活、更易维护。plt.plot()是pyplot接口的简便方式。'
    },
    {
      id: 'q3-2',
      type: 'choice',
      question: 'Seaborn的heatmap中，annot参数的作用是什么？',
      options: [
        '设置颜色映射',
        '在格子中显示数值',
        '添加颜色条',
        '设置标题'
      ],
      answer: '在格子中显示数值',
      explanation: 'annot=True会在热力图的每个格子中显示对应的数值，配合fmt参数可以控制数值格式。'
    },
    {
      id: 'q3-3',
      type: 'fill',
      question: 'Plotly Express中，用于创建交互式散点图的函数名是______。',
      answer: 'px.scatter',
      explanation: 'plotly.express.scatter()（简写px.scatter）用于创建交互式散点图，支持颜色编码、大小映射、悬停提示等交互功能。'
    },
    {
      id: 'q3-4',
      type: 'choice',
      question: '以下哪种图表最适合展示数据的分布情况？',
      options: ['折线图', '柱状图', '直方图', '饼图'],
      answer: '直方图',
      explanation: '直方图（Histogram）将连续数据分组为若干区间，展示各区间的频率分布，是分析数据分布特征的首选图表。'
    },
    {
      id: 'q3-5',
      type: 'coding',
      question: '编写代码使用Matplotlib创建一个包含两个子图的图表：左侧为折线图，右侧为柱状图。数据自拟，要求设置标题和轴标签。',
      answer: "import matplotlib.pyplot as plt\nimport numpy as np\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\n\nx = ['Q1', 'Q2', 'Q3', 'Q4']\ny1 = [100, 120, 135, 150]\ny2 = [30, 45, 50, 60]\n\naxes[0].plot(x, y1, marker='o', color='#2196F3')\naxes[0].set_title('季度收入趋势')\naxes[0].set_ylabel('收入(万元)')\n\naxes[1].bar(x, y2, color='#FF5722')\naxes[1].set_title('季度新增客户')\naxes[1].set_ylabel('客户数')\n\nplt.tight_layout()\nplt.show()",
      explanation: '使用plt.subplots(1, 2)创建1行2列的子图布局，分别用axes[0]和axes[1]操作左右两个子图。',
      initialCode: 'import matplotlib.pyplot as plt\n\n# 请在此处编写代码\npass'
    },
    {
      id: 'q3-6',
      type: 'choice',
      question: '在商业报表图表设计中，"数据墨水比"的概念是指什么？',
      options: [
        '图表中数据的数量与颜色的比例',
        '用于展示数据的墨水量与总墨水量的比例',
        '数据点数量与图表面积的比例',
        '文字与图形的比例'
      ],
      answer: '用于展示数据的墨水量与总墨水量的比例',
      explanation: '数据墨水比由Edward Tufte提出，指用于展示实际数据的"墨水"占总"墨水"的比例。应尽量提高数据墨水比，减少不必要的装饰元素。'
    }
  ]
};
