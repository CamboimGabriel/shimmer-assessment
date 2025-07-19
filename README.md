# Unified Workflow Editor - Weekend Trial Task

## Quick Start

```bash
npm install
npm run dev
```

## Your Task

Build a workflow editor that can:
1. Import workflows from your chosen platform (n8n, Make, Zapier, etc.)
2. Display them as an interactive graph with:
   - 3-5 custom node type renderers (e.g., trigger, HTTP, database)
   - Generic fallback renderer for all other types
3. Allow dragging nodes to new positions
4. Export the modified workflow back to original format

**Balance**: Implement a few specific node types to show design skills, but use generic rendering for the rest to keep scope manageable.

**Full requirements: See `WEEKEND_TRIAL_TASK_SPEC.md`**

## What's Provided

- Basic project setup (Vite, React, TypeScript, Tailwind)
- Canonical schema definitions (`src/schema/`)
- Adapter registration system (`src/adapters/registry.ts`)
- Minimal UI scaffold (`src/ui/ImportPanel.tsx`)
- Sample workflow (`src/samples/`)

## Submission

1. Fork this repository
2. Complete your implementation
3. Share your fork's URL (do NOT submit a PR)

Good luck!