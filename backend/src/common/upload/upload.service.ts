import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../environment/environment.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly environmentService: EnvironmentService,
  ) {
    this.s3Client = new S3Client({
      region: 'eu-west-3',
      endpoint: this.environmentService.get('S3_URL', ''),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.environmentService.get(
          'S3_ACCESS_KEY',
          'vT86tO0pmnyWimIrVtTN',
        ),
        secretAccessKey: this.environmentService.get(
          'S3_SECRET_KEY',
          'YkNAG8oMYc4dcsGGi2uywOBSoj3yHCJUzGieBMx8',
        ),
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
  ): Promise<{ url: string; key: string }> {
    const uniqueKey = `${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: file.buffer,
    });
    await this.s3Client.send(command);
    return {
      url: `${this.environmentService.get('S3_URL')}/${bucketName}/${uniqueKey}`,
      key: uniqueKey,
    };
  }
}
