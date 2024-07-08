import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { File, Prisma, User } from '@prisma/client';
import { PrismaError } from '../prisma/error.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { StorageService } from '../storage/storage.service';
import { UploadFileDto } from '../storage/dto';
import { UserWithAvatar } from './types';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: { ...createUserDto },
      });
      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueViolation) {
          if (error.message.includes('username'))
            throw new BadRequestException(
              'User with that username already exists',
            );
          if (error.message.includes('email'))
            throw new BadRequestException(
              'User with that email already exists',
            );
        }
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async confirmEmail(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { confirmedAt: new Date() },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === PrismaError.RecordNotFound)
          throw new NotFoundException('User with that id does not exist');

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordNotFound)
          throw new NotFoundException('User with that id does not exist');
        if (error.code === PrismaError.UniqueViolation) {
          throw new BadRequestException('User with that email already exists');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: { avatar: true },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === PrismaError.RecordNotFound)
          throw new NotFoundException('Cannot find user with the given id');
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async addAvatar(userId: number, uploadAvatarDto: UploadFileDto) {
    const [result] = await this.storageService.create([uploadAvatarDto]);
    const { id } = await this.storageService.findOne(result.Key);
    await this.update(userId, { avatarId: id });
  }

  async removeAvatar(user: UserWithAvatar) {
    if (!user.avatar)
      throw new BadRequestException("You haven't uploaded an avatar");
    await this.storageService.remove([user.avatar.key]);
  }
}
