---
title: "Lemon Lessons, Part 2: Why We Didn't Just Download an Agent"
heroImage: ./lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/cover.png
heroImageAlt: "Halftone black-and-white illustration of a citrus reamer beside a lemon"
pubDate: 2026-06-03
description: "Why we built our own agent at NN/G, and how we tested what it could do before giving it access to shared systems."
author: "Caleb Sponheim"
tags: ["AI", "lemon"]
---

I said no, to my boss, twice. First, [Kate](https://substack.com/@katemmoran) had to talk me into building [Lemon, NN/G’s internal AI agent](/blog/i-built-my-companys-institutional-ai-agent/). Even after I agreed, I wasn’t about to turn a personal agent loose on NN/G’s Slack or Notion (or God forbid our CMS).

In March 2026, when people were trying out OpenClaw and other personal agents, I understood the appeal. Our developers were already booked, and installing an agent sounded quicker than spending weeks building one. I needed to find out whether an agent built around one person’s permissions and preferences could serve a company.

## An institution’s agent has a different job

A personal agent belongs to you. It runs on your permissions, it answers to you, it optimizes for what you want.

Lemon works for NN/G. If a colleague asks it to make a change in a shared system, it has to check what that person can do and whose approval it needs. I wanted colleagues to be able to see what Lemon was allowed to do and check what it had done.

## How we tested new features

I used AI-assisted programming to build Lemon. I decided what each feature should do and how to test it before colleagues could use it.

I’d run each new feature in a test environment that could show me what it would change without making those changes. I’d review the proposed actions for a week before giving the feature permission to write to a real system.

In the first couple of months, the failures I saw were small. Lemon handles internal tasks like looking up information and running small automations. That limited scope matters when something goes wrong.

- **Test before granting write access.** A new feature can propose changes during testing. It can only make them once I’ve reviewed the proposals and granted access.
- **Filter unpublished drafts in code.** The code filters drafts before they can reach a log, a message, or an email. Even I don’t get to see drafts by default.
- **Record every change.** When Lemon changes something, it writes to a ledger and pings me.

## Reviewing the code

Over those first few months, I ran more than half a dozen reviews of Lemon’s security, architecture, and technical debt. For some reviews, I used a second AI tool to check the first tool’s findings.

The reviews found gaps. I’d much rather discover one on a quiet Tuesday than have it surprise me on a Friday evening.

## A note for everyone else building this stuff

I’m a non-engineer who ended up building load-bearing software. If you’re building something your company will depend on, test it somewhere it can’t make changes. Review what it proposes to do, and decide which actions need someone’s approval before you let it use a shared system.

Those were the conditions I needed to meet before giving Lemon access to NN/G’s systems. Building our own agent let me make them part of the design from the start.

Measure twice, squeeze once.
