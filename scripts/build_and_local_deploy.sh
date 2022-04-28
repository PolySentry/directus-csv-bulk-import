#!/bin/bash
npm run build

CONTAINER_ID=`docker ps -a | grep directus | awk '{print $1}'`
docker cp ./dist/index.js $CONTAINER_ID:/directus/extensions/modules/bulk-import/index.js

docker restart $CONTAINER_ID