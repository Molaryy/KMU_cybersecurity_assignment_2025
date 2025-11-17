#!/bin/bash

echo "Starting services..."

# Start SSH
service ssh start
echo "SSH started on port 22"

# Start Nginx
service nginx start
echo "Nginx started on port 443"

# Start some additional services on ports that should be blocked
# This helps demonstrate that the firewall is working
echo "Starting test services on ports 80 and 8080 (should be blocked by firewall)..."
nc -l -p 80 > /dev/null 2>&1 &
nc -l -p 8080 > /dev/null 2>&1 &

# Apply iptables rules
echo ""
/usr/local/bin/setup-iptables.sh

echo ""
echo "=== Server is ready ==="
echo "Services running:"
echo "  - SSH on port 22 (ALLOWED by firewall)"
echo "  - HTTPS on port 443 (ALLOWED by firewall)"
echo "  - HTTP on port 80 (BLOCKED by firewall)"
echo "  - Test service on port 8080 (BLOCKED by firewall)"
echo ""
echo "Use 'docker exec -it lab-server /bin/bash' to access the server"
echo "Use the scanner container to run nmap scans"
echo ""

# Keep container running
tail -f /dev/null
