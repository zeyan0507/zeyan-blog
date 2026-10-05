---
title: 'My Research Notes'
description: 'A living page about how I choose questions, record experiments, and keep uncertainty visible while working.'
publishDate: '2026-07-12'
category: research
collection: ai-for-science
tags:
  - research practice
  - ai for science
  - reproducibility
language: English
translationKey: research-notes
---

Research notes are not a cleaned-up version of a paper. They are the intermediate layer where questions are still changing, measurements are still being negotiated, and negative results still have a chance to influence the next experiment.

## A note begins with a question

I try to write the question before opening a notebook or implementing a model. A useful question names the object being changed, the evidence that would count as an improvement, and the conditions under which the comparison is meaningful.

“Can this model solve the task?” is usually too broad. “Does adding the conservation constraint improve error on held-out regimes without increasing calibration error?” is closer to something an experiment can answer.

## The smallest useful experiment

My preferred first pass contains:

- one explicit hypothesis,
- one baseline that is hard to misunderstand,
- one controlled variable,
- one evaluation split that reflects the intended use, and
- one failure criterion.

This is not an argument for simplistic experiments. It is an argument for making the first experiment legible enough that a complicated result has somewhere to attach.

## A compact record

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

The file is intentionally boring. Boring fields are easy to diff, search, and review after the excitement of an experiment has passed.

## What counts as evidence

I keep three layers separate:

1. **Observation** — what the run actually produced.
2. **Interpretation** — the mechanism I currently think explains it.
3. **Decision** — what I will change or keep in the next run.

Mixing those layers makes a plausible explanation feel like a measurement. Separating them makes it easier to revise a story without rewriting history.

## Open questions

- How should evaluation change when the scientific regime is sparse rather than merely out-of-distribution?
- Which metadata is enough to reproduce a result without turning the notebook into an instrument manual?
- How can a model expose where its inductive bias is doing useful work?

I do not expect a research notebook to remove uncertainty. I want it to make uncertainty easier to locate.
