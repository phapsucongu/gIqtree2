#### Build guide :
###### Requirements
- Node.js 16 or later
- Any dependencies necessary for building native dependencies; see [here](https://github.com/nodejs/node-gyp#installation).
- Git
###### Steps
- Clone the repository; use `git clone https://github.com/asymme1/gIqtree2/` in the terminal.
- Run `npm ci` in the repository root, or `yarn install --frozen-lockfile` if you prefer Yarn.
- Run
  - `npm run electron:build:win -p never` or `yarn electron:build:win -p never` if you're on Windows.
  - `npm run electron:build:linux -p never` or `yarn electron:build:linux -p never` if you're on Linux.
  - `npm run electron:build:mac -p never` or `yarn electron:build:mac -p never` if you're on Mac.
- Ready to use executables should reside in `dist/` afterwards.
