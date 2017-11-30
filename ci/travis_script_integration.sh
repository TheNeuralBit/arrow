#!/usr/bin/env bash

# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

set -e

source $TRAVIS_BUILD_DIR/ci/travis_env_common.sh
export ARROW_CPP_EXE_PATH=$ARROW_CPP_BUILD_DIR/debug

pushd $ARROW_JAVA_DIR

echo "mvn package"
mvn -B clean package 2>&1 > mvn_package.log || (cat mvn_package.log && false)

popd

pushd $ARROW_JS_DIR

# lint and compile JS source
npm run lint
npm run build

popd

pushd $ARROW_INTEGRATION_DIR

CONDA_ENV_NAME=arrow-integration-test
conda create -y -q -n $CONDA_ENV_NAME python=3.5
source activate $CONDA_ENV_NAME

# faster builds, please
conda install -y nomkl

# Expensive dependencies install from Continuum package repo
conda install -y pip numpy six

python integration_test.py --debug

popd

pushd $ARROW_JS_DIR

# create initial test data
npm run create:testdata
# run once to write the snapshots
npm test -- -t ts -u --integration
# run again to test all builds against the snapshots
npm test -- --integration
# run tests against source to generate coverage data
npm run test:coverage -- --integration
# Uncomment to upload to coveralls
# cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js;


popd