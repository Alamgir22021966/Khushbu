import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '@services/reports.service';
import { SalesService } from '@services/sales.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

interface Event {
  Name: string;
  Value: any;
}

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.scss']
})
export class MonthlySalesComponent implements OnInit {

  ReportUIForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  public Category: Event[] = [];
  public SubCategory: Event[] = [];
  BaseURL: string = "";

  constructor(private fb: FormBuilder
      , @Inject('BASE_URL') baseUrl: string
      , private salesService: SalesService
      , private reportService: ReportsService
      , private currencyPipe: CurrencyPipe
      , private datePipe: DatePipe) { 
        this.CreateReportUIForm();

        this.datePickerConfig = Object.assign({}, {
          showWeekNumbers: false,
          isAnimated: true,
          dateInputFormat: 'DD/MM/YYYY'

        });

        if(baseUrl == 'http://localhost:4200/'){
          this.BaseURL = 'https://localhost:44320/api/Report/ReportSalesInformationDaily/';
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
    this.GetCategory();
  }

  get f() { return this.ReportUIForm.controls; }

  public onOpen() {
    this.Category.push({ Name: 'All', Value: null });
  }
  onClose() {
    this.Category.push({ Name: '(close)', Value: null });
  }

  public GetCategory(): void {

    this.salesService.GetCategory().subscribe(
      data => {
        
        this.Category = data;
        this.Category.unshift({ Name: 'All', Value: "All"  });

      },
      (err:any) =>{
        console.log(err);
      });
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


 

  public rptReportSalesInformationDaily1(salesdate: Date, CategoryID: string, SubcategoryID: number): void {
    let tr: any;
    
    this.reportService.ReportSalesInformationDaily1(this.BaseURL + this.datePipe.transform(salesdate, 'dd/MM/yyyy').toString() + "/" + CategoryID + "/" + SubcategoryID).subscribe((res) => {
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


  public rptReportSalesInformationDaily(salesdate: Date, CategoryID: string, SubcategoryID: number): void {
    let tr: any;
    
    this.reportService.ReportSalesInformationDaily(this.datePipe.transform(salesdate, 'dd/MM/yyyy').toString(), CategoryID, SubcategoryID).subscribe((res) => {
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
