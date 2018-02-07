# Ringcentral Widgets Demo

A new RingCentral Widgets Based demo app

## Prerequisites

* Install Node.js with version > 8
* Install NPM or Yarn
* Create a [RingCentral developer free account](https://developer.ringcentral.com) to create a new app with platform type - "Browser Based"
* Install [Yeoman](http://yeoman.io) and [Generator Ringcentral Widgets](https://github.com/embbnux/generator-ringcentral-widgets)

```bash
$ yarn install -g yo
$ yarn install -g generator-ringcentral-widgets
```

## Start

Initialize Widgets App by `Generator Ringcentral Widgets`

```bash
$ mkdir ringcentral-widgets-demo
$ cd ringcentral-widgets-demo
$ yo ringcentral-widgets
```

Update config file `.env`

```
API_CLIENT_ID=your ringcentral app client id
API_CLIENT_SECRET=your ringcentral app client secret
API_SERVER=ringcentral api server, eg: https://platform.devtest.ringcentral.com
REDIRECT_URI=your redirect uri, eg: http://localhost:8080/redirect.html
```

Start Development Server

```bash
$ yarn start
```