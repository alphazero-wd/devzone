import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './dto';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  CompleteMultipartUploadCommandOutput,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 } from 'uuid';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
    });
  }

  async create(uploadFilesDto: UploadFileDto[]) {
    const uploadResults = await this.uploadToS3(uploadFilesDto);
    await this.prisma.file.createMany({
      data: uploadResults.map(({ Key, Location }) => ({
        key: Key,
        url: Location,
      })),
    });
    return uploadResults;
  }

  private async uploadToS3(uploadFilesDto: UploadFileDto[]) {
    const uploadResults: CompleteMultipartUploadCommandOutput[] = [];

    for (const { filename, buffer } of uploadFilesDto) {
      const key = `${v4()}-${filename}`;
      const multipartUpload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: this.configService.get('AWS_OBJECT_DEST') + key,
          Body: buffer,
        },
      });
      const result = await multipartUpload.done();
      uploadResults.push(result);
    }
    return uploadResults;
  }

  async findOne(key: string) {
    const file = await this.prisma.file.findUnique({
      where: { key },
    });
    if (!file)
      throw new NotFoundException({
        success: false,
        message: 'Cannot find file with the given key',
      });
    return file;
  }

  async remove(keys: string[]) {
    const command = new DeleteObjectsCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Delete: {
        Objects: keys.map((key) => ({
          Key: key,
        })),
      },
    });
    await this.s3Client.send(command);
    await this.prisma.file.deleteMany({ where: { key: { in: keys } } });
  }
}
