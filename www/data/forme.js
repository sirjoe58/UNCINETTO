/* Progettista di forme per amigurumi: calcola i giri e disegna la sagoma */
const FORME = {
  sfera: { nome: 'Sfera (palla, testa)', emoji: '⚽' },
  ovale: { nome: 'Ovale (corpo, uovo)', emoji: '🥚' },
  cilindro: { nome: 'Cilindro (gambe, braccia, vaso)', emoji: '🥫' },
  cono: { nome: 'Cono (orecchie, cappello, carota)', emoji: '🥕' },
  goccia: { nome: 'Goccia / pera (pancione)', emoji: '🍐' },
};

/* Istruzione per passare da A a B maglie in un giro (aumenti o diminuzioni distribuiti) */
function istruzioneGiro(A, B) {
  if (A === B) return `${B} mb`;
  if (B > A) {
    const n = B - A, base = Math.floor((A - n) / n), resto = (A - n) % n;
    if (n === A) return `aum ×${n}`;
    if (!resto) return `(${base ? base + ' mb, ' : ''}aum) ×${n}`;
    return `(${base + 1} mb, aum) ×${resto}, (${base ? base + ' mb, ' : ''}aum) ×${n - resto}`;
  }
  const d = A - B, lib = A - 2 * d, base = Math.floor(lib / d), resto = lib % d;
  if (!lib) return `dim ×${d}`;
  if (!resto) return `(${base} mb, dim) ×${d}`;
  return `(${base + 1} mb, dim) ×${resto}, (${base ? base + ' mb, ' : ''}dim) ×${d - resto}`;
}

/* Restituisce la sequenza di maglie per giro */
function contaGiri(tipo, max, altezza) {
  const k = Math.max(2, Math.round(max / 6)); const M = 6 * k;
  const su = []; for (let g = 1; g <= k; g++) su.push(6 * g);
  const giu = []; for (let g = k - 1; g >= 1; g--) giu.push(6 * g);
  const dritti = n => Array(Math.max(0, n)).fill(M);
  switch (tipo) {
    case 'sfera': return [...su, ...dritti(k), ...giu];
    case 'ovale': return [...su, ...dritti(altezza || 2 * k), ...giu];
    case 'cilindro': return [...su, ...dritti(altezza || 2 * k)];
    case 'cono': { const c = [6]; let x = 6; while (x < M) { c.push(x); x += 6; c.push(x); } return [...c, ...dritti(2)]; }
    case 'goccia': { // sale lentamente, pancia larga, si chiude in fretta
      const c = [6]; let x = 6; while (x < M) { c.push(x); x += 6; c.push(x); }
      return [...c, ...dritti(Math.max(2, Math.round(k / 2))), ...giu];
    }
  }
  return su;
}

function progettaForma(tipo, max, altezza) {
  const giri = contaGiri(tipo, max, altezza);
  const passi = [];
  let primoDritto = true, i = 0;
  while (i < giri.length) {
    const n = giri[i];
    if (i === 0) { passi.push(`Giro 1: ${n} maglie basse nel cerchio magico. (${n})`); i++; continue; }
    if (n !== giri[i - 1]) { passi.push(`Giro ${i + 1}: ${istruzioneGiro(giri[i - 1], n)}. (${n})`); i++; continue; }
    if (tipo === 'cilindro' && primoDritto) { passi.push(`Giro ${i + 1}: ${n} mb solo nel filo posteriore: fa lo spigolo del fondo. (${n})`); primoDritto = false; i++; continue; }
    let j = i; while (j + 1 < giri.length && giri[j + 1] === n) j++;
    passi.push(j > i ? `Giri ${i + 1}-${j + 1}: ${n} mb a giro, senza aumenti. (${n})` : `Giro ${i + 1}: ${n} mb. (${n})`);
    i = j + 1;
  }
  const finale = tipo === 'cilindro' ? 'Chiudi con 1 mbss e lascia un filo lungo per cucire. Imbottisci se serve.'
    : tipo === 'cono' ? 'Chiudi con 1 mbss lasciando un filo lungo per cucirlo; imbottisci poco o niente.'
    : 'Imbottisci quando restano 2-3 giri. Dopo l\'ultimo giro chiudi il buco passando l\'ago nei fili anteriori e tirando.';
  passi.push(finale);
  return { giri, passi };
}

/* Disegna la sagoma laterale: ogni giro è una fettina. Una maglia bassa è circa un quadratino
   (larghezza = altezza = 1): il raggio di un giro è maglie / 2π e la salita verticale è quanto resta
   dell'altezza della maglia dopo l'allargamento (per questo i giri di aumento sono quasi piatti). */
function sagomaSVG(giri, colore, mini) {
  colore = colore || '#c2577a';
  const sc = 9;
  const r = giri.map(n => n / (2 * Math.PI));
  const z = [0];
  for (let i = 1; i < giri.length; i++) { const dr = r[i] - r[i - 1]; z.push(z[i - 1] + Math.sqrt(Math.max(0.08, 1 - dr * dr))); }
  const top = z[z.length - 1] + 0.6;
  const rMax = Math.max(...r);
  const W = rMax * 2 * sc + 90, H = top * sc + 30;
  const cx = rMax * sc + 12, y0 = H - 12;
  const sx = [], dx = [];
  giri.forEach((n, i) => { const y = y0 - z[i] * sc; sx.push(`${(cx - r[i] * sc).toFixed(1)},${y.toFixed(1)}`); dx.unshift(`${(cx + r[i] * sc).toFixed(1)},${y.toFixed(1)}`); });
  let righe = '';
  const passoEt = Math.max(1, Math.ceil(giri.length / 10));
  giri.forEach((n, i) => { const y = y0 - z[i] * sc;
    righe += `<line x1="${(cx - r[i] * sc).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(cx + r[i] * sc).toFixed(1)}" y2="${y.toFixed(1)}" stroke="#fff" stroke-opacity=".45"/>`;
    if (!mini && (i % passoEt === 0 || i === giri.length - 1)) righe += `<text x="${(cx + rMax * sc + 8).toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="8" fill="#7d6e66" font-family="sans-serif">${i + 1}: ${n}</text>`; });
  const tappo = giri[giri.length - 1] <= 6 ? `${cx},${(y0 - top * sc).toFixed(1)}` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${Math.min(W * 1.4, 360).toFixed(0)}">
    <polygon points="${cx},${y0 + 3} ${sx.join(' ')} ${tappo} ${dx.join(' ')}" fill="${colore}" stroke="#9c3d5e" stroke-width="1.5" stroke-linejoin="round"/>${righe}
    ${mini ? '' : '<text x="2" y="10" font-size="8" fill="#7d6e66" font-family="sans-serif">giro: maglie</text>'}</svg>`;
}
