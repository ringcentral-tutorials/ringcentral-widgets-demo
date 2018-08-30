import logoUrl from './assets/images/VIE_Logo_RC.svg';
import Adapter from './lib/Adapter';
import prefix from './prefix';

const version = process.env.APP_VERSION;
const appUrl = `${process.env.HOSTING_URL}/index.html`;

function obj2uri(obj) {
  if (!obj) {
    return '';
  }
  const urlParams = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      urlParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    }
  });
  return urlParams.join('&');
}
const appUri = `${appUrl}?${obj2uri({
  _t: Date.now(),
})}`;

function init() {
  if (window.RCAdapter) {
    return;
  }
  window.RCAdapter = new Adapter({
    logoUrl,
    appUrl: appUri,
    version,
    prefix,
  });
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
