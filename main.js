const electron = require('electron');
const app = electron.app;
const ipc = require('electron').ipcMain
const crashReporter = electron.crashReporter;
const parse = require('url-parse');

// const restify = require('restify');
const remote = require('electron').remote;

// crashReporter.start({
//   productName: 'angular2-O365-desktop-app',
//   companyName: 'Open Code',
//   submitUrl: 'http://localhost:3000/crashes',
//   autoSubmit: true
// });

// browser-window creates a native window
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
let accessToken = null;

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

  // Tell Electron where to load the entry point from
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Clear out the main window when the app is closed
  mainWindow.on('closed', function () {

    mainWindow = null;

  });

  mainWindow.webContents.on("did-get-redirect-request", (event, oldUrl, newUrl) => {
    let tokenURL = parse(newUrl, true);
    let params = parseQueryString(tokenURL.hash);
    if (params.id_token != null) {
      console.log("Token: " + params.id_token);
      accessToken = params.id_token;      
    }
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



// Internal REST API functions 

// function parseQueryString(url) {
//   let params = {}, queryString = url.substring(1),
//     regex = /([^&=]+)=([^&]*)/g, m;

//   while (m = regex.exec(queryString)) {
//     params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
//   }

//   return params;
// }

// // Start Restify API Server 
// let port = process.env.PORT || 3000;
// var server = restify.createServer({ name: 'electron-backend', version: '0.0.1' });

// server.use(restify.queryParser());
// server.use(restify.bodyParser());

// server.post('/crashes', (req, res, next) => {
//   console.log(req.body);
//   res.send(200);
// });

// server.get('/echo', (req, res, next) => {
//   console.log('echo called.');
//   res.send('Echo hello!');
// });

// server.get('/info', (req, res, next) => {
//   console.log('info called.');

//   res.send({
//     nodeVersion: process.versions.node,
//     chromeVersion: process.versions.chrome,
//     electronVersion: process.versions.electron
//   });
// });

// server.get('/token', (req, res, next) => {
//   res.send(accessToken || "");
// });

// server.get('/logout', (req, res, next) => {
//   req.logout();
//   res.redirect('/');
// });

// server.get('/auth/azureoauth/callback', (req, res, next) => {
//   mainWindow.loadURL('file://' + __dirname + '/index.html');
// });

// server.listen(port, () => {
//   console.log('server running on port ' + port);
// });
