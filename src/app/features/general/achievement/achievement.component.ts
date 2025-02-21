import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Achievement, AchievementsService } from './../../../services/achievement.service';

@Component({
  selector: 'app-achievement',
  imports: [
    TranslateModule,
  ],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  achievements: Achievement[] = [];

    constructor(
      private achievementsService: AchievementsService,
    ) { }

    async ngOnInit(): Promise<void> {
      try {
        this.achievementsService.achievements$.subscribe(achievements => {
          this.achievements = achievements;
        });
      } catch (error) {
      }
    }

}
