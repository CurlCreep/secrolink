const { nativeTheme } = require('electron');
const config = require('../config/config');

// Switch theme
function setTheme(theme) {
  const { updateMenu } = require('./menu');
  config.currentTheme = theme;
  config.store.set('theme', theme);
  nativeTheme.themeSource = theme;

  updateMenu();
}

module.exports = {
    setTheme
}