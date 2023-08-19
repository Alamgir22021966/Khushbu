import { UserModel } from '@/Models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EditUserComponent } from './edit-user.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  UserListForm: FormGroup;
  public userList: UserList[] = [];
  public user: UserModel;
  bsModalRef: BsModalRef;
  public Users: Observable<Array<any>>;
  public AllUsers: Observable<Array<any>>;

  public placeholder: string = 'Enter Search String';
  public keyword = 'Name';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private router: Router,
  ) {
    this.CreateUserListForm();
  }

  CreateUserListForm(): void {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      arr.push(this.ListForm());
    }
    this.UserListForm = this.fb.group({
      User: this.fb.group({
        UID: ['']
      }),
      UserList: this.fb.array(arr) as FormArray,
    });

  }

  ListForm(): FormGroup {
    return this.fb.group({
      UID: [''],
      FirstName: [''],
      LastName: [''],
      Email: [''],
      Password: ['']
    });
  }

  get User(): any { return this.UserListForm.get('User'); }

  get UserList(): any {
    return this.UserListForm.get('UserList') as FormArray;
  }

  ngOnInit() {
    this.GetUserList();
    this.AllUsers = this.userService.GetAllUser();

    this.UserListForm.valueChanges.subscribe(
      () => {
        this.GetUserList();
      });

  }

  public GetUserList(): void {

    this.userService.GetUserList().subscribe(
      data => {
        this.userList = data;

      },
      (err: any) => {
        console.log(err);
      });

  }

  selectEvent(item: any) {
    this.UserList.reset();
    for (let j = this.UserList.length; j >= 15; j--) {
      this.UserList.removeAt(j);
    }

    this.userService.GetUser(item.Value).subscribe(
      data => {
        console.log(data.length);
        if (data.length > 0) {
          const controls = this.UserListForm.controls['UserList'] as FormArray;
          for (let i = 0; i < data.length; i++) {
            controls.at(+i).get('UID').setValue(data[i].UID);
            controls.at(+i).get('FirstName').setValue(data[i].FirstName);
            controls.at(+i).get('FullName').setValue(data[i].FullName);
            controls.at(+i).get('Email').setValue(data[i].Email);
            controls.at(+i).get('Password').setValue(data[i].Password);

            if (i >= 14 && i < this.UserList.length - 1) {
              this.UserList.push(this.ListForm());
            }
          }
        }
      }
    );

  }

  public Delete(index: any, UID: any): void {
    if (UID) {
      if (confirm('Are you sure to delete this record')) {
        this.userService.Delete(UID).subscribe(res => {
          if (res == null) {
            this.toastr.warning("Deleted Successfully", "User Information");
          }
        },
          (err: any) => {
            console.log(err);
          });
      }
    }
    this.GetUserList();

  }

  openModal(index: any, UID: any) {
    this.userService.GetUser(UID).subscribe((data: any[]) => {
      const initialState = {
        title: 'User Information',
        data: data,
        ignoreBackdropClick: true,
        animated: true,
        keyboard: true
      };

      this.bsModalRef = this.bsModalService.show(EditUserComponent, Object.assign({}, { class: 'modal-md', initialState }));

      this.bsModalRef.content.action.subscribe((data: any) => {

        const controls = <FormArray>this.UserListForm.controls['UserList'];
        for (let i = 0; i < controls.length; i++) {
          if (index === i) {
            controls.at(+i).get('UID').setValue(data.UID);
            controls.at(+i).get('FirstName').setValue(data.FirstName);
            controls.at(+i).get('FullName').setValue(data.FullName);
            controls.at(+i).get('Email').setValue(data.Email);
            controls.at(+i).get('Password').setValue(data.Password);

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

    this.router.navigateByUrl('/home/adminpanel/Newuser');
  }

  onChangeSearch(val: string) {

  }


  // we can get parameters from url in angular on this way:

  GetParameterS(){

    // let id = this.route.snapshot.params.id;
    // console.log(id);

    
    // this.route.paramMap.subscribe(params => {
    //   var id = params.get('id');
    //   console.log(id);
    // });

  }

}

interface UserList {
  UID: string,
  FirstName: string,
  LastName: string,
  FullName: string,
  Email: string,
  Password: string
}