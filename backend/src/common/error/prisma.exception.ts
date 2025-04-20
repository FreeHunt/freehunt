import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erreur serveur';
    let error = 'Internal Server Error';

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = 'Valeur trop longue pour une colonne en base de données';
        error = 'ValueTooLong';
        break;
      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = 'Aucun enregistrement trouvé pour les critères spécifiés';
        error = 'ValueNotFound';
        break;
      case 'P2002':
        status = HttpStatus.CONFLICT;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message = `Donnée déjà existante pour le champ unique : ${exception.meta?.target}`;
        error = `ValueAlreadyExists`;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message = `Violation de contrainte de clé étrangère : ${exception.meta?.field_name}`;
        error = 'ForeignKeyViolation';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message = `${exception.meta?.cause}`;
        error = 'NotFoundDependency';
        break;
      default:
        message = exception.message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
