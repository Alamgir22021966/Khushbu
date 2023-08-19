import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VendorModel } from '../Models/vendor.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  BaseURL: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Vendor/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Vendor/';
    }
  }

  public GetSupplierAutoCompleteData(): Observable<any> {
    return this.http.get<Observable<any>>(this.BaseURL + 'GetSupplierAutoCompleteData');
  }

  public SaveVendor(vendorModel: VendorModel): Observable<any> {

    return this.http.post<any>(this.BaseURL + 'Save', vendorModel, httpOptions)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public GetVendorID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetVendorID', httpOptions)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public GetVendorList(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetVendorList');
  }

  public GetVendor(VID: string): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetVendor?VID=' + VID, httpOptions)
      .pipe(
        catchError(this.handleError('User Information', VID))
      );
  }

  public Delete(VID: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?VID=' + VID, httpOptions)
      .pipe(
        catchError(this.handleError('Vendor Information', VID))
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

  
}
