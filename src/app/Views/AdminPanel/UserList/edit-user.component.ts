import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  UserEditForm: FormGroup;
  submitted = false;

  @Input() public title: string;
  @Input() data: any[] = [];
  // @Input() dataForm: FormGroup;
  public userList: User[] = [];
  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
    private fb: FormBuilder,  
    private toastr: ToastrService,
    private userService: UserService) {
    this.CreateUserForm();
   }

  ngOnInit() {
    this.UserEditForm.setValue(this.data);
    this.GetUserList();
  }

  CreateUserForm() {
    this.UserEditForm = this.fb.group({
      UID: [''],
      FirstName: [''],
      LastName: [''],
      FullName: [''],
      Email: [''],
      Password: [''],
     });
  }


  public ClickOk(): void {
    this.bsModalRef.hide();

  }

  get f() { return this.UserEditForm.controls;}

  public Save(): void{ 
    this.submitted = true; 
    if (!this.UserEditForm.valid) {  
        return;  
    }   
    this.userService.Save(this.UserEditForm.value).subscribe(
        (response: any) => {
          if(response == null){
            this.submitted = false;
            this.bsModalRef.hide();
            this.toastr.success('Update User!','Update User Successfully.');
            this.action.emit(this.UserEditForm.value);
          } 
        },  
        (err: any) => {
          console.log(err);
        },
        ()=>{
          // this.GetUserList();
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

}

interface User{
  UID: string, 
  FirstName: string, 
  LastName: string, 
  FullName: string, 
  Email: string, 
  Password: string
}