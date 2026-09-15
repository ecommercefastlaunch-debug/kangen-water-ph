/**
 * Kangen Water PH — presentation request receiver (Google Apps Script).
 *
 * Paste into a Google Sheet's Extensions → Apps Script, set TOKEN, run
 * setup() once, then deploy as a Web app. Full steps: docs/booking-webhook.md
 *
 * Each request becomes one row in the "Requests" tab, and the script owner
 * gets an email with the visitor as reply-to. The website shows the visitor
 * a success message only when this script answers {"ok": true}.
 */

// Must match the ?token= value at the end of BOOKING_WEBHOOK_URL in Vercel.
const TOKEN = 'PASTE_TOKEN_HERE';

const SHEET_NAME = 'Requests';
const SEND_EMAIL = true; // email the script owner for each new request
const HEADERS = [
  'Received (Manila)',
  'Reference',
  'Full name',
  'Mobile',
  'Email',
  'City',
  'Preferred date',
  'Preferred time (Manila)',
  'Message',
  'Status',
];

function doPost(e) {
  if (!authorised_(e)) return reply_({ ok: false, error: 'unauthorized' });

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'bad_json' });
  }
  if (!data || data.type !== 'presentation_request' || !data.reference || !data.request) {
    return reply_({ ok: false, error: 'bad_payload' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = sheet_();
    const last = sheet.getLastRow();
    const seen = last > 1 ? sheet.getRange(2, 2, last - 1, 1).getValues().flat() : [];
    if (seen.indexOf(data.reference) === -1) {
      const r = data.request;
      sheet.appendRow([
        Utilities.formatDate(new Date(data.receivedAt), 'Asia/Manila', 'yyyy-MM-dd HH:mm'),
        data.reference,
        text_(r.fullName),
        "'" + r.mobile,
        text_(r.email),
        text_(r.city),
        "'" + r.preferredDate,
        "'" + r.preferredTime,
        text_(r.message || ''),
        'New',
      ]);
      if (SEND_EMAIL) {
        MailApp.sendEmail({
          to: Session.getEffectiveUser().getEmail(),
          replyTo: r.email,
          subject: 'K8 presentation request — ' + r.fullName + ', ' + r.city + ' (' + data.reference + ')',
          body: data.summary || JSON.stringify(r, null, 2),
        });
      }
    }
  } finally {
    lock.releaseLock();
  }

  return reply_({ ok: true });
}

/** GET with the right token confirms the receiver is deployed. It writes nothing. */
function doGet(e) {
  return reply_(authorised_(e) ? { ok: true, ready: true } : { ok: false, error: 'unauthorized' });
}

/** Run once from the editor: creates the tab and triggers Google's permission prompt. */
function setup() {
  sheet_();
  if (SEND_EMAIL) {
    MailApp.sendEmail(
      Session.getEffectiveUser().getEmail(),
      'Kangen Water PH receiver is set up',
      'Presentation requests from the website will appear in the "' + SHEET_NAME + '" tab of this spreadsheet:\n' +
        SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    );
  }
}

function authorised_(e) {
  return TOKEN !== 'PASTE_TOKEN_HERE' && e && e.parameter && e.parameter.token === TOKEN;
}

function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

/** Stops a visitor's text from being read as a spreadsheet formula. */
function text_(value) {
  const s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
