import { faker } from '@faker-js/faker';

export const generateData = (numRows = 10) => {
  return Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    mt5Id: faker.finance.accountNumber(),
    amountUSD: faker.finance.amount(100, 5000, 2),
    paymentMethod: faker.helpers.arrayElement(['Bank Transfer', 'Credit Card', 'PayPal', 'Crypto']),
    note: faker.lorem.sentence(),
    comment: faker.lorem.words(5),
    status: faker.helpers.arrayElement(['Pending', 'Completed', 'Failed']),
    date: faker.date.past().toISOString().split('T')[0],
  }));
};

export const data = generateData(20);