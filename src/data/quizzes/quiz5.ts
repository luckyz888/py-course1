import type { Quiz } from '../../types';

export const quiz5: Quiz = {
  id: 'quiz-business-intelligence',
  moduleId: 'business-intelligence',
  title: '商务智能与报表测评',
  questions: [
    {
      id: 'q5-1',
      type: 'choice',
      question: '使用pandas将DataFrame写入Excel文件时，需要指定哪个参数来避免写入行索引？',
      options: [
        'exclude_index=True',
        'index=False',
        'no_index=True',
        'drop_index=True'
      ],
      answer: 'index=False',
      explanation: 'df.to_excel()的index参数控制是否写入行索引，设为False即可避免写入默认的整数索引。'
    },
    {
      id: 'q5-2',
      type: 'choice',
      question: "pd.crosstab()中normalize='index'参数的作用是什么？",
      options: [
        '按列计算百分比',
        '按行计算百分比',
        '按总计计算百分比',
        '不进行归一化'
      ],
      answer: '按行计算百分比',
      explanation: "normalize='index'按行归一化，每行的值加起来等于100%，即计算每个类别在各组中的占比。'columns'按列归一化，'all'按总计归一化。"
    },
    {
      id: 'q5-3',
      type: 'fill',
      question: 'ROI（投资回报率）的计算公式是______。',
      answer: '(收益-成本)/成本×100%',
      explanation: 'ROI = (收益 - 成本) / 成本 × 100%，衡量投入产出的效率。ROI为正表示盈利，为负表示亏损。'
    },
    {
      id: 'q5-4',
      type: 'choice',
      question: '某电商网站有10000个访客，3000人注册，1200人下单购买。请问从访问到下单的整体转化率是多少？',
      options: ['30%', '40%', '12%', '25%'],
      answer: '12%',
      explanation: '整体转化率 = 下单人数 / 访客数 × 100% = 1200 / 10000 × 100% = 12%。'
    },
    {
      id: 'q5-5',
      type: 'coding',
      question: '编写一个函数 `calculate_retention(new_users, retained_users)`，计算留存率。new_users是第0天新增用户数，retained_users是第n天仍活跃的用户数字典（键为天数，值为活跃用户数）。返回各天留存率的字典。',
      answer: 'def calculate_retention(new_users, retained_users):\n    retention = {}\n    for day, retained in retained_users.items():\n        rate = retained / new_users * 100\n        retention[f"第{day}日留存率"] = round(rate, 2)\n    return retention',
      explanation: '留存率 = 第n日活跃用户数 / 第0日新增用户数 × 100%，通常关注次日、7日、30日留存率。',
      initialCode: 'def calculate_retention(new_users, retained_users):\n    # 请在此处编写代码\n    pass'
    },
    {
      id: 'q5-6',
      type: 'choice',
      question: '在自动化报表中，使用schedule库设置每天早上9点执行任务的正确写法是？',
      options: [
        'schedule.every().day.at("09:00").do(task)',
        'schedule.daily("09:00", task)',
        'schedule.at("09:00").every().day.do(task)',
        'schedule.cron("0 9 * * *").do(task)'
      ],
      answer: 'schedule.every().day.at("09:00").do(task)',
      explanation: 'schedule库的链式调用语法为 schedule.every().day.at("09:00").do(task)，表示每天9:00执行task函数。'
    },
    {
      id: 'q5-7',
      type: 'fill',
      question: '第7日留存率为25%，意味着第0天新增的100个用户中，第7天仍有______人活跃。',
      answer: '25',
      explanation: '留存人数 = 新增用户数 × 留存率 = 100 × 25% = 25人。'
    }
  ]
};
