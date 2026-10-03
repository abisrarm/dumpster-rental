# The Dumpster Man

One-page site for The Dumpster Man, dumpster rental and junk removal in Austin, Texas.

Plain HTML, CSS and JavaScript. No framework, no build step. The repo root is the site.

```
index.html          page and styles
site.js             name, phone, towns, hours, prices, video paths (edit this one)
app.js              scroll story, price cards, booking form, reduced motion
video/              six H.264 MP4s that the scroll story scrubs (muted, 16:9, 720p)
img/                six posters, the area photo (lot.jpg), favicon
fonts/              Barlow and Barlow Condensed (SIL Open Font License)
```

## Change the business details

Open `site.js`. The phone number, tel link, towns, hours, and every price live there and nowhere else.
Values marked `REPLACE` are samples. Change `phone` and `tel` together.

## Connect the booking form

Open `app.js` and find `FORM HOOK`. Set `FORM_ENDPOINT` to any URL that accepts a form POST
(Formspree, Basin, a Netlify Function, a Cloudflare Worker). Until it is set, the form sends nothing
and tells the customer to call dispatch instead.

## Run it locally

Any static server works. Opening the file directly also works in most browsers.

```
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

### Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick `dumpster-rental`.
3. Framework preset: **None**. Build command: leave empty. Build output directory: `/`.
4. Save and Deploy. Every push to `main` redeploys.

### Netlify

1. Netlify → Add new site → Import an existing project → GitHub → pick `dumpster-rental`.
2. Branch: `main`. Build command: leave empty. Publish directory: `.` (the repo root).
3. Deploy. Every push to `main` redeploys.

Or drag the project folder onto https://app.netlify.com/drop for a one-off deploy.

## Videos

The six clips live in `video/` and are committed with the site. They were generated with Higgsfield
(Seedance 2.5, 720p, no audio) and encoded as H.264 MP4 with `+faststart` so iPhone Safari can start them fast.
Posters in `img/` are the first frame of each clip.

Scrolling scrubs each clip from its first frame to its last, so every clip needs a keyframe every 0.25 s
or seeking stutters. To replace a clip, keep the same file name and encode it like this:

```
ffmpeg -i new-clip.mp4 -vf "scale=1280:720,fps=24" -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 23 -g 6 -keyint_min 6 -sc_threshold 0 -an -movflags +faststart video/03-fill.mp4
ffmpeg -i video/03-fill.mp4 -frames:v 1 -q:v 4 img/03-fill.jpg
```

With reduced motion on, the story does not scrub. Each beat holds a still frame and the text stays put.
