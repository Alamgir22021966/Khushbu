import { SearchComponent } from '@/modals/search/search.component';
import { ItemList } from '@/Models/item-info.model';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemInfoService } from '@services/item-info.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-iteminfo',
  templateUrl: './iteminfo.component.html',
  styleUrls: ['./iteminfo.component.scss']
})
export class IteminfoComponent implements OnInit {

  @ViewChild('AutoFocus') myfield: ElementRef<HTMLInputElement>;
  ItemInfoForm: FormGroup;
  submitted = false;
  ItemDetailsForm: FormGroup;
  public Categories = [];
  public SubCategories = [];
  public ItemList: ItemList[];
  broadCast: string;
  bsModalRef: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private itemInfoService: ItemInfoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private interactivityChecker: InteractivityChecker,
    private currencyPipe: CurrencyPipe,
    private bsModalService: BsModalService,
  ) {
    this.CreateItemInfoForm();

  }


  CreateItemInfoForm() {

    let arr = [];
    for (let i = 0; i < 35; i++) {
      arr.push(this.BuildFormDynamic())

    }

    this.ItemInfoForm = this.fb.group({
      ItemCategory: this.fb.group({
        CategoryID: ['', [Validators.required]],
        SubCategoryID: ['', [Validators.required]],
      }),

      ItemInfo: this.fb.array(arr) as FormArray,

    });

  }

  BuildFormDynamic(): FormGroup {
    return this.fb.group({
      ItemID: [''],
      ProductName: [''],
      RetailPrice: [''],
      MinStock: [''],
    });
  }


  ngOnInit() {
    this.GetCategory();
  }

  ngAfterViewInit(): void {
    this.myfield.nativeElement.focus();
  }

  get f() { return this.ItemInfoForm.controls['ItemCategory']; }

  get ItemInfo() {
    return this.ItemInfoForm.controls['ItemInfo'] as FormArray;
  }

  public Save(): void {
    this.submitted = true;
    if (!this.ItemInfoForm.valid) {
      return;
    }

    this.DeleteItems(this.ItemInfoForm.controls['ItemCategory'].get('CategoryID').value, this.ItemInfoForm.controls['ItemCategory'].get('SubCategoryID').value);

    this.itemInfoService.SaveItem(this.ItemInfoForm.value).subscribe(
      (response: any) => {
        if (response === null) {
          // this.ItemInfoForm.reset();
          this.toastr.success('New Item Created!', 'Item Successful.');
          this.submitted = false;
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicatePID':
                this.toastr.error('Item is already taken', 'Item failed.');
                break;

              default:
                this.toastr.error(element.description, 'Item failed.', {
                  timeOut: 3000
                });
                break;
            }

          });
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  public Cancel() {
    this.ItemInfo.reset();
  }

  public DeleteOneItem1(CategoryID: any, SubCategoryID: any, index: any): void {
    this.ItemInfo.removeAt(index);
    this.ItemInfo.push(this.BuildFormDynamic());
    this.DeleteItems(CategoryID, SubCategoryID)
  }

  public DeleteOneItem(index: any): void {
    this.ItemInfo.removeAt(index);
    this.ItemInfo.push(this.BuildFormDynamic());

  }

  public DeleteItems(CategoryID: any, SubCategoryID: any): void {
    if (CategoryID && SubCategoryID) {
      this.itemInfoService.DeleteItems(CategoryID, SubCategoryID).subscribe(res => {
        if (res == null) {

        }
      });
    }
  }

  public GetCategory(): void {

    this.itemInfoService.GetCategory().subscribe(
      data => this.Categories = data

    );

  }

  public GetSubCategory(CategoryID: any): void {

    if (CategoryID) {
      this.itemInfoService.GetSubCategory(CategoryID).subscribe(
        data => { this.SubCategories = data; }

      );
    }
    else {
      this.SubCategories = null;
    }

  }

  resetItemInfo() {
    const control = <FormArray>this.ItemInfoForm.controls['ItemInfo'];
    for (let i = 0; i < 25; i++) {
      control.at(+i).get('ItemID').setValue('');
      control.at(+i).get('ProductName').setValue('');
      control.at(+i).get('RetailPrice').setValue('');
      control.at(+i).get('MinStock').setValue('');
    }
  }

  public GetItemList(CategoryID?: any, SubCategoryID?: any): void {

    const control = <FormArray>this.ItemInfoForm.controls['ItemInfo'];
    this.resetItemInfo();
    if (CategoryID && SubCategoryID) {
      this.itemInfoService.GetItemList(CategoryID, SubCategoryID).subscribe(
        data => {
          this.ItemList = data;

          if (this.ItemList.length > 0) {
            for (let i = 0; i < this.ItemList.length; i++) {
              control.at(+i).get('ItemID').setValue(this.ItemList[i].ItemID);
              control.at(+i).get('ProductName').setValue(this.ItemList[i].ProductName);
              control.at(+i).get('RetailPrice').setValue(this.ItemList[i].RetailPrice);
              control.at(+i).get('MinStock').setValue(this.ItemList[i].MinStock);
            }
          }
        }

      );
    }
    else {
      this.ItemList = null;
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

}
