# Ask Soph - Soph is a bot that will try to help you understand the work of a list of dead philosophers.

This is the web app for Ask Soph, previously at asksoph.com, built with [Deno](https://deno.land) and deployed using [docker-compose](https://docs.docker.com/compose/).

It didn't make any money, so I decided to make its code available here.

## Requirements

This was tested with [`Deno`](https://deno.land)'s version stated in the `.dvmrc` file, though other versions may work.

For the PostgreSQL dependency (used when running locally, self-hosted, or in CI), you should have `Docker` and `docker-compose` installed.

Don't forget to set up your `.env` file based on `.env.sample`.

## Development

```sh
$ docker-compose -f docker-compose.dev.yml up # (optional) runs docker with postgres, locally
$ make migrate-db # runs any missing database migrations
$ make start # runs the app
$ make format # formats the code
$ make test # runs tests
```

## Other less-used commands

```sh
$ make exec-db # runs psql inside the postgres container, useful for running direct development queries like `DROP DATABASE "asksoph"; CREATE DATABASE "asksoph";`
```

## Structure

- Backend routes are defined at `routes.ts`.
- Publicly-available files are defined at `public/`.
- Pages are defined at `pages/`.
- Cron jobs are defined at `crons/`.
- Reusable bits of code are defined at `lib/`.
- Database migrations are defined at `db-migrations/`.

## Deployment

This is no longer being deployed.
