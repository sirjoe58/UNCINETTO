/* Uncinetto Hub: raccolta di siti con schemi gratuiti da scaricare e stampare */
const HUB_RISORSE = [
  { id: 1, titolo: 'DROPS Design (Home Italia)', categoria: 'Portali principali', url: 'https://www.garnstudio.com/home.php?cid=4', formato: 'PDF / Diagrammi', livello: 'Tutti', lingua: 'IT', registrazione: false },
  { id: 2, titolo: 'DROPS Design (Ricerca modelli)', categoria: 'Portali principali', url: 'https://www.garnstudio.com/search.php?lang=it', formato: 'PDF / Diagrammi', livello: 'Tutti', lingua: 'IT', registrazione: false },
  { id: 3, titolo: 'Hobbii (Schemi gratuiti)', categoria: 'Portali principali', url: 'https://hobbii.it/collections/free-patterns', formato: 'PDF / Diagrammi', livello: 'Tutti', lingua: 'IT', registrazione: false },
  { id: 4, titolo: 'Hobbii (Schemi uncinetto e maglia)', categoria: 'Portali principali', url: 'https://hobbii.it/collections/free-patterns-crochet-knitting', formato: 'PDF / Diagrammi', livello: 'Tutti', lingua: 'IT', registrazione: false },
  { id: 5, titolo: 'Gomitolo.com (Modelli gratuiti)', categoria: 'Portali principali', url: 'https://gomitolo.com/collections/modelli-gratuiti', formato: 'PDF / Diagrammi', livello: 'Tutti', lingua: 'IT', registrazione: false },
  { id: 6, titolo: 'DMC (Schemi gratuiti uncinetto)', categoria: 'Portali principali', url: 'https://www.dmc.com/IT/it/patterns/free-patterns-by-craft/crochet', formato: 'Grafico', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 7, titolo: 'Tessiland (Tutorial e schemi gratis)', categoria: 'Portali principali', url: 'https://www.tessiland.com/it/blog/categoria/tutorial-e-schemi-gratis', formato: 'Tutorial / Blog', livello: 'Tutti', lingua: 'IT', registrazione: false },
  { id: 8, titolo: 'Ravelry (Database internazionale)', categoria: 'Portali principali', url: 'https://www.ravelry.com/', formato: 'PDF / Diagrammi', livello: 'Tutti', lingua: 'Multilingua', registrazione: true },
  { id: 9, titolo: 'DROPS Design (Borse)', categoria: 'Borse', url: 'https://www.garnstudio.com/search.php?c=bags&lang=it', formato: 'PDF / Diagrammi', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 10, titolo: 'Gomitolo.com (Borse gratuite)', categoria: 'Borse', url: 'https://gomitolo.com/collections/borse-gratuite', formato: 'PDF / Diagrammi', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 11, titolo: 'DROPS Design (Abbigliamento donna)', categoria: 'Abbigliamento', url: 'https://www.garnstudio.com/search.php?action=browse&c=women&mt=2&lang=it', formato: 'PDF / Diagrammi', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 12, titolo: 'Ophelia Italy (Modelli uncinetto)', categoria: 'Abbigliamento', url: 'https://www.opheliaitaly.com/it/852-uncinetto', formato: 'PDF / Diagrammi', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 13, titolo: 'Magie di Filo (Centri e centrini)', categoria: 'Centrini', url: 'https://www.magiedifilo.it/gallery/index.php/schemi-uncinetto/centri-e-centrini-uncinetto', formato: 'Grafico', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 14, titolo: 'Maglieria e Uncinetto (Modelli centrini)', categoria: 'Centrini', url: 'https://maglieriaeuncinetto.altervista.org/modelli-di-centrini-alluncinetto/', formato: 'Grafico', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 15, titolo: 'DROPS Design (Coperte)', categoria: 'Coperte', url: 'https://www.garnstudio.com/search.php?c=blankets&lang=it', formato: 'PDF / Diagrammi', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 16, titolo: 'Verde Smeraldo (Schemi mattonelle)', categoria: 'Coperte', url: 'https://www.verdesmeraldo.it/2022/08/18/schemi-mattonelle/', formato: 'Grafico', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 17, titolo: 'Punqa (Amigurumi gratis)', categoria: 'Amigurumi', url: 'https://punqa.com/', formato: 'Tutorial / Blog', livello: 'Tutti', lingua: 'EN', registrazione: false },
  { id: 18, titolo: 'Hobbii – Frida la Pecora (PDF)', categoria: 'Amigurumi', url: 'https://hobbii.it/product/pattern/download?id=1004728', formato: 'PDF / Diagrammi', livello: 'Intermedio', lingua: 'IT', registrazione: false },
  { id: 19, titolo: 'Hobbii – Cerchietto Lisbeth (PDF)', categoria: 'Accessori', url: 'https://hobbii.it/product/pattern/download?id=1006945', formato: 'PDF / Diagrammi', livello: 'Principiante', lingua: 'IT', registrazione: false },
  { id: 20, titolo: 'Hobbii – Sciarpa con cappuccio "Cat" (PDF)', categoria: 'Accessori', url: 'https://hobbii.it/product/pattern/download?id=1005387', formato: 'PDF / Diagrammi', livello: 'Principiante', lingua: 'IT', registrazione: false },
  { id: 21, titolo: 'Hobbii – Sole, decorazione (PDF)', categoria: 'Casa', url: 'https://hobbii.it/product/pattern/download?id=1006376', formato: 'PDF / Diagrammi', livello: 'Principiante', lingua: 'IT', registrazione: false },
];
const HUB_CATEGORIE = ['Portali principali', 'Borse', 'Abbigliamento', 'Centrini', 'Coperte', 'Amigurumi', 'Accessori', 'Casa'];
const HUB_FORMATI = ['PDF / Diagrammi', 'Grafico', 'Tutorial / Blog', 'Video + Schema'];
const HUB_LIVELLI = ['Tutti', 'Principiante', 'Intermedio', 'Esperto'];
const HUB_LINGUE = ['IT', 'EN', 'Multilingua'];
