#!/bin/sh

# create proxy.csr and proxy.key
openssl req -new -sha256 -nodes -out ./ssl/proxy.csr -newkey rsa:2048 -keyout ./ssl/proxy.key -config ./proxy.csr.cnf

# create proxy.crt
openssl x509 -passin pass:1234 -req -in ./ssl/proxy.csr -CA ./ssl/rootCA.pem -CAkey ./ssl/rootCA.key -CAcreateserial -out ./ssl/proxy.crt -days 500 -sha256 -extfile v3.ext

# verify (should output 'OK')
openssl verify -CAfile ./ssl/rootCA.pem ./ssl/proxy.crt
