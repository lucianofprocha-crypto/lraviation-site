/* LR Aviation · US Ebola Attestation — offline PWA
   All data stays on the device (IndexedDB). No network calls except loading the app itself. */
'use strict';

const APP_VERSION = '1.1.0';
const RETENTION_DAYS = 42;
const QR_PREFIX = 'LRAE1.';
const QR_PREFIX_RAW = 'LRAE0.';
const CDC_URL = 'https://www.cdc.gov/port-health/legal-authorities/attestation-order.html';

const EXTRA = {
  en: { role: 'Who is attesting?', rolePax: 'Passenger', roleCrew: 'Crew member', crew: 'Crew', expCrew: 'Expected crew', crewNote: 'Crew: the CDC text names passengers only and does not clarify crew. As a precaution, this app collects an attestation from every crew member too.', setExpected: 'Enter expected passengers and crew (Edit) to confirm everyone on board has attested. No one boards without an attestation.', readyAll: 'Everyone on board attested — ready for boarding', fullText: 'Full disclosure and Privacy Act statement', expected: 'Expected passengers', savePDF: 'Save PDF copy', exportedOn: 'Exported', never: 'never', notes: 'Notes', persisted: 'Install to Home Screen so data is not cleared.', unsignedWarn: 'Some passengers are still pending.', delExpired: 'Delete expired flights', backupDone: 'Backup restored', fromQR: 'Passenger', import: 'Import', or: 'or', reqFields: 'Fill registration, departure, arrival and ETD.', effective: 'Applies to flights departing a foreign country at or after 3 Nov 2026 23:59 EST (4 Nov 04:59 UTC).' },
  pt: { role: 'Quem está declarando?', rolePax: 'Passageiro', roleCrew: 'Tripulante', crew: 'Tripulação', expCrew: 'Tripulantes previstos', crewNote: 'Tripulação: o texto do CDC cita só passageiros e não esclarece a tripulação. Por precaução, este app coleta a declaração de todos os tripulantes também.', setExpected: 'Informe passageiros e tripulantes previstos (Editar) para confirmar que todos a bordo declararam. Ninguém embarca sem declaração.', readyAll: 'Todos a bordo declararam — pronto para embarque', fullText: 'Aviso completo e declaração de privacidade', expected: 'Passageiros previstos', savePDF: 'Salvar cópia em PDF', exportedOn: 'Exportado', never: 'nunca', notes: 'Notas', persisted: 'Instale na Tela de Início para os dados não serem apagados.', unsignedWarn: 'Ainda há passageiros pendentes.', delExpired: 'Excluir voos expirados', backupDone: 'Backup restaurado', fromQR: 'Passageiro', import: 'Importar', or: 'ou', reqFields: 'Preencha matrícula, origem, destino e ETD.', effective: 'Vale para voos que decolam do exterior a partir de 3 nov 2026 23h59 EST (4 nov 04:59 UTC).' },
  es: { role: '¿Quién declara?', rolePax: 'Pasajero', roleCrew: 'Tripulante', crew: 'Tripulación', expCrew: 'Tripulantes previstos', crewNote: 'Tripulación: el texto del CDC menciona solo pasajeros y no aclara la tripulación. Por precaución, esta app recoge la declaración de todos los tripulantes también.', setExpected: 'Indique pasajeros y tripulantes previstos (Editar) para confirmar que todos a bordo declararon. Nadie embarca sin declaración.', readyAll: 'Todos a bordo declararon — listo para embarque', fullText: 'Aviso completo y declaración de privacidad', expected: 'Pasajeros previstos', savePDF: 'Guardar copia PDF', exportedOn: 'Exportado', never: 'nunca', notes: 'Notas', persisted: 'Instale en la pantalla de inicio para que no se borren los datos.', unsignedWarn: 'Aún hay pasajeros pendientes.', delExpired: 'Eliminar vuelos vencidos', backupDone: 'Respaldo restaurado', fromQR: 'Pasajero', import: 'Importar', or: 'o', reqFields: 'Complete matrícula, origen, destino y ETD.', effective: 'Aplica a vuelos que salen del extranjero desde el 3 nov 2026 23:59 EST (4 nov 04:59 UTC).' }
};

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2));
let LANG = 'en';
const t = k => (UI[LANG] && UI[LANG][k]) ?? (EXTRA[LANG] && EXTRA[LANG][k]) ?? (GSTR[LANG] && GSTR[LANG][k]) ?? UI.en[k] ?? EXTRA.en[k] ?? GSTR.en[k] ?? k;
const pad2 = n => String(n).padStart(2, '0');
const fmtUTC = iso => { if (!iso) return '—'; const d = new Date(iso); return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}Z`; };
const fmtDate = iso => { if (!iso) return '—'; const d = new Date(iso); return `${pad2(d.getUTCDate())} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const usDate = iso => { const d = new Date(iso); return `${pad2(d.getUTCMonth() + 1)}/${pad2(d.getUTCDate())}/${d.getUTCFullYear()}`; };
const localToISO = v => v ? new Date(v + ':00Z').toISOString() : '';
const isoToLocal = iso => iso ? new Date(iso).toISOString().slice(0, 16) : '';
const keepUntil = f => { const base = f.eta || f.etd; if (!base) return null; const d = new Date(base); d.setUTCDate(d.getUTCDate() + RETENTION_DAYS); return d.toISOString(); };
const isExpired = f => { const k = keepUntil(f); return k && Date.now() > new Date(k).getTime(); };
const upper = s => (s || '').trim().toUpperCase();
const isCrew = r => r.role === 'crew';
function tally(f, pax) {
  if (f.roster && f.roster.length) {
    const done = new Set(pax.filter(r => r.rosterId).map(r => r.rosterId));
    const rp = f.roster.filter(p => p.role !== 'crew'), rc = f.roster.filter(p => p.role === 'crew');
    const np = rp.filter(p => done.has(p.id)).length, nc = rc.filter(p => done.has(p.id)).length;
    return { np, nc, ep: rp.length, ec: rc.length, set: true, complete: np === rp.length && nc === rc.length, roster: true };
  }
  const np = pax.filter(r => !isCrew(r)).length, nc = pax.filter(isCrew).length;
  const ep = f.expected || 0, ec = f.expectedCrew || 0;
  return { np, nc, ep, ec, set: ep > 0 && ec > 0, complete: ep > 0 && ec > 0 && np >= ep && nc >= ec };
}

function toast(msg, ms = 2200) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), ms);
}

/* ---------- IndexedDB ---------- */
const DB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('lr-ebola-attestation', 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        db.createObjectStore('flights', { keyPath: 'id' });
        const p = db.createObjectStore('pax', { keyPath: 'id' });
        p.createIndex('flightId', 'flightId');
        db.createObjectStore('kv');
      };
      r.onsuccess = () => { this._db = r.result; res(r.result); };
      r.onerror = () => rej(r.error);
    });
  },
  async tx(store, mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tr = db.transaction(store, mode); const st = tr.objectStore(store);
      let out; const r = fn(st); if (r) r.onsuccess = () => { out = r.result; };
      tr.oncomplete = () => res(out); tr.onerror = () => rej(tr.error);
    });
  },
  all(store) { return this.tx(store, 'readonly', s => s.getAll()); },
  get(store, key) { return this.tx(store, 'readonly', s => s.get(key)); },
  put(store, val, key) { return this.tx(store, 'readwrite', s => key !== undefined ? s.put(val, key) : s.put(val)); },
  del(store, key) { return this.tx(store, 'readwrite', s => s.delete(key)); },
  async paxOf(flightId) { const db = await this.open(); return new Promise((res, rej) => { const r = db.transaction('pax').objectStore('pax').index('flightId').getAll(flightId); r.onsuccess = () => res(r.result.sort((a, b) => a.signedAt.localeCompare(b.signedAt))); r.onerror = () => rej(r.error); }); },
  async delFlight(id) { for (const p of await this.paxOf(id)) await this.del('pax', p.id); await this.del('flights', id); }
};

let SETTINGS = { lang: null, operator: '', reg: '' };
async function loadSettings() { const s = await DB.get('kv', 'settings'); if (s) SETTINGS = { ...SETTINGS, ...s }; }
async function saveSettings() { await DB.put('kv', SETTINGS, 'settings'); }

