# Project Architecture and UI Improvement Specifications

This document lists the detailed implementation plan and code specifications for the 10 improvements to be applied to the Medicare Healthcare platform.

---

## FIX 1 — Remove .DS_Store from Repo

- Update root `.gitignore` to include `.DS_Store`.
- Stop Git from tracking existing `.DS_Store` files using:
  ```bash
  git rm --cached .DS_Store
  git commit -m "chore: remove .DS_Store and add to .gitignore"
  ```

---

## FIX 2 — Render Backend Keep-Alive (Prevent Cold Starts)

- Add scheduled keep-alive ping script at `Backend/src/utils/keepAlive.js` using `node-cron` and `axios`.
- Ping `GET /api/v1/healthcheck` every 10 minutes to prevent Render free-tier container sleep.
- Import and start the cron job upon server listening in `Backend/src/index.js`.
- Add an elegant connection overlay on the frontend in `frontend/src/services/api.js` that triggers if an API call takes longer than 3 seconds (indicating a cold start/wake-up process).

---

## FIX 3 — Fix Short Token Expiry

- Update `ACCESS_TOKEN_EXPIRY=15m` and `REFRESH_TOKEN_EXPIRY=30d` in `.env` and `.env.sample`.
- Implement or ensure silent refresh in `frontend/src/services/api.js` is fully coordinated to exchange dead access tokens via `POST /auth/refresh-token` seamlessly and retry requests without logging the user out.

---

## FIX 4 — MediBot Multi-Turn Conversation History

- Maintain full session history (`chatHistory` array) in the frontend.
- Send the entire history list on every chat payload to the backend `POST /api/v1/agent/chat` endpoint.
- In the backend `agent.controllers.js`, initialize Gemini chat with `formattedHistory` using `model.startChat({ history })` to achieve true context-aware conversation in one session.

---

## FIX 5 — Convert MediBot to a Floating Widget

- Convert the MediBot chat panel into a floating circular chat bubble locked to the bottom-right corner.
- Toggle between a simple button bubble and a full panel (380px wide, 520px tall) fixed above content (`z-index: 50`).
- Ensure Redux state keeps `isOpen` and `chatHistory` persistent as the user navigates across different screens.

---

## FIX 6 — Add Skeleton Loading Screens

- Create `frontend/src/components/ui/skeleton.jsx` if missing.
- Refactor the Doctor listing, Appointments, and Doctor Profile pages to render shimmer skeletons rather than generic loading spinners while `isLoading` is active.

---

## FIX 7 — Add Open Graph and Meta Tags

- Add `og:title`, `og:description`, `og:image`, `og:url`, and `twitter:card` tags inside `frontend/index.html`.
- Set page `<title>` to `"MediCare — Book Doctor Appointments"`.

---

## FIX 8 — Add Swagger API Documentation

- Install `swagger-ui-express` and `swagger-jsdoc`.
- Create `Backend/src/config/swagger.js` configured with JWT Bearer authentication.
- Mount Swagger UI at `/api/v1/docs`.
- Annotate auth, appointment, and doctor routes with JSDoc `@swagger` comments.

---

## FIX 9 — Add Empty State Components

- Create a beautiful, reusable `EmptyState.jsx` component accepting Lucide icons, titles, descriptions, and CTAs.
- Integrate it into empty appointment listings, empty doctor searches, and empty notifications panels.

---

## FIX 10 — Gemini Model Name in Environment Variable

- Add `GEMINI_MODEL=gemini-2.5-flash` in `.env` and `.env.sample`.
- Replace hardcoded model strings with `process.env.GEMINI_MODEL`.
- Log a warning at startup inside `index.js` if the model variable is unconfigured.
