# Barebones Todo App built with Express
This repository will contain multiple versions of the same app, so that it can be easily benchmarked later on. The main version will always be the latest version, with all the features. Alternate versions will live in alternate source folders (src-*)

## Running the app
- first, install dependencies
```sh
npm install
```
- then run it with
```sh
npm run start
```

## Running the app in a Docker container
- first, install dependencies and build image:
```sh
npm install
open --background -a Docker
npm run build:docker
```
- the run it with
```sh
npm run start:docker
```

## Debugging the app
- to run it in dev mode, with hot reload, (you need nodemon installed globally):
```sh
npm run start:dev
```
- to run it in debug mode, first make sure nodemon is added to your $PATH variable (only once), then run it in debug mode. On a Mac, you should do:
```sh
# add to $PATH:
export PATH="/Users/REPLACE.WITH.YOUR.USER.NAME/.nvm/versions/node/v20.12.2/bin:$PATH"

# debug with VSCode's debug mode or:
npm run debug
```

## Single-file versions (OOP & FP)
There are two alternative versions of the basic app, only there for learning and comparison. These are single-file-app versions, one is in FP (Functional Programming), the other is in OOP (Object Oriented Programming). They are both stored in src-alt, and can be started with:
```sh
// FP:
npm run start:fp
// OOP:
npm run start:oop
```

## K6 Testing
Grafana K6 is an open-source load testing tool that helps you do Load testing, Browser testing, Chaos/Resilience Testing, Performance and Synthetic monitoring. To achieve maximum performance, the tool itself is written in Go, embedding a JavaScript runtime allowing for easy test scripting.
Key features:
- CLI tool with developer-friendly APIs.
- Scripting in JavaScript ES2015/ES6 - with support for local and remote modules
- Checks and Thresholds - for goal-oriented, automation-friendly load testing
- Can be easily included in CI/CD pipelines
We'll use it for:
- **Load Testing**: involves putting a constant, expected load on a system to evaluate its performance under normal conditions. It helps assess how the system behaves when subjected to typical levels of user activity.
- **Stress Testing**: involves applying a load to a system beyond its normal operational capacity to identify its breaking point or to observe how it behaves under extreme conditions. It helps identify the system's stability and robustness under heavy load.
- **Spike Testing**: involves rapidly increasing or decreasing the load on a system to evaluate its response to sudden changes in user activity. It helps assess how the system handles sudden surges or drops in traffic.
- **Endurance Testing**: involves applying a sustained load to a system over an extended period to evaluate its performance and stability under continuous operation. It helps identify memory leaks, resource exhaustion, and other issues that may arise over time.

To use it, install k6 on your machine (https://k6.io/docs/get-started/installation), then run a test with one of the following:
```sh
npm run test:load
npm run test:stress
npm run test:spike
npm run test:endurance
```
