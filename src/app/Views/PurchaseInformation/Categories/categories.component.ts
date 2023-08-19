import { SearchComponent } from '@/modals/search/search.component';
import { CategoryModel, SubCategoryList } from '@/Models/category.model';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BSserviceService } from '@services/bsservice.service';
import { CategoryService } from '@services/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @ViewChild('AutoFocus') myfield: ElementRef<HTMLInputElement>;
  submitted = false;
  CategoryForm: FormGroup;
  bsModalRef: BsModalRef;
  public CategoryList: CategoryModel;
  public SubCategoryList: SubCategoryList[];
  // public cty: CategoryModel;

  public caption: string = 'New';

  broadCast: string;


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private interactivityChecker: InteractivityChecker,
    private bsModalService: BsModalService,
    private bsservice: BSserviceService,

  ) {
    this.CreateCategoryForm();
    //this.items = "Category";
  }

  CreateCategoryForm() {
    let arr = [];
    for (let i = 0; i < 150; i++) {
      arr.push(this.BuildFormDynamic())

    }

    /* Main form group*/

    this.CategoryForm = this.fb.group({
      Categories: this.fb.group({
        CategoryID: ['', [Validators.required, Validators.minLength(3)]],
        Category: ['', Validators.required],

      }),

      SubCategories: this.fb.array(arr) as FormArray,

    });

  }

  /* Subform form group*/

  BuildFormDynamic(): FormGroup {
    return this.fb.group({
      SubCategoryID: [''],
      SubCategory: [''],

    });
  }

  resetForm() {
    this.CategoryForm.reset();
  }

  ngOnInit() {

    //  this.CategoryForm.controls['CategoryModel'].get('CategoryID').valueChanges.subscribe(
    //   (val: any) => {
    //     this.SearchCategory(val);

    //    });
    this.bsservice.broadCast.subscribe(broadcast => this.broadCast = broadcast)

    // this.errorHandler.handleErrors(this.CategoryForm, this.errors);

  }

  get f() { return this.CategoryForm.controls; }
  get Categories() { return this.CategoryForm.get('Categories'); }

  get SubCategories() {
    return this.CategoryForm.get('SubCategories') as FormArray;
  }

  public Save(): void {
    this.submitted = true;
    if (!this.CategoryForm.valid) {
      return;
    }
    this.categoryService.Save(this.CategoryForm.value).subscribe(
      (response: any) => {
        if (response == null) {
          this.resetForm();
          this.toastr.success('New Category Created!', 'Category Successful.');
          this.submitted = false;
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicatePID':
                this.toastr.error('Category is already taken', 'Category failed.');
                break;

              default:
                this.toastr.error(element.description, 'Category failed.', {
                  timeOut: 2000
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

  public DeleteOneItem(index): void {
    this.SubCategories.removeAt(index);
    this.SubCategories.push(this.BuildFormDynamic());

  }

  public NewCategoryID(): void {
    this.CategoryForm.reset();
    // this.categoryService.GetCategoryID().subscribe(
    //   data => this.CategoryForm.controls['Categories'].get('CategoryID').patchValue(data)
    // );


    this.CategoryForm.controls['Categories'].get('CategoryID').patchValue('C0009');
    // this.Categories.get('CategoryID').patchValue('C0009');
    // (<any>this.CategoryForm.controls['Categories'].get('Category')).nativeElement.focus();
    this.myfield.nativeElement.focus();

  }


  public Cancel() {
    // this.SubCategories.reset();
    this.CategoryForm.reset();
    if (this.caption === 'Save') {
      this.caption = 'New';
    }
  }


  public changeData(): void {
    if (this.caption === 'New') {
      this.NewCategoryID();
      this.caption = 'Save';
    }
    else if (this.caption === 'Save') {
      this.caption = 'New';
      this.Save();
    }
  }

  public getClass(caption: any) {
    var classList = '';
    if (this.caption === 'New') {
      classList = 'fa fa-plus';
    } else if (this.caption === 'Save') {
      classList = 'fa fa-save';
    }
    return classList;
  }

  OpenDeleteModel() {

    const initialState = {
      title: 'Category Information',
      label: 'Category ID',
      ControlName: 'CategoryID',
      items: 'Category',
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

  OpenSearchModel() {

    const initialState = {
      title: 'Category Information',
      label: 'Category ID',
      ControlName: 'CategoryID',
      Action: 'Search',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    // this.bsModalRef = this.bsModalService.show(SearchComponent, { initialState });
    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable', initialState }));
    this.bsModalRef.content.okBtnName = 'Search';

  }

  resetSubCategory() {
    const control = <FormArray>this.CategoryForm.controls['SubCategories'];
    for (let i = 0; i < 35; i++) {
      control.at(+i).get('SubCategoryID').setValue('');
      control.at(+i).get('SubCategory').setValue('');
    }

  }

  public SearchCategory(Categoryid: any) {
    if (Categoryid) {
      const control = this.CategoryForm.controls['Categories'];

      this.categoryService.GetCategory(Categoryid).subscribe(
        data => {
          this.CategoryList = data;
          control.get('CategoryID').setValue(this.CategoryList.CategoryID);
          control.get('Category').setValue(this.CategoryList.Category);
        });

      const controls = <FormArray>this.CategoryForm.controls['SubCategories'];
      // this.resetSubCategory();
      this.SubCategories.reset;
      this.categoryService.Getsubcategorylist(Categoryid).subscribe(
        res => {
          this.SubCategoryList = res;
          if (this.SubCategoryList.length > 0) {
            for (let i = 0; i < this.SubCategoryList.length; i++) {

              controls.at(+i).get('SubCategoryID').patchValue(this.SubCategoryList[i].SubCategoryID);
              controls.at(+i).get('SubCategory').patchValue(this.SubCategoryList[i].SubCategory);
            }
          }
        });
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
