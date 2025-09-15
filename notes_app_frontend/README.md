# Ocean Notes – React Frontend

A modern, minimalist notes application built with React. Users can create, view, edit, and delete notes with an Ocean Professional theme.

## Features
- Create, view, edit, and delete notes
- Fast local persistence using localStorage
- Search notes by title or content
- Ocean Professional theme: modern, clean UI with subtle shadows and gradients
- Responsive layout: sidebar list + editor

## Architecture
- src/App.js – All UI components scoped in a single file for easy handoff:
  - Header (brand, search, actions)
  - NotesList (sidebar)
  - NoteEditor (main editor)
- src/App.css – Theme tokens and modern layout styles
- src/index.js – App entry

## Styling – Ocean Professional
- Primary: `#2563EB`
- Secondary: `#F59E0B`
- Error: `#EF4444`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`
- Gradient: subtle blue to gray tint

## Commands
- `npm start` – development server (http://localhost:3000)
- `npm run build` – production build
- `npm test` – tests

## Notes
- Data is stored in `localStorage` under key `notes_app_notes_v1`.
- All changes in the editor are auto-saved.

## Accessibility
- Buttons and inputs have descriptive labels and focus rings.
- Keyboard and screen reader friendly.

## Future Enhancements
- Tagging, pinning, and sorting options
- Sync with a backend REST API
- Rich text editing