/* ---------- signature pad ---------- */
class SigPad {
  constructor(canvas) {
    this.c = canvas; this.strokes = []; this.cur = null;
    this.W = 600; this.H = 200;
    const ctx = this.ctx = canvas.getContext('2d');
    const resize = () => {
      const r = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr; canvas.height = r.height * dpr; this.redraw();
    };
    this._resize = resize; new ResizeObserver(resize).observe(canvas); resize();
    const pt = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * this.W, (e.clientY - r.top) / r.height * this.H]; };
    canvas.addEventListener('pointerdown', e => { e.preventDefault(); canvas.setPointerCapture(e.pointerId); this.cur = [pt(e)]; this.strokes.push(this.cur); this.redraw(); });
    canvas.addEventListener('pointermove', e => { if (!this.cur) return; e.preventDefault(); const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; for (const ev of evs) this.cur.push(pt(ev)); this.redraw(); });
    const end = () => { this.cur = null; };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }
  clear() { this.strokes = []; this.redraw(); }
  isEmpty() { return !this.strokes.some(s => s.length > 1) && this.strokes.length < 2; }
  redraw() { drawStrokes(this.ctx, this.strokes, this.c.width, this.c.height, this.W, this.H, getComputedStyle(this.c).color || '#0b2a5b'); }
}
function drawStrokes(ctx, strokes, w, h, W = 600, H = 200, color = '#0b2a5b') {
  ctx.clearRect(0, 0, w, h); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = Math.max(2, w / W * 2.6); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const sx = w / W, sy = h / H;
  for (const s of strokes) {
    if (!s.length) continue;
    if (s.length === 1) { ctx.beginPath(); ctx.arc(s[0][0] * sx, s[0][1] * sy, ctx.lineWidth / 2, 0, 7); ctx.fill(); continue; }
    ctx.beginPath(); ctx.moveTo(s[0][0] * sx, s[0][1] * sy);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i][0] * sx, s[i][1] * sy);
    ctx.stroke();
  }
}
function strokesToPNG(strokes, w = 900, h = 300) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  drawStrokes(c.getContext('2d'), strokes, w, h, 600, 200, '#0b2a5b');
  return c.toDataURL('image/png');
}

/* ---------- compact signature encoding (for QR) ---------- */
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
  let md = 0, mi = 0;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / L; if (d > md) { md = d; mi = i; } }
  if (md > eps) { const a = rdp(pts.slice(0, mi + 1), eps), b = rdp(pts.slice(mi), eps); return a.slice(0, -1).concat(b); }
  return [pts[0], pts[pts.length - 1]];
}
// 600x200 logical -> 255x85 grid, delta-coded int8
function encodeStrokes(strokes, eps) {
  const out = [Math.min(255, strokes.length)];
  for (const s0 of strokes.slice(0, 255)) {
    const s = rdp(s0.map(([x, y]) => [Math.round(Math.max(0, Math.min(600, x)) * 255 / 600), Math.round(Math.max(0, Math.min(200, y)) * 85 / 200)]), eps)
      .filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
    const pts = s.length ? s : [[0, 0]];
    const n = Math.min(65535, pts.length);
    out.push(n >> 8, n & 255, pts[0][0], pts[0][1]);
    for (let i = 1; i < n; i++) { out.push((pts[i][0] - pts[i - 1][0]) & 255, (pts[i][1] - pts[i - 1][1]) & 255); }
  }
  return new Uint8Array(out);
}
function decodeStrokes(bytes) {
  const res = []; let i = 0; const ns = bytes[i++];
  const s8 = v => v > 127 ? v - 256 : v;
  for (let k = 0; k < ns; k++) {
    const n = (bytes[i++] << 8) | bytes[i++]; let x = bytes[i++], y = bytes[i++];
    const s = [[x * 600 / 255, y * 200 / 85]];
    for (let j = 1; j < n; j++) { x += s8(bytes[i++]); y += s8(bytes[i++]); s.push([x * 600 / 255, y * 200 / 85]); }
    res.push(s);
  }
  return res;
}
const b64u = bytes => { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = str => { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, c => c.charCodeAt(0)); };
async function deflate(bytes) {
  if (!('CompressionStream' in window)) return null;
  const cs = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(cs).arrayBuffer());
}
async function inflate(bytes) {
  const ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(ds).arrayBuffer());
}
async function sha256hex(str) {
  if (!crypto.subtle) return '';
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}
// canonical content used for hash and duplicate detection
const canonical = r => JSON.stringify([r.role || 'pax', r.mode, r.signer, r.paxName, r.relation || '', r.signedAt, r.sig]);

async function recordToPayload(r) {
  const obj = { v: 1, c: isCrew(r) ? 1 : 0, m: r.mode === 'rep' ? 'r' : 's', s: r.signer, p: r.mode === 'rep' ? r.paxName : '', r: r.relation || '', t: Math.round(new Date(r.signedAt).getTime() / 1000), l: r.lang, g: r.sig };
  const raw = new TextEncoder().encode(JSON.stringify(obj));
  const z = await deflate(raw);
  return z ? QR_PREFIX + b64u(z) : QR_PREFIX_RAW + b64u(raw);
}
async function payloadToRecord(text) {
  text = (text || '').trim();
  const m = text.match(/LRAE[01]\.[A-Za-z0-9_-]+/); if (!m) throw new Error('bad');
  const s = m[0]; let bytes = unb64u(s.slice(6));
  if (s.startsWith(QR_PREFIX)) bytes = await inflate(bytes);
  const o = JSON.parse(new TextDecoder().decode(bytes));
  if (o.v !== 1 || !o.s || !o.g) throw new Error('bad');
  const rec = { role: o.c ? 'crew' : 'pax', mode: o.m === 'r' ? 'rep' : 'self', signer: o.s, paxName: o.m === 'r' ? o.p : o.s, relation: o.r || '', signedAt: new Date(o.t * 1000).toISOString(), lang: o.l || 'en', sig: o.g };
  rec.hash = await sha256hex(canonical(rec));
  return rec;
}
// produce sig string (base64url of encoded strokes), shrinking until the QR payload fits
async function buildSig(strokes) {
  for (const eps of [0.8, 1.2, 1.8, 2.5, 3.5, 5, 7]) {
    const sig = b64u(encodeStrokes(strokes, eps));
    const probe = await recordToPayload({ mode: 'rep', signer: 'X'.repeat(40), paxName: 'X'.repeat(40), relation: 'X'.repeat(20), signedAt: new Date().toISOString(), lang: 'en', sig });
    if (probe.length <= 900) return sig;
  }
  return b64u(encodeStrokes(strokes, 9));
}

/* ---------- PDF (official CDC form, filled) ---------- */
let _formBytes = null;
async function formBytes() { if (!_formBytes) _formBytes = new Uint8Array(await (await fetch('cdc-attestation-form.pdf')).arrayBuffer()); return _formBytes; }

function pdfSafe(font, s) {
  s = String(s ?? '');
  let set; try { set = new Set(font.getCharacterSet()); } catch { return s; }
  let out = '';
  for (const ch of s) {
    if (set.has(ch.codePointAt(0))) { out += ch; continue; }
    const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
    out += [...base].every(c => set.has(c.codePointAt(0))) ? base : '?';
  }
  return out;
}

