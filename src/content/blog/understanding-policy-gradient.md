---
title: 'Understanding Policy Gradient'
description: 'A first-principles walk through the policy-gradient objective, the log-derivative trick, and what the estimator is really measuring.'
publishDate: '2026-09-28'
updatedDate: '2026-10-01'
category: research
collection: reinforcement-learning
featured: true
tags:
  - reinforcement learning
  - policy gradient
  - foundations
language: English
translationKey: policy-gradient
---

Policy-gradient methods look deceptively compact in a paper. The familiar expression

$$
\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[\sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t)\, G_t\right]
$$

contains three separate ideas: a distribution over trajectories, a way to differentiate that distribution, and a noisy estimate of which actions were useful. This note keeps those pieces separate.

## Start with the objective

Let a trajectory be $\tau = (s_0, a_0, r_0, \ldots, s_T)$. The policy $\pi_\theta$ assigns it probability

$$
p_\theta(\tau) = \rho_0(s_0)\prod_{t=0}^{T-1}\pi_\theta(a_t\mid s_t)P(s_{t+1}\mid s_t,a_t).
$$

The environment dynamics are not differentiable with respect to $\theta$, but the policy terms are. The expected return is

$$
J(\theta) = \int p_\theta(\tau) R(\tau)\,d\tau.
$$

Differentiating under the integral and applying $\nabla p = p\nabla \log p$ gives

$$
\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta}\left[R(\tau)\nabla_\theta\log p_\theta(\tau)\right].
$$

Only the policy depends on $\theta$, so the log probability becomes a sum of per-step log probabilities. This is the score-function estimator: it lets us optimise through samples without differentiating the simulator.

## Why the return is a learning signal

For a sampled action, $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$ points toward increasing its probability. Multiplying by the return makes good actions more likely and poor actions less likely. A useful mental model is not “the policy receives a gradient from the environment”, but “the policy reweights its own sampled decisions using the evidence that followed them”.

The raw estimator is unbiased under the usual assumptions, but it can have very high variance. Two trajectories with similar early states can receive very different returns simply because of what happens much later.

## Baselines change variance, not the target

For any function $b(s_t)$ that does not depend on $a_t$,

$$
\mathbb{E}_{a_t\sim\pi_\theta(\cdot\mid s_t)}\left[\nabla_\theta\log\pi_\theta(a_t\mid s_t)b(s_t)\right] = 0.
$$

Therefore we can replace $G_t$ with an advantage-like signal $G_t-b(s_t)$ without changing the expected gradient. The baseline is valuable because it asks a narrower question: was this action better or worse than the state’s usual outcome?

In practice, the baseline is often a learned value function $V_\phi(s_t)$. That leads naturally to actor–critic methods and to the advantage estimators in the next note.

## A minimal Monte Carlo implementation

```python title="policy_gradient.py"
log_probs = []
returns = []

for episode in range(num_episodes):
    log_probs_episode, rewards = [], []
    state, done = env.reset(), False

    while not done:
        action, log_prob = policy.sample(state)
        next_state, reward, done, info = env.step(action)
        log_probs_episode.append(log_prob)
        rewards.append(reward)
        state = next_state

    discounted = discount_returns(rewards, gamma=0.99)
    log_probs.extend(log_probs_episode)
    returns.extend(discounted)

loss = -(torch.stack(log_probs) * normalize(torch.tensor(returns))).mean()
optimizer.zero_grad()
loss.backward()
optimizer.step()
```

The code is intentionally incomplete: the important boundary is visible. Sampling produces log probabilities; the environment produces rewards; the update combines the two. Normalising returns is a variance heuristic, not part of the policy-gradient theorem.

## Questions I want to keep open

- How much of the observed instability comes from the estimator and how much from the policy parameterisation?
- When does a more expressive value function reduce variance while introducing harmful bias?
- Which diagnostics make it obvious that an update is exploiting a reward proxy rather than improving the intended behaviour?

The theorem is short. The engineering work is making its assumptions observable.
