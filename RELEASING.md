# Release Process

This document describes how releases of **aep-openapi-linter** are created and
published to both **npm** and **GitHub Releases**.

The goal of this process is to be **lightweight, reliable, and easy to reason
about**, with minimal tooling and clear sources of truth.

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

Once the PR is merged, the `release` workflow will run since the PR makes
changes to package.json. This workflow will run the tests (again), and if the
tests pass will then attempt to create a tag for the new version. If that
succeeds, it then creates a release in both npm and GitHub.

The release branch can be deleted after the PR is merged and the releases are
published.

No release bots, changelog generators, or additional CLIs are required.

---

## Automation (GitHub Actions)

### Release Workflow

The `release` workflow is triggered by a push to 'main' (e.g. a PR merge) that
modifies "package json'. When triggered, it

1. Check if a tag already exists for this version. If so, the workflow
   terminates.
2. Install dependencies and run the tests. These should never fail since PRs
   targeting main must pass CI, but this is an extra precaution.
3. Create and push a git tag matching the version in package.json
4. Publish the package to npm
5. Create a GitHub Release with auto-generated notes

This single workflow handles the entire release process and ensures the npm and
GitHub releases are in sync and use the version from package.json

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
