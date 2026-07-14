import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Experience, ExperiencesService } from '../../../services/experience.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [CommonModule, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  private readonly experiencesService = inject(ExperiencesService);

  readonly experiences$ = this.experiencesService.experiences$;

  trackByExperience(_index: number, experience: Experience): number {
    return experience.id;
  }

  trackByText(_index: number, value: string): string {
    return value;
  }
}
