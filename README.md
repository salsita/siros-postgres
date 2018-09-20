## Scripts

In (temporary) absence of web-app for managing the hw, this is the list of scripts that should be used instead:
* siros-user: create and update (system and real) users,
* siros-hw: create and update hw items,
* siros-hw-repair: account transactions for hw item repairs,
* siros-hw-transfer: change owner of hw items and update budgets accordingly,
* siros-hw-sell: remove hw items from active evidence after selling them outside Salsita,
* siros-show-hw-marketplace: show list of hw items available on markeplace,
* siros-protocol: generate PDF documents for hand-over and sell events,
* siros-update-hw-budgets: update hw budgets with initial and yearly increments,
* siros-show-hw-budget: show hw budget for individual users,
* siros-hw-discard: discard hw items.

For easy reading, the scripts are not optimized for code-sharing, many parts are copy-pasted.

The scripts are developed on/for MacOS only.

## PDF output directory

Make sure that the PDF output directory, specified as `config.pdf.outputDir` in `lib/config.js` exists and you have
write permission there before attempting to generate a PDF protocol. The path is relative to the `bin/` files.

## DB setup

```
=> CREATE DATABASE siros;
=> CREATE USER siros WITH ENCRYPTED PASSWORD ' ... ';
=> GRANT ALL PRIVILEGES ON DATABASE siros TO siros;
```

```
$ vi bin/.env  # enter connection string there as DATABASE_URL="postgres://siros:<password>@<dns-name>:5432/siros"
$ npm run migrate up
```

## System user

First user you create with `bin/siros-hw` is the system user which is used as the owner of all newly created hw. You can
use another user as well, just update the `config.hwItems.systemUserId` accordingly. Make sure this user exists before
you create new hw with `bin/siros-hw`.
