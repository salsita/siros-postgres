const pgp = require('pg-promise')();

const reconnectionTime = 5000; // ms
const sleep = (period) => (new Promise((resolve) => setTimeout(resolve, period)));

class Db {
  constructor({ url, logger }) {
    this.name = 'Db';
    this.url = url;
    this.logger = logger;
    if (!url) {
      logger.error(`[${this.name}] no URL provided`);
    }
    this.db = pgp(url);
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      try {
        await this.db.connect({
          onLost: () => {
            this.logger.error(`[${this.name}] connection lost, reconnecting ...`);
            this.connected = false;
            this.reconnect();
          },
        });
        this.connected = true;
        this.logger.debug(`[${this.name}] connected`);
      } catch (e) {
        this.logger.error(`[${this.name}] cannot connect to "${this.url}"`);
        this.reconnect();
      }
    }
  }

  async reconnect() {
    await sleep(reconnectionTime);
    await this.connect();
  }
}

module.exports = Db;
