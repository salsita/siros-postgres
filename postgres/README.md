## OS support

The scripts are developed on/for MacOS only.

## PDF output directory

Make sure that the PDF output directory, specified as `config.pdf.outputDir` in `lib/config.js` exists and you have
write permission there before attempting to generate a PDF protocol. The path is relative to the `bin/` files.

## DB setup

=> CREATE DATABASE siros;
=> CREATE USER siros WITH ENCRYPTED PASSWORD ' ... ';
=> GRANT ALL PRIVILEGES ON DATABASE siros TO siros;

> npm run migrate up

## System user

First user you create with `bin/siros-hw` is the system user which is used as the owner of all newly created HW. You can
use another user as well, just update the `config.hwItems.systemUserId` accordingly. Make sure this user exists before
you create new hw with `bin/siros-hw`.
