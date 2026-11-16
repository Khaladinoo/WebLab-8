# Assignment 8: First Node.js & Express 5 Back-End Server

## Installation and Running
1. Clone the repository and enter the directory:
   ```bash
   cd assignment8
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   # Or in watch mode:
   npm run dev
   ```

## File Organization
- `server.js`: Express 5 server with middlewares, API routes, static file serving, and 404 handling.
- `public/index.html`: Front-end interface for testing API routes.
- `public/styles.css`: External CSS styles.
- `public/app.js`: Client-side `fetch()` logic using relative URLs.
- `.gitignore`: Ignores `node_modules/` and `.env`.

## Middleware Placement & Counting Rules
- **Order**: Both `requestLogger` and `requestCounter` are registered at the top of `server.js` before `express.static` and all routes so every incoming request passes through them first.
- **Counting Rules**: All incoming requests (including static assets, valid API calls, redirects, and 404 responses) increment the counter to reflect total server traffic.

## Reasoning Questions
1. **Route order**: Moving the 404 fallback to the top of `server.js` causes all requests to receive a `404 Not Found` response because Express evaluates handlers sequentially from top to bottom and stops at the first handler that ends the response.
2. **Middleware**: Removing `next()` from the logger middleware causes browser requests to hang indefinitely until timeout; the server prints the log line but never passes control to subsequent handlers.
3. **Status codes**: `POST /api/subscribe` creates a new subscription state, so `201 Created` accurately communicates resource creation rather than a generic `200 OK`. Returning `404` for missing pages allows clients and browsers to detect errors programmatically, unlike `200` with an error message.
4. **Configuration**: Hosting platforms dynamically assign a port via `process.env.PORT` at runtime; reading it with a fallback (`3000`) ensures portability between local development and production deployment.
5. **Dependencies**: `node_modules/` contains thousands of reconstructible files that would bloat the repository. A teammate simply runs `npm install` after cloning to recreate the exact dependency tree from `package-lock.json`.
6. **Same origin**: Opening `index.html` directly from disk uses the `file://` protocol, causing relative URLs like `/api/courses` to resolve to local disk paths and fail, and triggering browser Same-Origin Policy (SOP) blocks if cross-origin requests are attempted.

## Self-Study Findings
- **Process Object**: Used `process.version` for the Node.js version string and `Math.floor(process.uptime())` for server uptime in seconds.
- **Content-Type**: Used `res.type('text/plain')` on `/robots.txt` and `/hello` to set the explicit `text/plain` header.
- **JSON Formatting**: Used `JSON.stringify(data, null, 2)` inside `<pre>` in `app.js` for readable indentation.

## Challenges Faced
- Adapting to Express 5's path-matching rules, which reject legacy `app.get('*')` wildcards, resolved cleanly via a final `app.use()` fallback middleware.