import { faker } from '@faker-js/faker';


const imageLinks = [
    "https://user.flexymarkets.com/images/news/1739518151_1.jpg",
    "https://user.flexymarkets.com/images/news/1739348445_1.jpg",
    "https://user.flexymarkets.com/images/news/1738741856_1.jpg",
    "https://user.flexymarkets.com/images/news/1738912958_1.jpg",
    "https://user.flexymarkets.com/images/news/1738325279_1.jpg"
];


export const generateData = (numRows = 10) => {
    return Array.from({ length: numRows }, (_, index) => ({
        id: index + 1,
        heading: "Daily Metals Technical Newsletter",
        note: faker.lorem.sentence(30),
        date: faker.date.past().toISOString().split('T')[0],
        image: faker.helpers.arrayElement(imageLinks),
    }));
};

export const data = generateData(10);