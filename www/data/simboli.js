/* Simboli internazionali dell'uncinetto disegnati in SVG.
   Ogni simbolo ha la base nel punto (0,0) e "cresce" verso l'alto (y negativa). */
const SIMBOLI = {
  cat:   { nome: 'Catenella', abbr: 'cat', h: 8 },
  mbss:  { nome: 'Maglia bassissima', abbr: 'mbss', h: 6 },
  mb:    { nome: 'Maglia bassa', abbr: 'mb', h: 14 },
  mma:   { nome: 'Mezza maglia alta', abbr: 'mma', h: 20 },
  ma:    { nome: 'Maglia alta', abbr: 'ma', h: 28 },
  maa:   { nome: 'Maglia altissima', abbr: 'maa', h: 36 },
  aum:   { nome: 'Aumento (2 mb nella stessa maglia)', abbr: 'aum', h: 16 },
  dim:   { nome: 'Diminuzione (2 mb chiuse insieme)', abbr: 'dim', h: 16 },
  cm:    { nome: 'Cerchio magico', abbr: 'cm', h: 16 },
  mbpost:{ nome: 'Maglia bassa nel filo posteriore', abbr: 'mb fp', h: 16 },
  mbant: { nome: 'Maglia bassa nel filo anteriore', abbr: 'mb fa', h: 16 },
  gambero:{ nome: 'Punto gambero', abbr: 'pg', h: 16 },
  pop:   { nome: 'Punto popcorn', abbr: 'pop', h: 28 },
  gruppo:{ nome: 'Gruppo di 3 ma chiuse insieme', abbr: 'gr3', h: 28 },
  ventaglio:{ nome: 'Ventaglio (5 ma nella stessa maglia)', abbr: 'vent', h: 30 },
  rilav: { nome: 'Maglia alta in rilievo davanti', abbr: 'ma ril.av', h: 28 },
  rildi: { nome: 'Maglia alta in rilievo dietro', abbr: 'ma ril.di', h: 28 },
  aumma: { nome: 'Aumento di maglia alta (2 ma nella stessa maglia)', abbr: 'aum ma', h: 28 },
};

function _linea(x1, y1, x2, y2) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }

function simbolo(tipo, colore) {
  colore = colore || '#3a2f2a';
  let s = '';
  switch (tipo) {
    case 'cat': s = `<ellipse cx="0" cy="-4" rx="7" ry="3.6" fill="none"/>`; break;
    case 'mbss': s = `<circle cx="0" cy="-3" r="3" fill="${colore}"/>`; break;
    case 'mb': s = _linea(-5, -1, 5, -13) + _linea(5, -1, -5, -13); break;
    case 'mma': s = _linea(0, 0, 0, -20) + _linea(-6, -20, 6, -20); break;
    case 'ma': s = _linea(0, 0, 0, -28) + _linea(-6, -28, 6, -28) + _linea(-4, -11, 4, -17); break;
    case 'maa': s = _linea(0, 0, 0, -36) + _linea(-6, -36, 6, -36) + _linea(-4, -10, 4, -16) + _linea(-4, -18, 4, -24); break;
    case 'aum':
      s = `<g transform="rotate(-22)">${_linea(-4, -2, 4, -12) + _linea(4, -2, -4, -12)}</g>` +
          `<g transform="rotate(22)">${_linea(-4, -2, 4, -12) + _linea(4, -2, -4, -12)}</g>`; break;
    case 'dim':
      s = `<path d="M-8,0 L0,-15 L8,0" fill="none"/>` + _linea(-7, -9, -1, -5) + _linea(1, -5, 7, -9); break;
    case 'cm': s = `<circle cx="0" cy="-8" r="7" fill="none" stroke-dasharray="3 2"/>`; break;
    case 'mbpost': s = _linea(-5, -3, 5, -15) + _linea(5, -3, -5, -15) + `<path d="M-6,1 Q0,-4 6,1" fill="none"/>`; break;
    case 'mbant': s = _linea(-5, -3, 5, -15) + _linea(5, -3, -5, -15) + `<path d="M-6,-2 Q0,3 6,-2" fill="none"/>`; break;
    case 'gambero': s = _linea(-5, -1, 5, -13) + _linea(5, -1, -5, -13) + `<path d="M-8,-16 Q-4,-20 0,-16 T8,-16" fill="none"/>`; break;
    case 'pop': s = `<ellipse cx="0" cy="-15" rx="7" ry="13" fill="none"/>` + _linea(0, -2, 0, -28) + _linea(-4, -6, -4, -24) + _linea(4, -6, 4, -24); break;
    case 'gruppo':
      s = _linea(-8, 0, 0, -28) + _linea(0, 0, 0, -28) + _linea(8, 0, 0, -28) + _linea(-6, -28, 6, -28) +
          _linea(-7, -10, -2, -14) + _linea(-2, -10, 3, -14) + _linea(3, -10, 8, -14); break;
    case 'ventaglio': {
      for (const a of [-50, -25, 0, 25, 50]) s += `<g transform="rotate(${a})">${_linea(0, 0, 0, -28) + _linea(-4, -28, 4, -28) + _linea(-3, -12, 3, -16)}</g>`;
      break;
    }
    case 'rilav': s = _linea(0, -4, 0, -28) + _linea(-6, -28, 6, -28) + _linea(-4, -13, 4, -19) + `<path d="M0,-4 Q0,2 -6,2" fill="none"/>`; break;
    case 'rildi': s = _linea(0, -4, 0, -28) + _linea(-6, -28, 6, -28) + _linea(-4, -13, 4, -19) + `<path d="M0,-4 Q0,2 6,2" fill="none"/>`; break;
    case 'aumma':
      s = `<g transform="rotate(-18)">${_linea(0, 0, 0, -28) + _linea(-5, -28, 5, -28) + _linea(-3, -11, 3, -16)}</g>` +
          `<g transform="rotate(18)">${_linea(0, 0, 0, -28) + _linea(-5, -28, 5, -28) + _linea(-3, -11, 3, -16)}</g>`; break;
    default: s = '';
  }
  return `<g stroke="${colore}" stroke-width="2" stroke-linecap="round" fill="none">${s}</g>`;
}

