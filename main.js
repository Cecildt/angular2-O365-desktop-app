'use strict';

const electron = require('electron');
const app = electron.app;

const restify = require('restify');
const url = require('url');

require('electron-debug')({showDevTools: true});

// browser-window creates a native window
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
let hash = "";

// Allows for live-reload while developing the app
require('electron-reload')(__dirname + '/build');

function createWindow() {
  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.maximize();
  // Tell Electron where to load the entry point from
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Clear out the main window when the app is closed
  mainWindow.on('closed', function () {

    mainWindow = null;

  });
  
   mainWindow.webContents.on("did-get-redirect-request", (event, oldUrl, newUrl) => {
    let tokenURL = url.parse(newUrl);
    hash = tokenURL.hash;
    
    console.log("Hash: " + hash);        
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Start Restify API Server 
let port = process.env.PORT || 3000;
var server = restify.createServer({ name: 'electron-backend', version: '0.0.1' });

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/info', (req, res, next) => {
  console.log('info called.');

  res.send({
    nodeVersion: process.versions.node,
    chromeVersion: process.versions.chrome,
    electronVersion: process.versions.electron
  });
});

server.get('/auth/azureoauth/callback', (req, res, next) => { 
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  
  let code = "localStorage.setItem('loginHash', '" + hash + "');"
  mainWindow.webContents.executeJavaScript(code);
});

server.listen(port, () => {
  console.log('server running on port ' + port);
});
