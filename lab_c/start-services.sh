#!/bin/bash

service ssh start
service nginx start

nc -l -p 80 > /dev/null 2>&1 &
nc -l -p 8080 > /dev/null 2>&1 &

/usr/local/bin/setup-iptables.sh

tail -f /dev/null
