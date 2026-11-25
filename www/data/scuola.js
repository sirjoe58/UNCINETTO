/* Scuola di schemi: lezioni passo passo per imparare a creare i propri schemi.
   Sezioni: t = testo (HTML semplice), anim = animazione di un diagramma, svg = disegno fisso,
   video = ricerca di video su YouTube, vai = pulsante verso un'altra parte dell'app. */

/* ---------- Disegni delle lezioni ---------- */
const DIS = {
  campione() {
    let q = '';
    for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) q += `<g transform="translate(${40 + c * 20},${190 - r * 20})">${simbolo('mb', r % 2 ? '#3a7ca5' : '#c2577a')}</g>`;
    let tacche = '';
    for (let i = 0; i <= 10; i++) tacche += `<line x1="${40 + i * 15}" y1="215" x2="${40 + i * 15}" y2="${i % 5 ? 222 : 228}" stroke="#3a2f2a"/>`;
    return `<svg viewBox="0 0 300 250" width="320" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="210" height="180" rx="6" fill="#fff6f8" stroke="#e0c7cf"/>${q}
      <rect x="40" y="210" width="150" height="12" fill="#f3c969" stroke="#8a6200"/>${tacche}
      <text x="115" y="242" font-size="11" text-anchor="middle" font-family="sans-serif" fill="#3a2f2a">10 cm = conta le maglie qui</text>
      <rect x="40" y="40" width="150" height="150" fill="none" stroke="#5b8a72" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="200" y="120" font-size="11" font-family="sans-serif" fill="#5b8a72">10×10 cm</text></svg>`;
  },
  piattezza() {
    const forma = (x, tit, path, ok) => `<g transform="translate(${x},0)"><path d="${path}" fill="${ok ? '#a9d18e' : '#f2b8c6'}" stroke="#3a2f2a" stroke-width="1.5"/>
      <text x="60" y="118" text-anchor="middle" font-size="11" font-family="sans-serif">${tit}</text></g>`;
    let onde = 'M10,60'; for (let i = 0; i <= 12; i++) onde += ` Q${15 + i * 8.3},${i % 2 ? 30 : 90} ${19 + i * 8.3},60`;
    return `<svg viewBox="0 0 380 130" width="380" xmlns="http://www.w3.org/2000/svg">
      ${forma(0, 'Pochi aumenti: coppa', 'M15,40 Q60,110 105,40 Q60,60 15,40Z', false)}
      ${forma(130, 'Giusti: piatto ✓', 'M60,15 A45,45 0 1,1 59.9,15Z', true)}
      ${forma(260, 'Troppi: onde', onde + 'Z', false)}</svg>`;
  },
  regole() {
    const riga = (y, p, n, h) => `<g transform="translate(0,${y})"><g transform="translate(30,30)">${simbolo(p)}</g>
      <text x="60" y="22" font-size="12" font-family="sans-serif" font-weight="bold">${SIMBOLI[p].nome}</text>
      <text x="60" y="38" font-size="11" font-family="sans-serif" fill="#7d6e66">inizio: ${n} maglie · aumenti a giro: +${n} · catenelle per salire: ${h}</text></g>`;
    return `<svg viewBox="0 0 380 150" width="400" xmlns="http://www.w3.org/2000/svg">${riga(0, 'mb', 6, 1)}${riga(48, 'mma', 8, 2)}${riga(96, 'ma', 12, 3)}</svg>`;
  },
  rettangoli(tipo) {
    const R = (x, y, w, h, t, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="#3a2f2a" stroke-width="1.5" rx="3"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="11" font-family="sans-serif">${t}</text>`;
    if (tipo === 'poncho') return `<svg viewBox="0 0 400 200" width="400" xmlns="http://www.w3.org/2000/svg">
      ${R(10, 20, 150, 60, 'A  (50×70 cm)', '#f2b8c6')}${R(10, 100, 150, 60, 'B  (50×70 cm)', '#8ec5e6')}
      <text x="185" y="95" font-size="22">➜</text>
      <g transform="translate(230,20)"><rect x="0" y="0" width="140" height="60" fill="#f2b8c6" stroke="#3a2f2a" stroke-width="1.5"/>
      <rect x="80" y="0" width="60" height="140" fill="#8ec5e6" stroke="#3a2f2a" stroke-width="1.5"/>
      <line x1="80" y1="0" x2="140" y2="0" stroke="#c0392b" stroke-width="3"/><line x1="0" y1="60" x2="0" y2="60"/>
      <text x="40" y="35" font-size="11" font-family="sans-serif" text-anchor="middle">A</text><text x="110" y="100" font-size="11" font-family="sans-serif" text-anchor="middle">B</text>
      <text x="70" y="165" font-size="10" font-family="sans-serif" text-anchor="middle" fill="#c0392b">cuci il lato corto di A</text>
      <text x="70" y="178" font-size="10" font-family="sans-serif" text-anchor="middle" fill="#c0392b">sul lato lungo di B (e viceversa)</text></g></svg>`;
    if (tipo === 'maglia') return `<svg viewBox="0 0 400 190" width="400" xmlns="http://www.w3.org/2000/svg">
      ${R(140, 20, 120, 150, 'Corpo', '#a9d18e')}${R(20, 30, 110, 45, 'Manica', '#f3c969')}${R(270, 30, 110, 45, 'Manica', '#f3c969')}
      <text x="200" y="186" font-size="10" text-anchor="middle" font-family="sans-serif" fill="#7d6e66">Un maglione semplice = 2 rettangoli (davanti e dietro) + 2 rettangoli per le maniche</text></svg>`;
    if (tipo === 'borsa') return `<svg viewBox="0 0 400 190" width="400" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="140" rx="55" ry="22" fill="#8ec5e6" stroke="#3a2f2a" stroke-width="1.5"/><text x="70" y="144" text-anchor="middle" font-size="11" font-family="sans-serif">fondo tondo</text>
      <text x="140" y="110" font-size="22">+</text>
      ${R(170, 60, 110, 90, 'pareti (giri dritti)', '#f2b8c6')}<text x="295" y="110" font-size="22">+</text>
      <path d="M330,140 Q330,40 370,40 Q395,40 395,140" fill="none" stroke="#3a2f2a" stroke-width="6"/><text x="360" y="165" text-anchor="middle" font-size="11" font-family="sans-serif">manici</text></svg>`;
  },
  pupazzo() {
    return `<svg viewBox="0 0 480 260" width="460" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">
      <ellipse cx="150" cy="185" rx="48" ry="58" fill="#f3c969" stroke="#3a2f2a" stroke-width="1.5"/>
      <circle cx="150" cy="85" r="52" fill="#f3c969" stroke="#3a2f2a" stroke-width="1.5"/>
      <path d="M108,55 L100,15 L132,40Z" fill="#e9a94f" stroke="#3a2f2a" stroke-width="1.5"/><path d="M192,55 L200,15 L168,40Z" fill="#e9a94f" stroke="#3a2f2a" stroke-width="1.5"/>
      <rect x="88" y="150" width="20" height="50" rx="10" fill="#e9a94f" stroke="#3a2f2a" stroke-width="1.5" transform="rotate(20 98 150)"/>
      <rect x="192" y="150" width="20" height="50" rx="10" fill="#e9a94f" stroke="#3a2f2a" stroke-width="1.5" transform="rotate(-20 202 150)"/>
      <circle cx="132" cy="85" r="5"/><circle cx="168" cy="85" r="5"/><path d="M143,100 Q150,107 157,100" fill="none" stroke="#3a2f2a" stroke-width="2"/>
      <line x1="205" y1="85" x2="275" y2="60" stroke="#999"/><text x="280" y="58">Testa = SFERA (30-36 maglie)</text>
      <line x1="198" y1="185" x2="275" y2="190" stroke="#999"/><text x="280" y="188">Corpo = OVALE (24-30 maglie)</text>
      <line x1="195" y1="25" x2="275" y2="25" stroke="#999"/><text x="280" y="23">Orecchie = CONI (fino a 12)</text>
      <line x1="215" y1="170" x2="275" y2="125" stroke="#999"/><text x="280" y="123">Braccia = CILINDRI (6-8)</text>
      <text x="10" y="252" fill="#7d6e66">Stile "kawaii": testa grande quanto o più del corpo.</text></svg>`;
  },
  spicchio() {
    let s = '';
    for (let k = 0; k < 8; k++) s += `<path d="M0,0 L${(Math.cos((k * 45 - 112.5) * Math.PI / 180) * 110).toFixed(1)},${(Math.sin((k * 45 - 112.5) * Math.PI / 180) * 110).toFixed(1)} A110,110 0 0,1 ${(Math.cos((k * 45 - 67.5) * Math.PI / 180) * 110).toFixed(1)},${(Math.sin((k * 45 - 67.5) * Math.PI / 180) * 110).toFixed(1)}Z" fill="${k ? '#f6eee6' : '#f2b8c6'}" stroke="#c9b8ad"/>`;
    return `<svg viewBox="-130 -130 400 260" width="400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">${s}
      <text x="0" y="-60" text-anchor="middle" font-weight="bold">1 spicchio</text>
      <text x="130" y="-30">Progetta UN solo spicchio</text><text x="130" y="-12">(un pezzo di torta),</text>
      <text x="130" y="6">poi ripetilo tutto intorno:</text><text x="130" y="24">6, 8 o 12 volte.</text>
      <text x="130" y="54" fill="#7d6e66">Più spicchi = centrino</text><text x="130" y="70" fill="#7d6e66">più fitto e rotondo.</text></svg>`;
  },
  filet(griglia) {
    const g = griglia || ['0000000000', '0110001100', '1111011110', '1111111111', '1111111111', '0111111110', '0011111100', '0001111000', '0000110000', '0000000000'];
    let c = '';
    g.forEach((riga, r) => [...riga].forEach((v, k) => {
      const x = 20 + k * 22, y = 10 + r * 22;
      c += v === '1' ? `<rect x="${x}" y="${y}" width="22" height="22" fill="#c2577a" stroke="#fff"/>` : `<rect x="${x}" y="${y}" width="22" height="22" fill="#fff" stroke="#ddd"/>`;
    }));
    return `<svg viewBox="0 0 400 240" width="400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">${c}
      <rect x="260" y="20" width="22" height="22" fill="#c2577a"/><text x="290" y="35">pieno = 3 ma</text>
      <rect x="260" y="55" width="22" height="22" fill="#fff" stroke="#ccc"/><text x="290" y="70">vuoto = 1 ma + 2 cat</text>
      <text x="260" y="110" fill="#7d6e66">Ogni quadretto</text><text x="260" y="125" fill="#7d6e66">è largo 3 maglie.</text></svg>`;
  },
  scritturaEsempio() {
    return `<div class="scheda" style="font-family:Consolas,monospace;font-size:.9em;line-height:1.6">
      <b>Nome:</b> Cuscino Nuvola<br><b>Livello:</b> facile · <b>Misure:</b> 30 × 20 cm<br>
      <b>Occorrente:</b> 150 g di lana media bianca, uncinetto 5 mm, imbottitura<br>
      <b>Campione:</b> 14 mb × 16 righe = 10 cm<br><b>Abbreviazioni:</b> cat, mb, aum, dim<br><br>
      G1: 6 mb nel cm (6)<br>G2: aum ×6 (12)<br>G3: (1 mb, aum) ×6 (18)<br>…<br>
      <i>Note:</i> a fine schema, scrivi come cucire i pezzi e quanto filato hai usato davvero.</div>`;
  },
};

/* ---------- Lezioni ---------- */
const LEZIONI = [
  { id: 'leggere', titolo: 'Come si legge uno schema', emoji: '👓', durata: '10 min',
    sez: [
      { t: '<p>Uno schema è come una ricetta: ti dice <b>quali punti</b> fare, <b>dove</b> e <b>quante volte</b>. Può essere <b>scritto</b> (con abbreviazioni) oppure <b>disegnato</b> (con simboli). Spesso ci sono tutti e due.</p>' },
      { t: '<h3>I simboli principali</h3><p>Ogni punto ha il suo disegno. Più il simbolo è alto, più la maglia è alta.</p>' },
      { svg: () => legendaHTML(['cat', 'mbss', 'mb', 'mma', 'ma', 'maa', 'aum', 'dim', 'cm']) },
      { t: '<h3>Scritto e disegnato: lo stesso lavoro</h3><p>Guarda l\'animazione: si costruisce un cerchio a maglia bassa, giro dopo giro. Sotto il disegno leggi la stessa cosa scritta.</p>' },
      { anim: () => ({ d: diagrammaTondo(giriCerchioMb(4)), didascalie: ['Giro 1: 6 mb nel cerchio magico (6)', 'Giro 2: aum ×6 (12)', 'Giro 3: (1 mb, aum) ×6 (18)', 'Giro 4: (2 mb, aum) ×6 (24)'] }) },
      { t: '<h3>Come si leggono le parentesi</h3><p><b>(1 mb, aum) ×6</b> significa: fai 1 maglia bassa, poi un aumento, e ripeti questa coppia 6 volte. Il numero tra parentesi alla fine, <b>(18)</b>, è quante maglie devi avere a fine giro: contale sempre!</p><p>Nei diagrammi <b>a righe</b> si legge dal basso: la riga 1 da destra a sinistra, la riga 2 da sinistra a destra, e così via. Nei diagrammi <b>in tondo</b> si parte dal centro e si gira in senso antiorario.</p>' },
      { video: 'come leggere schemi uncinetto simboli' },
      { vai: ['libreria', '📖 Apri la libreria dei punti'] }] },

  { id: 'campione', titolo: 'Misure e campione', emoji: '📐', durata: '10 min',
    sez: [
      { t: '<p>Per inventare uno schema che venga <b>della misura giusta</b> devi sapere quante maglie ci stanno in 10 cm con il tuo filato e il tuo uncinetto. Questo quadratino di prova si chiama <b>campione</b>.</p>' },
      { svg: () => DIS.campione() },
      { t: '<ol><li>Lavora un quadrato di circa 15×15 cm con il punto che userai.</li><li>Appoggialo sul tavolo senza tirarlo.</li><li>Con il metro conta quante maglie ci sono in 10 cm in orizzontale, e quante righe in 10 cm in verticale.</li><li>Scrivilo nel quaderno: ad esempio <b>14 mb e 16 righe = 10 cm, uncinetto 5 mm</b>.</li></ol>' },
      { t: '<h3>Il calcolo magico</h3><p><b>Maglie da fare = maglie in 10 cm × larghezza voluta ÷ 10</b></p><p>Esempio: vuoi una sciarpa larga 20 cm e il campione dà 14 maglie in 10 cm → 14 × 20 ÷ 10 = <b>28 maglie</b>. A maglia bassa avvii 28 + 1 = 29 catenelle.</p><div class="consiglio">💡 Se il campione ha più maglie del previsto lavori stretto: prendi un uncinetto più grande. Se ne ha meno, uno più piccolo.</div>' },
      { video: 'campione uncinetto come misurare' },
      { vai: ['calcolatori', '🧮 Apri il calcolatore del campione'] }] },

  { id: 'righe', titolo: 'Inventare uno schema a righe', emoji: '📏', durata: '15 min',
    sez: [
      { t: '<p>Sciarpe, presine, coperte, borse piatte, fasce: sono tutti <b>rettangoli</b>. Si lavorano avanti e indietro, riga dopo riga. Ecco come progettarne uno tuo.</p><ol><li>Decidi la misura (es. 20 × 150 cm).</li><li>Fai il campione e calcola le maglie per riga.</li><li>Scegli il punto: mb (fitto e robusto), mma (morbido), ma (veloce e leggero).</li><li>Aggiungi le catenelle per salire: +1 per mb, +2 per mma, +3 per ma.</li><li>Ripeti la riga fino all\'altezza voluta.</li></ol>' },
      { anim: () => ({ d: diagrammaRighe(righeUguali(5, 10, 'ma')), didascalie: ['Riga 1: 1 ma dalla 4ª catenella e in ogni catenella (10)', 'Riga 2: 3 cat, gira, 9 ma (10)', 'Riga 3: 3 cat, gira, 9 ma (10)', 'Riga 4: come la riga 2', 'Riga 5: come la riga 2'] }) },
      { t: '<h3>Dare forma con aumenti e diminuzioni</h3><p>Se a ogni riga fai <b>1 aumento all\'inizio e 1 alla fine</b>, il rettangolo diventa un <b>triangolo</b> che si allarga: è il segreto degli scialli. Se diminuisci, si stringe.</p>' },
      { anim: () => ({ d: diagrammaRighe([Array(3).fill('mb'), Array(5).fill('mb'), Array(7).fill('mb'), Array(9).fill('mb'), Array(11).fill('mb')]), didascalie: ['Riga 1: 3 mb', 'Riga 2: aum, 1 mb, aum (5)', 'Riga 3: aum, 3 mb, aum (7)', 'Riga 4: aum, 5 mb, aum (9)', 'Riga 5: aum, 7 mb, aum (11)'] }) },
      { t: '<h3>Idee da provare</h3><ul><li><b>Righe di colore</b>: cambia colore ogni 2, 3 o 4 righe e otterrai sempre un effetto diverso.</li><li><b>Righe alternate</b>: 2 righe di mb + 2 righe di ma creano una texture a onde leggere.</li><li><b>Filo posteriore</b>: tutte le righe nel solo filo posteriore = coste morbide, ottime per sciarpe e polsini.</li></ul>' },
      { video: 'uncinetto lavorare in righe principianti' },
      { vai: ['mieiSchemi', '✏️ Prova a disegnarlo nell\'editor'] }] },

  { id: 'tondo', titolo: 'Inventare uno schema in tondo', emoji: '⭕', durata: '15 min',
    sez: [
      { t: '<p>Cappelli, sottobicchieri, tappeti, fondi di borse e cestini: si parte dal centro e si gira. Per restare <b>piatti</b> si aggiunge sempre lo stesso numero di maglie a ogni giro, che dipende dall\'altezza del punto.</p>' },
      { svg: () => DIS.regole() },
      { anim: () => ({ d: diagrammaTondo(giriCerchioMa(4)), didascalie: ['Giro 1: 3 cat + 11 ma nel cerchio magico (12)', 'Giro 2: 2 ma in ogni maglia (24)', 'Giro 3: (1 ma, 2 ma nella successiva) ×12 (36)', 'Giro 4: (2 ma, 2 ma nella successiva) ×12 (48)'] }) },
      { t: '<h3>Come capire se va bene</h3><p>Appoggia il lavoro sul tavolo dopo ogni giro.</p>' },
      { svg: () => DIS.piattezza() },
      { t: '<div class="consiglio">💡 La regola: fra un aumento e l\'altro ci sono tante maglie normali quanto il <b>numero del giro meno 2</b>. Al giro 5: (3 mb, aum). Al giro 10: (8 mb, aum).</div><p><b>Trasformare il cerchio</b>: smetti di aumentare e il cerchio diventa un <b>tubo</b> (cappello, vaso, borsa). Fai giri nel filo posteriore per creare uno spigolo netto tra fondo e parete.</p>' },
      { video: 'cerchio piatto uncinetto aumenti' },
      { vai: ['calcolatori', '🧮 Tabella del cerchio piatto'] }] },

  { id: 'forme', titolo: 'Forme 3D per amigurumi', emoji: '🧸', durata: '15 min',
    sez: [
      { t: '<p>Tutti i pupazzi sono fatti con poche forme base. Basta ricordare tre regole:</p><ul><li><b>Aumenti</b> → il pezzo si <b>allarga</b>.</li><li><b>Giri senza aumenti</b> → il pezzo sale <b>dritto</b> come un tubo.</li><li><b>Diminuzioni</b> → il pezzo si <b>chiude</b>.</li></ul><p>Cambiando quanti giri fai di ciascun tipo, ottieni forme diverse. Ecco le sagome viste di lato: ogni fetta è un giro.</p>' },
      { svg: () => '<div class="griglia" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">' + Object.entries(FORME).map(([k, f]) => `<div class="scheda" style="text-align:center;margin:0">${sagomaSVG(contaGiri(k, 30), null, true).replace(/width="[^"]*"/, 'width="90"')}<br><b>${f.emoji} ${f.nome}</b></div>`).join('') + '</div>' },
      { anim: () => ({ d: diagrammaTondo(giriCerchioMb(5)), didascalie: ['Giro 1: 6 mb (la punta)', 'Giro 2: aum ×6 (12)', 'Giro 3: (1 mb, aum) ×6 (18)', 'Giro 4: (2 mb, aum) ×6 (24)', 'Giro 5: (3 mb, aum) ×6 (30) – ora fai giri dritti e poi diminuisci'] }) },
      { t: '<div class="consiglio">💡 Una sfera viene rotonda se i giri dritti sono <b>circa quanti i giri di aumento</b>. Con il doppio dei giri dritti hai un ovale. Prova il <b>Progettista di forme</b>: scegli la forma e la grandezza, e ti scrive lo schema!</div>' },
      { video: 'amigurumi forme base sfera tutorial' },
      { vai: ['forme', '🧸 Apri il Progettista di forme'] }] },

  { id: 'pupazzi', titolo: 'Progettare un pupazzo tutto tuo', emoji: '🐻', durata: '15 min',
    sez: [
      { t: '<p>Disegna il tuo personaggio su un foglio, poi <b>scomponilo in forme</b>: palline, ovali, coni e tubi. Ogni forma diventa un pezzo da lavorare separatamente.</p>' },
      { svg: () => DIS.pupazzo() },
      { t: '<ol><li><b>Testa</b>: sfera. Più maglie = testa più grande.</li><li><b>Corpo</b>: ovale, di solito un po\' più stretto della testa.</li><li><b>Orecchie</b>: coni piccoli (non imbottiti, schiacciati) o mezze sfere.</li><li><b>Braccia e gambe</b>: tubi da 6-8 maglie.</li><li><b>Coda, muso, guance</b>: piccoli cerchi piatti o coni.</li><li><b>Montaggio</b>: fissa i pezzi con gli spilli, guarda se ti piace, poi cuci.</li></ol><div class="consiglio">💡 Per un pupazzo per bambini piccoli: occhi ricamati invece di quelli di plastica, e cuciture ben salde.</div>' },
      { t: '<h3>Idee esclusive da inventare</h3><ul><li><b>Gomitolino</b>: una sfera con occhi e un uncinetto ricamato come braccio.</li><li><b>Famiglia di funghetti</b>: cappello = cerchio piatto che si incurva (pochi aumenti), gambo = tubo.</li><li><b>Pesce palla</b>: sfera con piccoli coni tutto intorno come spine.</li><li><b>Mini cactus in fila</b>: tre cilindri di altezze diverse in vasetti.</li></ul>' },
      { video: 'come progettare amigurumi proprio personaggio' },
      { vai: ['categoria:amigurumi', '🐣 Vedi gli schemi di pupazzi'] }] },

  { id: 'centrini', titolo: 'Centrini e motivi in tondo', emoji: '❄️', durata: '15 min',
    sez: [
      { t: '<p>Un centrino sembra difficilissimo, ma il trucco è semplice: si progetta <b>un solo spicchio</b> e lo si ripete tutto intorno.</p>' },
      { svg: () => DIS.spicchio() },
      { t: '<ol><li>Parti con un cerchio pieno (es. 16 maglie alte).</li><li>Crea dei "raggi" con maglie separate da catenelle: le catenelle allargano il lavoro senza appesantirlo.</li><li>Nei giri successivi riempi gli spazi con ventagli, gruppi o archetti.</li><li>Ogni giro più grande richiede più catenelle negli archetti, così il centrino resta piatto.</li><li>Finisci con un bordo a picot (3 cat chiuse con 1 mbss) per un effetto merlettato.</li></ol>' },
      { anim: () => { const s = SCHEMI.find(x => x.id === 'centrino-sole'); return { d: s.diagramma(), didascalie: s.passi.map(p => p.e) }; } },
      { t: '<div class="consiglio">💡 Dopo il lavaggio, stendi il centrino bagnato su un asciugamano e fissalo con gli spilli in forma perfetta: si chiama <b>bloccaggio</b> e fa la differenza.</div>' },
      { video: 'centrino uncinetto principianti tutorial' },
      { vai: ['categoria:centrini', '❄️ Vedi gli schemi di centrini'] }] },

  { id: 'colori', titolo: 'Schemi a colori e filet', emoji: '🎨', durata: '10 min',
    sez: [
      { t: '<p>Per disegni, lettere e figure si usa una <b>griglia a quadretti</b>: ogni quadretto è una maglia (o un gruppo di maglie). È lo stesso principio del punto croce.</p><ul><li><b>Tapestry (a colori)</b>: ogni quadretto = 1 mb del colore indicato. Il filo non usato si porta dentro le maglie.</li><li><b>Filet</b>: si usa un solo colore; i quadretti pieni sono maglie alte, quelli vuoti sono "finestrelle".</li></ul>' },
      { svg: () => DIS.filet() },
      { t: '<p>Per un filet largo 10 quadretti: 10 × 3 + 1 = 31 maglie, più 3 catenelle per salire = <b>34 catenelle</b> di avvio.</p><div class="consiglio">💡 Nell\'editor dell\'app colora i quadretti, poi stampa la griglia: le righe sono numerate e la riga 1 è in basso, pronta da seguire.</div>' },
      { video: 'uncinetto filet schema tutorial' },
      { vai: ['mieiSchemi', '✏️ Apri l\'editor a griglia'] }] },

  { id: 'capi', titolo: 'Progettare abbigliamento e borse', emoji: '👕', durata: '15 min',
    sez: [
      { t: '<p>La maggior parte dei capi semplici si costruisce con <b>rettangoli</b> e <b>tubi</b>. Misura una maglietta o una borsa che hai già e copiane le misure.</p>' },
      { svg: () => DIS.rettangoli('poncho') },
      { t: '<p><b>Poncho a due rettangoli</b>: due rettangoli uguali, cuciti a "L". È il capo più facile da inventare: cambia solo colori e punto.</p>' },
      { svg: () => DIS.rettangoli('maglia') },
      { t: '<p><b>Maglione a rettangoli</b>: davanti e dietro uguali (larghi metà della circonferenza del torace + 5 cm di agio), maniche come rettangoli piegati a tubo. Si cuciono spalle, lati e maniche.</p>' },
      { svg: () => DIS.rettangoli('borsa') },
      { t: '<p><b>Borsa</b>: fondo tondo (cerchio piatto) o rettangolare (una catenella lavorata su entrambi i lati), pareti con giri dritti, manici di catenelle rinforzate con maglie basse.</p><div class="consiglio">💡 Disegna sempre lo schema su carta con le misure in cm e, accanto, le maglie calcolate dal campione.</div>' },
      { video: 'maglione uncinetto rettangoli principianti' },
      { vai: ['categoria:vestire', '🧣 Vedi gli schemi da indossare'] }] },

  { id: 'scrivere', titolo: 'Scrivere e provare il tuo schema', emoji: '📝', durata: '10 min',
    sez: [
      { t: '<p>Quando il tuo lavoro è riuscito, scrivi subito lo schema: tra un mese non ti ricorderai più i numeri! Un buon schema contiene sempre:</p><ol><li>Nome, livello e misure finali.</li><li>Occorrente: filato (tipo, peso, colore), uncinetto, accessori.</li><li>Campione.</li><li>Le abbreviazioni usate.</li><li>I giri o le righe, con il numero di maglie a fine giro tra parentesi.</li><li>Come montare e rifinire.</li></ol>' },
      { svg: () => DIS.scritturaEsempio() },
      { t: '<h3>Provalo</h3><p>Fai rifare il lavoro a qualcun altro seguendo solo quello che hai scritto: se si blocca, quel punto va spiegato meglio. Nell\'app puoi creare un <b>progetto</b> e scrivere le note mentre lavori, aggiungere una foto e salvare lo schema a griglia con l\'editor.</p>' },
      { vai: ['progetti', '📁 Crea un progetto per il tuo schema'] }] },
];