async function buildPDF(records, flight) {
  records = [...records.filter(r => !isCrew(r)), ...records.filter(isCrew)];
  const { PDFDocument, StandardFonts, rgb, PDFName } = PDFLib;
  const out = await PDFDocument.create();
  out.setTitle('CDC Ebola passenger attestations' + (flight ? ` — ${flight.reg} ${flight.dep}-${flight.arr}` : ''));
  out.setProducer('LR Aviation US Ebola Attestation ' + APP_VERSION);
  const font = await out.embedFont(StandardFonts.Helvetica);
  const bold = await out.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.04, 0.16, 0.36), grey = rgb(0.35, 0.38, 0.42);
  const S = s => pdfSafe(font, s);

  if (flight) {
    let page = out.addPage([612, 792]); let y = 740;
    const fitSz = (txt, f, size, maxW) => { txt = pdfSafe(f, txt); while (size > 6.5 && f.widthOfTextAtSize(txt, size) > maxW) size -= 0.25; return size; };
    const clip = (txt, f, size, maxW) => { txt = pdfSafe(f, txt); while (txt.length > 3 && f.widthOfTextAtSize(txt, size) > maxW) txt = txt.slice(0, -2); return txt; };
    const T = tally(flight, records), extraN = T.roster ? records.filter(r => !r.rosterId).length : 0;
    const line = (txt, x, size = 10, f = font, color = rgb(0, 0, 0)) => page.drawText(pdfSafe(f, txt), { x, y, size, font: f, color });
    line('US-BOUND FLIGHT — PASSENGER ATTESTATIONS', 50, 15, bold, ink); y -= 16;
    line('CDC Order: Ebola passenger disclosure and attestation (Attachment A, OMB 0920-1474)', 50, 9, font, grey); y -= 30;
    const kv = [['Operator', flight.operator || '—'], ['Registration', flight.reg], ['Callsign / Flight no.', flight.callsign || '—'], ['Departure (last foreign airport)', flight.dep], ['Arrival (US)', flight.arr], ['ETD', fmtUTC(flight.etd)], ['ETA', fmtUTC(flight.eta)], ['Passengers attested', T.roster ? `${T.np} of ${T.ep} on GENDEC` + (extraN ? ` (+${extraN} not on GENDEC)` : '') : String(T.np) + (flight.expected ? ` of ${flight.expected} expected` : '')], ['Crew attested (precautionary)', T.roster ? `${T.nc} of ${T.ec} on GENDEC` : String(T.nc) + (flight.expectedCrew ? ` of ${flight.expectedCrew} expected` : '')], ['Retain until (arrival + 42 days)', fmtDate(keepUntil(flight))], ['PDF generated', fmtUTC(new Date().toISOString())]];
    for (const [k, v] of kv) { line(k, 50, 10, font, grey); line(v, 250, 10, bold); y -= 17; }
    if (flight.notes) { y -= 4; line('Notes: ' + flight.notes.slice(0, 110), 50, 9, font, grey); y -= 14; }
    y -= 14; line('MANIFEST', 50, 11, bold, ink); y -= 16;
    const cols = [50, 72, 245, 395, 490];
    const hdr = ['#', 'Name', 'Role / signed by', 'Signed (UTC)', 'Record SHA-256'];
    hdr.forEach((h, i) => line(h, cols[i], 8, bold, grey)); y -= 4;
    page.drawLine({ start: { x: 50, y }, end: { x: 562, y }, thickness: 0.5, color: grey }); y -= 12;
    records.forEach((r, i) => {
      if (y < 70) { page = out.addPage([612, 792]); y = 740; }
      line(String(i + 1), cols[0], 9); { const nm = r.paxName + (T.roster && !r.rosterId ? ' *' : ''), sz = fitSz(nm, bold, 9, 168); line(clip(nm, bold, sz, 168), cols[1], sz, bold); }
      line(clip(isCrew(r) ? 'CREW · self' : r.mode === 'rep' ? `PAX · ${r.signer} (${r.relation || ''})` : 'PAX · self', font, 8, 145), cols[2], 8);
      line(fmtUTC(r.signedAt), cols[3], 8); line((r.hash || '').slice(0, 16), cols[4], 7, font, grey); y -= 15;
    });
    if (flight.roster && flight.roster.length) {
      const done = new Set(records.map(r => r.rosterId));
      const missing = flight.roster.filter(p => !done.has(p.id));
      for (const p of missing) {
        if (y < 70) { page = out.addPage([612, 792]); y = 740; }
        line('—', cols[0], 9, font, rgb(0.7, 0.1, 0.1)); { const sz = fitSz(p.name, bold, 9, 168); line(clip(p.name, bold, sz, 168), cols[1], sz, bold, rgb(0.7, 0.1, 0.1)); }
        line((p.role === 'crew' ? 'CREW' : 'PAX') + ' · NOT ATTESTED', cols[2], 8, bold, rgb(0.7, 0.1, 0.1)); y -= 15;
      }
      y -= 4; line(`Source list: GENDEC (${flight.roster.filter(p => p.role === 'crew').length} crew, ${flight.roster.filter(p => p.role !== 'crew').length} passengers). Passport numbers and dates of birth not stored.${extraN ? ' * = not on GENDEC.' : ''}`, 50, 7.5, font, grey); y -= 12;
    }
    y -= 10; if (y < 120) { page = out.addPage([612, 792]); y = 740; }
    const notes = [
      'Each attestation follows on the official CDC form (Attachment A), one per person.',
      'Crew attestations are collected as a precaution: the CDC order does not explicitly state whether crew must attest.',
      'Keep this file for at least 42 days after arrival in the United States and provide it to the U.S. Government on request.',
      'Attestations are not transmitted through APIS. Collection method: electronic signature captured at or before boarding.',
      'Generated offline with LR Aviation US Ebola Attestation (lraviation.com.br) — not affiliated with CDC.'
    ];
    for (const n of notes) { line('• ' + n, 50, 8, font, grey); y -= 12; }
  }

  const src = await PDFDocument.load(await formBytes());
  for (const r of records) {
    const [p1, p2] = await out.copyPages(src, [0, 1]);
    p1.node.delete(PDFName.of('Annots')); p2.node.delete(PDFName.of('Annots'));
    out.addPage(p1); out.addPage(p2);
    const tx = (s, x, y, size = 10, f = font) => p1.drawText(pdfSafe(f, s), { x, y, size, font: f, color: ink });
    const fit = (s, maxW, size = 10) => { s = S(s); while (size > 6 && font.widthOfTextAtSize(s, size) > maxW) size -= 0.5; return size; };
    tx(r.signer, 44, 532, fit(r.signer, 230));
    if (r.mode === 'rep') {
      tx('X', 39.6, 364.3, 12, bold);
      tx(r.paxName, 127, 364, fit(r.paxName, 265));
      tx(r.relation, 164, 334, fit(r.relation, 165));
    } else {
      tx('X', 39.6, 404.3, 12, bold);
    }
    tx(r.signer, 38, 189, fit(r.signer, 310));
    const png = await out.embedPng(strokesToPNG(decodeStrokes(unb64u(r.sig))));
    p1.drawImage(png, { x: 95, y: 145, width: 99, height: 33 });
    tx(usDate(r.signedAt), 69, 124);
    const meta = [
      `${isCrew(r) ? 'CREW MEMBER (precautionary) · ' : ''}Electronic attestation · signed ${fmtUTC(r.signedAt)} · ${r.method === 'device' ? 'signed on operator device' : r.method === 'qr' ? 'received by QR from passenger device' : r.method === 'file' ? 'received as file from passenger device' : 'passenger copy'}`,
      (flight ? `Flight: ${flight.reg}${flight.callsign ? ' / ' + flight.callsign : ''}  ${flight.dep}-${flight.arr}  ETD ${fmtUTC(flight.etd)}  · ` : '') + `Record SHA-256: ${r.hash || '—'}`
    ];
    p1.drawText(S(meta[0]), { x: 330, y: 132, size: 6.5, font, color: grey, maxWidth: 240, lineHeight: 8 });
    p1.drawText(S(meta[1]), { x: 330, y: 114, size: 5.5, font, color: grey, maxWidth: 240, lineHeight: 7 });
  }
  return await out.save();
}

async function deliverFile(bytes, name, mime) {
  const file = new File([bytes], name, { type: mime });
  if (window.claude && window.claude.use) {
    try {
      const dl = await window.claude.use('downloads');
      if (dl) { try { await dl.save({ filename: name, data: file }); return true; } catch (e) { if (e && e.code === 'declined') return false; } }
    } catch { }
  }
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return true; } catch (e) { if (e.name === 'AbortError') return false; }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return true;
}
const fileStem = f => [f.reg, f.callsign, `${f.dep}-${f.arr}`, (f.etd || '').slice(0, 10).replace(/-/g, '')].filter(Boolean).join('_').replace(/[^A-Za-z0-9_-]/g, '');

/* ---------- QR ---------- */
function qrSVG(text) {
  const q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make();
  return q.createSvgTag({ cellSize: 4, margin: 4, scalable: true }).replace('<svg ', '<svg shape-rendering="crispEdges" ');
}

/* ---------- rendering ---------- */
const view = () => $('#view');
function setTitle(sub) { $('#crumb').textContent = sub || ''; }

function langChips(cur, attr = 'data-setlang') {
  return `<div class="chips">${['en', 'pt', 'es'].map(l => `<button class="chip ${l === cur ? 'on' : ''}" ${attr}="${l}">${l.toUpperCase()}</button>`).join('')}</div>`;
}

