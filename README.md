# Visual Ecology conference series website

Static site built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages. Almost
everything you'll want to change lives in small, commented data files, so updating the site
(or rolling it over to a new year) is mostly a matter of editing YAML and Markdown.

## Where things live

| What | File |
| --- | --- |
| This year's name, dates, location, venue, registration status/link, key dates, fees, code-of-conduct contact | `_data/conference.yml` |
| Past conferences (homepage) | `_data/past_conferences.yml` |
| Key groups (homepage cards) | `_data/groups.yml` |
| Programme (Schedule page) | `_data/schedule.yml` |
| Keynote speakers | `_data/keynotes.yml` |
| Organisers / committees | `_data/organisers.yml` |
| Main menu | `_data/navigation.yml` |
| Homepage blurb ("About the series") | `index.md` |
| Text on each page | `_pages/register.md`, `schedule.md`, `keynote-speakers.md`, `venue.md`, `organisers.md`, `code-of-conduct.md` |
| Conference logo | `assets/logos/` (path set by `logo:` in `_data/conference.yml`) |
| Headshots | `assets/images/people/` |
| Series-wide settings (site title, URL) | `_config.yml` — rarely needs changing |

Placeholder text is marked `TBC` or `> TODO:` — search for those to find everything still to
fill in.

### Registration button

`registration.status` in `_data/conference.yml` controls the button on the homepage and the
Register page:

- `soon` — greyed-out "Registration opens …" (uses `registration.opens`)
- `open` — green "Register now"; on the Register page it links straight to `registration.url`
  (the homepage button always goes to the Register page first, so people see the fees)
- `closed` — greyed-out "Registration closed"

### Photos of people

Put headshots in `assets/images/people/` and set `photo: /assets/images/people/name.jpg` in
`_data/keynotes.yml` or `_data/organisers.yml`. Any size is fine — thumbnails are generated at
build time and cropped to a circle (roughly square photos with the face central work best).
With no photo, the person's initials are shown instead.

### Links inside Markdown

The GitHub Pages site is served from a sub-path (`/visual-ecology/`), so links between pages in
Markdown should go through `relative_url`, otherwise they break on the live site:

```markdown
See the [schedule]({{ '/schedule/' | relative_url }}).
```

Images written as `![alt](/assets/images/...)` are handled automatically (see below).

## Rolling over to a new year

1. **Archive the old year (optional but recommended).** Tag the repo so the old site can always
   be rebuilt: `git tag 2027 && git push --tags`. If you want the old site to stay *online*,
   create a new GitHub repo (e.g. `visual-ecology-2027`), push the tag's contents to it and
   enable Pages there; it will be served at `https://<user>.github.io/visual-ecology-2027/`.
2. **Add the finished meeting** to the top of `_data/past_conferences.yml` (with the archive
   link from step 1, if you made one).
3. **Edit `_data/conference.yml`** — name, year, dates, location, venue, registration
   (set `status: soon`), key dates, fees, contacts.
4. **Swap the logo** in `assets/logos/` and update `logo:`.
5. **Reset** `_data/schedule.yml`, `_data/keynotes.yml` and `_data/organisers.yml`.
6. **Review the page text** in `index.md` and `_pages/` (venue/travel info especially), and
   delete or keep old news posts in `_posts/`.

## News posts (optional)

The homepage shows a "News" grid only once there's at least one post. To add one, create
`_posts/YYYY-MM-DD-short-title.md`:

```yaml
---
title: "Registration is open"
excerpt: "One sentence shown on the homepage card."
image: /assets/images/news/registration.jpg   # optional
---

Post body in Markdown.
```

## Adding a new page

1. Create `_pages/your-page.md` with a `title:` in its front matter — it's served at
   `/your-page/`.
2. Add it to `_data/navigation.yml`. A menu item can also be a dropdown:

   ```yaml
   - title: Information
     children:
       - title: Travel
         url: /travel/
       - title: Accommodation
         url: /accommodation/
   ```

## Images, photo galleries and the lightbox

Drop images anywhere under `assets/images/`. Display-size and thumbnail copies are generated at
build time (`_plugins/photos.rb`) into `assets/images/derived/` — you never need to resize
images yourself, and the generated files aren't committed. (Logos live in `assets/logos/`
instead, so they're used as-is.)

For any image, add an optional sidecar Markdown file with the *same name* to give it a title,
excerpt and caption — e.g. `harbour.jpg` + `harbour.md`:

```yaml
---
title: "The harbour"
excerpt: "Five minutes' walk from the venue"
---

Any Markdown here becomes the caption shown in the full-size lightbox view.
```

Images in page text open in a full-width lightbox when clicked. A few options:

- **Gallery of a whole folder:** `{% include gallery.html dir="/assets/images/venue" thumb_width=200 %}`
  (add `overlay=false` to hide title/excerpt overlays). The Venue page has a ready-made
  `gallery_dir:` line in its front matter — uncomment it and fill the folder.
- **Width control:** `![alt](/assets/images/venue/foo.jpg?width=400)` (or `?width=50%`).
- **Original full-resolution file:** `![alt](/assets/images/venue/foo.jpg?full)`.
- **Image as a link instead of lightbox:** `[![alt](/assets/images/venue/foo.jpg)](https://example.com/)`.

## Animated reaction-diffusion titles

Any page's title in the header can degrade into a Gray-Scott reaction-diffusion pattern over
~30 seconds. The homepage has this switched on; add a `reaction:` block to any other page's
front matter to do the same:

```yaml
reaction:
  text: spots            # pattern inside the letterforms — a preset name
  background: stripes    # pattern in the surrounding area — a preset name
  # feed_in / kill_in / feed_out / kill_out — raw Gray-Scott rates, override the presets above
  text_alpha: 0          # opacity of the static original text (default 0)
  pattern_alpha: 1       # opacity of the evolving pattern (default 1)
  decay: 0               # temporal smoothing between frames, 0-1 (e.g. 0.9 = long trails)
  attraction: 0          # pull of the pattern back into the letterforms (try 0.5-2)
  text_colour: "#b9f855"
  pattern_colour: "#b9f855"
```

Every field is optional (`reaction: {}` turns it on with defaults). Presets: `spots`,
`stripes`, `worms`, `coral`, `maze`, `holes`, `waves` — see `assets/js/reaction-diffusion.js`.
Skipped automatically for titles that wrap onto two lines, and under the OS "reduce motion"
setting.

## Local preview

One-off setup (Ubuntu):

```sh
sudo apt install -y ruby-full build-essential zlib1g-dev imagemagick
gem install bundler
bundle install
```

Then:

```sh
bundle exec jekyll serve
```

and visit http://localhost:4000 — it rebuilds as you edit (restart it after editing
`_config.yml`). `bundle exec jekyll build` builds once into `_site/`, which is a good way to
check for errors.

## Deploying

Push to `main` — `.github/workflows/pages.yml` builds and deploys to GitHub Pages
automatically. One-off setup: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**.

To use a custom domain, set it in Settings → Pages, then change `url:` in `_config.yml` to
that domain (the workflow sets `baseurl` itself, so no other change is needed).
