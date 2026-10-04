# The Dumpster Man

One-page site for The Dumpster Man, dumpster rental and junk removal in Austin and Hays County, Texas.

Plain HTML, CSS and JavaScript in one file. No framework, no build step. The repo root is the site.

```
index.html          the whole page: styles, markup, script, and the SITE settings
film.mp4            the scroll film for wide screens (H.264, 16:9, 1920x1080, 30 fps, muted)
film-phone.mp4      the same film cut 9:16 (608x1080) for phones held upright
img/                film posters, the driveway and area photos, favicon
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

Both films tell the same 40-second story, retimed so each beat fills its slice of the scroll:
drop 0–22%, fill 22–40%, load 40–55%, pickup 55–75%, leave 75–100%. Scrolling scrubs it.

The page picks one file when it loads. Screens taller than 4:5 (a phone held upright) get
`film-phone.mp4` (14 MB), cropped to follow the truck and the can. Everything else gets `film.mp4`
(50 MB). The whole file is loaded into memory first, so seeking works on any host. With reduced
motion on, the film holds the frame where the can has landed.

To rebuild them, join the clips into `input.mov` and run the commands in the comment at the top of
`index.html`. Keep `film.mp4` under 100 MB, GitHub's file limit. If scrubbing stutters on a phone,
lower `-g` in the command (bigger file).
