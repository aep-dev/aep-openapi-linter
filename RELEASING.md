# Release Process

This document describes how releases of **aep-openapi-linter** are created and
published to both **npm** and **GitHub Releases**.

The goal of this process is to be **lightweight, reliable, and easy to reason
about**, with minimal tooling and clear sources of truth.

---

## Overview

- Development merges to the main branch until it is time to publish a release.
- Use `npm run release:{patch,minor,major}` to create a release branch.
  - This bumps the version in package.json/package-lock.json
- Push that branch and open a PR to main.
- Merging that branch triggers the `release` workflow that creates a tag
  matching the version in package.json and publishes the release to npm and
  GitHub.

No release bots, changelog generators, or additional CLIs are required.

---

## Versioning

This project follows **Semantic Versioning (SemVer)**:

- **Patch** (`x.y.z`) — bug fixes, performance improvements, internal refactors
- **Minor** (`x.y.0`) — new rules or non-breaking enhancements
- **Major** (`x.0.0`) — breaking changes (rule behavior changes, removals,
  stricter defaults)

---

## Creating a Release

**Note**: The main branch is protected, so releases must be created via Pull
Request.

Run the release preparation script:

```bash
npm run release:patch  # or release:minor / release:major
```

This script will:

- Ensure you're on main and up to date
- Verify the working tree is clean
- Run tests
- Bump the version in package.json and package-lock.json
- Create a release branch with the new version
- Commit and push the changes

Then create a Pull Request to merge the release branch into main.

Once the PR is merged, **the tag is created automatically**.

The `release` workflow monitors package.json changes on main and automatically
creates the corresponding git tag if it doesn't exist and then creates a
release in both npm and GitHub.

---

## Automation (GitHub Actions)

### Release Workflow

The `release` workflow is triggered by a PR merge to main that updates the
version in package.json. When triggered, it will:

1. Check if a tag already exists for this version. If so, the workflow
   terminates.
2. Install dependencies and run the tests. These should never fail since PRs
   targeting main must pass CI, but this is an extra precaution.
3. Create and push a git tag matching the version in package.json
4. Publish the package to npm
5. Create a GitHub Release with auto-generated notes

This single workflow handles the entire release process and the npm and GitHub
release are in sync and use the version from package.json

---

## GitHub Release Behavior

- Release name matches the tag (e.g. `v1.4.0`)
- Release notes are auto-generated from commits by GitHub
- Releases are created using the built-in `GITHUB_TOKEN`

This ensures every published npm version has a visible, traceable release in
GitHub.

---

## npm Configuration

Publishing requires:

- An npm automation token stored as a GitHub secret named `NPM_TOKEN`
- `publishConfig.access` set appropriately in `package.json`

## Optional: Changelog

A manual `CHANGELOG.md` may be maintained if desired.

If present, it can be used as the GitHub Release body in the future, but this
is intentionally not automated to keep the release process simple and
transparent.

---

## Recovery and Rollbacks

- If npm publishing fails, no GitHub Release is created
- The tag can be deleted and recreated if necessary
- Fixes should be released as a follow-up patch version rather than overwriting
  published artifacts

---

## Development Workflow

Since releases are manually triggered:

1. Work directly on the main branch (or use feature branches and merge to main)
2. Commit and push changes as needed
3. When you're ready to release, trigger the release workflow on the main
   branch.
4. The workflow will handle versioning, tagging, publishing, and updating
   package.json
