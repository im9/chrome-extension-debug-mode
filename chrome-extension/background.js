let debugMode = false

const getCookie = (cookies) => {
  const allCookies = cookies.split(';').reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent);
    const allNumbers = str => /^\d+$/.test(str);
    try {
      return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {});
  return allCookies[key] ?? '';
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match('https://github.com/im9/chrome-extension-debug-mode')) {
    chrome.pageAction.show(tabId);

    chrome.cookies.get({ url: tab.url, name: 'debug-params' }, (cookie) => {
      const params = cookie && cookie.value;
      debugMode = params && params.includes('debug_mode');
    });
  }
  if (changeInfo.status === 'complete' && tab.url.match('https://github.com/im9/chrome-extension-debug-mode') && !!debugMode) {
    chrome.tabs.executeScript(tabId, { file: './event.js' }, (result) => {
      console.log(`executed: ${result}`);
    });
  }
});
