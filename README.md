## worker-fal-ai-proxy

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/denizcdemirci/worker-fal-ai-proxy)

This template is a simple [fal.ai](https://fal.ai) proxy for Cloudflare Workers. It is prepared for [server-side integration](https://fal.ai/docs/model-endpoints/server-side) and is compatible with Cloudflare Workers.

[`src/index.ts`](https://github.com/denizcdemirci/worker-fal-ai-proxy/blob/main/src/index.ts) is the content of the Workers script.

## Setup

To use this template, use one of the following commands:

```sh
$ npx wrangler generate worker-fal-ai-proxy https://github.com/denizcdemirci/worker-fal-ai-proxy
# or
$ yarn wrangler generate worker-fal-ai-proxy https://github.com/denizcdemirci/worker-fal-ai-proxy
# or
$ pnpm wrangler generate worker-fal-ai-proxy https://github.com/denizcdemirci/worker-fal-ai-proxy
```

This template uses fal.ai Key-Based Authentication and requires one key. You can create a key [here](https://fal.ai/dashboard/keys).

Before publishing your script, you need to edit the `wrangler.toml` file. Add your fal.ai key `FAL_KEY` this file. More information about configuring and publishing your script can be found [in the documentation](https://developers.cloudflare.com/workers/get-started/guide/).

Once you are ready, you can publish your script by running the following command:

```sh
$ npm run deploy
# or
$ yarn run deploy
# or
$ pnpm run deploy
```

## Configure the client

To use the proxy, you need to configure the client to use the proxy endpoint. You can do that by setting the `proxyUrl` option in the client configuration:

```js
import * as fal from "@fal-ai/serverless-client";

fal.config({
  proxyUrl: "https://your-worker.workers.dev",
});
```

For more information, please refer to the [fal.ai documentation](https://fal.ai/docs).

## Notes

Although this is a nice alternative to hide `FAL_KEY`, please note that this endpoint will be publicly available. I recommend adding your own authentication structure and updating the headers in [`src/index.ts`](https://github.com/denizcdemirci/worker-fal-ai-proxy/blob/main/src/index.ts).
