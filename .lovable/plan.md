# Misaq — Premium Islamic Matrimonial App (UI/UX Only)

A mobile-first, design-only prototype rendered inside a phone-frame preview on desktop. No backend, no auth logic, no DB — all data is static/mock so every screen is fully browsable.

## Brand & Design System

- **Logo**: uploaded Misaq mark (maroon circle, white "M" of two figures joining) used on splash, nav, auth, empty states, favicon.
- **Palette** (extracted from logo):
  - Primary: Deep Maroon `#6B121F`
  - Primary Glow: `#8A1A2B`
  - Secondary: Cream `#F6EFE4`
  - Accent: Soft Gold `#C9A24C`
  - Ink: `#1A1013`
- **Light theme**: cream background, maroon primary, gold accents.
- **Dark theme**: near-black + deep maroon surfaces, cream text, gold highlights.
- **Typography**: serif display (Cormorant / Instrument Serif) for headings + humanist sans (Plus Jakarta Sans) for body — elegant, trustworthy, non-dating.
- **Tokens in `src/styles.css`**: gradients (`--gradient-primary`, `--gradient-gold`), shadows (`--shadow-elegant`, `--shadow-luxury`), radii, spacing. All colors as oklch semantic tokens. No hardcoded hex in components.
- **Reusable components**: Button variants (primary, gold, ghost, outline), PremiumCard, ProfileCard, StatCard, FilterChip, BottomSheet, Dialog, EmptyState, Skeleton, VerificationBadge, CompatibilityRing, StepIndicator, IslamicOrnament divider.

## Layout Approach

Since Misaq is a **mobile app**, the desktop preview renders each route inside a centered iPhone-style frame (rounded, notch, status bar). A side rail on desktop lists all screens so the user can jump between them. On mobile viewport the frame drops away and the screens go full-bleed.

## Routes (TanStack Start file-based)

Each is a fully designed static screen with mock data.

**Onboarding & Auth**

- `/` — Splash (logo animation → auto-advances visually)
- `/onboarding/theme` — Light / Dark chooser
- `/onboarding/language` — English / Urdu / Roman Urdu
- `/welcome` — Value props carousel
- `/auth/login` — Login + tiny "Administrator Login" text link
- `/auth/register` — Account type: Member / Wali
- `/auth/register/steps` — Multi-step wizard (Personal → Education → Religious → Dowry → Family → Wali Info) with progress bar, all predefined chips/selects

**Member App (bottom nav: Home, Discover, Matches, Chats, Profile)**

- `/app` — Home: greeting, prayer time strip, featured matches, proposals summary
- `/app/discover` — Swipe-free premium card stack + filters bottom sheet
- `/app/matches` — Received / Sent / Accepted tabs
- `/app/chats` — Conversation list
- `/app/chats/[id]` — Chat thread (text, voice note bubble, image, reply, emoji bar)
- `/app/call/voice` — Voice call screen
- `/app/call/video` — Video call screen
- `/app/profile/[id]` — Full profile: gallery, about, education, lifestyle, religious, dowry, family, wali, compatibility ring, verification badges, Send Proposal CTA
- `/app/profile/me` — My profile with edit entry points
- `/app/premium` — Silver / Gold / Platinum comparison
- `/app/notifications`
- `/app/settings` — Account, Privacy, Security, Notifications, Language, Theme, Premium, Help, About, Terms, Privacy, Logout

**Wali Dashboard**

- `/wali` — Linked member overview
- `/wali/proposals`
- `/wali/chats` — Monitoring list with Block / Delete / Report
- `/wali/chats/[id]` — Read-only chat view
- `/wali/profile/[id]` — Chatting person's profile
- `/wali/settings`

**Admin**

- `/admin/login` — dedicated
- `/admin` — Dashboard (KPIs, charts)
- `/admin/members`, `/admin/walis`, `/admin/verification`, `/admin/reports`, `/admin/chats`, `/admin/calls`, `/admin/payments`, `/admin/premium`, `/admin/analytics`, `/admin/admins`, `/admin/cms`, `/admin/settings`

## What I will NOT build

- No Lovable Cloud, no Supabase, no APIs, no server functions beyond static routes.
- No real auth — login buttons just navigate. No form validation logic beyond visual states.
- No real chat/call — visual only.
- No payment integration — pricing cards only.

## Delivery order

1. Design tokens + fonts + phone-frame shell + logo asset pipeline.
2. Splash → theme → language → welcome → auth → registration wizard.
3. Member bottom-nav shell + Home, Discover, Matches, Chats (list + thread), Profile, Premium, Settings, Calls, Notifications.
4. Wali dashboard (overview, proposals, chat monitoring, profile view, settings).
5. Admin login + full admin dashboard set.
6. Polish pass: empty/loading/error states, dark mode parity, micro-animations, favicon + head metadata per route.

## Technical notes

- All screens are React route files under `src/routes/`. Mock data lives in `src/lib/mock/*.ts`.
- Theme toggle uses a `ThemeProvider` writing `class="dark"` on `<html>` via `useEffect` (SSR-safe).
- Language toggle is visual only — swaps a static dictionary; no i18n library.
- Logo shipped via `lovable-assets` pointer, not committed as a binary.
- Favicon replaced with Misaq mark; `__root.tsx` head updated with real title/description/OG.

This is a large build (~30+ screens). I'll ship it in the order above so you can see progress after each phase.
