import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '@services/reports.service';
import { SalesService } from '@services/sales.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss']
})
export class DailySalesComponent implements OnInit {

  ReportUIForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  public Category: Event[] = [];
  public SubCategory: Event[] = [];
  public SalesDate: Event[] = [];
  //public SalesDate: any = [];

  BaseURL: string = "";


  constructor(private fb: FormBuilder
      , @Inject('BASE_URL') baseUrl: string
      , private salesService: SalesService
      , private reportService: ReportsService
      , private currencyPipe: CurrencyPipe
      , private datePipe: DatePipe
      ) {

    this.CreateReportUIForm();

    this.datePickerConfig = Object.assign({}, {
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY'

    });


    if(baseUrl == 'http://localhost:4200/'){
      this.BaseURL = 'https://localhost:44320/api/Report/ReportSalesInformationBy/';
    }
    else{
      this.BaseURL = baseUrl + 'api/Report/ReportSalesInformationBy/';
    }


  }

  CreateReportUIForm() {
    this.ReportUIForm = this.fb.group({
      SALESDATE: [''],
      CATEGORYID: [''],
      SUBCATEGORYID: ['']
     });
  }

  ngOnInit() {
    this.GetSalesDate();
    this.GetCategory();
    //this.f.SALESDATE.patchValue(new Date())
    
  }

  get f() { return this.ReportUIForm.controls; }
  

  public GetCategory(): void {

    this.salesService.GetCategory().subscribe(
      data => {
        
        this.Category = data;
        this.Category.unshift({ Name: 'All', Value: "All"  });

      });
  }

  public GetSalesDate(): void {

    this.salesService.GetlkSalesDate().subscribe(
      data => {
        
        //this.SalesDate = this.datePipe.transform(this.SalesDate, 'dd/MM/yyyy');
        this.SalesDate = data;
        this.SalesDate.unshift({ Name: 'All', Value: "All"  });

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


  public onOpen() {
    this.Category.push({ Name: 'All', Value: null });
  }
  onClose() {
    this.Category.push({ Name: '(close)', Value: null });
  }


  

  public rptReportSalesInformationBy(Salesdate: string, CategoryID: string, SubcategoryID: number): void {
    let tr: any;
    
    this.reportService.ReportSalesInformationBy(this.BaseURL + Salesdate + "/" + CategoryID + "/" + SubcategoryID).subscribe((res) => {
        tr = new Blob([res], { type: 'application/pdf' });
      },
      () => { },
      () => {
        
        let fileURL = URL.createObjectURL(tr);
        // console.log(fileURL);
        window.open(fileURL, '_blank');
      }
    );
  }

}

interface Event {
  Name: string;
  Value: any;
}