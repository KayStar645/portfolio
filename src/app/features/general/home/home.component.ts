import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { Home, HomeService } from '../../../services/home.service';
import { Skill, SkillService } from '../../../services/skill.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
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
      this.user = await this.userService.getItem();
      this.home = await this.homeService.getItem();
      this.skills = await this.skillService.getItems();
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
          slidesPerView: 1,
        },
        450: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
      },
    };

    Object.assign(this.swiper.nativeElement, swiperParams);
    this.swiper.nativeElement.initialize();
  }

}
