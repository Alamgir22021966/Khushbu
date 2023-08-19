import { VendorModel } from '@/Models/vendor.model';
import { ModalSupplierComponent } from '@/Views/adminpanel/SupplierList/modal-supplier.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '@services/vendor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {

  @ViewChild('AutoFocus') myfield: ElementRef<any>;

  SaleslistForm: FormGroup;
  public saleslist: Sales[] = [];
  public bsModalRef: BsModalRef;
  public suppplier: VendorModel;
  public Suppliers: Observable<Array<any>>;

  public placeholder: string = 'Enter Search String';
  public keyword = 'Name';
  public historyHeading: string = 'Recently selected';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorService: VendorService,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
  ) {
    this.CreateSalesListForm();
  }


  CreateSalesListForm(): void {

    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(this.ListForm());

    }
    this.SaleslistForm = this.fb.group({
      Sales: this.fb.group({
        InvoiceNumber: ['']
      }),

      SalesList: this.fb.array(arr) as FormArray,

    });

  }

  ListForm(): FormGroup {
    return this.fb.group({
      InvoiceNumber: [''],
      Slno: [''],
      CategoryID: [''],
      SubCategoryID: [''],
      ItemID: [''],
      Quantity: ['',],
      UnitPrice: [''],
      TotalPrice: [''],
    });
  }

  get Sales(): any { return this.SaleslistForm.get('Sales'); }

  get SalesList(): any {
    return this.SaleslistForm.get('SalesList') as FormArray;
  }


  ngOnInit(): void {
    this.Suppliers = this.vendorService.GetSupplierAutoCompleteData();
    // this.GetVendorList();

    this.SaleslistForm.valueChanges.subscribe(
      () => {
        this.GetVendorList();
      });
  }

  public GetVendorList(): void {
    this.vendorService.GetVendorList().subscribe(
      data => {
        this.saleslist = data;
      },
      (err: any) => {
        console.log(err);
      });
  }


  selectEvent(item: any) {
    this.SalesList.reset();
    for (let j = this.SalesList.length; j >= 15; j--) {
      this.SalesList.removeAt(j);
    }
    this.vendorService.GetVendor(item.VID).subscribe(
      data => {
        console.log();
        if (data.length > 0) {
          const controls = <FormArray>this.SaleslistForm.controls['SalesList'];
          for (let i = 0; i < data.length; i++) {
            controls.at(+i).get('VID').setValue(data[i].VID);
            controls.at(+i).get('VendorName').setValue(data[i].VendorName);
            controls.at(+i).get('Address').setValue(data[i].Address);
            controls.at(+i).get('ContactPerson').setValue(data[i].ContactPerson);
            controls.at(+i).get('LandPhone').setValue(data[i].LandPhone);
            controls.at(+i).get('MobilePhone1').setValue(data[i].MobilePhone1);
            controls.at(+i).get('MobilePhone2').setValue(data[i].MobilePhone2);
            controls.at(+i).get('Email').setValue(data[i].Email);

            if (i >= 14 && i < this.SalesList.length - 1) {
              this.SalesList.push(this.ListForm());
            }
          }
        }

      }
    );

  }

  public Delete(index: any, VID: any): void {
    if (VID) {
      if (confirm('Are you sure to delete this record')) {
        this.vendorService.Delete(VID).subscribe(res => {
          if (res == null) {
            this.toastr.warning("Deleted Successfully", "Vendor Information");
          }
        },
          (err: any) => {
            console.log(err);
          });
      }
    }
    this.GetVendorList();
  }


  openModal(index: any, VID: any) {
    this.vendorService.GetVendor(VID).subscribe((data: any[]) => {
      const initialState = {
        title: 'Vendor Information',
        data: data,
        ignoreBackdropClick: true,
        animated: true,
        keyboard: true,
      };

      this.bsModalRef = this.bsModalService.show(ModalSupplierComponent, Object.assign({}, { class: 'modal-md', initialState }));

      this.bsModalRef.content.action.subscribe((data: any) => {
        this.suppplier = data;
        this.SaleslistForm.get('VID').setValue(this.suppplier.VID);
      });
    });
  }



  searchCleared() {
    // this.OccupancyOverViewForm.reset();
    // this.setFocus('myInput');
    // this.myInput.nativeElement.onFocused
  }

  public Open(): void {

    this.router.navigateByUrl('/home/adminpanel/Newsupplier');
  }

}

interface Sales {
  InvoiceNumber: string;
  Slno: number;
  CategoryID: string;
  SubCategoryID: string;
  ItemID: string;
  Quantity: string;
  UnitPrice: string;
  TotalPrice: string;
}