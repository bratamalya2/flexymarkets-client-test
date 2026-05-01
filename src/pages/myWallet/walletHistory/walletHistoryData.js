import { faker } from '@faker-js/faker';

export const generateData = (numRows = 10) => {
  return Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    method: faker.finance.accountName(),
    toDeposit: faker.helpers.arrayElement(['Savings', 'Checking', 'Investment', 'Crypto Wallet']),
    amountUSD: faker.finance.amount(100, 5000, 2),
    note: faker.lorem.sentence(),
    date: faker.date.past().toISOString().split('T')[0],
  }));
};

export const data = generateData(20);