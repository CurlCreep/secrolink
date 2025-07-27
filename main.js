const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

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

// URLS
const url = 'https://fairview.deadfrontier.com';
const lastUserUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo';
const wikiLink = 'https://deadfrontier.fandom.com/wiki/Dead_Frontier_Wiki';
const faqLink = 'https://support.deadfrontier.com/kb';
const supportLink = 'https://support.deadfrontier.com/discussion/new';

// DFprofiler URLs
const profilerBossUrl = 'https://www.dfprofiler.com/bossmap';
const profilerMarketplaceUrl = 'https://www.dfprofiler.com/marketplace';
const profilerStatsUrl = 'https://www.dfprofiler.com/statcalculator';
const profilerWardrobeUrl = 'https://www.dfprofiler.com/wardrobe';
const profilerDamageTableUrl = 'https://www.dfprofiler.com/damage';
const profilerStatisticsUrl = 'https://www.dfprofiler.com/statistics';


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

// Main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      ::-webkit-scrollbar {
          display: none;
      }
    `);
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
function buildMenu(username) {
  return Menu.buildFromTemplate([
    {
      label: 'Outpost',
      submenu: [
        // Home
        {
          label: 'Home',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(homeUrl);
            }
          }
        },

        { type: 'separator' },

        // Inventory
        {
          label: 'Inventory && Equipment',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(inventoryUrl);
            }
          }
        },

        { type: 'separator' },

        // Bank
        {
          label: 'Bank',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(bankUrl);
            }
          }
        },

        // Crafting
        {
          label: 'Crafting',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(craftingUrl);
            }
          }
        },

        // Credit Shop
        {
          label: 'Credit Shop',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(creditShopUrl);
            }
          }
        },

        // Marketplace
        {
          label: 'Marketplace',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(marketplaceUrl);
            }
          }
        },

        // Storage
        {
          label: 'Storage',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(storageUrl);
            }
          }
        },

        // The Yard
        {
          label: 'The Yard',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(yardUrl);
            }
          }
        },

        { type: 'separator' },

        // Clan HQ
        {
          label: 'Clan HQ',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(clanUrl);
            }
          }
        },

        // Fast Travel
        {
          label: 'Fast Travel',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(teleportUrl);
            }
          }
        },

        // Gambling Den
        {
          label: 'Gambling Den',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(gamblingUrl);
            }
          }
        },

        // Meeting Hall
        {
          label: 'Meeting Hall',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(forumUrl);
            }
          }
        },

        // Records
        {
          label: 'Records',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(recordsUrl);
            }
          }
        },
      ]
    },
    {
      label: 'Account',
      submenu: [
        username ? { label: `Signed in as: ${username}`, enabled: false } : { label: 'Not signed in', enabled: false },

        // Messages
        {
          label: 'Messages',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(messagesUrl);
            }
          }
        },

        // Challenges
        {
          label: 'Challenges',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(challengesUrl);
            }
          }
        },

        // Masteries
        {
          label: 'Masteries',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(masteriesUrl);
            }
          }
        },

        { type: 'separator' },

        // Profile Summary
        {
          label: 'Summary',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(summaryUrl);
            }
          }
        },

        // Stats
        {
          label: 'Show Stats',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(statsUrl);
            }
          }
        },

        // Posts
        {
          label: 'Show Posts',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(postsUrl);
            }
          }
        },

        // Collection
        {
          label: 'Collection Book',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(collectionUrl);
            }
          }
        },

        { type: 'separator' },
        
        // Account settings
        {
          label: 'Account Settings',
          enabled: !!username,
          submenu: [
            {
              label: 'Edit Account Settings',
              enabled: !!username,
              click: () => {
                if (username && mainWindow) {
                  mainWindow.loadURL(accountSettingsUrl);
                }
              }
            },
            {
              // 2FA
              label: '2FA Settings',
              enabled: !!username,
              click: () => {
                if (username && mainWindow) {
                  mainWindow.loadURL(TFAUrl);
                }
              }
            }
          ]
        },


        // Profile settings
        {
          label: 'Profile Settings',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(profileSettingsUrl);
            }
          }
        },

        // Message Options
        {
          label: 'Message Settings',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(messageSettingsUrl);
            }
          }
        },

        // Buddies
        {
          label: 'Friends',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL(friendsUrl);
            }
          }
        },

        { type: 'separator' },
        {
          label: 'Switch Accounts', enabled: false,
          submenu: [
            { label: 'No Added Acccounts', enabled: false },
            { type: 'separator' },
            { label: 'Add New Account', click: () => addNewAccount() }
          ]
        },
        { label: 'Logout', click: logout },
      ]
    },
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
    {
      label: 'Help',
      submenu: [
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





app.whenReady().then(() => {
  createWindow();
  Menu.setApplicationMenu(buildMenu(null));
  // mainWindow.webContents.openDevTools();


  // Read username cookie
  mainWindow.webContents.on('did-finish-load', () => {
    const currentUrl = mainWindow.webContents.getURL();
    console.log(currentUrl)
    if (currentUrl.includes('onlinezombiemmo')) {
      setTimeout(() => {
        session.defaultSession.cookies.get({
          url: currentUrl,
          name: 'lastLoginUser'
        }).then(cookies => {
          if (cookies.length > 0) {
            const username = cookies[0].value;
            console.log('Username from cookie:', username);

            const menu = buildMenu(username);
            Menu.setApplicationMenu(menu);

            if (currentUrl.includes('page=21')) {
              console.log('Leaving outpost');

              mainWindow.webContents.executeJavaScript(`
                (function() {
                  const btn = document.querySelector('button[onclick]');
                  return btn ? btn.getAttribute('onclick') : null;
                })();
              `).then(onclickValue => {
                if (onclickValue) {
                  console.log(onclickValue);
                  // Extract the URL from the onclick string
                  const match = onclickValue.match(/window\.location\.href\s*=\s*"([^"]+)"/);
                  if (match) {
                    const extractedUrl = match[1];
                    console.log('Extracted URL:', extractedUrl);
                    mainWindow.loadURL(extractedUrl);

                  } else {
                    console.log('No URL matched in onclick value.');
                  }
                } else {
                  console.log('Button or onclick not found.');
                }
              }).catch(err => {
                console.error('Error while executing JS:', err);
              });
            }
          }
          else {
            console.log('Cookie not found');
            const menu = buildMenu(null);
            Menu.setApplicationMenu(menu);
          }
        }).catch(err => {
          console.error('Error reading cookie:', err);
        });
      }, 1000);
    } else {
      console.log('Did not match target URL, skipping cookie check.');
      const menu = buildMenu(null);
      Menu.setApplicationMenu(menu);
    }
  });
});


