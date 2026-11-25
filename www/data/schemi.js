/* Schemi originali SirJoe Uncinetto.
   Ogni passo ha la spiegazione semplice (s) e la versione abbreviata per esperti (e).
   Abbreviazioni: cat = catenella, mbss = maglia bassissima, mb = maglia bassa, mma = mezza maglia alta,
   ma = maglia alta, maa = maglia altissima, cm = cerchio magico, aum = aumento, dim = diminuzione. */

const CATEGORIE = [
  { id: 'primi', nome: 'Primi passi', emoji: '🌱', desc: 'Per imparare i punti base' },
  { id: 'casa', nome: 'Casa e cucina', emoji: '🏠', desc: 'Presine, sottobicchieri, cestini' },
  { id: 'granny', nome: 'Granny square', emoji: '🟪', desc: 'Mattonelle e coperte' },
  { id: 'vestire', nome: 'Da indossare', emoji: '🧣', desc: 'Sciarpe, cuffie, fasce' },
  { id: 'amigurumi', nome: 'Amigurumi', emoji: '🐣', desc: 'Pupazzetti imbottiti' },
  { id: 'fiori', nome: 'Fiori e decorazioni', emoji: '🌸', desc: 'Applicazioni e piccoli motivi' },
  { id: 'borse', nome: 'Borse', emoji: '👜', desc: 'Shopper e pochette' },
  { id: 'bimbi', nome: 'Per bambini', emoji: '🍼', desc: 'Copertine e bavaglini' },
  { id: 'feste', nome: 'Feste', emoji: '🎄', desc: 'Natale, Halloween e altro' },
];

const P = (s, e) => ({ s, e: e || s });

