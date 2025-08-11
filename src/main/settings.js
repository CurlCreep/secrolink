// src/main/settings.js
const { startNotificationScheduler } = require('./notification');
const { getMainWindow } = require('./window');
const config = require('../config/config');
const { buildMenu } = require('./menu');
const { Menu } = require('electron');

// Applies settings after logging in
  function applySettings() {
    const mainWindow = getMainWindow();
    if (!mainWindow?.webContents) {
        console.error('mainWindow.webContents is not ready yet.');
        return;
    }

    const currentUrl = mainWindow.webContents.getURL();

    if (!currentUrl.includes('onlinezombiemmo')) {
      console.log('Not running game actions: wrong URL.');
      return;
    }

    Menu.setApplicationMenu(buildMenu());

    // Start notification scheduler
    if (config.oaNotification && !config.notificationSchedulerStarted) {
      startNotificationScheduler();
      config.notificationSchedulerStarted = true;
    }

    // Auto-revive
    mainWindow.webContents.executeJavaScript(`
      const buttons = document.querySelectorAll('.opElem');
      for (const btn of buttons) {
        if (btn.textContent.trim().toLowerCase() === 'revive') {
          btn.click();
          break;
        }
      }
    `);

    // Auto game launch
    if (config.automaticGameLaunch && currentUrl.includes('page=21')) {
      console.log('Leaving outpost');

      mainWindow.webContents.executeJavaScript(`
        (function() {
          const btn = document.querySelector('button[onclick]');
          return btn ? btn.getAttribute('onclick') : null;
        })();
      `).then(onclickValue => {
        if (onclickValue) {
          const match = onclickValue.match(/window\\.location\\.href\\s*=\\s*"([^"]+)"/);
          if (match) {
            const extractedUrl = match[1];
            console.log('Extracted URL:', extractedUrl);
            mainWindow.loadURL(extractedUrl);
          }
        }
      }).catch(err => {
        console.error('Error while executing JS:', err);
      });
    }
  }

  module.exports = {
    applySettings
  }