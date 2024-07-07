import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

export const userFixture = (attrs?: Partial<User>): User => {
  return {
    id: 1,
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    name: faker.person.fullName(),
    ...attrs,
  };
};
