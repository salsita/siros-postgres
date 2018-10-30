const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const API_PREFIX = require('./api').PREFIX;

const CLIENT_ROUTES = {
  default: '/',
  login: '/login',
};

const ROUTES = {
  logout: '/logout',
  authGoogle: '/auth/google',
  authGoogleCb: '/auth/google/callback',
  apiPrefix: API_PREFIX,
};

const install = (app, config, logger) => {
  const port = (process.env.NODE_ENV === 'development') ? config.port : config.webServerPort;
  const cbURL = `${config.webServerProto}://${config.webServerDomain}:${port}${ROUTES.authGoogleCb}`;
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleId,
        clientSecret: config.googleSecret,
        callbackURL: cbURL,
      },
      (accessToken, refreshToken, profile, done) => {
        logger.debug(`*** passport profile:\n${JSON.stringify(profile, null, 2)}`);
        const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || '';
        const name = profile.displayName || '';
        logger.debug(`*** siros user: "${email}"`);
        if (!email.endsWith('@salsitasoft.com')) {
          return done(null, false, { message: 'not salsitasoft.com account' });
        }
        // success
        return done(null, { name, email });
      },
    ),
  );
  passport.serializeUser((user, done) => { done(null, user); });
  passport.deserializeUser((user, done) => { done(null, user); });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(async (ctx, next) => {
    if (ctx.path.startsWith(`${ROUTES.apiPrefix}/`) && ctx.isUnauthenticated()) {
      ctx.status = 401;
      ctx.body = 'unauthorized';
      return;
    }
    await next();
  });
};

const addRoutes = (router, config) => {
  // redirects
  const webServerUrl = `${config.webServerProto}://${config.webServerDomain}:${config.webServerPort}`;
  const devMode = (process.env.NODE_ENV === 'development');
  const failureRedirect = `${devMode ? webServerUrl : ''}${CLIENT_ROUTES.login}?reason=domain`;
  const successRedirect = `${devMode ? webServerUrl : ''}${CLIENT_ROUTES.default}`;
  router.get(ROUTES.authGoogle, passport.authenticate('google', { scope: ['email'] }));
  router.get(
    ROUTES.authGoogleCb,
    passport.authenticate('google', { failureRedirect }),
    (ctx) => { ctx.redirect(successRedirect); },
  );
  // API / JSON
  router.get(ROUTES.logout, (ctx) => {
    ctx.logout();
    ctx.body = { ok: true };
  });
};

module.exports = {
  install,
  addRoutes,
};
