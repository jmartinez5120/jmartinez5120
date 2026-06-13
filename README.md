<!-- ░░░░░░░░░░░░░░░░░░░░  ANIMATED NEON HEADER  ░░░░░░░░░░░░░░░░░░░░ -->
<a href="https://www.linkedin.com/in/john-martinez-10aba346">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:0F0C29,50:302B63,100:24D1F2&text=John%20Martinez-Ponce&fontColor=ffffff&fontSize=46&fontAlignY=38&desc=Engineering%20Architect%20%E2%80%A2%20Distributed%20Systems%20%E2%80%A2%20AI-Native%20Builder&descAlignY=58&descSize=18&animation=fadeIn" alt="John Martinez-Ponce" />
</a>

<!-- ░░░░░░░░░░░░░░░░░░░░  ANIMATED TYPING SUBTITLE  ░░░░░░░░░░░░░░░░░░░░ -->
<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=800&color=24D1F2&center=true&vCenter=true&width=720&lines=Engineering+Architect+%C2%B7+Senior+Software+Engineer;15%2B+years+building+mission-critical+systems;10%2B+years+%40+American+Express;Distributed+Systems+%C2%B7+CQRS+%C2%B7+10K+TPS;Building+software+%E2%9C%A6+with+%E2%9C%A6+AI+every+day)](https://github.com/jmartinez5120)

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
  company: "American Express (10+ years)",
  experience: "15+ years shipping enterprise-grade systems",
  scale: "Production platforms @ 10K TPS",
  architecture: ["CQRS", "Event-Driven", "CDC", "Distributed Systems"],
  leads: "High-performance teams of 10+ engineers",
  buildsWith: "AI-native workflows — agents, custom skills, local fine-tuning",
  education: "B.S. Computer Science — Polytechnic University of Puerto Rico",
};
```

> Software engineering leader who designs distributed systems, leads high-performance teams, and ships mission-critical platforms — and who builds software **_with_** AI as much as by hand.

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  AI-ASSISTED DEVELOPMENT  ░░░░░░░░░░░░░░░░░░░░ -->
## 🤖 AI-Assisted Development

> I don't just *use* AI — I engineer around it: agentic workflows, custom subagents, repo-aware context, agent tracing, and locally fine-tuned models on my own hardware.

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

<!-- ░░░░░░░░░░░░░░░░░░░░  BUSINESS & ENTERPRISE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🏢 Business & Enterprise Experience

**🟦 American Express** — *Dec 2015 – Present · 10+ years · Florida*

`▸` **Senior Engineer I — Identity & Authentication Modernization** *(Aug 2023 – Present)*
Technical lead & solution architect on a multi-year program to modernize the `americanexpress.com` SSO platform — originally built in **1996** as a monolithic Oracle stored-procedure system with identity data fragmented across MongoDB, Couchbase, and other stores. Re-architected around a **CQRS** pattern (PostgreSQL System of Record + Cassandra read-side cache, near real-time replication via **Debezium + Kafka Connect**) sized for **10K TPS**. Led the Identity data-layer team of **10 engineers** plus a second Authentication team — delivering **Passkeys, Selfie, and Tap Card to Login** for passwordless, phishing-resistant auth.

`▸` **Senior Engineer II — Customer Demographic Search Engine** *(Jun 2022 – Aug 2023)*
Engineering lead for a platform central to **new-customer acquisition** — a Spring + Elasticsearch engine powering demographic matching and risk scoring at the moment of application, tuned for sub-second response under acquisition-flow traffic.

`▸` **Engineer — Customer 360 Products** *(Dec 2015 – Jun 2022)*
Java/Spring services and data integrations powering unified customer views across the enterprise; progressed through the engineering ladder with growing scope across design, integration, and production support of business-critical APIs.

`▸` **Earlier** — Informatica ETL development (Insight Global @ Amex) and **Project Manager / Team Leader** BI roles delivering data-warehouse & reporting solutions (Informatica PowerCenter / PowerExchange, IBM Cognos) for **EVERTEC** and **Claro** via Softtek.

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  TECH STACK  ░░░░░░░░░░░░░░░░░░░░ -->
## 🛠️ Tech Arsenal

**Languages & Frameworks**

[![Skills](https://skillicons.dev/icons?i=java,spring,python,js,bash,maven&theme=dark)](https://skillicons.dev)

**Data · Messaging · Integration**

[![Skills](https://skillicons.dev/icons?i=postgres,cassandra,mongodb,elasticsearch,kafka,redis&theme=dark)](https://skillicons.dev)

**Architecture & Security**

<img src="https://img.shields.io/badge/CQRS-512BD4?style=for-the-badge&logo=buffer&logoColor=white"/>
<img src="https://img.shields.io/badge/Event_Driven-FF6600?style=for-the-badge&logo=lightning&logoColor=white"/>
<img src="https://img.shields.io/badge/Change_Data_Capture-FF3E00?style=for-the-badge&logo=redhat&logoColor=white"/>
<img src="https://img.shields.io/badge/Passkeys_·_Passwordless-0F9D58?style=for-the-badge&logo=fidoalliance&logoColor=white"/>
<img src="https://img.shields.io/badge/OAuth_·_SSO-EB5424?style=for-the-badge&logo=auth0&logoColor=white"/>

**DevOps & Tooling**

[![Skills](https://skillicons.dev/icons?i=kubernetes,docker,git,githubactions,linux,grafana&theme=dark)](https://skillicons.dev)

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:24D1F2,100:302B63&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  CONTRIBUTION SNAKE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🐍 Contribution Snake

<!-- ░░░ ANIMATED CONTRIBUTION SNAKE (generated by GitHub Action) ░░░ -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jmartinez5120/jmartinez5120/output/github-contribution-grid-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jmartinez5120/jmartinez5120/output/github-contribution-grid-snake.svg" />
  <img width="100%" alt="Contribution Snake" src="https://raw.githubusercontent.com/jmartinez5120/jmartinez5120/output/github-contribution-grid-snake.svg" />
</picture>

<img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:302B63,100:24D1F2&section=header" width="100%" />

<!-- ░░░░░░░░░░░░░░░░░░░░  GOALS & BEYOND CODE  ░░░░░░░░░░░░░░░░░░░░ -->
## 🎯 Mission Log

```diff
+ 2025  Build production AI agents & automate apps with agentic workflows   [ IN_PROGRESS ]
@ 2024  Machine Learning · Deep Learning · Neural Networks                  [ CONCEPTS_DONE ]
+ 2023  Modernize high-performing apps to reactive programming              [ DONE ]
+ 2022  Grow in React & JS + practice Machine Learning                      [ DONE ]
+ 2021  Learn React                                                         [ DONE ]
```

⚡ **Off the keyboard:** Husband & Father 👨‍👩‍👧‍👦 · Drums 🥁 · Landscape Photography 📷 · Golf ⛳ & Tennis 🎾 · Woodworking 🪵 · Active in the markets 📈 (NYSE)

<!-- ░░░░░░░░░░░░░░░░░░░░  FOOTER WAVE  ░░░░░░░░░░░░░░░░░░░░ -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=0:24D1F2,50:302B63,100:0F0C29&text=Owning%20the%20full%20lifecycle%20%E2%80%94%20design%20to%20production&fontColor=ffffff&fontSize=16&fontAlignY=72" alt="footer" />
