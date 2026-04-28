#!/usr/bin/env bash
set -euo pipefail

echo "Copying Rive assets for EAS build..."

mkdir -p android/app/src/main/res/raw
mkdir -p android/app/src/main/assets

if [ -f "assets/rive/loader.riv" ]; then
  cp assets/rive/loader.riv android/app/src/main/res/raw/loader.riv
  cp assets/rive/loader.riv android/app/src/main/assets/loader.riv
  echo "Copied loader.riv to Android resources"
else
  echo "WARNING: assets/rive/loader.riv not found; skipping copy"
fi

echo "EAS pre-install hook complete"
