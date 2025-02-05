# Auth Service Demo

## Requirements

- git
- nvm (node version manager)
- NodeJS (stable version preferably >= v22)
- docker
- docker compose
- Insomnia (to test APIs)

## Development

To run the project on your local machine, please follow the instruction below.

```sh

# clone the source code on your local machine
git clone https://github.com/DManavi/auth_service_demo


# navigate to the project folder
cd auth_service_demo

# (optional) choose the right nodejs version if you have nvm installed
nvm use

# install dependencies
npm i

# create .env file
cp .env.template .env

# run the services (e.g. redis)
docker compose up -d

# run the API in development mode
npm run api:dev
```

## Testing APIs

In the root of the project, there's an [Insomnia collection file](./Insomnia_2025-02-04.json). Import this file in your insomnia application and start testing the API.

> Based on your machine configuration, you may need some adjustments on the environment file.

## Architecture

The code is structured based on [vertical slice architecture](https://www.jimmybogard.com/vertical-slice-architecture/). In this approach, features of the product are held within the same project (mostly a library) which helps developers to keep related pieces of the code as close to each other as possible.

### Libraries

Libraries are non-runnable parts of the project. They can be only referenced from apps or other libraries (restriction applies).

#### Feature

Feature libraries are in fact the main functionalities of the product. Every time a new feature is introduced, a new folder (JS library) must be created under libs folder named after the feature name and prefixed with `feat-`.

Our project has one feature only called [user](./libs//feat-user/) that contains all the related files of this feature in one place.

#### Utility

There are two more libraries in the libs folder.

- [util-api](./libs/util-api/)
- [util-misc](./libs/util-misc/)

These are utility are referenced from modules or apps.

### Applications

Applications are runnable parts of the product, meaning that the consumers interact with them directly (via API, gRPC, or etc).

> Consumers can be other services, applications, or event end-users.

#### API

The API application is responsible for exposing the features to the consumers via HTTP API interface (in our example).

The API is not supposed to be directly exposed to the internet. In a production environment, the best practice is to proxy the internal services with a reverse proxy (or application server) that handles the API requests, applies SSL termination, protect apps from attacks (e.g. DDoS), and etc.
