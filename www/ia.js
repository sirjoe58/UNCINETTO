/* Da foto a schema (intelligenza artificiale Claude) + esportazione/importazione in formato testo
   compatibile con le app contarighe (My Row Counter, Pocket Crochet…): una riga per giro. */

const MODELLI_IA = [
  { id: 'claude-sonnet-5-5', nome: 'Claude Sonnet 5.5 (consigliato: veloce e preciso)' },
  { id: 'claude-opus-5-5', nome: 'Claude Opus 5.5 (il più accurato, più costoso)' },
  { id: 'claude-haiku-5-5', nome: 'Claude Haiku 5.5 (il più economico)' },
];

const ISTRUZIONI_IA = `Agisci come un esperto designer di schemi all'uncinetto (crochet pattern designer). Analizza l'immagine allegata e trasformala in uno schema scritto dettagliato, preciso e pronto per essere importato in un'app di tracciamento righe (come My Row Counter o Pocket Crochet). Rispondi sempre in italiano.

Regole di formattazione (fondamentali per le app):
1. Terminologia: usa la terminologia italiana standard (cat = catenella, mb = maglia bassa, mma = mezza maglia alta, ma = maglia alta, maa = maglia altissima, aum = aumento, dim = diminuzione, mbss = maglia bassissima, cm = cerchio magico).
2. Struttura riga per riga: ogni giro o riga deve iniziare su una nuova riga con la dicitura esatta "Giro 1:", "Giro 2:" (oppure "Riga 1:", "Riga 2:" se lavorato in piano). Non raggruppare più giri in una sola riga: se più giri sono uguali scrivili uno per riga.
3. Conteggio finale: alla fine di ogni riga/giro indica sempre il numero totale di maglie tra parentesi tonde, per esempio (12) oppure (24 mb).
4. Ripetizioni: usa gli asterischi *...* oppure le parentesi quadre [...] per indicare le sequenze da ripetere, seguite da "x N volte".

Struttura dell'output richiesta (usa esattamente questi titoli, ognuno su una riga che inizia con ##):
## Nome del progetto e livello di difficoltà
## Materiali consigliati
(peso del filato suggerito, misura dell'uncinetto e colori necessari, basati sull'immagine)
## Legenda punti
## Note tecniche
(specifica se si lavora a spirale (amigurumi), a giri chiusi o in piano (andata e ritorno))
## Schema
Suddiviso per ogni parte del soggetto: ogni parte inizia con una riga "### Nome della parte (quanti pezzi)", per esempio "### Testa (1)", "### Orecchie (2)", oppure "### Base", "### Bordo".
## Assemblaggio
(brevi istruzioni su come cucire o rifinire i pezzi, se necessario)

Importante: prima di scrivere lo schema, analizza le proporzioni dell'immagine per assicurarti che il risultato finale sia tridimensionale (se è un amigurumi) o piatto (se è un centrino, una presina o un quadrato) e che le forme corrispondano fedelmente al disegno. Controlla che i conteggi di ogni giro siano coerenti con gli aumenti e le diminuzioni del giro precedente (es. 6 aumenti su 12 maglie = 18). Se l'immagine non mostra un lavoro all'uncinetto, proponi comunque lo schema più fedele possibile per realizzarlo all'uncinetto.`;

/* Ridimensiona la foto (lato massimo 1568 px, come consigliato per l'analisi delle immagini) */
function fotoPerIA(file) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const max = 1568, sc = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', 0.85); URL.revokeObjectURL(img.src);
      ok({ anteprima: url, base64: url.split(',')[1] });
    };
    img.onerror = () => ko(new Error('Immagine non leggibile'));
    img.src = URL.createObjectURL(file);
  });
}

async function chiediSchemaIA(base64, note, tipo) {
  const chiave = (Archivio.imp.chiaveIA || '').trim();
  if (!chiave) throw new Error('Manca la chiave API: inseriscila in Impostazioni → Intelligenza artificiale.');
  let testo = 'Trasforma questa immagine in uno schema all\'uncinetto seguendo tutte le regole.';
  if (tipo && tipo !== 'auto') testo += ` Il soggetto va realizzato come: ${tipo}.`;
  if (note) testo += ` Indicazioni aggiuntive: ${note}`;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': chiave, 'anthropic-version': '2023-06-01', 'content-type': 'application/json', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: Archivio.imp.modelloIA || MODELLI_IA[0].id, max_tokens: 8000, system: ISTRUZIONI_IA,
      messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } }, { type: 'text', text: testo }] }],
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const m = (j.error && j.error.message) || r.statusText;
    if (r.status === 401) throw new Error('Chiave API non valida. Controllala in Impostazioni.');
    if (r.status === 402 || /credit/i.test(m)) throw new Error('Credito esaurito sul tuo account Anthropic: ricaricalo dalla console.');
    if (r.status === 429) throw new Error('Troppe richieste in poco tempo: riprova tra un minuto.');
    if (r.status === 404) throw new Error('Modello non disponibile: scegline un altro in Impostazioni.');
    throw new Error('Errore ' + r.status + ': ' + m);
  }
  return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
}

