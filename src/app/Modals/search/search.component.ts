import { CategoryModel } from '@/Models/category.model';
import { SharedService } from '@/Shared/shared.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '@services/category.service';
import { PurchaseService } from '@services/purchase.service';
import { SalesService } from '@services/sales.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // interpolation: ["((","))"]
})
export class SearchComponent implements OnInit {

  @Input() public title: string;
  @Input() public label: string;
  @Input() public ControlName: string;
  @Input() public items: string;
  @Input() public Action: string;
  @Input() public okBtnName: string;
  @Input() public salseinfo: any = [];
  public CategoryList: CategoryModel;
  @Output() OutputID = new EventEmitter<string>();
  @Output() action = new EventEmitter();
  public selectlist = [];
  public VendorName = [];
  
  public Suppliers: Observable<Array<any>>;
  
  public placeholder: string = 'Enter Search String' ;
  public keyword = 'Name';

  Submitted: boolean = false;
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private salesService: SalesService,
    private categoryService: CategoryService,
    private sharedService: SharedService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.GetSelectedList();
    this.Suppliers = this.sharedService.GetAutoCompleteData();
  }

   modalForm = this.fb.group({
    SID : ['', [Validators.required]],
  });

  get f() { return this.modalForm.controls; }

  public ClickOk(SID: string): void {
    this.Submitted = true;

    if(this.modalForm.invalid){
      return;
    }

    this.bsModalRef.hide();

    if(SID){
      if(this.ControlName == 'PID' && this.Action == 'Delete'){
        this.purchaseService.Delete(SID).subscribe(res =>{
          if(res == null){
            this.toastr.warning("Deleted Successfully", "Purchase Information");
            
          }
        });
      }
      else if(this.ControlName == 'PID' && this.Action == 'Search'){
        //this.action.emit(this.modalForm.value);

      }

      else if(this.ControlName == 'InvoiceNumber' && this.Action == 'Delete'){
        this.salesService.DeleteInvoiceNumber(SID).subscribe(res =>{
          if(res == null){
            this.toastr.warning("Deleted Successfully", "Sales Information");
            // this.SalesInfoForm.reset();
            // this.totalSum = 0;
    
          }
        });
      }

      else if(this.ControlName == 'InvoiceNumber' && this.Action == 'Search'){
        this.salesService.GetSalesInfo(SID).subscribe(data => 
          {this.salseinfo = data
            console.log(this.salseinfo);

            //SalesInfoForm.controls['SalesInfo'].get('InvoiceNumber').patchValue('this.salseinfo.InvoiceNumber')
          },
          );

      }
      //Category
      else if(this.ControlName == 'CategoryID' && this.Action == 'Delete'){
        this.categoryService.Delete(SID).subscribe(res =>{
          if(res == null){
            this.toastr.warning("Deleted Successfully", "Category Information");
          }
        });
      }

      else if(this.ControlName == 'CategoryID' && this.Action == 'Search'){

        this.OutputID.next(this.f.SID.value);
         //console.log(this.f.ID.value);
        
        // this.categoryService.GetCategory(ID).subscribe(data => 
        //   {this.CategoryList = data
        //     console.log(this.CategoryList);
        //     const control = this.form.controls['CategoryModel'];

        //     control.get('CategoryID').setValue(this.CategoryList.CategoryID);
        //     control.get('Category').setValue(this.CategoryList.Category);

        //   });

      }
    }
  }

  SendID(){
    this.bsModalRef.hide();
    this.OutputID.next(this.f.SID.value);
  }

  callParent() {
   // this.someEvent.next('somePhone');
  }

  public GetSelectedList(): void {
    
    if(this.items === "Category"){
      this.salesService.GetCategory().subscribe(
        data => this.selectlist = data
      );
    }
    else if(this.items === "SalesInfo"){
      this.salesService.GetlkInvoiceNumber().subscribe(
        data => this.selectlist = data
      );
    }
    else if(this.items === "Vendor"){
      this.purchaseService.GetVendorName().subscribe(
        data => this.selectlist = data
      );
    }

    else if(this.items === "PurchaseInfo"){
      this.purchaseService.GetlkPID().subscribe(
        data => this.selectlist = data
      );
    }
  }

  public GetClass(caption: any){
    var classList='';
    if(caption === 'Search'){
       classList = 'fa fa-search'; 
    }else if (caption === 'Delete'){
        classList = 'fa fa-trash';
    }
    return classList;
  }



}
