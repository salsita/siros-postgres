const MongoClient = require('mongodb').MongoClient;

// expected env variables:
// + MONGOLAB_URI
// + DB_NAME
require('dotenv').config();

const COLLECTION_HW = 'hardwares';

(async function() {
  let client;
  try {
    client = await MongoClient.connect(process.env.MONGOLAB_URI);
    const db = client.db(process.env.DB_NAME);
    const col = db.collection(COLLECTION_HW);
    const cursor = col.find({}, { projection: { itemUserRow: true } });
    const results = {};
    cursor.forEach((doc) => { results[doc.itemUserRow] = true; }, (err) => {
      if (err) { console.log(err); }
      else {
        console.log(Object.keys(results));
      }
    });
  } catch (err) {
    console.log(err.stack);
  }

  if (client) {
    client.close();
  }
})();
