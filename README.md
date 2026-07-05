# Study Mesh Website Prototype

Study Mesh is a static HTML/CSS/JavaScript prototype for a peer-to-peer tutoring marketplace designed around the Singapore education system. It helps students find peer tutors, compare session pricing, book tutoring slots, track upcoming sessions, buy low-cost notes, and create a simple student profile.

## Prototype Scope

This is a front-end prototype only. It does not use a backend, database, or real authentication service. Demo data is stored in the browser with `localStorage`, so signup details and booked sessions are saved only on the same browser and device.

## Target Users

- Primary school students preparing for PSLE
- Secondary school students preparing for O-Level subjects
- Junior College students preparing for A-Level and General Paper
- Polytechnic students needing module and project support
- University students looking for foundation or project guidance
- Peer tutors who want to offer affordable subject help

## Pages

- `index.html` - Main Find Tutors page with tutor cards, subject filters, education level filters, and pricing.
- `booking.html` - Booking form for selecting tutor, subject, date, place, and session time.
- `sessions.html` - Session tracker showing tutor, schedule, place, and subject.
- `notes.html` - Paid notes marketplace with $3 note packs for PSLE, O-Level, JC, Polytechnic, and University content.
- `signup.html` - Signup form that stores a demo student profile.
- `login.html` - Demo login page.
- `profile.html` - Student profile page that reads signup data from browser storage.
- `styles.css` - Shared visual design and responsive layout.
- `script.js` - Filtering, booking storage, signup storage, profile rendering, and demo login behavior.

## Main Features

- Tutor discovery by subject and Singapore education level
- Tutor cards with ratings, short descriptions, and per-session pricing
- Booking form with tutor, subject, date, time, and place
- Session tracking page that displays saved bookings
- Notes marketplace with $3 subject/level note packs
- Signup flow that populates the profile page
- LinkedIn profile support on the profile page
- Responsive layout for desktop and mobile

## Singapore Education System Coverage

Study Mesh currently includes:

- Primary school: PSLE Math, Science, English, and Chinese support
- Secondary school: O-Level English, Math, Science, and exam preparation
- Junior College: H2 Math and General Paper support
- Polytechnic: Programming, engineering math, statistics, and project support
- University: Coding, academic writing, foundation statistics, and project review

## Local Usage

Open `index.html` directly in a browser. No build step is required.

Recommended flow:

1. Open `index.html`.
2. Browse tutors and compare pricing.
3. Click a tutor's `Book` button.
4. Confirm a booking.
5. Open `sessions.html` to view tracked bookings.
6. Open `signup.html` to create a demo profile.
7. Open `profile.html` to see the signup data applied.

## Hosting

The project can be hosted on Vercel as a static site. Use:

- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: `.`
- Install Command: leave empty

## Limitations

- No real account authentication
- No real payment system
- No shared database
- Bookings and profile data are browser-local only
- Notes purchase buttons are visual prototype buttons

## Suggested Future Improvements

- Add Supabase or Firebase for real user accounts and shared booking data
- Add tutor account creation and tutor availability management
- Add payment integration for notes and booking fees
- Add admin moderation for tutors and uploaded notes
- Add notifications for upcoming sessions
- Add real search and sorting by price, rating, and availability
