import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {}


// npm i @fortawesome/angular-fontawesome
// npm install ngx-bootstrap --save


// let srcObservable= of(1,2,3,4)
// let innerObservable= of('A','B','C','D')
 
// srcObservable.pipe(
//   switchMap( val => {
//     console.log('Source value '+val)
//     console.log('starting new observable')
//     return innerObservable
//   })
// )
// .subscribe(ret=> {
//   console.log('Recd ' + ret);
// })



// https://www.tektutorialshub.com/angular/using-switchmap-in-angular/

// ngOnInit() {
//     this._Activatedroute.paramMap.subscribe(params => { 
//        this.service.getProduct(+params.get('id')) 
//           .subscribe((product: Product) => this.product = product);
//     });
//   }


// ngOnInit() {
 
//     this.activatedRoute.paramMap
//       .pipe(
//         switchMap((params: Params) => {
//           return this.service.getProduct(params.get('id'))
//         }
//         ))
//       .subscribe((product: Product) => this.product = product);
// }



// this.mainForm.get("productCode").valueChanges
// .pipe(
//   debounceTime(700)
// )
// .subscribe(val=> {
//   this.queryDepositData(val)
//     .subscribe(data => {
//       this.product=data;
//   })
// })

// this.mainForm.get("productCode").valueChanges
// .pipe(
//   debounceTime(700),
//   switchMap(val => {
//     return this.queryDepositData();
//   })
// )
// .subscribe(data => {
//   this.product=data;
// })


// https://www.tektutorialshub.com/angular/angular-passing-parameters-to-route/  ----need to read

// https://www.geekstrick.com/pass-data-from-routes-to-components-in-angular/