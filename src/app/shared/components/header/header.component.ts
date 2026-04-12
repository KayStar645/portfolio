import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MenusService } from '../../../services/menus.service';
import { UserService } from '../../../services/user.service';
import { LangService } from '../../services/lang.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0)', opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)', opacity: 0 }),
        ),
      ]),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateY(0)', opacity: 1 }),
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly langService = inject(LangService);
  private readonly themeService = inject(ThemeService);
  private readonly menusService = inject(MenusService);
  private readonly userService = inject(UserService);

  readonly translate = inject(TranslateService);
  readonly user$ = this.userService.user$;
  readonly menus$ = this.menusService.menus$;

  currentLang = this.langService.getLang();
  currentTheme = this.themeService.getCurrentTheme();
  isMenuVisible = false;

  switchLanguage(): void {
    const lang = this.currentLang === 'en-US' ? 'vi-VN' : 'en-US';
    this.langService.setLang(lang);
    this.currentLang = this.langService.getLang();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  isActiveRoute(link: string | undefined): boolean {
    if (!link) return false;
    return this.router.url === link || this.router.url.startsWith(`${link}/`);
  }
}
