import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Resume } from '../Models/resume.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};


interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'pdfMake', src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.59/pdfmake.min.js' },
  { name: 'vfsFonts', src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.59/vfs_fonts.js' }
];


@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  BaseURL: string = "";
  
  private scripts: any = {};

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    console.log(baseUrl);
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Resume/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Resume/';
    }



    // ScriptStore.forEach((script: any) => {
    //  this.scripts[script.name] = {
    //    loaded: false,
    //    src: script.src
    //  };
    // });


  }


  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          console.log(`${name} Loaded.`);
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }


  public GetNewEID(): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetNewEID');
  }

  public Save(resume: Resume): Observable<any> {
    return this.http.post<any>(this.BaseURL + 'Save', resume, httpOptions)
      .pipe(map(
        response => {
          return response;
        }
      ));
  }

  public GetEID(EID: any): Observable<any> {
    return this.http.get<any>(this.BaseURL + 'GetEID?EID=' + EID);
  }

  public Delete(EID: string): Observable<string> {
    return this.http.get<string>(this.BaseURL + 'Delete?EID=' + EID, httpOptions)
      .pipe(
        catchError(this.handleError('Resume', EID))
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


