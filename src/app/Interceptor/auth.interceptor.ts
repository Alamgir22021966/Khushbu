import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, map, filter, retry, catchError } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router, 
    private jwtHelper: JwtHelperService, 
    private localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.localStorageService.retrieve('token') != null && !this.jwtHelper.isTokenExpired(this.localStorageService.retrieve('token'))) {
      const cloneReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.localStorageService.retrieve('token')) });
      return next.handle(cloneReq).pipe(
        tap(
          succ => {

          },
          err => {
            if ([401, 403].indexOf(err.status) !== -1) {
              // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
              this.localStorageService.clear('token')
              this.router.navigateByUrl('/login')
            }
           
          }
        )
      )

    }
    else {
      return next.handle(req.clone());
    }
  }


}
