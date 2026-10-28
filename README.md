# anniversary.chottiwatt.in.th

Thai anniversary site for จจ, run as one Cloudflare Worker.

- `/` — the site (password gate, then letter, timeline, photos, watch-once video, open-when letters, summer trip, message box)
- `/admin` — your admin panel (edit all text, upload photos/music/video, see when she opened it and read her messages)

## Deploy (Mac, about 10 minutes)

Open Terminal in this folder, then:

```bash
npm install
npx wrangler login
```

1. **Storage**
   ```bash
   npx wrangler kv namespace create KV
   ```
   Copy the `id` it prints into `wrangler.toml` (replace `PASTE_KV_ID_HERE`).
   ```bash
   npx wrangler r2 bucket create anniversary-media
   ```
   If R2 isn't enabled yet, the dashboard asks you to turn it on first (Cloudflare dashboard → R2). Free up to 10 GB.

2. **Free up the subdomain.** If you already added a DNS record or Redirect Rule for `anniversary.chottiwatt.in.th`, delete both. The deploy creates the DNS record itself.

3. **Deploy**
   ```bash
   npx wrangler deploy
   ```

4. **Secrets** (make two random values and keep the admin one in your password manager)
   ```bash
   openssl rand -hex 24   # copy → ADMIN_TOKEN
   npx wrangler secret put ADMIN_TOKEN
   openssl rand -hex 32   # copy → SESSION_SECRET
   npx wrangler secret put SESSION_SECRET
   ```

5. Open `https://anniversary.chottiwatt.in.th/admin`, paste your ADMIN_TOKEN, and edit.
   Test the site on your phone with the password `ปังฉึกฉึก`.

After any code change: `npx wrangler deploy`. Text and uploads changed in `/admin` are live immediately, no deploy needed.

## How she experiences it

1. Password screen
2. **Story mode**, one page per tap: intro → chat game → one page per timeline moment → distance and clocks → this or that → photo zoom → two truths one lie → quiz → envelope with the letter → scratch card over the US trip ticket (or say ปังฉึกฉึก out loud) → last page
3. The full scrollable page. After she finishes the story once, later visits open straight to the full page, with buttons to replay the story or the chat.

## Writing the chat game (admin → Chat game)

- Each **step** has an ID, your messages (one per line), and her reply choices. Each choice points to the next step.
- A step marked **Funny ending** shows an ending card with "ลองใหม่". A step marked **True ending** shows "ไปต่อ" and the story continues.
- She collects endings as she plays (the counter in the chat header).
- Press **Check the chat and refresh step lists** after adding or renaming steps. It flags broken links, stuck steps, and a missing true ending.
- The included script is a sample. Rebuild it from your real chats.

## Games (admin → Game: …)

- **This or that:** set your own pick for each pair; she sees how many match.
- **Photo zoom:** upload photos first, then add rounds. Set the zoom point (across / down, in %) on a detail that's hard to guess.
- **Two truths one lie:** three statements per round; set which line is the lie.
- **Scratch ticket:** voice unlock works in Safari and Chrome on phones; in apps like LINE's built-in browser the mic may not work, so scratching always works as the fallback.

## Notes

- **Password:** vowels, tone marks and spaces are ignored, and ช counts as ฉ, so ปังฉึกฉึก / ปั้งฉึกฉึก / ปั๊งชึกชึก / ปงฉกฉก all work. Add more answers in /admin → Password screen.
- **Watch-once video:** upload in /admin, then tick "Show on site". After she presses play she has a time window (default 20 min) to cover pauses or a dropped connection; when the video ends or the window passes, it's gone. "Let her watch again" resets it. Screen recording can't be blocked.
- **Placeholders:** any text in `[brackets]` shows highlighted on the site. Search for `[แก้เอง` in /admin before the day.
- **Extra protection for /admin (optional):** add a Cloudflare Access application for `anniversary.chottiwatt.in.th/admin*` and `anniversary.chottiwatt.in.th/api/admin*` with your email, same as your other Access apps. The admin token still applies underneath.
- **Local testing:** create `.dev.vars` with `ADMIN_TOKEN=...` and `SESSION_SECRET=...`, then `npx wrangler dev`.
