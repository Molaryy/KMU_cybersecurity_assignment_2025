# Lab C - Host Firewall with iptables

This lab demonstrates host-based firewall configuration using iptables in a Docker environment.

## Architecture

- **Server Container** (172.20.0.10): Ubuntu with iptables, SSH, and Nginx
- **Scanner Container** (172.20.0.20): nmap for testing the firewall

## Firewall Configuration

### Default Policies
- INPUT: DROP (deny all incoming traffic by default)
- OUTPUT: DROP (deny all outgoing traffic by default)
- FORWARD: DROP (deny all forwarded traffic)

### Allowed Traffic
- **Loopback**: All traffic on lo interface
- **Established/Related**: Connections that are already established
- **SSH (Port 22)**: Incoming SSH connections
- **HTTPS (Port 443)**: Incoming HTTPS connections

### Services Running
- SSH on port 22 (ALLOWED)
- Nginx on port 443 (ALLOWED)
- Test service on port 80 (BLOCKED)
- Test service on port 8080 (BLOCKED)

## Usage

### 1. Build and Start the Environment

```bash
docker-compose up -d --build
```

### 2. Verify iptables Rules on Server

```bash
docker exec -it lab-server iptables -L -v -n --line-numbers
```

### 3. Run nmap Scans from Scanner Container

Scan all ports (common):
```bash
docker exec -it lab-scanner nmap -p 1-1000 172.20.0.10
```

Scan specific ports:
```bash
docker exec -it lab-scanner nmap -p 22,80,443,8080 172.20.0.10
```

Aggressive scan with service detection:
```bash
docker exec -it lab-scanner nmap -A -p 22,80,443,8080 172.20.0.10
```

### 4. Expected Results

✅ **Port 22 (SSH)**: Should show as **open**
✅ **Port 443 (HTTPS)**: Should show as **open**
❌ **Port 80 (HTTP)**: Should show as **filtered** or **closed**
❌ **Port 8080**: Should show as **filtered** or **closed**

### 5. Test SSH Connection

From scanner container:
```bash
docker exec -it lab-scanner nc -zv 172.20.0.10 22
docker exec -it lab-scanner nc -zv 172.20.0.10 80
```

### 6. Access Server Container

```bash
docker exec -it lab-server /bin/bash
```

Once inside, you can:
- View iptables rules: `iptables -L -v -n`
- Check services: `netstat -tulpn`
- Modify rules: `iptables -A INPUT -p tcp --dport PORT -j ACCEPT`

### 7. View Logs

```bash
docker-compose logs server
```

### 8. Stop the Environment

```bash
docker-compose down
```

## Lab Report Checklist

- [ ] Screenshot of iptables rules showing default DROP policies
- [ ] Screenshot of nmap scan showing only ports 22 and 443 open
- [ ] Screenshot demonstrating that ports 80 and 8080 are blocked
- [ ] Explanation of each iptables rule and its purpose
- [ ] Discussion of the principle of least privilege

## Persistence

The iptables rules are saved to `/etc/iptables/rules.v4` in the container. In a real system, you would use:
- Debian/Ubuntu: `netfilter-persistent save`
- RHEL/CentOS: `service iptables save`
- systemd: Create a systemd service to load rules on boot

## Troubleshooting

**Container won't start or iptables doesn't work:**
- Ensure Docker is running with proper permissions
- The server container runs in privileged mode (required for iptables)

**Can't connect to any ports:**
- Check if iptables rules are applied: `docker exec lab-server iptables -L`
- Verify services are running: `docker exec lab-server netstat -tulpn`

**nmap shows all ports as filtered:**
- This is expected for ports that have no service running but are blocked by iptables
- Ports 22 and 443 should show as "open" since they have services listening
