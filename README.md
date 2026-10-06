# MRDI Website

Static multi-page website built with HTML, CSS, browser JavaScript, and a dependency-free Node.js packaging script.

## Deploy with Git and Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel and select the repository root.
3. Choose **Other** as the Framework Preset. `vercel.json` skips dependency installation and builds a compact `dist/` containing the website pages and their referenced assets.
4. Connect the production branch. Git pushes create production deployments, and other branches or pull requests create previews.

Vercel serves HTML pages without the `.html` suffix. The full source photos and original videos stay in the local `assets/originals/` folder and are excluded from Git; the site build includes only files referenced by the website.
