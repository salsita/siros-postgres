const { getBudgetUpdates: getUpdates } = require('./budget-updates');

const dates = [
  '02-15',
  '04-01',
  '06-15',
  '08-01',
  '10-15',
];

const years = [
  2013,
  2015,
  2019,
  2025,
];

const STOP_YEAR = years[years.length - 1] + 2;

const startData = [];
const testDates = [];
years.forEach((y) => {
  dates.forEach((d) => {
    const date = `${y}-${d}`;
    const resultsPart = [];
    const resultsFull = [];
    let yy;
    if (date >= '2019-08-01') {
      resultsPart.push({
        action: 'initial',
        amount: 32500,
        date,
      });
      resultsFull.push({
        action: 'initial',
        amount: 65000,
        date,
      });
      yy = y + 2;
    } else if (date >= '2015-04-01') {
      resultsPart.push({
        action: 'initial',
        amount: 22500,
        date,
      });
      resultsFull.push({
        action: 'initial',
        amount: 45000,
        date,
      });
      yy = y + 1;
    } else {
      yy = y;
    }
    while (yy < STOP_YEAR) {
      const act = `${yy}-${d}`;
      if (act >= '2015-04-01') {
        resultsPart.push({
          action: 'yearly',
          amount: (act >= '2019-08-01' ? 12500 : 11250),
          date: act,
        });
        resultsFull.push({
          action: 'yearly',
          amount: (act >= '2019-08-01' ? 25000 : 22500),
          date: act,
        });
      }
      yy += 1;
    }
    startData.push({
      start: date,
      resultsPart,
      resultsFull,
    });
    testDates.push(date);
  });
});

const getHistory = (startItem, testDate) => {
  const res = {
    start: startItem.start,
    resultsPart: [],
    resultsFull: [],
  };
  let i = 0;
  if ((startItem.resultsFull.length > 0) && (startItem.resultsFull[0].action === 'initial')) {
    res.resultsPart.push(startItem.resultsPart[0]);
    res.resultsFull.push(startItem.resultsFull[0]);
    i = 1;
  }
  while ((i < startItem.resultsFull.length) && (startItem.resultsFull[i].date <= testDate)) {
    res.resultsPart.push(startItem.resultsPart[i]);
    res.resultsFull.push(startItem.resultsFull[i]);
    i += 1;
  }
  return res;
};

const splitHistory = (history, items) => {
  const db = {
    resultsPart: [],
    resultsFull: [],
  };
  const expected = {
    resultsPart: [],
    resultsFull: [],
  };
  let i;
  for (i = 0; i < items; i += 1) {
    db.resultsPart.push(history.resultsPart[i]);
    db.resultsFull.push(history.resultsFull[i]);
  }
  for (i = items; i < history.resultsFull.length; i += 1) {
    expected.resultsPart.push(history.resultsPart[i]);
    expected.resultsFull.push(history.resultsFull[i]);
  }
  return { db, expected };
};

describe('getBudgetUpdates', () => {
  startData.forEach((sData) => {
    testDates.forEach((tDate) => {
      const hist = getHistory(sData, tDate);
      for (let i = 0; i <= hist.resultsFull.length; i += 1) {
        const { db, expected } = splitHistory(hist, i);
        test(`start-date: ${sData.start} / test-date: ${tDate} / items in db: ${i} / part-time`, () => {
          const resPart = getUpdates(
            { start_date: sData.start, part_time: true },
            db.resultsPart,
            tDate,
          );
          expect(resPart).toEqual(expected.resultsPart);
        });
        test(`start-date: ${sData.start} / test-date: ${tDate} / items in db: ${i} / full-time`, () => {
          const resFull = getUpdates(
            { start_date: sData.start, part_time: false },
            db.resultsFull,
            tDate,
          );
          expect(resFull).toEqual(expected.resultsFull);
        });
      }
    });
  });
  test('bug-fix #1', () => {
    const res = getUpdates(
      { start_date: '2018-09-03', part_time: false },
      [],
      '2019-09-23',
    );
    expect(res).toEqual([
      {
        action: 'initial',
        amount: 45000,
        date: '2018-09-03',
      },
      {
        action: 'yearly',
        amount: 25000,
        date: '2019-09-03',
      },
    ]);
  });
});
