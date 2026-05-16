Web Push setup

1) Install dependency

  cd backend
  npm install

2) Generate VAPID keys

  node generate_vapid.js

 Copy `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` into your `.env`:

  VAPID_PUBLIC_KEY=...
  VAPID_PRIVATE_KEY=...
  VAPID_SUBJECT=mailto:you@example.com

3) Restart the server. Endpoints added:

- `GET /api/notifications/vapidPublicKey` — returns the public VAPID key
- `POST /api/notifications/subscribe` — body: { subscription, portalId? }
- `POST /api/notifications/send-test` — body: { portalId?, title, body, url }

4) Client integration

The frontend includes a helper at `src/services/push.js` which will:
- request notification permission
- obtain the VAPID key from the server
- subscribe using the ServiceWorker and send the subscription to the server

Make sure `sw.js` is registered (the project already registers it in `index.html`).
