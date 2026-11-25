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
    const radiceMenu = { home: 'home', contatore: 'contatore', schemi: 'schemi', categoria: 'schemi', schema: 'schemi', progetti: 'progetti', progetto: 'progetti', scuola: 'home', lezione: 'home', forme: 'home', foto: 'home' }[vista] || 'altro';
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
        ${[['foto', '📸', 'Da foto a schema', 'L\'intelligenza artificiale scrive lo schema'], ['scuola', '🎓', 'Scuola di schemi', `${LEZIONI.length} lezioni con animazioni`], ['forme', '🧸', 'Progettista di forme', 'Inventa un amigurumi'],
           ['contatore', '➕', 'Contatore', 'Conta giri e maglie'], ['schemi', '🧶', 'Schemi', `${SCHEMI.length} schemi in ${CATEGORIE.length} categorie`],
           ['progetti', '📁', 'I miei progetti', `${D().progetti.length} progetti`], ['mieiSchemi', '✏️', 'Disegna schemi', 'Griglia a colori e simboli'],
           ['libreria', '📖', 'Libreria punti', `${PUNTI.length} punti spiegati`], ['calcolatori', '🧮', 'Calcolatori', 'Campione, filato, aumenti'],
           ['online', '🌐', 'Trova online', 'Schemi gratis da stampare e social'], ['impostazioni', '⚙️', 'Impostazioni', 'NAS, testo, modalità']]
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
      return `<div class="riga" data-id="${s.id}"><span class="emoji">${s.emoji}</span><div class="cresci"><b>${esc(s.titolo)}</b>${s.nuovo ? '<span class="nuovo">✨ Esclusivo</span>' : ''}
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
          <button class="btn sec" id="esportaS">📤 Testo per app contarighe</button>
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
      $('#esportaS').onclick = () => mostraTesto(schemaInTesto(s), s.titolo);
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
    const sOrig = SCHEMI.find(x => x.id === p.schemaId);
    const s = sOrig || (p.passiPropri ? { titolo: p.nome, passi: p.passiPropri } : null);
    const mio = D().mieiSchemi.find(x => x.id === p.schemaId);
    const salva = () => { p.agg = ora(); Archivio.salva(); };
    const disegna = () => {
      v.innerHTML = `
        ${p.foto ? `<img class="foto" src="${p.foto}">` : ''}
        <div id="cc"></div>
        ${s ? `<h3>Passi dello schema: ${esc(s.titolo)}</h3><div id="modo"></div>${passiHTML(s, p.fatti, p.id)}
          ${sOrig ? '<div class="bottoni"><button class="btn sec" id="apriSchema">Apri schema completo e diagramma</button></div>' : ''}` : ''}
        ${s ? '<div class="bottoni"><button class="btn sec" id="esportaP">📤 Testo per app contarighe</button></div>' : ''}
        ${p.testoSchema ? `<details class="scheda"><summary><b>📄 Schema completo (materiali, legenda, assemblaggio)</b></summary>${testoInHTML(p.testoSchema)}</details>` : ''}
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
        if (sOrig) $('#apriSchema').onclick = () => Nav.vai('schema', s.id);
      }
      if (mio) $('#apriMio').onclick = () => Nav.vai('editor', mio.id);
      if ($('#esportaP')) $('#esportaP').onclick = () => mostraTesto(p.testoSchema || schemaInTesto({ ...s, titolo: p.nome }), p.nome);
      $('#pNome').onchange = e => { p.nome = e.target.value || p.nome; titolo(p.nome); salva(); };
      $('#pStato').onchange = e => { p.stato = e.target.value; salva(); if (p.stato === 'finito') avviso('Complimenti! 🎉'); };
      $('#pUnc').onchange = e => { p.uncinetto = e.target.value; salva(); };
      $('#pFil').onchange = e => { p.filato = e.target.value; salva(); };
      $('#pNote').onchange = e => { p.note = e.target.value; salva(); };
      $('#pSchema').onchange = e => { p.schemaId = e.target.value; p.fatti = []; if (e.target.value) delete p.passiPropri; salva(); VISTE.progetto(v, id); };
      $('#pFoto').onchange = async e => { const f = e.target.files[0]; if (!f) return; p.foto = await riduciFoto(f); salva(); disegna(); };
      if (p.foto) $('#togliFoto').onclick = () => { p.foto = ''; salva(); disegna(); };
      $('#elimina').onclick = () => { if (confirm(`Eliminare il progetto "${p.nome}"?`)) { Archivio.elimina('progetti', p.id); Nav.indietro(); } };
    };
    disegna();
  },

  altro(v) {
    titolo('Altro');
    v.innerHTML = `<div class="griglia">${[['foto', '📸', 'Da foto a schema'], ['importa', '📥', 'Importa schema scritto'], ['scuola', '🎓', 'Scuola di schemi'], ['forme', '🧸', 'Progettista di forme'], ['mieiSchemi', '✏️', 'Disegna schemi'], ['libreria', '📖', 'Libreria punti'], ['calcolatori', '🧮', 'Calcolatori'],
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
    v.innerHTML = `<p class="tenue">Schemi gratuiti divisi per categoria: 🖨️ = PDF gratuito da scaricare e stampare. Tocca un nome e la pagina si apre nel browser; sotto ogni categoria trovi le ricerche già pronte su Pinterest, YouTube, Instagram, Facebook e TikTok. Gli schemi appartengono ai loro autori.</p>` +
      `<div class="schede-tab">${LINK_ONLINE.map((g, i) => `<button data-salta="${i}">${g.emoji} ${g.cat.split(' (')[0]}</button>`).join('')}</div>` +
      LINK_ONLINE.map((g, i) => `<h3 id="cat${i}">${g.emoji} ${g.cat}</h3><div class="lista">${g.link.map(l => `
        <div class="riga" data-url="${esc(l.url)}"><span class="emoji">${l.pdf ? '🖨️' : '🔗'}</span><div class="cresci"><b>${esc(l.nome)}</b>${l.pdf ? '<span class="nuovo">PDF da stampare</span>' : ''}<small>${esc(l.nota)}</small></div><span>↗</span></div>`).join('')}</div>
        <div class="bottoni" style="margin-top:6px"><span class="piccolo tenue" style="align-self:center">Cerca sui social:</span>${SOCIAL.map((so, k) => `<button class="btn sec piccolo" data-so="${k}" data-q="${esc(g.social)}">${so.emoji} ${so.nome}</button>`).join('')}</div>`).join('') +
      `<div class="consiglio">💡 Negli schemi in inglese: <b>sc</b> = maglia bassa, <b>hdc</b> = mezza maglia alta, <b>dc</b> = maglia alta, <b>tr</b> = maglia altissima, <b>ch</b> = catenella, <b>sl st</b> = maglia bassissima. Attenzione: negli schemi inglesi (UK) "dc" significa maglia bassa! Controlla sempre se lo schema è US o UK.</div>`;
    $$('[data-url]', v).forEach(r => r.onclick = () => Piattaforma.apriLink(r.dataset.url));
    $$('[data-so]', v).forEach(b => b.onclick = () => Piattaforma.apriLink(SOCIAL[+b.dataset.so].url(b.dataset.q)));
    $$('[data-salta]', v).forEach(b => b.onclick = () => { const t = $('#cat' + b.dataset.salta); t && t.scrollIntoView({ behavior: 'smooth' }); });
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
      <div class="scheda"><h3 style="margin-top:0">🤖 Intelligenza artificiale (Da foto a schema)</h3>
        <p class="tenue piccolo">Serve una chiave API di Anthropic (console.anthropic.com → API Keys). Ogni foto analizzata costa pochi centesimi, addebitati sul tuo account Anthropic. La chiave resta solo su questo dispositivo e non viene copiata sul NAS.</p>
        <label>Chiave API</label><input id="iChiave" type="password" placeholder="sk-ant-..." autocomplete="off">
        <label>Modello</label><select id="iModello">${MODELLI_IA.map(m => `<option value="${m.id}">${m.nome}</option>`).join('')}</select>
        <div class="bottoni"><button class="btn sec piccolo" id="iMostra">👁 Mostra/nascondi</button><button class="btn sec piccolo" id="iConsole">🔑 Crea una chiave (sito Anthropic)</button></div></div>
      <div class="scheda" id="nas"></div>
      <div class="scheda"><h3 style="margin-top:0">Copia di sicurezza</h3>
        <p class="tenue piccolo">Salva un file con tutti i progetti e gli schemi, oppure recuperali da un file.</p>
        <div class="bottoni"><button class="btn sec" id="esporta">💾 Esporta copia</button><button class="btn sec" id="importaB">📂 Importa copia</button>
        <input type="file" id="importa" accept=".json,application/json" hidden></div></div>
      <p class="tenue piccolo">SirJoe Uncinetto 1.2 · ${PIATTAFORMA}</p>`;
    $('#iChiave').value = imp.chiaveIA || ''; $('#iModello').value = imp.modelloIA || MODELLI_IA[0].id;
    $('#iChiave').onchange = e => { imp.chiaveIA = e.target.value.trim(); Archivio.salvaImp(); avviso('Chiave salvata su questo dispositivo'); };
    $('#iModello').onchange = e => { imp.modelloIA = e.target.value; Archivio.salvaImp(); };
    $('#iMostra').onclick = () => { const i = $('#iChiave'); i.type = i.type === 'password' ? 'text' : 'password'; };
    $('#iConsole').onclick = () => Piattaforma.apriLink('https://console.anthropic.com/settings/keys');
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


/* ---------------- Animazioni ---------------- */
function animazione(cont, dati) {
  const { d, didascalie } = dati;
  cont.innerHTML = `<div class="diagramma anim">${d.svg}<div class="didascalia">Premi ▶ per vedere come si costruisce, maglia dopo maglia.</div>
    <div class="bottoni"><button class="btn" data-a="play">▶ Guarda</button><button class="btn sec" data-a="giro">⏭ Giro/riga successivo</button>
    <button class="btn sec" data-a="tutto">Mostra tutto</button><select data-a="vel" style="width:auto"><option value="2">Lenta</option><option value="1" selected>Normale</option><option value="0.5">Veloce</option></select></div>
    ${legendaHTML(d.usati)}</div>`;
  const el = [...cont.querySelectorAll('svg .m')];
  const tot = el.length;
  let k = tot, timer = null, vel = 1;
  const base = Math.max(25, Math.min(260, 16000 / Math.max(1, tot)));
  const didEl = cont.querySelector('.didascalia');
  const btnPlay = cont.querySelector('[data-a="play"]');
  const mostra = n => {
    k = n;
    el.forEach((e, i) => { e.classList.toggle('nascosto', i >= n); e.classList.toggle('ultimo', i === n - 1 && n < tot); });
    if (n === 0) { didEl.textContent = 'Si parte!'; return; }
    const g = +el[Math.min(n, tot) - 1].dataset.g;
    if (didascalie && didascalie[g]) didEl.textContent = didascalie[g];
  };
  const ferma = () => { clearInterval(timer); timer = null; btnPlay.textContent = k >= tot ? '↺ Rivedi' : '▶ Continua'; };
  const avvia = () => {
    if (k >= tot) mostra(0);
    btnPlay.textContent = '⏸ Pausa';
    timer = setInterval(() => { if (k >= tot) return ferma(); mostra(k + 1); }, base * vel);
  };
  btnPlay.onclick = () => timer ? ferma() : avvia();
  cont.querySelector('[data-a="giro"]').onclick = () => {
    ferma(); if (k >= tot) mostra(0);
    const gAtt = k ? +el[k - 1].dataset.g : -1;
    let n = k; while (n < tot && +el[n].dataset.g <= gAtt) n++;
    const gNuovo = n < tot ? +el[n].dataset.g : gAtt;
    while (n < tot && +el[n].dataset.g === gNuovo) n++;
    mostra(n); ferma();
  };
  cont.querySelector('[data-a="tutto"]').onclick = () => { ferma(); mostra(tot); didEl.textContent = 'Schema completo.'; btnPlay.textContent = '↺ Rivedi'; };
  cont.querySelector('[data-a="vel"]').onchange = e => { vel = +e.target.value; if (timer) { clearInterval(timer); timer = null; avvia(); } };
  // ferma l'animazione se si cambia schermata
  const osserva = setInterval(() => { if (!document.body.contains(cont)) { clearInterval(timer); clearInterval(osserva); } }, 1000);
}

function apriDestinazione(dest) {
  if (dest.startsWith('categoria:')) return Nav.vai('categoria', dest.split(':')[1]);
  Nav.vai(dest);
}

Object.assign(VISTE, {
  scuola(v) {
    titolo('Scuola di schemi');
    const fatte = (D().progressi.__lezioni || { fatti: [] }).fatti;
    v.innerHTML = `<h2>🎓 Impara a creare i tuoi schemi</h2>
      <p class="tenue">Lezioni passo passo con disegni, animazioni che costruiscono lo schema maglia dopo maglia e link ai video. Alla fine trovi modelli esclusivi da provare.</p>
      <div class="lista">${LEZIONI.map((l, i) => `<div class="riga" data-id="${l.id}"><div class="lezione-num ${fatte.includes(i) ? 'fatta' : ''}">${fatte.includes(i) ? '✓' : i + 1}</div>
        <div class="cresci"><b>${l.emoji} ${esc(l.titolo)}</b><small>⏱ ${l.durata}</small></div><span>›</span></div>`).join('')}</div>
      <h3>✨ Modelli esclusivi</h3><div class="lista">${SCHEMI.filter(s => s.nuovo).map(s => `<div class="riga" data-s="${s.id}"><span class="emoji">${s.emoji}</span>
        <div class="cresci"><b>${esc(s.titolo)}</b><small>${livelloHTML(s.livello)} ${CATEGORIE.find(c => c.id === s.cat).nome}</small></div><span>›</span></div>`).join('')}</div>
      <div class="bottoni"><button class="btn sec" id="forme">🧸 Progettista di forme</button><button class="btn sec" id="editor">✏️ Editor a griglia</button></div>`;
    $$('.riga[data-id]', v).forEach(r => r.onclick = () => Nav.vai('lezione', r.dataset.id));
    $$('.riga[data-s]', v).forEach(r => r.onclick = () => Nav.vai('schema', r.dataset.s));
    $('#forme').onclick = () => Nav.vai('forme');
    $('#editor').onclick = () => Nav.vai('mieiSchemi');
  },

  lezione(v, id) {
    const i = LEZIONI.findIndex(l => l.id === id), l = LEZIONI[i];
    titolo(l.titolo);
    v.innerHTML = `<div class="lez"><h2>${l.emoji} Lezione ${i + 1}: ${esc(l.titolo)}</h2><div id="sez"></div>
      <div class="bottoni" style="margin-top:20px"><button class="btn verde" id="fatta">✓ Lezione completata</button>
      ${i + 1 < LEZIONI.length ? `<button class="btn" id="prossima">Lezione ${i + 2} ›</button>` : ''}</div></div>`;
    const cont = $('#sez');
    l.sez.forEach(s => {
      const div = document.createElement('div');
      if (s.t) div.innerHTML = s.t;
      else if (s.svg) { div.className = 'diagramma'; div.style.margin = '10px 0'; div.innerHTML = s.svg(); }
      else if (s.anim) { try { animazione(div, s.anim()); } catch (e) { console.warn(e); } }
      else if (s.video) { div.className = 'video'; div.innerHTML = `🎬 <b>Guarda un video su YouTube</b><br><small class="tenue">Ricerca: "${esc(s.video)}" (si apre nel browser)</small>`;
        div.onclick = () => Piattaforma.apriLink('https://www.youtube.com/results?search_query=' + encodeURIComponent(s.video)); }
      else if (s.vai) { div.className = 'bottoni'; div.innerHTML = `<button class="btn sec">${s.vai[1]}</button>`; div.firstChild.onclick = () => apriDestinazione(s.vai[0]); }
      cont.appendChild(div);
    });
    $('#fatta').onclick = () => {
      const pr = D().progressi.__lezioni || { fatti: [] };
      if (!pr.fatti.includes(i)) pr.fatti.push(i);
      D().progressi.__lezioni = { agg: ora(), fatti: pr.fatti }; Archivio.salva(); avviso('Brava/o! Lezione completata 🎉');
    };
    if ($('#prossima')) $('#prossima').onclick = () => Nav.vai('lezione', LEZIONI[i + 1].id, true);
  },

  forme(v) {
    titolo('Progettista di forme');
    const st = Archivio.imp.forma || { tipo: 'sfera', max: 30, alt: 0 };
    const disegna = () => {
      const k = Math.round(st.max / 6);
      const altDef = st.tipo === 'ovale' || st.tipo === 'cilindro' ? 2 * k : 0;
      const alt = st.alt || altDef;
      const pf = progettaForma(st.tipo, st.max, alt || undefined);
      const cm = (st.max / Math.PI * 0.55).toFixed(1); // circa 0,55 cm per maglia bassa con cotone 3 mm
      v.innerHTML = `<p class="tenue">Scegli la forma e la grandezza: l'app calcola tutti i giri e ti mostra la sagoma. Ogni maglia bassa con cotone 3 mm e uncinetto 2,5 mm misura circa mezzo centimetro.</p>
        <div class="scheda"><label>Forma</label><div class="schede-tab">${Object.entries(FORME).map(([t, f]) => `<button data-t="${t}" class="${t === st.tipo ? 'attivo' : ''}">${f.emoji} ${f.nome}</button>`).join('')}</div>
          <label>Maglie nel giro più largo: <b>${st.max}</b> (diametro circa ${cm} cm)</label><input type="range" id="fMax" min="12" max="72" step="6" value="${st.max}">
          ${altDef ? `<label>Giri dritti (altezza): <b>${alt}</b></label><input type="range" id="fAlt" min="1" max="40" value="${alt}">` : ''}</div>
        <div class="due"><div class="diagramma">${sagomaSVG(pf.giri)}<div class="tenue piccolo">Sagoma vista di lato · ${pf.giri.length} giri</div></div>
          <div id="anFormA"></div></div>
        <h3>Il tuo schema</h3><ol class="passi">${pf.passi.map((p, i) => `<li><span class="num">${i + 1}.</span><span>${esc(p)}</span></li>`).join('')}</ol>
        <div class="bottoni"><button class="btn verde" id="crea">▶ Crea un progetto con questo schema</button><button class="btn sec" id="stampaF">🖨️ Stampa</button></div>`;
      const giriAum = pf.giri.filter((n, i) => i === 0 || n > pf.giri[i - 1]);
      animazione($('#anFormA'), { d: diagrammaTondo(giriCerchioMb(Math.min(6, giriAum.length))), didascalie: pf.passi });
      $$('.schede-tab button', v).forEach(b => b.onclick = () => { st.tipo = b.dataset.t; st.alt = 0; salvaSt(); disegna(); });
      $('#fMax').oninput = e => { st.max = +e.target.value; st.alt = 0; salvaSt(); disegna(); };
      if ($('#fAlt')) $('#fAlt').oninput = e => { st.alt = +e.target.value; salvaSt(); disegna(); };
      $('#crea').onclick = () => {
        const nome = prompt('Nome del progetto:', `${FORME[st.tipo].nome.split(' (')[0]} da ${st.max} maglie`); if (!nome) return;
        const p = { id: nuovoId(), agg: ora(), creato: ora(), nome, schemaId: '', stato: 'incorso', uncinetto: '2,5', filato: '', note: '', foto: '', fatti: [],
          passiPropri: pf.passi.map(x => ({ s: x, e: x })), contatori: [nuovoContatore('Giro'), nuovoContatore('Maglie', true)] };
        D().progetti.push(p); Archivio.salva(); Nav.vai('progetto', p.id); avviso('Progetto creato!');
      };
      $('#stampaF').onclick = () => {
        $('#stampa').innerHTML = `<h2>${FORME[st.tipo].emoji} ${FORME[st.tipo].nome} – ${st.max} maglie</h2>${sagomaSVG(pf.giri)}<ol>${pf.passi.map(p => `<li>${esc(p)}</li>`).join('')}</ol><p class="piccolo">SirJoe Uncinetto – Progettista di forme</p>`;
        setTimeout(() => Piattaforma.stampa(), 200);
      };
    };
    const salvaSt = () => { Archivio.imp.forma = st; Archivio.salvaImp(); };
    disegna();
  },
});


/* ---------------- Da foto a schema / testo ---------------- */
function mostraTesto(testo, nome) {
  const v = $('#vista');
  Nav.vai('testo', { testo, nome });
}
function creaProgettoDaTesto(testo, nome) {
  const passi = testoInPassi(testo);
  if (!passi.length) { alert('Non ho trovato righe "Giro 1:" o "Riga 1:" nel testo.'); return; }
  const p = { id: nuovoId(), agg: ora(), creato: ora(), nome: nome || titoloDaTesto(testo), schemaId: '', stato: 'incorso', uncinetto: '', filato: '', note: '', foto: '', fatti: [],
    passiPropri: passi, testoSchema: testo, contatori: [nuovoContatore('Giro'), nuovoContatore('Maglie', true)] };
  D().progetti.push(p); Archivio.salva(); Nav.vai('progetto', p.id); avviso(`Progetto creato con ${passi.length} passi`);
}

Object.assign(VISTE, {
  foto(v) {
    titolo('Da foto a schema');
    const st = VISTE.foto.stato || (VISTE.foto.stato = { foto: null, testo: '', note: '', tipo: 'auto' });
    const disegna = () => {
      v.innerHTML = `<p class="tenue">Carica la foto o il disegno di un lavoro all'uncinetto (pupazzo, centrino, presina, borsa…). L'intelligenza artificiale Claude lo analizza e scrive lo schema giro per giro, pronto per il contatore dell'app e per le app contarighe.</p>
        ${Archivio.imp.chiaveIA ? '' : '<div class="consiglio">🔑 Prima inserisci la tua chiave API in <a class="link" href="#" id="vaiImp">Impostazioni → Intelligenza artificiale</a>.</div>'}
        <div class="scheda">
          <label>1. Scegli la foto</label><input type="file" id="fFile" accept="image/*">
          ${st.foto ? `<img src="${st.foto.anteprima}" class="foto" style="margin-top:10px;object-fit:contain;background:#fff">` : ''}
          <label>2. Che cos'è?</label><select id="fTipo"><option value="auto">Decidi tu guardando la foto</option><option value="amigurumi tridimensionale lavorato a spirale">Amigurumi / pupazzo 3D</option>
            <option value="lavoro piatto in tondo (centrino, sottobicchiere, tappeto)">Piatto in tondo (centrino, sottobicchiere)</option><option value="lavoro piatto in piano andata e ritorno (presina, coperta, sciarpa)">Piatto in righe (presina, coperta, sciarpa)</option>
            <option value="capo da indossare o borsa">Capo da indossare o borsa</option></select>
          <label>3. Indicazioni (facoltative)</label><input id="fNote" placeholder="es. alto 15 cm, cotone 3 mm, colori rosa e bianco" value="${esc(st.note)}">
          <div class="bottoni"><button class="btn verde" id="fVai" ${st.foto ? '' : 'disabled'}>✨ Crea lo schema</button></div>
        </div>
        <div id="fRis">${st.testo ? risultato() : ''}</div>`;
      $('#fTipo').value = st.tipo;
      if ($('#vaiImp')) $('#vaiImp').onclick = e => { e.preventDefault(); Nav.vai('impostazioni'); };
      $('#fFile').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { st.foto = await fotoPerIA(f); st.testo = ''; disegna(); } catch (err) { alert(err.message); } };
      $('#fTipo').onchange = e => st.tipo = e.target.value;
      $('#fNote').oninput = e => st.note = e.target.value;
      $('#fVai').onclick = async () => {
        const b = $('#fVai'); b.disabled = true; b.textContent = '⏳ Sto analizzando la foto… (30-90 secondi)';
        try { st.testo = await chiediSchemaIA(st.foto.base64, st.note, st.tipo); disegna(); $('#fRis').scrollIntoView({ behavior: 'smooth' }); }
        catch (err) { alert(err.message === 'Failed to fetch' ? 'Nessuna connessione a Internet.' : err.message); b.disabled = false; b.textContent = '✨ Crea lo schema'; }
      };
      collegaRisultato();
    };
    const risultato = () => `<h3>Il tuo schema</h3><div class="scheda">${testoInHTML(st.testo)}</div>
      <div class="consiglio">⚠️ Lo schema è creato dall'intelligenza artificiale: controlla i conteggi tra parentesi e fai una prova prima di un lavoro grande.</div>
      <div class="bottoni"><button class="btn verde" id="rProg">▶ Crea progetto con contatore</button><button class="btn sec" id="rTesto">📤 Esporta per app contarighe</button>
        <button class="btn sec" id="rStampa">🖨️ Stampa</button><button class="btn sec" id="rRifai">↻ Rifai</button></div>`;
    const collegaRisultato = () => {
      if (!st.testo) return;
      $('#rProg').onclick = () => creaProgettoDaTesto(st.testo);
      $('#rTesto').onclick = () => mostraTesto(st.testo, titoloDaTesto(st.testo));
      $('#rStampa').onclick = () => { $('#stampa').innerHTML = (st.foto ? `<img src="${st.foto.anteprima}" style="max-height:70mm">` : '') + testoInHTML(st.testo) + '<p class="piccolo">Creato con SirJoe Uncinetto</p>'; setTimeout(() => Piattaforma.stampa(), 200); };
      $('#rRifai').onclick = () => $('#fVai').click();
    };
    disegna();
  },

  importa(v) {
    titolo('Importa schema scritto');
    v.innerHTML = `<p class="tenue">Incolla uno schema scritto (da un sito, da un PDF o da un'altra app). Le righe che iniziano con "Giro 1:", "Riga 1:", "G1:" o "R1:" diventano passi da spuntare, uno per giro. I titoli che iniziano con ### diventano i nomi delle parti (es. ### Testa).</p>
      <label>Nome del progetto</label><input id="impNome" placeholder="es. Orsetto">
      <label>Schema</label><textarea id="impTesto" style="min-height:260px" placeholder="### Testa&#10;Giro 1: 6 mb nel cm (6)&#10;Giro 2: aum x6 (12)&#10;Giri 3-5: 12 mb (12)"></textarea>
      <div class="bottoni"><button class="btn verde" id="impVai">▶ Crea progetto</button><button class="btn sec" id="impProva">👁 Anteprima passi</button></div><div id="impAnt"></div>`;
    $('#impVai').onclick = () => creaProgettoDaTesto($('#impTesto').value, $('#impNome').value.trim());
    $('#impProva').onclick = () => { const p = testoInPassi($('#impTesto').value);
      $('#impAnt').innerHTML = `<p><b>${p.length} passi trovati</b></p><ol>${p.map(x => `<li>${esc(x.s)}</li>`).join('')}</ol>`; };
  },

  testo(v, prm) {
    titolo('Testo per app contarighe');
    const nomeFile = (prm.nome || 'schema').replace(/[^\w\- àèéìòù]/gi, '').trim().replace(/\s+/g, '-').slice(0, 40) + '.txt';
    v.innerHTML = `<p class="tenue">Una riga per ogni giro, nel formato "Giro 1: … (6)". Copialo e incollalo in My Row Counter, Pocket Crochet o in un'altra app, oppure salvalo come file di testo.</p>
      <textarea id="tTesto" style="min-height:360px;font-family:Consolas,monospace;font-size:.88em">${esc(prm.testo)}</textarea>
      <div class="bottoni"><button class="btn" id="tCopia">📋 Copia tutto</button><button class="btn sec" id="tSalva">💾 Salva file .txt</button>
        <button class="btn sec" id="tProg">▶ Crea progetto con contatore</button></div>`;
    $('#tCopia').onclick = async () => {
      const t = $('#tTesto');
      try { await navigator.clipboard.writeText(t.value); avviso('Copiato!'); }
      catch (e) { t.select(); document.execCommand('copy'); avviso('Copiato!'); }
    };
    $('#tSalva').onclick = () => Piattaforma.salvaFile(nomeFile, $('#tTesto').value);
    $('#tProg').onclick = () => creaProgettoDaTesto($('#tTesto').value, prm.nome);
  },
});

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
