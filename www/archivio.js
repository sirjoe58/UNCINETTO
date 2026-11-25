/* Archivio dati e sincronizzazione tramite NAS.
   - Windows (Electron): file nella cartella del NAS scelta dall'utente.
   - Android (Capacitor): file in /SirJoeUncinetto sul telefono, che FolderSync tiene allineata con il NAS.
   - Browser: solo memoria locale. */

const NOME_FILE = 'uncinetto-dati.json';
const NATIVO = window.sirjoeNative || null; // Electron
const CAP = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() ? window.Capacitor : null;
const PIATTAFORMA = NATIVO ? 'windows' : (CAP ? 'android' : 'browser');
let SJ = null; // plugin nativo Android
if (CAP) SJ = CAP.registerPlugin ? CAP.registerPlugin('SirJoe') : (CAP.Plugins && CAP.Plugins.SirJoe);

function nuovoId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function ora() { return Date.now(); }

const Archivio = {
  dati: { progetti: [], mieiSchemi: [], progressi: {}, veloce: null, eliminati: {} },
  imp: { modo: 'semplice', testo: 'normale', vibra: true, schermo: true },
  stato: '', ultimoSync: 0, _timer: null, _ascoltatori: [],

  async avvia() {
    try { Object.assign(this.imp, JSON.parse(localStorage.getItem('sj-unc-imp') || '{}')); } catch (e) {}
    let locale = null;
    try {
      if (NATIVO) locale = await NATIVO.leggiLocale();
      if (!locale) locale = localStorage.getItem('sj-unc-dati');
      if (locale) this.dati = this._normalizza(JSON.parse(locale));
    } catch (e) { console.warn('Dati locali illeggibili', e); }
    await this.sincronizza(true);
  },

  _normalizza(d) {
    d = d || {};
    return { progetti: d.progetti || [], mieiSchemi: d.mieiSchemi || [], progressi: d.progressi || {},
      veloce: d.veloce || null, eliminati: d.eliminati || {} };
  },

  salvaImp() { localStorage.setItem('sj-unc-imp', JSON.stringify(this.imp)); },

  async _scriviLocale() {
    const txt = JSON.stringify(this.dati);
    try { localStorage.setItem('sj-unc-dati', txt); } catch (e) { console.warn('localStorage pieno', e); }
    if (NATIVO) await NATIVO.scriviLocale(txt);
  },

  /* da chiamare dopo ogni modifica */
  salva() {
    this._scriviLocale();
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.sincronizza(), 2500);
  },

  /* unione di due copie: vince la modifica più recente di ogni elemento */
  unisci(a, b) {
    a = this._normalizza(a); b = this._normalizza(b);
    const elim = { ...a.eliminati };
    for (const [k, v] of Object.entries(b.eliminati)) elim[k] = Math.max(elim[k] || 0, v);
    const lista = (x, y) => {
      const m = new Map();
      for (const it of [...x, ...y]) { const v = m.get(it.id); if (!v || (it.agg || 0) > (v.agg || 0)) m.set(it.id, it); }
      return [...m.values()].filter(it => !(elim[it.id] && elim[it.id] >= (it.agg || 0)));
    };
    const prog = { ...a.progressi };
    for (const [k, v] of Object.entries(b.progressi)) if (!prog[k] || (v.agg || 0) > (prog[k].agg || 0)) prog[k] = v;
    let veloce = a.veloce;
    if (b.veloce && (!veloce || (b.veloce.agg || 0) > (veloce.agg || 0))) veloce = b.veloce;
    return { progetti: lista(a.progetti, b.progetti), mieiSchemi: lista(a.mieiSchemi, b.mieiSchemi), progressi: prog, veloce, eliminati: elim };
  },

  async _leggiRemoto() {
    if (NATIVO) { const c = await NATIVO.getCartellaNAS(); if (!c) return { assente: true }; return { txt: await NATIVO.leggiNAS(NOME_FILE) }; }
    if (SJ) {
      const acc = await SJ.haAccesso(); if (!acc.ok) return { assente: true, permesso: true };
      const r = await SJ.leggi({ nome: NOME_FILE }); return { txt: r.testo || null };
    }
    return { assente: true };
  },
  async _scriviRemoto(txt) {
    if (NATIVO) return NATIVO.scriviNAS(NOME_FILE, txt);
    if (SJ) return SJ.scrivi({ nome: NOME_FILE, testo: txt });
  },

  async sincronizza(silenzioso) {
    if (PIATTAFORMA === 'browser') { this._setStato(''); return; }
    try {
      this._setStato('⟳');
      const r = await this._leggiRemoto();
      if (r.assente) { this._setStato(r.permesso ? '⚠ NAS' : ''); return; }
      let remoto = null;
      if (r.txt) { try { remoto = JSON.parse(r.txt); } catch (e) { console.warn('File NAS non valido'); } }
      const prima = JSON.stringify(this.dati);
      if (remoto) this.dati = this.unisci(this.dati, remoto);
      const dopo = JSON.stringify(this.dati);
      await this._scriviLocale();
      if (!r.txt || r.txt !== dopo) await this._scriviRemoto(dopo);
      this.ultimoSync = ora();
      this._setStato('✓ NAS');
      if (prima !== dopo) this._ascoltatori.forEach(f => f());
    } catch (e) {
      console.warn('Sincronizzazione non riuscita', e);
      this._setStato('⚠ NAS');
      if (!silenzioso) avviso('NAS non raggiungibile: i dati restano salvati sul dispositivo.');
    }
  },
  alCambio(f) { this._ascoltatori.push(f); },
  _setStato(s) { this.stato = s; const el = document.getElementById('statoSync'); if (el) el.textContent = s; },

  elimina(lista, id) {
    this.dati[lista] = this.dati[lista].filter(x => x.id !== id);
    this.dati.eliminati[id] = ora();
    this.salva();
  },
  esporta() { return JSON.stringify({ app: 'SirJoe Uncinetto', versione: 1, ...this.dati }, null, 1); },
  importa(txt) { const d = JSON.parse(txt); this.dati = this.unisci(this.dati, d); this.salva(); },
};

/* Funzioni di piattaforma */
const Piattaforma = {
  apriLink(url) {
    if (SJ) return SJ.apriLink({ url });
    window.open(url, '_blank');
  },
  stampa() {
    if (SJ) return SJ.stampa();
    window.print();
  },
  schermoAcceso(si) { if (SJ) SJ.schermoAcceso({ si: !!si }).catch(() => {}); else if (si && navigator.wakeLock) navigator.wakeLock.request('screen').catch(() => {}); },
  vibra() { if (Archivio.imp.vibra && navigator.vibrate) navigator.vibrate(30); },
  async salvaFile(nome, testo) {
    if (NATIVO) return NATIVO.salvaFile(nome, testo);
    if (SJ) { const a = await SJ.haAccesso(); if (!a.ok) { avviso('Dai prima il permesso alla cartella (Impostazioni).'); return; }
      await SJ.scrivi({ nome, testo }); avviso('Salvato nella cartella SirJoeUncinetto del telefono'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([testo], { type: 'application/json' }));
    a.download = nome; a.click();
  },
};
