# Duplicate Lines Keeper

A Visual Studio Code extension that processes selected text and removes any lines that appear only once, keeping only duplicate lines.

## Features

- Removes unique lines from the selected text
- Preserves duplicate lines in their original order
- Keeps empty lines
- Shows a count of removed lines
- Trims whitespace when comparing lines

## Usage

1. Select the text you want to process
2. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "Keep Only Duplicate Lines" and select the command
4. The selection will be replaced with only the duplicate lines

## Requirements

Visual Studio Code version 1.85.0 or higher

## Extension Settings

This extension doesn't add any settings.

## Known Issues

None at this time.

## Release Notes

### 0.0.1

Initial release:

- Basic functionality to keep only duplicate lines
- Support for handling empty lines
- Whitespace trimming for comparison
