import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { UploadFileDto } from './dto';
import { BadRequestException } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: () => '123',
}));
const s3Mock = mockClient(S3Client);

describe('StorageService', () => {
  let service: StorageService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'AWS_BUCKET_NAME':
                  return 'test';
                case 'AWS_OBJECT_DEST':
                  return 'test/';
                case 'AWS_REGION':
                  return 'local';
                default:
                  '';
              }
            },
          },
        },
        {
          provide: PrismaService,
          useValue: {
            file: {
              createManyAndReturn: jest.fn(),
              findUnique: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload to S3', async () => {
      const uploadFilesDto: UploadFileDto[] = [
        {
          buffer: Buffer.from('hello'),
          filename: 'foo.txt',
        },
        {
          buffer: Buffer.from('world'),
          filename: 'bar.txt',
        },
      ];
      s3Mock.on(CreateMultipartUploadCommand).resolves({ UploadId: '1' });
      s3Mock.on(UploadPartCommand).resolves({ ETag: '1' });
      await service.upload(uploadFilesDto);
      expect(prisma.file.createManyAndReturn).toHaveBeenCalledWith({
        data: [
          {
            key: 'test/123-foo.txt',
            url: 'https://test.s3.local.amazonaws.com/test/123-foo.txt',
          },
          {
            key: 'test/123-bar.txt',
            url: 'https://test.s3.local.amazonaws.com/test/123-bar.txt',
          },
        ],
      });
    });
  });

  describe('delete', () => {
    let keys: string[];
    beforeEach(() => {
      keys = ['test/123-foo.txt', 'test/123-bar.txt', 'test/123-baz.txt'];
      s3Mock.on(DeleteObjectsCommand).resolves({
        Deleted: keys.map((k) => ({ Key: k })),
      });
    });

    it('should throw an error if some files are not found', async () => {
      jest.spyOn(prisma.file, 'deleteMany').mockResolvedValue({ count: 2 });
      expect(service.remove(keys)).rejects.toThrow(BadRequestException);
    });

    it('should delete the file', async () => {
      jest.spyOn(prisma.file, 'deleteMany').mockResolvedValue({ count: 3 });
      await service.remove(keys);
      expect(prisma.file.deleteMany).toHaveBeenCalledWith({
        where: { key: { in: keys } },
      });
    });
  });
});
