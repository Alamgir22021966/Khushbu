import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule, routingComponents } from '@/app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import { FooterComponent } from '@modules/main/footer/footer.component';
import { MenuSidebarComponent } from '@modules/main/menu-sidebar/menu-sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MessagesComponent } from '@modules/main/header/messages/messages.component';
import { NotificationsComponent } from '@modules/main/header/notifications/notifications.component';
import { ButtonComponent } from './components/button/button.component';

import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import { UserComponent } from '@modules/main/header/user/user.component';
import { LanguageComponent } from '@modules/main/header/language/language.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DropdownMenuComponent } from './components/dropdown/dropdown-menu/dropdown-menu.component';
import { MDBBootstrapModule, } from 'angular-bootstrap-md';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { getBaseUrl } from 'main';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule, TooltipOptions } from 'ng2-tooltip-directive';
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { SearchComponent } from './modals/search/search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedService } from './Shared/shared.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JwtModule } from "@auth0/angular-jwt";
import { NgxWebstorageModule } from 'ngx-webstorage';
import { httpInterceptorProviders } from './Interceptor';
// import { AgmCoreModule } from '@agm/core';

registerLocaleData(localeEn, 'en-EN');

export function tokenGetter() {
    return localStorage.getItem("access_token");
}

export const MyDefaultTooltipOptions: TooltipOptions = {
    'show-delay': 500
  }

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        MessagesComponent,
        NotificationsComponent,
        ButtonComponent,
        UserComponent,
        LanguageComponent,
        MenuItemComponent,
        DropdownComponent,
        DropdownMenuComponent,
        SearchComponent,
        routingComponents,
       
        
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true
        }),
        MDBBootstrapModule.forRoot(),
        NgxBarcodeModule,
        NgSelectModule,
        PerfectScrollbarModule,
        FontAwesomeModule,
        // TooltipModule,
        TooltipModule.forRoot(MyDefaultTooltipOptions as TooltipOptions),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        AutocompleteLibModule,
        NgxSpinnerModule,
        NgxWebstorageModule.forRoot(),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ["example.com"],
                disallowedRoutes: ["http://example.com/examplebadroute/"],
            },
        }),
        
        // AgmCoreModule.forRoot({  
        //     apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'  
        // })
        // AIzaSyCW810E0Bbnwtjg0_x1vvRPN9UrEF4-aic
        // AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw
    ],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        httpInterceptorProviders,
        BsModalService,
        BsModalRef,
        SharedService,
        CurrencyPipe,
        DatePipe,
    ],
    // entryComponents: [
    //     SearchComponent,
    // ],
    bootstrap: [AppComponent]
})
export class AppModule { }
