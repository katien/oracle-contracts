# Mina zkApp: Oracle Contracts

Oracle contracts for oracle ui. Require the contracts as an npm module or build and deploy the contracts to your local lightnet for local development on the ui.
## Local Lightnet Deployment
```bash
zk lightnet start
zk config --lightnet
zk deploy # select the lightnet deploy alias
```

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test
npm run testw # watch mode
```

## How to run coverage

```sh
npm run coverage
```

## License

[Apache-2.0](LICENSE)
