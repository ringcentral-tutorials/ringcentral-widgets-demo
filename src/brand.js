import { createBrandConfig } from '@ringcentral-integration/commons/modules/Brand/createBrandConfig';

export default createBrandConfig({
  id: '1210',
  code: 'rc',
  name: 'RingCentral',
  appName: 'RingCentral',
  fullName: 'RingCentral',
  application: 'RingCentral Widgets',
  allowRegionSetting: true,
  callWithJupiter: {
    default: {
      link: 'https://app.ringcentral.com/',
      protocol: 'rcapp://',
      name: 'RingCentral',
    },
  },
  rcvTeleconference: 'https://v.ringcentral.com/teleconference/',
  meetingUriReg: {
    rcm: undefined,
    rcv: undefined,
  },
  spartanProtocol: 'rcmobile://',
  allowJupiterUniversalLink: true,
});
