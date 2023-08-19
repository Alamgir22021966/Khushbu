import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '@services/vendor.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modalsupplier',
  templateUrl: './modal-supplier.component.html',
  styleUrls: ['./modal-supplier.component.scss']
})
export class ModalSupplierComponent implements OnInit {

  supplierForm: FormGroup;
  submitted = false;

  @Input() public title: string;
  @Input() data: any[] = [];
  @Output() action = new EventEmitter();
  
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private vendorService: VendorService
  ) { 
    this.EditSupplierForm();
  }

  EditSupplierForm() {
    this.supplierForm = this.fb.group({
      VID: ['', Validators.required],
      VendorName: [''],
      Address: [''],
      ContactPerson: [''],
      LandPhone: [''],
      MobilePhone1: [''],
      MobilePhone2: [''],
      Email: [''],

    });
  }

  get f() { return this.supplierForm.controls; }

  ngOnInit(): void {
    this.supplierForm.setValue(this.data);
  }

  public Save(): void {
    this.submitted = true;
    if (!this.supplierForm.valid) {
      return;
    }
    this.vendorService.SaveVendor(this.supplierForm.value).subscribe(
      (response: any) => {
        if (response == null) {
          this.submitted = false;
          this.bsModalRef.hide();
          this.toastr.success('Edit Supplier!', 'Update Supplier Successfully.');
          this.action.emit(this.supplierForm.value);
        }
      },
      (err: any) => {
        console.log(err);
      });
  }

  public ClickOk(): void {
    this.bsModalRef.hide();
  }

}
