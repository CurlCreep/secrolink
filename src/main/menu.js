// src/main/menu.js
const { stopNotificationScheduler, startNotificationScheduler } = require('./notification');
const { BrowserWindow, Menu, shell } = require('electron');
const { getMainWindow } = require('./window');
const config = require('../config/config');
const { setTheme } = require('./theme');
const { logout } = require('./logout');
const path = require('path');
const { createTray } = require('./tray');

const icon = path.join(__dirname, '../../assets', 'icon.ico');

// Menu bar
function buildMenu() {
    const mainWindow = getMainWindow();
    return Menu.buildFromTemplate([
        // Navigation
        {
        label: '<',
        click: () => {
            if (mainWindow && mainWindow.webContents.navigationHistory.canGoBack()) {
                mainWindow.webContents.navigationHistory.goBack();
            }
        }
        },
        {
        label: '>',
        click: () => {
            if (mainWindow && mainWindow.webContents.navigationHistory.canGoForward()) {
                mainWindow.webContents.navigationHistory.goForward();
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
                mainWindow.loadURL(config.homeUrl);
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
                mainWindow.loadURL(config.inventoryUrl);
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
                mainWindow.loadURL(config.bankUrl);
                }
            }
            },

            // Crafting
            {
            label: 'Crafting',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.craftingUrl);
                }
            }
            },

            // Credit Shop
            {
            label: 'Credit Shop',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.creditShopUrl);
                }
            }
            },

            // Marketplace
            {
            label: 'Marketplace',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.marketplaceUrl);
                }
            }
            },

            // Storage
            {
            label: 'Storage',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.storageUrl);
                }
            }
            },

            // The Yard
            {
            label: 'The Yard',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.yardUrl);
                }
            }
            },

            // Vendor
            {
            label: 'Vendor',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.vendorUrl);
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
                mainWindow.loadURL(config.clanUrl);
                }
            }
            },

            // Fast Travel
            {
            label: 'Fast Travel',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.teleportUrl);
                }
            }
            },

            // Gambling Den
            {
            label: 'Gambling Den',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.gamblingUrl);
                }
            }
            },

            // Meeting Hall
            {
            label: 'Meeting Hall',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.forumUrl);
                }
            }
            },

            // Records
            {
            label: 'Records',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.recordsUrl);
                }
            }
            },
            { type: 'separator' },
            
            // Inner City
            {
                label: 'Inner City',
                click: () => {
                    mainWindow.loadURL(config.homeUrl);

                    mainWindow.webContents.once('did-finish-load', () => {
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof doPageChange === 'function') {
                                doPageChange(21, 1, false);
                            } else {
                                console.log('doPageChange not found yet.');
                            }
                        `);
                    });
                }
            }
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
                mainWindow.loadURL(config.friendsUrl);
                }
            }
            },

            // Messages
            {
            label: 'Messages',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.messagesUrl);
                }
            }
            },

            // Challenges
            {
            label: 'Challenges',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.challengesUrl);
                }
            }
            },

            // Collection
            {
            label: 'Collection',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.collectionUrl);
                }
            }
            },

            // Masteries
            {
            label: 'Masteries',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.masteriesUrl);
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
                mainWindow.loadURL(config.summaryUrl);
                }
            }
            },

            // Stats
            {
            label: 'Show Stats',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.statsUrl);
                }
            }
            },

            // Posts
            {
            label: 'Show Posts',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.postsUrl);
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
                    mainWindow.loadURL(config.accountSettingsUrl);
                    }
                }
                },
                {
                // 2FA
                label: '2FA Settings',
                enabled: true,
                click: () => {
                    if (mainWindow) {
                    mainWindow.loadURL(config.TFAUrl);
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
                mainWindow.loadURL(config.profileSettingsUrl);
                }
            }
            },

            // Message Options
            {
            label: 'Message Settings',
            enabled: true,
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.messageSettingsUrl);
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
            { label: 'Logout', click: logout() },
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
                    if (config.bossMapWindow && !config.bossMapWindow.isDestroyed()) {
                    config.bossMapWindow.focus();
                    } else {
                    config.bossMapWindow = new BrowserWindow({
                        width: 800,
                        height: 700,
                        icon: icon,
                        title: 'Boss Map',
                        autoHideMenuBar: true,
                        webPreferences: {
                        nodeIntegration: false
                        }
                    });

                    config.bossMapWindow.loadURL(config.profilerBossUrl);

                    config.bossMapWindow.webContents.on('did-finish-load', () => {
                        config.bossMapWindow.webContents.insertCSS(`
                        ::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        `);
                        config.bossMapWindow.webContents.executeJavaScript(`
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

                    config.bossMapWindow.on('closed', () => {
                        config.bossMapWindow = null;
                    });
                    }
                }
                },

                // Profiler Marketplace
                {
                label: 'Marketplace',
                click: () => {
                    if (config.marketplaceWindow && !config.marketplaceWindow.isDestroyed()) {
                    config.marketplaceWindow.focus();
                    } else {
                    config.marketplaceWindow = new BrowserWindow({
                        width: 1200,
                        height: 700,
                        icon: icon,
                        title: 'DFprofiler Marketplace',
                        autoHideMenuBar: true,
                        webPreferences: {
                        nodeIntegration: false
                        }
                    });

                    config.marketplaceWindow.loadURL(config.profilerMarketplaceUrl);

                    config.marketplaceWindow.webContents.on('did-finish-load', () => {
                        config.marketplaceWindow.webContents.insertCSS(`
                        ::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        `);
                        config.marketplaceWindow.webContents.executeJavaScript(`
                        document.body.style.backgroundImage = 'none';
                        document.body.style.backgroundColor = '#000000';
                        const elementsToHide = [
                            document.querySelector('.navbar'),
                            document.querySelector('.page-title'),
                        ];
                        elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                        `);
                    });

                    config.marketplaceWindow.on('closed', () => {
                        config.marketplaceWindow = null;
                    });
                    }
                }
                },

                // Stats Calculator
                {
                label: 'Stats Calculator',
                click: () => {
                    if (config.statsWindow && !config.statsWindow.isDestroyed()) {
                    config.statsWindow.focus();
                    } else {
                    config.statsWindow = new BrowserWindow({
                        width: 800,
                        height: 700,
                        icon: icon,
                        title: 'DFprofiler Stats Calculator',
                        autoHideMenuBar: true,
                        webPreferences: {
                        nodeIntegration: false
                        }
                    });

                    config.statsWindow.loadURL(config.profilerStatsUrl);

                    config.statsWindow.webContents.on('did-finish-load', () => {
                        statsWindow.webContents.insertCSS(`
                        ::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        `);
                        config.statsWindow.webContents.executeJavaScript(`
                        document.body.style.backgroundImage = 'none';
                        document.body.style.backgroundColor = '#000000';
                        const elementsToHide = [
                            document.querySelector('.navbar'),
                            document.querySelector('.page-title'),
                        ];
                        elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                        `);
                    });

                    config.statsWindow.on('closed', () => {
                        config.statsWindow = null;
                    });
                    }
                }
                },

                // Wardrobe
                {
                label: 'Wardrobe',
                click: () => {
                    if (config.wardrobeWindow && !config.wardrobeWindow.isDestroyed()) {
                    config.wardrobeWindow.focus();
                    } else {
                    config.wardrobeWindow = new BrowserWindow({
                        width: 1200,
                        height: 700,
                        icon: icon,
                        title: 'DFprofiler Wardrobe',
                        autoHideMenuBar: true,
                        webPreferences: {
                        nodeIntegration: false
                        }
                    });

                    config.wardrobeWindow.loadURL(config.profilerWardrobeUrl);

                    config.wardrobeWindow.webContents.on('did-finish-load', () => {
                        config.wardrobeWindow.webContents.insertCSS(`
                        ::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        `);
                        config.wardrobeWindow.webContents.executeJavaScript(`
                        document.body.style.backgroundImage = 'none';
                        document.body.style.backgroundColor = '#000000';
                        const elementsToHide = [
                            document.querySelector('.navbar'),
                            document.querySelector('.page-title'),
                        ];
                        elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                        `);
                    });

                    config.wardrobeWindow.on('closed', () => {
                        config.wardrobeWindow = null;
                    });
                    }
                }
                },

                // Damage Table
                {
                label: 'Damage Table',
                click: () => {
                    if (config.damageTableWidow && !config.damageTableWidow.isDestroyed()) {
                    config.damageTableWidow.focus();
                    } else {
                    config.damageTableWidow = new BrowserWindow({
                        width: 1200,
                        height: 700,
                        icon: icon,
                        title: 'DFprofiler Damage Table',
                        autoHideMenuBar: true,
                        webPreferences: {
                        nodeIntegration: false
                        }
                    });

                    config.damageTableWidow.loadURL(config.profilerDamageTableUrl);

                    config.damageTableWidow.webContents.on('did-finish-load', () => {
                        config.damageTableWidow.webContents.insertCSS(`
                        ::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        `);
                        config.damageTableWidow.webContents.executeJavaScript(`
                        document.body.style.backgroundImage = 'none';
                        document.body.style.backgroundColor = '#000000';
                        const elementsToHide = [
                            document.querySelector('.navbar'),
                            document.querySelector('.page-title'),
                        ];
                        elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                        `);
                    });

                    config.damageTableWidow.on('closed', () => {
                        config.damageTableWidow = null;
                    });
                    }
                }
                },

                // Statistics
                {
                label: 'Statistics',
                click: () => {
                    if (config.statisticsWindow && !config.statisticsWindow.isDestroyed()) {
                    config.statisticsWindow.focus();
                    } else {
                    config.statisticsWindow = new BrowserWindow({
                        width: 1200,
                        height: 700,
                        icon: icon,
                        title: 'DFprofiler Statistics',
                        autoHideMenuBar: true,
                        webPreferences: {
                        nodeIntegration: false
                        }
                    });

                    config.statisticsWindow.loadURL(config.profilerStatisticsUrl);

                    config.statisticsWindow.webContents.on('did-finish-load', () => {
                        config.statisticsWindow.webContents.insertCSS(`
                        ::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        `);
                        config.statisticsWindow.webContents.executeJavaScript(`
                        document.body.style.backgroundImage = 'none';
                        document.body.style.backgroundColor = '#000000';
                        const elementsToHide = [
                            document.querySelector('.navbar'),
                            document.querySelector('.page-title'),
                        ];
                        elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                        `);
                    });

                    config.statisticsWindow.on('closed', () => {
                        config.statisticsWindow = null;
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
                if (config.boostCalcWindow && !config.boostCalcWindow.isDestroyed()) {
                config.boostCalcWindow.focus();
                } else {
                // Create new window
                config.boostCalcWindow = new BrowserWindow({
                    width: 1000,
                    height: 700,
                    icon: icon,
                    title: 'Boosts Calculator',
                    autoHideMenuBar: true,
                    webPreferences: {
                    nodeIntegration: false
                    }
                });

                config.boostCalcWindow.loadURL(config.boostCalcUrl);

                config.boostCalcWindow.webContents.on('did-finish-load', () => {
                    config.boostCalcWindow.webContents.executeJavaScript(`
                    const section = document.querySelector('section');
                    if (section) {
                        section.style.padding = '50px';
                        section.style.margin = '0';
                        section.style.backgroundColor = '#000';
                    }
                    `);
                    config.boostCalcWindow.webContents.executeJavaScript(`
                    const elementsToHide = [
                        document.querySelector('.navbar')
                    ];
                    elementsToHide.forEach(el => { if (el) el.style.display = 'none'; });
                    `);
                });
                // config.boostCalcWindow.webContents.openDevTools();

                config.boostCalcWindow.on('closed', () => {
                    config.boostCalcWindow = null;
                });
                }
            }
            },

            // Wiki
            {
            label: 'Wiki',
            click: () => {
                // If window exists focus it
                if (config.wikiWindow && !config.wikiWindow.isDestroyed()) {
                config.wikiWindow.focus();
                } else {
                // Create new window
                config.wikiWindow = new BrowserWindow({
                    width: 1000,
                    height: 700,
                    icon: icon,
                    title: 'Wiki',
                    autoHideMenuBar: true,
                    webPreferences: {
                    nodeIntegration: false
                    }
                });

                config.wikiWindow.loadURL(config.wikiLink);

                config.wikiWindow.on('closed', () => {
                    config.wikiWindow = null;
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
                checked: config.currentTheme === 'light',
                click: () => setTheme('light')
                },
                {
                label: 'Dark',
                type: 'radio',
                checked: config.currentTheme === 'dark',
                click: () => setTheme('dark')
                },
                {
                label: 'System Default',
                type: 'radio',
                checked: config.currentTheme === 'system',
                click: () => setTheme('system')
                }
            ]
            },
            // Start the window maximized
            {
            label: 'Start Maximized',
            type: 'checkbox',
            checked: config.fullscreenOnStartup,
            click: (menuItem) => {
                const enabled = menuItem.checked;
                config.store.set('fullscreenOnStartup', enabled);
                config.fullscreenOnStartup = enabled;
                // Update menu
                updateMenu();
            }
            },
            // Automatic game launch
            {
            label: 'Launch game automatically',
            type: 'checkbox',
            checked: config.automaticGameLaunch,
            click: (menuItem) => {
                const enabled = menuItem.checked;
                config.automaticGameLaunch = enabled;           // update cached variable
                config.store.set('automaticGameLaunch', enabled); // persist the value
                updateMenu();
            }
            },
            // Enable outpost attack notification
            {
            label: 'Outpost Attack Notifications',
            type: 'checkbox',
            checked: config.oaNotification,
            click: (menuItem) => {
                const enabled = menuItem.checked;
                config.oaNotification = enabled;
                config.store.set('oaNotification', enabled);

                if (enabled) {
                if (!config.notificationSchedulerStarted) {
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
                label: 'Minimize App to tray on Close',
                type: 'checkbox',
                checked: config.minimizeToTray,
                click: (menuItem) => {
                    const enabled = menuItem.checked;
                    config.minimizeToTray = enabled;
                    config.store.set('minimizeToTray', enabled);
                    createTray();
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
            click: () => {
                if (mainWindow) {
                mainWindow.loadURL(config.guideUrl);
                }
            }
            },
            {
            label: 'FAQ',
            click: () => {
                // If window exists focus it
                if (config.faqWindow && !config.faqWindow.isDestroyed()) {
                config.faqWindow.focus();
                } else {
                // Create new window
                config.faqWindow = new BrowserWindow({
                    parent: mainWindow,
                    width: 1000,
                    height: 700,
                    title: 'FAQ',
                    icon: icon,
                    autoHideMenuBar: true,
                    webPreferences: {
                    nodeIntegration: false
                    }
                });

                config.faqWindow.setMenuBarVisibility(false);
                config.faqWindow.loadURL(config.faqLink);

                config.faqWindow.on('closed', () => {
                    config.faqWindow = null;
                });
                }
            }
            },
            {
            label: 'Contact Support',
            click: () => {
                // If window exists focus it
                if (config.supportWindow && !config.supportWindow.isDestroyed()) {
                config.supportWindow.focus();
                } else {
                // Create new window
                config.supportWindow = new BrowserWindow({
                    parent: mainWindow,
                    width: 1000,
                    height: 700,
                    title: 'Support',
                    icon: icon,
                    autoHideMenuBar: true,
                    webPreferences: {
                    nodeIntegration: false
                    }
                });

                config.supportWindow.setMenuBarVisibility(false);
                config.supportWindow.loadURL(config.supportLink);

                config.supportWindow.on('closed', () => {
                    config.supportWindow = null;
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

// Update the menu
function updateMenu() {
  const menu = buildMenu();
  Menu.setApplicationMenu(menu);
}

module.exports = {
    buildMenu,
    updateMenu
}