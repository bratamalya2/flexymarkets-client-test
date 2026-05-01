import { faker } from '@faker-js/faker';

export const generateData = (numRows = 20) => {
  return Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    mt5Id: faker.finance.accountNumber(),
    date: faker.date.past().toISOString().split('T')[0],
    order: faker.string.numeric(8),
    symbol: faker.finance.currencyCode(),
    price: faker.finance.amount(10, 500, 2),
    profit: faker.finance.amount(-100, 1000, 2),
    volume: faker.finance.amount(0.1, 10, 2),
    myCommission: faker.finance.amount(1, 50, 2),
    type: faker.helpers.arrayElement(['Buy', 'Sell']),
  }));
};

export const data = generateData(20);