/* ---------- Testo per app contarighe ---------- */
const RE_GIRO = /^\s*[-•*]?\s*\**\s*(giro|giri|riga|righe|g|r)\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*\**\s*[:.)]\s*(.*)$/i;

/* Trasforma "G6-10: 30 mb (30)" in 5 righe "Giro 6: 30 mb (30)" … */
function espandiRiga(riga) {
  const m = riga.match(RE_GIRO);
  if (!m) return null;
  const parola = /^r/i.test(m[1]) ? 'Riga' : 'Giro';
  const da = +m[2], a = m[3] ? +m[3] : da;
  let corpo = m[4].trim().replace(/\s*\.\s*$/, '');
  if (a > da) corpo = corpo.replace(/\s*(a giro|per giro|a riga),?\s*/i, ' ').replace(/,?\s*senza aumenti/i, '').replace(/\s+/g, ' ').trim();
  const out = [];
  for (let n = da; n <= Math.min(a, da + 300); n++) out.push(`${parola} ${n}: ${corpo}`);
  return out;
}

/* Converte uno schema dell'app nel formato testo per contarighe */
function schemaInTesto(s) {
  const righe = [];
  righe.push(`${s.titolo || s.nome} – livello: ${['', 'facile', 'medio', 'impegnativo'][s.livello] || '-'}`);
  if (s.materiale) righe.push('', 'MATERIALI', ...s.materiale.map(m => '- ' + m));
  righe.push('', 'LEGENDA', 'cat = catenella, mbss = maglia bassissima, mb = maglia bassa, mma = mezza maglia alta, ma = maglia alta, maa = maglia altissima, cm = cerchio magico, aum = aumento, dim = diminuzione, fp/fa = filo posteriore/anteriore');
  righe.push('', 'SCHEMA');
  for (const p of s.passi) {
    const t = (p.e || p.s).replace(/^Giri\s/, 'G').replace(/^Giro\s/, 'G');
    const esp = espandiRiga(t);
    if (esp) righe.push(...esp);
    else righe.push('Nota: ' + (p.s || p.e));
  }
  if (s.consigli) righe.push('', 'CONSIGLI', s.consigli);
  righe.push('', 'Creato con SirJoe Uncinetto');
  return righe.join('\n');
}

/* Legge un testo (dall'IA o incollato) e ne ricava i passi: una riga per giro, con il nome della parte */
function testoInPassi(testo) {
  const passi = []; let parte = '', sezione = '';
  for (let riga of testo.split(/\r?\n/)) {
    riga = riga.replace(/\*\*/g, '').trim();
    if (!riga) continue;
    const h = riga.match(/^#{1,4}\s*(.+)$/);
    if (h) {
      const tit = h[1].trim();
      if (riga.startsWith('###')) parte = tit; else { sezione = tit.toLowerCase(); parte = ''; }
      continue;
    }
    const esp = espandiRiga(riga);
    if (esp) { esp.forEach(r => passi.push({ s: (parte ? parte + ' – ' : '') + r, e: (parte ? parte.split(' (')[0] + ' – ' : '') + r })); continue; }
    if (/assemblaggio|schema/.test(sezione) && !/^(legenda|materiali|note)/i.test(riga)) {
      if (/^[A-ZÀ-Ü][^:]{0,40}:$/.test(riga)) { parte = riga.replace(/:$/, ''); continue; }
      passi.push({ s: riga.replace(/^[-•]\s*/, ''), e: riga.replace(/^[-•]\s*/, '') });
    }
  }
  return passi;
}

function titoloDaTesto(testo) {
  const m = testo.match(/##\s*Nome del progetto[^\n]*\n+([^\n#]+)/i);
  if (m) return m[1].replace(/\*\*/g, '').split(/[–—-]\s*livello|\(livello|livello:/i)[0].trim().slice(0, 60);
  return 'Schema da foto';
}

/* Mostra il testo in modo leggibile (titoli, liste) senza eseguire HTML */
function testoInHTML(t) {
  return t.split(/\r?\n/).map(r => {
    const e = esc(r).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    if (/^###\s/.test(r)) return `<h4 style="margin:12px 0 4px;color:var(--primario-scuro)">${e.replace(/^###\s*/, '')}</h4>`;
    if (/^##\s/.test(r)) return `<h3>${e.replace(/^##\s*/, '')}</h3>`;
    if (RE_GIRO.test(r)) return `<div style="padding:3px 0;border-bottom:1px dashed var(--bordo)">${e}</div>`;
    return e ? `<div>${e}</div>` : '<br>';
  }).join('');
}
