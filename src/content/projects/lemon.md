---
title: "Lemon"
description: "An institutional AI agent for NN/G"
order: 10
dateLabel: "2026–present"
startYear: 2026
heroImage: ./lemon/cover.jpg
heroImageAlt: "Stylized illustration of a yellow lemon among green leaves"
draft: false
---

Lemon is NN/G's institutional AI agent: a shared internal system that answers questions, retrieves organizational knowledge, and runs carefully bounded automations across the company. I conceived it, designed it, built it through AI-assisted development, and continue to operate it.

The central product decision is simple: **most AI-agent projects optimize for capability; Lemon optimizes for trust.**

## The organizational problem

NN/G is a small organization with work spread across Slack, Notion, email, Google Workspace, the company CMS, and other specialized systems. People spend meaningful time moving information between those systems, checking whether routine work happened, and reconstructing context that already exists somewhere else.

A generic autonomous agent would have been a poor fit. The useful system needed company context, but it also needed explicit limits, a visible paper trail, and a way for the people who own each workflow to retain control over it.

## My role

I am Lemon's product owner, designer, builder, and operator. I work directly with colleagues to identify suitable problems, map the existing workflow, decide where AI is appropriate and where deterministic software is safer, define approval boundaries, and evaluate the result before release.

I built Lemon without drawing on NN/G's small development team's roadmap. AI-assisted programming made that possible, but the important ownership remains human: I am responsible for the product decisions, permissions, evaluation criteria, documentation, rollout, and maintenance.

## What I built

Lemon has two connected surfaces:

- **A conversational agent** available through Slack and email. It can answer organizational questions and search a full-text-and-embedding index of more than 1,800 published NN/G articles with citations.
- **An automation layer** with more than 10 live workflows spanning every business unit. These systems proofread content, prepare captions and metadata, reconcile editorial state, evaluate incoming requests, synchronize work across tools, and handle other bounded operational tasks.

Some workflows use language models. Others are deliberately deterministic. The choice depends on the cost of being wrong, the audience for the output, and whether a human will review the result.

## Designing for trust

Trust is implemented in the system rather than left to a prompt:

- Read and write permissions are separate tool surfaces. In dry-run mode, write tools are structurally unavailable.
- Ambiguous or consequential actions require human approval against the exact proposed output.
- Every write produces a durable audit record naming the actor, trigger, action, and outcome.
- Draft and private content are prevented from reaching inappropriate surfaces through code-level boundaries and tests.
- Workflow rules and quality rubrics are owned by the colleagues responsible for that work and can be updated without rewriting the automation.
- New workflows begin in dry-run, expose their proposed actions for review, and move to production only after stakeholder sign-off and evaluation.

This approach is slower than maximizing autonomy. It is also why colleagues are willing to let Lemon participate in shared organizational work.

## Evidence, not demos

Lemon is production software rather than a prototype. Its current evidence base includes:

- More than 10 live automations working across all company business units
- A knowledge library covering more than 1,800 published articles
- A large automated test suite and structural checks around safety-critical boundaries
- A usage ledger that tracks model cost, successful work, adoption, and estimated human-time displacement
- An internal dashboard that publishes capabilities, known gaps, costs, and measurement methodology to the organization

The evaluation process also has permission to say no. In one retrieval experiment, a plausible enrichment technique reduced paraphrase recall from 0.70 to 0.60. I reverted it the same day and kept the negative result, cost, and criteria for reconsidering it in the project record.

## What I learned

Lemon's growth eventually surfaced a different kind of product risk: sustainability. The codebase expanded quickly, and several excellent safety mechanisms had been implemented more than once. I paused new automation work, audited the system, documented the duplication, and began consolidating around shared safety infrastructure.

That response captures the broader lesson of the project. Responsible AI work is not a fixed checklist. It is the repeated practice of finding a failure mode, reporting it honestly, making the correction structural, and preserving the reason for the next person—or the next version of the system.

You can read more about [why we built Lemon instead of buying an off-the-shelf agent](/blog/lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/) and [how the project began](/blog/i-built-my-companys-institutional-ai-agent/).
