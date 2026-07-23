# ProfilePilot AI — AI Resume Reviewer

> **🚀 Live Demo:** [https://profile-pilot-ai.vercel.app/](https://profile-pilot-ai.vercel.app/)

Upload your resume PDF and get an instant, AI-powered review — scored, structured, and actionable.

**Features:**
- 📄 Upload a PDF or paste resume text directly
- 🎯 Specify a **Target Job Title** to check role relevance
- 📊 Get an overall score with category breakdowns (Clarity, Impact, ATS, Structure)
- ✅ Strengths & ❌ Weaknesses clearly listed
- ✍️ 3 AI-rewritten bullet points to instantly improve your resume
- 🔒 Text is processed in memory — never stored

**Built with:** React · TypeScript · Vite · Tailwind CSS · Framer Motion · Google Gemini 2.5 Flash · Vercel Serverless Functions

---

## How It Works

```
Browser                              Vercel Server
───────                              ─────────────
1. User drops a PDF                  4. /api/review receives { resumeText, jobTitle }
2. PDF.js extracts text in-browser   5. Calls Gemini 2.5 Flash with a structured schema
3. POST /api/review                  6. Returns clean JSON → UI renders the results
```

The resume text is processed in memory and **never persisted or logged**.

---

## Quick Start (Local Development)

### 1. Get a Free Gemini API Key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with a Google account → click **Create API key**
3. Copy the key (it looks like `AIza…`)

> **Free tier (2026):** 250 requests/day — no credit card required.

### 2. Configure Your Environment

```bash
cp .env.example .env
# Open .env and paste your key:
# GEMINI_API_KEY=AIza...your_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

The `/api/review` serverless function requires Vercel's local emulator to run. Plain `npm run dev` will only serve the frontend.

```bash
# Install Vercel CLI globally (one-time)
npm install -g vercel

# Start the full local dev server (frontend + API)
vercel dev
```

Opens at [http://localhost:3000](http://localhost:3000).

> **Tip:** `vercel dev` reads your `.env` file automatically.

---

## Deploy to Vercel

### Option A — Vercel Dashboard (Recommended)

1. Push your code to a GitHub repo
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repo
3. Before clicking **Deploy**, expand **Environment Variables** and add:
   | Name | Value |
   |------|-------|
   | `GEMINI_API_KEY` | `AIza...your_key` |
4. Click **Deploy** — live URL in ~30 seconds ⚡

### Option B — Vercel CLI

```bash
vercel                              # preview deploy
vercel env add GEMINI_API_KEY       # add your API key when prompted
vercel --prod                       # promote to production
```

---

## Project Structure

```
profilepilot-ai/
├── api/
│   └── review.ts              # Serverless function — calls Gemini API
├── src/
│   ├── App.tsx                # Main app — state machine (idle → loading → result)
│   ├── main.tsx               # React entry point
│   ├── index.css              # Global styles & design tokens
│   ├── lib/
│   │   ├── pdfExtract.ts      # Browser-side PDF → plain text (PDF.js)
│   │   └── types.ts           # ReviewResult TypeScript types
│   └── components/
│       ├── UploadZone.tsx     # Drag-and-drop upload + paste text tabs + job title input
│       ├── LoadingState.tsx   # Animated loading indicator
│       └── ResultView.tsx     # Full results UI (score, categories, strengths, rewrites)
├── .env.example               # Template for environment variables
├── vercel.json                # Vercel deployment config
└── package.json
```

---

## Customization Reference

| What to change | Where to change it |
|---|---|
| AI review style / tone / strictness | `api/review.ts` → `SYSTEM_INSTRUCTIONS` |
| Add or remove output fields | `api/review.ts` → `RESPONSE_SCHEMA` and `src/lib/types.ts` |
| Hero headline / tagline copy | `src/App.tsx` |
| Colors, fonts, animations | `src/index.css` |
| Switch AI model (e.g. gemini-2.5-flash-lite) | `api/review.ts` → the `model` variable |
| Upload size / character limits | `api/review.ts` and `src/components/UploadZone.tsx` |

---

## Cost & Limits

| Tier | Limit |
|------|-------|
| Free (no billing) | ~250 reviews / day |
| Paid | ~$0.001 per review (Gemini 2.5 Flash @ ~$0.30 / 1M tokens) |

A thousand reviews costs roughly **$1**. You won't hit billing unless you're running a popular public tool.

---

## License

MIT — do whatever you want with it.