const SCHEMI = [
  /* ---------------- PRIMI PASSI ---------------- */
  { id: 'braccialetto', cat: 'primi', titolo: 'Braccialetto a treccia di catenelle', emoji: '📿', livello: 1, tempo: '20 minuti', misure: 'circa 18 cm',
    materiale: ['Avanzi di cotone in 3 colori', 'Uncinetto 3 mm', 'Forbici'],
    intro: 'Il primo lavoro ideale: si usa solo la catenella.',
    diagramma: () => diagrammaRighe([Array(12).fill('cat')]),
    passi: [
      P('Fai il nodo scorsoio con il primo colore.', 'Nodo scorsoio.'),
      P('Lavora catenelle finché la catena misura circa 25 cm. Chiudi tirando il filo nell\'ultimo cappio.', 'Cat fino a 25 cm, chiudi.'),
      P('Ripeti con gli altri due colori: avrai 3 catenelle uguali.', 'Ripeti ×3 colori.'),
      P('Annoda insieme le tre catenelle a un\'estremità e intrecciale come una treccia di capelli.', 'Annoda e intreccia.'),
      P('Annoda l\'altra estremità quando la treccia gira bene intorno al polso. Taglia le codine lasciandone 5 cm per legarlo.', 'Annoda, lascia codine per chiudere.')],
    consigli: 'Se le catenelle sono strette e storte, rilassa la mano: la regolarità arriva con la pratica.' },

  { id: 'quadratino', cat: 'primi', titolo: 'Quadratino di prova a maglia bassa', emoji: '🟫', livello: 1, tempo: '40 minuti', misure: 'circa 10 × 10 cm',
    materiale: ['Cotone medio di colore chiaro', 'Uncinetto 4 mm', 'Ago da lana'],
    intro: 'Serve a prendere confidenza con la maglia bassa e a vedere se le righe vengono dritte.',
    diagramma: () => diagrammaRighe(righeUguali(4, 15, 'mb')),
    passi: [
      P('Fai 16 catenelle.', '16 cat.'),
      P('Riga 1: salta la prima catenella vicino all\'uncinetto. Lavora 1 maglia bassa in ognuna delle altre 15 catenelle. Conta: 15 maglie.', 'R1: 1 mb dalla 2ª cat dall\'uncinetto e in ogni cat (15).'),
      P('Fai 1 catenella e gira il lavoro come se girassi la pagina di un libro.', '1 cat, gira.'),
      P('Riga 2: lavora 1 maglia bassa in ogni maglia, iniziando dalla prima. Conta: 15 maglie.', 'R2: 15 mb.'),
      P('Ripeti le righe 2 (con la catenella per girare) finché il lavoro è un quadrato: circa 15-16 righe.', 'Ripeti R2 fino a R16.'),
      P('Chiudi e nascondi i fili.', 'Chiudi, nascondi i fili.')],
    consigli: 'Se il quadrato si allarga o si stringe, stai aggiungendo o perdendo maglie: conta a ogni riga, l\'ultima maglia è la più facile da saltare.' },

  { id: 'cerchio', cat: 'primi', titolo: 'Cerchio piatto a maglia bassa', emoji: '⭕', livello: 1, tempo: '30 minuti', misure: 'circa 9 cm di diametro',
    materiale: ['Cotone medio', 'Uncinetto 4 mm', 'Segnapunti (o un filo di altro colore)'],
    intro: 'La base di tantissimi lavori: amigurumi, cestini, sottobicchieri. Si lavora in tondo, a spirale.',
    diagramma: () => diagrammaTondo(giriCerchioMb(5)),
    passi: [
      P('Fai il cerchio magico e lavora 6 maglie basse dentro. Stringi. Metti il segnapunti nell\'ultima maglia. (6 maglie)', 'G1: 6 mb nel cm (6).'),
      P('Giro 2: fai 2 maglie basse in ogni maglia. (12 maglie)', 'G2: aum ×6 (12).'),
      P('Giro 3: *1 maglia bassa, poi 2 nella maglia dopo* e ripeti 6 volte. (18 maglie)', 'G3: (1 mb, aum) ×6 (18).'),
      P('Giro 4: *2 maglie basse, poi 2 nella dopo* per 6 volte. (24 maglie)', 'G4: (2 mb, aum) ×6 (24).'),
      P('Giro 5: *3 maglie basse, poi 2 nella dopo* per 6 volte. (30 maglie)', 'G5: (3 mb, aum) ×6 (30).'),
      P('Per allargare ancora: a ogni giro aggiungi una maglia bassa prima dell\'aumento. Chiudi con 1 mbss e ferma il filo.', 'Prosegui +6 a giro; mbss, chiudi.')],
    consigli: 'Regola d\'oro: il numero di maglie normali tra gli aumenti è sempre il numero del giro meno 2.' },

  /* ---------------- CASA ---------------- */
  { id: 'presina', cat: 'casa', titolo: 'Presina quadrata con appendino', emoji: '🧤', livello: 1, tempo: '2 ore', misure: 'circa 18 × 18 cm',
    materiale: ['Cotone 100% spesso (non acrilico: si scioglie col calore)', 'Uncinetto 4,5 mm', 'Ago da lana'],
    intro: 'Lavorata a maglia bassa è compatta e protegge bene dal calore.',
    diagramma: () => diagrammaRighe(righeUguali(4, 16, 'mb')),
    passi: [
      P('Fai 31 catenelle.', '31 cat.'),
      P('Riga 1: 1 maglia bassa dalla 2ª catenella e in tutte le altre. (30 maglie)', 'R1: mb dalla 2ª cat (30).'),
      P('Righe 2 e seguenti: 1 catenella, gira, 30 maglie basse. Continua finché il lavoro è quadrato (circa 34 righe).', 'R2-34: 1 cat, gira, 30 mb.'),
      P('Bordo: non tagliare il filo. Lavora maglie basse lungo tutti e 4 i lati. Negli angoli fai 3 maglie basse nella stessa maglia.', 'Bordo a mb tutto intorno, 3 mb negli angoli.'),
      P('Appendino: arrivato a un angolo fai 12 catenelle e fissale con 1 mbss nella stessa maglia d\'angolo.', '12 cat, mbss nell\'angolo.'),
      P('Chiudi e nascondi i fili. Per una presina più spessa puoi farne due e unirle con il bordo.', 'Chiudi. Opz.: 2 strati uniti col bordo.')],
    consigli: 'Usa solo cotone o lino: le fibre sintetiche si fondono a contatto con le pentole calde.' },

  { id: 'sottobicchiere', cat: 'casa', titolo: 'Sottobicchiere tondo', emoji: '☕', livello: 1, tempo: '30 minuti', misure: 'circa 10 cm',
    materiale: ['Cotone medio', 'Uncinetto 3,5 mm'],
    intro: 'Un cerchio di maglie alte: si fa in fretta e si impara a lavorare in giri chiusi.',
    diagramma: () => diagrammaTondo(giriCerchioMa(4)),
    passi: [
      P('Fai il cerchio magico. Fai 3 catenelle (valgono come prima maglia alta) e poi 11 maglie alte nel cerchio. Stringi e chiudi con 1 mbss nella 3ª catenella. (12 maglie)', 'G1: 3 cat (=1 ma), 11 ma nel cm, mbss (12).'),
      P('Giro 2: 3 catenelle, 1 maglia alta nella stessa maglia, poi 2 maglie alte in ogni maglia. Chiudi con mbss. (24)', 'G2: 3 cat, 1 ma stessa m., 2 ma in ogni m., mbss (24).'),
      P('Giro 3: 3 catenelle, 1 ma nella stessa maglia, *1 ma, 2 ma nella successiva* tutto intorno. Chiudi. (36)', 'G3: (1 ma, aum ma) ×12 (36).'),
      P('Giro 4: 3 catenelle, 1 ma nella stessa, *2 ma, 2 ma nella successiva* tutto intorno. Chiudi. (48)', 'G4: (2 ma, aum ma) ×12 (48).'),
      P('Giro 5 (bordo): 1 catenella e 1 maglia bassa in ogni maglia. Chiudi e ferma il filo.', 'G5: 48 mb, chiudi.')],
    consigli: 'Se il bordo si increspa hai fatto troppi aumenti; se si incurva a coppa, troppo pochi.' },

  { id: 'cestino', cat: 'casa', titolo: 'Cestino tondo in fettuccia', emoji: '🧺', livello: 2, tempo: '2 ore', misure: 'diametro 18 cm, altezza 10 cm',
    materiale: ['Fettuccia (filato di maglietta) circa 250 g', 'Uncinetto 8-10 mm', 'Segnapunti'],
    intro: 'Fondo piatto a spirale, poi le pareti salgono dritte. Utilissimo per ordinare gomitoli e oggetti.',
    diagramma: () => diagrammaTondo(giriCerchioMb(6)),
    passi: [
      P('Fondo: lavora come il cerchio piatto a maglia bassa fino al giro 6. (36 maglie)', 'Fondo: cerchio a mb fino a G6 (36).'),
      P('Giro 7: 1 maglia bassa in ogni maglia, ma SOLO nel filo posteriore. Così si forma lo spigolo tra fondo e parete. (36)', 'G7: 36 mb fp.'),
      P('Giri 8-17: 1 maglia bassa in ogni maglia, senza aumenti. Le pareti salgono dritte. (36)', 'G8-17: 36 mb.'),
      P('Ultimo giro: maglia bassissima tutto intorno per un bordo pulito. Chiudi e nascondi il filo.', 'Giro di mbss, chiudi.')],
    consigli: 'La fettuccia è dura da lavorare: tieni il filo lento. Per manici, nel penultimo giro fai 6 catenelle saltando 6 maglie, su due lati opposti.' },

  /* ---------------- GRANNY ---------------- */
  { id: 'granny', cat: 'granny', titolo: 'Granny square classica', emoji: '🟪', livello: 1, tempo: '30 minuti a mattonella', misure: 'circa 12 cm (4 giri)',
    materiale: ['Lana o cotone medio, anche avanzi colorati', 'Uncinetto 4 mm', 'Ago da lana'],
    intro: 'La mattonella più famosa: si lavora dal centro verso l\'esterno con gruppi di 3 maglie alte.',
    diagramma: () => diagrammaGranny(4),
    passi: [
      P('Fai 4 catenelle e chiudile ad anello con 1 mbss nella prima (oppure usa il cerchio magico).', '4 cat, chiudi ad anello (o cm).'),
      P('Giro 1: 3 catenelle (valgono come 1 ma), 2 ma nell\'anello. *2 catenelle, 3 ma nell\'anello* ripeti 3 volte. 2 catenelle e chiudi con mbss nella 3ª catenella iniziale. Hai 4 gruppi e 4 angoli.', 'G1: 3 cat, 2 ma, (2 cat, 3 ma) ×3, 2 cat, mbss.'),
      P('Giro 2: mbss fino al primo spazio d\'angolo. Nello stesso spazio: 3 catenelle, 2 ma, 2 catenelle, 3 ma. *1 catenella, poi nello spazio d\'angolo seguente: 3 ma, 2 cat, 3 ma* ripeti 2 volte. 1 catenella e chiudi.', 'G2: in ogni angolo (3 ma, 2 cat, 3 ma), 1 cat tra gli angoli.'),
      P('Giro 3: come il giro 2 negli angoli, ma nello spazio da 1 catenella sui lati lavora anche 3 ma. Tra un gruppo e l\'altro fai sempre 1 catenella.', 'G3: angoli come sopra; 3 ma in ogni spazio laterale, 1 cat tra i gruppi.'),
      P('Giro 4 e seguenti: ogni giro aggiunge un gruppo per lato. Negli angoli sempre 3 ma, 2 cat, 3 ma.', 'Ogni giro +1 gruppo per lato.'),
      P('Per cambiare colore: chiudi il giro, taglia il filo e riparti dal nuovo colore in uno spazio d\'angolo.', 'Cambio colore all\'angolo a inizio giro.')],
    consigli: 'Se la mattonella si arriccia tieni le catenelle d\'angolo un po\' più lente; se si ondula, stringile.' },

  { id: 'coperta-granny', cat: 'granny', titolo: 'Coperta di granny square', emoji: '🛋️', livello: 2, tempo: 'alcune settimane', misure: 'circa 96 × 120 cm (8 × 10 mattonelle)',
    materiale: ['Lana media circa 1 kg in più colori', 'Uncinetto 4 mm', 'Ago da lana'],
    intro: 'Tante granny square da 12 cm unite tra loro.',
    diagramma: () => diagrammaGranny(3),
    passi: [
      P('Prepara 80 mattonelle (granny square classica di 4 giri), tutte con lo stesso ultimo giro di colore neutro.', '80 granny 4 giri, ultimo giro colore unito.'),
      P('Stendile sul pavimento e scegli la disposizione dei colori. Fai una foto per ricordarla.', 'Disponi e fotografa.'),
      P('Unisci due mattonelle appoggiandole dritto contro dritto e lavorando maglie basse prendendo il filo posteriore di entrambe.', 'Unione a mb nei fili posteriori, dritto contro dritto.'),
      P('Unisci prima le file orizzontali, poi quelle verticali: le giunture risultano dritte.', 'Unisci prima le file, poi le colonne.'),
      P('Bordo: 2 giri di maglie alte tutto intorno, con 3 ma, 2 cat, 3 ma negli angoli, e 1 giro di punto gambero.', 'Bordo: 2 giri ma (angoli 3-2-3) + 1 giro punto gambero.')],
    consigli: 'Nascondi i fili di ogni mattonella appena finita: alla fine sarebbero centinaia!' },

  /* ---------------- DA INDOSSARE ---------------- */
  { id: 'sciarpa', cat: 'vestire', titolo: 'Sciarpa a coste morbide', emoji: '🧣', livello: 1, tempo: '6-8 ore', misure: 'circa 18 × 160 cm',
    materiale: ['Lana grossa circa 300 g', 'Uncinetto 6 mm', 'Ago da lana'],
    intro: 'Si lavora a mezza maglia alta solo nel filo posteriore: viene un effetto a coste che sembra fatto ai ferri.',
    diagramma: () => diagrammaRighe(righeUguali(4, 14, 'mma')),
    passi: [
      P('Fai 28 catenelle (circa 18 cm).', '28 cat.'),
      P('Riga 1: 1 mezza maglia alta dalla 3ª catenella e in tutte le altre. (26 maglie)', 'R1: mma dalla 3ª cat (26).'),
      P('Riga 2: 2 catenelle (non contano), gira, 1 mezza maglia alta in ogni maglia ma SOLO nel filo posteriore. (26)', 'R2: 2 cat, gira, 26 mma fp.'),
      P('Ripeti la riga 2 finché la sciarpa è lunga 160 cm.', 'Ripeti R2 fino a 160 cm.'),
      P('Chiudi e nascondi i fili. Se vuoi, aggiungi frange ai due lati corti.', 'Chiudi. Opz.: frange.')],
    consigli: 'Conta le maglie ogni tanto: è facile saltare l\'ultima e la sciarpa si restringe senza accorgersene.' },

  { id: 'cuffia', cat: 'vestire', titolo: 'Cuffia semplice dall\'alto', emoji: '🧢', livello: 2, tempo: '3 ore', misure: 'adulto (circonferenza testa 54-58 cm)',
    materiale: ['Lana media circa 100 g', 'Uncinetto 5,5 mm', 'Metro da sarta', 'Ago da lana'],
    intro: 'Si parte dalla cima con un cerchio piatto di maglie alte, poi si scende dritti.',
    diagramma: () => diagrammaTondo(giriCerchioMa(3)),
    passi: [
      P('Giro 1: cerchio magico, 3 catenelle e 11 ma dentro. Chiudi con mbss. (12)', 'G1: 3 cat, 11 ma nel cm (12).'),
      P('Giro 2: 2 ma in ogni maglia. (24)', 'G2: aum ma ×12 (24).'),
      P('Giro 3: *1 ma, 2 ma nella successiva*. (36)', 'G3: (1 ma, aum) ×12 (36).'),
      P('Giri 4-6: continua aggiungendo 12 maglie a giro (48, 60, 72). Fermati quando il cerchio misura 17-18 cm di diametro.', 'G4-6: +12 a giro fino a Ø 17-18 cm (~72).'),
      P('Giri seguenti: 1 ma in ogni maglia, senza aumenti, finché la cuffia misura 19-20 cm dalla cima.', 'Giri senza aumenti fino a 19-20 cm.'),
      P('Bordo: 3 giri alternando 1 maglia alta in rilievo davanti e 1 in rilievo dietro. Chiudi e nascondi i fili.', 'Bordo: 3 giri costa 1/1 (ma ril. av / di).')],
    consigli: 'Misura il diametro del cerchio: è questo che decide la taglia. Per bambino fermati a 14-15 cm.' },

  { id: 'fascia', cat: 'vestire', titolo: 'Fascia per capelli', emoji: '🎀', livello: 1, tempo: '2 ore', misure: 'circa 9 × 50 cm',
    materiale: ['Lana media circa 50 g', 'Uncinetto 5 mm', 'Ago da lana'],
    intro: 'Una striscia a coste cucita ad anello e arricciata al centro.',
    diagramma: () => diagrammaRighe(righeUguali(3, 14, 'mma')),
    passi: [
      P('Fai 16 catenelle.', '16 cat.'),
      P('Riga 1: mezza maglia alta dalla 3ª catenella. (14)', 'R1: 14 mma.'),
      P('Righe seguenti: 2 catenelle, gira, 14 mezze maglie alte nel filo posteriore. Continua finché misura 50 cm (prova intorno alla testa: deve tirare un poco).', 'R2+: 14 mma fp fino a 50 cm.'),
      P('Cuci le due estremità corte con l\'ago da lana.', 'Cuci ad anello.'),
      P('Avvolgi un pezzo di filo stretto più volte intorno alla cucitura per arricciarla. Annoda all\'interno.', 'Arriccia la cucitura con giri di filo.')],
    consigli: 'Con un filato con un po\' di elastico (acrilico o misto) la fascia tiene meglio.' },

  /* ---------------- AMIGURUMI ---------------- */
  { id: 'pallina', cat: 'amigurumi', titolo: 'Pallina base', emoji: '⚽', livello: 1, tempo: '1 ora', misure: 'circa 6 cm',
    materiale: ['Cotone 3 mm', 'Uncinetto 2,5 mm (più piccolo del solito, per maglie fitte)', 'Imbottitura', 'Segnapunti', 'Ago da lana'],
    intro: 'Con la pallina impari tutto degli amigurumi: aumenti, giri dritti, diminuzioni. Si lavora a spirale senza chiudere i giri.',
    diagramma: () => diagrammaTondo(giriCerchioMb(5)),
    passi: [
      P('Giro 1: 6 maglie basse nel cerchio magico. (6)', 'G1: 6 mb nel cm (6).'),
      P('Giro 2: 2 maglie basse in ogni maglia. (12)', 'G2: aum ×6 (12).'),
      P('Giro 3: *1 mb, aumento* per 6 volte. (18)', 'G3: (1 mb, aum) ×6 (18).'),
      P('Giro 4: *2 mb, aumento* per 6 volte. (24)', 'G4: (2 mb, aum) ×6 (24).'),
      P('Giro 5: *3 mb, aumento* per 6 volte. (30)', 'G5: (3 mb, aum) ×6 (30).'),
      P('Giri 6-10: 1 maglia bassa in ogni maglia. (30)', 'G6-10: 30 mb.'),
      P('Giro 11: *3 mb, diminuzione* per 6 volte. (24)', 'G11: (3 mb, dim) ×6 (24).'),
      P('Giro 12: *2 mb, diminuzione* per 6 volte. (18) Ora riempi bene con l\'imbottitura.', 'G12: (2 mb, dim) ×6 (18). Imbottisci.'),
      P('Giro 13: *1 mb, diminuzione* per 6 volte. (12)', 'G13: (1 mb, dim) ×6 (12).'),
      P('Giro 14: 6 diminuzioni. (6) Taglia il filo e chiudi il buco passando l\'ago nelle ultime maglie e tirando.', 'G14: dim ×6 (6). Chiudi.')],
    consigli: 'Sposta il segnapunti all\'inizio di ogni giro: in spirale è l\'unico modo per non perdere il conto. Usa il contatore dell\'app!' },

  { id: 'pulcino', cat: 'amigurumi', titolo: 'Pulcino a ovetto', emoji: '🐥', livello: 2, tempo: '2 ore', misure: 'circa 7 cm',
    materiale: ['Cotone giallo e un po\' di arancione e nero', 'Uncinetto 2,5 mm', 'Imbottitura', 'Ago da lana'],
    intro: 'Una pallina un po\' allungata con becco, ali e occhi ricamati.',
    diagramma: () => diagrammaTondo(giriCerchioMb(5)),
    passi: [
      P('Corpo: giri 1-5 come la pallina base. (30)', 'Corpo G1-5 come pallina (30).'),
      P('Giri 6-13: 30 maglie basse a giro (il corpo diventa più alto della pallina).', 'G6-13: 30 mb.'),
      P('Giri 14-17: diminuisci come la pallina (24, 18, 12, 6), imbottendo prima dell\'ultimo giro. Chiudi.', 'G14-17: dim come pallina; imbottisci; chiudi.'),
      P('Ali (2): cerchio magico con 6 mb, giro 2: *1 mb, aumento* (9), giri 3-4: 9 mb. Appiattisci e cuci ai lati.', 'Ali ×2: 6 mb nel cm, (1 mb, aum)×3 (9), 2 giri 9 mb; cuci appiattite.'),
      P('Becco: con l\'arancione 4 catenelle; dalla 2ª: 1 mbss, 1 mb, 1 mma. Cucilo a metà altezza.', 'Becco: 4 cat, mbss/mb/mma; cuci.'),
      P('Occhi: ricama con il nero due piccoli punti sopra il becco, distanti 5-6 maglie.', 'Occhi ricamati in nero, 5-6 m. di distanza.')],
    consigli: 'Per i bambini piccoli niente occhi di plastica: ricamati sono più sicuri.' },

  { id: 'cactus', cat: 'amigurumi', titolo: 'Cactus nel vasetto', emoji: '🌵', livello: 2, tempo: '2 ore', misure: 'circa 10 cm di altezza',
    materiale: ['Cotone verde e color terracotta', 'Uncinetto 2,5 mm', 'Imbottitura', 'Un sassolino o fagioli secchi per il peso'],
    intro: 'Un vasetto e un cactus a coste che non ha mai bisogno d\'acqua.',
    diagramma: () => diagrammaTondo(giriCerchioMb(4)),
    passi: [
      P('Vaso: con la terracotta lavora il cerchio piatto fino al giro 4. (24)', 'Vaso: cerchio mb fino a G4 (24).'),
      P('Giro 5: 24 maglie basse nel filo posteriore (fa lo spigolo del fondo).', 'G5: 24 mb fp.'),
      P('Giri 6-11: 24 maglie basse. Giro 12: 24 mb nel filo anteriore; giro 13: 24 mb (fa il bordino del vaso). Non chiudere.', 'G6-11: 24 mb; G12: 24 mb fa; G13: 24 mb.'),
      P('Cactus: con il verde cerchio magico con 6 mb, giro 2: 12, giro 3: 18.', 'Cactus: 6, 12, 18.'),
      P('Giri 4-16: 18 maglie basse nel filo posteriore: si formano le coste del cactus.', 'G4-16: 18 mb fp.'),
      P('Imbottisci il cactus. Metti il sassolino sul fondo del vaso, un po\' di imbottitura, poi infila il cactus e cucilo al bordo interno del vaso.', 'Peso nel vaso, imbottisci, cuci il cactus all\'interno.')],
    consigli: 'Aggiungi un fiorellino (vedi "Fiore a 5 petali" fatto più piccolo) in cima al cactus.' },

  /* ---------------- FIORI ---------------- */
  { id: 'fiore', cat: 'fiori', titolo: 'Fiore a 5 petali', emoji: '🌸', livello: 1, tempo: '15 minuti', misure: 'circa 6 cm',
    materiale: ['Cotone medio in 1 o 2 colori', 'Uncinetto 3 mm'],
    intro: 'Un fiore da applicare su borse, cuffie, biglietti.',
    diagramma: () => diagrammaTondo([Array(10).fill('mb'), ['cat','cat','cat','mb','cat','cat','cat','mb','cat','cat','cat','mb','cat','cat','cat','mb','cat','cat','cat','mb']]),
    passi: [
      P('Giro 1: cerchio magico, 1 catenella, 10 maglie basse. Stringi e chiudi con mbss. (10)', 'G1: 10 mb nel cm, mbss.'),
      P('Giro 2: *3 catenelle, salta 1 maglia, 1 maglia bassa nella successiva* per 5 volte. Hai 5 archetti.', 'G2: (3 cat, salta 1, 1 mb) ×5.'),
      P('Giro 3: in ogni archetto lavora: 1 mb, 1 mma, 3 ma, 1 mma, 1 mb. Sono i 5 petali.', 'G3: in ogni archetto (mb, mma, 3 ma, mma, mb).'),
      P('Chiudi con mbss nella prima maglia, taglia lasciando una codina lunga per cucirlo.', 'mbss, chiudi con codina lunga.')],
    consigli: 'Per un fiore a due colori, fai il giro 1 in giallo e cambia colore nel giro 2.' },

  { id: 'cuore', cat: 'fiori', titolo: 'Cuoricino piatto', emoji: '❤️', livello: 2, tempo: '10 minuti', misure: 'circa 5 cm',
    materiale: ['Cotone rosso', 'Uncinetto 3 mm'],
    intro: 'Tutto in un solo giro, dentro un cerchio magico.',
    diagramma: null,
    passi: [
      P('Fai il cerchio magico. Dentro lavora: 3 catenelle, 3 maglie altissime, 3 maglie alte.', 'Nel cm: 3 cat, 3 maa, 3 ma,'),
      P('Poi: 1 catenella, 1 maglia altissima (sarà la punta), 1 catenella.', '1 cat, 1 maa (punta), 1 cat,'),
      P('Poi: 3 maglie alte, 3 maglie altissime, 3 catenelle e 1 mbss dentro il cerchio.', '3 ma, 3 maa, 3 cat, mbss nel cm.'),
      P('Tira forte la codina del cerchio magico: la parte centrale si chiude e si forma l\'incavo del cuore.', 'Stringi il cm per formare l\'incavo.'),
      P('Chiudi e nascondi i fili.', 'Chiudi.')],
    consigli: 'Puoi fare un bordo di maglie basse tutto intorno con un altro colore.' },

  { id: 'foglia', cat: 'fiori', titolo: 'Foglia', emoji: '🍃', livello: 1, tempo: '10 minuti', misure: 'circa 6 cm',
    materiale: ['Cotone verde', 'Uncinetto 3 mm'],
    intro: 'Si lavora sui due lati di una catenella.',
    diagramma: () => diagrammaRighe([['mbss','mb','mma','ma','ma','ma','mma','mb','mbss']]),
    passi: [
      P('Fai 10 catenelle.', '10 cat.'),
      P('Dalla 2ª catenella: 1 mbss, 1 mb, 1 mma, 3 ma, 1 mma, 1 mb, 1 mbss.', 'Dalla 2ª cat: mbss, mb, mma, 3 ma, mma, mb, mbss.'),
      P('Fai 2 catenelle per la punta e gira intorno, lavorando sull\'altro lato della catenella con la stessa sequenza.', '2 cat, ripeti sul lato opposto.'),
      P('Chiudi con mbss alla base. Puoi fare qualche catenella in più come gambo.', 'mbss; gambo di cat opzionale.')],
    consigli: 'Abbinala al fiore a 5 petali per una spilla.' },

  /* ---------------- BORSE ---------------- */
  { id: 'shopper', cat: 'borse', titolo: 'Borsa a rete per la spesa', emoji: '🛍️', livello: 2, tempo: '5 ore', misure: 'circa 35 × 40 cm, manici esclusi',
    materiale: ['Cotone resistente circa 200 g', 'Uncinetto 4 mm', 'Segnapunti'],
    intro: 'Fondo tondo e corpo a rete che si allarga quando è piena.',
    diagramma: () => diagrammaTondo(giriCerchioMb(5)),
    passi: [
      P('Fondo: lavora il cerchio piatto a maglia bassa fino al giro 10. (60) Chiudi il giro con mbss.', 'Fondo: cerchio mb fino a G10 (60), mbss.'),
      P('Rete, giro 1: *5 catenelle, salta 2 maglie, 1 mb nella successiva* tutto intorno. (20 archetti)', 'Rete G1: (5 cat, salta 2, 1 mb) ×20.'),
      P('Giri seguenti: *5 catenelle, 1 mb al centro dell\'archetto successivo*. Continua per circa 25 giri o fino all\'altezza voluta.', 'Rete: (5 cat, 1 mb nell\'archetto) per ~25 giri.'),
      P('Bordo: 3 mb in ogni archetto (60). Poi 1 giro di 60 mb.', 'Bordo: 3 mb per archetto (60), poi 60 mb.'),
      P('Manici: *10 mb, 40 catenelle, salta 20 maglie* per 2 volte.', 'Manici: (10 mb, 40 cat, salta 20) ×2.'),
      P('Ultimi 2 giri: maglie basse in ogni maglia e in ogni catenella dei manici. Chiudi e nascondi i fili.', '2 giri mb anche sulle cat. Chiudi.')],
    consigli: 'Per manici più robusti, fai un terzo giro di maglie basse solo sui manici.' },

  { id: 'pochette', cat: 'borse', titolo: 'Pochette a righe con patta', emoji: '👛', livello: 1, tempo: '3 ore', misure: 'circa 20 × 15 cm',
    materiale: ['Cotone medio in 2-3 colori', 'Uncinetto 3,5 mm', 'Un bottone', 'Ago da lana'],
    intro: 'Un rettangolo a righe piegato in tre: due parti fanno la tasca, la terza la patta.',
    diagramma: () => diagrammaRighe(righeUguali(4, 16, 'mb')),
    passi: [
      P('Fai 41 catenelle. Riga 1: 40 maglie basse dalla 2ª catenella.', '41 cat; R1: 40 mb.'),
      P('Righe seguenti: 1 catenella, gira, 40 mb. Cambia colore ogni 4 righe.', 'R2+: 40 mb, cambio colore ogni 4 righe.'),
      P('Continua finché il rettangolo è lungo 40 cm.', 'Fino a 40 cm.'),
      P('Piega dal basso 15 cm e cuci i due lati per formare la tasca. Rimane una patta di 10 cm.', 'Piega 15 cm, cuci i lati; patta 10 cm.'),
      P('Asola: al centro della patta fai 1 riga di mb in cui salti 3 maglie facendo 3 catenelle. Cuci il bottone sulla tasca.', 'Asola di 3 cat al centro della patta; cuci bottone.')],
    consigli: 'Per una pochette più rigida, foderala con un rettangolo di stoffa cucito all\'interno.' },

  /* ---------------- BAMBINI ---------------- */
  { id: 'copertina', cat: 'bimbi', titolo: 'Copertina per neonato a righe', emoji: '🧸', livello: 1, tempo: '15-20 ore', misure: 'circa 75 × 85 cm',
    materiale: ['Lana baby o cotone morbido circa 500 g in 2-3 colori', 'Uncinetto 5 mm', 'Ago da lana'],
    intro: 'A maglia alta cresce in fretta. Righe di colore ogni 4 righe.',
    diagramma: () => diagrammaRighe(righeUguali(4, 16, 'ma')),
    passi: [
      P('Fai 103 catenelle (circa 75 cm).', '103 cat.'),
      P('Riga 1: 1 maglia alta nella 4ª catenella dall\'uncinetto e in tutte le altre. (100 maglie, contando le 3 catenelle saltate)', 'R1: ma dalla 4ª cat (100).'),
      P('Righe seguenti: 3 catenelle (contano come 1 ma), gira, 1 ma in ogni maglia. L\'ultima ma va nella 3ª catenella della riga sotto. (100)', 'R2+: 3 cat, gira, 99 ma (100).'),
      P('Cambia colore ogni 4 righe. Continua finché misura 85 cm.', 'Cambio colore ogni 4 righe, fino a 85 cm.'),
      P('Bordo: 2 giri di maglie basse tutto intorno, con 3 mb negli angoli. Nascondi bene tutti i fili.', 'Bordo: 2 giri mb, 3 mb agli angoli.')],
    consigli: 'Lava il campione prima di cominciare: alcuni filati baby si allargano dopo il lavaggio.' },

  { id: 'bavaglino', cat: 'bimbi', titolo: 'Bavaglino tondo', emoji: '🍼', livello: 1, tempo: '1 ora', misure: 'circa 18 cm',
    materiale: ['Cotone 100% morbido', 'Uncinetto 4 mm'],
    intro: 'Un cerchio di maglie alte con due lacci.',
    diagramma: () => diagrammaTondo(giriCerchioMa(4)),
    passi: [
      P('Lavora i giri 1-4 come il sottobicchiere tondo. (48)', 'G1-4 come sottobicchiere (48).'),
      P('Giro 5: *3 ma, 2 ma nella successiva* tutto intorno. (60)', 'G5: (3 ma, aum ma) ×12 (60).'),
      P('Giro 6: 1 maglia bassa in ogni maglia. Non tagliare il filo.', 'G6: 60 mb.'),
      P('Laccio 1: fai 45 catenelle, poi torna indietro con 1 mbss in ogni catenella. Fissa con mbss al bordo.', 'Laccio: 45 cat, mbss di ritorno.'),
      P('Salta 12 maglie lungo il bordo, aggancia il filo e fai il secondo laccio uguale. Chiudi e nascondi i fili.', 'Salta 12 m., secondo laccio; chiudi.')],
    consigli: 'Per la sicurezza del bambino, non lasciare mai il bavaglino legato durante il sonno.' },

  /* ---------------- FESTE ---------------- */
  { id: 'pallina-natale', cat: 'feste', titolo: 'Pallina per l\'albero di Natale', emoji: '🎄', livello: 1, tempo: '1 ora', misure: 'circa 6 cm',
    materiale: ['Cotone rosso, bianco o dorato', 'Uncinetto 2,5 mm', 'Imbottitura', 'Nastrino'],
    intro: 'È la pallina base degli amigurumi con un anellino per appenderla.',
    diagramma: () => diagrammaTondo(giriCerchioMb(5)),
    passi: [
      P('Lavora la pallina base (giri 1-14). Per le righe, cambia colore ai giri 6, 8 e 10.', 'Pallina base; righe di colore a G6, G8, G10.'),
      P('Prima di chiudere, fai 15 catenelle e fissale con mbss: è l\'anellino.', '15 cat + mbss per l\'anello.'),
      P('Oppure infila un nastrino con l\'ago e annodalo.', 'In alternativa: nastrino.')],
    consigli: 'Una goccia di colla vinilica diluita sull\'esterno rende la pallina più rigida.' },

  { id: 'zucca', cat: 'feste', titolo: 'Zucchetta di Halloween', emoji: '🎃', livello: 2, tempo: '1 ora e mezza', misure: 'circa 7 cm',
    materiale: ['Cotone arancione, un po\' di verde e marrone', 'Uncinetto 3 mm', 'Imbottitura', 'Ago lungo'],
    intro: 'Una pallina schiacciata, con gli spicchi segnati da un filo.',
    diagramma: () => diagrammaTondo(giriCerchioMb(6)),
    passi: [
      P('Lavora come la pallina base ma fino al giro 6 (36), poi giri 7-11 a 36 mb.', 'G1-6 fino a 36; G7-11: 36 mb.'),
      P('Giri 12-16: diminuisci (30, 24, 18, 12, 6), imbottendo poco: la zucca deve restare morbida. Chiudi lasciando un filo lungo.', 'G12-16 dim fino a 6, imbottisci poco.'),
      P('Spicchi: con l\'ago passa il filo dal fondo alla cima, avvolgilo sull\'esterno e ripassa dal centro. Tira un poco. Fallo 6 volte intorno.', '6 giri di filo dal centro per gli spicchi.'),
      P('Picciolo: con il marrone cerchio magico con 5 mb, 3 giri di 5 mb. Cucilo in cima. Aggiungi una foglia verde.', 'Picciolo 5 mb ×4 giri; foglia.')],
    consigli: 'Fanne tre di misure diverse (fermando gli aumenti a 30, 36 e 42 maglie) per una bella composizione.' },
];
