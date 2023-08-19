import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(
    private spinner: NgxSpinnerService,  
    private toastr: ToastrService,
    ) 
    { }
  timer: NodeJS.Timeout;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    this.timer = setTimeout(() =>
      this.spinner.show(), 1000
    );

    return next.handle(request).pipe(
      tap(
        req => {
          if (req instanceof HttpResponse) {
            this.spinner.hide();
            if (this.timer) {
              clearTimeout(this.timer);
            }
          }
        },
        err => {
          this.spinner.hide();
          this.toastr.error(err);
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }
      )
    );
  }


}
