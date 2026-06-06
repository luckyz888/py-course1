import type { Module } from '../../types';

export const module6: Module = {
  id: 'data-mining',
  title: '数据挖掘与商务实战',
  description: '学习分类、聚类、关联规则等数据挖掘方法，通过电商、零售等商务案例将所学知识综合应用。',
  icon: '⛏️',
  order: 6,
  chapters: [
    {
      id: 'ch6-1',
      moduleId: 'data-mining',
      title: '分类与预测',
      order: 1,
      lessons: [
        {
          id: 'les6-1-1',
          chapterId: 'ch6-1',
          title: '决策树分类',
          type: 'both',
          content: `## 决策树分类

决策树是数据挖掘中最直观的分类方法之一，它通过一系列规则对数据进行分割，形成类似流程图的树状结构。在商务场景中，决策树常用于客户流失预测、信用评估、营销响应预测等任务。

### 决策树的基本结构

- **根节点**：包含所有训练数据，代表最初的判断条件
- **内部节点**：表示某个特征上的判断条件（如"月消费额>500元？"）
- **叶节点**：表示最终的分类结果（如"高价值客户"）
- **分支**：判断结果的不同路径（是/否）

### 分裂准则

决策树在每次分裂时需要选择最优特征和分裂点，常用准则包括：

- **信息增益（ID3算法）**：选择使信息熵减少最多的特征。信息熵衡量数据的不确定性，熵越低表示纯度越高
- **信息增益率（C4.5算法）**：对信息增益进行归一化，克服其偏向多值特征的问题
- **基尼指数（CART算法）**：sklearn默认使用，选择使基尼不纯度最小的特征。基尼指数越小，数据纯度越高

### 特征重要性

决策树训练完成后，可以输出每个特征对分类的贡献度——特征重要性（feature importance）。在商务分析中，特征重要性可以帮助我们识别影响业务的关键因素，例如发现"投诉次数"是客户流失的最重要预测因子。

### 决策树可视化

通过 \`plot_tree\` 函数可以将决策树可视化，直观展示每一步的判断条件和分类结果，便于向业务人员解释模型逻辑。

### 防止过拟合

决策树容易过拟合，常用策略包括：限制树深度（max_depth）、限制叶节点最小样本数（min_samples_leaf）、以及剪枝。

**优点：** 可解释性强、无需特征缩放、能处理数值和分类特征
**缺点：** 容易过拟合、对数据变化敏感、偏向多值特征`,
          codeExample: `import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

# 生成客户流失数据
X, y = make_classification(n_samples=500, n_features=4,
    n_informative=3, random_state=42, class_sep=1.2)
df = pd.DataFrame(X, columns=['月消费额', '登录频次', '投诉次数', '会员等级'])
df['是否流失'] = y

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)

# 训练决策树
dt = DecisionTreeClassifier(max_depth=4, random_state=42)
dt.fit(X_train, y_train)
y_pred = dt.predict(X_test)

print(f"准确率: {accuracy_score(y_test, y_pred):.4f}")
print(f"\\n特征重要性:")
for feat, imp in sorted(zip(df.columns[:4], dt.feature_importances_),
                          key=lambda x: -x[1]):
    print(f"  {feat}: {imp:.4f}")
print(f"\\n分类报告:\\n{classification_report(y_test, y_pred,
      target_names=['未流失', '流失'])}")`,
          exercise: {
            id: 'ex6-1-1',
            lessonId: 'les6-1-1',
            description: '编写函数 `train_decision_tree(X, y, max_depth)`，训练决策树分类器并返回包含准确率和特征重要性Series的字典。使用 DecisionTreeClassifier(random_state=42)，对数据按7:3划分训练集和测试集。',
            initialCode: `from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd

def train_decision_tree(X, y, max_depth=4):
    # 请在此处编写代码
    pass

# 测试
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=300, n_features=3,
    n_informative=2, random_state=42)
result = train_decision_tree(X, y, max_depth=3)
print(f"准确率: {result['accuracy']:.4f}")
print(f"特征重要性: {result['importance']}")`,
            hints: [
              '使用 train_test_split(X, y, test_size=0.3, random_state=42, stratify=y) 划分数据',
              '用 DecisionTreeClassifier(max_depth=max_depth, random_state=42) 训练模型',
              '返回字典: {"accuracy": accuracy_score结果, "importance": pd.Series(model.feature_importances_)}'
            ],
            referenceAnswer: `from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd

def train_decision_tree(X, y, max_depth=4):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y)
    dt = DecisionTreeClassifier(max_depth=max_depth, random_state=42)
    dt.fit(X_train, y_train)
    y_pred = dt.predict(X_test)
    return {
        'accuracy': accuracy_score(y_test, y_pred),
        'importance': pd.Series(dt.feature_importances_)
    }`,
            testCases: [
              { input: "from sklearn.datasets import make_classification; X, y = make_classification(n_samples=200, n_features=3, n_informative=2, random_state=42); result = train_decision_tree(X, y, 3); print(result['accuracy'] > 0.7)", expectedOutput: 'True' },
              { input: "from sklearn.datasets import make_classification; X, y = make_classification(n_samples=200, n_features=3, n_informative=2, random_state=42); result = train_decision_tree(X, y, 3); print(len(result['importance']))", expectedOutput: '3' }
            ]
          }
        },
        {
          id: 'les6-1-2',
          chapterId: 'ch6-1',
          title: '逻辑回归',
          type: 'both',
          content: `## 逻辑回归

逻辑回归（Logistic Regression）虽然名字中带有"回归"，但它实际上是一种分类算法，是商务分析中最常用的模型之一。它广泛应用于信用评分、营销响应预测、疾病诊断等场景。

### 从线性回归到逻辑回归

线性回归的输出是连续值，而分类任务需要输出类别概率。逻辑回归通过sigmoid函数将线性组合映射到[0,1]区间：

σ(z) = 1 / (1 + e⁻ᶻ)

其中 z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b

sigmoid函数的输出可以理解为"属于正类的概率"。例如，模型输出0.85表示该客户有85%的概率会流失。

### 概率预测与阈值

逻辑回归的输出是概率值，默认阈值为0.5：
- 概率 ≥ 0.5 → 预测为正类
- 概率 < 0.5 → 预测为负类

在实际商务场景中，阈值可以根据业务需求调整。例如在欺诈检测中，为了降低漏检率，可以将阈值降低到0.3；在精准营销中，为了提高投放效率，可以将阈值提高到0.7。

### ROC曲线与AUC

ROC曲线是评估分类模型性能的重要工具：
- **横轴**：假正率（FPR）= 实际为负但预测为正的比例
- **纵轴**：真正率（TPR）= 实际为正且预测为正的比例（即召回率）
- **AUC**：ROC曲线下面积，范围[0,1]，越大表示模型越好

AUC=1表示完美分类器，AUC=0.5表示随机猜测。在商务场景中，AUC>0.7通常认为模型有实用价值。

### 逻辑回归的优缺点

**优点：** 简单高效、输出概率可解释、适合线性可分问题、训练速度快
**缺点：** 只能处理线性决策边界、对特征缩放敏感、对多重共线性敏感`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score, roc_curve

# 生成信用评分数据
X, y = make_classification(n_samples=500, n_features=4,
    n_informative=3, random_state=42)
df = pd.DataFrame(X, columns=['收入水平', '负债比率', '信用历史', '年龄'])
df['是否违约'] = y

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)

# 训练逻辑回归
lr = LogisticRegression(random_state=42, max_iter=1000)
lr.fit(X_train, y_train)
y_pred = lr.predict(X_test)
y_prob = lr.predict_proba(X_test)[:, 1]  # 预测概率

print(f"准确率: {accuracy_score(y_test, y_pred):.4f}")
print(f"AUC: {roc_auc_score(y_test, y_prob):.4f}")

# 概率预测示例
print(f"\\n前5个样本的违约概率:")
for i, prob in enumerate(y_prob[:5]):
    print(f"  样本{i+1}: 违约概率={prob:.4f}, "
          f"预测={'违约' if y_pred[i]==1 else '正常'}")`,
          exercise: {
            id: 'ex6-1-2',
            lessonId: 'les6-1-2',
            description: '编写函数 `logistic_predict(X_train, y_train, X_test, threshold)`，训练逻辑回归模型并使用自定义阈值进行预测。返回预测标签数组和正类概率数组。threshold默认为0.5。',
            initialCode: `from sklearn.linear_model import LogisticRegression
import numpy as np

def logistic_predict(X_train, y_train, X_test, threshold=0.5):
    # 请在此处编写代码
    pass

# 测试
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=300, n_features=3,
    n_informative=2, random_state=42)
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42)
y_pred, y_prob = logistic_predict(X_train, y_train, X_test)
print(f"预测数量: {len(y_pred)}")
print(f"概率范围: [{y_prob.min():.4f}, {y_prob.max():.4f}]")`,
            hints: [
              '使用 LogisticRegression(random_state=42, max_iter=1000) 训练模型',
              '用 predict_proba 获取概率，取第2列（[:, 1]）为正类概率',
              '根据 threshold 对概率进行判断：(y_prob >= threshold).astype(int)'
            ],
            referenceAnswer: `from sklearn.linear_model import LogisticRegression
import numpy as np

def logistic_predict(X_train, y_train, X_test, threshold=0.5):
    lr = LogisticRegression(random_state=42, max_iter=1000)
    lr.fit(X_train, y_train)
    y_prob = lr.predict_proba(X_test)[:, 1]
    y_pred = (y_prob >= threshold).astype(int)
    return y_pred, y_prob`,
            testCases: [
              { input: "from sklearn.datasets import make_classification; from sklearn.model_selection import train_test_split; X, y = make_classification(n_samples=200, n_features=3, n_informative=2, random_state=42); X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42); y_pred, y_prob = logistic_predict(X_tr, y_tr, X_te); print(len(y_pred) == len(X_te))", expectedOutput: 'True' },
              { input: "from sklearn.datasets import make_classification; from sklearn.model_selection import train_test_split; X, y = make_classification(n_samples=200, n_features=3, n_informative=2, random_state=42); X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42); y_pred, y_prob = logistic_predict(X_tr, y_tr, X_te, 0.7); print(set(y_pred).issubset({0,1}))", expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les6-1-3',
          chapterId: 'ch6-1',
          title: '模型评估与选择',
          type: 'both',
          content: `## 模型评估与选择

训练出模型只是第一步，如何客观评估模型性能、选择最优模型才是数据挖掘项目的关键。在商务场景中，一个评估不当的模型可能导致错误的业务决策——例如将优质客户误判为流失风险客户，浪费营销资源。

### 混淆矩阵

混淆矩阵是分类评估的基础，它将预测结果与真实标签进行交叉对比：

|  | 预测为正 | 预测为负 |
|---|---|---|
| 实际为正 | TP（真正例） | FN（假负例） |
| 实际为负 | FP（假正例） | TN（真负例） |

### 核心评估指标

- **准确率（Accuracy）**= (TP+TN) / (TP+TN+FP+FN)：整体预测正确的比例。当数据类别不平衡时，准确率可能具有误导性
- **精确率（Precision）**= TP / (TP+FP)：预测为正的样本中实际为正的比例。在垃圾邮件检测中，精确率高意味着少误判正常邮件
- **召回率（Recall）**= TP / (TP+FN)：实际为正的样本中被正确预测的比例。在疾病筛查中，召回率高意味着少漏诊
- **F1分数**= 2×P×R / (P+R)：精确率和召回率的调和平均，适合类别不平衡场景

### 交叉验证

单次划分训练集和测试集的结果可能受数据划分方式影响。K折交叉验证将数据分成K份，轮流用K-1份训练、1份测试，最终取平均值，评估更稳定可靠。常用5折或10折交叉验证。

### 过拟合与欠拟合

- **过拟合**：模型在训练集上表现很好，但在测试集上表现差，说明模型学到了噪声
- **欠拟合**：模型在训练集和测试集上表现都不好，说明模型太简单
- **应对过拟合**：增加数据量、简化模型（减少深度/特征）、正则化、交叉验证
- **应对欠拟合**：增加模型复杂度、添加特征、减少正则化`,
          codeExample: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import (train_test_split,
    cross_val_score, StratifiedKFold)
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score,
    recall_score, f1_score)

# 生成数据
X, y = make_classification(n_samples=500, n_features=4,
    n_informative=3, random_state=42, weights=[0.7, 0.3])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)

# 训练两个模型
models = {
    '决策树': DecisionTreeClassifier(max_depth=4, random_state=42),
    '逻辑回归': LogisticRegression(random_state=42, max_iter=1000)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(f"=== {name} ===")
    print(f"  准确率: {accuracy_score(y_test, y_pred):.4f}")
    print(f"  精确率: {precision_score(y_test, y_pred):.4f}")
    print(f"  召回率: {recall_score(y_test, y_pred):.4f}")
    print(f"  F1分数: {f1_score(y_test, y_pred):.4f}")

# 5折交叉验证
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=cv, scoring='f1')
    print(f"\\n{name} 5折CV F1: {scores.mean():.4f} ± {scores.std():.4f}")`,
          exercise: {
            id: 'ex6-1-3',
            lessonId: 'les6-1-3',
            description: '编写函数 `evaluate_model(model, X, y, cv=5)`，使用K折交叉验证评估模型，返回包含accuracy、precision、recall、f1四个指标均值和标准差的字典。每个指标用 cross_val_score 计算，scoring 分别对应 "accuracy"、"precision"、"recall"、"f1"。',
            initialCode: `from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier
import numpy as np

def evaluate_model(model, X, y, cv=5):
    # 请在此处编写代码
    pass

# 测试
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=300, n_features=4,
    n_informative=3, random_state=42)
dt = DecisionTreeClassifier(max_depth=4, random_state=42)
result = evaluate_model(dt, X, y, cv=5)
for metric, vals in result.items():
    print(f"{metric}: {vals['mean']:.4f} ± {vals['std']:.4f}")`,
            hints: [
              '对每个scoring调用 cross_val_score(model, X, y, cv=cv, scoring=scoring)',
              '返回格式: {"accuracy": {"mean": scores.mean(), "std": scores.std()}, ...}'
            ],
            referenceAnswer: `from sklearn.model_selection import cross_val_score
import numpy as np

def evaluate_model(model, X, y, cv=5):
    result = {}
    for metric in ['accuracy', 'precision', 'recall', 'f1']:
        scores = cross_val_score(model, X, y, cv=cv, scoring=metric)
        result[metric] = {'mean': scores.mean(), 'std': scores.std()}
    return result`,
            testCases: [
              { input: "from sklearn.datasets import make_classification; from sklearn.tree import DecisionTreeClassifier; X, y = make_classification(n_samples=200, n_features=3, n_informative=2, random_state=42); dt = DecisionTreeClassifier(max_depth=3, random_state=42); result = evaluate_model(dt, X, y, cv=3); print('accuracy' in result and 'f1' in result)", expectedOutput: 'True' },
              { input: "from sklearn.datasets import make_classification; from sklearn.tree import DecisionTreeClassifier; X, y = make_classification(n_samples=200, n_features=3, n_informative=2, random_state=42); dt = DecisionTreeClassifier(max_depth=3, random_state=42); result = evaluate_model(dt, X, y, cv=3); print(0 <= result['accuracy']['mean'] <= 1)", expectedOutput: 'True' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch6-2',
      moduleId: 'data-mining',
      title: '聚类分析',
      order: 2,
      lessons: [
        {
          id: 'les6-2-1',
          chapterId: 'ch6-2',
          title: 'K-Means聚类',
          type: 'both',
          content: `## K-Means聚类

聚类是无监督学习的核心方法，它不需要预先标注的标签，而是根据数据自身的相似性将样本分组。在商务领域，聚类最典型的应用是客户细分——将客户按照消费行为分成不同群体，从而实施差异化营销策略。

### K-Means算法原理

K-Means是最经典、最常用的聚类算法，目标是将n个数据点划分为K个簇，使簇内数据点尽可能相似。

**算法步骤：**
1. 随机选择K个初始聚类中心
2. 将每个数据点分配到最近的聚类中心，形成K个簇
3. 重新计算每个簇的中心（取簇内所有点的均值）
4. 重复步骤2-3，直到聚类中心不再变化或达到最大迭代次数

### 关键参数

- \`n_clusters\`：簇的数量K，需要预先指定
- \`init='k-means++'\`：智能初始化方式（默认），避免随机初始化导致的不良结果
- \`n_init\`：运行算法的次数，取SSE最小的结果（默认10次）
- \`max_iter\`：单次运行的最大迭代次数

### 如何确定K值

K值的选择是K-Means的关键问题，常用方法有：

**肘部法则（Elbow Method）**：绘制不同K值对应的SSE（簇内误差平方和）曲线，选择SSE下降速率明显变缓的拐点。拐点之前增加K能显著降低SSE，拐点之后增加K的收益递减。

**轮廓系数（Silhouette Score）**：衡量聚类的紧密度和分离度，范围[-1, 1]。值越接近1表示聚类效果越好，接近0表示簇之间有重叠，为负值表示样本被分到了错误的簇。

### K-Means的优缺点

**优点：** 算法简单高效、适合大规模数据、容易实现
**缺点：** 需要预设K值、对初始中心敏感、只能发现球形簇、对异常值敏感`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs

# 生成客户消费数据
X, _ = make_blobs(n_samples=300, centers=4,
    cluster_std=1.5, random_state=42)
df = pd.DataFrame(X, columns=['年消费额', '月均访问次数'])

# 标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 肘部法则 + 轮廓系数选K
sse, sil = [], []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    sse.append(km.inertia_)
    sil.append(silhouette_score(X_scaled, km.labels_))

print("K值选择:")
for k, s, si in zip(range(2, 9), sse, sil):
    print(f"  K={k}: SSE={s:.1f}, 轮廓系数={si:.4f}")

# 使用最优K=4进行聚类
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['簇标签'] = kmeans.fit_predict(X_scaled)

# 分析各簇特征
print(f"\\n各簇客户特征均值:")
print(df.groupby('簇标签')[['年消费额', '月均访问次数']].mean().round(2))
print(f"\\n轮廓系数: {silhouette_score(X_scaled, df['簇标签']):.4f}")`,
          exercise: {
            id: 'ex6-2-1',
            lessonId: 'les6-2-1',
            description: '编写函数 `find_optimal_k(X, k_range)`，对标准化后的数据用肘部法则和轮廓系数确定最优K值。返回包含每个K值的SSE和轮廓系数的DataFrame，以及推荐的最优K值（轮廓系数最大的K）。',
            initialCode: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

def find_optimal_k(X, k_range=range(2, 9)):
    # 请在此处编写代码
    pass

# 测试
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=200, centers=3, random_state=42)
result = find_optimal_k(X)
print(result['metrics'])
print(f"推荐K值: {result['best_k']}")`,
            hints: [
              '先用 StandardScaler 标准化数据',
              '遍历k_range，对每个K训练KMeans，记录inertia_和silhouette_score',
              '最优K为轮廓系数最大的K值'
            ],
            referenceAnswer: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

def find_optimal_k(X, k_range=range(2, 9)):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    metrics = []
    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X_scaled)
        metrics.append({
            'K': k,
            'SSE': round(km.inertia_, 2),
            '轮廓系数': round(silhouette_score(X_scaled, labels), 4)
        })
    df = pd.DataFrame(metrics)
    best_k = df.loc[df['轮廓系数'].idxmax(), 'K']
    return {'metrics': df, 'best_k': best_k}`,
            testCases: [
              { input: "from sklearn.datasets import make_blobs; X, _ = make_blobs(n_samples=200, centers=3, random_state=42); result = find_optimal_k(X); print(result['best_k'])", expectedOutput: '3' },
              { input: "from sklearn.datasets import make_blobs; X, _ = make_blobs(n_samples=200, centers=3, random_state=42); result = find_optimal_k(X); print(len(result['metrics']))", expectedOutput: '7' }
            ]
          }
        },
        {
          id: 'les6-2-2',
          chapterId: 'ch6-2',
          title: '客户分群实战',
          type: 'both',
          content: `## 客户分群实战

客户分群是聚类分析在商务中最经典的应用。通过将客户按照消费行为分成不同群体，企业可以针对不同群体制定差异化的营销策略，提升客户满意度和企业收益。本节将结合RFM模型和K-Means聚类，完成一个完整的客户分群项目。

### RFM模型

RFM是客户价值分析的经典框架，通过三个维度衡量客户价值：

- **R（Recency）**：最近一次购买距今多少天。最近购买的客户更可能再次购买
- **F（Frequency）**：购买频次。频次越高，客户忠诚度越高
- **M（Monetary）**：消费总金额。金额越高，客户价值越大

### RFM+K-Means流程

1. **计算RFM指标**：从交易数据中提取每位客户的R、F、M值
2. **数据标准化**：RFM三个指标量纲不同，必须标准化后再聚类
3. **确定K值**：使用肘部法则或轮廓系数选择最优簇数
4. **K-Means聚类**：对标准化后的RFM数据进行聚类
5. **客户画像**：分析各簇的RFM特征，为每个群体命名和制定策略

### 典型客户群体与策略

| 客户类型 | R | F | M | 营销策略 |
|---|---|---|---|---|
| 高价值客户 | 低 | 高 | 高 | VIP服务、专属优惠 |
| 潜力客户 | 低 | 低 | 中 | 提升频次、交叉销售 |
| 流失风险客户 | 高 | 低 | 低 | 唤醒活动、折扣召回 |
| 一般客户 | 中 | 中 | 中 | 常规维护、促销推送 |

### 客户画像分析

聚类完成后，需要计算每个簇的RFM均值，结合业务理解给每个簇赋予有意义的标签。好的客户画像能让营销团队快速理解各群体的特征，制定精准策略。`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# 模拟客户RFM数据
np.random.seed(42)
n = 300
df = pd.DataFrame({
    'customer_id': [f'C{i:04d}' for i in range(n)],
    'recency': np.random.exponential(30, n).astype(int),
    'frequency': np.random.poisson(8, n),
    'monetary': np.random.gamma(5, 200, n).round(2)
})

# 标准化RFM特征
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(df[['recency', 'frequency', 'monetary']])

# K-Means聚类
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['segment'] = kmeans.fit_predict(rfm_scaled)

# 各簇RFM均值
profile = df.groupby('segment').agg(
    客户数=('customer_id', 'count'),
    平均R=('recency', 'mean'),
    平均F=('frequency', 'mean'),
    平均M=('monetary', 'mean')
).round(2)

print("客户分群画像:")
print(profile)
print(f"\\n轮廓系数: {silhouette_score(rfm_scaled, df['segment']):.4f}")

# 为各簇命名
seg_map = df.groupby('segment')['monetary'].mean().idxmax()
print(f"\\n最高价值客户所在簇: {seg_map}")`,
          exercise: {
            id: 'ex6-2-2',
            lessonId: 'les6-2-2',
            description: '编写函数 `segment_customers(rfm_df, k)`，对包含recency、frequency、monetary列的DataFrame进行K-Means客户分群。返回原始DataFrame增加segment列，以及各簇的RFM均值统计DataFrame。',
            initialCode: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def segment_customers(rfm_df, k=4):
    # 请在此处编写代码
    pass

# 测试
import numpy as np
np.random.seed(42)
df = pd.DataFrame({
    'recency': np.random.exponential(30, 200).astype(int),
    'frequency': np.random.poisson(8, 200),
    'monetary': np.random.gamma(5, 200, 200).round(2)
})
result_df, profile = segment_customers(df, k=3)
print(profile)
print(f"簇数: {result_df['segment'].nunique()}")`,
            hints: [
              '对recency、frequency、monetary三列进行StandardScaler标准化后聚类',
              '用fit_predict获取标签，添加到原DataFrame的segment列',
              '用groupby计算各簇RFM均值'
            ],
            referenceAnswer: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def segment_customers(rfm_df, k=4):
    rfm_df = rfm_df.copy()
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(
        rfm_df[['recency', 'frequency', 'monetary']])
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    rfm_df['segment'] = kmeans.fit_predict(rfm_scaled)
    profile = rfm_df.groupby('segment').agg(
        平均R=('recency', 'mean'),
        平均F=('frequency', 'mean'),
        平均M=('monetary', 'mean')
    ).round(2)
    return rfm_df, profile`,
            testCases: [
              { input: "import numpy as np; np.random.seed(42); df = pd.DataFrame({'recency': np.random.exponential(30, 100).astype(int), 'frequency': np.random.poisson(8, 100), 'monetary': np.random.gamma(5, 200, 100).round(2)}); result_df, profile = segment_customers(df, k=3); print(result_df['segment'].nunique())", expectedOutput: '3' },
              { input: "import numpy as np; np.random.seed(42); df = pd.DataFrame({'recency': np.random.exponential(30, 100).astype(int), 'frequency': np.random.poisson(8, 100), 'monetary': np.random.gamma(5, 200, 100).round(2)}); result_df, profile = segment_customers(df, k=3); print(len(profile))", expectedOutput: '3' }
            ]
          }
        },
        {
          id: 'les6-2-3',
          chapterId: 'ch6-2',
          title: '层次聚类与DBSCAN',
          type: 'both',
          content: `## 层次聚类与DBSCAN

K-Means虽然简单高效，但它需要预设K值、只能发现球形簇、对异常值敏感。本节介绍两种补充算法——层次聚类和DBSCAN，它们各有优势，适用于不同的商务场景。

### 层次聚类

层次聚类通过计算簇间距离逐步合并或分裂，形成树状结构（树状图dendrogram），不需要预先指定簇数。

**聚合层次聚类（自底向上）步骤：**
1. 每个数据点初始为一个簇
2. 计算所有簇对之间的距离
3. 合并距离最近的两个簇
4. 重复步骤2-3，直到只剩一个簇

**簇间距离度量方式：**
- **单链接（single）**：两个簇中最近点之间的距离，容易形成链状簇
- **全链接（complete）**：两个簇中最远点之间的距离，倾向于生成紧凑的簇
- **平均链接（average）**：两个簇中所有点对的平均距离
- **Ward法**：合并使簇内方差增加最小的两个簇，sklearn默认推荐

**树状图（Dendrogram）**：可视化层次聚类的合并过程，横轴为数据点，纵轴为合并距离。在树状图上选择一个高度水平切割，即可得到对应数量的簇。

### DBSCAN

DBSCAN（Density-Based Spatial Clustering of Applications with Noise）是基于密度的聚类算法，能够发现任意形状的簇，并自动识别异常点。

**核心概念：**
- **ε（eps）**：邻域半径，定义一个点的"邻居"范围
- **MinPts**：最小点数，一个点要在ε范围内有至少MinPts个邻居才算核心点
- **核心点**：ε邻域内点数≥MinPts的点
- **边界点**：在核心点的ε邻域内，但自身不是核心点
- **噪声点**：既不是核心点也不是边界点，被视为异常值

**DBSCAN的优势：**
- 不需要预设簇数
- 能发现任意形状的簇（如环形、月牙形）
- 自动识别异常点/噪声
- 适合空间数据分析

**DBSCAN的局限：**
- 对eps和MinPts参数敏感
- 不适合密度差异大的数据
- 高维数据中距离度量效果下降

### 算法选择建议

| 场景 | 推荐算法 |
|---|---|
| 簇近似球形、数据量大 | K-Means |
| 需要可视化聚类过程、小数据 | 层次聚类 |
| 簇形状不规则、需要检测异常值 | DBSCAN |`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.cluster import AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_moons

# 生成月牙形数据（K-Means难以处理）
X, _ = make_moons(n_samples=300, noise=0.1, random_state=42)
df = pd.DataFrame(X, columns=['特征1', '特征2'])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 层次聚类
hc = AgglomerativeClustering(n_clusters=2, linkage='ward')
df['层次聚类'] = hc.fit_predict(X_scaled)
print(f"层次聚类 轮廓系数: "
      f"{silhouette_score(X_scaled, df['层次聚类']):.4f}")

# DBSCAN
db = DBSCAN(eps=0.3, min_samples=5)
df['DBSCAN'] = db.fit_predict(X_scaled)
n_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
n_noise = (db.labels_ == -1).sum()
print(f"DBSCAN 簇数: {n_clusters}, 噪声点: {n_noise}")
if n_clusters >= 2:
    print(f"DBSCAN 轮廓系数: "
          f"{silhouette_score(X_scaled, df['DBSCAN']):.4f}")

# 各簇样本数
print(f"\\nDBSCAN各簇分布:")
print(df['DBSCAN'].value_counts().sort_index())`,
          exercise: {
            id: 'ex6-2-3',
            lessonId: 'les6-2-3',
            description: '编写函数 `compare_clustering(X)`，对标准化后的数据分别用层次聚类（n_clusters=3, linkage=ward）和DBSCAN（eps=0.5, min_samples=5）进行聚类，返回包含两种方法的簇数和轮廓系数的字典。若DBSCAN只产生1个簇，轮廓系数记为None。',
            initialCode: `import pandas as pd
from sklearn.cluster import AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

def compare_clustering(X):
    # 请在此处编写代码
    pass

# 测试
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=200, centers=3, random_state=42)
result = compare_clustering(X)
print(result)`,
            hints: [
              '先用 StandardScaler 标准化数据',
              '层次聚类用 AgglomerativeClustering(n_clusters=3, linkage="ward")',
              'DBSCAN的簇数 = len(set(labels)) - (1 if -1 in labels else 0)，-1是噪声点标签'
            ],
            referenceAnswer: `import pandas as pd
from sklearn.cluster import AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

def compare_clustering(X):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    # 层次聚类
    hc = AgglomerativeClustering(n_clusters=3, linkage='ward')
    hc_labels = hc.fit_predict(X_scaled)
    hc_sil = silhouette_score(X_scaled, hc_labels)
    # DBSCAN
    db = DBSCAN(eps=0.5, min_samples=5)
    db_labels = db.fit_predict(X_scaled)
    n_clusters = len(set(db_labels)) - (1 if -1 in db_labels else 0)
    db_sil = silhouette_score(X_scaled, db_labels) if n_clusters >= 2 else None
    return {
        '层次聚类': {'簇数': 3, '轮廓系数': round(hc_sil, 4)},
        'DBSCAN': {'簇数': n_clusters, '轮廓系数': round(db_sil, 4) if db_sil else None}
    }`,
            testCases: [
              { input: "from sklearn.datasets import make_blobs; X, _ = make_blobs(n_samples=200, centers=3, random_state=42); result = compare_clustering(X); print(result['层次聚类']['簇数'])", expectedOutput: '3' },
              { input: "from sklearn.datasets import make_blobs; X, _ = make_blobs(n_samples=200, centers=3, random_state=42); result = compare_clustering(X); print(result['层次聚类']['轮廓系数'] > 0)", expectedOutput: 'True' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch6-3',
      moduleId: 'data-mining',
      title: '关联规则与推荐',
      order: 3,
      lessons: [
        {
          id: 'les6-3-1',
          chapterId: 'ch6-3',
          title: '关联规则挖掘',
          type: 'both',
          content: `## 关联规则挖掘

关联规则挖掘用于发现数据中项之间的关联关系，最经典的应用是购物篮分析——"买A的人也倾向于买B"。超市通过关联规则分析发现"买尿布的顾客经常也买啤酒"，从而调整商品摆放位置，提升销售额。

### 基本概念

**1. 项集（Itemset）**
包含0个或多个项的集合，如 {面包, 牛奶, 鸡蛋}。频繁项集是支持度≥最小支持度阈值的项集。

**2. 支持度（Support）**
包含该项集的事务占总事务的比例：
Support(A) = count(A) / N

支持度衡量规则在数据中出现的频繁程度。支持度太低的规则可能是偶然现象，不具有统计意义。

**3. 置信度（Confidence）**
包含A的事务中也包含B的比例：
Confidence(A→B) = Support(A∪B) / Support(A)

置信度衡量规则的可靠程度。置信度0.8表示购买A的顾客中有80%也购买了B。

**4. 提升度（Lift）**
置信度与B的先验概率之比：
Lift(A→B) = Confidence(A→B) / Support(B)

提升度衡量A的出现对B出现概率的提升程度：
- Lift > 1：正相关，A的出现提升了B出现的概率
- Lift = 1：无关，A和B独立
- Lift < 1：负相关，A的出现降低了B出现的概率

### Apriori算法

Apriori算法利用"频繁项集的子集也必须是频繁的"这一先验性质，逐层搜索：

1. 扫描数据，找出所有频繁1-项集
2. 由频繁k-项集生成候选(k+1)-项集
3. 扫描数据，计算候选项集的支持度
4. 删除不满足最小支持度的候选项集
5. 重复直到无法生成新的频繁项集

### 购物篮分析实战

在Python中，使用mlxtend库的apriori和association_rules函数可以方便地进行关联规则挖掘。首先将交易数据转换为one-hot编码格式，然后设置最小支持度和最小置信度阈值进行挖掘。`,
          codeExample: `import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder

# 超市购物篮数据
transactions = [
    ['面包', '牛奶', '鸡蛋'],
    ['面包', '牛奶'],
    ['牛奶', '鸡蛋', '啤酒'],
    ['面包', '啤酒'],
    ['面包', '牛奶', '鸡蛋', '啤酒'],
    ['鸡蛋', '啤酒'],
    ['面包', '牛奶', '鸡蛋'],
    ['面包', '牛奶'],
    ['牛奶', '鸡蛋'],
    ['面包', '牛奶', '啤酒'],
]

# 转换为one-hot编码
te = TransactionEncoder()
df = pd.DataFrame(te.fit(transactions).transform(transactions),
                   columns=te.columns_)

# 挖掘频繁项集
freq = apriori(df, min_support=0.3, use_colnames=True)
print("频繁项集:")
print(freq.sort_values('support', ascending=False))

# 生成关联规则
rules = association_rules(freq, metric='confidence',
                           min_threshold=0.5)
print(f"\\n关联规则（置信度≥0.5）:")
print(rules[['antecedents', 'consequents', 'support',
             'confidence', 'lift']].round(4))

# 筛选强规则
strong = rules[(rules['lift'] > 1.2) & (rules['confidence'] > 0.6)]
print(f"\\n强关联规则（lift>1.2, confidence>0.6）:")
for _, r in strong.iterrows():
    print(f"  {set(r['antecedents'])} → {set(r['consequents'])}  "
          f"lift={r['lift']:.4f}")`,
          exercise: {
            id: 'ex6-3-1',
            lessonId: 'les6-3-1',
            description: '编写函数 `analyze_associations(df_onehot, min_support, min_confidence, min_lift)`，对one-hot编码的购物篮数据进行关联分析。返回满足条件的关联规则DataFrame，包含前件、后件、支持度、置信度和提升度，按提升度降序排列。',
            initialCode: `import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

def analyze_associations(df_onehot, min_support=0.3,
                          min_confidence=0.5, min_lift=1.0):
    # 请在此处编写代码
    pass

# 测试
from mlxtend.preprocessing import TransactionEncoder
transactions = [
    ['A', 'B', 'C'],
    ['A', 'B'],
    ['B', 'C'],
    ['A', 'C'],
    ['A', 'B', 'C'],
]
te = TransactionEncoder()
df = pd.DataFrame(te.fit(transactions).transform(transactions),
                   columns=te.columns_)
result = analyze_associations(df, 0.3, 0.5, 1.0)
print(result)`,
            hints: [
              '先用 apriori(df_onehot, min_support=min_support, use_colnames=True) 找频繁项集',
              '再用 association_rules(freq, metric="confidence", min_threshold=min_confidence) 生成规则',
              '用布尔条件筛选 lift >= min_lift，并按lift降序排列'
            ],
            referenceAnswer: `import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

def analyze_associations(df_onehot, min_support=0.3,
                          min_confidence=0.5, min_lift=1.0):
    freq = apriori(df_onehot, min_support=min_support, use_colnames=True)
    rules = association_rules(freq, metric='confidence',
                               min_threshold=min_confidence)
    rules = rules[rules['lift'] >= min_lift]
    result = rules[['antecedents', 'consequents', 'support',
                     'confidence', 'lift']].sort_values('lift',
                                                         ascending=False)
    return result.reset_index(drop=True)`,
            testCases: [
              { input: "from mlxtend.preprocessing import TransactionEncoder; te = TransactionEncoder(); t = [['A','B'],['A','B'],['A','C']]; df = pd.DataFrame(te.fit(t).transform(t), columns=te.columns_); result = analyze_associations(df, 0.3, 0.5, 0.5); print(len(result) >= 0)", expectedOutput: 'True' },
              { input: "from mlxtend.preprocessing import TransactionEncoder; te = TransactionEncoder(); t = [['A','B'],['A','B'],['A','C']]; df = pd.DataFrame(te.fit(t).transform(t), columns=te.columns_); result = analyze_associations(df, 0.3, 0.5, 0.5); print('lift' in result.columns)", expectedOutput: 'True' }
            ]
          }
        },
        {
          id: 'les6-3-2',
          chapterId: 'ch6-3',
          title: '协同过滤推荐',
          type: 'theory',
          content: `## 协同过滤推荐

推荐系统是数据挖掘在商业中最成功的应用之一，从淘宝的商品推荐到抖音的内容推荐，无处不在。协同过滤是推荐系统最经典的算法，它的核心思想是"物以类聚，人以群分"——相似的用户喜欢相似的物品。

### 推荐系统分类

**1. 协同过滤（Collaborative Filtering）**
- 基于用户行为（评分、购买、点击等）发现相似性
- 不需要物品的内容信息
- 分为基于用户和基于物品两种方式

**2. 基于内容的推荐（Content-Based）**
- 基于物品特征和用户偏好进行匹配
- 需要物品的特征描述（如电影的类型、导演等）
- 不存在新物品的冷启动问题

**3. 混合推荐**
- 结合多种推荐策略，通常效果最好
- 如Netflix结合协同过滤和内容特征

### 基于用户的协同过滤（User-Based CF）

核心思想：找到与目标用户相似的用户，推荐这些相似用户喜欢而目标用户尚未接触的物品。

**步骤：**
1. 构建用户-物品评分矩阵
2. 计算用户之间的相似度
3. 找到与目标用户最相似的K个用户
4. 根据相似用户的评分，加权预测目标用户对未评分物品的评分
5. 推荐预测评分最高的N个物品

### 基于物品的协同过滤（Item-Based CF）

核心思想：如果用户喜欢物品A，则推荐与A相似的物品B。Amazon最早使用此方法。

**优点：**
- 物品相似度可以离线计算和缓存
- 物品数量通常远少于用户数量，计算效率高
- 推荐结果更稳定

### 相似度计算方法

**余弦相似度**：最常用的方法，衡量两个向量的夹角
sim(A, B) = (A · B) / (||A|| × ||B||)
值域[-1, 1]，1表示完全相同，0表示无关

**皮尔逊相关系数**：考虑了评分的均值差异，更适合评分数据
值域[-1, 1]，衡量线性相关性

### 推荐系统评估

- **RMSE**：均方根误差，衡量预测评分与真实评分的偏差
- **MAE**：平均绝对误差
- **Precision@K**：前K个推荐中用户实际喜欢的比例
- **Recall@K**：用户喜欢的物品中被推荐的比例

### 协同过滤的挑战

- **冷启动问题**：新用户没有行为数据，新物品没有被评分
- **数据稀疏性**：用户只对极少数物品评分，矩阵非常稀疏
- **可扩展性**：用户和物品数量巨大时计算成本高`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# 用户-物品评分矩阵（NaN表示未评分）
ratings = pd.DataFrame({
    '电影A': [5, 4, np.nan, np.nan, 3],
    '电影B': [3, np.nan, np.nan, 4, np.nan],
    '电影C': [4, np.nan, 5, np.nan, np.nan],
    '电影D': [np.nan, 4, np.nan, 5, np.nan],
    '电影E': [np.nan, np.nan, 3, 4, 5],
}, index=['用户1', '用户2', '用户3', '用户4', '用户5'])

# 计算用户相似度
df_filled = ratings.fillna(0)
user_sim = pd.DataFrame(
    cosine_similarity(df_filled),
    index=ratings.index, columns=ratings.index
)
print("用户相似度矩阵:")
print(user_sim.round(3))

# 基于用户的推荐
def recommend(user, ratings, user_sim, k=2):
    sim_users = user_sim[user].drop(user).nlargest(k)
    recs = {}
    for item in ratings.columns:
        if pd.isna(ratings.loc[user, item]):
            num, den = 0, 0
            for su, ss in sim_users.items():
                if not pd.isna(ratings.loc[su, item]):
                    num += ss * ratings.loc[su, item]
                    den += abs(ss)
            if den > 0:
                recs[item] = round(num / den, 2)
    return sorted(recs.items(), key=lambda x: -x[1])

print(f"\\n为用户1推荐: {recommend('用户1', ratings, user_sim)}")`,
          exercise: {
            id: 'ex6-3-2',
            lessonId: 'les6-3-2',
            description: '编写函数 `user_based_recommend(rating_matrix, user, k=2)`，实现基于用户的协同过滤推荐。rating_matrix是用户-物品评分DataFrame（NaN表示未评分），返回推荐物品及预测评分的列表，按评分降序排列。',
            initialCode: `import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def user_based_recommend(rating_matrix, user, k=2):
    # 请在此处编写代码
    pass

# 测试
df = pd.DataFrame({
    '电影A': [5, 4, np.nan],
    '电影B': [3, np.nan, np.nan],
    '电影C': [4, np.nan, 5],
}, index=['用户1', '用户2', '用户3'])
result = user_based_recommend(df, '用户1', k=2)
print(result)`,
            hints: [
              '用 fillna(0) 填充缺失值后计算 cosine_similarity 得到用户相似度矩阵',
              '找到与目标用户最相似的K个用户：user_sim[user].drop(user).nlargest(k)',
              '对目标用户未评分的物品，用相似用户的评分加权平均预测'
            ],
            referenceAnswer: `import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def user_based_recommend(rating_matrix, user, k=2):
    df_filled = rating_matrix.fillna(0)
    user_sim = pd.DataFrame(
        cosine_similarity(df_filled),
        index=rating_matrix.index, columns=rating_matrix.index
    )
    sim_users = user_sim[user].drop(user).nlargest(k)
    recs = {}
    for item in rating_matrix.columns:
        if pd.isna(rating_matrix.loc[user, item]):
            num, den = 0, 0
            for su, ss in sim_users.items():
                if not pd.isna(rating_matrix.loc[su, item]):
                    num += ss * rating_matrix.loc[su, item]
                    den += abs(ss)
            if den > 0:
                recs[item] = round(num / den, 2)
    return sorted(recs.items(), key=lambda x: -x[1])`,
            testCases: [
              { input: "import numpy as np; df = pd.DataFrame({'A': [5,4,np.nan], 'B': [3,np.nan,np.nan], 'C': [4,np.nan,5]}, index=['u1','u2','u3']); result = user_based_recommend(df, 'u1', k=2); print(type(result).__name__)", expectedOutput: 'list' },
              { input: "import numpy as np; df = pd.DataFrame({'A': [5,4,np.nan], 'B': [3,np.nan,np.nan], 'C': [4,np.nan,5]}, index=['u1','u2','u3']); result = user_based_recommend(df, 'u1', k=2); print(len(result) > 0)", expectedOutput: 'True' }
            ]
          }
        }
      ]
    },
    {
      id: 'ch6-4',
      moduleId: 'data-mining',
      title: '综合商务实战',
      order: 4,
      lessons: [
        {
          id: 'les6-4-1',
          chapterId: 'ch6-4',
          title: '电商用户分析实战',
          type: 'both',
          content: `## 电商用户分析实战

本节将完成一个端到端的电商用户分析项目，涵盖数据加载、清洗、分析和可视化的完整流程。这是数据挖掘项目中最接近实际工作的环节——真实数据往往杂乱无章，需要经过仔细的清洗和探索才能发现有价值的洞察。

### 项目背景

某电商平台希望了解用户行为特征，识别高价值客户群体，为精准营销提供数据支持。我们拿到了一份用户交易数据，需要完成以下任务：

1. 数据加载与概览
2. 数据清洗（缺失值、异常值处理）
3. 探索性数据分析（EDA）
4. RFM客户价值分析
5. K-Means客户分群
6. 客户画像与策略建议

### 数据清洗要点

真实数据通常存在以下问题：
- **缺失值**：某些字段为空，需要决定是删除还是填充
- **异常值**：如消费金额为负数或极大值，需要识别和处理
- **重复数据**：同一条记录出现多次，需要去重
- **数据类型**：日期字段可能是字符串，需要转换

### 探索性数据分析

EDA的目的是在建模之前充分了解数据：
- 描述性统计：均值、中位数、分位数、极值
- 分布分析：消费金额是否右偏？是否需要取对数？
- 相关性分析：各特征之间是否存在强相关？
- 分组分析：不同类别的用户行为是否有差异？

### RFM分析与客户分群

将前面学到的RFM模型和K-Means聚类结合，对客户进行价值分群。关键步骤：
1. 从交易数据中计算每位客户的R、F、M指标
2. 标准化后进行K-Means聚类
3. 分析各簇特征，定义客户类型
4. 根据客户类型提出营销策略建议

### 从分析到行动

数据分析的最终目的是指导业务决策。好的分析报告不仅要呈现数据，还要给出可执行的建议。例如："高价值客户占总数的15%但贡献了60%的营收，建议增加VIP专属服务提升留存率。"`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 模拟电商用户数据
np.random.seed(42)
n = 500
df = pd.DataFrame({
    'user_id': [f'U{i:04d}' for i in range(n)],
    'recency': np.random.exponential(25, n).astype(int),
    'frequency': np.random.poisson(10, n),
    'monetary': np.random.gamma(5, 150, n).round(2),
    'avg_order': np.random.uniform(50, 500, n).round(2),
    'tenure': np.random.randint(1, 48, n),
})

# 数据概览
print("=== 数据概览 ===")
print(df.describe().round(2))

# 数据清洗：处理极端值
df = df[df['monetary'] > 0]
df = df[df['recency'] < 200]

# RFM标准化 + K-Means聚类
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(df[['recency', 'frequency', 'monetary']])

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['segment'] = kmeans.fit_predict(rfm_scaled)

# 客户画像
profile = df.groupby('segment').agg(
    人数=('user_id', 'count'),
    平均R=('recency', 'mean'),
    平均F=('frequency', 'mean'),
    平均M=('monetary', 'mean')
).round(2)
profile['占比'] = (profile['人数'] / profile['人数'].sum() * 100).round(1)

print("\\n=== 客户画像 ===")
print(profile)`,
          exercise: {
            id: 'ex6-4-1',
            lessonId: 'les6-4-1',
            description: '编写函数 `ecommerce_analysis(df, k)`，对包含user_id、recency、frequency、monetary列的电商数据进行完整分析。返回包含两个元素的元组：(1) 添加了segment列的DataFrame，(2) 各簇的RFM均值统计DataFrame（含人数列）。',
            initialCode: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def ecommerce_analysis(df, k=4):
    # 请在此处编写代码
    pass

# 测试
import numpy as np
np.random.seed(42)
df = pd.DataFrame({
    'user_id': [f'U{i:03d}' for i in range(200)],
    'recency': np.random.exponential(25, 200).astype(int),
    'frequency': np.random.poisson(10, 200),
    'monetary': np.random.gamma(5, 150, 200).round(2),
})
result_df, profile = ecommerce_analysis(df, k=3)
print(profile)
print(f"簇数: {result_df['segment'].nunique()}")`,
            hints: [
              '对recency、frequency、monetary三列进行StandardScaler标准化',
              '用KMeans(n_clusters=k, random_state=42, n_init=10)聚类',
              'groupby计算各簇RFM均值和人数'
            ],
            referenceAnswer: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def ecommerce_analysis(df, k=4):
    df = df.copy()
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(
        df[['recency', 'frequency', 'monetary']])
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    df['segment'] = kmeans.fit_predict(rfm_scaled)
    profile = df.groupby('segment').agg(
        人数=('user_id', 'count'),
        平均R=('recency', 'mean'),
        平均F=('frequency', 'mean'),
        平均M=('monetary', 'mean')
    ).round(2)
    return df, profile`,
            testCases: [
              { input: "import numpy as np; np.random.seed(42); df = pd.DataFrame({'user_id': [f'U{i:03d}' for i in range(100)], 'recency': np.random.exponential(25, 100).astype(int), 'frequency': np.random.poisson(10, 100), 'monetary': np.random.gamma(5, 150, 100).round(2)}); result_df, profile = ecommerce_analysis(df, k=3); print(result_df['segment'].nunique())", expectedOutput: '3' },
              { input: "import numpy as np; np.random.seed(42); df = pd.DataFrame({'user_id': [f'U{i:03d}' for i in range(100)], 'recency': np.random.exponential(25, 100).astype(int), 'frequency': np.random.poisson(10, 100), 'monetary': np.random.gamma(5, 150, 100).round(2)}); result_df, profile = ecommerce_analysis(df, k=3); print(len(profile))", expectedOutput: '3' }
            ]
          }
        },
        {
          id: 'les6-4-2',
          chapterId: 'ch6-4',
          title: '销售预测实战',
          type: 'both',
          content: `## 销售预测实战

销售预测是商务数据挖掘的重要应用，准确的预测可以帮助企业优化库存管理、制定生产计划、合理配置资源。本节将使用回归模型进行销售预测，结合时间序列特征工程，完成从数据准备到模型评估的完整流程。

### 销售预测的商务价值

- **库存管理**：预测未来销量，避免库存积压或缺货
- **生产计划**：根据预测安排生产，降低成本
- **财务规划**：预测营收，辅助预算决策
- **营销策略**：预测促销效果，优化投放

### 时间序列特征工程

销售数据具有时间维度，可以从日期中提取有价值的特征：

- **时间特征**：月份、季度、星期几、是否周末、是否节假日
- **滞后特征**：前1天/7天/30天的销量（lag特征）
- **滑动统计**：过去7天/30天的均值、最大值、最小值
- **趋势特征**：销量的增长趋势

### 回归模型选择

- **线性回归**：简单可解释，适合线性趋势
- **决策树回归**：能捕捉非线性关系，可解释性强
- **随机森林回归**：集成方法，精度高，抗过拟合

### 模型评估指标

- **MAE（平均绝对误差）**：预测值与真实值的平均偏差，单位与原数据一致
- **RMSE（均方根误差）**：对大误差更敏感，惩罚偏差大的预测
- **R²（决定系数）**：模型解释的方差比例，范围(-∞, 1]，越接近1越好

### 预测流程

1. 数据加载与预处理
2. 特征工程（时间特征 + 滞后特征）
3. 划分训练集和测试集（按时间顺序）
4. 训练回归模型
5. 评估模型性能
6. 预测未来销量

注意：时间序列数据不能随机划分训练集和测试集，必须按时间顺序划分，否则会造成数据泄露。`,
          codeExample: `import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# 模拟月度销售数据
np.random.seed(42)
dates = pd.date_range('2022-01', periods=36, freq='M')
trend = np.linspace(100, 200, 36)
seasonal = 30 * np.sin(np.arange(36) * 2 * np.pi / 12)
noise = np.random.normal(0, 10, 36)
sales = trend + seasonal + noise

df = pd.DataFrame({'date': dates, 'sales': sales.round(1)})

# 特征工程
df['month'] = df['date'].dt.month
df['quarter'] = df['date'].dt.quarter
df['lag1'] = df['sales'].shift(1)
df['lag12'] = df['sales'].shift(12)
df['rolling_mean3'] = df['sales'].rolling(3).mean()
df = df.dropna()

# 划分数据（按时间顺序）
split = int(len(df) * 0.8)
features = ['month', 'quarter', 'lag1', 'lag12', 'rolling_mean3']
X_train, X_test = df[features].iloc[:split], df[features].iloc[split:]
y_train, y_test = df['sales'].iloc[:split], df['sales'].iloc[split:]

# 训练随机森林
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"R²: {r2_score(y_test, y_pred):.4f}")
print(f"\\n特征重要性:")
for f, i in sorted(zip(features, model.feature_importances_),
                     key=lambda x: -x[1]):
    print(f"  {f}: {i:.4f}")`,
          exercise: {
            id: 'ex6-4-2',
            lessonId: 'les6-4-2',
            description: '编写函数 `sales_predict(df, target_col, feature_cols, test_ratio)`，对包含时间特征的DataFrame进行销售预测。使用RandomForestRegressor(n_estimators=100, random_state=42)，按时间顺序划分训练集和测试集。返回包含MAE和R²的字典。',
            initialCode: `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

def sales_predict(df, target_col, feature_cols, test_ratio=0.2):
    # 请在此处编写代码
    pass

# 测试
import numpy as np
np.random.seed(42)
df = pd.DataFrame({
    'month': list(range(1, 25)) + list(range(1, 25)),
    'lag1': np.random.uniform(80, 200, 48),
    'rolling_mean3': np.random.uniform(100, 180, 48),
    'sales': np.random.uniform(80, 220, 48)
})
result = sales_predict(df, 'sales', ['month', 'lag1', 'rolling_mean3'])
print(result)`,
            hints: [
              '按时间顺序划分：split = int(len(df) * (1 - test_ratio))',
              '训练集取前split行，测试集取后len(df)-split行',
              '用mean_absolute_error和r2_score计算指标'
            ],
            referenceAnswer: `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

def sales_predict(df, target_col, feature_cols, test_ratio=0.2):
    split = int(len(df) * (1 - test_ratio))
    X_train = df[feature_cols].iloc[:split]
    X_test = df[feature_cols].iloc[split:]
    y_train = df[target_col].iloc[:split]
    y_test = df[target_col].iloc[split:]
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    return {
        'MAE': round(mean_absolute_error(y_test, y_pred), 2),
        'R2': round(r2_score(y_test, y_pred), 4)
    }`,
            testCases: [
              { input: "import numpy as np; np.random.seed(42); df = pd.DataFrame({'month': list(range(1,13))*2, 'lag1': np.random.uniform(80,200,24), 'sales': np.random.uniform(80,220,24)}); result = sales_predict(df, 'sales', ['month', 'lag1']); print('MAE' in result and 'R2' in result)", expectedOutput: 'True' },
              { input: "import numpy as np; np.random.seed(42); df = pd.DataFrame({'month': list(range(1,13))*2, 'lag1': np.random.uniform(80,200,24), 'sales': np.random.uniform(80,220,24)}); result = sales_predict(df, 'sales', ['month', 'lag1']); print(result['MAE'] >= 0)", expectedOutput: 'True' }
            ]
          }
        }
      ]
    }
  ]
};
