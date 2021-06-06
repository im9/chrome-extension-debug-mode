(() => {
  const getCookie = (key) => {
    const allCookies = document.cookie.split(';').reduce((res, c) => {
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

  const isDebugMode = () => {
    const analysisParam = getCookie('debug-param');
    const params = Object.fromEntries(Object.entries(analysisParam).filter(param => param[0] === 'debug_mode'));
    return Object.keys(params).length;
  }

  const toggleDebugMode = () => {
    const el = document.getElementById('debug_mode');
    const url = new URL(window.location);
    const href = new URL(window.location.href);
    const isDebug = isDebugMode();

    if (isDebug) {
      if (!href.searchParams.get('debug_mode')) {
        url.searchParams.set('debug_mode', 'debug');
        window.history.pushState({}, '', url);
      }
      if (!el) {
        const div = document.createElement('div');
        div.textContent = 'Debug Mode';
        div.id = 'debug_mode';
        div.style.cssText = 'position: absolute; top: 16px; left: 26px; font-weight: bold; color: #007cb2; z-index: 100;';
        document.getElementsByTagName('body')[0].appendChild(div);
      }
    }
  }

  toggleDebugMode()
})();
