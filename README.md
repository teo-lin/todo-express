# Barebones Todo App built with multiple frameworks

This repository will contain multiple versions of the same app, so that it can be easily benchmarked later on. The main version will always be the latest version, with all the features. Alternate versions will live in alternate source folders (src-*). A brief description of the alternative is visible as a top folder (beginning with double dot) in each src folder. These are NOT the same as tagged versions, they are forks of the main app. They should normally live in their own repository, but, for learning and comparison purposes, it's easier to host them here.

For now, we may have the following implementations:

- src: the latest version will always live here
- src-00: A typical implementation of an express project, mainly relying on functions and separation of concerns. Actually, an even more typical structure would be to modularize the code based on MVC: controllers folder (Controller), services folder (Model), and the View would be the front-end, typically Swagger or an actual front-end.
- src01: the single file version of our first FP implementation, with on-disk storage.
- src02: the single file version of the OOP implementation, with on-disk storage.
- src03: the single file version of the OOP implementation, with in-memory ephemeral storage (i.e. - the data is never saved to disk, it only survives for the lifetime of the Docker container - this is going to be useful for load testing)
- src04-...: future versions

# SETUP

Before running it, you need to install dependencies and build the app:

```sh
npm run setup

# you may need to add nodemon to $PATH:
export PATH="/Users/REPLACE.WITH.YOUR.USER.NAME/.nvm/versions/node/v20.12.2/bin:$PATH"
```

The setup script will run all these commands for you:

```sh
open --background -a Docker
rm -rf node_modules build dist out coverage package-lock.json
docker stop todo-container
docker rm todo-container || true
docker rmi todo-app || true
npm install
npm install --global nodemon
docker build --tag todo-app .
```

# RUN

After setup, pick and run the app of your choice:

```sh
# main app (runs with node)
npm run start

# main app in docker (runs with node)
npm run start:docker

# one of the alternative implementations (these start with nodemon by default)
npm run start:00
npm run start:01
npm run start:02
# ... and so on
```

## DEBUG

- to run it in dev mode, with hot reload (nodemon)

```sh
npm run start:dev
```

- to run it in debug mode, first make sure nodemon is added to your $PATH variable (only once), then run it in debug mode. On a Mac, you should do:

```sh
# debug with VSCode's debug mode or:
npm run debug
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
npm run test:normal
npm run test:stress
npm run test:spike
npm run test:endurance
```
