const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { Menu } = require('electron');
const { stderr } = require('process');

const terminal = '/bin/bash';
let mainWindow;
// Menu.setApplicationMenu(null);
app.setName('Pipe');


function withoutServer() {
  mainWindow = new BrowserWindow({ width: 1200, height: 680 });
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : url.format({ pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true }));
  mainWindow.on('closed', () => mainWindow = null);
}

function flaskServer() {
  var subpy = isDev ? require('child_process').spawn(path.join(__dirname, 'server'), { shell: terminal }) : require('child_process').spawn(path.join(app.getAppPath(), '/build', '/server/server'))
  // var rq = require('request-promise');
  // var mainAddr = 'http://localhost:5000/';

  subpy.stdout.on('data', (data) => {
    console.log(`Received chunk ${data}`);
  });

  subpy.on('error', function (err) {
    subpy.kill('SIGINT');
  });

  var openWindow = function () {
    mainWindow = new BrowserWindow({ width: 1200, height: 800, title: "Pipe", });

    mainWindow.setMenu(null)

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : url.format({ pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true }));
    isDev && mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
      mainWindow = null;
      subpy.kill('SIGINT');
      const { exec } = require('child_process');
      exec('taskill /f /t /im server',(err,stdout,stderr) => {
        if(err){
          console.log(err);
          return;
        }
      })

    });
  }
 
  openWindow();
};


app.on('ready', isDev ? withoutServer : flaskServer);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', () => {
  if (mainWindow === null) {
    isDev ? withoutServer() : flaskServer()
  }
});
