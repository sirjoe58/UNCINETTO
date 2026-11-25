/* "Trova online": siti con schemi gratuiti, divisi per categoria.
   Gli schemi restano sui siti dei loro autori: l'app apre la pagina nel browser. */
const LINK_ONLINE = [
  { cat: 'Per imparare (video in italiano)', emoji: '🎬', link: [
    { nome: 'YouTube – uncinetto per principianti', url: 'https://www.youtube.com/results?search_query=uncinetto+per+principianti', nota: 'Video passo passo dei punti base' },
    { nome: 'YouTube – cerchio magico', url: 'https://www.youtube.com/results?search_query=cerchio+magico+uncinetto', nota: 'Il punto di partenza degli amigurumi' },
    { nome: 'YouTube – granny square tutorial', url: 'https://www.youtube.com/results?search_query=granny+square+uncinetto+tutorial', nota: 'La mattonella classica spiegata a video' },
  ] },
  { cat: 'Grandi raccolte (tutte le categorie)', emoji: '📚', link: [
    { nome: 'Ravelry – schemi gratuiti a uncinetto', url: 'https://www.ravelry.com/patterns/search#craft=crochet&availability=free', nota: 'Il più grande archivio al mondo; serve un account gratuito. In inglese' },
    { nome: 'Mani di Fata', url: 'https://www.manidifata.it/', nota: 'Rivista e negozio italiano con schemi e tutorial' },
    { nome: 'Craft Passion – schemi uncinetto', url: 'https://www.craftpassion.com/crochet-knit/crochet-patterns/', nota: 'Molti schemi gratuiti con foto. In inglese' },
  ] },
  { cat: 'Amigurumi', emoji: '🐣', link: [
    { nome: 'Punqa – amigurumi gratis', url: 'https://punqa.com/', nota: 'Animali, personaggi e feste, divisi per livello. In inglese' },
    { nome: 'Love.Life.Yarn – amigurumi', url: 'https://lovelifeyarn.com/amigurumi-patterns/', nota: 'Una raccolta di pupazzetti gratuiti. In inglese' },
    { nome: 'Gathered – amigurumi', url: 'https://www.gathered.how/knitting-and-crochet/crochet/amigurumi-crochet-patterns', nota: 'Selezione di schemi, molti gratuiti. In inglese' },
  ] },
  { cat: 'Granny square e coperte', emoji: '🟪', link: [
    { nome: 'Gathered – oltre 30 granny square gratis', url: 'https://www.gathered.how/knitting-and-crochet/crochet/free-granny-square-patterns', nota: 'Dalla classica alle varianti più fantasiose. In inglese' },
    { nome: 'Look At What I Made – mattonelle', url: 'https://lookatwhatimade.net/crafts/yarn/crochet/free-crochet-patterns', nota: 'Tantissime mattonelle piccole, medie e grandi. In inglese' },
  ] },
  { cat: 'Da indossare, borse e casa', emoji: '🧣', link: [
    { nome: 'Ravelry – sciarpe gratis', url: 'https://www.ravelry.com/patterns/search#craft=crochet&availability=free&pc=scarf', nota: 'Filtra per filato e difficoltà' },
    { nome: 'Ravelry – borse gratis', url: 'https://www.ravelry.com/patterns/search#craft=crochet&availability=free&pc=bag', nota: 'Shopper, pochette, zaini' },
    { nome: 'Ravelry – cuffie gratis', url: 'https://www.ravelry.com/patterns/search#craft=crochet&availability=free&pc=hat', nota: 'Per adulti e bambini' },
  ] },
];
