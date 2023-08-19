import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[NumberOnly]'
})
export class NumberOnlyDirective {

  private regex: RegExp = new RegExp(/^[0-9]+([0-9]*){0,1}$/g);

  private specialKeys: Array<string> = [ 'Backspace', 'Delete', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft', '-' ];

  constructor(private elementRef: ElementRef, private renderer: Renderer2,) {
  }

  @HostListener('keydown', [ '$event' ]) onKeyDown(event: KeyboardEvent) {
      if (this.specialKeys.indexOf(event.key) !== -1) {
          return;
      }

      let current: string = this.elementRef.nativeElement.value;

      let next: string = current.concat(event.key);
      if (next && !String(next).match(this.regex)) {
          event.preventDefault();
      }
  }



}
