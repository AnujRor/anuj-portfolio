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

- [ ] Run `supabase/site-content.sql` and `supabase/project-links.sql` in Supabase
- [ ] Press **Update built-in blog articles** in the admin dashboard so the new articles go live
- [ ] Add real screenshots, GitHub links and honest feature lists for each project in admin
- [ ] Add the WhatsApp number and resume PDF in `src/config.js`
- [ ] Set `VITE_SITE_URL` to the live domain in the hosting environment
