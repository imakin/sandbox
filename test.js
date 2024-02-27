const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function modifyRoomSituationQueue() {
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless())
    .build();

  try {
    await driver.get('http://127.0.0.1:8080');
    await driver.executeScript(() => {
      window.model_room.room_situation_queue = [3];
    });
  } finally {
    await driver.quit();
  }
}

modifyRoomSituationQueue();
