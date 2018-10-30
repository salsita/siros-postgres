# Web server

To host static assets of web-client (index.html, JS and styles bundles, images, ...), we need a web-server.
The API server is separated from the web server, so we can use some of the standard tools for serving
static content.

We chose `nginx`. So in order to serve the web-client, nginx must be installed on the target machine.
You then take the `nginx.conf` file (along with other files needed, e.g. SSL certificates) and copy
them over to the target box. Make sure you edit the file and set the serving `root` directory, hostnames,
ports, ... correctly.

Once the configuration file is up-to-date, run the server as:
```
$ nginx -p . -c nginx.conf
```
