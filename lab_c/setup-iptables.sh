#!/bin/bash

echo "=== Configuring iptables firewall ==="

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

echo "Step 1: Setting default policies to DROP (least privilege)"
# Set default policies to DROP
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

echo "Step 2: Allow loopback traffic"
# Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

echo "Step 3: Allow established and related connections"
# Allow established and related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

echo "Step 4: Allow new outgoing connections"
# Allow new outgoing connections (so the server can initiate connections)
iptables -A OUTPUT -m conntrack --ctstate NEW -j ACCEPT

echo "Step 5: Allow SSH (port 22)"
# Allow SSH
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT

echo "Step 6: Allow HTTPS (port 443)"
# Allow HTTPS
iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT

echo "Step 7: Current iptables rules:"
# Display the rules
iptables -L -v -n --line-numbers

echo ""
echo "=== Firewall configuration complete ==="
echo "Allowed ports: 22 (SSH), 443 (HTTPS)"
echo "Default policy: DROP for INPUT, FORWARD, and OUTPUT"
echo ""

# Save rules for persistence
echo "Saving iptables rules for persistence..."
netfilter-persistent save 2>/dev/null || iptables-save > /etc/iptables/rules.v4
