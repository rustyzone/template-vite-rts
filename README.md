# Chrome Extension

This template includes Supabase, React, Tailwind & the Rollup chrome extension
plugin

## Commands

~~`yarn dev:old` run local development with reloader and listen for changes to
tailwind & extension files.~~ - To fix for vite support issue with tailwind loading, service worker takes a moment to kick in.

`yarn build` make a dev build build

`yarn build:prod` make a production build

`yarn release:patch` generate a zip file based on the build command above
