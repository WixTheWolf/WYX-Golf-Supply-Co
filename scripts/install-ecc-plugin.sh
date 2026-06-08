#!/usr/bin/env sh
# Install the ECC plugin if the environment exposes the plugin marketplace CLI.
# Run this from the repository root when a compatible CLI is available.

if ! command -v plugin >/dev/null 2>&1; then
  echo "Error: plugin CLI not found. Install or enable the marketplace CLI first."
  exit 1
fi

plugin marketplace add https://github.com/affaan-m/ECC
plugin install ecc@ecc

echo "ECC plugin install commands completed."
