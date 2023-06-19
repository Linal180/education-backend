#!/bin/bash

# directory name

PRO_DIR="$HOME/education-backend"

# give permission for everything in the app directory
sudo chmod -R 777 "$PRO_DIR"

# add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

nvm use 18.12.1

# install node modules
cd "${PRO_DIR}"
npm install