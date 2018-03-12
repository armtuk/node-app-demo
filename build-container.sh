#!/bin/bash

source env.sh

docker build -t ${CONTAINER_NAME} .
