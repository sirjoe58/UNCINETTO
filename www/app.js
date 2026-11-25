/* SirJoe Uncinetto – interfaccia */
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return [...(r || document).querySelectorAll(s)]; }
let _tAvviso;
function avviso(t) { const a = $('#avviso'); a.textContent = t; a.hidden = false; clearTimeout(_tAvviso); _tAvviso = setTimeout(() => a.hidden = true, 2600); }
const D = () => Archivio.dati;
const esperto = () => Archivio.imp.modo === 'esperto';
const STATI = { incorso: 'In corso', pausa: 'In pausa', finito: 'Finito', idea: 'Da iniziare' };

/* ---------------- Navigazione ---------------- */
const Nav = {
  pila: [],
  vai(vista, param, sostituisci) {
    const voce = { vista, param };
    if (sostituisci && this.pila.length) this.pila[this.pila.length - 1] = voce; else this.pila.push(voce);
    if (!sostituisci) history.pushState({ n: this.pila.length }, '');
    this.mostra();
  },
  radice(vista) { this.pila = [{ vista }]; this.mostra(); },
  indietro() {
    if (Editor._modificato && this.attuale().vista === 'editor' && !confirm('Lo schema non è salvato. Uscire lo stesso?')) return true;
    if (this.pila.length <= 1) return false;
    this.pila.pop(); this.mostra(); return true;
  },
  attuale() { return this.pila[this.pila.length - 1]; },
  mostra() {
    const { vista, param } = this.attuale();
    Piattaforma.schermoAcceso(vista === 'contatore' || vista === 'progetto' ? Archivio.imp.schermo : false);
    $('#btnIndietro').hidden = this.pila.length <= 1;
    const radiceMenu = { home: 'home', contatore: 'contatore', schemi: 'schemi', categoria: 'schemi', schema: 'schemi', progetti: 'progetti', progetto: 'progetti' }[vista] || 'altro';
    $$('#menu button').forEach(b => b.classList.toggle('attivo', b.dataset.vai === radiceMenu && this.pila.length >= 1));
    const v = $('#vista'); v.scrollTop = 0;
    (VISTE[vista] || VISTE.home)(v, param);
  },
};
window.sjIndietro = () => Nav.indietro(); // tasto Indietro di Android
window.addEventListener('popstate', () => { if (!Nav.indietro()) history.pushState({}, ''); });
function titolo(t) { $('#titolo').textContent = t; }

/* ---------------- Contatori ---------------- */
function nuovoContatore(nome, azzera) { return { id: nuovoId(), nome, valore: 0, obiettivo: 0, azzera: !!azzera }; }

function disegnaContatori(cont, lista, salva) {
  cont.innerHTML = lista.map((c, i) => `
    <div class="contatore" data-i="${i}">
      <div class="nome"><span>${esc(c.nome)}${c.azzera ? ' <small class="tenue">(si azzera col primo)</small>' : ''}</span>
        <button class="btn sec piccolo" data-az="mod">⚙</button></div>
      <div class="valore">${c.valore}</div>
      ${c.obiettivo ? `<div class="obiettivo">di ${c.obiettivo}</div><div class="barra-prog"><div style="width:${Math.min(100, c.valore / c.obiettivo * 100)}%"></div></div>` : ''}
      <div class="tasti">
        <button class="btn sec meno" data-az="meno" aria-label="meno uno">−</button>
        <button class="btn piu" data-az="piu" aria-label="più uno">+1</button>
      </div>
    </div>`).join('') + `<div class="bottoni"><button class="btn sec" data-az="nuovo">➕ Aggiungi contatore</button></div>`;
  $$('[data-az]', cont).forEach(b => b.onclick = () => {
    const box = b.closest('.contatore'); const i = box ? +box.dataset.i : -1; const c = lista[i];
    switch (b.dataset.az) {
      case 'piu':
        c.valore++; Piattaforma.vibra();
        if (i === 0) lista.forEach(x => { if (x.azzera) x.valore = 0; });
        if (c.obiettivo && c.valore === c.obiettivo) avviso(`🎉 ${c.nome}: obiettivo raggiunto!`);
        break;
      case 'meno': if (c.valore > 0) c.valore--; break;
      case 'nuovo': { const n = prompt('Nome del contatore (es. Maglie, Ripetizioni, Righe):', lista.length ? 'Maglie' : 'Giro'); if (!n) return; lista.push(nuovoContatore(n, lista.length > 0 && confirm(`Vuoi che "${n}" torni a 0 ogni volta che aumenti "${lista[0].nome}"?`))); break; }
      case 'mod': modificaContatore(lista, i); return disegnaContatori(cont, lista, salva) || salva();
    }
    salva(); disegnaContatori(cont, lista, salva);
  });
}
function modificaContatore(lista, i) {
  const c = lista[i];
  const scelta = prompt(`"${c.nome}" – scrivi:\n1 = rinomina\n2 = imposta obiettivo (es. 30 giri)\n3 = cambia valore\n4 = azzera\n5 = elimina`, '');
  if (scelta === '1') { const n = prompt('Nuovo nome:', c.nome); if (n) c.nome = n; }
  else if (scelta === '2') { const n = parseInt(prompt('Obiettivo (0 = nessuno):', c.obiettivo || ''), 10); if (!isNaN(n)) c.obiettivo = Math.max(0, n); }
  else if (scelta === '3') { const n = parseInt(prompt('Valore:', c.valore), 10); if (!isNaN(n)) c.valore = Math.max(0, n); }
  else if (scelta === '4') { if (confirm('Azzerare il contatore?')) c.valore = 0; }
  else if (scelta === '5') { if (confirm(`Eliminare "${c.nome}"?`)) lista.splice(i, 1); }
}
document.addEventListener('keydown', e => {
  const v = Nav.attuale() && Nav.attuale().vista;
  if ((v === 'contatore' || v === 'progetto') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
    if (e.key === ' ' || e.key === '+') { e.preventDefault(); const b = $('.contatore .piu'); b && b.click(); }
    if (e.key === '-') { const b = $('.contatore .meno'); b && b.click(); }
  }
});

