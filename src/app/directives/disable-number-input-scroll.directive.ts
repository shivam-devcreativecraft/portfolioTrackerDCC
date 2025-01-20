import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableNumberInputScroll]'
})
export class DisableNumberInputScrollDirective {

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.tagName === 'INPUT' && target.getAttribute('type') === 'number') {
      // Prevent default behavior only if it's a number input
      event.preventDefault();
    }
  }
}


// to use this directive, use 'appDisableNumberInputScroll' in input field that is of type=number