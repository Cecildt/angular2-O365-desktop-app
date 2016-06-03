'use strict';

const electron = require('electron');
const app = electron.app;

const restify = require('restify');
const url = require('url');
const crypto = require('crypto');
const AuthenticationContext = require('adal-node').AuthenticationContext;
const adalConfig = require("./src/adal/adal-config");

require('electron-debug')({ showDevTools: true });

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

// ADAL Settings
let authToken = '';
let authorityUrl = adalConfig.authorityHostUrl + '/' + adalConfig.tenant;
let templateAuthzUrl = 'https://login.windows.net/' + adalConfig.tenant + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>';
let tenantID = '';
let accessToken = '';
let refreshToken = '';
let user = {
  userID: '',
  lastName: '',
  firstName: '',
  fullName: ''
}

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

server.get('/auth', (req, res, next) => {
  console.log("Authenticate attempt!")
  clearStorage();

  crypto.randomBytes(48, function (ex, buf) {
    var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

    this.authToken = token;
    //res.cookie('authstate', token);
    var authorizationUrl = createAuthorizationUrl(token);

    console.log("Auth URL: " + authorizationUrl);
    //res.redirect(authorizationUrl);
    mainWindow.loadURL(authorizationUrl);
  });
});


server.get('/auth/azureoauth/callback', (req, res, next) => {
  // TODO: Need to investigate query state fix - low priority
  // if (this.authToken !== req.query.state) {
  //   console.log('error: state does not match');
  //   res.send('error: state does not match');
  // }
  
  clearStorage();

  var authenticationContext = new AuthenticationContext(authorityUrl);
  authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, adalConfig.redirectUri, adalConfig.resource, adalConfig.clientId, adalConfig.clientSecret, function (err, response) {
    var message = '';
    if (err) {
      message = 'error: ' + err.message + '\n';
      logError(message);
      return;
    }

    accessToken = response.accessToken;
    refreshToken = response.refreshToken;
    tenantID = response.tenantId;
    user.userID = response.userId;
    user.lastName = response.familyName;
    user.firstName = response.firstName;
    user.fullName = response.firstName + ' ' + response.familyName;

    // console.log("User: " + JSON.stringify(user));
    // console.log("Access Token: " + response.accessToken);
    // console.log("Refresh Token:" + response.refreshToken);

    saveTokens();
    saveUser();

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Later, if the access token is expired it can be refreshed.
    authenticationContext.acquireTokenWithRefreshToken(response.refreshToken, adalConfig.clientId, adalConfig.clientSecret, adalConfig.resource, function (refreshErr, refreshResponse) {
      if (refreshErr) {
        message += 'refreshError: ' + refreshErr.message + '\n';
        logError(message);
      }

      accessToken = response.accessToken;
      refreshToken = response.refreshToken;
      tenantID = response.tenantId;
      user.userID = response.userId;
      user.lastName = response.familyName;
      user.firstName = response.firstName;
      user.fullName = response.firstName + ' ' + response.familyName;

      saveTokens();
      saveUser();
    });
  });
});

server.listen(port, () => {
  console.log('server running on port ' + port);
});


function createAuthorizationUrl(state) {
  var authorizationUrl = templateAuthzUrl.replace('<client_id>', adalConfig.clientId);
  authorizationUrl = authorizationUrl.replace('<redirect_uri>', adalConfig.redirectUri);
  authorizationUrl = authorizationUrl.replace('<state>', state);
  authorizationUrl = authorizationUrl.replace('<resource>', adalConfig.resource);
  return authorizationUrl;
}

function logError(message) {
  let code = "localStorage.setItem('error', '" + message + "');";
  mainWindow.webContents.executeJavaScript(code);
}

function saveTokens() {
  let code = "localStorage.setItem('accessToken', '" + accessToken + "');";
  mainWindow.webContents.executeJavaScript(code);
}

function saveUser() {
  let code = "localStorage.setItem('user', '" + JSON.stringify(user) + "');";
  mainWindow.webContents.executeJavaScript(code);
}

function clearStorage(){
  let code = "localStorage.clear()";
  mainWindow.webContents.executeJavaScript(code);
}
