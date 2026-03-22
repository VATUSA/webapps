# Developer documentation

This document will cover all of the basics to run the projects in this repository.

## Tech Stack

- Programming language: **TypeScript**
- Framework: **Next.js** MPA, **React** SPA
- CSS framework: **Tailwind CSS**
- Dependency management: **pnpm**
- Linting: **eslint**
- Formatting: **prettier**
- Supporting tech: **turbopack** + **Docker**

2026-02-21 note: we may switch from eslint + prettier to [biome](<https://biomejs.dev/>).

## Setting up

1. Install the prerequisite tooling
    - Node and npm come from `nvm`/`fnm`/`asdf`/`mise`, the Node.js website, or whatever package manager that your OS has
        - We are using Node version 24
    - pnpm can be installed via npm (`npm i -g pnpm`)
    - Docker comes from your OS's package manager or installers on their website
1. Clone the repository
1. Run `pnpm i`
1. Copy the example env file in the Next.js app (`cp apps/vatusa/.env.example apps/vatusa/.env`)
1. Start the backend + database with `docker compose up -d`

This will run [`cobalt`](https://github.com/VATUSA/cobalt) as well as a MySQL database. Make your calls to Cobalt at <http://localhost:8000/cobalt/>.

### Making Cobalt changes

You can make changes to Cobalt at the same time.

#### With Docker

1. In `./webapps/docker-compose.yml`, change the `image` for the cobalt server to something like `image: localhost:cobalt/latest`
1. Stop Docker (`docker compose down`)
1. Clone the cobalt project to your machine (`git clone https://github.com/vatusa/cobalt`)
1. Make your desired changes
1. Build the Docker container (`docker build -t localhost/cobalt .`)
1. Start Docker compose (`docker compose up`)

If you have already done this once (so you have a "localhost/cobalt" image), then you can restart just Cobalt with `docker compose restart cobalt` instead of bringing all containers down and back up.

#### Without Docker

You aren't required to use Docker, but without it you are required to manage Cobalt's access to a database (simple) and localhost URL routing (more complicated) on your own. Instructions are not provided for this setup at this time.

## Loading your database with demo data

TODO

## Running an app

1. `cd` into the app you want to run (`cd apps/<name>`)
1. Run `pnpm run dev`

Alternatively, you can use pnpm's workspace filter, by remaining in the root project directory and running
`pnpm run --filter ./apps/<name> dev`.

## Building an app

The dev server should be sufficient for all development. If it isn't, perhaps we need to update our tooling.

In the even that you actually want to build the app:

1. `cd` into the app you want to run (`cd apps/<name>`)
1. Run `pnpm run build`

## LLM Policy

The use of ML/LLM/"AI" tooling to contribute to this repository is not restricted, provided that:

- You **understand** the code you are contributing
- You have **tested** the code you are contributing
- You can **maintain** the code you are contributing
