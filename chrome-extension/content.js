(() => {
  const domain = document.domain;

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

  const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    const params = `${name}=${encodeURIComponent(JSON.stringify(value) || '')}`
    document.cookie = `${params}; ${expires}; maxAge: ${60 * 60 * 24}; path=/`;
  }

  const toggleDebugMode = () => {
    const el = document.getElementById('debug_mode');
    const url = new URL(window.location);
    const href = new URL(window.location.href);
    const analysisParam = getCookie('debug-param');
    const isDebug = isDebugMode();

    if (!isDebug) {
      const params = {
        ...analysisParam,
        debug_mode: 'debug'
      }
      setCookie('debug-param', params);
      if (!href.searchParams.get('debug_mode')) url.searchParams.set('debug_mode', 'debug');
      if (!el) {
        const div = document.createElement('div');
        div.textContent = 'Debug Mode';
        div.id = 'debug_mode';
        div.style.cssText = 'position: absolute; top: 16px; left: 26px; font-weight: bold; color: #007cb2; z-index: 100;';
        document.getElementsByTagName('body')[0].appendChild(div);
      }
    } else {
      const params = Object.fromEntries(Object.entries(analysisParam).filter(param => param[0] !== 'debug_mode'));
      setCookie('debug-param', params);

      if (href.searchParams.get('debug_mode')) url.searchParams.delete('debug_mode');
      if (el) el.remove();
    }
    window.history.pushState({}, '', url);
  }

  const isDebugMode = () => {
    const analysisParam = getCookie('debug-param');
    const params = Object.fromEntries(Object.entries(analysisParam).filter(param => param[0] === 'debug_mode'));
    return Object.keys(params).length;
  }

  chrome.runtime.onMessage.addListener(
    (request, sender, response) => {
      switch (request.message) {
        case 'isDebugMode':
          response(isDebugMode());
          break;
        case 'toggleDebugMode':
          toggleDebugMode();
          response(isDebugMode());
          break;
        case 'getDomain':
          response(domain);
          break;
        case 'getCookies':
          response(getCookie('debug-param'));
          break;
        default:
          response('unknown request');
          break;
      }
      return true
    }
  );
})();
