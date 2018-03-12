#!/bin/bash

source env.sh

docker container run -p 9999:8888 --rm --name ${CONTAINER_NAME} -v $(pwd)/src:/usr/src/app/src ${CONTAINER_NAME}



