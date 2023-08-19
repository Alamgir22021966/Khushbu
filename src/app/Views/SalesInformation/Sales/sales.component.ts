import { SearchComponent } from '@/modals/search/search.component';
import { SalesDetail, SalesInfo } from '@/Models/sales.model';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '@services/sales.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  @ViewChild('AutoFocus') myfield: ElementRef;

  SalesInfoForm: FormGroup;
  submitted = false;
  public Category = [];
  public SubCategory = [];
  public items = [];
  public OutletID = [];
  public EmpID = [];
  public retailPrice: number = 0;
  public totalSum: number = 0;
  public PurchasePrice = 0;
  public uinfo: login;
  // myFormValueChanges;
  // today: Date = new Date();
  // jstoday = '';
  currentDate: any = new Date();
  bsModalRef: BsModalRef;
  BaseURL: string = "";
  public caption: string = 'New';

  public salesInfo: SalesInfo;
  public salesDetail: SalesDetail[];

  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private bsModalService: BsModalService,
    private interactivityChecker: InteractivityChecker,
    //private jwtHelper: JwtHelperService,
    @Inject('BASE_URL') baseUrl: string,

  ) {

    this.CreateSalesInfoForm();

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY'

    });

    if (baseUrl == 'http://localhost:4200/') {
      this.BaseURL = 'https://localhost:44320/api/Report/ReportSalesInfo/';
      //console.log(baseUrl);
    }
    else {
      this.BaseURL = baseUrl + 'api/Report/ReportSalesInfo/';
      //console.log(baseUrl);
      //console.log(this.BaseURL);
    }

  }

  CreateSalesInfoForm() {

    let arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push(this.BuildFormDynamic())

    }

    this.SalesInfoForm = this.fb.group({
      SalesInfo: this.fb.group({
        InvoiceNumber: [''],
        CustomerID: [''],
        SalesDate: ['', Validators.required],
        SalesBy: ['', Validators.required],
        DiscountAmount: [''],
        DiscountPercentage: [''],
        Outlet: ['', Validators.required],
        ModeofPayment: [''],
      }),

      SalesDetails: this.fb.array(arr) as FormArray,

    });

  }

  BuildFormDynamic(): FormGroup {
    return this.fb.group({
      CategoryID: [''],
      SubCategoryID: [''],
      ItemID: [''],
      Quantity: [''],
      //UnitPrice: [{ value: '', disabled: true }],
      UnitPrice: [''],
      TotalPrice: [{ value: '', disabled: true }],
      //TotalPrice:[''],
    });
  }

  ngOnInit() {
    this.GetCategory();

    // this.SalesInfoForm.controls['SalesDetails'].get('UnitPrice').valueChanges.subscribe(
    //   () => {
    //     this.SalesInfoForm.controls['SalesDetails'].get('TotalPrice').setValue(this.SalesInfoForm.controls['SalesDetails'].get('Quantity').value*this.SalesInfoForm.controls['SalesDetails'].get('UnitPrice').value);

    //   });

  }

  get f() { return this.SalesInfoForm.controls; }

  get SalesInfo() { return this.SalesInfoForm.get('SalesInfo'); }

  get SalesDetails() {
    return this.SalesInfoForm.get('SalesDetails') as FormArray;
  }

  public ChangeData(): void {
    if (this.caption === 'New') {
      this.NewInvoiceNumber();
    }
    else if (this.caption === 'Save') {
      this.Save();
    }
  }


  OpenSearchModel() {

    const initialState = {
      title: 'Sales Information',
      label: 'Invoice Number',
      ControlName: 'InvoiceNumber',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-md', initialState }));
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, {
      class: 'modal-dialog modal-dialog-centered', initialState
    }));

    this.bsModalRef.content.okBtnName = 'Search';

    this.bsModalRef.content.action.subscribe((data: any) => {
      this.salesInfo = data;
      //this.SalesInfoForm.controls['SalesInfo'].get('InvoiceNumber').setValue(this.salesInfo.InvoiceNumber);
      this.SearchInvoiceNumber(this.salesInfo.InvoiceNumber);
    });

  }

  OpenDeleteModel() {

    const initialState = {
      title: 'Sales Information',
      label: 'Invoice Number',
      ControlName: 'InvoiceNumber',
      items: 'SalesInfo',
      Action: 'Delete',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(SearchComponent, { initialState });
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered', initialState }));
    this.bsModalRef.content.okBtnName = 'Delete';

  }

  public updateTotalPrice(units: any) {

    const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    this.totalSum = 0;

    for (let i in units) {

      let totalPrice = (units[i].Quantity * units[i].UnitPrice);

      let totalPriceFormatted = this.currencyPipe.transform(totalPrice, 'TK ', 'symbol-narrow', '1.1-2');

      control.at(+i).get('TotalPrice').setValue(totalPriceFormatted, { onlySelf: true, emitEvent: false });

      this.totalSum += totalPrice;

    }

  }

  public ChangeTotalPrice(index: any): void {
    const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    this.totalSum = 0;
    for (let i = 0; i < control.length; i++) {
      if (index == i) {
        let totalPrice = control.at(+i).get('Quantity').value * control.at(+i).get('UnitPrice').value;
        control.at(+i).get('TotalPrice').setValue(totalPrice);
        break;
      }
    }

    for (let i = 0; i < control.length; i++) {
      //let totalPrice = control.at(+i).get('Quantity').value * control.at(+i).get('UnitPrice').value;
      this.totalSum += control.at(+i).get('TotalPrice').value;
    }

  }


  public GetRetailPrice(index: any, CID: any, SUBID: any, IID: any): void {
    const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    for (let i = 0; i < control.length; i++) {
      if (index == 0) {
        this.totalSum = 0;
      }
      if (index == i) {
        this.salesService.GetRetailPrice(CID, SUBID, IID).subscribe(
          data => {
            //let unitPriceFormatted = this.currencyPipe.transform(data, 'TK ', 'symbol-narrow', '1.1-2');;
            //control.at(+i).get('UnitPrice').setValue(unitPriceFormatted, { onlySelf: true, emitEvent: false });
            control.at(+i).get('UnitPrice').setValue(data);
            let totalPrice = control.at(+i).get('Quantity').value * data;
            // let totalPriceFormatted = this.currencyPipe.transform(totalPrice, 'TK ', 'symbol-narrow', '1.1-2');
            //control.at(+i).get('TotalPrice').setValue(totalPriceFormatted, { onlySelf: true, emitEvent: false });
            control.at(+i).get('TotalPrice').setValue(totalPrice);
            this.totalSum += totalPrice;

          })
        break;
      }
    }
  }


  public GetPurchasePrice(index: any, CID: any, SUBID: any, IID: any): void {
    const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    for (let i = 0; i < control.length; i++) {
      if (index == 0) {
        this.totalSum = 0;
      }
      if (index == i) {
        this.salesService.GetPurchasePrice(CID, SUBID, IID).subscribe(
          data => {
            // let unitPriceFormatted = this.currencyPipe.transform(data, 'TK ', 'symbol-narrow', '1.1-2');;
            //control.at(+i).get('UnitPrice').setValue(unitPriceFormatted, { onlySelf: true, emitEvent: false });
            //control.at(+i).get('UnitPrice').setValue(data);
            this.PurchasePrice = data;


          })
        break;
      }
    }
  }


  public NewInvoiceNumber(): void {

    this.SalesInfoForm.reset();
    this.salesService.GetInvoiceNumber().subscribe(
      data => this.SalesInfoForm.controls['SalesInfo'].get('InvoiceNumber').patchValue(data)

    );

    // this.uinfo = this.jwtHelper.decodeToken(localStorage.getItem('token'))
    // this.SalesInfoForm.controls['SalesInfo'].get('SalesBy').patchValue('Alamgir')
    // this.SalesInfoForm.controls['SalesInfo'].get('SalesBy').patchValue(this.uinfo.unique_name);
    this.SalesInfoForm.controls['SalesInfo'].get('SalesDate').patchValue(new Date);
    this.SalesInfoForm.controls['SalesInfo'].get('Outlet').patchValue('Baitulmukarram');

    this.myfield.nativeElement.focus();
    this.caption = 'Save';
  }


  get CategoryID() {
    return this.SalesInfoForm.controls['SalesDetails'].get('CategoryID') as FormArray;

  }

  get SubCategoryID() {
    return this.SalesInfoForm.controls['SalesDetails'].get('SubCategoryID') as FormArray;
  }

  public Save(): void {
    this.submitted = true;
    if (!this.SalesInfoForm.valid) {
      return;
    }
    this.salesService.SaveSales(this.SalesInfoForm.value).subscribe({
      next: (response: any) => {
        if (response == null) {
          //this.SalesInfoForm.reset(); 
          this.toastr.success('New Sales Created!', 'Sales Successful.');
          this.submitted = false;
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateCustomerID':
                this.toastr.error('Sales is already taken', 'Sales failed.');
                break;

              default:
                this.toastr.error(element.description, 'Sales failed.', {
                  timeOut: 2000
                });
                break;
            }

          });
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.caption = 'New';
      }
    });

  }

  public Cancel() {
    this.SalesInfoForm.reset();
    this.totalSum = 0;
    this.submitted = false;
    if (this.caption === 'Save') {
      this.caption = 'New';
    }
  }

  public DeleteOneItem1(index: any): void {
    this.SalesDetails.removeAt(index);
    this.SalesDetails.push(this.BuildFormDynamic());

    // const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    // this.totalSum = 0;
    // for (let i = 0; i < control.length; i++) {
    //     let totalPrice = control.at(+i).get('Quantity').value*control.at(+i).get('UnitPrice').value;
    //     this.totalSum += control.at(+i).get('TotalPrice').value;
    // }

  }

  public DeleteOneItem(InvoiceNumber: any, index: any): void {
    this.SalesDetails.removeAt(index);
    this.SalesDetails.push(this.BuildFormDynamic());
    this.DeleteSalesDetails(InvoiceNumber);

  }

  public DeleteInvoiceNumber(InvoiceNumber: any): void {
    if (InvoiceNumber) {
      if (confirm('Are you sure to delete this record')) {
        this.salesService.DeleteInvoiceNumber(InvoiceNumber).subscribe(res => {
          if (res == null) {
            this.toastr.warning("Deleted Successfully", "Sales Information");
            this.SalesInfoForm.reset();
            this.totalSum = 0;

          }
        });
      }
    }

  }

  public DeleteSalesDetails(InvoiceNumber: any): void {
    if (InvoiceNumber) {
      this.salesService.DeleteSalesDetails(InvoiceNumber).subscribe(res => {
        if (res == null) {
          const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
          this.totalSum = 0;
          for (let i = 0; i < control.length; i++) {
            this.totalSum += control.at(+i).get('TotalPrice').value;
          }
        }
      });
    }
  }

  public GetCategory(): void {

    this.salesService.GetCategory().subscribe(
      data => this.Category = data

    );

  }

  public GetSubCategory(index: any, CategoryID: any): void {
    const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    for (let i = 0; i < control.length; i++) {
      if (index == i) {
        if (CategoryID) {
          this.salesService.GetSubCategory(CategoryID).subscribe(
            data => { this.SubCategory[index] = data; }
          );
        }
        else {
          this.SubCategory[index] = null;
        }
        break;
      }
    }
  }

  public GetProductName(index: any, CategoryID: any, SubCategoryID: any): void {
    const control = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    for (let i = 0; i < control.length; i++) {
      if (index == i) {
        if (CategoryID && SubCategoryID) {
          this.salesService.GetProductName(CategoryID, SubCategoryID).subscribe(
            data => { this.items[index] = data; }
          );
        }
        else {
          this.items[index] = null;
        }
        break;
      }
    }
  }

  @HostListener('window:keyup', ['$event']) keyevent(event: any) {
    event.preventDefault();
    // const inputs = Array.prototype.slice.call(document.querySelectorAll('input, button'));
    const inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
    const controls = [];
    if (Array.isArray(controls) && !controls.length) {
      for (let i = 0; i < inputs.length; i++) {
        if (this.interactivityChecker.isFocusable(inputs[i])) {
          if (inputs[i].id !== 'New') {
            controls.push(inputs[i]);
          }
        }
      }
    }

    if (event.keyCode === 13 || event.keyCode === 40) {
      const control = controls[controls.indexOf(document.activeElement) + 1];
      if (control) {
        control.focus();
        control.select();
      }
    } else if (event.keyCode === 38) {
      const control = controls[controls.indexOf(document.activeElement) - 1];
      if (control) {
        control.focus();
        control.select();
      }
    }

  }

  public getClass() {
    var classList = '';
    if (this.caption === 'New') {
      classList = 'fa fa-plus';
    } else if (this.caption === 'Save') {
      classList = 'fa fa-save';
    }
    return classList;
  }

  public GetClass(caption: any) {
    var classList = '';
    if (caption === 'Search') {
      classList = 'fa fa-search';
    } else if (caption === 'Delete') {
      classList = 'fa fa-trash';
    }
    return classList;
  }




  public Print(InvoiceNumber: number): void {
    let tr: any;
    //  this.salesService.downloadPDF('http://localhost:53885/api/Report/ReportSalesInfo/' + InvoiceNumber).subscribe((res) => {
    this.salesService.downloadPDF(this.BaseURL + InvoiceNumber).subscribe((res) => {
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


  public Print1(InvoiceNumber: number): void {
    let tr: any;
    //  this.salesService.downloadPDF('http://localhost:53885/api/Report/ReportSalesInfo/' + InvoiceNumber).subscribe((res) => {
    this.salesService.downloadPDF(InvoiceNumber).subscribe((res) => {
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




  public ModeofPayments = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'VISA Card' },
    { id: 3, name: 'Master Card' }
  ];


  public SearchInvoiceNumber(invoiceNumber: any) {
    //this.SalesInfoForm.reset();
    this.totalSum = 0;
    const control = this.SalesInfoForm.controls['SalesInfo'];

    this.salesService.GetSalesInfo(invoiceNumber).subscribe(
      data => {
        this.salesInfo = data;
        control.get('InvoiceNumber').setValue(this.salesInfo.InvoiceNumber);
        control.get('CustomerID').setValue(this.salesInfo.CustomerID);
        // control.get('SalesDate').setValue(formatDate1(this.salesInfo.SalesDate));
        control.get('SalesDate').setValue(this.datePipe.transform(this.salesInfo.SalesDate, 'dd-MM-yyyy'));
        control.get('SalesBy').setValue(this.salesInfo.SalesBy);
        control.get('DiscountAmount').setValue(this.salesInfo.DiscountAmount);
        control.get('DiscountPercentage').setValue(this.salesInfo.DiscountPercentage);
        control.get('Outlet').setValue(this.salesInfo.Outlet);
        control.get('ModeofPayment').setValue(this.salesInfo.ModeofPayment);
      });


    const controls = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    this.salesService.GetSalesDetails(invoiceNumber).subscribe(
      res => {
        this.salesDetail = res;
        if (this.salesDetail.length > 0) {
          for (let i = 0; i < this.salesDetail.length; i++) {

            controls.at(+i).get('CategoryID').setValue(this.salesDetail[i].CategoryID);
            this.GetSubCategory(i, this.salesDetail[i].CategoryID);
            controls.at(+i).get('SubCategoryID').setValue(this.salesDetail[i].SubCategoryID);
            this.GetProductName(i, this.salesDetail[i].CategoryID, this.salesDetail[i].SubCategoryID)
            controls.at(+i).get('ItemID').setValue(this.salesDetail[i].ItemID);
            controls.at(+i).get('Quantity').setValue(this.salesDetail[i].Quantity);
            controls.at(+i).get('UnitPrice').setValue(this.salesDetail[i].UnitPrice);
            controls.at(+i).get('TotalPrice').setValue(this.salesDetail[i].TotalPrice);
            this.totalSum = this.totalSum + this.salesDetail[i].TotalPrice;
          }
        }
      });
  }



  public SearchInvoiceNumber_OLD(invoiceNumber: any) {
    //this.SalesInfoForm.reset();
    this.totalSum = 0;
    const control = this.SalesInfoForm.controls['SalesInfo'];

    this.salesService.GetSalesInfo(invoiceNumber).subscribe(
      data => {
        this.salesInfo = data;
        control.get('InvoiceNumber').setValue(this.salesInfo.InvoiceNumber);
        control.get('CustomerID').setValue(this.salesInfo.CustomerID);
        // control.get('SalesDate').setValue(formatDate1(this.salesInfo.SalesDate));

        //control.get('SalesDate').setValue(formatDate(this.salesInfo.SalesDate,'dd/MM/yyyy', 'en-UK'));
        control.get('SalesDate').setValue(this.datePipe.transform(this.salesInfo.SalesDate, 'dd/MM/yyyy'));
        control.get('SalesBy').setValue(this.salesInfo.SalesBy);
        control.get('DiscountAmount').setValue(this.salesInfo.DiscountAmount);
        control.get('DiscountPercentage').setValue(this.salesInfo.DiscountPercentage);
        control.get('Outlet').setValue(this.salesInfo.Outlet);
        control.get('ModeofPayment').setValue(this.salesInfo.ModeofPayment);
      });


    const controls = <FormArray>this.SalesInfoForm.controls['SalesDetails'];
    this.salesService.GetSalesDetails(invoiceNumber).subscribe(
      res => {
        this.salesDetail = res;
        if (this.salesDetail.length > 0) {
          for (let i = 0; i < this.salesDetail.length; i++) {

            controls.at(+i).get('CategoryID').setValue(this.salesDetail[i].CategoryID);
            this.GetSubCategory(i, this.salesDetail[i].CategoryID);
            controls.at(+i).get('SubCategoryID').setValue(this.salesDetail[i].SubCategoryID);
            this.GetProductName(i, this.salesDetail[i].CategoryID, this.salesDetail[i].SubCategoryID)
            controls.at(+i).get('ItemID').setValue(this.salesDetail[i].ItemID);
            controls.at(+i).get('Quantity').setValue(this.salesDetail[i].Quantity);
            controls.at(+i).get('UnitPrice').setValue(this.currencyPipe.transform(this.salesDetail[i].UnitPrice, 'TK ', 'symbol-narrow', '1.1-2'));
            controls.at(+i).get('TotalPrice').setValue(this.currencyPipe.transform(this.salesDetail[i].TotalPrice, 'TK ', 'symbol-narrow', '1.1-2'));
            this.totalSum = this.totalSum + this.salesDetail[i].TotalPrice;
          }
        }
      });
  }




}

interface login {
  primarysid: string,
  unique_name: string,
  role: string
}

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

function formatDate1(date: Date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + (d.getDate() + 1),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}