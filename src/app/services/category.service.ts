import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../Models/category.model';
import {catchError, retry} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
   
  })
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  BaseURL: string = "";
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    if(baseUrl == 'http://localhost:4200/'){
      this.BaseURL = 'https://localhost:44320/api/Category/';
    }
    else{
      this.BaseURL = baseUrl + 'api/Category/';
    }
   }

  public Save(category: Category): Observable<any> {   
    
    return this.http.post<any>(this.BaseURL + 'Save', category, httpOptions)
      .pipe(map(
        response =>{
          return response;
        }
      ));   
  }

  public GetCategoryID(): Observable<any>    
    {    
      return this.http.get<any>(this.BaseURL + 'GetCategoryID');    
  }

  public GetCategory(CategoryID: any): Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'GetCategory?CategoryID='+ CategoryID);    
  }

  public Getsubcategorylist(CategoryID: any): Observable<any>    
  {    
    return this.http.get<any>(this.BaseURL + 'Getsubcategorylist?CategoryID='+ CategoryID);    
  }

  public Delete(CategoryID: string): Observable<string>    
  {    
    return this.http.get<string>(this.BaseURL + 'Delete?CategoryID='+ CategoryID, httpOptions)
      .pipe(
        catchError(this.handleError('CategoryInfo', CategoryID))
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
