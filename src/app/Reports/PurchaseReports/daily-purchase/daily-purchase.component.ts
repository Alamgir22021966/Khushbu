import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PurchaseService } from '@services/purchase.service';
import { ReportsService } from '@services/reports.service';
import { SalesService } from '@services/sales.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

interface Event {
  Name: string;
  Value: any;
}

@Component({
  selector: 'app-daily-purchase',
  templateUrl: './daily-purchase.component.html',
  styleUrls: ['./daily-purchase.component.scss']
})
export class DailyPurchaseComponent implements OnInit {

  ReportUIForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  public Category: Event[] = [];
  public SubCategory: Event[] = [];
  public PurchaseDate: any = [];
 // public PurchaseDate: Event[] = [];
  //public SalesDate: any = [];

  BaseURL: string = "";

  constructor(private fb: FormBuilder
    , @Inject('BASE_URL') baseUrl: string
    , private salesService: SalesService
    , private purchaseService: PurchaseService
    , private reportService: ReportsService
    , private currencyPipe: CurrencyPipe
    , private datePipe: DatePipe) {
    this.CreateReportUIForm();

    this.datePickerConfig = Object.assign({}, {
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY'

    });


    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Report/ReportPurchaseInformationDaily/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Report/ReportPurchaseInformationDaily/';
    }
  }


  CreateReportUIForm() {
    this.ReportUIForm = this.fb.group({
      PURCHASEDATE: [''],
      CATEGORYID: [''],
      SUBCATEGORYID: ['']
    });
  }
  ngOnInit() {
    this.GetPurchaseDate();
    this.GetCategory();
  }

  get f() { return this.ReportUIForm.controls; }

  public GetCategory(): void {

    this.salesService.GetCategory().subscribe(
      data => {
        
        this.Category = data;
        this.Category.unshift({ Name: 'All', Value: "All"  });

      });
  }

  public GetPurchaseDate(): void {

    this.purchaseService.GetlkPurchaseDate().subscribe(data => {
        this.PurchaseDate = data;
        this.PurchaseDate.unshift({ Name: 'All', Value: "All"  });

      },
      (err:any) => {
        console.log(err);
      }
    );
  }


  public GetSubCategory(CategoryID: any): void {
    if (CategoryID) {
      this.salesService.GetSubCategory(CategoryID).subscribe(
        data => {
          this.SubCategory = data;
          this.SubCategory.unshift({ Name: 'All', Value: "0"  });
          
        },
        (err:any) =>{
          console.log(err);
        }
      );
    }
  }

  public rptReportPurchaseInformationDaily(Purchasedate: string, CategoryID: string, SubcategoryID: number): void {
    let tr: any;
    
    this.reportService.ReportPurchaseInformationDaily(this.BaseURL + Purchasedate + "/" + CategoryID + "/" + SubcategoryID).subscribe((res) => {
        tr = new Blob([res], { type: 'application/pdf' });
      },
      () => { },
      () => {
        
        let fileURL = URL.createObjectURL(tr);
        console.log(fileURL);
        window.open(fileURL, '_blank');
      }
    );
  }

}
