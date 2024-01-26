# How to run

install with `pnpm i`

run `pnpm dev`
it will run `NextJS` on `http://localhost:3000` and `oidc` on `http://localhost:3002`

# How to reproduce the bug

Change the version of `@auth/core` to `0.22.0+` (latest working is `0.21.0`) on root `package.json` and `pnpm i` again

Example:

```json
pnpm": {
    "overrides": {
      "@auth/core": "0.22.0"
    }
  }
```

### Version 0.21.0

In the terminal it's going to print normally that the session is `null` because there is no user logged

`@acme/nextjs:dev: session: null`

### Version 0.22.0+

In the terminal it's going to print normally that the session is a error because there is no user logged

`@acme/nextjs:dev: session: Error: This action with HTTP GET is not supported.`

And this error is thrown

```bash
@acme/nextjs:dev: [auth][error] UnknownAction: Cannot parse action at //session .Read more at https://errors.authjs.dev#unknownaction
@acme/nextjs:dev:     at parseActionAndProviderId (webpack-internal:///(rsc)/../../node_modules/@auth/core/lib/utils/web.js:98:27)
@acme/nextjs:dev:     at toInternalRequest (webpack-internal:///(rsc)/../../node_modules/@auth/core/lib/utils/web.js:40:40)
@acme/nextjs:dev:     at Auth (webpack-internal:///(rsc)/../../node_modules/@auth/core/index.js:75:103)
@acme/nextjs:dev:     at getSession (webpack-internal:///(rsc)/../../node_modules/next-auth/lib/index.js:20:60)
@acme/nextjs:dev:     at eval (webpack-internal:///(rsc)/../../node_modules/next-auth/lib/index.js:47:20)
@acme/nextjs:dev:     at AuthShowcase (webpack-internal:///(rsc)/./src/app/_components/auth-showcase.tsx:18:75)
@acme/nextjs:dev:     at attemptResolveElement (webpack-internal:///(rsc)/../../node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-server.edge.development.js:1451:30)
@acme/nextjs:dev:     at resolveModelToJSON (webpack-internal:///(rsc)/../../node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-server.edge.development.js:1754:41)
@acme/nextjs:dev:     at Array.toJSON (webpack-internal:///(rsc)/../../node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-server.edge.development.js:1293:28)
@acme/nextjs:dev:     at stringify (<anonymous>)

```
