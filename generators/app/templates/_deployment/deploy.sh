#!/bin/bash

# enable debug
set -x

if [ -f ~/.bash_profile ]; then
    . ~/.bash_profile
fi

# THESE self-set variables are used by our scripting

PROJECT_NAME=uba-website
GRUNT_FAIL_EMAILS="developers@themonkeys.com.au"

# THESE variables are provided by the git post-receive hook

DEPLOYMENT_CACHE_ROOT=""
DEPLOYMENT_TARGET=""

while getopts r:t: OPTION
do
   case "$OPTION" in 
     r) DEPLOYMENT_CACHE_ROOT="$OPTARG";; 
     t) DEPLOYMENT_TARGET="$OPTARG" ;; 
     *) ;;
   esac
done

# NOTE: DEST_WEBROOT below is the target root folder; the Apache DocumentRoot is set in the VirtualHost config

# NOTE: you can do whatever you want below...

if [ ! -z $DEPLOYMENT_TARGET ] && [ $DEPLOYMENT_TARGET = 'stage' ]; then

  SOURCE_ROOT=$DEPLOYMENT_CACHE_ROOT/build/
  DEST_SERVER=stage2.monkeylabs.com.au
  DEST_WEBROOT=/var/www/stage/uba-website-stage.monkeylabs.com.au/public
  
  # do gulp build
  cd $SOURCE_ROOT
  ln -s ~/node_modules
  cd ..
  npm install --python=python2.6
  #bower install
  cd $SOURCE_ROOT
  GULP_ERROR=`~/node_modules/.bin/gulp build 2>&1`
  if [ $? -gt 0 ]; then
    echo 'gulp build failed'
    echo $GULP_ERROR | mail -s "gulp build failed for $PROJECT_NAME" $GULP_FAIL_EMAILS
    exit 1
  fi
  rm node_modules

  # upload to the webroot
  rsync -avz --exclude=deployment --exclude=.git $SOURCE_ROOT/public/ $DEST_SERVER:$DEST_WEBROOT/

  # upload components
  rsync -avz --exclude=deployment --exclude=.git $SOURCE_ROOT/../components $DEST_SERVER:$DEST_WEBROOT/../

  # upload server.js, package.json
  perl -pe "s#'..', 'components'#'components'#" -i $SOURCE_ROOT/server.js
  rsync -avz --exclude=deployment --exclude=.git $SOURCE_ROOT/server.js $SOURCE_ROOT/server-runner.js $SOURCE_ROOT/lib $SOURCE_ROOT/../package.json $DEST_SERVER:$DEST_WEBROOT/../

  # npm install, restart server.js
  ssh $DEST_SERVER "killall -9 node 2>/dev/null; cd $DEST_WEBROOT/../ && npm install"
  ssh -f -n $DEST_SERVER "cd $DEST_WEBROOT/../ && nohup node server-runner.js >/dev/null 2>&1 &"
  

elif [ ! -z $DEPLOYMENT_TARGET ] && [ $DEPLOYMENT_TARGET = 'live' ] ; then

  echo 'no live target';
  exit 1;


else 

  echo "DEPLOYMENT_CACHE_ROOT and DEPLOYMENT_TARGET not set!"
  exit 1

fi