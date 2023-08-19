import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ItemInfoModel } from '../Models/item-info.model';
import { map } from 'rxjs/operators';
import { DropdownModel } from '../Models/purchase.model';
import { Observable, of } from 'rxjs';
import {catchError, retry} from 'rxjs/internal/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
   
  })
};

@Injectable({
  providedIn: 'root'
})
export class ItemInfoService {

  BaseURL: string = "";
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    if(baseUrl == 'http://localhost:4200/'){
      this.BaseURL = 'https://localhost:44320/api/ItemInfo/';
    }
    else{
      this.BaseURL = baseUrl + 'api/ItemInfo/';
    }
  }

  public SaveItem(itemInfo: ItemInfoModel) {   
    console.log(itemInfo);
    return this.http.post(this.BaseURL + 'Save', itemInfo, httpOptions)
      .pipe(map(
        response =>{
          return response;
        }
      ));   
  }

  public DeleteItems(CategoryID: any, SubCategoryID: any): Observable<string>    
  {    
    return this.http.get<string>(this.BaseURL + 'DeleteItems?CategoryID='+ CategoryID + '&SubCategoryID=' + SubCategoryID, httpOptions)
    .pipe(
      catchError(this.handleError('ItemDetails', SubCategoryID))
    );    
  } 

  public GetCategory():Observable<DropdownModel[]>    
  {    
    return this.http.get<DropdownModel[]>(this.BaseURL + 'GetCategory');    
  }

  public GetSubCategory(CategoryID: any):Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetSubCategory?CategoryID='+ CategoryID);    
  }

  public GetItemList(CategoryID: any, SubCategoryID: any):Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetItemList?CategoryID='+ CategoryID + '&SubCategoryID=' + SubCategoryID);    
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
