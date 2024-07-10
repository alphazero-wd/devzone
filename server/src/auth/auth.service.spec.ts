import argon2 from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { userFixture } from '../users/test-utils';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto';
import { MailService } from '../mail/mail.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CONFIRM_EMAIL_KEY_PREFIX,
  FORGOT_PASSWORD_KEY_PREFIX,
  MOCK_TOKEN,
} from '../common/constants';

jest.mock('uuid', () => ({ v4: () => MOCK_TOKEN }));
jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let mailService: MailService;
  let cache: Cache;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MailService,
          useValue: {
            sendConfirmationEmail: jest.fn(),
            sendResetPassword: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            confirmEmail: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();
    mailService = module.get<MailService>(MailService);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    cache = module.get(CACHE_MANAGER);
    user = userFixture();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(mailService).toBeDefined();
    expect(cache).toBeDefined();
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
      expect(authService.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('sendConfirmationEmail', () => {
    it('should send a confirmation email and set the cache', async () => {
      await authService.sendConfirmationEmail(user);

      expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
        user.email,
        user.name,
        MOCK_TOKEN,
      );
      expect(cache.set).toHaveBeenCalledWith(
        `${CONFIRM_EMAIL_KEY_PREFIX}:${MOCK_TOKEN}`,
        user.id,
      );
    });
  });

  describe('confirmEmail', () => {
    it('should throw an error if token is not found', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(undefined);

      expect(authService.confirmEmail(user.id, MOCK_TOKEN)).rejects.toThrow(
        BadRequestException,
      );
      expect(cache.get).toHaveBeenCalledWith(
        `${CONFIRM_EMAIL_KEY_PREFIX}:${MOCK_TOKEN}`,
      );
    });

    it('should confirm the user if token is found', async () => {
      jest.spyOn(cache, 'del').mockResolvedValue();
      jest.spyOn(cache, 'get').mockResolvedValue(user.id);
      await authService.confirmEmail(user.id, MOCK_TOKEN);
      expect(cache.del).toHaveBeenCalledWith(
        `${CONFIRM_EMAIL_KEY_PREFIX}:${MOCK_TOKEN}`,
      );
      expect(usersService.confirmEmail).toHaveBeenCalledWith(user.id);
    });
  });

  describe('validateUser', () => {
    let argon2Verify: jest.Mock;
    beforeEach(() => {
      argon2Verify = jest.fn().mockResolvedValue(true);
      (argon2.verify as jest.Mock) = argon2Verify;
    });
    it("should throw a bad request exception when email doesn't exist", async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrow(
        new BadRequestException('Wrong email or password provided'),
      );
    });

    it('should throw a bad request exception when provided password is incorrect', async () => {
      argon2Verify.mockResolvedValue(false);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrow(BadRequestException);
    });
    it('should return the user if the provided data is correct', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      const password = 'p@ssw0rD';
      expect(await authService.validateUser(user.email, password)).toEqual(
        user,
      );
      expect(argon2.verify).toHaveBeenCalledWith(user.password, password);
    });
  });

  describe('handleForgotPassword', () => {
    it('should throw an exception when user does not exist', () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      expect(authService.handleForgotPassword(user.email)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should send email and store token in cache', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      await authService.handleForgotPassword(user.email);
      expect(cache.set).toHaveBeenCalledWith(
        `${FORGOT_PASSWORD_KEY_PREFIX}:${MOCK_TOKEN}`,
        user.id,
      );
      expect(mailService.sendResetPassword).toHaveBeenCalledWith(
        user.email,
        user.name,
        MOCK_TOKEN,
      );
    });
  });
});
