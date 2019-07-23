#!/bin/bash

echo "----------------------------------------------------------------------"
echo "Upload GitHub Dark Theme Chrome extension to Chrome Web Store"
echo "----------------------------------------------------------------------"

npx shipit chrome ./dist-chrome
