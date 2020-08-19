#!/usr/bin/env bash

set -e -o pipefail

RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
GRAY='\033[1;30m'
RESET=`tput sgr 0`

if [[ -z "${STACK_NAME}" ]]; then
    export STACK_NAME=fairshare
    printf "${GRAY}Environment variable STACK_NAME not set. Using ${STACK_NAME} as default.${NC}\n"
fi
if [[ -z "${AWS_REGION}" ]]; then
    export AWS_REGION=us-east-1
    printf "${GRAY}Environment variable AWS_REGION not set. Using ${AWS_REGION} as default.${NC}\n"
fi
if [[ -z "${AWS_PROFILE}" ]]; then
    printf "${RED}Please set the AWS_PROFILE environment variable.${NC}\n"
    exit 1
fi