/* Piccola immagine SVG autonoma di un simbolo (per la libreria e le legende) */
function simboloSVG(tipo, lato, colore) {
  lato = lato || 40;
  return `<svg viewBox="-20 -38 40 42" width="${lato}" height="${lato}" xmlns="http://www.w3.org/2000/svg">${simbolo(tipo, colore)}</svg>`;
}

/* ---------- Disegno dei diagrammi ---------- */
const COLORI_GIRI = ['#c2577a', '#3a7ca5', '#5b8a72', '#d08c2f', '#7b5ea7', '#b5544b', '#2f8f8f', '#8a6d3b'];

/* Diagramma in tondo: giri = array di array di simboli (dal centro verso l'esterno) */
function diagrammaTondo(giri, opz) {
  opz = opz || {};
  const passo = opz.passo || 30;
  const r0 = opz.r0 || 18;
  let parti = [];
  const usati = new Set(['cm']);
  parti.push(`<g>${simbolo('cm', '#999')}</g>`);
  let raggio = r0;
  giri.forEach((giro, i) => {
    const col = COLORI_GIRI[i % COLORI_GIRI.length];
    const n = giro.length;
    // il raggio cresce con l'altezza dei simboli del giro
    const altezza = Math.max(...giro.map(t => (SIMBOLI[t] || { h: 14 }).h));
    const minimo = (n * 15) / (2 * Math.PI); // spazio sufficiente per non sovrapporre
    const r = Math.max(raggio, minimo);
    giro.forEach((tipo, k) => {
      usati.add(tipo);
      const ang = (k / n) * 360 - 90;
      const rad = ang * Math.PI / 180;
      const x = Math.cos(rad) * r, y = Math.sin(rad) * r;
      parti.push(`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang + 90})">${simbolo(tipo, col)}</g>`);
    });
    parti.push(`<text x="${(r + altezza * 0.5).toFixed(0)}" y="-4" font-size="10" fill="${col}" font-family="sans-serif">${i + 1}</text>`);
    raggio = r + altezza + 6;
  });
  const R = raggio + 10;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-R} ${-R} ${2 * R} ${2 * R}" width="${Math.min(2 * R, 420)}">${parti.join('')}</svg>`;
  return { svg, usati: [...usati] };
}

