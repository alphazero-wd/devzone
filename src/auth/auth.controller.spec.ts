import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { User } from '@prisma/client';
import { userFixture } from '../users/test-utils';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    user = userFixture();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    let createUserDto: CreateUserDto;
    beforeEach(() => {
      createUserDto = {
        password: user.password,
        email: user.email,
        name: user.name,
      };
    });
    it('should create a user successfully', async () => {
      jest.spyOn(service, 'register').mockResolvedValue(user);
      const result = await controller.register(createUserDto);
      expect(result).toEqual(user);
      expect(service.register).toHaveBeenCalledTimes(1);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a bad request exception if username/email already exists', async () => {
      jest
        .spyOn(service, 'register')
        .mockRejectedValue(new BadRequestException());
      expect(controller.register(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return the current user', () => {
      expect(controller.login(user)).toEqual(user);
    });
  });

  describe('me', () => {
    it('should return the current user', () => {
      expect(controller.me(user)).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should invalidate cookie', async () => {
      const req = {
        logOut: () => {},
        session: {
          cookie: { maxAge: 100000 },
        },
      } as any;
      expect(req.session.cookie.maxAge).toBe(0);
    });
  });
});
