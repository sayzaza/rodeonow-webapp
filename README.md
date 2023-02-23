## Rodeo

[![Main](https://github.com/jadamroth/rodeonow-webapp/actions/workflows/firebase-hosting-merge-main.yml/badge.svg)](https://github.com/jadamroth/rodeonow-webapp/actions/workflows/firebase-hosting-merge-main.yml)
[![Release](https://github.com/jadamroth/rodeonow-webapp/actions/workflows/firebase-hosting-merge-release.yml/badge.svg)](https://github.com/jadamroth/rodeonow-webapp/actions/workflows/firebase-hosting-merge-release.yml)
[![Pull Request](https://github.com/jadamroth/rodeonow-webapp/actions/workflows/firebase-hosting-PR.yml/badge.svg)](https://github.com/jadamroth/rodeonow-webapp/actions/workflows/firebase-hosting-PR.yml)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### To run the video trimming service

```
cd trim-server
cargo run --release

# Now make multipart form submissions to the server on Port 3000 and wait for a response Bloc
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
