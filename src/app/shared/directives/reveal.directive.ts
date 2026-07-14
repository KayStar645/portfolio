import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  @Input('revealDelay') revealDelay = 0;

  ngAfterViewInit(): void {
    const node = this.element.nativeElement;
    node.classList.add('reveal');
    node.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      node.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        node.classList.add('is-visible');
        this.observer?.disconnect();
      }
    }, { threshold: 0.12 });
    this.observer.observe(node);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
