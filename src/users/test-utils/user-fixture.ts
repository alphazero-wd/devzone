import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

export const userFixture = (attrs?: Partial<User>): User => {
  return {
    id: 1,
    email: faker.internet.email(),
    confirmedAt: null,
    newEmail: null,
    newEmailToken: null,
    oldEmailToken: null,
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    name: faker.person.fullName(),
    ...attrs,
  };
};
