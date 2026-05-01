import { faker } from '@faker-js/faker';

export const generateData = (numRows = 10) => {
  return Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    mt5Id: faker.finance.accountNumber(),
    totalLots: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
    totalCommission: faker.finance.amount({ min: 10, max: 5000, dec: 2 }),
    ibName: "Aditya Shaw",
    registrationDate: faker.date.past().toISOString().split('T')[0],
  }));
};

export const data1 = generateData(5)

export const data2 = generateData(5)

export const data3 = generateData(5)

export const data4 = generateData(5)

export const data5 = generateData(5)

export const data6 = generateData(5)

export const data7 = generateData(5)