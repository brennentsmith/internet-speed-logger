#!/bin/bash

set -ex

IMAGE_NAME="ghcr.io/jeffbyrnes/internet-speed-logger"
TAG=$(git rev-parse --short HEAD)

docker build -t "${IMAGE_NAME}:${TAG}" .
docker tag "${IMAGE_NAME}:${TAG}" "${IMAGE_NAME}:latest"
docker push "${IMAGE_NAME}"
