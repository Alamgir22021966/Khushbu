import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  constructor(private el: ElementRef) { }

  @Input('appFocus') formGroup: NgForm;

  @HostListener('submit', ['$event'])
  public onSubmit(event:any): void {
    if ('INVALID' === this.formGroup.status) {
      event.preventDefault();

      const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
      (<HTMLInputElement>formGroupInvalid[0]).focus();
    }
  }



 

}
