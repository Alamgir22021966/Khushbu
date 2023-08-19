
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { invalidNumber: { valid: false, value: control.value } };
}



export function ageRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && (isNaN(control.value) || control.value < 18 || control.value > 45)) {
        return { 'ageRange': true };
    }
    return null;
}


export function ageRangeValidator1(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
            return { 'ageRange': true };
        }
        return null;
    };
}


export function ValidateEmail(control:AbstractControl):{[key:string]:Boolean}|null{  
      
    let regularExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;  
      
        if(control.value!==undefined && !regularExp.test(control.value)){  
          return {"isValidEmail":true};  
        }  
        return null;  
} 


export function ValidateUrl(control: AbstractControl) {
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
        return { validUrl: true };
    }
    return null;
}