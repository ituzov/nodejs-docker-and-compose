import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next
      .handle()
      .pipe(map((data) => plainToInstance(context.getClass(), data)));
  }
}
