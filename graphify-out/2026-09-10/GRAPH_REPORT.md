# Graph Report - shubham-portfolio  (2026-09-10)

## Corpus Check
- 37 files · ~71,966 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 215 nodes · 230 edges · 27 communities (13 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8f8f6e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- Sanity CMS Configuration
- TypeScript Compiler Options
- UI Components and Layout
- Development and Styling Tools
- Backend API Logic
- Skills Page Components
- include
- projects/page.tsx
- package.json
- contact/page.tsx
- route.ts
- app/page.tsx
- resume/page.tsx
- ST-GPT Project
- Agent Rules
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Hero Profile Photo
- Profile Photo
- Robots Configuration
- chat/route.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `chat_endpoint()` - 7 edges
3. `include` - 7 edges
4. `SkillsClient()` - 5 edges
5. `scripts` - 5 edges
6. `POST()` - 4 edges
7. `ProjectsClient()` - 4 edges
8. `generate_chat_stream()` - 4 edges
9. `InteractiveBackground()` - 4 edges
10. `dataset` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Backend Dependencies` --shares_data_with--> `ST-GPT Project`  [INFERRED]
  backend/requirements.txt → public/resume-image.png
- `Project Overview` --conceptually_related_to--> `Agent Rules`  [INFERRED]
  README.md → AGENTS.md
- `Claude Instructions` --references--> `Agent Rules`  [EXTRACTED]
  CLAUDE.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Developer Identity and Portfolio** — public_hero_profile, public_profile, public_resume_image [EXTRACTED 1.00]
- **AI Backend Infrastructure** — backend_requirements, concept_st_gpt, concept_pandoai [INFERRED 0.85]

## Communities (27 total, 10 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.05
Nodes (39): ai, @ai-sdk/google, @ai-sdk/react, framer-motion, @google/generative-ai, lucide-react, material-icons, next (+31 more)

### Community 1 - "Sanity CMS Configuration"
Cohesion: 0.15
Nodes (8): apiVersion, dataset, projectId, client, builder, { sanityFetch, SanityLive }, schema, structure()

### Community 2 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 3 - "UI Components and Layout"
Cohesion: 0.14
Nodes (9): metadata, AskMeWidget(), IMAGE_MAP, PRESET_QUESTIONS, InteractiveBackground(), animate(), handleParticles(), Navbar() (+1 more)

### Community 4 - "Development and Styling Tools"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 5 - "Backend API Logic"
Cohesion: 0.22
Nodes (14): chat_endpoint(), ChatRequest, fetch_github_activity(), generate_chat_stream(), get_embedding(), get_real_ip(), ping_database(), root() (+6 more)

### Community 6 - "Skills Page Components"
Cohesion: 0.29
Nodes (7): revalidate, containerVariants, getColorTheme(), getIconComponent(), getLearningStyling(), itemVariants, SkillsClient()

### Community 7 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "projects/page.tsx"
Cohesion: 0.31
Nodes (6): revalidate, cardVariants, containerVariants, getColorThemeStyling(), getIconComponent(), ProjectsClient()

### Community 9 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 14 - "ST-GPT Project"
Cohesion: 0.50
Nodes (4): Backend Dependencies, PandoAI Solutions, ST-GPT Project, Resume of Shubham Gajanan Tade

### Community 15 - "Agent Rules"
Cohesion: 0.67
Nodes (3): Agent Rules, Claude Instructions, Project Overview

### Community 26 - "chat/route.ts"
Cohesion: 0.39
Nodes (7): fetchGithubActivity(), getEmbedding(), getValidGeminiKeys(), githubCache, maxDuration, POST(), qdrant

## Knowledge Gaps
- **91 isolated node(s):** `maxDuration`, `qdrant`, `githubCache`, `qdrant`, `genAI` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 121 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Development and Styling Tools` to `package.json`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript Compiler Options` to `include`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `maxDuration`, `qdrant`, `githubCache` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Sanity CMS Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Options` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._