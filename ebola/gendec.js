/* LR Aviation · US Ebola Attestation — GENDEC / manifest import
   Reads a General Declaration (PDF with text layer) or a CSV and builds the flight roster.
   Only names, function (rank) and an under-18 flag are kept. Passport numbers and dates of birth
   are read in memory to compute the flag and then discarded. */
'use strict';

const GSTR = {
  en: { importGD: 'Import GENDEC', gdTitle: 'Review GENDEC import', gdIntro: 'Check the data read from the file. Untick anyone who will not fly.',
    gdPrivacy: 'Only names, function and an under-18 flag are kept. Passport numbers and dates of birth are not stored.',
    gdLocal: 'GENDEC dates are local time. Set ETD/ETA in UTC.', createFlight: 'Create flight', applyFlight: 'Apply to this flight',
    gdNone: 'No crew or passenger list found in this file. Supported: GENDEC PDF with selectable text, or CSV (name, type, rank, date of birth).',
    gdReadErr: 'Could not read this file.', gdNoText: 'This PDF has no selectable text (scanned or image). Export the GENDEC as a PDF from the system that generated it, or use CSV.', gdLayout: 'This GENDEC layout was not recognized. Send it to ops@lraviation.com.br so it can be supported, or use CSV (name, type, rank, date of birth).', minor: 'under 18', minorHint: 'Under 18: a parent or authorized adult signs on their behalf.',
    notUS: 'Arrival does not look like a US airport. The CDC attestation applies only to flights to the United States.',
    depUS: 'Departure is in the US. The order covers flights departing a foreign country.',
    roster: 'On board (GENDEC)', notOnList: 'Not on GENDEC', linkTo: 'Link to…', signNow: 'Sign', removeP: 'Remove from list',
    nextPending: 'Next on list', include: 'Fly', rank: 'Function', fileGD: 'GENDEC file', allDone: 'Everyone on the list has attested.',
    confirmRemoveP: 'Remove this person from the list for this flight?', replaceRoster: 'This replaces the current list for this flight.' },
  pt: { importGD: 'Importar GENDEC', gdTitle: 'Conferir importação da GENDEC', gdIntro: 'Confira os dados lidos do arquivo. Desmarque quem não vai voar.',
    gdPrivacy: 'Só ficam guardados nomes, função e a marcação de menor de 18. Passaporte e data de nascimento não são armazenados.',
    gdLocal: 'As datas da GENDEC são hora local. Ajuste ETD/ETA em UTC.', createFlight: 'Criar voo', applyFlight: 'Aplicar a este voo',
    gdNone: 'Nenhuma lista de tripulantes ou passageiros encontrada. Aceito: GENDEC em PDF com texto selecionável, ou CSV (nome, tipo, função, data de nascimento).',
    gdReadErr: 'Não foi possível ler este arquivo.', gdNoText: 'Este PDF não tem texto selecionável (escaneado ou imagem). Gere a GENDEC em PDF pelo sistema de origem, ou use CSV.', gdLayout: 'Este modelo de GENDEC não foi reconhecido. Envie para ops@lraviation.com.br para ser incluído, ou use CSV (nome, tipo, função, data de nascimento).', minor: 'menor de 18', minorHint: 'Menor de 18: pai, mãe ou adulto autorizado assina por ele.',
    notUS: 'O destino não parece ser aeroporto dos EUA. A declaração do CDC só vale para voos com destino aos Estados Unidos.',
    depUS: 'A origem é nos EUA. A ordem cobre voos que partem do exterior.',
    roster: 'A bordo (GENDEC)', notOnList: 'Fora da GENDEC', linkTo: 'Vincular a…', signNow: 'Assinar', removeP: 'Tirar da lista',
    nextPending: 'Próximo da lista', include: 'Voa', rank: 'Função', fileGD: 'Arquivo GENDEC', allDone: 'Todos da lista declararam.',
    confirmRemoveP: 'Tirar esta pessoa da lista deste voo?', replaceRoster: 'Isto substitui a lista atual deste voo.' },
  es: { importGD: 'Importar GENDEC', gdTitle: 'Revisar importación de la GENDEC', gdIntro: 'Revise los datos leídos del archivo. Desmarque a quien no vuele.',
    gdPrivacy: 'Solo se guardan nombres, función y la marca de menor de 18. Pasaporte y fecha de nacimiento no se almacenan.',
    gdLocal: 'Las fechas de la GENDEC son hora local. Ajuste ETD/ETA en UTC.', createFlight: 'Crear vuelo', applyFlight: 'Aplicar a este vuelo',
    gdNone: 'No se encontró lista de tripulantes ni pasajeros. Se acepta: GENDEC en PDF con texto seleccionable, o CSV (nombre, tipo, función, fecha de nacimiento).',
    gdReadErr: 'No se pudo leer este archivo.', gdNoText: 'Este PDF no tiene texto seleccionable (escaneado o imagen). Genere la GENDEC en PDF desde el sistema de origen, o use CSV.', gdLayout: 'Este modelo de GENDEC no fue reconocido. Envíelo a ops@lraviation.com.br para incluirlo, o use CSV (nombre, tipo, función, fecha de nacimiento).', minor: 'menor de 18', minorHint: 'Menor de 18: padre, madre o adulto autorizado firma en su nombre.',
    notUS: 'El destino no parece un aeropuerto de EE. UU. La declaración del CDC aplica solo a vuelos hacia Estados Unidos.',
    depUS: 'El origen está en EE. UU. La orden cubre vuelos que salen del extranjero.',
    roster: 'A bordo (GENDEC)', notOnList: 'Fuera de la GENDEC', linkTo: 'Vincular a…', signNow: 'Firmar', removeP: 'Quitar de la lista',
    nextPending: 'Siguiente de la lista', include: 'Vuela', rank: 'Función', fileGD: 'Archivo GENDEC', allDone: 'Todos los de la lista declararon.',
    confirmRemoveP: '¿Quitar a esta persona de la lista de este vuelo?', replaceRoster: 'Esto reemplaza la lista actual de este vuelo.' }
};

