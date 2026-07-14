import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { IconComponent } from '../icon/icon.component';
import { LangService } from '../../services/lang.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, RouterLinkActive, TranslateModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly langService = inject(LangService);
  private readonly themeService = inject(ThemeService);
  private readonly userService = inject(UserService);

  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('mobileDrawer') mobileDrawer?: ElementRef<HTMLElement>;

  readonly user$ = this.userService.user$;
  currentLang = this.langService.getLang();
  currentTheme = this.themeService.getCurrentTheme();
  isMenuVisible = false;
  readingProgress = 0;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeMenu(false));
    this.destroyRef.onDestroy(() => document.body.classList.remove('menu-open'));
  }

  readonly links = [
    { label: 'nav.work', route: '/project' },
    { label: 'nav.experience', route: '/experience' },
    { label: 'nav.expertise', route: '/skill' },
    { label: 'nav.resume', route: '/resume' },
  ];

  switchLanguage(): void {
    this.langService.setLang(this.currentLang === 'en-US' ? 'vi-VN' : 'en-US');
    this.currentLang = this.langService.getLang();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  toggleMenu(): void {
    this.isMenuVisible ? this.closeMenu(true) : this.openMenu();
  }

  openMenu(): void {
    this.isMenuVisible = true;
    document.body.classList.add('menu-open');
    setTimeout(() => document.querySelector<HTMLElement>('#mobile-navigation a')?.focus());
  }

  closeMenu(restoreFocus = true): void {
    if (!this.isMenuVisible) return;
    this.isMenuVisible = false;
    document.body.classList.remove('menu-open');
    if (restoreFocus) queueMicrotask(() => this.menuButton?.nativeElement.focus());
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') { this.closeMenu(true); return; }
    if (event.key !== 'Tab' || !this.isMenuVisible || !this.mobileDrawer) return;
    const focusable = Array.from(this.mobileDrawer.nativeElement.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.router.url.startsWith('/project/')) {
      this.readingProgress = 0;
      return;
    }
    const available = document.documentElement.scrollHeight - innerHeight;
    this.readingProgress = available > 0 ? Math.min(100, Math.max(0, scrollY / available * 100)) : 0;
  }
}
