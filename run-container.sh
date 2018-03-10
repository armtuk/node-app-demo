#!/bin/bash

docker container run -p 9999:8888 --rm --name node-app -v `pwd`/src:/usr/src/app/src node-app



