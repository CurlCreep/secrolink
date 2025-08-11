// src/config/config.js
const Store = require('electron-store').default;
const store = new Store();

let username = null;

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

let currentTheme = store.get('theme') || 'system';
let automaticGameLaunch = store.get('automaticGameLaunch', false);
let notificationSchedulerStarted = false;
let oaNotification = store.get('oaNotification', false);
let notificationIntervalId = null;
let tray = null;
let minimizeToTray = store.get('minimizeToTray', false);

const url = 'https://fairview.deadfrontier.com';
const lastUserUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo';
const wikiLink = 'https://deadfrontier.fandom.com/wiki/Dead_Frontier_Wiki';
const faqLink = 'https://support.deadfrontier.com/kb';
const supportLink = 'https://support.deadfrontier.com/discussion/new';
const guideUrl = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=17';

const profilerBossUrl = 'https://www.dfprofiler.com/bossmap';
const profilerMarketplaceUrl = 'https://www.dfprofiler.com/marketplace';
const profilerStatsUrl = 'https://www.dfprofiler.com/statcalculator';
const profilerWardrobeUrl = 'https://www.dfprofiler.com/wardrobe';
const profilerDamageTableUrl = 'https://www.dfprofiler.com/damage';
const profilerStatisticsUrl = 'https://www.dfprofiler.com/statistics';

const boostCalcUrl = 'https://dfbuddy.com/boostcalculator/';

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

const lastUserCookie = 'lastLoginUser';
const seshCookie = 'PHPSESSID';

const fullscreenOnStartup = store.get('fullscreenOnStartup', false);

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

module.exports = {
  store,
  username,
  wikiWindow,
  faqWindow,
  supportWindow,
  bossMapWindow,
  marketplaceWindow,
  statsWindow,
  wardrobeWindow,
  damageTableWidow,
  statisticsWindow,
  boostCalcWindow,
  currentTheme,
  automaticGameLaunch,
  notificationSchedulerStarted,
  oaNotification,
  notificationIntervalId,
  tray,
  minimizeToTray,
  url,
  lastUserUrl,
  wikiLink,
  faqLink,
  supportLink,
  guideUrl,
  profilerBossUrl,
  profilerMarketplaceUrl,
  profilerStatsUrl,
  profilerWardrobeUrl,
  profilerDamageTableUrl,
  profilerStatisticsUrl,
  boostCalcUrl,
  homeUrl,
  inventoryUrl,
  bankUrl,
  craftingUrl,
  creditShopUrl,
  marketplaceUrl,
  storageUrl,
  yardUrl,
  clanUrl,
  teleportUrl,
  gamblingUrl,
  forumUrl,
  recordsUrl,
  vendorUrl,
  messagesUrl,
  challengesUrl,
  masteriesUrl,
  summaryUrl,
  statsUrl,
  postsUrl,
  collectionUrl,
  accountSettingsUrl,
  TFAUrl,
  profileSettingsUrl,
  messageSettingsUrl,
  friendsUrl,
  lastUserCookie,
  seshCookie,
  fullscreenOnStartup,
  OASummerTimes,
  OAWinterTimes,
};