/* US airports: contiguous US (K), Alaska/Hawaii/Pacific territories (PA PF PO PP PH PG PW), Puerto Rico/USVI (TJ TI), American Samoa (NS) */
const isUSAirport = icao => /^(K[A-Z0-9]{3}|P[AFOPHGW][A-Z0-9]{2}|T[JI][A-Z0-9]{2}|NS[A-Z0-9]{2})$/.test(icao || '');

const MONTHS = { jan: 0, feb: 1, fev: 1, mar: 2, apr: 3, abr: 3, may: 4, mai: 4, jun: 5, jul: 6, aug: 7, ago: 7, sep: 8, set: 8, oct: 9, out: 9, nov: 10, dec: 11, dez: 11, dic: 11, ene: 0 };
function parseDay(s) {
  s = String(s || '').trim();
  let m = s.match(/^(\d{1,2})[\s\-\/.]*([A-Za-zÀ-ÿ]{3,})\.?[\s\-\/.]*(\d{4})$/);
  if (m) { const mo = MONTHS[m[2].slice(0, 3).toLowerCase()]; if (mo !== undefined) return new Date(Date.UTC(+m[3], mo, +m[1])); }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  m = s.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})$/); if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1])); // dd/mm/yyyy
  return null;
}
const isDateCell = s => !!parseDay(s);
function ageOn(dob, ref) {
  if (!dob || !ref) return null;
  let a = ref.getUTCFullYear() - dob.getUTCFullYear();
  if (ref.getUTCMonth() < dob.getUTCMonth() || (ref.getUTCMonth() === dob.getUTCMonth() && ref.getUTCDate() < dob.getUTCDate())) a--;
  return a;
}
const normName = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z ]+/g, ' ').replace(/\s+/g, ' ').trim();
const looksLikeName = s => /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' .\-]{2,}$/.test(s) && /\s/.test(s.trim());

