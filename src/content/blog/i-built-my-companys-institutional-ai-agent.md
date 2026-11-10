---
title: "I Built My Company's Institutional AI Agent"
heroImage: ./i-built-my-companys-institutional-ai-agent/cover.webp
heroImageAlt: "Lemon tree diagram with one branch for automated tasks and another for the conversational agent"
pubDate: 2026-05-08
description: "How I built an internal chatbot and a set of automations for NN/G while our developers worked on other projects."
author: "Caleb Sponheim"
tags: ["AI", "lemon"]
---

“When life gives you a Mac mini, make Lemon.”

I’ve been building the first institutional AI agent at our company, Nielsen Norman Group. We’ve named it Lemon.

An institutional AI agent is a system that works on behalf of an organization. It looks things up and takes action, and the company is willing to put its name on what it produces — for both employees and the people the company serves.

Building Lemon sends me from fixing an automation for our articles team to making a chatbot explain an answer, then back to my courses to teach what I learned.

Kate had to talk me into it. I wasn’t about to recommend siccing a personal AI agent on NN/G’s systems. Then she pitched it as a way to learn what AI could do for us by building something myself.

Our small development team was busy with work the business already depended on. I built Lemon myself. It grew into a set of workflow automations and a chatbot.

![Diagram of the Lemon system architecture: a tree where roots represent institutional memory, branches divide into automated systems and a conversational agent.](./i-built-my-companys-institutional-ai-agent/tree.jpg "Every Lemon action grows from the same root (its institutional memory) and branches in two directions: automated systems that handle work in the background (some as sub-agents, others as single-step automations) and a conversational agent that lives in Slack.")

Most of Lemon is a set of small automations for tasks our teams asked us to take on. Some steps use language models.

Some of these sub-agents have names: Bobert copy-edits captions, Claudette drafts ideas for social posts, and the article pipeline manager uses email to track where each piece is in the editorial process.

Some “automations” in this category aren’t agentic at all. They’re a single step, or they might not even involve an LLM.

Colleagues can also ask Lemon questions in Slack. It looks up answers in NN/G’s shared systems and follows company policies, whoever asks.

When someone starts a chat with Lemon, it knows who it’s talking to. One of the first decisions we made was to give Lemon a memory bank of everyone at the company, their responsibilities, and who they report to. When someone messages Lemon, it already knows what’s going on and can tailor its responses to that person’s needs. When invited into a conversation with multiple people, Lemon pulls context on all of them.

Personal AI systems like Claude are encouraged at NN/G, but Lemon sits at the org level. I own its failures because I’ve built it, but it’s not my assistant (despite what my colleagues might think).

We built Lemon for two reasons.

**1. Practice what we preach.** We’re a research-backed organization. Until now, we hadn’t designed any AI experiences ourselves, despite conducting extensive research on what and how others are building. To give the best advice, we owe it to our audience (and to ourselves) to build real AI experiences, learn from that process, and demonstrate best practices for working with this technology.

**2. Help our people.** NN/G has fewer than 50 full-time employees. Every hour a colleague spends copying updates between spreadsheets is an hour they could spend on research, writing, or teaching.

I’m writing down what I learn as I build it, with some nudging from Sarah and Kate. In the [next Lemon Lesson](/blog/lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/), I explain why we built our own agent.
