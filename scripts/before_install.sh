#!/bin/bash

#download node and npm
echo "Running before Install script"

#install nvm if it doesnt exist

if [ -d "$HOME/.nvm/.git" ]; then
  echo "nvm is exits"
else
  echo "nvm is installing"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
fi

# call nvm shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

if [ -d "$HOME/.nvm/versions/node/v18.12.1" ]; then
  echo "node is already installed, skipping..."
else
  echo "node is installing"
  nvm install 18.12.1
fi

echo "Done with NVM installation"

echo "Checking PM2 install"
if [ -d "$HOME/.pm2" ]; then
  echo "pm2 is exits"
else
  echo "pm2 is installing"
  npm i -g pm2
fi


#create our working directory if it doesnt exist
# DIR="/home/education-backend"
# if [ -d "$DIR" ]; then
#   echo "Education Backend exists. Deleting and rebuilding"
#   cd $DIR
#   pm2 stop "app.json"
#   cd ..
#   rm -rf $DIR
# else
#   echo "New instance"
# fi

# echo "Creating directory ${DIR}"
# mkdir ${DIR}
