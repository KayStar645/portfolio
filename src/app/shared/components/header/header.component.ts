import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from './services/user.service';
import { Menu, MenusService } from './services/menus.service';
import { LangService } from '../../../lang.service';

@Component({
  selector: 'app-header',
  imports: [
    TranslateModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  menus: Menu[] = [];

  constructor(
    private langService: LangService,
    private menusService: MenusService,
    private userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.loadData();
    } catch (error) {
      console.error('Error initializing HeaderComponent:', error);
      this.user = null;
      this.menus = [];
    }
  }

  async loadData(): Promise<void> {
    this.user = await this.userService.getItem();
    this.menus = await this.menusService.getItems();
  }

  translateText(lang: string): void {
    console.log(lang)
    this.langService.setLang(lang);
    this.loadData();
  }
}
