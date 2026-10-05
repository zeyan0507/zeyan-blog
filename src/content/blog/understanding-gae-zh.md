---
title: '广义优势估计笔记'
description: '关于时序差分残差、λ 回报以及 GAE 背后偏差—方差权衡的学习笔记。'
publishDate: '2026-09-18'
category: paper-reading
collection: reinforcement-learning
researchTopics:
  - reinforcement-learning
paper:
  title: 'High-Dimensional Continuous Control Using Generalized Advantage Estimation'
  authors: ['John Schulman', 'Philipp Moritz', 'Sergey Levine', 'Michael Jordan', 'Pieter Abbeel']
  year: 2015
  venue: arXiv
  url: 'https://arxiv.org/abs/1506.02438'
  arxivId: '1506.02438'
featured: true
tags:
  - reinforcement learning
  - advantage estimation
  - paper reading
language: zh
translationKey: understanding-gae
---

广义优势估计（GAE）经常被介绍为一个可以直接放进 actor–critic 实现的公式。但更有用的理解方式，是把它看成一组估计器：在短时域的时序差分误差与长时域的蒙特卡洛回报之间进行插值。这两种证据都不完美。

## 一步残差

给定价值估计 $V_\phi$，定义

$$
\delta_t^V = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t).
$$

如果价值函数完全准确，这个残差的条件期望就是真实优势。但在实际运行中，$V_\phi$ 来自与策略同一条不断变化的数据流，因此每个残差既是学习信号，也包含测量误差。

## 累积残差

GAE 使用第二个参数 $\lambda$ 对一系列残差进行折扣：

$$
\hat A_t^{\text{GAE}(\gamma,\lambda)} = \sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}^V.
$$

在有限 rollout 中，实现通常是一次反向扫描：

```python title="gae.py"
def generalized_advantage(rewards, values, dones, gamma=0.99, lam=0.95):
    advantages = torch.zeros_like(rewards)
    carry = torch.zeros((), device=rewards.device)

    for t in reversed(range(len(rewards))):
        next_value = values[t + 1] if t + 1 < len(values) else 0.0
        continuation = 1.0 - dones[t]
        delta = rewards[t] + gamma * next_value * continuation - values[t]
        carry = delta + gamma * lam * continuation * carry
        advantages[t] = carry

    return advantages
```

`dones` 掩码非常重要。真正的终止状态并不等同于被截断的 rollout：前者没有可供自举的未来价值。混淆两者，可能让估计器看起来很稳定，却系统性地改变学习目标。

## Lambda 带来了什么

当 $\lambda=0$ 时，GAE 就是一步残差。它的方差相对较低，但高度依赖价值函数。当 $\lambda$ 趋近 $1$ 时，它会纳入更长的证据序列，并更接近蒙特卡洛估计。方差随之增大，对有偏价值估计的依赖则减弱。

这不是一个“越大越好”的通用旋钮。有效设置取决于 rollout 长度、奖励尺度、价值函数质量，以及每批数据之间的策略更新强度。

| 估计器                | $V_\phi$ 带来的偏差 | 方差 | 典型作用                 |
| --------------------- | ------------------- | ---- | ------------------------ |
| 一步 TD               | 较高                | 较低 | 快速、局部的信号         |
| 较小 $\lambda$ 的 GAE | 中等                | 中等 | 稳定的 actor–critic 更新 |
| 较大 $\lambda$ 的 GAE | 较低                | 较高 | 更长的信用分配           |
| 蒙特卡洛              | 自举偏差最低        | 最高 | 回合任务的参考           |

## 一个实用诊断

在调整 $\lambda$ 之前，建议记录以下分布：

1. 价值目标；
2. 原始优势；
3. 归一化优势；
4. 价值预测误差；
5. 回合长度与截断比率。

如果原始优势被少数异常值主导，归一化可能会让优化器更平稳，但并没有修复底层的信用分配问题。如果价值误差持续上升，而策略损失仍然看起来正常，评论家可能正在提供误导性基线。

## 我当前的默认值

我通常从 $\gamma=0.99$ 和 $\lambda=0.95$ 开始，然后把这两个数字当成待验证的假设，而不是仪式。最有用的比较通常不是单一分数，而是在固定随机种子、相同评估回合下做一组小范围扫描，并绘制上述估计器统计量。

GAE 把妥协显式化了。这正是它最重要的价值：它给我们一个参数，用来表达我们愿意在多大范围内信任对未来的学习模型。
