# 4. UI/UX Guide
[日本語版](./jp/04_uiux_guide.md)

## Design rules
- Clean, high-contrast layout for readability of long-form content.
- Large, clear headings with serif styling on key sections.
- Cards and badges used to segment summaries, participants, and keywords.

## Typography
- Fonts are loaded via Next.js: Inter and Manrope.
- Default body text uses `font-sans` (Inter).
- Headings often use `font-serif` (Manrope is configured but actual serif font is the Tailwind default unless overridden).

## Color palette (from `frontend/app/globals.css`)
- Primary: cyan (`--primary`, oklch(0.5 0.15 200))
- Accent: pink (`--accent`, oklch(0.65 0.2 330))
- Background: white (`--background`)
- Foreground: gray (`--foreground`)
- Muted/secondary: light gray (`--muted`, `--secondary`)
- Destructive: red (`--destructive`)

## Component specifications
- Buttons: `Button` component with variants `default`, `outline`, `ghost`.
- Inputs: `Input` with large height for search and focus ring matching `--ring`.
- Selects: `Select` with list for category/house/meeting filters.
- Date picker: `Calendar` inside `Popover` for date range selection.
- Cards: `Card` used for summary, participants, keywords, terms, and dialogs.
- Badges: `Badge` used for categories and keywords.
- Dialog viewer: filterable transcript list in article detail view.

## Responsive rules
- Home layout uses Tailwind breakpoints (`sm`, `md`, `lg`) for grid layouts.
- Article detail is centered with `max-w-4xl` and padding for mobile.
- Filter panel collapses and expands with height transitions.
