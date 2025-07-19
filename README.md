# Unified Workflow Editor - Weekend Trial Task

## Quick Start

```bash
npm install
npm run dev
```

## Your Task

Build a workflow editor that can:
1. Import workflows from your chosen platform (n8n, Make, Zapier, etc.)
2. Display them as an interactive graph using generic nodes
3. Allow dragging nodes to new positions
4. Export the modified workflow back to original format

**Important**: Use generic node rendering - all nodes can look the same, just show different labels/properties. Don't implement specific node types.

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