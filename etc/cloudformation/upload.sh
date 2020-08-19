#!/usr/bin/env bash

source include.sh
set +e

STACK=`aws cloudformation describe-stacks --stack-name ${STACK_NAME} 2>/dev/null`
EXITCODE=$?
if [ $EXITCODE -ne 0 ]; then
    printf "${RED}Stack ${STACK_NAME} does not exist${RED}. You have to create it first.\n"
    exit 1
fi

RESOURCES=`aws cloudformation describe-stack-resources --stack-name ${STACK_NAME}`
BUCKET=`echo "${RESOURCES}"|jq -r '.StackResources[]|select(.ResourceType == "AWS::S3::Bucket")|.PhysicalResourceId'`

printf "${GREEN}Upload assets..${RESET}\n"
printf "${GREEN}Bucket: ${BUCKET}${RESET}\n"
aws s3 sync ../../dist/ s3://$BUCKET --delete
printf "${GREEN}Done${RESET}\n"
