---
title: 'From DQN to PPO'
description: 'A map of the design decisions that connect value-based deep RL to clipped policy optimisation.'
publishDate: '2026-08-26'
category: learning-notes
collection: reinforcement-learning
tags:
  - reinforcement learning
  - dqn
  - ppo
  - learning map
language: English
translationKey: from-dqn-to-ppo
---

DQN and PPO are often taught as separate milestones. I understand them better as answers to different failure modes that appear when we move from a tabular decision process to a high-dimensional function approximator.

## The shortest map

| Question | DQN | PPO |
| --- | --- | --- |
| What is learned? | An action-value function $Q_\theta(s,a)$ | A policy $\pi_\theta(a\mid s)$ and value baseline |
| Action selection | Greedy or $\epsilon$-greedy | Sample from the policy |
| Data usage | Off-policy replay | Mostly on-policy rollouts |
| Main stabiliser | Target network and replay buffer | Conservative ratio-clipped updates |
| Natural action space | Discrete | Discrete or continuous |

The distinction is not “old versus new”. It is about where the algorithm stores uncertainty and where it gets its training signal.

## DQN: learn the consequences of actions

DQN minimises a temporal-difference target such as

$$
y_t = r_t + \gamma \max_{a'}Q_{\bar\theta}(s_{t+1},a'),
$$

where $\bar\theta$ is a delayed target network. Experience replay breaks the strong temporal correlations in consecutive transitions and lets useful experiences be revisited.

The max operator is efficient for discrete actions, but it also creates a familiar problem: overestimation and brittle extrapolation when the network encounters state–action combinations that are poorly represented in the replay buffer.

## PPO: learn a conservative change in behaviour

PPO starts from an old policy and collects a rollout under it. The policy update uses the probability ratio

$$
r_t(\theta) = \frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}.
$$

The clipped objective is

$$
L^{\text{CLIP}}(\theta)=\mathbb{E}_t\left[\min\left(r_t(\theta)\hat A_t,\;\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t\right)\right].
$$

The clip does not guarantee a trust region. It simply removes the incentive to make some overly large changes according to the sampled advantage. The value loss and entropy bonus are separate terms with their own failure modes.

## The common engineering problem

Both algorithms need a target that is less self-referential than the raw network output. DQN uses a delayed target network; PPO uses an old policy snapshot and a value estimate. In both cases, training becomes less fragile when the thing being optimised is not allowed to move at exactly the same pace as the thing defining the target.

This is the pattern I want to remember:

1. identify the moving target,
2. create a reference that changes more slowly,
3. measure the mismatch explicitly, and
4. inspect whether the stabiliser changes the intended objective.

## A compact PPO update

```python title="ppo_step.py"
ratio = torch.exp(new_log_prob - old_log_prob)
surrogate_a = ratio * advantage
surrogate_b = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps) * advantage
policy_loss = -torch.minimum(surrogate_a, surrogate_b).mean()

value_loss = 0.5 * (value - returns).pow(2).mean()
entropy_bonus = distribution.entropy().mean()
loss = policy_loss + value_coef * value_loss - entropy_coef * entropy_bonus
```

The code hides a large amount of bookkeeping: rollout boundaries, bootstrapping masks, minibatch shuffling, old log probabilities, and evaluation separate from training. Those details are not incidental. They define what data the objective is actually optimising.

## What I would compare first

For a new environment, I would not begin with a broad algorithm shootout. I would first compare:

- the same network capacity with fixed seeds,
- action distribution entropy over time,
- value loss and explained variance,
- update-to-data ratio, and
- performance on a frozen evaluation environment.

The route from DQN to PPO is not a ladder where PPO wins by default. It is a reminder that the choice of objective, data regime, and stabilisation mechanism should follow the structure of the problem.
