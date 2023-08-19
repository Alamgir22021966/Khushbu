import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";
import { ErrorInterceptor } from "./error.interceptor";
import { SpinnerInterceptor } from "./spinner.interceptor";

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  
  ];


//   https://stackblitz.com/angular/kmeqdgdrenj?file=src%2Fapp%2Fhttp-interceptors%2Flogging-interceptor.ts

// https://www.c-sharpcorner.com/blogs/what-is-new-in-angular-12-how-to-upgrade-to-angular-12