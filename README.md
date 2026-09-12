# MyTrip

MyTrip is a peer-to-peer delivery marketplace for routes within Africa and between Africa and Europe. Senders post small delivery requests; travelers post spare luggage capacity; either side can propose a match, coordinate in chat, and track the handover.

## What works in this MVP

- Supabase email authentication and persistent sessions
- Email confirmation and password recovery
- Public profiles separated from private contact details
- Row-level database security for profile ownership
- Role switching from the same account
- Seeded traveler and delivery listings for first-time users
- Route, date, item-type, and luggage-size filters
- Trip and delivery-request posting
- Match requests with accept and decline actions
- Active-delivery status tracking
- Recipient information and delivery confirmation
- Transaction-based chat with image attachments
- Browser persistence for marketplace prototype data
- Production build with Vite

## Run locally

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal.

## Configure authentication

1. Create a Supabase project.
2. Run `supabase/migrations/202609060001_auth_profiles.sql` in the Supabase SQL Editor. If those tables already exist, do not run it again.
3. Run `supabase/migrations/202609120001_repair_auth_profile_sync.sql` to recreate the Auth trigger and backfill existing users.
4. Copy `.env.example` to `.env.local`.
5. Add your project URL and publishable key:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

6. In Supabase Authentication URL settings, set the Site URL to your deployed address and add `http://localhost:5173` as a local redirect URL.
7. Enable the Email provider and **Confirm email** in Authentication settings.
8. Restart the Vite server after changing `.env.local`.

Supabase's default SMTP only sends test emails to pre-authorized project-team addresses. Configure custom SMTP before testing confirmation emails with other addresses.

After signup, verify the user appears first under **Authentication → Users**, then confirm that `profiles` and `profile_contacts` contain rows with the same UUID.

The publishable key is intended for browser use. Never put a Supabase service-role key or another server secret in a `VITE_` environment variable.

## Build

```bash
npm run build
```

The static production output is written to `build/`.

## Important production boundary

Authentication and profiles now use Supabase. Trips, requests, matches, transactions, messages, and uploads still use browser storage, so they are only suitable for prototype testing and are not shared between devices.

Before a public launch, migrate the remaining marketplace records to PostgreSQL and add identity verification, payments/escrow, moderation, prohibited-item controls, audit logs, notifications, and country-specific customs and insurance rules.
