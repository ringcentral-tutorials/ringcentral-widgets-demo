# RingCentral FreshDesk extension


## Install for Development

1. `yarn start` to start development server, server address: https://localhost:8080
2. Go to Chrome extensions page.
3. Open developer mode
4. Load this project extension folder as unpacked package.
5. Go to `https://*.freshdesk.com/` to check

## To production

1. `HOSTING_URL=your_cdn_uri yarn build` to build widget codes
2. upload release folder to your cdn
3. replace `https://localhost:8080` with your cdn uri in `extension/content.js`, `extension/standalong.html` and `extension/manifest.json`;
4. upload extension folder to chrome store or send the folder to who want to install.
