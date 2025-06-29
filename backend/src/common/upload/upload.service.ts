import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../environment/environment.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class UploadService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly environmentService: EnvironmentService,
    private readonly prisma: PrismaService,
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

  async getDocuments(userId: string, type?: string) {
    const whereClause: Prisma.DocumentWhereInput = { userId };

    if (type) {
      whereClause.type = type as Prisma.EnumDocumentTypeFilter;
    }

    const documents = await this.prisma.document.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return documents;
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const bucketName = 'freehunt-avatar';

    try {
      // Récupérer l'ancien avatar s'il existe
      const existingAvatar = await this.prisma.document.findFirst({
        where: {
          userId,
          type: 'AVATAR',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const { url, key } = await this.uploadFile(file, bucketName);

      // Si un aancien avatar existe, on le supprime de Minio
      if (existingAvatar) {
        try {
          const oldKey = existingAvatar.url.split('/').pop();
          if (oldKey) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: bucketName,
              Key: oldKey,
            });
            await this.s3Client.send(deleteCommand);
          }
        } catch (deleteError) {
          throw new Error(
            "Erreur lors de la suppression de l'ancien avatar" + deleteError,
          );
        }

        // mise à jour de la bdd
        const updatedDocument = await this.prisma.document.update({
          where: {
            id: existingAvatar.id,
          },
          data: {
            name: file.originalname,
            url,
            updatedAt: new Date(),
          },
        });

        return {
          url,
          key,
          document: updatedDocument,
          message: 'Avatar mis à jour avec succès',
        };
      } else {
        const newDocument = await this.prisma.document.create({
          data: {
            name: file.originalname,
            url,
            type: 'AVATAR',
            userId,
          },
        });

        return {
          url,
          key,
          document: newDocument,
          message: 'Avatar créé avec succès',
        };
      }
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de l'avatar" + error);
    }
  }
}
