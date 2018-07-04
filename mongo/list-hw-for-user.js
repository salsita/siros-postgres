const MongoClient = require('mongodb').MongoClient;

// expected env variables:
// + MONGOLAB_URI
// + DB_NAME
require('dotenv').config();

const COLLECTION_HW = 'hardwares';
const COLLECTION_HIST = 'hwhistories';

if (process.argv.length !== 3) {
  console.log('usage: node list-hw-for-user.js <user-name>');
  console.log(process.argv);
  process.exit(1);
}

let client, db;

const init = () => {
  return new Promise((resolve, reject) => {
    MongoClient
      .connect(process.env.MONGOLAB_URI)
      .then((cli) => {
        client = cli;
        db = client.db(process.env.DB_NAME);
        resolve();
      })
      .catch((err) => { reject(err); });
  });
};

const getHw = (user) => {
  return new Promise((resolve, reject) => {
    const col = db.collection(COLLECTION_HW);
    const cursor = col.find({ itemUserRow: user });
    const results = [];
    cursor.forEach((doc) => {
      results.push({
        item: doc.itemItemRow,
        type: doc.itemTypeRow,
        date: doc.itemDateRow,
        price: doc.itemPriceRow,
        condition: doc.itemConditionRow,
        id: doc.itemIdRow,
        active: doc.itemDisabled === 'false',
        note: doc.itemNoteRow
      });
    }, (err) => {
      if (err) { reject(err); }
      else {
        resolve(results);
      }
    });
  });
};

const getHistory = (itemId) => {
  return new Promise((resolve, reject) => {
    const col = db.collection(COLLECTION_HIST);
    const cursor = col.find({ itemId });
    const results = [];
    cursor.forEach((doc) => {
      results.push({
        date: doc.date,
        msg: doc.msg
      });
    }, (err) => {
      if (err) { reject(err); }
      else {
        resolve(results.sort((a, b) => { return a.date > b.date; }));
      }
    });
  });
};

(async function () {
  await init();
  const hwItems = await getHw(process.argv[2]);
  for (let i = 0; i < hwItems.length; i++) {
    hwItems[i].history = await getHistory(hwItems[i].id);
  }
  console.log(JSON.stringify(hwItems, null, 8));
  if (client) { client.close(); }
})();
