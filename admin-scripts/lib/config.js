const budgetNames = {
  PERIOD0: 'period0',
  PERIOD1: 'period1',
  PERIOD2: 'period2',
  PERIOD3: 'period3',
};

const budgetStartDate = '2015-04-01'; // when the budget calculation starts

const config = {
  budget: {
    startDate: budgetStartDate,
    names: budgetNames, // for name referencing, to bind business logic with specific periods
    rules: [
      {
        initial: {
          // initial budget
          fullTime: 0,
          partTime: 0,
        },
        yearly: {
          // yearly increase
          fullTime: 0,
          partTime: 0,
        },
        name: budgetNames.PERIOD0,
        firstIncreaseYears: 1,
        validUntil: budgetStartDate,
      },
      {
        initial: {
          // initial budget
          fullTime: 45000,
          partTime: 22500,
        },
        yearly: {
          // yearly increase
          fullTime: 22500,
          partTime: 11250,
        },
        name: budgetNames.PERIOD1,
        firstIncreaseYears: 1,
        validUntil: '2019-08-01',
      },
      {
        initial: {
          // initial budget
          fullTime: 65000,
          partTime: 32500,
        },
        yearly: {
          // yearly increase
          fullTime: 25000,
          partTime: 12500,
        },
        name: budgetNames.PERIOD2,
        firstIncreaseYears: 2,
        validUntil: '2021-08-01',
      },
      {
        initial: {
          // initial budget
          fullTime: 65000,
          partTime: 55000,
        },
        yearly: {
          // yearly increase
          fullTime: 25000,
          partTime: 21000,
        },
        name: budgetNames.PERIOD3,
        firstIncreaseYears: 2,
        validUntil: '2999-12-31',
      },
    ],
  },

  hwDisplay: {
    // limits for display column widths
    descriptionWidth: 65,
    commentWidth: 34,
  },

  hwItems: {
    systemUserId: 1, // id of existing system user (default owner of all hw)

    getAgedPrice: (price, purchaseDate, ageDate) => {
      // price        -- integer
      // purchaseDate -- string YYYY-MM-DD
      // ageDate      -- string YYYY-MM-DD
      //
      // first year after the purchase: 80% of the price
      // after 5 years: 5% of the price
      // in between linear decrease
      //
      // if ageDate is < config.budget.startDate, return 0 (we did not track budgets back then)

      if (ageDate < config.budget.startDate) { return 0; }

      const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const pDateStr = purchaseDate.split('-');
      const pDateNum = pDateStr.map((str) => parseInt(str, 10));
      const aDateStr = ageDate.split('-');
      const aDateNum = aDateStr.map((str) => parseInt(str, 10));

      if (ageDate < `${pDateNum[0] + 1}-${pDateStr[1]}-${pDateStr[2]}`) { return Math.round(0.8 * price); }
      if (ageDate >= `${pDateNum[0] + 5}-${pDateStr[1]}-${pDateStr[2]}`) { return Math.round(0.05 * price); }

      let pDays = pDateNum[2];
      pDateNum[1] -= 1;
      while (pDateNum[1]) {
        pDateNum[1] -= 1;
        pDays += days[pDateNum[1]];
      }
      let aDays = aDateNum[2];
      aDateNum[1] -= 1;
      while (aDateNum[1]) {
        aDateNum[1] -= 1;
        aDays += days[aDateNum[1]];
      }
      const aging = (aDateNum[0] - pDateNum[0]) * 365 + aDays - pDays;
      const agingFraction = (aging - 365) / (4 * 365); // ignore the first year of the 5
      const price80 = 0.8 * price;
      const price5 = 0.05 * price;
      return Math.round(price80 * (1 - agingFraction) + price5 * agingFraction);
    },
  },

  pdf: {
    outputDir: '../protocols',
  },
};

const pickBudgetRule = (date) => {
  const { budget } = config;
  for (let i = 0; i < budget.rules.length; i += 1) {
    if (date < budget.rules[i].validUntil) { return budget.rules[i]; }
  }
  return null;
};

config.budget.pickRule = pickBudgetRule;

module.exports = config;