/* ---------- PDF ---------- */
let _pdfjs = null;
function loadPdfJs() {
  if (_pdfjs) return _pdfjs;
  _pdfjs = new Promise((res, rej) => {
    if (window.pdfjsLib) return res(window.pdfjsLib);
    const s = document.createElement('script'); s.src = 'vendor/pdf.min.js';
    s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js'; res(window.pdfjsLib); };
    s.onerror = () => { _pdfjs = null; rej(new Error('pdf.js')); };
    document.head.appendChild(s);
  });
  return _pdfjs;
}

function loadMainThreadWorker() {
  return new Promise((res, rej) => {
    if (window.pdfjsWorker) return res();
    const s = document.createElement('script'); s.src = 'vendor/pdf.worker.min.js';
    s.onload = () => res(); s.onerror = () => rej(new Error('pdf.worker'));
    document.head.appendChild(s);
  });
}
async function pdfLines(buf) {
  let lines = [];
  try { lines = await pdfLinesOnce(buf.slice(0)); } catch (e) { console.warn('pdf.js worker failed, retrying on main thread', e); }
  if (!lines.length) { await loadMainThreadWorker(); lines = await pdfLinesOnce(buf.slice(0)); }
  return lines;
}
async function pdfLinesOnce(buf) {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
  const lines = [];
  for (let pn = 1; pn <= doc.numPages; pn++) {
    const page = await doc.getPage(pn);
    const tc = await page.getTextContent();
    const items = tc.items.filter(i => i.str && i.str.trim()).map(i => ({ s: i.str.trim(), x: i.transform[4], y: i.transform[5], w: i.width }));
    items.sort((a, b) => b.y - a.y || a.x - b.x);
    const pl = [];
    for (const it of items) {
      const L = pl.find(l => Math.abs(l.y - it.y) < 3);
      if (L) L.items.push(it); else pl.push({ y: it.y, items: [it] });
    }
    for (const l of pl) { l.items.sort((a, b) => a.x - b.x); l.text = l.items.map(i => i.s).join(' '); l.page = pn; lines.push(l); }
  }
  return lines;
}

