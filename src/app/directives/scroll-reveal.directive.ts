import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    // 1. Add the initial 'hidden' class immediately
    this.renderer.addClass(this.el.nativeElement, 'reveal-hidden');

    // 2. Set up the Intersection Observer
    const options = {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px', // offset slightly so it doesn't trigger too early
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 3. Add 'visible' class when in view
          this.renderer.addClass(this.el.nativeElement, 'reveal-visible');

          // Optional: Stop observing once revealed (performance)
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
