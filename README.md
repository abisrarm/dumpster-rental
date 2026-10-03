# The Dumpster Man

One-page site for The Dumpster Man, dumpster rental and junk removal in Austin and Hays County, Texas.

Plain HTML, CSS and JavaScript in one file. No framework, no build step. The repo root is the site.

```
index.html          the whole page: styles, markup, script, and the SITE settings
film.mp4            the scroll film, one H.264 clip (muted, 16:9, 720p, 30 fps)
img/                film poster, the driveway and area photos, favicon
```

## Change the business details

Open `index.html` and find `const SITE = {`. The phone number, towns, hours, and every price live
there and nowhere else.

## Connect the photo quote form

In the same `SITE` block, set `quoteEndpoint` to a URL that accepts a form POST with file uploads
(Formspree, Basin, a Netlify Function, a Cloudflare Worker). Until it is set, the form does not send
anything to a server.

## Run it locally

Any static server works:

```
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

### Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick `dumpster-rental`.
2. Framework preset: **None**. Build command: leave empty. Build output directory: `/`.
3. Save and Deploy. Every push to `main` redeploys.

### Netlify

1. Netlify → Add new site → Import an existing project → GitHub → pick `dumpster-rental`.
2. Branch: `main`. Build command: leave empty. Publish directory: `.` (the repo root).
3. Deploy. Every push to `main` redeploys.

## The film

`film.mp4` is the five Higgsfield clips joined in story order and retimed so each beat fills its slice
of the scroll: drop 0–22%, fill 22–40%, load 40–55%, pickup 55–75%, leave 75–100%. Scrolling scrubs it.
The page loads the whole file into memory first, so seeking works on any host. With reduced motion on,
it holds the frame where the can has landed.

It is 720p on purpose. The 1080p command in the comment at the top of `index.html` produced a 94 MB file,
which is too heavy for a phone. To rebuild it, join the clips into `input.mov` and run:

```
ffmpeg -i input.mov -vf "scale=1280:720:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 20 -g 5 \
  -pix_fmt yuv420p -an -movflags +faststart film.mp4
ffmpeg -i film.mp4 -frames:v 1 -q:v 3 img/film.jpg
```

`-g 5` puts a keyframe every 5 frames so scrubbing stays smooth. If it still stutters, use `-g 1`
(bigger file).