/* Diagramma a righe (lavoro avanti e indietro): righe = array di array (dal basso) */
function diagrammaRighe(righe, opz) {
  opz = opz || {};
  const dx = 18;
  const usati = new Set(['cat']);
  let parti = [];
  let y = 0;
  const larg = Math.max(...righe.map(r => r.length));
  // catenella di base
  for (let k = 0; k < larg; k++) parti.push(`<g transform="translate(${k * dx},${y + 4}) rotate(0)">${simbolo('cat', '#999')}</g>`);
  y -= 6;
  righe.forEach((riga, i) => {
    const col = COLORI_GIRI[i % COLORI_GIRI.length];
    const altezza = Math.max(...riga.map(t => (SIMBOLI[t] || { h: 14 }).h));
    riga.forEach((tipo, k) => {
      usati.add(tipo);
      parti.push(`<g transform="translate(${k * dx},${y})">${simbolo(tipo, col)}</g>`);
    });
    // freccia di direzione e numero riga
    // la riga 1 si lavora da destra a sinistra: il numero sta dove la riga comincia
    const daDestra = i % 2 === 0;
    const xt = daDestra ? larg * dx + 2 : -28;
    parti.push(`<text x="${xt}" y="${y - altezza / 2 + 4}" font-size="11" fill="${col}" font-family="sans-serif">${daDestra ? (i + 1) + '←' : '→' + (i + 1)}</text>`);
    y -= altezza + 6;
  });
  const minX = -30, maxX = larg * dx + 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${y - 6} ${maxX - minX} ${-y + 20}" width="${Math.min(maxX - minX, 520)}">${parti.join('')}</svg>`;
  return { svg, usati: [...usati] };
}

/* Diagramma della mattonella granny (giri quadrati con gruppi di 3 ma) */
function diagrammaGranny(nGiri) {
  const parti = [];
  const usati = new Set(['cm', 'ma', 'cat']);
  parti.push(simbolo('cm', '#999'));
  const P = 36; // distanza tra un giro e l'altro e tra i gruppi
  for (let g = 1; g <= nGiri; g++) {
    const col = COLORI_GIRI[(g - 1) % COLORI_GIRI.length];
    const d = P * g; // distanza del lato dal centro
    for (let lato = 0; lato < 4; lato++) {
      let g2 = '';
      for (let j = 0; j < g; j++) { // g gruppi per lato
        const pos = (j - (g - 1) / 2) * 2 * P;
        for (const off of [-8, 0, 8]) g2 += `<g transform="translate(${pos + off},${-d + 14}) rotate(${off * 1.5})">${simbolo('ma', col)}</g>`;
        if (j < g - 1) g2 += `<g transform="translate(${pos + P},${-d - 4})">${simbolo('cat', col)}</g>`;
      }
      // 2 catenelle d'angolo
      g2 += `<g transform="translate(${d - 6},${-d - 8}) rotate(25)">${simbolo('cat', col)}</g><g transform="translate(${d + 4},${-d + 2}) rotate(65)">${simbolo('cat', col)}</g>`;
      parti.push(`<g transform="rotate(${lato * 90})">${g2}</g>`);
    }
    parti.push(`<text x="${-d + 4}" y="${-d - 18}" font-size="11" fill="${col}" font-family="sans-serif">${g}</text>`);
  }
  const R = P * nGiri + 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-R} ${-R} ${2 * R} ${2 * R}" width="${Math.min(2 * R, 420)}">${parti.join('')}</svg>`;
  return { svg, usati: [...usati] };
}

/* Utility per generare giri di cerchio piatto */
function giriCerchioMb(n) { // 6 mb nel cerchio magico, poi +6 a giro
  const out = [];
  for (let g = 1; g <= n; g++) {
    if (g === 1) { out.push(Array(6).fill('mb')); continue; }
    const giro = [];
    for (let k = 0; k < 6; k++) { for (let j = 0; j < g - 2; j++) giro.push('mb'); giro.push('aum'); }
    out.push(giro);
  }
  return out;
}
function giriCerchioMa(n) { // 12 ma nel cerchio magico, poi +12 a giro
  const out = [];
  for (let g = 1; g <= n; g++) {
    if (g === 1) { out.push(Array(12).fill('ma')); continue; }
    const giro = [];
    for (let k = 0; k < 12; k++) { for (let j = 0; j < g - 2; j++) giro.push('ma'); giro.push('aumma'); }
    out.push(giro);
  }
  return out;
}
function righeUguali(nRighe, nMaglie, tipo) { return Array.from({ length: nRighe }, () => Array(nMaglie).fill(tipo)); }

function legendaHTML(usati) {
  return '<div class="legenda">' + usati.filter(t => SIMBOLI[t]).map(t =>
    `<span>${simboloSVG(t, 26)} ${SIMBOLI[t].abbr} = ${SIMBOLI[t].nome}</span>`).join('') + '</div>';
}
