FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    iptables \
    iptables-persistent \
    openssh-server \
    nginx \
    netcat-openbsd \
    net-tools \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /var/run/sshd
RUN echo 'root:password' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

RUN echo "server { listen 443; location / { return 200 'HTTPS Service Active\\n'; add_header Content-Type text/plain; } }" > /etc/nginx/sites-available/default

COPY setup-iptables.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/setup-iptables.sh

COPY start-services.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start-services.sh

EXPOSE 22 443 80 8080

CMD ["/usr/local/bin/start-services.sh"]
