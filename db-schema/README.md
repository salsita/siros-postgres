# DB schema

In `migrations` directory you can find the definition of Siros DB schema for PostgreSQL DB in form of migration files.

## DB setup

Before you can use the definitions, you need to create the DB itself:

```
=> CREATE DATABASE siros;
=> REVOKE CONNECT ON DATABASE siros from PUBLIC;
=> REVOKE ALL PRIVILEGES ON DATABASE siros from PUBLIC;
=> CREATE USER siros WITH ENCRYPTED PASSWORD ' ... ';
=> GRANT CONNECT ON DATABASE siros TO siros;
=> GRANT ALL PRIVILEGES ON DATABASE siros TO siros;
```

## `.env` file

The `npm run migrate` command connects to DB specified as `DATABASE_URL` in `.env` file.
Be sure to create the `.env` file with the connection string in form of
`DATABASE_URL="postgres://siros:<password>@<dns-name>:5432/siros"` prior to starting the migrations.

## Running the DB migrations

After that, you can install the schema and later on update it with new additions using
```
$ npm run migrate up
```

## Read-only DB access

The `api-server` is only reading the data from the DB, so it doesn't need to use the credentials
of the admin user `siros` created above. It is safer to use dedicated read-only DB user `siros-api`
that you can define (using admin DB user connected to the new DB) as:

```
=> CREATE USER "siros-api" WITH ENCRYPTED PASSWORD ' ... ';
=> GRANT CONNECT ON DATABASE siros TO "siros-api";
=> GRANT USAGE ON SCHEMA public TO "siros-api";
```

After creating the tables (or adding new ones later on, using the `siros` user), grant the SELECT permissions
to the API user (using the `siros` user connected to `siros` DB) as:

```
=> GRANT SELECT ON ALL TABLES IN SCHEMA public TO "siros-api";
```
