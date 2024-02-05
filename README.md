
# LabFlow - frontend

## Requirements
- Node.js v20.10.0
- npm v10.2.3

## Installation
1. First, you need to install all the required dependencies with `npm install`.
2. Update backend url `baseURL` in `src/api/common/api.ts`.
3. Create production build: `npm run build`.
4. Build files are located in the `dist` directory. Set up an HTTP server to serve the `dist/index.html` file and the static content.

## Dev/test environment
Run `npm run dev` to run a dev/test server.
