// SirJoe Uncinetto - avvio per Windows (Electron)
const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const cartellaUtente = () => app.getPath('userData');
const fileConfig = () => path.join(cartellaUtente(), 'config.json');
const fileLocale = () => path.join(cartellaUtente(), 'uncinetto-dati.json');

function leggiConfig() { try { return JSON.parse(fs.readFileSync(fileConfig(), 'utf8')); } catch (e) { return {}; } }
function scriviConfig(c) { fs.mkdirSync(cartellaUtente(), { recursive: true }); fs.writeFileSync(fileConfig(), JSON.stringify(c, null, 1)); }

// scrittura sicura: prima un file temporaneo, poi lo rinomina (evita file a metà se cade la rete)
function scriviSicuro(file, testo) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, testo, 'utf8');
  fs.renameSync(tmp, file);
}

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200, height: 860, minWidth: 420, minHeight: 600,
    title: 'SirJoe Uncinetto',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    backgroundColor: '#fbf6f0',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js'), spellcheck: false },
  });
  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
}

ipcMain.handle('leggiLocale', () => { try { return fs.readFileSync(fileLocale(), 'utf8'); } catch (e) { return null; } });
ipcMain.handle('scriviLocale', (e, testo) => { fs.mkdirSync(cartellaUtente(), { recursive: true }); scriviSicuro(fileLocale(), testo); return true; });
ipcMain.handle('getCartellaNAS', () => leggiConfig().nas || '');
ipcMain.handle('impostaCartellaNAS', (e, c) => { const cfg = leggiConfig(); cfg.nas = c; scriviConfig(cfg); return true; });
ipcMain.handle('scegliCartellaNAS', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Scegli la cartella del NAS per SirJoe Uncinetto', properties: ['openDirectory', 'createDirectory'],
    defaultPath: leggiConfig().nas || '\\\\192.168.1.198\\' });
  if (r.canceled || !r.filePaths[0]) return '';
  const cfg = leggiConfig(); cfg.nas = r.filePaths[0]; scriviConfig(cfg); return cfg.nas;
});
ipcMain.handle('leggiNAS', (e, nome) => {
  const c = leggiConfig().nas; if (!c) return null;
  if (!fs.existsSync(c)) throw new Error('Cartella NAS non raggiungibile');
  const f = path.join(c, path.basename(nome));
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
});
ipcMain.handle('scriviNAS', (e, nome, testo) => {
  const c = leggiConfig().nas; if (!c) return false;
  scriviSicuro(path.join(c, path.basename(nome)), testo); return true;
});
ipcMain.handle('salvaFile', async (e, nome, testo) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: path.join(app.getPath('documents'), nome), filters: [{ name: 'Copia SirJoe Uncinetto', extensions: ['json'] }] });
  if (r.canceled || !r.filePath) return false;
  fs.writeFileSync(r.filePath, testo, 'utf8'); return true;
});

Menu.setApplicationMenu(null);
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => app.quit());
