#!/bin/bash

#download node and npm
echo "Running before Install script"
USER_DIR="/home/ssm-user"

#install nvm if it doesnt exist

if [ -d "$USER_DIR/.nvm/.git" ]; then
  echo "nvm is exits"
else
  echo "nvm is installing"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
fi

# call nvm shell
export NVM_DIR="$USER_DIR/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

if [ -d "$USER_DIR/.nvm/versions/node/v18.12.1" ]; then
  echo "node is already installed, skipping..."
else
  echo "node is installing"
  nvm install 18.12.1
fi

echo "Done with NVM installation"

#create our working directory if it doesnt exist
DIR="$USER_DIR/education-backend"
if [ -d "$DIR" ]; then
  echo "Education Backend exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi

echo "INSTALL yarn.........."
npm i -g yarn@1.22.19
