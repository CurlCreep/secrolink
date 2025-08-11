// src/main/notification.js
const { Notification } = require('electron');
const config = require('../config/config');
const path = require('path');

// Notification
function showNotification() {
  new Notification({
    title: 'Outpost is under attack!',
    body: 'Next outpost attack is in 3 hours.',
    icon: path.join(__dirname, '../../assets', 'icon.ico'),
  }).show();
}

// Check every minute if now matches any trigger time
function startNotificationScheduler() {
  if (config.notificationIntervalId !== null) return; // Already running

  console.log('Outpost Notification Scheduler Started');

  config.notificationIntervalId = setInterval(() => {
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
    const activeTimes = isSummer ? config.OASummerTimes : config.OAWinterTimes;

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
  config.notificationSchedulerStarted = true;
}

// Stops the scheduler
function stopNotificationScheduler() {
  if (config.notificationIntervalId !== null) {
    clearInterval(config.notificationIntervalId);
    config.notificationIntervalId = null;
    config.notificationSchedulerStarted = false;
    console.log('Outpost Notification Scheduler Stopped');
  }
}

module.exports = {
    showNotification,
    startNotificationScheduler,
    stopNotificationScheduler
}