async function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [r, id, rid] = h.split('/');
  document.body.classList.toggle('paxmode', r === 'p');
  $('#tabs').hidden = r === 'p';
  document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.r === (r || 'home') || (a.dataset.r === 'home' && ['f', 'edit', 'sign', 'scan', 'link', 'gd'].includes(r))));
  window.scrollTo(0, 0);
  stopScan();
  try {
    if (r === 'p') return renderPaxSelf();
    if (r === 'f' && id) return renderFlight(id);
    if (r === 'edit') return renderFlightForm(id);
    if (r === 'sign' && id) return renderSign(id, null, rid);
    if (r === 'gd') return renderGendec(id);
    if (r === 'scan' && id) return renderScan(id);
    if (r === 'link') return renderLink(id);
    if (r === 'settings') return renderSettings();
    return renderHome();
  } catch (e) { console.error(e); view().innerHTML = `<div class="card warn">${esc(e.message)}</div>`; }
}

async function renderHome() {
  setTitle(t('flights'));
  const flights = (await DB.all('flights')).sort((a, b) => (b.etd || '').localeCompare(a.etd || ''));
  const byF = {}; for (const p of await DB.all('pax')) (byF[p.flightId] = byF[p.flightId] || []).push(p);
  const expired = flights.filter(isExpired);
  view().innerHTML = `
    <div class="hero"><h1>${esc(t('appName'))}</h1><p>${esc(t('tagline'))}</p><p class="small">${esc(t('effective'))}</p></div>
    <div class="row gap wrap"><a class="btn primary big" href="#/edit">＋ ${esc(t('newFlight'))}</a><label class="btn big">⇪ ${esc(t('importGD'))}<input type="file" id="gdimp" accept=".pdf,.csv,.txt,application/pdf,text/csv" hidden></label><a class="btn big" href="#/link">⌁ ${esc(t('sendLink'))}</a></div>
    ${flights.length ? '' : `<div class="card muted">${esc(t('noFlights'))}</div>`}
    <div class="list">${flights.map(f => {
      const T = tally(f, byF[f.id] || []), exp = isExpired(f), ok = T.complete;
      return `<a class="item" href="#/f/${f.id}">
        <div class="item-main"><div class="route">${esc(f.dep)} <span class="arrow">→</span> ${esc(f.arr)}</div>
        <div class="sub">${esc(f.reg)}${f.callsign ? ' · ' + esc(f.callsign) : ''} · ${esc(fmtUTC(f.etd))}</div></div>
        <div class="item-side"><span class="pill ${ok ? 'ok' : 'pend'}">${esc(t('rolePax'))} ${T.np}${T.ep ? '/' + T.ep : ''} · ${esc(t('crew'))} ${T.nc}${T.ec ? '/' + T.ec : ''}</span>
        <span class="small ${exp ? 'expired' : ''}">${exp ? esc(t('expired')) : esc(t('keepUntil')) + ' ' + esc(fmtDate(keepUntil(f)))}</span></div></a>`;
    }).join('')}</div>
    ${expired.length ? `<button class="btn danger" id="delExp">${esc(t('delExpired'))} (${expired.length})</button>` : ''}`;
  $('#gdimp').onchange = e => startGendecImport(e.target.files[0], null);
  const de = $('#delExp'); if (de) de.onclick = async () => { if (!(await ask(t('confirmDelFlight')))) return; for (const f of expired) await DB.delFlight(f.id); route(); };
}

async function renderFlightForm(id) {
  const f = id ? await DB.get('flights', id) : { reg: SETTINGS.reg, operator: SETTINGS.operator };
  setTitle(id ? t('edit') : t('newFlight'));
  view().innerHTML = `<form class="card form" id="ff">
    <h2>${esc(id ? t('edit') : t('newFlight'))}</h2>
    <label>${esc(t('operator'))}<input name="operator" value="${esc(f.operator || '')}" autocomplete="organization"></label>
    <div class="grid2"><label>${esc(t('reg'))}*<input name="reg" value="${esc(f.reg || '')}" required autocapitalize="characters"></label>
    <label>${esc(t('callsign'))}<input name="callsign" value="${esc(f.callsign || '')}" autocapitalize="characters"></label></div>
    <div class="grid2"><label>${esc(t('dep'))}*<input name="dep" value="${esc(f.dep || '')}" required maxlength="4" placeholder="ICAO" autocapitalize="characters"></label>
    <label>${esc(t('arr'))}*<input name="arr" value="${esc(f.arr || '')}" required maxlength="4" placeholder="ICAO" autocapitalize="characters"></label></div>
    <div class="grid2"><label>${esc(t('etd'))}*<input type="datetime-local" name="etd" value="${esc(isoToLocal(f.etd))}" required></label>
    <label>${esc(t('eta'))}<input type="datetime-local" name="eta" value="${esc(isoToLocal(f.eta))}"></label></div>
    <div class="grid2"><label>${esc(t('expected'))}<input type="number" min="0" max="999" name="expected" value="${esc(f.expected || '')}" inputmode="numeric"></label>
    <label>${esc(t('expCrew'))}<input type="number" min="0" max="99" name="expectedCrew" value="${esc(f.expectedCrew || '')}" inputmode="numeric"></label></div>
    <label>${esc(t('notes'))}<input name="notes" value="${esc(f.notes || '')}"></label>
    <div class="row gap"><button class="btn primary" type="submit">${esc(t('save'))}</button><a class="btn" href="${id ? '#/f/' + id : '#/'}">${esc(t('cancel'))}</a></div>
  </form>`;
  $('#ff').onsubmit = async e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
    if (!d.reg || !d.dep || !d.arr || !d.etd) return toast(t('reqFields'));
    const rec = { ...(id ? f : { id: uid(), createdAt: new Date().toISOString(), checks: {} }), operator: d.operator.trim(), reg: upper(d.reg), callsign: upper(d.callsign), dep: upper(d.dep), arr: upper(d.arr), etd: localToISO(d.etd), eta: localToISO(d.eta), expected: d.expected ? +d.expected : null, expectedCrew: d.expectedCrew ? +d.expectedCrew : null, notes: d.notes.trim() };
    await DB.put('flights', rec);
    if (!SETTINGS.operator && rec.operator) { SETTINGS.operator = rec.operator; saveSettings(); }
    location.hash = '#/f/' + rec.id;
  };
}

