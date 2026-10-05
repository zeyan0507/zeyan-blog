---
title: 'Generalized Advantage Estimation Notes'
description: 'Working notes on temporal-difference residuals, lambda returns, and the bias–variance trade-off behind GAE.'
publishDate: '2026-09-18'
category: paper-reading
collection: reinforcement-learning
featured: true
tags:
  - reinforcement learning
  - advantage estimation
  - paper reading
language: English
translationKey: understanding-gae
---

Generalized Advantage Estimation (GAE) is often introduced as a formula to paste into an actor–critic implementation. I find it more useful to read it as a family of estimators that interpolate between two imperfect sources of evidence: a short-horizon temporal-difference error and a long-horizon Monte Carlo return.

## The one-step residual

Given a value estimate $V_\phi$, define

$$
\delta_t^V = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t).
$$

If the value function were exact, the conditional expectation of this residual would be the true advantage. In a real run, $V_\phi$ is learned from the same changing data stream as the policy, so each residual is both a signal and a measurement error.

## Accumulating residuals

GAE discounts a sequence of residuals with a second parameter, $\lambda$:

$$
\hat A_t^{\text{GAE}(\gamma,\lambda)} = \sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l}^V.
$$

The implementation is usually a reverse scan over a finite rollout:

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

The `dones` mask matters. A terminal state is not a truncated rollout: it has no future value to bootstrap from. Confusing the two can make an estimator look stable while systematically changing the learning target.

## What lambda is buying

At $\lambda=0$, GAE is the one-step residual. It has relatively low variance, but it trusts the value function heavily. As $\lambda$ approaches $1$, it incorporates longer sequences of evidence and resembles a Monte Carlo estimate. Variance grows, while the dependence on a biased value estimate becomes weaker.

This is not a universal “higher is better” knob. The useful setting depends on rollout length, reward scale, value-function quality, and how aggressively the policy is updated between batches.

| Estimator | Bias from $V_\phi$ | Variance | Typical role |
| --- | --- | --- | --- |
| One-step TD | Higher | Lower | Fast, local signal |
| GAE, small $\lambda$ | Moderate | Moderate | Stable actor–critic updates |
| GAE, large $\lambda$ | Lower | Higher | Longer credit assignment |
| Monte Carlo | Lowest from bootstrapping | Highest | Episodic reference |

## A practical diagnostic

Before changing $\lambda$, log the distribution of:

1. value targets,
2. raw advantages,
3. normalised advantages,
4. value prediction error, and
5. episode lengths and truncation rates.

If the raw advantages are dominated by a few outliers, normalisation may make the optimiser calmer without fixing the underlying credit-assignment problem. If value error grows while policy loss looks healthy, the critic may be providing a misleading baseline.

## My current default

I start around $\gamma=0.99$ and $\lambda=0.95$, then treat those numbers as a hypothesis rather than a ritual. The most useful comparison is often not a single score but a small sweep with fixed seeds, the same evaluation episodes, and plots of the estimator statistics above.

GAE is a compromise made explicit. That is its main value: it gives us a parameter for saying how far we are willing to trust a learned model of the future.