/* ---------------- Diagramma di uno schema ---------------- */
function diagrammaSchema(s) {
  try { const d = s.diagramma && s.diagramma(); if (!d) return ''; return `<div class="diagramma">${d.svg}${legendaHTML(d.usati)}</div>`; }
  catch (e) { console.warn(e); return ''; }
}
function passiHTML(s, fatti, chiave) {
  return `<ol class="passi" data-chiave="${chiave}">` + s.passi.map((p, i) => `
    <li class="${fatti.includes(i) ? 'fatto' : ''}"><input type="checkbox" data-i="${i}" ${fatti.includes(i) ? 'checked' : ''} aria-label="fatto">
    <span class="num">${i + 1}.</span><span>${esc(esperto() ? p.e : p.s)}</span></li>`).join('') + '</ol>';
}
function collegaPassi(cont, getFatti, setFatti) {
  $$('.passi input', cont).forEach(cb => cb.onchange = () => {
    let f = getFatti().filter(x => x !== +cb.dataset.i);
    if (cb.checked) f.push(+cb.dataset.i);
    setFatti(f);
    cb.closest('li').classList.toggle('fatto', cb.checked);
  });
}
function selettoreModo(cont, ridisegna) {
  const el = document.createElement('div'); el.className = 'schede-tab';
  el.innerHTML = `<button data-m="semplice">🌱 Spiegazione semplice</button><button data-m="esperto">⚡ Versione esperto</button>`;
  $$('button', el).forEach(b => { b.classList.toggle('attivo', b.dataset.m === Archivio.imp.modo); b.onclick = () => { Archivio.imp.modo = b.dataset.m; Archivio.salvaImp(); ridisegna(); }; });
  return el;
}
function livelloHTML(l) { return `<span class="livello l${l}">${['', 'Facile', 'Medio', 'Impegnativo'][l]}</span>`; }

