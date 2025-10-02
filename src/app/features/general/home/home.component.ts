import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { User, UserService } from '../../../services/user.service';
import { Home, HomeService } from '../../../services/home.service';
import { Skill, SkillService } from '../../../services/skill.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<any>;
  user: User | null = null;
  home: Home | null = null;
  skills: Skill[] = [];

  constructor(
    private userService: UserService,
    private homeService: HomeService,
    private skillService: SkillService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.userService.user$.subscribe(user => {
        this.user = user;
      });
      this.homeService.home$.subscribe(home => {
        this.home = home;
      });
      this.skills = await this.skillService.getItems(true);
    } catch (error) {
      this.user = null;
      this.home = null;
      this.skills = [];
    }
  }

  ngAfterViewInit() {
    const swiperParams = {
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        576: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 25,
        },
        1200: {
          slidesPerView: 6,
          spaceBetween: 30,
        },
      },
    };

    Object.assign(this.swiper.nativeElement, swiperParams);
    this.swiper.nativeElement.initialize();
  }

}
