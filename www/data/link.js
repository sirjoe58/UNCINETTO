/* "Trova online": siti e social con schemi gratuiti, divisi per categoria.
   pdf: true = lo schema è (anche) un file PDF gratuito da scaricare e stampare.
   social: parole da cercare su Pinterest, Instagram, YouTube, Facebook e TikTok.
   Gli schemi restano sui siti dei loro autori: l'app apre la pagina nel browser. */
const LINK_ONLINE = [
  { cat: 'Coperte', emoji: '🛏️', social: 'coperta uncinetto schema gratis', link: [
    { nome: 'DROPS Design – modelli gratuiti in italiano', url: 'https://www.garnstudio.com/catalogues.php?lang=it', nota: 'Centinaia di modelli gratis tradotti in italiano, con sezione Coperte; ogni modello si stampa dal sito' },
    { nome: 'DROPS – coperta di 6 quadrati', url: 'https://www.garnstudio.com/pattern.php?cid=4&id=10765', nota: 'Quadrati cuciti insieme e bordo tutto intorno. In italiano', pdf: true },
    { nome: 'Hobbii – coperta C2C (angolo ad angolo)', url: 'https://hobbii.it/product/pattern/download?id=1001243', nota: 'PDF in italiano, circa 170×130 cm', pdf: true },
    { nome: 'NostroFiglio – copertina bianca e dorata', url: 'https://www.nostrofiglio.it/corredino-a-maglia-e-uncinetto/Schema_copertina_bianca_e_dorata.html', nota: 'Copertina per neonato a quadrati, in italiano' },
  ] },
  { cat: 'Borse', emoji: '👜', social: 'borsa uncinetto schema gratis', link: [
    { nome: 'NostroFiglio – 3 borse estive gratis', url: 'https://www.nostrofiglio.it/famiglia/borse-uncinetto-estive-3-modelli-gratis', nota: 'Tote bag, borsa da spiaggia e tracolla (schemi originali in inglese)' },
    { nome: 'NostroFiglio – borsa cocomero', url: 'https://www.nostrofiglio.it/famiglia/borsa-cocomero-uncinetto-schema-facile', nota: 'Schema facile giro per giro, in italiano' },
    { nome: 'Hobbii – borsa Unicorn', url: 'https://hobbii.it/product/pattern/download?id=1007655', nota: 'PDF in italiano', pdf: true },
    { nome: 'CrazyPatterns – borse gratis in PDF', url: 'https://www.crazypatterns.net/en/free-crochet-bag-patterns', nota: 'Raccolta di schemi di borse da scaricare. In inglese', pdf: true },
    { nome: 'Jo to the World – tote bag facile', url: 'https://jototheworld.com/crochet-tote-bag', nota: 'Borsa robusta e veloce. In inglese' },
    { nome: 'Yarnspirations – borsa Bernat', url: 'https://www.yarnspirations.com/en-ca/products/bernat-bag', nota: 'Download gratuito senza registrazione. In inglese', pdf: true },
  ] },
  { cat: 'Sciarpe', emoji: '🧣', social: 'sciarpa uncinetto schema gratis', link: [
    { nome: 'Hobbii – sciarpa con cappuccio "Cat"', url: 'https://hobbii.it/product/pattern/download?id=1005387', nota: 'PDF in italiano', pdf: true },
    { nome: 'Jo to the World – oltre 75 sciarpe gratis', url: 'https://jototheworld.com/crochet-scarf-patterns', nota: 'Dalle più semplici alle più moderne. In inglese' },
    { nome: 'Make & Do Crew – sciarpe per principianti', url: 'https://makeanddocrew.com/crochet-scarf-patterns/', nota: 'Divise per stile e livello. In inglese' },
    { nome: 'CrazyPatterns – sciarpe in PDF', url: 'https://www.crazypatterns.net/en/free-crochet-scarf-patterns', nota: 'Sciarpe, scaldacollo e stole da scaricare. In inglese', pdf: true },
    { nome: 'LoveCrafts – sciarpe gratis', url: 'https://www.lovecrafts.com/en-gb/l/crochet/crochet-patterns/free-crochet-patterns/free-scarves-crochet-patterns', nota: 'Oltre 500 schemi in PDF scaricabile. In inglese', pdf: true },
    { nome: 'Jimmy Beans – sciarpa campionario', url: 'https://jimmybeanswool.com/pages/learn-to-crochet-sampler-scarf-free-pattern', nota: 'Per imparare tanti punti; PDF stampabile. In inglese', pdf: true },
  ] },
  { cat: 'Cappellini', emoji: '🧢', social: 'cappello uncinetto schema gratis', link: [
    { nome: 'Hobbii – cappello Dimitri', url: 'https://hobbii.it/product/pattern/download?id=1007135', nota: 'PDF in italiano', pdf: true },
    { nome: 'NostroFiglio – cappellino da bimba', url: 'https://www.nostrofiglio.it/famiglia/lavoretti/cappellino-da-bimba-rosa-e-bianco', nota: 'Schema in italiano' },
    { nome: 'Ravelry – cappello per principianti assoluti', url: 'https://www.ravelry.com/patterns/library/hat-for-absolute-beginners', nota: 'Gratis, con PDF stampabile e video. In inglese', pdf: true },
    { nome: 'Oombawka – 15 cappelli facili', url: 'https://oombawkadesigncrochet.com/15-great-free-crochet-hat-patterns-for-beginners/', nota: 'Tutte le taglie. In inglese' },
    { nome: 'AllFreeCrochet – 60 cappelli facili', url: 'https://allfreecrochet.com/Hats/24-Beginner-Crochet-Hat-Patterns', nota: 'Con video per principianti. In inglese' },
    { nome: 'Yarnspirations – berretto Caron', url: 'https://www.yarnspirations.com/products/caron-beginner-beanie', nota: 'Download gratuito senza registrazione. In inglese', pdf: true },
  ] },
  { cat: 'Costumi da bagno', emoji: '👙', social: 'bikini uncinetto schema', link: [
    { nome: 'DROPS – bikini a uncinetto (R-487)', url: 'https://www.garnstudio.com/pattern.php?cid=4&id=3657', nota: 'Modello gratuito in italiano, taglie S-M-L', pdf: true },
    { nome: 'DROPS – bikini in cotone (R-610)', url: 'https://www.garnstudio.com/pattern.php?cid=17&id=5491', nota: 'Taglie dalla XS alla XXXL. In inglese (sul sito puoi passare all\'italiano)', pdf: true },
    { nome: '10 bikini gratis (Nicki\'s Homemade Crafts)', url: 'https://www.nickishomemadecrafts.com/crochet-bikini-swimwear-patterns/', nota: 'Raccolta con video tutorial. In inglese' },
    { nome: 'Sassy Summer Bikini', url: 'https://www.allfreecrochet.com/Seasonal-Crochet/How-to-Crochet-The-Sassy-Summer-Bikini-Crochet-Pattern', nota: 'A vita alta, con video completo. In inglese' },
    { nome: 'Yarnspirations – bikini Patons', url: 'https://www.yarnspirations.com/products/patons-bikini', nota: 'Facile, in cotone. In inglese', pdf: true },
    { nome: 'Ravelry – bikini "Nora"', url: 'https://www.ravelry.com/patterns/library/nora-bikini', nota: 'Disponibile anche una versione gratuita. In inglese' },
  ] },
  { cat: 'Grandi raccolte (tutte le categorie)', emoji: '📚', social: 'schemi uncinetto gratis', link: [
    { nome: 'DROPS Design (Garnstudio) in italiano', url: 'https://www.garnstudio.com/catalogues.php?lang=it', nota: 'Il più grande archivio di modelli gratuiti tradotti in italiano' },
    { nome: 'Hobbii – blog e modelli gratuiti', url: 'https://hobbii.it/blog/category/meet-the-designer', nota: 'Modelli gratuiti in italiano di designer anche italiani' },
    { nome: 'Ravelry – schemi gratuiti', url: 'https://www.ravelry.com/patterns/search#craft=crochet&availability=free', nota: 'Il più grande archivio al mondo; account gratuito. In inglese' },
    { nome: 'Mani di Fata', url: 'https://www.manidifata.it/', nota: 'Rivista e negozio italiano con schemi e tutorial' },
    { nome: 'Punqa – amigurumi gratis', url: 'https://punqa.com/', nota: 'Animali, personaggi e feste. In inglese' },
    { nome: 'Gathered – granny square gratis', url: 'https://www.gathered.how/knitting-and-crochet/crochet/free-granny-square-patterns', nota: 'Oltre 30 mattonelle. In inglese' },
  ] },
];

/* Ricerche già pronte sui social (si aprono nel browser o nell'app del social) */
const SOCIAL = [
  { nome: 'Pinterest', emoji: '📌', url: q => 'https://www.pinterest.it/search/pins/?q=' + encodeURIComponent(q) },
  { nome: 'YouTube', emoji: '▶️', url: q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' tutorial') },
  { nome: 'Instagram', emoji: '📷', url: q => 'https://www.instagram.com/explore/tags/' + encodeURIComponent(q.split(' ').slice(0, 2).join('')) + '/' },
  { nome: 'Facebook (gruppi)', emoji: '👥', url: q => 'https://www.facebook.com/search/groups/?q=' + encodeURIComponent(q) },
  { nome: 'TikTok', emoji: '🎵', url: q => 'https://www.tiktok.com/search?q=' + encodeURIComponent(q) },
];
