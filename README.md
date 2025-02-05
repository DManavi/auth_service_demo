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