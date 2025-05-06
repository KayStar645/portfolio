import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Achievement, AchievementsService } from './../../../services/achievement.service';

@Component({
  selector: 'app-achievement',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  achievements: Achievement[] = [];

  groupedAchievements: { type: string, items: Achievement[] }[] = [];

  constructor(private achievementsService: AchievementsService) {}

  ngOnInit(): void {
    this.achievementsService.achievements$.subscribe(achievements => {
      this.achievements = achievements;

      const groups: { [key: string]: Achievement[] } = {};
      for (const item of achievements) {
        if (!groups[item.type]) groups[item.type] = [];
        groups[item.type].push(item);
      }

      this.groupedAchievements = Object.entries(groups).map(([type, items]) => ({
        type,
        items
      }));
    });
  }
}
