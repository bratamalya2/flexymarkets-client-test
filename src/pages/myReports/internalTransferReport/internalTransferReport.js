import { faker } from '@faker-js/faker';

export const generateData = (numRows = 10) => {
  return Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    fromAccount: faker.finance.accountNumber(),
    toAccount: faker.finance.accountNumber(),
    amountUSD: faker.finance.amount(100, 5000, 2),
    date: faker.date.past().toISOString().split('T')[0],
  }));
};

export const data = generateData(20);