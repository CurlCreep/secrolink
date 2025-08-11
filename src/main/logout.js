// src/main/logout.js
const { Menu } = require('electron');
const config = require('../config/config');
const { getMainWindow } = require('./window');
const { buildMenu } = require('./menu');


function logout() {
    const mainWindow = getMainWindow();
    if (!mainWindow) return;

    const ses = mainWindow.webContents.session;

    Promise.all([
        ses.cookies.remove(config.lastUserUrl, config.lastUserCookie),
        ses.cookies.remove(config.url, config.seshCookie),
    ])
        .then(() => {
            console.log('Removed lastLoginUser and PHPSESSID cookies');

            mainWindow.reload();
        })
        .catch(err => {
            console.error('Error removing cookies during logout:', err);
        });
}

module.exports = {
    logout
}