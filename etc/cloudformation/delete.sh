#!/usr/bin/env bash

source include.sh

printf "${YELLOW}You are about to delete the CloudFormation stack '${STACK_NAME}'.${RESET}\n"
read -p "Do you want to continue (y/n)? " -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  echo "Aborted."
  exit 1
fi
printf "\n"

printf "${GREEN}Delete Stack..${RESET}\n"
echo aws cloudformation delete-stack --stack-name ${STACK_NAME}
