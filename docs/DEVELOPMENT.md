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
1. Start the database with `docker compose up -d`, or run MySQL/MariaDB on your system

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
