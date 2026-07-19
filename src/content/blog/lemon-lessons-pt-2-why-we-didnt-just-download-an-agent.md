---
title: "Lemon Lessons Pt 2: Why We Didn't Just Download an Agent"
heroImage: ./lemon-lessons-pt-2-why-we-didnt-just-download-an-agent/cover.png
heroImageAlt: "Halftone black-and-white illustration of a citrus reamer beside a lemon"
pubDate: 2026-06-03
description: "We built our institutional AI from scratch instead of buying one off the shelf. It's not just because we think we're special; it was also to build trust in our first AI agent."
author: "Caleb Sponheim"
tags: ["AI", "lemon"]
---

You might have read about [Lemon, NN/G’s institutional AI agent,](/blog/post-1/) and thought: *why didn’t they just use an off-the-shelf tool? Why build from scratch? OpenCLAW???*

Okay, yes, I considered it. It wasn’t the right choice for us.

The beginning of Lemon was a bit embarrassing! I said no, to my boss, twice. First, [Kate](https://substack.com/@katemmoran) had to bully me into building anything at all. And, even once I’d agreed, I still felt very strongly that I wasn’t about to take a personal AI agent and turn it loose on NN/G’s Slack or Notion (or god forbid our CMS). In March 2026, the whirlwind around OpenCLAW and its cousins was genuinely *interesting*, but **I needed to figure out if an AI agent built for one person could serve a company.**

Let me be fair to the off-the-shelf agent first, because the appeal is real. If you’re a small team (like us; I think at last count, we’re still under 50 people), and your dev team is fully booked on mission-critical work, the pitch of a simple install is very attractive. Instead of spending weeks on development, I could drop in a capable agent, hand it the keys to my tools, and let it figure the rest out? Great!

For a single person managing their own stuff, personal agents like Hermes, OpenCLAW (there are others) can be pretty great at what they do (within limits).

But that’s the thing. They’re great at being *one person’s* agent, working on *one person’s* stuff. That turns out to be a completely different job than the one I needed done.

## An institution’s agent has a different job

Start with who the agent belongs to.

A personal agent belongs to you. It runs on your permissions, it answers to you, it optimizes for what you want. That’s a good and correct mental model for a personal AI agent, even one that helps you accomplish your professional work.

An institutional agent can’t belong to anyone. Lemon doesn’t favor the person who summoned it in a chatbox or Notion comment. It represents the organization: our information, our protocols, our policies, our values, our people. When you message it, it isn’t trying to make *you* happy; it’s trying to be right on behalf of the whole company.

You can’t satisfy that institutional goal by taking a personal agent and pointing it at company systems. Personal agents are built to maximize and emphasize *capability*, with more tools, more autonomy, more speed.

An institutional agent has to be built to maximize *trust*. Almost every design decision in Lemon is a deliberate vote for trust first, and capability second.

## We built it carefully, on purpose

So how do you actually build for trust? Slowly, and on purpose. This is the part I’m proudest of, if I do say so myself.

Every capability in Lemon got built the same way. I’m not an engineer; I didn’t hand-write most of this code. This is AI-assisted programming, with me deciding what’s being built and why. What was *entirely* mine was the caution. An AI left to its own enthusiasm optimizes for capability. Coding agents will happily hand you something fast, powerful, and completely unguarded, untested, and insecure.

So, I’d develop a new feature, then test it in a hardcoded environment where it physically *couldn’t change anything* — it could only show me what it *would* do. I’d watch those would-be actions for a week. Only once it had earned my trust, would I let it actually touch a real system.

Have things gone wrong? Of course they have. But nothing catastrophic. In my memory, across a couple of months of a non-engineer building tens of thousands of lines of working software, the failures have been small. I don’t *think* it’s luck. It’s the direct result of building to *prevent* problems rather than putting out fires. I’ll also be the first to admit that the work Lemon does is *small*: little automations here and there, information gathering. It’s not running public-facing... anything.

I’ll highlight a couple of guardrails:

- **Sandboxed pilot testing.** Any new feature literally cannot write to any database or system until I’ve watched it long enough to trust it.

- **Some walls are built so I can’t forget them.** Unpublished draft content (part of NN/G’s real value) gets hidden before it can reach a log, a message, or an email, and that rule is enforced by the code itself, not by Lemon remembering to be careful. (Even I don’t get to see content drafts by default.)

- **Everything gets written down.** Every change any part of Lemon makes lands in a ledger, and it pings me.

An off-the-shelf autonomous agent typically skips all of this. Pointing OpenCLAW at your company’s systems is, fundamentally, a bet that you won’t land on “Catastrophe”.

## “So Lemon is flawless?”

No. Please don’t read any of this as a victory lap.

What I’ll claim instead is that I keep *looking* for the flaws. Over the past couple of months I’ve run a whole stack of self-reviews against Lemon’s own code: adversarial security reviews, architecture reviews, tech-debt audits. More than half a dozen of them, some run through more than one AI tool so they’d check each other’s work. The entire point of each one was the same: go hunting for weaknesses before something goes wrong.

And they find things! Good. That’s what they’re for. I would much rather discover a gap myself, on a quiet Tuesday, than have it surprise me on a Friday evening.

Lemon’s flaws tend to be small, findable, and contained, instead of catastrophic and silent, because we keep going to look for them.

## A note for everyone else building this stuff

I’m a non-engineer who ended up building load-bearing software. If you’re wiring an autonomous agent into something your company actually depends on, you might be in the same boat. We can do better, and it’s genuinely not that hard.

Build AI in a sandbox before you let it touch anything real. Read the changes before you ship them. Let the thing ask for permission instead of assuming forgiveness. All of this is why a company of fewer than 50 people lets Lemon into its shared knowledge, and why it hasn’t blown up in our faces.

## So, why not OpenCLAW?

If you’re bringing AI into an organization, I’d gently suggest you stop asking how *capable* the agent is, and start asking how *legible* and how *bounded* it is. You can buy capability off a shelf. But trust has to be built naturally — and, respectfully, you can’t buy that.

That’s the whole reason we didn’t just download an agent. We took the slow, careful, somewhat-anxious path on purpose, so that when we tell you what we’ve learned about building AI responsibly, we’ll have actually done it. That’s the point of Lemon. It’s the point of these Lemon Lessons, too.

Measure twice, squeeze once.
