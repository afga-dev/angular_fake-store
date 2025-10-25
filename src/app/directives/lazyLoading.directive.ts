import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyLoading]',
  standalone: true,
})
export class LazyLoadingDirective implements OnInit {
  @Input() appLazyLoading!: string;

  private intersectionObserver?: IntersectionObserver;

  constructor(
    private element: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const image = this.element.nativeElement;

    this.renderer.addClass(image, 'loading');

    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(image);
            this.intersectionObserver?.unobserve(image);
          }
        });
      });
      this.intersectionObserver.observe(image);
    } else {
      this.loadImage(image);
    }
  }

  private loadImage(image: HTMLImageElement): void {
    this.renderer.addClass(image, 'loading');

    const temporal = new Image();
    temporal.src = this.appLazyLoading;
    temporal.onload = () => {
      this.renderer.setAttribute(image, 'src', this.appLazyLoading);
      this.renderer.removeClass(image, 'loading');
      this.renderer.addClass(image, 'loaded');
    };
  }
}