async function renderFlight(id) {
  const f = await DB.get('flights', id); if (!f) { location.hash = '#/'; return; }
  const pax = await DB.paxOf(id);
  setTitle(`${f.dep} → ${f.arr}`);
  const n = pax.length, T = tally(f, pax), complete = T.complete;
  const exp = isExpired(f);
  f.checks = f.checks || {};
  const ck = k => `<label class="check"><input type="checkbox" data-ck="${k}" ${f.checks[k] ? 'checked' : ''}> ${esc(t(k))}</label>`;
  view().innerHTML = `
    <div class="card flight">
      <div class="route big">${esc(f.dep)} <span class="arrow">→</span> ${esc(f.arr)}</div>
      <div class="sub">${esc(f.reg)}${f.callsign ? ' · ' + esc(f.callsign) : ''}${f.operator ? ' · ' + esc(f.operator) : ''}</div>
      <div class="kv"><span>ETD</span><b>${esc(fmtUTC(f.etd))}</b><span>ETA</span><b>${esc(fmtUTC(f.eta))}</b>
      <span>${esc(t('keepUntil'))}</span><b class="${exp ? 'expired' : ''}">${esc(fmtDate(keepUntil(f)))}</b>
      <span>${esc(t('exportedOn'))}</span><b>${f.exportedAt ? esc(fmtUTC(f.exportedAt)) : esc(t('never'))}</b></div>
      ${f.notes ? `<div class="small muted">${esc(f.notes)}</div>` : ''}
      <div class="row gap wrap"><a class="btn small" href="#/edit/${f.id}">${esc(t('edit'))}</a><button class="btn small danger" id="delF">${esc(t('del'))}</button></div>
    </div>
    <div class="banner ${complete ? 'ok' : T.set ? 'stop' : 'neutral'}"><span>${complete ? '✓ ' + esc(t('readyAll')) : T.set ? '⛔ ' + esc(t('notReady')) : 'ⓘ ' + esc(t('setExpected'))}</span>
      <span class="count small-count">${esc(t('rolePax'))} ${T.np}${T.ep ? '/' + T.ep : ''}<br>${esc(t('crew'))} ${T.nc}${T.ec ? '/' + T.ec : ''}</span></div>
    ${exp ? `<div class="card warn">${esc(t('expired'))}</div>` : ''}
    ${!isUSAirport(f.arr) ? `<div class="banner neutral">ⓘ ${esc(t('notUS'))}</div>` : ''}${isUSAirport(f.dep) ? `<div class="banner neutral">ⓘ ${esc(t('depUS'))}</div>` : ''}
    <div class="row gap wrap actions">
      <a class="btn primary big" href="#/sign/${f.id}">✍︎ ${esc(t('addPax'))}</a>
      <a class="btn big" href="#/scan/${f.id}">⌗ ${esc(t('scanQR'))}</a>
      <label class="btn big">⇪ ${esc(t('importFile'))}<input type="file" id="imp" accept=".txt,.lrae,text/plain,image/*" multiple hidden></label>
      <label class="btn big">⇪ ${esc(t('importGD'))}<input type="file" id="gdimp" accept=".pdf,.csv,.txt,application/pdf,text/csv" hidden></label>
    </div>
    ${T.roster ? rosterHTML(f, pax) : paxListHTML(t('passengers'), pax.filter(r => !isCrew(r))) + paxListHTML(t('crew'), pax.filter(isCrew))}
    <div class="row gap wrap"><button class="btn primary" id="pdf" ${n ? '' : 'disabled'}>⤓ ${esc(t('exportPDF'))}</button></div>
    <div class="card"><h3>${esc(t('checklist'))}</h3>${ck('ck1')}${ck('ck3')}${ck('ck2')}<p class="small muted">${esc(t('crewNote'))}</p></div>`;
  $('#delF').onclick = async () => { if (await ask(t('confirmDelFlight'))) { await DB.delFlight(id); location.hash = '#/'; } };
  view().querySelectorAll('[data-delpax]').forEach(b => b.onclick = async () => { if (await ask(t('confirmDelPax'))) { await DB.del('pax', b.dataset.delpax); route(); } });
  view().querySelectorAll('[data-ck]').forEach(c => c.onchange = async () => { f.checks[c.dataset.ck] = c.checked; await DB.put('flights', f); });
  $('#imp').onchange = async e => { await importFiles(f, [...e.target.files]); e.target.value = ''; route(); };
  $('#gdimp').onchange = e => startGendecImport(e.target.files[0], f.id);
  view().querySelectorAll('[data-link]').forEach(sel => sel.onchange = async () => { const r = pax.find(x => x.id === sel.dataset.link); if (r && sel.value) { r.rosterId = sel.value; await DB.put('pax', r); route(); } });
  view().querySelectorAll('[data-rmp]').forEach(b => b.onclick = async () => { if (await ask(t('confirmRemoveP'))) { f.roster = f.roster.filter(p => p.id !== b.dataset.rmp); f.expected = f.roster.filter(p => p.role !== 'crew').length; f.expectedCrew = f.roster.filter(p => p.role === 'crew').length; await DB.put('flights', f); route(); } });
  $('#pdf').onclick = async () => {
    const b = $('#pdf'); b.disabled = true; b.textContent = '…';
    try {
      const bytes = await buildPDF(pax, f);
      const ok = await deliverFile(bytes, `EBOLA-ATTESTATIONS_${fileStem(f)}.pdf`, 'application/pdf');
      if (ok) { f.exportedAt = new Date().toISOString(); f.checks.ck2 = true; await DB.put('flights', f); }
    } catch (e) { console.error(e); toast('PDF error: ' + e.message, 4000); }
    route();
  };
}

