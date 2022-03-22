import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthUser } from '../_models/auth-user.model';

@Injectable()
export class AuthInterseptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.authUser
            .pipe(
                take(1),
                exhaustMap((user: AuthUser) => {
                    if (!user) {
                        return next.handle(req);
                    }
                    const modifiedReq = req.clone({
                        params: new HttpParams().set('auth', user.token)
                        // headers: new HttpHeaders().set('x-auth-token', user.token)
                    });
                    return next.handle(modifiedReq);
                })
            );
    }
}

export const authInterseptorService = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterseptorService,
    multi: true,
}