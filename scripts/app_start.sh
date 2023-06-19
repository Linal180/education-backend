#!/bin/bash
PRO_PM_DIR="$HOME/education-backend"

echo "call nvm shell"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

#  run api

echo "INSTALL PM2.........."

if [ -d "$HOME/.pm2" ]; then
  echo "pm2 is exits"
else
  echo "pm2 is installing"
  npm i -g pm2
fi

if [ -d "$HOME/.nvm/versions/node/v18.12.1/lib/serve" ]; then
  echo "serve is exits"
else
  echo "serve is installing"
  npm i -g serve
fi

echo "Moving to backend folder.........."
cd "${PRO_PM_DIR}"

echo "Starting backend with pm2 .........."
pm2 start "app.json"

echo "Started backend with pm2  successfully.........."

#  save pm2 processes
pm2 save
