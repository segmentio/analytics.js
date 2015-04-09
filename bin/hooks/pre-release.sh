#!/usr/bin/env bash

#
# This pre-release hook is executed via tj/git-extras, and is meant to ensure
# that analytics[.min].js are generated using the bumped version from the
# `package.json`.
#
# @author Dominic Barnes <dominic@segment.com>
#

make clean build
