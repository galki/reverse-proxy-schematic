[![CircleCI](https://circleci.com/gh/unitedhubs/reverse-proxy-schematic.svg?style=svg)](https://circleci.com/gh/unitedhubs/reverse-proxy-schematic)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# reverse-proxy-schematic
Angular schematic for a development SSL wildcard reverse-proxy

### What is it for?
It will allow you to serve `http://localhost:4200` from a secured local domain like `https://example.localhost`. You can also add subdomains such that `http://localhost:4201` will be served from `https://subdomain.example.localhost`.

### Installation
1. Download the source code to `/path/to/reverse-proxy-schematic`
2. Go to your workspace and:
```
npm link /path/to/reverse-proxy-schematic
ng g /path/to/reverse-proxy-schematic/src/collection.json:proxy --hostname="example.localhost" --apiPort="5000" --apiRoute="api"
```
The `apiPort` and `apiRoute` args are optional and default to `5000` and `api`, respectively. If using cloud functions for the backend, you can provide the locally served URL (ex: `5000/example-com/us-central1`) to the `apiPort`.

### This schematic adds
1. a `proxy` folder to the root of your workspace
2. `generate.proxy.cert` and `proxy` scripts to package.json

### What you need to setup
1. update contents of `proxy/cert/proxy.csr.cnf` (change `[COUNTRY CODE]` to `US` and so on)
2. run `npm run generate.proxy.cert`
3. add `/proxy/cert/ssl/rootCA.pem` to your browser's _Trusted Root Certification Authorities_
4. add the hostname domain and any subdomains to [your local hosts file](https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992)
5. add custom scripts to package.json to serve each app via proxy **(script name must start with _`start.`_)**:
```
  scripts: {
    //
    "start.app1": "ng serve --project=app1 --host=example.localhost --port=4200",
    "start.app2": "ng serve --project=app2 --host=subdomain.example.localhost --port=4201"
  }
```

Then `npm run proxy` (or `npm run proxy -- -s`), `npm run start.app1`, `npm run start.app2` and open `https://example.localhost`
