# Preview deployment workflow

This repository uses a branch-based GitHub Pages deployment so production and per-PR previews can coexist on the same Pages site.

## Architecture

- Production builds are published to the root of the `gh-pages` branch.
- Each open PR's preview is published to `gh-pages/preview/{pr-number}/`.
- Preview directories are removed automatically when the PR closes.
- All three writer workflows (`deploy.yml`, `pr-preview.yml`, `pr-cleanup.yml`) serialize on a single `gh-pages-write` concurrency group, so writes never collide.

## URLs

- **Production:** `https://tarunv13.github.io/species-on-screen/`
- **Preview:** `https://tarunv13.github.io/species-on-screen/preview/{pr-number}/`

## One-time activation (after this PR merges)

This workflow change requires switching the GitHub Pages source from "GitHub Actions" (the previous `actions/deploy-pages` mechanism) to a `gh-pages` branch source. The change is safe — the previous artifact continues to serve until the source is switched.

Suggested order of operations:

1. **Merge this PR.** The new `deploy.yml` runs on `main`, creates the `gh-pages` branch, and populates its root with the production build. (~2 minutes.)
2. **Verify the branch exists** by visiting `https://github.com/tarunv13/species-on-screen/tree/gh-pages`. You should see `index.html`, `assets/`, `species/`, `data/`, and `.nojekyll`.
3. **Change the Pages source.** In the repository's **Settings → Pages → Build and deployment**, set:
   - **Source:** *Deploy from a branch*
   - **Branch:** `gh-pages` / `/ (root)`
   - Click **Save**.
4. Within ~5 minutes, GitHub Pages will rebuild from the `gh-pages` branch and the production URL becomes the new mechanism. Confirm by visiting the production URL.

Subsequent PRs will automatically receive previews. The PR that introduced this workflow does not get a preview itself, because `gh-pages` does not yet exist when its preview workflow first runs.

## Workflows

| File | Trigger | Action |
|---|---|---|
| `deploy.yml` | push to `main`, manual | Build production, replace `gh-pages` root, preserve any in-flight `preview/` directories |
| `pr-preview.yml` | PR opened / pushed / reopened | Build with PR-scoped base path, write to `gh-pages/preview/{n}/`, comment on PR with the URL |
| `pr-cleanup.yml` | PR closed (merged or not) | Remove `gh-pages/preview/{n}/` |

## Limitations

- **Forks.** PRs from forks do not get previews — they lack write access to the repository's `gh-pages` branch. The workflows skip silently for fork PRs. (Acceptable for the current single-author project.)
- **Concurrency.** Concurrent merges or pushes queue briefly behind one another on the `gh-pages-write` group. Each workflow run takes ~1–2 minutes; queueing is rarely visible.
- **Stale previews.** Long-running PRs hold their preview directory until they close. The cleanup workflow handles closure but not abandonment. Stale previews can be removed manually by deleting the directory from the `gh-pages` branch.
- **Branch growth.** The `gh-pages` branch accumulates commits over time. A quarterly `git rebase --root` / force-push to compact history is acceptable maintenance; not needed for the first many months.

## Troubleshooting

- **Preview workflow fails with "gh-pages branch does not exist."** The production workflow has not run yet on `main`. Merge a commit to `main`, wait for `deploy.yml` to complete, then re-run the preview workflow on the PR (or push a new commit to retrigger it).
- **Preview URL returns 404.** Either the workflow has not yet completed, or GitHub Pages has not yet propagated the new commit. Wait ~2 minutes after the workflow completes.
- **Production stops updating after this PR merges.** The Pages source has not been switched yet (see "One-time activation" above). Until the switch, production continues serving the last `actions/deploy-pages` artifact.
