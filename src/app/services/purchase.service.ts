import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
import { PurchaseModel, DropdownModel } from '../Models/purchase.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'jwt-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class PurchaseService {

  BaseURL: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Purchase/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Purchase/';
    }
  }

  public SavePurchase(Purchase: PurchaseModel) {
    console.log(Purchase);
    return this.http.post(this.BaseURL + 'Save', Purchase, httpOptions)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public Delete(PID: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?PID=' + PID, httpOptions)
      .pipe(
        catchError(this.handleError('PurchaseInfo', PID))
      );
  }

  public DeletePurchaseDetails(PID: any): Observable<string>    
  {    
    return this.http.get<string>(this.BaseURL + 'DeletePurchaseDetails?PID='+ PID, httpOptions)
    .pipe(
      catchError(this.handleError('PurchaseDetails', PID))
    );    
  } 

  public Search(PID: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Search?PID=' + PID);
  }

  public GetPurchaseInfo(PID: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPurchaseInfo?PID=' + PID);
  }

  public GetPurchaseDetails(PID: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPurchaseDetails?PID=' + PID);
  }

  public GetPID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetPID');
  }

  public GetlkPID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetlkPID');
  }

  public GetlkPurchaseDate():Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetlkPurchaseDate');    
  }

  public GetVendorName(): Observable<DropdownModel[]> {
    return this.http.get<DropdownModel[]>(this.BaseURL + 'GetVendorName');
  }

  public GetCategory(): Observable<DropdownModel[]> {
    return this.http.get<DropdownModel[]>(this.BaseURL + 'GetCategory');
  }

  public GetSubCategory(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetSubCategory', { params });
  }

  public GetProductName(params: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetProductName', { params });
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
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

  // message = undefined;
  // getMessage() {
  //   if (this.message !== null && this.message !== undefined) {
  //     return "default message";
  //   }
  //   return this.message;
  // }

  // message = undefined;
  // getMessage() {
  //      return this.message ?? 'Default message';

  // }

}


