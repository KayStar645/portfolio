import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { User, UserService } from '../../../services/user.service';
import { Menu, MenusService } from '../../../services/menus.service';
import { LangService } from '../../services/lang.service';
import { ThemeService } from '../../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  user: User | null = null;
  menus: Menu[] = [];
  currentLang: string = '';
  currentTheme: string = '';
  isMenuVisible: boolean = false;

  constructor(
    private router: Router,
    private langService: LangService,
    private themeService: ThemeService,
    private menusService: MenusService,
    private userService: UserService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.currentLang = this.langService.getLang();
      this.currentTheme = this.themeService.getCurrentTheme();
      this.userService.user$.subscribe(user => {
        this.user = user;
      });
      this.menusService.menus$.subscribe(menus => {
        this.menus = menus;
      });
    } catch (error) {
      this.user = null;
      this.menus = [];
    }
  }

  switchLanguage(): void {
    let lang = this.currentLang == 'en-US' ? 'vi-VN' : 'en-US';
    this.langService.setLang(lang);
    this.currentLang = this.langService.getLang();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  isActiveRoute(link: string | undefined): boolean {
    if (!link) return false;
    return this.router.url === link || this.router.url.startsWith(link + '/');
  }
}
