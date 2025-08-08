const { app, BrowserWindow, Menu, shell, session, nativeTheme, Notification, Tray, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store').default;


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
const store = new Store();

// Current logged in user's username
let username = null;

// Windows
let mainWindow;
let wikiWindow = null;
let faqWindow = null;
let supportWindow = null;
let bossMapWindow = null;
let marketplaceWindow = null;
let statsWindow = null;
let wardrobeWindow = null;
let damageTableWidow = null;
let statisticsWindow = null;
let boostCalcWindow = null;

// Stored Theme
let currentTheme = store.get('theme') || 'system';

// Launch game automatically
let automaticGameLaunch = store.get('automaticGameLaunch', false);

// Notification schedule running?
let notificationSchedulerStarted = false;
let oaNotification = store.get('oaNotification', false); // Notifications disabled by default
let notificationIntervalId = null; // Scheduler ID

// Option to minimize the app to trey when its closed
let tray = null;
let minimizeToTray = store.get('minimizeToTray', false);

// URLS
const url = 'https://fairview.deadfrontier.com';
const lastUserUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo';
const wikiLink = 'https://deadfrontier.fandom.com/wiki/Dead_Frontier_Wiki';
const faqLink = 'https://support.deadfrontier.com/kb';
const supportLink = 'https://support.deadfrontier.com/discussion/new';
const guideUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=17';

// DFprofiler URLs
const profilerBossUrl = 'https://www.dfprofiler.com/bossmap';
const profilerMarketplaceUrl = 'https://www.dfprofiler.com/marketplace';
const profilerStatsUrl = 'https://www.dfprofiler.com/statcalculator';
const profilerWardrobeUrl = 'https://www.dfprofiler.com/wardrobe';
const profilerDamageTableUrl = 'https://www.dfprofiler.com/damage';
const profilerStatisticsUrl = 'https://www.dfprofiler.com/statistics';

// DF Buddy URL
boostCalcUrl = 'https://dfbuddy.com/boostcalculator/';


// Outpost URLs
const homeUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php';
const inventoryUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25';
const bankUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15';
const craftingUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59';
const creditShopUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28';
const marketplaceUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35';
const storageUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50';
const yardUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24';
const clanUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=56';
const teleportUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=61';
const gamblingUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=49';
const forumUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum';
const recordsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=22';
const vendorUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84';

// Account URLs
const messagesUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=pm';
const challengesUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=62';
const masteriesUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=81';
const summaryUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=summary';
const statsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=statPanel';
const postsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=showPosts';
const collectionUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=82';
const accountSettingsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=account';
const TFAUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=85';
const profileSettingsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=forumProfile';
const messageSettingsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=pmprefs';
const friendsUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=editBuddies';


// Cookies
const lastUserCookie = 'lastLoginUser';
const seshCookie = 'PHPSESSID';

// Outpost attacks time table in UTC
const OASummerTimes = [
  { hour: 5, minute: 0 },
  { hour: 8, minute: 0 },
  { hour: 11, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 17, minute: 0 },
  { hour: 20, minute: 0 },
  { hour: 23, minute: 0 },
  { hour: 2, minute: 0 },
];

const OAWinterTimes = [
  { hour: 6, minute: 0 },
  { hour: 9, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 21, minute: 0 },
  { hour: 0, minute: 0 },
  { hour: 3, minute: 0 },
];


// Main window
function createWindow() {
  const fullscreenOnStartup = store.get('fullscreenOnStartup', false);
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    show: false,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      disableDialogs: true
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      ::-webkit-scrollbar {
          display: none;
      }
    `);
  });

  // Show and maximize after ready-to-show
  mainWindow.once('ready-to-show', () => {
    if (fullscreenOnStartup) {
      mainWindow.maximize();
    }
    mainWindow.show();
  });

  mainWindow.loadURL(url);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.includes('index.php?action=logout')) {
      console.log('User is logging out!');

      // Clear the 'lastLoginUser' cookie for the site
      const ses = mainWindow.webContents.session;
      ses.cookies.remove(lastUserUrl, lastUserCookie)
        .then(() => {
          console.log('lastLoginUser cookie deleted');
          Menu.setApplicationMenu(buildMenu(null));
        })
        .catch(err => {
          console.error('Failed to delete cookie:', err);
        });
    }
  });

  mainWindow.on('closed', () => {
    if (bossMapWindow && !bossMapWindow.isDestroyed()) {
      bossMapWindow.close();
    }
    if (wikiWindow && !wikiWindow.isDestroyed()) {
      wikiWindow.close();
    }
    if (supportWindow && !supportWindow.isDestroyed()) {
      supportWindow.close();
    }
    if (faqWindow && !faqWindow.isDestroyed()) {
      faqWindow.close();
    }
    if (marketplaceWindow && !marketplaceWindow.isDestroyed()) {
      marketplaceWindow.close();
    }
    if (statsWindow && !statsWindow.isDestroyed()) {
      statsWindow.close();
    }
    if (wardrobeWindow && !wardrobeWindow.isDestroyed()) {
      wardrobeWindow.close();
    }
    if (damageTableWidow && !damageTableWidow.isDestroyed()) {
      damageTableWidow.close();
    }
    if (statisticsWindow && !statisticsWindow.isDestroyed()) {
      statisticsWindow.close();
    }
    if (boostCalcWindow && !boostCalcWindow.isDestroyed()) {
      boostCalcWindow.close();
    }
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const childWindow = new BrowserWindow({
      parent: mainWindow,
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
    mainWindow.on('closed', () => {
      if (childWindow && !childWindow.isDestroyed()) {
        childWindow.close();
      }
    });

    return { action: 'deny' };
  });
}



// Menu bar
function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: '<',
      click: () => {
        if (mainWindow && mainWindow.webContents.canGoBack()) {
          mainWindow.webContents.goBack();
        }
      }
    },
    {
      label: '>',
      click: () => {
        if (mainWindow && mainWindow.webContents.canGoForward()) {
          mainWindow.webContents.goForward();
        }
      }
    },
    // Outpost
    {
      label: 'Outpost',
      submenu: [
        // Home
        {
          label: 'Home',
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(homeUrl);
            }
          }
        },

        { type: 'separator' },

        // Inventory
        {
          label: 'Inventory && Equipment',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(inventoryUrl);
            }
          }
        },

        { type: 'separator' },

        // Bank
        {
          label: 'Bank',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(bankUrl);
            }
          }
        },

        // Crafting
        {
          label: 'Crafting',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(craftingUrl);
            }
          }
        },

        // Credit Shop
        {
          label: 'Credit Shop',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(creditShopUrl);
            }
          }
        },

        // Marketplace
        {
          label: 'Marketplace',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(marketplaceUrl);
            }
          }
        },

        // Storage
        {
          label: 'Storage',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(storageUrl);
            }
          }
        },

        // The Yard
        {
          label: 'The Yard',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(yardUrl);
            }
          }
        },

        // Vendor
        {
          label: 'Vendor',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(vendorUrl);
            }
          }
        },

        { type: 'separator' },

        // Clan HQ
        {
          label: 'Clan HQ',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(clanUrl);
            }
          }
        },

        // Fast Travel
        {
          label: 'Fast Travel',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(teleportUrl);
            }
          }
        },

        // Gambling Den
        {
          label: 'Gambling Den',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(gamblingUrl);
            }
          }
        },

        // Meeting Hall
        {
          label: 'Meeting Hall',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(forumUrl);
            }
          }
        },

        // Records
        {
          label: 'Records',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(recordsUrl);
            }
          }
        },
      ]
    },
    // Account
    {
      label: 'Account',
      submenu: [
        // username ? { label: `Signed in as: ${username}`, enabled: false } : { label: 'Not signed in', enabled: false },

        // Buddies
        {
          label: 'Friends',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(friendsUrl);
            }
          }
        },

        // Messages
        {
          label: 'Messages',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(messagesUrl);
            }
          }
        },

        // Challenges
        {
          label: 'Challenges',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(challengesUrl);
            }
          }
        },

        // Collection
        {
          label: 'Collection',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(collectionUrl);
            }
          }
        },

        // Masteries
        {
          label: 'Masteries',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(masteriesUrl);
            }
          }
        },

        { type: 'separator' },

        // Profile Summary
        {
          label: 'Summary',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(summaryUrl);
            }
          }
        },

        // Stats
        {
          label: 'Show Stats',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(statsUrl);
            }
          }
        },

        // Posts
        {
          label: 'Show Posts',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(postsUrl);
            }
          }
        },

        { type: 'separator' },
        
        // Account settings
        {
          label: 'Account Settings',
          enabled: true,
          submenu: [
            {
              label: 'Edit Account Settings',
              enabled: true,
              click: () => {
                if (mainWindow) {
                  mainWindow.loadURL(accountSettingsUrl);
                }
              }
            },
            {
              // 2FA
              label: '2FA Settings',
              enabled: true,
              click: () => {
                if (mainWindow) {
                  mainWindow.loadURL(TFAUrl);
                }
              }
            }
          ]
        },


        // Profile settings
        {
          label: 'Profile Settings',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(profileSettingsUrl);
            }
          }
        },

        // Message Options
        {
          label: 'Message Settings',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(messageSettingsUrl);
            }
          }
        },

        { type: 'separator' },
        {
          label: 'Switch Accounts', enabled: false, visible: false,
          submenu: [
            { label: 'No Added Acccounts', enabled: false },
            { type: 'separator' },
            { label: 'Add New Account', click: () => addNewAccount() }
          ]
        },
        { label: 'Logout', click: logout },
      ]
    },
    // Tools
    {
      label: 'Tools',
      submenu: [
        {
          label: 'DFProfiler',
          submenu: [
            // Boss Map
            {
              label: 'Boss Map',
              click: () => {
                if (bossMapWindow && !bossMapWindow.isDestroyed()) {
                  bossMapWindow.focus();
                } else {
                  bossMapWindow = new BrowserWindow({
                    width: 800,
                    height: 700,
                    icon: path.join(__dirname, 'assets', 'icon.ico'),
                    title: 'Boss Map',
                    autoHideMenuBar: true,
                    webPreferences: {
                      nodeIntegration: false
                    }
                  });

                  bossMapWindow.loadURL(profilerBossUrl); // Ensure profilerBossUrl is defined elsewhere

                  bossMapWindow.webContents.on('did-finish-load', () => {
                    bossMapWindow.webContents.insertCSS(`
                      ::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                      }
                    `);
                    bossMapWindow.webContents.executeJavaScript(`
                      document.body.style.backgroundImage = 'none';
                      document.body.style.backgroundColor = '#000000';
                      const elementsToHide = [
                        document.querySelector('.navbar'),
                        document.querySelector('.page-title'),
                        document.getElementById('outposts'),
                        document.getElementById('old_bosses'),
                        document.getElementById('gps-box')
                      ];
                      elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                  });

                  bossMapWindow.on('closed', () => {
                    bossMapWindow = null;
                  });
                }
              }
            },

            // Profiler Marketplace
            {
              label: 'Marketplace',
              click: () => {
                if (marketplaceWindow && !marketplaceWindow.isDestroyed()) {
                  marketplaceWindow.focus();
                } else {
                  marketplaceWindow = new BrowserWindow({
                    width: 1200,
                    height: 700,
                    icon: path.join(__dirname, 'assets', 'icon.ico'),
                    title: 'DFprofiler Marketplace',
                    autoHideMenuBar: true,
                    webPreferences: {
                      nodeIntegration: false
                    }
                  });

                  marketplaceWindow.loadURL(profilerMarketplaceUrl);

                  marketplaceWindow.webContents.on('did-finish-load', () => {
                    marketplaceWindow.webContents.insertCSS(`
                      ::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                      }
                    `);
                    marketplaceWindow.webContents.executeJavaScript(`
                      document.body.style.backgroundImage = 'none';
                      document.body.style.backgroundColor = '#000000';
                      const elementsToHide = [
                        document.querySelector('.navbar'),
                        document.querySelector('.page-title'),
                      ];
                      elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                  });

                  marketplaceWindow.on('closed', () => {
                    marketplaceWindow = null;
                  });
                }
              }
            },

            // Stats Calculator
            {
              label: 'Stats Calculator',
              click: () => {
                if (statsWindow && !statsWindow.isDestroyed()) {
                  statsWindow.focus();
                } else {
                  statsWindow = new BrowserWindow({
                    width: 800,
                    height: 700,
                    icon: path.join(__dirname, 'assets', 'icon.ico'),
                    title: 'DFprofiler Stats Calculator',
                    autoHideMenuBar: true,
                    webPreferences: {
                      nodeIntegration: false
                    }
                  });

                  statsWindow.loadURL(profilerStatsUrl);

                  statsWindow.webContents.on('did-finish-load', () => {
                    statsWindow.webContents.insertCSS(`
                      ::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                      }
                    `);
                    statsWindow.webContents.executeJavaScript(`
                      document.body.style.backgroundImage = 'none';
                      document.body.style.backgroundColor = '#000000';
                      const elementsToHide = [
                        document.querySelector('.navbar'),
                        document.querySelector('.page-title'),
                      ];
                      elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                  });

                  statsWindow.on('closed', () => {
                    statsWindow = null;
                  });
                }
              }
            },

            // Wardrobe
            {
              label: 'Wardrobe',
              click: () => {
                if (wardrobeWindow && !wardrobeWindow.isDestroyed()) {
                  wardrobeWindow.focus();
                } else {
                  wardrobeWindow = new BrowserWindow({
                    width: 1200,
                    height: 700,
                    icon: path.join(__dirname, 'assets', 'icon.ico'),
                    title: 'DFprofiler Wardrobe',
                    autoHideMenuBar: true,
                    webPreferences: {
                      nodeIntegration: false
                    }
                  });

                  wardrobeWindow.loadURL(profilerWardrobeUrl);

                  wardrobeWindow.webContents.on('did-finish-load', () => {
                    wardrobeWindow.webContents.insertCSS(`
                      ::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                      }
                    `);
                    wardrobeWindow.webContents.executeJavaScript(`
                      document.body.style.backgroundImage = 'none';
                      document.body.style.backgroundColor = '#000000';
                      const elementsToHide = [
                        document.querySelector('.navbar'),
                        document.querySelector('.page-title'),
                      ];
                      elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                  });

                  wardrobeWindow.on('closed', () => {
                    wardrobeWindow = null;
                  });
                }
              }
            },

            // Damage Table
            {
              label: 'Damage Table',
              click: () => {
                if (damageTableWidow && !damageTableWidow.isDestroyed()) {
                  damageTableWidow.focus();
                } else {
                  damageTableWidow = new BrowserWindow({
                    width: 1200,
                    height: 700,
                    icon: path.join(__dirname, 'assets', 'icon.ico'),
                    title: 'DFprofiler Damage Table',
                    autoHideMenuBar: true,
                    webPreferences: {
                      nodeIntegration: false
                    }
                  });

                  damageTableWidow.loadURL(profilerDamageTableUrl);

                  damageTableWidow.webContents.on('did-finish-load', () => {
                    damageTableWidow.webContents.insertCSS(`
                      ::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                      }
                    `);
                    damageTableWidow.webContents.executeJavaScript(`
                      document.body.style.backgroundImage = 'none';
                      document.body.style.backgroundColor = '#000000';
                      const elementsToHide = [
                        document.querySelector('.navbar'),
                        document.querySelector('.page-title'),
                      ];
                      elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                  });

                  damageTableWidow.on('closed', () => {
                    damageTableWidow = null;
                  });
                }
              }
            },

            // Statistics
            {
              label: 'Statistics',
              click: () => {
                if (statisticsWindow && !statisticsWindow.isDestroyed()) {
                  statisticsWindow.focus();
                } else {
                  statisticsWindow = new BrowserWindow({
                    width: 1200,
                    height: 700,
                    icon: path.join(__dirname, 'assets', 'icon.ico'),
                    title: 'DFprofiler Statistics',
                    autoHideMenuBar: true,
                    webPreferences: {
                      nodeIntegration: false
                    }
                  });

                  statisticsWindow.loadURL(profilerStatisticsUrl);

                  statisticsWindow.webContents.on('did-finish-load', () => {
                    statisticsWindow.webContents.insertCSS(`
                      ::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                      }
                    `);
                    statisticsWindow.webContents.executeJavaScript(`
                      document.body.style.backgroundImage = 'none';
                      document.body.style.backgroundColor = '#000000';
                      const elementsToHide = [
                        document.querySelector('.navbar'),
                        document.querySelector('.page-title'),
                      ];
                      elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                  });

                  statisticsWindow.on('closed', () => {
                    statisticsWindow = null;
                  });
                }
              }
            },
          ]
        },

        // DF Buddy Boost Calculator
        {
          label: 'Boosts Calculator',
          click: () => {
            // If window exists focus it
            if (boostCalcWindow && !boostCalcWindow.isDestroyed()) {
              boostCalcWindow.focus();
            } else {
              // Create new window
              boostCalcWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                icon: path.join(__dirname, 'assets', 'icon.ico'),
                title: 'Boosts Calculator',
                autoHideMenuBar: true,
                webPreferences: {
                  nodeIntegration: false
                }
              });

              boostCalcWindow.loadURL(boostCalcUrl);

              boostCalcWindow.webContents.on('did-finish-load', () => {
                boostCalcWindow.webContents.executeJavaScript(`
                  const section = document.querySelector('section');
                  if (section) {
                    section.style.padding = '50px';
                    section.style.margin = '0';
                    section.style.backgroundColor = '#000';
                  }
                `);
                boostCalcWindow.webContents.executeJavaScript(`
                  const elementsToHide = [
                    document.querySelector('.navbar')
                  ];
                  elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                `);
              });
              // boostCalcWindow.webContents.openDevTools();

              boostCalcWindow.on('closed', () => {
                boostCalcWindow = null;
              });
            }
          }
        },

        // Wiki
        {
          label: 'Wiki',
          click: () => {
            // If window exists focus it
            if (wikiWindow && !wikiWindow.isDestroyed()) {
              wikiWindow.focus();
            } else {
              // Create new window
              wikiWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                icon: path.join(__dirname, 'assets', 'icon.ico'),
                title: 'Wiki',
                autoHideMenuBar: true,
                webPreferences: {
                  nodeIntegration: false
                }
              });

              wikiWindow.loadURL(wikiLink);

              wikiWindow.on('closed', () => {
                wikiWindow = null;
              });
            }
          }
        },
      ]
    },
    // Options
    {
      label: 'Options',
      submenu: [
        // Theme picker
        {
          label: 'Theme',
          submenu: [
            {
              label: 'Light',
              type: 'radio',
              checked: currentTheme === 'light',
              click: () => setTheme('light')
            },
            {
              label: 'Dark',
              type: 'radio',
              checked: currentTheme === 'dark',
              click: () => setTheme('dark')
            },
            {
              label: 'System Default',
              type: 'radio',
              checked: currentTheme === 'system',
              click: () => setTheme('system')
            }
          ]
        },
        // Start the window maximized
        {
          label: 'Start Maximized',
          type: 'checkbox',
          checked: store.get('fullscreenOnStartup', false),
          click: (menuItem) => {
            const enabled = menuItem.checked;
            store.set('fullscreenOnStartup', enabled);
            // Update menu
            updateMenu();
          }
        },
        // Automatic game launch
        {
          label: 'Launch game automatically',
          type: 'checkbox',
          checked: automaticGameLaunch, // use the global variable
          click: (menuItem) => {
            automaticGameLaunch = menuItem.checked; // update the global variable
            store.set('automaticGameLaunch', automaticGameLaunch); // persist the value
            // Update menu
            updateMenu();
          }
        },
        // Enable outpost attack notification
        {
          label: 'Outpost Attack Notifications',
          type: 'checkbox',
          checked: oaNotification, // use the global variable
          click: (menuItem) => {
            oaNotification = menuItem.checked;
            store.set('oaNotification', oaNotification);

            if (oaNotification) {
              if (!notificationSchedulerStarted) {
                startNotificationScheduler();
              }
            } else {
              stopNotificationScheduler();
            }

            updateMenu();
          }
        },
        // Minimize to tray on close
        {
          label: 'Minimize App to Tray on Close',
          type: 'checkbox',
          checked: minimizeToTray,
          click: (menuItem) => {
            minimizeToTray = menuItem.checked;
            store.set('minimizeToTray', minimizeToTray);
            updateMenu();
          }
        },
      ]
    },
    // Window
    {
      label: 'Window',
      submenu: [
        // Refresh page
        {
          label: 'Refresh',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        // Zoom-in
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
          }
        },
        // Zoom-out
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(currentZoom - 0.1);
          }
        },
        // Reset Zoom
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomFactor(1.0);
          }
        },
        // Minimize Window
        { role: 'minimize' },
        // Close Window
        { role: 'close' }
      ]
    },
    // Help
    {
      label: 'Help',
      submenu: [
        {
          label: 'Guide',
          enabled: true,
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(guideUrl);
            }
          }
        },
        {
          label: 'FAQ',
          click: () => {
            // If window exists focus it
            if (faqWindow && !faqWindow.isDestroyed()) {
              faqWindow.focus();
            } else {
              // Create new window
              faqWindow = new BrowserWindow({
                parent: mainWindow,
                width: 1000,
                height: 700,
                title: 'FAQ',
                autoHideMenuBar: true,
                webPreferences: {
                  nodeIntegration: false
                }
              });

              faqWindow.setMenuBarVisibility(false);
              faqWindow.loadURL(faqLink);

              faqWindow.on('closed', () => {
                faqWindow = null;
              });
            }
          }
        },
        {
          label: 'Contact Support',
          click: () => {
            // If window exists focus it
            if (supportWindow && !supportWindow.isDestroyed()) {
              supportWindow.focus();
            } else {
              // Create new window
              supportWindow = new BrowserWindow({
                parent: mainWindow,
                width: 1000,
                height: 700,
                title: 'Support',
                autoHideMenuBar: true,
                webPreferences: {
                  nodeIntegration: false
                }
              });

              supportWindow.setMenuBarVisibility(false);
              supportWindow.loadURL(supportLink);

              supportWindow.on('closed', () => {
                supportWindow = null;
              });
            }
          }
        },
        {
          label: 'Join Discord',
          click: () => {
            shell.openExternal('https://discordapp.com/invite/deadfrontier2');
          },
        }
      ]
    }
  ]);
};

// Switch theme
function setTheme(theme) {
  currentTheme = theme;
  store.set('theme', theme);
  nativeTheme.themeSource = theme;

  // Update checkmarks
  updateMenu();
}

// Update the current theme selection in the menu
function updateMenu() {
  const menu = buildMenu();
  Menu.setApplicationMenu(menu);
}

function logout() {
  if (!mainWindow) return;

  const ses = mainWindow.webContents.session;

  Promise.all([
    ses.cookies.remove(lastUserUrl, lastUserCookie),
    ses.cookies.remove(url, seshCookie),
  ])
    .then(() => {
      console.log('Removed lastLoginUser and PHPSESSID cookies');

      mainWindow.reload();

      const menu = buildMenu(null);
      Menu.setApplicationMenu(menu);
    })
    .catch(err => {
      console.error('Error removing cookies during logout:', err);
    });
}

// Outpost attack notifications
function showNotification() {
  new Notification({
    title: 'Outpost is under attack!',
    body: 'Next outpost attack is in 3 hours.',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
  }).show();
}

// Check every minute if now matches any trigger time
function startNotificationScheduler() {
  if (notificationIntervalId !== null) return; // Already running

  console.log('Outpost Notification Scheduler Started');

  notificationIntervalId = setInterval(() => {
    const now = new Date();
    const localTime = now.toLocaleTimeString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log(`Current local time: ${localTime}`);
    console.log(`Current timezone: ${timeZone}`);

    const nowUTC = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes()
    ));

    // Date range for summer time
    const currentYear = now.getUTCFullYear();
    const summerStart = new Date(Date.UTC(currentYear, 2, 9)); // March 9
    const summerEnd = new Date(Date.UTC(currentYear, 10, 2, 23, 59)); // November 2

    const isSummer = nowUTC >= summerStart && nowUTC <= summerEnd;
    const activeTimes = isSummer ? OASummerTimes : OAWinterTimes;

    let nextNotificationInMinutes = null;

    activeTimes.forEach(({ hour, minute }) => {
      const triggerUTC = new Date(Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute
      ));

      if (triggerUTC < nowUTC) {
        triggerUTC.setUTCDate(triggerUTC.getUTCDate() + 1);
      }

      const diffMs = triggerUTC - nowUTC;
      const diffMins = Math.floor(diffMs / (60 * 1000));

      if (nextNotificationInMinutes === null || diffMins < nextNotificationInMinutes) {
        nextNotificationInMinutes = diffMins;
      }

      if (nowUTC.getUTCHours() === hour && nowUTC.getUTCMinutes() === minute) {
        showNotification();
      }
    });

    if (nextNotificationInMinutes !== null) {
      console.log(`Next notification in: ${nextNotificationInMinutes} minute(s)`);
    }
  }, 60 * 1000);
  notificationSchedulerStarted = true;
}



function stopNotificationScheduler() {
  if (notificationIntervalId !== null) {
    clearInterval(notificationIntervalId);
    notificationIntervalId = null;
    notificationSchedulerStarted = false;
    console.log('Outpost Notification Scheduler Stopped');
  }
}

// This function creates the trey entry for the app
function createTray() {
  if (tray) return; // Already created

  tray = new Tray(path.join(__dirname, 'assets', 'icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => {
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);
    }},
    { label: 'Quit', click: () => {
      if (mainWindow) {
        mainWindow.destroy(); // force close window
      }
      tray.destroy();
      app.quit(); // try normal quit
      app.exit(0); // force exit if needed
    }}
  ]);
  tray.setToolTip('Secrolink');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.setSkipTaskbar(false);
  });
}

// Open the app again if the trey icon is clicked
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.setSkipTaskbar(false);
  }
});


app.whenReady().then(() => {
  createWindow();
  createTray();

  Menu.setApplicationMenu(buildMenu(null));
  nativeTheme.themeSource = currentTheme;
  updateMenu();
  mainWindow.webContents.openDevTools();

  // Minimize to tray if option is enabled
  mainWindow.on('close', (e) => {
    if (minimizeToTray) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  // Just checks cookie in the background
  function checkCookieUntilFound() {
    const currentUrl = mainWindow.webContents.getURL();

    if (!currentUrl.includes('onlinezombiemmo')) {
      console.log('Stopped cookie check: URL does not contain "onlinezombiemmo".');
      username = null;
      Menu.setApplicationMenu(buildMenu());
      return;
    }

    session.defaultSession.cookies.get({
      url: currentUrl,
      name: 'lastLoginUser'
    }).then(cookies => {
      if (cookies.length > 0) {
        username = cookies[0].value;
        console.log('Username from cookie:', username);
        Menu.setApplicationMenu(buildMenu());
      } else {
        console.log('Cookie not found, retrying...');
        Menu.setApplicationMenu(buildMenu(null));
        setTimeout(checkCookieUntilFound, 1000);
      }
    }).catch(err => {
      console.error('Error reading cookie:', err);
      setTimeout(checkCookieUntilFound, 1000);
    });
  }

  // Runs game-related actions without waiting for the cookie
  function runGameActions() {
    const currentUrl = mainWindow.webContents.getURL();

    if (!currentUrl.includes('onlinezombiemmo')) {
      console.log('Not running game actions: wrong URL.');
      return;
    }

    Menu.setApplicationMenu(buildMenu());

    if (oaNotification && !notificationSchedulerStarted) {
      startNotificationScheduler();
      notificationSchedulerStarted = true;
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
    let automaticGameLaunch = store.get('automaticGameLaunch', false);
    if (automaticGameLaunch && currentUrl.includes('page=21')) {
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

  mainWindow.webContents.on('did-finish-load', () => {
    // Start checking cookie in background
    // checkCookieUntilFound();

    // Immediately run game logic without waiting for cookie
    runGameActions();
  });
});



