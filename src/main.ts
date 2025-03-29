import { app, BrowserWindow, session } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { BerkeliumIPCHandlers } from "./modules/ipcHandlers";
import { existsSync, mkdirSync } from "node:fs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      /* sandbox: true, */
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // open maximized
  mainWindow.maximize();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // Define a custom Content Security Policy to only allow loading resources from the app's origin.
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Cross-Origin-Embedder-Policy': ['require-corp'],
        'Cross-Origin-Opener-Policy': ['same-origin']
      }
    });
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Directory for model storage
const USER_DATA_PATH = path.join(app.getPath('userData'), 'models');

// Create model directory if it doesn't exist
if (!existsSync(USER_DATA_PATH)) {
  mkdirSync(USER_DATA_PATH, { recursive: true });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const ipcHandlers = new BerkeliumIPCHandlers(USER_DATA_PATH);
ipcHandlers.init();