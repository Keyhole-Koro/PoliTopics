# 3. Screen Flow
[日本語版](./jp/03_screen_flow.md)

## Screen list
- Home: `/`
- Article detail: `/article/:id`
- Not found: any other path

## Transitions
- Home -> Article detail: click an article card.
- Article detail -> Home: back button in header or browser back.
- Unknown route -> Not found: shows a link back to home.

## URL map
- `/` home and search.
- `/article/<issueId>` article detail page.
- `/*` not found page.