function parseGendecLines(lines) {
  const all = lines.map(l => l.text).join('\n');
  const grab = re => { const m = all.match(re); return m ? m[1].trim() : ''; };
  const out = {
    operator: grab(/OPERATOR\s*:\s*(.+)/i),
    reg: grab(/(?:MARKS? OF (?:NATIONALITY AND )?REGISTRATION|REGISTRATION|MATR[IÍ]CULA)\s*:\s*([A-Z0-9\-]{3,8})/i),
    type: grab(/AIRCRAFT TYPE\s*:\s*([A-Z0-9\-]+)/i),
    callsign: grab(/(?:FLIGHT\s*(?:NO\.?|NUMBER)|CALL\s*SIGN)\s*:\s*([A-Z0-9\-]{3,9})/i),
    dep: grab(/(?:AIRPORT OF DEPARTURE|DEPARTURE AIRPORT|FROM)\s*:\s*([A-Z]{4})\b/i).toUpperCase(),
    arr: grab(/(?:AIRPORT OF ARRIVAL|ARRIVAL AIRPORT|TO)\s*:\s*([A-Z]{4})\b/i).toUpperCase(),
    depDate: parseDay(grab(/DEPARTURE DATE\s*:\s*(\d{1,2}[\s\-\/.]*[A-Za-z]{3,}\.?[\s\-\/.]*\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}[\/.]\d{1,2}[\/.]\d{4})/i)),
    arrDate: parseDay(grab(/ARRIVAL DATE\s*:\s*(\d{1,2}[\s\-\/.]*[A-Za-z]{3,}\.?[\s\-\/.]*\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}[\/.]\d{1,2}[\/.]\d{4})/i)),
    people: []
  };
  if (out.reg && !out.reg.includes('-') && /^[A-Z]{2}[A-Z]{3}$/.test(out.reg) && /^(P[PRSTU])/.test(out.reg)) out.reg = out.reg.slice(0, 2) + '-' + out.reg.slice(2); // Brazilian marks

  // table headers: a line holding a NAME column and at least two other column labels
  const headerIdx = [];
  lines.forEach((l, i) => {
    const hasName = l.items.some(it => /^(FULL\s+)?(NAME|NOME|NOMBRE|SURNAME)/i.test(it.s));
    const others = l.items.filter(it => /RANK|NAT|EXP|PASS|DOB|BIRTH|LICEN|FUN[CÇ]|GENDER|SEX/i.test(it.s)).length;
    if (hasName && others >= 2) headerIdx.push(i);
  });
  headerIdx.forEach((hi, k) => {
    const H = lines[hi];
    const cols = H.items.map(it => ({ label: it.s.toUpperCase(), cx: it.x + it.w / 2 }));
    const colOf = it => { const cx = it.x + it.w / 2; let best = 0, bd = 1e9; cols.forEach((c, j) => { const d = Math.abs(c.cx - cx); if (d < bd) { bd = d; best = j; } }); return best; };
    const iName = cols.findIndex(c => /NAME|NOME|NOMBRE/.test(c.label));
    const iRank = cols.findIndex(c => /RANK|FUN[CÇ]|POSITION|DUTY/.test(c.label));
    const iDob = cols.findIndex(c => /DOB|BIRTH|NASC/.test(c.label));
    // section role: header with a rank/function column = crew; also check title lines just above
    const above = lines.slice(Math.max(0, hi - 3), hi).map(l => l.text.toUpperCase()).join(' ');
    let role = iRank >= 0 ? 'crew' : 'pax';
    if (/PASSENGER|PASSAGEIRO|PASAJERO/.test(above) && iRank < 0) role = 'pax';
    if (/CREW|TRIPULA/.test(above) && !/PASSENGER/.test(above)) role = 'crew';
    const end = k + 1 < headerIdx.length ? headerIdx[k + 1] : lines.length;
    for (let i = hi + 1; i < end; i++) {
      const L = lines[i]; if (L.page !== H.page && i > hi + 1 && !looksLikeName(L.items[0].s)) break;
      const cells = cols.map(() => []);
      for (const it of L.items) cells[colOf(it)].push(it.s);
      const name = cells[iName].join(' ').replace(/\s+/g, ' ').trim();
      if (!looksLikeName(name) || /DECLARE|PERSONS ON BOARD|^\d+\)/i.test(L.text)) { if (out.people.some(p => p._sec === hi)) break; else continue; }
      if (L.items.length < 2) break;
      const rank = iRank >= 0 ? cells[iRank].join(' ').trim() : '';
      const dob = iDob >= 0 ? parseDay(cells[iDob].join(' ')) : null;
      const age = ageOn(dob, out.depDate || new Date());
      out.people.push({ _sec: hi, id: uid(), name: name.toUpperCase(), role, rank, minor: age !== null && age < 18, include: true });
    }
  });
  out.people.forEach(p => delete p._sec);
  if (!out.people.length) textFallback(lines, out);
  return out;
}

