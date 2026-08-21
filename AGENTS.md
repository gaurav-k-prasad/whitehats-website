<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Engineering Standards & Architecture

## Next.js Project Structure
- NEVER dump entire pages into a single file.
- Modularize UI elements into reusable components inside `src/components/` (or `components/`).
- Break components into distinct subdirectories:
  - `components/layout/` (Navbar, Footer, ActionBars)
  - `components/home/` (HeroSection, TerminalWindow, FeatureGrid, FeatureCard, StatsSection)
  - `components/ui/` (Buttons, Badges, Typography primitives)
- Keep `app/page.tsx` clean, acting only as an assembler of layout/section components.

## Code Quality Rules
- Extract static data arrays (e.g., stats, navigation links, feature items) into a separate `src/data/` or `lib/constants.ts` file instead of inlining them in JSX.
- Enforce TypeScript typing for all props and data models.
- Strictly adhere to the electric blue design system tokens configured in Tailwind.

<!-- END:nextjs-agent-rules -->
