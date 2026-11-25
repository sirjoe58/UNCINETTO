/* Editor di schemi a griglia: colori (per filet, tapestry, pixel) e simboli. */
const COLORI_EDITOR = ['#ffffff', '#3a2f2a', '#c2577a', '#e98aa6', '#3a7ca5', '#8ec5e6', '#5b8a72', '#a9d18e', '#f3c969', '#d08c2f', '#b5544b', '#7b5ea7'];
const SIMBOLI_EDITOR = ['cat', 'mbss', 'mb', 'mma', 'ma', 'maa', 'aum', 'dim', 'mbpost', 'pop', 'gruppo', 'ventaglio'];

const Editor = {
  s: null, cont: null, strumento: { tipo: 'colore', v: '#c2577a' }, lato: 26, imgs: {}, _dis: false, _modificato: false,

  apri(cont, schema, alSalva) {
    this.cont = cont; this.s = schema; this.alSalva = alSalva; this._modificato = false;
    cont.innerHTML = `
      <div class="scheda">
        <div class="due">
          <div><label>Nome dello schema</label><input id="edNome" value="${esc(schema.nome)}"></div>
          <div class="due">
            <div><label>Righe</label><input id="edRighe" type="number" min="2" max="120" value="${schema.righe}"></div>
            <div><label>Colonne</label><input id="edCol" type="number" min="2" max="120" value="${schema.colonne}"></div>
          </div>
        </div>
      </div>
      <div class="editor-strumenti" id="edColori"></div>
      <div class="editor-strumenti" id="edSimboli"></div>
      <div class="editor-strumenti">
        <button class="str" data-t="gomma" title="Gomma">🧽</button>
        <input type="color" id="edColLibero" value="#ff8800" title="Altro colore" style="width:46px;height:42px;padding:2px">
        <button class="btn sec piccolo" id="edZoomM">−</button><button class="btn sec piccolo" id="edZoomP">+</button>
        <span class="tenue piccolo" id="edInfo"></span>
      </div>
      <div class="editor-tela"><canvas id="edTela"></canvas></div>
      <label>Note</label><textarea id="edNote" placeholder="Filato, uncinetto, cosa rappresenta ogni colore…">${esc(schema.note || '')}</textarea>
      <div class="bottoni">
        <button class="btn verde" id="edSalva">💾 Salva</button>
        <button class="btn sec" id="edStampa">🖨️ Stampa</button>
        <button class="btn sec" id="edSpecchia">↔ Specchia</button>
        <button class="btn sec" id="edSvuota">Svuota</button>
      </div>`;
    const cc = cont.querySelector('#edColori');
    cc.innerHTML = '<span class="piccolo tenue">Colori:</span>' + COLORI_EDITOR.map(c => `<button class="str" data-t="colore" data-v="${c}" style="background:${c}" title="${c}"></button>`).join('');
    const cs = cont.querySelector('#edSimboli');
    cs.innerHTML = '<span class="piccolo tenue">Simboli:</span>' + SIMBOLI_EDITOR.map(t => `<button class="str" data-t="simbolo" data-v="${t}" title="${SIMBOLI[t].nome}">${simboloSVG(t, 32)}</button>`).join('');
    cont.querySelectorAll('.str').forEach(b => b.onclick = () => {
      this.strumento = { tipo: b.dataset.t, v: b.dataset.v };
      this._evidenzia();
    });
    cont.querySelector('#edColLibero').oninput = e => { this.strumento = { tipo: 'colore', v: e.target.value }; this._evidenzia(); };
    cont.querySelector('#edZoomM').onclick = () => { this.lato = Math.max(12, this.lato - 4); this.disegna(); };
    cont.querySelector('#edZoomP').onclick = () => { this.lato = Math.min(48, this.lato + 4); this.disegna(); };
    const ridim = () => {
      this.s.righe = Math.max(2, Math.min(120, +cont.querySelector('#edRighe').value || 10));
      this.s.colonne = Math.max(2, Math.min(120, +cont.querySelector('#edCol').value || 10));
      this._modificato = true; this.disegna();
    };
    cont.querySelector('#edRighe').onchange = ridim;
    cont.querySelector('#edCol').onchange = ridim;
    cont.querySelector('#edSalva').onclick = () => this.salva();
    cont.querySelector('#edStampa').onclick = () => this.stampa();
    cont.querySelector('#edSpecchia').onclick = () => {
      const n = {};
      for (const [k, v] of Object.entries(this.s.celle)) { const [r, c] = k.split(',').map(Number); n[`${r},${this.s.colonne - 1 - c}`] = v; }
      this.s.celle = n; this._modificato = true; this.disegna();
    };
    cont.querySelector('#edSvuota').onclick = () => { if (confirm('Cancellare tutto il disegno?')) { this.s.celle = {}; this._modificato = true; this.disegna(); } };
    const tela = cont.querySelector('#edTela');
    tela.addEventListener('pointerdown', e => { this._dis = true; tela.setPointerCapture(e.pointerId); this._dipingi(e); });
    tela.addEventListener('pointermove', e => { if (this._dis) this._dipingi(e); });
    tela.addEventListener('pointerup', () => { this._dis = false; this._ultima = null; });
    tela.addEventListener('pointercancel', () => { this._dis = false; this._ultima = null; });
    this._evidenzia();
    this._caricaImmagini().then(() => this.disegna());
  },

  _evidenzia() {
    this.cont.querySelectorAll('.str').forEach(b => b.classList.toggle('attivo',
      b.dataset.t === this.strumento.tipo && (b.dataset.v || '') === (this.strumento.v || '')));
    const info = this.cont.querySelector('#edInfo');
    info.textContent = this.strumento.tipo === 'gomma' ? 'Gomma' : this.strumento.tipo === 'simbolo' ? SIMBOLI[this.strumento.v].nome : 'Colore ' + this.strumento.v;
  },

  _caricaImmagini() {
    return Promise.all(SIMBOLI_EDITOR.map(t => new Promise(ok => {
      if (this.imgs[t]) return ok();
      const img = new Image();
      img.onload = () => { this.imgs[t] = img; ok(); };
      img.onerror = ok;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(simboloSVG(t, 64));
    })));
  },

  _dipingi(e) {
    const tela = this.cont.querySelector('#edTela');
    const rect = tela.getBoundingClientRect();
    const m = 28; // margine per i numeri
    const x = (e.clientX - rect.left) * (tela.width / rect.width) / (window.devicePixelRatio || 1) - m;
    const y = (e.clientY - rect.top) * (tela.height / rect.height) / (window.devicePixelRatio || 1);
    const c = Math.floor(x / this.lato), rVis = Math.floor(y / this.lato);
    if (c < 0 || c >= this.s.colonne || rVis < 0 || rVis >= this.s.righe) return;
    const r = this.s.righe - 1 - rVis; // riga 1 in basso, come negli schemi
    const k = `${r},${c}`;
    if (this._ultima === k) return; this._ultima = k;
    const cella = { ...(this.s.celle[k] || {}) };
    if (this.strumento.tipo === 'gomma') delete this.s.celle[k];
    else {
      if (this.strumento.tipo === 'colore') cella.col = this.strumento.v;
      else cella.sim = (e.type === 'pointerdown' && cella.sim === this.strumento.v) ? undefined : this.strumento.v;
      if (!cella.col && !cella.sim) delete this.s.celle[k]; else this.s.celle[k] = cella;
    }
    this._modificato = true;
    this.disegna();
  },

  /* disegna su un canvas (anche per stampa/anteprima) */
  disegnaSu(tela, lato) {
    const s = this.s, m = 28, dpr = window.devicePixelRatio || 1;
    const W = m * 2 + s.colonne * lato, H = s.righe * lato + m;
    tela.width = W * dpr; tela.height = H * dpr; tela.style.width = W + 'px'; tela.style.height = H + 'px';
    const g = tela.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    for (const [k, v] of Object.entries(s.celle)) {
      const [r, c] = k.split(',').map(Number);
      if (r >= s.righe || c >= s.colonne) continue;
      const x = m + c * lato, y = (s.righe - 1 - r) * lato;
      if (v.col) { g.fillStyle = v.col; g.fillRect(x, y, lato, lato); }
      if (v.sim && this.imgs[v.sim]) g.drawImage(this.imgs[v.sim], x + 1, y + 1, lato - 2, lato - 2);
    }
    for (let c = 0; c <= s.colonne; c++) { g.strokeStyle = c % 5 === 0 ? '#9a8a80' : '#ddd'; g.lineWidth = c % 5 === 0 ? 1.4 : 1; g.beginPath(); g.moveTo(m + c * lato + .5, 0); g.lineTo(m + c * lato + .5, s.righe * lato); g.stroke(); }
    for (let r = 0; r <= s.righe; r++) { const rr = s.righe - r; g.strokeStyle = rr % 5 === 0 ? '#9a8a80' : '#ddd'; g.lineWidth = rr % 5 === 0 ? 1.4 : 1; g.beginPath(); g.moveTo(m, r * lato + .5); g.lineTo(m + s.colonne * lato, r * lato + .5); g.stroke(); }
    g.fillStyle = '#7d6e66'; g.font = `${Math.min(12, lato * .5)}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let r = 0; r < s.righe; r++) {
      const y = (s.righe - 1 - r) * lato + lato / 2;
      if (r % 2 === 0) g.fillText(r + 1, m + s.colonne * lato + m / 2, y); else g.fillText(r + 1, m / 2, y);
    }
    for (let c = 0; c < s.colonne; c++) if ((c + 1) % 5 === 0 || c === 0) g.fillText(c + 1, m + c * lato + lato / 2, s.righe * lato + m / 2);
  },

  disegna() { this.disegnaSu(this.cont.querySelector('#edTela'), this.lato); },

  salva() {
    this.s.nome = this.cont.querySelector('#edNome').value.trim() || 'Schema senza nome';
    this.s.note = this.cont.querySelector('#edNote').value;
    this.s.agg = ora();
    this._modificato = false;
    this.alSalva && this.alSalva(this.s);
  },

  immagine() {
    const t = document.createElement('canvas');
    this.disegnaSu(t, 22);
    return t.toDataURL('image/png');
  },

  stampa() {
    const s = this.s;
    s.nome = this.cont.querySelector('#edNome').value.trim() || s.nome;
    s.note = this.cont.querySelector('#edNote').value;
    const usati = [...new Set(Object.values(s.celle).map(v => v.sim).filter(Boolean))];
    document.getElementById('stampa').innerHTML = `<h2>${esc(s.nome)}</h2><img src="${this.immagine()}">` +
      (usati.length ? legendaHTML(usati) : '') + (s.note ? `<p>${esc(s.note).replace(/\n/g, '<br>')}</p>` : '') +
      `<p class="piccolo">Le righe dispari si leggono da destra a sinistra (numero a destra), le pari da sinistra a destra. — SirJoe Uncinetto</p>`;
    setTimeout(() => Piattaforma.stampa(), 200);
  },
};
