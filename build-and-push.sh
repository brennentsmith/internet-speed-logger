#!/bin/bash

set -ex

PARENT_DIR=$(basename "${PWD%/*}")
IMAGE_NAME="brennentsmith/internet-speed-logger"
TAG=$(git rev-parse --short HEAD)

docker build -t ${IMAGE_NAME}:${TAG} .
docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}
