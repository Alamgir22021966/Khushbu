import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
   
  })
};
@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  BaseURL: string = "";
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    if(baseUrl == 'http://localhost:4200/'){
      this.BaseURL = 'https://localhost:44320/api/Barcode/';
    }
    else{
      this.BaseURL = baseUrl + 'api/Barcode/';
    }
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
