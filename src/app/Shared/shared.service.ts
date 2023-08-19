import { Injectable, Inject, ElementRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
// import { map, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

export interface lookup {
  Value: string;
  Name: string;
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'jwt-token'
  })
};

// class SearchItem1 {
//   constructor(
//     public Value: string,
//     public Name: string,

//   ) { }
// }
// class SearchItem {
//   constructor(
//     public track: string,
//     public artist: string,
//     public link: string,
//     public thumbnail: string,
//     public artistId: string
//   ) { }
// }

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiRoot: string = "https://itunes.apple.com/search";
  BaseURL = '';

  public YEAR: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public MONTH: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public AREA: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public Category: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public STOGRPCODE: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public REGION: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public TOWN: BehaviorSubject<any[]> = new BehaviorSubject([]);

  public datastore: { data: lookup[] } = { data: [] };

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    @Inject('BASE_URL') baseUrl: string) {
    if (baseUrl === 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44301/api/ReportUI/';
    }
    else {
      this.BaseURL = baseUrl + 'api/ReportUI/';
    }

  }

  public GetYear(): Observable<any[]> {
    return this.http.get<Array<any>>(this.BaseURL + 'GetYear', httpOptions);
  }

  // public GetMonth(): Observable<any> {
  //   return this.http.get<Observable<Array<any>>>(this.BaseURL + 'GetMonth');
  // }

  public GetMonth(): Observable<any> {
    return of([
      { Value: '01', Name: 'JAN' },
      { Value: '02', Name: 'FEB' },
      { Value: '03', Name: 'MAR' },
      { Value: '04', Name: 'APR' },
      { Value: '05', Name: 'MAY' },
      { Value: '06', Name: 'JUN' },
      { Value: '07', Name: 'JUL' },
      { Value: '08', Name: 'AUG' },
      { Value: '09', Name: 'SEP' },
      { Value: '10', Name: 'OCT' },
      { Value: '11', Name: 'NOV' },
      { Value: '12', Name: 'DEC' }
    ]);
  }

  public GetAutoCompleteData(): Observable<any> {
    return this.http.get<Observable<any>>(this.BaseURL + 'GetAutoCompleteData');
  }

  public GetStore(StroeType: string): Observable<any> {
    return this.http.get<Observable<Array<any>>>(this.BaseURL + 'GetStore?REPORTTYPE=' + StroeType, httpOptions)
      .pipe(
        catchError(this.handleError('Weekly Counter Sales', StroeType))
      );
  }

  public GetEmpno(EmpType: string): Observable<any> {
    return this.http.get<Observable<Array<any>>>(this.BaseURL + 'GetEmpno?REPORTTYPE=' + EmpType, httpOptions)
      .pipe(
        catchError(this.handleError('Weekly Counter Sales', EmpType))
      );
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  public onfocus(form: FormGroup, elementRef: ElementRef) {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        const invalidControl = elementRef.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

}


// Please note the dollar sign. 
// Using the dollar sign in the name of a variable that is an observable, is considered best practice. 
// This way it’s easy to identify if your variable is an observable or not.