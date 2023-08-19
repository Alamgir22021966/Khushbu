import { SearchComponent } from '@/modals/search/search.component';
import { PurchaseDetails, PurchaseInfo } from '@/Models/purchase.model';
import { SharedService } from '@/Shared/shared.service';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfmakeService } from '@services/PDFMake/pdfmake.service';
import { PurchaseService } from '@services/purchase.service';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  @ViewChild('AutoFocus') myfield: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig>;
  
  PurchaseInfoForm: FormGroup;
  submitted = false;
  VendorName = [];
  public Categories = [];
  public SubCategories = [];
  public items = [];
  // myFormValueChanges;
  public totalSum: number = 0;
  bsModalRef: BsModalRef;
  public purchaseInfo: PurchaseInfo;
  public purchaseDetails: PurchaseDetails[];
  public userinfo: login;
  public caption: string = 'New';

  constructor(
    private fb: FormBuilder,
    private pdfService: PdfmakeService,
    private purchaseService: PurchaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private currencyPipe: CurrencyPipe,
    private bsModalService: BsModalService,
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private elementRef: ElementRef,
    private interactivityChecker: InteractivityChecker,
    // , private jwtHelper: JwtHelperService
    
    ) {
    this.CreatePurchaseInfoForm();

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      todayHighlight: true
    });

  }

  CreatePurchaseInfoForm() {

    let arr = [];
    for (let i = 0; i < 50; i++) {
      arr.push(this.BuildFormDynamic())

    }

    /* Main form group*/

    this.PurchaseInfoForm = this.fb.group({
      PurchaseInfo: this.fb.group({
        PID: [''],
        Purchasedate: ['', Validators.required],
        VID: ['', Validators.required],
        DiscountAmount: [''],
        DiscountPercentage: [''],
        OrderBy: [''],
        InputBy: ['', Validators.required],
        InputDate: ['', Validators.required],
      }),

      PurchaseDetails: this.fb.array(arr) as FormArray,

    });

  }

  /* Subform form group*/

  BuildFormDynamic(): FormGroup {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      PID: [''],
      Slno: [''],
      CategoryID: [''],
      SubCategoryID: [''],
      ItemID: [''],
      Quantity: [''],
      //Quantity: ['',[Validators.required, Validators.pattern(numberPatern)]],
      UnitPrice: [''],
      TotalPrice: [{ value: '', disabled: true }],
    });
  }

  resetForm() {
    this.PurchaseInfoForm.reset();
  }

  get f() { return this.PurchaseInfoForm.controls; }

  get PurchaseInfo() { return this.PurchaseInfoForm.get('PurchaseInfo'); }

  get PurchaseDetails() {
    return this.PurchaseInfoForm.get('PurchaseDetails') as FormArray;
  }

  public ChangeData(): void {
    if (this.caption === 'New') {
      this.NewPurchaseID();
    }
    else if (this.caption === 'Save') {
      this.Save();
    }
  }

  public NewPurchaseID(): void {

    this.PurchaseInfoForm.reset();

    this.purchaseService.GetPID().subscribe(
      data => this.PurchaseInfoForm.controls['PurchaseInfo'].get('PID').setValue(data)

    );
    // (<any>this.PurchaseInfoForm.controls['PurchaseInfo'].get('VID')).nativeElement.focus();

    // this.userinfo = this.jwtHelper.decodeToken(localStorage.getItem('token'))

    this.PurchaseInfoForm.controls['PurchaseInfo'].get('OrderBy').setValue('Mr. Mithu');
    // this.PurchaseInfoForm.controls['PurchaseInfo'].get('InputBy').setValue(this.userinfo.unique_name);
    this.PurchaseInfoForm.controls['PurchaseInfo'].get('InputDate').setValue(new Date());


    this.myfield.nativeElement.focus();
    this.caption = 'Save';
    
  }


  ngOnInit() {

    this.GetVendorName();
    this.GetCategory();

  }

  public onfocus(form: FormGroup) {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        const invalidControl = this.elementRef.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  public Save(): void {
    // this.sharedService.onfocus(this.PurchaseInfoForm, this.elementRef);
    this.onfocus(this.PurchaseInfoForm);
    this.submitted = true;
    if (!this.PurchaseInfoForm.valid) {
      return;
    }

    this.DeletePurchaseDetails(this.PurchaseInfoForm.controls['PurchaseInfo'].get('PID').value);

    this.purchaseService.SavePurchase(this.PurchaseInfoForm.value).subscribe(
      (response: any) => {
        if (response == null) {
          this.resetForm();
          this.toastr.success('New Purchase Created!', 'Purchase Successful.');
          this.submitted = false;
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicatePID':
                this.toastr.error('Purchase is already taken', 'Purchase failed.');
                break;

              default:
                this.toastr.error(element.description, 'Purchase failed.', {
                  timeOut: 2000
                });
                break;
            }

          });
        }
      },
      err => {
        console.log(err);
      },
      () =>{
        this.caption = 'New';
      }
    );

  }

  public Cancel() {
    this.PurchaseInfoForm.reset();
    this.totalSum = 0;
    this.submitted = false;
    if (this.caption === 'Save') {
      this.caption = 'New';
    }
  }

  public GetVendorName(): void {
    this.purchaseService.GetVendorName().subscribe(
      data => this.VendorName = data

    );

  }

  public GetCategory(): void {
    this.purchaseService.GetCategory().subscribe(
      data => this.Categories = data

    );

  }

  public GetSubCategory(index: any): void {
    const control = <FormArray>this.PurchaseInfoForm.controls['PurchaseDetails'];
    for (let i = 0; i < control.length; i++) {
      if (index == i) {

          let params = new HttpParams().appendAll({
            'CategoryID': control.at(+i).get('CategoryID').value
           });

          this.purchaseService.GetSubCategory(params).subscribe(
            data => { this.SubCategories[index] = data; }
          );
        break;
      }
    }
  }

  public GetProductName(index: any): void {
    const control = <FormArray>this.PurchaseInfoForm.controls['PurchaseDetails'];
    for (let i = 0; i < control.length; i++) {
      if (index == i) {

          let params = new HttpParams().appendAll({
            'CategoryID': control.at(+i).get('CategoryID').value,
            'SubCategoryID': control.at(+i).get('SubCategoryID').value
           });

          this.purchaseService.GetProductName(params).subscribe(
            data => { this.items[index] = data; }
          );
        break;
      }
    }
  }

  OpenDeleteModel() {

    const initialState = {
      title: 'Purchase Information',
      label: 'Purchase ID',
      ControlName: 'PID',
      items: 'PurchaseInfo',
      Action: 'Delete',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(SearchComponent, { initialState });
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered', initialState }));
    this.bsModalRef.content.okBtnName = 'Delete';
    this.PurchaseInfoForm.reset();
    this.totalSum = 0;

  }
  OpenSearchModel() {
    this.PurchaseInfoForm.reset();
    const initialState = {
      title: 'Purchase Information',
      label: 'Purchase ID',
      ControlName: 'PID',
      items: 'PurchaseInfo',
      Action: 'Search',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(PurmodalComponent, Object.assign({}, { class: 'modal-md', initialState }));
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered', initialState }));

    this.bsModalRef.content.okBtnName = 'Search';

    this.bsModalRef.content.action.subscribe((data: any) => {
      this.purchaseInfo = data;

      //this.PurchaseInfoForm.controls['PurchaseInfo'].get('PID').setValue(this.purchaseInfo.PID);

      this.SearchPID(this.purchaseInfo.PID);

    });

  }


  // of(this.getOrders()).subscribe(orders => {
  //   this.orders = orders;
  //   this.form.controls.orders.patchValue(this.orders[0].id);
  // });

  public DeleteOneItem(index): void {
    this.PurchaseDetails.removeAt(index);
    this.PurchaseDetails.push(this.BuildFormDynamic());

  }

  public DeletePurchaseDetails(PID: any): void {
    if (PID) {
      this.purchaseService.DeletePurchaseDetails(PID).subscribe(res => {
        if (res == null) {

        }
      });
    }
  }

  public updateTotalPrice(units: any) {

    const control = <FormArray>this.PurchaseInfoForm.controls['PurchaseDetails'];
    this.totalSum = 0;

    for (let i in units) {
      let totalPrice = (units[i].Quantity * units[i].UnitPrice);
      let totalPriceFormatted = this.currencyPipe.transform(totalPrice, 'TK ', 'symbol-narrow', '1.1-2');
      control.at(+i).get('TotalPrice').setValue(totalPriceFormatted, { onlySelf: true, emitEvent: false });
      //control.at(+i).get('TotalPrice').setValue(totalPrice, {onlySelf: true, emitEvent: false});
      this.totalSum += totalPrice;
      //console.log(control.at(+i).get('Category').value);
    }
  }


  public GetTotalPrice(index: any): void {

    const control = <FormArray>this.PurchaseInfoForm.controls['PurchaseDetails'];

    for (let i = 0; i < control.length; i++) {
      if (index == 0) {
        this.totalSum = 0;
      }
      if (index == i) {
        let totalPrice = control.at(+i).get('Quantity').value * control.at(+i).get('UnitPrice').value;
        let totalPriceFormatted = this.currencyPipe.transform(totalPrice, 'TK ', 'symbol-narrow', '1.1-2');
        control.at(+i).get('TotalPrice').setValue(totalPriceFormatted, { onlySelf: true, emitEvent: false });
        this.totalSum += totalPrice;
        break;
      }
    }

  }


  public SearchPID(PID: any) {
    this.totalSum = 0;
    const control = this.PurchaseInfoForm.controls['PurchaseInfo'];

    this.purchaseService.GetPurchaseInfo(PID).subscribe(
      data => {
        this.purchaseInfo = data;
        control.get('PID').setValue(this.purchaseInfo.PID);
        control.get('Purchasedate').setValue(this.datePipe.transform(this.purchaseInfo.Purchasedate, 'dd-MM-yyyy'));
        control.get('VID').setValue(this.purchaseInfo.VID);
        control.get('DiscountAmount').setValue(this.purchaseInfo.DiscountAmount);
        control.get('DiscountPercentage').setValue(this.purchaseInfo.DiscountPercentage);
        control.get('OrderBy').setValue(this.purchaseInfo.OrderBy);
        control.get('InputBy').setValue(this.purchaseInfo.InputBy);
        control.get('InputDate').setValue(this.datePipe.transform(this.purchaseInfo.InputDate, 'dd-MM-yyyy'));
      });


    const controls = <FormArray>this.PurchaseInfoForm.controls['PurchaseDetails'];
    this.purchaseService.GetPurchaseDetails(PID).subscribe(
      res => {
        this.purchaseDetails = res;
        if (this.purchaseDetails.length > 0) {
          for (let i = 0; i < this.purchaseDetails.length; i++) {

            controls.at(+i).get('CategoryID').setValue(this.purchaseDetails[i].CategoryID);
            this.GetSubCategory(i);
            // this.GetSubCategory(i, this.purchaseDetails[i].CategoryID);
            controls.at(+i).get('SubCategoryID').setValue(this.purchaseDetails[i].SubCategoryID);
            this.GetProductName(i)
            // this.GetProductName(i, this.purchaseDetails[i].CategoryID, this.purchaseDetails[i].SubCategoryID)
            controls.at(+i).get('ItemID').setValue(this.purchaseDetails[i].ItemID);
            controls.at(+i).get('Quantity').setValue(this.purchaseDetails[i].Quantity);
            // controls.at(+i).get('UnitPrice').setValue(this.currencyPipe.transform(this.purchaseDetails[i].UnitPrice, 'TK ', 'symbol-narrow', '1.1-2'));
            controls.at(+i).get('UnitPrice').setValue(this.purchaseDetails[i].UnitPrice);
            controls.at(+i).get('TotalPrice').setValue(this.currencyPipe.transform(this.purchaseDetails[i].TotalPrice, 'TK ', 'symbol-narrow', '1.1-2'));
            this.totalSum = this.totalSum + this.purchaseDetails[i].TotalPrice;
          }
        }
      }
    );
  }

  get Quantity(): number {
    return +this.PurchaseInfoForm.get('Quantity').value;
  }

  get UnitPrice(): number {
    return +this.PurchaseInfoForm.get('UnitPrice').value;
  }

  get TotalPrice(): number {
    return (this.Quantity * this.UnitPrice);
  }


  public isNotValid(value: any): boolean {
    if (isNaN(value) || value == undefined || value == null || value == "") {
      return true;
    }
    return false;
  }

  generatePdf(action = 'open') {
    //const documentDefinition = this.getDocumentDefinition();
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    switch (action) {
      case 'open': this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': this.pdfService.pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': this.pdfService.pdfMake.createPdf(documentDefinition).download(); break;
      default: this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  getDocumentDefinition(){
    
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    this.pdfService.pdfMake.createPdf(documentDefinition).open();
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

}

interface login {
  primarysid: string,
  unique_name: string,
  role: string
}