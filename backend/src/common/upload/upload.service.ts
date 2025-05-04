import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(private readonly minioClient: S3Client) {
    this.minioClient = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.MINIO_URL || '',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'vT86tO0pmnyWimIrVtTN',
        secretAccessKey:
          process.env.MINIO_SECRET_KEY ||
          'YkNAG8oMYc4dcsGGi2uywOBSoj3yHCJUzGieBMx8',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: 'test',
      Key: file.originalname,
      Body: file.buffer,
    });
    await this.minioClient.send(command);
    return file.originalname;
  }
}
