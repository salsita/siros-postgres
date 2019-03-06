# API server

The server does not perform any DB write operations, so we only need DB user with read-only access
(`siros-api` DB user, see DB schema [README.md](../db-schema/README.md) for details).

## `.env` file

To be able to start the application, you need a couple of environmental variables set in `.env` file:

```
DATABASE_URL=postgres://siros-api:<password>@<dns-name>:5432/siros  # connection string to DB
SESSION_KEY=<session-key>                                           # key for signing session cookies
GOOGLE_CLIENT_ID=<google-client-id>                                 # application id (siros-postgres)
GOOGLE_CLIENT_SECRET=<google-client-secret>                         # corresponding secret
```

Optionally you can set the following variables to override the defaults:

```
LOG_LEVEL=...        # defaults to "info" for production; and it is always set to "debug" for development
PORT=...             # defaults to 3001; what port the API server is supposed to run
WEBSERVER_PROTO=...  # defaults to http; what protocol to use when redirecting to web-server
WEBSERVER_DOMAIN=... # defaults to localhost; domain name of the web-server
WEBSERVER_PORT=...   # defaults to 3000; what port the web-server is running on
```

## Running the API server

```
$ npm i
$ npm run dev        # start the development version of the API server using nodemon
$ npm start          # start the production version of the API server
```

## Server routes

The following routes are implemented on the server:

### API routes (JSON)
```
/logout              # request of logged in user to logout (not authenticated)

/api/v1:             # all requests check for authenticated user, otherwise return 401
---
/api/v1/me           # return profile of the user (name and email address of @salsitasoft.com account)
/api/v1/hw-list      # return HW list for the user
/api/v1/hw-budget    # return HW budget of given user
/api/v1/market       # return HW items available on marketplace
```

### Redirects

```
/auth:               # user authentication using OAuth2 providers
---
/auth/google         # Google OAuth2 user authentication
```

### Web-client routes

The server expects the web-client to handle the following routes:

```
/                    # return path after (hopefully successfull) login attempt,
                     #   the client should still verify on /api/v1/me if the server
                     #   has valid credentials of the user

/login?reason=<string>
                     # return path after failed login attempt, in case the server knows
                     #   the reason of the failure, it is encoded in reason URL parameter
                     #   (e.g. wrong-domain user account)
```
