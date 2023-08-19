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
export class ReportsService {

  BaseURL: string = "";
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Report/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Report/';
    }
  }



  public ReportSalesInformationBy(url: any): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });

  }

  public ReportCurrentStockStatus(url: any): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });

  }

  public ReportSalesInformationDaily1(url: any): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });

  }


  public ReportSalesInformationDaily(SalesDate: string, CategoryID: any, SubCategoryID: any): Observable<Blob> {
    return this.http.get<any>(this.BaseURL + 'ReportSalesInformationDaily?SALESDATE=' + SalesDate + '&CATEGORYID=' + CategoryID + '&SUBCATEGORYID=' + SubCategoryID, { responseType: 'json' });
  }

  public GetCurrentStock(CategoryID: number, SubCategoryID?: number): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetCurrentStocks?CategoryID=' + CategoryID + '&SubCategoryID=' + SubCategoryID);
  }

  public ReportPurchaseInformationDaily(url: any): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });

  }

}
