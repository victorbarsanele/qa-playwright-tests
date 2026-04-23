import { faker } from '@faker-js/faker';

export type SignupUser = {
    name: string;
    email: string;
    title: 'Mr' | 'Mrs';
    password: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    mobileNumber: string;
};

/** Generates a unique user payload compatible with the signup page object. */
export function createRandomSignupUser(): SignupUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({
            firstName,
            lastName,
            provider: 'example.com',
        }),
        title: faker.helpers.arrayElement(['Mr', 'Mrs']),
        password: faker.internet.password({
            length: 12,
            memorable: false,
            pattern: /[A-Za-z0-9!@#$%^&*]/,
        }),
        birthDay: String(faker.number.int({ min: 1, max: 28 })),
        birthMonth: String(faker.number.int({ min: 1, max: 12 })),
        birthYear: String(faker.number.int({ min: 1970, max: 2003 })),
        firstName,
        lastName,
        address: faker.location.streetAddress(),
        country: 'United States',
        state: faker.location.state(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode('#####'),
        mobileNumber: faker.string.numeric(10),
    };
}
