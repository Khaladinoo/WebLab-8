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

## Testing Evidence

### 1. Successful JSON Response (`GET /api/courses`)
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 183
ETag: W/"b7-Kc8hGqcY/yYdSczJnQtfhOpe/UA"
Date: Mon, 16 Nov 2026 08:22:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Web Application Development","credits":4},{"id":2,"title":"Database Management Systems","credits":3},{"id":3,"title":"Operating Systems & Architecture","credits":4}]
```

### 2. Created Response (`POST /api/subscribe`)
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 08:22:33 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### 3. Forbidden Response (`GET /api/admin`)
```http
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Mon, 16 Nov 2026 08:22:39 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### 4. Redirect Response (`GET /old-page`)
```http
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Mon, 16 Nov 2026 08:22:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello
```

### 5. 404 Not Found on API Path (`GET /api/unknown`)
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 08:22:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### 6. 404 Not Found on Non-API Path (`GET /unknown-page`)
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 20
ETag: W/"14-IjpWptXxNNmy9uyakQZfBTjB+5M"
Date: Mon, 16 Nov 2026 08:22:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

404 - Page Not Found
```