#!/bin/bash
cd /home/z/my-project
while true; do
  node .next/standalone/server.js -p 3000 2>/tmp/nextserver.log
  echo "Server died, restarting in 2s..." >> /tmp/nextserver.log
  sleep 2
done