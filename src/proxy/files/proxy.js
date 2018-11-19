const fs = require('fs');
const path = require('path');
const httpProxy = require('http-proxy');
const https = require('https');

const apiPortPath = <%= apiPort %>;
const apiRoute = '/<%= apiRoute %>/';
const proxyPort = 443;

// extract hosts and ports from package.json scripts
const hostPorts = {};
const packageJson = require('../package.json');
for (const script of Object.keys(packageJson.scripts)) {
  if (script.startsWith('start.')) {
    const args = packageJson.scripts[script].split(' --');
    const temp = {};
    args.forEach(arg => {
      const argPair = arg.split(/[ =]+/);
      if (argPair[0] === 'host') {
        temp.host = argPair[1];
      } else if (argPair[0] === 'port') {
        temp.port = argPair[1];
      }
    });
    if (temp.host !== undefined && temp.port !== undefined) {
      hostPorts[temp.host] = temp.port;
    }
  }
}

// start proxy
const proxy = httpProxy.createProxy();
const sslPath = path.resolve(__dirname, 'cert/ssl');
const options = {
  key: fs.readFileSync(`${sslPath}/proxy.key`),
  cert: fs.readFileSync(`${sslPath}/proxy.crt`),
};

https
  .createServer(options, (req, res) => {
    let portPath = hostPorts[req.headers.host];
    if (req.url.startsWith(apiRoute)) {
      portPath = apiPortPath;
    }

    const target = `http://localhost:${portPath}`;
    console.log(
      `proxying ${req.headers.host}${req.url} to ${target}${req.url}`
    );
    if (target !== undefined) {
      proxy.web(req, res, { target }, error => {
        console.error('PROXY ERROR:', error);
      });
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.write('server error');
      res.end();
    }
  })
  .listen(proxyPort);
