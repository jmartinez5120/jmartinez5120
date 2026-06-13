<!-- ░░░░░░░░░░░░░░░░░░░░  ANIMATED NEON HEADER  ░░░░░░░░░░░░░░░░░░░░ -->
<a href="https://www.linkedin.com/in/john-martinez-10aba346">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:0F0C29,50:302B63,100:24D1F2&text=John%20Martinez-Ponce&fontColor=ffffff&fontSize=46&fontAlignY=38&desc=Engineering%20Architect%20%E2%80%A2%20Distributed%20Systems%20%E2%80%A2%20AI-Assisted%20Development&descAlignY=58&descSize=18&animation=fadeIn" alt="John Martinez-Ponce" />
</a>

<!-- ░░░░░░░░░░░░░░░░░░░░  ANIMATED TYPING SUBTITLE  ░░░░░░░░░░░░░░░░░░░░ -->
<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=800&color=24D1F2&center=true&vCenter=true&width=720&lines=Engineering+Architect+%C2%B7+Senior+Software+Engineer;15%2B+years+building+large-scale+systems;10%2B+years+%40+American+Express;Distributed+systems+%26+event-driven+design;I+build+software+with+AI%2C+daily)](https://github.com/jmartinez5120)

<img src="https://komarev.com/ghpvc/?username=jmartinez5120&label=Profile+Views&color=24D1F2&style=for-the-badge" alt="Profile Views" />
&nbsp;
<a href="https://www.linkedin.com/in/john-martinez-10aba346"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
&nbsp;
<img src="https://img.shields.io/badge/St.%20Johns,%20FL-Bilingual%20EN%2FES-302B63?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Location" />

</div>

<!-- ░░░░░░░░░░░░░░░░░░░░  ABOUT  ░░░░░░░░░░░░░░░░░░░░ -->
<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:24D1F2,100:302B63&section=header" width="100%" />

## ⚡ System Boot — `whoami`

```ts
const john = {
  role: "Engineering Architect · Senior Software Engineer · Technical Lead",
  company: "American Express — 10+ years",
  experience: "15+ years, mostly on identity & customer platforms",
  nowWorkingOn: "Replacing a 1996 monolith with distributed services",
  leads: "Two teams, 10+ engineers on the data layer",
  withAI: "Daily — agents, custom skills, local model fine-tuning",
  education: "B.S. Computer Science — Polytechnic University of Puerto Rico",
};
```

> I design distributed systems, lead engineering teams, and modernize the kind of legacy platforms that have been running since before some of my teammates were born — and I build software *with* AI as much as by hand.

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  SOFTWARE ARCHITECTURE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🏛️ Software Architecture

> I own systems end-to-end — the roadmap, the data model, the failure modes, and the runbook the on-call team actually uses. Most of my work is taking platforms that have outgrown their original design and moving them, a piece at a time, onto something the team can operate without holding its breath.

**What that looks like day to day**

- 🧭 Planning multi-year migrations that have to ship in slices, because the old system can't go down while the new one comes up.
- 🧱 Designing how data is split between write and read stores, and deciding what to do when one side is briefly out of sync with the other.
- 🔌 Wiring services together with Kafka and replication instead of brittle point-to-point calls.
- 🛡️ Getting auth, logging, and on-call ready *before* cutover — not after the first incident.
- 👥 Running design reviews and setting the conventions other engineers build against.

**Patterns I've actually used in production** — not a checklist; each one solved a specific problem:

| Pattern | The problem it solved |
| --- | --- |
| **CQRS** | Reads and writes had very different shapes and volumes, so I split them: PostgreSQL as the source of truth for writes, MongoDB as a read model for high-volume lookups. |
| **Change Data Capture (CDC)** | The read model had to stay current without dual-writes, so changes stream from Postgres via Debezium + Kafka Connect. |
| **Event-Driven Architecture** | Teams kept blocking on each other's services; moving to Kafka let them react to events instead of calling synchronously. |
| **Strangler Fig (Legacy Modernization)** | A 1996 Oracle stored-proc SSO system couldn't be rewritten in one shot, so we replaced it route by route with no downtime. |
| **Microservices** | One deploy shouldn't gate every team, so responsibilities are split into independently shippable Spring Boot services. |
| **Reactive (non-blocking) services** | Under acquisition-flow traffic, thread-per-request fell over; non-blocking I/O kept latency flat under load. |

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:24D1F2,100:302B63&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  AI-ASSISTED DEVELOPMENT  ░░░░░░░░░░░░░░░░░░░░ -->
## 🤖 AI-Assisted Development

> AI is part of how I actually work now, not a side experiment. Here's what that means in practice:

<table>
<tr>
<td width="50%" valign="top">

**🟣 Claude Code** — daily driver
CLI in bypass-permissions mode, multi-repo workflows, and **custom subagents** (`code-reviewer`, `api-tester`, `k8s-ops`) running repeated work in parallel.

**🟢 ChatGPT Codex**
Offloads parallel tasks to a cloud sandbox while I keep building — complements Claude Code, doesn't replace it.

**🛰️ OpenClaw / NVIDIA NemoClaw**
Always-on agents monitoring self-hosted services, firing alerts on failure, and running ops across my **K3s** cluster.

</td>
<td width="50%" valign="top">

**🧩 Custom Skills & Repo Context**
Reusable skills (CDC / Debezium scaffolding, TimescaleDB hypertables, Spring Boot service generation) + `CLAUDE.md` / `AGENTS.md` per repo for full architecture & runbook context.

**🖥️ Local AI Infrastructure**
Own an **NVIDIA DGX Spark** (Blackwell AI server) for local training & fine-tuning — **QLoRA / Unsloth** workflows when cloud APIs aren't appropriate. **Langfuse / Helicone** for agent tracing.

</td>
</tr>
</table>

<div align="center">
  <img src="https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/ChatGPT_Codex-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/NVIDIA_DGX_Spark-76B900?style=for-the-badge&logo=nvidia&logoColor=white" />
  <img src="https://img.shields.io/badge/QLoRA_·_Unsloth-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/Langfuse_·_Helicone-000000?style=for-the-badge&logo=probot&logoColor=white" />
</div>

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:24D1F2,100:302B63&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  METHODOLOGY  ░░░░░░░░░░░░░░░░░░░░ -->
## 🧭 How I Work With AI — Research → Design → Architect → Execute

> An agent starts every session with no memory of the last one, so I keep the thinking in writing. Each piece of work moves through four stages, and every stage leaves behind a markdown document the next stage — and the next engineer — can pick up. Nothing important lives only in a chat window.

| Stage | What I do | What gets written down |
| --- | --- | --- |
| **1 · Research** | Dig into the problem, prior art, and constraints *with* the agent before any code is written. | **PRR** — a *Product Requirements & Research* brief: the problem, what I found, and what "done" actually means. |
| **2 · Design** | Turn the PRR into an approach and weigh the trade-offs out loud. | A design doc + **ADRs** (Architecture Decision Records) that capture *why*, not just *what*. |
| **3 · Architect** | Define the structure, data model, and interfaces before implementation starts. | Repo **context files** (`CLAUDE.md` / `AGENTS.md`), diagrams, and a task breakdown the agent can execute. |
| **4 · Execute** | Agents implement against that context; I review, correct, and iterate in tight loops. | Small, reviewable PRs plus updated docs and runbooks. |

**The throughline is context.** The agent only knows what's on the page — so architecture, conventions, and decisions live in markdown the repo carries with it (`CLAUDE.md` / `AGENTS.md`, ADRs, PRRs, runbooks) instead of being re-explained every session. Writing it down once makes both the agent *and* the next engineer faster. I treat the docs as the real source of truth and the code as its output.

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  BUSINESS & ENTERPRISE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🏢 Business & Enterprise Experience

**🟦 American Express** — *Dec 2015 – Present · 10+ years · Florida*

`▸` **Senior Engineer I — Identity & Authentication Modernization** *(Aug 2023 – Present)*
Technical lead & solution architect on a multi-year program to modernize the `americanexpress.com` SSO platform — originally built in **1996** as a monolithic Oracle stored-procedure system with identity data fragmented across MongoDB, Couchbase, and other stores. Re-architected around an **event-driven** design — PostgreSQL System of Record + Cassandra read-side cache with near real-time replication via **Debezium + Kafka Connect**. Led the Identity data-layer team of **10 engineers** plus a second Authentication team — delivering **Passkeys, Selfie, and Tap Card to Login** for passwordless, phishing-resistant auth.

`▸` **Senior Engineer II — Customer Demographic Search Engine** *(Jun 2022 – Aug 2023)*
Engineering lead for a platform central to **new-customer acquisition** — a Spring + Elasticsearch engine powering demographic matching and risk scoring at the moment of application, tuned for sub-second response under acquisition-flow traffic.

`▸` **Engineer — Customer 360 Products** *(Dec 2015 – Jun 2022)*
Java/Spring services and data integrations powering unified customer views across the enterprise; progressed through the engineering ladder with growing scope across design, integration, and production support of business-critical APIs.

`▸` **Earlier** — Informatica ETL development (Insight Global @ Amex) and **Project Manager / Team Leader** BI roles delivering data-warehouse & reporting solutions (Informatica PowerCenter / PowerExchange, IBM Cognos) for **EVERTEC** and **Claro** via Softtek.

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  TECH STACK  ░░░░░░░░░░░░░░░░░░░░ -->
## 🛠️ Tools I Work With

**Languages & Frameworks**

[![Skills](https://skillicons.dev/icons?i=java,spring,python,js,bash,maven&theme=dark)](https://skillicons.dev)

**Data · Messaging · Integration**

[![Skills](https://skillicons.dev/icons?i=postgres,cassandra,mongodb,elasticsearch,kafka,redis&theme=dark)](https://skillicons.dev)

**Identity & Security**

<img src="https://img.shields.io/badge/Passkeys_·_Passwordless-0F9D58?style=for-the-badge&logo=fidoalliance&logoColor=white"/>
<img src="https://img.shields.io/badge/OAuth_·_SSO-EB5424?style=for-the-badge&logo=auth0&logoColor=white"/>
<img src="https://img.shields.io/badge/IAM-DD0031?style=for-the-badge&logo=keycloak&logoColor=white"/>

**DevOps & Tooling**

[![Skills](https://skillicons.dev/icons?i=kubernetes,docker,git,githubactions,linux,grafana&theme=dark)](https://skillicons.dev)

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:24D1F2,100:302B63&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  CONTRIBUTION SNAKE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🐍 Contribution Snake

<!-- ░░░ ANIMATED CONTRIBUTION SNAKE (generated by GitHub Action) ░░░ -->
<img width="100%" alt="Contribution Snake" src="https://raw.githubusercontent.com/jmartinez5120/jmartinez5120/output/github-contribution-grid-snake.svg" />

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  GOALS & BEYOND CODE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🎯 Mission Log

```diff
+ 2026  Continue the AI journey — automate workloads with agents (Hermes)   [ IN_PROGRESS ]
+ 2026  Fine-tune my own AI models for task-specific work                   [ IN_PROGRESS ]
+ 2025  Build production AI agents & automate apps with agentic workflows   [ DONE ]
@ 2024  Machine Learning · Deep Learning · Neural Networks                  [ CONCEPTS_DONE ]
+ 2023  Modernize high-performing apps to reactive programming              [ DONE ]
+ 2022  Grow in React & JS + practice Machine Learning                      [ DONE ]
+ 2021  Learn React                                                         [ DONE ]
```

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  POP CULTURE & EASTER EGGS  ░░░░░░░░░░░░░░░░░░░░ -->
## 🍿 Pop Culture & Easter Eggs

I think systems are allowed to have a personality. I name services, environments, and migrations after the movies, music, and games I grew up on — my homelab agent is **Hermes**, the messenger — and I'll tuck the occasional easter egg into an app: a hidden Konami code, a themed loading message, a codename only the team is in on.

It isn't just for laughs. A name people *remember* sticks in design reviews, gives the team a shared vocabulary, and makes a two-year migration feel less like a slog. Good architecture should be fun to build, not just correct — and a little pop-culture nod keeps everyone reading the code instead of skimming it.

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:24D1F2,100:302B63&section=header" width="100%" />

⚡ **Off the keyboard:** Husband & Father 👨‍👩‍👧‍👦 · Drums 🥁 · Landscape Photography 📷 · Golf ⛳ & Tennis 🎾 · Woodworking 🪵 · Active in the markets 📈 (NYSE)

<!-- ░░░░░░░░░░░░░░░░░░░░  FOOTER WAVE  ░░░░░░░░░░░░░░░░░░░░ -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=0:24D1F2,50:302B63,100:0F0C29&text=Owning%20the%20full%20lifecycle%20%E2%80%94%20design%20to%20production&fontColor=ffffff&fontSize=16&fontAlignY=72" alt="footer" />
