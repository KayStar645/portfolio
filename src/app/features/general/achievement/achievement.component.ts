import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Achievement, AchievementsService } from '../../../services/achievement.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-achievement',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementComponent {
  private readonly achievementsService = inject(AchievementsService);
  readonly achievements$ = this.achievementsService.achievements$;
  trackByAchievement(_index: number, item: Achievement): string { return item.id; }
}
