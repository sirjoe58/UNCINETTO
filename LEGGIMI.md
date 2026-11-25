# SirJoe Uncinetto – per Windows e Android

App per l'uncinetto: contatori di giri e maglie, schemi divisi per categorie con disegno a simboli e spiegazioni
(semplici o per esperti), libreria dei punti, progetti con foto e note, editor di schemi a griglia, calcolatori,
link a siti di schemi gratuiti, sincronizzazione tramite NAS.

## Scaricare
Pagina **Releases** del repository:
- `SirJoeUncinetto-Setup-x.y.z.exe` → Windows con installazione
- `SirJoeUncinetto-Portatile-x.y.z.exe` → Windows senza installazione
- `SirJoeUncinetto-Android.apk` → telefono/tablet Android

Ogni modifica caricata su GitHub crea una nuova Release; restano solo **le ultime 2**.

## Installare
- **Windows**: se compare "Windows ha protetto il PC" → *Ulteriori informazioni* → *Esegui comunque*.
- **Android**: apri l'APK e consenti "Installa app sconosciute".

## Sincronizzazione con il NAS
- **Windows**: Impostazioni → *Scegli cartella NAS* (es. `\\192.168.1.198\FRITZ.NAS\Uncinetto`).
- **Android**: Impostazioni → *Concedi accesso ai file*. L'app salva nella cartella **/SirJoeUncinetto** del telefono.
  In **FolderSync** crea una coppia di cartelle **bidirezionale** tra `/SirJoeUncinetto` e la stessa cartella del NAS usata dal PC.
- Tutto resta salvato anche sul dispositivo; quando il NAS torna raggiungibile le modifiche si uniscono (vince la più recente).

## Firma dell'APK (una volta sola)
Perché gli aggiornamenti Android si installino sopra la versione precedente, l'APK va firmato sempre con la stessa chiave.
Nel repository: *Settings → Secrets and variables → Actions → New repository secret*:
- `ANDROID_KEYSTORE_BASE64` = contenuto del file `ANDROID_KEYSTORE_BASE64.txt`
- `ANDROID_KEYSTORE_PASSWORD` = la password della chiave
Senza questi segreti l'APK viene firmato con una chiave di prova diversa ogni volta.

## Provare sul PC senza installare
Apri `www/index.html` con Chrome o Edge (i dati restano solo nel browser, senza NAS).

## Schemi
Gli schemi dell'app sono originali, scritti per SirJoe Uncinetto. La sezione "Trova online" apre i siti
dei rispettivi autori: i loro schemi non sono copiati nell'app.
