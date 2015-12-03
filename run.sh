#!/usr/bin/env bash

export VELOCITY_DEBUG=1

#these are about to get canned
export JASMINE_CLIENT_UNIT=0
export JASMINE_SERVER_UNIT=0

export JASMINE_CLIENT_INTEGRATION=1
export JASMINE_SERVER_INTEGRATION=1
export CUCUMBER=1
export VELOCITY_TEST_PACKAGES=0

if [ "$1" = "--test" ]; then
    export CUCUMBER_TAIL=1;
fi

cd app
#meteor $1 --settings ../environments/local/settings.json --release velocity:METEOR@1.1.0.3_2 --raw-logs
if [ "$1" = "test-packages" ]; then
    export VELOCITY_TEST_PACKAGES=1
    meteor $1 --settings ../environments/local/settings.json --driver-package velocity:html-reporter --velocity
else
    meteor $1 --settings ../environments/local/settings.json --raw-logs
fi
