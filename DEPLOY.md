# Deploying "Who Got Scooby?"

This gets the site off your PC and onto a real URL your 10 friends can reach
from their own phones — free, and without the database resetting itself.

## Why Turso + Render (not just Render alone)

Render's free web service has no persistent disk — every redeploy (and
possibly every restart after 15 minutes idle) would wipe the database,
including guest signups and any photos you've uploaded. Turso is a free
hosted database (SQLite-compatible) that lives independently of the web
host, so it survives redeploys/restarts regardless of which free compute
host you use.

---

## 1. Create the Turso database

Install the CLI (Git Bash, since this is a bash script):

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

If that doesn't work on Windows, sign up and create the database from the
[Turso web dashboard](https://turso.tech) instead — same end result, you'll
just click through a UI instead of typing commands.

Then, via CLI:

```bash
turso auth signup      # or `turso auth login` if you already have an account
turso db create who-got-scooby
turso db show who-got-scooby --url
turso db tokens create who-got-scooby
```

Save the URL (starts with `libsql://...`) and the token — you'll need both
in steps 3 and 4.

## 2. Copy your current data into it

This preserves your real guest signups (Dog Bitch, Dalsin), the roster
content, and the current killer/GM setup — nothing needs to be re-entered.

In this project directory:

```bash
TURSO_DATABASE_URL="libsql://the-url-from-step-1" TURSO_AUTH_TOKEN="the-token-from-step-1" npm run db:migrate-to-turso
```

(On Windows PowerShell, set them as `$env:TURSO_DATABASE_URL="..."` and
`$env:TURSO_AUTH_TOKEN="..."` on separate lines first, then run
`npm run db:migrate-to-turso`.)

## 3. Push this project to GitHub

Render deploys from a connected GitHub repo. If you don't already have one
for this project:

```bash
git add -A
git commit -m "Initial commit"
```

Then create a new repository on [github.com/new](https://github.com/new)
(don't initialize it with a README), and push:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## 4. Deploy on Render

1. Sign up at [render.com](https://render.com) and connect your GitHub account.
2. Click **New > Blueprint**, pick this repo. Render will read `render.yaml`
   automatically.
3. When prompted for environment variables, enter:
   - `ADMIN_PASSWORD` — your host password (can reuse the one in `.env.local`, or pick a new one)
   - `SESSION_SECRET` — any long random string (can reuse the one in `.env.local`)
   - `TURSO_DATABASE_URL` — from step 1
   - `TURSO_AUTH_TOKEN` — from step 1
4. Deploy. First build takes a few minutes.

## 5. Verify

Open the `.onrender.com` URL Render gives you. Check:
- Landing page loads with your real event details
- `/admin/login` works with your admin password
- The two existing guests still show up in the admin dashboard
- Sign up as a fresh test guest, confirm the quiz assigns a character, then delete that test guest from the admin dashboard's guest list before the real party

Once confirmed, share the Render URL with your 10 friends instead of
`localhost:3000`.

## Notes

- Local dev (`npm run dev`) is unaffected — it keeps using the local
  `mystery.db` file unless you set `TURSO_DATABASE_URL` in `.env.local`, which
  you shouldn't for day-to-day local work.
- Render's free web service spins down after 15 minutes of no traffic and
  takes up to ~1 minute to wake back up on the next visit. Fine for a party
  site; just don't be alarmed by a slow first load if nobody's used it in a
  while.
