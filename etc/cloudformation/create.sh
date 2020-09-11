#!/usr/bin/env bash

source include.sh

printf "${GREEN}Create Stack..${RESET}\n"
aws cloudformation create-stack --stack-name $STACK_NAME --template-body file://main.yaml --parameters file://parameters.json  --capabilities CAPABILITY_IAM
