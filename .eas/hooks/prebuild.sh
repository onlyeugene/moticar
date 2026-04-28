#!/usr/bin/env bash
set -euo pipefail

echo "Copying Rive assets to Android native folders..."

mkdir -p android/app/src/main/res/raw
mkdir -p android/app/src/main/assets

if [ -f "assets/rive/loader.riv" ]; then
  cp assets/rive/loader.riv android/app/src/main/res/raw/loader.riv
  cp assets/rive/loader.riv android/app/src/main/assets/loader.riv
  echo "Copied loader.riv to Android res/raw and assets"
else
  echo "WARNING: assets/rive/loader.riv not found; skipping copy"
fi

if [ -f "assets/rive/splash.riv" ]; then
  cp assets/rive/splash.riv android/app/src/main/res/raw/splash.riv
  cp assets/rive/splash.riv android/app/src/main/assets/splash.riv
  echo "Copied splash.riv to Android res/raw and assets"
else
  echo "WARNING: assets/rive/splash.riv not found; skipping copy"
fi

echo "Rive prebuild hook complete"
