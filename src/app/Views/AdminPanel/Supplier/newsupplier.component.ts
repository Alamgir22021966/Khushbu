import { SearchComponent } from '@/modals/search/search.component';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { VendorService } from '@services/vendor.service';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newsupplier',
  templateUrl: './newsupplier.component.html',
  styleUrls: ['./newsupplier.component.scss']
})
export class NewsupplierComponent implements OnInit {
  @ViewChild('AutoFocus') myfield: ElementRef;
  VendorForm: FormGroup;
  submitted = false;
  bsModalRef: BsModalRef;
  public caption: string = 'New';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private interactivityChecker: InteractivityChecker,
    private vendorService: VendorService,
    private appService: AppService,
    private el: ElementRef,
  ) {
    this.CreateVendorForm();
  }

  CreateVendorForm() {
    this.VendorForm = this.fb.group({
      VID: [''],
      VendorName: ['', Validators.required],
      Address: [''],
      ContactPerson: ['', Validators.required],
      LandPhone: [''],
      MobilePhone1: ['', Validators.required],
      MobilePhone2: [''],
      Email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  resetForm() {
    this.VendorForm.reset();
  }

  get f() { return this.VendorForm.controls; }

  public ChangeData(): void {
    if (this.caption === 'New') {
      this.NewVendorID();
    }
    else if (this.caption === 'Save') {
      this.Save();
    }
  }

  private supperSubscriptions = new Subscription();

  public NewVendorID(): void {
    this.submitted = false;
    this.VendorForm.reset();
    this.supperSubscriptions.add(this.vendorService.GetVendorID().subscribe(
      data => this.VendorForm.get('VID').patchValue(data)
    ));
    // this.VendorForm.get('VID').patchValue('V0009');
    this.myfield.nativeElement.focus();
    this.caption = 'Save';
  }

  ngOnDestroy(){
    this.supperSubscriptions.unsubscribe();
  }
  
  public Cancel() {
    this.VendorForm.reset();
    this.submitted = false;
    if (this.caption === 'Save') {
      this.caption = 'New';
    }
  }

  public onfocus(form: FormGroup) {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  public Save(): void {
    this.onfocus(this.VendorForm);
    
    this.submitted = true;
    if (!this.VendorForm.valid) {
      return;
    }
    this.vendorService.SaveVendor(this.VendorForm.value).subscribe(
      (response: any) => {
        if (response == null) {
          this.resetForm();
          this.toastr.success('New Vendor Created!', 'Vendor Successful.');
          this.submitted = false;
          // this.caption = 'New';
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicatePID':
                this.toastr.error('Vendor is already taken', 'Vendor failed.');
                break;

              default:
                this.toastr.error(element.description, 'Vendor failed.', {
                  timeOut: 3000
                });
                break;
            }

          });
        }
      },
      err => {
        console.log(err);
      },
      () => {
        this.caption = 'New';
      }
    );
  }

  OpenDeleteModel() {
    const initialState = {
      title: 'Vendor Information',
      label: 'Vendor ID',
      ControlName: 'VID',
      items: 'Vendor',
      Action: 'Delete',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(SearchComponent, {initialState});
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered', initialState }));
    this.bsModalRef.content.okBtnName = 'Delete';
  }

  OpenSearchModel() {
    const initialState = {
      title: 'Vendor Information',
      label: 'Vendor ID',
      ControlName: 'VID',
      Action: 'Search',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(SearchComponent, {initialState});
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable', initialState }));
    this.bsModalRef.content.okBtnName = 'Search';
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

  public GetClass(caption: string) {
    var classList = '';
    if (caption === 'Search') {
      classList = 'fa fa-search';
    } else if (caption === 'Delete') {
      classList = 'fa fa-trash';
    }
    return classList;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
