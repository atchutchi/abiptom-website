# ABIPTOM — Digital Agency Website

> Full-stack digital agency website for ABIPTOM SARL, a technology and creative agency based in Bissau, Guinea-Bissau. Built with Next.js 16, TypeScript, and an immersive dark cinematic design system.

[![Live Site](https://img.shields.io/badge/Live-abiptom.gw-F5B800?style=flat&logo=vercel&logoColor=black)](https://abiptom.gw)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

![ABIPTOM Homepage](./docs/images/homepage.png)

---

## Overview

ABIPTOM SARL ("Guardião das Novas Tecnologias") is a full-service digital agency operating in Guinea-Bissau. This website serves as the company's digital presence, showcasing services, portfolio, team, and providing lead generation capabilities through intelligent forms and an AI-powered chatbot.

The site features an immersive, dark cinematic design inspired by award-winning agencies, with smooth scrolling, custom cursor interactions, text splitting animations, and a gold (#F5B800) accent colour palette that reflects the ABIPTOM brand identity.

**Key highlights:**
- 20+ pages covering services, portfolio, blog, careers, and contact
- AI chatbot powered by HuggingFace Inference API
- CMS-driven blog via Contentful
- Supabase integration for auth, storage, and media
- Full SEO setup with sitemap, Open Graph, and structured metadata
- Comprehensive security headers and rate limiting

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [Next.js 16.1.1](https://nextjs.org) | React framework (App Router, SSG/SSR) |
| [TypeScript 5](https://typescriptlang.org) | Type safety |
| [Tailwind CSS 3.4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component primitives |
| [Radix UI](https://radix-ui.com) | Headless UI components (20+ primitives) |
| [Framer Motion 12](https://framer.com/motion) | Declarative animations |
| [GSAP 3.14](https://gsap.com) | ScrollTrigger and timeline animations |
| [Lenis 1.3](https://lenis.darkroom.engineering) | Smooth scrolling |
| [Lucide React](https://lucide.dev) | Icon library |

### Backend & Services

| Technology | Purpose |
|---|---|
| [Supabase](https://supabase.com) | Auth, PostgreSQL, Storage (media uploads) |
| [Contentful](https://contentful.com) | Headless CMS for blog content |
| [HuggingFace Inference](https://huggingface.co) | AI chatbot (Mixtral, Llama, Phi-3, Zephyr) |
| [EmailJS](https://emailjs.com) | Transactional email (contact + careers forms) |
| [Nodemailer](https://nodemailer.com) | Server-side email fallback |
| [Zod](https://zod.dev) | Schema validation |
| [React Hook Form](https://react-hook-form.com) | Form management |
| [JSON Web Tokens](https://jwt.io) | CSRF protection |

### Infrastructure

| Technology | Purpose |
|---|---|
| [Vercel](https://vercel.com) | Hosting, Edge Functions, Preview Deployments |
| [Google Analytics](https://analytics.google.com) | Traffic analytics |
| [Playwright](https://playwright.dev) | End-to-end testing |

### Typography & Design

| Font | Usage |
|---|---|
| Playfair Display | Display headings (serif) |
| Inter | Body text and UI (sans-serif) |

---

## Features

### Navigation & Layout

- **Fixed header** with logo and animated hamburger menu (three-line → X transform)
- **Fullscreen overlay navigation** with staggered link animations and contact info
- **Smooth scrolling** via Lenis with custom easing
- **Custom animated cursor** (circular, responsive to element type, disabled on mobile)
- **Page transitions** between routes via Framer Motion `AnimatePresence`
- **Preloader animation** with ABIPTOM branding (runs once per session)
- **Grain/noise texture overlay** for cinematic depth

### Homepage

- **Hero section** with animated background GIF, text splitting word-by-word, social media icons, and dual CTAs
- **Services grid** with 9 interactive cards (hover gold border + arrow animation)
- **About preview** with company description and image
- **Crawling line** (infinite marquee) listing services
- **Portfolio preview** with hover overlays and category labels
- **Testimonial slider** with editorial dark design
- **Client logos carousel** (38 SVG logos, grayscale → colour on hover)
- **Blog preview** pulling latest posts from Contentful
- **CTA section** with WhatsApp integration

### Services (`/servicos`)

- Main services listing page with 9 service cards
- Social media packages (Básico, Silver, Gold, Premium+) with pricing cards
- **9 dedicated service pages**, each redesigned with the Obys dark system:
  - Marketing Digital, Design Gráfico, Desenvolvimento Web
  - Social Media, Fotografia, Produção de Vídeo
  - Desenvolvimento de Software, Animação 2D, Redes/Cablagem/Helpdesk

### Portfolio (`/portfolio`)

- Interactive category filters (Todos, Websites, Design, Social Media, Vídeo, Documentos)
- Animated filtering with `AnimatePresence`
- 25+ portfolio items with hover overlays
- Video entries with circular play button → embedded YouTube iframe
- Client logos section

### Blog (`/blog`)

- Contentful CMS integration for dynamic blog posts
- Sidebar with categories and tags
- Search and filtering functionality
- Dark editorial card design with gold category labels
- Individual article pages with rich text rendering

### Contact (`/contacto`)

- Two-column layout: contact info + dark form
- Mathematical CAPTCHA for spam prevention
- EmailJS integration for form submission
- CSRF token protection
- Embedded Google Maps
- WhatsApp CTA with direct link

### Careers (`/trabalhe-conosco`)

- Application form with file upload support
- Reasons to work at ABIPTOM (styled cards)
- Mathematical CAPTCHA + CSRF protection
- EmailJS integration

### About (`/quem-somos`)

- Company overview with asymmetric image layout
- Animated metrics (10+ years, 200+ projects, 50+ clients, 11 specialists)
- Mission, Vision, Values section with gold top borders
- Team grid with 11 members and circular photos

### AI Chatbot

- HuggingFace Inference API with model fallback chain (Mixtral → Llama → Phi-3 → Zephyr)
- Full ABIPTOM context injected via system prompt (services, contacts, clients, pricing rules)
- Quick action buttons for common queries
- Inline lead capture form when quotation intent is detected
- Conversation persistence in `localStorage`
- Rate limiting (30 messages/minute)
- Fallback to WhatsApp when API fails

### Admin

- `/admin/chat` — Chatbot configuration panel
- `/admin/supabase-test` — Supabase connection testing

---

## User Stories

<details>
<summary><strong>Click to expand user stories</strong></summary>

### Visitor

- As a **visitor**, I can **browse the homepage** so that I **understand what ABIPTOM offers at a glance**
- As a **visitor**, I can **navigate to any service page** so that I **learn about specific services in detail**
- As a **visitor**, I can **view the portfolio** so that I **see examples of ABIPTOM's previous work**
- As a **visitor**, I can **filter portfolio by category** so that I **find relevant projects quickly**
- As a **visitor**, I can **read blog articles** so that I **stay informed about ABIPTOM's work and insights**
- As a **visitor**, I can **learn about the team** so that I **know who will be working on my project**

### Potential Client

- As a **potential client**, I can **submit a contact form** so that I **request a quote for services**
- As a **potential client**, I can **interact with the AI chatbot** so that I **get quick answers about services and pricing**
- As a **potential client**, I can **click the WhatsApp CTA** so that I **contact ABIPTOM directly via messaging**
- As a **potential client**, I can **fill the lead form in the chatbot** so that I **receive a personalised quotation**

### Job Applicant

- As a **job applicant**, I can **submit a careers form** so that I **apply for a position at ABIPTOM**
- As a **job applicant**, I can **upload my CV** so that I **attach relevant documents to my application**

### Admin

- As an **admin**, I can **publish blog posts via Contentful** so that I **keep the blog updated without code changes**
- As an **admin**, I can **upload media via Supabase** so that I **manage portfolio images and assets**

</details>

---

## Architecture

### Project Structure

```
abiptom-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, analytics)
│   ├── template.tsx              # Page transition wrapper
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles + design tokens
│   ├── design-tokens.css         # CSS custom properties
│   ├── sitemap.ts                # Dynamic sitemap generation
│   ├── quem-somos/               # About page
│   ├── servicos/                 # Services (main + 9 subpages)
│   ├── portfolio/                # Portfolio with filters
│   ├── blog/                     # Blog listing + article pages
│   ├── contacto/                 # Contact form
│   ├── trabalhe-conosco/         # Careers form
│   ├── admin/                    # Admin pages (chat config, supabase test)
│   ├── api/                      # API routes
│   │   ├── chat/                 # AI chatbot endpoint
│   │   ├── contact/              # Contact form handler
│   │   ├── careers/              # Careers form handler
│   │   ├── upload/               # Supabase media upload
│   │   ├── blog/                 # Blog posts from Contentful
│   │   ├── contentful-webhook/   # CMS webhook handler
│   │   └── revalidate/           # ISR revalidation
│   └── rss.xml/                  # RSS feed
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui primitives (30+ components)
│   ├── chat-bot/                 # Chatbot system (6 components)
│   ├── site-header.tsx           # Fixed header + fullscreen nav
│   ├── site-footer.tsx           # Footer with logo + links
│   ├── hero-section.tsx          # Hero with animated background
│   ├── smooth-scroll.tsx         # Lenis wrapper
│   ├── custom-cursor.tsx         # Animated cursor
│   ├── preloader.tsx             # Loading animation
│   ├── page-noize.tsx            # Grain texture overlay
│   ├── text-splitter.tsx         # Word/char animation
│   ├── crawling-line.tsx         # Infinite marquee
│   ├── animated-section.tsx      # Scroll reveal
│   ├── video-embed.tsx           # Video with play button
│   ├── service-card.tsx          # Service card component
│   ├── testimonial-slider.tsx    # Testimonial carousel
│   └── client-logos.tsx          # Logo marquee (38 clients)
├── lib/                          # Utilities and configuration
│   ├── chat/                     # Chatbot types, config, conversation manager
│   ├── contentful/               # Contentful client + rich text renderer
│   ├── supabase/                 # Supabase client + storage helpers
│   ├── rate-limit.ts             # In-memory rate limiter
│   └── utils.ts                  # cn() and shared utilities
├── utils/supabase/               # Supabase SSR helpers (browser, server, middleware)
├── hooks/                        # Custom React hooks
├── middleware.ts                 # Security headers, CSP, Supabase session
├── public/
│   ├── images/                   # Static images
│   │   ├── clients/              # 38 client logo SVGs
│   │   ├── team/                 # Team member photos
│   │   ├── portfolio/            # Portfolio project images
│   │   └── servicos/             # Service page images
│   └── robots.txt                # Crawler directives
├── tailwind.config.ts            # Extended theme (Obys design system)
├── next.config.mjs               # Next.js config (images, CSP, rewrites)
└── playwright.config.ts          # E2E test configuration
```

### API Endpoints

| Endpoint | Methods | Description |
|---|---|---|
| `/api/chat` | POST | AI chatbot with HuggingFace model fallback |
| `/api/chat/config` | GET | Chatbot configuration (public) |
| `/api/chat/history` | GET, POST | Conversation history (in-memory) |
| `/api/contact` | POST | Contact form handler with EmailJS |
| `/api/careers` | POST | Careers form handler with EmailJS |
| `/api/upload` | POST | Authenticated media upload to Supabase |
| `/api/blog/posts` | GET | Blog posts from Contentful (1min revalidation) |
| `/api/contentful-webhook` | POST | Contentful webhook for ISR revalidation |
| `/api/revalidate` | POST, GET | On-demand ISR revalidation |
| `/rss.xml` | GET | RSS feed (XML) |
| `/sitemap.xml` | GET | Dynamic sitemap |

### Security

- **Content Security Policy (CSP)** — strict policy with nonces for scripts
- **HSTS** — HTTP Strict Transport Security enabled
- **X-Frame-Options** — DENY to prevent clickjacking
- **CSRF protection** — JWT-based tokens on all forms
- **Rate limiting** — in-memory limiter per IP per endpoint
- **Input validation** — Zod schemas on all form submissions
- **CORS** — origin validation on API routes

---

## Design System

The site uses a custom design system inspired by [Obys Agency](https://obys.agency):

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#080808` | Page background |
| `--bg-secondary` | `#151515` | Alternate sections |
| `--bg-surface` | `#0B0B0B` | Card surfaces |
| `--accent-gold` | `#F5B800` | Primary accent (ABIPTOM brand) |
| `--accent-gold-hover` | `#FFD040` | Hover state |
| `--text-primary` | `#FFFFFF` | Headings |
| `--text-secondary` | `#A4A4A4` | Body text |
| `--text-muted` | `#575757` | Labels, captions |
| `--border-dark` | `#3E3E3E` | Borders, dividers |

### Typography Scale

| Class | Size | Font |
|---|---|---|
| `heading-hero` | clamp(3rem, 8vw, 8.75rem) | Playfair Display |
| `heading-section` | clamp(2.5rem, 7vw, 8.75rem) | Playfair Display |
| `heading-subsection` | clamp(1.5rem, 3vw, 2.5rem) | Playfair Display |
| `body-large` | clamp(1.125rem, 2vw, 1.75rem) | Inter |
| `body-base` | clamp(1rem, 1.2vw, 1.125rem) | Inter |
| `text-label` | clamp(0.75rem, 1vw, 0.875rem) | Inter (uppercase) |

### Animation

- **Default easing:** `cubic-bezier(.3, .86, .36, .95)` — 350ms
- **Page easing:** `cubic-bezier(.4, 0, 0, 1)` — 1500ms
- `prefers-reduced-motion` respected in all animation components

---

## SEO & Performance

- **Dynamic sitemap** generated from route structure (`app/sitemap.ts`)
- **robots.txt** allowing all crawlers, blocking `/admin/` and `/api/`
- **Open Graph metadata** with images for social sharing
- **Twitter Card** metadata (summary_large_image)
- **RSS feed** at `/rss.xml`
- **Font optimisation** via `next/font/google` with `display: "swap"`
- **Image optimisation** via `next/image` with AVIF/WebP formats
- **Lazy loading** on non-critical images
- **Contentful webhook** for ISR revalidation (blog content updates without rebuilds)

---

## Testing

### E2E Testing (Playwright)

The project includes a Playwright configuration for end-to-end testing:

```bash
npm run test          # Run all tests
npm run test:ui       # Run with Playwright UI
npm run test:debug    # Run in debug mode
npm run test:report   # Show test report
```

Configured browsers: Chromium, Firefox, WebKit, plus mobile viewports (Pixel 5, iPhone 12).

### Manual Testing Checklist

| Feature | Expected | Status |
|---|---|---|
| Homepage loads with animations | Hero, services, portfolio visible | ✅ |
| Navigation menu opens/closes | Fullscreen overlay with links | ✅ |
| Contact form submits | CAPTCHA validates, email sent | ✅ |
| Chatbot responds | AI answers about services | ✅ |
| Portfolio filters work | Items animate when filtering | ✅ |
| Video play buttons work | YouTube iframe replaces thumbnail | ✅ |
| Mobile responsive | All pages adapt to mobile viewport | ✅ |
| Reduced motion | Animations disabled when preferred | ✅ |

---

## Setup & Deployment

### Prerequisites

- Node.js 18+
- npm or pnpm

### Local Development

```bash
# Clone
git clone https://github.com/atchutchi/abiptom-website.git
cd abiptom-website

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in the values (see Environment Variables below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` with these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_BUCKET=media

# Contentful
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_WEBHOOK_SECRET=

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=
NEXT_PUBLIC_EMAILJS_TEMPLATE_CAREERS=
EMAILJS_PRIVATE_KEY=

# HuggingFace (Chatbot)
NEXT_PUBLIC_HUGGINGFACE_API_KEY=

# Auth & Security
JWT_SECRET=
REVALIDATE_SECRET=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://abiptom.gw
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Configure environment variables in the Vercel dashboard under Project Settings → Environment Variables.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Playwright tests |
| `npm run supabase:init` | Run Supabase migration script |
| `npm run contentful:webhook` | Setup Contentful webhook |

---

## Future Development

- [ ] Dynamic blog article pages with `[slug]` routing from Contentful
- [ ] Multi-language support (Portuguese / French / English) via `next-intl`
- [ ] Client dashboard for project tracking
- [ ] Online payment integration for service packages
- [ ] Supabase database migrations for structured data
- [ ] Lighthouse CI integration in deployment pipeline
- [ ] Newsletter subscription with email automation
- [ ] Portfolio case study detail pages

---

<details>
<summary><strong>Troubleshooting</strong></summary>

### npm install fails with EACCES

**Problem:** Permission denied when running `npm install` due to cache directory ownership.

**Solution:**
```bash
rm -rf ~/.npm/_cacache
npm install --cache /tmp/npm-cache-temp
```

### Font weight 300 not available for Playfair Display

**Problem:** Build fails with "Unknown weight 300 for font Playfair Display."

**Solution:** Removed weight 300 from font configuration. Available weights: 400, 500, 600, 700, 800, 900.

### Sitemap routes mismatch

**Problem:** `app/sitemap.ts` contains route paths (e.g., `/servicos/web-design`) that don't match actual page routes (e.g., `/servicos/desenvolvimento-web`).

**Status:** Known issue — sitemap should be updated to reflect actual route structure.

### HuggingFace model availability

**Problem:** Primary AI model (Mixtral) may be temporarily unavailable or slow on the free tier.

**Solution:** The chatbot implements a fallback chain across 4 models. If all fail, it displays a friendly message directing users to WhatsApp.

</details>

---

## Credits

- **Design inspiration:** [Obys Agency](https://obys.agency)
- **UI components:** [shadcn/ui](https://ui.shadcn.com) by [@shadcn](https://twitter.com/shadcn)
- **Icons:** [Lucide](https://lucide.dev)
- **Fonts:** [Google Fonts](https://fonts.google.com) (Playfair Display, Inter)
- **Smooth scroll:** [Lenis](https://lenis.darkroom.engineering) by Darkroom
- **CMS:** [Contentful](https://contentful.com)
- **Database & Auth:** [Supabase](https://supabase.com)
- **AI:** [HuggingFace](https://huggingface.co)

---

## License

This project is proprietary software owned by ABIPTOM, SARL.

© 2026 ABIPTOM, SARL. All rights reserved.

---

<p align="center">
  <strong>ABIPTOM</strong> — Guardião das Novas Tecnologias<br>
  Bairro Ajuda IA Fase, Bissau, Guiné-Bissau<br>
  <a href="https://abiptom.gw">abiptom.gw</a> · <a href="mailto:info@abiptom.gw">info@abiptom.gw</a> · <a href="https://wa.me/245966865331">+245 966 865 331</a>
</p>
