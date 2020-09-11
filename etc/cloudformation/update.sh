#!/usr/bin/env bash

source include.sh

printf "${GREEN}Update Stack..${RESET}\n"
aws cloudformation update-stack --stack-name $STACK_NAME --template-body file://main.yaml --parameters file://parameters.json
