// src/main/tray.js
const { app, Menu, Tray } = require('electron');
const config = require('../config/config');
const path = require('path');
const { getMainWindow } = require('./window');


function createTray() {
    let mainWindow = getMainWindow();
    if (config.minimizeToTray) {
        if (config.tray) return; // Already created

        config.tray = new Tray(path.join(__dirname, '../../assets', 'icon.ico'));
        const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => {
            mainWindow.show();
            mainWindow.setSkipTaskbar(false);
        }},
        { label: 'Quit', click: () => {
            if (mainWindow) {
                mainWindow.destroy(); // force close window
            }
            config.tray.destroy();
            app.quit(); // try normal quit
            app.exit(0); // force exit if needed
        }}
        ]);
        config.tray.setToolTip('Secrolink');
        config.tray.setContextMenu(contextMenu);

        config.tray.on('double-click', () => {
        mainWindow.show();
        mainWindow.setSkipTaskbar(false);
        });
    } else {
        if (config.tray) {
            config.tray.destroy(); // remove the tray icon from the system tray
            config.tray = null;    // clear the reference so it can be GC'd
        }
    }
}

module.exports = {
    createTray
}