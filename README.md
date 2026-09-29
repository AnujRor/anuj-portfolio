# Anuj Ror — AI Developer Portfolio

Personal portfolio and blog of **Anuj Ror**, a self-taught AI developer from Harsola, Haryana, India, building real-time voice AI (AI Dost) and practical AI tools.

Built with React, Vite, Tailwind CSS and Framer Motion. Content (projects, blog posts, messages, editable sections) is managed from a built-in admin panel backed by Supabase.

## Features

- Home page: Hero, About & Journey, My Capabilities (skills + stats), Projects, Services, Vision, Contact
- Blog at `/blog` with its own light, editorial design
- Admin panel at `/admin`: blog posts, projects, contact messages, Hero/About/Journey text and photos, skills/stats/vision, password change
- Contact form saves to the admin inbox (Supabase) and emails via EmailJS
- SEO: meta tags, structured data, sitemap, robots.txt and pre-rendered pages at build time
- WebP images, lite mode for low-end devices, responsive on every screen size

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys and site URL
npm run dev                  # local dev server
npm run build                # production build (+ SEO files)
npm run preview              # preview the build
```

### Supabase setup

Run these files once in **Supabase Dashboard → SQL Editor**:

| File | What it does |
| --- | --- |
| `supabase/schema.sql` | Full setup for a new project (all tables, policies, storage) |
| `supabase/site-content.sql` | Table for editable Hero/About/Journey/Capabilities content |
| `supabase/project-links.sql` | GitHub link + status columns for projects |
| `supabase/post-seo.sql` | Meta title, meta description and tags for blog posts |
| `supabase/rename-images.sql` | Fixes old image paths in saved rows |

### Settings in `src/config.js`

- `CONTACT_EMAIL`: email shown in the Contact section
- `WHATSAPP_NUMBER`: number with country code, digits only (empty = WhatsApp button hidden)
- `RESUME_URL`: path to a resume PDF in `public/` (empty = Resume button hidden)
- `SOCIALS`: LinkedIn, Instagram, GitHub links
- EmailJS keys for the contact form

## Project structure

```
src/
  components/   Public site sections (Hero, About, Skills, Projects, Services, Vision, Contact, Blog…)
  admin/        Admin panel pages
  lib/          Supabase access and content loading
  data.js       Default content (profile, projects, blog posts)
  config.js     Contact, social and EmailJS settings
scripts/        Build-time SEO generator
supabase/       SQL setup files
```

## Changelog

### 29 September 2026

**Blog SEO**
- Every post now has its own **meta title**, **meta description** and **tags/keywords** (set in `data.js`, or in the admin post editor's new **SEO** card with a Google result preview and length counters)
- Per-page `keywords`, `article:section`, `article:tag` and `article:author` meta tags
- Richer `BlogPosting` structured data: author name + link, keywords, image, reading time
- Tags shown under each article; **Keep reading** now picks related posts by shared tags
- New RSS feed at `/rss.xml`
- Optional Google Search Console / Bing verification tags via `VITE_GOOGLE_SITE_VERIFICATION` / `VITE_BING_SITE_VERIFICATION`
- Hero photo is preloaded only on the home page (fixes a console warning on `/admin` and `/blog`)

**Blog covers & speed**
- New 1200×630 WebP covers for the AI Dost and voice AI lessons articles (they now show as link previews on WhatsApp, LinkedIn, X)
- Blog and the home sections below the hero load as separate JS chunks (main bundle 400 KB → 347 KB)
- Phones download 480px profile photos instead of 640px
- Post pages preload their cover image; blog layout shift fixed (CLS 0.32 → 0.004); blog text contrast raised (Accessibility 91 → 100)
- Build script now maps old image names in Supabase rows to the renamed files (fixes wrong image paths in the pre-rendered HTML)

**Projects**
- Only the first 4 projects show; a **See more projects** button reveals the rest (and **Show less** hides them)

### 28 September 2026

**Admin panel**
- New **img** page to edit Hero, About Me and Journey text and photos
- New **My Capabilities** page with tabs for AI tools, Numbers (stats) and My Vision
- New **Settings** page to change the admin password
- Switching tabs keeps unsaved edits
- Project editor: new **GitHub link** and **Status** (Auto / Live / In development / Planned) fields
- Dashboard: new **Update built-in blog articles** button that copies the latest article text from `data.js` into Supabase

**Design & responsiveness**
- My Vision lines wrap by word on narrow phones instead of being cut off
- About photo no longer overflows on tablets
- Admin tab bars and number rows fit on small phones

**Content, rewritten to sound more professional**
- Hero, About, Journey, Vision and Stats rewritten in a clear, honest tone
- Hero badge now says "Available for freelance projects & collaborations"
- Skills show the real tech stack (React, JavaScript, Tailwind CSS, Supabase, Git & GitHub) next to the AI tools
- Stats changed to real numbers (products in development, tools in the stack, years building with AI)

**New features**
- **My Services** section: Voice AI Agents, AI Chatbots & Assistants, AI Tools & Automation, Modern Websites (added to navbar and footer)
- Project cards show a **Live / In development** badge and an optional **View Code** (GitHub) button
- Contact section shows the email address and an optional **WhatsApp** button
- Optional **Resume** download button in the hero

**Blog**
- All three articles rewritten at ~900–1000 words in simple, first-person English
- The voice AI lessons article gets its own cover image

### Still to do

- [ ] Run `supabase/site-content.sql`, `supabase/project-links.sql` and `supabase/post-seo.sql` in Supabase
- [ ] Press **Update built-in blog articles** in the admin dashboard so the new articles go live
- [ ] Add real screenshots, GitHub links and honest feature lists for each project in admin
- [ ] Add the WhatsApp number and resume PDF in `src/config.js`
- [ ] Set `VITE_SITE_URL` to the live domain in the hosting environment
- [ ] Add the site to Google Search Console, paste the verification code into `VITE_GOOGLE_SITE_VERIFICATION`, and submit `sitemap.xml`
