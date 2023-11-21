import { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'iampocket-wallet',
      region: 'ap-northeast-2',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        customDomain: {
          domainName: stack.stage === "prod" ? "demo-app.iampocket.com" : "dev-app.iampocket.com",
          hostedZone: 'iampocket.com',
        },
      });
      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
