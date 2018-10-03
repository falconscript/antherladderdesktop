"use strict";

/**
 * This is a work in progress 
 * standalone app WITH proxied (through electron) UDP sockets
 * for lower latency P2P communication for players
 */

const ANTHERSDESKTOP_VERSION = 1.0;
const process = require("process");
const electron = require('electron');
const path = require("path");
const { app, BrowserWindow, ipcMain } = electron;


let win = null;

// Launch browser tab window
app.on('ready', () => {
  win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      // load this file every time a page is loaded
      // https://stackoverflow.com/questions/46562192/electron-execute-javascript-as-very-first-thing-on-a-page
      preload: path.join(__dirname, 'electronSmashladderClient.js')
    },
  });
  global.win = win;

  win.loadURL('http://www.smashladder.com/netplay?tab=chat-matchmaking');

  // This is on load of page
  win.webContents.on('did-finish-load', () => {
    win.setTitle('Anthers Ladder Desktop!');
    //win.webContents.send('ping', 'whoooooooh!')  
    //win.webContents.executeJavaScript("alert('welcome to the ladder desktop');");
  });


  // exit - close all sockets
  win.on('closed', () => {
    win = null;
    process.exit(0);
  });
});


let nodePeerManager = null;

// Set event listeners for commands from browser page
ipcMain.on('GET_VERSION', (event, arg) => {
  // Event emitter for sending asynchronous messages
  event.sender.send('VERSION', XFDESKTOP_VERSION);

  // can respond to the synchronous version doing this:
  // event.returnValue = "something";
});

// MATCH START!!! SEND COMMAND TO DOLPHIN!!
ipcMain.on('LAUNCH_DOLPHIN', (event, arg) => {
  // Event emitter for sending asynchronous messages
  event.sender.send('VERSION', "STARTING DOLPHIN");

  // ripped from https://stackoverflow.com/questions/34174124/how-to-run-external-exe-in-node-webkit
  // just opens notepad I think, DIDN'T TEST in windows or anything cause I'm not a windows guy
  const spawn = require('child_process').spawn;
  const child = spawn('C:\\windows\\notepad.exe', ["C:/Windows/System32/Drivers/etc/hosts"]);

  child.stdout.on('data', function (data) {
    console.log('[AnthDesk] stdout: ' + data);
  });

  child.stderr.on('data', function (data) {
    console.log('[AnthDesk] stderr: ' + data);
  });

  child.on('close', function (code) {
    console.log('[AnthDesk] child process exited with code ' + code);
  });
});


