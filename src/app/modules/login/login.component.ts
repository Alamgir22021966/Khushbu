import {
    Component,
    OnInit,
    Renderer2,
    HostBinding,
    ElementRef,
    HostListener
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { SharedService } from '@/Shared/shared.service';
import { first } from 'rxjs/operators';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { HttpStatusCode } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @HostBinding('class') class = 'login-box';
    public loginForm: FormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private loginservice: LoginService,
        private sharedService: SharedService,
        private elementRef: ElementRef,
        private interactivityChecker: InteractivityChecker,
        private router: Router
    ) {
        this.createloginForm();
    }

    createloginForm(): void {
        this.loginForm = this.fb.group({
            FirstName: ['', Validators.required],
            Password: ['', Validators.required],
        });
    }

    get f() { return this.loginForm.controls; }

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }

    myOptions = {
        'placement': 'right',
        'showDelay': 500,
        'hideDelay': 100,
        'theme': 'light',
        'zIndex': 1,
        'maxWidth': 400,
        // 'tooltipClass': 'ngTemplateTips'
    }

    public async onSubmit1() {
        this.sharedService.onfocus(this.loginForm, this.elementRef);
        this.submitted = true;
        if (!this.loginForm.valid) {
            return;
        }
        (await this.loginservice.GetLogin(this.loginForm.value)).subscribe({
            next: () => {
                this.submitted = false;
                // this.router.navigate(['/home/dashboard']);
            },
            error: (err: any) => {
                console.log(err);
                if (err.status === HttpStatusCode.Unauthorized || err.statusTest === 'OK') {
                    this.toastr.error('Incorrect user name or password.', 'Authentication failed.', {
                        timeOut: 2000
                    });
                }
            },
            complete: () => {
                this.router.navigate(['/home/dashboard']);
            }
        });
    }

    public async onSubmit() {
        await this.appService.loginByAuth();
    }

    @HostListener('window:keyup', ['$event']) keyevent(event: any) {
        event.preventDefault();
        const inputs = Array.prototype.slice.call(document.querySelectorAll('input, button'));
        // const inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
        const controls = [];
        if (Array.isArray(controls) && !controls.length) {
            for (let i = 0; i < inputs.length; i++) {
                if (this.interactivityChecker.isFocusable(inputs[i])) {
                    controls.push(inputs[i]);
                    //   if (inputs[i].id !== 'Signin') {
                    //     controls.push(inputs[i]);
                    //   }
                }
            }
        }

        if (event.keyCode === 13 || event.keyCode === 40) {
            const control = controls[controls.indexOf(document.activeElement) + 1];
            if (control) {
                control.focus();
                // control.select();
            }
        } else if (event.keyCode === 38) {
            const control = controls[controls.indexOf(document.activeElement) - 1];
            if (control) {
                control.focus();
                // control.select();
            }
        }

    }


}

