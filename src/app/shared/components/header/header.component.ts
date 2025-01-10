import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [TranslateModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  translate: TranslateService = inject(TranslateService);
  imageUrl = environment.config.imageUrl;

  user = {
    name: "Phạm Tấn Thuận",
    avatar: "http://localhost:4200/avatar.jpg"
  };

  items = [
    {
      name: "Skills",
      icon: "fas fa-book-dead",
      link: '/skill'
    },
    {
      name: "Projects",
      icon: "fas fa-project-diagram",
      link: '/project'
    },
    {
      name: "Experience",
      icon: "fas fa-tasks",
      link: '/experience'
    },
    {
      name: "Education",
      icon: "fas fa-university",
      link: '/education'
    },
    {
      name: "Achievements",
      icon: "fas fa-trophy",
      link: '/achievement'
    },
    {
      name: "Resume",
      icon: "fas fa-address-card",
      link: '/resume'
    },
  ];

  translateText(lang: string) {
    this.translate.use(lang);
  }

}
