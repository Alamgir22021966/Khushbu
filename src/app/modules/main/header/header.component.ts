import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppService } from '@services/app.service';
import { LoginService } from '@services/login.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup;
  public Title: any;

  constructor(
    private appService: AppService,
    private loginservice: LoginService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    this.SetTitle();
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }

  logout1() {
    this.appService.logout();
  }

  logout() {
    this.loginservice.logout();
  }

  public SetTitle(): void {
    this.router.events.pipe(
      map(() => this.activatedRoute.snapshot),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
    ).subscribe((route: ActivatedRouteSnapshot) => {
      this.Title = route.data.title;
    });



    this.activatedRoute.paramMap.subscribe(params => { 
      console.log(params);
      //  this.id = params.get('id'); 
      //  let products=this._productService.getProducts();
      //  this.product=products.find(p => p.productID==this.id);    
   });
   
  }



  

}
