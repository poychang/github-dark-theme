#!/bin/bash

echo "Upload GitHub-Dark-Theme Firefox Add-ons to https://addons.mozilla.org"
npx web-ext sign --source-dir \dist --artifacts-dir \ --api-key="$WEB_EXT_API_KEY" --api-secret="$WEB_EXT_API_SECRET"