/* ---------------- Viste ---------------- */
const VISTE = {
  home(v) {
    titolo('SirJoe Uncinetto');
    const inCorso = D().progetti.filter(p => p.stato === 'incorso').sort((a, b) => b.agg - a.agg)[0];
    v.innerHTML = `
      <h2>Ciao! Cosa facciamo oggi? 🧶</h2>
      ${inCorso ? `<div class="riga" id="riprendi">${inCorso.foto ? `<img class="miniatura" src="${inCorso.foto}">` : '<span class="emoji">🧶</span>'}
        <div class="cresci"><b>Riprendi: ${esc(inCorso.nome)}</b><small>${inCorso.contatori.map(c => `${esc(c.nome)} ${c.valore}`).join(' · ')}</small></div><span>›</span></div><br>` : ''}
      <div class="griglia">
        ${[['contatore', '➕', 'Contatore', 'Conta giri e maglie'], ['schemi', '🧶', 'Schemi', `${SCHEMI.length} schemi in ${CATEGORIE.length} categorie`],
           ['progetti', '📁', 'I miei progetti', `${D().progetti.length} progetti`], ['mieiSchemi', '✏️', 'Disegna schemi', 'Griglia a colori e simboli'],
           ['libreria', '📖', 'Libreria punti', `${PUNTI.length} punti spiegati`], ['calcolatori', '🧮', 'Calcolatori', 'Campione, filato, aumenti'],
           ['online', '🌐', 'Trova online', 'Siti di schemi gratuiti'], ['impostazioni', '⚙️', 'Impostazioni', 'NAS, testo, modalità']]
          .map(([id, e, t, d]) => `<button class="tessera" data-vai="${id}"><span class="emoji">${e}</span><b>${t}</b><small>${d}</small></button>`).join('')}
      </div>`;
    if (inCorso) $('#riprendi').onclick = () => Nav.vai('progetto', inCorso.id);
    $$('.tessera', v).forEach(t => t.onclick = () => Nav.vai(t.dataset.vai));
  },

  contatore(v) {
    titolo('Contatore');
    if (!D().veloce) D().veloce = { agg: ora(), contatori: [nuovoContatore('Giro'), nuovoContatore('Maglie', true)] };
    const vel = D().veloce;
    v.innerHTML = `<p class="tenue piccolo">Contatore veloce. Per contare dentro un progetto, aprilo da "I miei progetti". Su PC: barra spaziatrice = +1.</p><div id="cc"></div>
      ${D().progetti.length ? `<h3>Oppure apri un progetto</h3><div class="lista">${D().progetti.filter(p => p.stato !== 'finito').map(p => `<div class="riga" data-id="${p.id}"><span class="emoji">📁</span><div class="cresci">${esc(p.nome)}</div><span>›</span></div>`).join('')}</div>` : ''}`;
    disegnaContatori($('#cc'), vel.contatori, () => { vel.agg = ora(); Archivio.salva(); });
    $$('.riga[data-id]', v).forEach(r => r.onclick = () => Nav.vai('progetto', r.dataset.id));
  },

  schemi(v) {
    titolo('Schemi');
    v.innerHTML = `<p class="tenue">Schemi originali con spiegazioni passo passo. Scegli una categoria:</p>
      <div class="griglia">${CATEGORIE.map(c => `<button class="tessera" data-c="${c.id}"><span class="emoji">${c.emoji}</span><b>${c.nome}</b><small>${c.desc} · ${SCHEMI.filter(s => s.cat === c.id).length} schemi</small></button>`).join('')}
      <button class="tessera" data-vai="mieiSchemi"><span class="emoji">✏️</span><b>I miei schemi</b><small>${D().mieiSchemi.length} disegnati da te</small></button>
      <button class="tessera" data-vai="online"><span class="emoji">🌐</span><b>Trova online</b><small>Altri schemi gratuiti sul web</small></button></div>`;
    $$('[data-c]', v).forEach(t => t.onclick = () => Nav.vai('categoria', t.dataset.c));
    $$('[data-vai]', v).forEach(t => t.onclick = () => Nav.vai(t.dataset.vai));
  },

  categoria(v, id) {
    const c = CATEGORIE.find(x => x.id === id); titolo(c.nome);
    const lista = SCHEMI.filter(s => s.cat === id).sort((a, b) => a.livello - b.livello);
    v.innerHTML = `<h2>${c.emoji} ${c.nome}</h2><div class="lista">${lista.map(s => {
      const pr = D().progressi[s.id]; const n = pr ? pr.fatti.length : 0;
      return `<div class="riga" data-id="${s.id}"><span class="emoji">${s.emoji}</span><div class="cresci"><b>${esc(s.titolo)}</b>
        <small>${livelloHTML(s.livello)} ⏱ ${s.tempo} · 📏 ${s.misure}${n ? ` · ✔ ${n}/${s.passi.length} passi` : ''}</small></div><span>›</span></div>`;
    }).join('')}</div>`;
    $$('.riga', v).forEach(r => r.onclick = () => Nav.vai('schema', r.dataset.id));
  },

  schema(v, id) {
    const s = SCHEMI.find(x => x.id === id); titolo(s.titolo);
    const fatti = () => (D().progressi[s.id] || { fatti: [] }).fatti;
    const disegna = () => {
      v.innerHTML = `<h2>${s.emoji} ${esc(s.titolo)}</h2>
        <p>${livelloHTML(s.livello)} <span class="etichetta">⏱ ${s.tempo}</span><span class="etichetta">📏 ${s.misure}</span></p>
        <p>${esc(s.intro)}</p>
        <div class="scheda"><b>Occorrente</b><ul>${s.materiale.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>
        ${diagrammaSchema(s)}
        <h3>Come si fa</h3><div id="modo"></div>${passiHTML(s, fatti(), s.id)}
        ${s.consigli ? `<div class="consiglio">💡 ${esc(s.consigli)}</div>` : ''}
        <p class="tenue piccolo">Non conosci un punto? Guarda la Libreria punti. Abbreviazioni: cat catenella, mbss maglia bassissima, mb maglia bassa, mma mezza maglia alta, ma maglia alta, maa maglia altissima, cm cerchio magico, aum aumento, dim diminuzione, fp/fa filo posteriore/anteriore.</p>
        <div class="bottoni">
          <button class="btn verde" id="inizia">▶ Inizia un progetto con questo schema</button>
          <button class="btn sec" id="stampaS">🖨️ Stampa</button>
          <button class="btn sec" id="libreria">📖 Libreria punti</button>
          <button class="btn sec" id="azzera">Togli le spunte</button>
        </div>`;
      $('#modo').replaceWith(selettoreModo(v, disegna));
      collegaPassi(v, fatti, f => { D().progressi[s.id] = { agg: ora(), fatti: f }; Archivio.salva(); });
      $('#inizia').onclick = () => {
        const p = { id: nuovoId(), agg: ora(), creato: ora(), nome: s.titolo, schemaId: s.id, stato: 'incorso', categoria: s.cat,
          uncinetto: '', filato: '', note: '', foto: '', fatti: [], contatori: [nuovoContatore('Giro'), nuovoContatore('Maglie', true)] };
        D().progetti.push(p); Archivio.salva(); Nav.vai('progetto', p.id); avviso('Progetto creato!');
      };
      $('#stampaS').onclick = () => stampaSchema(s);
      $('#libreria').onclick = () => Nav.vai('libreria');
      $('#azzera').onclick = () => { D().progressi[s.id] = { agg: ora(), fatti: [] }; Archivio.salva(); disegna(); };
    };
    disegna();
  },

  progetti(v) {
    titolo('I miei progetti');
    const ord = [...D().progetti].sort((a, b) => (a.stato === 'finito') - (b.stato === 'finito') || b.agg - a.agg);
    v.innerHTML = `<div class="bottoni"><button class="btn" id="nuovo">➕ Nuovo progetto</button></div>
      ${ord.length ? '' : '<p class="tenue">Nessun progetto ancora. Creane uno nuovo oppure scegli uno schema e premi "Inizia un progetto".</p>'}
      <div class="lista">${ord.map(p => `<div class="riga" data-id="${p.id}">
        ${p.foto ? `<img class="miniatura" src="${p.foto}">` : `<span class="emoji">${p.stato === 'finito' ? '✅' : '🧶'}</span>`}
        <div class="cresci"><b>${esc(p.nome)}</b><small>${STATI[p.stato] || ''}${p.contatori.length ? ' · ' + p.contatori.map(c => `${esc(c.nome)} ${c.valore}`).join(' · ') : ''}</small></div><span>›</span></div>`).join('')}</div>`;
    $('#nuovo').onclick = () => {
      const nome = prompt('Nome del progetto:', 'Nuovo lavoro'); if (!nome) return;
      const p = { id: nuovoId(), agg: ora(), creato: ora(), nome, schemaId: '', stato: 'incorso', uncinetto: '', filato: '', note: '', foto: '', fatti: [],
        contatori: [nuovoContatore('Giro'), nuovoContatore('Maglie', true)] };
      D().progetti.push(p); Archivio.salva(); Nav.vai('progetto', p.id);
    };
    $$('.riga', v).forEach(r => r.onclick = () => Nav.vai('progetto', r.dataset.id));
  },

  progetto(v, id) {
    const p = D().progetti.find(x => x.id === id);
    if (!p) { Nav.indietro(); return; }
    titolo(p.nome);
    const s = SCHEMI.find(x => x.id === p.schemaId);
    const mio = D().mieiSchemi.find(x => x.id === p.schemaId);
    const salva = () => { p.agg = ora(); Archivio.salva(); };
    const disegna = () => {
      v.innerHTML = `
        ${p.foto ? `<img class="foto" src="${p.foto}">` : ''}
        <div id="cc"></div>
        ${s ? `<h3>Passi dello schema: ${esc(s.titolo)}</h3><div id="modo"></div>${passiHTML(s, p.fatti, p.id)}
          <div class="bottoni"><button class="btn sec" id="apriSchema">Apri schema completo e diagramma</button></div>` : ''}
        ${mio ? `<div class="bottoni"><button class="btn sec" id="apriMio">✏️ Apri il mio schema "${esc(mio.nome)}"</button></div>` : ''}
        <div class="scheda">
          <label>Nome</label><input id="pNome" value="${esc(p.nome)}">
          <div class="due">
            <div><label>Stato</label><select id="pStato">${Object.entries(STATI).map(([k, t]) => `<option value="${k}" ${p.stato === k ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
            <div><label>Uncinetto (mm)</label><input id="pUnc" value="${esc(p.uncinetto)}" placeholder="es. 4"></div>
          </div>
          <label>Filato</label><input id="pFil" value="${esc(p.filato)}" placeholder="marca, colore, quantità">
          <label>Collega uno schema</label><select id="pSchema"><option value="">— nessuno —</option>
            <optgroup label="Schemi dell'app">${SCHEMI.map(x => `<option value="${x.id}" ${p.schemaId === x.id ? 'selected' : ''}>${esc(x.titolo)}</option>`).join('')}</optgroup>
            ${D().mieiSchemi.length ? `<optgroup label="I miei schemi">${D().mieiSchemi.map(x => `<option value="${x.id}" ${p.schemaId === x.id ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</optgroup>` : ''}</select>
          <label>Note</label><textarea id="pNote" placeholder="Modifiche, misure, idee…">${esc(p.note)}</textarea>
          <label>Foto</label><input type="file" id="pFoto" accept="image/*">
          <div class="bottoni">${p.foto ? '<button class="btn sec piccolo" id="togliFoto">Togli foto</button>' : ''}
            <button class="btn rosso piccolo" id="elimina">🗑 Elimina progetto</button></div>
        </div>`;
      disegnaContatori($('#cc'), p.contatori, salva);
      if (s) {
        $('#modo').replaceWith(selettoreModo(v, disegna));
        collegaPassi(v, () => p.fatti, f => { p.fatti = f; salva(); });
        $('#apriSchema').onclick = () => Nav.vai('schema', s.id);
      }
      if (mio) $('#apriMio').onclick = () => Nav.vai('editor', mio.id);
      $('#pNome').onchange = e => { p.nome = e.target.value || p.nome; titolo(p.nome); salva(); };
      $('#pStato').onchange = e => { p.stato = e.target.value; salva(); if (p.stato === 'finito') avviso('Complimenti! 🎉'); };
      $('#pUnc').onchange = e => { p.uncinetto = e.target.value; salva(); };
      $('#pFil').onchange = e => { p.filato = e.target.value; salva(); };
      $('#pNote').onchange = e => { p.note = e.target.value; salva(); };
      $('#pSchema').onchange = e => { p.schemaId = e.target.value; p.fatti = []; salva(); VISTE.progetto(v, id); };
      $('#pFoto').onchange = async e => { const f = e.target.files[0]; if (!f) return; p.foto = await riduciFoto(f); salva(); disegna(); };
      if (p.foto) $('#togliFoto').onclick = () => { p.foto = ''; salva(); disegna(); };
      $('#elimina').onclick = () => { if (confirm(`Eliminare il progetto "${p.nome}"?`)) { Archivio.elimina('progetti', p.id); Nav.indietro(); } };
    };
    disegna();
  },

  altro(v) {
    titolo('Altro');
    v.innerHTML = `<div class="griglia">${[['mieiSchemi', '✏️', 'Disegna schemi'], ['libreria', '📖', 'Libreria punti'], ['calcolatori', '🧮', 'Calcolatori'],
      ['online', '🌐', 'Trova online'], ['impostazioni', '⚙️', 'Impostazioni'], ['guida', '❓', 'Guida all\'app']]
      .map(([id, e, t]) => `<button class="tessera" data-vai="${id}"><span class="emoji">${e}</span><b>${t}</b></button>`).join('')}</div>`;
    $$('.tessera', v).forEach(t => t.onclick = () => Nav.vai(t.dataset.vai));
  },

  libreria(v) {
    titolo('Libreria punti');
    const gruppi = [...new Set(PUNTI.map(p => p.gruppo))];
    v.innerHTML = gruppi.map(g => `<h3>${g}</h3><div class="lista">${PUNTI.filter(p => p.gruppo === g).map(p => `
      <div class="riga" data-id="${p.id}"><div class="simbolo-grande">${p.simbolo ? simboloSVG(p.simbolo, 46) : '🧶'}</div>
      <div class="cresci"><b>${esc(p.nome)}</b><small>${p.simbolo ? SIMBOLI[p.simbolo].abbr + ' · ' : ''}in inglese: ${esc(p.us)}</small></div>${livelloHTML(p.livello)}</div>`).join('')}</div>`).join('');
    $$('.riga', v).forEach(r => r.onclick = () => Nav.vai('punto', r.dataset.id));
  },

  punto(v, id) {
    const p = PUNTI.find(x => x.id === id); titolo(p.nome);
    v.innerHTML = `<div class="riga" style="cursor:default"><div class="simbolo-grande" style="width:90px;height:90px">${p.simbolo ? simboloSVG(p.simbolo, 72) : '<span style="font-size:2.4em">🧶</span>'}</div>
      <div class="cresci"><h2 style="margin:0">${esc(p.nome)}</h2><small>${p.simbolo ? 'Abbreviazione: <b>' + SIMBOLI[p.simbolo].abbr + '</b> · ' : ''}Negli schemi inglesi: <b>${esc(p.us)}</b></small></div></div>
      <h3>Passo passo</h3><ol class="passi">${p.semplice.map((t, i) => `<li><span class="num">${i + 1}.</span><span>${esc(t)}</span></li>`).join('')}</ol>
      <div class="consiglio">⚡ <b>Per chi è già esperto:</b> ${esc(p.esperto)}</div>
      <div class="bottoni"><button class="btn sec" id="video">🎬 Cerca un video su YouTube</button></div>`;
    $('#video').onclick = () => Piattaforma.apriLink('https://www.youtube.com/results?search_query=' + encodeURIComponent(p.nome + ' uncinetto tutorial'));
  },

  mieiSchemi(v) {
    titolo('I miei schemi');
    const lista = [...D().mieiSchemi].sort((a, b) => b.agg - a.agg);
    v.innerHTML = `<p class="tenue">Disegna schemi a griglia: a colori (filet, pixel, scritte, motivi a jacquard) o con i simboli dei punti. Si salvano sul NAS insieme ai progetti.</p>
      <div class="bottoni"><button class="btn" id="nuovo">➕ Nuovo schema</button></div>
      <div class="lista">${lista.map(s => `<div class="riga" data-id="${s.id}"><span class="emoji">✏️</span><div class="cresci"><b>${esc(s.nome)}</b><small>${s.righe} righe × ${s.colonne} colonne</small></div>
        <button class="btn sec piccolo" data-del="${s.id}">🗑</button></div>`).join('')}</div>`;
    $('#nuovo').onclick = () => {
      const s = { id: nuovoId(), agg: ora(), nome: 'Nuovo schema', righe: 20, colonne: 20, celle: {}, note: '' };
      D().mieiSchemi.push(s); Archivio.salva(); Nav.vai('editor', s.id);
    };
    $$('.riga', v).forEach(r => r.onclick = e => { if (e.target.dataset.del) return; Nav.vai('editor', r.dataset.id); });
    $$('[data-del]', v).forEach(b => b.onclick = () => { const s = D().mieiSchemi.find(x => x.id === b.dataset.del); if (confirm(`Eliminare "${s.nome}"?`)) { Archivio.elimina('mieiSchemi', s.id); VISTE.mieiSchemi(v); } });
  },

  editor(v, id) {
    const s = D().mieiSchemi.find(x => x.id === id);
    if (!s) { Nav.indietro(); return; }
    titolo(s.nome);
    const copia = JSON.parse(JSON.stringify(s));
    Editor.apri(v, copia, nuovo => { Object.assign(s, nuovo); titolo(s.nome); Archivio.salva(); avviso('Schema salvato'); });
  },

  calcolatori(v) {
    titolo('Calcolatori');
    const schede = { campione: '📐 Campione', filato: '🧶 Filato', aumenti: '➕ Aumenti/diminuzioni', cerchio: '⭕ Cerchio piatto', uncinetti: '🪡 Misure uncinetti' };
    let att = 'campione';
    const disegna = () => {
      v.innerHTML = `<div class="schede-tab">${Object.entries(schede).map(([k, t]) => `<button data-k="${k}" class="${k === att ? 'attivo' : ''}">${t}</button>`).join('')}</div><div class="scheda" id="calc"></div>`;
      $$('.schede-tab button', v).forEach(b => b.onclick = () => { att = b.dataset.k; disegna(); });
      CALCOLI[att]($('#calc'));
    };
    disegna();
  },

  online(v) {
    titolo('Trova online');
    v.innerHTML = `<p class="tenue">Siti con tanti schemi gratuiti. Tocca un nome: la pagina si apre nel browser. Gli schemi appartengono ai loro autori.</p>` +
      LINK_ONLINE.map(g => `<h3>${g.emoji} ${g.cat}</h3><div class="lista">${g.link.map(l => `
        <div class="riga" data-url="${esc(l.url)}"><span class="emoji">🔗</span><div class="cresci"><b>${esc(l.nome)}</b><small>${esc(l.nota)}</small></div><span>↗</span></div>`).join('')}</div>`).join('') +
      `<div class="consiglio">💡 Negli schemi in inglese: <b>sc</b> = maglia bassa, <b>hdc</b> = mezza maglia alta, <b>dc</b> = maglia alta, <b>tr</b> = maglia altissima, <b>ch</b> = catenella, <b>sl st</b> = maglia bassissima. Attenzione: negli schemi inglesi (UK) "dc" significa maglia bassa! Controlla sempre se lo schema è US o UK.</div>`;
    $$('[data-url]', v).forEach(r => r.onclick = () => Piattaforma.apriLink(r.dataset.url));
  },

  impostazioni(v) {
    titolo('Impostazioni');
    const imp = Archivio.imp;
    v.innerHTML = `
      <div class="scheda"><h3 style="margin-top:0">Aspetto</h3>
        <label>Spiegazioni</label><select id="iModo"><option value="semplice">🌱 Semplici (principiante)</option><option value="esperto">⚡ Brevi (esperto)</option></select>
        <label>Grandezza del testo</label><select id="iTesto"><option value="normale">Normale</option><option value="grande">Grande</option><option value="enorme">Molto grande</option></select>
        <label><input type="checkbox" id="iVibra" style="width:auto"> Vibrazione a ogni +1 (telefono)</label>
        <label><input type="checkbox" id="iSchermo" style="width:auto"> Tieni lo schermo acceso mentre conti</label>
      </div>
      <div class="scheda" id="nas"></div>
      <div class="scheda"><h3 style="margin-top:0">Copia di sicurezza</h3>
        <p class="tenue piccolo">Salva un file con tutti i progetti e gli schemi, oppure recuperali da un file.</p>
        <div class="bottoni"><button class="btn sec" id="esporta">💾 Esporta copia</button><button class="btn sec" id="importaB">📂 Importa copia</button>
        <input type="file" id="importa" accept=".json,application/json" hidden></div></div>
      <p class="tenue piccolo">SirJoe Uncinetto 1.0 · ${PIATTAFORMA}</p>`;
    $('#iModo').value = imp.modo; $('#iTesto').value = imp.testo; $('#iVibra').checked = imp.vibra; $('#iSchermo').checked = imp.schermo;
    $('#iModo').onchange = e => { imp.modo = e.target.value; Archivio.salvaImp(); };
    $('#iTesto').onchange = e => { imp.testo = e.target.value; Archivio.salvaImp(); applicaTesto(); };
    $('#iVibra').onchange = e => { imp.vibra = e.target.checked; Archivio.salvaImp(); };
    $('#iSchermo').onchange = e => { imp.schermo = e.target.checked; Archivio.salvaImp(); };
    $('#esporta').onclick = () => Piattaforma.salvaFile(`uncinetto-copia-${new Date().toISOString().slice(0, 10)}.json`, Archivio.esporta());
    $('#importaB').onclick = () => $('#importa').click();
    $('#importa').onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { Archivio.importa(r.result); avviso('Copia importata'); } catch (err) { alert('File non valido'); } }; r.readAsText(f); };
    disegnaNAS($('#nas'));
  },

  guida(v) {
    titolo('Guida');
    v.innerHTML = `<div class="scheda">
      <h3 style="margin-top:0">Come si usa</h3>
      <p><b>Contatore</b>: tocca il grande <b>+1</b> a ogni giro o maglia. Il secondo contatore (Maglie) torna a zero da solo quando aumenti il Giro. Con ⚙ puoi rinominare, mettere un obiettivo o eliminare. Su PC puoi usare la barra spaziatrice.</p>
      <p><b>Schemi</b>: divisi per categoria, con il disegno a simboli e i passi da spuntare. In alto scegli spiegazione semplice o versione esperto. Premi "Inizia un progetto" per avere contatori e passi salvati.</p>
      <p><b>I miei progetti</b>: ogni progetto ha i suoi contatori, note, foto, filato e uncinetto usati.</p>
      <p><b>Disegna schemi</b>: scegli un colore o un simbolo e tocca i quadretti. La riga 1 è in basso, come negli schemi veri. Puoi stampare (su Android anche salvare come PDF).</p>
      <p><b>Libreria punti</b>: ogni punto spiegato passo passo, con simbolo e nome inglese.</p>
      <p><b>Calcolatori</b>: quante catenelle servono, quanto filato, come distribuire aumenti e diminuzioni.</p>
      <h3>Sincronizzazione con il NAS</h3>
      <p><b>Windows</b>: Impostazioni → "Scegli cartella NAS" e indica una cartella del NAS (per esempio \\\\192.168.1.198\\FRITZ.NAS\\Uncinetto).</p>
      <p><b>Android</b>: dai il permesso "Accesso a tutti i file". L'app salva in <b>/SirJoeUncinetto</b> sul telefono. In <b>FolderSync</b> crea una coppia di cartelle "bidirezionale" tra /SirJoeUncinetto e la stessa cartella del NAS usata dal PC.</p>
      <p>I dati vengono sempre salvati anche sul dispositivo: se il NAS non è raggiungibile non si perde nulla, e alla prossima sincronizzazione le modifiche si uniscono.</p></div>`;
  },
};

function applicaTesto() { document.body.classList.toggle('testo-grande', Archivio.imp.testo === 'grande'); document.body.classList.toggle('testo-enorme', Archivio.imp.testo === 'enorme'); }

async function disegnaNAS(el) {
  let corpo = '';
  if (PIATTAFORMA === 'windows') {
    const c = await NATIVO.getCartellaNAS();
    corpo = `<p>Cartella del NAS: <b>${c ? esc(c) : 'non scelta'}</b></p>
      <p class="tenue piccolo">Scegli una cartella del NAS del FRITZ!Box (es. \\\\192.168.1.198\\FRITZ.NAS\\Uncinetto) o qualsiasi cartella condivisa.</p>
      <div class="bottoni"><button class="btn" id="scegli">📁 Scegli cartella NAS</button>${c ? '<button class="btn sec" id="togli">Scollega</button>' : ''}<button class="btn sec" id="ora">⟳ Sincronizza ora</button></div>`;
  } else if (PIATTAFORMA === 'android') {
    let ok = false; try { ok = (await SJ.haAccesso()).ok; } catch (e) {}
    corpo = `<p>Cartella sul telefono: <b>/SirJoeUncinetto</b> — permesso: <b>${ok ? '✓ concesso' : '✗ da concedere'}</b></p>
      <p class="tenue piccolo">Con FolderSync sincronizza in modo bidirezionale questa cartella con la cartella del NAS usata anche dal PC.</p>
      <div class="bottoni">${ok ? '' : '<button class="btn" id="permesso">🔓 Concedi accesso ai file</button>'}<button class="btn sec" id="ora">⟳ Sincronizza ora</button></div>`;
  } else {
    corpo = '<p class="tenue">Nel browser i dati restano solo su questo computer. Usa l\'app per Windows o Android per sincronizzare con il NAS.</p>';
  }
  el.innerHTML = `<h3 style="margin-top:0">Sincronizzazione NAS ${Archivio.stato ? '· ' + esc(Archivio.stato) : ''}</h3>${corpo}
    ${Archivio.ultimoSync ? `<p class="tenue piccolo">Ultima sincronizzazione: ${new Date(Archivio.ultimoSync).toLocaleString('it-IT')}</p>` : ''}`;
  const b = (id, f) => { const x = el.querySelector('#' + id); if (x) x.onclick = f; };
  b('scegli', async () => { const c = await NATIVO.scegliCartellaNAS(); if (c) { await Archivio.sincronizza(); avviso('Cartella collegata'); } disegnaNAS(el); });
  b('togli', async () => { await NATIVO.impostaCartellaNAS(''); Archivio._setStato(''); disegnaNAS(el); });
  b('ora', async () => { await Archivio.sincronizza(); disegnaNAS(el); if (Archivio.stato === '✓ NAS') avviso('Sincronizzato'); });
  b('permesso', async () => { await SJ.chiediAccesso(); avviso('Attiva il permesso e poi torna nell\'app'); });
}

/* ---------------- Calcolatori ---------------- */
const num = id => parseFloat(String($('#' + id).value).replace(',', '.')) || 0;
const CALCOLI = {
  campione(el) {
    el.innerHTML = `<p class="tenue">Lavora un quadrato di prova di almeno 12×12 cm con il punto e l'uncinetto del progetto, poi conta quante maglie e righe ci stanno in 10 cm.</p>
      <div class="due"><div><label>Maglie in 10 cm</label><input id="cM" type="number" value="16"></div><div><label>Righe in 10 cm</label><input id="cR" type="number" value="18"></div></div>
      <div class="due"><div><label>Larghezza voluta (cm)</label><input id="cL" type="number" value="50"></div><div><label>Altezza voluta (cm)</label><input id="cH" type="number" value="60"></div></div>
      <label>Punto</label><select id="cP"><option value="1">Maglia bassa (+1 catenella)</option><option value="2">Mezza maglia alta (+2)</option><option value="3">Maglia alta (+3)</option></select>
      <div class="risultato" id="cRis"></div>`;
    const f = () => {
      const m = Math.round(num('cM') * num('cL') / 10), r = Math.round(num('cR') * num('cH') / 10), extra = +$('#cP').value;
      $('#cRis').innerHTML = `Ti servono <b>${m}</b> maglie per riga e circa <b>${r}</b> righe.<br>Avvia con <b>${m + extra}</b> catenelle.`;
    };
    $$('input,select', el).forEach(i => i.oninput = f); f();
  },
  filato(el) {
    el.innerHTML = `<p class="tenue">Pesa il campione (o calcola quanto filato hai usato) e indica le misure del lavoro finito.</p>
      <div class="due"><div><label>Campione: larghezza (cm)</label><input id="fCL" type="number" value="12"></div><div><label>Campione: altezza (cm)</label><input id="fCH" type="number" value="12"></div></div>
      <label>Grammi usati per il campione</label><input id="fG" type="number" value="8">
      <div class="due"><div><label>Lavoro: larghezza (cm)</label><input id="fL" type="number" value="80"></div><div><label>Lavoro: altezza (cm)</label><input id="fH" type="number" value="100"></div></div>
      <label>Peso di un gomitolo (g)</label><input id="fGom" type="number" value="100">
      <div class="risultato" id="fRis"></div>`;
    const f = () => {
      const area = num('fCL') * num('fCH'); if (!area) return;
      const g = num('fG') * (num('fL') * num('fH')) / area, gm = g * 1.1;
      $('#fRis').innerHTML = `Servono circa <b>${Math.round(g)} g</b> di filato.<br>Con il 10% di scorta: <b>${Math.ceil(gm)} g</b> = <b>${Math.ceil(gm / (num('fGom') || 100))}</b> gomitoli.`;
    };
    $$('input', el).forEach(i => i.oninput = f); f();
  },
  aumenti(el) {
    el.innerHTML = `<p class="tenue">Distribuisce in modo uniforme gli aumenti o le diminuzioni lungo un giro o una riga.</p>
      <div class="due"><div><label>Maglie che hai ora</label><input id="aA" type="number" value="30"></div><div><label>Maglie che vuoi ottenere</label><input id="aB" type="number" value="36"></div></div>
      <div class="risultato" id="aRis"></div>`;
    const f = () => {
      const A = Math.round(num('aA')), B = Math.round(num('aB'));
      let t = '';
      if (A <= 0 || B <= 0) t = 'Scrivi due numeri maggiori di zero.';
      else if (A === B) t = 'Nessun cambiamento: 1 maglia in ogni maglia.';
      else if (B > A) {
        const n = B - A;
        if (n > A) t = `Troppi aumenti: con ${A} maglie puoi arrivare al massimo a ${A * 2} (2 maglie in ogni maglia).`;
        else { const base = Math.floor((A - n) / n), resto = (A - n) % n;
          t = resto === 0 ? `Ripeti <b>${n}</b> volte: (${base ? base + ' mb, ' : ''}aum).`
            : `Ripeti <b>${resto}</b> volte: (${base + 1} mb, aum), poi <b>${n - resto}</b> volte: (${base ? base + ' mb, ' : ''}aum).`; }
      } else {
        const d = A - B;
        if (d * 2 > A) t = `Troppe diminuzioni: con ${A} maglie puoi scendere al minimo a ${Math.ceil(A / 2)}.`;
        else { const lib = A - d * 2, base = Math.floor(lib / d), resto = lib % d;
          t = resto === 0 ? `Ripeti <b>${d}</b> volte: (${base ? base + ' mb, ' : ''}dim).`
            : `Ripeti <b>${resto}</b> volte: (${base + 1} mb, dim), poi <b>${d - resto}</b> volte: (${base ? base + ' mb, ' : ''}dim).`; }
      }
      $('#aRis').innerHTML = t + (A !== B && A > 0 && B > 0 ? `<br><small class="tenue">Totale finale: ${B} maglie. "mb" vale per qualsiasi punto che stai usando.</small>` : '');
    };
    $$('input', el).forEach(i => i.oninput = f); f();
  },
  cerchio(el) {
    el.innerHTML = `<p class="tenue">Quante maglie servono a ogni giro per un cerchio che resta piatto.</p>
      <div class="due"><div><label>Punto</label><select id="ceP"><option value="6">Maglia bassa (inizio 6)</option><option value="8">Mezza maglia alta (inizio 8)</option><option value="12">Maglia alta (inizio 12)</option></select></div>
      <div><label>Numero di giri</label><input id="ceN" type="number" value="10" min="1" max="40"></div></div><div id="ceT"></div>`;
    const f = () => {
      const k = +$('#ceP').value, n = Math.min(40, Math.max(1, Math.round(num('ceN'))));
      let r = '<table class="tab"><tr><th>Giro</th><th>Istruzione</th><th>Maglie</th></tr>';
      for (let g = 1; g <= n; g++) {
        const istr = g === 1 ? `${k} maglie nel cerchio magico` : g === 2 ? `2 maglie in ogni maglia (${k} aumenti)` : `(${g - 2} maglie, 1 aumento) × ${k}`;
        r += `<tr><td>${g}</td><td>${istr}</td><td><b>${k * g}</b></td></tr>`;
      }
      $('#ceT').innerHTML = r + '</table>';
    };
    $$('input,select', el).forEach(i => i.oninput = f); f();
  },
  uncinetti(el) {
    const t = [['2', 'B-1', 'Cotone sottile, pizzi'], ['2,5', '—', 'Cotone fine, amigurumi'], ['2,75', 'C-2', 'Cotone fine'], ['3', '—', 'Cotone medio-fine, amigurumi'],
      ['3,25', 'D-3', 'Filato fine'], ['3,5', 'E-4', 'Cotone medio'], ['3,75', 'F-5', 'Medio'], ['4', 'G-6', 'Lana/cotone medio'], ['4,5', '7', 'Medio'],
      ['5', 'H-8', 'Lana media, coperte'], ['5,5', 'I-9', 'Lana media-grossa'], ['6', 'J-10', 'Lana grossa'], ['6,5', 'K-10½', 'Grossa'], ['8', 'L-11', 'Molto grossa'],
      ['9', 'M/N-13', 'Molto grossa, fettuccia'], ['10', 'N/P-15', 'Fettuccia, maxi'], ['12', 'O-16', 'Maxi'], ['15', 'P/Q', 'Maxi, corda']];
    el.innerHTML = `<p class="tenue">Equivalenze tra misure europee (mm) e americane (US). Controlla anche la fascetta del gomitolo: indica l'uncinetto consigliato.</p>
      <table class="tab"><tr><th>mm</th><th>US</th><th>Filato adatto</th></tr>${t.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`;
  },
};

/* ---------------- Utilità ---------------- */
function riduciFoto(file) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const max = 900, sc = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = img.width * sc; c.height = img.height * sc;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      ok(c.toDataURL('image/jpeg', 0.72)); URL.revokeObjectURL(img.src);
    };
    img.onerror = ko;
    img.src = URL.createObjectURL(file);
  });
}

