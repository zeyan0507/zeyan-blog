---
title: '从 DQN 到 PPO'
description: '梳理从基于价值的深度强化学习到裁剪策略优化之间的设计决策。'
publishDate: '2026-08-26'
category: learning-notes
collection: reinforcement-learning
tags:
  - reinforcement learning
  - dqn
  - ppo
  - learning map
language: zh
translationKey: from-dqn-to-ppo
---

DQN 和 PPO 经常被当作两个独立里程碑来讲授。我更愿意把它们理解为：当我们从表格决策过程走向高维函数近似器时，针对不同失效模式给出的两类回答。

## 最短的对照图

| 问题 | DQN | PPO |
| --- | --- | --- |
| 学什么？ | 动作价值函数 $Q_\theta(s,a)$ | 策略 $\pi_\theta(a\mid s)$ 和价值基线 |
| 动作选择 | 贪心或 $\epsilon$-贪心 | 从策略分布采样 |
| 数据使用 | 离策略经验回放 | 主要使用在策略 rollout |
| 主要稳定器 | 目标网络和回放缓冲区 | 保守的比率裁剪更新 |
| 自然动作空间 | 离散 | 离散或连续 |

它们的区别并不是“旧与新”，而是算法把不确定性放在哪里，以及训练信号从哪里来。

## DQN：学习动作的后果

DQN 最小化类似下式的时序差分目标：

$$
y_t = r_t + \gamma \max_{a'}Q_{\bar\theta}(s_{t+1},a'),
$$

其中 $\bar\theta$ 是延迟更新的目标网络。经验回放打破连续转移中强烈的时间相关性，也允许有用经验被重复使用。

max 操作对离散动作很高效，但也会带来熟悉的问题：当网络遇到回放缓冲区中表示不足的状态—动作组合时，容易产生过估计和脆弱的外推。

## PPO：学习保守地改变行为

PPO 从一个旧策略开始，并在该策略下采集 rollout。策略更新使用概率比值

$$
r_t(\theta) = \frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}.
$$

裁剪目标为

$$
L^{\text{CLIP}}(\theta)=\mathbb{E}_t\left[\min\left(r_t(\theta)\hat A_t,\;\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t\right)\right].
$$

裁剪并不保证得到一个信赖域。它只是根据采样到的优势，去掉某些过大变化的激励。价值损失和熵奖励是独立项，也有各自的失效方式。

## 共同的工程问题

两种算法都需要一个不那么“自我指涉”的目标。DQN 使用延迟的目标网络；PPO 使用旧策略快照和价值估计。当被优化的对象与定义目标的对象不被允许以完全相同的速度移动时，训练往往更稳定。

我希望记住的模式是：

1. 找到正在移动的目标；
2. 创建一个变化更慢的参考；
3. 明确测量两者的偏差；
4. 检查稳定器是否改变了原定目标。

## 紧凑的 PPO 更新

```python title="ppo_step.py"
ratio = torch.exp(new_log_prob - old_log_prob)
surrogate_a = ratio * advantage
surrogate_b = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps) * advantage
policy_loss = -torch.minimum(surrogate_a, surrogate_b).mean()

value_loss = 0.5 * (value - returns).pow(2).mean()
entropy_bonus = distribution.entropy().mean()
loss = policy_loss + value_coef * value_loss - entropy_coef * entropy_bonus
```

这段代码隐藏了大量簿记工作：rollout 边界、自举掩码、小批量打乱、旧对数概率，以及与训练分离的评估。这些细节不是偶然的，它们决定了目标实际在优化哪些数据。

## 我会首先比较什么

对一个新环境，我不会一开始就广泛对比算法。我会先比较：

- 固定随机种子下相同的网络容量；
- 动作分布的熵如何随时间变化；
- 价值损失与可解释方差；
- 更新量与数据量的比率；
- 冻结评估环境上的性能。

从 DQN 到 PPO 并不是一架“PPO 默认获胜”的梯子。它提醒我们：目标函数、数据机制与稳定方法的选择，都应当服从问题本身的结构。
