---
title: "Lemon"
description: "Putting AI design advice into practice through an institutional agent for NN/G."
order: 20
dateLabel: "2026–present"
startYear: 2026
heroImage: ./lemon/cover.jpg
heroImageAlt: "Stylized illustration of a yellow lemon among green leaves"
draft: false
---

Lemon is NN/G's institutional AI agent: a shared internal system that answers questions, retrieves organizational knowledge, and runs workflow automations across the company. I designed, built, and maintain it through AI-assisted development.

We give people advice about designing AI experiences. Building Lemon gives us a way to put that advice into practice and find out what we've missed, while making something useful for colleagues.

## Learning from a shared agent

Lemon represents the organization, so its behavior needs to account for more than what one person wants it to do. A colleague might ask it to find information or change something in a shared system; the system needs to check what that person can access and whether the action requires approval.

That has consequences for the interface. Someone needs to understand what Lemon proposes to do before approving it, and be able to check what happened afterward. I chose explicit permissions, human approvals, and a record of changes so those boundaries could be inspected.

Working through those decisions informs my writing and teaching. The [Lemon Lessons](/blog/i-built-my-companys-institutional-ai-agent/) describe what we're learning as the project develops.

## The organizational problem

NN/G is a small organization with work spread across Slack, Notion, email, Google Workspace, the company CMS, and other specialized systems. People spend meaningful time moving information between those systems, checking whether routine work happened, and reconstructing context that already exists somewhere else.

A useful system needed company context, but it also needed explicit limits, a visible paper trail, and a way for the people who own each workflow to retain control over it.

## My role

I am Lemon's product owner, designer, builder, and operator. I work directly with my colleagues at NN/G to identify suitable problems, map the existing workflow, decide where AI is appropriate and where deterministic software is safer, define approval boundaries, and evaluate the result before release.

NN/G's small development team was already working on other priorities. I used AI-assisted programming to implement Lemon, and I am responsible for deciding what it should do, checking the result, and maintaining it. That includes permissions, evaluation criteria, documentation, and rollout.

## What I built

Lemon has two main connected surfaces:

- **A conversational agent** available through Slack, Notion, and email. It can answer organizational questions and search a full-text-and-embedding index of more than 1,800 published NN/G articles with citations.
- **An automation layer** with more than 10 live workflows spanning every business unit. These systems proofread content, prepare captions and metadata, reconcile editorial state, evaluate incoming requests, synchronize work across tools, and handle other bounded operational tasks. Some workflows use language models. Others are deliberately deterministic.

## Designing for trust

I chose a centralized, organization-owned agent with defined access to shared systems. As we introduced it to colleagues, I wanted its boundaries to be visible and testable. That led to several design decisions:

- Read and write permissions are separate tool surfaces. In dry-run mode, write tools are structurally unavailable.
- Ambiguous or consequential actions require human approval.
- Every write produces a durable audit record identifying the actor, trigger, action, and outcome.
- Draft and private content are prevented from reaching inappropriate surfaces through code-level boundaries and tests.
- Workflow rules and quality rubrics are owned by the colleagues responsible for that work and can be updated without rewriting the automation.
- New workflows begin in dry-run, expose their proposed actions for review, and move to production only after stakeholder sign-off and evaluation.


## What we're measuring

Lemon needs to be useful in everyday work as well as informative to build. We track its use and limitations through:

- More than 10 live automations working across all company business units
- A knowledge library covering more than 1,800 published articles
- A large automated test suite and structural checks around safety-critical boundaries
- A usage ledger that tracks model cost, successful work, adoption, and estimated time returned to colleagues
- An internal dashboard that publishes capabilities, known gaps, costs, and measurement methodology to the organization

Automation counts describe the system's scope; they don't establish how much time it saves. Time-return figures are estimates, and I keep those separate from recorded activity.

You can read more about [why we built Lemon instead of buying an off-the-shelf agent](/blog/lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/) and [how the project began](/blog/i-built-my-companys-institutional-ai-agent/).
