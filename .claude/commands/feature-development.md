---
name: feature-development
description: Workflow command scaffold for feature-development in WYX-Golf-Supply-Co.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development

Use this workflow when working on **feature-development** in `WYX-Golf-Supply-Co`.

## Goal

Standard feature implementation workflow

## Common Files

- `app/golf-club-care-kit/*`
- `app/golf-club-care/*`
- `app/golf-gifts-for-beginners/*`
- `**/*.test.*`
- `**/api/**`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add feature implementation
- Add tests for feature
- Update documentation

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.