import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PdfmakeService } from '@services/PDFMake/pdfmake.service';
import { ReportsService } from '@services/reports.service';
import { SalesService } from '@services/sales.service';

@Component({
  selector: 'app-current-stocks',
  templateUrl: './current-stocks.component.html',
  styleUrls: ['./current-stocks.component.scss']
})
export class CurrentStocksComponent implements OnInit {

  ReportCurrentStock: FormGroup;
  public Category:any = [];
  public SubCategory = [];
  events: Event[] = [];
  public currentStocks: stock[] = [];

  BaseURL: string = "";

  constructor(
    private fb: FormBuilder,
    @Inject('BASE_URL') baseUrl: string,
    private salesService: SalesService,
    private reportService: ReportsService,
    private pdfService: PdfmakeService,
    ) {

    this.CreateReportUICurrentStock();
    this.Category;
    
    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Report/ReportCurrentStockStatus/';
    }
    else {
      this.BaseURL = baseUrl + 'api/Report/ReportCurrentStockStatus/';
    }


  }

  CreateReportUICurrentStock() {
    let arr = [];
    // arr.push(this.BuildFormDynamic())
    for (let i = 0; i < 25; i++) {
      arr.push(this.BuildFormDynamic());
    }

    this.ReportCurrentStock = this.fb.group({
      StockType: this.fb.group({
        CATEGORYID: [''],
        SUBCATEGORYID: [''],

      }),
      StockDetails: this.fb.array(arr) as FormArray,
    });
  }

  BuildFormDynamic(): FormGroup {
    return this.fb.group({
      CategoryID: [''],
      SubCategoryID: [''],
      ProductName: [''],
      MinStock: [''],
      CurrentStock: [''],
    });
  }


  ngOnInit() {
    this.GetCategory();

    this.ReportCurrentStock.get('StockType.CATEGORYID').valueChanges.subscribe(
      (val: any) => {
        if (val == 'All') {
          this.ReportCurrentStock.get('StockType.SUBCATEGORYID').reset();
        }
        this.GetSubCategory(val);
        this.GetCurrentStock(val, 0);
      });

  }

  get f() { return this.ReportCurrentStock.controls; }

  get StockType() { return this.ReportCurrentStock.get('StockType'); }

  get StockDetails() {
    return this.ReportCurrentStock.get('StockDetails') as FormArray;
  }

  public onOpen() {
    this.Category.push({ Name: 'All', Value: null });
  }

  public onClose() {
    this.Category.push({ Name: '(close)', Value: null });
  }

  public onFocus($event: Event) {
    this.Category.push({ Name: '(focus)', Value: $event });
  }

  public onSearch($event) {
    this.Category.push({ Name: '(search)', Value: $event });
  }

  public GetCategory(): void {

    this.salesService.GetCategory().subscribe(
      data => {
        this.Category = data;
        this.Category.unshift({ Name: 'All', Value: "All" });
      },
      (err: any) => {
        console.log(err);
      });
  }

  public GetSubCategory(CategoryID: any): void {
    if (CategoryID) {
      this.salesService.GetSubCategory(CategoryID).subscribe(
        data => {
          this.SubCategory = data;
          this.SubCategory.unshift({ Name: 'All', Value: "0" });

        },
        (err: any) => {
          console.log(err);
        });
    }
  }

  public GetCurrentStock(CategoryID: any, SubCategoryID?: any): void {

    if (CategoryID) {
      this.reportService.GetCurrentStock(CategoryID, SubCategoryID).subscribe(
        data => {
          this.currentStocks = data;
        },
        (err: any) => {
          console.log(err);
        });
    }
  }


  public rptReportCurrentStockStatus(CategoryID: string, SubcategoryID?: number): void {
    let tr: any;
    if (SubcategoryID == null) {
      SubcategoryID = 0;
    }

    this.reportService.ReportCurrentStockStatus(this.BaseURL + CategoryID + "/" + SubcategoryID).subscribe((res) => {
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


  generatePdf(action = 'open') {
    // const documentDefinition = this.getDocumentDefinition();
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    switch (action) {
      case 'open': this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
      // case 'open': this.pdfService.pdfMake.createPdf(documentDefinition).open({}, window); break;
      case 'print': this.pdfService.pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': this.pdfService.pdfMake.createPdf(documentDefinition).download(); break;
      default: this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  public GetClass(currentStock: any, minStock: any) {
    var classList = '';
    if ((((currentStock - minStock)*100)/minStock) >= 11 && (((currentStock - minStock)*100)/minStock) <= 150) {
      classList = 'background-color: green';
    } else if ((((currentStock - minStock)*100)/minStock) >= 0 && (((currentStock - minStock)*100)/minStock) <= 10) {
      classList = 'background-color: yellow';
    } else if ((((currentStock - minStock)*100)/minStock) < 0) {
      classList = 'background-color: red';
    } else if ((((currentStock - minStock)*100)/minStock) > 150) {
      classList = 'background-color: red';
    }
    return classList;
  }


}

interface stock {
  Category: string;
  SubCategory: string;
  ProductName: string;
  MinStock: string;
  CurrentStock: string;

}