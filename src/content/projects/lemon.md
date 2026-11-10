---
title: "Lemon"
description: "An internal AI agent that answers questions and automates routine work at NN/G."
order: 20
dateLabel: "2026–present"
startYear: 2026
heroImage: ./lemon/cover.jpg
heroImageAlt: "Stylized illustration of a yellow lemon among green leaves"
draft: false
---

At NN/G, Lemon tracks where articles are in the editorial process using updates from email. It also helps prepare captions. These are two of the routine tasks that used to take colleagues’ time.

Because Lemon works in shared systems, it needs to check what each colleague can access and which actions require approval. Before approving a change, colleagues need to see what Lemon proposes to do. Afterward, they need a record of what happened.

## My role

I designed and built Lemon using AI-assisted programming, and I maintain it. I work with the colleagues who own each workflow to decide where a language model helps, where a fixed rule is safer, and what we need to test before release.

## What I built

Colleagues can ask Lemon questions or use it to handle routine steps in their workflows.

- **A conversational agent** available through Slack, Notion, and email. It answers questions about NN/G and can search more than 1,800 published NN/G articles, citing the sources it uses.
- **An automation layer** with more than 10 live workflows spanning every business unit. These systems proofread content, prepare captions and metadata, reconcile editorial state, evaluate incoming requests, synchronize work across tools, and handle other bounded operational tasks. Some workflows use language models. Others are deliberately deterministic.

## Designing for trust

I set up permissions and checks so we could test what Lemon was allowed to do before rolling it out.

- Lemon uses separate tools to read data and make changes. In dry-run mode, the tools that make changes are unavailable.
- Ambiguous or consequential actions require human approval.
- Every write produces a durable audit record identifying the actor, trigger, action, and outcome.
- Code and tests enforce limits on where draft and private content can appear. For example, Lemon filters unpublished drafts before they can reach a log, message, or email.
- The colleagues who own each workflow can change its rules and quality criteria without rewriting the automation.
- New workflows begin in dry-run, expose their proposed actions for review, and move to production only after review and approval.

## What we're measuring

We log model costs, adoption, and completed work. An internal dashboard shows colleagues what Lemon can do, where it falls short, and how we measure its use. We report estimated time saved separately from recorded activity.

You can read more about [why we built Lemon instead of buying an off-the-shelf agent](/blog/lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/) and [how the project began](/blog/i-built-my-companys-institutional-ai-agent/).
