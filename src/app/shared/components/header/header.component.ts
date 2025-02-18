import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { Menu, MenusService } from '../../../services/menus.service';
import { LangService } from '../../services/lang.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  user: User | null = null;
  menus: Menu[] = [];
  currentLang: string = '';
  currentTheme: string = '';
  isMenuVisible: boolean = false;

  constructor(
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
}
