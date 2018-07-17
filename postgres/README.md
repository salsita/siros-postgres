## DB setup

=> CREATE DATABASE siros;
=> CREATE USER siros WITH ENCRYPTED PASSWORD ' ... ';
=> GRANT ALL PRIVILEGES ON DATABASE siros TO siros;

> npm run migrate up
