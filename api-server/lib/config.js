const dotenv = require('dotenv');

dotenv.config();

// static values
const config = {
  // mandatory (env or .env file)
  dbUrl: process.env.DATABASE_URL,
  sessionKey: process.env.SESSION_KEY,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,

  // optional with default values
  logLevel: process.env.LOG_LEVEL || 'info',
  webServerProto: process.env.WEBSERVER_PROTO || 'http',
  webServerDomain: process.env.WEBSERVER_DOMAIN || 'localhost',
  webServerPort: process.env.WEBSERVER_PORT || 3000,
  port: process.env.PORT || 3001,
};

// dynamic adjustments
if (process.env.NODE_ENV === 'development') { config.logLevel = 'debug'; }

module.exports = config;