function stampaSchema(s) {
  const fatti = (D().progressi[s.id] || { fatti: [] }).fatti;
  document.getElementById('stampa').innerHTML = `<h2>${esc(s.titolo)}</h2>
    <p>Livello: ${['', 'Facile', 'Medio', 'Impegnativo'][s.livello]} · Tempo: ${s.tempo} · Misure: ${s.misure}</p>
    <p><b>Occorrente:</b> ${s.materiale.map(esc).join(', ')}</p>${diagrammaSchema(s)}
    <h3>Come si fa</h3><ol>${s.passi.map((p, i) => `<li>${fatti.includes(i) ? '✔ ' : ''}${esc(esperto() ? p.e : p.s)}</li>`).join('')}</ol>
    ${s.consigli ? `<p><b>Consiglio:</b> ${esc(s.consigli)}</p>` : ''}<p class="piccolo">SirJoe Uncinetto</p>`;
  setTimeout(() => Piattaforma.stampa(), 200);
}

/* ---------------- Avvio ---------------- */
$('#btnIndietro').onclick = () => history.back();
$$('#menu button').forEach(b => b.onclick = () => Nav.radice(b.dataset.vai));
Archivio.alCambio(() => { const a = Nav.attuale(); if (a && a.vista !== 'editor') Nav.mostra(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) Archivio.sincronizza(true); });
(async () => {
  await Archivio.avvia();
  applicaTesto();
  history.replaceState({ n: 1 }, '');
  Nav.pila = [{ vista: 'home' }];
  Nav.mostra();
  if (PIATTAFORMA === 'android') { try { if (!(await SJ.haAccesso()).ok) avviso('Per sincronizzare con il NAS vai in Impostazioni e concedi l\'accesso ai file'); } catch (e) {} }
})();
