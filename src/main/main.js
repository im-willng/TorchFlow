const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const PythonBridge = require('./pythonBridge');

let mainWindow;
let pythonBridge;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();

        // Log any console errors
        mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
            console.log(`[Renderer] ${message}`);
        });
    }

    mainWindow.on('closed', () => {
        if (pythonBridge) {
            pythonBridge.stop();
        }
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    // Initialize Python bridge
    pythonBridge = new PythonBridge();
    pythonBridge.start();

    // Forward Python events to renderer
    pythonBridge.on('event', (data) => {
        if (mainWindow) {
            mainWindow.webContents.send('python-event', data);
        }
    });

    pythonBridge.on('error', (error) => {
        if (mainWindow) {
            mainWindow.webContents.send('python-error', error);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers
ipcMain.on('python-command', (event, command) => {
    if (pythonBridge) {
        pythonBridge.sendCommand(command);
    }
});

ipcMain.on('stop-training', () => {
    if (pythonBridge) {
        pythonBridge.stop();
        pythonBridge.start();
    }
});
