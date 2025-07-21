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
    width: 1000,
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

}



// Menu bar
function buildMenu(username) {
  return Menu.buildFromTemplate([
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Boss Map',
          click: () => {
            const { BrowserWindow } = require('electron');

            // If window exists and is not destroyed, close it
            if (bossMapWindow && !bossMapWindow.isDestroyed()) {
              bossMapWindow.focus();
            } else {
              // Create new window
              bossMapWindow = new BrowserWindow({
                width: 800,
                height: 700,
                title: 'Boss Map',
                webPreferences: {
                  nodeIntegration: false
                }
              });

              bossMapWindow.setMenuBarVisibility(false);
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
        { type: 'separator' },
        {
          label: 'Wiki',
          click: () => {
            const { BrowserWindow } = require('electron');

            // If window exists and is not destroyed, close it
            if (wikiWindow && !wikiWindow.isDestroyed()) {
              wikiWindow.focus();
            } else {
              // Create new window
              wikiWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                title: 'Wiki',
                webPreferences: {
                  nodeIntegration: false
                }
              });

              wikiWindow.setMenuBarVisibility(false);
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
      label: 'Account',
      submenu: [
        username 
          ? { label: `Signed in as: ${username}`, enabled: false } 
        : { label: 'Not signed in', enabled: false },
        {
          label: 'Switch Accounts',
          submenu: [
            { label: 'No Added Acccounts', enabled: false },
            { type: 'separator' },
            { label: 'Add New Account', click: () => addNewAccount() }
          ]
        },
        { type: 'separator' },
        { label: 'Logout', click: logout },
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'FAQ',
          click: () => {
            const { BrowserWindow } = require('electron');

            // If window exists and is not destroyed, close it
            if (faqWindow && !faqWindow.isDestroyed()) {
              faqWindow.focus();
            } else {
              // Create new window
              faqWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                title: 'FAQ',
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
            const { BrowserWindow } = require('electron');

            // If window exists and is not destroyed, close it
            if (supportWindow && !supportWindow.isDestroyed()) {
              supportWindow.focus();
            } else {
              // Create new window
              supportWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                title: 'Support',
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
            // const account = buildMenu(account);
            Menu.setApplicationMenu(menu);
          } else {
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
    }
  });
});


