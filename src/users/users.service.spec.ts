import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { userFixture } from './test-utils';
import { PrismaError } from '../prisma/error.enum';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
            },
            gameHistory: {
              aggregate: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    user = userFixture();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      jest.spyOn(prisma.user, 'create').mockResolvedValue(user);
      const result = await service.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      expect(result).toEqual(user);
    });

    it('should throw an error if username exists', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'ERROR: duplicate key value violates unique constraint "username"',
            { clientVersion: '5.0', code: PrismaError.UniqueViolation },
          ),
        );
      expect(
        service.create({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if email exists', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'ERROR: duplicate key value violates unique constraint "email"',
            { clientVersion: '5.0', code: PrismaError.UniqueViolation },
          ),
        );
      expect(
        service.create({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return the user if email exists', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(user);
      const result = await service.findByEmail(user.email);
      expect(result).toEqual(user);
    });

    it('should throw an error if email does not exist', async () => {
      jest
        .spyOn(prisma.user, 'findUniqueOrThrow')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            { code: PrismaError.RecordNotFound, clientVersion: '5.0' },
          ),
        );
      expect(service.findByEmail(user.email)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a server error if other error is thrown', async () => {
      jest
        .spyOn(prisma.user, 'findUniqueOrThrow')
        .mockRejectedValue('some error');
      expect(service.findByEmail(user.email)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      jest.spyOn(prisma.user, 'update').mockResolvedValue(user);
      const result = await service.update(user.id, { name: user.name });
      expect(result).toEqual(user);
    });

    it('should throw an exception if user is not found', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            { code: PrismaError.RecordNotFound, clientVersion: '5.0' },
          ),
        );
      expect(service.update(user.id, { name: user.name })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if username exists', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'ERROR: duplicate key value violates unique constraint "username"',
            { clientVersion: '5.0', code: PrismaError.UniqueViolation },
          ),
        );
      expect(service.update(user.id, { name: user.name })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if email exists', async () => {
      jest
        .spyOn(prisma.user, 'update')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'ERROR: duplicate key value violates unique constraint "email"',
            { clientVersion: '5.0', code: PrismaError.UniqueViolation },
          ),
        );
      expect(service.update(user.id, { email: user.email })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a server error if other error is thrown', async () => {
      jest.spyOn(prisma.user, 'update').mockRejectedValue('some error');
      expect(service.update(user.id, { name: user.name })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findById', () => {
    it('should return the user if the id exists', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(user);
      const result = await service.findById(user.id);
      expect(result).toEqual(user);
    });

    it('should throw an exception if user is not found', async () => {
      jest
        .spyOn(prisma.user, 'findUniqueOrThrow')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            { code: PrismaError.RecordNotFound, clientVersion: '5.0' },
          ),
        );
      expect(service.findById(user.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw a server error if other error is thrown', async () => {
      jest
        .spyOn(prisma.user, 'findUniqueOrThrow')
        .mockRejectedValue('some error');
      expect(service.findById(user.id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
