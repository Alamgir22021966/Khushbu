import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SalesModel } from '../Models/sales.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {catchError, retry} from 'rxjs/operators';
import { DropdownModel } from '../Models/purchase.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
   
  })
};

@Injectable({
  providedIn: 'root'
})
export class SalesService {

   //readonly BaseURL = 'http://www.khushbuapp.com/api/Sales/';
   BaseURL: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    console.log(baseUrl);
      if(baseUrl == 'http://localhost:4200/'){
        this.BaseURL = 'https://localhost:44320/api/Sales/';
      }
      else{
        this.BaseURL = baseUrl + 'api/Sales/';
      }
   }


  
  public SaveSales(sales: SalesModel): Observable<any> {   
    console.log(sales);
    return this.http.post<any>(this.BaseURL + 'Save', sales, httpOptions)
      .pipe(map(
        response =>{
          return response;
        }
      ));   
  }


  public DeleteInvoiceNumber(InvoiceNumber: string): Observable<string>    
  {    
    return this.http.get<string>(this.BaseURL + 'DeleteInvoiceNumber?InvoiceNumber='+ InvoiceNumber, httpOptions)
    .pipe(
      catchError(this.handleError('SalesInfo', InvoiceNumber))
    );    
  } 

  public DeleteSalesDetails(InvoiceNumber: string): Observable<string>    
  {    
    return this.http.get<string>(this.BaseURL + 'DeleteSalesDetails?InvoiceNumber='+ InvoiceNumber, httpOptions)
    .pipe(
      catchError(this.handleError('SalesDetails', InvoiceNumber))
    );    
  } 
  public DeleteSalesDetails1(InvoiceNumber: string, Slno: number): Observable<string>    
  {    
    return this.http.get<string>(this.BaseURL + 'DeleteSalesDetails?InvoiceNumber='+ InvoiceNumber + '&Slno=' + Slno, httpOptions)
    .pipe(
      catchError(this.handleError('SalesDetails', InvoiceNumber))
    );    
  } 
  public GetSalesInfo(InvoiceNumber: any): Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetSalesInfo?InvoiceNumber='+ InvoiceNumber);    
  }

  public GetSalesDetails(InvoiceNumber: any): Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetSalesDetails?InvoiceNumber='+ InvoiceNumber);    
  }


  public GetRetailPrice(CategoryID: number, SubCategoryID: number, ItemID: number):Observable<number>    
    {    
      return this.http.get<number>(this.BaseURL + 'GetRetailPrice?CategoryID='+ CategoryID + '&SubCategoryID=' + SubCategoryID + '&ItemID=' + ItemID);    
  }

  public GetPurchasePrice(CategoryID: number, SubCategoryID: number, ItemID: number):Observable<number>    
    {    
      return this.http.get<number>(this.BaseURL + 'GetPurchasePrice?CategoryID='+ CategoryID + '&SubCategoryID=' + SubCategoryID + '&ItemID=' + ItemID);    
  }
  
  public GetCategory():Observable<DropdownModel[]>    
    {    
      return this.http.get<DropdownModel[]>(this.BaseURL + 'GetCategory');    
  }
  

  public GetInvoiceNumber():Observable<any>    
    {    
      return this.http.get<any>(this.BaseURL + 'GetInvoiceNumber');    
  }


  public GetlkInvoiceNumber():Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetlkInvoiceNumber');    
  }

  public GetlkSalesDate():Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetlkSalesDate');    
  }
  
  public GetSubCategory(CategoryID: any):Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetSubCategory?CategoryID='+ CategoryID);    
  }

  public GetProductName(CategoryID: number, SubCategoryID: number):Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetProductName?CategoryID='+ CategoryID + '&SubCategoryID=' + SubCategoryID);    
  }


  public downloadPDF1(InvoiceNumber): Observable<any>
  {
    return this.http.get<any>(this.BaseURL + 'ReportSalesInfo?InvoiceNumber='+ InvoiceNumber);

  }

  public downloadPDF(url: any): Observable<Blob>
  {
    return this.http.get(url, { responseType: 'blob' });

  }

  // public ReportSalesInformationBy(SalesDate: any, CategoryID: any, SubCategoryID: any): Observable<any>    
  // {    
  //   return this.http.get<any>(this.BaseURL + 'ReportSalesInformationBy?SALESDATE='+ SalesDate + '&CATEGORYID=' + CategoryID + '&SUBCATEGORYID=' + SubCategoryID);    
  // }


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
