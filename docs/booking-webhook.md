# Booking webhook — Google Sheet receiver

The booking form sends each presentation request as a JSON `POST` to
`BOOKING_WEBHOOK_URL`. The website reports success to the visitor only when
the receiver answers 2xx **and** the reply is neither an HTML page nor
`{"ok": false}`.

The default receiver is a Google Sheet with a small Apps Script
(`docs/google-apps-script/presentation-webhook.gs`): free, owned by you,
one row per request, and an email to you for each one.

## Set it up (about 5 minutes)

1. Sign in to the Google account that should receive requests and create a
   new spreadsheet (<https://sheets.new>), e.g. "K8 presentation requests".
2. **Extensions → Apps Script.** Delete the sample code and paste the whole of
   `presentation-webhook.gs`. Replace `PASTE_TOKEN_HERE` with the token you
   were given (a long random string — keep it private). Save.
3. In the function menu choose **`setup`** and press **Run**. Google asks for
   permission to edit the spreadsheet and send email as you. Because this is
   your own unpublished script, Google shows "Google hasn't verified this
   app": choose **Advanced → Go to … (unsafe)** and **Allow**. You receive a
   "receiver is set up" email and a **Requests** tab appears.
4. **Deploy → New deployment →** gear icon **→ Web app.**
   *Execute as:* **Me**. *Who has access:* **Anyone**. **Deploy.**
5. Copy the **Web app URL** (it ends in `/exec`).

Then set, in Vercel → Project → Settings → Environment Variables (Production):

```
BOOKING_WEBHOOK_URL=https://script.google.com/macros/s/…/exec?token=<the same token>
```

and redeploy. The home page is static, so the form only switches on after a
redeploy.

"Who has access: Anyone" is required because the website's server posts
without a Google login. The token in the URL is what stops anyone else from
writing to the sheet; requests without it get `{"ok": false}`.

## Check it

- Open the URL with `?token=…` in a browser: `{"ok":true,"ready":true}`.
  Without the token: `{"ok":false,"error":"unauthorized"}`. A GET writes nothing.
- Send a test request from the live form; a row and an email should arrive.

## If you change the script

Edit, save, then **Deploy → Manage deployments → Edit → Version: New version →
Deploy**. That keeps the same URL. A *new deployment* would create a new URL,
which then has to be updated in Vercel.

## Other receivers

Any HTTPS endpoint works (Zapier "Catch Hook", Make, n8n, a CRM). If you set
`BOOKING_WEBHOOK_SECRET`, each request carries `X-Signature-SHA256`:
HMAC-SHA256 of the raw body. Apps Script can't read request headers, which is
why the Google receiver uses the URL token instead.
