import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0f',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// Build native menu
function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo Projeto',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:new-project'),
        },
        {
          label: 'Abrir Projeto',
          accelerator: 'CmdOrCtrl+O',
          click: () => handleOpenProject(),
        },
        {
          label: 'Salvar Projeto',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu:save-project'),
        },
        {
          label: 'Salvar Como...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => handleSaveProjectAs(),
        },
        { type: 'separator' },
        {
          label: 'Exportar STL',
          click: () => mainWindow.webContents.send('menu:export-stl'),
        },
        { type: 'separator' },
        { label: 'Sair', role: 'quit' },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Copiar', role: 'copy' },
        { label: 'Colar', role: 'paste' },
      ],
    },
    {
      label: 'Visualizar',
      submenu: [
        {
          label: 'Tela Cheia',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
        { label: 'DevTools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' },
        { label: 'Reset Zoom', role: 'resetZoom' },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre ARCHON',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'ARCHON',
              message: 'ARCHON - AI Engineering Platform',
              detail: 'Transforme ideias em projetos reais.\nVersão 1.0.0',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
async function handleOpenProject() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Abrir Projeto ARCHON',
    filters: [{ name: 'ARCHON Project', extensions: ['archon'] }],
    properties: ['openFile'],
  });

  if (!canceled && filePaths.length > 0) {
    try {
      const data = fs.readFileSync(filePaths[0], 'utf-8');
      mainWindow.webContents.send('project:loaded', JSON.parse(data));
    } catch (err) {
      dialog.showErrorBox('Erro', 'Falha ao abrir o projeto.');
    }
  }
}

async function handleSaveProjectAs() {
  mainWindow.webContents.send('menu:save-project-as');
}

ipcMain.handle('window:minimize', () => mainWindow.minimize());
ipcMain.handle('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.handle('window:close', () => mainWindow.close());
ipcMain.handle('window:isMaximized', () => mainWindow.isMaximized());

ipcMain.handle('dialog:save', async (event, projectData) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Salvar Projeto ARCHON',
    defaultPath: 'projeto.archon',
    filters: [{ name: 'ARCHON Project', extensions: ['archon'] }],
  });

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2));
    return filePath;
  }
  return null;
});

ipcMain.handle('dialog:open', async () => {
  await handleOpenProject();
});

app.whenReady().then(() => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
