import * as argon2 from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { userFixture } from '../users/test-utils';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto';
import { MailService } from '../mail/mail.service';

jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        MailService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    user = userFixture();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    let createUserDto: CreateUserDto;
    beforeEach(() => {
      createUserDto = {
        password: user.password,
        email: user.email,
        name: user.name,
      };
      (argon2.hash as jest.Mock) = jest.fn().mockResolvedValue('hash');
    });
    it('should create a user successfully', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      const result = await authService.register(createUserDto);
      expect(result).toEqual(user);
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hash',
      });
    });

    it('should throw a bad request exception if username/email already exists', async () => {
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new BadRequestException());
      expect(authService.register(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('validateUser', () => {
    let argon2Verify: jest.Mock;
    beforeEach(() => {
      argon2Verify = jest.fn().mockResolvedValue(true);
      (argon2.verify as jest.Mock) = argon2Verify;
    });
    it("should throw a bad request exception when email doesn't exist", async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockRejectedValue(new NotFoundException());
      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw a bad request exception when provided password is incorrect', async () => {
      argon2Verify.mockResolvedValue(false);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrowError(BadRequestException);
    });
    it('should log the user in if the provided data is correct', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      const password = 'p@ssw0rD';
      expect(await authService.validateUser(user.email, password)).toEqual(
        user,
      );
      expect(argon2.verify).toHaveBeenCalledWith(user.password, password);
    });
  });
});
