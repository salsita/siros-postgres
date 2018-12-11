# Web client

This part of the project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
You can find information on how to perform common task with the CRA framework
[here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The web client is built using `react`, `redux`, `router5`, and `redux-saga` (there are more libraries used, please check
`package.json`, but these are the core technologies).

Material UI library (with a couple of extra CSS lines) is used for styling.

## Configuration

The configuration is stored in `src/config.js` file. There you can find the formula for price-aging (that is shared with
the admin scripts), and also URL of the API server where the requests need to be redirected to when running in the
development mode (`devRedirect` key). This is used for non-XHR browser-initiated requests (i.e. navigation to new
pages by setting URLs to the navigation bar from JS code). The XHR requests, on the other hand, are handled by the
built-in development web-server provided as part of CRA, the redirection target for these is set using the `proxy` key
in `package.json` file. The `proxy` value in `package.json` should correspond to the `devRedirect` vaule in
`src/config.js`.

## Developing the web-client

As mentioned above, CRA provides a web-server for development, supporting hot reloading.
To start the server, simply run:

```
$ yarn start
```

You will need the API server counterpart running as well, ideally also in develop mode.
