---
title: '我的研究笔记'
description: '一个持续更新的页面，记录我如何选择问题、记录实验，并在工作中让不确定性保持可见。'
publishDate: '2026-07-12'
category: research
collection: ai-for-science
tags:
  - research practice
  - ai for science
  - reproducibility
language: zh
translationKey: research-notes
---

研究笔记不是论文的润色版。它们是一个中间层：问题仍在改变，测量方式仍在协商，负面结果仍有机会影响下一个实验。

## 一条笔记从问题开始

我会尽量在打开 notebook 或开始实现模型之前先写下问题。一个有用的问题需要说清楚：正在改变的对象是什么，哪些证据可以算作改进，以及在什么条件下这个比较才有意义。

“这个模型能解决任务吗？”通常太宽泛。“加入守恒约束后，模型能否在不增加校准误差的情况下，降低留出机制上的误差？”则更接近一个实验能够回答的问题。

## 最小的有用实验

我理想中的第一轮实验包含：

- 一个明确的假设；
- 一个不容易被误解的基线；
- 一个受控变量；
- 一个能反映预期用途的评估划分；
- 一个失败判定标准。

这并不是在为过度简化的实验辩护。目的是让第一个实验足够清晰，使后续复杂结果有一个可以依附的参照。

## 一份紧凑的记录

```yaml title="experiment.yml"
question: Does the structural prior improve extrapolation?
hypothesis: The constrained model will degrade more slowly outside the training range.
baseline: MLP with matched parameter count
dataset_split: in_distribution / shifted_regime / sparse_regime
primary_metric: relative_error
secondary_metrics: [calibration_error, runtime, stability]
seeds: [11, 23, 47]
stop_condition: no improvement after three controlled revisions
```

这个文件刻意设计得很朴素。朴素的字段容易比较、搜索，也容易在实验兴奋感退去后重新审查。

## 什么算作证据

我会把三个层次分开：

1. **观察**——运行实际产生了什么。
2. **解释**——我当前认为能够解释结果的机制。
3. **决策**——下一次运行中将改变或保留什么。

把这些层次混在一起，容易让合理的解释听起来像已经测量到的事实。将它们分开，则可以在不改写历史的情况下修正当前叙事。

## 开放问题

- 当科学机制稀疏，而不只是分布外时，评估方式应该如何改变？
- 多少元数据足以复现结果，又不会把笔记变成仪器手册？
- 模型如何暴露它的归纳偏置正在哪里发挥有用作用？

我并不期待研究笔记消除不确定性。我希望它让不确定性更容易被定位。
