# Chagga

Chagga is an Africa-first peer-to-peer delivery marketplace for routes within Africa and between Africa and Europe. Senders post small delivery requests; travelers share spare luggage capacity; either side can propose a match and coordinate a safe handover.

## What works in this MVP

- Supabase email authentication and persistent sessions
- Email confirmation and password recovery
- Public profiles separated from private contact details
- Row-level database security for profile ownership
- Role switching from the same account
- Route, date, item-type, and luggage-size filters
- Shared Supabase trip and delivery-request posting
- Shared match proposals with atomic accept and decline actions
- Active-delivery status tracking
- Recipient information and delivery confirmation
- Transaction-based chat with image attachments
- Browser persistence for the unfinished chat and transaction prototype
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
4. Run `supabase/migrations/202609130001_marketplace_core.sql` to create shared trips, requests, match proposals, and their row-level security policies.
5. Copy `.env.example` to `.env.local`.
6. Add your project URL and publishable key:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

7. In Supabase Authentication URL settings, set the Site URL to your deployed address and add `http://localhost:5173` as a local redirect URL.
8. Enable the Email provider and **Confirm email** in Authentication settings.
9. Restart the Vite server after changing `.env.local`.

Supabase's default SMTP only sends test emails to pre-authorized project-team addresses. Configure custom SMTP before testing confirmation emails with other addresses.

After signup, verify the user appears first under **Authentication → Users**, then confirm that `profiles` and `profile_contacts` contain rows with the same UUID.

The publishable key is intended for browser use. Never put a Supabase service-role key or another server secret in a `VITE_` environment variable.

## Build

```bash
npm run build
```

The static production output is written to `build/`.

## Important production boundary

Authentication, profiles, trips, delivery requests, and match proposals use Supabase. Transactions, messages, recipients, and uploads still use browser storage, so the post-match delivery workflow is only suitable for prototype testing and is not yet shared between devices.

Before a public launch, migrate the remaining post-match records to PostgreSQL and add identity verification, payments/escrow, moderation, prohibited-item controls, audit logs, notifications, and country-specific customs and insurance rules.
