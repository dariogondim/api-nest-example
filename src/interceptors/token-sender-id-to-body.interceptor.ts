import { NestInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

/*
 * Traz o payload do token jwt no objeto dataOrRequest.user
 * Intercepta a requisição para adicionar o id do usuário no corpo da requisição
*/

@Injectable()
export class TokenSenderIdToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.body.senderId = request.user.id;
    return call$.pipe( tap( () => {} ) );
  }
}