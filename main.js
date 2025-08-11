const { app, BrowserWindow, Menu, nativeTheme } = require('electron');
const { setMainWindow, getMainWindow } = require('./src/main/window');
const { buildMenu } = require('./src/main/menu');
const { applySettings } = require('./src/main/settings');
const { createTray } = require('./src/main/tray');
const config = require('./src/config/config');
const path = require('path');

// require('electron-reload')(__dirname, {
//   electron: require(`${__dirname}/node_modules/electron`)
// });

if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
  } catch (e) {
    console.log('electron-reload not found, skipping live reload.');
  }
}

app.setAppUserModelId('com.curlcreep.secrolink');

let mainWindow;

// Main window
function createWindow() {
  const fullscreenOnStartup = config.fullscreenOnStartup;
  let mainWin = new BrowserWindow({
    width: 1100,
    height: 900,
    show: false,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      disableDialogs: true
    },
  });

  setMainWindow(mainWin); // Store it globally

  mainWin.webContents.on('did-finish-load', () => {
    mainWin.webContents.insertCSS(`
      ::-webkit-scrollbar {
          display: none;
      }
    `);
  });

  // Show and maximize after ready-to-show
  mainWin.once('ready-to-show', () => {
    if (fullscreenOnStartup) {
      mainWin.maximize();
    }
    mainWin.show();
  });

  mainWin.loadURL(config.url);

  mainWin.webContents.on('will-navigate', (event, url) => {
    if (url.includes('index.php?action=logout')) {
      console.log('User is logging out!');

      // Clear the 'lastLoginUser' cookie for the site
      const ses = mainWin.webContents.session;
      ses.cookies.remove(config.lastUserUrl, config.lastUserCookie)
        .then(() => {
          console.log('lastLoginUser cookie deleted');
          Menu.setApplicationMenu(buildMenu(null));
        })
        .catch(err => {
          console.error('Failed to delete cookie:', err);
        });
    }
  });

  mainWin.on('closed', () => {
    if (config.bossMapWindow && !config.bossMapWindow.isDestroyed()) {
      config.bossMapWindow.close();
    }
    if (config.wikiWindow && !config.wikiWindow.isDestroyed()) {
      config.wikiWindow.close();
    }
    if (config.supportWindow && !config.supportWindow.isDestroyed()) {
      config.supportWindow.close();
    }
    if (config.faqWindow && !config.faqWindow.isDestroyed()) {
      config.faqWindow.close();
    }
    if (config.marketplaceWindow && !config.marketplaceWindow.isDestroyed()) {
      config.marketplaceWindow.close();
    }
    if (config.statsWindow && !config.statsWindow.isDestroyed()) {
      config.statsWindow.close();
    }
    if (config.wardrobeWindow && !config.wardrobeWindow.isDestroyed()) {
      config.wardrobeWindow.close();
    }
    if (config.damageTableWidow && !config.damageTableWidow.isDestroyed()) {
      config.damageTableWidow.close();
    }
    if (config.statisticsWindow && !config.statisticsWindow.isDestroyed()) {
      config.statisticsWindow.close();
    }
    if (config.boostCalcWindow && !config.boostCalcWindow.isDestroyed()) {
      config.boostCalcWindow.close();
    }
    mainWin = null;
  });

  mainWin.webContents.setWindowOpenHandler(({ url }) => {
    const childWindow = new BrowserWindow({
      parent: mainWin,
      show: true,
      width: 800,
      height: 600,
      icon: path.join(__dirname, 'assets', 'icon.ico'),
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        partition: 'persist:dfSession'
      }
    });

    childWindow.loadURL(url);

    // Close child window with the main window
    mainWin.on('closed', () => {
      if (childWindow && !childWindow.isDestroyed()) {
        childWindow.close();
      }
    });

    return { action: 'deny' };
  });
}

// Open the app again if the tray icon is clicked
app.on('activate', () => {
  let mainWindow = getMainWindow();
  if (!mainWindow) {
    // Window doesn't exist yet, create it
    createWindow();
    mainWindow = getMainWindow();
  }
  mainWindow.show();
  mainWindow.setSkipTaskbar(false);
});


app.whenReady().then(() => {
  createWindow();
  let mainWindow = getMainWindow();
  createTray();
  Menu.setApplicationMenu(buildMenu());
  nativeTheme.themeSource = config.currentTheme;
  // updateMenu();
  // mainWindow.webContents.openDevTools();

  // Minimize to tray if option is enabled
  mainWindow.on('close', (e) => {
    if (config.minimizeToTray) {
      e.preventDefault();
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    applySettings();
  });
});



