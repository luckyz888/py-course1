import type { Quiz } from '../../types';

export const quiz1: Quiz = {
  id: 'quiz-python-basics',
  moduleId: 'python-basics',
  title: 'Python编程基础测评',
  questions: [
    {
      id: 'q1-1',
      type: 'choice',
      question: '以下哪个不是Python的基本数据类型？',
      options: ['int', 'float', 'char', 'bool'],
      answer: 'char',
      explanation: 'Python没有char类型，单个字符也是str类型。Python的基本数据类型包括int、float、str、bool等。'
    },
    {
      id: 'q1-2',
      type: 'choice',
      question: '表达式 `7 // 2` 的结果是什么？',
      options: ['3', '3.5', '4', '3.0'],
      answer: '3',
      explanation: '// 是整除运算符，7 // 2 = 3，向下取整。注意结果是int类型。'
    },
    {
      id: 'q1-3',
      type: 'fill',
      question: '在Python中，使用______关键字来定义函数。',
      answer: 'def',
      explanation: 'def关键字用于定义函数，语法为 def function_name(parameters):'
    },
    {
      id: 'q1-4',
      type: 'choice',
      question: '以下代码的输出是什么？\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))\n```',
      options: ['3', '4', '报错', '1'],
      answer: '4',
      explanation: 'y = x 不是复制列表，而是创建了对同一列表的引用。修改y也会影响x，所以x变为[1,2,3,4]，长度为4。'
    },
    {
      id: 'q1-5',
      type: 'coding',
      question: '编写一个函数 `is_palindrome(s)`，判断字符串s是否为回文字符串（正读和反读相同），返回True或False。忽略大小写。',
      answer: 'def is_palindrome(s):\n    s = s.lower()\n    return s == s[::-1]',
      explanation: '将字符串转为小写后，与反转后的字符串比较。s[::-1]是字符串反转的简洁写法。',
      initialCode: 'def is_palindrome(s):\n    # 请在此处编写代码\n    pass'
    },
    {
      id: 'q1-6',
      type: 'choice',
      question: '关于Python的with语句，以下说法正确的是？',
      options: [
        'with语句只能用于文件操作',
        'with语句会自动关闭文件，即使发生异常',
        'with语句打开的文件需要手动关闭',
        'with语句不能同时打开多个文件'
      ],
      answer: 'with语句会自动关闭文件，即使发生异常',
      explanation: 'with语句的核心优势是自动资源管理，确保文件在代码块结束时被关闭，即使发生异常也能正确关闭。with可以用于任何实现了上下文管理器协议的对象。'
    },
    {
      id: 'q1-7',
      type: 'fill',
      question: '列表推导式 `[x**2 for x in range(1, 6)]` 的结果是______。',
      answer: '[1, 4, 9, 16, 25]',
      explanation: 'range(1,6)生成1到5的序列，对每个元素求平方，得到[1, 4, 9, 16, 25]。'
    },
    {
      id: 'q1-8',
      type: 'coding',
      question: '编写一个函数 `flatten_dict(d, parent_key="", sep=".")`，将嵌套字典展平为单层字典。嵌套键用sep连接。例如 {"a": {"b": 1, "c": 2}} 变为 {"a.b": 1, "a.c": 2}。',
      answer: 'def flatten_dict(d, parent_key="", sep="."):\n    items = []\n    for k, v in d.items():\n        new_key = f"{parent_key}{sep}{k}" if parent_key else k\n        if isinstance(v, dict):\n            items.extend(flatten_dict(v, new_key, sep).items())\n        else:\n            items.append((new_key, v))\n    return dict(items)',
      explanation: '递归遍历字典，如果值是字典则递归展平，否则直接添加键值对。键名通过sep连接层级关系。',
      initialCode: 'def flatten_dict(d, parent_key="", sep="."):\n    # 请在此处编写代码\n    pass'
    }
  ]
};
