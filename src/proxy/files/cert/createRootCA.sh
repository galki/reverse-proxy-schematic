#!/bin/sh

rm -Rf ./ssl
mkdir ./ssl

# create rootCA.key
openssl genrsa -des3 -passout pass:1234 -out ./ssl/rootCA.key 2048

# create rootCA.pem
openssl req -passin pass:1234 -x509 -new -nodes -key ./ssl/rootCA.key -sha256 -days 1024 -out ./ssl/rootCA.pem -config ./proxy.csr.cnf
