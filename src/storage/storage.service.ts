import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async upload(uploadFilesDto: UploadFileDto[]) {
    try {
      const uploadResults = await this.uploadToS3(uploadFilesDto);
      const files = await this.prisma.file.createManyAndReturn({
        data: uploadResults.map(({ Key, Location }) => ({
          key: Key,
          url: Location,
        })),
      });
      return files;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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

  async remove(keys: string[]) {
    try {
      const { count } = await this.prisma.file.deleteMany({
        where: { key: { in: keys } },
      });
      if (count !== keys.length)
        throw new BadRequestException(
          'Cannot delete files as some of which are not found',
        );
      const command = new DeleteObjectsCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Delete: {
          Objects: keys.map((key) => ({
            Key: key,
          })),
        },
      });
      await this.s3Client.send(command);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
