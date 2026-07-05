# Agent Handoff: Study Mesh

## Project Summary

Study Mesh is a static website prototype for a Singapore-focused peer-to-peer tutoring platform. The site is built with plain HTML, CSS, and JavaScript. There is no package manager, build tool, backend, or framework.

## Current Repo

GitHub repo provided by user:

```text
https://github.com/chongkwangyee/IENT-prototype
```

Local workspace:

```text
C:\Users\Admin\OneDrive\Desktop\IENT prototype
```

## Files

- `index.html` - Find Tutors page.
- `booking.html` - Booking form page.
- `sessions.html` - Session tracker page.
- `notes.html` - Notes marketplace page.
- `signup.html` - Signup page.
- `login.html` - Demo login page.
- `profile.html` - Profile page.
- `styles.css` - Global styling.
- `script.js` - Shared interactions and localStorage behavior.
- `README.md` - Prototype documentation.
- `HOW TO REDEPLOY NEW UPDATE.md` - Redeploy instructions.

## Design Direction

Keep the site aligned with the current Study Mesh visual style:

- Clean education SaaS/dashboard feel
- White cards, blue/green accents, restrained use of orange and purple
- 8px or smaller border radius
- Responsive card grids
- Clear practical UI over marketing-heavy layout
- Singapore education system language

Avoid changing the project into a landing page. The first screen should remain the usable tutor discovery experience.

## Singapore Education System Requirements

Use these education levels:

- Primary school
- Secondary school
- Polytechnic
- Junior college
- University

Use Singapore-relevant academic labels:

- PSLE
- O-Level
- A-Level
- H2 Math
- General Paper
- E-Math
- Chinese oral
- Polytechnic modules

Avoid US-style labels like:

- Grade 11
- Middle school
- High school
- College prep
- SAT
- AP

## JavaScript Behavior

`script.js` currently handles:

- Tutor filtering by subject and education level
- Booking form storage in `localStorage` under `studyMeshSessions`
- Session tracker rendering from `studyMeshSessions`
- Signup profile storage in `localStorage` under `studyMeshProfile`
- Profile page rendering from `studyMeshProfile`
- Demo login redirect to `profile.html`

Before finishing changes, run:

```powershell
node --check .\script.js
```

## Important Prototype Limitation

Signup, profile, and bookings use browser `localStorage`. This is intentional for the prototype. Data is not shared across devices or users.

If asked to make it production-ready, recommend adding:

- Supabase or Firebase Auth
- Database tables for users, tutors, bookings, notes
- Payment provider for notes and tutoring
- Server-side validation

## Deployment Notes

This is a static Vercel project:

- Framework Preset: `Other`
- Build Command: empty
- Output Directory: `.`
- Install Command: empty

The site must keep `index.html` in the repo root.

## Editing Guidance

- Use `apply_patch` for manual file edits.
- Keep changes scoped.
- Preserve existing user work.
- Do not remove `booking.html` even though Booking is not in the main nav; tutor cards and action buttons still link to it.
- Update navigation consistently across HTML pages when adding/removing nav items.
- If adding new subjects or levels, update `index.html`, `booking.html`, and relevant notes/profile text together.
