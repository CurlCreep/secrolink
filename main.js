const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

// Windows
let mainWindow;
let bossMapWindow = null;
let wikiWindow = null;
let faqWindow = null;
let supportWindow = null;

// URLS
const url = 'https://fairview.deadfrontier.com';
const lastUserUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo';
const profilerUrl = 'https://www.dfprofiler.com/bossmap';
const wikiLink = 'https://deadfrontier.fandom.com/wiki/Dead_Frontier_Wiki';
const faqLink = 'https://support.deadfrontier.com/kb';
const supportLink = 'https://support.deadfrontier.com/discussion/new';

// Cookies
const lastUserCookie = 'lastLoginUser';
const seshCookie = 'PHPSESSID';

// Main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    icon: path.join(__dirname, 'assets', 'implant.ico'),
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
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const childWindow = new BrowserWindow({
      parent: mainWindow,
      show: true,
      width: 800,
      height: 600,
      icon: path.join(__dirname, 'assets', 'implant.ico'),
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
        // Inventory
        {
          label: 'Inventory && Equipment',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25');
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
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15');
            }
          }
        },

        // Crafting
        {
          label: 'Crafting',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59');
            }
          }
        },

        // Credit Shop
        {
          label: 'Credit Shop',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28');
            }
          }
        },

        // Marketplace
        {
          label: 'Marketplace',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35');
            }
          }
        },

        // Storage
        {
          label: 'Storage',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50');
            }
          }
        },

        // The Yard
        {
          label: 'The Yard',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24');
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
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=56');
            }
          }
        },

        // Fast Travel
        {
          label: 'Fast Travel',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=61');
            }
          }
        },

        // Gambling Den
        {
          label: 'Gambling Den',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=49');
            }
          }
        },

        // Meeting Hall
        {
          label: 'Meeting Hall',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum');
            }
          }
        },

        // Records
        {
          label: 'Records',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=22');
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
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=pm');
            }
          }
        },

        // Challenges
        {
          label: 'Challenges',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=62');
            }
          }
        },

        // Masteries
        {
          label: 'Masteries',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=81');
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
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=summary');
            }
          }
        },

        // Stats
        {
          label: 'Show Stats',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=statPanel');
            }
          }
        },

        // Posts
        {
          label: 'Show Posts',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=showPosts');
            }
          }
        },

        // Collection
        {
          label: 'Collection Book',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=82');
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
                  mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=account');
                }
              }
            },
            {
              // 2FA
              label: '2FA Settings',
              enabled: !!username,
              click: () => {
                if (username && mainWindow) {
                  mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=85');
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
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=forumProfile');
            }
          }
        },

        // Buddies
        {
          label: 'Friends',
          enabled: !!username,
          click: () => {
            if (username && mainWindow) {
              mainWindow.loadURL('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile;sa=editBuddies');
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
        // Boss Map
        {
          label: 'Boss Map',
          click: () => {
            // If window exists and focus it
            if (bossMapWindow && !bossMapWindow.isDestroyed()) {
              bossMapWindow.focus();
            } else {
              // Create new window
              bossMapWindow = new BrowserWindow({
                width: 800,
                height: 700,
                icon: path.join(__dirname, 'assets', 'implant.ico'),
                title: 'Boss Map',
                autoHideMenuBar: true,
                webPreferences: {
                  nodeIntegration: false
                }
              });

              bossMapWindow.loadURL(profilerUrl);

              // When the page finishes loading
              bossMapWindow.webContents.on('did-finish-load', () => {
                bossMapWindow.webContents.insertCSS(`
                  ::-webkit-scrollbar {
                    width: 0px;
                    background: transparent;
                  }
                `);
                bossMapWindow.webContents.executeJavaScript(`
                  // Remove background image from body
                  document.body.style.backgroundImage = 'none';
                  document.body.style.backgroundColor = '#000000'; // Optional: set a background color
                  const navbar = document.querySelector('.navbar');
                  const title = document.querySelector('.page-title');
                  const outposts = document.getElementById('outposts');
                  const old_bosses = document.getElementById('old_bosses');
                  const gps = document.getElementById('gps-box');
                  if (navbar) {
                    navbar.style.display = 'none';
                  }
                  if (outposts) {
                    outposts.style.display = 'none';
                  }
                  if (title) {
                    title.style.display = 'none';
                  }
                  if (old_bosses) {
                    old_bosses.style.display = 'none';
                  }
                  if (gps) {
                    gps.style.display = 'none';
                  }
                `);
              });


              bossMapWindow.on('closed', () => {
                bossMapWindow = null;
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
                icon: path.join(__dirname, 'assets', 'implant.ico'),
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