function rosterHTML(f, pax) {
  const byR = {}; pax.forEach(r => { if (r.rosterId) byR[r.rosterId] = r; });
  const pending = f.roster.filter(p => !byR[p.id]);
  const row = (p, i) => { const r = byR[p.id]; return `<div class="item pax ${r ? 'done' : 'todo'}">
      ${r ? `<img class="sigthumb" alt="" src="${strokesToPNG(decodeStrokes(unb64u(r.sig)), 240, 80)}">` : `<span class="sigthumb empty" aria-hidden="true"></span>`}
      <div class="item-main"><div class="name">${i + 1}. ${esc(p.name)} ${p.rank ? `<span class="tag">${esc(p.rank)}</span>` : ''} ${p.minor ? `<span class="tag warn">${esc(t('minor'))}</span>` : ''}</div>
      <div class="sub">${r ? `<span class="okc">✓ ${esc(t('signed'))}</span> · ${r.mode === 'rep' ? esc(t('rep').split(' (')[0]) + ': ' + esc(r.signer) + ' (' + esc(r.relation) + ') · ' : ''}${esc(fmtUTC(r.signedAt))} · ${esc(t(r.method === 'device' ? 'mDevice' : r.method === 'qr' ? 'mQR' : 'mFile'))}` : `<span class="warnc">● ${esc(t('pending'))}</span>${p.minor ? ' · ' + esc(t('minorHint')) : ''}`}</div></div>
      ${r ? `<button class="btn small ghost" data-delpax="${r.id}" aria-label="${esc(t('del'))}">✕</button>` : `<a class="btn small primary" href="#/sign/${f.id}/${p.id}">✍︎ ${esc(t('signNow'))}</a><button class="btn small ghost" data-rmp="${p.id}" title="${esc(t('removeP'))}" aria-label="${esc(t('removeP'))}">✕</button>`}</div>`; };
  const crew = f.roster.filter(p => p.role === 'crew'), px = f.roster.filter(p => p.role !== 'crew');
  const extra = pax.filter(r => !r.rosterId || !f.roster.some(p => p.id === r.rosterId));
  return `<h3>${esc(t('crew'))} (${crew.filter(p => byR[p.id]).length}/${crew.length})</h3><div class="list">${crew.map(row).join('')}</div>
    <h3>${esc(t('passengers'))} (${px.filter(p => byR[p.id]).length}/${px.length})</h3><div class="list">${px.map(row).join('')}</div>
    ${extra.length ? `<h3 class="warnc">${esc(t('notOnList'))} (${extra.length})</h3><div class="list">${extra.map(r => `<div class="item pax">
      <img class="sigthumb" alt="" src="${strokesToPNG(decodeStrokes(unb64u(r.sig)), 240, 80)}">
      <div class="item-main"><div class="name">${esc(r.paxName)}</div><div class="sub">${esc(isCrew(r) ? t('roleCrew') : t('rolePax'))} · ${esc(fmtUTC(r.signedAt))}</div>
      ${pending.length ? `<select class="linksel" data-link="${r.id}"><option value="">${esc(t('linkTo'))}</option>${pending.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>` : ''}</div>
      <button class="btn small ghost" data-delpax="${r.id}" aria-label="${esc(t('del'))}">✕</button></div>`).join('')}</div>` : ''}`;
}
function paxListHTML(title, list) {
  return `<h3>${esc(title)} (${list.length})</h3><div class="list">${list.map((p, i) => `<div class="item pax">
      <img class="sigthumb" alt="" src="${strokesToPNG(decodeStrokes(unb64u(p.sig)), 240, 80)}">
      <div class="item-main"><div class="name">${i + 1}. ${esc(p.paxName)}</div>
      <div class="sub">${p.mode === 'rep' ? esc(t('rep').split(' (')[0]) + ': ' + esc(p.signer) + ' (' + esc(p.relation) + ') · ' : ''}${esc(fmtUTC(p.signedAt))} · ${esc(t(p.method === 'device' ? 'mDevice' : p.method === 'qr' ? 'mQR' : 'mFile'))}</div></div>
      <button class="btn small ghost" data-delpax="${p.id}" aria-label="${esc(t('del'))}">✕</button></div>`).join('') || `<div class="card muted small">${esc(t('pending'))}…</div>`}</div>`;
}
async function addRecordToFlight(f, rec, method, quiet) {
  const existing = await DB.paxOf(f.id);
  if (existing.some(p => p.hash && p.hash === rec.hash)) { if (!quiet) toast(t('dup')); return false; }
  const rosterId = rec.rosterId || matchRoster(f, rec, existing);
  await DB.put('pax', { ...rec, rosterId: rosterId || null, id: uid(), flightId: f.id, method, importedAt: new Date().toISOString() });
  return true;
}
async function importFiles(f, files) {
  let ok = 0, bad = 0, dup = 0;
  for (const file of files) {
    try {
      let text;
      if (file.type.startsWith('image/')) text = await decodeQRFromImage(file);
      else text = await file.text();
      const rec = await payloadToRecord(text);
      if (await addRecordToFlight(f, rec, file.type.startsWith('image/') ? 'qr' : 'file', true)) ok++; else dup++;
    } catch (e) { console.warn(e); bad++; }
  }
  toast(`${t('imported')}: ${ok}${dup ? ' · ' + t('dup') + ': ' + dup : ''}${bad ? ' · ' + t('badQR') + ': ' + bad : ''}`, 3500);
}

/* attestation form, shared by operator-device and passenger self-service */
function attestFormHTML(textLang) {
  const A = ATTEST[textLang];
  return `
    <div class="attest card">
      <div class="row between"><span class="small muted">${esc(t('textLang'))}</span>${langChips(textLang, 'data-textlang')}</div>
      <p class="note ${A.official ? 'official' : 'unofficial'}">${esc(A.official ? t('officialNote') : t('unofficialNote'))}</p>
      <h2 class="doc-title">${esc(A.title)}</h2>
      <p class="small">${esc(A.lead)}</p>
      <p>${esc(A.readPre)} <b class="fillname">[ … ]</b> ${esc(A.readPost)}</p>
      <details><summary>${esc(t('fullText'))}</summary>${A.more.map(p => `<p class="small">${esc(p)}</p>`).join('')}<p class="small muted">${esc(A.omb)}</p></details>
    </div>
    <form class="card form" id="af">
      <fieldset class="opts roles"><legend>${esc(t('role'))}</legend>
        <div class="seg"><label><input type="radio" name="role" value="pax" checked><span>${esc(t('rolePax'))}</span></label><label><input type="radio" name="role" value="crew"><span>${esc(t('roleCrew'))}</span></label></div>
      </fieldset>
      <fieldset class="opts"><legend>${esc(A.checkOne)}</legend>
        <label class="opt"><input type="radio" name="mode" value="self" checked><span><b>${esc(t('self'))}</b><br>${esc(A.opt1)}</span></label>
        <label class="opt" id="optRep"><input type="radio" name="mode" value="rep"><span><b>${esc(t('rep'))}</b><br>${esc(A.opt2)}</span></label>
      </fieldset>
      <label id="lblSigner">${esc(t('name'))}<input name="signer" required autocomplete="name"></label>
      <div id="repFields" hidden>
        <label>${esc(t('name'))}<input name="paxName"></label>
        <label>${esc(t('relation'))}<input name="relation"></label>
      </div>
      <p class="small">${esc(A.truth)}</p>
      <div class="row between"><span>${esc(t('sign'))}</span><button type="button" class="btn small ghost" id="clr">${esc(t('clear'))}</button></div>
      <canvas class="sigpad" id="sig"></canvas>
      <div class="row between small muted"><span>Date: ${esc(usDate(new Date().toISOString()))} (UTC)</span><span>${esc(ATTEST.en.omb)}</span></div>
      <button class="btn primary big full" type="submit">${esc(t('confirm'))}</button>
    </form>`;
}
function wireAttestForm(textLang, rerender, onDone) {
  const pad = new SigPad($('#sig'));
  const form = $('#af');
  view().querySelectorAll('[data-textlang]').forEach(b => b.onclick = () => rerender(b.dataset.textlang));
  const sync = () => {
    const crew = form.role.value === 'crew';
    $('#optRep').hidden = crew; if (crew && form.mode.value === 'rep') form.mode.value = 'self';
    const rep = form.mode.value === 'rep';
    $('#repFields').hidden = !rep;
    $('#lblSigner').firstChild.textContent = rep ? t('repName') : t('name');
    $('.fillname').textContent = form.signer.value.trim() || '[ … ]';
  };
  form.addEventListener('change', sync); form.signer.addEventListener('input', sync); sync();
  $('#clr').onclick = () => pad.clear();
  form.onsubmit = async e => {
    e.preventDefault();
    const mode = form.mode.value, signer = form.signer.value.trim().replace(/\s+/g, ' ');
    const paxName = mode === 'rep' ? form.paxName.value.trim().replace(/\s+/g, ' ') : signer;
    const relation = mode === 'rep' ? form.relation.value.trim() : '';
    if (!signer) return toast(t('needName'));
    if (mode === 'rep' && (!paxName || !relation)) return toast(t('needRep'));
    if (pad.isEmpty()) return toast(t('needSig'));
    const rec = { role: form.role.value, mode, signer, paxName, relation, signedAt: new Date().toISOString(), lang: textLang, sig: await buildSig(pad.strokes) };
    rec.hash = await sha256hex(canonical(rec));
    onDone(rec);
  };
}

async function renderSign(id, textLang, rid) {
  const f = await DB.get('flights', id); if (!f) { location.hash = '#/'; return; }
  textLang = textLang || LANG;
  const person = rid && f.roster ? f.roster.find(p => p.id === rid) : null;
  setTitle(`${f.dep} → ${f.arr} · ${person ? person.name : t('addPax')}`);
  view().innerHTML = `<div class="row"><a class="btn small ghost" href="#/f/${id}">‹ ${esc(t('back'))}</a></div>`
    + (person ? `<div class="card who"><div class="name">${esc(person.name)} ${person.rank ? `<span class="tag">${esc(person.rank)}</span>` : ''} ${person.minor ? `<span class="tag warn">${esc(t('minor'))}</span>` : ''}</div>${person.minor ? `<p class="small warnc">${esc(t('minorHint'))}</p>` : ''}</div>` : '')
    + attestFormHTML(textLang);
  if (person) {
    const form = $('#af');
    form.role.value = person.role === 'crew' ? 'crew' : 'pax';
    form.querySelectorAll('input[name=role]').forEach(r => { if (r.value !== form.role.value) r.disabled = true; });
    if (person.minor && person.role !== 'crew') { form.mode.value = 'rep'; form.paxName.value = person.name; form.paxName.readOnly = true; }
    else form.signer.value = person.name;
  }
  wireAttestForm(textLang, l => renderSign(id, l, rid), async rec => {
    if (person) rec.rosterId = person.id;
    await addRecordToFlight(f, rec, 'device');
    const recs = await DB.paxOf(id); const done = new Set(recs.map(r => r.rosterId));
    const next = f.roster ? f.roster.find(p => !done.has(p.id)) : null;
    showOverlay(`<div class="big-ok">✓</div><h2>${esc(t('savedOK'))}</h2><p>${esc(rec.paxName)}</p><p class="muted">${esc(t('handBack'))}</p>
      ${f.roster && !next ? `<p class="okc">${esc(t('allDone'))}</p>` : ''}
      <div class="row gap center wrap">${f.roster ? (next ? `<button class="btn primary" data-act="next">${esc(t('nextPending'))}: ${esc(next.name)}</button>` : '') : `<button class="btn primary" data-act="next">${esc(t('newOne'))}</button>`}<button class="btn" data-act="done">${esc(t('close'))}</button></div>`,
      act => { if (act === 'next') { if (next) location.hash = `#/sign/${id}/${next.id}`; else renderSign(id, textLang); } else location.hash = '#/f/' + id; });
  });
}

function renderPaxSelf(textLang) {
  textLang = textLang || LANG;
  setTitle(t('paxModeTitle'));
  view().innerHTML = `<div class="hero"><h1>${esc(t('paxModeTitle'))}</h1><p>${esc(t('paxModeIntro'))}</p>${langChips(LANG)}</div>` + attestFormHTML(textLang);
  wireLangChips();
  wireAttestForm(textLang, l => renderPaxSelf(l), async rec => {
    const payload = await recordToPayload(rec);
    view().innerHTML = `<div class="card center qrcard">
      <h2>${esc(rec.paxName)}</h2><p class="muted">${esc(t('showQR'))}</p>
      <div class="qr">${qrSVG(payload)}</div>
      <p class="small muted">${esc(fmtUTC(rec.signedAt))} · ${esc(rec.hash.slice(0, 12))}</p>
      <div class="row gap wrap center">
        <button class="btn primary" id="shf">⇪ ${esc(t('shareFile'))}</button>
        <button class="btn" id="spdf">⤓ ${esc(t('savePDF'))}</button>
        <button class="btn" id="nxt">${esc(t('newOne'))}</button></div></div>`;
    const stem = rec.paxName.replace(/[^A-Za-z0-9]+/g, '_').slice(0, 40) || 'passenger';
    $('#shf').onclick = () => deliverFile(new TextEncoder().encode(payload + '\n'), `ebola-attestation_${stem}.txt`, 'text/plain');
    $('#spdf').onclick = async () => { const bytes = await buildPDF([{ ...rec, method: 'self' }], null); deliverFile(bytes, `ebola-attestation_${stem}.pdf`, 'application/pdf'); };
    $('#nxt').onclick = () => renderPaxSelf(textLang);
  });
}

const PROD_URL = 'https://lraviation.com.br/ebola/';
function paxLink() { return (/lraviation\.com\.br$/.test(location.hostname) ? location.origin + location.pathname.replace(/index\.html$/, '') : PROD_URL) + '#/p'; }
function renderLink() {
  setTitle(t('sendLink'));
  const url = paxLink();
  view().innerHTML = `<div class="card center"><h2>${esc(t('linkTitle'))}</h2><p class="muted">${esc(t('linkIntro'))}</p>
    <div class="qr">${qrSVG(url)}</div><p class="mono">${esc(url)}</p>
    <div class="row gap center"><button class="btn primary" id="cp">${esc(t('copy'))}</button>${navigator.share ? `<button class="btn" id="sh">⇪</button>` : ''}</div></div>`;
  $('#cp').onclick = async () => { try { await navigator.clipboard.writeText(url); toast(t('copied')); } catch { const m = view().querySelector('.mono'); const r = document.createRange(); r.selectNodeContents(m); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); } };
  const sh = $('#sh'); if (sh) sh.onclick = () => navigator.share({ url, title: t('appName') }).catch(() => {});
}

