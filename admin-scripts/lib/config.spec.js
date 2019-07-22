const config = require('./config');

const { budget, hwItems } = config;
const { pickRule, names, startDate } = budget;
const { getAgedPrice } = hwItems;

describe('hwItems.getAgedPrice()', () => {
  test('before start-date', () => {
    expect(getAgedPrice(5840, '2014-10-10', '2015-03-31')).toEqual(0);
  });
  test('first day of first year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2016-01-01')).toEqual(4672);
  });
  test('second day of first year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2016-01-02')).toEqual(4672);
  });
  test('second month of first year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2016-02-15')).toEqual(4672);
  });
  test('end of first year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2016-12-31')).toEqual(4672);
  });
  test('first day of second year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2017-01-01')).toEqual(4672);
  });
  test('second day of second year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2017-01-02')).toEqual(4669);
  });
  test('third day of second year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2017-01-03')).toEqual(4666);
  });
  test('second month of second year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2017-02-01')).toEqual(4579);
  });
  test('first day of third year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2018-01-01')).toEqual(3577);
  });
  test('first day of fourth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2019-01-01')).toEqual(2482);
  });
  test('last day of fourth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2019-12-31')).toEqual(1390);
  });
  test('last day of fifth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2020-12-31')).toEqual(295);
  });
  test('first day of sixth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2021-01-01')).toEqual(292);
  });
  test('second day of sixth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2021-01-02')).toEqual(292);
  });
  test('second week of sixth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2021-01-08')).toEqual(292);
  });
  test('second month of sixth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2021-02-01')).toEqual(292);
  });
  test('end of sixth year', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2021-12-31')).toEqual(292);
  });
  test('far in the future', () => {
    expect(getAgedPrice(5840, '2016-01-01', '2345-04-17')).toEqual(292);
  });
});

describe('budget.pickRule()', () => {
  test('2014-10-01', () => {
    expect(pickRule('2014-10-01').name).toBe(names.PERIOD0);
  });
  test('2015-03-31', () => {
    expect(pickRule('2015-03-31').name).toBe(names.PERIOD0);
  });
  test(startDate, () => {
    expect(pickRule(startDate).name).toBe(names.PERIOD1);
  });
  test('2018-05-12', () => {
    expect(pickRule('2018-05-12').name).toBe(names.PERIOD1);
  });
  test('2019-07-31', () => {
    expect(pickRule('2019-07-31').name).toBe(names.PERIOD1);
  });
  test('2019-08-01', () => {
    expect(pickRule('2019-08-01').name).toBe(names.PERIOD2);
  });
  test('2020-09-18', () => {
    expect(pickRule('2020-09-18').name).toBe(names.PERIOD2);
  });
  test('random-string', () => {
    expect(pickRule('random-string')).toBeNull();
  });
});
