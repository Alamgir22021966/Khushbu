import { VendorModel } from '@/Models/vendor.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '@services/vendor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ModalSupplierComponent } from './modal-supplier.component';

@Component({
  selector: 'app-supplierlist',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {

  @ViewChild('AutoFocus') myfield: ElementRef<any>;
  
  SupplierlistForm: FormGroup;
  public vendorList: Supplier[] = [];
  public bsModalRef: BsModalRef;
  public suppplier: VendorModel;
  public AllSupplier: Observable<Array<any>>;

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
    this.CreateSupplierListForm();
  }

  CreateSupplierListForm(): void {

    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(this.ListForm());

    }
    this.SupplierlistForm = this.fb.group({
      Supplier: this.fb.group({
        VID: ['']
      }),

      SupplierList: this.fb.array(arr) as FormArray,

    });

  }

  ListForm(): FormGroup {
    return this.fb.group({
      VID: [''],
      VendorName: [''],
      Address: [''],
      ContactPerson: [''],
      LandPhone: [''],
      MobilePhone1: ['',],
      MobilePhone2: [''],
      Email: [''],
    });
  }

  get Supplier(): any { return this.SupplierlistForm.get('Supplier'); }

  get SupplierList(): any {
    return this.SupplierlistForm.get('SupplierList') as FormArray;
  }

  ngOnInit(): void {
    // this.Suppliers = this.vendorService.GetSupplierAutoCompleteData();
    this.AllSupplier = this.vendorService.GetAllSupplier();
    this.GetVendorList();

    this.SupplierlistForm.valueChanges.subscribe(
      () => {
        this.GetVendorList();
      });

  }

  public GetVendorList(): void {
    this.vendorService.GetVendorList().subscribe(
      data => {
        this.vendorList = data;
      },
      (err: any) => {
        console.log(err);
      });
  }


  selectEvent(item: any) {
    this.SupplierList.reset();
    for (let j = this.SupplierList.length; j >= 15; j--) {
      this.SupplierList.removeAt(j);
    }
    this.vendorService.GetVendor(item.VID).subscribe(
      data => {
        console.log();
        if (data.length > 0) {
          const controls = <FormArray>this.SupplierlistForm.controls['SupplierList'];
          for (let i = 0; i < data.length; i++) {
            controls.at(+i).get('VID').setValue(data[i].VID);
            controls.at(+i).get('VendorName').setValue(data[i].VendorName);
            controls.at(+i).get('Address').setValue(data[i].Address);
            controls.at(+i).get('ContactPerson').setValue(data[i].ContactPerson);
            controls.at(+i).get('LandPhone').setValue(data[i].LandPhone);
            controls.at(+i).get('MobilePhone1').setValue(data[i].MobilePhone1);
            controls.at(+i).get('MobilePhone2').setValue(data[i].MobilePhone2);
            controls.at(+i).get('Email').setValue(data[i].Email);

            if (i >= 14 && i < this.SupplierList.length - 1) {
              this.SupplierList.push(this.ListForm());
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

      // this.bsModalRef.content.action.subscribe((data: any) => {
      //   this.suppplier = data;
      //   this.SupplierList.get('VID').setValue(this.suppplier.VID);
      // });



      this.bsModalRef.content.action.subscribe((data: any) => {
 
        const controls = <FormArray>this.SupplierlistForm.controls['SupplierList'];
        for (let i = 0; i < controls.length; i++) {
          if (index === i) {
            controls.at(+i).get('VID').setValue(data.VID);
            controls.at(+i).get('VendorName').setValue(data.VendorName);
            controls.at(+i).get('ContactPerson').setValue(data.ContactPerson);
            controls.at(+i).get('MobilePhone1').setValue(data.MobilePhone1);
            controls.at(+i).get('Email').setValue(data.Email);
            
            break;
          }
        }
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

  onChangeSearch(val: string) {

  }


}

interface Supplier {

  VID: string;
  VendorName: string;
  Address: string;
  ContactPerson: string;
  LandPhone: string;
  MobilePhone1: string;
  MobilePhone2: string;
  Email: string;
}