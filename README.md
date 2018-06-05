# RingCentral Widgets Demo

A new RingCentral Widgets Based demo app. Get online tutorial about how to build this app in [here](https://embbnux.github.io/ringcentral-widgets-demo/).

## Prerequisites

* Install Node.js with version >= 8
* Install NPM or Yarn
* Create a [RingCentral developer free account](https://developer.ringcentral.com) to create a new app with platform type - "Browser Based"
* Install [Ringcentral Widgets CLI](https://github.com/ringcentral/ringcentral-js-widgets/tree/master/packages/ringcentral-widgets-cli)

```bash
$ npm install -g ringcentral-widgets-cli
```

## Start

### Initialize Widgets App by `Ringcentral Widgets CLI`

```bash
$ rc-widgets new ringcentral-widgets-demo
$ cd ringcentral-widgets-demo
$ yarn
```

### Update config file `.env`

```
RINGCENTRAL_CLIENT_ID=your ringcentral app client id
RINGCENTRAL_CLIENT_SECRET=your ringcentral app client secret
RINGCENTRAL_SERVER_URL=ringcentral api server, eg: https://platform.devtest.ringcentral.com
REDIRECT_URI=your redirect uri, eg: http://localhost:8080/redirect.html
```

### Start Development Server

```bash
$ yarn start
```

### Build for production

Update `REDIRECT_URI` and `RINGCENTRAL_SERVER_URL` with config in production

```
RINGCENTRAL_SERVER_URL=https://platform.ringcentral.com
REDIRECT_URI=your_host_address/redirect.html
```

```bash
$ yarn build
```

Upload files in release folder to your web host.

## [Tutorials](https://embbnux.github.io/ringcentral-widgets-demo/)

[x] Create a base RingCentral Widget Project
[x] Add call history feature to App
[x] Add ringout call feature to App
[ ] Add a new module
