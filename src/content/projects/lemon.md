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

Lemon is NN/G's institutional AI agent: a shared internal system that answers questions, retrieves organizational knowledge, and runs workflow automations across the company. I designed, built, and maintain it through AI-assisted development.

Lemon's central product decision is simple: what if NN/G built an AI agent according to our own best practices? The result is a system of bounded workflow automations and a transparent, powerful institutional conversational agent.

The Lemon system is an ongoing project at NN/G, and contributes to our insights across our offerings.

## The organizational problem

NN/G is a small organization with work spread across Slack, Notion, email, Google Workspace, the company CMS, and other specialized systems. People spend meaningful time moving information between those systems, checking whether routine work happened, and reconstructing context that already exists somewhere else.

A useful system needed company context, but it also needed explicit limits, a visible paper trail, and a way for the people who own each workflow to retain control over it.

## My role

I am Lemon's product owner, designer, builder, and operator. I work directly with my colleagues at NN/G to identify suitable problems, map the existing workflow, decide where AI is appropriate and where deterministic software is safer, define approval boundaries, and evaluate the result before release.

I built Lemon without drawing on NN/G's small development team's roadmap. AI-assisted programming made that possible, but the important ownership remains human: I am responsible for the product decisions, permissions, evaluation criteria, documentation, rollout, and maintenance.

## What I built

Lemon has two main connected surfaces:

- **A conversational agent** available through Slack, Notion, and email. It can answer organizational questions and search a full-text-and-embedding index of more than 1,800 published NN/G articles with citations.
- **An automation layer** with more than 10 live workflows spanning every business unit. These systems proofread content, prepare captions and metadata, reconcile editorial state, evaluate incoming requests, synchronize work across tools, and handle other bounded operational tasks. Some workflows use language models. Others are deliberately deterministic.

## Designing for trust

I wasn't about to unleash an OpenClaw instance onto our organization's systems, which is why I decided on a centralized, org-owned agent over employee-owned individual agents. Lemon was also started in March 2026, a time when the ROI of AI agents wasn't clear, and trust had to be incrementally earned from the broader organization. I made some system-level decisions to earn my colleagues' trust.

- Read and write permissions are separate tool surfaces. In dry-run mode, write tools are structurally unavailable.
- Ambiguous or consequential actions require human approval.
- Every write produces a durable audit record naming the actor, trigger, action, and outcome.
- Draft and private content are prevented from reaching inappropriate surfaces through code-level boundaries and tests.
- Workflow rules and quality rubrics are owned by the colleagues responsible for that work and can be updated without rewriting the automation.
- New workflows begin in dry-run, expose their proposed actions for review, and move to production only after stakeholder sign-off and evaluation.


## Is it worth it?

Lemon is production software, which means it needs to earn its keep. Its current evidence base includes:

- More than 10 live automations working across all company business units
- A knowledge library covering more than 1,800 published articles
- A large automated test suite and structural checks around safety-critical boundaries
- A usage ledger that tracks model cost, successful work, adoption, and estimated human-time displacement
- An internal dashboard that publishes capabilities, known gaps, costs, and measurement methodology to the organization

You can read more about [why we built Lemon instead of buying an off-the-shelf agent](/blog/lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/) and [how the project began](/blog/i-built-my-companys-institutional-ai-agent/).
