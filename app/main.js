const electron = require('electron');
const app = electron.app;
const ipc = require('electron').ipcMain
 const crashReporter = electron.crashReporter;


// crashReporter.start({
//   productName: 'angular2-O365-desktop-app',
//   companyName: 'Open Code',
//   submitUrl: 'http://localhost:3000/crashes',
//   autoSubmit: true
// });

// browser-window creates a native window
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

function createWindow() {
  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({ 
    width: 1200, 
    height: 900 
  });

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
    createWindow()
  }
});


ipc.on('login-event', function (event, arg) {
  event.returnValue = 'pong'
})
