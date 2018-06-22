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

(async function() {
  let client, db;
  try {
    client = await MongoClient.connect(process.env.MONGOLAB_URI);
    db = client.db(process.env.DB_NAME);
    const colHw = db.collection(COLLECTION_HW);
    const cursorHw = colHw.find({ itemUserRow: process.argv[2] });
    const results = [];
    cursorHw.forEach((doc) => {
      results.push({
        item: doc.itemItemRow,
        type: doc.itemTypeRow,
        id: doc.itemIdRow,
        active: doc.itemDisabled === 'false',
        note: doc.itemNoteRow
      });
    }, async (err1) => {
      if (err1) { console.log(err1); }
      else {
        // console.log(results);
        if (client) { client.close(); }
        client = await MongoClient.connect(process.env.MONGOLAB_URI);
        db = client.db(process.env.DB_NAME);
        const colHist = db.collection(COLLECTION_HIST);
        const cursorHist = colHist.find({ itemId: results[0].id });
        const hists = [];
        cursorHist.forEach((hist) => {
          hists.push({ date: hist.date, msg: hist.msg });
        }, (e) => {
          if (e) { console.log(e); }
          results[0].history = hists.sort((a, b) => (a.date < b.date));
          console.log(results[0]);
          process.exit(0);
        });
      }
    });
  } catch (err) {
    console.log(err.stack);
  }

  if (client) { client.close(); }
})();
