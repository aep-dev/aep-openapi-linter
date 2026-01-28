#!/bin/bash
set -e

# Usage: ./scripts/prepare-release.sh [patch|minor|major]

if [ -z "$1" ]; then
  echo "Usage: $0 [patch|minor|major]"
  exit 1
fi

VERSION_TYPE=$1

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Error: Version type must be 'patch', 'minor', or 'major'"
  exit 1
fi

# Ensure we're on main and up to date
echo "Ensuring we are on 'main' branch..."
current_branch=$(git rev-parse --abbrev-ref HEAD || echo "UNKNOWN")

if [ "$current_branch" = "HEAD" ]; then
  echo "Error: You are in a detached HEAD state. Please check out 'main' manually and re-run this script."
  exit 1
fi

if [ "$current_branch" != "main" ]; then
  echo "Checking out 'main' branch from '$current_branch'..."
  if ! git checkout main; then
    echo "Error: Failed to check out 'main'. Ensure you have no uncommitted changes blocking checkout and that the 'main' branch exists."
    exit 1
  fi
fi

echo "Updating 'main' from origin..."
if ! git pull --rebase; then
  echo "Error: 'git pull' failed. Please resolve any issues (e.g., merge conflicts or network problems) and re-run this script."
  exit 1
fi
# Check if working tree is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Working tree is not clean. Please commit or stash changes."
  exit 1
fi

# Run tests
echo "Running tests..."
npm test

# Run linter
echo "Running linter..."
npm run lint
# Bump version
echo "Bumping version ($VERSION_TYPE)..."
npm version "$VERSION_TYPE" --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
BRANCH_NAME="release/v$NEW_VERSION"

echo "Creating release branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Add and commit
echo "Committing version bump..."
git add package.json package-lock.json
git commit -m "chore: bump version to v$NEW_VERSION"

# Push branch
echo "Pushing branch to origin..."
git push origin "$BRANCH_NAME"

echo ""
echo "✓ Release branch created and pushed!"
echo "  Branch: $BRANCH_NAME"
echo "  Version: v$NEW_VERSION"
echo ""
echo "Next steps:"
echo "  1. Create a Pull Request to merge $BRANCH_NAME into main"
echo "  2. Once merged, the tag will be created automatically"