/* ---------- GENDEC import ---------- */
let PENDING_GD = null;
async function startGendecImport(file, flightId) {
  if (!file) return;
  toast('…', 1500);
  try {
    const gd = await readManifestFile(file);
    if (!gd.people || !gd.people.length) { toast(t('gdNone'), 6000); return; }
    gd.flightId = flightId; gd.fileName = file.name; PENDING_GD = gd;
    if (location.hash === '#/gd') renderGendec(); else location.hash = '#/gd';
  } catch (e) { console.error(e); toast(t('gdReadErr') + ' ' + (e.message || ''), 5000); }
}
async function renderGendec() {
  const gd = PENDING_GD; if (!gd) { location.hash = '#/'; return; }
  const target = gd.flightId ? await DB.get('flights', gd.flightId) : null;
  setTitle(t('importGD'));
  const d = s => s ? s.toISOString().slice(0, 10) + 'T12:00' : '';
  const v = target || { operator: gd.operator, reg: gd.reg, callsign: '', dep: gd.dep, arr: gd.arr };
  const crew = gd.people.filter(p => p.role === 'crew'), pax = gd.people.filter(p => p.role !== 'crew');
  const rows = list => list.map(p => `<tr><td><input type="checkbox" data-inc="${p.id}" ${p.include ? 'checked' : ''} aria-label="${esc(t('include'))}"></td>
    <td><select data-role="${p.id}"><option value="crew" ${p.role === 'crew' ? 'selected' : ''}>${esc(t('roleCrew'))}</option><option value="pax" ${p.role !== 'crew' ? 'selected' : ''}>${esc(t('rolePax'))}</option></select></td>
    <td class="nm">${esc(p.name)}</td><td>${esc(p.rank || '')}</td><td>${p.minor ? `<span class="tag warn">${esc(t('minor'))}</span>` : ''}</td></tr>`).join('');
  view().innerHTML = `<div class="row"><a class="btn small ghost" href="${target ? '#/f/' + target.id : '#/'}">‹ ${esc(t('back'))}</a></div>
    <div class="card"><h2>${esc(t('gdTitle'))}</h2><p class="muted">${esc(t('gdIntro'))}</p>
      <p class="small">${esc(t('fileGD'))}: <b>${esc(gd.fileName)}</b></p>
      <div id="gdwarn"></div>
      <form class="form" id="gdf">
        ${target ? `<p class="warnc small">${esc(t('replaceRoster'))}</p>` : `
        <label>${esc(t('operator'))}<input name="operator" value="${esc(v.operator || SETTINGS.operator || '')}"></label>
        <div class="grid2"><label>${esc(t('reg'))}*<input name="reg" value="${esc(v.reg || '')}" required></label><label>${esc(t('callsign'))}<input name="callsign" value="${esc(v.callsign || '')}"></label></div>
        <div class="grid2"><label>${esc(t('dep'))}*<input name="dep" value="${esc(v.dep || '')}" maxlength="4" required></label><label>${esc(t('arr'))}*<input name="arr" value="${esc(v.arr || '')}" maxlength="4" required></label></div>
        <div class="grid2"><label>${esc(t('etd'))}*<input type="datetime-local" name="etd" value="${esc(d(gd.depDate))}" required></label><label>${esc(t('eta'))}<input type="datetime-local" name="eta" value="${esc(d(gd.arrDate))}"></label></div>
        <p class="small warnc">${esc(t('gdLocal'))}</p>`}
        <div class="tablewrap"><table class="gdt"><thead><tr><th>${esc(t('include'))}</th><th>${esc(t('role'))}</th><th>${esc(t('name').replace(/ .*/, ''))}</th><th>${esc(t('rank'))}</th><th></th></tr></thead>
        <tbody>${rows(crew)}${rows(pax)}</tbody></table></div>
        <p class="small muted">🔒 ${esc(t('gdPrivacy'))}</p>
        <div class="row gap"><button class="btn primary big" type="submit">${esc(target ? t('applyFlight') : t('createFlight'))}</button><a class="btn big" href="${target ? '#/f/' + target.id : '#/'}">${esc(t('cancel'))}</a></div>
      </form></div>`;
  const form = $('#gdf');
  const warn = () => {
    const dep = upper(target ? target.dep : form.dep.value), arr = upper(target ? target.arr : form.arr.value), w = [];
    if (arr && !isUSAirport(arr)) w.push(t('notUS'));
    if (dep && isUSAirport(dep)) w.push(t('depUS'));
    $('#gdwarn').innerHTML = w.map(x => `<div class="banner neutral">ⓘ ${esc(x)}</div>`).join('');
  };
  warn(); if (!target) { form.dep.oninput = warn; form.arr.oninput = warn; }
  view().querySelectorAll('[data-inc]').forEach(c => c.onchange = () => { gd.people.find(p => p.id === c.dataset.inc).include = c.checked; });
  view().querySelectorAll('[data-role]').forEach(c => c.onchange = () => { gd.people.find(p => p.id === c.dataset.role).role = c.value; });
  form.onsubmit = async e => {
    e.preventDefault();
    const roster = gd.people.filter(p => p.include).map(({ id, name, role, rank, minor }) => ({ id, name, role, rank, minor }));
    let f;
    if (target) { f = target; }
    else {
      const x = Object.fromEntries(new FormData(form));
      if (!x.reg || !x.dep || !x.arr || !x.etd) return toast(t('reqFields'));
      f = { id: uid(), createdAt: new Date().toISOString(), checks: {}, operator: (x.operator || '').trim(), reg: upper(x.reg), callsign: upper(x.callsign), dep: upper(x.dep), arr: upper(x.arr), etd: localToISO(x.etd), eta: localToISO(x.eta), notes: '' };
    }
    f.roster = roster; f.expected = roster.filter(p => p.role !== 'crew').length; f.expectedCrew = roster.filter(p => p.role === 'crew').length; f.rosterSource = gd.fileName;
    await DB.put('flights', f);
    // link existing attestations to the new list
    const recs = await DB.paxOf(f.id); const linked = [];
    for (const r of recs) { r.rosterId = null; }
    for (const r of recs) { const m = matchRoster(f, r, linked); if (m) r.rosterId = m; linked.push(r); await DB.put('pax', r); }
    PENDING_GD = null; location.hash = '#/f/' + f.id;
  };
}