/* fallback: read rows from the plain text of each line (no column geometry) */
function textFallback(lines, out) {
  const DATE = /\b(\d{1,2})\s*([A-Za-z]{3,4})\.?\s*(\d{4})\b/g;
  const RANK = '(PIC|SIC|CPT|CAPT|CMD|CDR|FO|F\\/O|COP|FA|FM|CA|MEC|FE|TCP|CC|PURSER|CREW|ENG)';
  const crewRe = new RegExp('^([A-ZÀ-Ü][A-ZÀ-Ü\' .\\-]+?)\\s+' + RANK + '\\s+([A-Z]{3})\\b', 'i');
  const paxRe = /^([A-ZÀ-Ü][A-ZÀ-Ü' .\-]+?)\s+([A-Z]{3})\s+\d{1,2}\s*[A-Za-z]{3,4}\.?\s*\d{4}\b/;
  let section = 'crew';
  const ref = out.depDate || new Date();
  for (const L of lines) {
    const txt = L.text.replace(/\s+/g, ' ').trim();
    if (/PASSENGER|PASSAGEIRO|PASAJERO/i.test(txt) && !/\d{4}/.test(txt)) { section = 'pax'; continue; }
    if (/^I declare|DECLARO/i.test(txt)) break;
    let m = section === 'crew' ? txt.match(crewRe) : null, role = section, rank = '', name = '';
    if (m) { rank = m[2].toUpperCase(); name = m[1].trim(); }
    else {
      m = txt.match(paxRe); if (!m) continue; name = m[1].trim();
      if (section === 'crew') { const w = name.split(' '); if (w.length > 2 && w[w.length - 1].length <= 4) rank = w.pop(); name = w.join(' '); }
    }
    if (!looksLikeName(name) || /^(NAME|NOME|NOMBRE)\b/i.test(name)) continue;
    const dates = [...txt.matchAll(DATE)].map(d => parseDay(d[0])).filter(Boolean).filter(d => d < ref);
    const dob = dates.length ? dates.reduce((a, b) => a < b ? a : b) : null;
    const age = ageOn(dob, ref);
    out.people.push({ id: uid(), name: name.toUpperCase(), role, rank, minor: age !== null && age < 18, include: true });
  }
}

/* ---------- CSV ---------- */
function parseCSV(text) {
  const rows = text.replace(/\r/g, '').split('\n').filter(r => r.trim());
  if (!rows.length) return null;
  const d = [';', '\t', ','].map(c => [c, rows[0].split(c).length]).sort((a, b) => b[1] - a[1])[0][0];
  const split = r => { const o = []; let cur = '', q = false; for (const ch of r) { if (ch === '"') q = !q; else if (ch === d && !q) { o.push(cur); cur = ''; } else cur += ch; } o.push(cur); return o.map(s => s.trim()); };
  const head = split(rows[0]).map(h => h.toUpperCase());
  const ix = re => head.findIndex(h => re.test(h));
  const iName = ix(/NAME|NOME|NOMBRE/), iType = ix(/TYPE|TIPO|ROLE|CATEG|PAX\/CREW/), iRank = ix(/RANK|FUN[CÇ]|POSITION/), iDob = ix(/DOB|BIRTH|NASC/);
  if (iName < 0) return null;
  const people = [];
  for (const r of rows.slice(1)) {
    const c = split(r); const name = (c[iName] || '').trim(); if (!name) continue;
    const type = iType >= 0 ? (c[iType] || '') : '', rank = iRank >= 0 ? (c[iRank] || '') : '';
    const role = /CREW|TRIP|TCP|PIC|SIC|FA\b/i.test(type) || (!type && rank) ? 'crew' : 'pax';
    const age = ageOn(iDob >= 0 ? parseDay(c[iDob]) : null, new Date());
    people.push({ id: uid(), name: name.toUpperCase(), role, rank, minor: age !== null && age < 18, include: true });
  }
  return { people };
}

async function readManifestFile(file) {
  const buf = await file.arrayBuffer();
  const head = new TextDecoder('latin1').decode(new Uint8Array(buf.slice(0, 1024)));
  if (head.includes('%PDF') || /\.pdf$/i.test(file.name) || file.type === 'application/pdf') {
    const lines = await pdfLines(buf);
    const gd = parseGendecLines(lines);
    if (!lines.length) gd.why = 'noText';
    else if (!gd.people.length) gd.why = 'layout';
    return gd;
  }
  return parseCSV(new TextDecoder().decode(new Uint8Array(buf))) || { people: [] };
}

/* ---------- roster matching ---------- */
function matchRoster(f, rec, records) {
  if (!f.roster || !f.roster.length) return null;
  const taken = new Set(records.filter(r => r.rosterId).map(r => r.rosterId));
  const want = normName(rec.paxName);
  const pool = f.roster.filter(p => !taken.has(p.id));
  let hit = pool.filter(p => normName(p.name) === want);
  if (hit.length !== 1) {
    const wt = want.split(' ');
    hit = pool.filter(p => { const pt = normName(p.name).split(' '); return pt[0] === wt[0] && pt[pt.length - 1] === wt[wt.length - 1]; });
  }
  if (hit.length !== 1) {
    const wt = new Set(want.split(' ').filter(x => x.length > 2));
    hit = pool.filter(p => { const pt = normName(p.name).split(' ').filter(x => x.length > 2); const common = pt.filter(x => wt.has(x)).length; return common >= 2 && common >= Math.min(pt.length, wt.size) - 1; });
  }
  return hit.length === 1 ? hit[0].id : null;
}
