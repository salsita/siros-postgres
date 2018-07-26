// Only helper script formating / ordering dump of mongoDB data.

/* eslint-disable no-console */
const fs = require('fs');

const hwItems = JSON.parse(fs.readFileSync('../working.json'));

hwItems.forEach((hw) => {
  if (hw.purchase_date) {
    const parts = hw.purchase_date.split('/');
    if (parts.length === 3) {
      hw.purchase_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else {
      console.log('problem');
    }
  }
});

console.log(hwItems.length);
hwItems.sort((a, b) => {
  if (a.purchase_date > b.purchase_date) { return 1; }
  return -1;
});
console.log(hwItems.length);

fs.writeFileSync('./working-sorted.json', JSON.stringify(hwItems, null, 2));
