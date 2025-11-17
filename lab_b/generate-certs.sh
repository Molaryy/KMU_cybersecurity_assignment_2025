#!/bin/bash

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate self-signed certificate
echo "Generating self-signed TLS certificate..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=IT/CN=localhost"

echo "Certificate generated successfully!"
echo "Certificate: ssl/cert.pem"
echo "Private Key: ssl/key.pem"
echo ""
echo "Note: This is a self-signed certificate for testing purposes only."
echo "Your browser will show a security warning, which is expected."