/* ---------- QR scanning ---------- */
let _stream = null, _raf = 0;
function stopScan() { cancelAnimationFrame(_raf); if (_stream) { _stream.getTracks().forEach(tr => tr.stop()); _stream = null; } }
async function renderScan(id) {
  const f = await DB.get('flights', id); if (!f) { location.hash = '#/'; return; }
  setTitle(`${f.dep} → ${f.arr} · ${t('scanQR')}`);
  view().innerHTML = `<div class="row"><a class="btn small ghost" href="#/f/${id}">‹ ${esc(t('back'))}</a></div>
    <div class="card center"><p>${esc(t('scanning'))}</p><div class="scanbox"><video id="vid" playsinline muted></video><div class="reticle"></div></div>
    <p id="scanres" class="small"></p><div id="scanlist" class="small"></div></div>`;
  const vid = $('#vid'), c = document.createElement('canvas'), ctx = c.getContext('2d', { willReadFrequently: true });
  let busy = false, last = '';
  try {
    _stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false });
    vid.srcObject = _stream; await vid.play();
  } catch (e) { $('#scanres').textContent = t('camErr'); return; }
  const tick = async () => {
    if (!_stream) return;
    if (vid.readyState >= 2 && !busy) {
      const w = vid.videoWidth, h = vid.videoHeight, s = Math.min(w, h);
      c.width = c.height = Math.min(800, s);
      ctx.drawImage(vid, (w - s) / 2, (h - s) / 2, s, s, 0, 0, c.width, c.height);
      const img = ctx.getImageData(0, 0, c.width, c.height);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
      if (code && code.data && code.data !== last) {
        last = code.data; busy = true;
        try {
          const rec = await payloadToRecord(code.data);
          const added = await addRecordToFlight(f, rec, 'qr');
          if (added) { navigator.vibrate && navigator.vibrate(80); $('#scanres').innerHTML = `<b class="okc">✓ ${esc(t('imported'))}: ${esc(rec.paxName)}</b>`; $('#scanlist').insertAdjacentHTML('afterbegin', `<div>✓ ${esc(rec.paxName)}</div>`); }
          else $('#scanres').textContent = t('dup');
        } catch { $('#scanres').textContent = t('badQR'); }
        busy = false;
      }
    }
    _raf = requestAnimationFrame(tick);
  };
  tick();
}
async function decodeQRFromImage(file) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = bmp.width * scale; c.height = bmp.height * scale;
  const ctx = c.getContext('2d'); ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const code = jsQR(img.data, img.width, img.height); if (!code) throw new Error('no qr');
  return code.data;
}

/* ---------- settings / about ---------- */
async function renderSettings() {
  setTitle(t('settings'));
  let persisted = false; try { persisted = navigator.storage && await navigator.storage.persisted(); } catch { }
  view().innerHTML = `
    <form class="card form" id="sf"><h2>${esc(t('settings'))}</h2>
      <label>${esc(t('language'))}${langChips(LANG)}</label>
      <label>${esc(t('settingsOperator'))}<input name="operator" value="${esc(SETTINGS.operator)}"></label>
      <label>${esc(t('settingsReg'))}<input name="reg" value="${esc(SETTINGS.reg)}" autocapitalize="characters"></label>
      <button class="btn primary" type="submit">${esc(t('save'))}</button></form>
    <div class="card"><h3>${esc(t('storage'))}</h3><p class="${persisted ? 'okc' : 'warnc'}">${esc(persisted ? t('persistOK') : t('persistNo'))}</p>
      <p class="small muted">${esc(t('install'))}</p>
      <div class="row gap wrap"><button class="btn" id="bk">⤓ ${esc(t('exportJSON'))}</button>
      <label class="btn">⇪ ${esc(t('restore'))}<input type="file" id="rs" accept=".json,application/json" hidden></label></div></div>
    <div class="card"><h3>${esc(t('about'))}</h3>${t('aboutText').map(p => `<p>${esc(p)}</p>`).join('')}
      <p><a href="${CDC_URL}" target="_blank" rel="noopener">${esc(t('cdcLink'))} ↗</a></p>
      <p class="small muted">v${APP_VERSION} · LR Aviation · lraviation.com.br · ${esc(ATTEST.en.omb)}</p></div>`;
  wireLangChips();
  $('#sf').onsubmit = async e => { e.preventDefault(); SETTINGS.operator = e.target.operator.value.trim(); SETTINGS.reg = upper(e.target.reg.value); await saveSettings(); toast('✓'); };
  $('#bk').onclick = async () => {
    const data = { app: 'lr-ebola-attestation', version: APP_VERSION, exportedAt: new Date().toISOString(), settings: SETTINGS, flights: await DB.all('flights'), pax: await DB.all('pax') };
    deliverFile(new TextEncoder().encode(JSON.stringify(data)), `ebola-attestation-backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };
  $('#rs').onchange = async e => {
    try {
      const d = JSON.parse(await e.target.files[0].text()); if (d.app !== 'lr-ebola-attestation') throw new Error('bad');
      for (const f of d.flights || []) await DB.put('flights', f);
      for (const p of d.pax || []) await DB.put('pax', p);
      toast(t('backupDone'));
    } catch { toast(t('badQR')); }
  };
}

function wireLangChips() {
  view().querySelectorAll('[data-setlang]').forEach(b => b.onclick = async () => { await setLang(b.dataset.setlang); route(); });
}
async function setLang(l) {
  LANG = l; SETTINGS.lang = l; document.documentElement.lang = l; await saveSettings(); renderChrome();
}
function renderChrome() {
  $('#appname').textContent = t('appName');
  $('#tabs').innerHTML = `<a href="#/" data-r="home">✈︎ ${esc(t('flights'))}</a><a href="#/link" data-r="link">⌁ ${esc(t('sendLink'))}</a><a href="#/settings" data-r="settings">⚙︎ ${esc(t('settings'))}</a>`;
  $('#hdrlang').innerHTML = ['en', 'pt', 'es'].map(l => `<option value="${l}" ${l === LANG ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('');
}

function ask(msg) {
  return new Promise(res => showOverlay(`<h2>${esc(msg)}</h2><div class="row gap center"><button class="btn danger" data-act="yes">${esc(t('del'))}</button><button class="btn" data-act="no">${esc(t('cancel'))}</button></div>`, a => res(a === 'yes')));
}
function showOverlay(html, cb) {
  const o = $('#overlay'); o.innerHTML = `<div class="ov-card">${html}</div>`; o.hidden = false;
  o.querySelectorAll('[data-act]').forEach(b => b.onclick = () => { o.hidden = true; cb(b.dataset.act); });
}

/* ---------- example data (preview only) ---------- */
async function seedDemo() {
  if ((await DB.all('flights')).length) return;
  const wave = (a, f, ph) => { const s = []; for (let i = 0; i <= 70; i++) s.push([60 + i * 6.5, 100 + a * Math.sin(i / f + ph) + (i % 7) * 0.6]); return [s, [[120, 40], [150, 160]], [[300, 70], [340, 140], [380, 60]]]; };
  const now = Date.now(), etd = new Date(now + 36e5 * 6), eta = new Date(etd.getTime() + 36e5 * 8.5);
  const f = { id: uid(), createdAt: new Date().toISOString(), checks: { ck1: false }, operator: 'EXAMPLE Operator', reg: 'PS-XMP', callsign: 'EXAMPLE1', dep: 'LFPG', arr: 'KTEB', etd: etd.toISOString(), eta: eta.toISOString(), expected: 3, expectedCrew: 2, notes: 'EXAMPLE — fictitious data for demonstration' };
  await DB.put('flights', f);
  const people = [['self', 'Ana Example', 'Ana Example', ''], ['rep', 'Carlos Example', 'Lucas Example', 'Father'], ['self', 'Rui Example', 'Rui Example', '', 'crew']];
  let k = 0;
  for (const [mode, signer, paxName, relation, role] of people) {
    const rec = { role: role || 'pax', mode, signer, paxName, relation, signedAt: new Date(now - (2 - k) * 6e5).toISOString(), lang: 'en', sig: await buildSig(wave(30 + k * 15, 3 + k, k)) };
    rec.hash = await sha256hex(canonical(rec));
    await addRecordToFlight(f, rec, k ? 'qr' : 'device', true); k++;
  }
}

/* ---------- boot ---------- */
(async function boot() {
  await loadSettings();
  const nav = (navigator.language || 'en').slice(0, 2);
  LANG = SETTINGS.lang || (['pt', 'es'].includes(nav) ? nav : 'en');
  document.documentElement.lang = LANG;
  renderChrome();
  if (window.LR_DEMO) { try { await seedDemo(); } catch (e) { console.warn(e); } }
  $('#hdrlang').onchange = async e => { await setLang(e.target.value); route(); };
  window.addEventListener('hashchange', route);
  route();
  try { if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); } catch { }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
