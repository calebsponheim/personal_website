---
title: "I Built My Company's Institutional AI Agent"
heroImage: ./post-1/cover.webp
heroImageAlt: "top half of the lemon tree metaphor image. full image in the blog post"
pubDate: 2026-05-08
description: "Meet Lemon, built without a dev team. What it does, and the first of the Lemon Lessons."
author: "Caleb Sponheim"
tags: ["AI", "lemon"]
---

“When life gives you a Mac Mini, make Lemon”

I’ve been building the first institutional AI agent at our company, Nielsen Norman Group. We’ve named it Lemon.

An institutional AI agent is a system that works on behalf of an organization. It looks things up and takes action, and the company is willing to put its name on what it produces — for both employees and the people the company serves.

Building Lemon has had me oscillating (in an almost brain-frying way) between wildly different tasks: bug-fixing an automation for our incredible articles team, developing a feature to make a chatbot more explainable and transparent to coworkers, and trying to apply what I’m learning to the myriad of AI courses I teach.

While all of this is super exciting, I have to admit: Kate had to bully me into it. The whirlwind of OpenCLAW and other personal AI agents was interesting, but I wasn’t about to recommend siccing one of those on NN/G’s systems. Kate eventually pitched it as a way to build my own AI literacy and to explore how AI might help NN/G. Okay, fine, that sounds fun.

Here’s the wrinkle, though: we have a very small development team focused on mission-critical, profit-generating projects. They don’t have time to build an AI agent as a side project. **So, as a non-programmer, I’ve been building Lemon myself, and it has grown (carefully) into two major branches: workflow automation and a chatbot.**

![Diagram of the Lemon system architecture: a tree where roots represent institutional memory, branches divide into automated systems and a conversational agent.](./post-1/tree.jpg "Every Lemon action grows from the same root (its institutional memory) and branches in two directions: automated systems that handle work in the background (some as sub-agents, others as single-step automations) and a conversational agent that lives in Slack.")

Today, beneath its citrusy exterior, Lemon is mostly a series of tightly scoped automations that conditionally use large language models to handle tasks teams have flagged as automatable.

Some of these sub-agents have names: Bobert copy-edits captions, Claudette ideates social posts, and the article pipeline manager tracks editorial state from email. There are others!

Some “automations” in this category aren’t agentic at all. They’re a single step, or they might not even involve an LLM.

Lemon is also a fully featured, information-seeking conversational agent, available across our work. It surfaces to answer employee questions and find the most niche information in our systems. Lemon is effective in this role because it’s an institutional AI. It doesn’t belong to anyone. It doesn’t favor anyone. It represents the organization: our information, our protocols, our policies, our values, our people.

When someone starts a chat with Lemon, it knows who it’s talking to. One of the first decisions we made was to give Lemon a memory bank of everyone at the company, their responsibilities, and who they report to. When someone messages Lemon, it already knows what’s going on and can tailor its responses to that person’s needs. When invited into a conversation with multiple people, Lemon pulls context on all of them.

Personal AI systems like Claude are encouraged at NN/G, but Lemon sits at the org level. I own its failures because I’ve built it, but it’s not my assistant (despite what my colleagues might think).

So, why does Lemon exist? How do I structure and think about this citron-ey AI agent? Lemon is two opportunities in one effort:

**1. Practice what we preach.** We’re a research-backed organization. Until now, we hadn’t designed any AI experiences ourselves, despite conducting extensive research on what and how others are building. To give the best advice, we owe it to our audience (and to ourselves) to build real AI experiences, learn from that process, and demonstrate best practices for working with this technology. We dogfood our own advice in many other ways, so we’ve started doing it with AI too.

**2. Help our people.** Despite what people might guess (5,000? 500?), NN/G is fewer than 50 full-time employees. Historically, we’ve worked to punch above our weight. Given the current climate of the technology industry and gestures wildly everything else, that’s not changing. We don’t want our incredibly talented colleagues stuck editing spreadsheets by hand, updating tables across data sources, or laboring through low-precision tasks that drain them every day. Ideally, our colleagues spend their time on things they’re interested in — things that serve our mission of creating insights for the people who design products in the world. Anybody who cares about making well-designed things — that’s what we care about.

So that’s Lemon. An opportunity to dogfood our own best practices, and an opportunity to ease the burden of tedious, repetitive, low-precision tasks so our people can do better work.

Now, the way I’ve been talking about it might make it sound very buttoned up. That could not be farther from the truth! Even though Lemon is a stable, reliable collection of software, I’ve learned a lot of lessons building this thing. Lemon Lessons. I’ll share some of these Lemon Lessons as I write them down (and as Sarah and Kate nudge me to pull them together).

I’ll leave you with a little hint of what might come next: you might have read this and thought, “Why didn’t they just use an off-the-shelf tool?” or “Why build from scratch?” or “OpenCLAW???” or “How is the team reacting to it?"

I have good reasons and real concerns about what’s currently out there. The decisions we’ve made (and the mistakes we’ve seen in the community, especially with non-engineers building system-critical infrastructure) are worth unpacking. We can do better! Until then, keep an eye out.
