# Release Process

This document describes how releases of **aep-openapi-linter** are created and
published to both **npm** and **GitHub Releases**.

The goal of this process is to be **lightweight, reliable, and easy to reason
about**, with minimal tooling and clear sources of truth.

---

## Overview

- Use `npm run release:{patch,minor,major}` to create a release branch.
- Push that branch and open a PR to main.
- Merging that branch triggers workflows that create a tag and publish the
  release.
  - The auto-tag workflow creates the new tag.
  - The release workflow sees the new tag and publishes the npm and GitHub
    releases.

No release bots, changelog generators, or additional CLIs are required.

---

## Versioning

This project follows **Semantic Versioning (SemVer)**:

- **Patch** (`x.y.z`) — bug fixes, performance improvements, internal refactors
- **Minor** (`x.y.0`) — new rules or non-breaking enhancements
- **Major** (`x.0.0`) — breaking changes (rule behavior changes, removals,
  stricter defaults)

Versions can be updated manually in package.json or using npm’s built-in
tooling.

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
- Bump the version in package.json
- Create a release branch with the new version
- Commit and push the changes

Then create a Pull Request to merge the release branch into main.

Once the PR is merged, **the tag is created automatically**.

The `auto-tag` workflow monitors package.json changes on main and automatically
creates the corresponding git tag if it doesn't exist.

When the tag is created on main, this triggers the `release` workflow, which
will create the release in npm and in GitHub.

---

## Automation (GitHub Actions)

### Automatic Tagging

The `auto-tag` workflow monitors package.json changes on the main branch. When
a version change is detected, it automatically:

1. Reads the version from package.json
2. Checks if a tag for that version already exists
3. Creates and pushes the tag if it doesn't exist

This eliminates the manual tagging step after PR merge.

### Publishing and Releases

The `release` workflow listens for pushed tags matching `v*` on the main
branch.

On tag push, it will:

1. Check out the repository
2. Install dependencies
3. Run tests
4. Publish the package to npm
5. Create a GitHub Release for the tag

The GitHub Release is only created if npm publishing succeeds.

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

Example:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

---

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
