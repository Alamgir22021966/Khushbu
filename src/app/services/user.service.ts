
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UserModel } from '@/Models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BaseURL: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/User/';
    }
    else {
      this.BaseURL = baseUrl + 'api/User/';
    }
  }

  public GetAllUser(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'AllUser');
  }

  public GetSupplierAutoCompleteData(): Observable<any> {
    return this.http.get<Observable<any>>(this.BaseURL + 'GetSupplierAutoCompleteData');
  }

  public Save(user: UserModel) {
    //return this.http.post(this.BaseURL + 'Save', JSON.stringify(user), httpOptions).pipe(); 
    return this.http.post(this.BaseURL + 'Save', user)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public GetUID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetUID');
  }

  public GetUserList(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetUserList');
  }

  public GetUser(UID: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetUserID?UID=' + UID, httpOptions)
      .pipe(
        catchError(this.handleError('User Information', UID))
      );
  }

  public Delete(UID: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?UID=' + UID, httpOptions)
      .pipe(
        catchError(this.handleError('User Information', UID))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }



  public roleMatch(allowedRoles: any): boolean {
    var isMatch = false;

    //var payload = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var payload = JSON.parse(localStorage.getItem('token').split('.')[1]);
    console.log(payload);
    //var payload = this.jwtHelper.decodeToken(localStorage.getItem('token').split('.')[1])
    var userRole = payload.Role;
    console.log(userRole);
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }

    });
    return isMatch;
  }


}
