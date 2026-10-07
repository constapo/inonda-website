/**
 * Inonda LTD: website form → "Inonda leads" spreadsheet.
 *
 * Install: open the spreadsheet → Extensions → Apps Script → paste this file →
 * Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone.
 * Copy the "/exec" URL; it goes into the forms' data-endpoint attribute.
 *
 * Each submission becomes one row (columns A–M) and, if NOTIFY_EMAIL is set,
 * one e-mail. After changing this file, create a NEW deployment version
 * (Deploy → Manage deployments → pencil → Version: New version).
 */

var NOTIFY_EMAIL = 'inonda2026@outlook.com'; // set to '' to turn e-mail alerts off
var MAX_PER_DAY = 150;                       // rows accepted per day, protects against flooding
var MIN_FILL_SECONDS = 3;                    // a human needs a few seconds to fill the form
var MAX_FIELD = 2000;                        // characters kept per field
var HEADERS = ['Date received', 'Name', 'Phone', 'Email', 'Language', 'Property type',
  'Area / city', 'Service needed', 'Source', 'Status', 'Next action', 'Follow-up date', 'Notes'];

/** Keeps text safe for a spreadsheet: no formulas, no control characters, bounded length. */
function clean_(value) {
  var s = String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (s.length > MAX_FIELD) s = s.slice(0, MAX_FIELD);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stops =HYPERLINK(...) style injection
  return s;
}

/** Returns an error code, or '' when the submission is acceptable. */
function validate_(d) {
  if (d.Website) return 'spam';                                   // hidden honeypot field was filled
  if (d._t !== undefined && Number(d._t) < MIN_FILL_SECONDS) return 'too-fast';
  if (!d.Name || String(d.Name).trim().length < 2) return 'name';
  var hasPhone = d.Phone && String(d.Phone).replace(/\D/g, '').length >= 6;
  var hasEmail = d.Email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.Email).trim());
  if (!hasPhone && !hasEmail) return 'contact';
  if (String(d.Consent || '').toLowerCase() !== 'yes') return 'consent';
  return '';
}

function languageOf_(page) {
  var m = String(page || '').match(/\/(el|en|ru|uk|he|ro)(\/|$)/);
  return m ? m[1].toUpperCase() : '';
}

/** Turns the posted form into one spreadsheet row (same order as HEADERS). */
function buildRow_(d, now) {
  var subject = String(d._subject || '');
  var isAssessment = /assessment|αξιολόγηση|оценк|оцінк|הערכת|evaluare/i.test(subject) || !!d['Property address'];
  var notes = [];
  if (d.Message) notes.push(clean_(d.Message));
  if (d.Units) notes.push('Units: ' + clean_(d.Units));
  if (d.Occupancy) notes.push('Occupancy: ' + clean_(d.Occupancy));
  if (d.Page) notes.push('Page: ' + clean_(d.Page));
  return [
    now,
    clean_(d.Name), clean_(d.Phone), clean_(d.Email),
    languageOf_(d.Page),
    clean_(d['Property type']), clean_(d['Property address']),
    isAssessment ? 'Free property assessment' : 'General enquiry',
    'Website form', 'New', '', '', notes.join(' | ')
  ];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var data = {};
    try { data = JSON.parse(e.postData.contents); } catch (err) { return json_({ success: false, error: 'bad-request' }); }
    var problem = validate_(data);
    if (problem === 'spam' || problem === 'too-fast') return json_({ success: true }); // say "ok" to bots, store nothing
    if (problem) return json_({ success: false, error: problem });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var props = PropertiesService.getScriptProperties();
    var today = Utilities.formatDate(new Date(), 'Europe/Nicosia', 'yyyy-MM-dd');
    var count = props.getProperty('day') === today ? Number(props.getProperty('count') || 0) : 0;
    if (count >= MAX_PER_DAY) return json_({ success: false, error: 'limit' });

    var row = buildRow_(data, Utilities.formatDate(new Date(), 'Europe/Nicosia', 'yyyy-MM-dd HH:mm'));
    // same person sending the same message twice within the last 20 rows counts once
    var last = sheet.getLastRow();
    if (last > 1) {
      var from = Math.max(2, last - 19);
      var recent = sheet.getRange(from, 1, last - from + 1, HEADERS.length).getValues();
      for (var i = 0; i < recent.length; i++) {
        if (recent[i][1] === row[1] && recent[i][2] === row[2] && recent[i][3] === row[3] && recent[i][12] === row[12]) {
          return json_({ success: true });
        }
      }
    }
    sheet.appendRow(row);
    props.setProperties({ day: today, count: String(count + 1) });

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New website lead: ' + row[1] + ' (' + row[7] + ')',
        body: HEADERS.map(function (h, i) { return row[i] ? h + ': ' + row[i] : ''; })
          .filter(String).join('\n') + '\n\nSpreadsheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }
    return json_({ success: true });
  } catch (err) {
    return json_({ success: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** Opening the web-app URL in a browser just says it is alive. */
function doGet() {
  return ContentService.createTextOutput('Inonda leads receiver is running.');
}

if (typeof module !== 'undefined') module.exports = { clean_: clean_, validate_: validate_, buildRow_: buildRow_, languageOf_: languageOf_, HEADERS: HEADERS };
