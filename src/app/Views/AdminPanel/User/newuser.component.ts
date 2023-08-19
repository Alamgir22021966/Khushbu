import { MustMatch } from '@/Helpers/must-match.validator';
import { SearchComponent } from '@/modals/search/search.component';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})
export class NewuserComponent implements OnInit {

  @ViewChild('autofocus') myfield: ElementRef<HTMLInputElement>;
  datePickerConfig: Partial<BsDatepickerConfig>;

  userForm: FormGroup;

  submitted = false;
  errorMessage: any;
  showLoadingIndicator = true;
  bsModalRef: BsModalRef;
  public caption: string = 'New';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private interactivityChecker: InteractivityChecker,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private el: ElementRef
  ) {
    this.CreateRegistrationForm();

    this.datePickerConfig = Object.assign({}, {
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      todayHighlight: true

    });

  }


  CreateRegistrationForm() {
    this.userForm = this.fb.group({
      UID: [''],
      FirstName: ['', Validators.required],
      LastName: [''],
      Email: ['', [Validators.email]],
      //Email: ['', [Validators.required,Validators.email]],
      // dateOfBirth: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      ConfirmPassword: ['', Validators.required]

    },
      {
        validator: MustMatch('Password', 'ConfirmPassword')
      }
    );
  }

  get f() { return this.userForm.controls; }

  ngOnInit() {
  }

  public ChangeData(): void {
    if (this.caption === 'New') {
      this.NewUserID();
    }
    else if (this.caption === 'Save') {
      this.Save();
    }
  }

  public NewUserID(): void {
    this.submitted = false;
    this.userForm.reset();

    this.userService.GetUID().subscribe(
      data => this.userForm.get('UID').patchValue(data)
    );
    this.myfield.nativeElement.focus();
    this.caption = 'Save';
  }

  public Cancel() {
    this.userForm.reset();
    this.submitted = false;
    if(this.caption === 'Save'){
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

    this.onfocus(this.userForm);
    this.submitted = true;
    if (!this.userForm.valid) {
      return;
    }
    this.userService.Save(this.userForm.value).subscribe(
      (response: any) => {
        if (response == null) {
          this.submitted = false;
          this.userForm.reset();

          this.toastr.success('New User Created!', 'Registration Successful.');
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'Duplicatefirstname':
                this.toastr.error('UserName is already taken', 'Registration failed.');
                break;

              default:
                this.toastr.error(element.description, 'Registration failed.', {
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
      () =>{
        this.caption = 'New';
      }
    );

  }

  OpenDeleteModel() {
    const initialState = {
      title: 'User Information',
      label: 'User ID',
      ControlName: 'UID',
      items: 'User',
      Action: 'Delete',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

    this.bsModalRef = this.bsModalService.show(SearchComponent, Object.assign({}, { class: 'modal-dialog modal-dialog-centered', initialState }));
    this.bsModalRef.content.okBtnName = 'Delete';
  }

  OpenSearchModel() {
    const initialState = {
      title: 'User Information',
      label: 'User ID',
      ControlName: 'UID',
      Action: 'Search',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false
    };

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
  

}
