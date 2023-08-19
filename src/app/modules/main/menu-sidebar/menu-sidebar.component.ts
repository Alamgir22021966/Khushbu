import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppService } from '@services/app.service';
import { LoginService } from '@services/login.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    public user: any;
    public menu = MENU;
    public JOBTITLE: string;


    constructor(
        public appService: AppService,
        private loginservice: LoginService,
        private jwtHelper: JwtHelperService,
        private localStorageService: LocalStorageService,
    ) { }

    ngOnInit() {
        this.user = this.appService.user;
        this.GetJobTitle();
    }

    public async GetJobTitle() {
        (await this.loginservice.GetUserInformation(this.jwtHelper.decodeToken(this.localStorageService.retrieve('token')).primarysid)).subscribe(
            (res: any) => {
                if (res.UID) {
                    this.JOBTITLE = res.JOBTITLE;
                }
            }
        );
    }


}

export const MENU = [
    {
        name: 'Dashboard',
        path: ['home/dashboard']
    },
    // {
    //     name: 'Blank',
    //     path: ['/home/blank']
    // },
    // {
    //     name: 'Modal',
    //     path: ['/home/modal']
    // },
    {
        name: 'Administrator Panel',
        children: [
            {
                name: 'New User',
                path: ['/home/adminpanel/Newuser']
            },

            {
                name: 'User List',
                path: ['/home/adminpanel/Userlist']
            },
            {
                name: 'New Supplier',
                path: ['/home/adminpanel/Newsupplier']
            },
            {
                name: 'Supplier List',
                path: ['/home/adminpanel/Supplierlist']
            },
            {
                name: 'Barcode Generators',
                path: ['/home/adminpanel/Barcode']
            }
        ]
    },
    {
        name: 'Human Resource',
        children: [
            {
                name: 'Resume',
                path: ['/home/humanresource/Resume']
            },

            // {
            //     name: 'Employee List',
            //     path: ['/home/humanresource/Emplist']
            // }
        ]
    },
    {
        name: 'Purchase Information',
        children: [
            {
                name: 'Purchase Details',
                path: ['/home/purchaseinformation/Purchase']
            },

            {
                name: 'Categories',
                path: ['/home/purchaseinformation/Categories']
            },

            {
                name: 'Item Information',
                path: ['/home/purchaseinformation/ItemInformation']
            }
        ]
    },
    {
        name: 'Sales Information',
        children: [
            {
                name: 'Sales Details',
                path: ['/home/SalesInformation/Sales']
            },

            // {
            //     name: 'Sales List',
            //     path: ['/home/SalesInformation/SalesList']
            // }
        ]
    },
    {
        name: 'Purchase Reports',
        children: [
            {
                name: 'Daily Purchase',
                path: ['/home/PurchaseReports/dailypurchase']
            },
            {
                name: 'Current Stock',
                path: ['/home/PurchaseReports/currentstock']
            },
        ]
    },
    {
        name: 'Sales Reports',
        children: [
            {
                name: 'Daily Sales',
                path: ['/home/SalesReports/dailysales']
            },

            {
                name: 'Monthly Sales',
                path: ['/home/SalesReports/monthlysales']
            },
            // {
            //     name: 'Invoice Generator',
            //     path: ['/home/SalesReports/InvoiceGenerator']
            // }
        ]
    },
    // {
    //     name: 'Google Maps',
    //     children: [
    //         {
    //             name: 'Google Map',
    //             path: ['/home/GoogleMaps/GoogleMap']
    //         },
    //         {
    //             name: 'Google Map 2',
    //             path: ['/home/GoogleMaps/GoogleMap2']
    //         },
    //         {
    //             name: 'Google Map 3',
    //             path: ['/home/GoogleMaps/GoogleMap3']
    //         },
    //         {
    //             name: 'Google Map 4',
    //             path: ['/home/GoogleMaps/GoogleMap4']
    //         },
    //     ]
    // },
    // {
    //     name: 'Payment Gateway',
    //     children: [
    //         {
    //             name: 'Payment Gateway',
    //             path: ['/home/PaymentGateways/PaymentGateway']
    //         },

    //         {
    //             name: 'HTML to PDF',
    //             path: ['/home/PaymentGateways/HTMLtoPDF']
    //         }
    //     ]
    // },
    // {
    //     name: 'Data Visualization',
    //     children: [
    //         {
    //             name: 'Line Chart',
    //             path: ['/home/DataVisualization/LineChart']
    //         },

    //         {
    //             name: 'Stacked Bar Chart',
    //             path: ['/home/DataVisualization/StackedChart']
    //         }
    //     ]
    // },


];


// https://www.npmjs.com/package/@auth0/angular-jwt
// https://www.npmjs.com/package/ngx-webstorage