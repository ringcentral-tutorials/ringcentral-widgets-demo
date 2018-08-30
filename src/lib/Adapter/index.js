import classnames from 'classnames';
import AdapterCore from 'ringcentral-widgets/lib/AdapterCore';
import messageTypes from './messageTypes';

import styles from './styles.scss';

class Adapter extends AdapterCore {
  constructor({
    logoUrl,
    appUrl,
    prefix = 'rc-widget',
    version,
    appWidth = 300,
    appHeight = 500,
    zIndex = 999,
  } = {}) {
    const container = document.createElement('div');
    container.id = prefix;
    container.setAttribute('class', classnames(styles.root, styles.loading));
    container.draggable = false;
    super({
      prefix,
      container,
      styles,
      messageTypes,
      defaultDirection: 'right',
    });
    this._messageTypes = messageTypes;
    this._zIndex = zIndex;
    this._appWidth = appWidth;
    this._appHeight = appHeight;
    this._generateContentDOM();
    const styleList = document.querySelectorAll('style');
    for (let i = 0; i < styleList.length; ++i) {
      const styleEl = styleList[i];
      if (styleEl.innerHTML.indexOf('https://{{rc-styles}}') > -1) {
        this.styleEl = styleEl;
      }
    }
    if (this.styleEl) {
      this._root.appendChild(this.styleEl.cloneNode(true));
    }
    this._setAppUrl(appUrl);
    this._setLogoUrl(logoUrl);

    this._version = version;
    window.addEventListener('message', (e) => {
      const data = e.data;
      this._onMessage(data);
    });
  }

  _onMessage(data) {
    if (data) {
      console.log(data);
      switch (data.type) {
        case 'rc-call-ring-notify':
          this.setMinimized(false);
          break;
        default:
          super._onMessage(data);
          break;
      }
    }
  }

  _onHeaderClicked() {
    //
  }

  _setAppUrl(appUrl) {
    this._appUrl = appUrl;
    if (appUrl) {
      this.contentFrameEl.src = appUrl;
      this.contentFrameEl.id = `${this._prefix}-adapter-frame`;
    }
  }

  _postMessage(data) {
    if (this._contentFrameEl.contentWindow) {
      this._contentFrameEl.contentWindow.postMessage(data, '*');
    }
  }

  setRinging(ringing) {
    this._ringing = !!ringing;
    this._renderMainClass();
  }

  gotoPresence() {
    this._postMessage({
      type: 'rc-adapter-goto-presence',
      version: this._version,
    });
  }
}

export default Adapter;
