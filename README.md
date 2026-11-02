# CS Digital — portfolio

AI and automation services portfolio for Clod Salvador. Single-page React
app, deployed on Vercel.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # serve the build on :4173
```

## Wiring up the audit form

The form at the bottom of the page is the only thing that needs
configuration. It POSTs this JSON to an n8n webhook:

```json
{
  "name": "Jane Dela Cruz",
  "business": "Dela Cruz Realty",
  "email": "jane@example.com",
  "notes": "Still chasing every lead by hand.",
  "pipeline": ["Website / funnel", "AI first reply", "Enrich & score"],
  "pipelineDetail": [{ "id": "reply", "name": "...", "estHours": 9 }],
  "estimatedHoursPerMonth": 19,
  "source": "cs-digital portfolio · audit form",
  "submittedAt": "2026-11-02T09:00:00.000Z",
  "page": "https://..."
}
```

1. In n8n, add a **Webhook** node (POST) and copy its production URL.
2. In Vercel: Project → Settings → Environment Variables →
   `VITE_N8N_AUDIT_WEBHOOK` = that URL. Redeploy.
3. Build whatever you like behind it: Gmail to yourself, a Sheets row, an
   auto-reply to the lead.

`pipelineDetail` carries what the visitor ticked in the builder, so the
lead arrives already qualified.

**Without the variable set**, the form opens a pre-filled email instead of
POSTing. Nothing breaks; it just goes through your inbox rather than your
automation.

> Note: `VITE_`-prefixed variables are compiled into the client bundle and
> are therefore public. That is correct for a webhook URL, which is a
> write-only endpoint. Never put an API key behind a `VITE_` name.

## Layout

```
index.html              Vite entry
src/
  App.jsx               page order, composer state, scroll progress
  index.css             design tokens + every component style
  data/content.js       all copy, work items, composer blocks
  components/
    Backdrop.jsx        ShaderGradient mesh + veil (lazy, WebGL-optional)
    HeroLattice.jsx     r3f automation lattice
    Reel.jsx            scroll-scrubbed featured builds
    Composer.jsx        the pipeline builder
    Audit.jsx           the form + webhook
  hooks/
    useScrubVideo.js    binds a video timeline to scroll position
    useViewport.js      reveal, near-viewport, media queries
public/assets/          video, posters, logos, tool icons
legacy-index.html       the previous single-file site, kept as a fallback
```

## Video assets

The featured clips are re-encoded for **scrubbing**, not playback: a dense
GOP (`-g 8`) so seeking does not have to walk from a distant keyframe. A
normal web encode plays fine and scrubs like mud. Mobile variants are
suffixed `-m`.

```bash
ffmpeg -i source.mp4 -an \
  -vf "crop=1900:744:0:104,scale=1280:-2,fps=24" \
  -c:v libx264 -preset medium -crf 28 \
  -g 8 -keyint_min 8 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart out.mp4
```

The crop removes browser chrome, the Windows taskbar, and the screen
recorder watermark. Re-use it for any new walkthrough recorded the same way.
