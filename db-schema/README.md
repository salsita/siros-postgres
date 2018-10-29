# DB schema

In `migrations` directory you can find the definition of Siros DB schema for PostgreSQL DB in form of migration files.

## DB setup

Before you can use the definitions, you need to create the DB itself:

```
=> CREATE DATABASE siros;
=> CREATE USER siros WITH ENCRYPTED PASSWORD ' ... ';
=> GRANT ALL PRIVILEGES ON DATABASE siros TO siros;
```

After that, you can install the schema and later on update it with new additions using
```
$ npm run migrate up
```

The `npm run migrate` command connects to DB specified as `DATABASE_URL` in `.env` file.
Be sure to create the `.env` file with the connection string in form of
`DATABASE_URL="postgres://siros:<password>@<dns-name>:5432/siros"` prior to starting the migrations.

## Read-only DB access

The `api-server` is only reading the data from the DB, so it doesn't need to use the credentials of
the admin user `siros` created above. It is safer to use dedicated read-only DB user `siros-api`
that you can define as:

... TODO ...
