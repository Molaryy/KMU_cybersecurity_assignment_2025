# Lab B — Encrypt in Transit

This lab demonstrates securing communication between clients and a server using TLS/HTTPS and HSTS (HTTP Strict Transport Security).

## Overview

This setup includes:
- Nginx web server running in Docker
- Self-signed TLS certificate for HTTPS
- HSTS headers with 1-year max-age
- HTTP to HTTPS redirection
- Simple "Hello World" web page

## Prerequisites

- Docker installed
- Docker Compose installed
- OpenSSL (for generating certificates)

## Setup Instructions

### Step 1: Generate TLS Certificates

Run the certificate generation script:

```bash
chmod +x generate-certs.sh
./generate-certs.sh
```

This creates a self-signed certificate valid for 365 days in the `ssl/` directory.

### Step 2: Build and Run the Docker Container

Using Docker Compose (recommended):

```bash
docker-compose up -d --build
```

Or using Docker directly:

```bash
docker build -t lab-b-nginx .
docker run -d -p 80:80 -p 443:443 --name lab-b-nginx-https lab-b-nginx
```

### Step 3: Verify the Setup

The container should now be running. Proceed to the verification steps below.

## Verification

### 1. Browser Verification

Open your browser and navigate to:
```
https://localhost
```

Expected results:
- Browser shows a security warning (expected for self-signed certs)
- After accepting the warning, you should see "Hello World"
- Look for the padlock icon (though it may show as "Not Secure" due to self-signed cert)
- Check the certificate details in your browser

### 2. Verify HTTPS is Enforced

Try accessing via HTTP:
```
http://localhost
```

Expected result: Automatically redirects to `https://localhost`

### 3. Command-Line Verification

#### Check HTTPS Response Headers:

```bash
curl -Ik https://localhost
```

Expected output should include:
```
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

#### Check HTTP Redirect:

```bash
curl -I http://localhost
```

Expected output:
```
HTTP/1.1 301 Moved Permanently
Location: https://localhost/
```

#### Verify TLS Connection:

```bash
openssl s_client -connect localhost:443 -servername localhost
```

This shows detailed TLS handshake information including:
- Certificate chain
- TLS version (should be TLSv1.2 or TLSv1.3)
- Cipher suite used

### 4. Online Security Scanners

For a public-facing server, you can use:
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)

Note: These won't work for localhost.

## What's Configured

### TLS/SSL Configuration
- **Certificate**: Self-signed certificate (valid for 365 days)
- **Protocols**: TLSv1.2 and TLSv1.3
- **Ciphers**: Modern, secure cipher suites
- **Ports**: 80 (HTTP) and 443 (HTTPS)

### HSTS Configuration
Located in `nginx.conf`:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

- **max-age**: 31536000 seconds (1 year)
- **includeSubDomains**: Applies to all subdomains
- **preload**: Eligible for browser HSTS preload lists

### HTTP to HTTPS Redirection
All HTTP requests are automatically redirected to HTTPS with a 301 status code.

## Security Features

1. **TLS Encryption**: All traffic encrypted in transit
2. **HSTS**: Forces browsers to use HTTPS for future requests
3. **HTTP Redirect**: Prevents accidental HTTP access
4. **Additional Headers**:
   - X-Frame-Options: Prevents clickjacking
   - X-Content-Type-Options: Prevents MIME-sniffing
   - X-XSS-Protection: Enables XSS filtering

## Project Structure

```
lab_b/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose configuration
├── generate-certs.sh       # Certificate generation script
├── nginx.conf             # Nginx configuration with TLS and HSTS
├── index.html             # Simple Hello World page
├── ssl/                   # Directory for TLS certificates
│   ├── cert.pem          # TLS certificate
│   └── key.pem           # Private key
└── README.md             # This file
```

## Stopping the Server

Using Docker Compose:
```bash
docker-compose down
```

Using Docker:
```bash
docker stop lab-b-nginx-https
docker rm lab-b-nginx-https
```

## Troubleshooting

### Port Already in Use
If ports 80 or 443 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"
  - "8443:443"
```

Then access via `https://localhost:8443`

### Certificate Issues
If you need to regenerate certificates:
```bash
rm -rf ssl/
./generate-certs.sh
docker-compose up -d --build
```

### View Container Logs
```bash
docker-compose logs -f
```

Or:
```bash
docker logs lab-b-nginx-https
```

## Production Considerations

For production deployments:
1. Use a valid certificate from a trusted CA (e.g., Let's Encrypt)
2. Configure proper domain names instead of localhost
3. Implement certificate renewal automation
4. Consider using stronger key sizes (4096-bit RSA or ECDSA)
5. Enable OCSP stapling
6. Configure proper firewall rules

## Lab Assignment Checklist

- [x] Generate/obtain TLS certificate
- [x] Configure web server to serve HTTPS
- [x] Add HSTS header with reasonable max-age
- [x] Verify HTTPS works in browser (padlock icon)
- [x] Verify TLS enforcement with curl
- [x] Verify HSTS header is present
- [x] Verify HTTP redirects to HTTPS

## References

- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [OWASP Transport Layer Protection](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
- [HSTS Specification](https://tools.ietf.org/html/rfc6797)
