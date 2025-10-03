#!/bin/sh
# Setup git hooks for warrenbuf

set -e

echo "Setting up git hooks..."

# Create symlink from .git/hooks to hooks/
if [ -f .git/hooks/pre-commit ] && [ ! -L .git/hooks/pre-commit ]; then
    echo "Backing up existing pre-commit hook to pre-commit.backup"
    mv .git/hooks/pre-commit .git/hooks/pre-commit.backup
fi

ln -sf ../../hooks/pre-commit .git/hooks/pre-commit

echo "✓ Git hooks installed successfully"
echo "  Pre-commit hook will now minify warrenbuf.js before each commit"
