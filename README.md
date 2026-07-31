# Only Way

Turn a public GitHub profile into an editable cold email.

Only Way is a submission for Unlayer’s **Build with Elements Challenge**. [Unlayer Elements](https://docs.unlayer.com/elements) is the core rendering layer for the email preview and exported HTML.

## What it does

1. Enter any public GitHub username.
2. Only Way fetches the account’s public name and profile.
3. Add a target company and edit the subject or message.
4. Preview the actual Elements-rendered email.
5. Copy the plain-text email or download email-ready HTML.

The subject entered in the editor is included in both the rendered preview and exported output. There is no LLM, sign-in, database, or automatic email sending.

## Why Unlayer Elements

The cold email is authored as a reusable [`@unlayer/react-elements`](https://github.com/unlayer/elements) template:

- `Email` provides the email document wrapper and inbox preview text.
- `Row` and `Column` create the email-safe layout.
- `Paragraph` renders the subject and editable message.
- `renderToHtmlParts` creates email-safe HTML.
- `renderToPlainText` creates the copyable plain-text version.

The sandboxed preview iframe displays the same Elements HTML that users download.

## Stack

- Next.js 16 App Router, React 19, and TypeScript
- Unlayer React Elements
- GitHub REST API
- Zod validation
- Vercel Web Analytics
- Vitest

## Run locally

Requirements: Node.js 20 or newer.

```bash
git clone <your-repository-url>
cd unlayer_challenge
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Public GitHub requests work without credentials but are rate-limited. Optionally add a fine-grained token to `.env.local`:

```bash
GITHUB_TOKEN=github_pat_your_token
```

The token is read only by the server-side GitHub client and is never sent to the browser.

## Scripts

```bash
npm run dev        # development server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm test           # profile, validation, and renderer tests
npm run build      # production build
npm start          # production server
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), choose **Add New → Project** and import the repository.
3. Keep the detected Next.js defaults for framework, build command, and output directory.
4. Optionally add the `GITHUB_TOKEN` environment variable for a higher GitHub rate limit.
5. Click **Deploy**.

### Web Analytics

Traffic is tracked with [Vercel Web Analytics](https://vercel.com/docs/analytics). The `<Analytics />` component from `@vercel/analytics` is mounted in `app/layout.tsx`, so every route reports page views once analytics is enabled.

To turn it on, open the project in Vercel, go to the **Analytics** tab, and enable **Web Analytics**. Data appears after the next deployment receives production traffic.

## Architecture

```text
GitHub username
  └─> /api/github/[username]
       └─> public GitHub profile
            └─> editable cold-email draft
                 └─> /api/render
                      └─> Elements Email
                           ├─> email HTML
                           └─> plain text
```

Important implementation paths:

- `lib/github.ts` — server-only GitHub client, caching, and rate-limit errors
- `lib/career-profile.ts` — profile normalization and deterministic email defaults
- `components/templates/cold-email.tsx` — Elements email tree
- `lib/elements-renderer.tsx` — HTML and plain-text rendering
- `components/editor/career-workspace.tsx` — editor and sandboxed live preview

## Safety and privacy

- Only public GitHub profile data is requested.
- Only Way has no database and does not persist profile or editor data.
- User payloads are length-limited and validated before rendering.
- User-authored text is escaped by the Elements renderer.
- Preview iframes use a restrictive sandbox.
- Web Analytics collects aggregate page views without cookies or personal data.

## Current scope

- Export downloads HTML and copies plain text; it does not send email.
- GitHub authentication and private profiles are intentionally out of scope.
- The project is a guided editor, not a drag-and-drop visual builder.

## Challenge submission checklist

- [x] Elements is a core part of the project.
- [x] Complete source code and setup instructions are included.
- [ ] Add final screenshots or a GIF of the rendered email.
- [ ] Make this repository public.
- [ ] Star or otherwise support the [Unlayer Elements repository](https://github.com/unlayer/elements).
- [ ] Submit the official challenge form.
- [ ] Share the project publicly with `#BuiltWithElements`.

Built with [Unlayer Elements](https://unlayer.com/elements) for the [Build with Elements Challenge](https://x.com/unlayer/status/2077304476382142484?s=20).

## License

[MIT](LICENSE)
